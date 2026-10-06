import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/auth',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/test',
  '/_next',
  '/favicon.ico',
  '/api/webhooks',
]

// Routes that are always public (static assets, etc.)
const staticRoutes = [
  '/_next',
  '/favicon.ico',
  '/images',
  '/icons',
  '/api/webhooks',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static routes and API webhooks
  if (staticRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Temporarily allow all requests for testing
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons).*)',
  ],
} 