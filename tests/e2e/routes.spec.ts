import { test, expect } from "@playwright/test";

import { ROUTES } from "./routes";

for (const locale of ["en", "ar"] as const) {
  test.describe(`routes (${locale})`, () => {
    for (const r of ROUTES) {
      test(`${locale}${r || "/"} renders without errors and shows the disclaimer`, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(String(e)));
        page.on("console", (m) => {
          if (m.type() === "error" && !/404/.test(m.text())) errors.push(m.text());
        });
        const res = await page.goto(`/${locale}${r}`);
        expect(res?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("dir", locale === "ar" ? "rtl" : "ltr");
        await expect(page.getByRole("note").first()).toContainText(locale === "ar" ? "غير تابع" : "not affiliated");
        await expect(page.locator("h1").first()).toBeVisible();
        const broken = await page.evaluate(() => Array.from(document.images).filter((i) => i.complete && i.naturalWidth === 0).length);
        expect(broken).toBe(0);
        expect(errors).toEqual([]);
      });
    }
  });
}

test("root redirects to English", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("all internal links resolve", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const r of ROUTES) {
    await page.goto(`/en${r}`);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => seen.add(h));
  }
  for (const h of seen) {
    const res = await request.get(h);
    expect(res.status(), h).toBeLessThan(400);
  }
});
