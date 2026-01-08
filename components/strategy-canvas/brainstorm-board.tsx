"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Plus, Shuffle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasPanel } from "./canvas-panel";
import { NoteColorPicker, StickyNote } from "./sticky-note";
import type { NoteColor, StickyNote as StickyNoteType } from "./types";

const categories = [
	{ label: "Ideas", color: "blue" as NoteColor },
	{ label: "Questions", color: "purple" as NoteColor },
	{ label: "Actions", color: "emerald" as NoteColor },
	{ label: "Concerns", color: "rose" as NoteColor },
	{ label: "Resources", color: "amber" as NoteColor },
];

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
		<CanvasPanel
			title="Brainstorming Board"
			subtitle="Capture and organize your ideas freely"
			icon={<Lightbulb className="size-5" />}
			accentColor="amber"
			onReset={resetBoard}
			onExport={exportBoard}
		>
			{/* Toolbar */}
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50 sm:gap-4 sm:p-4">
				{/* Add new note */}
				<div className="flex items-center gap-3">
					<button
						className={cn(
							"flex items-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-all",
							"bg-gradient-to-r from-red-500 to-orange-500 text-white",
							"hover:from-red-500 hover:to-orange-600",
							"shadow-lg shadow-neutral-200/40 dark:shadow-neutral-900/30",
						)}
						onClick={addNote}
						type="button"
					>
						<Plus className="size-4" />
						Add Idea
					</button>
					<NoteColorPicker
						selected={selectedColor}
						onSelect={setSelectedColor}
					/>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<button
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-slate-500 text-sm transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-300"
						onClick={shuffleNotes}
						title="Shuffle notes"
						type="button"
					>
						<Shuffle className="size-4" />
						<span className="hidden sm:inline">Shuffle</span>
					</button>
					<button
						className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-red-500 text-sm transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-400"
						onClick={clearNotes}
						title="Clear all"
						type="button"
					>
						<Trash2 className="size-4" />
						<span className="hidden sm:inline">Clear</span>
					</button>
				</div>
			</div>

			{/* Category filters */}
			<div className="mb-4 flex flex-wrap gap-2">
				<button
					className={cn(
						"rounded-full px-3 py-1.5 text-xs font-medium transition-all",
						filterColor === "all"
							? "bg-slate-800 text-white dark:bg-white dark:text-slate-800"
							: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
					)}
					onClick={() => setFilterColor("all")}
					type="button"
				>
					All ({notes.length})
				</button>
				{categories.map((cat) => (
					<button
						key={cat.color}
						className={cn(
							"flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
							filterColor === cat.color
								? cat.color === "blue"
									? "bg-blue-500 text-white"
									: cat.color === "purple"
										? "bg-purple-500 text-white"
										: cat.color === "emerald"
											? "bg-emerald-500 text-white"
											: cat.color === "rose"
												? "bg-rose-500 text-white"
												: "bg-red-500 text-white"
								: "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700",
						)}
						onClick={() =>
							setFilterColor(filterColor === cat.color ? "all" : cat.color)
						}
						type="button"
					>
						<span
							className={cn(
								"size-2 rounded-full",
								filterColor === cat.color
									? "bg-white/80"
									: cat.color === "blue"
										? "bg-blue-400"
										: cat.color === "purple"
											? "bg-purple-400"
											: cat.color === "emerald"
												? "bg-emerald-400"
												: cat.color === "rose"
													? "bg-rose-400"
													: "bg-red-500",
							)}
						/>
						{cat.label} ({noteCounts[cat.color] ?? 0})
					</button>
				))}
			</div>

			{/* Canvas */}
			<div
				ref={canvasRef}
				className={cn(
					"relative min-h-[400px] overflow-hidden rounded-xl border-2 border-dashed sm:min-h-[500px]",
					"border-slate-200 dark:border-slate-700",
					"bg-gradient-to-br from-slate-50 via-white to-slate-50",
					"dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
				)}
				style={{
					backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
					backgroundSize: "20px 20px",
				}}
			>
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
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0 }}
						>
							<StickyNote
								note={note}
								onUpdate={updateNote}
								onDelete={deleteNote}
								onDragEnd={updateNotePosition}
								isDraggable
								className="w-36 sm:w-44"
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
							<div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-neutral-900/30 dark:to-orange-900/30">
								<Lightbulb className="size-8 text-red-500" />
							</div>
							<h3 className="mb-2 font-semibold text-lg text-slate-700 dark:text-slate-300">
								Start Brainstorming
							</h3>
							<p className="mb-4 max-w-xs text-slate-500 text-sm dark:text-slate-400">
								Click &quot;Add Idea&quot; to create sticky notes and drag them
								to organize your thoughts
							</p>
							<button
								className={cn(
									"flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all",
									"bg-gradient-to-r from-red-500 to-orange-500 text-white",
									"hover:from-red-500 hover:to-orange-600",
									"shadow-lg shadow-neutral-200/40 dark:shadow-neutral-900/30",
								)}
								onClick={addNote}
								type="button"
							>
								<Plus className="size-5" />
								Add Your First Idea
							</button>
						</motion.div>
					</div>
				)}
			</div>

			{/* Stats footer */}
			{notes.length > 0 && (
				<div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-800/50">
					<span className="text-slate-500 text-sm dark:text-slate-400">
						{notes.length} idea{notes.length !== 1 && "s"} captured
					</span>
					<div className="flex gap-2">
						{categories.map((cat) => {
							const count = noteCounts[cat.color] ?? 0;
							if (count === 0) return null;
							return (
								<span
									key={cat.color}
									className={cn(
										"rounded-full px-2 py-0.5 text-xs font-medium",
										cat.color === "blue" &&
											"bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
										cat.color === "purple" &&
											"bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
										cat.color === "emerald" &&
											"bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
										cat.color === "rose" &&
											"bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
										cat.color === "amber" &&
											"bg-red-100 text-red-700 dark:bg-neutral-900/30 dark:text-neutral-300",
									)}
								>
									{count}
								</span>
							);
						})}
					</div>
				</div>
			)}
		</CanvasPanel>
	);
}
