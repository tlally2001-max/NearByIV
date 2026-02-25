import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: { absolute: "FAQ | Mobile IV Therapy | NearbyIV" },
  description:
    "Frequently asked questions about mobile IV therapy, hangover IVs, pricing, safety, and our booking process.",
  alternates: { canonical: "/faq" },
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
    category: "The Basics: What is it & How does it work?",
    items: [
      {
        q: "What is a 'hangover IV' and how does it help?",
        a: "A hangover IV is a targeted therapy designed to combat the primary causes of a hangover: dehydration and nutrient depletion. Our nurses administer a saline solution containing a blend of essential fluids, electrolytes, vitamins (like B-complex), and optional medications directly into your bloodstream. This bypasses the digestive system for faster, more effective rehydration and symptom relief compared to drinking water alone.",
      },
      {
        q: "Does it really work, and how fast will I feel better?",
        a: "While everyone's body is different, most clients report feeling noticeable relief within 30 to 60 minutes of the treatment starting. The direct delivery of fluids and nutrients helps to quickly alleviate common symptoms like headaches, nausea, fatigue, and brain fog, helping you get back to your day faster.",
      },
      {
        q: "What ingredients are typically in a hangover drip?",
        a: "Our standard hangover package typically includes: IV Fluids & Electrolytes (for rapid rehydration), Vitamin B Complex (to boost energy and replenish depleted nutrients), Anti-Nausea Medication (optional, to settle your stomach), and Anti-Inflammatory/Pain Relief Medication (optional, to help with headaches and body aches). Specific ingredients can be tailored to your needs during your consultation.",
      },
    ],
  },
  {
    category: "The Process: Mobile Service & Booking",
    items: [
      {
        q: "How does the mobile service work? Do I have to go to a clinic?",
        a: "No need to travel when you're not feeling well. We come to you! Our licensed medical professionals will deliver the treatment in the comfort of your home, hotel room, or office. We bring all necessary equipment to ensure a safe and sanitary experience.",
      },
      {
        q: "How long does the entire appointment take?",
        a: "The entire process typically takes about 45 to 60 minutes. This includes a brief medical consultation with our nurse to check your vitals and medical history, followed by the 30-45 minute IV infusion itself.",
      },
      {
        q: "How soon can a nurse get to me?",
        a: "We strive for the fastest response times possible. Depending on your location and nurse availability, we can often have someone to your door within 1-2 hours of booking. We recommend booking as early as possible, especially on busy weekends.",
      },
    ],
  },
  {
    category: "Safety & Medical Questions",
    items: [
      {
        q: "Is IV therapy safe? Who administers the drip?",
        a: "Yes, it is generally considered very safe for most healthy individuals. All treatments are administered by licensed and experienced Registered Nurses (RNs) or paramedics operating under strict medical protocols and the supervision of a Medical Director. Before any treatment, a brief health assessment is conducted to ensure it is safe for you.",
      },
      {
        q: "Does getting an IV hurt?",
        a: "Most people feel only a quick, small pinch when the needle is first inserted. Once the thin plastic catheter is in place, the needle is removed, and the infusion itself is painless. Our nurses are highly skilled at making the process as comfortable as possible.",
      },
      {
        q: "Are there anyone who shouldn't get an IV?",
        a: "While safe for most, individuals with certain medical conditions like congestive heart failure or kidney disease may not be eligible for IV fluid therapy due to the risk of fluid overload. This is why we conduct a mandatory health screening before every appointment. Please be honest about your medical history with your nurse.",
      },
    ],
  },
  {
    category: "Cost & Payment",
    items: [
      {
        q: "How much does a mobile hangover IV cost?",
        a: "Our packages start at roughly $200 for a basic rehydration drip, with our comprehensive hangover packages typically ranging from $250-$400. The final price depends on any add-ons or customizations you choose. We believe in transparent pricing with no hidden travel fees.",
      },
      {
        q: "Do you accept insurance?",
        a: "We do not accept private health insurance. We are a direct-pay service. However, we do accept payments via Health Savings Accounts (HSA) and Flexible Spending Accounts (FSA) cards, in addition to all major credit cards.",
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
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
            Nearby<span className="text-[#0066FF]">IV</span>
            <span className="text-gray-400 font-normal">.com</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/providers" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">
              Find Providers
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors">
              How It Works
            </Link>
            <Link href="/faq" className="text-sm font-medium text-[#0066FF]">
              FAQ
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
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
              href="mailto:hello@nearbyiv.com"
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
