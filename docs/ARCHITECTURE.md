# Architecture

## Prototype (what is built)

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 with design tokens in `src/app/globals.css` (`@theme`) |
| Motion | `motion` (Framer Motion), respects `prefers-reduced-motion` |
| Forms | `react-hook-form` + `zod` schemas |
| Icons / map | `lucide-react`; `d3-geo` + Natural Earth (`world-atlas`) pre-projected to an SVG path by `scripts/gen-map.mjs` |
| Fonts | Inter (Latin), IBM Plex Sans Arabic — bundled locally via Fontsource, no third-party font requests |
| State | Client-side demo store (React context + `localStorage` key `bsn-demo-v1`) |
| Tests | Vitest (pure logic), Playwright (end-to-end, desktop + Pixel 7) |

### Layout

```
src/
  app/[locale]/…/page.tsx   thin server pages: metadata + Suspense around a view
  views/*.tsx               client page components (one per route)
  components/               shell, search widget, vehicle art, map, concierge, price summary, UI kit
  lib/                      pricing, search, concierge intent parser, dates, demo store
  content/verified.ts       verified public facts with source URL, date and provenance
  data/                     mock vehicles, branches (public directory), fleet, generated map
  i18n/                     locale config, shared dictionary (EN/AR parity checked at compile time), hooks
tests/unit, tests/e2e
```

### Key decisions

- **One route tree for both languages.** `app/[locale]/layout.tsx` sets `lang` and `dir`; every page is pre-rendered for `en` and `ar`. `/` redirects to `/en`.
- **RTL by construction.** Logical Tailwind utilities (`ms-`, `pe-`, `start-`) everywhere; directional art uses `.rtl-flip`. Numbers and dates go through `Intl` with `ar-SA-u-ca-gregory-nu-arab` so Arabic shows Arabic-Indic digits on the Gregorian calendar.
- **Provenance is data.** Facts are `Sourced<T>` objects; the UI renders their badge and source link from the data, so a fact cannot be shown without its source.
- **Pure pricing engine.** `src/lib/pricing.ts` is side-effect free and unit-tested: daily rate × days, duration savings, extras, cover, young driver, one-way and airport fees, promo, VAT 15%.
- **URL as state** for search filters and trips, so results are shareable and the language switch keeps them.
- **Static output.** Everything pre-renders; there is no server-side data access in the prototype.

## Proposed production architecture

```
 Browser (Next.js, CDN edge cache)
     │  HTTPS, CSP, HSTS
     ▼
 BFF / API gateway  ── WAF, rate limiting, bot protection
     │
     ├─ Reservation service ──► existing rental core (via authorised API)
     ├─ Pricing service ──────► tariffs, promotions, corporate contracts
     ├─ Customer service ─────► identity (Nafath / national SSO), consent store
     ├─ Payments ─────────────► PCI-DSS compliant gateway (hosted fields / tokenisation; no card data in our systems)
     ├─ Corporate service ────► leasing contracts, fleet telemetry, invoices
     └─ Content service ──────► headless CMS with verified-content workflow (see docs/schema.sql)
 Data: PostgreSQL (in-Kingdom region), Redis cache, object storage; audit log; observability (OpenTelemetry)
```

Hosting should be in a Saudi cloud region to align with data-residency expectations. The `/platform` page in the app
presents this diagram with the status of each control.

## What would change to go live

1. Replace `src/lib/store.tsx` with API calls behind authenticated sessions.
2. Move pricing to the server; the client engine becomes a preview only.
3. Replace mock vehicles and SVG art with licensed brand imagery, or keep the art system as a fallback.
4. Wire the admin CMS to the content service with real RBAC and approval workflow.
5. Replace the deterministic concierge with a governed model, keeping the deterministic parser as a guard rail.
