import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocationPageClient } from "./location-client";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

// State slug to full name mapping
const STATE_MAP: Record<string, string> = {
  alabama: "Alabama", alaska: "Alaska", arizona: "Arizona", arkansas: "Arkansas",
  california: "California", colorado: "Colorado", connecticut: "Connecticut", delaware: "Delaware",
  "district-of-columbia": "District of Columbia",
  florida: "Florida", georgia: "Georgia", hawaii: "Hawaii", idaho: "Idaho",
  illinois: "Illinois", indiana: "Indiana", iowa: "Iowa", kansas: "Kansas",
  kentucky: "Kentucky", louisiana: "Louisiana", maine: "Maine", maryland: "Maryland",
  massachusetts: "Massachusetts", michigan: "Michigan", minnesota: "Minnesota", mississippi: "Mississippi",
  missouri: "Missouri", montana: "Montana", nebraska: "Nebraska", nevada: "Nevada",
  "new-hampshire": "New Hampshire", "new-jersey": "New Jersey", "new-mexico": "New Mexico", "new-york": "New York",
  "north-carolina": "North Carolina", "north-dakota": "North Dakota", ohio: "Ohio", oklahoma: "Oklahoma",
  oregon: "Oregon", pennsylvania: "Pennsylvania", "rhode-island": "Rhode Island", "south-carolina": "South Carolina",
  "south-dakota": "South Dakota", tennessee: "Tennessee", texas: "Texas", utah: "Utah",
  vermont: "Vermont", virginia: "Virginia", washington: "Washington", "west-virginia": "West Virginia",
  wisconsin: "Wisconsin", wyoming: "Wyoming",
};

export async function generateStaticParams() {
  try {
    const statesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=state:State&order=State.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );
    const statesData: Array<{ state: string }> = statesRes.ok ? await statesRes.json() : [];
    const states = [...new Set(statesData.map((p) => p.state).filter(Boolean))].map((s) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    );

    return states.map((state) => ({ state }));
  } catch {
    // Fallback: generate all 50 states from STATE_MAP if fetch fails
    return Object.keys(STATE_MAP).map((state) => ({ state }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state } = await params;
  const fullStateName = STATE_MAP[state];
  const display = fullStateName || state.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return {
    title: { absolute: `Mobile IV Therapy in ${display} | NearbyIV` },
    description: `Find mobile IV therapy near you in ${display}. Browse verified providers for hangover relief, hydration, NAD+, GLP-1 weight loss & wellness drips — delivered to your door.`,
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  const fullStateName = STATE_MAP[state];

  // If not a valid state, check if it's a city slug and redirect
  if (!fullStateName) {
    const supabase = await createClient();
    const { data: cityData } = await supabase
      .from("providers")
      .select("state:State")
      .eq("city_slug", state)
      .limit(1)
      .single();

    if (cityData && cityData.state) {
      // Convert state name to slug
      const stateSlug = cityData.state
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Redirect to proper URL with state and city
      redirect(`/${stateSlug}/${state}`);
    }

    notFound();
  }

  const display = fullStateName;
  const supabase = await createClient();

  // Get all providers for this state
  const result = await supabase
    .from("providers")
    .select("name:business_name, city:City, state:State, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
    .ilike("State", fullStateName)
    .order("rating", { ascending: false, nullsFirst: false })
    .order("business_name", { ascending: true })
    .limit(5000);

  let providers = result.data;

  if (!providers || providers.length === 0) {
    notFound();
  }

  // Sort by rating (highest first), then by name for consistency
  // Providers with no rating go to the bottom
  providers = providers.sort((a, b) => {
    // Both have ratings - sort by rating descending
    if (a.rating && b.rating) {
      return (b.rating as number) - (a.rating as number);
    }
    // a has rating, b doesn't - a comes first
    if (a.rating && !b.rating) return -1;
    // b has rating, a doesn't - b comes first
    if (b.rating && !a.rating) return 1;
    // Neither has rating - sort by name
    return (a.name as string).localeCompare(b.name as string);
  });

  // Get counts for all states using database function (avoids row limit issues)
  const { data: stateCountsData } = await supabase.rpc("get_state_counts");

  const stateCounts = new Map<string, number>();
  (stateCountsData || []).forEach((row: { state: string; count: number }) => {
    if (row.state) {
      const stateSlug = row.state
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      stateCounts.set(stateSlug, Number(row.count));
    }
  });

  // ItemList schema for providers on this state page (top 10)
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: providers.slice(0, 10).map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: provider.name,
        url: `https://nearbyiv.com/${state}/${provider.city_slug}/${provider.provider_slug}`,
        ...(provider.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: provider.rating,
            reviewCount: provider.reviews || 1,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
    })),
  };

  // BreadcrumbList schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nearbyiv.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: display,
        item: `https://nearbyiv.com/${state}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <LocationPageClient
        state={state}
        display={display}
        providers={providers}
        isCity={false}
        stateCounts={Object.fromEntries(stateCounts)}
      />
    </>
  );
}
