import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

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
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=city_slug,state&order=city_slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );
    const citiesData: Array<{ city_slug: string; state: string }> = citiesRes.ok ? await citiesRes.json() : [];

    const uniqueCities = new Map<string, string>();
    citiesData.forEach((item) => {
      if (!uniqueCities.has(item.city_slug)) {
        uniqueCities.set(item.city_slug, item.state);
      }
    });

    return Array.from(uniqueCities.entries()).map(([citySlug]) => ({
      slug: [citySlug],
    }));
  } catch {
    return [];
  }
}

export default async function OldCitySlugRedirect({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  // If it's a single segment (old city-only URL), redirect to state/city
  if (slug.length === 1) {
    const citySlug = slug[0];

    // Check if this is actually a state slug
    if (STATE_MAP[citySlug]) {
      redirect(`/${citySlug}`);
    }

    // Look up the city to find its state
    const supabase = await createClient();
    const { data } = await supabase
      .from("providers")
      .select("state")
      .eq("city_slug", citySlug)
      .limit(1)
      .single();

    if (!data || !data.state) {
      notFound();
    }

    // Convert state name to slug
    const stateSlug = data.state
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Redirect to the new URL structure
    redirect(`/${stateSlug}/${citySlug}`);
  }

  // For any other pattern, return 404
  notFound();
}
