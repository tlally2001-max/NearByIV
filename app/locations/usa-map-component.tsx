"use client";

import { useRouter } from "next/navigation";
import USAMap from "@mirawision/usa-map-react";

type USAStateAbbreviation =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "DC" | "FL" | "GA" | "HI"
  | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD" | "MA" | "MI" | "MN"
  | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH"
  | "OK" | "OR" | "PA" | "RI" | "SC" | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA"
  | "WV" | "WI" | "WY";

// Abbreviation to slug mapping
const ABBREV_TO_SLUG: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", DC: "district-of-columbia",
  FL: "florida", GA: "georgia", HI: "hawaii", ID: "idaho", IL: "illinois",
  IN: "indiana", IA: "iowa", KS: "kansas", KY: "kentucky", LA: "louisiana",
  ME: "maine", MD: "maryland", MA: "massachusetts", MI: "michigan", MN: "minnesota",
  MS: "mississippi", MO: "missouri", MT: "montana", NE: "nebraska", NV: "nevada",
  NH: "new-hampshire", NJ: "new-jersey", NM: "new-mexico", NY: "new-york",
  NC: "north-carolina", ND: "north-dakota", OH: "ohio", OK: "oklahoma",
  OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming",
};

function getColorByDensity(count: number): string {
  if (count === 0) return "#f3f4f6"; // gray
  if (count <= 5) return "#dbeafe"; // light blue
  if (count <= 20) return "#93c5fd"; // medium blue
  if (count <= 50) return "#3b82f6"; // blue
  return "#1d4ed8"; // dark blue
}

export function USAMapComponent({ stateCounts }: { stateCounts: Map<string, number> }) {
  const router = useRouter();

  // Build customStates object with per-state configuration
  const customStates: Record<string, any> = {};

  Object.entries(ABBREV_TO_SLUG).forEach(([abbrev, slug]) => {
    const count = stateCounts.get(slug) || 0;
    const color = getColorByDensity(count);

    customStates[abbrev] = {
      fill: color,
      stroke: "#9ca3af",
      label: {
        enabled: true,
        render: () => abbrev,
      },
      tooltip: {
        enabled: true,
        render: () => `${count} provider${count !== 1 ? "s" : ""}`,
      },
      onClick: () => router.push(`/${slug}`),
    };
  });

  return (
    <div className="w-full">
      {/* Map Container */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <USAMap
            customStates={customStates}
            mapSettings={{
              width: "100%",
              height: "auto",
              title: "USA Provider Density Map",
            }}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Provider Density Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: "#f3f4f6" }}></div>
            <span className="text-xs text-gray-600 text-center">No providers</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: "#dbeafe" }}></div>
            <span className="text-xs text-gray-600 text-center">1-5</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: "#93c5fd" }}></div>
            <span className="text-xs text-gray-600 text-center">6-20</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: "#3b82f6" }}></div>
            <span className="text-xs text-gray-600 text-center">21-50</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: "#1d4ed8" }}></div>
            <span className="text-xs text-gray-600 text-center">51+</span>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-600">
          Click any state to view providers. Hover for provider counts.
        </p>
      </div>
    </div>
  );
}
