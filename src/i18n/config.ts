export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (x: string): x is Locale => (locales as readonly string[]).includes(x);
export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Bilingual string. Copy lives next to the UI that uses it. */
export type Tx = { en: string; ar: string };
export const tx = (l: Locale, s: Tx) => s[l];

const intlLocale = (l: Locale) => (l === "ar" ? "ar-SA-u-ca-gregory-nu-arab" : "en-GB");

export function money(l: Locale, n: number, opts: { decimals?: boolean } = {}) {
  const num = new Intl.NumberFormat(intlLocale(l), {
    minimumFractionDigits: opts.decimals ? 2 : 0,
    maximumFractionDigits: opts.decimals ? 2 : 0,
  }).format(n);
  return l === "ar" ? `${num} ر.س` : `SAR ${num}`;
}

export const num = (l: Locale, n: number) => new Intl.NumberFormat(intlLocale(l)).format(n);

export function date(l: Locale, d: Date | string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const v = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(v.getTime())) return "—";
  return new Intl.DateTimeFormat(intlLocale(l), opts).format(v);
}

export const dateTime = (l: Locale, d: Date | string) =>
  date(l, d, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
