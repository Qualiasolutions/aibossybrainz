import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://02c4b161273477949d30acf29176431c@o4510184257814528.ingest.de.sentry.io/4510603397627984",

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Enable structured logging
  enableLogs: true,

  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions

  // Session replay for debugging
  replaysSessionSampleRate: 0.01, // 1% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of errors

  // Filter out noisy errors
  ignoreErrors: [
    // Network errors users can't control
    "Failed to fetch",
    "NetworkError",
    "Load failed",
    // Browser extensions
    "chrome-extension://",
    "moz-extension://",
    // Common benign errors
    "ResizeObserver loop",
    "Non-Error promise rejection",
    // Vercel live preview feedback widget errors (not our code)
    "Failed to execute 'selectNode' on 'Range'",
    "InvalidNodeTypeError",
  ],

  // Filter out errors from third-party scripts
  denyUrls: [
    // Vercel live feedback widget
    /_next-live\/feedback/,
    // Browser extensions
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
  ],

  // Before sending error, filter sensitive data
  beforeSend(event) {
    // Remove any auth tokens from breadcrumbs
    if (event.breadcrumbs) {
      for (const breadcrumb of event.breadcrumbs) {
        if (breadcrumb.data?.url) {
          // Remove tokens from URLs
          breadcrumb.data.url = breadcrumb.data.url.replace(
            /token=[^&]+/g,
            "token=[REDACTED]",
          );
        }
      }
    }
    return event;
  },

  integrations: [
    // Capture console.error and console.warn as Sentry logs
    Sentry.consoleLoggingIntegration({ levels: ["warn", "error"] }),
    Sentry.replayIntegration({
      // Mask all text and inputs for privacy
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    }),
  ],
});
