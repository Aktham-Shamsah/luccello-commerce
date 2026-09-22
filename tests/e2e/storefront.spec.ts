import { expect, test } from "@playwright/test";

test("homepage renders branded RTL storefront", async ({ page }) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("img", { name: "LU'CHÉLO", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "لأنك تستحقين الأفضل" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "الأكثر مبيعا", exact: true })).toBeVisible();
  await expect(page.locator(".site-header")).toHaveCSS("position", "relative");
  await expect(page.locator(".scroll-progress")).toBeVisible();
  await page.getByRole("button", { name: "فتح القائمة" }).click();
  const panel = page.locator(".mobile-panel");
  await expect(panel).toHaveCSS("background-color", "rgb(5, 5, 5)");
  await expect(panel).toHaveCSS("color", "rgb(244, 208, 138)");
  await expect(page.getByRole("link", { name: "شنط يد", exact: true }).first()).toBeVisible();
  await expect(page.locator("a.whatsapp")).toHaveAttribute("href", "#");
});

test("cart supports add, price display and delete", async ({ page }) => {
  await page.goto("/ar/product/066");
  await expect(page.getByRole("heading", { name: "066", level: 1 })).toBeVisible();
  await expect(page.locator(".product-price")).toContainText("196 شيكل");
  await page.getByRole("button", { name: "أضف إلى السلة", exact: true }).first().click();
  await page.goto("/ar/cart");
  await expect(page.getByRole("link", { name: "المتابعة للدفع" })).toBeVisible();
  await expect(page.getByRole("button", { name: /حذف .* من السلة/ })).toBeVisible();
  await page.getByRole("button", { name: /حذف .* من السلة/ }).click();
  await expect(page.getByRole("heading", { name: "السلة فارغة" })).toBeVisible();
});

test("storefront has no horizontal overflow across common viewport widths", async ({ page }) => {
  for (const width of [320, 375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ar");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test("scroll progress button returns the user to the top", async ({ page }) => {
  await page.goto("/ar");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  const button = page.locator(".scroll-progress");
  await expect(button).toBeVisible();
  await button.evaluate((element) => (element as HTMLButtonElement).click());
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(20);
});
