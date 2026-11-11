import { describe, expect, it } from "vitest";
import { quote, rentalDays, durationDiscount, wafiSchedule, leaseEstimate, chauffeurEstimate, VAT_RATE, EXTRAS } from "@/lib/pricing";

const v = { dailyRate: 200, kmPerDay: 300 };
const at = (d: number, h = 10, m = 0) => new Date(2027, 0, d, h, m);

describe("rentalDays", () => {
  it("counts 24h blocks", () => expect(rentalDays(at(1), at(4))).toBe(3));
  it("applies a 59-minute grace period", () => {
    expect(rentalDays(at(1), at(4, 10, 59))).toBe(3);
    expect(rentalDays(at(1), at(4, 11, 0))).toBe(4);
  });
  it("bills at least one day", () => expect(rentalDays(at(1, 10), at(1, 12))).toBe(1));
  it("returns 0 for invalid ranges", () => expect(rentalDays(at(4), at(1))).toBe(0));
});

describe("quote", () => {
  it("is internally consistent: lines sum to subtotal, VAT is 15%, total = subtotal + VAT", () => {
    const q = quote({ vehicle: v, pickupAt: at(1), returnAt: at(8), extras: { childSeat: 2, gps: 1, additionalDriver: 1 }, cover: "super", airportPickup: true, oneWay: true, youngDriver: true, promoPct: 10 });
    const sum = q.lines.reduce((s, l) => s + l.amount, 0);
    expect(q.subtotal).toBeCloseTo(sum, 1);
    expect(q.vat).toBeCloseTo(q.subtotal * VAT_RATE, 1);
    expect(q.total).toBeCloseTo(q.subtotal + q.vat, 2);
  });
  it("applies the length-of-rental discount", () => {
    const q = quote({ vehicle: v, pickupAt: at(1), returnAt: at(8) });
    expect(q.days).toBe(7);
    expect(q.lines.find((l) => l.key === "duration")!.amount).toBe(-140);
  });
  it("caps capped extras", () => {
    const q = quote({ vehicle: v, pickupAt: at(1), returnAt: at(21), extras: { childSeat: 1 } });
    expect(q.lines.find((l) => l.key === "extra_childSeat")!.amount).toBe(EXTRAS.childSeat.maxCharge);
  });
  it("clamps extra quantities to their maximum", () => {
    const q = quote({ vehicle: v, pickupAt: at(1), returnAt: at(2), extras: { gps: 5 } });
    expect(q.lines.find((l) => l.key === "extra_gps")!.amount).toBe(20);
  });
  it("includes mileage per day", () => expect(quote({ vehicle: v, pickupAt: at(1), returnAt: at(3) }).includedKm).toBe(600));
  it("has no negative total", () => expect(quote({ vehicle: v, pickupAt: at(1), returnAt: at(2), promoPct: 99 }).total).toBeGreaterThan(0));
});

describe("durationDiscount", () => {
  it.each([[1, 0], [3, 5], [7, 10], [14, 15], [28, 25]])("%i days → %i%%", (d, p) => expect(durationDiscount(d)).toBe(p));
});

describe("illustrative calculators", () => {
  it("WAFI schedule never increases month to month and saves money over 12 months", () => {
    const s = wafiSchedule(3000, 12);
    for (let i = 1; i < s.rows.length; i++) expect(s.rows[i].amount).toBeLessThanOrEqual(s.rows[i - 1].amount);
    expect(s.saved).toBeGreaterThan(0);
    expect(s.total).toBeCloseTo(s.subtotal * (1 + VAT_RATE), 1);
  });
  it("lease estimate scales with fleet size and term", () => {
    const a = leaseEstimate({ vehicles: 10, months: 36, tier: "business" });
    const b = leaseEstimate({ vehicles: 100, months: 36, tier: "business" });
    expect(b.perVehicle).toBeLessThan(a.perVehicle);
    expect(a.contract).toBeCloseTo(a.monthly * 36, 0);
  });
  it("chauffeur estimate enforces a 3-hour minimum", () => expect(chauffeurEstimate({ cls: "business", hours: 1 }).hours).toBe(3));
});
