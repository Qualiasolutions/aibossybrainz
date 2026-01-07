import { registerOTel } from "@vercel/otel";

export async function register() {
  registerOTel({ serviceName: "ai-chatbot" });

  // Initialize Sentry for server-side error tracking
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export async function onRequestError(
  error: Error,
  request: { method: string; url: string; headers: Record<string, string> },
  context: { routerKind: string; routePath: string; routeType: string }
) {
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureException(error, {
    extra: {
      method: request.method,
      url: request.url,
      routerKind: context.routerKind,
      routePath: context.routePath,
      routeType: context.routeType,
    },
  });
}
