import "server-only";

import { unstable_cache } from "next/cache";
import type { ArtifactKind } from "@/components/artifact";
import { ChatSDKError } from "../errors";
import type { AppUsage } from "../usage";
import { generateUUID } from "../utils";
import { createClient, createServiceClient } from "../supabase/server";
import { withRetry } from "../resilience";

// Database-specific retry options for transient failures
const dbRetryOptions = {
	maxRetries: 3,
	initialDelay: 500,
	maxDelay: 5000,
	backoffMultiplier: 2,
	retryableErrors: (error: unknown) => {
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			return (
				message.includes("network") ||
				message.includes("timeout") ||
				message.includes("connection") ||
				message.includes("econnreset") ||
				message.includes("econnrefused") ||
				message.includes("pgrst") ||
				message.includes("socket")
			);
		}
		return false;
	},
};
import type {
	User,
	Chat,
	DBMessage,
	Vote,
	Document,
	Suggestion,
	ExecutiveMemory,
	MessageReaction,
	VisibilityType,
	BotType,
	ReactionType,
	Json,
} from "../supabase/types";


// Re-export types for backwards compatibility
export type { User, Chat, DBMessage, Vote, Document, Suggestion, ExecutiveMemory, MessageReaction };

// ============================================
// USER QUERIES
// ============================================

export async function getUser(email: string): Promise<User[]> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("User")
			.select("*")
			.eq("email", email);

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get user by email",
		);
	}
}

export async function createUser({
  id,
  email,
}: {
  id?: string;
  email: string;
}) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("User")
			.insert({ id, email })
			.select();

		if (error) throw error;
		return data;
	} catch (_error) {
		throw new ChatSDKError("bad_request:database", "Failed to create user");
	}
}

/**
 * Ensures a User record exists for the authenticated Supabase Auth user.
 * Creates one if it doesn't exist. This syncs Supabase Auth users with our custom User table.
 */
export async function ensureUserExists({
	id,
	email,
}: {
	id: string;
	email: string;
}) {
	try {
		// Use service client to bypass RLS for user creation
		const supabase = createServiceClient();

		// Upsert user - creates if not exists, updates email if exists
		const { data, error } = await supabase
			.from("User")
			.upsert({ id, email }, { onConflict: "id" })
			.select("id")
			.single();

		if (error) {
			console.error("[ensureUserExists] Upsert error:", error);
			throw error;
		}

		return data;
	} catch (error) {
		console.error("ensureUserExists error:", error);
		throw new ChatSDKError("bad_request:database", "Failed to ensure user exists");
	}
}



// ============================================
// CHAT QUERIES
// ============================================

export async function saveChat({
	id,
	userId,
	title,
	visibility,
}: {
	id: string;
	userId: string;
	title: string;
	visibility: VisibilityType;
}) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Chat")
			.insert({
				id,
				createdAt: new Date().toISOString(),
				userId,
				title,
				visibility,
			})
			.select();

		if (error) throw error;
		return data;
	} catch (error) {
		console.error("saveChat error:", error);
		throw new ChatSDKError("bad_request:database", "Failed to save chat");
	}
}

export async function updateChatTitle({
	chatId,
	title,
}: {
	chatId: string;
	title: string;
}) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("Chat")
			.update({ title })
			.eq("id", chatId);

		if (error) throw error;
	} catch (_error) {
		// Non-critical - title update failure shouldn't break the chat
		console.warn("Failed to update chat title:", chatId);
	}
}

export async function deleteChatById({ id }: { id: string }) {
	try {
		return await withRetry(async () => {
			const supabase = await createClient();
			const deletedAt = new Date().toISOString();

			// Soft delete related records first
			await supabase.from("Vote_v2").update({ deletedAt }).eq("chatId", id);
			await supabase.from("Message_v2").update({ deletedAt }).eq("chatId", id);
			await supabase.from("Stream").update({ deletedAt }).eq("chatId", id);

			// Soft delete the chat
			const { data, error } = await supabase
				.from("Chat")
				.update({ deletedAt })
				.eq("id", id)
				.select();

			if (error) throw error;
			return data?.[0];
		}, dbRetryOptions);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete chat by id",
		);
	}
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
	try {
		return await withRetry(async () => {
			const supabase = await createClient();
			const deletedAt = new Date().toISOString();

			// Get all chat IDs for this user (only non-deleted)
			const { data: userChats } = await supabase
				.from("Chat")
				.select("id")
				.eq("userId", userId)
				.is("deletedAt", null);

			if (!userChats || userChats.length === 0) {
				return { deletedCount: 0 };
			}

			const chatIds = userChats.map((c) => c.id);

			// Soft delete related records
			await supabase.from("Vote_v2").update({ deletedAt }).in("chatId", chatIds);
			await supabase.from("Message_v2").update({ deletedAt }).in("chatId", chatIds);
			await supabase.from("Stream").update({ deletedAt }).in("chatId", chatIds);

			// Soft delete chats
			const { data: deletedChats } = await supabase
				.from("Chat")
				.update({ deletedAt })
				.eq("userId", userId)
				.is("deletedAt", null)
				.select();

			return { deletedCount: deletedChats?.length || 0 };
		}, dbRetryOptions);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete all chats by user id",
		);
	}
}

export async function getChatsByUserId({
	id,
	limit,
	startingAfter,
	endingBefore,
}: {
	id: string;
	limit: number;
	startingAfter: string | null;
	endingBefore: string | null;
}) {
	try {
		const supabase = await createClient();
		const extendedLimit = limit + 1;

		let query = supabase
			.from("Chat")
			.select("*")
			.eq("userId", id)
			.is("deletedAt", null)
			.order("createdAt", { ascending: false })
			.limit(extendedLimit);

		if (startingAfter) {
			const { data: selectedChat } = await supabase
				.from("Chat")
				.select("createdAt")
				.eq("id", startingAfter)
				.single();

			if (!selectedChat) {
				throw new ChatSDKError(
					"not_found:database",
					`Chat with id ${startingAfter} not found`,
				);
			}

			query = query.gt("createdAt", selectedChat.createdAt);
		} else if (endingBefore) {
			const { data: selectedChat } = await supabase
				.from("Chat")
				.select("createdAt")
				.eq("id", endingBefore)
				.single();

			if (!selectedChat) {
				throw new ChatSDKError(
					"not_found:database",
					`Chat with id ${endingBefore} not found`,
				);
			}

			query = query.lt("createdAt", selectedChat.createdAt);
		}

		const { data: filteredChats, error } = await query;

		if (error) throw error;

		const chats = filteredChats || [];
		const hasMore = chats.length > limit;

		return {
			chats: hasMore ? chats.slice(0, limit) : chats,
			hasMore,
		};
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get chats by user id",
		);
	}
}

export async function getChatById({ id }: { id: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Chat")
			.select("*")
			.eq("id", id)
			.is("deletedAt", null)
			.single();

		if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
		return data || null;
	} catch (error) {
		console.error("getChatById error:", error);
		throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
	}
}

// ============================================
// MESSAGE QUERIES
// ============================================

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Message_v2")
			.insert(messages)
			.select();

		if (error) throw error;
		return data;
	} catch (_error) {
		throw new ChatSDKError("bad_request:database", "Failed to save messages");
	}
}

// Cache message fetching for 10 seconds to handle rapid consecutive requests
const getCachedMessages = (chatId: string) => {
	return unstable_cache(
		async () => {
			const supabase = await createClient();
			const { data, error } = await supabase
				.from("Message_v2")
				.select("*")
				.eq("chatId", chatId)
				.is("deletedAt", null)
				.order("createdAt", { ascending: true });

			if (error) {
				console.error("getCachedMessages Supabase error:", error);
				throw error;
			}
			return data || [];
		},
		[`chat-messages-${chatId}`],
		{
			revalidate: 10, // 10 seconds cache
			tags: [`chat-${chatId}`],
		},
	)();
};

export async function getMessagesByChatId({ id }: { id: string }) {
	try {
		// Temporarily bypass cache to debug the issue
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Message_v2")
			.select("*")
			.eq("chatId", id)
			.is("deletedAt", null)
			.order("createdAt", { ascending: true });

		if (error) {
			console.error("getMessagesByChatId Supabase error:", error);
			throw error;
		}
		return data || [];
	} catch (error) {
		console.error("getMessagesByChatId error:", error);
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get messages by chat id",
		);
	}
}

export async function getMessageById({ id }: { id: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Message_v2")
			.select("*")
			.eq("id", id);

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message by id",
		);
	}
}

export async function deleteMessagesByChatIdAfterTimestamp({
	chatId,
	timestamp,
}: {
	chatId: string;
	timestamp: Date | string;
}) {
	try {
		return await withRetry(async () => {
			const supabase = await createClient();
			const isoTimestamp = typeof timestamp === 'string' ? timestamp : timestamp.toISOString();
			const deletedAt = new Date().toISOString();

			// Get messages to soft delete (only non-deleted ones)
			const { data: messagesToDelete } = await supabase
				.from("Message_v2")
				.select("id")
				.eq("chatId", chatId)
				.gte("createdAt", isoTimestamp)
				.is("deletedAt", null);

			const messageIds = messagesToDelete?.map((m) => m.id) || [];

			if (messageIds.length > 0) {
				// Soft delete votes for these messages
				await supabase
					.from("Vote_v2")
					.update({ deletedAt })
					.eq("chatId", chatId)
					.in("messageId", messageIds);

				// Soft delete messages
				return await supabase
					.from("Message_v2")
					.update({ deletedAt })
					.eq("chatId", chatId)
					.in("id", messageIds);
			}
		}, dbRetryOptions);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete messages by chat id after timestamp",
		);
	}
}

// ============================================
// VOTE QUERIES
// ============================================

export async function voteMessage({
	chatId,
	messageId,
	type,
}: {
	chatId: string;
	messageId: string;
	type: "up" | "down";
}) {
	try {
		const supabase = await createClient();

		// Use upsert pattern
		const { error } = await supabase
			.from("Vote_v2")
			.upsert(
				{
					chatId,
					messageId,
					isUpvoted: type === "up",
				},
				{
					onConflict: "chatId,messageId",
				},
			);

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError("bad_request:database", "Failed to vote message");
	}
}

export async function getVotesByChatId({ id }: { id: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Vote_v2")
			.select("*")
			.eq("chatId", id);

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get votes by chat id",
		);
	}
}

// ============================================
// DOCUMENT QUERIES
// ============================================

export async function saveDocument({
	id,
	title,
	kind,
	content,
	userId,
}: {
	id: string;
	title: string;
	kind: ArtifactKind;
	content: string;
	userId: string;
}) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Document")
			.insert({
				id,
				title,
				kind,
				content,
				userId,
				createdAt: new Date().toISOString(),
			})
			.select();

		if (error) throw error;
		return data;
	} catch (_error) {
		throw new ChatSDKError("bad_request:database", "Failed to save document");
	}
}

export async function getDocumentsById({ id }: { id: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Document")
			.select("*")
			.eq("id", id)
			.order("createdAt", { ascending: true });

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get documents by id",
		);
	}
}

export async function getDocumentById({ id }: { id: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Document")
			.select("*")
			.eq("id", id)
			.order("createdAt", { ascending: false })
			.limit(1)
			.single();

		if (error && error.code !== "PGRST116") throw error;
		return data || null;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get document by id",
		);
	}
}

export async function getDocumentsByUserId({ userId }: { userId: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Document")
			.select("*")
			.eq("userId", userId)
			.order("createdAt", { ascending: false });

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get documents by user id",
		);
	}
}

export async function deleteDocumentsByIdAfterTimestamp({
	id,
	timestamp,
}: {
	id: string;
	timestamp: Date;
}) {
	try {
		return await withRetry(async () => {
			const supabase = await createClient();
			const deletedAt = new Date().toISOString();

			// Soft delete suggestions first
			await supabase
				.from("Suggestion")
				.update({ deletedAt })
				.eq("documentId", id)
				.gt("documentCreatedAt", timestamp.toISOString());

			// Soft delete documents
			const { data, error } = await supabase
				.from("Document")
				.update({ deletedAt })
				.eq("id", id)
				.gt("createdAt", timestamp.toISOString())
				.is("deletedAt", null)
				.select();

			if (error) throw error;
			return data;
		}, dbRetryOptions);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to delete documents by id after timestamp",
		);
	}
}

// ============================================
// SUGGESTION QUERIES
// ============================================

export async function saveSuggestions({
	suggestions,
}: {
	suggestions: Suggestion[];
}) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Suggestion")
			.insert(suggestions)
			.select();

		if (error) throw error;
		return data;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to save suggestions",
		);
	}
}

export async function getSuggestionsByDocumentId({
	documentId,
}: {
	documentId: string;
}) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Suggestion")
			.select("*")
			.eq("documentId", documentId);

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get suggestions by document id",
		);
	}
}

// ============================================
// CHAT UPDATES
// ============================================

export async function updateChatVisiblityById({
	chatId,
	visibility,
}: {
	chatId: string;
	visibility: "private" | "public";
}) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("Chat")
			.update({ visibility })
			.eq("id", chatId);

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to update chat visibility by id",
		);
	}
}

export async function updateChatLastContextById({
	chatId,
	context,
}: {
	chatId: string;
	context: AppUsage;
}) {
	try {
		const supabase = await createClient();
		await supabase
			.from("Chat")
			.update({ lastContext: context as any })
			.eq("id", chatId);
	} catch (error) {
		console.warn("Failed to update lastContext for chat", chatId, error);
	}
}

export async function updateChatPinStatus({
	chatId,
	isPinned,
}: {
	chatId: string;
	isPinned: boolean;
}) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("Chat")
			.update({ isPinned })
			.eq("id", chatId);

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to update chat pin status",
		);
	}
}

export async function updateChatTopic({
	chatId,
	topic,
	topicColor,
}: {
	chatId: string;
	topic: string | null;
	topicColor: string | null;
}) {
	try {
		const supabase = await createClient();
		const { error } = await supabase
			.from("Chat")
			.update({ topic, topicColor })
			.eq("id", chatId);

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to update chat topic",
		);
	}
}

// ============================================
// ANALYTICS QUERIES
// ============================================

export async function getMessageCountByUserId({
	id,
	differenceInHours,
}: {
	id: string;
	differenceInHours: number;
}) {
	try {
		const supabase = await createClient();
		const cutoffTime = new Date(
			Date.now() - differenceInHours * 60 * 60 * 1000,
		).toISOString();

		// Get user's chats
		const { data: userChats } = await supabase
			.from("Chat")
			.select("id")
			.eq("userId", id);

		if (!userChats || userChats.length === 0) {
			return 0;
		}

		const chatIds = userChats.map((c) => c.id);

		// Count user messages in those chats after cutoff
		const { count, error } = await supabase
			.from("Message_v2")
			.select("*", { count: "exact", head: true })
			.in("chatId", chatIds)
			.eq("role", "user")
			.gte("createdAt", cutoffTime);

		if (error) throw error;
		return count || 0;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message count by user id",
		);
	}
}

// ============================================
// STREAM QUERIES
// ============================================

export async function createStreamId({
	streamId,
	chatId,
}: {
	streamId: string;
	chatId: string;
}) {
	try {
		const supabase = await createClient();
		const { error } = await supabase.from("Stream").insert({
			id: streamId,
			chatId,
			createdAt: new Date().toISOString(),
		});

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to create stream id",
		);
	}
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("Stream")
			.select("id")
			.eq("chatId", chatId)
			.order("createdAt", { ascending: true });

		if (error) throw error;
		return (data || []).map(({ id }) => id);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get stream ids by chat id",
		);
	}
}

// ============================================
// EXECUTIVE MEMORY QUERIES
// ============================================

export async function getExecutiveMemory({
	userId,
}: {
	userId: string;
}): Promise<ExecutiveMemory[]> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("ExecutiveMemory")
			.select("*")
			.eq("userId", userId)
			.order("preferenceScore", { ascending: false });

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get executive memory",
		);
	}
}

export async function updateExecutiveMemory({
	userId,
	executive,
	topic,
}: {
	userId: string;
	executive: BotType;
	topic?: string;
}) {
	try {
		const supabase = await createClient();

		// Try to get existing record
		const { data: existing } = await supabase
			.from("ExecutiveMemory")
			.select("*")
			.eq("userId", userId)
			.eq("executive", executive)
			.limit(1);

		if (existing && existing.length > 0) {
			const record = existing[0];
			const currentCount = (record.messageCount as number) || 0;
			const currentTopics = (record.topTopics as string[]) || [];
			const newTopics = topic
				? [...new Set([...currentTopics, topic])].slice(-10)
				: currentTopics;

			await supabase
				.from("ExecutiveMemory")
				.update({
					messageCount: currentCount + 1,
					topTopics: newTopics,
					lastUsed: new Date().toISOString(),
					preferenceScore: currentCount + 1,
					updatedAt: new Date().toISOString(),
				})
				.eq("id", record.id);
		} else {
			await supabase.from("ExecutiveMemory").insert({
				userId,
				executive,
				messageCount: 1,
				topTopics: topic ? [topic] : [],
				lastUsed: new Date().toISOString(),
				preferenceScore: 1,
			});
		}
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to update executive memory",
		);
	}
}

export async function getExecutiveStats({
	userId,
}: {
	userId: string;
}): Promise<{
	total: number;
	breakdown: { executive: string; count: number; percentage: number }[];
	preferred: string | null;
}> {
	try {
		const memories = await getExecutiveMemory({ userId });
		const total = memories.reduce(
			(sum, m) => sum + ((m.messageCount as number) || 0),
			0,
		);

		const breakdown = memories.map((m) => ({
			executive: m.executive,
			count: (m.messageCount as number) || 0,
			percentage:
				total > 0
					? Math.round((((m.messageCount as number) || 0) / total) * 100)
					: 0,
		}));

		const preferred = memories.length > 0 ? memories[0].executive : null;

		return { total, breakdown, preferred };
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get executive stats",
		);
	}
}

// ============================================
// MESSAGE REACTION QUERIES
// ============================================

export async function addMessageReaction({
	messageId,
	userId,
	reactionType,
}: {
	messageId: string;
	userId: string;
	reactionType: ReactionType;
}) {
	try {
		const supabase = await createClient();

		// Remove existing reaction of same type from same user
		await supabase
			.from("MessageReaction")
			.delete()
			.eq("messageId", messageId)
			.eq("userId", userId)
			.eq("reactionType", reactionType);

		// Add new reaction
		const { error } = await supabase.from("MessageReaction").insert({
			messageId,
			userId,
			reactionType,
		});

		if (error) throw error;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to add message reaction",
		);
	}
}

export async function removeMessageReaction({
	messageId,
	userId,
}: {
	messageId: string;
	userId: string;
}) {
	try {
		const supabase = await createClient();
		await supabase
			.from("MessageReaction")
			.delete()
			.eq("messageId", messageId)
			.eq("userId", userId);
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to remove message reaction",
		);
	}
}

export async function getMessageReactions({
	messageId,
}: {
	messageId: string;
}): Promise<MessageReaction[]> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("MessageReaction")
			.select("*")
			.eq("messageId", messageId);

		if (error) throw error;
		return data || [];
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message reactions",
		);
	}
}

export async function getMessageReactionCounts({
	messageId,
}: {
	messageId: string;
}): Promise<Record<string, number>> {
	try {
		const reactions = await getMessageReactions({ messageId });
		const counts: Record<string, number> = {};

		for (const r of reactions) {
			counts[r.reactionType] = (counts[r.reactionType] || 0) + 1;
		}

		return counts;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get message reaction counts",
		);
	}
}

export async function getUserReactionForMessage({
	messageId,
	userId,
}: {
	messageId: string;
	userId: string;
}): Promise<MessageReaction | null> {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase
			.from("MessageReaction")
			.select("*")
			.eq("messageId", messageId)
			.eq("userId", userId)
			.limit(1);

		if (error) throw error;
		return data?.[0] || null;
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get user reaction for message",
		);
	}
}

// Get all reactions by type for a user with message and chat details
export async function getUserReactionsByType({
	userId,
	reactionType,
}: {
	userId: string;
	reactionType: ReactionType;
}): Promise<{
	id: string;
	messageId: string;
	reactionType: string;
	createdAt: string;
	message: {
		id: string;
		chatId: string;
		parts: Json;
		role: string;
		botType: string | null;
		createdAt: string;
	} | null;
	chat: {
		id: string;
		title: string;
		topic: string | null;
		topicColor: string | null;
	} | null;
}[]> {
	try {
		const supabase = await createClient();

		// Get reactions with message details
		const { data: reactions, error } = await supabase
			.from("MessageReaction")
			.select("*")
			.eq("userId", userId)
			.eq("reactionType", reactionType)
			.order("createdAt", { ascending: false });

		if (error) throw error;
		if (!reactions || reactions.length === 0) return [];

		// Get message details for each reaction
		const messageIds = reactions.map((r) => r.messageId);
		const { data: messages, error: msgError } = await supabase
			.from("Message_v2")
			.select("id, chatId, parts, role, botType, createdAt")
			.in("id", messageIds);

		if (msgError) throw msgError;

		// Get chat details
		const chatIds = [...new Set(messages?.map((m) => m.chatId) || [])];
		const { data: chats, error: chatError } = await supabase
			.from("Chat")
			.select("id, title, topic, topicColor")
			.in("id", chatIds);

		if (chatError) throw chatError;

		// Combine the data
		const messagesMap = new Map(messages?.map((m) => [m.id, m]) || []);
		const chatsMap = new Map(chats?.map((c) => [c.id, c]) || []);

		return reactions.map((r) => {
			const message = messagesMap.get(r.messageId) || null;
			const chat = message ? chatsMap.get(message.chatId) || null : null;
			return {
				id: r.id,
				messageId: r.messageId,
				reactionType: r.reactionType,
				createdAt: r.createdAt || new Date().toISOString(),
				message,
				chat,
			};
		});
	} catch (_error) {
		throw new ChatSDKError(
			"bad_request:database",
			"Failed to get user reactions by type",
		);
	}
}
