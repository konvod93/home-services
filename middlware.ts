// ⚠️ REVIEW: File is named `middlware.ts` — missing letter `e`.
// Next.js only loads middleware from a file named exactly `middleware.ts`.
// This file is NEVER executed — all route protection logic here is dead code.
// FIX: rename this file to `middleware.ts`

import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/services"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isPublic = publicRoutes.includes(nextUrl.pathname);

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (session && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (nextUrl.pathname.startsWith("/admin") && session?.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};