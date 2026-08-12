export type DirectoryProvider = {
  business_name?: string | null;
  name?: string | null;
  City?: string | null;
  city?: string | null;
  State?: string | null;
  state?: string | null;
  treatments?: string | null;
  personalized_bio?: string | null;
  service_areas?: string | null;
  is_confirmed_mobile?: boolean | null;
  city_slug?: string | null;
  provider_slug?: string | null;
  id?: string | null;
  slug?: string | null;
  website?: string | null;
  rating?: number | null;
  reviews?: number | null;
  hero_image?: string | null;
};

const MEDICAL_TERMS = /\b(iv|intravenous|hydration|infusion|drip|vitamin|nad\+?|glp-?1|ketamine|wellness|medical|clinic|nurse|rn|health)\b/i;
const EXCLUDED_TERMS = /\b(store|restoration|landmark|national park|lake|museum|church|school|real estate|restaurant|hotel|auto|roofing|construction)\b/i;
const INVALID_CITY_TOKENS = new Set(["us", "usa", "united states", "unknown", "n/a"]);

export function isValidCity(city: string | null | undefined): boolean {
  const normalized = city?.trim().toLowerCase();
  return Boolean(normalized && !INVALID_CITY_TOKENS.has(normalized) && /[a-z]/i.test(normalized));
}

export function isValidatedProvider(provider: DirectoryProvider): boolean {
  const name = (provider.business_name || provider.name || "").trim();
  const city = provider.City || provider.city;
  const searchable = [name, provider.treatments, provider.personalized_bio, provider.service_areas]
    .filter(Boolean)
    .join(" ");

  return Boolean(
    provider.is_confirmed_mobile === true &&
      name &&
      isValidCity(city) &&
      MEDICAL_TERMS.test(searchable) &&
      !EXCLUDED_TERMS.test(name)
  );
}

export function slugifyLocation(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function canonicalStateName(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/\./g, "");
  if (["dc", "d c", "district of columbia", "washington dc"].includes(normalized)) {
    return "District of Columbia";
  }
  return value.trim().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function dedupeValidatedProviders<T extends DirectoryProvider>(providers: T[]): T[] {
  const seen = new Set<string>();
  return providers.filter((provider) => {
    if (!isValidatedProvider(provider)) return false;
    const key = [provider.business_name || provider.name, provider.City || provider.city, provider.State || provider.state]
      .map((value) => String(value || "").trim().toLowerCase())
      .join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
