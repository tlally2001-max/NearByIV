import { createClient } from "@/lib/supabase/server";
import { slugifyLocation } from "@/lib/directory-validation";
import { notFound, permanentRedirect } from "next/navigation";

export const dynamicParams = true;

export default async function LegacyProviderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: legacySlugMatches } = await supabase
    .from("providers")
    .select("state:State, city_slug, provider_slug")
    .eq("slug", slug)
    .limit(2);

  const { data: providerSlugMatches } = legacySlugMatches?.length
    ? { data: null }
    : await supabase
        .from("providers")
        .select("state:State, city_slug, provider_slug")
        .eq("provider_slug", slug)
        .limit(2);

  const matches = legacySlugMatches?.length ? legacySlugMatches : providerSlugMatches || [];

  if (matches.length > 1) {
    permanentRedirect(`/providers?q=${encodeURIComponent(slug.replace(/-/g, " "))}`);
  }

  const data = matches[0];

  if (!data?.state || !data.city_slug || !data.provider_slug) {
    notFound();
  }

  permanentRedirect(`/${slugifyLocation(data.state)}/${data.city_slug}/${data.provider_slug}`);
}
