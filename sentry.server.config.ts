import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://02c4b161273477949d30acf29176431c@o4510184257814528.ingest.de.sentry.io/4510603397627984",

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Enable structured logging
  enableLogs: true,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Filter out noisy errors
  ignoreErrors: [
    // Network timeouts
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    // Rate limiting (expected behavior)
    "rate_limit:",
    // User auth issues (not bugs)
    "unauthorized:",
  ],

  // Before sending error, filter sensitive data
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      const headers = event.request.headers;
      const sensitiveHeaders = [
        "authorization",
        "cookie",
        "x-auth-token",
        "x-csrf-token",
      ];
      for (const header of sensitiveHeaders) {
        if (headers[header]) {
          headers[header] = "[REDACTED]";
        }
      }
    }

    // Remove sensitive data from extras
    if (event.extra) {
      const sensitiveKeys = ["password", "token", "secret", "apiKey", "key"];
      for (const key of Object.keys(event.extra)) {
        if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
          event.extra[key] = "[REDACTED]";
        }
      }
    }

    return event;
  },

  integrations: [
    // Capture console.error as Sentry logs on server
    Sentry.consoleLoggingIntegration({ levels: ["error"] }),
  ],
});
