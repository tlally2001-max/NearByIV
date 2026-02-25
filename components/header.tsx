"use client";

import Link from "next/link";
import { MobileNav } from "./mobile-nav";
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 h-14" />
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="w-full flex items-center justify-between px-6 h-14">
        <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight whitespace-nowrap">
          Nearby<span style={{ color: "#0066FF" }}>IV</span>
          <span className="text-gray-400 font-normal text-sm">.com</span>
        </Link>
        <MobileNav />
        <div className="hidden md:flex items-center gap-8 ml-auto">
          <Link href="/providers" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors whitespace-nowrap">
            Search Providers
          </Link>
          <Link href="/locations" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors whitespace-nowrap">
            Best IV By City
          </Link>
          <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors whitespace-nowrap">
            How It Works
          </Link>
          <Link href="/faq" className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors whitespace-nowrap">
            FAQ
          </Link>
          <Link
            href="/providers"
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            style={{ backgroundColor: "#0066FF" }}
          >
            Find a Provider
          </Link>
        </div>
      </div>
    </nav>
  );
}
