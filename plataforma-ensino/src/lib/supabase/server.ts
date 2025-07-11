import { createServerClient } from '@supabase/ssr'
import { createClient as createStandardClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export const createClient = () => {
  console.log('[SERVER_CLIENT] Creating Netlify-compatible server client')
  
  try {
    console.log('[SERVER_CLIENT] Using cookieless client for Netlify serverless compatibility')
    
    // CRITICAL FIX: Use standard client without cookies for admin queries
    // This prevents the undici headers.split error in serverless environment
    return createStandardClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          fetch: (url: RequestInfo | URL, options?: RequestInit) => {
            // Ensure all headers are strings
            if (options?.headers) {
              const cleanHeaders: Record<string, string> = {}
              const headers = options.headers as Record<string, any>
              for (const [key, value] of Object.entries(headers)) {
                cleanHeaders[key] = String(value || '')
              }
              options.headers = cleanHeaders
            }
            return fetch(url, options)
          }
        }
      }
    )
  } catch (error) {
    console.error('[SERVER_CLIENT] Error creating Netlify-compatible client:', error)
    throw error
  }
}