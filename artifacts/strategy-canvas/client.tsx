"use client";

import { toast } from "sonner";
import { Artifact } from "@/components/create-artifact";
import { DocumentSkeleton } from "@/components/document-skeleton";
import {
	CopyIcon,
	MessageIcon,
	PenIcon,
} from "@/components/icons";
import { CanvasArtifactContent } from "@/components/canvas-artifact-content";
import type { CanvasType } from "@/components/strategy-canvas/types";

export type StrategyCanvasMetadata = {
	canvasType: CanvasType;
};

export const strategyCanvasArtifact = new Artifact<
	"strategy-canvas",
	StrategyCanvasMetadata
>({
	kind: "strategy-canvas",
	description:
		"Strategic planning canvases for SWOT, Business Model, Customer Journey, and Brainstorming.",
	initialize: async ({ setMetadata }) => {
		setMetadata({
			canvasType: "swot",
		});
	},
	onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
		// Handle canvas type changes
		if (streamPart.type === "data-canvasType") {
			setMetadata((metadata) => ({
				...metadata,
				canvasType: streamPart.data as CanvasType,
			}));
		}

		// Handle canvas item additions (streamed from AI)
		if (streamPart.type === "data-canvasItem") {
			setArtifact((draftArtifact) => {
				try {
					const currentData = draftArtifact.content
						? JSON.parse(draftArtifact.content)
						: {};
					const item = streamPart.data as {
						section: string;
						content: string;
						id: string;
					};

					// Add item to the appropriate section
					const section = item.section;
					if (!currentData[section]) {
						currentData[section] = [];
					}

					currentData[section].push({
						id: item.id,
						content: item.content,
						color: "slate",
					});

					return {
						...draftArtifact,
						content: JSON.stringify(currentData),
						status: "streaming",
					};
				} catch {
					return draftArtifact;
				}
			});
		}

		// Handle full canvas data updates
		if (streamPart.type === "data-canvasData") {
			setArtifact((draftArtifact) => ({
				...draftArtifact,
				content: streamPart.data as string,
				isVisible: true,
				status: "streaming",
			}));
		}
	},
	content: ({
		mode,
		status,
		content,
		isCurrentVersion,
		currentVersionIndex,
		onSaveContent,
		getDocumentContentById,
		isLoading,
		metadata,
		setMetadata,
	}) => {
		if (isLoading) {
			return <DocumentSkeleton artifactKind="text" />;
		}

		return (
			<CanvasArtifactContent
				content={content}
				currentVersionIndex={currentVersionIndex}
				getDocumentContentById={getDocumentContentById}
				isCurrentVersion={isCurrentVersion}
				metadata={metadata}
				mode={mode}
				onSaveContent={onSaveContent}
				setMetadata={setMetadata}
				status={status}
			/>
		);
	},
	actions: [
		{
			icon: <CopyIcon size={18} />,
			description: "Copy canvas data",
			onClick: ({ content }) => {
				try {
					const data = JSON.parse(content);
					const readableContent = Object.entries(data)
						.map(([section, items]) => {
							const itemList = (items as { content: string }[])
								.map((item) => item.content)
								.filter(Boolean)
								.join("\n  - ");
							return `${section}:\n  - ${itemList}`;
						})
						.join("\n\n");
					navigator.clipboard.writeText(readableContent);
					toast.success("Canvas content copied!");
				} catch {
					navigator.clipboard.writeText(content);
					toast.success("Copied to clipboard!");
				}
			},
		},
	],
	toolbar: [
		{
			icon: <PenIcon />,
			description: "Alexandria: Analyze brand positioning",
			onClick: ({ sendMessage }) => {
				sendMessage({
					role: "user",
					parts: [
						{
							type: "text",
							text: "Alexandria, please analyze our brand positioning and add relevant insights to the canvas. Focus on strengths, opportunities, and strategic recommendations.",
						},
					],
				});
			},
		},
		{
			icon: <MessageIcon />,
			description: "Kim: Identify revenue opportunities",
			onClick: ({ sendMessage }) => {
				sendMessage({
					role: "user",
					parts: [
						{
							type: "text",
							text: "Kim, please analyze potential revenue opportunities and sales strategies, then add them to the canvas.",
						},
					],
				});
			},
		},
	],
});
