import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated, hasRole } from './src/lib/auth/session'

/**
 * 🔥 NEXT.JS MIDDLEWARE
 * 
 * Focused on route protection and redirects only.
 * No longer passes data via headers to Server Components.
 * 
 * Based on Next.js best practices:
 * - Lightweight authentication checks
 * - Immediate redirects for unauthorized access
 * - Server Components verify sessions independently
 */
export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substr(2, 9)
  const pathname = request.nextUrl.pathname
  
  console.log(`[MIDDLEWARE-${requestId}] 🔥 Processing: ${pathname}`)
  
  try {
    // Admin route protection
    if (pathname.startsWith('/admin')) {
      console.log(`[MIDDLEWARE-${requestId}] 🔒 Admin route detected - checking authorization`)
      
      // Quick authentication check
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        console.log(`[MIDDLEWARE-${requestId}] ❌ Not authenticated - redirecting to login`)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Quick admin role check
      const isAdmin = await hasRole('admin')
      if (!isAdmin) {
        console.log(`[MIDDLEWARE-${requestId}] ❌ Not admin - redirecting to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      console.log(`[MIDDLEWARE-${requestId}] ✅ Admin access granted`)
    }

    // Auth route handling - redirect if already logged in
    if (pathname.startsWith('/auth/') && !pathname.includes('/callback')) {
      console.log(`[MIDDLEWARE-${requestId}] 🔐 Auth route detected`)
      
      const authenticated = await isAuthenticated()
      if (authenticated) {
        console.log(`[MIDDLEWARE-${requestId}] User already authenticated - checking redirect destination`)
        
        const isAdmin = await hasRole('admin')
        const redirectUrl = isAdmin ? '/admin' : '/dashboard'
        
        console.log(`[MIDDLEWARE-${requestId}] Redirecting to: ${redirectUrl}`)
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      }
      
      console.log(`[MIDDLEWARE-${requestId}] Allowing access to auth route`)
    }

    const duration = Date.now() - startTime
    console.log(`[MIDDLEWARE-${requestId}] ✅ Completed in ${duration}ms`)
    
    return NextResponse.next()
    
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[MIDDLEWARE-${requestId}] ❌ Error after ${duration}ms:`, {
      error: error instanceof Error ? error.message : error,
      pathname
    })
    
    // Graceful fallback - allow request to proceed
    console.log(`[MIDDLEWARE-${requestId}] Allowing request to proceed despite error`)
    return NextResponse.next()
  }
}
export const config = {
  matcher: [
    // 🔥 CRITICAL: Simplified matcher focusing on admin routes
    '/admin/:path*',
    '/auth/:path*'
  ],
}