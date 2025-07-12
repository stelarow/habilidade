import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  console.log('[MIDDLEWARE] Processing:', request.nextUrl.pathname)
  
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create Supabase client with proper SSR cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // CRITICAL: Get user session first
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  console.log('[MIDDLEWARE] User check:', { 
    hasUser: !!user, 
    userError: userError?.message,
    path: request.nextUrl.pathname 
  })

  // SECURITY: Block admin routes if no user or not admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('[MIDDLEWARE] Admin route detected - enforcing strict security')
    
    // Block immediately if no user
    if (!user || userError) {
      console.log('[MIDDLEWARE] No user found - redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('role, full_name, email')
      .eq('id', user.id)
      .single()

    console.log('[MIDDLEWARE] Profile check:', { 
      hasProfile: !!profile, 
      role: profile?.role,
      error: profileError?.message 
    })

    // Block if profile fetch failed or user is not admin
    if (profileError || !profile || profile.role !== 'admin') {
      console.log('[MIDDLEWARE] Admin access denied - redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Success: Set headers for server components
    console.log('[MIDDLEWARE] Admin access granted - setting headers')
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-user-role', profile.role)
    response.headers.set('x-user-email', profile.email)
    response.headers.set('x-user-name', profile.full_name || '')
  }

  // Handle auth routes - redirect if already logged in
  if (request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.includes('/callback')) {
    if (user) {
      // Get user role to determine redirect
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        console.log('[MIDDLEWARE] Admin user accessing auth - redirecting to admin')
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        console.log('[MIDDLEWARE] Authenticated user accessing auth - redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  console.log('[MIDDLEWARE] Completed successfully')
  return response
}