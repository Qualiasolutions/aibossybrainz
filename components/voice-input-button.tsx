"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Use native SpeechRecognition types with webkit prefix support
type SpeechRecognitionType = typeof window.SpeechRecognition;

// Get SpeechRecognition constructor (handles webkit prefix)
function getSpeechRecognition(): SpeechRecognitionType | null {
	if (typeof window === "undefined") return null;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

interface VoiceInputButtonProps {
	onTranscript: (transcript: string) => void;
	disabled?: boolean;
	className?: string;
	size?: "sm" | "md" | "lg";
}

export function VoiceInputButton({
	onTranscript,
	disabled = false,
	className,
	size = "md",
}: VoiceInputButtonProps) {
	const [isListening, setIsListening] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isSupported, setIsSupported] = useState(true);
	const recognitionRef = useRef<globalThis.SpeechRecognition | null>(null);
	const transcriptRef = useRef<string>("");

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
	};

	// Check for browser support on mount
	useEffect(() => {
		const SpeechRecognitionAPI = getSpeechRecognition();
		if (!SpeechRecognitionAPI) {
			setIsSupported(false);
		}
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.abort();
			}
		};
	}, []);

	const startListening = useCallback(() => {
		const SpeechRecognitionAPI = getSpeechRecognition();
		if (!SpeechRecognitionAPI) {
			toast.error("Speech recognition is not supported in your browser");
			return;
		}

		try {
			const recognition = new SpeechRecognitionAPI();
			recognitionRef.current = recognition;
			transcriptRef.current = "";

			recognition.continuous = true;
			recognition.interimResults = true;
			recognition.lang = "en-US";

			recognition.onstart = () => {
				setIsListening(true);
				setIsProcessing(false);
			};

			recognition.onresult = (event) => {
				let finalTranscript = "";

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript;
					}
				}

				if (finalTranscript) {
					transcriptRef.current += finalTranscript;
				}
			};

			recognition.onerror = (event) => {
				console.error("Speech recognition error:", event.error);
				setIsListening(false);
				setIsProcessing(false);

				if (event.error === "not-allowed") {
					toast.error("Microphone access denied. Please enable microphone permissions.");
				} else if (event.error === "no-speech") {
					toast.info("No speech detected. Try again.");
				} else if (event.error !== "aborted") {
					toast.error(`Speech recognition error: ${event.error}`);
				}
			};

			recognition.onend = () => {
				setIsListening(false);
				if (transcriptRef.current.trim()) {
					setIsProcessing(true);
					// Small delay for UX
					setTimeout(() => {
						onTranscript(transcriptRef.current.trim());
						setIsProcessing(false);
						transcriptRef.current = "";
					}, 200);
				}
			};

			recognition.start();
		} catch (error) {
			console.error("Error starting speech recognition:", error);
			toast.error("Failed to start speech recognition");
			setIsListening(false);
		}
	}, [onTranscript]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
		}
	}, []);

	const handleClick = useCallback(() => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	}, [isListening, startListening, stopListening]);

	// Don't render if speech recognition is not supported
	if (!isSupported) {
		return null;
	}

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					className={cn(
						"relative overflow-hidden border border-transparent transition-all duration-300",
						isListening &&
							"border-rose-400/60 bg-rose-500/10 text-rose-600 shadow-[0_0_0_2px_rgba(244,114,182,0.12)]",
						!isListening &&
							"hover:border-rose-300/60 hover:bg-rose-50/60 hover:text-rose-600",
						disabled && "cursor-not-allowed opacity-50",
						className,
					)}
					disabled={disabled || isProcessing}
					onClick={handleClick}
					size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
					variant="ghost"
				>
					<AnimatePresence mode="wait">
						{isListening ? (
							<motion.div
								animate={{ scale: 1, rotate: 0 }}
								exit={{ scale: 0, rotate: 180 }}
								initial={{ scale: 0, rotate: -180 }}
								key="listening"
								transition={{ type: "spring", stiffness: 200, damping: 15 }}
							>
								<MicOff className={iconSizes[size]} />
							</motion.div>
						) : isProcessing ? (
							<motion.div
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								initial={{ scale: 0 }}
								key="processing"
							>
								<Loader2 className={cn(iconSizes[size], "animate-spin")} />
							</motion.div>
						) : (
							<motion.div
								animate={{ scale: 1 }}
								exit={{ scale: 0 }}
								initial={{ scale: 0 }}
								key="idle"
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<Mic className={iconSizes[size]} />
							</motion.div>
						)}
					</AnimatePresence>

					{isListening && (
						<motion.div
							animate={{ scale: 2 }}
							className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/40 via-rose-500/20 to-red-500/20 opacity-50"
							exit={{ scale: 0 }}
							initial={{ scale: 0 }}
							transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
						/>
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>
					{isListening
						? "Click to stop recording"
						: isProcessing
							? "Processing voice..."
							: "Click to start voice input"}
				</p>
			</TooltipContent>
		</Tooltip>
	);
}
