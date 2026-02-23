import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const BASE_URL = "https://nearbyiv.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let providers: any[] = [];

  try {
    // Use service role key for server-only operations (no cookies needed)
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    );

    // Fetch all confirmed mobile providers with timeout
    const { data } = await Promise.race([
      supabase
        .from("providers")
        .select("slug, id, state, updated_at")
        .eq("is_confirmed_mobile", true),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 15000)
      ),
    ]) as any;

    providers = data ?? [];
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
