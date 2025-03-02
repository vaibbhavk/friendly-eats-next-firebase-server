import { NextResponse } from "next/server";
import { getAuthenticatedAppForUser } from "./lib/firebase/serverApp";

// Middleware configuration
export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the idToken from the Authorization header
  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];

  if (!idToken) {
    // Redirect to login if no token is provided
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify Firebase token and check if user is logged in
    const { currentUser: firebaseUser } = await getAuthenticatedAppForUser(
      idToken
    );
    if (!firebaseUser) {
      // Redirect to login if token is invalid or user is not authenticated
      return NextResponse.redirect(new URL("/", request.url));
    }

    // User is logged in, proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware authentication error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

// Matcher to specify which routes the middleware applies to
export const config = {
  matcher: ["/profile/:path*"],
};
