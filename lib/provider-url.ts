import { slugifyLocation } from "@/lib/directory-validation";

type ProviderLocation = {
  state?: string | null;
  city_slug?: string | null;
  provider_slug?: string | null;
};

export function providerHref(provider: ProviderLocation): string {
  const stateSlug = slugifyLocation(provider.state || "");

  if (!stateSlug || !provider.city_slug || !provider.provider_slug) {
    return "/providers";
  }

  return `/${stateSlug}/${provider.city_slug}/${provider.provider_slug}`;
}
