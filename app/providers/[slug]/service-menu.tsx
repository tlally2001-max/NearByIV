"use client";

const SERVICE_CATEGORIES = [
  {
    id: "recovery",
    title: "Recovery Essentials",
    icon: "💧",
    keywords: ["hydration", "hangover", "detox", "rehydration", "cold", "flu", "headache", "migraine", "jet lag", "food poisoning", "morning sickness"],
  },
  {
    id: "performance",
    title: "Peak Performance",
    icon: "⚡",
    keywords: ["energy", "athletic", "fitness", "recovery", "b12", "vitamin c", "performance"],
  },
  {
    id: "immune",
    title: "Immune Defense",
    icon: "🛡️",
    keywords: ["immune", "immunity", "vitamin d", "iron", "glutathione", "cold", "flu"],
  },
  {
    id: "beauty",
    title: "Beauty & Glow",
    icon: "✨",
    keywords: ["anti-aging", "biotin", "glow", "beauty", "skincare", "collagen"],
  },
  {
    id: "metabolic",
    title: "Metabolic Health",
    icon: "⚖️",
    keywords: ["weight loss", "slim", "skinny", "energy", "b12", "metabolic"],
  },
  {
    id: "custom",
    title: "Custom Blends",
    icon: "🧪",
    keywords: ["build your own", "custom", "myers", "nad", "ketamine"],
  },
];

interface ServiceMenuProps {
  treatments: string;
}

export function ServiceMenu({ treatments }: ServiceMenuProps) {
  // Parse provider treatments and filter categories
  const providerTreatments = treatments
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  // Filter categories to only show those with matching treatments
  const activeCategories = SERVICE_CATEGORIES.filter((category) =>
    category.keywords.some((keyword) =>
      providerTreatments.some((treatment) => treatment.includes(keyword.toLowerCase()))
    )
  );

  // Build service list for each active category
  const categoriesWithServices = activeCategories.map((category) => {
    const matchedServices = providerTreatments.filter((treatment) =>
      category.keywords.some((keyword) => treatment.includes(keyword.toLowerCase()))
    );

    return {
      ...category,
      matchedServices: [...new Set(matchedServices)], // Remove duplicates
    };
  });

  if (categoriesWithServices.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoriesWithServices.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-5 text-center">
            <span className="text-3xl">{category.icon}</span>
            <h3 className="text-lg font-bold text-gray-900">{category.title}</h3>
          </div>

          {/* Services List */}
          <ul className="space-y-3">
            {category.matchedServices.map((service) => (
              <li key={service} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="capitalize">{service}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
