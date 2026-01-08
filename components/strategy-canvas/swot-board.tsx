"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertTriangle,
	Download,
	Plus,
	RotateCcw,
	Shield,
	Sparkles,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
		subtitle: "Internal advantages that give you an edge",
		icon: Shield,
		gradient: "from-emerald-500 to-teal-600",
		bgGradient: "from-emerald-500/5 via-emerald-500/3 to-transparent",
		borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
		iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
		noteColor: "emerald" as NoteColor,
		glowColor: "shadow-emerald-500/10",
	},
	{
		key: "weaknesses" as const,
		label: "Weaknesses",
		subtitle: "Internal challenges to address",
		icon: AlertTriangle,
		gradient: "from-amber-500 to-orange-600",
		bgGradient: "from-amber-500/5 via-amber-500/3 to-transparent",
		borderColor: "border-amber-500/20 hover:border-amber-500/40",
		iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
		noteColor: "amber" as NoteColor,
		glowColor: "shadow-amber-500/10",
	},
	{
		key: "opportunities" as const,
		label: "Opportunities",
		subtitle: "External possibilities to capture",
		icon: TrendingUp,
		gradient: "from-blue-500 to-indigo-600",
		bgGradient: "from-blue-500/5 via-blue-500/3 to-transparent",
		borderColor: "border-blue-500/20 hover:border-blue-500/40",
		iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
		noteColor: "blue" as NoteColor,
		glowColor: "shadow-blue-500/10",
	},
	{
		key: "threats" as const,
		label: "Threats",
		subtitle: "External risks to mitigate",
		icon: Zap,
		gradient: "from-red-500 to-rose-600",
		bgGradient: "from-red-500/5 via-red-500/3 to-transparent",
		borderColor: "border-red-500/20 hover:border-red-500/40",
		iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
		noteColor: "rose" as NoteColor,
		glowColor: "shadow-red-500/10",
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
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 blur-xl opacity-40" />
						<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25">
							<Target className="size-7 text-white" />
						</div>
					</motion.div>
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
							SWOT Analysis
						</h2>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							Strategic analysis of internal and external factors
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
						onClick={resetBoard}
						type="button"
					>
						<RotateCcw className="size-4" />
						Reset
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-500/25 transition-all hover:shadow-red-500/40"
						onClick={exportBoard}
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
					<Sparkles className="size-4 text-red-500" />
					<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						{totalNotes} {totalNotes === 1 ? "item" : "items"} total
					</span>
				</div>
				<div className="hidden h-4 w-px bg-neutral-300 dark:bg-neutral-700 sm:block" />
				{quadrants.map((q) => {
					const count = data[q.key].length;
					if (count === 0) return null;
					return (
						<motion.div
							key={q.key}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className={cn(
								"flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
								q.key === "strengths" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
								q.key === "weaknesses" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
								q.key === "opportunities" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
								q.key === "threats" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
							)}
						>
							<q.icon className="size-3" />
							{count} {q.label}
						</motion.div>
					);
				})}
			</motion.div>

			{/* SWOT Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
				{quadrants.map((quadrant, index) => {
					const Icon = quadrant.icon;
					const notes = data[quadrant.key];
					const isHovered = hoveredQuadrant === quadrant.key;

					return (
						<motion.div
							key={quadrant.key}
							initial={{ opacity: 0, y: 30, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{
								delay: index * 0.1 + 0.2,
								type: "spring",
								stiffness: 100,
							}}
							onHoverStart={() => setHoveredQuadrant(quadrant.key)}
							onHoverEnd={() => setHoveredQuadrant(null)}
							className={cn(
								"group relative min-h-[280px] overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-xl transition-all duration-300 dark:bg-neutral-900/80 sm:min-h-[320px]",
								quadrant.borderColor,
								isHovered && quadrant.glowColor,
								isHovered && "shadow-2xl",
							)}
						>
							{/* Background Gradient */}
							<div
								className={cn(
									"absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity duration-300",
									quadrant.bgGradient,
									isHovered && "opacity-80",
								)}
							/>

							{/* Grid Pattern */}
							<div
								className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
								style={{
									backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
														linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
									backgroundSize: "24px 24px",
								}}
							/>

							{/* Content */}
							<div className="relative p-5">
								{/* Quadrant Header */}
								<div className="mb-5 flex items-start justify-between">
									<div className="flex items-center gap-3">
										<motion.div
											whileHover={{ scale: 1.1, rotate: 5 }}
											className={cn(
												"flex size-12 items-center justify-center rounded-xl shadow-lg",
												quadrant.iconBg,
											)}
										>
											<Icon className="size-6 text-white" />
										</motion.div>
										<div>
											<h3 className="font-bold text-lg text-neutral-800 dark:text-white">
												{quadrant.label}
											</h3>
											<p className="text-xs text-neutral-500 dark:text-neutral-400">
												{quadrant.subtitle}
											</p>
										</div>
									</div>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										className={cn(
											"flex size-10 items-center justify-center rounded-xl transition-all",
											"bg-white/80 shadow-md hover:shadow-lg dark:bg-neutral-800/80",
											"text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white",
										)}
										onClick={() => addNote(quadrant.key, quadrant.noteColor)}
										title="Add note"
										type="button"
									>
										<Plus className="size-5" />
									</motion.button>
								</div>

								{/* Notes Grid */}
								<div className="grid gap-3 sm:grid-cols-2">
									<AnimatePresence mode="popLayout">
										{notes.map((note, noteIndex) => (
											<motion.div
												key={note.id}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.8 }}
												transition={{ delay: noteIndex * 0.05 }}
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
									<motion.div
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
										className="flex min-h-[120px] items-center justify-center"
									>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											className={cn(
												"flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all",
												"border-2 border-dashed border-neutral-300 dark:border-neutral-600",
												"text-neutral-400 hover:border-neutral-400 hover:text-neutral-600",
												"dark:text-neutral-500 dark:hover:border-neutral-500 dark:hover:text-neutral-400",
												"hover:bg-white/50 dark:hover:bg-neutral-800/50",
											)}
											onClick={() => addNote(quadrant.key, quadrant.noteColor)}
											type="button"
										>
											<Plus className="size-4" />
											Add your first {quadrant.label.toLowerCase().slice(0, -1)}
										</motion.button>
									</motion.div>
								)}
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Color Picker Footer */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200/50 bg-white/50 px-5 py-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
			>
				<span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
					Default note color:
				</span>
				<NoteColorPicker selected={selectedColor} onSelect={setSelectedColor} />
			</motion.div>
		</motion.div>
	);
}
