"use client";

import { Loader2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface AutoSpeakToggleProps {
	isEnabled: boolean;
	isLoading: boolean;
	isPlaying: boolean;
	isPaused?: boolean;
	onToggle: () => void;
	onStop: () => void;
	onTogglePause?: () => void;
	className?: string;
}

export const AutoSpeakToggle = ({
	isEnabled,
	isLoading,
	isPlaying,
	isPaused = false,
	onToggle,
	onStop,
	onTogglePause,
	className,
}: AutoSpeakToggleProps) => {
	const handleClick = () => {
		if (isLoading) {
			// Cancel loading request
			onStop();
		} else if (isPlaying || isPaused) {
			// Pause/resume instead of stopping
			if (onTogglePause) {
				onTogglePause();
			} else {
				onStop();
			}
		} else {
			onToggle();
		}
	};

	const getTooltipText = () => {
		if (isLoading) return "Cancel voice generation";
		if (isPlaying) return "Pause speaking";
		if (isPaused) return "Resume speaking";
		if (isEnabled) return "Auto-speak on (click to disable)";
		return "Auto-speak off (click to enable)";
	};

	const getAriaLabel = () => {
		if (isPlaying) return "Pause speaking";
		if (isPaused) return "Resume speaking";
		if (isEnabled) return "Disable auto-speak";
		return "Enable auto-speak";
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleClick();
		}
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label={getAriaLabel()}
						className={className}
						onClick={handleClick}
						onKeyDown={handleKeyDown}
						size="icon"
						type="button"
						variant="ghost"
					>
						{isLoading ? (
							<Loader2 className="size-4 animate-spin text-rose-500" />
						) : isPlaying ? (
							<Pause className="size-4 text-rose-500" />
						) : isPaused ? (
							<Play className="size-4 text-rose-500" />
						) : isEnabled ? (
							<Volume2 className="size-4 text-rose-500" />
						) : (
							<Volume2 className="size-4 text-muted-foreground" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent className="text-xs" side="top">
					{getTooltipText()}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
