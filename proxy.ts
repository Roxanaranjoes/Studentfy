import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/constants";

const AUTH_ROUTES = ["/login", "/register"];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
