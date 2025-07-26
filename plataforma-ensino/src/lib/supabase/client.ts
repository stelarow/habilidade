import { createBrowserClient } from '@supabase/ssr'

// Singleton client instance for better performance
let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  // Return existing instance if available (reduces client creation overhead)
  if (clientInstance) {
    return clientInstance
  }

  // Environment validation
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing required Supabase environment variables')
  }

  clientInstance = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Optimize for performance
        debug: process.env.NODE_ENV === 'development'
      },
      global: {
        headers: {
          'X-Client-Info': 'supabase-js-web'
        }
      },
      db: {
        schema: 'public'
      },
      // Connection pooling for better performance
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    }
  )

  return clientInstance
}