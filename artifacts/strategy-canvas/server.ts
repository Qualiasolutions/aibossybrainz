import { createDocumentHandler } from "@/lib/artifacts/server";
import type { CanvasType } from "@/components/strategy-canvas/types";

// Get comprehensive data structure for ALL canvas types (all 4 tabs)
// This ensures all sections are initialized so items can be added to any tab
function getAllCanvasData(): object {
	return {
		// SWOT Tab
		strengths: [],
		weaknesses: [],
		opportunities: [],
		threats: [],
		// BMC Tab (Business Model Canvas)
		keyPartners: [],
		keyActivities: [],
		keyResources: [],
		valuePropositions: [],
		customerRelationships: [],
		channels: [],
		customerSegments: [],
		costStructure: [],
		revenueStreams: [],
		// Journey Tab (Customer Journey)
		awareness: [],
		consideration: [],
		decision: [],
		purchase: [],
		retention: [],
		advocacy: [],
		// Ideas Tab (Brainstorm)
		notes: [],
	};
}

export const strategyCanvasDocumentHandler = createDocumentHandler<"strategy-canvas">({
	kind: "strategy-canvas",
	onCreateDocument: async ({ title, dataStream }) => {
		// Determine which tab to show initially based on title
		let canvasType: CanvasType = "swot";
		const titleLower = title.toLowerCase();
		if (titleLower.includes("bmc") || titleLower.includes("business model")) {
			canvasType = "bmc";
		} else if (titleLower.includes("journey")) {
			canvasType = "journey";
		} else if (titleLower.includes("brainstorm")) {
			canvasType = "brainstorm";
		}

		// Initialize with ALL canvas sections (all 4 tabs) so AI can populate any section
		const initialData = getAllCanvasData();

		// Stream canvas type for client to know which tab to show initially
		dataStream.write({
			type: "data-canvasType",
			data: canvasType,
			transient: true,
		});

		// Stream initial data structure with all sections initialized
		dataStream.write({
			type: "data-canvasData",
			data: JSON.stringify(initialData),
			transient: true,
		});

		return JSON.stringify(initialData);
	},
	onUpdateDocument: async ({ document, description: _description, dataStream }) => {
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
