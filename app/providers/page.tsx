import { createClient } from "@/lib/supabase/server";
import { ProviderGrid } from "../provider-grid";
import { StateFilterDropdown } from "@/components/state-filter-dropdown";
import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

export const revalidate = 3600; // cache pages for 1 hour

export const metadata: Metadata = {
  title: "Mobile IV Therapy Providers — Browse All Listings",
  description:
    "Browse all verified mobile IV therapy providers. Filter by city, treatment type, or rating. Find RN-led concierge IV hydration, NAD+, GLP-1, and wellness services near you.",
  alternates: { canonical: "/providers" },
  openGraph: {
    title: "Mobile IV Therapy Providers — Browse All Listings | NearbyIV",
    description:
      "Browse all verified mobile IV therapy providers. Find RN-led concierge services near you.",
    url: "/providers",
    type: "website",
  },
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  hydration: [
    "hydration", "rehydration", "recovery", "hangover", "detox",
    "headache", "migraine", "jet lag", "food poisoning", "morning sickness",
    "cold", "flu",
  ],
  longevity: [
    "nad", "anti-aging", "glow", "glutathione", "biotin",
    "myers", "immune", "immunity", "iron", "ketamine",
  ],
  weightloss: [
    "weight loss", "slim", "skinny", "energy", "b12", "metabolic",
  ],
};

const CATEGORY_LABELS: Record<string, string> = {
  hydration: "Hydration & Recovery 🧊",
  longevity: "Longevity & NAD+ 🧬",
  weightloss: "Weight Loss (GLP-1) ⚖️",
};

async function AllProviders({ query, category, state }: { query: string; category: string; state: string }) {
  const supabase = await createClient();

  let query = supabase
    .from("providers")
    .select("id, slug, name, city, state, website, rating, reviews, hero_image, treatments, is_confirmed_mobile")
    .eq("is_confirmed_mobile", true)
    .order("rating", { ascending: false });

  // Push state filter to DB so we don't fetch all rows
  if (state) {
    query = query.ilike("state", state);
  }

  const { data: allProviders, error } = await query;

  if (error) console.error("Supabase query error:", error);

  let providers = allProviders ?? [];

  // Filter by category keywords (client-side since treatments is a text column)
  if (category && CATEGORY_KEYWORDS[category]) {
    const keywords = CATEGORY_KEYWORDS[category];
    providers = providers.filter((p) => {
      const treatments = (p.treatments ?? "").toLowerCase();
      return keywords.some((kw) => treatments.includes(kw.toLowerCase()));
    });
  }

  // Filter by search query
  if (query) {
    const q = query.toLowerCase().trim();
    // Handle "City, State" or "City State" format
    const queryParts = q.split(/[\s,]+/).filter(Boolean);

    providers = providers.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const city = p.city?.toLowerCase() || "";
      const providerState = p.state?.toLowerCase() || "";

      // Check if query matches name, city, or state
      const matchesName = name.includes(q);
      const matchesCity = city.includes(q);
      const matchesState = providerState.includes(q);

      // For "City, State" queries, check if both parts match
      const matchesCityState = queryParts.length > 1 &&
        queryParts.some(part =>
          (city.includes(part) || providerState.includes(part))
        );

      return matchesName || matchesCity || matchesState || matchesCityState;
    });
  }

  if (providers.length === 0) {
    return (
      <p className="text-gray-400 text-center py-16">
        No providers found{query ? ` matching "${query}"` : ""}. Try a different search.
      </p>
    );
  }

  return <ProviderGrid providers={providers} />;
}

async function SearchResults({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; state?: string }>;
}) {
  const { q, category, state } = await searchParams;
  const query = q ?? "";
  const cat = category ?? "";
  const selectedState = state ?? "";
  const catLabel = cat ? CATEGORY_LABELS[cat] : null;

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {selectedState
                ? `Mobile IV Therapy Providers in ${selectedState}`
                : catLabel ?? (query ? `Results for "${query}"` : "Mobile IV Therapy Providers Near You")}
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              {selectedState
                ? `Showing verified mobile IV therapy providers in ${selectedState}.`
                : catLabel
                ? `Showing providers that offer ${catLabel} services.`
                : "Browse verified mobile IV therapy providers."}
            </p>
          </div>
          {(catLabel || query || selectedState) && (
            <div className="mt-4">
              <Link
                href="/providers"
                className="text-sm text-gray-400 hover:text-[#0066FF] border border-gray-200 rounded-full px-3 py-1 transition-colors"
              >
                ✕ Clear filter
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <AllProviders query={query} category={cat} state={selectedState} />
      </section>
    </>
  );
}

export default function ProvidersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Nearby<span className="text-[#0066FF]">IV</span>
            <span className="text-gray-400 font-normal">.com</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/providers" className="text-sm font-medium text-[#0066FF]">
              Find Providers
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </nav>

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-md" />
              ))}
            </div>
          </div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-auto">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com
        </p>
      </footer>
    </div>
  );
}
