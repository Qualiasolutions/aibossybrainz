"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Download,
	Lightbulb,
	Plus,
	RotateCcw,
	Shuffle,
	Sparkles,
	Trash2,
	Wand2,
} from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { NoteColorPicker, StickyNote } from "./sticky-note";
import type { NoteColor, StickyNote as StickyNoteType } from "./types";

const categories = [
	{ label: "Ideas", color: "blue" as NoteColor, icon: Lightbulb },
	{ label: "Questions", color: "purple" as NoteColor, icon: Sparkles },
	{ label: "Actions", color: "emerald" as NoteColor, icon: Wand2 },
	{ label: "Concerns", color: "rose" as NoteColor, icon: Sparkles },
	{ label: "Resources", color: "amber" as NoteColor, icon: Sparkles },
];

const categoryStyles: Record<NoteColor, { bg: string; text: string; border: string; activeBg: string }> = {
	blue: {
		bg: "bg-blue-100 dark:bg-blue-900/30",
		text: "text-blue-700 dark:text-blue-300",
		border: "border-blue-200 dark:border-blue-800",
		activeBg: "bg-blue-500",
	},
	purple: {
		bg: "bg-purple-100 dark:bg-purple-900/30",
		text: "text-purple-700 dark:text-purple-300",
		border: "border-purple-200 dark:border-purple-800",
		activeBg: "bg-purple-500",
	},
	emerald: {
		bg: "bg-emerald-100 dark:bg-emerald-900/30",
		text: "text-emerald-700 dark:text-emerald-300",
		border: "border-emerald-200 dark:border-emerald-800",
		activeBg: "bg-emerald-500",
	},
	rose: {
		bg: "bg-rose-100 dark:bg-rose-900/30",
		text: "text-rose-700 dark:text-rose-300",
		border: "border-rose-200 dark:border-rose-800",
		activeBg: "bg-rose-500",
	},
	amber: {
		bg: "bg-amber-100 dark:bg-amber-900/30",
		text: "text-amber-700 dark:text-amber-300",
		border: "border-amber-200 dark:border-amber-800",
		activeBg: "bg-amber-500",
	},
	slate: {
		bg: "bg-slate-100 dark:bg-slate-800/50",
		text: "text-slate-700 dark:text-slate-300",
		border: "border-slate-200 dark:border-slate-700",
		activeBg: "bg-slate-500",
	},
};

export function BrainstormBoard() {
	const [notes, setNotes] = useState<StickyNoteType[]>([]);
	const [selectedColor, setSelectedColor] = useState<NoteColor>("blue");
	const [filterColor, setFilterColor] = useState<NoteColor | "all">("all");
	const canvasRef = useRef<HTMLDivElement>(null);

	const generateId = () =>
		`brain-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const addNote = () => {
		const newNote: StickyNoteType = {
			id: generateId(),
			content: "",
			color: selectedColor,
			x: Math.random() * 60 + 10,
			y: Math.random() * 40 + 10,
		};
		setNotes((prev) => [...prev, newNote]);
	};

	const updateNote = (id: string, content: string) => {
		setNotes((prev) =>
			prev.map((note) => (note.id === id ? { ...note, content } : note)),
		);
	};

	const deleteNote = (id: string) => {
		setNotes((prev) => prev.filter((note) => note.id !== id));
	};

	const updateNotePosition = (id: string, x: number, y: number) => {
		if (!canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();
		const relX = ((x - rect.left) / rect.width) * 100;
		const relY = ((y - rect.top) / rect.height) * 100;

		setNotes((prev) =>
			prev.map((note) =>
				note.id === id
					? {
							...note,
							x: Math.max(0, Math.min(85, relX)),
							y: Math.max(0, Math.min(85, relY)),
						}
					: note,
			),
		);
	};

	const shuffleNotes = () => {
		setNotes((prev) =>
			prev.map((note) => ({
				...note,
				x: Math.random() * 70 + 5,
				y: Math.random() * 60 + 5,
			})),
		);
	};

	const clearNotes = () => {
		setNotes([]);
	};

	const resetBoard = () => {
		clearNotes();
		setSelectedColor("blue");
		setFilterColor("all");
	};

	const exportBoard = () => {
		const exportData = {
			type: "Brainstorming Board",
			exportedAt: new Date().toISOString(),
			notes: notes.map((n: { content: string; color: string }) => ({
				content: n.content,
				category: categories.find((c) => c.color === n.color)?.label ?? n.color,
			})),
			byCategory: categories.map((cat) => ({
				category: cat.label,
				notes: notes
					.filter((n) => n.color === cat.color)
					.map((n) => n.content)
					.filter(Boolean),
			})),
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `brainstorm-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const filteredNotes =
		filterColor === "all"
			? notes
			: notes.filter((note) => note.color === filterColor);

	const noteCounts = categories.reduce(
		(acc, cat) => ({
			...acc,
			[cat.color]: notes.filter((n) => n.color === cat.color).length,
		}),
		{} as Record<NoteColor, number>,
	);

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
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 blur-xl opacity-40" />
						<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
							<Lightbulb className="size-7 text-white" />
						</div>
					</motion.div>
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
							Brainstorming Board
						</h2>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							Capture and organize your ideas freely
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
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40"
						onClick={exportBoard}
						type="button"
					>
						<Download className="size-4" />
						Export
					</motion.button>
				</div>
			</div>

			{/* Toolbar */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-200/50 bg-white/50 p-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
			>
				{/* Add new note section */}
				<div className="flex items-center gap-4">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className={cn(
							"flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-sm transition-all",
							"bg-gradient-to-r from-amber-500 to-orange-600 text-white",
							"shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40",
						)}
						onClick={addNote}
						type="button"
					>
						<Plus className="size-5" />
						Add Idea
					</motion.button>
					<div className="hidden h-8 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />
					<div className="flex items-center gap-2">
						<span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Color:</span>
						<NoteColorPicker
							selected={selectedColor}
							onSelect={setSelectedColor}
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
						onClick={shuffleNotes}
						title="Shuffle notes"
						type="button"
					>
						<Shuffle className="size-4" />
						<span className="hidden sm:inline">Shuffle</span>
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
						onClick={clearNotes}
						title="Clear all"
						type="button"
					>
						<Trash2 className="size-4" />
						<span className="hidden sm:inline">Clear</span>
					</motion.button>
				</div>
			</motion.div>

			{/* Category filters */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="mb-6 flex flex-wrap gap-2"
			>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className={cn(
						"rounded-full px-4 py-2 text-sm font-medium transition-all",
						filterColor === "all"
							? "bg-neutral-900 text-white shadow-lg dark:bg-white dark:text-neutral-900"
							: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
					)}
					onClick={() => setFilterColor("all")}
					type="button"
				>
					All ({notes.length})
				</motion.button>
				{categories.map((cat) => {
					const style = categoryStyles[cat.color];
					const isActive = filterColor === cat.color;
					return (
						<motion.button
							key={cat.color}
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							className={cn(
								"flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
								isActive
									? `${style.activeBg} text-white shadow-lg`
									: "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
							)}
							onClick={() =>
								setFilterColor(filterColor === cat.color ? "all" : cat.color)
							}
							type="button"
						>
							<span
								className={cn(
									"size-2.5 rounded-full",
									isActive ? "bg-white/80" : style.activeBg,
								)}
							/>
							{cat.label} ({noteCounts[cat.color] ?? 0})
						</motion.button>
					);
				})}
			</motion.div>

			{/* Canvas */}
			<motion.div
				ref={canvasRef}
				initial={{ opacity: 0, scale: 0.98 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.5 }}
				className={cn(
					"relative min-h-[450px] overflow-hidden rounded-2xl border-2 sm:min-h-[550px]",
					"border-neutral-200 dark:border-neutral-800",
					"bg-gradient-to-br from-neutral-50 via-white to-amber-50/20",
					"dark:from-neutral-900 dark:via-neutral-900 dark:to-amber-950/10",
				)}
				style={{
					backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
					backgroundSize: "24px 24px",
				}}
			>
				{/* Decorative elements */}
				<div className="absolute top-4 right-4 text-xs font-medium text-neutral-300 dark:text-neutral-700">
					Drag to organize
				</div>

				{/* Floating notes */}
				<AnimatePresence>
					{filteredNotes.map((note) => (
						<motion.div
							key={note.id}
							className="absolute"
							style={{
								left: `${note.x ?? 10}%`,
								top: `${note.y ?? 10}%`,
							}}
							initial={{ opacity: 0, scale: 0, rotate: -10 }}
							animate={{ opacity: 1, scale: 1, rotate: 0 }}
							exit={{ opacity: 0, scale: 0, rotate: 10 }}
							transition={{ type: "spring", stiffness: 200 }}
						>
							<StickyNote
								note={note}
								onUpdate={updateNote}
								onDelete={deleteNote}
								onDragEnd={updateNotePosition}
								isDraggable
								className="w-40 sm:w-48"
							/>
						</motion.div>
					))}
				</AnimatePresence>

				{/* Empty state */}
				{notes.length === 0 && (
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center"
						>
							<motion.div
								animate={{
									y: [0, -10, 0],
									rotate: [0, 5, -5, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 shadow-xl shadow-amber-200/30 dark:from-amber-900/30 dark:to-orange-900/30 dark:shadow-amber-900/20"
							>
								<Lightbulb className="size-10 text-amber-600 dark:text-amber-400" />
							</motion.div>
							<h3 className="mb-2 font-bold text-xl text-neutral-800 dark:text-white">
								Start Brainstorming
							</h3>
							<p className="mb-6 max-w-sm text-neutral-500 text-sm dark:text-neutral-400">
								Click &quot;Add Idea&quot; to create sticky notes and drag them
								to organize your thoughts visually
							</p>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className={cn(
									"flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition-all",
									"bg-gradient-to-r from-amber-500 to-orange-600 text-white",
									"shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50",
								)}
								onClick={addNote}
								type="button"
							>
								<Plus className="size-5" />
								Add Your First Idea
							</motion.button>
						</motion.div>
					</div>
				)}
			</motion.div>

			{/* Stats footer */}
			{notes.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="mt-6 flex items-center justify-between rounded-2xl border border-neutral-200/50 bg-white/50 px-5 py-4 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
				>
					<div className="flex items-center gap-2">
						<Sparkles className="size-4 text-amber-500" />
						<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
							{notes.length} idea{notes.length !== 1 && "s"} captured
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{categories.map((cat) => {
							const count = noteCounts[cat.color] ?? 0;
							if (count === 0) return null;
							const style = categoryStyles[cat.color];
							return (
								<motion.span
									key={cat.color}
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className={cn(
										"rounded-full px-3 py-1 text-xs font-medium",
										style.bg,
										style.text,
									)}
								>
									{count} {cat.label}
								</motion.span>
							);
						})}
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}
