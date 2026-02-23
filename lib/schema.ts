export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NearbyIV",
    url: "https://nearbyiv.com",
    logo: "https://nearbyiv.com/iv-bag-default.jpg",
    description:
      "The most trusted directory of RN-led mobile IV therapy providers",
    sameAs: [
      "https://www.facebook.com/nearbyiv",
      "https://www.instagram.com/nearbyiv",
      "https://www.twitter.com/nearbyiv",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-NEARBY-IV",
      contactType: "Customer Support",
    },
  };
}

export function generateLocalBusinessSchema(provider: {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  rating: number | null;
  reviews: number | null;
  website: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.name,
    image: "https://nearbyiv.com/iv-bag-default.jpg",
    url: `https://nearbyiv.com/providers/${provider.id}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: provider.city || "Unknown",
      addressRegion: provider.state || "Unknown",
      addressCountry: "US",
    },
    ...(provider.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: provider.rating.toString(),
        reviewCount: (provider.reviews || 0).toString(),
      },
    }),
    ...(provider.website && {
      sameAs: provider.website,
    }),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://nearbyiv.com${item.url}`,
    })),
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "NearbyIV",
    url: "https://nearbyiv.com",
    description: "Mobile IV therapy provider directory",
    areaServed: "US",
    medicalSpecialty: "IV Therapy",
  };
}
