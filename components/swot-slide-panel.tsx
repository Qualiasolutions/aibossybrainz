"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";
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
				<motion.div
					initial={{ x: "100%" }}
					animate={{ x: 0 }}
					exit={{ x: "100%" }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 40,
					}}
					className="fixed top-0 right-0 z-50 h-full w-[90%] border-l border-border bg-background shadow-2xl sm:w-[70%] md:w-[55%] lg:w-[40%] xl:w-[32%] 2xl:w-[28%]"
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
						<div className="flex items-center gap-3">
							<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
								<LayoutGrid className="size-4 text-primary" />
							</div>
							<div>
								<h2 className="font-semibold text-sm text-foreground">
									Strategy Canvas
								</h2>
								<p className="text-xs text-muted-foreground">
									SWOT Analysis
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
					<div className="h-[calc(100%-57px)] overflow-y-auto p-4 sm:p-5">
						<SwotBoard />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
