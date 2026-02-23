"use client";

import { useState } from "react";

export function USAMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Use Nominatim (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        setSearchResults(`${result.name || result.address?.name || searchQuery}`);
        // Optionally redirect to providers search
        window.location.href = `/providers?q=${encodeURIComponent(searchQuery)}`;
      } else {
        setSearchResults("Address not found");
      }
    } catch (error) {
      setSearchResults("Error searching address");
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      {/* OpenStreetMap showing entire USA */}
      <iframe
        title="NearbyIV Service Coverage Map - USA"
        width="100%"
        height="500"
        frameBorder="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-130%2C24%2C-65%2C50&layer=mapnik&marker=39%2C-98"
        className="rounded-2xl border border-gray-200 shadow-sm"
      />

      {/* Address Search Bar */}
      <div className="mt-6 max-w-7xl mx-auto px-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            placeholder="Search by address, city, or zip code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
        {searchResults && (
          <p className="mt-2 text-sm text-gray-600">{searchResults}</p>
        )}
      </div>
    </div>
  );
}
