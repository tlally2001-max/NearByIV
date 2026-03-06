import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { USAMapComponent } from "./usa-map-component";
import { LocationSearch } from "./location-search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Best Mobile IV Therapy By City | NearbyIV" },
  description:
    "Find the best mobile IV therapy providers in your city. Browse verified RN-led IV hydration, NAD+, hangover relief, and wellness services near you.",
  alternates: { canonical: "https://nearbyiv.com/locations" },
  openGraph: {
    title: "Best Mobile IV Therapy By City | NearbyIV",
    description:
      "Find the best mobile IV therapy providers in your city. Browse verified RN-led IV hydration, NAD+, hangover relief, and wellness services near you.",
    url: "https://nearbyiv.com/locations",
    type: "website",
  },
};

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function LocationsPage() {
  const supabase = await createClient();

  // Fetch state counts
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

  // Fetch top 20 cities by provider count
  const { data: allProviders } = await supabase
    .from("providers")
    .select("City, State, postal_code")
    .limit(10000);

  const cityCounts = new Map<string, { city: string; state: string; count: number; zips: Set<string> }>();
  (allProviders || []).forEach((provider: { City: string; State: string; postal_code?: string }) => {
    if (provider.City && provider.State) {
      const key = `${provider.City}, ${provider.State}`;
      if (cityCounts.has(key)) {
        const existing = cityCounts.get(key)!;
        if (provider.postal_code) {
          existing.zips.add(provider.postal_code);
        }
        cityCounts.set(key, { ...existing, count: existing.count + 1 });
      } else {
        const zips = new Set<string>();
        if (provider.postal_code) {
          zips.add(provider.postal_code);
        }
        cityCounts.set(key, {
          city: provider.City,
          state: provider.State,
          count: 1,
          zips,
        });
      }
    }
  });

  const topCities = Array.from(cityCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Build city list for search component
  const cityList = Array.from(cityCounts.values()).map(({ city, state, zips }) => ({
    city,
    state,
    zips: Array.from(zips),
  }));

  // Get unique states with providers for Browse section
  const uniqueStates = new Set<string>();
  (allProviders || []).forEach((provider: { State: string }) => {
    if (provider.State) uniqueStates.add(provider.State);
  });

  const stateLocations: Record<string, string[]> = {};
  (allProviders || []).forEach((provider: { State: string; City: string }) => {
    if (provider.State && provider.City) {
      if (!stateLocations[provider.State]) {
        stateLocations[provider.State] = [];
      }
      if (!stateLocations[provider.State].includes(provider.City)) {
        stateLocations[provider.State].push(provider.City);
      }
    }
  });

  // Sort cities within each state
  Object.keys(stateLocations).forEach((state) => {
    stateLocations[state].sort();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Locations" }]} />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Best Mobile IV Therapy By City
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            Choose your state or city below to find the best mobile IV therapy providers in your area — hangover relief, NAD+, hydration, and more.
          </p>
        </div>
      </header>

      {/* Interactive USA Map */}
      <section className="max-w-7xl mx-auto px-6 py-12 hidden md:block">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Providers by State</h2>
        <USAMapComponent stateCounts={stateCounts} />
      </section>

      {/* Location Search Bar */}
      <LocationSearch cities={cityList} />

      {/* Top Cities */}
      {topCities.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Cities by Provider Count</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topCities.map(({ city, state, count }) => {
              const stateSlug = toSlug(state);
              const citySlug = toSlug(city);
              return (
                <Link
                  key={`${state}-${city}`}
                  href={`/${stateSlug}/${citySlug}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900">{city}</h3>
                  <p className="text-sm text-gray-600">{state}</p>
                  <div className="mt-3 inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {count} provider{count !== 1 ? "s" : ""}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Browse by State */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by State & City</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(stateLocations)
            .sort(([stateA], [stateB]) => stateA.localeCompare(stateB))
            .map(([state, cities]) => (
              <div
                key={state}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                  {state} Mobile IV Therapy
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {cities.map((city) => (
                    <Link
                      key={city}
                      href={`/${toSlug(state)}/${toSlug(city)}`}
                      className="text-sm text-[#0066FF] hover:text-[#0052cc] hover:underline transition-colors py-1"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-auto">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com
        </p>
      </footer>
    </div>
  );
}
