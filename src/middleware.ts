/**
 * Next.js Middleware
 * 
 * Handles route protection and authorization.
 * Redirects unauthenticated users to login.
 */

import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/patients', '/tests', '/reports', '/invoices', '/settings']

// Routes that should redirect authenticated users away
const authRoutes = ['/auth/login', '/auth/signup']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get auth token from cookies
  const token = request.cookies.get('__session')?.value

  // If trying to access protected route without authentication
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If trying to access auth routes while authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/patients/:path*',
    '/tests/:path*',
    '/reports/:path*',
    '/invoices/:path*',
    '/settings/:path*',
    // Auth routes
    '/auth/:path*',
  ],
}
