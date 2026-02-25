import { ProviderGrid } from "../provider-grid";
import Link from "next/link";
import type { Metadata } from "next";

// Static generation - fetch providers once at build time, never at runtime
export const dynamic = "force-static";

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

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
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
          <ProviderGrid providers={providers} />
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
