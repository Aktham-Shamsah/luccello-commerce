import { eq, and } from "drizzle-orm";
import {
  inventory,
  inventoryMovements,
  orderItems,
  orders,
  orderStatusHistory,
  products,
} from "@luccello/database";
import type { CheckoutRequest } from "@luccello/contracts";
import { authoritativeCartTotals } from "../carts/cart.service.js";
import { getDatabase } from "../../shared/database/client.js";

export class CheckoutError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

export async function checkout(input: CheckoutRequest) {
  const db = getDatabase();
  const existing = await db
    .select()
    .from(orders)
    .where(eq(orders.idempotencyKey, input.idempotencyKey))
    .limit(1);
  if (existing[0]) {
    const order = existing[0];
    if (order.contactEmail !== input.contact.email.trim().toLowerCase())
      throw new CheckoutError("idempotency_key_reused");
    return toResult(order);
  }

  // Row locks serialize competing checkouts for the same stock.
  return db.transaction(async (tx) => {
    const lines: Array<{
      productId: string;
      slug: string;
      nameAr: string;
      unitPrice: number;
      regularPrice: number;
      quantity: number;
      image: string;
    }> = [];
    for (const entry of [...input.items].sort((a, b) => a.productId.localeCompare(b.productId))) {
      const [row] = await tx
        .select({ product: products, stock: inventory })
        .from(products)
        .innerJoin(inventory, eq(inventory.productId, products.id))
        .where(and(eq(products.id, entry.productId), eq(products.published, true)))
        .for("update");
      if (!row || row.product.deletedAt) throw new CheckoutError("product_unavailable");
      if (row.stock.quantity < entry.quantity) throw new CheckoutError("insufficient_inventory");
      lines.push({
        productId: row.product.id,
        slug: row.product.slug,
        nameAr: row.product.nameAr,
        unitPrice: Number(row.product.salePrice),
        regularPrice: Number(row.product.regularPrice),
        quantity: entry.quantity,
        image: "",
      });
    }

    const totals = authoritativeCartTotals(lines, input.couponCode, input.shippingMethod);
    const [order] = await tx
      .insert(orders)
      .values({
        status: "confirmed",
        subtotal: totals.subtotal.toFixed(2),
        discountTotal: totals.discount.toFixed(2),
        shippingTotal: totals.shipping.toFixed(2),
        total: totals.total.toFixed(2),
        currency: "ILS",
        idempotencyKey: input.idempotencyKey,
        contactName: input.contact.name.trim(),
        contactEmail: input.contact.email.trim().toLowerCase(),
        contactPhone: input.contact.phone.trim(),
        addressLine1: input.address.line1.trim(),
        addressCity: input.address.city.trim(),
        addressCountry: input.address.country,
        shippingService: input.shippingMethod,
        paymentMethod: "cash_on_delivery",
      })
      .returning();
    if (!order) throw new CheckoutError("order_create_failed");

    await tx.insert(orderItems).values(
      lines.map((line) => ({
        orderId: order.id,
        productId: line.productId,
        unitPrice: line.unitPrice.toFixed(2),
        quantity: line.quantity,
      })),
    );
    for (const line of lines) {
      const [stock] = await tx
        .select()
        .from(inventory)
        .where(eq(inventory.productId, line.productId));
      if (!stock || stock.quantity < line.quantity)
        throw new CheckoutError("insufficient_inventory");
      await tx
        .update(inventory)
        .set({
          quantity: stock.quantity - line.quantity,
          updatedAt: new Date(),
        })
        .where(eq(inventory.productId, line.productId));
    }
    await tx.insert(inventoryMovements).values(
      lines.map((line) => ({
        productId: line.productId,
        quantityDelta: -line.quantity,
        reason: "cash_on_delivery_order",
        orderId: order.id,
      })),
    );
    await tx.insert(orderStatusHistory).values({
      orderId: order.id,
      status: "confirmed",
      note: "Cash on delivery – payment outstanding",
    });
    return toResult(order);
  });
}

function toResult(order: typeof orders.$inferSelect) {
  return {
    orderId: order.id,
    status: order.status,
    currency: "ILS",
    paymentMethod: order.paymentMethod,
    totals: {
      subtotal: Number(order.subtotal),
      discount: Number(order.discountTotal),
      shipping: Number(order.shippingTotal),
      total: Number(order.total),
    },
  };
}
