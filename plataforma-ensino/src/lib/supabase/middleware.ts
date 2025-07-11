import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next()

  // SINGLE Supabase client instance for ALL authentication
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next()
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Single authentication call
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if authenticated (single DB call)
  let userProfile = null
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()
    
    userProfile = profile
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/courses', '/profile', '/achievements', '/progress']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Admin routes - check admin role
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
    
    if (!userProfile || userProfile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Auth routes - redirect if already logged in
  if (request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.includes('/callback')) {
    if (user) {
      const url = request.nextUrl.clone()
      if (userProfile?.role === 'admin') {
        url.pathname = '/admin'
      } else {
        url.pathname = '/dashboard'
      }
      return NextResponse.redirect(url)
    }
  }

  // Pass user data to the request via headers for downstream consumption
  if (user && userProfile) {
    supabaseResponse.headers.set('x-user-id', user.id)
    supabaseResponse.headers.set('x-user-role', userProfile.role)
    supabaseResponse.headers.set('x-user-email', userProfile.email || '')
    supabaseResponse.headers.set('x-user-name', userProfile.full_name || '')
  }

  return supabaseResponse
}