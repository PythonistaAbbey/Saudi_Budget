"use client";

/**
 * Client-side demo store. Persists to localStorage so that state survives page
 * navigation and language switching. In production this layer would be
 * replaced by authenticated API calls (see docs/ARCHITECTURE.md) — the
 * component contracts stay the same.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { quote, type CoverId, type ExtraId } from "./pricing";
import { findVehicle } from "@/data/vehicles";
import { findBranch } from "@/data/branches";

export type BookingStatus = "upcoming" | "active" | "completed" | "cancelled";

export interface Booking {
  ref: string;
  vehicleId: string;
  pickupBranch: string;
  returnBranch: string;
  pickupAt: string;
  returnAt: string;
  extras: Partial<Record<ExtraId, number>>;
  cover: CoverId;
  youngDriver: boolean;
  promoPct?: number;
  driver: { firstName: string; lastName: string; email: string; phone: string };
  total: number;
  status: BookingStatus;
  createdAt: string;
  history: { at: string; event: string }[];
}

export interface Prefs {
  homeCity: string;
  category: string;
  cover: CoverId;
  childSeat: boolean;
  marketing: boolean;
  notifications: "email" | "sms" | "both";
}

interface Store {
  ready: boolean;
  bookings: Booking[];
  compare: string[];
  saved: string[];
  prefs: Prefs;
  addBooking: (b: Omit<Booking, "ref" | "createdAt" | "history" | "status" | "total">) => Booking;
  updateBooking: (ref: string, patch: Partial<Pick<Booking, "pickupAt" | "returnAt" | "extras" | "cover">>) => void;
  cancelBooking: (ref: string) => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  toggleSaved: (id: string) => void;
  setPrefs: (p: Partial<Prefs>) => void;
  resetDemo: () => void;
}

const KEY = "bsn-demo-v1";
const Ctx = createContext<Store | null>(null);

export function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  const rnd = typeof crypto !== "undefined" && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(6)) : Array.from({ length: 6 }, () => Math.floor(Math.random() * 1e9));
  for (const n of rnd) s += alphabet[n % alphabet.length];
  return `DEMO-${s}`;
}

export function computeTotal(b: Pick<Booking, "vehicleId" | "pickupAt" | "returnAt" | "extras" | "cover" | "youngDriver" | "promoPct" | "pickupBranch" | "returnBranch">) {
  const v = findVehicle(b.vehicleId);
  if (!v) return 0;
  const pb = findBranch(b.pickupBranch);
  const rb = findBranch(b.returnBranch);
  return quote({
    vehicle: v,
    pickupAt: new Date(b.pickupAt),
    returnAt: new Date(b.returnAt),
    extras: b.extras,
    cover: b.cover,
    youngDriver: b.youngDriver,
    promoPct: b.promoPct,
    airportPickup: pb?.kind === "airport",
    oneWay: !!pb && !!rb && pb.city !== rb.city,
  }).total;
}

const dayMs = 86400000;
function at(offsetDays: number, hour: number) {
  const d = new Date(Date.now() + offsetDays * dayMs);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function seed(): Booking[] {
  const driver = { firstName: "Noura", lastName: "Demo", email: "noura.demo@example.com", phone: "0500000000" };
  const raw: Omit<Booking, "total">[] = [
    { ref: "DEMO-7QK2MZ", vehicleId: "toyota-rav4", pickupBranch: "ruh-t5", returnBranch: "ruh-t5", pickupAt: at(9, 10), returnAt: at(14, 10), extras: { childSeat: 1 }, cover: "super", youngDriver: false, driver, status: "upcoming", createdAt: at(-3, 12), history: [{ at: at(-3, 12), event: "created" }] },
    { ref: "DEMO-H8T4WN", vehicleId: "kia-carnival", pickupBranch: "jed-kaia", returnBranch: "jed-kaia", pickupAt: at(32, 14), returnAt: at(39, 14), extras: { childSeat: 2, additionalDriver: 1 }, cover: "premium", youngDriver: false, driver, status: "upcoming", createdAt: at(-1, 9), history: [{ at: at(-1, 9), event: "created" }] },
    { ref: "DEMO-3PZ9RC", vehicleId: "toyota-camry", pickupBranch: "dmm-a5k", returnBranch: "dmm-a5k", pickupAt: at(-48, 9), returnAt: at(-45, 9), extras: {}, cover: "standard", youngDriver: false, driver, status: "completed", createdAt: at(-60, 9), history: [{ at: at(-60, 9), event: "created" }, { at: at(-45, 9), event: "returned" }] },
    { ref: "DEMO-M2V6XA", vehicleId: "toyota-landcruiser", pickupBranch: "ruh-intl", returnBranch: "jed-kaia", pickupAt: at(-130, 8), returnAt: at(-123, 18), extras: { gps: 1 }, cover: "super", youngDriver: false, driver, status: "completed", createdAt: at(-140, 9), history: [{ at: at(-140, 9), event: "created" }, { at: at(-123, 18), event: "returned" }] },
    { ref: "DEMO-9JW4LB", vehicleId: "hyundai-accent", pickupBranch: "jed-hamra", returnBranch: "jed-hamra", pickupAt: at(-200, 9), returnAt: at(-198, 9), extras: {}, cover: "standard", youngDriver: false, driver, status: "cancelled", createdAt: at(-210, 9), history: [{ at: at(-210, 9), event: "created" }, { at: at(-205, 9), event: "cancelled" }] },
  ];
  return raw.map((b) => ({ ...b, total: computeTotal(b) }));
}

const defaultPrefs: Prefs = { homeCity: "riyadh", category: "suv", cover: "super", childSeat: false, marketing: false, notifications: "email" };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [prefs, setPrefsState] = useState<Prefs>(defaultPrefs);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setBookings(Array.isArray(s.bookings) ? s.bookings : seed());
        setCompare(Array.isArray(s.compare) ? s.compare.slice(0, 3) : []);
        setSaved(Array.isArray(s.saved) ? s.saved : []);
        setPrefsState({ ...defaultPrefs, ...(s.prefs ?? {}) });
      } else {
        setBookings(seed());
        setSaved(["toyota-landcruiser", "lucid-air"]);
      }
    } catch {
      setBookings(seed());
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ bookings, compare, saved, prefs }));
    } catch {
      /* storage unavailable — demo still works in-memory */
    }
  }, [ready, bookings, compare, saved, prefs]);

  const addBooking: Store["addBooking"] = useCallback((b) => {
    const now = new Date().toISOString();
    const booking: Booking = { ...b, ref: makeRef(), createdAt: now, status: "upcoming", history: [{ at: now, event: "created" }], total: computeTotal(b) };
    setBookings((xs) => [booking, ...xs]);
    return booking;
  }, []);

  const updateBooking: Store["updateBooking"] = useCallback((ref, patch) => {
    setBookings((xs) =>
      xs.map((b) => {
        if (b.ref !== ref) return b;
        const next = { ...b, ...patch };
        return { ...next, total: computeTotal(next), history: [...b.history, { at: new Date().toISOString(), event: "modified" }] };
      }),
    );
  }, []);

  const cancelBooking = useCallback((ref: string) => {
    setBookings((xs) => xs.map((b) => (b.ref === ref ? { ...b, status: "cancelled", history: [...b.history, { at: new Date().toISOString(), event: "cancelled" }] } : b)));
  }, []);

  const toggleCompare = useCallback(
    (id: string) => {
      let ok = true;
      setCompare((xs) => {
        if (xs.includes(id)) return xs.filter((x) => x !== id);
        if (xs.length >= 3) {
          ok = false;
          return xs;
        }
        return [...xs, id];
      });
      return ok && (compare.includes(id) || compare.length < 3);
    },
    [compare],
  );

  const value = useMemo<Store>(
    () => ({
      ready,
      bookings,
      compare,
      saved,
      prefs,
      addBooking,
      updateBooking,
      cancelBooking,
      toggleCompare,
      clearCompare: () => setCompare([]),
      toggleSaved: (id) => setSaved((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id])),
      setPrefs: (p) => setPrefsState((x) => ({ ...x, ...p })),
      resetDemo: () => {
        setBookings(seed());
        setCompare([]);
        setSaved([]);
        setPrefsState(defaultPrefs);
      },
    }),
    [ready, bookings, compare, saved, prefs, addBooking, updateBooking, cancelBooking, toggleCompare],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}
