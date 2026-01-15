"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Target, X } from "lucide-react";
import { SwotBoard } from "@/components/strategy-canvas/swot-board";
import { Button } from "@/components/ui/button";

interface SwotSlidePanelProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SwotSlidePanel({ isOpen, onClose }: SwotSlidePanelProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop - subtle darkening */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
						onClick={onClose}
					/>

					{/* Slide Panel - right side, ~30% width on desktop */}
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 40,
						}}
						className="fixed top-0 right-0 z-50 h-full w-full border-l border-border/50 bg-background/95 shadow-2xl backdrop-blur-xl sm:w-[85%] md:w-[70%] lg:w-[45%] xl:w-[35%] 2xl:w-[30%]"
					>
						{/* Header */}
						<div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6 sm:py-4">
							<div className="flex items-center gap-3">
								<div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20">
									<Target className="size-5 text-purple-600 dark:text-purple-400" />
								</div>
								<div>
									<h2 className="font-semibold text-base text-foreground">
										SWOT Analysis
									</h2>
									<p className="text-xs text-muted-foreground">
										Strategic assessment
									</p>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								className="size-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<X className="size-4" />
								<span className="sr-only">Close panel</span>
							</Button>
						</div>

						{/* Content - Scrollable */}
						<div className="h-[calc(100%-65px)] overflow-y-auto p-4 sm:p-6">
							<SwotBoard />
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
