import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=city_slug&order=city_slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );
    if (!response.ok) return [];
    const providers: Array<{ city_slug: string }> = await response.json();
    const unique = [...new Set(providers.map((p) => p.city_slug))];
    return unique.map((city_slug) => ({ city: city_slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityDisplay = city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    title: { absolute: `Mobile IV Therapy in ${cityDisplay} | NearbyIV` },
    description: `Find verified mobile IV therapy providers in ${cityDisplay}. Book hangover relief, hydration, NAD+, and wellness IV drips delivered to your home or hotel.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityDisplay = city.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const supabase = await createClient();
  const { data: providers } = await supabase
    .from("providers")
    .select("name, city, state, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, is_confirmed_mobile, treatments, hero_image")
    .eq("city_slug", city)
    .order("rating", { ascending: false });

  if (!providers || providers.length === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Locations", href: "/locations" },
          { name: providers[0]?.state || "State" },
          { name: cityDisplay },
        ]}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Mobile IV Therapy in {cityDisplay}
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-2xl mx-auto">
            {providers.length} verified provider{providers.length !== 1 ? "s" : ""} offering mobile IV therapy, hangover relief, NAD+, and wellness services in {cityDisplay}.
          </p>
        </div>
      </header>

      {/* Provider List */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {providers.map((p) => (
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
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h2 className="text-base font-bold text-gray-900">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.city}, {p.state}</p>

                {p.rating != null && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(p.rating!) ? "text-yellow-400" : "text-gray-300"} fill-current`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600">{p.rating.toFixed(1)}</span>
                    {p.reviews && <span className="text-gray-400">({p.reviews} reviews)</span>}
                  </div>
                )}

                <span className="mt-auto pt-2 text-sm font-semibold text-blue-600">
                  View Profile →
                </span>
              </div>
            </Link>
          ))}
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
