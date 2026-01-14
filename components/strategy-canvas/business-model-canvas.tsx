"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Cog,
	DollarSign,
	Download,
	Gem,
	Handshake,
	Heart,
	LayoutGrid,
	Package,
	PiggyBank,
	Plus,
	RotateCcw,
	Sparkles,
	Truck,
	Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { StickyNote } from "./sticky-note";
import type {
	BusinessModelData,
	NoteColor,
	StickyNote as StickyNoteType,
} from "./types";

const sections = [
	{
		key: "keyPartners" as const,
		label: "Key Partners",
		icon: Handshake,
		gradient: "from-purple-500 to-violet-600",
		bgGradient: "from-purple-500/5 via-purple-500/3 to-transparent",
		borderColor: "border-purple-500/20 hover:border-purple-500/40",
		iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
		noteColor: "purple" as NoteColor,
		questions: ["Who are our key partners?", "Who are our key suppliers?"],
	},
	{
		key: "keyActivities" as const,
		label: "Key Activities",
		icon: Cog,
		gradient: "from-blue-500 to-indigo-600",
		bgGradient: "from-blue-500/5 via-blue-500/3 to-transparent",
		borderColor: "border-blue-500/20 hover:border-blue-500/40",
		iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
		noteColor: "blue" as NoteColor,
		questions: ["What key activities does our value proposition require?"],
	},
	{
		key: "keyResources" as const,
		label: "Key Resources",
		icon: Package,
		gradient: "from-emerald-500 to-teal-600",
		bgGradient: "from-emerald-500/5 via-emerald-500/3 to-transparent",
		borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
		iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
		noteColor: "emerald" as NoteColor,
		questions: ["What key resources does our value proposition require?"],
	},
	{
		key: "valuePropositions" as const,
		label: "Value Propositions",
		icon: Gem,
		gradient: "from-red-500 to-rose-600",
		bgGradient: "from-red-500/5 via-red-500/3 to-transparent",
		borderColor: "border-red-500/20 hover:border-red-500/40",
		iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
		noteColor: "rose" as NoteColor,
		questions: ["What value do we deliver?", "What problem do we solve?"],
	},
	{
		key: "customerRelationships" as const,
		label: "Customer Relationships",
		icon: Heart,
		gradient: "from-pink-500 to-rose-600",
		bgGradient: "from-pink-500/5 via-pink-500/3 to-transparent",
		borderColor: "border-pink-500/20 hover:border-pink-500/40",
		iconBg: "bg-gradient-to-br from-pink-500 to-rose-600",
		noteColor: "rose" as NoteColor,
		questions: ["What type of relationship does each segment expect?"],
	},
	{
		key: "channels" as const,
		label: "Channels",
		icon: Truck,
		gradient: "from-amber-500 to-orange-600",
		bgGradient: "from-amber-500/5 via-amber-500/3 to-transparent",
		borderColor: "border-amber-500/20 hover:border-amber-500/40",
		iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
		noteColor: "amber" as NoteColor,
		questions: ["How do we reach our customer segments?"],
	},
	{
		key: "customerSegments" as const,
		label: "Customer Segments",
		icon: Users,
		gradient: "from-cyan-500 to-blue-600",
		bgGradient: "from-cyan-500/5 via-cyan-500/3 to-transparent",
		borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
		iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600",
		noteColor: "blue" as NoteColor,
		questions: [
			"For whom are we creating value?",
			"Who are our most important customers?",
		],
	},
	{
		key: "costStructure" as const,
		label: "Cost Structure",
		icon: PiggyBank,
		gradient: "from-slate-500 to-gray-600",
		bgGradient: "from-slate-500/5 via-slate-500/3 to-transparent",
		borderColor: "border-slate-500/20 hover:border-slate-500/40",
		iconBg: "bg-gradient-to-br from-slate-500 to-gray-600",
		noteColor: "slate" as NoteColor,
		questions: ["What are the most important costs?"],
	},
	{
		key: "revenueStreams" as const,
		label: "Revenue Streams",
		icon: DollarSign,
		gradient: "from-emerald-500 to-green-600",
		bgGradient: "from-emerald-500/5 via-emerald-500/3 to-transparent",
		borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
		iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
		noteColor: "emerald" as NoteColor,
		questions: ["For what value are customers willing to pay?"],
	},
];

const defaultData: BusinessModelData = {
	keyPartners: [],
	keyActivities: [],
	keyResources: [],
	valuePropositions: [],
	customerRelationships: [],
	channels: [],
	customerSegments: [],
	costStructure: [],
	revenueStreams: [],
};

export function BusinessModelCanvas() {
	const [data, setData] = useState<BusinessModelData>(defaultData);
	const [hoveredSection, setHoveredSection] = useState<string | null>(null);

	const generateId = () =>
		`bmc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const addNote = (section: keyof BusinessModelData, color: NoteColor) => {
		const newNote: StickyNoteType = {
			id: generateId(),
			content: "",
			color,
		};
		setData((prev) => ({
			...prev,
			[section]: [...prev[section], newNote],
		}));
	};

	const updateNote = (
		section: keyof BusinessModelData,
		id: string,
		content: string,
	) => {
		setData((prev) => ({
			...prev,
			[section]: prev[section].map((note) =>
				note.id === id ? { ...note, content } : note,
			),
		}));
	};

	const deleteNote = (section: keyof BusinessModelData, id: string) => {
		setData((prev) => ({
			...prev,
			[section]: prev[section].filter((note) => note.id !== id),
		}));
	};

	const resetCanvas = () => {
		setData(defaultData);
	};

	const exportCanvas = () => {
		const exportData = {
			type: "Business Model Canvas",
			exportedAt: new Date().toISOString(),
			sections: Object.fromEntries(
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
		a.download = `business-model-canvas-${Date.now()}.json`;
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
						<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 blur-xl opacity-40" />
						<div className="relative flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
							<LayoutGrid className="size-7 text-white" />
						</div>
					</motion.div>
					<div>
						<h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
							Business Model Canvas
						</h2>
						<p className="text-sm text-neutral-500 dark:text-neutral-400">
							Design and document your complete business model
						</p>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2">
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
						onClick={resetCanvas}
						type="button"
					>
						<RotateCcw className="size-4" />
						Reset
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40"
						onClick={exportCanvas}
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
					<Sparkles className="size-4 text-emerald-500" />
					<span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
						{totalNotes} {totalNotes === 1 ? "item" : "items"} across 9 building blocks
					</span>
				</div>
			</motion.div>

			{/* BMC Grid - Premium Layout */}
			<div className="grid gap-4 lg:gap-5">
				{/* Top Row - 5 columns on desktop */}
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-5">
					{/* Key Partners - Full height */}
					<BMCSection
						section={sections[0]}
						notes={data.keyPartners}
						onAdd={(color) => addNote("keyPartners", color)}
						onUpdate={(id, content) => updateNote("keyPartners", id, content)}
						onDelete={(id) => deleteNote("keyPartners", id)}
						className="lg:row-span-2"
						isHovered={hoveredSection === "keyPartners"}
						onHover={() => setHoveredSection("keyPartners")}
						onLeave={() => setHoveredSection(null)}
					/>

					{/* Key Activities + Key Resources - Stacked */}
					<div className="flex flex-col gap-4 lg:gap-5">
						<BMCSection
							section={sections[1]}
							notes={data.keyActivities}
							onAdd={(color) => addNote("keyActivities", color)}
							onUpdate={(id, content) => updateNote("keyActivities", id, content)}
							onDelete={(id) => deleteNote("keyActivities", id)}
							compact
							isHovered={hoveredSection === "keyActivities"}
							onHover={() => setHoveredSection("keyActivities")}
							onLeave={() => setHoveredSection(null)}
						/>
						<BMCSection
							section={sections[2]}
							notes={data.keyResources}
							onAdd={(color) => addNote("keyResources", color)}
							onUpdate={(id, content) => updateNote("keyResources", id, content)}
							onDelete={(id) => deleteNote("keyResources", id)}
							compact
							isHovered={hoveredSection === "keyResources"}
							onHover={() => setHoveredSection("keyResources")}
							onLeave={() => setHoveredSection(null)}
						/>
					</div>

					{/* Value Propositions - Full height */}
					<BMCSection
						section={sections[3]}
						notes={data.valuePropositions}
						onAdd={(color) => addNote("valuePropositions", color)}
						onUpdate={(id, content) => updateNote("valuePropositions", id, content)}
						onDelete={(id) => deleteNote("valuePropositions", id)}
						className="lg:row-span-2"
						isHovered={hoveredSection === "valuePropositions"}
						onHover={() => setHoveredSection("valuePropositions")}
						onLeave={() => setHoveredSection(null)}
					/>

					{/* Customer Relationships + Channels - Stacked */}
					<div className="flex flex-col gap-4 lg:gap-5">
						<BMCSection
							section={sections[4]}
							notes={data.customerRelationships}
							onAdd={(color) => addNote("customerRelationships", color)}
							onUpdate={(id, content) => updateNote("customerRelationships", id, content)}
							onDelete={(id) => deleteNote("customerRelationships", id)}
							compact
							isHovered={hoveredSection === "customerRelationships"}
							onHover={() => setHoveredSection("customerRelationships")}
							onLeave={() => setHoveredSection(null)}
						/>
						<BMCSection
							section={sections[5]}
							notes={data.channels}
							onAdd={(color) => addNote("channels", color)}
							onUpdate={(id, content) => updateNote("channels", id, content)}
							onDelete={(id) => deleteNote("channels", id)}
							compact
							isHovered={hoveredSection === "channels"}
							onHover={() => setHoveredSection("channels")}
							onLeave={() => setHoveredSection(null)}
						/>
					</div>

					{/* Customer Segments - Full height */}
					<BMCSection
						section={sections[6]}
						notes={data.customerSegments}
						onAdd={(color) => addNote("customerSegments", color)}
						onUpdate={(id, content) => updateNote("customerSegments", id, content)}
						onDelete={(id) => deleteNote("customerSegments", id)}
						className="lg:row-span-2"
						isHovered={hoveredSection === "customerSegments"}
						onHover={() => setHoveredSection("customerSegments")}
						onLeave={() => setHoveredSection(null)}
					/>
				</div>

				{/* Bottom Row - Cost Structure + Revenue Streams */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
					<BMCSection
						section={sections[7]}
						notes={data.costStructure}
						onAdd={(color) => addNote("costStructure", color)}
						onUpdate={(id, content) => updateNote("costStructure", id, content)}
						onDelete={(id) => deleteNote("costStructure", id)}
						horizontal
						isHovered={hoveredSection === "costStructure"}
						onHover={() => setHoveredSection("costStructure")}
						onLeave={() => setHoveredSection(null)}
					/>
					<BMCSection
						section={sections[8]}
						notes={data.revenueStreams}
						onAdd={(color) => addNote("revenueStreams", color)}
						onUpdate={(id, content) => updateNote("revenueStreams", id, content)}
						onDelete={(id) => deleteNote("revenueStreams", id)}
						horizontal
						isHovered={hoveredSection === "revenueStreams"}
						onHover={() => setHoveredSection("revenueStreams")}
						onLeave={() => setHoveredSection(null)}
					/>
				</div>
			</div>
		</motion.div>
	);
}

// Premium BMC Section Component
interface BMCSectionProps {
	section: (typeof sections)[number];
	notes: StickyNoteType[];
	onAdd: (color: NoteColor) => void;
	onUpdate: (id: string, content: string) => void;
	onDelete: (id: string) => void;
	compact?: boolean;
	horizontal?: boolean;
	className?: string;
	isHovered?: boolean;
	onHover?: () => void;
	onLeave?: () => void;
}

function BMCSection({
	section,
	notes,
	onAdd,
	onUpdate,
	onDelete,
	compact = false,
	horizontal = false,
	className,
	isHovered = false,
	onHover,
	onLeave,
}: BMCSectionProps) {
	const Icon = section.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			onHoverStart={onHover}
			onHoverEnd={onLeave}
			className={cn(
				"group relative overflow-hidden rounded-2xl border bg-white/80 backdrop-blur-xl transition-all duration-300 dark:bg-neutral-900/80",
				section.borderColor,
				isHovered && "shadow-xl",
				compact ? "min-h-[160px]" : "min-h-[220px]",
				className,
			)}
		>
			{/* Background Gradient */}
			<div
				className={cn(
					"absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity duration-300",
					section.bgGradient,
					isHovered && "opacity-70",
				)}
			/>

			{/* Grid Pattern */}
			<div
				className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
				style={{
					backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
									linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
					backgroundSize: "20px 20px",
				}}
			/>

			{/* Content */}
			<div className="relative p-4">
				{/* Header */}
				<div className="mb-3 flex items-center justify-between">
					<div className="flex items-center gap-2.5">
						<motion.div
							whileHover={{ scale: 1.1, rotate: 5 }}
							className={cn(
								"flex size-9 items-center justify-center rounded-lg shadow-md",
								section.iconBg,
							)}
						>
							<Icon className="size-4 text-white" />
						</motion.div>
						<h3 className="font-semibold text-sm text-neutral-800 dark:text-white">
							{section.label}
						</h3>
					</div>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className={cn(
							"flex size-8 items-center justify-center rounded-lg transition-all",
							"bg-white/60 shadow-sm hover:bg-white hover:shadow-md dark:bg-neutral-800/60 dark:hover:bg-neutral-800",
							"text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white",
						)}
						onClick={() => onAdd(section.noteColor)}
						title="Add note"
						type="button"
					>
						<Plus className="size-4" />
					</motion.button>
				</div>

				{/* Question hint */}
				{section.questions.length > 0 && notes.length === 0 && (
					<p className="mb-3 text-xs italic text-neutral-400 dark:text-neutral-500">
						{section.questions[0]}
					</p>
				)}

				{/* Notes */}
				<div
					className={cn(
						"gap-2.5",
						horizontal
							? "flex flex-wrap"
							: compact
								? "grid grid-cols-1"
								: "grid grid-cols-1 sm:grid-cols-2",
					)}
				>
					<AnimatePresence mode="popLayout">
						{notes.map((note, index) => (
							<motion.div
								key={note.id}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ delay: index * 0.03 }}
								className={horizontal ? "flex-shrink-0" : ""}
							>
								<StickyNote
									note={note}
									onUpdate={(id, content) => onUpdate(id, content)}
									onDelete={(id) => onDelete(id)}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				{/* Empty state */}
				{notes.length === 0 && (
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={cn(
							"flex w-full items-center justify-center gap-1.5 rounded-xl py-4 text-xs font-medium transition-all",
							"border-2 border-dashed border-neutral-200 dark:border-neutral-700",
							"text-neutral-400 hover:border-neutral-300 hover:text-neutral-500",
							"dark:text-neutral-500 dark:hover:border-neutral-600 dark:hover:text-neutral-400",
							"hover:bg-white/30 dark:hover:bg-neutral-800/30",
						)}
						onClick={() => onAdd(section.noteColor)}
						type="button"
					>
						<Plus className="size-3.5" />
						Add item
					</motion.button>
				)}
			</div>
		</motion.div>
	);
}
