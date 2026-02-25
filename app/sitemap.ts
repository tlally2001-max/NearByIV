import type { MetadataRoute } from "next";

const BASE_URL = "https://nearbyiv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages - core sitemap
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/providers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Fetch provider slugs directly via REST API (no cookies, fully static)
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/providers?select=slug&is_confirmed_mobile=eq.true`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 86400 }, // Cache for 24 hours
        }
      );

      if (res.ok) {
        const providers: { slug: string }[] = await res.json();
        providerPages = providers
          .filter((p) => p.slug)
          .map((p) => ({
            url: `${BASE_URL}/providers/${p.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          }));
      }
    }
  } catch (e) {
    // Fall back to static pages only
  }

  return [...staticPages, ...providerPages];
}
