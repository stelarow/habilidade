import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Increase timeout for mobile networks
        persistSession: true,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        // Add headers for better mobile compatibility
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      },
      // Increase timeout for mobile networks
      db: {
        schema: 'public'
      }
    }
  )