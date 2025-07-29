import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedInMiddleware, hasRoleInMiddleware } from './src/lib/supabase/middleware-client'
import { createClient } from './src/lib/supabase/server'

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Maintenance status cache for performance optimization
interface MaintenanceCacheEntry {
  isActive: boolean;
  windowId?: string;
  expiry: number;
}

const maintenanceCache = new Map<string, MaintenanceCacheEntry>()
const MAINTENANCE_CACHE_TTL = parseInt(process.env.MAINTENANCE_CACHE_TTL || '60') * 1000 // 1 minute default

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60, // 60 requests per minute
  keyGenerator: (request: NextRequest) => {
    // Use IP address or fallback to user-agent
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    return forwarded?.split(',')[0] || realIp || 'unknown'
  }
}

// Rate limiting function
async function applyRateLimit(request: NextRequest, requestId: string): Promise<NextResponse | null> {
  const key = RATE_LIMIT_CONFIG.keyGenerator(request)
  const now = Date.now()
  
  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetTime) {
      rateLimitStore.delete(k)
    }
  }
  
  // Get or create rate limit entry
  let rateLimitData = rateLimitStore.get(key)
  if (!rateLimitData || now > rateLimitData.resetTime) {
    rateLimitData = {
      count: 0,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    }
  }
  
  rateLimitData.count++
  rateLimitStore.set(key, rateLimitData)
  
  // Check if rate limit exceeded
  if (rateLimitData.count > RATE_LIMIT_CONFIG.maxRequests) {
    console.warn(`[MIDDLEWARE-${requestId}] 🚫 Rate limit exceeded for ${key}: ${rateLimitData.count}/${RATE_LIMIT_CONFIG.maxRequests}`)
    
    const response = NextResponse.json(
      {
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later',
        code: 429,
        timestamp: new Date().toISOString(),
        retry_after: Math.ceil((rateLimitData.resetTime - now) / 1000)
      },
      { status: 429 }
    )
    
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', '0')
    response.headers.set('X-RateLimit-Reset', rateLimitData.resetTime.toString())
    response.headers.set('Retry-After', Math.ceil((rateLimitData.resetTime - now) / 1000).toString())
    
    return response
  }
  
  console.log(`[MIDDLEWARE-${requestId}] ✅ Rate limit OK for ${key}: ${rateLimitData.count}/${RATE_LIMIT_CONFIG.maxRequests}`)
  return null
}

// Apply CORS headers function
function applyCORSHeaders(response: NextResponse, origin?: string | null) {
  const allowedOrigins = [
    'https://www.escolahabilidade.com.br',
    'https://escolahabilidade.com.br',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null,
    process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:5173' : null
  ].filter(Boolean) as string[]

  const requestOrigin = origin || '*'
  const isOriginAllowed = allowedOrigins.includes(requestOrigin) || process.env.NODE_ENV === 'development'

  if (isOriginAllowed) {
    response.headers.set('Access-Control-Allow-Origin', requestOrigin)
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Max-Age', '86400')
}

// Apply security headers function
function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'"
  )
}

// Check maintenance status function
async function checkMaintenanceStatus(requestId: string): Promise<{ isActive: boolean; windowId?: string }> {
  try {
    const cacheKey = 'maintenance_status'
    const now = Date.now()
    
    // Check cache first
    const cached = maintenanceCache.get(cacheKey)
    if (cached && now < cached.expiry) {
      console.log(`[MIDDLEWARE-${requestId}] 🔧 Maintenance status from cache: ${cached.isActive ? 'ACTIVE' : 'INACTIVE'}`)
      return { isActive: cached.isActive, windowId: cached.windowId }
    }
    
    // Query database for active maintenance
    const supabase = createClient()
    const { data: activeMaintenance, error } = await supabase
      .from('maintenance_windows')
      .select('id')
      .eq('status', 'active')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error(`[MIDDLEWARE-${requestId}] ❌ Error checking maintenance status:`, error)
      // Return cached result if available, otherwise assume no maintenance
      return cached ? { isActive: cached.isActive, windowId: cached.windowId } : { isActive: false }
    }
    
    const isActive = !!activeMaintenance
    const windowId = activeMaintenance?.id
    
    // Cache the result
    maintenanceCache.set(cacheKey, {
      isActive,
      windowId,
      expiry: now + MAINTENANCE_CACHE_TTL
    })
    
    console.log(`[MIDDLEWARE-${requestId}] 🔧 Maintenance status from DB: ${isActive ? 'ACTIVE' : 'INACTIVE'}`)
    return { isActive, windowId }
    
  } catch (error) {
    console.error(`[MIDDLEWARE-${requestId}] ❌ Error in maintenance check:`, error)
    // Return cached result if available, otherwise assume no maintenance
    const cached = maintenanceCache.get('maintenance_status')
    return cached ? { isActive: cached.isActive, windowId: cached.windowId } : { isActive: false }
  }
}

// Check if user has maintenance bypass
async function checkMaintenanceBypass(request: NextRequest, requestId: string, windowId?: string): Promise<boolean> {
  try {
    // Check for bypass cookie/header first
    const bypassSecret = process.env.MAINTENANCE_BYPASS_SECRET
    const bypassHeader = request.headers.get('x-maintenance-bypass')
    const bypassCookie = request.cookies.get('maintenance-bypass')?.value
    
    if (bypassSecret && (bypassHeader === bypassSecret || bypassCookie === bypassSecret)) {
      console.log(`[MIDDLEWARE-${requestId}] 🔓 Maintenance bypass via secret`)
      return true
    }
    
    // Check if user is admin (admins have automatic bypass)
    const isAdmin = await hasRoleInMiddleware(request, 'admin')
    if (isAdmin) {
      console.log(`[MIDDLEWARE-${requestId}] 🔓 Maintenance bypass for admin user`)
      return true
    }
    
    // TODO: Check database for user-specific bypass (requires user authentication)
    // This would be more complex as we'd need to get the user ID from the request
    
    return false
  } catch (error) {
    console.error(`[MIDDLEWARE-${requestId}] ❌ Error checking maintenance bypass:`, error)
    return false
  }
}

// Routes that should always work during maintenance
const MAINTENANCE_EXEMPT_ROUTES = [
  '/maintenance',
  '/api/health',
  '/api/maintenance',
  '/admin/blog/maintenance',
  '/_next',
  '/favicon.ico',
  '/api/auth',
  '/auth/callback'
]

// Check if route is exempt from maintenance blocking
function isMaintenanceExempt(pathname: string): boolean {
  return MAINTENANCE_EXEMPT_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
}

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
 * - Blog API protection: CORS, rate limiting, and security headers
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
  
  // 🔍 CRITICAL: Verify middleware is executing
  console.log(`[MIDDLEWARE-${requestId}] 🔥 MIDDLEWARE EXECUTING - Processing: ${pathname}`)
  console.log(`[MIDDLEWARE-${requestId}] 🌍 Environment check:`, {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    cookieCount: request.cookies.getAll().length
  })
  
  try {
    // 🔧 MAINTENANCE MODE: Check if maintenance is active (high priority check)
    if (process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED !== 'false') {
      const maintenanceStatus = await checkMaintenanceStatus(requestId)
      
      if (maintenanceStatus.isActive) {
        console.log(`[MIDDLEWARE-${requestId}] 🔧 Maintenance mode is ACTIVE`)
        
        // Check if this route is exempt from maintenance blocking
        if (isMaintenanceExempt(pathname)) {
          console.log(`[MIDDLEWARE-${requestId}] ✅ Route ${pathname} is exempt from maintenance`)
        } else {
          // Check if user has bypass
          const hasBypass = await checkMaintenanceBypass(request, requestId, maintenanceStatus.windowId)
          
          if (hasBypass) {
            console.log(`[MIDDLEWARE-${requestId}] 🔓 User has maintenance bypass - allowing access`)
            
            // Add bypass headers for components to use
            const response = NextResponse.next()
            response.headers.set('x-maintenance-bypass', 'true')
            response.headers.set('x-maintenance-window-id', maintenanceStatus.windowId || '')
            return response
          } else {
            console.log(`[MIDDLEWARE-${requestId}] 🚫 Redirecting to maintenance page`)
            
            // Preserve query parameters for potential future use
            const maintenanceUrl = new URL('/maintenance', request.url)
            if (maintenanceStatus.windowId) {
              maintenanceUrl.searchParams.set('window', maintenanceStatus.windowId)
            }
            
            return NextResponse.redirect(maintenanceUrl)
          }
        }
      } else {
        console.log(`[MIDDLEWARE-${requestId}] ✅ No active maintenance`)
      }
    }

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

    // Blog API handling for CORS and rate limiting
    if (pathname.startsWith('/api/blog')) {
      console.log(`[MIDDLEWARE-${requestId}] 📝 Blog API route detected: ${pathname}`)
      
      // Apply rate limiting
      const rateLimitResult = await applyRateLimit(request, requestId)
      if (rateLimitResult) {
        return rateLimitResult
      }

      // For OPTIONS requests, handle CORS preflight
      if (request.method === 'OPTIONS') {
        console.log(`[MIDDLEWARE-${requestId}] 🔄 CORS preflight request`)
        const response = new NextResponse(null, { status: 200 })
        applyCORSHeaders(response, request.headers.get('origin'))
        return response
      }

      // Apply security headers to API responses
      const response = NextResponse.next()
      applyCORSHeaders(response, request.headers.get('origin'))
      applySecurityHeaders(response)
      
      console.log(`[MIDDLEWARE-${requestId}] 🔒 Applied CORS and security headers to blog API`)
      return response
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
    // All routes for maintenance checking (excluding static files)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Admin and auth routes protection
    '/admin/:path*',
    '/auth/:path*',
    // Blog API routes for CORS and rate limiting
    '/api/blog/:path*'
  ],
}

// 🔍 MIDDLEWARE TEST: Export a simple test function to verify middleware is loaded
export const MIDDLEWARE_TEST = {
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  message: 'Middleware module loaded successfully'
}