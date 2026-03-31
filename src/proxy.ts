import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth";

const PUBLIC_BACKOFFICE_PATHS = new Set([
  "/backoffice/login",
  "/api/auth/login",
]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/backoffice") &&
    !PUBLIC_BACKOFFICE_PATHS.has(pathname)
  ) {
    const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

    if (!hasSession) {
      const loginUrl = new URL("/backoffice/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backoffice/:path*", "/api/auth/:path*"],
};
