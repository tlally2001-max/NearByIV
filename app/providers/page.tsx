import { ProviderGrid } from "../provider-grid";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

// Allow query parameters to work with revalidation
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Mobile IV Therapy Providers — Browse All Listings",
  description:
    "Browse all verified mobile IV therapy providers. Filter by city, treatment type, or rating. Find RN-led concierge IV hydration, NAD+, GLP-1, and wellness services near you.",
  alternates: { canonical: "https://nearbyiv.com/providers" },
  openGraph: {
    title: "Mobile IV Therapy Providers — Browse All Listings | NearbyIV",
    description:
      "Browse all verified mobile IV therapy providers. Find RN-led concierge services near you.",
    url: "/providers",
    type: "website",
  },
};

async function fetchAllProviders() {
  const cols = "id,slug,name,city,state,website,rating,reviews,hero_image,treatments,is_confirmed_mobile";
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=${cols}&is_confirmed_mobile=eq.true&order=rating.desc.nullslast`;

  try {
    const res = await fetch(url, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "" },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProvidersPage() {
  const providers = await fetchAllProviders();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Providers" }]} />

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

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {providers.length === 0 ? (
          <p className="text-gray-400 text-center py-16">
            No providers found. Try again later.
          </p>
        ) : (
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse shadow-md" />
              ))}
            </div>
          }>
            <ProviderGrid providers={providers} />
          </Suspense>
        )}
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
