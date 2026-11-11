-- Budget Saudi NEXT — proposed PostgreSQL data model (concept).
-- Not deployed. Mirrors the shapes used by the prototype (src/content, src/data, src/lib/store.tsx).

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

-- Verified content inventory (src/content/verified.ts → Sourced<T>)
CREATE TYPE provenance AS ENUM ('verified', 'expired', 'undated', 'simulated', 'proposed');

CREATE TABLE content_item (
  id            text PRIMARY KEY,                 -- e.g. 'company.founded'
  locale        text NOT NULL CHECK (locale IN ('en', 'ar')),
  value         jsonb NOT NULL,
  source_url    text,
  retrieved_on  date,
  provenance    provenance NOT NULL,
  valid_from    date,
  valid_to      date,
  note          text,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'published', 'archived')),
  updated_by    uuid,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CHECK (provenance <> 'verified' OR source_url IS NOT NULL)
);

CREATE TABLE city (
  id        text PRIMARY KEY,
  name_en   text NOT NULL,
  name_ar   text NOT NULL,
  lat       numeric(8,5),
  lon       numeric(8,5)
);

CREATE TABLE branch (
  id          text PRIMARY KEY,
  city_id     text NOT NULL REFERENCES city(id),
  name_en     text NOT NULL,
  name_ar     text NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('airport', 'city', 'rail', 'hotel')),
  address     text,
  phone       text,
  hours       jsonb,                              -- null when not published
  lat         numeric(8,5),
  lon         numeric(8,5),
  verified    boolean NOT NULL DEFAULT false
);

CREATE TABLE vehicle_class (
  id            text PRIMARY KEY,                 -- e.g. 'toyota-rav4' ("or similar")
  category      text NOT NULL,
  make          text NOT NULL,
  model         text NOT NULL,
  seats         smallint NOT NULL,
  bags          smallint NOT NULL,
  doors         smallint NOT NULL,
  transmission  text NOT NULL,
  fuel          text NOT NULL,
  features      text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE tariff (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_class  text NOT NULL REFERENCES vehicle_class(id),
  city_id        text REFERENCES city(id),
  daily_rate     numeric(10,2) NOT NULL,
  km_per_day     integer,
  deposit        numeric(10,2),
  valid_from     date NOT NULL,
  valid_to       date
);

CREATE TABLE customer (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name      text NOT NULL,
  email          citext UNIQUE,
  mobile         text,
  id_ref         bytea,                           -- encrypted reference from identity provider, never raw images
  loyalty_tier   text CHECK (loyalty_tier IN ('silver', 'gold', 'platinum')),
  preferences    jsonb NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE consent (
  customer_id  uuid NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
  purpose      text NOT NULL,                     -- 'booking', 'marketing', 'telematics'
  granted      boolean NOT NULL,
  recorded_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (customer_id, purpose, recorded_at)
);

CREATE TABLE booking (
  ref             text PRIMARY KEY,               -- 'DEMO-XXXXXX' in the prototype
  customer_id     uuid REFERENCES customer(id),
  vehicle_class   text NOT NULL REFERENCES vehicle_class(id),
  pickup_branch   text NOT NULL REFERENCES branch(id),
  return_branch   text NOT NULL REFERENCES branch(id),
  pickup_at       timestamptz NOT NULL,
  return_at       timestamptz NOT NULL,
  cover           text NOT NULL CHECK (cover IN ('standard', 'super', 'premium')),
  extras          jsonb NOT NULL DEFAULT '{}',
  young_driver    boolean NOT NULL DEFAULT false,
  promo_code      text,
  subtotal        numeric(10,2) NOT NULL,
  vat             numeric(10,2) NOT NULL,
  total           numeric(10,2) NOT NULL,
  status          text NOT NULL CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  CHECK (return_at > pickup_at)
);

CREATE TABLE support_ticket (
  id           text PRIMARY KEY,                  -- 'TCK-1001'
  customer_id  uuid REFERENCES customer(id),
  booking_ref  text REFERENCES booking(ref),
  subject      text NOT NULL,
  status       smallint NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE corporate_account (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  cr_number   text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE lease_contract (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id     uuid NOT NULL REFERENCES corporate_account(id),
  vehicle_class  text NOT NULL REFERENCES vehicle_class(id),
  units          integer NOT NULL,
  months         integer NOT NULL,
  monthly_rate   numeric(10,2) NOT NULL,
  starts_on      date NOT NULL
);

CREATE TABLE staff_user (
  id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email  citext UNIQUE NOT NULL,
  role   text NOT NULL CHECK (role IN ('viewer', 'editor', 'admin'))
);

CREATE TABLE audit_log (
  id        bigserial PRIMARY KEY,
  actor_id  uuid REFERENCES staff_user(id),
  action    text NOT NULL,
  target    text NOT NULL,
  detail    jsonb,
  at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX booking_customer_idx ON booking (customer_id, pickup_at DESC);
CREATE INDEX branch_city_idx ON branch (city_id);
CREATE INDEX content_item_status_idx ON content_item (status, provenance);
