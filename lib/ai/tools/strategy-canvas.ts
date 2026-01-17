import { tool, type UIMessageStreamWriter } from "ai";
import { z } from "zod";
import type { Session } from "@/lib/artifacts/server";
import { getDocumentById, saveDocument } from "@/lib/db/queries";
import type { ChatMessage } from "@/lib/types";
import { generateUUID } from "@/lib/utils";

type StrategyCanvasProps = {
  session: Session;
  dataStream: UIMessageStreamWriter<ChatMessage>;
};

// Get comprehensive data structure for ALL canvas types (all 4 tabs)
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

const strategyCanvasSchema = z.object({
  action: z
    .enum(["create", "addItems", "populateSection"])
    .describe("Action to perform on the canvas"),
  canvasType: z
    .enum(["swot", "bmc", "journey", "brainstorm"])
    .describe("Type of strategic canvas to target"),
  title: z
    .string()
    .optional()
    .describe("Title for the canvas (used when creating)"),
  documentId: z
    .string()
    .optional()
    .describe(
      "Document ID returned from create action. REQUIRED for populateSection to persist items.",
    ),
  section: z
    .string()
    .optional()
    .describe(
      "Section to add items to. SWOT: strengths/weaknesses/opportunities/threats. BMC: keyPartners/keyActivities/keyResources/valuePropositions/customerRelationships/channels/customerSegments/costStructure/revenueStreams. Journey: awareness/consideration/decision/purchase/retention/advocacy. Brainstorm: notes",
    ),
  items: z
    .array(z.string())
    .optional()
    .describe(
      "Items to add to the specified section (3-5 items per section recommended)",
    ),
});

type StrategyCanvasInput = z.infer<typeof strategyCanvasSchema>;

export const strategyCanvas = ({ session, dataStream }: StrategyCanvasProps) =>
  tool({
    description: `Strategic planning canvas tool with 4 integrated tabs: SWOT, BMC (Business Model), Journey, and Ideas.

CRITICAL: When a user asks for strategic analysis, you MUST populate ALL 4 TABS automatically:
1. First call "create" with canvasType="swot" and a title - this returns a documentId (id field)
2. Then call "populateSection" multiple times with the SAME documentId to fill EVERY section across ALL canvas types:

FOR SWOT TAB:
- section="strengths" (3-5 internal advantages)
- section="weaknesses" (3-5 internal challenges)
- section="opportunities" (3-5 external possibilities)
- section="threats" (3-5 external risks)

FOR BMC TAB (Business Model Canvas):
- section="keyPartners" (key partnerships)
- section="keyActivities" (core activities)
- section="keyResources" (essential resources)
- section="valuePropositions" (value delivered)
- section="customerRelationships" (how you engage customers)
- section="channels" (how you reach customers)
- section="customerSegments" (target customers)
- section="costStructure" (main costs)
- section="revenueStreams" (how you make money)

FOR JOURNEY TAB (Customer Journey):
- section="awareness" (how customers discover you)
- section="consideration" (evaluation touchpoints)
- section="decision" (purchase decision factors)
- section="purchase" (buying experience)
- section="retention" (keeping customers)
- section="advocacy" (turning customers into advocates)

FOR IDEAS TAB:
- section="notes" (brainstorm ideas)

WORKFLOW: Create canvas ONCE, then call populateSection for EACH section above (include documentId from create response). This gives users a complete strategic framework they can edit.`,
    inputSchema: strategyCanvasSchema,
    execute: async ({
      action,
      canvasType,
      title,
      documentId,
      section,
      items,
    }: StrategyCanvasInput) => {
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

        // Initialize with ALL canvas sections (all 4 tabs) so any section can receive items
        const initialData = getAllCanvasData();
        dataStream.write({
          type: "data-canvasData",
          data: JSON.stringify(initialData),
          transient: true,
        });

        // Save to database with all sections initialized
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
          message: `Created strategy canvas "${canvasTitle}". NOW POPULATE ALL 4 TABS by calling populateSection for: strengths, weaknesses, opportunities, threats (SWOT), keyPartners, keyActivities, keyResources, valuePropositions, customerRelationships, channels, customerSegments, costStructure, revenueStreams (BMC), awareness, consideration, decision, purchase, retention, advocacy (Journey), and notes (Ideas).`,
        };
      }

      if (
        (action === "addItems" || action === "populateSection") &&
        section &&
        items &&
        items.length > 0
      ) {
        // Generate items with IDs for both streaming and persistence
        const itemsWithIds = items.map((content) => ({
          id: generateUUID(),
          content,
          color: "slate" as const,
        }));

        // Stream each item addition to the canvas for real-time UI updates
        for (const item of itemsWithIds) {
          dataStream.write({
            type: "data-canvasItem",
            data: {
              section,
              content: item.content,
              id: item.id,
            },
            transient: true,
          });
        }

        // Persist items to database if documentId is provided
        if (documentId && session?.user?.id) {
          try {
            const existingDoc = await getDocumentById({ id: documentId });
            if (existingDoc) {
              const currentData = existingDoc.content
                ? JSON.parse(existingDoc.content)
                : getAllCanvasData();

              // Add items to the section
              if (!currentData[section]) {
                currentData[section] = [];
              }
              currentData[section].push(...itemsWithIds);

              // Save updated document
              await saveDocument({
                id: documentId,
                title: existingDoc.title,
                content: JSON.stringify(currentData),
                kind: "strategy-canvas",
                userId: session.user.id,
              });
            }
          } catch (error) {
            console.error("Failed to persist canvas items:", error);
            // Continue anyway - UI still shows the items from streaming
          }
        }

        // Map section to canvas tab for better UX messaging
        const sectionToTab: Record<string, string> = {
          strengths: "SWOT",
          weaknesses: "SWOT",
          opportunities: "SWOT",
          threats: "SWOT",
          keyPartners: "BMC",
          keyActivities: "BMC",
          keyResources: "BMC",
          valuePropositions: "BMC",
          customerRelationships: "BMC",
          channels: "BMC",
          customerSegments: "BMC",
          costStructure: "BMC",
          revenueStreams: "BMC",
          awareness: "Journey",
          consideration: "Journey",
          decision: "Journey",
          purchase: "Journey",
          retention: "Journey",
          advocacy: "Journey",
          notes: "Ideas",
        };
        const tabName = sectionToTab[section] || canvasType.toUpperCase();

        return {
          section,
          items: itemsWithIds,
          message: `Added ${items.length} item${items.length === 1 ? "" : "s"} to ${section} (${tabName} tab). Continue populating other sections to complete all 4 tabs.`,
        };
      }

      return {
        message:
          "No action taken. Use action='create' first, then action='populateSection' with section and items for each canvas section.",
      };
    },
  });
