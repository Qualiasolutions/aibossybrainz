export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Chat: {
        Row: {
          createdAt: string
          deletedAt: string | null
          id: string
          isPinned: boolean
          lastContext: Json | null
          title: string
          topic: string | null
          topicColor: string | null
          userId: string
          visibility: string
        }
        Insert: {
          createdAt: string
          deletedAt?: string | null
          id?: string
          isPinned?: boolean
          lastContext?: Json | null
          title: string
          topic?: string | null
          topicColor?: string | null
          userId: string
          visibility?: string
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          id?: string
          isPinned?: boolean
          lastContext?: Json | null
          title?: string
          topic?: string | null
          topicColor?: string | null
          userId?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "Chat_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Document: {
        Row: {
          content: string | null
          createdAt: string
          deletedAt: string | null
          id: string
          kind: string
          title: string
          userId: string
        }
        Insert: {
          content?: string | null
          createdAt: string
          deletedAt?: string | null
          id?: string
          kind?: string
          title: string
          userId: string
        }
        Update: {
          content?: string | null
          createdAt?: string
          deletedAt?: string | null
          id?: string
          kind?: string
          title?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Document_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      ExecutiveMemory: {
        Row: {
          createdAt: string | null
          executive: string
          id: string
          lastUsed: string | null
          messageCount: Json | null
          preferenceScore: Json | null
          topTopics: Json | null
          updatedAt: string | null
          userId: string
        }
        Insert: {
          createdAt?: string | null
          executive: string
          id?: string
          lastUsed?: string | null
          messageCount?: Json | null
          preferenceScore?: Json | null
          topTopics?: Json | null
          updatedAt?: string | null
          userId: string
        }
        Update: {
          createdAt?: string | null
          executive?: string
          id?: string
          lastUsed?: string | null
          messageCount?: Json | null
          preferenceScore?: Json | null
          topTopics?: Json | null
          updatedAt?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ExecutiveMemory_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Message: {
        Row: {
          chatId: string
          content: Json
          createdAt: string
          id: string
          role: string
        }
        Insert: {
          chatId: string
          content: Json
          createdAt: string
          id?: string
          role: string
        }
        Update: {
          chatId?: string
          content?: Json
          createdAt?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "Message_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
        ]
      }
      Message_v2: {
        Row: {
          attachments: Json
          botType: string | null
          chatId: string
          createdAt: string
          deletedAt: string | null
          id: string
          parts: Json
          role: string
        }
        Insert: {
          attachments: Json
          botType?: string | null
          chatId: string
          createdAt: string
          deletedAt?: string | null
          id?: string
          parts: Json
          role: string
        }
        Update: {
          attachments?: Json
          botType?: string | null
          chatId?: string
          createdAt?: string
          deletedAt?: string | null
          id?: string
          parts?: Json
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "Message_v2_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
        ]
      }
      MessageReaction: {
        Row: {
          createdAt: string | null
          id: string
          messageId: string
          reactionType: string
          userId: string
        }
        Insert: {
          createdAt?: string | null
          id?: string
          messageId: string
          reactionType: string
          userId: string
        }
        Update: {
          createdAt?: string | null
          id?: string
          messageId?: string
          reactionType?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "MessageReaction_messageId_fkey"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "Message_v2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MessageReaction_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Stream: {
        Row: {
          chatId: string
          createdAt: string
          deletedAt: string | null
          id: string
        }
        Insert: {
          chatId: string
          createdAt: string
          deletedAt?: string | null
          id?: string
        }
        Update: {
          chatId?: string
          createdAt?: string
          deletedAt?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Stream_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
        ]
      }
      Suggestion: {
        Row: {
          createdAt: string
          deletedAt: string | null
          description: string | null
          documentCreatedAt: string
          documentId: string
          id: string
          isResolved: boolean
          originalText: string
          suggestedText: string
          userId: string
        }
        Insert: {
          createdAt: string
          deletedAt?: string | null
          description?: string | null
          documentCreatedAt: string
          documentId: string
          id?: string
          isResolved?: boolean
          originalText: string
          suggestedText: string
          userId: string
        }
        Update: {
          createdAt?: string
          deletedAt?: string | null
          description?: string | null
          documentCreatedAt?: string
          documentId?: string
          id?: string
          isResolved?: boolean
          originalText?: string
          suggestedText?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Suggestion_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          email: string
          id: string
          password: string | null
          userType: string | null
        }
        Insert: {
          email: string
          id?: string
          password?: string | null
          userType?: string | null
        }
        Update: {
          email?: string
          id?: string
          password?: string | null
          userType?: string | null
        }
        Relationships: []
      }
      UserAnalytics: {
        Row: {
          createdAt: string | null
          date: string
          exportCount: Json | null
          id: string
          messageCount: Json | null
          tokenUsage: Json | null
          updatedAt: string | null
          userId: string
          voiceMinutes: Json | null
        }
        Insert: {
          createdAt?: string | null
          date: string
          exportCount?: Json | null
          id?: string
          messageCount?: Json | null
          tokenUsage?: Json | null
          updatedAt?: string | null
          userId: string
          voiceMinutes?: Json | null
        }
        Update: {
          createdAt?: string | null
          date?: string
          exportCount?: Json | null
          id?: string
          messageCount?: Json | null
          tokenUsage?: Json | null
          updatedAt?: string | null
          userId?: string
          voiceMinutes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "UserAnalytics_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Vote: {
        Row: {
          chatId: string
          isUpvoted: boolean
          messageId: string
        }
        Insert: {
          chatId: string
          isUpvoted: boolean
          messageId: string
        }
        Update: {
          chatId?: string
          isUpvoted?: boolean
          messageId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Vote_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Vote_messageId_fkey"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "Message"
            referencedColumns: ["id"]
          },
        ]
      }
      Vote_v2: {
        Row: {
          chatId: string
          deletedAt: string | null
          isUpvoted: boolean
          messageId: string
        }
        Insert: {
          chatId: string
          deletedAt?: string | null
          isUpvoted: boolean
          messageId: string
        }
        Update: {
          chatId?: string
          deletedAt?: string | null
          isUpvoted?: boolean
          messageId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Vote_v2_chatId_fkey"
            columns: ["chatId"]
            isOneToOne: false
            referencedRelation: "Chat"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Vote_v2_messageId_fkey"
            columns: ["messageId"]
            isOneToOne: false
            referencedRelation: "Message_v2"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience types for easier usage
export type User = Database["public"]["Tables"]["User"]["Row"]
export type Chat = Database["public"]["Tables"]["Chat"]["Row"]
export type DBMessage = Database["public"]["Tables"]["Message_v2"]["Row"]
export type Vote = Database["public"]["Tables"]["Vote_v2"]["Row"]
export type Document = Database["public"]["Tables"]["Document"]["Row"]
export type Suggestion = Database["public"]["Tables"]["Suggestion"]["Row"]
export type Stream = Database["public"]["Tables"]["Stream"]["Row"]
export type UserAnalytics = Database["public"]["Tables"]["UserAnalytics"]["Row"]
export type ExecutiveMemory = Database["public"]["Tables"]["ExecutiveMemory"]["Row"]
export type MessageReaction = Database["public"]["Tables"]["MessageReaction"]["Row"]

// Insert types
export type ChatInsert = Database["public"]["Tables"]["Chat"]["Insert"]
export type MessageInsert = Database["public"]["Tables"]["Message_v2"]["Insert"]
export type UserInsert = Database["public"]["Tables"]["User"]["Insert"]

// Visibility type for Chat
export type VisibilityType = "public" | "private"

// Bot type for messages
export type BotType = "alexandria" | "kim" | "collaborative"

// Reaction types
export type ReactionType = 
  | "actionable"
  | "needs_clarification"
  | "ready_to_implement"
  | "save_for_later"
  | "brilliant"
  | "helpful"
