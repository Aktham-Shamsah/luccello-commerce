"use client";

import { useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/common/SafeImage";
import { recordAdvertisement } from "@/lib/analytics-client";

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
  const impressionTracked = useRef<string | null>(null);

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;
    fetch(`${apiUrl}/banners`)
      .then((response) => (response.ok ? response.json() : []))
      .then((items: Banner[]) => setBanner(items.find((item) => item.enabled) ?? null))
      .catch(() => setBanner(null));
  }, []);

  useEffect(() => {
    if (!banner || impressionTracked.current === banner.id) return;
    impressionTracked.current = banner.id;
    void recordAdvertisement(banner.id, "impression");
  }, [banner]);

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
        <a
          href={banner.href}
          className="managed-banner__link"
          onClick={() => void recordAdvertisement(banner.id, "click")}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </section>
  );
}
