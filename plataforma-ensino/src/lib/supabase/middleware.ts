import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getRedirectUrlForRole } from '@/lib/auth/redirect-helpers'

export async function updateSession(request: NextRequest) {
  const sessionId = Math.random().toString(36).substr(2, 9)
  console.log(`[UPDATE_SESSION-${sessionId}] ========== PROCESSING: ${request.nextUrl.pathname} ==========`)
  
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Log environment variables (safely)
  console.log(`[UPDATE_SESSION-${sessionId}] Environment Check:`, {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
  })

  try {
    // Create Supabase client with proper SSR cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = request.cookies.getAll()
            console.log(`[UPDATE_SESSION-${sessionId}] Cookie getAll() called, found ${cookies.length} cookies`)
            return cookies
          },
          setAll(cookiesToSet) {
            console.log(`[UPDATE_SESSION-${sessionId}] Cookie setAll() called with ${cookiesToSet.length} cookies:`, 
              cookiesToSet.map((c: any) => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 }))
            )
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    console.log(`[UPDATE_SESSION-${sessionId}] Supabase client created successfully`)

    // CRITICAL: Get user session first with detailed logging
    console.log(`[UPDATE_SESSION-${sessionId}] Calling supabase.auth.getUser()...`)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log(`[UPDATE_SESSION-${sessionId}] User Authentication Result:`, {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      userMetadata: user?.user_metadata,
      appMetadata: user?.app_metadata,
      lastSignInAt: user?.last_sign_in_at,
      createdAt: user?.created_at,
      isAnonymous: user?.is_anonymous,
      userError: userError?.message,
      userErrorCode: userError?.['code'],
      path: request.nextUrl.pathname
    })

    // SECURITY: Block admin routes if no user or not admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      console.log(`[UPDATE_SESSION-${sessionId}] 🔒 ADMIN ROUTE DETECTED - ENFORCING STRICT SECURITY`)
      
      // Block immediately if no user
      if (!user || userError) {
        console.log(`[UPDATE_SESSION-${sessionId}] ❌ SECURITY BLOCK: No user found or auth error`)
        console.log(`[UPDATE_SESSION-${sessionId}] Redirecting to: /auth/login`)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }

      console.log(`[UPDATE_SESSION-${sessionId}] ✅ User authenticated, checking role in database...`)

      // Get user profile to check role with detailed logging
      const profileQuery = supabase
        .from('users')
        .select('role, full_name, email, id, created_at, last_login')
        .eq('id', user.id)
        .single()

      console.log(`[UPDATE_SESSION-${sessionId}] Executing profile query for user: ${user.id}`)
      const { data: profile, error: profileError } = await profileQuery

      console.log(`[UPDATE_SESSION-${sessionId}] Profile Query Result:`, {
        hasProfile: !!profile,
        profileData: profile ? {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          fullName: profile.full_name,
          createdAt: profile.created_at,
          lastLogin: profile.last_login
        } : null,
        profileError: profileError?.message,
        profileErrorCode: profileError?.['code'],
        profileErrorDetails: profileError?.['details']
      })

      // Block if profile fetch failed or user is not admin
      if (profileError || !profile || profile.role !== 'admin') {
        console.log(`[UPDATE_SESSION-${sessionId}] ❌ SECURITY BLOCK: Admin access denied`)
        console.log(`[UPDATE_SESSION-${sessionId}] Denial Reason:`, {
          hasProfileError: !!profileError,
          hasProfile: !!profile,
          userRole: profile?.role,
          isAdmin: profile?.role === 'admin'
        })
        console.log(`[UPDATE_SESSION-${sessionId}] Redirecting to: /dashboard`)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Success: Set headers for server components
      console.log(`[UPDATE_SESSION-${sessionId}] ✅ ADMIN ACCESS GRANTED - Setting headers`)
      response.headers.set('x-user-id', user.id)
      response.headers.set('x-user-role', profile.role)
      response.headers.set('x-user-email', profile.email)
      response.headers.set('x-user-name', profile.full_name || '')
      
      console.log(`[UPDATE_SESSION-${sessionId}] Headers set:`, {
        'x-user-id': user.id,
        'x-user-role': profile.role,
        'x-user-email': profile.email,
        'x-user-name': profile.full_name || ''
      })
    }

    // Handle auth routes - redirect if already logged in
    if (request.nextUrl.pathname.startsWith('/auth/') && !request.nextUrl.pathname.includes('/callback')) {
      console.log(`[UPDATE_SESSION-${sessionId}] Auth route detected: ${request.nextUrl.pathname}`)
      
      if (user) {
        console.log(`[UPDATE_SESSION-${sessionId}] User already authenticated, checking role for redirect...`)
        
        // Get user role to determine redirect
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        console.log(`[UPDATE_SESSION-${sessionId}] Role check for redirect:`, { role: profile?.role })

        // Use role-based redirect helper for consistency
        const redirectPath = getRedirectUrlForRole(profile?.role || 'student')
        console.log(`[UPDATE_SESSION-${sessionId}] User with role '${profile?.role}' accessing auth - redirecting to ${redirectPath}`)
        return NextResponse.redirect(new URL(redirectPath, request.url))
      } else {
        console.log(`[UPDATE_SESSION-${sessionId}] No authenticated user, allowing access to auth route`)
      }
    }

    console.log(`[UPDATE_SESSION-${sessionId}] ========== COMPLETED SUCCESSFULLY ==========`)
    return response
    
  } catch (error) {
    console.error(`[UPDATE_SESSION-${sessionId}] ❌ CRITICAL ERROR:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      path: request.nextUrl.pathname
    })
    throw error
  }
}