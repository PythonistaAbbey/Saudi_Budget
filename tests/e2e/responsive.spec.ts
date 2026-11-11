import { test, expect } from "@playwright/test";
import { ROUTES } from "./routes";

for (const locale of ["en", "ar"]) {
  test(`no horizontal overflow on mobile (${locale})`, async ({ page }) => {
    for (const r of ROUTES) {
      await page.goto(`/${locale}${r}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${locale}${r}`).toBeLessThanOrEqual(1);
    }
  });
}

test("mobile menu opens and navigates", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("menu-button").click();
  await page.getByRole("dialog").getByRole("link", { name: "Locations" }).click();
  await expect(page).toHaveURL(/\/en\/locations/);
});
