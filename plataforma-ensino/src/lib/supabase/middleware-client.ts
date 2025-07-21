import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 🔥 MIDDLEWARE-SPECIFIC SUPABASE CLIENT
 * 
 * Creates a Supabase client that works in Next.js middleware context.
 * Uses request cookies directly instead of next/headers.
 */
export function createMiddlewareClient(request: NextRequest, response?: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // In middleware, we need to create a response to set cookies properly
          if (response) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          }
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
  const requestId = Math.random().toString(36).substr(2, 9)
  
  try {
    console.log(`[MIDDLEWARE_AUTH-${requestId}] 🔍 Checking authentication...`)
    console.log(`[MIDDLEWARE_AUTH-${requestId}] 📊 Available cookies:`, {
      count: request.cookies.getAll().length,
      names: request.cookies.getAll().map(c => c.name)
    })
    
    const supabase = createMiddlewareClient(request)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    console.log(`[MIDDLEWARE_AUTH-${requestId}] 🎯 Auth result:`, {
      hasUser: !!user,
      userId: user?.id,
      error: error?.message,
      userEmail: user?.email
    })
    
    const isAuthenticated = !error && !!user
    console.log(`[MIDDLEWARE_AUTH-${requestId}] ✅ Authentication check: ${isAuthenticated}`)
    
    return isAuthenticated
  } catch (error) {
    console.error(`[MIDDLEWARE_AUTH-${requestId}] ❌ Error checking authentication:`, error)
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
  const requestId = Math.random().toString(36).substr(2, 9)
  
  try {
    console.log(`[MIDDLEWARE_ROLE-${requestId}] 🔍 Checking role: ${requiredRole}`)
    
    const supabase = createMiddlewareClient(request)
    
    // Quick auth check
    console.log(`[MIDDLEWARE_ROLE-${requestId}] 🔐 Getting user...`)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log(`[MIDDLEWARE_ROLE-${requestId}] ❌ Auth failed:`, {
        hasError: !!authError,
        error: authError?.message,
        hasUser: !!user
      })
      return false
    }

    console.log(`[MIDDLEWARE_ROLE-${requestId}] ✅ User authenticated: ${user.id}`)

    // Quick profile check
    console.log(`[MIDDLEWARE_ROLE-${requestId}] 👤 Getting user profile...`)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log(`[MIDDLEWARE_ROLE-${requestId}] ❌ Profile failed:`, {
        hasError: !!profileError,
        error: profileError?.message,
        hasProfile: !!profile
      })
      return false
    }

    console.log(`[MIDDLEWARE_ROLE-${requestId}] 👤 Profile found: role = ${profile.role}`)

    // Check role hierarchy: admin > instructor > student
    let hasAccess = false
    if (requiredRole === 'student') {
      hasAccess = ['admin', 'instructor', 'student'].includes(profile.role)
    } else if (requiredRole === 'instructor') {
      hasAccess = ['admin', 'instructor'].includes(profile.role)
    } else if (requiredRole === 'admin') {
      hasAccess = profile.role === 'admin'
    }

    console.log(`[MIDDLEWARE_ROLE-${requestId}] 🎯 Role check result:`, {
      userRole: profile.role,
      requiredRole,
      hasAccess
    })

    return hasAccess
  } catch (error) {
    console.error(`[MIDDLEWARE_ROLE-${requestId}] ❌ Error checking role:`, error)
    return false
  }
}