"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	FileSpreadsheet,
	Lightbulb,
	Loader2,
	Map,
	Target,
} from "lucide-react";
import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useEffect,
	useState,
} from "react";
import { cn } from "@/lib/utils";
import type {
	BusinessModelData,
	CanvasType,
	SwotData,
} from "./strategy-canvas/types";
import type { StrategyCanvasMetadata } from "@/artifacts/strategy-canvas/client";

// Inline canvas components (simplified for artifact panel)
import { StickyNote } from "./strategy-canvas/sticky-note";
import type { NoteColor, StickyNote as StickyNoteType } from "./strategy-canvas/types";

interface CanvasArtifactContentProps {
	content: string;
	status: "streaming" | "idle";
	mode: "edit" | "diff";
	isCurrentVersion: boolean;
	currentVersionIndex: number;
	onSaveContent: (content: string, debounce: boolean) => void;
	getDocumentContentById: (index: number) => string;
	metadata: StrategyCanvasMetadata | null;
	setMetadata: Dispatch<SetStateAction<StrategyCanvasMetadata>>;
}

const canvasTabs: {
	key: CanvasType;
	label: string;
	icon: React.ReactNode;
}[] = [
	{ key: "swot", label: "SWOT", icon: <Target className="size-4" /> },
	{ key: "bmc", label: "BMC", icon: <FileSpreadsheet className="size-4" /> },
	{ key: "journey", label: "Journey", icon: <Map className="size-4" /> },
	{
		key: "brainstorm",
		label: "Brainstorm",
		icon: <Lightbulb className="size-4" />,
	},
];

// SWOT quadrants configuration
const swotQuadrants = [
	{
		key: "strengths" as const,
		label: "Strengths",
		subtitle: "Internal advantages",
	},
	{
		key: "weaknesses" as const,
		label: "Weaknesses",
		subtitle: "Internal challenges",
	},
	{
		key: "opportunities" as const,
		label: "Opportunities",
		subtitle: "External possibilities",
	},
	{ key: "threats" as const, label: "Threats", subtitle: "External risks" },
];

// BMC sections configuration
const bmcSections = [
	{ key: "keyPartners", label: "Key Partners", span: 1 },
	{ key: "keyActivities", label: "Key Activities", span: 1 },
	{ key: "valuePropositions", label: "Value Propositions", span: 1 },
	{ key: "customerRelationships", label: "Customer Relationships", span: 1 },
	{ key: "customerSegments", label: "Customer Segments", span: 1 },
	{ key: "keyResources", label: "Key Resources", span: 1 },
	{ key: "channels", label: "Channels", span: 1 },
	{ key: "costStructure", label: "Cost Structure", span: 2 },
	{ key: "revenueStreams", label: "Revenue Streams", span: 2 },
];

// Journey stages configuration
const journeyStages = [
	{ key: "awareness", label: "Awareness" },
	{ key: "consideration", label: "Consideration" },
	{ key: "decision", label: "Decision" },
	{ key: "purchase", label: "Purchase" },
	{ key: "retention", label: "Retention" },
	{ key: "advocacy", label: "Advocacy" },
];

export function CanvasArtifactContent({
	content,
	status,
	onSaveContent,
	metadata,
	setMetadata,
}: CanvasArtifactContentProps) {
	const [canvasData, setCanvasData] = useState<Record<string, StickyNoteType[]>>(() => {
		try {
			return content ? JSON.parse(content) : {};
		} catch {
			return {};
		}
	});

	const activeType = metadata?.canvasType || "swot";

	// Sync external content changes
	useEffect(() => {
		if (content) {
			try {
				const parsed = JSON.parse(content);
				setCanvasData(parsed);
			} catch {
				// Invalid JSON, ignore
			}
		}
	}, [content]);

	// Handle canvas type change
	const handleTypeChange = useCallback(
		(newType: CanvasType) => {
			setMetadata((prev) => ({
				...prev,
				canvasType: newType,
			}));
		},
		[setMetadata],
	);

	// Handle data changes with auto-save
	const handleDataChange = useCallback(
		(newData: Record<string, StickyNoteType[]>) => {
			setCanvasData(newData);
			onSaveContent(JSON.stringify(newData), true);
		},
		[onSaveContent],
	);

	const generateId = () =>
		`note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

	const addNote = (section: string, color: NoteColor = "slate") => {
		const newNote: StickyNoteType = {
			id: generateId(),
			content: "",
			color,
		};
		const newData = {
			...canvasData,
			[section]: [...(canvasData[section] || []), newNote],
		};
		handleDataChange(newData);
	};

	const updateNote = (section: string, id: string, noteContent: string) => {
		const newData = {
			...canvasData,
			[section]: (canvasData[section] || []).map((note) =>
				note.id === id ? { ...note, content: noteContent } : note,
			),
		};
		handleDataChange(newData);
	};

	const deleteNote = (section: string, id: string) => {
		const newData = {
			...canvasData,
			[section]: (canvasData[section] || []).filter((note) => note.id !== id),
		};
		handleDataChange(newData);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Canvas Type Tabs */}
			<div className="flex-shrink-0 border-b border-border/60 px-4 py-2">
				<div className="flex gap-1">
					{canvasTabs.map((tab) => (
						<button
							key={tab.key}
							type="button"
							onClick={() => handleTypeChange(tab.key)}
							disabled={status === "streaming"}
							className={cn(
								"flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
								activeType === tab.key
									? "bg-primary/10 text-primary"
									: "text-muted-foreground hover:bg-muted hover:text-foreground",
								status === "streaming" && "opacity-50 cursor-not-allowed",
							)}
						>
							{tab.icon}
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* Canvas Content */}
			<div className="flex-1 overflow-auto p-4">
				<AnimatePresence mode="wait">
					{activeType === "swot" && (
						<SwotContent
							key="swot"
							data={canvasData as unknown as SwotData}
							addNote={addNote}
							updateNote={updateNote}
							deleteNote={deleteNote}
						/>
					)}
					{activeType === "bmc" && (
						<BMCContent
							key="bmc"
							data={canvasData as unknown as BusinessModelData}
							addNote={addNote}
							updateNote={updateNote}
							deleteNote={deleteNote}
						/>
					)}
					{activeType === "journey" && (
						<JourneyContent
							key="journey"
							data={canvasData}
							addNote={addNote}
							updateNote={updateNote}
							deleteNote={deleteNote}
						/>
					)}
					{activeType === "brainstorm" && (
						<BrainstormContent
							key="brainstorm"
							data={canvasData}
							addNote={addNote}
							updateNote={updateNote}
							deleteNote={deleteNote}
						/>
					)}
				</AnimatePresence>
			</div>

			{/* Streaming indicator */}
			{status === "streaming" && (
				<div className="absolute right-4 bottom-4 flex items-center gap-2 rounded-lg bg-background/80 px-3 py-2 text-sm text-muted-foreground backdrop-blur-sm">
					<Loader2 className="size-4 animate-spin" />
					AI is populating canvas...
				</div>
			)}
		</div>
	);
}

// SWOT Content Component
function SwotContent({
	data,
	addNote,
	updateNote,
	deleteNote,
}: {
	data: SwotData;
	addNote: (section: string, color?: NoteColor) => void;
	updateNote: (section: string, id: string, content: string) => void;
	deleteNote: (section: string, id: string) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border"
		>
			{swotQuadrants.map((quadrant) => {
				const notes = data[quadrant.key] || [];
				return (
					<div
						key={quadrant.key}
						className="min-h-[200px] bg-background p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<div>
								<h3 className="font-semibold text-sm">{quadrant.label}</h3>
								<p className="text-xs text-muted-foreground">
									{quadrant.subtitle}
								</p>
							</div>
							<button
								type="button"
								onClick={() => addNote(quadrant.key)}
								className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
							>
								<span className="sr-only">Add note</span>
								<svg
									className="size-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</button>
						</div>
						<div className="space-y-2">
							{notes.map((note) => (
								<StickyNote
									key={note.id}
									note={note}
									onUpdate={(id, newContent) =>
										updateNote(quadrant.key, id, newContent)
									}
									onDelete={(id) => deleteNote(quadrant.key, id)}
								/>
							))}
							{notes.length === 0 && (
								<button
									type="button"
									onClick={() => addNote(quadrant.key)}
									className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
								>
									<svg
										className="size-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
									Add {quadrant.label.toLowerCase().slice(0, -1)}
								</button>
							)}
						</div>
					</div>
				);
			})}
		</motion.div>
	);
}

// BMC Content Component
function BMCContent({
	data,
	addNote,
	updateNote,
	deleteNote,
}: {
	data: BusinessModelData;
	addNote: (section: string, color?: NoteColor) => void;
	updateNote: (section: string, id: string, content: string) => void;
	deleteNote: (section: string, id: string) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="space-y-2"
		>
			{/* Top row - 5 columns */}
			<div className="grid grid-cols-5 gap-2">
				{bmcSections.slice(0, 5).map((section) => {
					const notes = (data[section.key as keyof BusinessModelData] ||
						[]) as StickyNoteType[];
					return (
						<CanvasSection
							key={section.key}
							label={section.label}
							notes={notes}
							onAdd={() => addNote(section.key)}
							onUpdate={(id, content) => updateNote(section.key, id, content)}
							onDelete={(id) => deleteNote(section.key, id)}
						/>
					);
				})}
			</div>
			{/* Middle row - 2 columns */}
			<div className="grid grid-cols-5 gap-2">
				{bmcSections.slice(5, 7).map((section) => {
					const notes = (data[section.key as keyof BusinessModelData] ||
						[]) as StickyNoteType[];
					return (
						<CanvasSection
							key={section.key}
							label={section.label}
							notes={notes}
							onAdd={() => addNote(section.key)}
							onUpdate={(id, content) => updateNote(section.key, id, content)}
							onDelete={(id) => deleteNote(section.key, id)}
						/>
					);
				})}
				<div className="col-span-3" /> {/* Spacer */}
			</div>
			{/* Bottom row - 2 columns spanning full width */}
			<div className="grid grid-cols-2 gap-2">
				{bmcSections.slice(7).map((section) => {
					const notes = (data[section.key as keyof BusinessModelData] ||
						[]) as StickyNoteType[];
					return (
						<CanvasSection
							key={section.key}
							label={section.label}
							notes={notes}
							onAdd={() => addNote(section.key)}
							onUpdate={(id, content) => updateNote(section.key, id, content)}
							onDelete={(id) => deleteNote(section.key, id)}
						/>
					);
				})}
			</div>
		</motion.div>
	);
}

// Journey Content Component
function JourneyContent({
	data,
	addNote,
	updateNote,
	deleteNote,
}: {
	data: Record<string, StickyNoteType[]>;
	addNote: (section: string, color?: NoteColor) => void;
	updateNote: (section: string, id: string, content: string) => void;
	deleteNote: (section: string, id: string) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="grid grid-cols-6 gap-2"
		>
			{journeyStages.map((stage) => {
				const notes = data[stage.key] || [];
				return (
					<CanvasSection
						key={stage.key}
						label={stage.label}
						notes={notes}
						onAdd={() => addNote(stage.key)}
						onUpdate={(id, content) => updateNote(stage.key, id, content)}
						onDelete={(id) => deleteNote(stage.key, id)}
					/>
				);
			})}
		</motion.div>
	);
}

// Brainstorm Content Component
function BrainstormContent({
	data,
	addNote,
	updateNote,
	deleteNote,
}: {
	data: Record<string, StickyNoteType[]>;
	addNote: (section: string, color?: NoteColor) => void;
	updateNote: (section: string, id: string, content: string) => void;
	deleteNote: (section: string, id: string) => void;
}) {
	const notes = data.notes || [];
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="min-h-[300px] rounded-xl border border-border bg-background p-4"
		>
			<div className="mb-3 flex items-center justify-between">
				<h3 className="font-semibold text-sm">Ideas</h3>
				<button
					type="button"
					onClick={() => addNote("notes")}
					className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<span className="sr-only">Add note</span>
					<svg
						className="size-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{notes.map((note) => (
					<StickyNote
						key={note.id}
						note={note}
						onUpdate={(id, content) => updateNote("notes", id, content)}
						onDelete={(id) => deleteNote("notes", id)}
					/>
				))}
				{notes.length === 0 && (
					<button
						type="button"
						onClick={() => addNote("notes")}
						className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
					>
						<svg
							className="size-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						Add your first idea
					</button>
				)}
			</div>
		</motion.div>
	);
}

// Reusable Canvas Section Component
function CanvasSection({
	label,
	notes,
	onAdd,
	onUpdate,
	onDelete,
}: {
	label: string;
	notes: StickyNoteType[];
	onAdd: () => void;
	onUpdate: (id: string, content: string) => void;
	onDelete: (id: string) => void;
}) {
	return (
		<div className="min-h-[150px] rounded-lg border border-border bg-background p-3">
			<div className="mb-2 flex items-center justify-between">
				<h4 className="font-medium text-xs">{label}</h4>
				<button
					type="button"
					onClick={onAdd}
					className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
				>
					<svg
						className="size-3"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			</div>
			<div className="space-y-1.5">
				{notes.map((note) => (
					<StickyNote
						key={note.id}
						note={note}
						onUpdate={onUpdate}
						onDelete={onDelete}
					/>
				))}
			</div>
		</div>
	);
}
