import { productRepository } from "./product.repository.js";

export const productService = {
  listPublished() {
    return productRepository.list().filter((product) => product.published);
  },
  getBySlug(slug: string) {
    const product = productRepository.findBySlug(slug);
    if (!product || !product.published) throw new Error("product_not_found");
    return product;
  },
};
