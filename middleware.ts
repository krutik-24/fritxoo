import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This is a simplified middleware for demonstration
// In a real application, you would use a more robust authentication system
export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  // Check if user is authenticated as admin
  // This is a placeholder - in a real app, you would verify a session token
  const isAdmin = request.cookies.has("admin_session")

  if (isAdminRoute && !isAdmin) {
    // Redirect to login page if not authenticated
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
