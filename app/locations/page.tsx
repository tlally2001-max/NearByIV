import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

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

// USA statebins grid layout (geographic arrangement)
// Each state has [row, col, name, slug]
const STATE_GRID: Array<[number, number, string, string]> = [
  // Row 0
  [0, 8, "Hawaii", "hawaii"],
  [0, 9, "Alaska", "alaska"],
  // Row 1
  // Row 2
  [2, 0, "Washington", "washington"],
  [2, 1, "Montana", "montana"],
  [2, 2, "North Dakota", "north-dakota"],
  [2, 3, "Minnesota", "minnesota"],
  [2, 4, "Wisconsin", "wisconsin"],
  [2, 5, "Michigan", "michigan"],
  [2, 9, "Vermont", "vermont"],
  [2, 10, "New Hampshire", "new-hampshire"],
  // Row 3
  [3, 0, "Oregon", "oregon"],
  [3, 1, "Idaho", "idaho"],
  [3, 2, "Wyoming", "wyoming"],
  [3, 3, "South Dakota", "south-dakota"],
  [3, 4, "Iowa", "iowa"],
  [3, 5, "Illinois", "illinois"],
  [3, 6, "Indiana", "indiana"],
  [3, 7, "Ohio", "ohio"],
  [3, 8, "Pennsylvania", "pennsylvania"],
  [3, 9, "New York", "new-york"],
  [3, 10, "Massachusetts", "massachusetts"],
  // Row 4
  [4, 0, "California", "california"],
  [4, 1, "Nevada", "nevada"],
  [4, 2, "Utah", "utah"],
  [4, 3, "Colorado", "colorado"],
  [4, 4, "Nebraska", "nebraska"],
  [4, 5, "Missouri", "missouri"],
  [4, 6, "Kentucky", "kentucky"],
  [4, 7, "West Virginia", "west-virginia"],
  [4, 8, "Virginia", "virginia"],
  [4, 9, "Maryland", "maryland"],
  [4, 10, "Connecticut", "connecticut"],
  // Row 5
  [5, 0, "Arizona", "arizona"],
  [5, 1, "New Mexico", "new-mexico"],
  [5, 2, "Oklahoma", "oklahoma"],
  [5, 3, "Kansas", "kansas"],
  [5, 4, "Arkansas", "arkansas"],
  [5, 5, "Tennessee", "tennessee"],
  [5, 6, "North Carolina", "north-carolina"],
  [5, 7, "South Carolina", "south-carolina"],
  [5, 8, "Georgia", "georgia"],
  [5, 9, "Delaware", "delaware"],
  [5, 10, "New Jersey", "new-jersey"],
  // Row 6
  [6, 2, "Texas", "texas"],
  [6, 4, "Louisiana", "louisiana"],
  [6, 5, "Mississippi", "mississippi"],
  [6, 6, "Alabama", "alabama"],
  [6, 7, "Florida", "florida"],
  // Row 7
  [7, 5, "District of Columbia", "district-of-columbia"],
];

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function getColorForCount(count: number): string {
  if (count === 0) return "#e5e7eb"; // gray
  if (count <= 5) return "#dbeafe"; // light blue
  if (count <= 20) return "#93c5fd"; // medium blue
  if (count <= 50) return "#3b82f6"; // blue
  return "#1d4ed8"; // dark blue
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
    .select("City, State")
    .limit(10000);

  const cityCounts = new Map<string, { city: string; state: string; count: number }>();
  (allProviders || []).forEach((provider: { City: string; State: string }) => {
    if (provider.City && provider.State) {
      const key = `${provider.City}, ${provider.State}`;
      if (cityCounts.has(key)) {
        const existing = cityCounts.get(key)!;
        cityCounts.set(key, { ...existing, count: existing.count + 1 });
      } else {
        cityCounts.set(key, {
          city: provider.City,
          state: provider.State,
          count: 1,
        });
      }
    }
  });

  const topCities = Array.from(cityCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

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

      {/* USA Tile Grid Map */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Provider Coverage by State</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-8 overflow-x-auto">
          <svg
            viewBox="0 0 1100 760"
            className="w-full h-auto max-w-4xl mx-auto"
            style={{ minWidth: "100%" }}
          >
            {STATE_GRID.map(([row, col, name, slug]) => {
              const x = col * 100 + 50;
              const y = row * 100 + 50;
              const count = stateCounts.get(slug) || 0;
              const color = getColorForCount(count);

              return (
                <g key={slug}>
                  {/* State square */}
                  <a href={`/${slug}`} style={{ cursor: "pointer" }}>
                    <rect
                      x={x - 40}
                      y={y - 40}
                      width="80"
                      height="80"
                      fill={color}
                      stroke="#d1d5db"
                      strokeWidth="2"
                      rx="4"
                      className="hover:opacity-80 transition-opacity"
                    />
                    {/* State abbreviation text */}
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="#1f2937"
                      className="pointer-events-none"
                    >
                      {name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                    </text>
                    {/* Provider count */}
                    <text
                      x={x}
                      y={y + 12}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#1f2937"
                      className="pointer-events-none"
                    >
                      {count}
                    </text>
                  </a>

                  {/* Tooltip background on hover */}
                  <rect
                    x={x - 40}
                    y={y - 40}
                    width="80"
                    height="80"
                    fill="none"
                    stroke="none"
                    className="hover:fill-blue-50/30"
                  />
                </g>
              );
            })}
          </svg>

          {/* Color legend */}
          <div className="mt-8 flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#e5e7eb" }}></div>
              <span className="text-sm text-gray-600">No providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#dbeafe" }}></div>
              <span className="text-sm text-gray-600">1-5 providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#93c5fd" }}></div>
              <span className="text-sm text-gray-600">6-20 providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#3b82f6" }}></div>
              <span className="text-sm text-gray-600">21-50 providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: "#1d4ed8" }}></div>
              <span className="text-sm text-gray-600">51+ providers</span>
            </div>
          </div>
        </div>
      </section>

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
