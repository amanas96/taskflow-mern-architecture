import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// src/middleware.ts
export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");

  if (request.nextUrl.pathname.startsWith("/tasks") && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// ADD THIS AT THE BOTTOM OF THE FILE
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
