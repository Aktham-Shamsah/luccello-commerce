import type { CheckoutRequest } from "@luccello/contracts";
import { authoritativeCartTotals } from "../carts/cart.service.js";
import { reserveInventory } from "../inventory/inventory.service.js";
import { MockPaymentProvider } from "../payments/mock-payment.provider.js";

const paymentProvider = new MockPaymentProvider();
const seenIdempotencyKeys = new Map<string, unknown>();

export async function checkout(input: CheckoutRequest) {
  const previous = seenIdempotencyKeys.get(input.idempotencyKey);
  if (previous) return previous;

  const items = [
    {
      productId: "prod-66",
      slug: "066",
      nameAr: "066",
      unitPrice: 196,
      regularPrice: 320,
      quantity: 1,
      image: "/product-collage.png",
    },
  ];
  const totals = authoritativeCartTotals(items, "L10");
  const reservation = await reserveInventory(items);
  const orderId = `ord_${Date.now()}`;
  const payment = await paymentProvider.createPayment({
    orderId,
    amount: totals.total,
    currency: "ILS",
  });
  const result = {
    orderId,
    reservationId: reservation.reservationId,
    status: "pending_payment",
    payment,
    totals,
  };
  seenIdempotencyKeys.set(input.idempotencyKey, result);
  return result;
}
