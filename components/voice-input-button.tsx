"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const sizeClasses = {
		sm: "h-8 w-8",
		md: "h-10 w-10",
		lg: "h-12 w-12",
	};

	const iconSizes = {
		sm: "h-3 w-3",
		md: "h-4 w-4",
		lg: "h-5 w-5",
	};

	useEffect(() => {
		return () => {
			if (mediaRecorderRef.current && isListening) {
				mediaRecorderRef.current.stop();
			}
		};
	}, [isListening]);

	const startListening = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			audioChunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorder.onstop = async () => {
				setIsProcessing(true);

				// Simulate voice processing
				setTimeout(() => {
					const mockTranscript =
						"This is a voice input transcript. Implement with a real speech-to-text service.";
					onTranscript(mockTranscript);
					setIsProcessing(false);
				}, 1000);

				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			setIsListening(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopListening = () => {
		if (mediaRecorderRef.current && isListening) {
			mediaRecorderRef.current.stop();
			setIsListening(false);
		}
	};

	const handleClick = () => {
		if (isListening) {
			stopListening();
		} else {
			startListening();
		}
	};

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
							className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-500/40 via-rose-500/20 to-amber-400/20 opacity-50"
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
