import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { isAdminEmail } from "@/lib/admin";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminPage && !isAdminApi) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAdmin = isAdminEmail(token?.email);

  if (isAdminPage) {
    if (isAdminLogin && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    if (!isAdminLogin && !isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminApi && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
