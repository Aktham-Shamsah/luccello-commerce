import { z } from "zod";

export const productSlugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[\p{L}\p{N}-]+$/u);

export const addCartItemSchema = z.object({
  productId: z.string().uuid().or(z.string().min(3)),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  cartId: z.string().min(3),
  contact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(8).max(24),
  }),
  address: z.object({
    line1: z.string().min(3),
    city: z.string().min(2),
    country: z.literal("SA"),
  }),
  paymentMethod: z.literal("mock"),
  idempotencyKey: z.string().min(12).max(120),
});

export const reviewSchema = z.object({
  productId: z.string().min(3),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(80),
  body: z.string().min(10).max(1000),
});

export type CheckoutRequest = z.infer<typeof checkoutSchema>;
