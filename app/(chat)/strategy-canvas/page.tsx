"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	LayoutGrid,
	Lightbulb,
	Moon,
	Route,
	Sparkles,
	Sun,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrainstormBoard } from "@/components/strategy-canvas/brainstorm-board";
import { BusinessModelCanvas } from "@/components/strategy-canvas/business-model-canvas";
import { CustomerJourney } from "@/components/strategy-canvas/customer-journey";
import { SwotBoard } from "@/components/strategy-canvas/swot-board";
import type { CanvasType } from "@/components/strategy-canvas/types";
import { cn } from "@/lib/utils";

const canvasTypes = [
	{
		key: "swot" as CanvasType,
		label: "SWOT Analysis",
		shortLabel: "SWOT",
		icon: Target,
		description: "Strengths, Weaknesses, Opportunities, Threats",
		gradient: "from-red-500 to-rose-600",
		lightBg: "bg-red-50 dark:bg-red-900/20",
		activeBg: "bg-gradient-to-r from-red-500 to-rose-600",
		shadowColor: "shadow-red-500/25",
	},
	{
		key: "bmc" as CanvasType,
		label: "Business Model Canvas",
		shortLabel: "BMC",
		icon: LayoutGrid,
		description: "9 building blocks of your business",
		gradient: "from-emerald-500 to-teal-600",
		lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
		activeBg: "bg-gradient-to-r from-emerald-500 to-teal-600",
		shadowColor: "shadow-emerald-500/25",
	},
	{
		key: "journey" as CanvasType,
		label: "Customer Journey",
		shortLabel: "Journey",
		icon: Route,
		description: "Map the complete customer experience",
		gradient: "from-blue-500 to-indigo-600",
		lightBg: "bg-blue-50 dark:bg-blue-900/20",
		activeBg: "bg-gradient-to-r from-blue-500 to-indigo-600",
		shadowColor: "shadow-blue-500/25",
	},
	{
		key: "brainstorm" as CanvasType,
		label: "Brainstorming",
		shortLabel: "Ideas",
		icon: Lightbulb,
		description: "Capture and organize ideas freely",
		gradient: "from-amber-500 to-orange-600",
		lightBg: "bg-amber-50 dark:bg-amber-900/20",
		activeBg: "bg-gradient-to-r from-amber-500 to-orange-600",
		shadowColor: "shadow-amber-500/25",
	},
];

export default function StrategyCanvasPage() {
	const [activeCanvas, setActiveCanvas] = useState<CanvasType>("swot");
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	const toggleDarkMode = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		document.documentElement.classList.toggle("dark", newIsDark);
	};

	const activeTab = canvasTypes.find((c) => c.key === activeCanvas);

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
			{/* Animated background */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<motion.div
					className="absolute -top-40 -left-40 size-96 rounded-full bg-gradient-to-br from-red-200/30 to-rose-200/30 blur-3xl dark:from-red-900/10 dark:to-rose-900/10"
					animate={{
						x: [0, 50, 0],
						y: [0, 30, 0],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute top-1/2 -right-40 size-96 rounded-full bg-gradient-to-br from-blue-200/30 to-indigo-200/30 blur-3xl dark:from-blue-900/10 dark:to-indigo-900/10"
					animate={{
						x: [0, -30, 0],
						y: [0, 50, 0],
					}}
					transition={{
						duration: 25,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<div
					className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
					style={{
						backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
						backgroundSize: "40px 40px",
					}}
				/>
			</div>

			{/* Sticky Header */}
			<header className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/80">
				<div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between">
						{/* Logo and Back */}
						<div className="flex items-center gap-4">
							<Link href="/">
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
								>
									<ArrowLeft className="size-4" />
									<span className="hidden sm:inline">Back to Chat</span>
								</motion.button>
							</Link>
							<div className="hidden h-6 w-px bg-neutral-200 dark:bg-neutral-800 sm:block" />
							<div className="hidden items-center gap-2.5 sm:flex">
								<div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-md shadow-red-500/20">
									<Sparkles className="size-4.5 text-white" />
								</div>
								<h1 className="font-bold text-lg text-neutral-900 dark:text-white">
									Strategy Canvas
								</h1>
							</div>
						</div>

						{/* Theme Toggle */}
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className="flex size-10 items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
							onClick={toggleDarkMode}
							type="button"
						>
							{isDark ? (
								<Sun className="size-5" />
							) : (
								<Moon className="size-5" />
							)}
						</motion.button>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Page Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-10 text-center"
				>
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", delay: 0.1 }}
						className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-500/25"
					>
						<Sparkles className="size-8 text-white" />
					</motion.div>
					<h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-white sm:text-4xl">
						Strategic Planning Tools
					</h1>
					<p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
						Visualize your strategy with interactive canvases. Analyze, brainstorm, and document your business decisions.
					</p>
				</motion.div>

				{/* Premium Tab Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="mb-8"
				>
					{/* Desktop Tabs */}
					<div className="hidden rounded-2xl border border-neutral-200/50 bg-white/70 p-2 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70 md:block">
						<div className="flex gap-2">
							{canvasTypes.map((canvas) => {
								const Icon = canvas.icon;
								const isActive = activeCanvas === canvas.key;

								return (
									<motion.button
										key={canvas.key}
										whileHover={{ scale: 1.01 }}
										whileTap={{ scale: 0.99 }}
										onClick={() => setActiveCanvas(canvas.key)}
										className={cn(
											"relative flex flex-1 flex-col items-center gap-2 rounded-xl px-4 py-4 transition-all",
											isActive
												? "text-white"
												: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200",
										)}
										type="button"
									>
										{isActive && (
											<motion.div
												layoutId="activeTab"
												className={cn(
													"absolute inset-0 rounded-xl shadow-lg",
													canvas.activeBg,
													canvas.shadowColor,
												)}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 30,
												}}
											/>
										)}
										<div className="relative z-10 flex items-center gap-2.5">
											<Icon className="size-5" />
											<span className="font-semibold text-sm">{canvas.label}</span>
										</div>
										<span
											className={cn(
												"relative z-10 text-xs",
												isActive
													? "text-white/80"
													: "text-neutral-400 dark:text-neutral-500",
											)}
										>
											{canvas.description}
										</span>
									</motion.button>
								);
							})}
						</div>
					</div>

					{/* Mobile Tabs */}
					<div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
						{canvasTypes.map((canvas) => {
							const Icon = canvas.icon;
							const isActive = activeCanvas === canvas.key;

							return (
								<motion.button
									key={canvas.key}
									whileTap={{ scale: 0.95 }}
									onClick={() => setActiveCanvas(canvas.key)}
									className={cn(
										"flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all",
										isActive
											? cn("text-white shadow-lg", canvas.activeBg, canvas.shadowColor)
											: "bg-white text-neutral-600 shadow-sm dark:bg-neutral-800 dark:text-neutral-300",
									)}
									type="button"
								>
									<Icon className="size-4" />
									{canvas.shortLabel}
								</motion.button>
							);
						})}
					</div>
				</motion.div>

				{/* Active Tab Description (Mobile) */}
				{activeTab && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mb-6 text-center md:hidden"
					>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							{activeTab.description}
						</p>
					</motion.div>
				)}

				{/* Canvas Content Container */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="rounded-3xl border border-neutral-200/50 bg-white/60 p-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/60 sm:p-6 lg:p-8"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={activeCanvas}
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -30 }}
							transition={{
								duration: 0.35,
								ease: [0.4, 0, 0.2, 1],
							}}
						>
							{activeCanvas === "swot" && <SwotBoard />}
							{activeCanvas === "bmc" && <BusinessModelCanvas />}
							{activeCanvas === "journey" && <CustomerJourney />}
							{activeCanvas === "brainstorm" && <BrainstormBoard />}
						</motion.div>
					</AnimatePresence>
				</motion.div>

				{/* Pro Tip Footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-8 text-center"
				>
					<p className="text-xs text-neutral-400 dark:text-neutral-600">
						Pro tip: Export your work to save progress and share with your team
					</p>
				</motion.div>
			</main>

			{/* Footer */}
			<footer className="border-t border-neutral-200/50 bg-white/50 py-6 backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<p className="text-neutral-500 text-sm dark:text-neutral-400">
						Strategy Canvas by{" "}
						<span className="font-semibold text-red-600 dark:text-red-400">
							Alecci Media
						</span>
					</p>
				</div>
			</footer>
		</div>
	);
}
