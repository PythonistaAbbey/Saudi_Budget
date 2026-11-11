"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dict, type Dict } from "./dict";
import { money as fmtMoney, num as fmtNum, date as fmtDate, dateTime as fmtDateTime, type Locale, type Tx } from "./config";

interface I18n {
  locale: Locale;
  t: Dict;
  tx: (s: Tx) => string;
  money: (n: number, opts?: { decimals?: boolean }) => string;
  num: (n: number) => string;
  date: (d: Date | string, opts?: Intl.DateTimeFormatOptions) => string;
  dateTime: (d: Date | string) => string;
  href: (path: string) => string;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value: I18n = {
    locale,
    t: dict[locale] as Dict,
    tx: (s) => s[locale],
    money: (n, o) => fmtMoney(locale, n, o),
    num: (n) => fmtNum(locale, n),
    date: (d, o) => fmtDate(locale, d, o),
    dateTime: (d) => fmtDateTime(locale, d),
    href: (p) => `/${locale}${p === "/" ? "" : p}`,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside I18nProvider");
  return v;
}
