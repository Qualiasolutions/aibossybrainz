import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "wubiidettbyavutahgjb.supabase.co", 
      }
    ],
  },

  // Turbopack config (required for Next.js 16+)
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress source map upload logs during build
  silent: true,

  // Sentry organization and project
  org: "qualia-solutions",
  project: "aleccimedia",

  // Upload source maps for better error tracking
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry SDK in production
  disableLogger: true,

  // Source map configuration
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Automatically instrument data fetching on Vercel
  automaticVercelMonitors: true,
});
