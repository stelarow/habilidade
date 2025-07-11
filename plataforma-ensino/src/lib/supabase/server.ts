import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  console.log('[SERVER_CLIENT] Creating server client with headers.split fix')
  
  try {
    console.log('[SERVER_CLIENT] Getting cookie store')
    const cookieStore = cookies()

    console.log('[SERVER_CLIENT] Creating Supabase server client with simplified cookie handling')
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            console.log('[SERVER_CLIENT] getAll() called')
            try {
              const cookies = cookieStore.getAll()
              console.log(`[SERVER_CLIENT] getAll() returning ${cookies.length} cookies`)
              return cookies
            } catch (error) {
              console.error('[SERVER_CLIENT] Error in getAll():', error)
              throw error
            }
          },
          setAll(cookiesToSet) {
            console.log(`[SERVER_CLIENT] setAll() called with ${cookiesToSet?.length || 0} cookies`)
            // CRITICAL FIX: Simplified cookie handling to prevent undici headers corruption
            // Don't set cookies in server components - let middleware handle it
            try {
              // Minimal cookie setting to prevent headers.split error
              console.log('[SERVER_CLIENT] Skipping cookie set in server component to prevent undici conflict')
            } catch (error) {
              console.error('[SERVER_CLIENT] Error in setAll():', error)
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  } catch (error) {
    console.error('[SERVER_CLIENT] Error creating server client:', error)
    throw error
  }
}