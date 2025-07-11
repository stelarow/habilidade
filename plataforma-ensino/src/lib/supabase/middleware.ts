import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  console.log('[LOG-TEST] 1. Entrando em updateSession para:', request.nextUrl.pathname)
  
  // Create response ONCE and NEVER recreate it to prevent undici header corruption
  let supabaseResponse = NextResponse.next()
  console.log('[LOG-TEST] 2. supabaseResponse inicializado (sem request object)')

  // Use simplified cookie handling pattern to prevent headers.split error  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          console.log('[LOG-TEST] 2.1. cookies.getAll() chamado')
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          console.log('[LOG-TEST] 2.2. cookies.setAll() chamado com', cookiesToSet.length, 'cookies')
          // CRITICAL: Do NOT recreate NextResponse here - causes undici header corruption
          // Simply set cookies on existing response object
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )
  console.log('[LOG-TEST] 3. Cliente Supabase criado. Prestes a chamar getUser()')

  // Get user profile if authenticated (single DB call)
  let userProfile = null
  let user: any = null
  
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
    console.log('[LOG-TEST] 4. SUCESSO ao chamar getUser(). Usuário:', user ? user.id : 'null')
    
    if (user) {
      console.log('[LOG-TEST] 5. Usuário autenticado, buscando perfil...')
      const { data: profile } = await supabase
        .from('users')
        .select('role, full_name, email')
        .eq('id', user.id)
        .single()
      
      userProfile = profile
      console.log('[LOG-TEST] 6. Perfil carregado:', profile?.role || 'sem role')
    }
  } catch (error) {
    console.error('[LOG-TEST] ERRO capturado durante getUser() ou busca de perfil:', error)
    // Continue sem usuário autenticado
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

  console.log('[LOG-TEST] 7. Configurando headers de resposta...')
  
  // Pass user data to the request via headers for downstream consumption
  if (user && userProfile) {
    console.log('[LOG-TEST] 8. Adicionando headers de usuário autenticado')
    // Ensure all header values are strings to prevent Sentry errors
    supabaseResponse.headers.set('x-user-id', String(user.id || ''))
    supabaseResponse.headers.set('x-user-role', String(userProfile.role || ''))
    supabaseResponse.headers.set('x-user-email', String(userProfile.email || ''))
    supabaseResponse.headers.set('x-user-name', String(userProfile.full_name || ''))
  }
  
  console.log('[LOG-TEST] 9. Saindo de updateSession com sucesso')
  return supabaseResponse
}