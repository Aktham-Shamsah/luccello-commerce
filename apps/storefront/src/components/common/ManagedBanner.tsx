"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/common/SafeImage";

type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  href: string | null;
  enabled: boolean;
};

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

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

export function ManagedBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;
    fetch(`${apiUrl}/banners`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items: Banner[]) => setBanner(items.find((item) => item.enabled) ?? null))
      .catch(() => setBanner(null));
  }, []);

  if (!banner) return null;

  const content = (
    <div className="managed-banner__content">
      <SafeImage src={banner.imageUrl} alt={banner.title} />
      <div className="managed-banner__overlay">
        <h2>{banner.title}</h2>
        {banner.href ? <span>عرض التفاصيل</span> : null}
      </div>
    </div>
  );

  return (
    <section className="managed-banner" aria-label={banner.title}>
      {banner.href ? (
        <a href={banner.href} className="managed-banner__link">
          {content}
        </a>
      ) : (
        content
      )}
    </section>
  );
}
