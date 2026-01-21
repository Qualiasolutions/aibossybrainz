import "server-only";

import { createServiceClient } from "../supabase/server";
import type {
  Chat,
  DBMessage,
  SubscriptionStatus,
  SubscriptionType,
  User,
} from "../supabase/types";

// ============================================
// ADMIN USER QUERIES (uses service role - bypasses RLS)
// ============================================

export type AdminUser = User & {
  chatCount: number;
  messageCount: number;
  lastActiveAt: string | null;
};

export async function getAllUsers(): Promise<AdminUser[]> {
  const supabase = createServiceClient();

  const { data: users, error } = await supabase
    .from("User")
    .select("*")
    .is("deletedAt", null)
    .order("onboardedAt", { ascending: false, nullsFirst: false });

  if (error) throw error;

  // Get chat and message counts for each user
  const enrichedUsers = await Promise.all(
    (users || []).map(async (user) => {
      const { count: chatCount } = await supabase
        .from("Chat")
        .select("*", { count: "exact", head: true })
        .eq("userId", user.id)
        .is("deletedAt", null);

      const { data: userChats } = await supabase
        .from("Chat")
        .select("id")
        .eq("userId", user.id)
        .is("deletedAt", null);

      let messageCount = 0;
      let lastActiveAt: string | null = null;

      if (userChats && userChats.length > 0) {
        const chatIds = userChats.map((c) => c.id);

        const { count } = await supabase
          .from("Message_v2")
          .select("*", { count: "exact", head: true })
          .in("chatId", chatIds)
          .is("deletedAt", null);

        messageCount = count || 0;

        // Get last message date
        const { data: lastMessage } = await supabase
          .from("Message_v2")
          .select("createdAt")
          .in("chatId", chatIds)
          .is("deletedAt", null)
          .order("createdAt", { ascending: false })
          .limit(1);

        lastActiveAt = lastMessage?.[0]?.createdAt || null;
      }

      return {
        ...user,
        chatCount: chatCount || 0,
        messageCount,
        lastActiveAt,
      };
    }),
  );

  return enrichedUsers;
}

export async function getUserById(userId: string): Promise<AdminUser | null> {
  const supabase = createServiceClient();

  const { data: user, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !user) return null;

  const { count: chatCount } = await supabase
    .from("Chat")
    .select("*", { count: "exact", head: true })
    .eq("userId", userId)
    .is("deletedAt", null);

  const { data: userChats } = await supabase
    .from("Chat")
    .select("id")
    .eq("userId", userId)
    .is("deletedAt", null);

  let messageCount = 0;
  let lastActiveAt: string | null = null;

  if (userChats && userChats.length > 0) {
    const chatIds = userChats.map((c) => c.id);
    const { count } = await supabase
      .from("Message_v2")
      .select("*", { count: "exact", head: true })
      .in("chatId", chatIds)
      .is("deletedAt", null);

    messageCount = count || 0;

    const { data: lastMessage } = await supabase
      .from("Message_v2")
      .select("createdAt")
      .in("chatId", chatIds)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(1);

    lastActiveAt = lastMessage?.[0]?.createdAt || null;
  }

  return {
    ...user,
    chatCount: chatCount || 0,
    messageCount,
    lastActiveAt,
  };
}

// Helper to calculate subscription end date
function calculateSubscriptionEndDate(
  startDate: Date,
  subscriptionType: SubscriptionType,
): Date {
  const endDate = new Date(startDate);
  switch (subscriptionType) {
    case "trial":
      endDate.setDate(endDate.getDate() + 7);
      break;
    case "monthly":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "annual":
      endDate.setMonth(endDate.getMonth() + 12);
      break;
    case "lifetime":
      endDate.setFullYear(endDate.getFullYear() + 100);
      break;
  }
  return endDate;
}

export async function createUserByAdmin({
  email,
  displayName,
  companyName,
  industry,
  isAdmin = false,
  subscriptionType = "trial",
}: {
  email: string;
  displayName?: string;
  companyName?: string;
  industry?: string;
  isAdmin?: boolean;
  subscriptionType?: SubscriptionType;
}) {
  const supabase = createServiceClient();

  const startDate = new Date();
  const endDate = calculateSubscriptionEndDate(startDate, subscriptionType);

  const { data, error } = await supabase
    .from("User")
    .insert({
      email,
      displayName,
      companyName,
      industry,
      isAdmin,
      subscriptionType,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionEndDate: endDate.toISOString(),
      subscriptionStatus: "active" as SubscriptionStatus,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserByAdmin(
  userId: string,
  updates: {
    displayName?: string;
    companyName?: string;
    industry?: string;
    userType?: string;
    isAdmin?: boolean;
    subscriptionType?: SubscriptionType;
    subscriptionStatus?: SubscriptionStatus;
  },
) {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("User")
    .update({
      ...updates,
      profileUpdatedAt: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update user subscription (change type and reset dates)
export async function updateUserSubscription(
  userId: string,
  subscriptionType: SubscriptionType,
) {
  const supabase = createServiceClient();

  const startDate = new Date();
  const endDate = calculateSubscriptionEndDate(startDate, subscriptionType);

  const { data, error } = await supabase
    .from("User")
    .update({
      subscriptionType,
      subscriptionStartDate: startDate.toISOString(),
      subscriptionEndDate: endDate.toISOString(),
      subscriptionStatus: "active" as SubscriptionStatus,
      profileUpdatedAt: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Expire all subscriptions that have passed their end date
export async function expireSubscriptions() {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("User")
    .update({
      subscriptionStatus: "expired" as SubscriptionStatus,
    })
    .lt("subscriptionEndDate", new Date().toISOString())
    .eq("subscriptionStatus", "active")
    .is("deletedAt", null)
    .select();

  if (error) throw error;
  return data;
}

// Check if a user's subscription is active
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("User")
    .select("subscriptionStatus, subscriptionEndDate")
    .eq("id", userId)
    .single();

  if (error || !data) return false;

  // Check if status is active and end date hasn't passed
  if (data.subscriptionStatus !== "active") return false;
  if (
    data.subscriptionEndDate &&
    new Date(data.subscriptionEndDate) < new Date()
  )
    return false;

  return true;
}

export async function deleteUserByAdmin(userId: string) {
  const supabase = createServiceClient();

  // Soft delete all related data
  const deletedAt = new Date().toISOString();

  // Get user's chats
  const { data: userChats } = await supabase
    .from("Chat")
    .select("id")
    .eq("userId", userId);

  const chatIds = userChats?.map((c) => c.id) || [];

  if (chatIds.length > 0) {
    // Soft delete messages
    await supabase
      .from("Message_v2")
      .update({ deletedAt })
      .in("chatId", chatIds);

    // Soft delete votes
    await supabase.from("Vote_v2").update({ deletedAt }).in("chatId", chatIds);

    // Soft delete streams
    await supabase.from("Stream").update({ deletedAt }).in("chatId", chatIds);

    // Soft delete chats
    await supabase.from("Chat").update({ deletedAt }).in("id", chatIds);
  }

  // Soft delete documents
  await supabase.from("Document").update({ deletedAt }).eq("userId", userId);

  // Soft delete conversation summaries
  await supabase
    .from("ConversationSummary")
    .update({ deletedAt })
    .eq("userId", userId);

  // Soft delete strategy canvases
  await supabase
    .from("StrategyCanvas")
    .update({ deletedAt })
    .eq("userId", userId);

  // Soft delete the user
  const { error } = await supabase
    .from("User")
    .update({ deletedAt })
    .eq("id", userId);

  if (error) throw error;
}

// ============================================
// ADMIN STATS QUERIES
// ============================================

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalChats: number;
  totalMessages: number;
  messagesLast24h: number;
  messagesLast7d: number;
  topExecutive: string | null;
  executiveBreakdown: { executive: string; count: number }[];
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createServiceClient();

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const last7d = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Get user counts
  const { count: totalUsers } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null);

  // Active users (onboarded)
  const { count: activeUsers } = await supabase
    .from("User")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null)
    .not("onboardedAt", "is", null);

  // Chat counts
  const { count: totalChats } = await supabase
    .from("Chat")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null);

  // Message counts
  const { count: totalMessages } = await supabase
    .from("Message_v2")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null);

  const { count: messagesLast24h } = await supabase
    .from("Message_v2")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null)
    .gte("createdAt", last24h);

  const { count: messagesLast7d } = await supabase
    .from("Message_v2")
    .select("*", { count: "exact", head: true })
    .is("deletedAt", null)
    .gte("createdAt", last7d);

  // Executive breakdown
  const { data: botTypeMessages } = await supabase
    .from("Message_v2")
    .select("botType")
    .is("deletedAt", null)
    .not("botType", "is", null);

  const executiveCounts: Record<string, number> = {};
  for (const msg of botTypeMessages || []) {
    if (msg.botType) {
      executiveCounts[msg.botType] = (executiveCounts[msg.botType] || 0) + 1;
    }
  }

  const executiveBreakdown = Object.entries(executiveCounts)
    .map(([executive, count]) => ({ executive, count }))
    .sort((a, b) => b.count - a.count);

  const topExecutive = executiveBreakdown[0]?.executive || null;

  return {
    totalUsers: totalUsers || 0,
    activeUsers: activeUsers || 0,
    totalChats: totalChats || 0,
    totalMessages: totalMessages || 0,
    messagesLast24h: messagesLast24h || 0,
    messagesLast7d: messagesLast7d || 0,
    topExecutive,
    executiveBreakdown,
  };
}

// ============================================
// ADMIN CHAT/CONVERSATION QUERIES
// ============================================

export type AdminChat = Chat & {
  userEmail: string;
  messageCount: number;
};

export async function getAllChats(limit = 50): Promise<AdminChat[]> {
  const supabase = createServiceClient();

  const { data: chats, error } = await supabase
    .from("Chat")
    .select("*")
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Enrich with user email and message count
  const enrichedChats = await Promise.all(
    (chats || []).map(async (chat) => {
      const { data: user } = await supabase
        .from("User")
        .select("email")
        .eq("id", chat.userId)
        .single();

      const { count } = await supabase
        .from("Message_v2")
        .select("*", { count: "exact", head: true })
        .eq("chatId", chat.id)
        .is("deletedAt", null);

      return {
        ...chat,
        userEmail: user?.email || "Unknown",
        messageCount: count || 0,
      };
    }),
  );

  return enrichedChats;
}

export async function getChatWithMessages(chatId: string): Promise<{
  chat: AdminChat;
  messages: DBMessage[];
} | null> {
  const supabase = createServiceClient();

  const { data: chat, error } = await supabase
    .from("Chat")
    .select("*")
    .eq("id", chatId)
    .single();

  if (error || !chat) return null;

  const { data: user } = await supabase
    .from("User")
    .select("email")
    .eq("id", chat.userId)
    .single();

  const { data: messages } = await supabase
    .from("Message_v2")
    .select("*")
    .eq("chatId", chatId)
    .is("deletedAt", null)
    .order("createdAt", { ascending: true });

  return {
    chat: {
      ...chat,
      userEmail: user?.email || "Unknown",
      messageCount: messages?.length || 0,
    },
    messages: messages || [],
  };
}

// ============================================
// ADMIN AUTH CHECK
// ============================================

export async function isUserAdmin(userId: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("User")
    .select("isAdmin")
    .eq("id", userId)
    .single();

  if (error || !data) return false;
  return data.isAdmin === true;
}

// ============================================
// RECENT ACTIVITY
// ============================================

export interface ActivityLogEntry {
  id: string;
  type: "message" | "chat" | "user" | "reaction";
  description: string;
  userId: string;
  userEmail: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export async function getRecentActivity(
  limit = 20,
): Promise<ActivityLogEntry[]> {
  const supabase = createServiceClient();

  // Get recent messages
  const { data: recentMessages } = await supabase
    .from("Message_v2")
    .select("id, chatId, role, botType, createdAt")
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(limit);

  // Get chat info for messages
  const chatIds = [...new Set((recentMessages || []).map((m) => m.chatId))];
  const { data: chats } = await supabase
    .from("Chat")
    .select("id, userId, title")
    .in("id", chatIds);

  const chatMap = new Map(chats?.map((c) => [c.id, c]) || []);

  // Get user emails
  const userIds = [...new Set((chats || []).map((c) => c.userId))];
  const { data: users } = await supabase
    .from("User")
    .select("id, email")
    .in("id", userIds);

  const userMap = new Map(users?.map((u) => [u.id, u.email]) || []);

  const activity: ActivityLogEntry[] = (recentMessages || []).map((msg) => {
    const chat = chatMap.get(msg.chatId);
    const userEmail = chat ? userMap.get(chat.userId) || "Unknown" : "Unknown";

    return {
      id: msg.id,
      type: "message" as const,
      description:
        msg.role === "user"
          ? "User sent a message"
          : `${msg.botType || "AI"} responded`,
      userId: chat?.userId || "",
      userEmail,
      createdAt: msg.createdAt,
      metadata: {
        chatTitle: chat?.title || "Unknown",
        botType: msg.botType,
      },
    };
  });

  return activity.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

// ============================================
// DASHBOARD WIDGET QUERIES
// ============================================

export interface SubscriptionStats {
  trial: number;
  monthly: number;
  annual: number;
  lifetime: number;
  expired: number;
  mrr: number;
  activeSubscribers: number;
}

export async function getSubscriptionStats(): Promise<SubscriptionStats> {
  const supabase = createServiceClient();

  // Get subscription counts by type
  const { data: users } = await supabase
    .from("User")
    .select("subscriptionType, subscriptionStatus")
    .is("deletedAt", null);

  const stats = {
    trial: 0,
    monthly: 0,
    annual: 0,
    lifetime: 0,
    expired: 0,
    activeSubscribers: 0,
  };

  for (const user of users || []) {
    if (user.subscriptionStatus === "expired") {
      stats.expired++;
    } else if (user.subscriptionStatus === "active") {
      stats.activeSubscribers++;
      switch (user.subscriptionType) {
        case "trial":
          stats.trial++;
          break;
        case "monthly":
          stats.monthly++;
          break;
        case "annual":
          stats.annual++;
          break;
        case "lifetime":
          stats.lifetime++;
          break;
      }
    }
  }

  // Calculate MRR: monthly * $297 + annual * ($2500/12) = $208/mo + lifetime (one-time)
  const mrr = stats.monthly * 297 + stats.annual * 208;

  return { ...stats, mrr };
}

export interface UserPreview {
  id: string;
  email: string;
  displayName: string | null;
  companyName: string | null;
  subscriptionType: string | null;
  subscriptionStatus: string | null;
  onboardedAt: string | null;
}

export async function getRecentUsers(limit = 5): Promise<UserPreview[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("User")
    .select(
      "id, email, displayName, companyName, subscriptionType, subscriptionStatus, onboardedAt",
    )
    .is("deletedAt", null)
    .order("onboardedAt", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export interface ConversationPreview {
  id: string;
  title: string;
  userEmail: string;
  messageCount: number;
  topic: string | null;
  topicColor: string | null;
  createdAt: string;
}

export async function getRecentConversations(
  limit = 5,
): Promise<ConversationPreview[]> {
  const supabase = createServiceClient();

  const { data: chats, error } = await supabase
    .from("Chat")
    .select("id, title, userId, topic, topicColor, createdAt")
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) throw error;

  // Enrich with user email and message count
  const enriched = await Promise.all(
    (chats || []).map(async (chat) => {
      const [{ data: user }, { count }] = await Promise.all([
        supabase.from("User").select("email").eq("id", chat.userId).single(),
        supabase
          .from("Message_v2")
          .select("*", { count: "exact", head: true })
          .eq("chatId", chat.id)
          .is("deletedAt", null),
      ]);

      return {
        id: chat.id,
        title: chat.title,
        userEmail: user?.email || "Unknown",
        messageCount: count || 0,
        topic: chat.topic,
        topicColor: chat.topicColor,
        createdAt: chat.createdAt,
      };
    }),
  );

  return enriched;
}

export interface SupportTicketPreview {
  id: string;
  subject: string;
  userEmail: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
}

export async function getRecentSupportTickets(
  limit = 5,
): Promise<SupportTicketPreview[]> {
  const supabase = createServiceClient();

  const { data: tickets, error } = await supabase
    .from("SupportTicket")
    .select("id, subject, userId, status, priority, createdAt")
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) {
    // Table might not exist yet
    console.warn("SupportTicket query failed:", error);
    return [];
  }

  // Enrich with user email
  const enriched = await Promise.all(
    (tickets || []).map(async (ticket) => {
      const { data: user } = await supabase
        .from("User")
        .select("email")
        .eq("id", ticket.userId)
        .single();

      return {
        id: ticket.id,
        subject: ticket.subject,
        userEmail: user?.email || "Unknown",
        status: ticket.status as SupportTicketPreview["status"],
        priority: ticket.priority as SupportTicketPreview["priority"],
        createdAt: ticket.createdAt,
      };
    }),
  );

  return enriched;
}
