import { z } from "zod";

export const productSlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[\p{L}\p{N}-]+$/u);
export const addCartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  items: z
    .array(addCartItemSchema)
    .min(1)
    .max(30)
    .refine(
      (items) => new Set(items.map((item) => item.productId)).size === items.length,
      "duplicate_cart_items",
    ),
  contact: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(8).max(24),
  }),
  address: z.object({
    line1: z.string().trim().min(3).max(250),
    city: z.string().trim().min(2).max(120),
    country: z
      .string()
      .length(2)
      .regex(/^[A-Z]{2}$/),
  }),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.literal("cash_on_delivery"),
  couponCode: z.string().trim().max(80).optional(),
  idempotencyKey: z.string().min(12).max(120),
});
export const orderLookupSchema = z.object({
  orderId: z.string().uuid(),
  email: z.string().trim().email().max(254),
});
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(80),
  body: z.string().trim().min(10).max(1000),
});
export type CheckoutRequest = z.infer<typeof checkoutSchema>;
