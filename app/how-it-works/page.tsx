import Link from "next/link";
import type { Metadata } from "next";
import { Droplet, Shield, Zap, Brain, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works — Your Path to Feeling Unstoppable",
  description:
    "Experience elite mobile medical care with verified RN-led providers. Learn how NearbyIV finds and vets the best practitioners in your area.",
};

export default function HowItWorks() {
  const benefits = [
    {
      title: "Rehydrate Faster",
      description:
        "Say goodbye to sluggishness. Our IV drips restore lost fluids quickly, giving you back the energy and vitality you need to power through your day with confidence.",
      icon: Droplet,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Boost Your Immunity",
      description:
        "Build a shield against whatever life throws at you. With high-dose vitamins delivered straight to your cells, you'll stay ahead of cold, flu, and seasonal fatigue.",
      icon: Shield,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      title: "Recover Like an Athlete",
      description:
        "Whether you're hitting the gym or just feeling worn out, our nutrient-rich drips can speed up recovery, optimize performance, and get you back in action faster than ever.",
      icon: Zap,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: "Sharpen Your Mind",
      description:
        "Feel the fog lift. Our tailored blends provide your body with maximum absorption of vitamins, amino acids and more, helping you reclaim your focus, improve memory, and stay sharp all day long.",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Glow from Within",
      description:
        "Achieve that natural glow with powerful antioxidants that hydrate and nourish your skin from the inside out. Vitamins and antioxidants can reduce wrinkles, blemishes, and restore that youthful radiance.",
      icon: Sparkles,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
    },
  ];


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            Nearby<span className="text-[#0066FF]">IV</span>
            <span className="text-gray-400 font-normal">.com</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/providers"
              className="text-sm font-medium text-gray-600 hover:text-[#0066FF] transition-colors"
            >
              Find Providers
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-[#0066FF]"
            >
              How It Works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 py-12 md:py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight mb-2">
            Your Answer to Feeling{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-blue-600">
              Unstoppable
            </span>
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
            Get that instant boost to keep up with life's demands. Your body
            needs it.
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            IV Therapy can transform how you feel and help you:
          </p>
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
            Book your IV therapy appointment with a verified, RN-led provider
            in your area today. Premium care delivered to your door.
          </p>
          <Link
            href="/"
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
