export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Subscription types
export type SubscriptionType = "trial" | "monthly" | "biannual";
export type SubscriptionStatus = "active" | "expired" | "cancelled";

export type Database = {
  public: {
    Tables: {
      AuditLog: {
        Row: {
          id: string;
          userId: string | null;
          action: string;
          resource: string;
          resourceId: string | null;
          details: Json;
          ipAddress: string | null;
          userAgent: string | null;
          createdAt: string;
        };
        Insert: {
          id?: string;
          userId?: string | null;
          action: string;
          resource: string;
          resourceId?: string | null;
          details?: Json;
          ipAddress?: string | null;
          userAgent?: string | null;
          createdAt?: string;
        };
        Update: {
          id?: string;
          userId?: string | null;
          action?: string;
          resource?: string;
          resourceId?: string | null;
          details?: Json;
          ipAddress?: string | null;
          userAgent?: string | null;
          createdAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "AuditLog_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Chat: {
        Row: {
          createdAt: string;
          deletedAt: string | null;
          id: string;
          isPinned: boolean;
          lastContext: Json | null;
          title: string;
          topic: string | null;
          topicColor: string | null;
          userId: string;
          visibility: string;
        };
        Insert: {
          createdAt: string;
          deletedAt?: string | null;
          id?: string;
          isPinned?: boolean;
          lastContext?: Json | null;
          title: string;
          topic?: string | null;
          topicColor?: string | null;
          userId: string;
          visibility?: string;
        };
        Update: {
          createdAt?: string;
          deletedAt?: string | null;
          id?: string;
          isPinned?: boolean;
          lastContext?: Json | null;
          title?: string;
          topic?: string | null;
          topicColor?: string | null;
          userId?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Chat_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Document: {
        Row: {
          content: string | null;
          createdAt: string;
          deletedAt: string | null;
          id: string;
          kind: string;
          title: string;
          userId: string;
        };
        Insert: {
          content?: string | null;
          createdAt: string;
          deletedAt?: string | null;
          id?: string;
          kind?: string;
          title: string;
          userId: string;
        };
        Update: {
          content?: string | null;
          createdAt?: string;
          deletedAt?: string | null;
          id?: string;
          kind?: string;
          title?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Document_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      ExecutiveMemory: {
        Row: {
          createdAt: string | null;
          executive: string;
          id: string;
          lastUsed: string | null;
          messageCount: Json | null;
          preferenceScore: Json | null;
          topTopics: Json | null;
          updatedAt: string | null;
          userId: string;
        };
        Insert: {
          createdAt?: string | null;
          executive: string;
          id?: string;
          lastUsed?: string | null;
          messageCount?: Json | null;
          preferenceScore?: Json | null;
          topTopics?: Json | null;
          updatedAt?: string | null;
          userId: string;
        };
        Update: {
          createdAt?: string | null;
          executive?: string;
          id?: string;
          lastUsed?: string | null;
          messageCount?: Json | null;
          preferenceScore?: Json | null;
          topTopics?: Json | null;
          updatedAt?: string | null;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ExecutiveMemory_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Message: {
        Row: {
          chatId: string;
          content: Json;
          createdAt: string;
          id: string;
          role: string;
        };
        Insert: {
          chatId: string;
          content: Json;
          createdAt: string;
          id?: string;
          role: string;
        };
        Update: {
          chatId?: string;
          content?: Json;
          createdAt?: string;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Message_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
        ];
      };
      Message_v2: {
        Row: {
          attachments: Json;
          botType: string | null;
          chatId: string;
          createdAt: string;
          deletedAt: string | null;
          id: string;
          parts: Json;
          role: string;
        };
        Insert: {
          attachments: Json;
          botType?: string | null;
          chatId: string;
          createdAt: string;
          deletedAt?: string | null;
          id?: string;
          parts: Json;
          role: string;
        };
        Update: {
          attachments?: Json;
          botType?: string | null;
          chatId?: string;
          createdAt?: string;
          deletedAt?: string | null;
          id?: string;
          parts?: Json;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Message_v2_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
        ];
      };
      MessageReaction: {
        Row: {
          createdAt: string | null;
          id: string;
          messageId: string;
          reactionType: string;
          userId: string;
        };
        Insert: {
          createdAt?: string | null;
          id?: string;
          messageId: string;
          reactionType: string;
          userId: string;
        };
        Update: {
          createdAt?: string | null;
          id?: string;
          messageId?: string;
          reactionType?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "MessageReaction_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "Message_v2";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "MessageReaction_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Stream: {
        Row: {
          chatId: string;
          createdAt: string;
          deletedAt: string | null;
          id: string;
        };
        Insert: {
          chatId: string;
          createdAt: string;
          deletedAt?: string | null;
          id?: string;
        };
        Update: {
          chatId?: string;
          createdAt?: string;
          deletedAt?: string | null;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Stream_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
        ];
      };
      Suggestion: {
        Row: {
          createdAt: string;
          deletedAt: string | null;
          description: string | null;
          documentCreatedAt: string;
          documentId: string;
          id: string;
          isResolved: boolean;
          originalText: string;
          suggestedText: string;
          userId: string;
        };
        Insert: {
          createdAt: string;
          deletedAt?: string | null;
          description?: string | null;
          documentCreatedAt: string;
          documentId: string;
          id?: string;
          isResolved?: boolean;
          originalText: string;
          suggestedText: string;
          userId: string;
        };
        Update: {
          createdAt?: string;
          deletedAt?: string | null;
          description?: string | null;
          documentCreatedAt?: string;
          documentId?: string;
          id?: string;
          isResolved?: boolean;
          originalText?: string;
          suggestedText?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Suggestion_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      User: {
        Row: {
          email: string;
          id: string;
          password: string | null;
          userType: string | null;
          tosAcceptedAt: string | null;
          displayName: string | null;
          companyName: string | null;
          industry: string | null;
          businessGoals: string | null;
          preferredBotType: string | null;
          onboardedAt: string | null;
          profileUpdatedAt: string | null;
          deletedAt: string | null;
          isAdmin: boolean | null;
          subscriptionType: "trial" | "monthly" | "biannual" | null;
          subscriptionStartDate: string | null;
          subscriptionEndDate: string | null;
          subscriptionStatus: "active" | "expired" | "cancelled" | null;
          stripeCustomerId: string | null;
          stripeSubscriptionId: string | null;
        };
        Insert: {
          email: string;
          id?: string;
          password?: string | null;
          userType?: string | null;
          tosAcceptedAt?: string | null;
          displayName?: string | null;
          companyName?: string | null;
          industry?: string | null;
          businessGoals?: string | null;
          preferredBotType?: string | null;
          onboardedAt?: string | null;
          profileUpdatedAt?: string | null;
          deletedAt?: string | null;
          isAdmin?: boolean | null;
          subscriptionType?: "trial" | "monthly" | "biannual" | null;
          subscriptionStartDate?: string | null;
          subscriptionEndDate?: string | null;
          subscriptionStatus?: "active" | "expired" | "cancelled" | null;
          stripeCustomerId?: string | null;
          stripeSubscriptionId?: string | null;
        };
        Update: {
          email?: string;
          id?: string;
          password?: string | null;
          userType?: string | null;
          tosAcceptedAt?: string | null;
          displayName?: string | null;
          companyName?: string | null;
          industry?: string | null;
          businessGoals?: string | null;
          preferredBotType?: string | null;
          onboardedAt?: string | null;
          profileUpdatedAt?: string | null;
          deletedAt?: string | null;
          isAdmin?: boolean | null;
          subscriptionType?: "trial" | "monthly" | "biannual" | null;
          subscriptionStartDate?: string | null;
          subscriptionEndDate?: string | null;
          subscriptionStatus?: "active" | "expired" | "cancelled" | null;
          stripeCustomerId?: string | null;
          stripeSubscriptionId?: string | null;
        };
        Relationships: [];
      };
      StrategyCanvas: {
        Row: {
          id: string;
          userId: string;
          canvasType: string;
          name: string;
          data: Json;
          isDefault: boolean | null;
          createdAt: string;
          updatedAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          userId: string;
          canvasType: string;
          name?: string;
          data?: Json;
          isDefault?: boolean | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          userId?: string;
          canvasType?: string;
          name?: string;
          data?: Json;
          isDefault?: boolean | null;
          createdAt?: string;
          updatedAt?: string;
          deletedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "StrategyCanvas_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      ConversationSummary: {
        Row: {
          id: string;
          userId: string;
          chatId: string | null;
          summary: string;
          topics: string[] | null;
          keyInsights: Json | null;
          importance: number | null;
          createdAt: string;
          expiresAt: string | null;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          userId: string;
          chatId?: string | null;
          summary: string;
          topics?: string[] | null;
          keyInsights?: Json | null;
          importance?: number | null;
          createdAt?: string;
          expiresAt?: string | null;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          userId?: string;
          chatId?: string | null;
          summary?: string;
          topics?: string[] | null;
          keyInsights?: Json | null;
          importance?: number | null;
          createdAt?: string;
          expiresAt?: string | null;
          deletedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "ConversationSummary_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ConversationSummary_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
        ];
      };
      UserAnalytics: {
        Row: {
          createdAt: string | null;
          date: string;
          exportCount: Json | null;
          id: string;
          messageCount: Json | null;
          tokenUsage: Json | null;
          updatedAt: string | null;
          userId: string;
          voiceMinutes: Json | null;
        };
        Insert: {
          createdAt?: string | null;
          date: string;
          exportCount?: Json | null;
          id?: string;
          messageCount?: Json | null;
          tokenUsage?: Json | null;
          updatedAt?: string | null;
          userId: string;
          voiceMinutes?: Json | null;
        };
        Update: {
          createdAt?: string | null;
          date?: string;
          exportCount?: Json | null;
          id?: string;
          messageCount?: Json | null;
          tokenUsage?: Json | null;
          updatedAt?: string | null;
          userId?: string;
          voiceMinutes?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "UserAnalytics_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      Vote: {
        Row: {
          chatId: string;
          isUpvoted: boolean;
          messageId: string;
        };
        Insert: {
          chatId: string;
          isUpvoted: boolean;
          messageId: string;
        };
        Update: {
          chatId?: string;
          isUpvoted?: boolean;
          messageId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Vote_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Vote_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "Message";
            referencedColumns: ["id"];
          },
        ];
      };
      Vote_v2: {
        Row: {
          chatId: string;
          deletedAt: string | null;
          isUpvoted: boolean;
          messageId: string;
        };
        Insert: {
          chatId: string;
          deletedAt?: string | null;
          isUpvoted: boolean;
          messageId: string;
        };
        Update: {
          chatId?: string;
          deletedAt?: string | null;
          isUpvoted?: boolean;
          messageId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Vote_v2_chatId_fkey";
            columns: ["chatId"];
            isOneToOne: false;
            referencedRelation: "Chat";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Vote_v2_messageId_fkey";
            columns: ["messageId"];
            isOneToOne: false;
            referencedRelation: "Message_v2";
            referencedColumns: ["id"];
          },
        ];
      };
      SupportTicket: {
        Row: {
          id: string;
          userId: string;
          subject: string;
          status: "open" | "in_progress" | "resolved" | "closed";
          priority: "low" | "normal" | "high" | "urgent";
          category:
            | "bug"
            | "feature"
            | "billing"
            | "account"
            | "general"
            | null;
          assignedAdminId: string | null;
          createdAt: string;
          updatedAt: string;
          resolvedAt: string | null;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          userId: string;
          subject: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "normal" | "high" | "urgent";
          category?:
            | "bug"
            | "feature"
            | "billing"
            | "account"
            | "general"
            | null;
          assignedAdminId?: string | null;
          createdAt?: string;
          updatedAt?: string;
          resolvedAt?: string | null;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          userId?: string;
          subject?: string;
          status?: "open" | "in_progress" | "resolved" | "closed";
          priority?: "low" | "normal" | "high" | "urgent";
          category?:
            | "bug"
            | "feature"
            | "billing"
            | "account"
            | "general"
            | null;
          assignedAdminId?: string | null;
          createdAt?: string;
          updatedAt?: string;
          resolvedAt?: string | null;
          deletedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "SupportTicket_userId_fkey";
            columns: ["userId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "SupportTicket_assignedAdminId_fkey";
            columns: ["assignedAdminId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      SupportTicketMessage: {
        Row: {
          id: string;
          ticketId: string;
          senderId: string;
          content: string;
          isAdminReply: boolean;
          isInternal: boolean;
          attachments: Json;
          createdAt: string;
          deletedAt: string | null;
        };
        Insert: {
          id?: string;
          ticketId: string;
          senderId: string;
          content: string;
          isAdminReply?: boolean;
          isInternal?: boolean;
          attachments?: Json;
          createdAt?: string;
          deletedAt?: string | null;
        };
        Update: {
          id?: string;
          ticketId?: string;
          senderId?: string;
          content?: string;
          isAdminReply?: boolean;
          isInternal?: boolean;
          attachments?: Json;
          createdAt?: string;
          deletedAt?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "SupportTicketMessage_ticketId_fkey";
            columns: ["ticketId"];
            isOneToOne: false;
            referencedRelation: "SupportTicket";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "SupportTicketMessage_senderId_fkey";
            columns: ["senderId"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
      LandingPageContent: {
        Row: {
          id: string;
          section: string;
          key: string;
          value: string;
          type: string;
          metadata: Json;
          updatedBy: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          section: string;
          key: string;
          value: string;
          type?: string;
          metadata?: Json;
          updatedBy?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          section?: string;
          key?: string;
          value?: string;
          type?: string;
          metadata?: Json;
          updatedBy?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Relationships: [
          {
            foreignKeyName: "LandingPageContent_updatedBy_fkey";
            columns: ["updatedBy"];
            isOneToOne: false;
            referencedRelation: "User";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      calculate_subscription_end_date:
        | { Args: { start_date: string; sub_type: string }; Returns: string }
        | {
            Args: { start_date?: string; subscription_type: string };
            Returns: string;
          };
      expire_subscriptions: { Args: never; Returns: undefined };
      get_user_analytics_summary: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string };
        Returns: {
          chat_count: number;
          message_count: number;
        }[];
      };
      get_user_message_count: {
        Args: { p_cutoff_time: string; p_user_id: string };
        Returns: number;
      };
      is_current_user_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience types for easier usage
export type AuditLog = Database["public"]["Tables"]["AuditLog"]["Row"];
export type User = Database["public"]["Tables"]["User"]["Row"];
export type Chat = Database["public"]["Tables"]["Chat"]["Row"];
export type DBMessage = Database["public"]["Tables"]["Message_v2"]["Row"];
export type Vote = Database["public"]["Tables"]["Vote_v2"]["Row"];
export type Document = Database["public"]["Tables"]["Document"]["Row"];
export type Suggestion = Database["public"]["Tables"]["Suggestion"]["Row"];
export type Stream = Database["public"]["Tables"]["Stream"]["Row"];
export type UserAnalytics =
  Database["public"]["Tables"]["UserAnalytics"]["Row"];
export type ExecutiveMemory =
  Database["public"]["Tables"]["ExecutiveMemory"]["Row"];
export type MessageReaction =
  Database["public"]["Tables"]["MessageReaction"]["Row"];

// Insert types
export type ChatInsert = Database["public"]["Tables"]["Chat"]["Insert"];
export type MessageInsert =
  Database["public"]["Tables"]["Message_v2"]["Insert"];
export type UserInsert = Database["public"]["Tables"]["User"]["Insert"];

// Visibility type for Chat
export type VisibilityType = "public" | "private";

// Bot type for messages
export type BotType = "alexandria" | "kim" | "collaborative";

// Reaction types
export type ReactionType =
  | "actionable"
  | "needs_clarification"
  | "ready_to_implement"
  | "save_for_later"
  | "brilliant"
  | "helpful";

// Strategy Canvas types
export type StrategyCanvas =
  Database["public"]["Tables"]["StrategyCanvas"]["Row"];
export type StrategyCanvasInsert =
  Database["public"]["Tables"]["StrategyCanvas"]["Insert"];
export type ConversationSummary =
  Database["public"]["Tables"]["ConversationSummary"]["Row"];
export type ConversationSummaryInsert =
  Database["public"]["Tables"]["ConversationSummary"]["Insert"];
export type CanvasType = "swot" | "bmc" | "journey" | "brainstorm";

// Support Ticket types
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketCategory =
  | "bug"
  | "feature"
  | "billing"
  | "account"
  | "general";
export type SupportTicket =
  Database["public"]["Tables"]["SupportTicket"]["Row"];
export type SupportTicketInsert =
  Database["public"]["Tables"]["SupportTicket"]["Insert"];
export type SupportTicketMessage =
  Database["public"]["Tables"]["SupportTicketMessage"]["Row"];
export type SupportTicketMessageInsert =
  Database["public"]["Tables"]["SupportTicketMessage"]["Insert"];

// Landing Page CMS types
export type LandingPageContentType = "text" | "textarea" | "url" | "color" | "list";
export type LandingPageSection = "hero" | "executives" | "benefits" | "cta" | "theme" | "header" | "footer";

export interface LandingPageContent {
  id: string;
  section: LandingPageSection;
  key: string;
  value: string;
  type: LandingPageContentType;
  metadata: Json;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LandingPageContentInsert {
  id?: string;
  section: LandingPageSection;
  key: string;
  value: string;
  type?: LandingPageContentType;
  metadata?: Json;
  updatedBy?: string | null;
}

export interface LandingPageContentUpdate {
  value?: string;
  type?: LandingPageContentType;
  metadata?: Json;
  updatedBy?: string | null;
}
