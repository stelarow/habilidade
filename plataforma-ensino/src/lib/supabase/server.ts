import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { convertBase64CookiesToSSRFormat } from './cookie-converter'

const isDevelopment = process.env.NODE_ENV === 'development'

export const createClient = () => {
  // Environment validation
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const error = new Error(`Missing Supabase environment variables: URL=${!!process.env.NEXT_PUBLIC_SUPABASE_URL}, KEY=${!!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`)
    if (isDevelopment) {
      console.error('❌ Supabase environment error:', error.message)
    }
    throw error
  }
  
  try {
    const cookieStore = cookies()
    
    // Only log in development for debugging
    if (isDevelopment) {
      const allCookies = cookieStore.getAll()
      console.log('🍪 Supabase server client cookies:', {
        total: allCookies.length,
        supabaseCookies: allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-')).length
      })
    }
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            const originalCookies = cookieStore.getAll()
            const convertedCookies = convertBase64CookiesToSSRFormat(originalCookies)
            
            // Only log conversion details in development
            if (isDevelopment && originalCookies.length !== convertedCookies.length) {
              console.log('📋 Cookie conversion applied:', {
                original: originalCookies.length,
                converted: convertedCookies.length
              })
            }
            
            return convertedCookies
          },
          setAll(cookiesToSet) {
            if (isDevelopment && cookiesToSet.length > 0) {
              console.log(`📝 Setting ${cookiesToSet.length} cookies`)
            }
            
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch (error) {
              // Silently handle expected Server Component limitations
              if (isDevelopment) {
                console.log('⚠️ Cookie setting failed (normal in Server Components):', error instanceof Error ? error.message : error)
              }
            }
          },
        },
      }
    )
  } catch (error) {
    if (isDevelopment) {
      console.error('❌ Error creating Supabase server client:', error)
    }
    throw error
  }
}