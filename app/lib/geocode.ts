"use server";

const geocodeCache: Record<string, { lat: number; lng: number } | null> = {};

export async function geocodeCity(
  city: string,
  state: string
): Promise<{ lat: number; lng: number } | null> {
  const key = `${city?.toLowerCase()},${state?.toLowerCase()}`;

  // Check cache first
  if (key in geocodeCache) {
    return geocodeCache[key];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        `${city}, ${state}`
      )}&format=json&limit=1`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error(`Invalid content type: ${contentType}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      geocodeCache[key] = coords;
      return coords;
    }
  } catch (error) {
    console.error(`Failed to geocode ${city}, ${state}:`, error instanceof Error ? error.message : error);
  }

  geocodeCache[key] = null;
  return null;
}
