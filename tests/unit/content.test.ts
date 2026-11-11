import { describe, expect, it } from "vitest";
import * as verified from "@/content/verified";
import { dict } from "@/i18n/dict";
import { validateTrip, combine } from "@/lib/dates";
import { branches, cities } from "@/data/branches";

function keys(o: object, p = ""): string[] {
  return Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
}

describe("content integrity", () => {
  it("every verified item has an https source and retrieval date", () => {
    const walk = (o: unknown): void => {
      if (!o || typeof o !== "object") return;
      if ("source" in o && "retrieved" in o) {
        expect(String((o as { source: string }).source)).toMatch(/^https:\/\//);
        expect((o as { retrieved: string }).retrieved).toBe("2026-11-11");
      }
      Object.values(o).forEach(walk);
    };
    walk(verified);
  });
  it("expired promotions are never marked as plain verified", () => {
    const r = verified.promotions.find((p) => p.id === "ramadan-2026")!;
    expect(r.provenance).toBe("expired");
  });
  it("every branch belongs to a known city and cites a source", () => {
    for (const b of branches) {
      expect(cities.some((c) => c.id === b.city)).toBe(true);
      expect(b.source).toMatch(/^https:\/\/www\.budget\.com\//);
    }
  });
  it("Arabic and English UI dictionaries have identical keys", () => expect(keys(dict.ar).sort()).toEqual(keys(dict.en).sort()));
});

describe("trip validation", () => {
  const now = new Date(2027, 0, 1, 9);
  it("rejects return before pickup", () => expect(validateTrip(combine("2027-01-05", "10:00"), combine("2027-01-04", "10:00"), now)).toBe("errReturnBefore"));
  it("rejects pickup in the past", () => expect(validateTrip(combine("2026-12-30", "10:00"), combine("2027-01-04", "10:00"), now)).toBe("errPast"));
  it("rejects rentals over 90 days", () => expect(validateTrip(combine("2027-01-02", "10:00"), combine("2027-05-02", "10:00"), now)).toBe("errMax"));
  it("accepts a valid trip", () => expect(validateTrip(combine("2027-01-02", "10:00"), combine("2027-01-05", "10:00"), now)).toBeNull());
});
