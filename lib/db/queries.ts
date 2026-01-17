import "server-only";

import { revalidateTag, unstable_cache } from "next/cache";
import type { ArtifactKind } from "@/components/artifact";
import { ChatSDKError } from "../errors";
import { withRetry } from "../resilience";
import { createClient, createServiceClient } from "../supabase/server";
import type { AppUsage } from "../usage";

// Database-specific retry options for transient failures
const dbRetryOptions = {
  maxRetries: 3,
  initialDelay: 500,
  maxDelay: 5000,
  backoffMultiplier: 2,
  retryableErrors: (error: unknown) => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("network") ||
        message.includes("timeout") ||
        message.includes("connection") ||
        message.includes("econnreset") ||
        message.includes("econnrefused") ||
        message.includes("pgrst") ||
        message.includes("socket")
      );
    }
    return false;
  },
};

import type {
  BotType,
  CanvasType,
  Chat,
  ConversationSummary,
  DBMessage,
  Document,
  ExecutiveMemory,
  Json,
  MessageReaction,
  ReactionType,
  StrategyCanvas,
  Suggestion,
  User,
  VisibilityType,
  Vote,
} from "../supabase/types";

// ============================================
// TYPE GUARDS FOR JOIN QUERY RESULTS
// ============================================

interface JoinedChat {
  id: string;
  title: string;
  topic: string | null;
  topicColor: string | null;
  deletedAt: string | null;
}

interface JoinedMessage {
  id: string;
  chatId: string;
  parts: Json;
  role: string;
  botType: string | null;
  createdAt: string;
  deletedAt: string | null;
  chat: JoinedChat | null;
}

function isJoinedChat(obj: unknown): obj is JoinedChat {
  if (obj === null || typeof obj !== "object") return false;
  const chat = obj as Record<string, unknown>;
  return (
    typeof chat.id === "string" &&
    typeof chat.title === "string" &&
    (chat.topic === null || typeof chat.topic === "string") &&
    (chat.topicColor === null || typeof chat.topicColor === "string")
  );
}

function isJoinedMessage(obj: unknown): obj is JoinedMessage {
  if (obj === null || typeof obj !== "object") return false;
  const msg = obj as Record<string, unknown>;
  return (
    typeof msg.id === "string" &&
    typeof msg.chatId === "string" &&
    msg.parts !== undefined &&
    typeof msg.role === "string" &&
    (msg.botType === null || typeof msg.botType === "string") &&
    typeof msg.createdAt === "string" &&
    (msg.chat === null || isJoinedChat(msg.chat))
  );
}

// Re-export types for backwards compatibility
export type {
  User,
  Chat,
  DBMessage,
  Vote,
  Document,
  Suggestion,
  ExecutiveMemory,
  MessageReaction,
};

// ============================================
// USER QUERIES
// ============================================

export async function getUser(email: string): Promise<User[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("email", email);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email",
    );
  }
}

export async function createUser({
  id,
  email,
}: {
  id?: string;
  email: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("User")
      .insert({ id, email })
      .select();

    if (error) throw error;
    return data;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }
}

/**
 * Ensures a User record exists for the authenticated Supabase Auth user.
 * Creates one if it doesn't exist. This syncs Supabase Auth users with our custom User table.
 */
export async function ensureUserExists({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  try {
    // Use service client to bypass RLS for user creation
    const supabase = createServiceClient();

    // Upsert user - creates if not exists, updates email if exists
    const { data, error } = await supabase
      .from("User")
      .upsert({ id, email }, { onConflict: "id" })
      .select("id")
      .single();

    if (error) {
      console.error("[ensureUserExists] Upsert error:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("ensureUserExists error:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to ensure user exists",
    );
  }
}

/**
 * Checks if a user's subscription is active.
 * Returns subscription status info for access control.
 */
export async function checkUserSubscription(userId: string): Promise<{
  isActive: boolean;
  subscriptionType: string | null;
  daysRemaining: number | null;
  isAdmin: boolean;
}> {
  try {
    const supabase = createServiceClient();

    const { data: user, error } = await supabase
      .from("User")
      .select(
        "subscriptionStatus, subscriptionType, subscriptionEndDate, isAdmin",
      )
      .eq("id", userId)
      .single();

    if (error || !user) {
      console.error("[checkUserSubscription] Error:", error);
      return {
        isActive: false,
        subscriptionType: null,
        daysRemaining: null,
        isAdmin: false,
      };
    }

    // Admins always have access
    if (user.isAdmin) {
      return {
        isActive: true,
        subscriptionType: user.subscriptionType,
        daysRemaining: null,
        isAdmin: true,
      };
    }

    // Check if subscription is active
    if (user.subscriptionStatus !== "active") {
      return {
        isActive: false,
        subscriptionType: user.subscriptionType,
        daysRemaining: null,
        isAdmin: false,
      };
    }

    // Check if subscription end date has passed
    if (user.subscriptionEndDate) {
      const endDate = new Date(user.subscriptionEndDate);
      const now = new Date();
      const daysRemaining = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysRemaining <= 0) {
        // Update status to expired
        await supabase
          .from("User")
          .update({ subscriptionStatus: "expired" })
          .eq("id", userId);

        return {
          isActive: false,
          subscriptionType: user.subscriptionType,
          daysRemaining: 0,
          isAdmin: false,
        };
      }

      return {
        isActive: true,
        subscriptionType: user.subscriptionType,
        daysRemaining,
        isAdmin: false,
      };
    }

    return {
      isActive: true,
      subscriptionType: user.subscriptionType,
      daysRemaining: null,
      isAdmin: false,
    };
  } catch (error) {
    console.error("checkUserSubscription error:", error);
    // SECURITY: Fail closed - deny access if subscription check fails
    // This prevents attackers from bypassing subscription checks via DB errors
    return {
      isActive: false,
      subscriptionType: null,
      daysRemaining: null,
      isAdmin: false,
    };
  }
}

// ============================================
// AUDIT LOG QUERIES
// ============================================

export async function createAuditLog({
  userId,
  action,
  resource,
  resourceId,
  details,
  ipAddress,
  userAgent,
}: {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Json;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("AuditLog").insert({
      userId,
      action,
      resource,
      resourceId,
      details: details ?? {},
      ipAddress,
      userAgent,
    });

    if (error) {
      console.error("Failed to create audit log:", error);
      // Don't throw - audit logs shouldn't break the main operation
    }
  } catch (error) {
    console.error("createAuditLog error:", error);
    // Non-critical - audit failure shouldn't break main operation
  }
}

// ============================================
// CHAT QUERIES
// ============================================

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Chat")
      .insert({
        id,
        createdAt: new Date().toISOString(),
        userId,
        title,
        visibility,
      })
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("saveChat error:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }
}

export async function updateChatTitle({
  chatId,
  title,
}: {
  chatId: string;
  title: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("Chat")
      .update({ title })
      .eq("id", chatId);

    if (error) throw error;
  } catch (_error) {
    // Non-critical - title update failure shouldn't break the chat
    console.warn("Failed to update chat title:", chatId);
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await withRetry(async () => {
      const supabase = await createClient();
      const deletedAt = new Date().toISOString();

      // Soft delete related records in parallel for better performance
      await Promise.all([
        supabase.from("Vote_v2").update({ deletedAt }).eq("chatId", id),
        supabase.from("Message_v2").update({ deletedAt }).eq("chatId", id),
        supabase.from("Stream").update({ deletedAt }).eq("chatId", id),
      ]);

      // Soft delete the chat (after related records to maintain referential integrity)
      const { data, error } = await supabase
        .from("Chat")
        .update({ deletedAt })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data?.[0];
    }, dbRetryOptions);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id",
    );
  }
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
  try {
    return await withRetry(async () => {
      const supabase = await createClient();
      const deletedAt = new Date().toISOString();

      // Get all chat IDs for this user (only non-deleted)
      const { data: userChats } = await supabase
        .from("Chat")
        .select("id")
        .eq("userId", userId)
        .is("deletedAt", null);

      if (!userChats || userChats.length === 0) {
        return { deletedCount: 0 };
      }

      const chatIds = userChats.map((c) => c.id);

      // Soft delete related records in parallel for better performance
      await Promise.all([
        supabase.from("Vote_v2").update({ deletedAt }).in("chatId", chatIds),
        supabase.from("Message_v2").update({ deletedAt }).in("chatId", chatIds),
        supabase.from("Stream").update({ deletedAt }).in("chatId", chatIds),
      ]);

      // Soft delete chats (after related records)
      const { data: deletedChats } = await supabase
        .from("Chat")
        .update({ deletedAt })
        .eq("userId", userId)
        .is("deletedAt", null)
        .select();

      return { deletedCount: deletedChats?.length || 0 };
    }, dbRetryOptions);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete all chats by user id",
    );
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const supabase = await createClient();
    const extendedLimit = limit + 1;

    let query = supabase
      .from("Chat")
      .select("*")
      .eq("userId", id)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(extendedLimit);

    if (startingAfter) {
      const { data: selectedChat } = await supabase
        .from("Chat")
        .select("createdAt")
        .eq("id", startingAfter)
        .single();

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`,
        );
      }

      query = query.gt("createdAt", selectedChat.createdAt);
    } else if (endingBefore) {
      const { data: selectedChat } = await supabase
        .from("Chat")
        .select("createdAt")
        .eq("id", endingBefore)
        .single();

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`,
        );
      }

      query = query.lt("createdAt", selectedChat.createdAt);
    }

    const { data: filteredChats, error } = await query;

    if (error) throw error;

    const chats = filteredChats || [];
    const hasMore = chats.length > limit;

    return {
      chats: hasMore ? chats.slice(0, limit) : chats,
      hasMore,
    };
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id",
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Chat")
      .select("*")
      .eq("id", id)
      .is("deletedAt", null)
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
    return data || null;
  } catch (error) {
    console.error("getChatById error:", error);
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }
}

// ============================================
// MESSAGE QUERIES
// ============================================

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Message_v2")
      .insert(messages)
      .select();

    if (error) throw error;

    // Invalidate message cache for affected chats
    const chatIds = [...new Set(messages.map((m) => m.chatId))];
    for (const chatId of chatIds) {
      revalidateTag(`chat-${chatId}`, { expire: 0 });
    }

    return data;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }
}

// Cache message fetching for 10 seconds to handle rapid consecutive requests
const _getCachedMessages = (chatId: string) => {
  return unstable_cache(
    async () => {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("Message_v2")
        .select("*")
        .eq("chatId", chatId)
        .is("deletedAt", null)
        .order("createdAt", { ascending: true });

      if (error) {
        console.error("getCachedMessages Supabase error:", error);
        throw error;
      }
      return data || [];
    },
    [`chat-messages-${chatId}`],
    {
      revalidate: 10, // 10 seconds cache
      tags: [`chat-${chatId}`],
    },
  )();
};

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    // Use cached version for performance (10s cache with tags for invalidation)
    return await _getCachedMessages(id);
  } catch (error) {
    // Fallback to direct query if cache fails
    console.error("getMessagesByChatId cache error, falling back:", error);
    try {
      const supabase = await createClient();
      const { data, error: dbError } = await supabase
        .from("Message_v2")
        .select("*")
        .eq("chatId", id)
        .is("deletedAt", null)
        .order("createdAt", { ascending: true });

      if (dbError) throw dbError;
      return data || [];
    } catch (fallbackError) {
      console.error("getMessagesByChatId fallback error:", fallbackError);
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to get messages by chat id",
      );
    }
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Message_v2")
      .select("*")
      .eq("id", id);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id",
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date | string;
}) {
  try {
    return await withRetry(async () => {
      const supabase = await createClient();
      const isoTimestamp =
        typeof timestamp === "string" ? timestamp : timestamp.toISOString();
      const deletedAt = new Date().toISOString();

      // Get messages to soft delete (only non-deleted ones)
      const { data: messagesToDelete } = await supabase
        .from("Message_v2")
        .select("id")
        .eq("chatId", chatId)
        .gte("createdAt", isoTimestamp)
        .is("deletedAt", null);

      const messageIds = messagesToDelete?.map((m) => m.id) || [];

      if (messageIds.length > 0) {
        // Soft delete votes for these messages
        await supabase
          .from("Vote_v2")
          .update({ deletedAt })
          .eq("chatId", chatId)
          .in("messageId", messageIds);

        // Soft delete messages
        return await supabase
          .from("Message_v2")
          .update({ deletedAt })
          .eq("chatId", chatId)
          .in("id", messageIds);
      }
    }, dbRetryOptions);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp",
    );
  }
}

// ============================================
// VOTE QUERIES
// ============================================

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  try {
    const supabase = await createClient();

    // Use upsert pattern
    const { error } = await supabase.from("Vote_v2").upsert(
      {
        chatId,
        messageId,
        isUpvoted: type === "up",
      },
      {
        onConflict: "chatId,messageId",
      },
    );

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Vote_v2")
      .select("*")
      .eq("chatId", id);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id",
    );
  }
}

// ============================================
// DOCUMENT QUERIES
// ============================================

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Document")
      .insert({
        id,
        title,
        kind,
        content,
        userId,
        createdAt: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data;
  } catch (_error) {
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Document")
      .select("*")
      .eq("id", id)
      .is("deletedAt", null)
      .order("createdAt", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id",
    );
  }
}

export async function getDocumentById({ id }: { id: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Document")
      .select("*")
      .eq("id", id)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id",
    );
  }
}

export async function getDocumentsByUserId({ userId }: { userId: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Document")
      .select("*")
      .eq("userId", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by user id",
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    return await withRetry(async () => {
      const supabase = await createClient();
      const deletedAt = new Date().toISOString();

      // Soft delete suggestions first
      await supabase
        .from("Suggestion")
        .update({ deletedAt })
        .eq("documentId", id)
        .gt("documentCreatedAt", timestamp.toISOString());

      // Soft delete documents
      const { data, error } = await supabase
        .from("Document")
        .update({ deletedAt })
        .eq("id", id)
        .gt("createdAt", timestamp.toISOString())
        .is("deletedAt", null)
        .select();

      if (error) throw error;
      return data;
    }, dbRetryOptions);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp",
    );
  }
}

// ============================================
// SUGGESTION QUERIES
// ============================================

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Suggestion")
      .insert(suggestions)
      .select();

    if (error) throw error;
    return data;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions",
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Suggestion")
      .select("*")
      .eq("documentId", documentId);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id",
    );
  }
}

// ============================================
// CHAT UPDATES
// ============================================

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("Chat")
      .update({ visibility })
      .eq("id", chatId);

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id",
    );
  }
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  context: AppUsage;
}) {
  try {
    const supabase = await createClient();
    await supabase
      .from("Chat")
      .update({ lastContext: context as any })
      .eq("id", chatId);
  } catch (error) {
    console.warn("Failed to update lastContext for chat", chatId, error);
  }
}

export async function updateChatPinStatus({
  chatId,
  isPinned,
}: {
  chatId: string;
  isPinned: boolean;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("Chat")
      .update({ isPinned })
      .eq("id", chatId);

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat pin status",
    );
  }
}

export async function updateChatTopic({
  chatId,
  topic,
  topicColor,
}: {
  chatId: string;
  topic: string | null;
  topicColor: string | null;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("Chat")
      .update({ topic, topicColor })
      .eq("id", chatId);

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat topic",
    );
  }
}

// ============================================
// ANALYTICS QUERIES
// ============================================

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    const supabase = await createClient();
    const cutoffTime = new Date(
      Date.now() - differenceInHours * 60 * 60 * 1000,
    ).toISOString();

    // Use RPC function to count messages in a single query (fixes N+1)
    const { data, error } = await supabase.rpc("get_user_message_count", {
      p_user_id: id,
      p_cutoff_time: cutoffTime,
    });

    if (error) throw error;
    return data || 0;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id",
    );
  }
}

// ============================================
// STREAM QUERIES
// ============================================

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("Stream").insert({
      id: streamId,
      chatId,
      createdAt: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id",
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("Stream")
      .select("id")
      .eq("chatId", chatId)
      .order("createdAt", { ascending: true });

    if (error) throw error;
    return (data || []).map(({ id }) => id);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id",
    );
  }
}

// ============================================
// EXECUTIVE MEMORY QUERIES
// ============================================

export async function getExecutiveMemory({
  userId,
}: {
  userId: string;
}): Promise<ExecutiveMemory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ExecutiveMemory")
      .select("*")
      .eq("userId", userId)
      .order("preferenceScore", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get executive memory",
    );
  }
}

export async function updateExecutiveMemory({
  userId,
  executive,
  topic,
}: {
  userId: string;
  executive: BotType;
  topic?: string;
}) {
  try {
    const supabase = await createClient();

    // Try to get existing record
    const { data: existing } = await supabase
      .from("ExecutiveMemory")
      .select("*")
      .eq("userId", userId)
      .eq("executive", executive)
      .limit(1);

    if (existing && existing.length > 0) {
      const record = existing[0];
      const currentCount = (record.messageCount as number) || 0;
      const currentTopics = (record.topTopics as string[]) || [];
      const newTopics = topic
        ? [...new Set([...currentTopics, topic])].slice(-10)
        : currentTopics;

      await supabase
        .from("ExecutiveMemory")
        .update({
          messageCount: currentCount + 1,
          topTopics: newTopics,
          lastUsed: new Date().toISOString(),
          preferenceScore: currentCount + 1,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", record.id);
    } else {
      await supabase.from("ExecutiveMemory").insert({
        userId,
        executive,
        messageCount: 1,
        topTopics: topic ? [topic] : [],
        lastUsed: new Date().toISOString(),
        preferenceScore: 1,
      });
    }
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update executive memory",
    );
  }
}

export async function getExecutiveStats({
  userId,
}: {
  userId: string;
}): Promise<{
  total: number;
  breakdown: { executive: string; count: number; percentage: number }[];
  preferred: string | null;
}> {
  try {
    const memories = await getExecutiveMemory({ userId });
    const total = memories.reduce(
      (sum, m) => sum + ((m.messageCount as number) || 0),
      0,
    );

    const breakdown = memories.map((m) => ({
      executive: m.executive,
      count: (m.messageCount as number) || 0,
      percentage:
        total > 0
          ? Math.round((((m.messageCount as number) || 0) / total) * 100)
          : 0,
    }));

    const preferred = memories.length > 0 ? memories[0].executive : null;

    return { total, breakdown, preferred };
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get executive stats",
    );
  }
}

// ============================================
// MESSAGE REACTION QUERIES
// ============================================

export async function addMessageReaction({
  messageId,
  userId,
  reactionType,
}: {
  messageId: string;
  userId: string;
  reactionType: ReactionType;
}) {
  try {
    const supabase = await createClient();

    // Remove existing reaction of same type from same user
    await supabase
      .from("MessageReaction")
      .delete()
      .eq("messageId", messageId)
      .eq("userId", userId)
      .eq("reactionType", reactionType);

    // Add new reaction
    const { error } = await supabase.from("MessageReaction").insert({
      messageId,
      userId,
      reactionType,
    });

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to add message reaction",
    );
  }
}

export async function removeMessageReaction({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}) {
  try {
    const supabase = await createClient();
    await supabase
      .from("MessageReaction")
      .delete()
      .eq("messageId", messageId)
      .eq("userId", userId);
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to remove message reaction",
    );
  }
}

export async function getMessageReactions({
  messageId,
}: {
  messageId: string;
}): Promise<MessageReaction[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("MessageReaction")
      .select("*")
      .eq("messageId", messageId);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message reactions",
    );
  }
}

export async function getMessageReactionCounts({
  messageId,
}: {
  messageId: string;
}): Promise<Record<string, number>> {
  try {
    const reactions = await getMessageReactions({ messageId });
    const counts: Record<string, number> = {};

    for (const r of reactions) {
      counts[r.reactionType] = (counts[r.reactionType] || 0) + 1;
    }

    return counts;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message reaction counts",
    );
  }
}

export async function getUserReactionForMessage({
  messageId,
  userId,
}: {
  messageId: string;
  userId: string;
}): Promise<MessageReaction | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("MessageReaction")
      .select("*")
      .eq("messageId", messageId)
      .eq("userId", userId)
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user reaction for message",
    );
  }
}

// Get all reactions by type for a user with message and chat details
// Uses a single JOIN query instead of 3 sequential queries (fixes N+1)
export async function getUserReactionsByType({
  userId,
  reactionType,
}: {
  userId: string;
  reactionType: ReactionType;
}): Promise<
  {
    id: string;
    messageId: string;
    reactionType: string;
    createdAt: string;
    message: {
      id: string;
      chatId: string;
      parts: Json;
      role: string;
      botType: string | null;
      createdAt: string;
    } | null;
    chat: {
      id: string;
      title: string;
      topic: string | null;
      topicColor: string | null;
    } | null;
  }[]
> {
  try {
    const supabase = await createClient();

    // Single query with JOINs via Supabase's foreign key relationship syntax
    const { data, error } = await supabase
      .from("MessageReaction")
      .select(
        `
        id,
        messageId,
        reactionType,
        createdAt,
        message:Message_v2!messageId (
          id,
          chatId,
          parts,
          role,
          botType,
          createdAt,
          deletedAt,
          chat:Chat!chatId (
            id,
            title,
            topic,
            topicColor,
            deletedAt
          )
        )
      `,
      )
      .eq("userId", userId)
      .eq("reactionType", reactionType)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // Transform to expected format, filtering out soft-deleted messages/chats
    // Uses type guards instead of unsafe `as` assertions for runtime safety
    return data
      .filter((r) => {
        // Validate message structure at runtime
        if (!isJoinedMessage(r.message)) return false;
        const msg = r.message;
        // Exclude if message is deleted or chat is deleted
        if (msg.deletedAt) return false;
        if (msg.chat?.deletedAt) return false;
        return true;
      })
      .map((r) => {
        // Type guard already validated in filter, safe to use
        const msg = isJoinedMessage(r.message) ? r.message : null;

        return {
          id: r.id,
          messageId: r.messageId,
          reactionType: r.reactionType,
          createdAt: r.createdAt || new Date().toISOString(),
          message: msg
            ? {
                id: msg.id,
                chatId: msg.chatId,
                parts: msg.parts,
                role: msg.role,
                botType: msg.botType,
                createdAt: msg.createdAt,
              }
            : null,
          chat: msg?.chat
            ? {
                id: msg.chat.id,
                title: msg.chat.title,
                topic: msg.chat.topic,
                topicColor: msg.chat.topicColor,
              }
            : null,
        };
      });
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user reactions by type",
    );
  }
}

// ============================================
// USER PROFILE QUERIES
// ============================================

export async function getUserProfile({ userId }: { userId: string }) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("User")
      .select(
        "id, email, displayName, companyName, industry, businessGoals, preferredBotType, onboardedAt",
      )
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user profile",
    );
  }
}

export async function updateUserProfile({
  userId,
  displayName,
  companyName,
  industry,
  businessGoals,
  preferredBotType,
}: {
  userId: string;
  displayName?: string;
  companyName?: string;
  industry?: string;
  businessGoals?: string;
  preferredBotType?: BotType;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("User")
      .update({
        displayName,
        companyName,
        industry,
        businessGoals,
        preferredBotType,
        profileUpdatedAt: new Date().toISOString(),
        onboardedAt: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update user profile",
    );
  }
}

// ============================================
// STRATEGY CANVAS QUERIES
// ============================================

export async function getStrategyCanvas({
  userId,
  canvasType,
  canvasId,
}: {
  userId: string;
  canvasType?: CanvasType;
  canvasId?: string;
}): Promise<StrategyCanvas | null> {
  try {
    const supabase = await createClient();

    if (canvasId) {
      const { data, error } = await supabase
        .from("StrategyCanvas")
        .select("*")
        .eq("id", canvasId)
        .eq("userId", userId)
        .is("deletedAt", null)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    }

    // Get default canvas for type
    if (!canvasType) {
      return null;
    }

    const { data, error } = await supabase
      .from("StrategyCanvas")
      .select("*")
      .eq("userId", userId)
      .eq("canvasType", canvasType)
      .eq("isDefault", true)
      .is("deletedAt", null)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get strategy canvas",
    );
  }
}

export async function getAllUserCanvases({
  userId,
}: {
  userId: string;
}): Promise<StrategyCanvas[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("StrategyCanvas")
      .select("*")
      .eq("userId", userId)
      .is("deletedAt", null)
      .order("updatedAt", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user canvases",
    );
  }
}

export async function saveStrategyCanvas({
  userId,
  canvasType,
  name,
  data,
  canvasId,
  isDefault = true,
}: {
  userId: string;
  canvasType: CanvasType;
  name?: string;
  data: Json;
  canvasId?: string;
  isDefault?: boolean;
}): Promise<string | null> {
  try {
    const supabase = await createClient();

    // If setting as default, unset other defaults first
    if (isDefault) {
      await supabase
        .from("StrategyCanvas")
        .update({ isDefault: false })
        .eq("userId", userId)
        .eq("canvasType", canvasType);
    }

    if (canvasId) {
      // Update existing
      const { error } = await supabase
        .from("StrategyCanvas")
        .update({
          data,
          name,
          isDefault,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", canvasId)
        .eq("userId", userId);

      if (error) throw error;
      return canvasId;
    }

    // Create new
    const { data: newCanvas, error } = await supabase
      .from("StrategyCanvas")
      .insert({
        userId,
        canvasType,
        name:
          name ||
          `${canvasType.toUpperCase()} - ${new Date().toLocaleDateString()}`,
        data,
        isDefault,
      })
      .select("id")
      .single();

    if (error) throw error;
    return newCanvas?.id || null;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save strategy canvas",
    );
  }
}

export async function deleteStrategyCanvas({
  userId,
  canvasId,
}: {
  userId: string;
  canvasId: string;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("StrategyCanvas")
      .update({ deletedAt: new Date().toISOString() })
      .eq("id", canvasId)
      .eq("userId", userId);

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete strategy canvas",
    );
  }
}

// ============================================
// CONVERSATION SUMMARY QUERIES
// ============================================

export async function saveConversationSummary({
  userId,
  chatId,
  summary,
  topics,
  keyInsights,
  importance = 5,
}: {
  userId: string;
  chatId: string;
  summary: string;
  topics: string[];
  keyInsights?: Json;
  importance?: number;
}) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("ConversationSummary").insert({
      userId,
      chatId,
      summary,
      topics,
      keyInsights: keyInsights || [],
      importance,
    });

    if (error) throw error;
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save conversation summary",
    );
  }
}

export async function getRecentConversationSummaries({
  userId,
  limit = 3,
}: {
  userId: string;
  limit?: number;
}): Promise<ConversationSummary[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("ConversationSummary")
      .select("*")
      .eq("userId", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get recent summaries",
    );
  }
}

export async function getRelevantConversationHistory({
  userId,
  topics,
  limit = 5,
}: {
  userId: string;
  topics?: string[];
  limit?: number;
}): Promise<ConversationSummary[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("ConversationSummary")
      .select("*")
      .eq("userId", userId)
      .is("deletedAt", null)
      .order("importance", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(limit);

    // Topic filtering using array overlap if topics provided
    if (topics && topics.length > 0) {
      query = query.overlaps("topics", topics);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (_error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get conversation history",
    );
  }
}
