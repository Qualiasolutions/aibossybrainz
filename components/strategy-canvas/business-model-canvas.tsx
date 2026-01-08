"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	Cog,
	DollarSign,
	Gem,
	Handshake,
	Heart,
	LayoutGrid,
	Package,
	PiggyBank,
	Plus,
	Truck,
	Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CanvasPanel } from "./canvas-panel";
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
		color: "purple" as const,
		gridArea: "partners",
		questions: ["Who are our key partners?", "Who are our key suppliers?"],
	},
	{
		key: "keyActivities" as const,
		label: "Key Activities",
		icon: Cog,
		color: "blue" as const,
		gridArea: "activities",
		questions: ["What key activities does our value proposition require?"],
	},
	{
		key: "keyResources" as const,
		label: "Key Resources",
		icon: Package,
		color: "emerald" as const,
		gridArea: "resources",
		questions: ["What key resources does our value proposition require?"],
	},
	{
		key: "valuePropositions" as const,
		label: "Value Propositions",
		icon: Gem,
		color: "rose" as const,
		gridArea: "value",
		questions: ["What value do we deliver?", "What problem do we solve?"],
	},
	{
		key: "customerRelationships" as const,
		label: "Customer Relationships",
		icon: Heart,
		color: "pink" as const,
		gridArea: "relationships",
		questions: ["What type of relationship does each segment expect?"],
	},
	{
		key: "channels" as const,
		label: "Channels",
		icon: Truck,
		color: "amber" as const,
		gridArea: "channels",
		questions: ["How do we reach our customer segments?"],
	},
	{
		key: "customerSegments" as const,
		label: "Customer Segments",
		icon: Users,
		color: "blue" as const,
		gridArea: "segments",
		questions: [
			"For whom are we creating value?",
			"Who are our most important customers?",
		],
	},
	{
		key: "costStructure" as const,
		label: "Cost Structure",
		icon: PiggyBank,
		color: "slate" as const,
		gridArea: "costs",
		questions: ["What are the most important costs?"],
	},
	{
		key: "revenueStreams" as const,
		label: "Revenue Streams",
		icon: DollarSign,
		color: "emerald" as const,
		gridArea: "revenue",
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

const colorToNoteColor: Record<string, NoteColor> = {
	purple: "purple",
	blue: "blue",
	emerald: "emerald",
	rose: "rose",
	pink: "rose",
	amber: "amber",
	slate: "slate",
};

export function BusinessModelCanvas() {
	const [data, setData] = useState<BusinessModelData>(defaultData);

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

	return (
		<CanvasPanel
			title="Business Model Canvas"
			subtitle="Design and document your business model"
			icon={<LayoutGrid className="size-5" />}
			accentColor="emerald"
			onReset={resetCanvas}
			onExport={exportCanvas}
		>
			{/* BMC Grid - Responsive layout */}
			<div className="grid gap-3 sm:gap-4">
				{/* Top Row - Desktop: 5 columns, Mobile: 2 columns */}
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
					{/* Key Partners */}
					<BMCSection
						section={sections[0]}
						notes={data.keyPartners}
						onAdd={(color) => addNote("keyPartners", color)}
						onUpdate={(id, content) => updateNote("keyPartners", id, content)}
						onDelete={(id) => deleteNote("keyPartners", id)}
						className="lg:row-span-2"
					/>

					{/* Key Activities + Key Resources */}
					<div className="flex flex-col gap-3 sm:gap-4">
						<BMCSection
							section={sections[1]}
							notes={data.keyActivities}
							onAdd={(color) => addNote("keyActivities", color)}
							onUpdate={(id, content) =>
								updateNote("keyActivities", id, content)
							}
							onDelete={(id) => deleteNote("keyActivities", id)}
							compact
						/>
						<BMCSection
							section={sections[2]}
							notes={data.keyResources}
							onAdd={(color) => addNote("keyResources", color)}
							onUpdate={(id, content) =>
								updateNote("keyResources", id, content)
							}
							onDelete={(id) => deleteNote("keyResources", id)}
							compact
						/>
					</div>

					{/* Value Propositions */}
					<BMCSection
						section={sections[3]}
						notes={data.valuePropositions}
						onAdd={(color) => addNote("valuePropositions", color)}
						onUpdate={(id, content) =>
							updateNote("valuePropositions", id, content)
						}
						onDelete={(id) => deleteNote("valuePropositions", id)}
						className="lg:row-span-2"
					/>

					{/* Customer Relationships + Channels */}
					<div className="flex flex-col gap-3 sm:gap-4">
						<BMCSection
							section={sections[4]}
							notes={data.customerRelationships}
							onAdd={(color) => addNote("customerRelationships", color)}
							onUpdate={(id, content) =>
								updateNote("customerRelationships", id, content)
							}
							onDelete={(id) => deleteNote("customerRelationships", id)}
							compact
						/>
						<BMCSection
							section={sections[5]}
							notes={data.channels}
							onAdd={(color) => addNote("channels", color)}
							onUpdate={(id, content) => updateNote("channels", id, content)}
							onDelete={(id) => deleteNote("channels", id)}
							compact
						/>
					</div>

					{/* Customer Segments */}
					<BMCSection
						section={sections[6]}
						notes={data.customerSegments}
						onAdd={(color) => addNote("customerSegments", color)}
						onUpdate={(id, content) =>
							updateNote("customerSegments", id, content)
						}
						onDelete={(id) => deleteNote("customerSegments", id)}
						className="lg:row-span-2"
					/>
				</div>

				{/* Bottom Row - Cost Structure + Revenue Streams */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
					<BMCSection
						section={sections[7]}
						notes={data.costStructure}
						onAdd={(color) => addNote("costStructure", color)}
						onUpdate={(id, content) => updateNote("costStructure", id, content)}
						onDelete={(id) => deleteNote("costStructure", id)}
						horizontal
					/>
					<BMCSection
						section={sections[8]}
						notes={data.revenueStreams}
						onAdd={(color) => addNote("revenueStreams", color)}
						onUpdate={(id, content) =>
							updateNote("revenueStreams", id, content)
						}
						onDelete={(id) => deleteNote("revenueStreams", id)}
						horizontal
					/>
				</div>
			</div>
		</CanvasPanel>
	);
}

// Individual BMC Section Component
interface BMCSectionProps {
	section: (typeof sections)[number];
	notes: StickyNoteType[];
	onAdd: (color: NoteColor) => void;
	onUpdate: (id: string, content: string) => void;
	onDelete: (id: string) => void;
	compact?: boolean;
	horizontal?: boolean;
	className?: string;
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
}: BMCSectionProps) {
	const Icon = section.icon;
	const noteColor = colorToNoteColor[section.color];

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				"rounded-xl border p-3 sm:p-4",
				"bg-white/50 dark:bg-slate-800/50",
				"border-slate-200/50 dark:border-slate-700/50",
				compact ? "min-h-[140px]" : "min-h-[200px]",
				className,
			)}
		>
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"flex size-7 items-center justify-center rounded-lg",
							section.color === "purple" &&
								"bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
							section.color === "blue" &&
								"bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
							section.color === "emerald" &&
								"bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
							section.color === "rose" &&
								"bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
							section.color === "pink" &&
								"bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400",
							section.color === "amber" &&
								"bg-red-100 text-red-600 dark:bg-neutral-900/50 dark:text-red-500",
							section.color === "slate" &&
								"bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400",
						)}
					>
						<Icon className="size-3.5" />
					</div>
					<h3 className="font-semibold text-slate-700 text-xs dark:text-slate-300 sm:text-sm">
						{section.label}
					</h3>
				</div>
				<button
					className={cn(
						"flex size-6 items-center justify-center rounded-md transition-all",
						"bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600",
						"text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
					)}
					onClick={() => onAdd(noteColor)}
					title="Add note"
					type="button"
				>
					<Plus className="size-3.5" />
				</button>
			</div>

			{/* Question hint */}
			{section.questions.length > 0 && notes.length === 0 && (
				<p className="mb-2 text-xs italic text-slate-400 dark:text-slate-500">
					{section.questions[0]}
				</p>
			)}

			{/* Notes */}
			<div
				className={cn(
					"gap-2",
					horizontal
						? "flex flex-wrap"
						: compact
							? "grid grid-cols-1"
							: "grid grid-cols-1 sm:grid-cols-2",
				)}
			>
				<AnimatePresence>
					{notes.map((note) => (
						<StickyNote
							key={note.id}
							note={note}
							onUpdate={(id, content) => onUpdate(id, content)}
							onDelete={(id) => onDelete(id)}
							className={horizontal ? "flex-shrink-0" : ""}
						/>
					))}
				</AnimatePresence>
			</div>

			{/* Empty state */}
			{notes.length === 0 && (
				<button
					className={cn(
						"flex w-full items-center justify-center gap-1 rounded-lg py-3 text-xs transition-colors",
						"border border-dashed border-slate-200 dark:border-slate-700",
						"text-slate-400 hover:border-slate-300 hover:text-slate-500",
						"dark:text-slate-500 dark:hover:border-slate-600 dark:hover:text-slate-400",
					)}
					onClick={() => onAdd(noteColor)}
					type="button"
				>
					<Plus className="size-3" />
					Add item
				</button>
			)}
		</motion.div>
	);
}
