alter table public.providers
  add column if not exists verification_status text,
  add column if not exists last_verified_at timestamptz,
  add column if not exists verification_source text;

comment on column public.providers.verification_status is
  'Directory review label: listed, reviewed, mobile_confirmed, disputed, or hidden.';
comment on column public.providers.last_verified_at is
  'Most recent date the directory evidence for this listing was reviewed.';
comment on column public.providers.verification_source is
  'Plain-language attribution for the evidence used during directory review.';
