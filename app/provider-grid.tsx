"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type Provider = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
  hero_image: string | null;
  treatments: string | null;
  is_confirmed_mobile: boolean;
};

// Normalize service names to group similar services
const SERVICE_ALIASES: Record<string, string> = {
  "nad": "NAD+",
  "nad+": "NAD+",
  "nad⁺": "NAD+",
  "nadh": "NAD+",
  "nad iv": "NAD+",
  "nadiv": "NAD+",
  "nad+ iv": "NAD+",
  "myers": "Myers Cocktail",
  "myers cocktail": "Myers Cocktail",
  "myers iv": "Myers Cocktail",
  "myersiv": "Myers Cocktail",
  "myers'": "Myers Cocktail",
  "myer's": "Myers Cocktail",
  "myer's cocktail": "Myers Cocktail",
  "myers' cocktail": "Myers Cocktail",
  "myers' iv": "Myers Cocktail",
  "myer's iv": "Myers Cocktail",
  "vitamin c": "Vitamin C",
  "iv vitamin c": "Vitamin C",
  "ascorbic acid": "Vitamin C",
  "glutathione": "Glutathione",
  "glutathione iv": "Glutathione",
  "hydration": "IV Hydration",
  "rehydration": "IV Hydration",
  "iv rehydration": "IV Hydration",
  "hangover": "Hangover Relief",
  "hangover iv": "Hangover Relief",
  "detox": "Detox",
  "iv detox": "Detox",
  "b12": "B12",
  "vitamin b12": "B12",
  "anti-aging": "Anti-Aging",
  "anti aging": "Anti-Aging",
  "biotin": "Biotin",
  "collagen": "Collagen",
  "weight loss": "Weight Loss",
  "glow": "Glow",
  "skin glow": "Glow",
  "immune": "Immune Support",
  "immunity": "Immune Support",
  "immune iv": "Immune Support",
  "iron": "Iron",
  "ketamine": "Ketamine",
};

function normalizeService(service: string): string {
  // First try exact match with spaces
  const withSpaces = service.toLowerCase().trim();
  if (SERVICE_ALIASES[withSpaces]) {
    return SERVICE_ALIASES[withSpaces];
  }

  // Try with spaces preserved (in case spaces matter)
  const spacePreserved = service.toLowerCase().trim().replace(/\s+/g, " ");
  if (SERVICE_ALIASES[spacePreserved]) {
    return SERVICE_ALIASES[spacePreserved];
  }

  // Normalize: lowercase, trim, remove extra spaces, apostrophes, and dashes
  let normalized = service
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/[\s\-']/g, ""); // Remove spaces, dashes, and apostrophes for matching

  // Then try match without spaces/special chars
  if (SERVICE_ALIASES[normalized]) {
    return SERVICE_ALIASES[normalized];
  }

  return service;
}

export function ProviderGrid({ providers }: { providers: Provider[] }) {
  const states = Array.from(
    new Set(providers.map((p) => p.state).filter(Boolean))
  ).sort() as string[];

  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isInitialized, setIsInitialized] = useState(false);

  // Update URL when state or city changes
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL during initial load

    const params = new URLSearchParams();
    if (selectedState !== "all") params.set("state", selectedState);
    if (selectedCity !== "all") params.set("city", selectedCity);

    const newUrl = params.toString() ? `/providers?${params.toString()}` : "/providers";
    router.push(newUrl);
  }, [selectedState, selectedCity, isInitialized]);

  // Pre-select state and city from URL params (e.g. from locations page links or search)
  useEffect(() => {
    const stateParam = searchParams.get("state");
    const cityParam = searchParams.get("city");
    const queryParam = searchParams.get("q");

    if (stateParam) setSelectedState(stateParam);
    if (cityParam) setSelectedCity(cityParam);

    // Parse search query (e.g., "los angeles, ca" or "los angeles, california")
    if (queryParam && !stateParam && !cityParam) {
      const parts = queryParam.split(",").map((p) => p.trim());
      if (parts.length === 2) {
        const city = parts[0];
        const stateAbbr = parts[1].toLowerCase();

        // Map state abbreviations and names to full state names
        const stateMap: Record<string, string> = {
          al: "Alabama", alabama: "Alabama", ak: "Alaska", alaska: "Alaska", az: "Arizona", arizona: "Arizona",
          ar: "Arkansas", arkansas: "Arkansas", ca: "California", california: "California", co: "Colorado",
          colorado: "Colorado", ct: "Connecticut", connecticut: "Connecticut", de: "Delaware", delaware: "Delaware",
          fl: "Florida", florida: "Florida", ga: "Georgia", georgia: "Georgia", hi: "Hawaii", hawaii: "Hawaii",
          id: "Idaho", idaho: "Idaho", il: "Illinois", illinois: "Illinois", in: "Indiana", indiana: "Indiana",
          ia: "Iowa", iowa: "Iowa", ks: "Kansas", kansas: "Kansas", ky: "Kentucky", kentucky: "Kentucky",
          la: "Louisiana", louisiana: "Louisiana", me: "Maine", maine: "Maine", md: "Maryland", maryland: "Maryland",
          ma: "Massachusetts", massachusetts: "Massachusetts", mi: "Michigan", michigan: "Michigan",
          mn: "Minnesota", minnesota: "Minnesota", ms: "Mississippi", mississippi: "Mississippi",
          mo: "Missouri", missouri: "Missouri", mt: "Montana", montana: "Montana", ne: "Nebraska",
          nebraska: "Nebraska", nv: "Nevada", nevada: "Nevada", nh: "New Hampshire", "new hampshire": "New Hampshire",
          nj: "New Jersey", "new jersey": "New Jersey", nm: "New Mexico", "new mexico": "New Mexico",
          ny: "New York", "new york": "New York", nc: "North Carolina", "north carolina": "North Carolina",
          nd: "North Dakota", "north dakota": "North Dakota", oh: "Ohio", ohio: "Ohio", ok: "Oklahoma",
          oklahoma: "Oklahoma", or: "Oregon", oregon: "Oregon", pa: "Pennsylvania", pennsylvania: "Pennsylvania",
          ri: "Rhode Island", "rhode island": "Rhode Island", sc: "South Carolina", "south carolina": "South Carolina",
          sd: "South Dakota", "south dakota": "South Dakota", tn: "Tennessee", tennessee: "Tennessee",
          tx: "Texas", texas: "Texas", ut: "Utah", utah: "Utah", vt: "Vermont", vermont: "Vermont",
          va: "Virginia", virginia: "Virginia", wa: "Washington", washington: "Washington",
          wv: "West Virginia", "west virginia": "West Virginia", wi: "Wisconsin", wisconsin: "Wisconsin",
          wy: "Wyoming", wyoming: "Wyoming",
        };

        const normalizedState = stateMap[stateAbbr];
        if (normalizedState) {
          setSelectedState(normalizedState);
          setSelectedCity(city);
        }
      }
    }
    setIsInitialized(true);
  }, [searchParams]);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  // Get cities - filter by selected state if one is chosen
  const cities = useMemo(() => {
    let cityProviders = providers;
    if (selectedState !== "all") {
      cityProviders = providers.filter((p) => p.state === selectedState);
    }
    return Array.from(
      new Set(cityProviders.map((p) => p.city).filter(Boolean))
    ).sort() as string[];
  }, [providers, selectedState]);

  const services = useMemo(() => {
    const allServices = new Set<string>();
    providers.forEach((p) => {
      if (p.treatments) {
        p.treatments.split(",").forEach((t) => {
          const normalized = normalizeService(t.trim());
          if (normalized) allServices.add(normalized);
        });
      }
    });
    return Array.from(allServices).sort();
  }, [providers]);

  const toggleService = (service: string) => {
    const newSet = new Set(selectedServices);
    if (newSet.has(service)) {
      newSet.delete(service);
    } else {
      newSet.add(service);
    }
    setSelectedServices(newSet);
  };

  // Reset city filter when state changes
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity("all"); // Reset city filter when state changes
  };

  const filtered = useMemo(() => {
    let result = providers;
    let filterState = selectedState;
    let filterCity = selectedCity;

    // Handle query parameter if no state/city params set
    const queryParam = searchParams.get("q");
    if (queryParam && selectedState === "all" && selectedCity === "all") {
      const parts = queryParam.split(",").map((p) => p.trim());
      if (parts.length === 2) {
        const stateAbbr = parts[1].toLowerCase();
        const stateMap: Record<string, string> = {
          al: "Alabama", alabama: "Alabama", ak: "Alaska", alaska: "Alaska", az: "Arizona", arizona: "Arizona",
          ar: "Arkansas", arkansas: "Arkansas", ca: "California", california: "California", co: "Colorado",
          colorado: "Colorado", ct: "Connecticut", connecticut: "Connecticut", de: "Delaware", delaware: "Delaware",
          fl: "Florida", florida: "Florida", ga: "Georgia", georgia: "Georgia", hi: "Hawaii", hawaii: "Hawaii",
          id: "Idaho", idaho: "Idaho", il: "Illinois", illinois: "Illinois", in: "Indiana", indiana: "Indiana",
          ia: "Iowa", iowa: "Iowa", ks: "Kansas", kansas: "Kansas", ky: "Kentucky", kentucky: "Kentucky",
          la: "Louisiana", louisiana: "Louisiana", me: "Maine", maine: "Maine", md: "Maryland", maryland: "Maryland",
          ma: "Massachusetts", massachusetts: "Massachusetts", mi: "Michigan", michigan: "Michigan",
          mn: "Minnesota", minnesota: "Minnesota", ms: "Mississippi", mississippi: "Mississippi",
          mo: "Missouri", missouri: "Missouri", mt: "Montana", montana: "Montana", ne: "Nebraska",
          nebraska: "Nebraska", nv: "Nevada", nevada: "Nevada", nh: "New Hampshire", "new hampshire": "New Hampshire",
          nj: "New Jersey", "new jersey": "New Jersey", nm: "New Mexico", "new mexico": "New Mexico",
          ny: "New York", "new york": "New York", nc: "North Carolina", "north carolina": "North Carolina",
          nd: "North Dakota", "north dakota": "North Dakota", oh: "Ohio", ohio: "Ohio", ok: "Oklahoma",
          oklahoma: "Oklahoma", or: "Oregon", oregon: "Oregon", pa: "Pennsylvania", pennsylvania: "Pennsylvania",
          ri: "Rhode Island", "rhode island": "Rhode Island", sc: "South Carolina", "south carolina": "South Carolina",
          sd: "South Dakota", "south dakota": "South Dakota", tn: "Tennessee", tennessee: "Tennessee",
          tx: "Texas", texas: "Texas", ut: "Utah", utah: "Utah", vt: "Vermont", vermont: "Vermont",
          va: "Virginia", virginia: "Virginia", wa: "Washington", washington: "Washington",
          wv: "West Virginia", "west virginia": "West Virginia", wi: "Wisconsin", wisconsin: "Wisconsin",
          wy: "Wyoming", wyoming: "Wyoming",
        };
        const normalizedState = stateMap[stateAbbr];
        if (normalizedState) {
          filterState = normalizedState;
          filterCity = parts[0];
        }
      }
    }

    // Filter by state
    if (filterState !== "all") {
      result = result.filter((p) => p.state === filterState);
    }

    // Filter by city (case-insensitive)
    if (filterCity !== "all") {
      result = result.filter((p) => p.city?.toLowerCase() === filterCity.toLowerCase());
    }

    // Filter by services
    if (selectedServices.size > 0) {
      result = result.filter((p) => {
        if (!p.treatments) return false;
        const providerServices = new Set(
          p.treatments.split(",").map((t) => normalizeService(t.trim()))
        );
        return Array.from(selectedServices).some((service) =>
          providerServices.has(service)
        );
      });
    }

    return result;
  }, [providers, selectedState, selectedCity, selectedServices, searchParams]);

  return (
    <div className="flex gap-8 items-start">

      {/* ── Left Sidebar: Filters ── */}
      <aside className="hidden lg:block w-56 shrink-0 sticky top-24 space-y-4">
        {/* State Filter */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Filter by State
            </h3>
          </div>
          <div className="p-3">
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all"
            >
              <option value="all">All States ({states.length})</option>
              {states.map((state) => {
                const count = providers.filter((p) => p.state === state).length;
                return (
                  <option key={state} value={state}>
                    {state} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* City Filter */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Filter by City
            </h3>
          </div>
          <div className="p-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 transition-all"
            >
              <option value="all">All Cities ({cities.length})</option>
              {cities.map((city) => {
                const count = filtered.filter((p) => p.city === city).length;
                return (
                  <option key={city} value={city}>
                    {city} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Services Filter */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Filter by Service
            </h3>
          </div>
          <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
            {services.length === 0 ? (
              <p className="text-xs text-gray-400">No services available</p>
            ) : (
              services.map((service) => (
                <label key={service} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedServices.has(service)}
                    onChange={() => toggleService(service)}
                    className="w-4 h-4 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
                  />
                  <span className="text-sm text-gray-700">{service}</span>
                </label>
              ))
            )}
          </div>
          {selectedServices.size > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedServices(new Set())}
                className="text-xs text-[#0066FF] hover:text-[#0052cc] font-medium"
              >
                Clear Services
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Right: Grid ── */}
      <div className="flex-1 min-w-0">
        {/* Mobile state select */}
        <div className="lg:hidden mb-5 flex items-center gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
          >
            <option value="all">All States ({providers.length})</option>
            {states.map((state) => {
              const count = providers.filter((p) => p.state === state).length;
              return (
                <option key={state} value={state}>
                  {state} ({count})
                </option>
              );
            })}
          </select>
          {selectedState !== "all" && (
            <button
              onClick={() => setSelectedState("all")}
              className="text-sm text-[#0066FF] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Mobile city select */}
        <div className="lg:hidden mb-5 flex items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30"
          >
            <option value="all">All Cities ({filtered.length})</option>
            {cities.map((city) => {
              const count = filtered.filter((p) => p.city === city).length;
              return (
                <option key={city} value={city}>
                  {city} ({count})
                </option>
              );
            })}
          </select>
          {selectedCity !== "all" && (
            <button
              onClick={() => setSelectedCity("all")}
              className="text-sm text-[#0066FF] hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-5">
          Showing <span className="font-semibold text-gray-900">{filtered.length}</span> provider{filtered.length !== 1 ? "s" : ""}
          {selectedCity !== "all" ? ` in ${selectedCity}` : ""}
        </p>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-16">
            No providers found for this city.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Hero image */}
                <Link href={`/providers/${p.slug}`} className="block relative h-44 bg-gray-50 overflow-hidden">
                  <img
                    src={p.hero_image || "/iv-bag-default.jpg"}
                    alt={p.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = "/iv-bag-default.jpg"; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Mobile badge */}
                  {p.is_confirmed_mobile && (
                    <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Mobile
                    </span>
                  )}
                </Link>

                <div className="p-5 flex flex-col gap-3">
                  <h2 className="font-semibold text-base leading-snug text-gray-900">
                    {p.name}
                  </h2>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[p.city, p.state].filter(Boolean).join(", ")}
                    </span>
                    {p.rating != null && (
                      <span className="flex items-center gap-1 font-semibold text-yellow-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-gray-800">{p.rating.toFixed(1)}</span>
                        {p.reviews != null && (
                          <span className="text-gray-400 font-normal">({p.reviews})</span>
                        )}
                      </span>
                    )}
                  </div>

                  {p.treatments && (
                    <div className="flex flex-wrap gap-1.5">
                      {p.treatments.split(",").slice(0, 4).map((t) => (
                        <span
                          key={t.trim()}
                          className="text-xs bg-[#0066FF]/10 text-[#0066FF] rounded-full px-2.5 py-0.5 border border-[#0066FF]/20"
                        >
                          {t.trim()}
                        </span>
                      ))}
                      {p.treatments.split(",").length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{p.treatments.split(",").length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/providers/${p.slug}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#0066FF] hover:bg-[#0052cc] text-white text-sm font-semibold px-4 py-2.5 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
