/**
 * VERIFIED CONTENT INVENTORY
 * --------------------------------------------------------------------------
 * Every item below was read from a public page on 2026-11-11 and carries its
 * source URL. Nothing here is invented. Items are tagged with a provenance:
 *
 *   "verified"  – stated on a public page at the source URL.
 *   "expired"   – verified, but its published validity window has ended.
 *   "undated"   – verified text, but no validity window is published, so the
 *                 prototype must NOT present it as a currently active offer.
 *
 * Simulated / mock data lives in src/data/* and is tagged "mock" there.
 * Proposed product features are documented in docs/DISCOVERY.md.
 *
 * This shape maps 1:1 to the `content_item` table in docs/schema.sql.
 */

export type Provenance = "verified" | "expired" | "undated";

export interface Sourced<T> {
  value: T;
  source: string;
  retrieved: string; // ISO date
  provenance: Provenance;
  note?: string;
}

const R = "2026-11-11";
const S = {
  home: "https://www.budgetsaudi.com/en/",
  about: "https://www.budgetsaudi.com/budget-SA/en_SA/contact-budget/About-Budget",
  contact: "https://www.budgetsaudi.com/en/contact-budget",
  services: "https://www.budgetsaudi.com/en/services",
  leasing: "https://www.budgetsaudi.com/en/services/corporate-leasing",
  loyalty: "https://www.budgetsaudi.com/en/services/budget-saudi-loyalty-program",
  quickpass: "https://www.budgetsaudi.com/en/services/Quick-Pass--EN",
  preowned: "https://www.budgetsaudi.com/en/services/pre-owned-car-sales",
  chauffeur: "https://www.budgetsaudi.com/en/services/Email-enquiry-Chauffeur",
  promos: "https://www.budgetsaudi.com/en/promotions",
  ir: "https://www.budgetsaudi.com/en/Investor-Relations",
  wafi: "https://wafi.budgetsaudi.com/",
  mubasher: "https://english.mubasher.info/markets/TDWL/stocks/4260/profile",
  argaam: "https://www.argaam.com/en/bf/budget-saudi/overview",
  globalLocations: "https://www.budget.com/en/locations/sa",
};

const v = <T,>(value: T, source: string, provenance: Provenance = "verified", note?: string): Sourced<T> => ({
  value,
  source,
  retrieved: R,
  provenance,
  ...(note ? { note } : {}),
});

export const SOURCES = S;
export const RETRIEVED = R;

/* ------------------------------------------------------------------ Company */
export const company = {
  legalName: v("United International Transportation Company", S.home),
  brandOperator: v("Unitrans Group – flagship brand Budget Saudi", S.about),
  founded: v("1978", S.about, "verified", "“Founded in 1978 with one rental office, 20 cars, and a team of 15 employees.”"),
  establishedDate: v("1978-12-17", S.mubasher),
  listed: v("Saudi Exchange (Tadawul) since September 2007", S.mubasher),
  ticker: v("4260", S.mubasher),
  headOffice: v(
    "Building No. 6695, King Abdul Aziz Road, Al-Basatin District 3, Unit 92, Jeddah 23719-4327, Kingdom of Saudi Arabia",
    S.contact,
  ),
  regionalOffices: v(["Riyadh", "Dammam"], S.about),
  vision: v("To be the leading and first choice vehicle leasing and mobility provider in Saudi Arabia.", S.about),
  mission: v("To achieve customer excitement and confidence by focusing on quality, reliability, and cost efficiency.", S.about),
  slogan: v("Keep Moving", S.about),
  rentalOffices: v("120+", S.about),
  employees: v("1,700+", S.about),
  groupFleet: v("54,000+ (approx., combined Unitrans Group fleet)", S.about),
  branchCities: v("27", S.about),
  airportOffices: v("20+ in 17 cities", S.about),
  workshops: v("20+ workshops and 80+ mobile workshops", S.about),
  railStations: v(["Jeddah", "Makkah", "Madinah", "KAEC"], S.about),
  acquisitions: v(
    ["Acquisition of AutoWorld", "Acquisition of a major stake in GES Logistics"],
    S.about,
    "verified",
    "No dates are published for these transactions on the About page.",
  ),
  activities: v(
    [
      "Car rental",
      "Car leasing",
      "Pre-owned car sales",
      "International and domestic reservations",
      "Cross-border rentals",
      "Chauffeur-driven and premier limousine services",
    ],
    S.about,
  ),
  globalNetwork: v("11,000 locations across 165 countries (Budget worldwide network)", S.home),
};

/* ------------------------------------------------------------------ Contact */
export const contact = {
  reservations: v("920004124", S.contact, "verified", "Sat–Thu 09:00–22:00, Fri 17:00–22:00"),
  reservationsHours: v("Saturday to Thursday 09:00 to 22:00, Friday 17:00 to 22:00", S.contact),
  customerServices: v("+966 12 692 7070 ext. 1463", S.contact, "verified", "08:30–16:30, Sunday to Thursday"),
  email: v("bccc@budgetsaudi.com", S.contact),
  roadside: v("800 244 3399", S.contact, "verified", "Open 24 hours a day, 7 days a week."),
  corporateSales: v("+966 12 692 7070 ext. 1444", S.contact),
  salesEmail: v("sales@budgetsaudi.com", S.contact),
  resolutionWindow: v("5 to 30 days", S.contact),
};

/* ------------------------------------------------------------------ Services */
export const services = v(
  [
    "Corporate Leasing",
    "Budget Saudi Loyalty Program",
    "Chauffeur Service",
    "Customer Registration Form",
    "Short Term Rentals",
    "Used Car Sale",
    "Mobile App",
    "Quick Pass at Airport",
  ],
  S.services,
);

export const homeClaims = {
  freeCancellation: v("Enjoy free, no-fuss cancellations", S.home, "verified", "Exact refund conditions are governed by the booking terms."),
  extras: v(["Additional drivers", "One-way rentals", "GPS", "Mobile Wi-Fi"], S.home),
  minAgeCheckbox: v("Driver aged over 21", S.home),
};

/* ------------------------------------------------------------------ Leasing */
export const leasing = {
  lowerPayments: v("Payments 20%–30% lower than for a purchase loan for the same car and same term", S.leasing),
  refreshCycle: v("Refresh vehicles every two to four years, depending on lease length", S.leasing),
  noDownPayment: v("No down payment option", S.leasing),
  credit: v("Credit facility of 30 days", S.leasing),
  mileage: v("Unlimited mileage on all lease cars without any excess mileage charges during the lease tenure", S.leasing),
  delivery: v("New vehicles delivered within 15 working days (plus up to 9 working days if registration is delayed); subject to dealer availability", S.leasing),
  buyback: v("Buyback option of the lease cars to company employees at the prevailing market value", S.leasing),
  maintenance: v("Periodic maintenance included; first service at 5,000 km, then every 15,000 km (petrol) or 14,000 km (diesel); tyres roughly every 50,000 km", S.leasing),
  towing: v("Free towing within 350 km of any Budget office", S.leasing),
  insurance: v("Comprehensive cover incl. unlimited third-party cover up to SAR 10 million; minimum deductible SAR 2,500", S.leasing),
  roadside: v("24/7/365 roadside assistance — breakdowns, fuel recovery, tyre changes, battery boosts", S.leasing),
  replacement: v("Immediate replacement vehicles after accidents or breakdowns", S.leasing),
  crossBorder: v("Lease cars may be driven in the Middle East after paying the insurance required under that country's laws", S.leasing),
  corporateRates: v("Special corporate rental tariffs across 101 locations in Saudi Arabia", S.leasing, "verified", "The About page separately states 120+ rental offices; the two figures were published at different times."),
};

/* ------------------------------------------------------------------ Loyalty */
export const loyaltyTiers = v(
  [
    { tier: "Silver", kmDaily: 250, kmMonthly: 7000, discountPct: 3 },
    { tier: "Gold", kmDaily: 300, kmMonthly: 8000, discountPct: 7 },
    { tier: "Platinum", kmDaily: 350, kmMonthly: 9000, discountPct: 12 },
  ],
  S.loyalty,
  "verified",
  "Discount applies to the walk-in rate. Earn 1 point per SAR 100 spent; points do not expire; redeem in slabs of 50/100/200/500. Minimum age 21 with a valid Saudi driving licence.",
);

/* ------------------------------------------------------------------ Quick Pass */
export const quickPass = {
  what: v("A fast-track airport lane for eligible Budget customers — exclusively for Corporate and Gold & Platinum customers, free of charge", S.quickpass),
  airports: v(
    [
      { airport: "Riyadh", phone: "057-388-0459" },
      { airport: "Jeddah", phone: "057-389-1972" },
      { airport: "Dammam", phone: "054-030-9790" },
    ],
    S.quickpass,
  ),
};

/* ------------------------------------------------------------------ Pre-owned */
export const preOwned = {
  pitch: v("All pre-owned cars undergo a thorough quality inspection; Budget assists with the legal formalities of ownership transfer.", S.preowned),
  marketplace: v("https://mazad.budgetsaudi.com", S.preowned),
};

/* ------------------------------------------------------------------ Chauffeur */
export const chauffeur = v(
  "“Chauffeur Drive” — chauffeur-driven cars bookable at nearly all Budget locations in the Kingdom, for business trips, events or city outings.",
  S.chauffeur,
);

/* ------------------------------------------------------------------ WAFI */
export const wafi = {
  title: v("WAFI long-term car rental program", S.wafi),
  headline: v("Car Rental — Progressive Discount", S.wafi),
  contactPhone: v("920004124", S.wafi),
  contactEmail: v("bccc@budgetsaudi.com", S.wafi),
  termsAvailable: v(false, S.wafi, "verified", "The public page shows a “Key Terms” heading but no terms could be read. Durations, discount steps and eligibility are NOT published in a form we could verify."),
};

/* ------------------------------------------------------------------ Promotions */
export interface Promo {
  id: string;
  title: string;
  detail?: string;
  source: string;
  validity?: string;
  provenance: Provenance;
}

export const promotions: Promo[] = [
  {
    id: "alula",
    title: "AlUla – Visitors Offer",
    detail: "Additional 12% discount on walk-in rental rates + 300 km mileage allowance per day. Valid at all rental locations in KSA; cannot be combined with other offers or corporate discounts.",
    source: "https://www.budgetsaudi.com/en/promotions/AlUla-Visitors-EN",
    provenance: "undated",
  },
  {
    id: "unlimited",
    title: "Unlimited Miles",
    detail: "Applicable on daily rental only; valid at all rental locations in KSA; cannot be combined with other promotional offers or corporate discount.",
    source: "https://www.budgetsaudi.com/en/promotions/Unlimited-Miles",
    provenance: "undated",
  },
  {
    id: "alrajhi",
    title: "Al Rajhi Bank employees – 15% additional discount on walk-in rates",
    source: "https://www.budgetsaudi.com/en/promotions/Al-Rajhi-EMP---EN-AR",
    provenance: "undated",
  },
  {
    id: "moh",
    title: "Ministry of Health employees – 18% additional discount on walk-in rates",
    source: S.promos,
    provenance: "undated",
  },
  {
    id: "rcu",
    title: "Special offer for RCU employees",
    source: "https://www.budgetsaudi.com/en/promotions/RCU-EMP---Contractors--EN-",
    provenance: "undated",
  },
  {
    id: "chauffeur-intercity",
    title: "Travel between cities in the Kingdom with private chauffeur services",
    source: "https://www.budgetsaudi.com/en/promotions/CarwithDriver---EN",
    provenance: "undated",
  },
  {
    id: "leasing-promo",
    title: "Long-term leasing solutions tailored to your business needs",
    detail: "“Expand your fleet without tying up your cash flow.”",
    source: S.promos,
    provenance: "undated",
  },
  {
    id: "used-installments",
    title: "Own your used car with easy installments",
    source: S.promos,
    provenance: "undated",
  },
  {
    id: "ramadan-2026",
    title: "Special Offer During Ramadan 2026",
    detail: "15% / 20% / 26% off walk-in rates for 2026 / 2025 / 2024 model years, plus 5% prepaid via app. 250 km/day. Commercial vehicles excluded.",
    source: "https://www.budgetsaudi.com/en/promotions/31--Ramadan-offer-2026",
    validity: "17-02-2026 to 19-03-2026",
    provenance: "expired",
  },
];

/* ------------------------------------------------------------------ Investor */
export const investor = {
  sections: v(["ESG", "Budget Saudi's Acquisition of AutoWorld"], S.ir),
  externalProfile: v(S.argaam, S.ir),
  note: v("No financial statements are reproduced in this prototype. Figures must be read from Saudi Exchange / official IR disclosures.", S.ir),
};

/* ------------------------------------------------------------------ Help */
export const helpTopics = v(
  {
    hiring: ["Collecting your vehicle", "Our top ten car hire tips", "Our rental agreement", "Guide to renting", "How to make a complaint"],
    motoring: ["Safe driving advice", "Driving while tired", "Driving while abroad", "Driving licence information", "Government motoring advice"],
  },
  "https://www.budgetsaudi.com/en/Help---Advice",
);

/* ------------------------------------------------------------------ Branch cities */
/** City list from the Budget worldwide locations directory (de-duplicated spellings). */
export const networkCities = v(
  [
    "AlUla", "Abha", "Al Baha", "Al Hasa", "Al Jouf", "Jubail", "Al Khobar", "Qatif", "Al Wajh", "Arar",
    "Bisha", "Buraidah", "Dammam", "Hafar Al Batin", "Hail", "Hofuf", "Jeddah", "Jazan", "KAEC",
    "Khamis Mushait", "Al Kharj", "Madinah", "Makkah", "Muhayil Aseer", "Najran", "Qaisumah",
    "Al Qunfudhah", "Rabigh", "Riyadh", "Tabuk", "Taif", "Turaif", "Umluj", "Yanbu",
  ],
  S.globalLocations,
  "verified",
  "The directory headline states “135 locations in 43 cities”; several entries are alternate spellings of the same city.",
);
