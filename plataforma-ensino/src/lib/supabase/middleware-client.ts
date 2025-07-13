import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 🔥 MIDDLEWARE-SPECIFIC SUPABASE CLIENT
 * 
 * Creates a Supabase client that works in Next.js middleware context.
 * Uses request cookies directly instead of next/headers.
 */
export function createMiddlewareClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // In middleware, we can't set cookies on the request
          // This will be handled by returning the appropriate response
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
        },
      },
    }
  )
}

/**
 * 🔧 MIDDLEWARE AUTH CHECK
 * 
 * Lightweight authentication check for middleware context.
 */
export async function isAuthenticatedInMiddleware(request: NextRequest): Promise<boolean> {
  try {
    const supabase = createMiddlewareClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch (error) {
    console.error('[MIDDLEWARE_AUTH] Error checking authentication:', error)
    return false
  }
}

/**
 * 🔧 MIDDLEWARE ROLE CHECK
 * 
 * Quick role verification for middleware context.
 */
export async function hasRoleInMiddleware(
  request: NextRequest,
  requiredRole: 'admin' | 'instructor' | 'student'
): Promise<boolean> {
  try {
    const supabase = createMiddlewareClient(request)
    
    // Quick auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return false

    // Quick profile check
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) return false

    // Check role hierarchy: admin > instructor > student
    if (requiredRole === 'student') {
      return ['admin', 'instructor', 'student'].includes(profile.role)
    }
    if (requiredRole === 'instructor') {
      return ['admin', 'instructor'].includes(profile.role)
    }
    if (requiredRole === 'admin') {
      return profile.role === 'admin'
    }

    return false
  } catch (error) {
    console.error('[MIDDLEWARE_ROLE] Error checking role:', error)
    return false
  }
}