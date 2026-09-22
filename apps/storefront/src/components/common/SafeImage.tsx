"use client";

import type { ComponentPropsWithoutRef } from "react";
import { publicPath } from "@/lib/public-path";

type SafeImageProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  src?: string | null | undefined;
  fallbackSrc?: string | undefined;
};

export function SafeImage({ src, fallbackSrc, alt, onError, ...props }: SafeImageProps) {
  const fallback = fallbackSrc ?? publicPath("/product-collage.png");
  const resolvedSrc = src?.trim() || fallback;

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt ?? ""}
      onError={(event) => {
        onError?.(event);
        if (event.currentTarget.src.endsWith(fallback)) return;
        event.currentTarget.src = fallback;
      }}
    />
  );
}
