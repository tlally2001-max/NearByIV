"use client";

import Link from "next/link";

type Provider = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  state: string | null;
  website: string | null;
  rating: number | null;
  reviews: number | null;
  hero_image: string | null;
  treatments: string | null;
  is_confirmed_mobile: boolean;
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <svg key={`f${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <svg key={`e${i}`} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function FeaturedProviders({ providers }: { providers: Provider[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {providers.map((p) => (
        <div
          key={p.id}
          className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          {/* Image */}
          <div className="relative h-52 bg-gray-50 overflow-hidden">
            <img
              src={p.hero_image || "/iv-bag-default.jpg"}
              alt={p.name}
              onError={(e) => { (e.target as HTMLImageElement).src = "/iv-bag-default.jpg"; }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Mobile badge */}
            {p.is_confirmed_mobile && (
              <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Mobile
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-3">
            <h3 className="font-bold text-lg text-gray-900 leading-snug">
              {p.name}
            </h3>

            <p className="text-sm text-gray-500">
              {[p.city, p.state].filter(Boolean).join(", ")}
            </p>

            {/* Rating */}
            {p.rating != null && (
              <div className="flex items-center gap-2">
                <StarRating rating={p.rating} />
                <span className="text-sm font-semibold text-gray-700">
                  {p.rating.toFixed(1)}
                </span>
                {p.reviews != null && (
                  <span className="text-sm text-gray-400">
                    ({p.reviews} reviews)
                  </span>
                )}
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/providers/${p.slug}`}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors cursor-pointer text-center block"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
