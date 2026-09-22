import { expect, test } from "@playwright/test";

test("homepage renders RTL storefront", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: "لأنك تستحقين الأفضل" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "الأكثر مبيعا", exact: true })).toBeVisible();
});

test("product page and checkout path render", async ({ page }) => {
  await page.goto("/ar/product/066");
  await expect(page.getByRole("heading", { name: "066" })).toBeVisible();
  await page.goto("/ar/cart");
  await expect(page.getByRole("link", { name: "المتابعة للدفع" })).toBeVisible();
  await page.goto("/ar/checkout");
  await expect(page.getByRole("heading", { name: "إتمام الطلب" })).toBeVisible();
});
