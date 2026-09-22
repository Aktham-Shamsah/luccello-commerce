import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext) {
  const { path } = await context.params;
  const apiBase = (process.env.API_DOMAIN ?? "http://localhost:4000").replace(/\/$/, "");
  const target = `${apiBase}/admin/${path.join("/")}`;
  const method = request.method.toUpperCase();
  const body = method === "GET" || method === "HEAD" ? undefined : await request.text();

  try {
    const response = await fetch(target, {
      method,
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/json",
        "x-admin-key": process.env.ADMIN_LOCAL_KEY ?? "local-admin-key",
      },
      ...(body ? { body } : {}),
      cache: "no-store",
    });
    const text = await response.text();
    return new NextResponse(text || null, {
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
