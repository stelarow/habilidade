import { createClient as createStandardClient } from '@supabase/supabase-js'

export const createClient = () => {
  console.log('[SERVER_CLIENT] Creating Netlify-compatible cookieless client')
  
  try {
    // CRITICAL FIX: Use completely standard client for Netlify serverless
    // No cookies, no SSR, no complex headers - just basic HTTP calls
    return createStandardClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false, // Disable session persistence
          autoRefreshToken: false, // Disable auto refresh  
        },
        global: {
          fetch: (url: RequestInfo | URL, options?: RequestInit) => {
            console.log('[SERVER_CLIENT] Custom fetch interceptor')
            
            // Create completely clean headers object
            const cleanHeaders: Record<string, string> = {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            }
            
            // Add authorization if present, ensuring it's a string
            if (options?.headers) {
              const headers = options.headers as any
              if (headers.Authorization || headers.authorization) {
                cleanHeaders.Authorization = String(headers.Authorization || headers.authorization)
              }
            }
            
            return fetch(url, {
              ...options,
              headers: cleanHeaders
            })
          }
        }
      }
    )
  } catch (error) {
    console.error('[SERVER_CLIENT] Error creating client:', error)
    throw error
  }
}