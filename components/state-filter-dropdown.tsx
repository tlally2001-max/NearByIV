"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function StateFilterDropdown({ currentState }: { currentState?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStateSelect = (state: string) => {
    const stateSlug = toSlug(state);
    window.location.href = `/${stateSlug}`;
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-[#0066FF] hover:text-[#0066FF] transition-colors text-gray-900 font-bold text-base"
      >
        Filter by State
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-[#0066FF] rounded-lg shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto">
            {US_STATES.map((state) => (
              <button
                key={state}
                onClick={() => handleStateSelect(state)}
                className="w-full px-4 py-3 text-left text-gray-700 font-medium hover:bg-blue-50 hover:text-[#0066FF] transition-colors border-b border-gray-100 last:border-b-0"
              >
                {state}
              </button>
            ))}
          </div>
          {currentState && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
              Current: {currentState}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
