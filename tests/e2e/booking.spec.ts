import { test, expect } from "@playwright/test";

test("full demo booking journey, then modify and cancel it", async ({ page }) => {
  await page.goto("/en");
  await page.getByTestId("find-cars").click();
  await expect(page.getByTestId("results")).toBeVisible();
  await expect(page.getByTestId("results-count")).toContainText("results");

  // Filters & sorting
  await page.getByTestId("filter-cat-suv").click();
  await expect(page).toHaveURL(/cat=suv/);
  const cards = page.getByTestId("vehicle-card");
  await expect(cards.first()).toBeVisible();
  for (const id of await cards.evaluateAll((els) => els.map((e) => e.getAttribute("data-vehicle")))) expect(["hyundai-tucson", "toyota-rav4", "toyota-fortuner", "toyota-landcruiser"]).toContain(id);
  await page.getByTestId("sort").selectOption("priceAsc");
  await expect(page).toHaveURL(/sort=priceAsc/);
  await expect
    .poll(async () => {
      const nums = (await page.getByTestId("vehicle-price").allTextContents()).map((p) => Number(p.replace(/[^\d]/g, "")));
      return nums.every((n, i) => i === 0 || nums[i - 1] <= n);
    })
    .toBe(true);

  await page.getByTestId("select-vehicle").first().click();
  await expect(page.getByTestId("step-extras")).toBeVisible();
  const before = await page.getByTestId("total").textContent();
  await page.getByTestId("add-childSeat").click();
  await expect(page.getByTestId("qty-childSeat")).toHaveText("1");
  await expect(page.getByTestId("total")).not.toHaveText(before!);
  await page.getByTestId("to-driver").click();

  // Validation
  await page.getByTestId("to-review").click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await page.getByTestId("firstName").fill("Test");
  await page.getByTestId("lastName").fill("Person");
  await page.getByTestId("email").fill("not-an-email");
  await page.getByTestId("phone").fill("12345");
  await page.getByTestId("to-review").click();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await expect(page.getByText(/valid Saudi mobile/)).toBeVisible();
  await page.getByTestId("email").fill("test@example.com");
  await page.getByTestId("phone").fill("0512345678");
  await page.getByTestId("ageConfirm").check();
  await page.getByTestId("terms").check();
  await page.getByTestId("to-review").click();
  await expect(page.getByTestId("step-review")).toBeVisible();

  await page.getByTestId("promo").fill("DEMO10");
  await page.getByTestId("apply-promo").click();
  await expect(page.getByTestId("line-promo")).toBeVisible();
  await page.getByTestId("confirm-booking").click();
  const ref = (await page.getByTestId("booking-ref").textContent())!.trim();
  expect(ref).toMatch(/^DEMO-[A-Z0-9]{6}$/);

  await page.getByTestId("go-my-bookings").click();
  const row = page.locator(`[data-ref="${ref}"]`);
  await expect(row).toBeVisible();
  const oldTotal = await row.getByTestId("booking-total").textContent();

  // Modify: extend return by two days
  await row.getByTestId("modify-booking").click();
  const rd = page.getByTestId("modify-return-date");
  const cur = await rd.inputValue();
  const d = new Date(cur);
  d.setDate(d.getDate() + 2);
  await rd.fill(d.toISOString().slice(0, 10));
  await page.getByTestId("modify-save").click();
  await expect(row.getByTestId("booking-total")).not.toHaveText(oldTotal!);

  // Cancel
  await row.getByTestId("cancel-booking").click();
  await row.getByTestId("confirm-cancel").click();
  await page.getByTestId("tab-cancelled").click();
  await expect(page.locator(`[data-ref="${ref}"]`).getByTestId("booking-status")).toHaveText("Cancelled");
});

test("date validation blocks impossible trips", async ({ page }) => {
  await page.goto("/en/find-a-car");
  const pd = await page.getByTestId("pickup-date").inputValue();
  await page.getByTestId("return-date").fill(pd);
  await page.getByTestId("return-time").selectOption("09:00");
  await page.getByTestId("pickup-time").selectOption("10:00");
  await page.getByTestId("find-cars").click();
  await expect(page.getByTestId("trip-error")).toContainText("Return must be after pick-up");
});

test("booking reference lookup and invoice", async ({ page }) => {
  await page.goto("/en/my-bookings");
  await page.getByTestId("lookup-ref").fill("DEMO-3PZ9RC");
  await page.getByTestId("lookup-last").fill("demo");
  await page.getByTestId("lookup-submit").click();
  await expect(page.getByRole("status").filter({ hasText: "Found" })).toBeVisible();
  await page.locator('[data-ref="DEMO-3PZ9RC"]').getByTestId("view-invoice").click();
  await expect(page.getByTestId("invoice")).toContainText("not a valid tax invoice");
});
