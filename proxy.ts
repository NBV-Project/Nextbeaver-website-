import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionValue,
  parseAdminSession,
  shouldRotateAdminSession,
  getAdminSessionCookieOptions,
} from "@/lib/auth/adminSession";

const PUBLIC_ADMIN_PATHS = ["/admin", "/api/admin/login"];
const PROTECTED_API_PATHS = [
  "/api/home/save",
  "/api/about/save",
  "/api/services/save",
  "/api/portfolio/save",
  "/api/portfolio/upload",
  "/api/process/save",
  "/api/contact/save",
  "/api/faq/save",
];

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((path) => pathname === path);
}

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isProtectedApiPath(pathname: string) {
  return PROTECTED_API_PATHS.includes(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isAdminPath(pathname) && !isProtectedApiPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const sessionValue = request.cookies.get("admin_session")?.value;
  const parsedSession = await parseAdminSession(sessionValue);
  if (parsedSession) {
    const response = NextResponse.next();
    if (shouldRotateAdminSession(parsedSession)) {
      const nextValue = await createAdminSessionValue(parsedSession.actorId);
      if (nextValue) {
        response.cookies.set("admin_session", nextValue, getAdminSessionCookieOptions());
      }
    }
    return response;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
