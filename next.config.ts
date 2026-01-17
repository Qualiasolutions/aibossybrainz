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
      },
      {
        hostname: "images.squarespace-cdn.com",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Redirect www to non-www for canonical URLs
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aleccimedia.vercel.app" }],
        destination: "https://aleccimedia.vercel.app/:path*",
        permanent: true,
      },
    ];
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

  // Source map configuration
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Webpack configuration for Sentry
  webpack: {
    // Tree-shake Sentry debug logging in production
    treeshake: {
      removeDebugLogging: true,
    },
    // Automatically instrument data fetching on Vercel
    automaticVercelMonitors: true,
  },
});
