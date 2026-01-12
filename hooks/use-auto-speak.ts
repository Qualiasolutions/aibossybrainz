"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	clearAudioUrl,
	markAudioEnded,
	pauseAudio,
	resumeAudio,
	setAbortController,
	setCurrentAudio,
	stopAllAudio,
	subscribeToAudioChanges,
} from "@/lib/audio-manager";
import type { BotType } from "@/lib/bot-personalities";
import type { ChatMessage } from "@/lib/types";

type AutoSpeakState = "idle" | "loading" | "playing" | "paused" | "error";

// Track if voice service is unavailable (503) to avoid repeated failed requests
// Reset after 60 seconds to allow retry
let voiceServiceUnavailable = false;
let voiceServiceUnavailableTime = 0;
const VOICE_SERVICE_RETRY_INTERVAL = 60000; // 60 seconds

function checkVoiceServiceAvailable(): boolean {
	if (!voiceServiceUnavailable) return true;
	// Auto-reset after retry interval
	if (Date.now() - voiceServiceUnavailableTime > VOICE_SERVICE_RETRY_INTERVAL) {
		voiceServiceUnavailable = false;
		voiceServiceUnavailableTime = 0;
		console.log("[AutoSpeak] Voice service retry - resetting unavailable flag");
		return true;
	}
	return false;
}

/**
 * Hook that automatically speaks the latest assistant message when streaming completes.
 * Uses ElevenLabs TTS API via the /api/voice endpoint.
 */
export const useAutoSpeak = ({
	messages,
	status,
	botType,
	enabled = true,
}: {
	messages: ChatMessage[];
	status: "ready" | "submitted" | "streaming" | "error";
	botType: BotType;
	enabled?: boolean;
}) => {
	const [state, setState] = useState<AutoSpeakState>("idle");
	const [isAutoSpeakEnabled, setIsAutoSpeakEnabled] = useState(enabled);
	const lastSpokenMessageIdRef = useRef<string | null>(null);
	const wasStreamingRef = useRef(false);
	const currentPlayIdRef = useRef<string | null>(null);

	// Subscribe to global audio state changes
	useEffect(() => {
		const unsubscribe = subscribeToAudioChanges((isPlaying, _source) => {
			// If audio stopped and we were playing, reset our state
			if (!isPlaying && currentPlayIdRef.current !== null) {
				currentPlayIdRef.current = null;
				setState("idle");
			}
		});
		return unsubscribe;
	}, []);

	const stop = useCallback(() => {
		currentPlayIdRef.current = null;
		stopAllAudio();
		setState("idle");
	}, []);

	const pause = useCallback(() => {
		if (state === "playing") {
			pauseAudio();
			setState("paused");
		}
	}, [state]);

	const resume = useCallback(async () => {
		if (state === "paused") {
			await resumeAudio();
			setState("playing");
		}
	}, [state]);

	const togglePause = useCallback(async () => {
		if (state === "playing") {
			pause();
		} else if (state === "paused") {
			await resume();
		}
	}, [state, pause, resume]);

	const speak = useCallback(async (text: string, messageBotType: BotType) => {
		// Skip if voice service is known to be unavailable (with auto-retry)
		if (!checkVoiceServiceAvailable()) {
			console.log("[AutoSpeak] Voice service unavailable, skipping");
			return;
		}

		// Stop any currently playing audio globally
		stopAllAudio();

		if (!text.trim()) {
			return;
		}

		const playId = `auto-${Date.now()}`;
		currentPlayIdRef.current = playId;

		setState("loading");
		console.log("[AutoSpeak] Starting API request to /api/voice");

		const abortController = new AbortController();
		setAbortController(abortController);

		try {
			const response = await fetch("/api/voice", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text, botType: messageBotType }),
				signal: abortController.signal,
			});

			if (currentPlayIdRef.current !== playId) {
				return;
			}

			if (!response.ok) {
				// If voice service returns 503 (not configured), wait before retry
				if (response.status === 503) {
					voiceServiceUnavailable = true;
					voiceServiceUnavailableTime = Date.now();
					console.log("[AutoSpeak] Voice service returned 503, marking unavailable");
					setState("idle");
					currentPlayIdRef.current = null;
					return;
				}
				throw new Error("Failed to generate voice");
			}

			const audioBlob = await response.blob();
			const audioUrl = URL.createObjectURL(audioBlob);

			if (currentPlayIdRef.current !== playId) {
				URL.revokeObjectURL(audioUrl);
				return;
			}

			const audio = new Audio(audioUrl);

			// Apply volume and speed settings from localStorage
			const savedVolume = localStorage.getItem("voice-playback-volume");
			const savedSpeed = localStorage.getItem("voice-playback-speed");

			if (savedVolume) {
				const volume = Number.parseInt(savedVolume, 10);
				if (!Number.isNaN(volume) && volume >= 0 && volume <= 100) {
					audio.volume = volume / 100;
				}
			}

			if (savedSpeed) {
				const speed = Number.parseFloat(savedSpeed);
				if (!Number.isNaN(speed) && speed >= 0.5 && speed <= 2) {
					audio.playbackRate = speed;
				}
			}

			audio.addEventListener("ended", () => {
				if (currentPlayIdRef.current === playId) {
					setState("idle");
					currentPlayIdRef.current = null;
					markAudioEnded();
				}
				clearAudioUrl(audioUrl);
			});

			audio.addEventListener("error", () => {
				if (currentPlayIdRef.current === playId) {
					setState("error");
					currentPlayIdRef.current = null;
					markAudioEnded();
				}
				clearAudioUrl(audioUrl);
			});

			// Register with global audio manager
			setCurrentAudio(audio, audioUrl, "auto-speak");

			setState("playing");
			console.log("[AutoSpeak] Starting audio playback");
			await audio.play();
		} catch (err) {
			if (err instanceof Error && err.name === "AbortError") {
				if (currentPlayIdRef.current === playId) {
					setState("idle");
					currentPlayIdRef.current = null;
				}
				return;
			}
			if (currentPlayIdRef.current === playId) {
				setState("error");
				currentPlayIdRef.current = null;
			}
		}
	}, []);

	// Track when streaming starts
	useEffect(() => {
		console.log("[AutoSpeak] Status changed:", status, "wasStreaming:", wasStreamingRef.current, "enabled:", isAutoSpeakEnabled);
		if (status === "streaming") {
			wasStreamingRef.current = true;
		}
	}, [status, isAutoSpeakEnabled]);

	// Auto-speak when streaming completes
	useEffect(() => {
		if (!isAutoSpeakEnabled) {
			console.log("[AutoSpeak] Auto-speak disabled, skipping");
			return;
		}

		// Check if we just finished streaming (was streaming, now ready)
		if (wasStreamingRef.current && status === "ready") {
			console.log("[AutoSpeak] Streaming finished, attempting to speak");
			wasStreamingRef.current = false;

			// Get the latest assistant message
			const lastMessage = messages.at(-1);
			if (!lastMessage || lastMessage.role !== "assistant") {
				console.log("[AutoSpeak] No assistant message found, skipping");
				return;
			}

			// Don't speak the same message twice
			if (lastSpokenMessageIdRef.current === lastMessage.id) {
				console.log("[AutoSpeak] Already spoke this message, skipping");
				return;
			}

			// Extract text content from message parts
			const textContent = lastMessage.parts
				?.filter((part) => part.type === "text")
				.map((part) => part.text)
				.join("\n")
				.trim();

			console.log("[AutoSpeak] Text content length:", textContent?.length || 0);

			if (textContent) {
				lastSpokenMessageIdRef.current = lastMessage.id;
				// Use the botType from message metadata if available, otherwise use the current botType
				const messageBotType =
					(lastMessage.metadata?.botType as BotType) ?? botType;
				console.log("[AutoSpeak] Speaking message for botType:", messageBotType);
				speak(textContent, messageBotType);
			} else {
				console.log("[AutoSpeak] No text content to speak");
			}
		}
	}, [messages, status, botType, isAutoSpeakEnabled, speak]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			stop();
		};
	}, [stop]);

	const toggleAutoSpeak = useCallback(() => {
		setIsAutoSpeakEnabled((prev) => !prev);
		if (state === "playing" || state === "loading") {
			stop();
		}
	}, [state, stop]);

	return {
		state,
		isAutoSpeakEnabled,
		toggleAutoSpeak,
		stop,
		pause,
		resume,
		togglePause,
		isLoading: state === "loading",
		isPlaying: state === "playing",
		isPaused: state === "paused",
	};
};
