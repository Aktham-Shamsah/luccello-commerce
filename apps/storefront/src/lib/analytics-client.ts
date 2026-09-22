"use client";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const CONSENT_COOKIE = "luccello_cookie_consent";

type ConsentChoice = "analytics" | "essential";
type ActivityType =
  "page_view" | "product_view" | "cart_add" | "cart_remove" | "search" | "checkout_start";

export function storefrontApiUrl() {
  if (configuredApiUrl) return configuredApiUrl;
  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ) {
    return "http://localhost:4000";
  }
  return "";
}

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`));
  const value = match?.split("=")[1];
  return value === "analytics" || value === "essential" ? value : null;
}
function writeConsent(choice: ConsentChoice) {
  const secure =
    typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
}

async function apiFetch(path: string, init?: RequestInit) {
  const base = storefrontApiUrl();
  if (!base) return undefined;
  return fetch(`${base}${path}`, {
    ...init,
    credentials: "include",
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  }).catch(() => undefined);
}

export async function ensureBrowserSession() {
  return apiFetch("/analytics/session");
}

export async function setAnalyticsConsent(enabled: boolean) {
  const choice: ConsentChoice = enabled ? "analytics" : "essential";
  writeConsent(choice);
  await ensureBrowserSession();
  await apiFetch("/analytics/session/consent", {
    method: "POST",
    body: JSON.stringify({ analytics: enabled }),
  });
}
export async function recordActivity(type: ActivityType, path: string, productId?: string) {
  if (readConsent() !== "analytics") return;
  await apiFetch("/analytics/activity", {
    method: "POST",
    body: JSON.stringify({ type, path, ...(productId ? { productId } : {}) }),
  });
}

export async function recordAdvertisement(
  bannerId: string,
  eventType: "impression" | "click" | "conversion",
  revenue?: number,
) {
  if (readConsent() !== "analytics") return;
  await apiFetch("/analytics/advertisement", {
    method: "POST",
    body: JSON.stringify({ bannerId, eventType, ...(revenue !== undefined ? { revenue } : {}) }),
  });
}
