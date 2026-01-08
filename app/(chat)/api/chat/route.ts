import { geolocation } from "@vercel/functions";
import {
	convertToModelMessages,
	createUIMessageStream,
	JsonToSseTransformStream,
	smoothStream,
	stepCountIs,
	streamText,
} from "ai";
import { unstable_cache as cache } from "next/cache";
import { after } from "next/server";
import {
	createResumableStreamContext,
	type ResumableStreamContext,
} from "resumable-stream";
import type { ModelCatalog } from "tokenlens/core";
import { fetchModels } from "tokenlens/fetch";
import { getUsage } from "tokenlens/helpers";
import { createClient } from "@/lib/supabase/server";
import { type UserType } from "@/lib/ai/entitlements";
import type { VisibilityType } from "@/components/visibility-selector";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { getKnowledgeBaseContent } from "@/lib/ai/knowledge-base";
import type { ChatModel } from "@/lib/ai/models";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { webSearch } from "@/lib/ai/tools/web-search";
import { classifyTopic } from "@/lib/ai/topic-classifier";
import { isProductionEnvironment } from "@/lib/constants";
import {
	createStreamId,
	deleteChatById,
	ensureUserExists,
	getChatById,
	getMessageCountByUserId,
	getMessagesByChatId,
	saveChat,
	saveMessages,
	updateChatLastContextById,
	updateChatPinStatus,
	updateChatTitle,
	updateChatTopic,
} from "@/lib/db/queries";
import type { Json } from "@/lib/supabase/types";
import { ChatSDKError } from "@/lib/errors";
import {
	checkRateLimit,
	getRateLimitHeaders,
} from "@/lib/security/rate-limiter";
import type { ChatMessage } from "@/lib/types";
import type { AppUsage } from "@/lib/usage";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

// Maximum number of messages to keep in context (prevents context overflow)
// Keeps first message + last N messages for continuity
// Increased from 40 to 60 for longer conversations
const MAX_CONTEXT_MESSAGES = 60;

/**
 * Truncates message history to prevent context window overflow.
 * Keeps first message (for context) + most recent messages.
 */
function truncateMessageHistory<T>(messages: T[]): T[] {
	if (messages.length <= MAX_CONTEXT_MESSAGES) {
		return messages;
	}

	// Keep first message + last (MAX - 1) messages
	const firstMessage = messages[0];
	const recentMessages = messages.slice(-(MAX_CONTEXT_MESSAGES - 1));

	return [firstMessage, ...recentMessages];
}

export const maxDuration = 60; // Vercel Pro limit is 60s - must match to avoid 504

let globalStreamContext: ResumableStreamContext | null = null;

const getTokenlensCatalog = cache(
	async (): Promise<ModelCatalog | undefined> => {
		try {
			return await fetchModels();
		} catch (err) {
			console.warn(
				"TokenLens: catalog fetch failed, using default catalog",
				err,
			);
			return; // tokenlens helpers will fall back to defaultCatalog
		}
	},
	["tokenlens-catalog"],
	{ revalidate: 24 * 60 * 60 }, // 24 hours
);

export function getStreamContext() {
	if (!globalStreamContext) {
		try {
			globalStreamContext = createResumableStreamContext({
				waitUntil: after,
			});
		} catch (error: any) {
			if (error.message.includes("REDIS_URL")) {
				console.log(
					" > Resumable streams are disabled due to missing REDIS_URL",
				);
			} else {
				console.error(error);
			}
		}
	}

	return globalStreamContext;
}

export async function POST(request: Request) {
	let requestBody: PostRequestBody;

	try {
		const json = await request.json();
		console.log("Chat API request body:", JSON.stringify(json, null, 2));
		requestBody = postRequestBodySchema.parse(json);
	} catch (error) {
		console.error("Request body validation error:", error);
		console.error("Validation details:", JSON.stringify(error, null, 2));
		return new ChatSDKError("bad_request:api").toResponse();
	}

	try {
		const {
			id,
			message,
			selectedChatModel,
			selectedVisibilityType,
			selectedBotType = "alexandria",
			focusMode = "default",
		}: {
			id: string;
			message: ChatMessage;
			selectedChatModel: ChatModel["id"];
			selectedVisibilityType: VisibilityType;
			selectedBotType: string;
			focusMode: string;
		} = requestBody;

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		// Ensure User record exists in our custom User table (syncs with Supabase Auth)
		await ensureUserExists({
			id: user.id,
			email: user.email || "",
		});

		const userType: UserType = "regular"; // Default to regular for now until user type is in metadata/db
		const maxMessages = entitlementsByUserType[userType].maxMessagesPerDay;

		// Try Redis-based rate limiting first (faster)
		const rateLimitResult = await checkRateLimit(user.id, maxMessages);

		if (rateLimitResult.source === "redis") {
			// Redis is available, use its result
			if (!rateLimitResult.allowed) {
				const response = new ChatSDKError("rate_limit:chat").toResponse();
				const headers = getRateLimitHeaders(
					rateLimitResult.remaining,
					maxMessages,
					rateLimitResult.reset,
				);
				for (const [key, value] of Object.entries(headers)) {
					response.headers.set(key, value);
				}
				return response;
			}
		} else {
			// Fall back to database-based rate limiting
			const messageCount = await getMessageCountByUserId({
				id: user.id,
				differenceInHours: 24,
			});

			if (messageCount > maxMessages) {
				return new ChatSDKError("rate_limit:chat").toResponse();
			}
		}

		// Fetch chat and messages in parallel to reduce latency
		const [chat, messagesFromDb] = await Promise.all([
			getChatById({ id }),
			getMessagesByChatId({ id }),
		]);

		if (chat) {
			if (chat.userId !== user.id) {
				return new ChatSDKError("forbidden:chat").toResponse();
			}
		} else {
			// Create chat with placeholder title - generate real title in background
			await saveChat({
				id,
				userId: user.id,
				title: "New conversation",
				visibility: selectedVisibilityType,
			});

			// Generate title and classify topic in background (non-blocking)
			after(async () => {
				try {
					const title = await generateTitleFromUserMessage({ message });
					await updateChatTitle({ chatId: id, title });

					// Classify topic based on title and first message
					const firstMessageText = message.parts
						.filter((part) => part.type === "text")
						.map((part) => (part as { type: "text"; text: string }).text)
						.join(" ");

					const topicResult = classifyTopic(title, firstMessageText);
					if (topicResult) {
						await updateChatTopic({
							chatId: id,
							topic: topicResult.topic,
							topicColor: topicResult.color,
						});
					}
				} catch (err) {
					console.warn("Background title generation failed:", err);
				}
			});
		}
		// Truncate history to prevent context window overflow in long conversations
		const uiMessages = truncateMessageHistory([
			...convertToUIMessages(messagesFromDb),
			message,
		]);

		const { longitude, latitude, city, country } = geolocation(request);

		const requestHints: RequestHints = {
			longitude,
			latitude,
			city,
			country,
		};

		// Run knowledge base loading, message save, and stream ID creation in parallel
		const streamId = generateUUID();
		const [knowledgeBaseContent] = await Promise.all([
			getKnowledgeBaseContent(selectedBotType),
			saveMessages({
				messages: [
					{
						chatId: id,
						id: message.id,
						role: "user",
						parts: message.parts as unknown as Json,
						attachments: [] as unknown as Json,
						createdAt: new Date().toISOString(),
						botType: null,
						deletedAt: null,
					},
				],
			}),
			createStreamId({ streamId, chatId: id }),
		]);

		let finalMergedUsage: AppUsage | undefined;

		const stream = createUIMessageStream({
			execute: ({ writer: dataStream }) => {
				const result = streamText({
					model: myProvider.languageModel(selectedChatModel),
					system: systemPrompt({
						selectedChatModel,
						requestHints,
						botType: selectedBotType as any,
						focusMode: focusMode as any,
						knowledgeBaseContent,
					}),
					messages: convertToModelMessages(uiMessages),
					maxOutputTokens: 4096, // Prevent long responses from timing out
					stopWhen: stepCountIs(3), // Reduced from 5 to 3 - prevents deep recursion latency
					// Temporarily disabled tools and transforms for OpenRouter compatibility
					// experimental_activeTools: [
					//   "getWeather",
					//   "createDocument",
					//   "updateDocument",
					//   "requestSuggestions",
					//   "webSearch",
					// ],
					// experimental_transform: smoothStream({ chunking: "line" }),
					tools: {
						getWeather,
						createDocument: createDocument({ session: { user } as any, dataStream }),
						updateDocument: updateDocument({ session: { user } as any, dataStream }),
						requestSuggestions: requestSuggestions({
							session: { user } as any,
							dataStream,
						}),
						webSearch,
					},
					experimental_telemetry: {
						isEnabled: isProductionEnvironment,
						functionId: "stream-text",
					},
					onFinish: async ({ usage }) => {
						try {
							const providers = await getTokenlensCatalog();
							const modelId =
								myProvider.languageModel(selectedChatModel).modelId;
							if (!modelId) {
								finalMergedUsage = usage;
								dataStream.write({
									type: "data-usage",
									data: finalMergedUsage,
								});
								return;
							}

							if (!providers) {
								finalMergedUsage = usage;
								dataStream.write({
									type: "data-usage",
									data: finalMergedUsage,
								});
								return;
							}

							const summary = getUsage({ modelId, usage, providers });
							finalMergedUsage = { ...usage, ...summary, modelId } as AppUsage;
							dataStream.write({ type: "data-usage", data: finalMergedUsage });
						} catch (err) {
							console.warn("TokenLens enrichment failed", err);
							finalMergedUsage = usage;
							dataStream.write({ type: "data-usage", data: finalMergedUsage });
						}
					},
				});

				result.consumeStream();
				dataStream.merge(
					result.toUIMessageStream({
						sendReasoning: true,
					}),
				);
			},
			generateId: generateUUID,
			onFinish: async ({ messages }) => {
				await saveMessages({
					messages: messages.map((currentMessage) => ({
						id: currentMessage.id,
						role: currentMessage.role,
						parts: currentMessage.parts as unknown as Json,
						createdAt: new Date().toISOString(),
						attachments: [] as unknown as Json,
						chatId: id,
						botType:
							currentMessage.role === "assistant"
								? (currentMessage as any).metadata?.botType || selectedBotType
								: null,
						deletedAt: null,
					})),
				});

				if (finalMergedUsage) {
					try {
						await updateChatLastContextById({
							chatId: id,
							context: finalMergedUsage,
						});
					} catch (err) {
						console.warn("Unable to persist last usage for chat", id, err);
					}
				}
			},
			onError: () => {
				return "Oops, an error occurred!";
			},
		});

		// const streamContext = getStreamContext();

		// if (streamContext) {
		//   return new Response(
		//     await streamContext.resumableStream(streamId, () =>
		//       stream.pipeThrough(new JsonToSseTransformStream())
		//     )
		//   );
		// }

		return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
	} catch (error: any) {
		const vercelId = request.headers.get("x-vercel-id");

		if (error instanceof ChatSDKError) {
			return error.toResponse();
		}

		// Log detailed error for debugging
		console.error("Unhandled error in chat API:", {
			message: error?.message,
			name: error?.name,
			cause: error?.cause,
			stack: error?.stack?.split("\n").slice(0, 5).join("\n"),
			vercelId,
			hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
			openRouterKeyPrefix: process.env.OPENROUTER_API_KEY?.slice(0, 12) + "...",
		});
		return new ChatSDKError("offline:chat").toResponse();
	}
}

export async function DELETE(request: Request) {
	const { searchParams } = new URL(request.url);
	const id = searchParams.get("id");

	if (!id) {
		return new ChatSDKError("bad_request:api").toResponse();
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new ChatSDKError("unauthorized:chat").toResponse();
	}

	const chat = await getChatById({ id });

	if (chat?.userId !== user.id) {
		return new ChatSDKError("forbidden:chat").toResponse();
	}

	const deletedChat = await deleteChatById({ id });

	return Response.json(deletedChat, { status: 200 });
}

export async function PATCH(request: Request) {
	try {
		const { id, isPinned } = await request.json();

		if (!id || typeof isPinned !== "boolean") {
			return new ChatSDKError("bad_request:api").toResponse();
		}

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		const chat = await getChatById({ id });

		if (!chat) {
			return new ChatSDKError("not_found:chat").toResponse();
		}

		if (chat.userId !== user.id) {
			return new ChatSDKError("forbidden:chat").toResponse();
		}

		await updateChatPinStatus({ chatId: id, isPinned });

		return Response.json({ success: true, isPinned }, { status: 200 });
	} catch (_error) {
		return new ChatSDKError("bad_request:api").toResponse();
	}
}
