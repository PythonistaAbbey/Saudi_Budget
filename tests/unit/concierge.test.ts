import { describe, expect, it } from "vitest";
import { parseIntent, recommend } from "@/lib/concierge";

describe("concierge", () => {
  it("understands the brief's example request", () => {
    const i = parseIntent("I need a comfortable SUV for a family trip from Riyadh to AlUla for five days");
    expect(i).toMatchObject({ pickupCity: "riyadh", destination: "alula", days: 5, family: true, wantsComfort: true });
    expect(i.categories).toContain("suv");
    const recs = recommend(i);
    expect(recs).toHaveLength(3);
    expect(recs[0].vehicle.category).toBe("suv");
    for (const r of recs) expect(r.vehicle.seats).toBeGreaterThanOrEqual(5);
  });
  it("understands Arabic with Arabic-Indic digits", () => {
    const i = parseIntent("رحلة كشتة في الصحراء من الدمام، ٤ أشخاص، ٧ أيام");
    expect(i).toMatchObject({ pickupCity: "dammam", passengers: 4, days: 7, wantsOffroad: true });
    expect(recommend(i)[0].vehicle.features.some((f) => /4WD|AWD|xDrive/.test(f))).toBe(true);
  });
  it("prefers cheap cars for budget requests", () => {
    const recs = recommend(parseIntent("cheapest car in Jeddah for 3 days"));
    expect(recs[0].vehicle.dailyRate).toBeLessThan(200);
  });
  it("prefers luxury for weddings", () => expect(recommend(parseIntent("luxury car for a wedding in Riyadh"))[0].vehicle.category).toBe("luxury"));
});
