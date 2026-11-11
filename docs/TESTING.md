# Testing

Latest run: **11 November 2026**, against a production build (`next build` + `next start`), headless Chromium.

| Suite | Command | Result |
| --- | --- | --- |
| Type check | `npm run lint` (`tsc --noEmit`) | Pass |
| Unit (Vitest) | `npm test` | **35 / 35 passed** (4 files) |
| End-to-end (Playwright) | `npm run test:e2e` | **54 / 54 passed** (51 desktop 1440×900, 3 mobile Pixel 7) |
| Production build | `npm run build` | Pass — all routes pre-rendered for `en` and `ar` |
| Schema | `psql -f docs/schema.sql` on PostgreSQL 16 | Applies cleanly (13 tables) |

## What the tests cover

**Unit** (`tests/unit`)
- `pricing.test.ts` — trip validation (return before pick-up, past, over 90 days), 24-hour blocks with a 59-minute grace period, lines sum to subtotal with VAT 15%, length-of-rental discount, extras caps, included mileage, no negative totals, WAFI schedule, lease and chauffeur estimates.
- `search.test.ts` — every filter, both price sorts, URL parameter parsing.
- `concierge.test.ts` — intent parsing in English and Arabic (including Arabic-Indic digits), budget and luxury preferences.
- `content.test.ts` — every verified item has an https source and retrieval date; expired offers are never marked as plain verified; every branch belongs to a known city and cites a source; English and Arabic dictionaries have identical keys.

**End-to-end** (`tests/e2e`)
- `routes.spec.ts` — all 18 routes in both languages: HTTP 200, correct `dir`, disclaimer visible, an `h1`, no broken images, **no console or page errors**; root redirect; every internal link resolves.
- `booking.spec.ts` — full journey: search → filter → sort → select → extras → invalid then valid driver details → promo → confirm → My bookings → modify → cancel; date validation; reference lookup and invoice.
- `features.spec.ts` — language switch keeps page and query; compare caps at three; concierge; corporate form validation, proposal download and consultation; WAFI calculator; branch locator (map, city, search); expired offers never active; used cars filter/compare/inquiry; chauffeur request; support ticket tracking; admin RBAC and audit log.
- `responsive.spec.ts` — no horizontal overflow on any route at phone width in English and Arabic; mobile menu.

## Issues found and fixed during testing

- Price-sort assertion read the list before the re-sort rendered → the test now waits for the URL and polls.
- The chauffeur page baked "tomorrow" into the pre-rendered HTML at build time, which would go stale after deployment → the date is now set after mount.
- A run that reused a server from a previous build failed with mismatched chunks → always restart the server after a build.

## Not tested

- Real browsers other than Chromium (Safari/WebKit and Firefox were not run).
- Screen-reader walkthroughs; accessibility was checked through semantic markup and tests, not an audit.
- Performance budgets / Lighthouse scores.
- Anything involving Budget Saudi systems — there are no integrations.
