import { describe, expect, it } from "vitest";
import { searchVehicles, filtersFromParams } from "@/lib/search";
import { vehicles } from "@/data/vehicles";

describe("searchVehicles", () => {
  it("returns everything with no filters", () => expect(searchVehicles({})).toHaveLength(vehicles.length));
  it("filters by category", () => expect(searchVehicles({ categories: ["suv"] }).every((v) => v.category === "suv")).toBe(true));
  it("filters by seats, bags, transmission, fuel, price, features and city", () => {
    const r = searchVehicles({ minSeats: 7, minBags: 4, transmission: "automatic", fuels: ["petrol"], maxPrice: 700, features: ["4WD"], city: "riyadh" });
    expect(r.length).toBeGreaterThan(0);
    for (const v of r) {
      expect(v.seats).toBeGreaterThanOrEqual(7);
      expect(v.bags).toBeGreaterThanOrEqual(4);
      expect(v.transmission).toBe("automatic");
      expect(v.fuel).toBe("petrol");
      expect(v.dailyRate).toBeLessThanOrEqual(700);
      expect(v.features).toContain("4WD");
      expect(v.availableIn).toContain("riyadh");
    }
  });
  it("sorts by price both ways", () => {
    const up = searchVehicles({ sort: "priceAsc" }).map((v) => v.dailyRate);
    expect(up).toEqual([...up].sort((a, b) => a - b));
    const down = searchVehicles({ sort: "priceDesc" }).map((v) => v.dailyRate);
    expect(down).toEqual([...down].sort((a, b) => b - a));
  });
  it("parses filters from URL params", () => {
    const f = filtersFromParams(new URLSearchParams("cat=suv,luxury&seats=5&trans=manual&max=500"));
    expect(f).toMatchObject({ categories: ["suv", "luxury"], minSeats: 5, transmission: "manual", maxPrice: 500 });
  });
});
