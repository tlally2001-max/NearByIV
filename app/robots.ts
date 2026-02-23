import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/providers", "/how-it-works", "/privacy", "/terms"],
        disallow: ["/auth/", "/protected/", "/api/", "/_next/", "/admin/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    sitemap: ["https://nearbyiv.com/sitemap.xml"],
  };
}
