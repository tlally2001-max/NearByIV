import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface ProviderPageProps {
  params: Promise<{ state: string; city: string; "provider-slug": string }>;
}

type Provider = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  city_slug: string;
  provider_slug: string;
  seo_url_path: string;
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviews: number | null;
  hero_image: string | null;
  treatments: string | null;
  service_areas: string | null;
  is_confirmed_mobile: boolean;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=state:State,city_slug,provider_slug&order=city_slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );

    if (!response.ok) return [];

    const providers: Array<{ state: string; city_slug: string; provider_slug: string }> = await response.json();
    return providers.map((provider) => ({
      state: provider.state.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      city: provider.city_slug,
      "provider-slug": provider.provider_slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string; "provider-slug": string }>;
}): Promise<Metadata> {
  const { city, "provider-slug": providerSlug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("providers")
    .select("name:business_name, city:City, state:State, treatments, is_confirmed_mobile")
    .eq("city_slug", city)
    .eq("provider_slug", providerSlug)
    .single();

  if (!data) {
    return { title: "Provider Not Found | NearbyIV" };
  }

  const location = [data.city, data.state].filter(Boolean).join(", ");
  const services = data.is_confirmed_mobile ? ["Mobile IV"] : [];

  const title = `${data.name} | IV Therapy in ${location} | NearbyIV`;
  return {
    title: { absolute: title },
    description: `Book IV therapy with ${data.name} in ${location}. Professional IV therapy services in ${location}.`,
  };
}

async function ProfileContent({ city, providerSlug }: { city: string; providerSlug: string }) {
  const supabase = await createClient();
  const { data: provider } = await supabase
    .from("providers")
    .select("name:business_name, city:City, state:State, id, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, hero_image, treatments, service_areas, is_confirmed_mobile")
    .eq("city_slug", city)
    .eq("provider_slug", providerSlug)
    .single();

  if (!provider) {
    notFound();
  }

  const p = provider as Provider;
  const treatments = p.treatments?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  const serviceAreas = (p.service_areas ?? "")
    .split(/[,;]/)
    .map((s) => {
      s = s.trim();
      const match = s.match(/\[([^\]]+)\]/);
      s = match ? match[1] : s;
      s = s.replace(/\(.*?\)/g, "").trim();
      return s;
    })
    .filter((s) => s && s.length > 1 && !s.includes("http") && !s.includes("://") && !/^[^\w\s-]/.test(s))
    .filter(Boolean);

  const location = [p.city, p.state].filter(Boolean).join(", ");
  const fullAddress = [p.city, p.state].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(p.name + (fullAddress ? `, ${fullAddress}` : ""));

  // Convert state name to slug
  const stateSlug = p.state?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "";
  const cityDisplay = p.city_slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const stateDisplay = p.state || "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MedicalBusiness"],
    "@id": `https://nearbyiv.com${p.seo_url_path}`,
    name: p.name,
    url: p.website ?? undefined,
    telephone: p.phone ?? undefined,
    priceRange: "$$",
    serviceType: "IV Therapy",
    areaServed: {
      "@type": "GeoShape",
      addressCountry: "US",
    },
    address: p.city
      ? {
          "@type": "PostalAddress",
          addressLocality: p.city,
          addressRegion: p.state ?? undefined,
          addressCountry: "US",
        }
      : undefined,
    aggregateRating:
      p.rating != null
        ? {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.reviews ?? 1,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    image: p.hero_image ?? undefined,
    description: `${p.name} provides mobile IV therapy in ${location || "your area"}.`,
    medicalSpecialty: "IV Therapy",
    knowsAbout: treatments.slice(0, 10),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://nearbyiv.com"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: stateDisplay,
        item: `https://nearbyiv.com/${stateSlug}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityDisplay,
        item: `https://nearbyiv.com/${stateSlug}/${p.city_slug}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: p.name,
        item: `https://nearbyiv.com${p.seo_url_path}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: stateDisplay, href: `/${stateSlug}` },
          { name: cityDisplay, href: `/${stateSlug}/${p.city_slug}` },
          { name: p.name },
        ]}
      />

      <div className="relative h-56 md:h-72 bg-gray-900">
        <img
          src={p.hero_image || "/iv-bag-default.jpg"}
          alt={p.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10">
          {p.is_confirmed_mobile && (
            <span className="inline-flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified Mobile
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center">
            {p.name}{p.city && p.state ? ` | Mobile IV in ${p.city}, ${p.state}` : ""}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About {p.name}{p.city ? ` — Mobile IV in ${p.city}` : ""}</h2>

              <div className="space-y-4 mb-8">
                {fullAddress && (
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">{fullAddress}</span>
                  </div>
                )}
                {p.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${p.phone}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {p.phone}
                    </a>
                  </div>
                )}
                {p.website && (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              <hr className="border-gray-200 mb-8" />

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Mobile IV Therapy Services</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {p.name} provides professional mobile IV therapy services in {location || "your area"}.
                  They bring IV treatments directly to your home, office, or hotel for maximum convenience.
                </p>
              </div>

              {serviceAreas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Service Areas</h3>
                  <ul className="space-y-2">
                    {serviceAreas.map((area) => (
                      <li key={area} className="flex items-center gap-2 text-gray-700">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-gray-600 leading-relaxed">
                Get in touch with {p.name} to book your mobile IV therapy appointment in {location || "your area"} today!
              </p>
            </div>
          </div>

          <div className="lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <iframe
                  title={`Map of ${p.name}`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
                <div className="space-y-3">
                  {location && (
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-gray-700">
                        {p.city && <div>{p.city}</div>}
                        {p.state && <div>{p.state}</div>}
                      </div>
                    </div>
                  )}
                  {p.phone && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${p.phone}`} className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
                        {p.phone}
                      </a>
                    </div>
                  )}
                  {p.website && (
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  )}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                      Visit Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProviderPage({
  params,
}: ProviderPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-4 pt-14">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </Link>
      </div>

      <Suspense
        fallback={
          <div>
            <div className="h-56 md:h-72 bg-gray-200 animate-pulse" />
            <div className="max-w-6xl mx-auto px-6 py-10">
              <div className="h-64 bg-white animate-pulse rounded-xl" />
            </div>
          </div>
        }
      >
        <ProfileContentWrapper params={params} />
      </Suspense>

      <footer className="border-t border-gray-200 py-8 mt-10">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

async function ProfileContentWrapper({
  params,
}: ProviderPageProps) {
  const { city, "provider-slug": providerSlug } = await params;
  return <ProfileContent city={city} providerSlug={providerSlug} />;
}
