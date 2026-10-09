import type { CartItem, Product, StockState } from "@luccello/types";

export function stockState(product: Product): StockState {
  if (product.inventoryQuantity <= 0) return "out_of_stock";
  if (product.inventoryQuantity <= product.lowStockThreshold) return "low_stock";
  return "in_stock";
}

export function discountPercent(product: Product): number {
  return Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100);
}

export function computeTotals(
  items: CartItem[],
  couponCode?: string,
  shippingMethod: "standard" | "express" = "standard",
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = couponCode?.trim().toUpperCase() === "L10" ? Math.round(subtotal * 10) / 100 : 0;
  const shipping = shippingMethod === "express" ? 45 : subtotal >= 196 ? 0 : 30;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
