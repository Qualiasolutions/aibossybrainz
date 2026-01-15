import { tool, type UIMessageStreamWriter } from "ai";
import { z } from "zod";
import type { Session } from "@/lib/artifacts/server";
import type { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";
import { saveDocument } from "@/lib/db/queries";
import type {
	SwotData,
	BusinessModelData,
	CanvasType,
} from "@/components/strategy-canvas/types";

type StrategyCanvasProps = {
	session: Session;
	dataStream: UIMessageStreamWriter<ChatMessage>;
};

// Default empty data for each canvas type
function getDefaultCanvasData(canvasType: CanvasType): object {
	switch (canvasType) {
		case "swot":
			return {
				strengths: [],
				weaknesses: [],
				opportunities: [],
				threats: [],
			} satisfies SwotData;
		case "bmc":
			return {
				keyPartners: [],
				keyActivities: [],
				keyResources: [],
				valuePropositions: [],
				customerRelationships: [],
				channels: [],
				customerSegments: [],
				costStructure: [],
				revenueStreams: [],
			} satisfies BusinessModelData;
		case "journey":
			return {
				awareness: [],
				consideration: [],
				decision: [],
				purchase: [],
				retention: [],
				advocacy: [],
			};
		case "brainstorm":
			return {
				notes: [],
			};
		default:
			return {};
	}
}

const strategyCanvasSchema = z.object({
	action: z
		.enum(["create", "addItems"])
		.describe("Action to perform on the canvas"),
	canvasType: z
		.enum(["swot", "bmc", "journey", "brainstorm"])
		.describe("Type of strategic canvas"),
	title: z
		.string()
		.optional()
		.describe("Title for the canvas (used when creating)"),
	section: z
		.string()
		.optional()
		.describe(
			"Section to add items to (e.g., 'strengths', 'keyPartners', 'awareness')",
		),
	items: z
		.array(z.string())
		.optional()
		.describe("Items to add to the specified section"),
});

type StrategyCanvasInput = z.infer<typeof strategyCanvasSchema>;

export const strategyCanvas = ({ session, dataStream }: StrategyCanvasProps) =>
	tool({
		description: `Open and interact with strategic planning canvases. Use this tool to help users with strategic analysis.

Available canvas types:
- swot: SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
- bmc: Business Model Canvas (9 building blocks of a business model)
- journey: Customer Journey Map (6 stages from awareness to advocacy)
- brainstorm: Brainstorming Canvas (free-form idea capture)

Actions:
- create: Open a new canvas of the specified type
- addItems: Add items to a specific section of the canvas

The canvas opens in a side panel where the user can see and edit it in real-time.`,
		inputSchema: strategyCanvasSchema,
		execute: async ({ action, canvasType, title, section, items }: StrategyCanvasInput) => {
			if (action === "create") {
				const id = generateUUID();
				const canvasTitle =
					title ||
					`${canvasType.toUpperCase()}${canvasType === "bmc" ? "" : " Analysis"}`;

				// Signal artifact kind change
				dataStream.write({
					type: "data-kind",
					data: "strategy-canvas",
					transient: true,
				});

				dataStream.write({
					type: "data-id",
					data: id,
					transient: true,
				});

				dataStream.write({
					type: "data-title",
					data: canvasTitle,
					transient: true,
				});

				dataStream.write({
					type: "data-canvasType",
					data: canvasType,
					transient: true,
				});

				dataStream.write({
					type: "data-clear",
					data: null,
					transient: true,
				});

				// Initialize with empty structure
				const initialData = getDefaultCanvasData(canvasType);
				dataStream.write({
					type: "data-canvasData",
					data: JSON.stringify(initialData),
					transient: true,
				});

				// Save to database
				if (session?.user?.id) {
					await saveDocument({
						id,
						title: canvasTitle,
						content: JSON.stringify(initialData),
						kind: "strategy-canvas",
						userId: session.user.id,
					});
				}

				dataStream.write({
					type: "data-finish",
					data: null,
					transient: true,
				});

				return {
					id,
					canvasType,
					message: `Created ${canvasType} canvas. The user can now see it in the side panel and add items.`,
				};
			}

			if (action === "addItems" && section && items && items.length > 0) {
				// Stream each item addition
				for (const item of items) {
					dataStream.write({
						type: "data-canvasItem",
						data: {
							section,
							content: item,
							id: generateUUID(),
						},
						transient: true,
					});
				}

				return {
					message: `Added ${items.length} item${items.length === 1 ? "" : "s"} to ${section}. The user can see the updates in the canvas panel.`,
				};
			}

			return {
				message: "No action taken. Please specify a valid action and parameters.",
			};
		},
	});
