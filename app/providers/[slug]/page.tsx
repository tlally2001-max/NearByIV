import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { ContactSidebar } from "./contact-sidebar";
import { ServiceMenu } from "./service-menu";

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

/* ── Pre-generate all provider pages at build time ── */
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=slug&order=slug.asc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
        },
      }
    );

    if (!response.ok) return [];

    const providers: Array<{ slug: string }> = await response.json();
    return providers.map((provider) => ({
      slug: provider.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

/* ── SEO Metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("providers")
    .select("name, city, state, treatments")
    .eq("slug", slug)
    .single();

  if (!data) {
    return { title: "Provider Not Found | NearbyIV" };
  }

  const location = [data.city, data.state].filter(Boolean).join(", ");
  return {
    title: `${data.name} — Mobile IV in ${location || "Your Area"} | NearbyIV`,
    description: `Book mobile IV therapy with ${data.name} in ${location}. Treatments include ${data.treatments?.split(",").slice(0, 5).join(", ") || "hydration, wellness, and more"}.`,
  };
}

/* ── Profile Content (async server component) ── */
async function ProfileContent({ slug }: { slug: string }) {
  const supabase = await createClient();
  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!provider) {
    notFound();
  }

  const p = provider as Provider;
  const treatments = p.treatments?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  // Parse service areas - extract clean city/area names only
  const serviceAreas = (p.service_areas ?? "")
    .split(/[,;]/)
    .map((s) => {
      s = s.trim();
      // Remove markdown link syntax: [Text](URL) -> Text
      const match = s.match(/\[([^\]]+)\]/);
      s = match ? match[1] : s;
      // Remove anything that looks like a URL or contains special characters
      s = s.replace(/\(.*?\)/g, "").trim();
      return s;
    })
    .filter((s) => s && s.length > 1 && !s.includes("http") && !s.includes("://") && !/^[^\w\s-]/.test(s))
    .filter(Boolean);

  const location = [p.city, p.state].filter(Boolean).join(", ");
  const fullAddress = [p.city, p.state].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(p.name + (fullAddress ? `, ${fullAddress}` : ""));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://nearbyiv.com/providers/${p.slug}`,
    name: p.name,
    url: p.website ?? undefined,
    telephone: p.phone ?? undefined,
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
    description: `${p.name} provides mobile IV therapy in ${location || "your area"}. Treatments include ${treatments.slice(0, 5).join(", ")}.`,
    hasOfferCatalog:
      treatments.length > 0
        ? {
            "@type": "OfferCatalog",
            name: "IV Therapy Treatments",
            itemListElement: treatments.map((t) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: t },
            })),
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── Hero Banner ── */}
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
            {p.name}
          </h1>
          {p.rating != null && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(p.rating!) ? "text-yellow-400" : "text-gray-500"} fill-current`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white font-semibold">{p.rating.toFixed(1)}</span>
                {p.reviews != null && (
                  <span className="text-white/60 text-sm">({p.reviews} reviews)</span>
                )}
              </div>
              <button
                disabled
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-colors cursor-not-allowed opacity-90"
              >
                BOOK NOW
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Service Banner ── */}
      <div className="bg-green-50 border-t border-green-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-900">100% Mobile Service</h3>
              <p className="text-sm text-green-700">{p.name} comes directly to you — home, office, or hotel. No clinic visits needed.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content: About + Sidebar ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: About Section */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>

              {/* Contact Details */}
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

              {/* Services Description */}
              {treatments.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Mobile IV Therapy Services
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {p.name} provides professional mobile IV therapy services in {location || "your area"}.
                    They offer a wide range of IV treatments delivered directly to your home, office, or hotel
                    for maximum convenience and comfort.
                  </p>

                  {/* Service Menu Cards */}
                  <div className="mb-8">
                    <ServiceMenu treatments={p.treatments ?? ""} />
                  </div>
                </div>
              )}

              {/* Service Areas */}
              {serviceAreas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Service Areas
                  </h3>
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

              {/* Closing CTA */}
              <p className="text-gray-600 leading-relaxed">
                Get in touch with {p.name} to book the best mobile IV therapy
                in {location || "your area"} today!
              </p>
            </div>
          </div>

          {/* Right: Map + Contact Info */}
          <div className="lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <ContactSidebar
                name={p.name}
                city={p.city}
                state={p.state}
                phone={p.phone}
                website={p.website}
                mapQuery={mapQuery}
              />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

/* ── Page Component ── */
export default function ProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Nearby<span className="text-blue-600">IV</span>
            <span className="text-gray-400 font-normal">.com</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/providers"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              All Providers
            </Link>
          </div>
        </div>
      </nav>

      {/* Back to search */}
      <div className="max-w-6xl mx-auto px-6 py-4">
        <Link
          href="/providers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Search
        </Link>
      </div>

      {/* Profile */}
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

      {/* Footer */}
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProfileContent slug={slug} />;
}
