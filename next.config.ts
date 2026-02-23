import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable cacheComponents due to Hostinger incompatibility
  // Instead use aggressive static generation and caching headers
  async headers() {
    return [
      {
        source: "/:path(.*\\.(?:js|css|woff2?|ttf|otf|eot))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Aggressive caching for static provider pages
      {
        source: "/providers/:slug",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
      // Cache other pages for 1 hour
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
