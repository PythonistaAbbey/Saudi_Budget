# Budget Saudi NEXT — independent concept prototype

> **Not affiliated with, or endorsed by, Budget Saudi (United International Transportation Company).**
> This is an unsolicited redesign concept. All prices, availability, accounts, reservations and dashboards are simulated.
> No real payments are taken, no identity documents are collected, and nothing connects to Budget Saudi systems.

A bilingual (English / Arabic RTL) interactive prototype that re-imagines the car rental, leasing and mobility website
around a cinematic homepage, a fast search-to-booking flow, self-service account tools and corporate dashboards.

## What is in it

| Area | Route | Notes |
| --- | --- | --- |
| Home | `/en`, `/ar` | Animated original SVG scenes (Riyadh night, AlUla, Red Sea), search widget, verified company facts |
| Find a car | `/find-a-car` | Category, passengers, luggage, transmission, fuel, price, features, sort; state in the URL |
| Vehicle details | `/vehicles/[id]` | 21 illustrative models ("or similar"), specs, simulated price breakdown |
| Booking & checkout | `/booking` | Extras, cover, child/booster seats, VAT 15%, validation, mock `DEMO-XXXXXX` reference |
| My bookings | `/my-bookings` | Fictional "Noura Demo" account: upcoming/previous, modify, cancel, invoice, saved cars, preferences, lookup |
| Corporate leasing | `/corporate` | Verified programme facts, illustrative estimator, validated enquiry form, downloadable mock proposal, consultation slots |
| Fleet dashboard | `/corporate/dashboard` | Synthetic fleet company: allocation, contracts, maintenance, expenses |
| WAFI | `/wafi` | Clearly labelled illustrative calculator; terms that could not be verified are marked as such |
| Branch locator | `/locations` | SVG Saudi map, city filters, search, map/list; only branches found in public directories, unverified details labelled |
| Offers | `/promotions` | Expired and undated offers are never shown as active |
| Used cars | `/used-cars` | Mock listings, filters, compare, inquiry; links to the public auction site |
| Chauffeur | `/chauffeur` | Request form with illustrative estimate |
| About | `/about` | Verified timeline (1978 → today) |
| Investors | `/investors` | Links to official disclosures only — no figures are invented |
| Support | `/support` | FAQ search, contact form, roadside, ticket tracking (TCK-1001, TCK-1002) |
| Compare | `/compare` | Up to three vehicles side by side |
| Concierge | `/concierge` + floating widget | Deterministic rule-based assistant (English and Arabic) |
| Admin (demo) | `/admin` | Prototype-only CMS with role-based permissions and an audit log |
| Platform & security | `/platform` | Target architecture and the privacy/security plan, with honest status per control |

Every public fact carries a provenance badge (verified / expired / validity not published) and a source link.
Simulated values carry a "Simulated" badge. See [docs/DISCOVERY.md](docs/DISCOVERY.md).

## Run it

Requires Node 20+.

```bash
npm install
npm run dev          # http://localhost:3000 (redirects to /en)
npm run build && npm start   # production build
```

### Static version (no server needed)

```bash
STATIC_EXPORT=1 npm run build   # writes a plain HTML/JS site to out/
cd out && python3 -m http.server 8080   # then open http://localhost:8080
```

For GitHub Pages (served from `https://<user>.github.io/Saudi_Budget/`), add the sub-path:
`STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/Saudi_Budget npm run build`, then publish `out/` (with an empty `.nojekyll`
file) to the `gh-pages` branch.

`out/` can be uploaded to any static host (GitHub Pages, Netlify, Cloudflare Pages, S3). Static hosts can't send the
security and `noindex` headers from `next.config.ts`, so every page also carries a `noindex` meta tag and `robots.txt`.

## Test it

```bash
npm run lint         # TypeScript type check
npm test             # Vitest unit tests
npm run test:e2e     # Playwright (builds are served with `next start` on port 3200; run `npm run build` first)
```

If Playwright cannot find its browser, point it at an installed Chromium:
`PW_CHROMIUM=/path/to/chromium npm run test:e2e`. Results are in [docs/TESTING.md](docs/TESTING.md).

## Demo script (about 8 minutes)

1. **Home** — let the scenes cycle, switch to العربية and back (the page and query are kept).
2. **Search** — Riyadh, 3 days, Find cars → filter SUV → sort by price → open a vehicle.
3. **Book** — add a child seat and Super cover, try promo `DEMO10`, enter driver details (try an invalid mobile first), confirm, open the invoice.
4. **My bookings** — modify the dates, then cancel; show loyalty and preferences.
5. **Corporate** — run the estimator, download the mock proposal, open the fleet dashboard.
6. **Concierge** — "family of 5 to AlUla for a week with lots of luggage".
7. **Offers** — point out expired and undated labels; **About** — verified timeline.
8. **Platform & security** — target architecture and what is *not* yet implemented.

Reset the demo data at any time from My bookings → "Reset demo data".

## Docs

- [docs/DISCOVERY.md](docs/DISCOVERY.md) — research of the public site, journey map, comparison, verified vs proposed vs mock
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — how the prototype is built and the proposed production architecture
- [docs/SECURITY.md](docs/SECURITY.md) — privacy and security by design (PDPL), and what remains
- [docs/schema.sql](docs/schema.sql) — PostgreSQL-ready data model
- [docs/TESTING.md](docs/TESTING.md) — test inventory and latest results

## Imagery and IP

All vehicle illustrations and scenes are original SVG drawn in code. No photographs, logos or design assets from
Budget Saudi or third parties are included. The Saudi Arabia outline uses Natural Earth data (public domain) via
`world-atlas`. Fonts are Inter and IBM Plex Sans Arabic (SIL Open Font License).

## Deployment

The site is fully static-renderable (`next build` pre-renders every page in both locales) and sends
`X-Robots-Tag: noindex` plus a `robots.txt` that disallows crawling. If you publish a preview, use a neutral
host name (for example a `*.vercel.app` or `*.pages.dev` project named `budget-concept-preview`), never a domain that
looks official.
