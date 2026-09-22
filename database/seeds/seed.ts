import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import {
  banners,
  categories,
  inventory,
  productCategories,
  productImages,
  products,
} from "../schema/schema.js";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/luccello",
});
const db = drizzle(pool);

const categorySeed = [
  { slug: "handbags", nameAr: "شنط يد", nameEn: "Handbags" },
  { slug: "crossbody", nameAr: "شنط كروس بودي", nameEn: "CrossBody Bag" },
  { slug: "tote-bags", nameAr: "شنط جامعية", nameEn: "Tote Bags" },
  { slug: "shoulder-bags", nameAr: "شنط كتف", nameEn: "Shoulder Bags" },
];

const productSeed = [
  { slug: "066", sku: "LUC-066", nameAr: "066", category: "handbags", price: 196, stock: 18 },
  { slug: "065", sku: "LUC-065", nameAr: "065", category: "crossbody", price: 196, stock: 3 },
  { slug: "064", sku: "LUC-064", nameAr: "064", category: "tote-bags", price: 296, stock: 12 },
  { slug: "063", sku: "LUC-063", nameAr: "063", category: "shoulder-bags", price: 196, stock: 6 },
];

async function seed() {
  const categoryIds = new Map<string, string>();
  for (const category of categorySeed) {
    const [row] = await db
      .insert(categories)
      .values({
        ...category,
        descriptionAr: `تشكيلة ${category.nameAr}`,
        imageUrl: "/product-collage.png",
      })
      .onConflictDoUpdate({
        target: categories.slug,
        set: { nameAr: category.nameAr, nameEn: category.nameEn, updatedAt: new Date() },
      })
      .returning({ id: categories.id });
    if (row) categoryIds.set(category.slug, row.id);
  }

  for (const item of productSeed) {
    const [product] = await db
      .insert(products)
      .values({
        slug: item.slug,
        sku: item.sku,
        nameAr: item.nameAr,
        descriptionAr: "منتج تجريبي يمكن تعديله بالكامل من لوحة الإدارة.",
        shortDescriptionAr: "حقيبة عملية بتصميم أنيق.",
        salePrice: item.price.toFixed(2),
        regularPrice: (item.price + 100).toFixed(2),
        currency: "ILS",
        published: true,
        featured: true,
        newest: true,
        sale: true,
        seoTitle: item.nameAr,
        seoDescription: "منتج LU'CHÉLO",
      })
      .onConflictDoUpdate({
        target: products.slug,
        set: { salePrice: item.price.toFixed(2), currency: "ILS", updatedAt: new Date() },
      })
      .returning({ id: products.id });
    if (!product) continue;
    await db
      .insert(inventory)
      .values({ productId: product.id, quantity: item.stock, lowStockThreshold: 3 })
      .onConflictDoUpdate({
        target: inventory.productId,
        set: { quantity: item.stock, updatedAt: new Date() },
      });

    const categoryId = categoryIds.get(item.category);
    if (categoryId) {
      await db
        .insert(productCategories)
        .values({ productId: product.id, categoryId })
        .onConflictDoNothing();
    }

    const existingImages = await db
      .select({ id: productImages.id })
      .from(productImages)
      .where(eq(productImages.productId, product.id));
    if (!existingImages.length) {
      await db.insert(productImages).values({
        productId: product.id,
        url: "/product-collage.png",
        alt: item.nameAr,
        sortOrder: 0,
      });
    }
  }

  const existingBanners = await db.select({ id: banners.id }).from(banners);
  if (!existingBanners.length) {
    await db.insert(banners).values({
      title: "أحدث عروض LU'CHÉLO",
      imageUrl: "/hero-campaign.png",
      href: "/ar/offers",
      enabled: true,
    });
  }
}

seed()
  .then(() => console.log("Database seed complete."))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
