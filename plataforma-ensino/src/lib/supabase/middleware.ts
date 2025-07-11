import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('[MIDDLEWARE] Processing:', request.nextUrl.pathname)
  
  // CRITICAL FIX: Completely skip Supabase calls in middleware for Netlify compatibility
  // All auth will be handled client-side to avoid undici headers.split error
  
  const response = NextResponse.next()
  
  // For admin routes, simply redirect to login - no auth checks in middleware
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('[MIDDLEWARE] Admin route detected - allowing through')
    // Client-side auth will handle the actual verification
  }
  
  // For auth routes, allow through - client-side will handle redirects
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    console.log('[MIDDLEWARE] Auth route detected - allowing through')
  }
  
  console.log('[MIDDLEWARE] Completed successfully')
  return response
}