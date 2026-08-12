import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "Provider Verification Methodology | NearbyIV" },
  description: "How NearbyIV sources, reviews, labels, updates, corrects, and removes mobile IV therapy directory listings.",
  alternates: { canonical: "https://nearbyiv.com/verification" },
  openGraph: {
    title: "Provider Verification Methodology | NearbyIV",
    description: "A public explanation of NearbyIV provider sourcing, review labels, evidence, updates, corrections, and removals.",
    url: "https://nearbyiv.com/verification",
    type: "article",
  },
};

const stages = [
  ["Listed", "A business record has been added from public business information or a provider submission. This label alone does not confirm mobile service, clinical staffing, licensure, or medical oversight."],
  ["Reviewed", "NearbyIV checks that the business appears relevant to IV therapy or a related clinical service, has usable location information, and is not an unrelated entity or landmark."],
  ["Mobile confirmed", "Available public evidence indicates the business advertises mobile or concierge service. This does not mean NearbyIV independently verified every clinician, treatment, price, availability claim, or license."],
];

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Verification Methodology" }]} />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-24">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Directory trust standard</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950">How NearbyIV reviews provider listings</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">NearbyIV is an independent directory, not a medical provider, licensing board, accreditor, or guarantor. This page defines exactly what our labels mean and what users should verify directly.</p>
          <p className="mt-3 text-sm text-gray-500">Methodology last updated: August 12, 2026</p>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {stages.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-950">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{description}</p>
            </article>
          ))}
        </section>

        <div className="mt-10 space-y-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <section>
            <h2 className="text-2xl font-bold text-gray-950">Evidence we use</h2>
            <p className="mt-3 text-gray-600">Evidence may include the provider&apos;s website, public business listings, service menus, booking pages, location information, and information submitted by the provider. Profiles identify the available source and review date. Missing evidence is shown as unavailable rather than inferred.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-950">Clinical and licensing boundaries</h2>
            <p className="mt-3 text-gray-600">A directory review does not replace checking professional licenses, medical-director oversight, insurance, treatment eligibility, or current disciplinary history. Users should ask the provider who will administer treatment and verify credentials with the applicable state licensing authority.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-gray-950">Review frequency and removal</h2>
            <p className="mt-3 text-gray-600">Listings are rechecked when material changes, corrections, or credible reports are received and during periodic directory-quality reviews. Records that are unrelated, misleading, closed, duplicated, or lack sufficient evidence may be corrected, relabeled, hidden, or removed.</p>
          </section>
          <section id="corrections">
            <h2 className="text-2xl font-bold text-gray-950">Corrections and disputes</h2>
            <p className="mt-3 text-gray-600">Providers and users can report inaccurate information, request a correction, or dispute a label. Include the listing URL, the information at issue, and supporting evidence.</p>
            <a href="mailto:NearByIV@gmail.com?subject=Provider%20listing%20correction" className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Report or correct a listing</a>
          </section>
        </div>

        <p className="mt-8 text-sm text-gray-500">For general medical-information boundaries, see our <Link href="/terms" className="text-blue-600 underline">Terms of Service</Link>.</p>
      </main>
    </div>
  );
}
