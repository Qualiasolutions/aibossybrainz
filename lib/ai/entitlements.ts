 
// Removed dependency on deleted file. Defaulting types:
export type UserType = "guest" | "regular" | "premium";
import type { ChatModel } from "./models";

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
	 * For users with an account
	 */
	regular: {
		maxMessagesPerDay: 500,
		availableChatModelIds: ["chat-model", "chat-model-reasoning"],
	},

	/*
	 * For users with an account and a paid membership
	 */
	premium: {
		maxMessagesPerDay: 2000,
		availableChatModelIds: ["chat-model", "chat-model-reasoning"],
	},
};
