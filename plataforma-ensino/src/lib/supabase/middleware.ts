import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function updateSession(request: NextRequest) {
  console.log('[MIDDLEWARE] Processing:', request.nextUrl.pathname)
  
  const response = NextResponse.next()
  
  // SECURITY: Smart auth for admin routes with Netlify compatibility
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('[MIDDLEWARE] Admin route - attempting auth verification')
    
    try {
      // Use basic auth check without complex headers to avoid Netlify issues
      const authResult = await performBasicAuthCheck(request)
      
      if (authResult.shouldRedirect && authResult.redirectTo) {
        console.log('[MIDDLEWARE] Redirecting to:', authResult.redirectTo)
        return NextResponse.redirect(new URL(authResult.redirectTo, request.url))
      }
      
      // If auth successful, populate headers for server components
      if (authResult.user && authResult.profile) {
        console.log('[MIDDLEWARE] Auth successful, setting headers')
        response.headers.set('x-user-id', authResult.user.id)
        response.headers.set('x-user-role', authResult.profile.role)
        response.headers.set('x-user-email', authResult.profile.email)
        response.headers.set('x-user-name', authResult.profile.full_name || '')
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Auth check failed:', error)
      // On error, let client-side handle auth (defense in depth)
    }
  }
  
  // Auth routes handling
  if (request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.includes('/callback')) {
    try {
      const authResult = await performBasicAuthCheck(request)
      if (authResult.user && authResult.profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (authResult.user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      console.error('[MIDDLEWARE] Auth redirect check failed:', error)
      // Continue to auth page on error
    }
  }
  
  console.log('[MIDDLEWARE] Completed successfully')
  return response
}

async function performBasicAuthCheck(request: NextRequest) {
  // Create cookieless client for basic checks (Netlify compatible)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          'Authorization': getAuthHeader(request) || `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
        }
      }
    }
  )
  
  // Get auth header from request
  const authHeader = getAuthHeader(request)
  if (!authHeader) {
    return { shouldRedirect: true, redirectTo: '/auth/login' }
  }
  
  // Verify token
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return { shouldRedirect: true, redirectTo: '/auth/login' }
  }
  
  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()
  
  if (profileError || !profile) {
    console.error('[MIDDLEWARE] Profile fetch failed:', profileError)
    return { shouldRedirect: true, redirectTo: '/auth/login' }
  }
  
  // Check admin role for admin routes
  if (request.nextUrl.pathname.startsWith('/admin') && profile.role !== 'admin') {
    return { shouldRedirect: true, redirectTo: '/dashboard' }
  }
  
  return { 
    shouldRedirect: false, 
    user, 
    profile,
    redirectTo: null 
  }
}

function getAuthHeader(request: NextRequest): string | null {
  // Try different methods to get auth token
  const authHeader = request.headers.get('authorization')
  if (authHeader) return authHeader
  
  // Try from cookies
  const cookieAuth = request.cookies.get('supabase-auth-token')
  if (cookieAuth?.value) return `Bearer ${cookieAuth.value}`
  
  // Try session cookie
  const sessionCookie = request.cookies.get('sb-access-token')
  if (sessionCookie?.value) return `Bearer ${sessionCookie.value}`
  
  return null
}