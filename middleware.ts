import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin (excluding /admin-login)
  const isAdminPath = path.startsWith("/admin") && !path.startsWith("/admin-login")

  // Get the admin session cookie
  const adminSession = request.cookies.get("admin_session")?.value

  // If the path is an admin path and there's no admin session, redirect to login
  if (isAdminPath && adminSession !== "authenticated") {
    return NextResponse.redirect(new URL("/admin-login", request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ["/admin/:path*"],
}
