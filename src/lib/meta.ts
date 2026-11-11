import type { Metadata } from "next";

/** Localised page title helper for server page files. */
export const pageMeta =
  (en: string, ar: string) =>
  async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await params;
    return { title: locale === "ar" ? ar : en };
  };
