import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  isSameOriginMutation,
  isValidAdminSession,
} from "../../../../lib/admin-auth";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "admin_auth_required" }, { status: 401 });
  }
  if (request.method !== "GET") {
    if (
      !isSameOriginMutation(request) ||
      request.headers.get("x-requested-with") !== "luccello-admin"
    ) {
      return NextResponse.json({ error: "csrf_check_failed" }, { status: 403 });
    }
  }
  const key = process.env.ADMIN_LOCAL_KEY;
  if (!key || key.length < 24)
    return NextResponse.json({ error: "admin_backend_not_configured" }, { status: 503 });
  const { path } = await context.params;
  if (path.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment))) {
    return NextResponse.json({ error: "invalid_path" }, { status: 400 });
  }
  const apiBase = (process.env.API_DOMAIN ?? "http://localhost:4000").replace(/\/$/, "");
  const target = `${apiBase}/admin/${path.join("/")}`;
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

  try {
    const response = await fetch(target, {
      method,
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/json",
        "x-admin-key": key,
      },
      ...(body ? { body } : {}),
      cache: "no-store",
    });
    const content = await response.text();
    return new NextResponse(content || null, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ error: "admin_api_unavailable" }, { status: 503 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
