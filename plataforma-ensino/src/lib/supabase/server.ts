import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  console.log('[SERVER_CLIENT] Creating Netlify-compatible server client')
  
  try {
    console.log('[SERVER_CLIENT] Using read-only cookie access for Netlify serverless')
    const cookieStore = cookies()

    // CRITICAL FIX: Simplified server client for Netlify compatibility
    // Removes complex cookie handling that triggers undici headers.split error
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            console.log('[SERVER_CLIENT] getAll() - read-only mode')
            return cookieStore.getAll()
          },
          setAll() {
            console.log('[SERVER_CLIENT] setAll() - no-op for serverless compatibility')
            // No-op for server-side to prevent undici conflicts
            // Cookie updates handled by middleware
          },
        },
      }
    )
  } catch (error) {
    console.error('[SERVER_CLIENT] Error creating Netlify-compatible client:', error)
    throw error
  }
}