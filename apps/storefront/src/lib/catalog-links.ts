export function productHref(slug: string) {
  return `/ar/product-view?slug=${encodeURIComponent(slug)}`;
}

export function categoryHref(slug: string) {
  return `/ar/category-view?slug=${encodeURIComponent(slug)}`;
}
