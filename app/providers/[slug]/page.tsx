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
  const { data: legacySlugMatch } = await supabase
    .from("providers")
    .select("state:State, city_slug, provider_slug")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  const { data: providerSlugMatch } = legacySlugMatch
    ? { data: null }
    : await supabase
        .from("providers")
        .select("state:State, city_slug, provider_slug")
        .eq("provider_slug", slug)
        .limit(1)
        .maybeSingle();

  const data = legacySlugMatch || providerSlugMatch;

  if (!data?.state || !data.city_slug || !data.provider_slug) {
    notFound();
  }

  permanentRedirect(`/${slugifyLocation(data.state)}/${data.city_slug}/${data.provider_slug}`);
}
