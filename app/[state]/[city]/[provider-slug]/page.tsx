import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { isValidatedProvider } from "@/lib/directory-validation";

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
  personalized_bio: string | null;
  menu_highlights: Array<{ service: string; price: string }> | null;
  working_hours: string | null;
  medical_staff_type: string | null;
  verification_status: string | null;
  last_verified_at: string | null;
  verification_source: string | null;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/providers?select=state:State,city_slug,provider_slug&city_slug=not.is.null&provider_slug=not.is.null&order=city_slug.asc`,
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
    .select("name:business_name, city:City, state:State, treatments, is_confirmed_mobile, personalized_bio, service_areas")
    .eq("city_slug", city)
    .eq("provider_slug", providerSlug)
    .single();

  if (!data || !isValidatedProvider(data)) {
    return { title: "Provider Not Found | NearbyIV", robots: { index: false, follow: false } };
  }

  const location = [data.city, data.state].filter(Boolean).join(", ");
  const title = `${data.name} | IV Therapy in ${location} | NearbyIV`;
  return {
    title: { absolute: title },
    description: `Book IV therapy with ${data.name} in ${location}. Professional IV therapy services in ${location}.`,
    alternates: { canonical: `https://nearbyiv.com/${(data.state || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}/${city}/${providerSlug}` },
  };
}

async function ProfileContent({ city, providerSlug }: { city: string; providerSlug: string }) {
  const supabase = await createClient();
  const { data: provider } = await supabase
    .from("providers")
    .select("name:business_name, city:City, state:State, id, slug, city_slug, provider_slug, seo_url_path, website, phone, rating, reviews, hero_image, treatments, service_areas, is_confirmed_mobile, personalized_bio, menu_highlights, working_hours, medical_staff_type, verification_status, last_verified_at, verification_source")
    .eq("city_slug", city)
    .eq("provider_slug", providerSlug)
    .single();

  if (!provider || !isValidatedProvider(provider)) {
    notFound();
  }

  const p = provider as Provider;
  const treatments = p.treatments?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  let serviceAreas: string[] = [];
  try {
    // Try parsing as JSON first
    if (p.service_areas) {
      const parsed = JSON.parse(p.service_areas);
      if (Array.isArray(parsed)) {
        serviceAreas = parsed.filter((s) => s && typeof s === "string" && s.length > 1);
      }
    }
  } catch {
    // Fallback to split parsing
    serviceAreas = (p.service_areas ?? "")
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
  }

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
    "@id": `https://nearbyiv.com/${stateSlug}/${p.city_slug}/${p.provider_slug}`,
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
        item: `https://nearbyiv.com/${stateSlug}/${p.city_slug}/${p.provider_slug}`
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

      <div className="max-w-6xl mx-auto px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_24px_80px_-32px_rgba(37,99,235,0.35)]">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-cyan-100/60 blur-3xl" />
        <div className="relative grid min-h-[420px] items-stretch lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center md:p-12 lg:p-14">
          {p.is_confirmed_mobile && (
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Mobile service reviewed
            </span>
          )}
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-slate-950 md:text-6xl">
            {p.name}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">Mobile IV therapy and wellness services in {location || "your area"}.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-sm">
            {location && <span className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm">{location}</span>}
            {p.rating != null && <span className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 font-semibold text-amber-800 shadow-sm">★ {p.rating.toFixed(1)}{p.reviews ? ` · ${p.reviews} reviews` : ""}</span>}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl">Visit provider website</a>}
            {p.phone && <a href={`tel:${p.phone}`} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700">Call provider</a>}
          </div>
        </div>
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 lg:m-5 lg:ml-0 lg:min-h-0 lg:rounded-[1.5rem] lg:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-300/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="relative w-full max-w-md overflow-hidden rounded-[1.6rem] border border-blue-100 bg-white shadow-[0_24px_70px_-28px_rgba(37,99,235,0.38)]" aria-label="NearbyIV assistant preview">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-cyan-500 text-sm font-black text-white">N</span>
                <div>
                  <p className="text-sm font-bold text-slate-950">NearbyIV Assistant</p>
                  <p className="flex items-center gap-1.5 text-xs text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Ready to help</p>
                </div>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">AI preview</span>
            </div>
            <div className="space-y-4 bg-slate-50/70 p-5">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-blue-700 px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
                What services does {p.name} offer?
              </div>
              <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm">
                <p className="font-semibold text-slate-950">Here’s what I found:</p>
                <p className="mt-1.5">
                  {p.menu_highlights?.slice(0, 3).map((item) => item.service).join(", ") || "IV therapy and wellness services"}
                  {p.menu_highlights && p.menu_highlights.length > 3 ? ", and more." : "."}
                </p>
                <p className="mt-2 text-xs text-slate-500">Always confirm services and eligibility directly with the provider.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-100 bg-white p-4">
              <span className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-400">Ask about this provider…</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white shadow-md shadow-blue-200" aria-hidden="true">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 5.153a1.75 1.75 0 001.194 1.194L9.25 10.75l-4.363 1.164a1.75 1.75 0 00-1.194 1.194L2.279 18.26a.75.75 0 00.95.826l15-5.25a.75.75 0 000-1.414l-15-5.25z" /></svg>
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-3xl shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] border border-slate-200/80 p-7 md:p-10">

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Provider overview</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">About {p.name}</h2>
                {p.personalized_bio ? (
                  <p className="mt-5 text-[17px] text-slate-600 leading-8 whitespace-pre-wrap">
                    {p.personalized_bio}
                  </p>
                ) : (
                  <p className="mt-5 text-[17px] text-slate-600 mb-6 leading-8">
                    {p.name} provides professional mobile IV therapy services in {location || "your area"}.
                    They bring IV treatments directly to your home, office, or hotel for maximum convenience.
                  </p>
                )}
              </div>

              {serviceAreas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-950 mb-4">Service Areas</h3>
                  <ul className="space-y-2">
                    {serviceAreas.map((area) => (
                      <li key={area} className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-slate-700">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {p.menu_highlights && Array.isArray(p.menu_highlights) && p.menu_highlights.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-950 mb-4">Services Offered</h3>
                  <ul className="grid gap-3 sm:grid-cols-2" aria-label="Services offered">
                    {p.menu_highlights.map((item, index) => (
                      <li
                        key={`${item.service}-${index}`}
                        className="flex min-h-14 items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/70 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700" aria-hidden="true">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.704 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.296-7.293a1 1 0 011.408 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span>{item.service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="mt-8 rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-blue-50 p-5 font-medium text-slate-800 leading-relaxed">
                Get in touch with {p.name} to book your mobile IV therapy appointment in {location || "your area"} today!
              </p>
            </div>
          </div>

          <div className="lg:w-[380px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
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

              <div className="bg-white rounded-3xl shadow-[0_20px_55px_-32px_rgba(79,70,229,0.35)] border border-violet-100 p-7">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">Connect directly</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950 mb-5">Contact provider</h2>
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
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                      <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {p.working_hours && (() => {
                    let hours: Record<string, string[]> = {};
                    try {
                      hours = JSON.parse(p.working_hours);
                    } catch {
                      // If not valid JSON, display as is
                      return (
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="text-sm text-gray-700">{p.working_hours}</div>
                        </div>
                      );
                    }

                    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                    const sortedDays = dayOrder.filter(day => hours[day]);

                    return (
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm w-full">
                          <table className="w-full">
                            <tbody>
                              {sortedDays.map((day) => (
                                <tr key={day} className="border-b border-gray-200 last:border-b-0">
                                  <td className="py-2 pr-4 font-medium text-gray-700">{day}</td>
                                  <td className="py-2 text-gray-700 text-right">
                                    {hours[day]?.[0] === "Closed" ? (
                                      <span className="text-red-600 font-medium">Closed</span>
                                    ) : (
                                      <span>{hours[day]?.[0]}</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="mt-6 space-y-3">
                  {p.phone && (
                    <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:border-violet-300 hover:text-violet-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Now
                    </a>
                  )}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl">
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

        <section className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="verification-evidence">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-400" />
          <div className="p-7 md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Transparency record</p><h2 id="verification-evidence" className="mt-2 text-2xl font-bold text-slate-950">Directory review evidence</h2></div>
            <Link href="/verification" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">What this label means</Link>
          </div>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="font-semibold text-slate-500">Review status</dt><dd className="mt-2 font-medium leading-relaxed text-slate-900">{p.verification_status === "mobile_confirmed" ? "Mobile service confirmed from published evidence" : "Directory listing reviewed"}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="font-semibold text-slate-500">Last reviewed</dt><dd className="mt-2 font-medium text-slate-900">{p.last_verified_at ? new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(p.last_verified_at)) : "Not yet published"}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="font-semibold text-slate-500">Evidence source</dt><dd className="mt-2 font-medium leading-relaxed text-slate-900">{p.verification_source || "Not yet published"}</dd></div>
            <div className="rounded-2xl bg-slate-50 p-4"><dt className="font-semibold text-slate-500">Clinician information</dt><dd className="mt-2 font-medium text-slate-900">{p.medical_staff_type || "Confirm directly with the provider"}</dd></div>
          </dl>
          <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-xs leading-relaxed text-slate-500">NearbyIV does not guarantee licensure, medical-director oversight, pricing, or current availability. Verify credentials and treatment eligibility directly.</p>
            <a href={`mailto:NearByIV@gmail.com?subject=${encodeURIComponent(`Correction for ${p.name}`)}&body=${encodeURIComponent(`Listing: https://nearbyiv.com/${stateSlug}/${p.city_slug}/${p.provider_slug}\n\nCorrection details:`)}`} className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-700">Report an error</a>
          </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default function ProviderPage({
  params,
}: ProviderPageProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.45),_transparent_28%),linear-gradient(to_bottom,_#f8fbff,_#f8fafc_45%,_#ffffff)]">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-4 pt-14">
        <ProfileContentBackButton params={params} />
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

async function ProfileContentBackButton({
  params,
}: ProviderPageProps) {
  const { state, city } = await params;
  return (
    <Link
      href={`/${state}/${city}`}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to City
    </Link>
  );
}
