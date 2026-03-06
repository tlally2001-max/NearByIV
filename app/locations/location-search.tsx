"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

interface CityData {
  city: string;
  state: string;
  zips: string[];
}

interface LocationSearchProps {
  cities: CityData[];
}

export function LocationSearch({ cities }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = cities.filter(
      (item) =>
        item.city.toLowerCase().includes(lowerQuery) ||
        item.state.toLowerCase().includes(lowerQuery) ||
        item.zips.some((zip) => zip.includes(query))
    );

    // Sort by city name match first, then state
    filtered.sort((a, b) => {
      const aCity = a.city.toLowerCase();
      const bCity = b.city.toLowerCase();
      const aState = a.state.toLowerCase();
      const bState = b.state.toLowerCase();

      const aStartsCity = aCity.startsWith(lowerQuery);
      const bStartsCity = bCity.startsWith(lowerQuery);
      const aStartsState = aState.startsWith(lowerQuery);
      const bStartsState = bState.startsWith(lowerQuery);

      // Exact match at start of city comes first
      if (aStartsCity && !bStartsCity) return -1;
      if (!aStartsCity && bStartsCity) return 1;
      if (aStartsCity && bStartsCity) return aCity.localeCompare(bCity);

      // Then state matches
      if (aStartsState && !bStartsState) return -1;
      if (!aStartsState && bStartsState) return 1;

      // Default alphabetical
      return aCity.localeCompare(bCity);
    });

    setSuggestions(filtered.slice(0, 8));
    setOpen(true);
  }, [query, cities]);

  // Handle suggestion click
  const handleSuggestionClick = (city: string, state: string) => {
    const stateSlug = state
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const citySlug = city
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    router.push(`/${stateSlug}/${citySlug}`);
    setQuery("");
    setOpen(false);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "Enter" && suggestions.length > 0) {
      const first = suggestions[0];
      handleSuggestionClick(first.city, first.state);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-center py-4">
      <div
        ref={containerRef}
        className="w-full max-w-2xl relative"
      >
        {/* Search Input */}
        <div className="relative flex items-center bg-white border border-gray-200 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
          <Search className="absolute left-4 h-5 w-5 text-blue-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query && setOpen(true)}
            placeholder="Search by city, state, or zip..."
            className="w-full pl-12 pr-10 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {open && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {suggestions.map((item, idx) => (
              <button
                key={`${item.state}-${item.city}-${idx}`}
                onClick={() => handleSuggestionClick(item.city, item.state)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold text-gray-900">
                    {item.city}
                  </span>
                  <span className="text-gray-600">, {item.state}</span>
                </div>
                <span className="text-gray-400 text-sm">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
