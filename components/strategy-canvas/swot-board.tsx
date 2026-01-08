"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertTriangle,
	Plus,
	Shield,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasPanel } from "./canvas-panel";
import { NoteColorPicker, StickyNote } from "./sticky-note";
import type {
	NoteColor,
	StickyNote as StickyNoteType,
	SwotData,
} from "./types";

const quadrants = [
	{
		key: "strengths" as const,
		label: "Strengths",
		subtitle: "Internal advantages",
		icon: Shield,
		color: "emerald" as const,
		bgClass:
			"bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/20",
		borderClass: "border-emerald-200/50 dark:border-emerald-800/30",
		noteColor: "emerald" as NoteColor,
	},
	{
		key: "weaknesses" as const,
		label: "Weaknesses",
		subtitle: "Internal challenges",
		icon: AlertTriangle,
		color: "amber" as const,
		bgClass:
			"bg-gradient-to-br from-red-50/50 to-orange-50/30 dark:from-neutral-950/30 dark:to-orange-950/20",
		borderClass: "border-neutral-200/50 dark:border-neutral-800/30",
		noteColor: "amber" as NoteColor,
	},
	{
		key: "opportunities" as const,
		label: "Opportunities",
		subtitle: "External possibilities",
		icon: TrendingUp,
		color: "blue" as const,
		bgClass:
			"bg-gradient-to-br from-blue-50/50 to-sky-50/30 dark:from-blue-950/30 dark:to-sky-950/20",
		borderClass: "border-blue-200/50 dark:border-blue-800/30",
		noteColor: "blue" as NoteColor,
	},
	{
		key: "threats" as const,
		label: "Threats",
		subtitle: "External risks",
		icon: Zap,
		color: "rose" as const,
		bgClass:
			"bg-gradient-to-br from-rose-50/50 to-pink-50/30 dark:from-rose-950/30 dark:to-pink-950/20",
		borderClass: "border-rose-200/50 dark:border-rose-800/30",
		noteColor: "rose" as NoteColor,
	},
];

const defaultData: SwotData = {
	strengths: [],
	weaknesses: [],
	opportunities: [],
	threats: [],
};

export function SwotBoard() {
	const [data, setData] = useState<SwotData>(defaultData);
	const [selectedColor, setSelectedColor] = useState<NoteColor>("rose");

	const generateId = () =>
		`note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const addNote = (quadrant: keyof SwotData, color: NoteColor) => {
		const newNote: StickyNoteType = {
			id: generateId(),
			content: "",
			color,
		};
		setData((prev) => ({
			...prev,
			[quadrant]: [...prev[quadrant], newNote],
		}));
	};

	const updateNote = (
		quadrant: keyof SwotData,
		id: string,
		content: string,
	) => {
		setData((prev) => ({
			...prev,
			[quadrant]: prev[quadrant].map((note) =>
				note.id === id ? { ...note, content } : note,
			),
		}));
	};

	const deleteNote = (quadrant: keyof SwotData, id: string) => {
		setData((prev) => ({
			...prev,
			[quadrant]: prev[quadrant].filter((note) => note.id !== id),
		}));
	};

	const resetBoard = () => {
		setData(defaultData);
	};

	const exportBoard = () => {
		const exportData = {
			type: "SWOT Analysis",
			exportedAt: new Date().toISOString(),
			data: Object.fromEntries(
				Object.entries(data).map(([key, notes]) => [
					key,
					notes.map((n: { content: string }) => n.content).filter(Boolean),
				]),
			),
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `swot-analysis-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<CanvasPanel
			title="SWOT Analysis"
			subtitle="Analyze internal and external factors"
			icon={<Target className="size-5" />}
			accentColor="purple"
			onReset={resetBoard}
			onExport={exportBoard}
		>
			{/* SWOT Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{quadrants.map((quadrant, index) => {
					const Icon = quadrant.icon;
					const notes = data[quadrant.key];

					return (
						<motion.div
							key={quadrant.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={cn(
								"relative min-h-[200px] rounded-xl border p-4 sm:min-h-[280px]",
								quadrant.bgClass,
								quadrant.borderClass,
							)}
						>
							{/* Quadrant Header */}
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div
										className={cn(
											"flex size-8 items-center justify-center rounded-lg",
											quadrant.color === "emerald" &&
												"bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
											quadrant.color === "amber" &&
												"bg-red-100 text-red-600 dark:bg-neutral-900/50 dark:text-red-500",
											quadrant.color === "blue" &&
												"bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
											quadrant.color === "rose" &&
												"bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
										)}
									>
										<Icon className="size-4" />
									</div>
									<div>
										<h3 className="font-semibold text-slate-800 dark:text-slate-200">
											{quadrant.label}
										</h3>
										<p className="text-xs text-slate-500 dark:text-slate-400">
											{quadrant.subtitle}
										</p>
									</div>
								</div>
								<button
									className={cn(
										"flex size-8 items-center justify-center rounded-lg transition-all",
										"bg-white/60 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800",
										"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
										"shadow-sm hover:shadow",
									)}
									onClick={() => addNote(quadrant.key, quadrant.noteColor)}
									title="Add note"
									type="button"
								>
									<Plus className="size-4" />
								</button>
							</div>

							{/* Notes Grid */}
							<div className="grid gap-3 sm:grid-cols-2">
								<AnimatePresence>
									{notes.map((note) => (
										<StickyNote
											key={note.id}
											note={note}
											onUpdate={(id, content) =>
												updateNote(quadrant.key, id, content)
											}
											onDelete={(id) => deleteNote(quadrant.key, id)}
										/>
									))}
								</AnimatePresence>
							</div>

							{/* Empty state */}
							{notes.length === 0 && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex h-24 items-center justify-center"
								>
									<button
										className={cn(
											"flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all",
											"border border-dashed border-slate-300 dark:border-slate-600",
											"text-slate-400 hover:border-slate-400 hover:text-slate-600",
											"dark:text-slate-500 dark:hover:border-slate-500 dark:hover:text-slate-400",
										)}
										onClick={() => addNote(quadrant.key, quadrant.noteColor)}
										type="button"
									>
										<Plus className="size-4" />
										Add {quadrant.label.toLowerCase().slice(0, -1)}
									</button>
								</motion.div>
							)}
						</motion.div>
					);
				})}
			</div>

			{/* Color picker footer */}
			<div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
				<span className="text-sm text-slate-500 dark:text-slate-400">
					Note color:
				</span>
				<NoteColorPicker selected={selectedColor} onSelect={setSelectedColor} />
			</div>
		</CanvasPanel>
	);
}
