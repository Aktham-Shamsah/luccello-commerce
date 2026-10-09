import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, authCookieOptions, isSameOriginMutation } from "../../../../lib/admin-auth";

export async function POST(req: NextRequest) {
  if (!isSameOriginMutation(req))
    return NextResponse.json({ error: "origin_forbidden" }, { status: 403 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...authCookieOptions(), maxAge: 0 });
  return response;
}
