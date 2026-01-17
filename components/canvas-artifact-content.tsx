"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Expand,
  FileSpreadsheet,
  Lightbulb,
  Loader2,
  Map,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { StrategyCanvasMetadata } from "@/artifacts/strategy-canvas/client";
import { cn } from "@/lib/utils";
// Inline canvas components (simplified for artifact panel)
import { StickyNote } from "./strategy-canvas/sticky-note";
import type {
  BusinessModelData,
  CanvasType,
  NoteColor,
  StickyNote as StickyNoteType,
  SwotData,
} from "./strategy-canvas/types";

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
  shortLabel: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "swot",
    label: "SWOT",
    shortLabel: "SWOT",
    icon: <Target className="size-4" />,
  },
  {
    key: "bmc",
    label: "Business Model",
    shortLabel: "BMC",
    icon: <FileSpreadsheet className="size-4" />,
  },
  {
    key: "journey",
    label: "Journey",
    shortLabel: "Journey",
    icon: <Map className="size-4" />,
  },
  {
    key: "brainstorm",
    label: "Brainstorm",
    shortLabel: "Ideas",
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
  const [canvasData, setCanvasData] = useState<
    Record<string, StickyNoteType[]>
  >(() => {
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
      {/* Header with Expand Button */}
      <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
        <span className="font-medium text-xs text-muted-foreground">
          Strategy Canvas
        </span>
        <Link
          href="/strategy-canvas"
          target="_blank"
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Expand className="size-3.5" />
          <span className="hidden sm:inline">Full View</span>
        </Link>
      </div>

      {/* Canvas Type Tabs - Responsive Grid */}
      <div className="flex-shrink-0 border-b border-border/60 p-2">
        <div className="grid grid-cols-4 gap-1">
          {canvasTabs.map((tab) => {
            const isActive = activeType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTypeChange(tab.key)}
                disabled={status === "streaming"}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-lg px-1 py-2.5 text-center transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  status === "streaming" && "opacity-50 cursor-not-allowed",
                )}
              >
                <span
                  className={cn(
                    "transition-transform",
                    isActive && "scale-110",
                  )}
                >
                  {tab.icon}
                </span>
                <span className="text-[10px] font-medium leading-tight sm:text-xs">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
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
      className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2"
    >
      {swotQuadrants.map((quadrant) => {
        const notes = data[quadrant.key] || [];
        return (
          <div
            key={quadrant.key}
            className="min-h-[140px] bg-background p-3 sm:min-h-[200px] sm:p-4"
          >
            <div className="mb-2 flex items-center justify-between sm:mb-3">
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">
                  {quadrant.label}
                </h3>
                <p className="hidden text-xs text-muted-foreground sm:block">
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
            <div className="space-y-1.5 sm:space-y-2">
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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground sm:py-4 sm:text-sm"
                >
                  <svg
                    className="size-3.5 sm:size-4"
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
      {/* Mobile: Single column layout */}
      <div className="flex flex-col gap-2 sm:hidden">
        {bmcSections.map((section) => {
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

      {/* Desktop: Grid layout */}
      <div className="hidden sm:block space-y-2">
        {/* Top row - 5 columns on large, 3 on medium */}
        <div className="grid grid-cols-3 gap-2 lg:grid-cols-5">
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
        <div className="grid grid-cols-2 gap-2">
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
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
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
      className="min-h-[200px] rounded-xl border border-border bg-background p-3 sm:min-h-[300px] sm:p-4"
    >
      <div className="mb-2 flex items-center justify-between sm:mb-3">
        <h3 className="font-semibold text-xs sm:text-sm">Ideas</h3>
        <button
          type="button"
          onClick={() => addNote("notes")}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <span className="sr-only">Add note</span>
          <svg
            className="size-3.5 sm:size-4"
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
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-6 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground sm:py-8 sm:text-sm"
          >
            <svg
              className="size-3.5 sm:size-4"
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
    <div className="min-h-[120px] rounded-lg border border-border bg-background p-2 sm:min-h-[150px] sm:p-3">
      <div className="mb-1.5 flex items-center justify-between sm:mb-2">
        <h4 className="font-medium text-[10px] leading-tight sm:text-xs">
          {label}
        </h4>
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
      <div className="space-y-1 sm:space-y-1.5">
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
