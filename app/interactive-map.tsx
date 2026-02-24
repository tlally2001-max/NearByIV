"use client";

import { useEffect, useRef, useState } from "react";

type Provider = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  rating: number | null;
  reviews: number | null;
};

type ProviderCoordinates = {
  providerId: string;
  lat: number;
  lng: number;
};

const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "los angeles,ca": { lat: 34.0522, lng: -118.2437 },
  "los angeles,california": { lat: 34.0522, lng: -118.2437 },
  "new york,ny": { lat: 40.7128, lng: -74.006 },
  "new york,new york": { lat: 40.7128, lng: -74.006 },
  "chicago,il": { lat: 41.8781, lng: -87.6298 },
  "chicago,illinois": { lat: 41.8781, lng: -87.6298 },
  "houston,tx": { lat: 29.7604, lng: -95.3698 },
  "houston,texas": { lat: 29.7604, lng: -95.3698 },
  "phoenix,az": { lat: 33.4484, lng: -112.074 },
  "phoenix,arizona": { lat: 33.4484, lng: -112.074 },
  "philadelphia,pa": { lat: 39.9526, lng: -75.1652 },
  "philadelphia,pennsylvania": { lat: 39.9526, lng: -75.1652 },
  "san antonio,tx": { lat: 29.4241, lng: -98.4936 },
  "san antonio,texas": { lat: 29.4241, lng: -98.4936 },
  "san diego,ca": { lat: 32.7157, lng: -117.1611 },
  "san diego,california": { lat: 32.7157, lng: -117.1611 },
  "dallas,tx": { lat: 32.7767, lng: -96.797 },
  "dallas,texas": { lat: 32.7767, lng: -96.797 },
  "miami,fl": { lat: 25.7617, lng: -80.1918 },
  "miami,florida": { lat: 25.7617, lng: -80.1918 },
  "denver,co": { lat: 39.7392, lng: -104.9903 },
  "denver,colorado": { lat: 39.7392, lng: -104.9903 },
  "seattle,wa": { lat: 47.6062, lng: -122.3321 },
  "seattle,washington": { lat: 47.6062, lng: -122.3321 },
  "boston,ma": { lat: 42.3601, lng: -71.0589 },
  "boston,massachusetts": { lat: 42.3601, lng: -71.0589 },
  "glendale,ca": { lat: 34.1404, lng: -118.255 },
  "glendale,california": { lat: 34.1404, lng: -118.255 },
  "west hollywood,ca": { lat: 34.0901, lng: -118.3619 },
  "west hollywood,california": { lat: 34.0901, lng: -118.3619 },
  "lower manhattan,ny": { lat: 40.705, lng: -74.012 },
  "lower manhattan,new york": { lat: 40.705, lng: -74.012 },
  "hollywood,ca": { lat: 34.0901, lng: -118.3267 },
  "hollywood,california": { lat: 34.0901, lng: -118.3267 },
  "las vegas,nv": { lat: 36.1699, lng: -115.1398 },
  "las vegas,nevada": { lat: 36.1699, lng: -115.1398 },
};

export function InteractiveMap({
  providers,
  coordinates,
}: {
  providers: Provider[];
  coordinates: ProviderCoordinates[];
}) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

  // Create a map of provider ID to coordinates for quick lookup
  const coordMap = useRef<Record<string, { lat: number; lng: number }>>(
    coordinates.reduce((acc, coord) => {
      acc[coord.providerId] = { lat: coord.lat, lng: coord.lng };
      return acc;
    }, {} as Record<string, { lat: number; lng: number }>)
  );

  // Lazy load map only when container is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (mapContainer.current) {
      observer.observe(mapContainer.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoadMap) return;
    // Load Leaflet CSS and JS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.async = false;
    script.onload = () => {
      setTimeout(() => {
        initializeMap();
      }, 100);
    };
    document.head.appendChild(script);

    return () => {
      try {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [shouldLoadMap]);

  const initializeMap = () => {
    if (!mapContainer.current) return;
    if (mapRef.current) {
      try {
        mapRef.current.remove();
      } catch (e) {
        // Ignore if map is already removed
      }
      mapRef.current = null;
    }

    const L = (window as any).L;
    if (!L) return;

    // Create map centered on USA
    const map = L.map(mapContainer.current).setView([39, -98], 4);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add provider markers for all passed providers
    providers.forEach((provider) => {
      const coords = coordMap.current[provider.id];

      if (coords) {
        const marker = L.marker([coords.lat, coords.lng]).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #000;">${provider.name}</h4>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">
              ${provider.city}, ${provider.state}
            </p>
            ${
              provider.rating
                ? `<p style="margin: 0; color: #666; font-size: 14px;">
                ⭐ ${provider.rating.toFixed(1)} ${
                    provider.reviews ? `(${provider.reviews} reviews)` : ""
                  }
              </p>`
                : ""
            }
            <a href="/providers/${provider.slug}" style="display: inline-block; margin-top: 8px; padding: 6px 12px; background: #0066FF; color: white; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; cursor: pointer;">
              View Profile
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
      }
    });

    mapRef.current = map;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.location.href = `/providers?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <div className="w-full">
      {/* Interactive Map */}
      <div
        ref={mapContainer}
        className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        style={{ height: "500px", width: "100%" }}
      />

      {/* Address Search Bar */}
      <div className="mt-6">
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
        <p className="mt-2 text-sm text-white font-medium">
          Click on map markers to see provider details • {providers.length} providers shown
        </p>
      </div>
    </div>
  );
}
