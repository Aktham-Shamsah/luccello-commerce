import type { Product } from "@luccello/types";

export const products: Product[] = [
  {
    id: "prod-66",
    slug: "066",
    sku: "LUC-066",
    nameAr: "066",
    nameEn: "Structured Tote",
    shortDescriptionAr: "حقيبة منظمة بحجم يومي.",
    descriptionAr: "منتج تجريبي بخامة جلد نباتي ومقاسات عملية.",
    salePrice: 196,
    regularPrice: 320,
    currency: "SAR",
    categories: ["handbags"],
    images: ["/product-collage.png"],
    color: "عاجي",
    material: "جلد نباتي",
    dimensions: "28 x 20 x 10 سم",
    inventoryQuantity: 18,
    lowStockThreshold: 4,
    published: true,
    featured: true,
    newest: true,
    sale: true,
    seoTitle: "066",
    seoDescription: "حقيبة تجريبية.",
    relatedProductIds: ["prod-65"],
  },
];

export const productRepository = {
  list() {
    return products;
  },
  findBySlug(slug: string) {
    return products.find((product) => product.slug === slug);
  },
};
