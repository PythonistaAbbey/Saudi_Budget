/**
 * Deterministic "AI Mobility Concierge" for the prototype. No external AI
 * service is called. It parses a free-text trip description (English or
 * Arabic) into structured needs, then ranks the mock inventory.
 */
import { cities } from "@/data/branches";
import { vehicles, type Category, type Vehicle } from "@/data/vehicles";

export interface Intent {
  pickupCity?: string;
  destination?: string;
  days?: number;
  passengers?: number;
  categories: Category[];
  wantsComfort: boolean;
  wantsOffroad: boolean;
  wantsEconomy: boolean;
  wantsLuxury: boolean;
  wantsElectric: boolean;
  family: boolean;
  longDistance: boolean;
}

export interface Recommendation {
  vehicle: Vehicle;
  reasons: string[]; // i18n keys
  score: number;
}

const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const normalizeDigits = (s: string) => s.replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));

const WORD_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, fourteen: 14, thirty: 30,
  "يوم": 1, "يومين": 2, "ثلاثة": 3, "اربعة": 4, "أربعة": 4, "خمسة": 5, "خمس": 5, "ستة": 6, "سبعة": 7, "عشرة": 10,
};

// Cities that are far apart → long-distance trip
const FAR = new Set(["alula", "tabuk", "abha", "jazan", "najran", "arar", "aljouf", "alwajh", "umluj"]);

export function parseIntent(raw: string): Intent {
  const text = normalizeDigits(raw.toLowerCase());
  const found: { id: string; idx: number }[] = [];
  for (const c of cities) {
    const names = [c.name.toLowerCase(), c.nameAr, c.id];
    if (c.id === "alula") names.push("al ula", "al-ula", "العلا");
    if (c.id === "makkah") names.push("mecca", "مكة");
    if (c.id === "madinah") names.push("medina", "المدينة");
    for (const n of names) {
      const idx = text.indexOf(n);
      if (idx >= 0) {
        found.push({ id: c.id, idx });
        break;
      }
    }
  }
  found.sort((a, b) => a.idx - b.idx);

  let days: number | undefined;
  const dm = text.match(/(\d+)\s*(day|days|night|nights|يوم|أيام|ايام|ليال|ليالي)/);
  if (dm) days = Number(dm[1]);
  const wm = text.match(/(\d+)\s*(week|weeks|أسبوع|اسبوع|أسابيع)/);
  if (wm) days = Number(wm[1]) * 7;
  const mm = text.match(/(\d+)\s*(month|months|شهر|أشهر|شهور)/);
  if (mm) days = Number(mm[1]) * 30;
  if (!days) {
    for (const [w, n] of Object.entries(WORD_NUM)) {
      if (new RegExp(`${w}[\\s-]*(day|days|أيام|ايام)`).test(text)) days = n;
    }
    if (/\bweek\b|أسبوع|اسبوع/.test(text) && !days) days = 7;
    if (/\bweekend\b|نهاية الأسبوع|ويكند/.test(text) && !days) days = 2;
  }

  let passengers: number | undefined;
  const pm = text.match(/(\d+)\s*(people|persons|passengers|adults|of us|أشخاص|اشخاص|ركاب|أفراد|افراد)/);
  if (pm) passengers = Number(pm[1]);

  const family = /family|kids|children|عائل|أطفال|اطفال|عيال/.test(text);
  const wantsComfort = /comfort|comfortable|relax|smooth|مريح|راحة/.test(text);
  const wantsOffroad = /desert|dune|offroad|off-road|4x4|4wd|camping|صحراء|طعس|كشتة|رمل|دفع رباعي/.test(text);
  const wantsEconomy = /cheap|budget|economy|affordable|save|اقتصادي|رخيص|توفير/.test(text);
  const wantsLuxury = /luxury|premium|vip|executive|wedding|فخم|فاخر|عرس|زواج|كبار/.test(text);
  const wantsElectric = /electric|ev\b|zero emission|كهربائي/.test(text);

  const categories: Category[] = [];
  if (/\bsuv\b|اس يو في|جيب|دفع/.test(text)) categories.push("suv");
  if (/van|minivan|people carrier|فان|باص/.test(text)) categories.push("family");
  if (/sedan|سيدان/.test(text)) categories.push("sedan");
  if (/pickup|pick-up|truck|بيك ?اب|ونيت|غمارتين/.test(text)) categories.push("pickup");
  if (wantsElectric) categories.push("electric");
  if (wantsLuxury) categories.push("luxury");

  const pickupCity = found[0]?.id;
  const destination = found[1]?.id;
  const longDistance = !!(destination && (FAR.has(destination) || FAR.has(pickupCity ?? ""))) || /road ?trip|رحلة برية|سفر/.test(text);

  return {
    pickupCity,
    destination,
    days,
    passengers: passengers ?? (family ? 5 : undefined),
    categories,
    wantsComfort,
    wantsOffroad,
    wantsEconomy,
    wantsLuxury,
    wantsElectric,
    family,
    longDistance,
  };
}

export function recommend(intent: Intent, limit = 3): Recommendation[] {
  const recs = vehicles
    .filter((v) => !intent.pickupCity || v.availableIn.includes(intent.pickupCity))
    .filter((v) => !intent.passengers || v.seats >= intent.passengers)
    .map((v) => {
      let score = v.rating * 10;
      const reasons: string[] = [];
      if (intent.categories.includes(v.category)) {
        score += 40;
        reasons.push("r_category");
      }
      if (intent.passengers && v.seats >= intent.passengers) {
        score += 10;
        reasons.push("r_seats");
      }
      if (intent.family && v.bags >= 4) {
        score += 15;
        reasons.push("r_luggage");
      }
      if (intent.wantsComfort && (v.category === "suv" || v.category === "luxury" || v.features.some((f) => /cruise|Ventilated/i.test(f)))) {
        score += 15;
        reasons.push("r_comfort");
      }
      if (intent.wantsOffroad) {
        if (v.features.some((f) => /4WD|AWD|xDrive/.test(f))) {
          score += 30;
          reasons.push("r_4wd");
        } else score -= 25;
      }
      if (intent.longDistance) {
        if (v.fuel === "hybrid" || v.kmPerDay >= 300) {
          score += 12;
          reasons.push("r_range");
        }
        if (v.fuel === "electric" && FAR.has(intent.destination ?? "")) score -= 30; // charging coverage on remote routes is uncertain
      }
      if (intent.wantsEconomy) score += Math.max(0, 40 - v.dailyRate / 10);
      if (intent.wantsLuxury && v.category !== "luxury") score -= 20;
      if (!intent.wantsLuxury && v.category === "luxury") score -= 15;
      if (intent.wantsElectric && v.fuel === "electric") score += 30;
      if (!intent.wantsOffroad && !intent.family && !intent.categories.length) score += Math.max(0, 20 - v.dailyRate / 25);
      if (!reasons.length) reasons.push("r_value");
      return { vehicle: v, reasons, score };
    })
    .sort((a, b) => b.score - a.score);
  return recs.slice(0, limit);
}
