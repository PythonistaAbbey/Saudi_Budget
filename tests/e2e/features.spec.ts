import { test, expect } from "@playwright/test";

test("language switch keeps the page and booking query", async ({ page }) => {
  await page.goto("/en/find-a-car?cat=suv&sort=priceAsc");
  await page.getByTestId("lang-switch").click();
  await expect(page).toHaveURL(/\/ar\/find-a-car\?cat=suv&sort=priceAsc/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("filter-cat-suv")).toHaveAttribute("aria-pressed", "true");
});

test("comparison holds at most three vehicles", async ({ page }) => {
  await page.goto("/en/find-a-car");
  const toggles = page.getByTestId("compare-toggle");
  for (let i = 0; i < 4; i++) await toggles.nth(i).click();
  await expect(page.getByTestId("compare-tray")).toContainText("Compare (3)");
  await page.getByTestId("open-compare").click();
  await expect(page.getByTestId("compare-table").locator("thead th")).toHaveCount(4);
});

test("concierge recommends SUVs for the brief's family trip", async ({ page }) => {
  await page.goto("/en/concierge");
  await page.getByTestId("concierge-input").fill("I need a comfortable SUV for a family trip from Riyadh to AlUla for five days");
  await page.getByTestId("concierge-send").click();
  const recs = page.getByTestId("concierge-recs");
  await expect(recs).toBeVisible();
  await expect(recs.locator("li")).toHaveCount(3);
  await recs.getByRole("link").first().click();
  await expect(page.getByTestId("step-extras")).toBeVisible();
});

test("corporate form validates and responds; proposal downloads", async ({ page }) => {
  await page.goto("/en/corporate");
  await page.getByTestId("corp-submit").click();
  await expect(page.getByTestId("corp-form").getByRole("alert").first()).toBeVisible();
  await page.locator("#c-company").fill("Example Co");
  await page.locator("#c-name").fill("Test Person");
  await page.locator("#c-email").fill("a@example.com");
  await page.locator("#c-phone").fill("0512345678");
  await page.getByTestId("corp-submit").click();
  await expect(page.getByTestId("corp-sent")).toBeVisible();
  const dl = page.waitForEvent("download");
  await page.getByTestId("download-proposal").click();
  expect((await dl).suggestedFilename()).toMatch(/mock-lease-proposal/);
  await page.getByTestId("consult-day").first().click();
  await page.getByTestId("consult-time").first().click();
  await page.getByTestId("consult-book").click();
  await expect(page.getByTestId("consult-booked")).toBeVisible();
});

test("WAFI calculator responds to duration", async ({ page }) => {
  await page.goto("/en/wafi");
  const total = await page.getByTestId("wafi-total").textContent();
  await page.getByTestId("wafi-slider").fill("24");
  await expect(page.getByTestId("wafi-months")).toContainText("24");
  await expect(page.getByTestId("wafi-total")).not.toHaveText(total!);
});

test("branch locator filters by map, city and search", async ({ page }) => {
  await page.goto("/en/locations");
  await page.getByTestId("map-pin-jeddah").click();
  await expect(page.getByTestId("branch-item").first()).toContainText(/Jeddah|King Abdulaziz|Hamra|Tahliya|Hilton|Salamah|Hamdaniyah|Haramain/);
  await page.getByTestId("branch-search").fill("Qiddiya");
  await expect(page.getByTestId("branch-item")).toHaveCount(1);
  await page.getByTestId("branch-search").fill("");
  await page.getByTestId("branch-city").selectOption("tabuk");
  await expect(page.getByTestId("presence-only")).toBeVisible();
  await page.getByTestId("view-list").click();
});

test("promotions never present expired offers as active", async ({ page }) => {
  await page.goto("/en/promotions");
  await page.getByTestId("promo-filter-expired").click();
  await expect(page.getByTestId("promo-card")).toHaveCount(1);
  await expect(page.getByTestId("promo-card")).toContainText("Expired");
});

test("used cars filters, compare and inquiry", async ({ page }) => {
  await page.goto("/en/used-cars");
  const all = Number((await page.getByTestId("used-count").textContent())!.replace(/\D/g, ""));
  await page.getByTestId("used-brand").selectOption("Toyota");
  const toyota = Number((await page.getByTestId("used-count").textContent())!.replace(/\D/g, ""));
  expect(toyota).toBeLessThan(all);
  await page.getByTestId("used-compare").nth(0).click();
  await page.getByTestId("used-compare").nth(1).click();
  await page.getByTestId("used-open-compare").click();
  await expect(page.getByTestId("used-compare-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.goto("/en/used-cars");
  await page.getByTestId("used-details").first().click();
  await page.getByTestId("used-submit").click();
  await expect(page.getByTestId("used-form").getByRole("alert").first()).toBeVisible();
});

test("chauffeur request and support ticket", async ({ page }) => {
  await page.goto("/en/chauffeur");
  await page.getByTestId("svc-intercity").check({ force: true });
  await page.getByTestId("chf-address").fill("Hotel lobby");
  await page.getByTestId("chf-submit").click();
  await expect(page.getByTestId("chf-done")).toContainText("CHF-");
  await page.goto("/en/support");
  await page.getByTestId("faq-search").fill("roadside");
  await expect(page.getByTestId("faq-item").first()).toContainText(/broken down|roadside/i);
  await page.getByTestId("ticket-id").fill("TCK-1001");
  await page.getByTestId("ticket-track").click();
  await expect(page.getByTestId("ticket-status")).toBeVisible();
});

test("admin RBAC: viewer cannot edit, admin actions are audited", async ({ page }) => {
  await page.goto("/en/admin");
  await page.getByTestId("admin-toggle").first().click();
  await page.getByTestId("admin-tab-audit").click();
  await expect(page.getByTestId("admin-audit")).toContainText("Unlisted");
  await page.getByTestId("admin-tab-vehicles").click();
  await page.getByTestId("admin-role").selectOption("viewer");
  await expect(page.getByTestId("admin-toggle").first()).toBeDisabled();
});
