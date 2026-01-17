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
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // Increased for collaborative multi-voice

// Max voice requests per day (separate from chat limit)
const MAX_VOICE_REQUESTS_PER_DAY = 500;

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
    // Skip rate limiting if Redis not available (allows voice to work without Redis)
    const rateLimitResult = await checkRateLimit(
      `voice:${user.id}`,
      MAX_VOICE_REQUESTS_PER_DAY,
    );

    if (rateLimitResult.source === "redis" && !rateLimitResult.allowed) {
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
    // If database fallback, allow the request (voice is less critical than chat)

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
      console.error("[Voice API] ELEVENLABS_API_KEY not found in environment");
      return Response.json(
        { error: "Voice service not configured" },
        { status: 503 },
      );
    }

    // For collaborative mode, parse speaker segments and generate audio for each
    if (botType === "collaborative") {
      const segments = parseCollaborativeSegments(cleanText);

      // If we have multiple speakers, generate audio for each segment
      if (
        segments.length > 1 ||
        (segments.length === 1 && segments[0].speaker !== "alexandria")
      ) {
        const audioBuffers: ArrayBuffer[] = [];

        for (const segment of segments) {
          if (!segment.text.trim()) continue;

          const voiceConfig = getVoiceConfig(segment.speaker);
          const audioBuffer = await generateAudioForSegment(
            segment.text,
            voiceConfig,
            apiKey,
          );
          audioBuffers.push(audioBuffer);
        }

        // Concatenate all audio buffers
        const totalLength = audioBuffers.reduce(
          (sum, buf) => sum + buf.byteLength,
          0,
        );
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        for (const buffer of audioBuffers) {
          combined.set(new Uint8Array(buffer), offset);
          offset += buffer.byteLength;
        }

        return new Response(combined, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "no-cache",
          },
        });
      }
    }

    // Single voice path (non-collaborative or single speaker)
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
        // Handle specific error codes
        if (res.status === 401) {
          throw new Error("INVALID_API_KEY");
        }
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

    // Handle invalid API key
    if (error instanceof Error && error.message === "INVALID_API_KEY") {
      console.error("ElevenLabs API key invalid or expired");
      return Response.json(
        { error: "Voice service configuration error" },
        { status: 503 },
      );
    }

    console.error("Voice API error:", error);
    return Response.json(
      { error: "Voice service unavailable" },
      { status: 503 },
    );
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

// Types for collaborative voice segments
interface SpeakerSegment {
  speaker: "alexandria" | "kim";
  text: string;
}

/**
 * Parse collaborative mode text into speaker segments.
 * Identifies sections by **Alexandria (CMO):**, **Kim (CSO):**, **Joint Strategy:**
 * Joint Strategy sections alternate between voices for variety.
 */
function parseCollaborativeSegments(text: string): SpeakerSegment[] {
  const segments: SpeakerSegment[] = [];

  // Patterns to match speaker markers
  const speakerPattern =
    /\*\*(?:Alexandria\s*\(CMO\)|Kim\s*\(CSO\)|Joint Strategy)\s*:\*\*/gi;

  // Find all speaker markers and their positions
  const markers: {
    index: number;
    speaker: "alexandria" | "kim" | "joint";
    length: number;
  }[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex to ensure we start from the beginning
  speakerPattern.lastIndex = 0;

  while ((match = speakerPattern.exec(text)) !== null) {
    const markerText = match[0].toLowerCase();
    let speaker: "alexandria" | "kim" | "joint";

    if (markerText.includes("alexandria")) {
      speaker = "alexandria";
    } else if (markerText.includes("kim")) {
      speaker = "kim";
    } else {
      speaker = "joint";
    }

    markers.push({
      index: match.index,
      speaker,
      length: match[0].length,
    });
  }

  // If no markers found, return the whole text as alexandria (default)
  if (markers.length === 0) {
    return [{ speaker: "alexandria", text }];
  }

  // Extract text before first marker if any
  if (markers[0].index > 0) {
    const beforeText = text.slice(0, markers[0].index).trim();
    if (beforeText) {
      segments.push({ speaker: "alexandria", text: beforeText });
    }
  }

  // Extract text for each marker section
  for (let i = 0; i < markers.length; i++) {
    const marker = markers[i];
    const startIndex = marker.index + marker.length;
    const endIndex = markers[i + 1]?.index ?? text.length;
    const sectionText = text.slice(startIndex, endIndex).trim();

    if (sectionText) {
      // Joint Strategy alternates voices, starting with Alexandria
      const speaker =
        marker.speaker === "joint"
          ? segments.length % 2 === 0
            ? "alexandria"
            : "kim"
          : marker.speaker;

      segments.push({ speaker, text: sectionText });
    }
  }

  return segments;
}

/**
 * Generate audio for a single segment using ElevenLabs API.
 */
async function generateAudioForSegment(
  text: string,
  voiceConfig: {
    voiceId: string;
    modelId: string;
    settings: {
      stability: number;
      similarityBoost: number;
      style?: number;
      useSpeakerBoost?: boolean;
    };
  },
  apiKey: string,
): Promise<ArrayBuffer> {
  const response = await withElevenLabsResilience(async () => {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
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
      console.error("ElevenLabs API error:", res.status, res.statusText);
      if (res.status === 401) {
        throw new Error("INVALID_API_KEY");
      }
      throw new Error(`ElevenLabs API error: ${res.status}`);
    }

    return res;
  });

  return response.arrayBuffer();
}

// Helper function to strip markdown for cleaner TTS
function stripMarkdown(text: string): string {
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
    // Remove code blocks entirely - don't reference them verbally as it confuses users
    .replace(MARKDOWN_PATTERNS.codeBlocks, "")
    // Remove inline code
    .replace(MARKDOWN_PATTERNS.inlineCode, "$1")
    // Remove blockquotes
    .replace(MARKDOWN_PATTERNS.blockquotes, "")
    // Remove horizontal rules
    .replace(MARKDOWN_PATTERNS.horizontalRules, "");

  // Remove tables entirely - don't reference them verbally as it confuses users
  result = result
    .replace(MARKDOWN_PATTERNS.tableRows, "")
    .replace(MARKDOWN_PATTERNS.tableSeparators, "");

  // Clean up multiple newlines
  return result.replace(MARKDOWN_PATTERNS.multipleNewlines, "\n\n").trim();
}
