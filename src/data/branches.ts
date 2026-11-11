/**
 * Branch data.
 *
 * Branch names and street-level descriptions were read on 2026-11-11 from the
 * public Budget worldwide location directory (budget.com/en/locations/sa/...).
 * Opening hours are only shown where the directory published them.
 * Map pins are placed at the CITY level (approximate city centre), not at the
 * branch address, so the map never implies a precise location we have not verified.
 */

export type BranchKind = "airport" | "city" | "rail" | "delivery";

export interface Branch {
  id: string;
  city: string;
  name: string;
  nameAr?: string;
  kind: BranchKind;
  address: string;
  phone?: string;
  hours?: string;
  source: string;
}

export interface City {
  id: string;
  name: string;
  nameAr: string;
  lat: number;
  lon: number;
  region: string;
  /** true when only city-level presence is verified (no branch detail captured). */
  presenceOnly?: boolean;
}

const dir = (c: string, code?: string) =>
  `https://www.budget.com/en/locations/sa/${c}${code ? `/${code}` : ""}`;

export const cities: City[] = [
  { id: "riyadh", name: "Riyadh", nameAr: "الرياض", lat: 24.71, lon: 46.68, region: "Central" },
  { id: "jeddah", name: "Jeddah", nameAr: "جدة", lat: 21.54, lon: 39.17, region: "Western" },
  { id: "dammam", name: "Dammam", nameAr: "الدمام", lat: 26.42, lon: 50.09, region: "Eastern" },
  { id: "makkah", name: "Makkah", nameAr: "مكة المكرمة", lat: 21.39, lon: 39.86, region: "Western", presenceOnly: true },
  { id: "madinah", name: "Madinah", nameAr: "المدينة المنورة", lat: 24.47, lon: 39.61, region: "Western", presenceOnly: true },
  { id: "khobar", name: "Al Khobar", nameAr: "الخبر", lat: 26.28, lon: 50.21, region: "Eastern", presenceOnly: true },
  { id: "alula", name: "AlUla", nameAr: "العلا", lat: 26.61, lon: 37.92, region: "Western", presenceOnly: true },
  { id: "abha", name: "Abha", nameAr: "أبها", lat: 18.22, lon: 42.5, region: "Southern", presenceOnly: true },
  { id: "tabuk", name: "Tabuk", nameAr: "تبوك", lat: 28.38, lon: 36.57, region: "Northern", presenceOnly: true },
  { id: "taif", name: "Taif", nameAr: "الطائف", lat: 21.27, lon: 40.42, region: "Western", presenceOnly: true },
  { id: "hail", name: "Hail", nameAr: "حائل", lat: 27.52, lon: 41.69, region: "Northern", presenceOnly: true },
  { id: "buraidah", name: "Buraidah", nameAr: "بريدة", lat: 26.33, lon: 43.97, region: "Central", presenceOnly: true },
  { id: "jazan", name: "Jazan", nameAr: "جازان", lat: 16.89, lon: 42.55, region: "Southern", presenceOnly: true },
  { id: "najran", name: "Najran", nameAr: "نجران", lat: 17.49, lon: 44.13, region: "Southern", presenceOnly: true },
  { id: "yanbu", name: "Yanbu", nameAr: "ينبع", lat: 24.09, lon: 38.06, region: "Western", presenceOnly: true },
  { id: "jubail", name: "Jubail", nameAr: "الجبيل", lat: 27.0, lon: 49.66, region: "Eastern", presenceOnly: true },
  { id: "hofuf", name: "Al Hofuf", nameAr: "الهفوف", lat: 25.38, lon: 49.59, region: "Eastern", presenceOnly: true },
  { id: "kaec", name: "KAEC", nameAr: "مدينة الملك عبدالله الاقتصادية", lat: 22.45, lon: 39.13, region: "Western", presenceOnly: true },
  { id: "arar", name: "Arar", nameAr: "عرعر", lat: 30.98, lon: 41.04, region: "Northern", presenceOnly: true },
  { id: "aljouf", name: "Al Jouf", nameAr: "الجوف", lat: 29.97, lon: 40.2, region: "Northern", presenceOnly: true },
  { id: "albaha", name: "Al Baha", nameAr: "الباحة", lat: 20.01, lon: 41.47, region: "Southern", presenceOnly: true },
  { id: "khamis", name: "Khamis Mushait", nameAr: "خميس مشيط", lat: 18.3, lon: 42.73, region: "Southern", presenceOnly: true },
  { id: "alwajh", name: "Al Wajh", nameAr: "الوجه", lat: 26.24, lon: 36.45, region: "Northern", presenceOnly: true },
  { id: "umluj", name: "Umluj", nameAr: "أملج", lat: 25.02, lon: 37.27, region: "Western", presenceOnly: true },
  { id: "hafar", name: "Hafar Al Batin", nameAr: "حفر الباطن", lat: 28.43, lon: 45.96, region: "Eastern", presenceOnly: true },
];

export const branches: Branch[] = [
  // Riyadh
  { id: "ruh-t5", city: "riyadh", name: "Riyadh Airport T5", nameAr: "مطار الرياض صالة 5", kind: "airport", address: "Riyadh Airport T5, Riyadh 60601", source: dir("riyadh") },
  { id: "ruh-intl", city: "riyadh", name: "Riyadh Int'l Airport (T1, T2, International)", nameAr: "مطار الرياض الدولي", kind: "airport", address: "International Airport, T1, T2, International Terminal, Riyadh 60601", source: dir("riyadh") },
  { id: "ruh-aa6", city: "riyadh", name: "Riyadh Int'l Airport T1 – At Your Door", nameAr: "مطار الرياض صالة 1 – خدمة التوصيل", kind: "delivery", address: "At Your Door Service, Riyadh 12613", phone: "920004124", hours: "Sat–Thu 08:00–13:00 & 14:00–18:00 (as published; Friday not listed)", source: dir("riyadh", "aa6") },
  { id: "ruh-murabba", city: "riyadh", name: "Murabbah District", nameAr: "حي المربع", kind: "city", address: "Prince Abdulaziz Bin Jalwa Street, Al Murabba, Riyadh", source: dir("riyadh") },
  { id: "ruh-kar", city: "riyadh", name: "King Abdullah Road", nameAr: "طريق الملك عبدالله", kind: "city", address: "King Abdullah Road, Al Mughrizat, Riyadh 12481", source: dir("riyadh") },
  { id: "ruh-dtn", city: "riyadh", name: "Riyadh Downtown (Khurais Rd)", nameAr: "وسط الرياض – طريق خريص", kind: "city", address: "Khurais Branch Road, Al Rayyan, opp. Carrefour, Riyadh 14221", source: dir("riyadh") },
  { id: "ruh-quds", city: "riyadh", name: "Eastern Ring Road (Exit 10)", nameAr: "الطريق الدائري الشرقي – مخرج 10", kind: "city", address: "Eastern Ring Road, Exit 10, Al Quds, Riyadh", source: dir("riyadh") },
  { id: "ruh-oruba", city: "riyadh", name: "Al Urubah Road", nameAr: "طريق العروبة", kind: "city", address: "Al Urubah Road, Al Raed, near Panda, Riyadh 12351", source: dir("riyadh") },
  { id: "ruh-salam", city: "riyadh", name: "Al Salam", nameAr: "حي السلام", kind: "city", address: "Prince Saad Abdulrahman Rd, Al Salam District, Riyadh 14226", source: dir("riyadh") },
  { id: "ruh-hilton", city: "riyadh", name: "Riyadh Hilton", nameAr: "هيلتون الرياض", kind: "city", address: "Abi Jafar Al Mansour St, Eastern Ring Rd, Granada, Riyadh 13421", source: dir("riyadh") },
  { id: "ruh-ishbilia", city: "riyadh", name: "Ishbilia", nameAr: "إشبيليا", kind: "city", address: "Al Sahaba Rd, Ishbilia District, Riyadh 13226", source: dir("riyadh") },
  { id: "ruh-yasmin", city: "riyadh", name: "Al Yasmin (King Abdulaziz Rd)", nameAr: "الياسمين", kind: "city", address: "King Abdulaziz Road, Al Sahafah, next to Bank Albilad, Riyadh 13321", source: dir("riyadh") },
  { id: "ruh-qiddiya", city: "riyadh", name: "Tuwaiq – Qiddiya", nameAr: "طويق – القدية", kind: "city", address: "Tuwaiq Al Qiddiyah, Riyadh 14963", source: dir("riyadh") },
  // Jeddah
  { id: "jed-kaia", city: "jeddah", name: "King Abdulaziz Int'l Airport", nameAr: "مطار الملك عبدالعزيز الدولي", kind: "airport", address: "King Abdulaziz International Airport (KAIA), Jeddah", source: dir("jeddah") },
  { id: "jed-train", city: "jeddah", name: "Haramain Train Station", nameAr: "محطة قطار الحرمين", kind: "rail", address: "Sulaimania, opp. King Abdulaziz University, Jeddah", source: dir("jeddah") },
  { id: "jed-hamra", city: "jeddah", name: "Al Hamra – Palestine Road", nameAr: "الحمراء – شارع فلسطين", kind: "city", address: "Palestine Road, Al Hamra District, Jeddah", source: dir("jeddah") },
  { id: "jed-tahliya", city: "jeddah", name: "Tahliya Street", nameAr: "شارع التحلية", kind: "city", address: "Tahliya St, Al Faisaliyah, Jeddah 23444", source: dir("jeddah") },
  { id: "jed-hilton", city: "jeddah", name: "Hilton Hotel – Corniche Rd", nameAr: "فندق هيلتون – الكورنيش", kind: "city", address: "Hilton Hotel, Corniche Road, Jeddah 21415", source: dir("jeddah") },
  { id: "jed-salamah", city: "jeddah", name: "Al Salamah", nameAr: "حي السلامة", kind: "city", address: "Prince Sultan St, Al Salamah, Jeddah 21415", source: dir("jeddah") },
  { id: "jed-hamdania", city: "jeddah", name: "Al Hamdaniyah", nameAr: "الحمدانية", kind: "city", address: "Hamdaniya Main Street, Jeddah 23719", source: dir("jeddah") },
  { id: "jed-ads", city: "jeddah", name: "Jeddah – At Your Door", nameAr: "جدة – خدمة التوصيل", kind: "delivery", address: "At Your Door Service, Jeddah", source: dir("jeddah") },
  // Dammam
  { id: "dmm-a5k", city: "dammam", name: "Dammam – Khobar Coastal Rd", nameAr: "الدمام – طريق الخبر الساحلي", kind: "city", address: "Dammam–Al Khobar Coastal Rd, near Bahrain Bridge, Dammam 34718", source: dir("dammam") },
  { id: "dmm-dtn", city: "dammam", name: "Dammam Downtown (King Saud Rd)", nameAr: "وسط الدمام – طريق الملك سعود", kind: "city", address: "King Saud Road, Al Qashlah, Dammam", source: dir("dammam") },
  { id: "dmm-manar", city: "dammam", name: "Al Manar", nameAr: "حي المنار", kind: "city", address: "Al Manar District, Dammam 32274", source: dir("dammam") },
  { id: "dmm-ads", city: "dammam", name: "Dammam – At Your Door", nameAr: "الدمام – خدمة التوصيل", kind: "delivery", address: "At Your Door Service, Dammam", source: dir("dammam") },
];

/** Booking pickers need at least one bookable point per city. Presence-only cities get a generic "City branch" placeholder that is labelled as such. */
export function branchesForCity(cityId: string): Branch[] {
  const list = branches.filter((b) => b.city === cityId);
  if (list.length) return list;
  const c = cities.find((x) => x.id === cityId);
  return [
    {
      id: `${cityId}-city`,
      city: cityId,
      name: `${c?.name ?? cityId} – city branch (details unverified)`,
      nameAr: `${c?.nameAr ?? cityId} – فرع المدينة (التفاصيل غير مؤكدة)`,
      kind: "city",
      address: "Branch address not verified for this prototype",
      source: dir(cityId),
    },
  ];
}

export function findBranch(id: string): Branch | undefined {
  if (!id) return undefined;
  const b = branches.find((x) => x.id === id);
  if (b) return b;
  if (id.endsWith("-city")) return branchesForCity(id.replace(/-city$/, ""))[0];
  return undefined;
}

export const findCity = (id: string) => cities.find((c) => c.id === id);
