import { describe, expect, it } from "vitest";
import { checkoutSchema } from "../../packages/contracts/src/index.js";

const valid = {
  items: [{ productId: "617e76d3-3a7d-445a-af8a-2c84f75075c0", quantity: 2 }],
  contact: { name: "Customer", email: "buyer@example.test", phone: "0599000000" },
  address: { line1: "Main Street", city: "Ramallah", country: "PS" },
  shippingMethod: "standard" as const,
  paymentMethod: "cash_on_delivery" as const,
  idempotencyKey: "checkout_test_key_123",
};
describe("checkout contract", () => {
  it("only allows server-supported payments and strips fake client success", () => {
    const parsed = checkoutSchema.safeParse({ ...valid, paymentSucceeded: true });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect("paymentSucceeded" in parsed.data).toBe(false);
    expect(checkoutSchema.safeParse({ ...valid, paymentMethod: "mock" }).success).toBe(false);
  });
  it("rejects empty, duplicate and invalid cart quantities", () => {
    expect(checkoutSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...valid, items: [...valid.items, ...valid.items] }).success,
    ).toBe(false);
    expect(
      checkoutSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity: 0 }] }).success,
    ).toBe(false);
  });
  it("does not trust a client-supplied total", () => {
    const parsed = checkoutSchema.parse({ ...valid, total: 0 });
    expect("total" in parsed).toBe(false);
  });
});
