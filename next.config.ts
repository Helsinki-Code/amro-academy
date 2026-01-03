import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
      ignoreBuildErrors: true
    },
    eslint: {
        ignoreDuringBuilds: true
    },
  images: {
      remotePatterns: [
          { hostname: 'img.clerk.com'}
      ]
  },
  // Override NEXT_PUBLIC_CLERK_PROXY_URL if it's misconfigured
  env: {
    // Check if proxy URL is valid, if not, set it to empty string
    NEXT_PUBLIC_CLERK_PROXY_URL: (() => {
      const proxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL;
      if (!proxyUrl) return undefined;
      // Validate proxy URL
      const isValid = proxyUrl.endsWith('/__clerk/') && 
                      !proxyUrl.includes('//npm') && 
                      proxyUrl.startsWith('https://');
      // If invalid, return undefined to disable proxy
      return isValid ? proxyUrl : undefined;
    })(),
  }
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "agentic-ai-amro-ltd",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  }
});
