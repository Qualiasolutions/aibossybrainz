import {
  AuditActions,
  AuditResources,
  logAuditWithRequest,
} from "@/lib/audit/logger";
import { ChatSDKError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // Allow up to 60 seconds for data export

/**
 * GDPR Data Export API
 * Exports all user data in JSON format for GDPR compliance (Right to Data Portability)
 *
 * GET /api/export-user-data
 *
 * Returns a JSON file containing:
 * - User profile
 * - All chats and messages
 * - Documents and suggestions
 * - Reactions and votes
 * - Analytics data
 * - Strategy canvases
 * - Conversation summaries
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new ChatSDKError(
        "unauthorized:api",
        "Authentication required",
      ).toResponse();
    }

    // Fetch all user data in parallel
    const [
      profileResult,
      chatsResult,
      documentsResult,
      reactionsResult,
      analyticsResult,
      canvasesResult,
      summariesResult,
      memoryResult,
    ] = await Promise.all([
      // User profile
      supabase
        .from("User")
        .select("*")
        .eq("id", user.id)
        .single(),

      // All chats (including soft-deleted for complete export)
      supabase
        .from("Chat")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false }),

      // All documents
      supabase
        .from("Document")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false }),

      // All reactions
      supabase
        .from("MessageReaction")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false }),

      // Analytics data
      supabase
        .from("UserAnalytics")
        .select("*")
        .eq("userId", user.id)
        .order("date", { ascending: false }),

      // Strategy canvases
      supabase
        .from("StrategyCanvas")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false }),

      // Conversation summaries
      supabase
        .from("ConversationSummary")
        .select("*")
        .eq("userId", user.id)
        .order("createdAt", { ascending: false }),

      // Executive memory
      supabase
        .from("ExecutiveMemory")
        .select("*")
        .eq("userId", user.id),
    ]);

    // Fetch messages for user's chats
    const chatIds = chatsResult.data?.map((c) => c.id) || [];
    let messagesData: unknown[] = [];
    let votesData: unknown[] = [];

    if (chatIds.length > 0) {
      const [messagesResult, votesResult] = await Promise.all([
        supabase
          .from("Message_v2")
          .select("*")
          .in("chatId", chatIds)
          .order("createdAt", { ascending: true }),
        supabase.from("Vote_v2").select("*").in("chatId", chatIds),
      ]);

      messagesData = messagesResult.data || [];
      votesData = votesResult.data || [];
    }

    // Compile export data
    const exportData = {
      exportInfo: {
        exportDate: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        format: "JSON",
        version: "1.0",
        gdprCompliant: true,
      },
      profile: profileResult.data,
      chats: chatsResult.data || [],
      messages: messagesData,
      documents: documentsResult.data || [],
      reactions: reactionsResult.data || [],
      votes: votesData,
      analytics: analyticsResult.data || [],
      strategyCanvases: canvasesResult.data || [],
      conversationSummaries: summariesResult.data || [],
      executiveMemory: memoryResult.data || [],
      _metadata: {
        totalChats: chatsResult.data?.length || 0,
        totalMessages: messagesData.length,
        totalDocuments: documentsResult.data?.length || 0,
        totalReactions: reactionsResult.data?.length || 0,
        totalVotes: votesData.length,
      },
    };

    // Log the export for audit trail
    await logAuditWithRequest(request, {
      userId: user.id,
      action: AuditActions.DATA_EXPORT,
      resource: AuditResources.DATA,
      resourceId: user.id,
      details: {
        totalChats: exportData._metadata.totalChats,
        totalMessages: exportData._metadata.totalMessages,
        totalDocuments: exportData._metadata.totalDocuments,
      },
    });

    // Return as downloadable JSON
    const filename = `user-data-export-${user.id.slice(0, 8)}-${Date.now()}.json`;

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[GDPR Export] Error exporting user data:", error);

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    return new ChatSDKError(
      "bad_request:api",
      "Failed to export user data. Please try again.",
    ).toResponse();
  }
}
