"use client";

import type { ReactNode } from "react";
import { I18nProvider } from "@/i18n/client";
import type { Locale } from "@/i18n/config";
import { StoreProvider } from "@/lib/store";
import { DisclaimerBar, Footer, Header } from "./Shell";
import { ConciergeWidget } from "./Concierge";
import { CompareTray } from "./CompareTray";

export function Providers({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <I18nProvider locale={locale}>
      <StoreProvider>
        <DisclaimerBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CompareTray />
        <ConciergeWidget />
      </StoreProvider>
    </I18nProvider>
  );
}
