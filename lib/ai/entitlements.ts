import type { ChatModel } from "./models";
import type { SubscriptionType } from "@/lib/supabase/types";

// User types for entitlements
export type UserType = "guest" | "trial" | "monthly" | "annual" | "lifetime";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 50,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For trial users (7 days free)
   */
  trial: {
    maxMessagesPerDay: 100,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For monthly subscription users ($297/month)
   */
  monthly: {
    maxMessagesPerDay: 2000,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For annual subscription users ($2,500/year)
   */
  annual: {
    maxMessagesPerDay: 5000,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For lifetime subscription users ($3,500 one-time)
   */
  lifetime: {
    maxMessagesPerDay: 10000,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
};

/**
 * Map subscription type to user type for entitlements
 */
export function getEntitlementsForSubscription(
  subscriptionType: SubscriptionType | null,
  isActive: boolean,
): Entitlements {
  if (!isActive || !subscriptionType) {
    return entitlementsByUserType.guest;
  }

  return entitlementsByUserType[subscriptionType] || entitlementsByUserType.trial;
}
