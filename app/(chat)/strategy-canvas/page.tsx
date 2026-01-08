"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	LayoutGrid,
	Lightbulb,
	Menu,
	Moon,
	Route,
	Sparkles,
	Sun,
	Target,
	X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BrainstormBoard } from "@/components/strategy-canvas/brainstorm-board";
import { BusinessModelCanvas } from "@/components/strategy-canvas/business-model-canvas";
import { CustomerJourney } from "@/components/strategy-canvas/customer-journey";
import { SwotBoard } from "@/components/strategy-canvas/swot-board";
import type { CanvasType } from "@/components/strategy-canvas/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const canvasTypes = [
	{
		key: "swot" as CanvasType,
		label: "SWOT Analysis",
		shortLabel: "SWOT",
		icon: Target,
		description: "Analyze strengths, weaknesses, opportunities & threats",
		color: "purple",
	},
	{
		key: "journey" as CanvasType,
		label: "Customer Journey",
		shortLabel: "Journey",
		icon: Route,
		description: "Map the customer experience across touchpoints",
		color: "blue",
	},
	{
		key: "bmc" as CanvasType,
		label: "Business Model Canvas",
		shortLabel: "BMC",
		icon: LayoutGrid,
		description: "Design and document your business model",
		color: "emerald",
	},
	{
		key: "brainstorm" as CanvasType,
		label: "Brainstorming",
		shortLabel: "Ideas",
		icon: Lightbulb,
		description: "Capture and organize your ideas freely",
		color: "amber",
	},
];

export default function StrategyCanvasPage() {
	const [activeCanvas, setActiveCanvas] = useState<CanvasType>("swot");
	const [isDark, setIsDark] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// SSR-safe dark mode detection
	useEffect(() => {
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	const toggleDarkMode = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		document.documentElement.classList.toggle("dark", newIsDark);
	};

	return (
		<div className="relative min-h-screen overflow-hidden">
			{/* Animated background */}
			<div className="fixed inset-0 -z-10">
				{/* Base gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30" />

				{/* Animated gradient orbs */}
				<motion.div
					className="absolute -top-40 -left-40 size-80 rounded-full bg-gradient-to-br from-rose-200/40 to-purple-200/40 blur-3xl dark:from-rose-900/20 dark:to-purple-900/20"
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
					className="absolute top-1/2 -right-40 size-96 rounded-full bg-gradient-to-br from-blue-200/40 to-emerald-200/40 blur-3xl dark:from-blue-900/20 dark:to-emerald-900/20"
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
				<motion.div
					className="absolute -bottom-20 left-1/3 size-72 rounded-full bg-gradient-to-br from-neutral-200/40 to-orange-200/40 blur-3xl dark:from-neutral-900/20 dark:to-orange-900/20"
					animate={{
						x: [0, 40, 0],
						y: [0, -40, 0],
					}}
					transition={{
						duration: 18,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Grid pattern */}
				<div
					className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
					style={{
						backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                              linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
						backgroundSize: "40px 40px",
					}}
				/>
			</div>

			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/70">
				<div className="container mx-auto px-4 py-4 sm:px-6">
					<div className="flex items-center justify-between">
						{/* Logo and Back */}
						<div className="flex items-center gap-4">
							<Link href="/">
								<Button className="gap-2" size="sm" variant="ghost">
									<ArrowLeft className="size-4" />
									<span className="hidden sm:inline">Back to Chat</span>
								</Button>
							</Link>
							<div className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
							<div className="hidden items-center gap-2 sm:flex">
								<Sparkles className="size-5 text-rose-500" />
								<h1 className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text font-bold text-lg text-transparent">
									Strategy Canvas
								</h1>
							</div>
						</div>

						{/* Desktop Navigation */}
						<nav className="hidden items-center gap-1 lg:flex">
							{canvasTypes.map((canvas) => {
								const Icon = canvas.icon;
								const isActive = activeCanvas === canvas.key;
								return (
									<button
										key={canvas.key}
										className={cn(
											"relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all",
											isActive
												? "text-slate-900 dark:text-white"
												: "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
										)}
										onClick={() => setActiveCanvas(canvas.key)}
										type="button"
									>
										{isActive && (
											<motion.div
												layoutId="activeTab"
												className={cn(
													"absolute inset-0 rounded-lg",
													canvas.color === "purple" &&
														"bg-purple-100 dark:bg-purple-900/30",
													canvas.color === "blue" &&
														"bg-blue-100 dark:bg-blue-900/30",
													canvas.color === "emerald" &&
														"bg-emerald-100 dark:bg-emerald-900/30",
													canvas.color === "amber" &&
														"bg-red-100 dark:bg-neutral-900/30",
												)}
												transition={{ type: "spring", duration: 0.5 }}
											/>
										)}
										<Icon
											className={cn(
												"relative size-4",
												isActive &&
													canvas.color === "purple" &&
													"text-purple-600 dark:text-purple-400",
												isActive &&
													canvas.color === "blue" &&
													"text-blue-600 dark:text-blue-400",
												isActive &&
													canvas.color === "emerald" &&
													"text-emerald-600 dark:text-emerald-400",
												isActive &&
													canvas.color === "amber" &&
													"text-red-600 dark:text-red-500",
											)}
										/>
										<span className="relative">{canvas.label}</span>
									</button>
								);
							})}
						</nav>

						{/* Actions */}
						<div className="flex items-center gap-2">
							<button
								className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
								onClick={toggleDarkMode}
								title={isDark ? "Light mode" : "Dark mode"}
								type="button"
							>
								{isDark ? (
									<Sun className="size-5" />
								) : (
									<Moon className="size-5" />
								)}
							</button>
							<button
								className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								type="button"
							>
								{isMobileMenuOpen ? (
									<X className="size-5" />
								) : (
									<Menu className="size-5" />
								)}
							</button>
						</div>
					</div>

					{/* Mobile Navigation */}
					<AnimatePresence>
						{isMobileMenuOpen && (
							<motion.nav
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								className="mt-4 overflow-hidden lg:hidden"
							>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{canvasTypes.map((canvas) => {
										const Icon = canvas.icon;
										const isActive = activeCanvas === canvas.key;
										return (
											<button
												key={canvas.key}
												className={cn(
													"flex flex-col items-center gap-1 rounded-xl p-3 transition-all",
													isActive
														? canvas.color === "purple"
															? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
															: canvas.color === "blue"
																? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
																: canvas.color === "emerald"
																	? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
																	: "bg-red-100 text-red-700 dark:bg-neutral-900/30 dark:text-neutral-300"
														: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
												)}
												onClick={() => {
													setActiveCanvas(canvas.key);
													setIsMobileMenuOpen(false);
												}}
												type="button"
											>
												<Icon className="size-5" />
												<span className="font-medium text-xs">
													{canvas.shortLabel}
												</span>
											</button>
										);
									})}
								</div>
							</motion.nav>
						)}
					</AnimatePresence>
				</div>
			</header>

			{/* Hero Section */}
			<section className="container mx-auto px-4 py-8 sm:px-6 sm:py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8 text-center sm:mb-12"
				>
					<h1 className="mb-3 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text font-bold text-3xl text-transparent dark:from-white dark:via-purple-200 dark:to-white sm:text-4xl lg:text-5xl">
						Strategic Planning Tools
					</h1>
					<p className="mx-auto max-w-2xl text-slate-600 text-sm dark:text-slate-400 sm:text-base">
						Visualize your strategy with interactive canvases. Analyze,
						brainstorm, and document your business decisions.
					</p>
				</motion.div>

				{/* Canvas selector cards - visible only on mobile when menu is closed */}
				<div className="mb-8 hidden">
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
						{canvasTypes.map((canvas, index) => {
							const Icon = canvas.icon;
							const isActive = activeCanvas === canvas.key;
							return (
								<motion.button
									key={canvas.key}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
									className={cn(
										"group relative overflow-hidden rounded-2xl border p-4 text-left transition-all sm:p-6",
										isActive
											? "border-transparent shadow-xl"
											: "border-slate-200/50 hover:border-slate-300 dark:border-slate-700/50 dark:hover:border-slate-600",
									)}
									onClick={() => setActiveCanvas(canvas.key)}
									type="button"
								>
									{/* Active background */}
									{isActive && (
										<motion.div
											layoutId="activeCard"
											className={cn(
												"absolute inset-0",
												canvas.color === "purple" &&
													"bg-gradient-to-br from-purple-100 to-violet-50 dark:from-purple-900/40 dark:to-violet-900/20",
												canvas.color === "blue" &&
													"bg-gradient-to-br from-blue-100 to-sky-50 dark:from-blue-900/40 dark:to-sky-900/20",
												canvas.color === "emerald" &&
													"bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20",
												canvas.color === "amber" &&
													"bg-gradient-to-br from-red-100 to-orange-50 dark:from-neutral-900/40 dark:to-orange-900/20",
											)}
										/>
									)}

									<div className="relative">
										<div
											className={cn(
												"mb-3 flex size-10 items-center justify-center rounded-xl transition-colors sm:size-12",
												canvas.color === "purple" &&
													"bg-purple-100 text-purple-600 group-hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-400",
												canvas.color === "blue" &&
													"bg-blue-100 text-blue-600 group-hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-400",
												canvas.color === "emerald" &&
													"bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400",
												canvas.color === "amber" &&
													"bg-red-100 text-red-600 group-hover:bg-neutral-200 dark:bg-neutral-900/50 dark:text-red-500",
											)}
										>
											<Icon className="size-5 sm:size-6" />
										</div>
										<h3 className="mb-1 font-semibold text-slate-800 text-sm dark:text-slate-200 sm:text-base">
											{canvas.label}
										</h3>
										<p className="line-clamp-2 text-slate-500 text-xs dark:text-slate-400">
											{canvas.description}
										</p>
									</div>
								</motion.button>
							);
						})}
					</div>
				</div>
			</section>

			{/* Canvas Content */}
			<section className="container mx-auto px-4 pb-12 sm:px-6 sm:pb-20">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeCanvas}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						{activeCanvas === "swot" && <SwotBoard />}
						{activeCanvas === "journey" && <CustomerJourney />}
						{activeCanvas === "bmc" && <BusinessModelCanvas />}
						{activeCanvas === "brainstorm" && <BrainstormBoard />}
					</motion.div>
				</AnimatePresence>
			</section>

			{/* Footer */}
			<footer className="border-t border-slate-200/50 bg-white/50 py-6 backdrop-blur-sm dark:border-slate-700/50 dark:bg-slate-900/50">
				<div className="container mx-auto px-4 text-center sm:px-6">
					<p className="text-slate-500 text-sm dark:text-slate-400">
						Strategy Canvas by{" "}
						<span className="font-semibold text-rose-600 dark:text-rose-400">
							Alecci Media
						</span>
					</p>
				</div>
			</footer>
		</div>
	);
}
