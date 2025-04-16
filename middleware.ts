// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the current pathname
  const pathname = request.nextUrl.pathname;

  // Check if the user is trying to access the home page ("/")
  if (pathname === "/") {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue with the default behavior for other routes
  return NextResponse.next();
}

// Optional: Define matcher to limit middleware execution to specific paths
export const config = {
  matcher: ["/"], // Only apply middleware to the home page
};
