import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  authCookieOptions,
  isSameOriginMutation,
  issueAdminSession,
  verifyAdminPassword,
} from "../../../../lib/admin-auth";

const attempts = new Map<string, { count: number; resetAt: number }>();
export async function POST(req: NextRequest) {
  if (!isSameOriginMutation(req))
    return NextResponse.json({ error: "origin_forbidden" }, { status: 403 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.resetAt > now && record.count >= 5) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const password =
    typeof body === "object" && body && "password" in body && typeof body.password === "string"
      ? body.password
      : "";
  let valid = false;
  try {
    valid = verifyAdminPassword(password);
  } catch {
    return NextResponse.json({ error: "admin_not_configured" }, { status: 503 });
  }
  if (!valid) {
    attempts.set(ip, {
      count: record && record.resetAt > now ? record.count + 1 : 1,
      resetAt: now + 15 * 60_000,
    });
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }
  attempts.delete(ip);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, issueAdminSession(), authCookieOptions());
  return response;
}
