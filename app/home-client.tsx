"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Provider = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviews: number | null;
  hero_image: string | null;
  treatments: string | null;
  service_areas: string | null;
  is_confirmed_mobile: boolean;
};

const CATEGORIES = [
  {
    id: "hydration",
    label: "Hydration & Recovery 🧊",
    keywords: [
      "hydration", "rehydration", "recovery", "hangover", "detox",
      "headache", "migraine", "jet lag", "food poisoning", "morning sickness",
      "cold", "flu",
    ],
  },
  {
    id: "longevity",
    label: "Longevity & NAD+ 🧬",
    keywords: [
      "nad", "anti-aging", "glow", "glutathione", "biotin",
      "myers", "immune", "immunity", "iron", "ketamine",
    ],
  },
  {
    id: "weightloss",
    label: "Weight Loss (GLP-1) ⚖️",
    keywords: [
      "weight loss", "slim", "skinny", "energy", "b12", "metabolic",
    ],
  },
];

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "name", label: "A–Z" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-yellow-400" : "text-gray-200"} fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function HomeClient({ providers }: { providers: Provider[] }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rating");

  const filtered = useMemo(() => {
    let list = [...providers];

    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.id === activeCategory);
      if (cat) {
        list = list.filter((p) => {
          const treatments = p.treatments?.toLowerCase() ?? "";
          return cat.keywords.some((kw) => treatments.includes(kw));
        });
      }
    }

    list.sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "reviews") return (b.reviews ?? 0) - (a.reviews ?? 0);
      if (sortBy === "name") return (a.name ?? "").localeCompare(b.name ?? "");
      return 0;
    });

    return list;
  }, [providers, activeCategory, sortBy]);

  return (
    <div>
      {/* ── Category Trigger Buttons ── */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => router.push(`/providers?category=${cat.id}`)}
            className="px-6 py-3 rounded-2xl text-sm font-semibold border transition-all duration-200 cursor-pointer backdrop-blur-md bg-white/20 text-white border-white/40 hover:bg-[#0066FF] hover:border-[#0066FF] hover:shadow-lg hover:shadow-blue-500/30"
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Results Section ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Sort & Count Bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span> providers
            {activeCategory && (
              <span className="ml-2 text-[#0066FF]">
                · {CATEGORIES.find((c) => c.id === activeCategory)?.label}
                <button
                  onClick={() => setActiveCategory(null)}
                  className="ml-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/30 cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Split View */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Provider List (60%) */}
          <div className="flex-1 lg:w-[60%] space-y-4 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-2">
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-gray-600">No providers match this filter</p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="mt-3 text-sm text-[#0066FF] hover:underline cursor-pointer"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filtered.map((p) => {
                const location = [p.city, p.state].filter(Boolean).join(", ");
                const topTreatments = p.treatments
                  ?.split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 3) ?? [];

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-blue-50 to-blue-100">
                        <img
                          src={p.hero_image || "/iv-bag-default.jpg"}
                          alt={p.name}
                          onError={(e) => { (e.target as HTMLImageElement).src = "/iv-bag-default.jpg"; }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-base leading-snug">{p.name}</h3>
                            {location && (
                              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {location}
                              </p>
                            )}
                          </div>

                          {/* Badges */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {p.is_confirmed_mobile && (
                              <span className="text-[10px] font-bold uppercase tracking-wide bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                                ✓ Mobile
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Rating */}
                        {p.rating != null && (
                          <div className="flex items-center gap-2 mt-2">
                            <StarRating rating={p.rating} />
                            <span className="text-sm font-semibold text-gray-800">{p.rating.toFixed(1)}</span>
                            {p.reviews != null && (
                              <span className="text-xs text-gray-400">({p.reviews.toLocaleString()} reviews)</span>
                            )}
                          </div>
                        )}

                        {/* Treatments */}
                        {topTreatments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {topTreatments.map((t) => (
                              <span
                                key={t}
                                className="text-[11px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4">
                          {p.phone && (
                            <a
                              href={`tel:${p.phone}`}
                              className="flex-1 text-center text-sm font-semibold bg-[#0066FF] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Direct Book
                            </a>
                          )}
                          <Link
                            href={`/providers/${p.slug}`}
                            className={`text-sm font-semibold border border-gray-200 hover:border-[#0066FF] hover:text-[#0066FF] text-gray-600 px-4 py-2 rounded-lg transition-colors ${p.phone ? "" : "flex-1 text-center"}`}
                          >
                            View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Map Placeholder (40%) */}
          <div className="hidden lg:block lg:w-[40%]">
            <div className="sticky top-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 h-[calc(100vh-160px)]">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3 z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-600 text-sm">Map View</p>
                <p className="text-xs text-gray-400 text-center max-w-[180px]">
                  Interactive map coming soon. Providers will be pinned by location.
                </p>
              </div>
              {/* Faint grid pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust Stats Bar ── */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="border border-gray-100 rounded-2xl bg-gray-50 px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "134+", label: "Verified Providers" },
            { value: "RN-Led", label: "Medical Teams" },
            { value: "Weekly", label: "Updated" },
            { value: "4.0★", label: "Min Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
