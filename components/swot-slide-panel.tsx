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
					initial={{ width: 0 }}
					animate={{ width: 380 }}
					exit={{ width: 0 }}
					transition={{
						type: "spring",
						stiffness: 400,
						damping: 40,
					}}
					style={{ width: 380 }}
					className="h-full flex-shrink-0 overflow-hidden border-l border-border bg-background"
				>
					{/* Header */}
					<div className="flex items-center justify-between border-b border-border px-4 py-3">
						<div className="flex items-center gap-2.5">
							<div className="flex size-7 items-center justify-center rounded-lg bg-primary/10">
								<LayoutGrid className="size-3.5 text-primary" />
							</div>
							<div>
								<h2 className="font-semibold text-sm text-foreground">
									Strategy Canvas
								</h2>
								<p className="text-[11px] text-muted-foreground">
									SWOT Analysis
								</p>
							</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="size-7 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
						>
							<X className="size-3.5" />
							<span className="sr-only">Close panel</span>
						</Button>
					</div>

					{/* Content - Scrollable */}
					<div className="h-[calc(100%-53px)] overflow-y-auto p-3 sm:p-4">
						<SwotBoard />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
