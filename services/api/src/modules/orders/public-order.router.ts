import { Router } from "express";
import { and, eq } from "drizzle-orm";
import { orderItems, orders, products } from "@luccello/database";
import { orderLookupSchema } from "@luccello/contracts";
import { getDatabase } from "../../shared/database/client.js";

export const publicOrderRouter = Router();

publicOrderRouter.post("/lookup", async (req, res, next) => {
  const parsed = orderLookupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "validation_error" });
    return;
  }
  try {
    const db = getDatabase();
    const [order] = await db
      .select()
      .from(orders)
      .where(
        and(
          eq(orders.id, parsed.data.orderId),
          eq(orders.contactEmail, parsed.data.email.toLowerCase()),
        ),
      );
    if (!order) {
      res.status(404).json({ error: "order_not_found" });
      return;
    }
    const items = await db
      .select({
        name: products.nameAr,
        slug: products.slug,
        quantity: orderItems.quantity,
        unitPrice: orderItems.unitPrice,
      })
      .from(orderItems)
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, order.id));
    res.json({
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      currency: order.currency,
      total: Number(order.total),
      shippingService: order.shippingService,
      paymentMethod: order.paymentMethod,
      city: order.addressCity,
      items: items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice) })),
    });
  } catch (error) {
    next(error);
  }
});
