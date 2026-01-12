"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	LayoutGrid,
	Lightbulb,
	Moon,
	Route,
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
							<Link href="/new">
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
									<LayoutGrid className="size-4.5 text-white" />
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
			<main className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 lg:px-8">
				{/* Premium Tab Navigation */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-6"
				>
					{/* Desktop Tabs - Premium Glass Morphism */}
					<div className="hidden md:block">
						<div className="relative rounded-2xl border border-white/20 bg-gradient-to-b from-white/80 to-white/40 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:from-neutral-800/80 dark:to-neutral-900/60 dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
							{/* Inner glow effect */}
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/50 to-transparent opacity-60 dark:from-white/5" />
							<div className="relative flex gap-1.5">
								{canvasTypes.map((canvas, index) => {
									const Icon = canvas.icon;
									const isActive = activeCanvas === canvas.key;

									return (
										<motion.button
											key={canvas.key}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.05 * index }}
											whileHover={{ scale: 1.015, y: -2 }}
											whileTap={{ scale: 0.985 }}
											onClick={() => setActiveCanvas(canvas.key)}
											className={cn(
												"group relative flex flex-1 flex-col items-center gap-2.5 rounded-xl px-5 py-5 transition-all duration-300",
												isActive
													? "text-white"
													: "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
											)}
											type="button"
										>
											{isActive && (
												<motion.div
													layoutId="activeTab"
													className={cn(
														"absolute inset-0 rounded-xl",
														canvas.activeBg,
													)}
													style={{
														boxShadow: `0 8px 32px -4px var(--tw-shadow-color), 0 0 0 1px rgba(255,255,255,0.1) inset`,
													}}
													transition={{
														type: "spring",
														stiffness: 500,
														damping: 35,
													}}
												/>
											)}
											{/* Hover glow for inactive */}
											{!isActive && (
												<div className="absolute inset-0 rounded-xl bg-gradient-to-b from-neutral-100/0 to-neutral-100/0 opacity-0 transition-opacity duration-300 group-hover:from-neutral-100/80 group-hover:to-neutral-50/40 group-hover:opacity-100 dark:group-hover:from-neutral-700/50 dark:group-hover:to-neutral-800/30" />
											)}
											<div className="relative z-10 flex items-center gap-3">
												<div
													className={cn(
														"flex size-9 items-center justify-center rounded-lg transition-all duration-300",
														isActive
															? "bg-white/20 shadow-inner"
															: cn(
																	"bg-gradient-to-br shadow-sm",
																	canvas.lightBg,
																	"group-hover:scale-110 group-hover:shadow-md",
																),
													)}
												>
													<Icon
														className={cn(
															"size-4.5 transition-transform duration-300",
															isActive
																? "text-white"
																: `bg-gradient-to-br ${canvas.gradient} bg-clip-text text-transparent`,
														)}
														strokeWidth={2.5}
													/>
												</div>
												<span className="font-semibold text-sm tracking-tight">
													{canvas.label}
												</span>
											</div>
											<span
												className={cn(
													"relative z-10 text-center text-xs leading-relaxed transition-colors duration-300",
													isActive
														? "text-white/90"
														: "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300",
												)}
											>
												{canvas.description}
											</span>
										</motion.button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Mobile Tabs - Premium Pill Style */}
					<div className="flex gap-2 overflow-x-auto pb-2 md:hidden scrollbar-hide">
						{canvasTypes.map((canvas, index) => {
							const Icon = canvas.icon;
							const isActive = activeCanvas === canvas.key;

							return (
								<motion.button
									key={canvas.key}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.05 * index }}
									whileTap={{ scale: 0.92 }}
									onClick={() => setActiveCanvas(canvas.key)}
									className={cn(
										"relative flex flex-shrink-0 items-center gap-2.5 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300",
										isActive
											? cn(
													"text-white",
													canvas.activeBg,
													"shadow-lg",
													canvas.shadowColor,
												)
											: "border border-neutral-200/60 bg-white/80 text-neutral-600 shadow-sm backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-800/80 dark:text-neutral-300",
									)}
									type="button"
								>
									{isActive && (
										<div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-white/10" />
									)}
									<Icon className={cn("relative z-10 size-4", isActive && "drop-shadow-sm")} strokeWidth={2.5} />
									<span className="relative z-10">{canvas.shortLabel}</span>
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

				{/* Canvas Content Container - Premium Glass */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="relative overflow-hidden rounded-2xl border border-white/30 bg-gradient-to-b from-white/90 to-white/70 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:from-neutral-900/90 dark:to-neutral-950/80 dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] sm:p-6 lg:p-8"
				>
					{/* Subtle inner border glow */}
					<div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/50 dark:ring-white/5" />
					<AnimatePresence mode="wait">
						<motion.div
							key={activeCanvas}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{
								duration: 0.3,
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

				{/* Pro Tip - Minimalist */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4 }}
					className="mt-6 text-center"
				>
					<p className="text-xs font-medium tracking-wide text-neutral-400/80 dark:text-neutral-500/80">
						Export your work to save and share with your team
					</p>
				</motion.div>
			</main>

			{/* Footer - Minimal Premium */}
			<footer className="border-t border-neutral-200/30 bg-gradient-to-b from-transparent to-neutral-50/50 py-5 dark:border-neutral-800/30 dark:to-neutral-950/50">
				<div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
					<p className="text-neutral-400 text-xs font-medium tracking-wide dark:text-neutral-500">
						Strategy Canvas by{" "}
						<span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text font-semibold text-transparent">
							Alecci Media
						</span>
					</p>
				</div>
			</footer>
		</div>
	);
}
