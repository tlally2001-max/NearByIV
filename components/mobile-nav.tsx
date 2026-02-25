"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-gray-700 hover:text-[#0066FF] transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-50">
          <div className="flex flex-col px-6 py-4 gap-4">
            <Link
              href="/providers"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors py-1"
            >
              Search Providers
            </Link>
            <Link
              href="/locations"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors py-1"
            >
              Best IV By City
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setOpen(false)}
              className="text-sm text-gray-600 hover:text-[#0066FF] transition-colors py-1"
            >
              How It Works
            </Link>
            <Link
              href="/providers"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg text-center transition-colors"
              style={{ backgroundColor: "#0066FF" }}
            >
              Find a Provider
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
