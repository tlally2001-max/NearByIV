import Link from "next/link";
import { InteractiveMap } from "./interactive-map";
import { StateFilterDropdown } from "@/components/state-filter-dropdown";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";
import type { Metadata } from "next";

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "los angeles,ca": { lat: 34.0522, lng: -118.2437 },
  "los angeles,california": { lat: 34.0522, lng: -118.2437 },
  "new york,ny": { lat: 40.7128, lng: -74.006 },
  "new york,new york": { lat: 40.7128, lng: -74.006 },
  "chicago,il": { lat: 41.8781, lng: -87.6298 },
  "chicago,illinois": { lat: 41.8781, lng: -87.6298 },
  "houston,tx": { lat: 29.7604, lng: -95.3698 },
  "houston,texas": { lat: 29.7604, lng: -95.3698 },
  "phoenix,az": { lat: 33.4484, lng: -112.074 },
  "phoenix,arizona": { lat: 33.4484, lng: -112.074 },
  "philadelphia,pa": { lat: 39.9526, lng: -75.1652 },
  "philadelphia,pennsylvania": { lat: 39.9526, lng: -75.1652 },
  "san antonio,tx": { lat: 29.4241, lng: -98.4936 },
  "san antonio,texas": { lat: 29.4241, lng: -98.4936 },
  "san diego,ca": { lat: 32.7157, lng: -117.1611 },
  "san diego,california": { lat: 32.7157, lng: -117.1611 },
  "dallas,tx": { lat: 32.7767, lng: -96.797 },
  "dallas,texas": { lat: 32.7767, lng: -96.797 },
  "miami,fl": { lat: 25.7617, lng: -80.1918 },
  "miami,florida": { lat: 25.7617, lng: -80.1918 },
  "denver,co": { lat: 39.7392, lng: -104.9903 },
  "denver,colorado": { lat: 39.7392, lng: -104.9903 },
  "seattle,wa": { lat: 47.6062, lng: -122.3321 },
  "seattle,washington": { lat: 47.6062, lng: -122.3321 },
  "boston,ma": { lat: 42.3601, lng: -71.0589 },
  "boston,massachusetts": { lat: 42.3601, lng: -71.0589 },
  "glendale,ca": { lat: 34.1404, lng: -118.255 },
  "glendale,california": { lat: 34.1404, lng: -118.255 },
  "west hollywood,ca": { lat: 34.0901, lng: -118.3619 },
  "west hollywood,california": { lat: 34.0901, lng: -118.3619 },
  "lower manhattan,ny": { lat: 40.705, lng: -74.012 },
  "lower manhattan,new york": { lat: 40.705, lng: -74.012 },
  "hollywood,ca": { lat: 34.0901, lng: -118.3267 },
  "hollywood,california": { lat: 34.0901, lng: -118.3267 },
};

export const metadata: Metadata = {
  title: "NearbyIV — Find Mobile IV Therapy Providers Near You",
  description:
    "Search 134+ verified RN-led mobile IV therapy providers. Compare ratings, treatments, and pricing for concierge IV hydration, NAD+, GLP-1 weight loss, and more.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NearbyIV — Find Mobile IV Therapy Providers Near You",
    description:
      "Search 134+ verified RN-led mobile IV therapy providers. Compare ratings, treatments, and pricing.",
    url: "/",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "NearbyIV",
  url: "https://nearbyiv.com",
  description:
    "The most trusted directory of RN-led mobile IV therapy and metabolic care providers.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://nearbyiv.com/providers?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

async function MapSection() {
  const supabase = await createClient();
  const { data: providers } = await supabase
    .from("providers")
    .select("id, slug, name, city, state, rating, reviews")
    .eq("is_confirmed_mobile", true)
    .order("rating", { ascending: false });

  // Create coordinates using predefined list
  const coordinates = (providers ?? []).map((provider) => {
    const key = `${provider.city?.toLowerCase()},${provider.state?.toLowerCase()}`;
    const coords = CITY_COORDINATES[key];

    return {
      providerId: provider.id,
      lat: coords?.lat ?? 39,
      lng: coords?.lng ?? -98,
    };
  });

  return <InteractiveMap providers={providers ?? []} coordinates={coordinates} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight">
            Nearby<span style={{ color: "#0066FF" }}>IV</span>
            <span className="text-gray-400 font-normal text-sm">.com</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/providers" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors">
              Search Providers
            </Link>
            <Link href="/providers" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors">
              All Listings
            </Link>
            <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors">
              How It Works
            </Link>
            <Link
              href="/providers"
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#0066FF" }}
            >
              Find a Provider
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        className="relative pt-14 pb-0 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0f1e 0%, #0d1f44 50%, #0a2a6e 100%)",
          minHeight: "520px",
        }}
      >
        {/* Background dots */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff22 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-8 pb-10 text-center">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-300 mb-6">
            <span className="w-4 h-px bg-blue-400 inline-block" />
            Verified Concierge Medical Directory
            <span className="w-4 h-px bg-blue-400 inline-block" />
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Premium <span style={{ color: "#FFD700" }}>Mobile IV</span> &amp;
            <br />
            <span style={{ color: "#FFD700" }}>Hangover Relief</span> at Your Door
          </h1>

          <p className="mt-5 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            The most trusted directory of RN-led concierge medical services.
            <br className="hidden md:block" />
            Verified quality. Transparent pricing.
          </p>

          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { id: "hydration", label: "Hangover and Hydration 🧊" },
              { id: "longevity", label: "Longevity & NAD+ 🧬" },
              { id: "weightloss", label: "Weight Loss (GLP-1) ⚖️" },
            ].map((cat) => (
              <Link
                key={cat.id}
                href={`/providers?category=${cat.id}`}
                className="px-6 py-3 rounded-2xl text-sm font-semibold border transition-all duration-200 cursor-pointer backdrop-blur-md bg-white/20 text-white border-white/40 hover:bg-[#0066FF] hover:border-[#0066FF] hover:shadow-lg hover:shadow-blue-500/30"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Interactive Map with Provider Markers */}
          <div className="w-full mt-12">
            <div className="max-w-7xl mx-auto px-6">
              <Suspense
                fallback={
                  <div className="rounded-2xl border border-gray-200 shadow-sm bg-gray-50 animate-pulse" style={{ height: "500px" }} />
                }
              >
                <MapSection />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* ── The NearbyIV Standard (Premium Quality) ── */}
      <section id="how-it-works" className="py-12" style={{ background: "linear-gradient(135deg, #0f1e3e 0%, #1a2b4a 50%, #0f3a6e 100%)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-semibold uppercase tracking-widest text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #ffd700 0%, #4d94ff 100%)" }}>
              Platinum Quality Standard
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
              The NearByIV <span style={{ color: "#FFD700" }}>Gold</span> Standard
            </h2>
            <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
              Every provider is rigorously vetted across three pillars of excellence
            </p>
          </div>

          {/* Animated Verified Shield */}
          <div className="flex justify-center mb-16">
            <div
              className="relative animate-pulse"
              style={{
                animation: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite"
              }}
            >
              <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 1L3 5v7c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="absolute -inset-8 border-2 rounded-full opacity-30" style={{ borderColor: "#ffd700", animation: "spin 20s linear infinite" }} />
            </div>
          </div>

          {/* Vetting Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Active Teams On-Call",
                subtext: "Connect with verified clinicians currently available for mobile dispatch in your area.",
                icon: (
                  <svg className="w-14 h-14 text-[#4d94ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 2C8.44772 2 8 2.44772 8 3V4H6C4.89543 4 4 4.89543 4 6V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V6C20 4.89543 19.1046 4 18 4H16V3C16 2.44772 15.5523 2 15 2C14.4477 2 14 2.44772 14 3V4H10V3C10 2.44772 9.55228 2 9 2ZM6 8H18V20H6V8Z" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.6" />
                    <path d="M12 8C11.4477 8 11 8.44772 11 9V11H9C8.44772 11 8 11.4477 8 12C8 12.5523 8.44772 13 9 13H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V13H15C15.5523 13 16 12.5523 16 12C16 11.4477 15.5523 11 15 11H13V9C13 8.44772 12.5523 8 12 8Z" fill="currentColor" />
                  </svg>
                ),
                isLive: true,
                hasButton: true,
              },
              {
                title: "Peptides Delivered to Your Door",
                subtext: "Order high-purity NAD+, GLP-1, and BPC-157 delivered directly to your door for home research and optimization.",
                icon: (
                  <svg className="w-14 h-14 text-[#4d94ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 2h18a1 1 0 011 1v4H2V3a1 1 0 011-1zm0 7h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9zm6 3a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2z" />
                  </svg>
                ),
                badge: "10% OFF",
                hasButton: true,
                buttonText: "Shop Peptides",
                buttonHref: "https://apollopeptides.refersion.com/affiliate/registration",
                disclaimer: "Peptides are for research purposes only.",
              },
              {
                title: "Smart Booking & Inventory",
                subtext: "The all-in-one AI platform for mobile IV dispatch, automated medical ordering, and patient management.",
                icon: (
                  <svg className="w-14 h-14 text-[#4d94ff]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 11c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
                  </svg>
                ),
                badge: "COMING SOON",
                badgeColor: "indigo",
                hasButton: true,
                buttonText: "Join the Waitlist",
                buttonHref: "mailto:hello@nearbyiv.com",
                isOutlineButton: true,
              },
            ].map((pillar, index) => (
              <div
                key={pillar.title}
                className={`relative border rounded-2xl p-8 transition-all duration-300 group flex flex-col overflow-visible bg-white`}
                style={{
                  borderColor: "#0066FF"
                }}
              >
                {/* Gold accent line on hover */}
                <div className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ borderColor: "#ffd700" }} />

                <div className="relative z-10 flex-1 text-center">
                  <div className="mb-4">
                    {typeof pillar.icon === 'string' ? (
                      <div className="text-5xl">{pillar.icon}</div>
                    ) : (
                      <div>{pillar.icon}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-1 justify-center">
                    <h3 className="text-xl font-bold text-gray-900">{pillar.title}</h3>
                    {pillar.isLive && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 border border-green-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-flash" />
                        <span className="text-xs font-semibold text-green-700">Live</span>
                      </span>
                    )}
                    {pillar.badge && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        pillar.badgeColor === 'indigo'
                          ? 'bg-indigo-100 border border-indigo-500 text-indigo-700'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}>
                        {pillar.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold mb-4 text-gray-600">
                    {pillar.subtext}
                  </p>
                </div>

                {/* State Filter for Active Teams On-Call */}
                {index === 0 && (
                  <div className="mt-4 flex justify-center">
                    <StateFilterDropdown />
                  </div>
                )}

                {pillar.hasButton && (
                  <div className="relative z-10 mt-6 pt-6 border-t border-gray-200 flex flex-col gap-3 items-center">
                    {pillar.buttonHref ? (
                      <a
                        href={pillar.buttonHref}
                        target={pillar.buttonHref.startsWith('mailto:') ? undefined : "_blank"}
                        rel={pillar.buttonHref.startsWith('mailto:') ? undefined : "noopener noreferrer"}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                          pillar.isOutlineButton
                            ? 'border-2 border-[#0066FF] text-[#0066FF] hover:bg-[#0066FF]/10'
                            : 'bg-[#0066FF] hover:bg-blue-700 text-white'
                        }`}
                      >
                        {pillar.buttonText || "Action"}
                      </a>
                    ) : (
                      <div className="group/tooltip relative inline-block">
                        <button
                          disabled
                          className="px-4 py-2 border-2 border-[#0066FF] text-[#0066FF] text-sm font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-not-allowed"
                        >
                          {pillar.buttonText || "Coming Soon"}
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Coming Soon
                        </div>
                      </div>
                    )}
                    {pillar.disclaimer && (
                      <p className="text-gray-400 text-xs leading-tight text-center">
                        {pillar.disclaimer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes flash {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .animate-flash {
            animation: flash 0.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-gray-500 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-white font-semibold">NearbyIV.com</span>
            <span className="text-gray-600"> — Mobile IV & Metabolic Care Directory</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <p className="text-xs text-gray-700">&copy; 2026 NearbyIV.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
