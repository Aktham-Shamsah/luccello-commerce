import { eq, isNull } from "drizzle-orm";
import {
  categories,
  inventory,
  productCategories,
  productImages,
  products as productTable,
} from "@luccello/database";
import type { Product } from "@luccello/types";
import { getDatabase } from "../../shared/database/client.js";

async function mapRow(row: typeof productTable.$inferSelect): Promise<Product> {
  const db = getDatabase();
  const [images, categoryRows, stockRows] = await Promise.all([
    db.select().from(productImages).where(eq(productImages.productId, row.id)),
    db
      .select({ slug: categories.slug })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(eq(productCategories.productId, row.id)),
    db.select().from(inventory).where(eq(inventory.productId, row.id)),
  ]);
  const stock = stockRows[0];
  return {
    id: row.id,
    slug: row.slug,
    sku: row.sku,
    nameAr: row.nameAr,
    ...(row.nameEn ? { nameEn: row.nameEn } : {}),
    shortDescriptionAr: row.shortDescriptionAr ?? row.descriptionAr.slice(0, 140),
    descriptionAr: row.descriptionAr,
    salePrice: Number(row.salePrice),
    regularPrice: Number(row.regularPrice),
    currency: "ILS",
    categories: categoryRows.map((category) => category.slug),
    images: images.map((image) => image.url),
    color: row.color ?? "",
    material: row.material ?? "",
    dimensions: row.dimensions ?? "",
    inventoryQuantity: stock?.quantity ?? 0,
    lowStockThreshold: stock?.lowStockThreshold ?? 3,
    published: row.published,
    featured: row.featured,
    newest: row.newest,
    sale: row.sale,
    ...(row.notes ? { notes: row.notes } : {}),
    seoTitle: row.seoTitle ?? row.nameAr,
    seoDescription: row.seoDescription ?? row.descriptionAr,
    relatedProductIds: [],
  };
}

export async function listPublishedDatabaseProducts() {
  const rows = await getDatabase()
    .select()
    .from(productTable)
    .where(isNull(productTable.deletedAt));
  return Promise.all(rows.filter((row) => row.published).map(mapRow));
}

export async function findPublishedDatabaseProductBySlug(slug: string) {
  const rows = await getDatabase().select().from(productTable).where(eq(productTable.slug, slug));
  const row = rows.find((item) => item.published && item.deletedAt === null);
  return row ? mapRow(row) : undefined;
}
