import type { MetadataRoute } from "next";

const BASE_URL = "https://nearbyiv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let providers: any[] = [];

  try {
    // Use REST API directly with service role key (more reliable)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn("Sitemap: Missing Supabase credentials");
      // Return static pages only if credentials missing
    } else {
      const response = await Promise.race([
        fetch(`${supabaseUrl}/rest/v1/providers?is_confirmed_mobile=eq.true&select=slug,id,state,updated_at`, {
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Supabase timeout")), 15000)
        ),
      ]) as any;

      if (response.ok) {
        providers = await response.json();
      } else {
        console.error("Sitemap: Supabase API error:", response.status, response.statusText);
      }
    }
  } catch (error) {
    console.error("Sitemap: Error fetching providers:", error instanceof Error ? error.message : String(error));
    // Continue with empty providers array on error
    providers = [];
  }

  // Get unique states for category pages
  const states = Array.from(
    new Set((providers ?? []).map((p) => p.state).filter(Boolean))
  ).sort();

  // Static pages
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

  // State filtering pages for better SEO
  const statePages: MetadataRoute.Sitemap = states.map((state) => ({
    url: `${BASE_URL}/providers?state=${encodeURIComponent(state)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Provider detail pages
  const providerUrls: MetadataRoute.Sitemap = (providers ?? []).map((p) => ({
    url: `${BASE_URL}/providers/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...statePages, ...providerUrls];
}
