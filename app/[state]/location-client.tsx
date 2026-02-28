"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Star } from "lucide-react";

interface Provider {
  name: string;
  city: string;
  state: string;
  slug: string;
  city_slug: string;
  provider_slug: string;
  seo_url_path: string;
  website: string;
  phone: string;
  rating: number | null;
  reviews: number | null;
  is_confirmed_mobile: boolean;
  treatments: string[] | string;
  hero_image: string;
}

interface LocationPageClientProps {
  state: string;
  display: string;
  providers: Provider[];
  isCity: boolean;
}

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

const AVAILABLE_STATES = Object.entries(STATE_MAP).map(([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));

export function LocationPageClient({
  state,
  display,
  providers,
  isCity,
}: LocationPageClientProps) {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState<number | null>(null);
  const [mobileOnly, setMobileOnly] = useState(false);

  // Get unique cities with counts for state pages
  const cities = useMemo(() => {
    if (isCity) return [];
    const cityCounts = new Map<string, number>();
    providers.forEach((p) => {
      cityCounts.set(p.city, (cityCounts.get(p.city) || 0) + 1);
    });
    return Array.from(cityCounts.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => a.city.localeCompare(b.city));
  }, [providers, isCity]);

  // Get state counts
  const stateCounts = useMemo(() => {
    const counts = new Map<string, number>();
    providers.forEach((p) => {
      const stateSlug = p.state
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      if (stateSlug) {
        counts.set(stateSlug, (counts.get(stateSlug) || 0) + 1);
      }
    });
    return counts;
  }, [providers]);

  // Fixed list of IV therapy treatments
  const TREATMENT_OPTIONS = [
    "Anti-Aging",
    "Athletic",
    "B12",
    "Beauty",
    "Biotin",
    "Build Your Own",
    "Detox",
    "Energy",
    "Fitness",
    "Glow",
    "Glutathione",
    "Hangover",
    "Headache",
    "Hydration",
    "Immunity",
    "Jet Lag",
    "Myers",
    "Nad+",
    "Performance",
    "Vitamin B",
    "Vitamin C",
  ];

  // Filter providers based on all selected filters
  const filteredProviders = useMemo(() => {
    let result = providers;

    // City filter
    if (!isCity && selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    }

    // Treatment filter - flexible matching (case insensitive, includes substring)
    if (selectedTreatments.size > 0) {
      result = result.filter((p) => {
        if (!p.treatments) return false;
        const arr = Array.isArray(p.treatments) ? p.treatments : [p.treatments];
        const providerTreatments = arr
          .map((t) => String(t || "").toLowerCase().trim())
          .filter((t) => t.length > 0);

        return Array.from(selectedTreatments).some((selected) => {
          const selectedLower = selected.toLowerCase().trim();
          return providerTreatments.some((pt) =>
            pt.includes(selectedLower) || selectedLower.includes(pt)
          );
        });
      });
    }

    // Rating filter
    if (minRating !== null) {
      result = result.filter((p) => p.rating !== null && p.rating >= minRating);
    }

    // Mobile only filter
    if (mobileOnly) {
      result = result.filter((p) => p.is_confirmed_mobile);
    }

    return result;
  }, [providers, isCity, selectedCity, selectedTreatments, minRating, mobileOnly]);

  // Build breadcrumbs
  const breadcrumbItems: Array<{ name: string; href?: string }> = [
    { name: "Home", href: "/" },
  ];
  if (isCity) {
    breadcrumbItems.push({ name: display });
  } else {
    breadcrumbItems.push({ name: display });
    if (selectedCity) {
      breadcrumbItems.push({ name: selectedCity });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Mobile IV Therapy in {display}
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Find verified mobile IV therapy providers. Book hangover relief,
            hydration, NAD+, and wellness IV drips.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

              {/* State Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => router.push(`/${e.target.value}`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {AVAILABLE_STATES.map((s) => {
                    const count = stateCounts.get(s.slug) || 0;
                    return (
                      <option key={s.slug} value={s.slug}>
                        {s.name} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* City Filter - Show for state pages */}
              {!isCity && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    City
                  </label>
                  <select
                    value={selectedCity || ""}
                    onChange={(e) => setSelectedCity(e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities ({providers.length})</option>
                    {cities.map(({ city, count }) => (
                      <option key={city} value={city}>
                        {city} ({count})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Services/Treatments Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Services
                </label>
                <div className="space-y-2">
                  {TREATMENT_OPTIONS.map((treatment) => (
                    <label key={treatment} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTreatments.has(treatment)}
                        onChange={(e) => {
                          const newTreatments = new Set(selectedTreatments);
                          if (e.target.checked) {
                            newTreatments.add(treatment);
                          } else {
                            newTreatments.delete(treatment);
                          }
                          setSelectedTreatments(newTreatments);
                        }}
                        className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{treatment}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[null, 4, 3, 2].map((rating) => (
                    <label key={rating || "all"} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">
                        {rating === null ? "All Ratings" : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Confirmed Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mobileOnly}
                    onChange={(e) => setMobileOnly(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">Mobile Confirmed Only</span>
                </label>
              </div>

              {/* Provider Count */}
              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredProviders.length}</span> of{" "}
                  <span className="font-semibold">{providers.length}</span> providers
                </p>
              </div>
            </div>
          </aside>

          {/* Provider Grid */}
          <main className="lg:col-span-4">
            {filteredProviders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  No providers found. Try selecting a different city.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => (
                  <Link
                    key={provider.provider_slug}
                    href={`/${state}/${provider.city_slug}/${provider.provider_slug}`}
                  >
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                      {/* Hero Image */}
                      <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {provider.hero_image ? (
                          <img
                            src={provider.hero_image}
                            alt={provider.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                            <div className="text-blue-200">No image</div>
                          </div>
                        )}
                        {provider.is_confirmed_mobile && (
                          <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Mobile
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        {/* Provider Name */}
                        <h3 className="font-semibold text-gray-900 text-base mb-1">
                          {provider.name}
                        </h3>

                        {/* Location */}
                        <p className="text-sm text-gray-600 mb-4">
                          {provider.city}, {provider.state}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          {provider.rating ? (
                            <>
                              <div className="flex items-center">
                                <Star
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  aria-label="star"
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {provider.rating.toFixed(1)}
                              </span>
                              {provider.reviews && (
                                <span className="text-sm text-gray-500">
                                  ({provider.reviews})
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">No ratings yet</span>
                          )}
                        </div>

                        {/* View Profile Button */}
                        <button className="w-full mt-auto bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-auto">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com
        </p>
      </footer>
    </div>
  );
}
