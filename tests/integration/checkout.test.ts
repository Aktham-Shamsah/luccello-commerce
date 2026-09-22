import { describe, expect, it } from "vitest";
import { checkoutSchema } from "../../packages/contracts/src/index.js";

describe("checkout contract", () => {
  it("rejects browser supplied payment success", () => {
    const parsed = checkoutSchema.safeParse({
      cartId: "cart_123",
      contact: { name: "Demo", email: "demo@example.test", phone: "0500000000" },
      address: { line1: "Riyadh", city: "Riyadh", country: "SA" },
      paymentMethod: "mock",
      paymentSucceeded: true,
      idempotencyKey: "idem_123456789",
    });
    expect(parsed.success).toBe(true);
    expect("paymentSucceeded" in parsed.data!).toBe(false);
  });
});
