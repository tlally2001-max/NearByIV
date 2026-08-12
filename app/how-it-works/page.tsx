import Link from "next/link";
import type { Metadata } from "next";
import { Droplet, Shield, Zap, Brain, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "How It Works — Your Path to Feeling Unstoppable",
  description:
    "Learn how mobile IV services work, what to ask providers, and how NearbyIV reviews directory listings.",
  alternates: { canonical: "https://nearbyiv.com/how-it-works" },
  openGraph: {
    title: "How Mobile IV Therapy Works | NearbyIV",
    description: "Learn how mobile IV services work, what to ask providers, and how NearbyIV reviews directory listings.",
    url: "https://nearbyiv.com/how-it-works",
    type: "website",
  },
};

export default function HowItWorks() {
  const benefits = [
    {
      title: "Clinical Rehydration",
      description:
        "IV fluids deliver hydration directly into the bloodstream. Whether treatment is appropriate, and how it compares with oral fluids, depends on an individual clinical assessment.",
      icon: Droplet,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Discuss Vitamin Options",
      description:
        "Some providers offer vitamin-containing infusions. Evidence and risks vary by ingredient, dose, and health history, so claims and options should be reviewed with a licensed clinician.",
      icon: Shield,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Recover Like an Athlete",
      description:
        "Some people seek IV services after exertion. A clinician should evaluate symptoms and explain when rest, oral hydration, or medical care is more appropriate.",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Sharpen Your Mind",
      description:
        "Fatigue or difficulty concentrating can have many causes. IV therapy is not proven to improve memory or focus in otherwise healthy people; persistent symptoms need medical evaluation.",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Glow from Within",
      description:
        "Cosmetic benefits from IV vitamins are not established. Ask a qualified clinician about evidence, possible side effects, and alternatives before treatment.",
      icon: Sparkles,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <Header />

      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "How It Works" }]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-12 md:py-16 px-6 pt-14">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
            Your Answer to Feeling{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-blue-600">
              Unstoppable
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
            Learn about IV services for life&apos;s demands. Your body
            needs it.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            IV Therapy can transform how you feel and help you:
          </p>

          {/* Embedded YouTube Video */}
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/O56ZQZjg8yY"
                title="IV Therapy Benefits"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefit Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl border-2 ${benefit.borderColor} ${benefit.bgColor} p-8 transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4">
                    <IconComponent
                      className={`w-12 h-12 ${benefit.color}`}
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Feel the Difference?
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Review local IV therapy listings and confirm clinician credentials
            in your area today. Premium care delivered to your door.
          </p>
          <Link
            href="/locations"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold text-lg rounded-lg transition-colors shadow-lg"
          >
            Find Your IV Provider
          </Link>
        </div>
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
