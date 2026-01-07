import { createClient } from "@/lib/supabase/server";
import { getVoiceConfig, MAX_TTS_TEXT_LENGTH } from "@/lib/ai/voice-config";
import type { BotType } from "@/lib/bot-personalities";
import { ChatSDKError } from "@/lib/errors";
import {
	CircuitBreakerError,
	withElevenLabsResilience,
} from "@/lib/resilience";
import {
	checkRateLimit,
	getRateLimitHeaders,
} from "@/lib/security/rate-limiter";

export const maxDuration = 30;

// Max voice requests per day (separate from chat limit)
const MAX_VOICE_REQUESTS_PER_DAY = 100;

export async function POST(request: Request) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return new ChatSDKError("unauthorized:chat").toResponse();
		}

		// Rate limit voice API to prevent abuse
		const rateLimitResult = await checkRateLimit(
			`voice:${user.id}`,
			MAX_VOICE_REQUESTS_PER_DAY,
		);

		if (!rateLimitResult.allowed) {
			const response = new ChatSDKError("rate_limit:chat").toResponse();
			const headers = getRateLimitHeaders(
				rateLimitResult.remaining,
				MAX_VOICE_REQUESTS_PER_DAY,
				rateLimitResult.reset,
			);
			for (const [key, value] of Object.entries(headers)) {
				response.headers.set(key, value);
			}
			return response;
		}

		const { text, botType } = (await request.json()) as {
			text: string;
			botType: BotType;
		};

		if (!text || typeof text !== "string") {
			return new ChatSDKError("bad_request:api").toResponse();
		}

		// Validate botType
		if (!["alexandria", "kim", "collaborative"].includes(botType)) {
			return new ChatSDKError("bad_request:api").toResponse();
		}

		// Truncate text if too long
		const truncatedText = text.slice(0, MAX_TTS_TEXT_LENGTH);

		// Strip markdown formatting for cleaner speech
		const cleanText = stripMarkdown(truncatedText);

		if (!cleanText.trim()) {
			return new ChatSDKError("bad_request:api").toResponse();
		}

		const apiKey = process.env.ELEVENLABS_API_KEY;

		if (!apiKey) {
			return Response.json(
				{ error: "Voice service not configured" },
				{ status: 503 },
			);
		}

		const voiceConfig = getVoiceConfig(botType);

		// Use resilience wrapper for ElevenLabs API calls
		const response = await withElevenLabsResilience(async () => {
			const res = await fetch(
				`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}/stream`,
				{
					method: "POST",
					headers: {
						"xi-api-key": apiKey,
						"Content-Type": "application/json",
						Accept: "audio/mpeg",
					},
					body: JSON.stringify({
						text: cleanText,
						model_id: voiceConfig.modelId,
						voice_settings: {
							stability: voiceConfig.settings.stability,
							similarity_boost: voiceConfig.settings.similarityBoost,
							style: voiceConfig.settings.style ?? 0,
							use_speaker_boost: voiceConfig.settings.useSpeakerBoost ?? true,
						},
					}),
				},
			);

			if (!res.ok) {
				// Log status only, avoid logging response body which may contain sensitive data
				console.error("ElevenLabs API error:", res.status, res.statusText);
				throw new Error(`ElevenLabs API error: ${res.status}`);
			}

			return res;
		});

		// Stream the audio response
		return new Response(response.body, {
			headers: {
				"Content-Type": "audio/mpeg",
				"Cache-Control": "no-cache",
				"Transfer-Encoding": "chunked",
			},
		});
	} catch (error) {
		// Handle circuit breaker errors gracefully
		if (error instanceof CircuitBreakerError) {
			console.error("Voice service circuit open:", error.message);
			return Response.json(
				{
					error:
						"Voice service temporarily unavailable. Please try again later.",
				},
				{ status: 503 },
			);
		}

		console.error("Voice API error:", error);
		return Response.json({ error: "Internal server error" }, { status: 500 });
	}
}

// Precompiled regex patterns for better performance
const MARKDOWN_PATTERNS = {
	executiveAlexandria: /\*\*Alexandria\s*\(CMO\):\*\*/gi,
	executiveKim: /\*\*Kim\s*\(CSO\):\*\*/gi,
	jointStrategy: /\*\*Joint Strategy:\*\*/gi,
	standaloneAlexandria: /^Alexandria:\s*/gim,
	standaloneKim: /^Kim:\s*/gim,
	headers: /^#{1,6}\s+/gm,
	bold: /\*\*([^*]+)\*\*/g,
	italic: /\*([^*]+)\*/g,
	boldAlt: /__([^_]+)__/g,
	italicAlt: /_([^_]+)_/g,
	links: /\[([^\]]+)\]\([^)]+\)/g,
	images: /!\[([^\]]*)\]\([^)]+\)/g,
	codeBlocks: /```[\s\S]*?```/g,
	inlineCode: /`([^`]+)`/g,
	blockquotes: /^>\s+/gm,
	horizontalRules: /^---+$/gm,
	// Table patterns - skip entire tables instead of just removing pipes
	tableRows: /^\|[^\n]+\|$/gm,
	tableSeparators: /^[-|:\s]+$/gm,
	multipleNewlines: /\n{3,}/g,
};

// Helper function to strip markdown for cleaner TTS
function stripMarkdown(text: string): string {
	// Track if we've already added verbal references to avoid repetition
	let hasTableReference = false;
	let hasCodeReference = false;

	let result = text
		// Remove executive name prefixes (collaborative mode)
		.replace(MARKDOWN_PATTERNS.executiveAlexandria, "")
		.replace(MARKDOWN_PATTERNS.executiveKim, "")
		.replace(MARKDOWN_PATTERNS.jointStrategy, "")
		// Remove standalone executive names at start of lines
		.replace(MARKDOWN_PATTERNS.standaloneAlexandria, "")
		.replace(MARKDOWN_PATTERNS.standaloneKim, "")
		// Remove headers
		.replace(MARKDOWN_PATTERNS.headers, "")
		// Remove bold/italic
		.replace(MARKDOWN_PATTERNS.bold, "$1")
		.replace(MARKDOWN_PATTERNS.italic, "$1")
		.replace(MARKDOWN_PATTERNS.boldAlt, "$1")
		.replace(MARKDOWN_PATTERNS.italicAlt, "$1")
		// Remove links but keep text
		.replace(MARKDOWN_PATTERNS.links, "$1")
		// Remove images
		.replace(MARKDOWN_PATTERNS.images, "")
		// Replace code blocks with verbal reference (only first occurrence)
		.replace(MARKDOWN_PATTERNS.codeBlocks, () => {
			if (!hasCodeReference) {
				hasCodeReference = true;
				return "\n\nSee the code example displayed above.\n\n";
			}
			return "";
		})
		// Remove inline code
		.replace(MARKDOWN_PATTERNS.inlineCode, "$1")
		// Remove blockquotes
		.replace(MARKDOWN_PATTERNS.blockquotes, "")
		// Remove horizontal rules
		.replace(MARKDOWN_PATTERNS.horizontalRules, "");

	// Replace tables with verbal reference (detect if tables exist first)
	const hasTable = MARKDOWN_PATTERNS.tableRows.test(result);
	if (hasTable && !hasTableReference) {
		hasTableReference = true;
		// Remove table content and add reference
		result = result
			.replace(MARKDOWN_PATTERNS.tableRows, "")
			.replace(MARKDOWN_PATTERNS.tableSeparators, "");
		// Add verbal reference before the cleaned content
		result = result.replace(
			/\n\n+/,
			"\n\nPlease see the table displayed above for the detailed breakdown.\n\n",
		);
	} else {
		result = result
			.replace(MARKDOWN_PATTERNS.tableRows, "")
			.replace(MARKDOWN_PATTERNS.tableSeparators, "");
	}

	// Clean up multiple newlines
	return result.replace(MARKDOWN_PATTERNS.multipleNewlines, "\n\n").trim();
}
