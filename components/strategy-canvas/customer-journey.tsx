"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	ArrowRight,
	Download,
	Eye,
	Heart,
	Lightbulb,
	Megaphone,
	Plus,
	RotateCcw,
	Route,
	Scale,
	Search,
	ShoppingCart,
	Sparkles,
	X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { JourneyStage, JourneyTouchpoint } from "./types";

const stages: {
	key: JourneyStage;
	label: string;
	description: string;
	icon: typeof Eye;
	gradient: string;
	bgGradient: string;
	iconBg: string;
	borderColor: string;
}[] = [
	{
		key: "awareness",
		label: "Awareness",
		description: "First contact",
		icon: Eye,
		gradient: "from-rose-500 to-pink-600",
		bgGradient: "from-rose-500/10 via-rose-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-rose-500 to-pink-600",
		borderColor: "border-rose-500/30",
	},
	{
		key: "consideration",
		label: "Consideration",
		description: "Research phase",
		icon: Search,
		gradient: "from-amber-500 to-orange-600",
		bgGradient: "from-amber-500/10 via-amber-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
		borderColor: "border-amber-500/30",
	},
	{
		key: "decision",
		label: "Decision",
		description: "Evaluation",
		icon: Scale,
		gradient: "from-emerald-500 to-teal-600",
		bgGradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
		borderColor: "border-emerald-500/30",
	},
	{
		key: "purchase",
		label: "Purchase",
		description: "Conversion",
		icon: ShoppingCart,
		gradient: "from-blue-500 to-indigo-600",
		bgGradient: "from-blue-500/10 via-blue-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
		borderColor: "border-blue-500/30",
	},
	{
		key: "retention",
		label: "Retention",
		description: "Loyalty",
		icon: Heart,
		gradient: "from-purple-500 to-violet-600",
		bgGradient: "from-purple-500/10 via-purple-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
		borderColor: "border-purple-500/30",
	},
	{
		key: "advocacy",
		label: "Advocacy",
		description: "Referrals",
		icon: Megaphone,
		gradient: "from-pink-500 to-rose-600",
		bgGradient: "from-pink-500/10 via-pink-500/5 to-transparent",
		iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
		borderColor: "border-pink-500/30",
	},
];

const touchpointTypes = [
	{
		type: "touchpoint" as const,
		label: "Touchpoint",
		icon: Sparkles,
		bgClass: "bg-blue-50 dark:bg-blue-900/30",
		textClass: "text-blue-700 dark:text-blue-300",
		borderClass: "border-blue-200 dark:border-blue-800",
	},
	{
		type: "pain" as const,
		label: "Pain Point",
		icon: AlertCircle,
		bgClass: "bg-red-50 dark:bg-red-900/30",
		textClass: "text-red-700 dark:text-red-300",
		borderClass: "border-red-200 dark:border-red-800",
	},
	{
		type: "opportunity" as const,
		label: "Opportunity",
		icon: Lightbulb,
		bgClass: "bg-amber-50 dark:bg-amber-900/30",
		textClass: "text-amber-700 dark:text-amber-300",
		borderClass: "border-amber-200 dark:border-amber-800",
	},
];

export function CustomerJourney() {
	const [touchpoints, setTouchpoints] = useState<JourneyTouchpoint[]>([]);
	const [addingTo, setAddingTo] = useState<JourneyStage | null>(null);
	const [newContent, setNewContent] = useState("");
	const [newType, setNewType] =
		useState<JourneyTouchpoint["type"]>("touchpoint");
	const [hoveredStage, setHoveredStage] = useState<string | null>(null);

	const generateId = () =>
		`tp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const addTouchpoint = (stage: JourneyStage) => {
		if (!newContent.trim()) return;

		const newTouchpoint: JourneyTouchpoint = {
			id: generateId(),
			stage,
			content: newContent.trim(),
			type: newType,
		};

		setTouchpoints((prev) => [...prev, newTouchpoint]);
		setNewContent("");
		setAddingTo(null);
		setNewType("touchpoint");
	};

	const deleteTouchpoint = (id: string) => {
		setTouchpoints((prev) => prev.filter((tp) => tp.id !== id));
	};

	const getTouchpointsForStage = (stage: JourneyStage) => {
		return touchpoints.filter((tp) => tp.stage === stage);
	};

	const resetJourney = () => {
		setTouchpoints([]);
	};

	const exportJourney = () => {
		const exportData = {
			type: "Customer Journey Map",
			exportedAt: new Date().toISOString(),
			stages: stages.map((stage) => ({
				name: stage.label,
				touchpoints: getTouchpointsForStage(stage.key).map((tp) => ({
					content: tp.content,
					type: tp.type,
				})),
			})),
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `customer-journey-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const totalTouchpoints = touchpoints.length;
	const painPoints = touchpoints.filter((tp) => tp.type === "pain").length;
	const opportunities = touchpoints.filter((tp) => tp.type === "opportunity").length;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative"
		>
			{/* Premium Header */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", delay: 0.2 }}
						className="relative"
					>
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 blur-xl opacity-40" />
						<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
							<Route className="size-7 text-white" />
						</div>
					</motion.div>
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
							Customer Journey Map
						</h2>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							Map the complete customer experience across touchpoints
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
						onClick={resetJourney}
						type="button"
					>
						<RotateCcw className="size-4" />
						Reset
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
						onClick={exportJourney}
						type="button"
					>
						<Download className="size-4" />
						Export
					</motion.button>
				</div>
			</div>

			{/* Stats Bar */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200/50 bg-white/50 p-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
			>
				<div className="flex items-center gap-2">
					<Sparkles className="size-4 text-blue-500" />
					<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						{totalTouchpoints} touchpoints mapped
					</span>
				</div>
				{painPoints > 0 && (
					<>
						<div className="hidden h-4 w-px bg-neutral-300 dark:bg-neutral-700 sm:block" />
						<div className="flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
							<AlertCircle className="size-3" />
							{painPoints} pain {painPoints === 1 ? "point" : "points"}
						</div>
					</>
				)}
				{opportunities > 0 && (
					<div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
						<Lightbulb className="size-3" />
						{opportunities} {opportunities === 1 ? "opportunity" : "opportunities"}
					</div>
				)}
			</motion.div>

			{/* Journey Timeline */}
			<div className="relative">
				{/* Progress line - Desktop only */}
				<div className="absolute top-[4.5rem] left-8 right-8 hidden h-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800 lg:block">
					<motion.div
						className="h-full bg-gradient-to-r from-rose-500 via-emerald-500 to-purple-500"
						initial={{ width: "0%" }}
						animate={{ width: "100%" }}
						transition={{ duration: 1.5, delay: 0.5 }}
					/>
				</div>

				{/* Connecting arrows between stages - Desktop */}
				<div className="absolute top-[4.5rem] left-0 right-0 hidden lg:flex items-center justify-between px-16">
					{stages.slice(0, -1).map((_, index) => (
						<motion.div
							key={`arrow-${index}`}
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.8 + index * 0.1 }}
							className="flex-1 flex justify-center"
						>
							<ArrowRight className="size-5 text-neutral-400 dark:text-neutral-600" />
						</motion.div>
					))}
				</div>

				{/* Stages Grid */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
					{stages.map((stage, index) => {
						const Icon = stage.icon;
						const stageTouchpoints = getTouchpointsForStage(stage.key);
						const isHovered = hoveredStage === stage.key;

						return (
							<motion.div
								key={stage.key}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 + 0.3 }}
								onHoverStart={() => setHoveredStage(stage.key)}
								onHoverEnd={() => setHoveredStage(null)}
								className="relative"
							>
								{/* Stage Header */}
								<div className="relative z-10 mb-4 flex flex-col items-center">
									<motion.div
										whileHover={{ scale: 1.1, y: -5 }}
										className={cn(
											"mb-3 flex size-16 items-center justify-center rounded-2xl shadow-lg transition-all sm:size-18",
											stage.iconBg,
											isHovered && "shadow-xl",
										)}
										style={{
											boxShadow: isHovered
												? `0 20px 40px -10px ${stage.gradient.includes("rose") ? "rgba(244, 63, 94, 0.3)" : stage.gradient.includes("amber") ? "rgba(245, 158, 11, 0.3)" : stage.gradient.includes("emerald") ? "rgba(16, 185, 129, 0.3)" : stage.gradient.includes("blue") ? "rgba(59, 130, 246, 0.3)" : stage.gradient.includes("purple") ? "rgba(139, 92, 246, 0.3)" : "rgba(236, 72, 153, 0.3)"}`
												: undefined,
										}}
									>
										<Icon className="size-7 text-white sm:size-8" />
									</motion.div>
									<h3 className="text-center font-bold text-neutral-800 text-sm dark:text-white sm:text-base">
										{stage.label}
									</h3>
									<p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
										{stage.description}
									</p>
								</div>

								{/* Stage Content Card */}
								<motion.div
									className={cn(
										"min-h-[200px] overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-xl transition-all duration-300 dark:bg-neutral-900/80",
										stage.borderColor,
										isHovered && "shadow-xl",
									)}
								>
									{/* Background Gradient */}
									<div
										className={cn(
											"absolute inset-0 bg-gradient-to-br opacity-30 transition-opacity duration-300",
											stage.bgGradient,
											isHovered && "opacity-50",
										)}
									/>

									<div className="relative p-4">
										{/* Touchpoints */}
										<div className="space-y-2.5">
											<AnimatePresence mode="popLayout">
												{stageTouchpoints.map((tp, tpIndex) => {
													const typeConfig = touchpointTypes.find(
														(t) => t.type === tp.type,
													);
													const TypeIcon = typeConfig?.icon ?? Sparkles;

													return (
														<motion.div
															key={tp.id}
															initial={{ opacity: 0, scale: 0.8, y: 10 }}
															animate={{ opacity: 1, scale: 1, y: 0 }}
															exit={{ opacity: 0, scale: 0.8 }}
															transition={{ delay: tpIndex * 0.05 }}
															className={cn(
																"group/item relative rounded-xl border p-3 shadow-sm transition-all hover:shadow-md",
																typeConfig?.bgClass,
																typeConfig?.borderClass,
															)}
														>
															<div className="flex items-start gap-2">
																<TypeIcon className={cn("mt-0.5 size-4 flex-shrink-0", typeConfig?.textClass)} />
																<span className={cn("text-xs leading-relaxed", typeConfig?.textClass)}>
																	{tp.content}
																</span>
															</div>
															<motion.button
																whileHover={{ scale: 1.1 }}
																whileTap={{ scale: 0.9 }}
																className="absolute top-2 right-2 rounded-lg p-1 opacity-0 transition-all hover:bg-black/10 group-hover/item:opacity-100"
																onClick={() => deleteTouchpoint(tp.id)}
																type="button"
															>
																<X className="size-3.5 text-neutral-500" />
															</motion.button>
														</motion.div>
													);
												})}
											</AnimatePresence>
										</div>

										{/* Add form or button */}
										{addingTo === stage.key ? (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className="mt-3 space-y-2.5"
											>
												<input
													autoFocus
													className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 dark:border-neutral-700 dark:bg-neutral-800"
													placeholder="Describe the touchpoint..."
													value={newContent}
													onChange={(e) => setNewContent(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") {
															addTouchpoint(stage.key);
														}
														if (e.key === "Escape") {
															setAddingTo(null);
															setNewContent("");
														}
													}}
												/>
												<div className="flex gap-1.5">
													{touchpointTypes.map((type) => (
														<button
															key={type.type}
															className={cn(
																"flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all",
																newType === type.type
																	? cn(type.bgClass, type.textClass, "ring-2 ring-offset-1", type.borderClass)
																	: "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400",
															)}
															onClick={() => setNewType(type.type)}
															type="button"
														>
															{type.label}
														</button>
													))}
												</div>
												<div className="flex gap-2">
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-xs font-medium text-white shadow-md"
														onClick={() => addTouchpoint(stage.key)}
														type="button"
													>
														Add
													</motion.button>
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														className="flex-1 rounded-xl bg-neutral-200 py-2.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
														onClick={() => {
															setAddingTo(null);
															setNewContent("");
														}}
														type="button"
													>
														Cancel
													</motion.button>
												</div>
											</motion.div>
										) : (
											<motion.button
												whileHover={{ scale: 1.02 }}
												whileTap={{ scale: 0.98 }}
												className={cn(
													"mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-all",
													"border-2 border-dashed border-neutral-200 dark:border-neutral-700",
													"text-neutral-400 hover:border-neutral-300 hover:text-neutral-600",
													"dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-neutral-400",
													"hover:bg-white/50 dark:hover:bg-neutral-800/50",
												)}
												onClick={() => setAddingTo(stage.key)}
												type="button"
											>
												<Plus className="size-4" />
												Add touchpoint
											</motion.button>
										)}
									</div>
								</motion.div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Legend */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8 }}
				className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-neutral-200/50 bg-white/50 px-6 py-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
			>
				{touchpointTypes.map((type) => {
					const Icon = type.icon;
					return (
						<div key={type.type} className="flex items-center gap-2">
							<div
								className={cn(
									"flex size-8 items-center justify-center rounded-lg border",
									type.bgClass,
									type.borderClass,
								)}
							>
								<Icon className={cn("size-4", type.textClass)} />
							</div>
							<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
								{type.label}
							</span>
						</div>
					);
				})}
			</motion.div>
		</motion.div>
	);
}
