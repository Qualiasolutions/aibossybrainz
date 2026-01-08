"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowRight,
	Lightbulb,
	MessageSquare,
	Sparkles,
	Target,
} from "lucide-react";
import type {
	Suggestion,
	SuggestionCategory,
} from "@/lib/ai/suggestions-config";
import type { BotType } from "@/lib/bot-personalities";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<SuggestionCategory, typeof Lightbulb> = {
	"deep-dive": Lightbulb,
	pivot: MessageSquare,
	action: Target,
	clarify: Sparkles,
};

// Glassmorphic category styles with richer colors
const CATEGORY_GLASS_STYLES: Record<SuggestionCategory, string> = {
	"deep-dive":
		"glass-blue hover:shadow-blue-300/40 dark:hover:shadow-blue-700/30",
	pivot:
		"glass-purple hover:shadow-purple-300/40 dark:hover:shadow-purple-700/30",
	action:
		"glass-emerald hover:shadow-emerald-300/40 dark:hover:shadow-emerald-700/30",
	clarify:
		"glass-neutral hover:shadow-neutral-300/40 dark:hover:shadow-red-700/30",
};

// Rich text colors for each category
const CATEGORY_TEXT_COLORS: Record<SuggestionCategory, string> = {
	"deep-dive": "text-blue-700 dark:text-blue-300",
	pivot: "text-purple-700 dark:text-purple-300",
	action: "text-emerald-700 dark:text-emerald-300",
	clarify: "text-red-700 dark:text-neutral-300",
};

// Icon colors for each category
const CATEGORY_ICON_COLORS: Record<SuggestionCategory, string> = {
	"deep-dive": "text-blue-500 dark:text-blue-400",
	pivot: "text-purple-500 dark:text-purple-400",
	action: "text-emerald-500 dark:text-emerald-400",
	clarify: "text-red-500 dark:text-red-500",
};

// Executive-themed container gradients
const EXECUTIVE_CONTAINER_STYLES: Record<BotType, string> = {
	alexandria:
		"from-rose-50/30 via-transparent to-transparent dark:from-rose-950/20",
	kim: "from-blue-50/30 via-transparent to-transparent dark:from-blue-950/20",
	collaborative:
		"from-purple-50/30 via-transparent to-transparent dark:from-purple-950/20",
};

type MessageSuggestionsProps = {
	suggestions: Suggestion[];
	onSelect: (text: string) => void;
	isVisible: boolean;
	botType?: BotType;
};

export function MessageSuggestions({
	suggestions,
	onSelect,
	isVisible,
	botType = "collaborative",
}: MessageSuggestionsProps) {
	if (!isVisible || suggestions.length === 0) {
		return null;
	}

	const handleKeyDown = (e: React.KeyboardEvent, text: string) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelect(text);
		}
	};

	return (
		<AnimatePresence mode="wait">
			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					"mt-4 rounded-2xl bg-gradient-to-r p-1",
					EXECUTIVE_CONTAINER_STYLES[botType],
				)}
				exit={{ opacity: 0, y: -8 }}
				initial={{ opacity: 0, y: 12 }}
				transition={{
					duration: 0.3,
					ease: [0.16, 1, 0.3, 1],
				}}
			>
				<div className="flex flex-wrap gap-2">
					{suggestions.map((suggestion, index) => {
						const Icon = CATEGORY_ICONS[suggestion.category];
						return (
							<motion.button
								animate={{ opacity: 1, scale: 1, y: 0 }}
								aria-label={`Suggestion: ${suggestion.text}`}
								className={cn(
									"group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5",
									"text-sm font-medium transition-all duration-200",
									"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
									"hover:scale-[1.02] active:scale-[0.98]",
									CATEGORY_GLASS_STYLES[suggestion.category],
									CATEGORY_TEXT_COLORS[suggestion.category],
								)}
								initial={{ opacity: 0, scale: 0.9, y: 8 }}
								key={suggestion.id}
								onClick={() => onSelect(suggestion.text)}
								onKeyDown={(e) => handleKeyDown(e, suggestion.text)}
								transition={{
									delay: index * 0.06,
									type: "spring",
									stiffness: 400,
									damping: 25,
								}}
								type="button"
								whileHover={{
									y: -2,
									transition: { duration: 0.15 },
								}}
								whileTap={{ scale: 0.98 }}
							>
								{/* Animated icon container */}
								<motion.span
									className={cn(
										"flex size-5 shrink-0 items-center justify-center rounded-lg",
										"bg-white/60 dark:bg-white/10",
										CATEGORY_ICON_COLORS[suggestion.category],
									)}
									whileHover={{ rotate: [0, -10, 10, 0] }}
									transition={{ duration: 0.3 }}
								>
									<Icon className="size-3.5" />
								</motion.span>

								{/* Suggestion text with gradient underline on hover */}
								<span className="relative max-w-[220px] truncate sm:max-w-[300px]">
									{suggestion.text}
									<span className="absolute bottom-0 left-0 h-px w-0 bg-current opacity-40 transition-all duration-300 group-hover:w-full" />
								</span>

								{/* Arrow indicator */}
								<motion.span
									className="ml-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
									initial={{ x: -4 }}
									whileHover={{ x: 0 }}
								>
									<ArrowRight className="size-3.5" />
								</motion.span>
							</motion.button>
						);
					})}
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
