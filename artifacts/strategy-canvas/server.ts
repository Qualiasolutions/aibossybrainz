import { createDocumentHandler } from "@/lib/artifacts/server";
import type {
	SwotData,
	BusinessModelData,
	CanvasType,
} from "@/components/strategy-canvas/types";

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

export const strategyCanvasDocumentHandler = createDocumentHandler<"strategy-canvas">({
	kind: "strategy-canvas",
	onCreateDocument: async ({ title, dataStream }) => {
		// Parse canvas type from title if provided (e.g., "SWOT Analysis")
		let canvasType: CanvasType = "swot";
		const titleLower = title.toLowerCase();
		if (titleLower.includes("bmc") || titleLower.includes("business model")) {
			canvasType = "bmc";
		} else if (titleLower.includes("journey")) {
			canvasType = "journey";
		} else if (titleLower.includes("brainstorm")) {
			canvasType = "brainstorm";
		}

		const initialData = getDefaultCanvasData(canvasType);

		// Stream canvas type for client to know which board to render
		dataStream.write({
			type: "data-canvasType",
			data: canvasType,
			transient: true,
		});

		// Stream initial empty data structure
		dataStream.write({
			type: "data-canvasData",
			data: JSON.stringify(initialData),
			transient: true,
		});

		return JSON.stringify(initialData);
	},
	onUpdateDocument: async ({ document, description, dataStream }) => {
		// For updates, we preserve existing content and let client handle edits
		// The AI tool handles adding items, not onUpdateDocument
		const currentContent = document.content || "{}";

		dataStream.write({
			type: "data-canvasData",
			data: currentContent,
			transient: true,
		});

		return currentContent;
	},
});
