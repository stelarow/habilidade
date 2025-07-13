import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedInMiddleware, hasRoleInMiddleware } from './src/lib/supabase/middleware-client'

/**
 * 🔥 NEXT.JS MIDDLEWARE
 * 
 * Focused on route protection and smart redirects based on user authentication status.
 * No longer passes data via headers to Server Components.
 * 
 * Security Features:
 * - Admin route protection: Only authenticated admin users can access /admin/*
 * - Auth route blocking: Authenticated users are redirected away from login/register
 * - Role-based redirects: Admin users → /admin, Regular users → /dashboard
 * - Lightweight checks: Fast authentication/role verification
 * 
 * Based on Next.js best practices:
 * - Immediate redirects for unauthorized/inappropriate access
 * - Server Components verify sessions independently for additional security
 * - Graceful error handling with fallback behavior
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
      const authenticated = await isAuthenticatedInMiddleware(request)
      if (!authenticated) {
        console.log(`[MIDDLEWARE-${requestId}] ❌ Not authenticated - redirecting to login`)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Quick admin role check
      const isAdmin = await hasRoleInMiddleware(request, 'admin')
      if (!isAdmin) {
        console.log(`[MIDDLEWARE-${requestId}] ❌ Not admin - redirecting to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      console.log(`[MIDDLEWARE-${requestId}] ✅ Admin access granted`)
    }

    // 🔐 SECURITY: Prevent authenticated users from accessing login/register pages
    if (pathname.startsWith('/auth/') && !pathname.includes('/callback')) {
      console.log(`[MIDDLEWARE-${requestId}] 🔐 Auth route detected: ${pathname}`)
      
      // Specific routes that should redirect authenticated users
      const restrictedAuthRoutes = ['/auth/login', '/auth/register']
      const isRestrictedRoute = restrictedAuthRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
      
      if (isRestrictedRoute) {
        console.log(`[MIDDLEWARE-${requestId}] 🚫 Restricted auth route detected: ${pathname}`)
        
        const authenticated = await isAuthenticatedInMiddleware(request)
        if (authenticated) {
          console.log(`[MIDDLEWARE-${requestId}] ✅ User already authenticated - determining redirect destination`)
          
          const isAdmin = await hasRoleInMiddleware(request, 'admin')
          const redirectUrl = isAdmin ? '/admin' : '/dashboard'
          
          console.log(`[MIDDLEWARE-${requestId}] 🎯 User role: ${isAdmin ? 'admin' : 'regular'} → Redirecting to: ${redirectUrl}`)
          console.log(`[MIDDLEWARE-${requestId}] 🔒 SECURITY: Blocking authenticated user access to ${pathname}`)
          
          return NextResponse.redirect(new URL(redirectUrl, request.url))
        } else {
          console.log(`[MIDDLEWARE-${requestId}] 👤 User not authenticated - allowing access to ${pathname}`)
        }
      } else {
        console.log(`[MIDDLEWARE-${requestId}] ℹ️ Non-restricted auth route: ${pathname} - allowing access`)
      }
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