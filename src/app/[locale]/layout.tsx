import "@fontsource-variable/inter";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "../globals.css";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { Providers } from "@/components/Providers";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ar = locale === "ar";
  return {
    title: {
      default: ar ? "بدجت السعودية NEXT — نموذج تصوّري غير رسمي" : "Budget Saudi NEXT — Unofficial concept prototype",
      template: ar ? "%s · نموذج تصوّري غير رسمي" : "%s · Unofficial concept",
    },
    description: ar
      ? "نموذج تصوّري مستقل لمنصة تنقّل وتأجير سيارات في السعودية. غير تابع لبدجت السعودية."
      : "Independent concept prototype for a Saudi car rental and mobility platform. Not affiliated with Budget Saudi.",
    robots: { index: false, follow: false },
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

export const viewport: Viewport = { themeColor: "#070b14", width: "device-width", initialScale: 1 };

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body className="min-h-screen">
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
