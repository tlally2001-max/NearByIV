-- Drop if exists (for re-runs during development)
DROP TABLE IF EXISTS providers;

CREATE TABLE providers (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name                text NOT NULL,
  city                text,
  state               text,
  website             text,
  rating              double precision,
  reviews             integer,
  hero_image          text,
  treatments          text,
  is_confirmed_mobile boolean DEFAULT false,
  created_at          timestamptz DEFAULT now(),
  UNIQUE (name, website)
);

CREATE INDEX idx_providers_confirmed ON providers (is_confirmed_mobile);
CREATE INDEX idx_providers_city ON providers (city);
