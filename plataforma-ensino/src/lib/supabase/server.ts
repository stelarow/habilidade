import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const clientId = Math.random().toString(36).substr(2, 9)
  console.log(`[SERVER_CLIENT-${clientId}] Creating SSR-compatible server client`)
  
  try {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    
    console.log(`[SERVER_CLIENT-${clientId}] 🍪 Available cookies:`, {
      total: allCookies.length,
      names: allCookies.map(c => c.name),
      supabaseCookies: allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-')).length
    })
    
    console.log(`[SERVER_CLIENT-${clientId}] 🔧 Environment check:`, {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
    })
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = cookieStore.getAll()
            console.log(`[SERVER_CLIENT-${clientId}] 📋 getAll() called, returning ${cookies.length} cookies`)
            return cookies
          },
          setAll(cookiesToSet) {
            console.log(`[SERVER_CLIENT-${clientId}] 📝 setAll() called with ${cookiesToSet.length} cookies`)
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                console.log(`[SERVER_CLIENT-${clientId}] 🔧 Setting cookie: ${name}`)
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              console.log(`[SERVER_CLIENT-${clientId}] ⚠️ setAll() failed (normal in Server Components):`, error instanceof Error ? error.message : error)
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch (error) {
    console.error(`[SERVER_CLIENT-${clientId}] ❌ Error creating client:`, error)
    throw error
  }
}