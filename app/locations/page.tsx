import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-static";

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

const LOCATIONS: Record<string, string[]> = {
  Arizona: ["Scottsdale"],
  California: ["Beverly Hills", "Glendale", "Los Angeles", "Pasadena", "Sherman Oaks", "West Hollywood"],
  Colorado: ["Boulder", "Denver", "Greenwood Village", "Lakewood", "Louisville"],
  Florida: ["Kissimmee", "Orlando", "St. Petersburg", "Tampa", "Winter Garden", "Winter Park"],
  Georgia: ["Atlanta", "Brookhaven", "Decatur"],
  Illinois: ["Burr Ridge", "Chicago", "Elmhurst", "Lake Forest", "Lombard", "Skokie"],
  Nevada: ["Las Vegas"],
  "New Jersey": ["Englewood", "Florham Park", "Hoboken", "Jersey City"],
  "New York": ["Brooklyn", "Jackson Heights", "Long Island City", "New York", "Rego Park", "Scarsdale"],
  "North Carolina": ["Denver"],
  "South Carolina": ["Charleston"],
  Texas: ["Austin", "Pflugerville"],
  Virginia: ["Herndon"],
};

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function LocationsPage() {
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
            Choose your city below to find the best mobile IV therapy providers in your area — hangover relief, NAD+, hydration, and more.
          </p>
        </div>
      </header>

      {/* State/City Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(LOCATIONS).map(([state, cities]) => (
            <div
              key={state}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                {state} Mobile IV Therapy / Hangover Relief
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {cities.map((city) => (
                  <Link
                    key={city}
                    href={`/${toSlug(city)}`}
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
