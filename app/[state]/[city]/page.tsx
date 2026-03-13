import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocationPageClient } from "../location-client";

export const dynamicParams = true;

// State slug to full name mapping
const STATE_MAP: Record<string, string> = {
  alabama: "Alabama", alaska: "Alaska", arizona: "Arizona", arkansas: "Arkansas",
  california: "California", colorado: "Colorado", connecticut: "Connecticut", delaware: "Delaware",
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
    const citiesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=city_slug,state:State&city_slug=not.is.null&order=city_slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );
    const citiesData: Array<{ city_slug: string; state: string }> = citiesRes.ok ? await citiesRes.json() : [];

    const params: Array<{ state: string; city: string }> = [];
    citiesData.forEach((item) => {
      if (item.state && item.city_slug) {
        const stateSlug = item.state.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        params.push({ state: stateSlug, city: item.city_slug });
      }
    });

    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state, city } = await params;
  const fullStateName = STATE_MAP[state];
  const cityDisplay = city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const display = `${cityDisplay}, ${fullStateName || state}`;

  return {
    title: { absolute: `Mobile IV Therapy in ${display} | NearbyIV` },
    description: `Find verified mobile IV therapy providers in ${display}. Book hangover relief, hydration, NAD+, and wellness IV drips.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state, city } = await params;
  const fullStateName = STATE_MAP[state];

  if (!fullStateName) {
    notFound();
  }

  const cityDisplay = city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const display = `${cityDisplay}, ${fullStateName}`;

  const supabase = await createClient();

  // Get providers for this specific city
  const result = await supabase
    .from("providers")
    .select("name:business_name, city:City, state:State, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
    .eq("city_slug", city)
    .ilike("State", fullStateName)
    .order("rating", { ascending: false, nullsFirst: false });

  const providers = result.data;

  if (!providers || providers.length === 0) {
    notFound();
  }

  // ItemList schema for providers on this city page
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: providers.slice(0, 10).map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LocalBusiness",
        name: provider.name,
        url: `https://nearbyiv.com${provider.seo_url_path}`,
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
        name: fullStateName,
        item: `https://nearbyiv.com/${state}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityDisplay,
        item: `https://nearbyiv.com/${state}/${city}`,
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
        isCity={true}
      />
    </>
  );
}
