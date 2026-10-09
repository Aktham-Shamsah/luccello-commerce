import { eq } from "drizzle-orm";
import {
  auditLogs,
  inventory,
  inventoryMovements,
  orderItems,
  orders,
  orderStatusHistory,
} from "@luccello/database";
import { getDatabase } from "../../shared/database/client.js";

export async function changeOrderStatus(orderId: string, status: "cancelled" | "fulfilled") {
  return getDatabase().transaction(async (tx) => {
    const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).for("update");
    if (!order) throw new Error("order_not_found");
    if (order.status !== "confirmed") throw new Error("invalid_order_transition");
    const lines = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
    if (status === "cancelled") {
      // Lock inventory records in stable order to prevent concurrent updates.
      for (const line of [...lines].sort((a, b) => a.productId.localeCompare(b.productId))) {
        const [stock] = await tx
          .select()
          .from(inventory)
          .where(eq(inventory.productId, line.productId))
          .for("update");
        if (!stock) throw new Error("inventory_missing");
        await tx
          .update(inventory)
          .set({
            quantity: stock.quantity + line.quantity,
            updatedAt: new Date(),
          })
          .where(eq(inventory.productId, line.productId));
        await tx.insert(inventoryMovements).values({
          productId: line.productId,
          quantityDelta: line.quantity,
          reason: "cancelled_order",
          orderId,
        });
      }
    }
    await tx.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, orderId));
    await tx
      .insert(orderStatusHistory)
      .values({ orderId, status, note: "Updated by store administrator" });
    await tx.insert(auditLogs).values({
      action: "order_status_changed",
      target: orderId,
      metadata: { previousStatus: order.status, nextStatus: status },
    });
    return { orderId, status };
  });
}
