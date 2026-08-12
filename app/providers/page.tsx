import { ProviderGrid } from "../provider-grid";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { dedupeValidatedProviders } from "@/lib/directory-validation";
import Link from "next/link";

// Allow query parameters to work with revalidation
export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Mobile IV Therapy Providers — Browse All Listings",
  description:
    "Browse reviewed mobile IV therapy listings. Filter by city, treatment type, or rating and learn what each directory review label means.",
  alternates: { canonical: "https://nearbyiv.com/providers" },
  openGraph: {
    title: "Mobile IV Therapy Providers — Browse All Listings | NearbyIV",
    description:
      "Browse reviewed mobile IV therapy listings and see how NearbyIV evaluates directory evidence.",
    url: "/providers",
    type: "website",
  },
};

async function fetchAllProviders(): Promise<Parameters<typeof ProviderGrid>[0]["providers"]> {
  const cols = "id,slug,name:business_name,city:City,state:State,city_slug,provider_slug,website,rating,reviews,hero_image,treatments,is_confirmed_mobile,personalized_bio,service_areas";
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=${cols}&order=rating.desc.nullslast&limit=5000`;

  try {
    const res = await fetch(url, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "" },
    });
    if (!res.ok) {
      console.error("Provider inventory request failed", res.status, await res.text());
      return [];
    }
    return dedupeValidatedProviders(await res.json()) as Parameters<typeof ProviderGrid>[0]["providers"];
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
            Browse reviewed mobile IV therapy listings. <Link href="/verification" className="text-blue-600 underline">See how our review labels work.</Link>
          </p>
        </div>
      </header>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {providers.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-950">
            <h2 className="font-semibold">Provider listings are temporarily unavailable</h2>
            <p className="mt-2 text-sm">We are refreshing our reviewed inventory. Please browse by location or check back shortly.</p>
          </div>
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
