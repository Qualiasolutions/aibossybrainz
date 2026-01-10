// Client-side Sentry initialization
import * as Sentry from "@sentry/nextjs";
import "./sentry.client.config";

// Required for Sentry to instrument navigations
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
