import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("auth")?.value === "true"
  const isAuthPage = request.nextUrl.pathname.startsWith("/signin") || request.nextUrl.pathname.startsWith("/signup")||  request.nextUrl.pathname.startsWith("/resources") || request.nextUrl.pathname.startsWith("/terms-and-condition")
  const isLandingPage = request.nextUrl.pathname === "/"

  if (!isLoggedIn && !isAuthPage && !isLandingPage) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

