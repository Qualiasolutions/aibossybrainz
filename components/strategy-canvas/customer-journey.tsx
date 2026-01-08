"use client";

import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
	AlertCircle,
	Eye,
	GripVertical,
	Heart,
	Lightbulb,
	Megaphone,
	Plus,
	Route,
	Scale,
	Search,
	ShoppingCart,
	Sparkles,
	X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasPanel } from "./canvas-panel";
import type { JourneyStage, JourneyTouchpoint } from "./types";

const stages: {
	key: JourneyStage;
	label: string;
	icon: typeof Eye;
	color: string;
}[] = [
	{
		key: "awareness",
		label: "Awareness",
		icon: Eye,
		color: "rose",
	},
	{
		key: "consideration",
		label: "Consideration",
		icon: Search,
		color: "amber",
	},
	{
		key: "decision",
		label: "Decision",
		icon: Scale,
		color: "emerald",
	},
	{
		key: "purchase",
		label: "Purchase",
		icon: ShoppingCart,
		color: "blue",
	},
	{
		key: "retention",
		label: "Retention",
		icon: Heart,
		color: "purple",
	},
	{
		key: "advocacy",
		label: "Advocacy",
		icon: Megaphone,
		color: "pink",
	},
];

const touchpointTypes = [
	{
		type: "touchpoint" as const,
		label: "Touchpoint",
		icon: Sparkles,
		color: "blue",
	},
	{
		type: "pain" as const,
		label: "Pain Point",
		icon: AlertCircle,
		color: "rose",
	},
	{
		type: "opportunity" as const,
		label: "Opportunity",
		icon: Lightbulb,
		color: "amber",
	},
];

export function CustomerJourney() {
	const [touchpoints, setTouchpoints] = useState<JourneyTouchpoint[]>([]);
	const [addingTo, setAddingTo] = useState<JourneyStage | null>(null);
	const [newContent, setNewContent] = useState("");
	const [newType, setNewType] =
		useState<JourneyTouchpoint["type"]>("touchpoint");

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

	return (
		<CanvasPanel
			title="Customer Journey Map"
			subtitle="Map the customer experience across stages"
			icon={<Route className="size-5" />}
			accentColor="blue"
			onReset={resetJourney}
			onExport={exportJourney}
		>
			{/* Journey Timeline */}
			<div className="relative">
				{/* Progress line */}
				<div className="absolute top-8 left-0 hidden h-1 w-full bg-gradient-to-r from-rose-300 via-emerald-300 to-purple-300 opacity-30 dark:from-rose-700 dark:via-emerald-700 dark:to-purple-700 lg:block" />

				{/* Stages */}
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
					{stages.map((stage, index) => {
						const Icon = stage.icon;
						const stageTouchpoints = getTouchpointsForStage(stage.key);

						return (
							<motion.div
								key={stage.key}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.08 }}
								className="relative"
							>
								{/* Stage Header */}
								<div className="relative z-10 mb-3 flex flex-col items-center">
									<div
										className={cn(
											"mb-2 flex size-14 items-center justify-center rounded-2xl shadow-lg transition-transform hover:scale-105 sm:size-16",
											stage.color === "rose" &&
												"bg-gradient-to-br from-rose-400 to-pink-500 text-white",
											stage.color === "amber" &&
												"bg-gradient-to-br from-red-500 to-orange-500 text-white",
											stage.color === "emerald" &&
												"bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
											stage.color === "blue" &&
												"bg-gradient-to-br from-blue-400 to-indigo-500 text-white",
											stage.color === "purple" &&
												"bg-gradient-to-br from-purple-400 to-violet-500 text-white",
											stage.color === "pink" &&
												"bg-gradient-to-br from-pink-400 to-rose-500 text-white",
										)}
									>
										<Icon className="size-6 sm:size-7" />
									</div>
									<h3 className="text-center font-semibold text-slate-700 text-xs dark:text-slate-300 sm:text-sm">
										{stage.label}
									</h3>
								</div>

								{/* Stage Content */}
								<div
									className={cn(
										"min-h-[180px] rounded-xl border p-3",
										"bg-white/50 dark:bg-slate-800/50",
										"border-slate-200/50 dark:border-slate-700/50",
									)}
								>
									{/* Touchpoints */}
									<div className="space-y-2">
										<AnimatePresence>
											{stageTouchpoints.map((tp) => {
												const typeConfig = touchpointTypes.find(
													(t) => t.type === tp.type,
												);
												const TypeIcon = typeConfig?.icon ?? Sparkles;

												return (
													<motion.div
														key={tp.id}
														initial={{ opacity: 0, scale: 0.9 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.9 }}
														className={cn(
															"group relative rounded-lg p-2 text-xs shadow-sm",
															tp.type === "touchpoint" &&
																"bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
															tp.type === "pain" &&
																"bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
															tp.type === "opportunity" &&
																"bg-red-50 text-red-700 dark:bg-neutral-900/30 dark:text-neutral-300",
														)}
													>
														<div className="flex items-start gap-1.5">
															<TypeIcon className="mt-0.5 size-3 flex-shrink-0" />
															<span className="leading-tight">
																{tp.content}
															</span>
														</div>
														<button
															className="absolute top-1 right-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
															onClick={() => deleteTouchpoint(tp.id)}
															type="button"
														>
															<X className="size-3" />
														</button>
													</motion.div>
												);
											})}
										</AnimatePresence>
									</div>

									{/* Add button or form */}
									{addingTo === stage.key ? (
										<motion.div
											initial={{ opacity: 0, y: 5 }}
											animate={{ opacity: 1, y: 0 }}
											className="mt-2 space-y-2"
										>
											<input
												autoFocus
												className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:border-slate-600 dark:bg-slate-700"
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
											<div className="flex gap-1">
												{touchpointTypes.map((type) => (
													<button
														key={type.type}
														className={cn(
															"flex-1 rounded px-1 py-1 text-xs transition-colors",
															newType === type.type
																? type.color === "blue"
																	? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
																	: type.color === "rose"
																		? "bg-rose-100 text-rose-700 dark:bg-rose-800 dark:text-rose-200"
																		: "bg-red-100 text-red-700 dark:bg-neutral-800 dark:text-neutral-200"
																: "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-400",
														)}
														onClick={() => setNewType(type.type)}
														type="button"
													>
														{type.label}
													</button>
												))}
											</div>
											<div className="flex gap-1">
												<button
													className="flex-1 rounded bg-blue-500 py-1 text-xs text-white hover:bg-blue-600"
													onClick={() => addTouchpoint(stage.key)}
													type="button"
												>
													Add
												</button>
												<button
													className="flex-1 rounded bg-slate-200 py-1 text-xs text-slate-600 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300"
													onClick={() => {
														setAddingTo(null);
														setNewContent("");
													}}
													type="button"
												>
													Cancel
												</button>
											</div>
										</motion.div>
									) : (
										<button
											className={cn(
												"mt-2 flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs transition-colors",
												"border border-dashed border-slate-300 dark:border-slate-600",
												"text-slate-400 hover:border-slate-400 hover:text-slate-600",
												"dark:text-slate-500 dark:hover:border-slate-500 dark:hover:text-slate-400",
											)}
											onClick={() => setAddingTo(stage.key)}
											type="button"
										>
											<Plus className="size-3" />
											Add
										</button>
									)}
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Legend */}
			<div className="mt-6 flex flex-wrap items-center justify-center gap-4 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
				{touchpointTypes.map((type) => {
					const Icon = type.icon;
					return (
						<div key={type.type} className="flex items-center gap-1.5 text-xs">
							<div
								className={cn(
									"flex size-5 items-center justify-center rounded",
									type.color === "blue" &&
										"bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
									type.color === "rose" &&
										"bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
									type.color === "amber" &&
										"bg-red-100 text-red-600 dark:bg-neutral-900/50 dark:text-red-500",
								)}
							>
								<Icon className="size-3" />
							</div>
							<span className="text-slate-600 dark:text-slate-400">
								{type.label}
							</span>
						</div>
					);
				})}
			</div>
		</CanvasPanel>
	);
}
