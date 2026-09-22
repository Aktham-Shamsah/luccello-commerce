"use client";

import { useEffect, useState } from "react";
import type { Category, Product } from "@luccello/types";
import { categories as fallbackCategories, products as fallbackProducts } from "./catalog";
import { publicPath } from "./public-path";

type ApiCategory = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
};

type CatalogData = { categories: Category[]; products: Product[] };

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
let catalogPromise: Promise<CatalogData> | null = null;

function getApiUrl() {
  if (configuredApiUrl) return configuredApiUrl;
  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return "http://localhost:4000";
  }
  return "";
}

function loadCatalog(): Promise<CatalogData> {
  const apiUrl = getApiUrl();
  if (!apiUrl)
    return Promise.resolve({ categories: fallbackCategories, products: fallbackProducts });
  if (catalogPromise) return catalogPromise;
  catalogPromise = Promise.all([
    fetch(`${apiUrl}/categories`).then((response) => (response.ok ? response.json() : [])),
    fetch(`${apiUrl}/products`).then((response) => (response.ok ? response.json() : [])),
  ]).then(([categoryRows, productRows]: [ApiCategory[], Product[]]) => ({
    categories: categoryRows.length
      ? categoryRows.map((category) => ({
          id: category.id,
          slug: category.slug,
          nameAr: category.nameAr,
          nameEn: category.nameEn ?? "",
          descriptionAr: category.descriptionAr ?? "",
          image: category.imageUrl?.trim() || publicPath("/product-collage.png"),
        }))
      : fallbackCategories,
    products: productRows.length ? productRows : fallbackProducts,
  }));
  return catalogPromise;
}

export function useCatalogData() {
  const [data, setData] = useState<CatalogData>({
    categories: fallbackCategories,
    products: fallbackProducts,
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    loadCatalog()
      .then((next) => {
        if (active) setData(next);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  return { ...data, ready };
}
