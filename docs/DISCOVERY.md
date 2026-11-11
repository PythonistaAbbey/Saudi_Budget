# Discovery — public site research

Retrieved **11 November 2026**. Research was limited to public pages, read at a low request rate, with no login,
no form submissions, no private APIs and no security testing. `robots.txt` was respected. Every fact used in the
prototype lives in [`src/content/verified.ts`](../src/content/verified.ts) with its source URL.

## Sources read

| Source | Used for |
| --- | --- |
| budgetsaudi.com/en/ (home) | Navigation structure, service list, homepage claims |
| …/contact-budget/About-Budget | Founding, vision, mission, slogan, network size, rail stations, acquisitions |
| …/en/contact-budget | Head office address, customer care numbers and hours, emails |
| …/en/services and service sub-pages | Corporate leasing, loyalty tiers, Quick Pass, pre-owned sales, chauffeur |
| …/en/promotions and each offer page | Offer titles, conditions and (where published) validity windows |
| …/en/Investor-Relations | IR navigation only — no figures copied |
| wafi.budgetsaudi.com | WAFI programme title, headline, contact |
| budget.com/en/locations/sa | Public branch directory for Riyadh, Jeddah, Dammam |
| mubasher.info, argaam.com | Establishment date, Tadawul listing (ticker 4260), Payless licence, AutoWorld acquisition |

## Current site architecture (as observed)

- **Primary navigation (summarised):** Rent a car · Services (corporate leasing, chauffeur, pre-owned, loyalty, Quick Pass) · Promotions · Locations · Investor Relations · Contact. A separate sub-domain hosts WAFI.
- **Languages:** English and Arabic, as separate page trees.
- **Booking entry:** a search form (pick-up / return location, dates, times) on the homepage. We did **not** progress past the search form. Steps after search (vehicle selection, extras, driver details, payment) need a live reservation session and were deliberately not exercised. The prototype's booking flow is therefore a proposal, not a copy.
- **Corporate:** information pages plus email/phone contact; no self-service quote or dashboard is publicly visible.
- **Support:** contact page with phone, email and hours; roadside number; no public ticket tracking seen.

## Journey map (proposed)

```
Discover ─► Search ─► Compare ─► Select ─► Extras & cover ─► Driver ─► Review ─► Confirmation
   │                                                                              │
   └─ Concierge (natural language) ───────────────────────────────────────────────┘
After: My bookings (modify, cancel, invoice) · Support (tickets, roadside) · Loyalty
Corporate: Programme ─► Estimate ─► Enquiry / consultation ─► Proposal ─► Fleet dashboard
```

## Comparison: public site vs. concept

| Topic | Observed on public site | Concept proposal |
| --- | --- | --- |
| Homepage | Promotional banners and search form | Cinematic original scenes, search first, verified trust facts with sources |
| Search results | Not observed (needs live session) | Instant filters in the URL, sort, compare up to 3, "or similar" honesty |
| Price transparency | Not observed | Line-by-line breakdown, VAT 15%, duration savings, excess, included km |
| Arabic | Separate pages | One codebase, full RTL mirroring, Arabic numerals, language switch that keeps your page and query |
| Offers | Mix of dated and undated offers on one list | Expired and undated offers clearly labelled and never shown as active |
| Corporate | Information + contact | Estimator, validated enquiry, consultation slots, proposal download, fleet dashboard |
| Self-service | Not assessed (requires login) | Modify, cancel, invoice, preferences, booking lookup |
| Support | Phone/email | FAQ search, ticket tracking, roadside, contact form |
| Assistance | — | Concierge in English and Arabic |

## Verified vs. proposed vs. mock

| Category | Examples | Where |
| --- | --- | --- |
| **Verified** | Founded 1978; Tadawul since Sept 2007 (4260); 120+ offices; 27 cities; 920004124 (Sat–Thu 09:00–22:00, Fri 17:00–22:00); roadside 800 244 3399; loyalty Silver/Gold/Platinum; Quick Pass numbers; corporate leasing 5–30 day response | `src/content/verified.ts` |
| **Expired** | Ramadan offer 2026 (17-02-2026 to 19-03-2026) | shown with an "Expired" badge |
| **Undated** | AlUla visitors, Unlimited miles, Al Rajhi employees, MOH, RCU, intercity chauffeur, leasing, used-car instalments | shown with "Validity not published" |
| **Not verifiable** | WAFI key terms, durations and discount steps | the WAFI calculator is labelled illustrative |
| **Mock** | Vehicles and rates, availability, bookings, customer account, fleet company, tickets, used-car listings, admin data | `src/data/*`, `src/lib/store.tsx` |
| **Proposed** | Concierge, compare, fleet dashboard, ticket tracking, admin CMS, booking lookup | marked "Proposed feature" in the UI |

## Branches

Only branches listed in a public directory (budget.com) are shown, for Riyadh (13), Jeddah (7) and Dammam (4).
Opening hours are shown only where published. For the other cities in the published 27-city network, the locator
shows the city with "details unverified" rather than inventing an address.

## Items needing Budget Saudi's input

- Real fleet, tariffs, cover terms, deposits and excess levels.
- WAFI terms and eligibility.
- Current offers and their validity.
- Full branch list with hours and coordinates.
- Brand assets and photography (licensed use).
- Access to booking, payment, identity (e.g. Absher / Nafath) and CRM APIs, under a formal agreement.
