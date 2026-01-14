"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Cloud, Download, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StickyNote } from "./sticky-note";
import type {
	NoteColor,
	StickyNote as StickyNoteType,
	SwotData,
} from "./types";
import { useCanvasPersistence } from "./use-canvas-persistence";

const quadrants = [
	{
		key: "strengths" as const,
		label: "Strengths",
		subtitle: "Internal advantages",
		noteColor: "slate" as NoteColor,
	},
	{
		key: "weaknesses" as const,
		label: "Weaknesses",
		subtitle: "Internal challenges",
		noteColor: "slate" as NoteColor,
	},
	{
		key: "opportunities" as const,
		label: "Opportunities",
		subtitle: "External possibilities",
		noteColor: "slate" as NoteColor,
	},
	{
		key: "threats" as const,
		label: "Threats",
		subtitle: "External risks",
		noteColor: "slate" as NoteColor,
	},
];

const defaultData: SwotData = {
	strengths: [],
	weaknesses: [],
	opportunities: [],
	threats: [],
};

export function SwotBoard() {
	const { data, setData, isSaving, isLoading, lastSaved } =
		useCanvasPersistence<SwotData>({
			canvasType: "swot",
			defaultData,
		});
	const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);

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

	const totalNotes = Object.values(data).flat().length;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			{/* Executive Header */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
						SWOT Analysis
					</h2>
					<p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
						Strategic assessment of internal and external factors
					</p>
				</div>

				{/* Action Buttons with Save Status */}
				<div className="flex items-center gap-3">
					{/* Save Status */}
					<div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
						{isLoading ? (
							<>
								<Loader2 className="size-3 animate-spin" />
								<span>Loading...</span>
							</>
						) : isSaving ? (
							<>
								<Cloud className="size-3" />
								<span>Saving...</span>
							</>
						) : lastSaved ? (
							<>
								<Check className="size-3 text-emerald-500" />
								<span>Saved</span>
							</>
						) : null}
					</div>
					{lastSaved && <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />}
					<button
						className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
						onClick={resetBoard}
						type="button"
					>
						Reset
					</button>
					<div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
					<button
						className="flex items-center gap-2 text-sm font-medium text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
						onClick={exportBoard}
						type="button"
					>
						<Download className="size-4" />
						Export
					</button>
				</div>
			</div>

			{/* Summary line */}
			{totalNotes > 0 && (
				<div className="mb-6 text-sm text-neutral-500 dark:text-neutral-400">
					{totalNotes} {totalNotes === 1 ? "item" : "items"} captured
				</div>
			)}

			{/* SWOT Grid - Clean Executive Style */}
			<div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 sm:grid-cols-2">
				{quadrants.map((quadrant, index) => {
					const notes = data[quadrant.key];
					const isHovered = hoveredQuadrant === quadrant.key;

					return (
						<motion.div
							key={quadrant.key}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: index * 0.05 }}
							onHoverStart={() => setHoveredQuadrant(quadrant.key)}
							onHoverEnd={() => setHoveredQuadrant(null)}
							className={cn(
								"group relative min-h-[280px] bg-white p-6 transition-colors dark:bg-neutral-900 sm:min-h-[320px]",
								isHovered && "bg-neutral-50 dark:bg-neutral-900/80",
							)}
						>
							{/* Quadrant Header */}
							<div className="mb-5 flex items-start justify-between">
								<div>
									<h3 className="font-semibold text-lg text-neutral-900 dark:text-white">
										{quadrant.label}
									</h3>
									<p className="text-xs text-neutral-400 dark:text-neutral-500">
										{quadrant.subtitle}
									</p>
								</div>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={cn(
										"flex size-8 items-center justify-center rounded-lg transition-all",
										"text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600",
										"dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
									)}
									onClick={() => addNote(quadrant.key, quadrant.noteColor)}
									title="Add item"
									type="button"
								>
									<Plus className="size-4" />
								</motion.button>
							</div>

							{/* Notes */}
							<div className="space-y-2">
								<AnimatePresence mode="popLayout">
									{notes.map((note) => (
										<motion.div
											key={note.id}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
										>
											<StickyNote
												note={note}
												onUpdate={(id, content) =>
													updateNote(quadrant.key, id, content)
												}
												onDelete={(id) => deleteNote(quadrant.key, id)}
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</div>

							{/* Empty State */}
							{notes.length === 0 && (
								<motion.button
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									whileHover={{ scale: 1.01 }}
									whileTap={{ scale: 0.99 }}
									className={cn(
										"flex w-full items-center justify-center gap-2 rounded-lg py-8 text-sm transition-all",
										"border border-dashed border-neutral-200 dark:border-neutral-700",
										"text-neutral-400 hover:border-neutral-300 hover:text-neutral-500",
										"dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-neutral-400",
									)}
									onClick={() => addNote(quadrant.key, quadrant.noteColor)}
									type="button"
								>
									<Plus className="size-4" />
									Add {quadrant.label.toLowerCase().slice(0, -1)}
								</motion.button>
							)}
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
}
