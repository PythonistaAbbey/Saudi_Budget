/** Local date/time helpers. Booking times are wall-clock times in the branch's time zone (KSA, UTC+3). */

export const pad = (n: number) => String(n).padStart(2, "0");

export function toDateInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function combine(date: string, time: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "10:00").split(":").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh ?? 10, mm ?? 0, 0, 0);
}

export function defaultTrip(now = new Date()) {
  const p = new Date(now);
  p.setDate(p.getDate() + 1);
  const r = new Date(now);
  r.setDate(r.getDate() + 4);
  return { pd: toDateInput(p), pt: "10:00", rd: toDateInput(r), rt: "10:00" };
}

export const TIMES = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);

export type TripError = "errReturnBefore" | "errPast" | "errMax" | null;

export function validateTrip(pickup: Date, ret: Date, now = new Date()): TripError {
  if (Number.isNaN(pickup.getTime()) || Number.isNaN(ret.getTime())) return "errReturnBefore";
  if (pickup.getTime() < now.getTime() - 15 * 60000) return "errPast";
  if (ret.getTime() <= pickup.getTime()) return "errReturnBefore";
  if (ret.getTime() - pickup.getTime() > 90 * 86400000) return "errMax";
  return null;
}
