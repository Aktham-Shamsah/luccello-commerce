import { z } from "zod";

export const productAdminSchema = z.object({
  slug: z.string().min(1).max(140),
  sku: z.string().min(1).max(80),
  nameAr: z.string().min(1),
  nameEn: z.string().optional().nullable(),
  shortDescriptionAr: z.string().optional().nullable(),
  descriptionAr: z.string().min(1),
  color: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  salePrice: z.number().nonnegative(),
  regularPrice: z.number().nonnegative(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  newest: z.boolean().default(false),
  sale: z.boolean().default(false),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  categoryIds: z.array(z.string().uuid()).default([]),
  inventoryQuantity: z.number().int().nonnegative().default(0),
  lowStockThreshold: z.number().int().nonnegative().default(3),
});

export const productAdminPatchSchema = productAdminSchema.partial();

export const categoryAdminSchema = z.object({
  slug: z.string().min(1).max(140),
  nameAr: z.string().min(1),
  nameEn: z.string().optional().nullable(),
  descriptionAr: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
});

export const categoryAdminPatchSchema = categoryAdminSchema.partial();

export const bannerAdminSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  href: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
});

export const bannerAdminPatchSchema = bannerAdminSchema.partial();

export const inventoryAdminSchema = z.object({
  quantity: z.number().int().nonnegative(),
  lowStockThreshold: z.number().int().nonnegative(),
});

export const imageUploadSchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  dataBase64: z.string().min(1),
});
