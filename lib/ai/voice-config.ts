import type { BotType } from "@/lib/bot-personalities";

export type VoiceConfig = {
	voiceId: string;
	modelId: string;
	settings: {
		stability: number;
		similarityBoost: number;
		style?: number;
		useSpeakerBoost?: boolean;
	};
};

// Voice IDs provided by user:
// Alexandria: kfxR5DufiGBogKn26hyv
// Kim: wMmwtV1VyRNXQx00eD6W
// Using ElevenLabs v3 for more expressive speech
// eleven_v3 requires stability values of 0.0 (Creative), 0.5 (Natural), or 1.0 (Robust)
export const VOICE_CONFIGS: Record<BotType, VoiceConfig> = {
	alexandria: {
		voiceId:
			process.env.ELEVENLABS_VOICE_ID_ALEXANDRIA ?? "kfxR5DufiGBogKn26hyv",
		modelId: "eleven_v3",
		settings: {
			stability: 0.5, // Natural - balanced for CMO voice
			similarityBoost: 0.8,
			style: 0.3,
			useSpeakerBoost: true,
		},
	},
	kim: {
		voiceId: process.env.ELEVENLABS_VOICE_ID_KIM ?? "wMmwtV1VyRNXQx00eD6W",
		modelId: "eleven_v3",
		settings: {
			stability: 1.0, // Robust - consistent for CSO voice
			similarityBoost: 0.8,
			style: 0.2,
			useSpeakerBoost: true,
		},
	},
	collaborative: {
		// Use Alexandria's voice for collaborative mode
		voiceId:
			process.env.ELEVENLABS_VOICE_ID_ALEXANDRIA ?? "kfxR5DufiGBogKn26hyv",
		modelId: "eleven_v3",
		settings: {
			stability: 0.5, // Natural - balanced for collaborative
			similarityBoost: 0.8,
			style: 0.25,
			useSpeakerBoost: true,
		},
	},
};

export const getVoiceConfig = (botType: BotType): VoiceConfig => {
	return VOICE_CONFIGS[botType];
};

export const getVoiceForBot = (botType: BotType): string => {
	return VOICE_CONFIGS[botType].voiceId;
};

// Maximum text length for TTS (to control costs)
export const MAX_TTS_TEXT_LENGTH = 5000;

/**
 * Detect which executive is speaking based on text content.
 * Used for collaborative mode to select the appropriate voice.
 * Returns 'alexandria' or 'kim' based on text analysis.
 */
export const detectSpeaker = (text: string): "alexandria" | "kim" => {
	const lowerText = text.toLowerCase();

	// Check for explicit executive markers
	const alexandriaMarkers = [
		/\*\*alexandria/i,
		/^alexandria:/im,
		/alexandria\s*\(cmo\)/i,
		/\bcmo\b/i,
		/chief marketing/i,
	];

	const kimMarkers = [
		/\*\*kim/i,
		/^kim:/im,
		/kim\s*\(cso\)/i,
		/\bcso\b/i,
		/chief sales/i,
	];

	// Count marker matches
	let alexandriaScore = 0;
	let kimScore = 0;

	for (const marker of alexandriaMarkers) {
		if (marker.test(text)) alexandriaScore++;
	}

	for (const marker of kimMarkers) {
		if (marker.test(text)) kimScore++;
	}

	// Check for topic-based detection as fallback
	const marketingKeywords = ['brand', 'marketing', 'campaign', 'content', 'social media', 'pr ', 'positioning', 'creative'];
	const salesKeywords = ['sales', 'pipeline', 'revenue', 'deals', 'closing', 'negotiation', 'quota', 'forecast'];

	for (const keyword of marketingKeywords) {
		if (lowerText.includes(keyword)) alexandriaScore += 0.5;
	}

	for (const keyword of salesKeywords) {
		if (lowerText.includes(keyword)) kimScore += 0.5;
	}

	// Default to Alexandria if tied or no clear winner
	return kimScore > alexandriaScore ? "kim" : "alexandria";
};
