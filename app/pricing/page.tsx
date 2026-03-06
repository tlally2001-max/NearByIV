import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: { absolute: "Pricing | List Your IV Business | NearbyIV" },
  description:
    "Simple, transparent pricing plans for IV therapy providers. Get found by more customers on the fastest-growing IV therapy directory.",
  alternates: { canonical: "https://nearbyiv.com/pricing" },
  openGraph: {
    title: "Pricing | List Your IV Business | NearbyIV",
    description:
      "Simple, transparent pricing plans for IV therapy providers. Get found by more customers on the fastest-growing IV therapy directory.",
    url: "https://nearbyiv.com/pricing",
    type: "website",
  },
};

const pricingTiers = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    cta: "Get Started",
    ctaHref: "#",
    features: [
      "Basic business listing",
      "Business name & location",
      "Contact form",
      "Up to 1 service area",
      "Listed on directory",
    ],
    highlighted: false,
  },
  {
    name: "Starter",
    price: 49,
    description: "For growing practices",
    cta: "Start Free Trial",
    ctaHref: "#",
    features: [
      "All Free features",
      "Featured listing",
      "Phone number displayed",
      "Website link",
      "Basic analytics",
      "Up to 3 service areas",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Professional",
    price: 99,
    description: "Most popular",
    cta: "Start Free Trial",
    ctaHref: "#",
    features: [
      "All Starter features",
      "Verified badge",
      "Top search placement",
      "Custom bio section",
      "Service menu highlights",
      "Up to 10 service areas",
      "Priority email support",
      "Advanced analytics",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 149,
    description: "For established practices",
    cta: "Start Free Trial",
    ctaHref: "#",
    features: [
      "All Professional features",
      "Multiple location listings (up to 3)",
      "Featured homepage placement",
      "Unlimited service areas",
      "Phone support",
      "Working hours management",
      "Custom branding options",
      "Monthly reports",
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Can I change my plan anytime?",
    answer:
      "Yes! You can upgrade, downgrade, or cancel your plan anytime. If you upgrade mid-month, we'll prorate the charges. If you downgrade, we'll credit the difference to your next billing cycle.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No setup fees! You can be up and running immediately. Free plans are activated within 24 hours, and paid plans are typically activated instantly.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through Stripe. Billing is handled securely and automatically each month.",
  },
  {
    question: "Do you offer annual discounts?",
    answer:
      "Yes! Pay annually and save 20% compared to monthly billing. Contact our sales team for annual pricing details.",
  },
  {
    question: "What if I want to cancel?",
    answer:
      "You can cancel anytime with no long-term contracts or cancellation fees. Your listing remains active through the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Pricing" }]} />

      {/* Hero */}
      <header className="bg-white border-b border-gray-100 pt-14">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Get found by more customers. Every plan includes a listing on the fastest-growing IV therapy directory in the US.
          </p>
        </div>
      </header>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl transition-all ${
                tier.highlighted
                  ? "ring-2 ring-blue-600 shadow-xl scale-105"
                  : "border border-gray-200 shadow-sm"
              } ${tier.highlighted ? "bg-white" : "bg-white"}`}
            >
              {tier.highlighted && (
                <div className="bg-blue-600 text-white text-center text-sm font-semibold py-2">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{tier.description}</p>

                <div className="mt-6 mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-gray-900">
                      {tier.price === 0 ? "Free" : `$${tier.price}`}
                    </span>
                    {tier.price > 0 && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                </div>

                <a
                  href={tier.ctaHref}
                  className={`block w-full py-3 px-4 rounded-lg font-semibold text-center transition-colors mb-8 ${
                    tier.highlighted
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {tier.cta}
                </a>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-green-500 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 border-t border-gray-200 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get found by more customers?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of IV therapy providers on NearbyIV.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Start Your Free Listing
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <p className="text-center text-sm text-gray-400">
          &copy; 2026 NearbyIV.com. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
