import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocationPageClient } from "./location-client";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const citiesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=city_slug&order=city_slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );
    const citiesData: Array<{ city_slug: string }> = citiesRes.ok ? await citiesRes.json() : [];
    const cities = [...new Set(citiesData.map((p) => p.city_slug))];

    const statesRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=state&order=state.asc`,
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

    return [
      ...cities.map((slug) => ({ slug })),
      ...states.map((slug) => ({ slug })),
    ];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const display = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: { absolute: `Mobile IV Therapy in ${display} | NearbyIV` },
    description: `Find verified mobile IV therapy providers in ${display}. Book hangover relief, hydration, NAD+, and wellness IV drips.`,
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const display = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const supabase = await createClient();

  // First try to find by city_slug
  let providers = await supabase
    .from("providers")
    .select("name, city, state, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
    .eq("city_slug", slug)
    .order("rating", { ascending: false })
    .then((r) => r.data);

  let isCity = true;
  let breadcrumbState = null;

  // If not found as city, try as state
  if (!providers || providers.length === 0) {
    isCity = false;
    // Map slug back to full state name
    const stateMap: Record<string, string> = {
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

    const fullStateName = stateMap[slug];
    if (!fullStateName) notFound();

    breadcrumbState = fullStateName;
    const result = await supabase
      .from("providers")
      .select("name, city, state, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
      .ilike("state", fullStateName)
      .order("rating", { ascending: false });
    providers = result.data;
  }

  if (!providers || providers.length === 0) {
    notFound();
  }

  return (
    <LocationPageClient
      slug={slug}
      display={display}
      providers={providers}
      isCity={isCity}
    />
  );
}
