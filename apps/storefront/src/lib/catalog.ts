import type { Category, Product } from "@luccello/types";

export const categories: Category[] = [
  {
    id: "all",
    slug: "all",
    nameAr: "جميع المنتجات",
    nameEn: "All Products",
    descriptionAr: "اختيارات يومية وعملية بتفاصيل أنيقة.",
    image: "/product-collage.png",
  },
  {
    id: "handbags",
    slug: "handbags",
    nameAr: "شنط يد",
    nameEn: "Handbags",
    descriptionAr: "قطع صغيرة راقية للمناسبات واليوميات.",
    image: "/product-collage.png",
  },
  {
    id: "crossbody",
    slug: "crossbody",
    nameAr: "شنط كروس بودي",
    nameEn: "CrossBody Bag",
    descriptionAr: "حرية حركة مع تنظيم عملي.",
    image: "/product-collage.png",
  },
  {
    id: "tote",
    slug: "tote-bags",
    nameAr: "شنط جامعية",
    nameEn: "Tote Bags",
    descriptionAr: "مساحة واسعة للعمل والدراسة.",
    image: "/product-collage.png",
  },
  {
    id: "shoulder",
    slug: "shoulder-bags",
    nameAr: "شنط كتف",
    nameEn: "Shoulder Bags",
    descriptionAr: "تصاميم أنيقة بخيارات ألوان هادئة.",
    image: "/product-collage.png",
  },
];

const baseProduct = {
  shortDescriptionAr: "حقيبة يومية بتقسيم داخلي عملي وسحاب آمن.",
  descriptionAr:
    "حقيبة مصممة لليوم الطويل: وزن خفيف، جلد نباتي ناعم، ومساحة تكفي الأساسيات بدون تضخم.",
  currency: "SAR",
  images: ["/product-collage.png"],
  material: "جلد نباتي مبطن",
  dimensions: "28 x 20 x 10 سم",
  lowStockThreshold: 4,
  published: true,
  notes: "تصل داخل كيس حفظ قطني.",
  attachments: [{ label: "دليل العناية", url: "/care-guide.pdf" }],
  seoTitle: "حقيبة نسائية أنيقة",
  seoDescription: "حقيبة نسائية أصلية بتصميم عملي وخامة فاخرة.",
} satisfies Omit<
  Product,
  | "id"
  | "sku"
  | "slug"
  | "nameAr"
  | "nameEn"
  | "categories"
  | "salePrice"
  | "regularPrice"
  | "color"
  | "inventoryQuantity"
  | "featured"
  | "newest"
  | "sale"
  | "relatedProductIds"
>;

export const products: Product[] = Array.from({ length: 16 }, (_, index) => {
  const n = 66 - index;
  const code = String(n).padStart(3, "0");
  const category = categories[(index % (categories.length - 1)) + 1];
  const regularPrice = index % 3 === 0 ? 349 : 320;
  const salePrice = index < 12 ? 196 : 296;
  return {
    ...baseProduct,
    id: `prod-${n}`,
    sku: `LUC-${n}`,
    slug: code,
    nameAr: code,
    nameEn: `Bag ${n}`,
    categories: [category?.slug ?? "handbags"],
    salePrice,
    regularPrice,
    color: ["عاجي", "تركواز", "أسود", "وردي هادئ"][index % 4] ?? "عاجي",
    inventoryQuantity: index === 7 ? 0 : index < 4 ? 3 : 18,
    featured: index < 8,
    newest: index > 6,
    sale: salePrice < regularPrice,
    relatedProductIds: [`prod-${65 - index}`, `prod-${64 - index}`].filter(Boolean),
  };
});

export const testimonials = [
  { name: "عميلة من الرياض", body: "التغليف مرتب والخامة أجمل من المتوقع. وصلت بسرعة.", rating: 5 },
  { name: "عميلة من جدة", body: "الحقيبة خفيفة وتنفع للدوام، اللون مطابق للصور.", rating: 5 },
  { name: "عميلة من الدمام", body: "أعجبني وضوح المقاسات وخدمة الواتساب.", rating: 4 },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  if (slug === "all") return products;
  return products.filter((product) => product.categories.includes(slug));
}

export function searchProducts(query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return products;
  return products.filter((product) =>
    [product.nameAr, product.nameEn, product.sku, product.color, product.descriptionAr]
      .join(" ")
      .toLowerCase()
      .includes(term),
  );
}
