"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export function StateSelector() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full mt-4">
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border-2 border-[#0066FF] rounded-lg text-left flex items-center justify-between hover:bg-blue-50 transition-colors text-gray-900"
        >
          <span>
            {selectedState ? selectedState : "Select Your State"}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#0066FF] transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-[#0066FF] rounded-lg shadow-2xl" style={{ zIndex: 9999 }}>
            <div className="max-h-64 overflow-y-auto">
              {US_STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => {
                    setSelectedState(state);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-100 hover:text-[#0066FF] transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
