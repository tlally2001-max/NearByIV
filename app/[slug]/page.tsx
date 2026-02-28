import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    // Get all unique city slugs
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

    // Get all unique states
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

    // Return all as valid params
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

"use client";

import { useState, useMemo } from "react";

function LocationPageContent({
  slug,
  display,
  providers: initialProviders,
  isCity,
}: {
  slug: string;
  display: string;
  providers: any[];
  isCity: boolean;
}) {
  const [selectedCity, setSelectedCity] = useState("all");

  const cities = useMemo(() => {
    const unique = [...new Set(initialProviders.map((p) => p.city))];
    return unique.sort();
  }, [initialProviders]);

  const filteredProviders = useMemo(() => {
    if (selectedCity === "all") return initialProviders;
    return initialProviders.filter((p) => p.city === selectedCity);
  }, [initialProviders, selectedCity]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: display },
        ]}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Mobile IV Therapy Providers Near You
          </h1>
          <p className="mt-2 text-gray-500 text-sm">
            Browse verified mobile IV therapy providers. Filter by state, city, or service below.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            {!isCity && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase mb-4">Filter by City</h3>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">All Cities ({cities.length})</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Providers Grid */}
          <div className="flex-1">
            <p className="text-gray-600 text-sm mb-6">
              Showing <span className="font-semibold text-gray-900">{filteredProviders.length}</span> providers
            </p>

            {filteredProviders.length === 0 ? (
              <p className="text-gray-400 text-center py-16">
                No providers found. Try a different filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((p) => {
                  const treatments = p.treatments?.split(",").map((t: string) => t.trim()).filter(Boolean) ?? [];
                  return (
                    <Link
                      key={p.provider_slug}
                      href={p.seo_url_path}
                      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                    >
                      {/* Hero Image */}
                      <div className="relative h-44 bg-gray-100 overflow-hidden">
                        <img
                          src={p.hero_image || "/iv-bag-default.jpg"}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {p.is_confirmed_mobile && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Mobile
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col gap-3 flex-1">
                        <h2 className="text-base font-bold text-gray-900">{p.name}</h2>

                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-sm text-gray-600">{p.city}, {p.state}</span>
                        </div>

                        {p.rating != null && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < Math.round(p.rating!) ? "text-yellow-400" : "text-gray-300"} fill-current`} viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-900 font-semibold">{p.rating.toFixed(1)}</span>
                            {p.reviews && <span className="text-sm text-gray-500">({p.reviews})</span>}
                          </div>
                        )}

                        {/* Service Tags */}
                        {treatments.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {treatments.slice(0, 3).map((t: string) => (
                              <span key={t} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                {t.split(" ").slice(0, 2).join(" ")}
                              </span>
                            ))}
                            {treatments.length > 3 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{treatments.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        <button className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                          View Profile
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 mt-10">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
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
    <LocationPageContent
      slug={slug}
      display={display}
      providers={providers}
      isCity={isCity}
    />
  );
}
