"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSearch() {
  const [location, setLocation] = useState("");
  const router = useRouter();

  function handleSearch() {
    const trimmed = location.trim();
    if (!trimmed) return;
    router.push(`/providers?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="flex w-full max-w-xl mx-auto rounded-full bg-white shadow-xl overflow-hidden">
      <div className="flex items-center gap-3 flex-1 px-5 py-3">
        <svg
          className="w-5 h-5 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Enter your address..."
          className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 text-sm outline-none"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 transition-colors shrink-0 cursor-pointer"
      >
        Find My IV
      </button>
    </div>
  );
}
