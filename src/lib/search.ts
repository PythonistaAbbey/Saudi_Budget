import { vehicles, type Category, type Fuel, type Vehicle } from "@/data/vehicles";

export type Sort = "recommended" | "priceAsc" | "priceDesc" | "seats" | "rating";

export interface SearchFilters {
  city?: string;
  categories?: Category[];
  minSeats?: number;
  minBags?: number;
  transmission?: "automatic" | "manual" | "any";
  fuels?: Fuel[];
  maxPrice?: number;
  minPrice?: number;
  features?: string[];
  sort?: Sort;
}

export interface SearchParamsLike {
  get(key: string): string | null;
}

export function filtersFromParams(p: SearchParamsLike): SearchFilters {
  const list = (k: string) => (p.get(k) ? p.get(k)!.split(",").filter(Boolean) : undefined);
  const num = (k: string) => (p.get(k) ? Number(p.get(k)) : undefined);
  return {
    city: p.get("city") ?? undefined,
    categories: list("cat") as Category[] | undefined,
    minSeats: num("seats"),
    minBags: num("bags"),
    transmission: (p.get("trans") as SearchFilters["transmission"]) ?? "any",
    fuels: list("fuel") as Fuel[] | undefined,
    maxPrice: num("max"),
    minPrice: num("min"),
    features: list("feat"),
    sort: (p.get("sort") as Sort) ?? "recommended",
  };
}

export function searchVehicles(f: SearchFilters, source: Vehicle[] = vehicles): Vehicle[] {
  let out = source.filter((v) => {
    if (f.city && !v.availableIn.includes(f.city)) return false;
    if (f.categories?.length && !f.categories.includes(v.category)) return false;
    if (f.minSeats && v.seats < f.minSeats) return false;
    if (f.minBags && v.bags < f.minBags) return false;
    if (f.transmission && f.transmission !== "any" && v.transmission !== f.transmission) return false;
    if (f.fuels?.length && !f.fuels.includes(v.fuel)) return false;
    if (f.maxPrice != null && v.dailyRate > f.maxPrice) return false;
    if (f.minPrice != null && v.dailyRate < f.minPrice) return false;
    if (f.features?.length && !f.features.every((x) => v.features.includes(x))) return false;
    return true;
  });
  switch (f.sort) {
    case "priceAsc":
      out = out.sort((a, b) => a.dailyRate - b.dailyRate);
      break;
    case "priceDesc":
      out = out.sort((a, b) => b.dailyRate - a.dailyRate);
      break;
    case "seats":
      out = out.sort((a, b) => b.seats - a.seats || a.dailyRate - b.dailyRate);
      break;
    case "rating":
      out = out.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // "recommended": best value — rating per riyal, with a small boost for hybrids/EVs
      out = out.sort((a, b) => score(b) - score(a));
  }
  return out;
}

const score = (v: Vehicle) => v.rating * 100 - v.dailyRate * 0.15 + (v.fuel === "hybrid" || v.fuel === "electric" ? 20 : 0);
