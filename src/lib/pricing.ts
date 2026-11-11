/**
 * ILLUSTRATIVE PRICING ENGINE — all rates, fees and discount steps are mock
 * values for demonstration. The only real-world constant is the standard
 * Saudi VAT rate of 15%. Pure functions so they can be unit-tested and later
 * swapped for a server-side quote API without touching UI code.
 */
import type { Vehicle } from "@/data/vehicles";

export const VAT_RATE = 0.15;
export const GRACE_MINUTES = 59;
export const AIRPORT_FEE_RATE = 0.1; // mock
export const ONE_WAY_FEE = 250; // mock, SAR flat

export type ExtraId = "additionalDriver" | "childSeat" | "boosterSeat" | "gps" | "wifi";
export type CoverId = "standard" | "super" | "premium";

export const EXTRAS: Record<ExtraId, { perDay: number; maxCharge?: number; maxQty: number }> = {
  additionalDriver: { perDay: 25, maxQty: 3 },
  childSeat: { perDay: 20, maxCharge: 200, maxQty: 3 },
  boosterSeat: { perDay: 15, maxCharge: 150, maxQty: 3 },
  gps: { perDay: 20, maxCharge: 300, maxQty: 1 },
  wifi: { perDay: 30, maxQty: 1 },
};

export const COVERS: Record<CoverId, { perDay: number; excess: number }> = {
  standard: { perDay: 0, excess: 2500 },
  super: { perDay: 45, excess: 500 },
  premium: { perDay: 75, excess: 0 },
};

export interface QuoteInput {
  vehicle: Pick<Vehicle, "dailyRate" | "kmPerDay">;
  pickupAt: Date;
  returnAt: Date;
  extras?: Partial<Record<ExtraId, number>>;
  cover?: CoverId;
  airportPickup?: boolean;
  oneWay?: boolean;
  youngDriver?: boolean; // 21–24, mock surcharge
  promoPct?: number; // 0–100, for demo codes only
}

export interface Line {
  key: string;
  label: string;
  amount: number;
  detail?: string;
}

export interface Quote {
  days: number;
  baseDaily: number;
  durationDiscountPct: number;
  lines: Line[];
  subtotal: number;
  vat: number;
  total: number;
  includedKm: number;
  excess: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Rental days, billed in 24h blocks with a 59-minute grace period. Minimum one day. */
export function rentalDays(pickupAt: Date, returnAt: Date): number {
  const ms = returnAt.getTime() - pickupAt.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  const minutes = ms / 60000;
  const days = Math.ceil((minutes - GRACE_MINUTES) / 1440);
  return Math.max(1, days);
}

/** Mock length-of-rental discount. */
export function durationDiscount(days: number): number {
  if (days >= 28) return 25;
  if (days >= 14) return 15;
  if (days >= 7) return 10;
  if (days >= 3) return 5;
  return 0;
}

export function quote(input: QuoteInput): Quote {
  const days = rentalDays(input.pickupAt, input.returnAt);
  const cover = COVERS[input.cover ?? "standard"];
  const lines: Line[] = [];
  const baseDaily = input.vehicle.dailyRate;

  const rental = baseDaily * days;
  lines.push({ key: "rental", label: "rental", amount: rental, detail: `${days} × ${baseDaily}` });

  const dPct = durationDiscount(days);
  if (dPct) lines.push({ key: "duration", label: "durationDiscount", amount: -round2((rental * dPct) / 100), detail: `${dPct}%` });

  if (input.promoPct && input.promoPct > 0) {
    const afterDuration = rental * (1 - dPct / 100);
    lines.push({ key: "promo", label: "promo", amount: -round2((afterDuration * Math.min(input.promoPct, 50)) / 100), detail: `${input.promoPct}%` });
  }

  if (cover.perDay) lines.push({ key: "cover", label: `cover_${input.cover}`, amount: cover.perDay * days, detail: `${days} × ${cover.perDay}` });

  for (const [id, qtyRaw] of Object.entries(input.extras ?? {}) as [ExtraId, number][]) {
    const def = EXTRAS[id];
    const qty = Math.max(0, Math.min(def.maxQty, Math.floor(qtyRaw || 0)));
    if (!qty) continue;
    const perUnit = def.maxCharge ? Math.min(def.perDay * days, def.maxCharge) : def.perDay * days;
    lines.push({ key: `extra_${id}`, label: id, amount: perUnit * qty, detail: `${qty} × ${perUnit}` });
  }

  if (input.youngDriver) lines.push({ key: "young", label: "youngDriver", amount: 30 * days, detail: `${days} × 30` });
  if (input.oneWay) lines.push({ key: "oneway", label: "oneWay", amount: ONE_WAY_FEE });

  const preFee = lines.reduce((s, l) => s + l.amount, 0);
  if (input.airportPickup) lines.push({ key: "airport", label: "airportFee", amount: round2(preFee * AIRPORT_FEE_RATE), detail: "10%" });

  const subtotal = round2(lines.reduce((s, l) => s + l.amount, 0));
  const vat = round2(subtotal * VAT_RATE);
  return {
    days,
    baseDaily,
    durationDiscountPct: dPct,
    lines: lines.map((l) => ({ ...l, amount: round2(l.amount) })),
    subtotal,
    vat,
    total: round2(subtotal + vat),
    includedKm: input.vehicle.kmPerDay * days,
    excess: cover.excess,
  };
}

/** Demo-only promo codes. Clearly fictional. */
export const DEMO_CODES: Record<string, number> = { DEMO10: 10, CONCEPT15: 15 };

/* ---------------------------------------------------------------- WAFI demo */
/**
 * ILLUSTRATIVE "progressive discount" model for the WAFI calculator.
 * The real WAFI terms are not published in a form we could verify; these
 * steps exist only to show how a progressive structure could be explained.
 */
export const WAFI_STEPS = [
  { fromMonth: 1, pct: 0 },
  { fromMonth: 4, pct: 5 },
  { fromMonth: 7, pct: 10 },
  { fromMonth: 13, pct: 15 },
  { fromMonth: 25, pct: 20 },
];

export function wafiSchedule(monthlyRate: number, months: number) {
  const rows: { month: number; pct: number; amount: number }[] = [];
  for (let m = 1; m <= months; m++) {
    const step = [...WAFI_STEPS].reverse().find((s) => m >= s.fromMonth)!;
    rows.push({ month: m, pct: step.pct, amount: round2(monthlyRate * (1 - step.pct / 100)) });
  }
  const subtotal = round2(rows.reduce((s, r) => s + r.amount, 0));
  const undiscounted = round2(monthlyRate * months);
  const vat = round2(subtotal * VAT_RATE);
  return { rows, subtotal, undiscounted, saved: round2(undiscounted - subtotal), vat, total: round2(subtotal + vat) };
}

/* ---------------------------------------------------------------- Leasing demo */
export function leaseEstimate(opts: { vehicles: number; months: 24 | 36 | 48; tier: "essential" | "business" | "executive" }) {
  const base = { essential: 1650, business: 2450, executive: 4900 }[opts.tier];
  const termAdj = { 24: 1.08, 36: 1, 48: 0.94 }[opts.months];
  const volumeAdj = opts.vehicles >= 100 ? 0.88 : opts.vehicles >= 50 ? 0.92 : opts.vehicles >= 10 ? 0.96 : 1;
  const perVehicle = round2(base * termAdj * volumeAdj);
  const monthly = round2(perVehicle * opts.vehicles);
  return { perVehicle, monthly, contract: round2(monthly * opts.months), vatMonthly: round2(monthly * VAT_RATE) };
}

export function chauffeurEstimate(opts: { cls: "business" | "first" | "van"; hours: number; intercityKm?: number }) {
  const hourly = { business: 160, first: 320, van: 220 }[opts.cls];
  const hours = Math.max(3, Math.round(opts.hours));
  const km = Math.max(0, opts.intercityKm ?? 0) * { business: 2.2, first: 3.8, van: 2.8 }[opts.cls];
  const subtotal = round2(hourly * hours + km);
  return { hours, hourly, subtotal, vat: round2(subtotal * VAT_RATE), total: round2(subtotal * (1 + VAT_RATE)) };
}
