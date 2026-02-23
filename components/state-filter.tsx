"use client";

import { useRouter } from "next/navigation";

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

export function StateFilter() {
  const router = useRouter();

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const state = e.target.value;
    if (state) {
      router.push(`/providers?state=${encodeURIComponent(state)}`);
    }
  };

  return (
    <div className="w-full mt-4">
      <select
        onChange={handleStateChange}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "2px solid #0066FF",
          fontSize: "16px",
          fontWeight: "500",
          backgroundColor: "white",
          color: "#1f2937",
          cursor: "pointer",
        }}
      >
        <option value="">Select Your State</option>
        {US_STATES.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
}
