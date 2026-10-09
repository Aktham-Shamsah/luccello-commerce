import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "luccello_admin";
const TTL_SECONDS = 2 * 60 * 60;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET ?? "";
  if (value.length < 32 || value.includes("CHANGE_ME"))
    throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function issueAdminSession() {
  const payload = `${Math.floor(Date.now() / 1000)}.${randomBytes(24).toString("hex")}`;
  return `${payload}.${signature(payload)}`;
}

export function isValidAdminSession(token: string | undefined) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issued, nonce, mac] = parts;
  if (
    !issued ||
    !nonce ||
    !mac ||
    !/^\d+$/.test(issued) ||
    !/^[a-f0-9]{48}$/.test(nonce) ||
    !/^[a-f0-9]{64}$/.test(mac)
  )
    return false;
  const age = Date.now() / 1000 - Number(issued);
  if (age < 0 || age > TTL_SECONDS) return false;
  const expected = Buffer.from(signature(`${issued}.${nonce}`), "hex");
  return timingSafeEqual(expected, Buffer.from(mac, "hex"));
}

export function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (expected.length < 16 || expected.includes("CHANGE_ME"))
    throw new Error("ADMIN_PASSWORD must contain at least 16 characters");
  const actualDigest = createHmac("sha256", secret()).update(password).digest();
  const expectedDigest = createHmac("sha256", secret()).update(expected).digest();
  return timingSafeEqual(actualDigest, expectedDigest);
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: TTL_SECONDS,
  };
}

export function isSameOriginMutation(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(req.url).host;
  } catch {
    return false;
  }
}
