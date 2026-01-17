import * as Sentry from "@sentry/nextjs";

type BreadcrumbCategory =
  | "chat"
  | "auth"
  | "voice"
  | "document"
  | "navigation"
  | "user-action";

/**
 * Add a breadcrumb for key user actions
 * These help debug errors by showing what the user did before the error
 */
export function addBreadcrumb(
  category: BreadcrumbCategory,
  message: string,
  data?: Record<string, unknown>,
  level: Sentry.SeverityLevel = "info",
) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Track chat-related actions
 */
export const chatBreadcrumb = {
  messageSent: (chatId: string, botType: string) =>
    addBreadcrumb("chat", "Message sent", { chatId, botType }),

  messageReceived: (chatId: string, botType: string) =>
    addBreadcrumb("chat", "Message received", { chatId, botType }),

  chatCreated: (chatId: string) =>
    addBreadcrumb("chat", "Chat created", { chatId }),

  chatDeleted: (chatId: string) =>
    addBreadcrumb("chat", "Chat deleted", { chatId }),

  executiveSwitched: (from: string, to: string) =>
    addBreadcrumb("chat", "Executive switched", { from, to }),

  focusModeChanged: (mode: string) =>
    addBreadcrumb("chat", "Focus mode changed", { mode }),
};

/**
 * Track auth-related actions
 */
export const authBreadcrumb = {
  loginAttempt: () => addBreadcrumb("auth", "Login attempted"),

  loginSuccess: () => addBreadcrumb("auth", "Login successful"),

  loginFailed: (reason: string) =>
    addBreadcrumb("auth", "Login failed", { reason }, "warning"),

  logout: () => addBreadcrumb("auth", "User logged out"),

  sessionExpired: () =>
    addBreadcrumb("auth", "Session expired", undefined, "warning"),
};

/**
 * Track voice-related actions
 */
export const voiceBreadcrumb = {
  ttsRequested: (botType: string) =>
    addBreadcrumb("voice", "TTS requested", { botType }),

  ttsPlaying: () => addBreadcrumb("voice", "TTS playing"),

  ttsStopped: () => addBreadcrumb("voice", "TTS stopped"),

  sttStarted: () => addBreadcrumb("voice", "STT started"),

  sttResult: (textLength: number) =>
    addBreadcrumb("voice", "STT result received", { textLength }),
};

/**
 * Track document/artifact actions
 */
export const documentBreadcrumb = {
  created: (kind: string, documentId: string) =>
    addBreadcrumb("document", "Document created", { kind, documentId }),

  updated: (documentId: string) =>
    addBreadcrumb("document", "Document updated", { documentId }),

  exported: (format: string) =>
    addBreadcrumb("document", "Document exported", { format }),

  canvasOpened: (type: string) =>
    addBreadcrumb("document", "Canvas opened", { type }),
};

/**
 * Track user actions
 */
export const userActionBreadcrumb = {
  reaction: (type: string, messageId: string) =>
    addBreadcrumb("user-action", "Message reaction", { type, messageId }),

  copy: () => addBreadcrumb("user-action", "Content copied"),

  settingsChanged: (setting: string) =>
    addBreadcrumb("user-action", "Settings changed", { setting }),
};

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email: email ? email.replace(/(.{2}).*(@.*)/, "$1***$2") : undefined,
  });
}

/**
 * Clear user context on logout
 */
export function clearUserContext() {
  Sentry.setUser(null);
}
