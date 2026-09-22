import { describe, expect, it } from "vitest";
import { reserveInventory } from "./inventory.service.js";

describe("inventory reservations", () => {
  it("prevents two buyers from reserving more than the final units", async () => {
    const attempts = await Promise.allSettled([
      reserveInventory([{ productId: "prod-65", quantity: 2 }]),
      reserveInventory([{ productId: "prod-65", quantity: 2 }]),
    ]);
    expect(attempts.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(attempts.filter((result) => result.status === "rejected")).toHaveLength(1);
  });
});
