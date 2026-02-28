import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LocationPageClient } from "./location-client";

export const dynamicParams = false;

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

    return states.map((state) => ({ state }));
  } catch {
    return [];
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
    description: `Find verified mobile IV therapy providers in ${display}. Book hangover relief, hydration, NAD+, and wellness IV drips.`,
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
      .select("state")
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
    .select("name, city, state, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
    .ilike("state", fullStateName)
    .order("rating", { ascending: false });

  const providers = result.data;

  if (!providers || providers.length === 0) {
    notFound();
  }

  return (
    <LocationPageClient
      state={state}
      display={display}
      providers={providers}
      isCity={false}
    />
  );
}
