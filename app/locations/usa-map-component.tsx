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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
        <div
          className="overflow-x-auto -mx-4 sm:-mx-6 md:-mx-8"
          style={{
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div style={{ minWidth: "600px", maxWidth: "100%" }}>
            <div style={{ padding: "0 1rem" }}>
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
        </div>
      </div>
    </div>
  );
}
