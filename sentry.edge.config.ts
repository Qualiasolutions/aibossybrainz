import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://02c4b161273477949d30acf29176431c@o4510184257814528.ingest.de.sentry.io/4510603397627984",

  // Only enable in production
  enabled: process.env.NODE_ENV === "production",

  // Enable structured logging
  enableLogs: true,

  // Lower sample rate for edge functions
  tracesSampleRate: 0.05, // 5% of transactions
});
