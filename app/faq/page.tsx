import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "FAQ | Mobile IV Therapy | NearbyIV" },
  description:
    "Frequently asked questions about mobile IV therapy, hangover IVs, pricing, safety, and our booking process.",
  alternates: { canonical: "https://nearbyiv.com/faq" },
  openGraph: {
    title: "FAQ | Mobile IV Therapy | NearbyIV",
    description:
      "Frequently asked questions about mobile IV therapy, hangover IVs, pricing, safety, and our booking process.",
    url: "https://nearbyiv.com/faq",
    type: "website",
  },
};

const faqs = [
  {
    category: "Understanding Mobile IV Therapy for Hangovers",
    items: [
      {
        q: "What is a \"hangover IV\" and how does it assist with relief?",
        a: "A hangover IV is a targeted therapy designed to combat primary causes of hangovers, such as dehydration and nutrient depletion. Licensed medical professionals administer a saline solution containing essential fluids, electrolytes, and vitamins directly into the bloodstream. This method bypasses the digestive system for potentially faster rehydration compared to drinking fluids alone.",
      },
      {
        q: "How quickly are effects typically felt?",
        a: "While individual responses vary, many recipients report feeling noticeable relief within 30 to 60 minutes of the infusion starting. The direct delivery of nutrients aims to quickly alleviate common symptoms like headaches, nausea, and fatigue.",
      },
      {
        q: "What ingredients are typically included in a hangover IV drip?",
        a: "Standard IV packages for hangovers generally include a combination of: IV Fluids & Electrolytes (for rapid rehydration), Vitamin B Complex (to help replenish depleted energy stores), and Optional Medications (depending on the provider's protocols and client assessment, anti-nausea or anti-inflammatory medications may be added).",
      },
    ],
  },
  {
    category: "How Mobile IV Services Work",
    items: [
      {
        q: "What does \"mobile service\" mean?",
        a: "Mobile IV therapy means that medical professionals travel to the client's location instead of requiring a clinic visit. Treatments are typically delivered in homes, hotel rooms, or offices. Providers bring the necessary equipment to ensure a sanitary experience.",
      },
      {
        q: "How long does an appointment typically take?",
        a: "The entire appointment usually lasts between 45 and 60 minutes. This timeframe generally includes a brief medical consultation and checking of vitals, followed by the 30-45 minute IV infusion.",
      },
      {
        q: "How soon can a provider typically arrive?",
        a: "Response times depend entirely on the specific provider chosen and their current availability in that geographic area. Many mobile services aim for arrival times within 1-2 hours of booking, though booking in advance is often recommended for busy times like weekends or holidays.",
      },
    ],
  },
  {
    category: "Safety & Medical Considerations",
    items: [
      {
        q: "Is IV therapy safe, and who administers the treatment?",
        a: "When administered by professionals, IV therapy is generally considered safe for most healthy individuals. Mobile IV treatments should be administered by licensed Registered Nurses (RNs) or paramedics operating under strict medical protocols and the supervision of that provider's Medical Director.",
      },
      {
        q: "Are medical consultations required before receiving an IV?",
        a: "Yes. Reputable mobile IV services require a health assessment or brief consultation before administering treatment to ensure safety and appropriateness for the client's specific condition.",
      },
      {
        q: "Are there conditions that prevent someone from receiving IV therapy?",
        a: "Yes. Individuals with certain medical histories, particularly congestive heart failure or kidney disease, may not be eligible for IV fluid therapy due to the risk of fluid overload. Accurate disclosure of medical history to the provider before treatment is essential.",
      },
    ],
  },
  {
    category: "Cost & Payment Information",
    items: [
      {
        q: "How much does a mobile hangover IV typically cost?",
        a: "Pricing varies significantly based on the independent provider, geographic location, and the specific ingredients chosen. Basic rehydration drips have a lower starting point, while comprehensive packages that include medications and extra vitamins will range higher.",
      },
      {
        q: "Do mobile IV providers usually accept insurance?",
        a: "Generally, most mobile IV services operate as direct-pay businesses and do not accept private health insurance. However, many providers are able to accept payments via Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA) cards. Clients should verify payment options directly with their chosen provider.",
      },
      {
        q: "Is tipping customary for mobile IV services?",
        a: "While policies vary by individual provider, gratuity for the nurse or paramedic administering the mobile treatment is common practice within the industry and is generally appreciated.",
      },
    ],
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Nav */}
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "FAQ" }]} />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about mobile IV therapy and our services
          </p>
        </div>
      </header>

      {/* FAQ Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {faqs.map((section) => (
          <section key={section.category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-[#0066FF]">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                    <span className="text-[#0066FF] font-bold mt-1">Q:</span>
                    {item.q}
                  </h3>
                  <p className="text-gray-700 leading-relaxed flex items-start gap-3">
                    <span className="text-[#0066FF] font-bold mt-1">A:</span>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-[#0066FF] to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Reach out to our team or find a provider near you to learn more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:NearByIV@gmail.com"
              className="px-8 py-3 bg-white text-[#0066FF] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <Link
              href="/providers"
              className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Find a Provider
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
