"use client";

import { useEffect, useRef, useState } from "react";

type CityCount = {
  city: string;
  state: string;
  count: number;
};

// City coordinates for major cities (expanded list)
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "los angeles,ca": { lat: 34.0522, lng: -118.2437 },
  "los angeles,california": { lat: 34.0522, lng: -118.2437 },
  "glendale,ca": { lat: 34.1404, lng: -118.255 },
  "glendale,california": { lat: 34.1404, lng: -118.255 },
  "west hollywood,ca": { lat: 34.0901, lng: -118.3619 },
  "west hollywood,california": { lat: 34.0901, lng: -118.3619 },
  "pasadena,ca": { lat: 34.1478, lng: -118.1445 },
  "pasadena,california": { lat: 34.1478, lng: -118.1445 },
  "sherman oaks,ca": { lat: 34.1545, lng: -118.4515 },
  "sherman oaks,california": { lat: 34.1545, lng: -118.4515 },
  "beverly hills,ca": { lat: 34.0901, lng: -118.4065 },
  "beverly hills,california": { lat: 34.0901, lng: -118.4065 },
  "new york,ny": { lat: 40.7128, lng: -74.006 },
  "new york,new york": { lat: 40.7128, lng: -74.006 },
  "brooklyn,ny": { lat: 40.6501, lng: -73.9496 },
  "brooklyn,new york": { lat: 40.6501, lng: -73.9496 },
  "jackson heights,ny": { lat: 40.754, lng: -73.8832 },
  "jackson heights,new york": { lat: 40.754, lng: -73.8832 },
  "long island city,ny": { lat: 40.7483, lng: -73.9516 },
  "long island city,new york": { lat: 40.7483, lng: -73.9516 },
  "rego park,ny": { lat: 40.7282, lng: -73.8211 },
  "rego park,new york": { lat: 40.7282, lng: -73.8211 },
  "scarsdale,ny": { lat: 40.9748, lng: -73.8305 },
  "scarsdale,new york": { lat: 40.9748, lng: -73.8305 },
  "chicago,il": { lat: 41.8781, lng: -87.6298 },
  "chicago,illinois": { lat: 41.8781, lng: -87.6298 },
  "burr ridge,il": { lat: 41.7519, lng: -87.851 },
  "burr ridge,illinois": { lat: 41.7519, lng: -87.851 },
  "elmhurst,il": { lat: 41.8998, lng: -87.9306 },
  "elmhurst,illinois": { lat: 41.8998, lng: -87.9306 },
  "lake forest,il": { lat: 42.1733, lng: -87.8627 },
  "lake forest,illinois": { lat: 42.1733, lng: -87.8627 },
  "lombard,il": { lat: 41.8809, lng: -88.0105 },
  "lombard,illinois": { lat: 41.8809, lng: -88.0105 },
  "skokie,il": { lat: 42.0198, lng: -87.7295 },
  "skokie,illinois": { lat: 42.0198, lng: -87.7295 },
  "denver,co": { lat: 39.7392, lng: -104.9903 },
  "denver,colorado": { lat: 39.7392, lng: -104.9903 },
  "boulder,co": { lat: 40.0176, lng: -105.2705 },
  "boulder,colorado": { lat: 40.0176, lng: -105.2705 },
  "lakewood,co": { lat: 39.7347, lng: -105.0844 },
  "lakewood,colorado": { lat: 39.7347, lng: -105.0844 },
  "louisville,co": { lat: 39.9641, lng: -105.1037 },
  "louisville,colorado": { lat: 39.9641, lng: -105.1037 },
  "greenwood village,co": { lat: 39.6106, lng: -104.92 },
  "greenwood village,colorado": { lat: 39.6106, lng: -104.92 },
  "orlando,fl": { lat: 28.5383, lng: -81.3792 },
  "orlando,florida": { lat: 28.5383, lng: -81.3792 },
  "tampa,fl": { lat: 27.9506, lng: -82.4572 },
  "tampa,florida": { lat: 27.9506, lng: -82.4572 },
  "st. petersburg,fl": { lat: 27.773, lng: -82.6403 },
  "st. petersburg,florida": { lat: 27.773, lng: -82.6403 },
  "kissimmee,fl": { lat: 28.2914, lng: -81.4055 },
  "kissimmee,florida": { lat: 28.2914, lng: -81.4055 },
  "winter park,fl": { lat: 28.5943, lng: -81.3239 },
  "winter park,florida": { lat: 28.5943, lng: -81.3239 },
  "winter garden,fl": { lat: 28.5542, lng: -81.5677 },
  "winter garden,florida": { lat: 28.5542, lng: -81.5677 },
  "atlanta,ga": { lat: 33.749, lng: -84.388 },
  "atlanta,georgia": { lat: 33.749, lng: -84.388 },
  "brookhaven,ga": { lat: 33.8742, lng: -84.3714 },
  "brookhaven,georgia": { lat: 33.8742, lng: -84.3714 },
  "decatur,ga": { lat: 33.7748, lng: -84.2733 },
  "decatur,georgia": { lat: 33.7748, lng: -84.2733 },
  "las vegas,nv": { lat: 36.1699, lng: -115.1398 },
  "las vegas,nevada": { lat: 36.1699, lng: -115.1398 },
  "englewood,nj": { lat: 40.8785, lng: -73.9641 },
  "englewood,new jersey": { lat: 40.8785, lng: -73.9641 },
  "florham park,nj": { lat: 40.8203, lng: -74.4215 },
  "florham park,new jersey": { lat: 40.8203, lng: -74.4215 },
  "hoboken,nj": { lat: 40.7351, lng: -74.0306 },
  "hoboken,new jersey": { lat: 40.7351, lng: -74.0306 },
  "jersey city,nj": { lat: 40.7178, lng: -74.0431 },
  "jersey city,new jersey": { lat: 40.7178, lng: -74.0431 },
  "scottsdale,az": { lat: 33.4942, lng: -111.926 },
  "scottsdale,arizona": { lat: 33.4942, lng: -111.926 },
  "denver,nc": { lat: 35.5411, lng: -80.6119 },
  "denver,north carolina": { lat: 35.5411, lng: -80.6119 },
  "charleston,sc": { lat: 32.7765, lng: -79.9626 },
  "charleston,south carolina": { lat: 32.7765, lng: -79.9626 },
  "austin,tx": { lat: 30.2672, lng: -97.7431 },
  "austin,texas": { lat: 30.2672, lng: -97.7431 },
  "pflugerville,tx": { lat: 30.4349, lng: -97.6085 },
  "pflugerville,texas": { lat: 30.4349, lng: -97.6085 },
  "herndon,va": { lat: 38.9695, lng: -77.3861 },
  "herndon,virginia": { lat: 38.9695, lng: -77.3861 },
};

function getColorByDensity(count: number): string {
  if (count <= 2) return "#60a5fa"; // light blue
  if (count <= 5) return "#3b82f6"; // blue
  if (count <= 10) return "#2563eb"; // darker blue
  return "#1e40af"; // very dark blue
}

function getRadiusByCount(count: number): number {
  // Scale radius based on provider count, between 8 and 30
  return Math.min(30, Math.max(8, Math.sqrt(count) * 4));
}

export function LocationsMapClient({ cityCounts }: { cityCounts: CityCount[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);

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
    if (!shouldLoadMap || !mapContainer.current) return;

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

    // Add circle markers for each city
    cityCounts.forEach((cityData) => {
      const key = `${cityData.city.toLowerCase()},${cityData.state.toLowerCase()}`;
      const coords = CITY_COORDINATES[key];

      if (coords) {
        const color = getColorByDensity(cityData.count);
        const radius = getRadiusByCount(cityData.count);

        const circle = L.circleMarker([coords.lat, coords.lng], {
          radius,
          fillColor: color,
          color: "#1f2937",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #000; font-size: 14px; font-weight: bold;">${cityData.city}, ${cityData.state}</h4>
            <p style="margin: 0; color: #333; font-size: 13px;">
              <span style="font-weight: bold; font-size: 16px;">${cityData.count}</span>
              <span style="color: #666; margin-left: 4px;">provider${cityData.count !== 1 ? 's' : ''}</span>
            </p>
          </div>
        `;

        circle.bindPopup(popupContent);
      }
    });

    mapRef.current = map;
  };

  return (
    <div className="w-full">
      {/* Leaflet Map */}
      <div
        ref={mapContainer}
        className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-gray-100"
        style={{ height: "500px", width: "100%" }}
      />

      {/* Legend */}
      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Map Legend</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full border-2 border-gray-900"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: getColorByDensity(1),
              }}
            ></div>
            <span className="text-sm text-gray-600">1-2 providers</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="rounded-full border-2 border-gray-900"
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: getColorByDensity(4),
              }}
            ></div>
            <span className="text-sm text-gray-600">3-5 providers</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="rounded-full border-2 border-gray-900"
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: getColorByDensity(7),
              }}
            ></div>
            <span className="text-sm text-gray-600">6-10 providers</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="rounded-full border-2 border-gray-900"
              style={{
                width: "28px",
                height: "28px",
                backgroundColor: getColorByDensity(15),
              }}
            ></div>
            <span className="text-sm text-gray-600">11+ providers</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Circle size and color indicate provider density. Click circles to see details.
        </p>
      </div>
    </div>
  );
}
