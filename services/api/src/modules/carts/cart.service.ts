import type { CartItem } from "@luccello/types";

export function authoritativeCartTotals(
  items: CartItem[],
  couponCode?: string,
  shippingMethod: "standard" | "express" = "standard",
) {
  const subtotal =
    Math.round(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100) / 100;
  const discount = couponCode?.toUpperCase() === "L10" ? Math.round(subtotal * 10) / 100 : 0;
  const shipping = shippingMethod === "express" ? 45 : subtotal >= 196 ? 0 : 30;
  return {
    subtotal,
    discount,
    shipping,
    total: Math.round((subtotal - discount + shipping) * 100) / 100,
  };
}
