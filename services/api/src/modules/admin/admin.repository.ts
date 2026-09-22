import { and, desc, eq, gte, isNull, sql } from "drizzle-orm";
import {
  advertisementMetrics,
  analyticsEvents,
  banners,
  categories,
  inventory,
  orders,
  productCategories,
  productImages,
  products,
  userSessions,
  users,
} from "@luccello/database";
import { getDatabase } from "../../shared/database/client.js";
import type {
  bannerAdminSchema,
  categoryAdminSchema,
  inventoryAdminSchema,
  productAdminSchema,
} from "./admin.schemas.js";
import type { z } from "zod";

type ProductInput = z.infer<typeof productAdminSchema>;
type CategoryInput = z.infer<typeof categoryAdminSchema>;
type BannerInput = z.infer<typeof bannerAdminSchema>;
type InventoryInput = z.infer<typeof inventoryAdminSchema>;
type Patch<T> = { [K in keyof T]?: T[K] | undefined };

const db = () => getDatabase();
function productValues(input: ProductInput) {
  return {
    slug: input.slug,
    sku: input.sku,
    nameAr: input.nameAr,
    nameEn: input.nameEn ?? null,
    shortDescriptionAr: input.shortDescriptionAr ?? null,
    descriptionAr: input.descriptionAr,
    color: input.color ?? null,
    material: input.material ?? null,
    dimensions: input.dimensions ?? null,
    notes: input.notes ?? null,
    salePrice: input.salePrice.toFixed(2),
    regularPrice: input.regularPrice.toFixed(2),
    currency: "ILS",
    published: input.published,
    featured: input.featured,
    newest: input.newest,
    sale: input.sale,
    seoTitle: input.nameAr,
    seoDescription: input.shortDescriptionAr ?? input.descriptionAr,
    updatedAt: new Date(),
  };
}

async function attachProductRelations(
  productId: string,
  imageUrl: string | null | undefined,
  categoryIds: string[],
) {
  const database = db();
  await database.delete(productImages).where(eq(productImages.productId, productId));
  if (imageUrl?.trim()) {
    await database.insert(productImages).values({ productId, url: imageUrl.trim(), sortOrder: 0 });
  }
  await database.delete(productCategories).where(eq(productCategories.productId, productId));
  if (categoryIds.length) {
    await database
      .insert(productCategories)
      .values(categoryIds.map((categoryId) => ({ productId, categoryId })));
  }
}
export async function listAdminProducts() {
  const rows = await db()
    .select({ product: products, stock: inventory })
    .from(products)
    .leftJoin(inventory, eq(inventory.productId, products.id))
    .where(isNull(products.deletedAt))
    .orderBy(desc(products.updatedAt));

  return Promise.all(
    rows.map(async ({ product, stock }) => {
      const [images, categoryRows] = await Promise.all([
        db().select().from(productImages).where(eq(productImages.productId, product.id)),
        db()
          .select({ category: categories })
          .from(productCategories)
          .innerJoin(categories, eq(categories.id, productCategories.categoryId))
          .where(eq(productCategories.productId, product.id)),
      ]);
      return {
        ...product,
        salePrice: Number(product.salePrice),
        regularPrice: Number(product.regularPrice),
        imageUrl: images[0]?.url ?? null,
        categories: categoryRows.map((row) => row.category),
        inventory: stock,
      };
    }),
  );
}
export async function createAdminProduct(input: ProductInput) {
  const [created] = await db().insert(products).values(productValues(input)).returning();
  if (!created) throw new Error("product_create_failed");
  await db().insert(inventory).values({
    productId: created.id,
    quantity: input.inventoryQuantity,
    lowStockThreshold: input.lowStockThreshold,
  });
  await attachProductRelations(created.id, input.imageUrl, input.categoryIds);
  return created.id;
}

export async function updateAdminProduct(productId: string, patch: Patch<ProductInput>) {
  const current = (await listAdminProducts()).find((item) => item.id === productId);
  if (!current) throw new Error("product_not_found");
  const merged: ProductInput = {
    slug: patch.slug ?? current.slug,
    sku: patch.sku ?? current.sku,
    nameAr: patch.nameAr ?? current.nameAr,
    nameEn: patch.nameEn ?? current.nameEn,
    shortDescriptionAr: patch.shortDescriptionAr ?? current.shortDescriptionAr,
    descriptionAr: patch.descriptionAr ?? current.descriptionAr,
    color: patch.color ?? current.color,
    material: patch.material ?? current.material,
    dimensions: patch.dimensions ?? current.dimensions,
    notes: patch.notes ?? current.notes,
    salePrice: patch.salePrice ?? current.salePrice,
    regularPrice: patch.regularPrice ?? current.regularPrice,
    published: patch.published ?? current.published,
    featured: patch.featured ?? current.featured,
    newest: patch.newest ?? current.newest,
    sale: patch.sale ?? current.sale,
    imageUrl: patch.imageUrl ?? current.imageUrl,
    categoryIds: patch.categoryIds ?? current.categories.map((category) => category.id),
    inventoryQuantity: patch.inventoryQuantity ?? current.inventory?.quantity ?? 0,
    lowStockThreshold: patch.lowStockThreshold ?? current.inventory?.lowStockThreshold ?? 3,
  };

  await db().update(products).set(productValues(merged)).where(eq(products.id, productId));
  await db()
    .insert(inventory)
    .values({
      productId,
      quantity: merged.inventoryQuantity,
      lowStockThreshold: merged.lowStockThreshold,
    })
    .onConflictDoUpdate({
      target: inventory.productId,
      set: {
        quantity: merged.inventoryQuantity,
        lowStockThreshold: merged.lowStockThreshold,
        updatedAt: new Date(),
      },
    });
  await attachProductRelations(productId, merged.imageUrl, merged.categoryIds);
}

export async function deleteAdminProduct(productId: string) {
  await db()
    .update(products)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(products.id, productId));
}
export async function listAdminCategories() {
  return db().select().from(categories).orderBy(categories.nameAr);
}

export async function createAdminCategory(input: CategoryInput) {
  const [created] = await db()
    .insert(categories)
    .values({
      slug: input.slug,
      nameAr: input.nameAr,
      nameEn: input.nameEn ?? null,
      descriptionAr: input.descriptionAr ?? null,
      imageUrl: input.imageUrl?.trim() || null,
    })
    .returning();
  return created;
}

export async function updateAdminCategory(categoryId: string, patch: Patch<CategoryInput>) {
  const values = Object.fromEntries(
    Object.entries({ ...patch, updatedAt: new Date() }).filter(([, value]) => value !== undefined),
  );
  await db().update(categories).set(values).where(eq(categories.id, categoryId));
}

export async function deleteAdminCategory(categoryId: string) {
  await db().delete(categories).where(eq(categories.id, categoryId));
}
export async function listAdminBanners() {
  return db().select().from(banners).orderBy(desc(banners.updatedAt));
}

export async function createAdminBanner(input: BannerInput) {
  const [created] = await db()
    .insert(banners)
    .values({
      title: input.title,
      imageUrl: input.imageUrl?.trim() || "",
      href: input.href ?? null,
      enabled: input.enabled,
    })
    .returning();
  return created;
}

export async function updateAdminBanner(bannerId: string, patch: Patch<BannerInput>) {
  const values = {
    ...(patch.title !== undefined ? { title: patch.title } : {}),
    ...(patch.imageUrl !== undefined ? { imageUrl: patch.imageUrl?.trim() || "" } : {}),
    ...(patch.href !== undefined ? { href: patch.href } : {}),
    ...(patch.enabled !== undefined ? { enabled: patch.enabled } : {}),
    updatedAt: new Date(),
  };
  await db().update(banners).set(values).where(eq(banners.id, bannerId));
}

export async function deleteAdminBanner(bannerId: string) {
  await db().delete(banners).where(eq(banners.id, bannerId));
}
export async function updateAdminInventory(productId: string, input: InventoryInput) {
  await db()
    .insert(inventory)
    .values({ productId, quantity: input.quantity, lowStockThreshold: input.lowStockThreshold })
    .onConflictDoUpdate({
      target: inventory.productId,
      set: {
        quantity: input.quantity,
        lowStockThreshold: input.lowStockThreshold,
        updatedAt: new Date(),
      },
    });
}

export async function listAdminUsers() {
  return db().select().from(users).orderBy(desc(users.createdAt));
}

export async function listAdminOrders() {
  const rows = await db().select().from(orders).orderBy(desc(orders.createdAt));
  return rows.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    discountTotal: Number(order.discountTotal),
    shippingTotal: Number(order.shippingTotal),
    total: Number(order.total),
  }));
}
export async function getAdminDashboard() {
  const [productCount, userCount, orderCount, lowStock, revenue] = await Promise.all([
    db()
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(isNull(products.deletedAt)),
    db()
      .select({ count: sql<number>`count(*)::int` })
      .from(users),
    db()
      .select({ count: sql<number>`count(*)::int` })
      .from(orders),
    db()
      .select({ count: sql<number>`count(*)::int` })
      .from(inventory)
      .where(sql`${inventory.quantity} <= ${inventory.lowStockThreshold}`),
    db()
      .select({ total: sql<string>`coalesce(sum(${orders.total}), 0)` })
      .from(orders),
  ]);

  return {
    products: productCount[0]?.count ?? 0,
    users: userCount[0]?.count ?? 0,
    orders: orderCount[0]?.count ?? 0,
    lowStock: lowStock[0]?.count ?? 0,
    revenue: Number(revenue[0]?.total ?? 0),
    currency: "ILS",
  };
}

export async function getAdminAnalytics() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeSince = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const database = db();
  const [sessionTotal, activeSessions, activityByType, recentActivity, ads] = await Promise.all([
    database
      .select({ count: sql<number>`count(*)::int` })
      .from(userSessions)
      .where(isNull(userSessions.revokedAt)),
    database
      .select({ count: sql<number>`count(*)::int` })
      .from(userSessions)
      .where(and(isNull(userSessions.revokedAt), gte(userSessions.lastSeenAt, activeSince))),
    database
      .select({ type: analyticsEvents.type, count: sql<number>`count(*)::int` })
      .from(analyticsEvents)
      .where(gte(analyticsEvents.createdAt, since))
      .groupBy(analyticsEvents.type),
    database
      .select({
        id: analyticsEvents.id,
        type: analyticsEvents.type,
        userId: analyticsEvents.userId,
        anonymousId: analyticsEvents.anonymousId,
        payload: analyticsEvents.payload,
        createdAt: analyticsEvents.createdAt,
      })
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(25),
    database
      .select({
        bannerId: advertisementMetrics.bannerId,
        title: banners.title,
        impressions: sql<number>`coalesce(sum(${advertisementMetrics.impressions}), 0)::int`,
        clicks: sql<number>`coalesce(sum(${advertisementMetrics.clicks}), 0)::int`,
        conversions: sql<number>`coalesce(sum(${advertisementMetrics.conversions}), 0)::int`,
        revenue: sql<string>`coalesce(sum(${advertisementMetrics.revenue}), 0)`,
      })
      .from(advertisementMetrics)
      .innerJoin(banners, eq(banners.id, advertisementMetrics.bannerId))
      .where(gte(advertisementMetrics.day, since))
      .groupBy(advertisementMetrics.bannerId, banners.title),
  ]);

  return {
    periodDays: 7,
    sessions: {
      total: sessionTotal[0]?.count ?? 0,
      active24h: activeSessions[0]?.count ?? 0,
    },
    activityByType,
    recentActivity,
    advertisements: ads.map((row) => ({
      ...row,
      revenue: Number(row.revenue),
      clickThroughRate: row.impressions ? (row.clicks / row.impressions) * 100 : 0,
      conversionRate: row.clicks ? (row.conversions / row.clicks) * 100 : 0,
    })),
  };
}
