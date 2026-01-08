"use client";

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { Check, GripVertical, Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { NoteColor, StickyNote as StickyNoteType } from "./types";

const colorClasses: Record<NoteColor, string> = {
	rose: "bg-gradient-to-br from-rose-200 via-rose-100 to-pink-100 dark:from-rose-900/80 dark:via-rose-800/70 dark:to-pink-900/60 border-rose-300/50 dark:border-rose-700/50 shadow-rose-200/40 dark:shadow-rose-900/40",
	amber:
		"bg-gradient-to-br from-neutral-200 via-red-100 to-yellow-100 dark:from-neutral-900/80 dark:via-neutral-800/70 dark:to-yellow-900/60 border-neutral-300/50 dark:border-red-700/50 shadow-neutral-200/40 dark:shadow-neutral-900/40",
	emerald:
		"bg-gradient-to-br from-emerald-200 via-emerald-100 to-teal-100 dark:from-emerald-900/80 dark:via-emerald-800/70 dark:to-teal-900/60 border-emerald-300/50 dark:border-emerald-700/50 shadow-emerald-200/40 dark:shadow-emerald-900/40",
	blue: "bg-gradient-to-br from-blue-200 via-blue-100 to-sky-100 dark:from-blue-900/80 dark:via-blue-800/70 dark:to-sky-900/60 border-blue-300/50 dark:border-blue-700/50 shadow-blue-200/40 dark:shadow-blue-900/40",
	purple:
		"bg-gradient-to-br from-purple-200 via-purple-100 to-violet-100 dark:from-purple-900/80 dark:via-purple-800/70 dark:to-violet-900/60 border-purple-300/50 dark:border-purple-700/50 shadow-purple-200/40 dark:shadow-purple-900/40",
	slate:
		"bg-gradient-to-br from-slate-200 via-slate-100 to-gray-100 dark:from-slate-800/80 dark:via-slate-700/70 dark:to-gray-800/60 border-slate-300/50 dark:border-slate-600/50 shadow-slate-200/40 dark:shadow-slate-900/40",
};

const accentColors: Record<NoteColor, string> = {
	rose: "text-rose-600 dark:text-rose-400",
	amber: "text-red-600 dark:text-red-500",
	emerald: "text-emerald-600 dark:text-emerald-400",
	blue: "text-blue-600 dark:text-blue-400",
	purple: "text-purple-600 dark:text-purple-400",
	slate: "text-slate-600 dark:text-slate-400",
};

interface StickyNoteProps {
	note: StickyNoteType;
	onUpdate: (id: string, content: string) => void;
	onDelete: (id: string) => void;
	onDragEnd?: (id: string, x: number, y: number) => void;
	isDraggable?: boolean;
	className?: string;
}

export function StickyNote({
	note,
	onUpdate,
	onDelete,
	onDragEnd,
	isDraggable = false,
	className,
}: StickyNoteProps) {
	const [isEditing, setIsEditing] = useState(!note.content);
	const [editContent, setEditContent] = useState(note.content);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const dragControls = useDragControls();

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			textareaRef.current.focus();
			textareaRef.current.select();
		}
	}, [isEditing]);

	const handleSave = () => {
		if (editContent.trim()) {
			onUpdate(note.id, editContent.trim());
			setIsEditing(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSave();
		}
		if (e.key === "Escape") {
			setEditContent(note.content);
			setIsEditing(false);
		}
	};

	return (
		<motion.div
			className={cn(
				"group relative rounded-lg border p-3 shadow-lg backdrop-blur-sm transition-all",
				"hover:shadow-xl hover:scale-[1.02]",
				colorClasses[note.color],
				isDraggable && "cursor-grab active:cursor-grabbing",
				className,
			)}
			drag={isDraggable}
			dragControls={dragControls}
			dragMomentum={false}
			dragElastic={0.1}
			initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
			animate={{
				opacity: 1,
				scale: 1,
				rotate: Math.random() * 4 - 2,
			}}
			exit={{ opacity: 0, scale: 0.8 }}
			whileHover={{ rotate: 0, scale: 1.02 }}
			whileDrag={{ scale: 1.05, rotate: 0, zIndex: 50 }}
			onDragEnd={(_e, info) => {
				if (onDragEnd) {
					onDragEnd(note.id, info.point.x, info.point.y);
				}
			}}
			layout
		>
			{/* Decorative tape effect */}
			<div className="absolute -top-2 left-1/2 h-4 w-8 -translate-x-1/2 rounded-sm bg-gradient-to-b from-white/60 to-white/30 dark:from-white/20 dark:to-white/5 shadow-sm" />

			{/* Action buttons */}
			<div className="absolute -top-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
				{!isEditing && (
					<button
						className={cn(
							"rounded-full p-1 transition-colors hover:bg-white/50 dark:hover:bg-black/30",
							accentColors[note.color],
						)}
						onClick={() => setIsEditing(true)}
						type="button"
					>
						<Pencil className="size-3" />
					</button>
				)}
				<button
					className="rounded-full p-1 text-red-500 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
					onClick={() => onDelete(note.id)}
					type="button"
				>
					<X className="size-3" />
				</button>
			</div>

			{/* Drag handle */}
			{isDraggable && (
				<div
					className="absolute top-1 left-1 cursor-grab opacity-0 transition-opacity group-hover:opacity-60"
					onPointerDown={(e) => dragControls.start(e)}
				>
					<GripVertical className="size-4 text-slate-500" />
				</div>
			)}

			{/* Content */}
			<AnimatePresence mode="wait">
				{isEditing ? (
					<motion.div
						key="editing"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex flex-col gap-2"
					>
						<textarea
							ref={textareaRef}
							className="min-h-[60px] w-full resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
							placeholder="Add your idea..."
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={handleSave}
						/>
						<div className="flex justify-end">
							<button
								className={cn(
									"rounded-full p-1.5 transition-colors",
									"bg-white/50 hover:bg-white/80 dark:bg-black/30 dark:hover:bg-black/50",
									accentColors[note.color],
								)}
								onClick={handleSave}
								type="button"
							>
								<Check className="size-3.5" />
							</button>
						</div>
					</motion.div>
				) : (
					<motion.p
						key="display"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="text-sm leading-relaxed text-slate-700 dark:text-slate-200"
					>
						{note.content}
					</motion.p>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

// Color picker for notes
interface ColorPickerProps {
	selected: NoteColor;
	onSelect: (color: NoteColor) => void;
}

export function NoteColorPicker({ selected, onSelect }: ColorPickerProps) {
	const colors: NoteColor[] = [
		"rose",
		"amber",
		"emerald",
		"blue",
		"purple",
		"slate",
	];

	return (
		<div className="flex gap-1.5">
			{colors.map((color) => (
				<button
					key={color}
					className={cn(
						"size-5 rounded-full border-2 transition-all",
						color === "rose" && "bg-rose-400 dark:bg-rose-600",
						color === "amber" && "bg-red-500 dark:bg-red-600",
						color === "emerald" && "bg-emerald-400 dark:bg-emerald-600",
						color === "blue" && "bg-blue-400 dark:bg-blue-600",
						color === "purple" && "bg-purple-400 dark:bg-purple-600",
						color === "slate" && "bg-slate-400 dark:bg-slate-600",
						selected === color
							? "border-slate-800 dark:border-white scale-110"
							: "border-transparent hover:scale-105",
					)}
					onClick={() => onSelect(color)}
					type="button"
				/>
			))}
		</div>
	);
}
