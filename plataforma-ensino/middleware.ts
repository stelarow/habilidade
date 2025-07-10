import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './src/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  console.log(`[MIDDLEWARE] Processing request: ${pathname}`)

  // Update session first
  let response
  try {
    console.log(`[MIDDLEWARE] Calling updateSession for: ${pathname}`)
    response = await updateSession(request)
    console.log(`[MIDDLEWARE] UpdateSession completed for: ${pathname}`)
  } catch (error) {
    console.error(`[MIDDLEWARE] UpdateSession failed for ${pathname}:`, error)
    throw error
  }
  
  // Handle admin routes - the user auth check is already done in updateSession
  if (pathname.startsWith('/admin')) {
    console.log(`[MIDDLEWARE] Processing admin route: ${pathname}`)
    
    try {
      // Create middleware-specific client
      console.log(`[MIDDLEWARE] Importing createServerClient for admin route`)
      const { createServerClient } = await import('@supabase/ssr')
      
      console.log(`[MIDDLEWARE] Creating Supabase client for admin route`)
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              console.log(`[MIDDLEWARE] getAll() called for admin route`)
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              console.log(`[MIDDLEWARE] setAll() called for admin route with ${cookiesToSet?.length || 0} cookies`)
              // In middleware, we don't need to set cookies for admin check
            },
          },
        }
      )
      
      console.log(`[MIDDLEWARE] Getting user for admin route`)
      const { data: { user } } = await supabase.auth.getUser()
      console.log(`[MIDDLEWARE] User retrieved for admin route:`, user ? 'logged in' : 'not logged in')
    
      if (!user) {
        console.log(`[MIDDLEWARE] No user found for admin route, redirecting to login`)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      // Check if user has admin role
      console.log(`[MIDDLEWARE] Checking admin role for user: ${user.id}`)
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      console.log(`[MIDDLEWARE] Profile retrieved:`, profile)
      if (!profile || profile.role !== 'admin') {
        console.log(`[MIDDLEWARE] User is not admin, redirecting to dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      console.log(`[MIDDLEWARE] Admin access granted for: ${pathname}`)
    } catch (error) {
      console.error(`[MIDDLEWARE] Error in admin route processing for ${pathname}:`, error)
      throw error
    }
  }

  // Handle protected routes (dashboard, courses, etc.)
  if (pathname.startsWith('/dashboard') || 
      pathname.startsWith('/course/') || 
      pathname.startsWith('/profile') ||
      pathname.startsWith('/progress')) {
    
    // Create middleware-specific client
    const { createServerClient } = await import('@supabase/ssr')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // In middleware, we don't need to set cookies for auth check
          },
        },
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Handle auth routes - redirect if already logged in
  if (pathname.startsWith('/auth/') && !pathname.includes('/callback')) {
    // Create middleware-specific client
    const { createServerClient } = await import('@supabase/ssr')
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // In middleware, we don't need to set cookies for auth check
          },
        },
      }
    )
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}