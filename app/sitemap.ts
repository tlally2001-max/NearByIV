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
      url: `${BASE_URL}/faq`,
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

  // Fetch all providers for dynamic route generation
  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/providers?select=State,city_slug,provider_slug&city_slug=not.is.null&provider_slug=not.is.null`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 86400 }, // Cache for 24 hours
        }
      );

      if (res.ok) {
        const providers: Array<{ State: string; city_slug: string; provider_slug: string }> = await res.json();

        // Track unique states and state+city combos
        const uniqueStates = new Set<string>();
        const uniqueStateCities = new Set<string>();
        const providerPaths = new Set<string>();

        providers.forEach((p) => {
          if (p.State) {
            const stateSlug = p.State.toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            uniqueStates.add(stateSlug);

            if (p.city_slug) {
              uniqueStateCities.add(`${stateSlug}|${p.city_slug}`);
            }

            if (p.city_slug && p.provider_slug) {
              providerPaths.add(`/${stateSlug}/${p.city_slug}/${p.provider_slug}`);
            }
          }
        });

        // Add state pages
        uniqueStates.forEach((state) => {
          dynamicPages.push({
            url: `${BASE_URL}/${state}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          });
        });

        // Add state+city pages
        uniqueStateCities.forEach((combo) => {
          const [state, city] = combo.split("|");
          dynamicPages.push({
            url: `${BASE_URL}/${state}/${city}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          });
        });

        // Add provider profile pages
        providerPaths.forEach((path) => {
          dynamicPages.push({
            url: `${BASE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          });
        });
      }
    }
  } catch (e) {
    // Fall back to static pages only
  }

  return [...staticPages, ...dynamicPages];
}
