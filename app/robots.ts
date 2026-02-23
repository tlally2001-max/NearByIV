import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/protected/"],
      },
    ],
    sitemap: "https://nearbyiv.com/sitemap.xml",
  };
}
