/**
 * 🍪 SUPABASE COOKIE CONVERTER
 * 
 * Handles conversion between different Supabase cookie formats:
 * - Client-side: base64-encoded JSON format
 * - Server-side: individual cookie parts expected by @supabase/ssr
 */

interface ParsedAuthToken {
  access_token: string
  refresh_token: string
  expires_at: number
  expires_in: number
  token_type: string
  user: any
}

/**
 * Converts base64-encoded auth token to individual cookies
 * that @supabase/ssr expects
 */
export function convertBase64CookiesToSSRFormat(cookies: { name: string; value: string }[]): { name: string; value: string }[] {
  const converterId = Math.random().toString(36).substr(2, 9)
  console.log(`[COOKIE_CONVERTER-${converterId}] 🔄 Converting cookies to SSR format`)
  
  const authTokenCookie = cookies.find(c => c.name === 'supabase.auth.token')
  
  if (!authTokenCookie || !authTokenCookie.value.startsWith('base64-')) {
    console.log(`[COOKIE_CONVERTER-${converterId}] ℹ️ No base64 auth token found, returning cookies as-is`)
    return cookies
  }
  
  try {
    console.log(`[COOKIE_CONVERTER-${converterId}] 🔓 Parsing base64 auth token...`)
    
    // Remove 'base64-' prefix and decode
    const base64Content = authTokenCookie.value.substring(7)
    const decodedContent = atob(base64Content)
    const parsed: ParsedAuthToken = JSON.parse(decodedContent)
    
    console.log(`[COOKIE_CONVERTER-${converterId}] ✅ Token parsed successfully`, {
      hasAccessToken: !!parsed.access_token,
      hasRefreshToken: !!parsed.refresh_token,
      expiresAt: new Date(parsed.expires_at * 1000).toISOString(),
      userRole: parsed.user?.user_metadata?.role
    })
    
    // Create the individual cookies that @supabase/ssr expects
    const ssrCookies = [
      {
        name: 'sb-vfpdyllwquaturpcifpl-auth-token',
        value: JSON.stringify({
          access_token: parsed.access_token,
          token_type: parsed.token_type || 'bearer',
          expires_in: parsed.expires_in || 3600,
          expires_at: parsed.expires_at,
          refresh_token: parsed.refresh_token,
          user: parsed.user
        })
      }
    ]
    
    // Remove the old base64 cookie and add the new SSR format cookies
    const otherCookies = cookies.filter(c => c.name !== 'supabase.auth.token')
    const result = [...otherCookies, ...ssrCookies]
    
    console.log(`[COOKIE_CONVERTER-${converterId}] 🎯 Conversion complete`, {
      originalCookies: cookies.length,
      convertedCookies: result.length,
      newCookieNames: ssrCookies.map(c => c.name)
    })
    
    return result
    
  } catch (error) {
    console.error(`[COOKIE_CONVERTER-${converterId}] ❌ Failed to convert cookies:`, error)
    console.log(`[COOKIE_CONVERTER-${converterId}] 🔄 Falling back to original cookies`)
    return cookies
  }
}

/**
 * Gets the Supabase project reference from environment or hardcoded
 */
export function getSupabaseProjectRef(): string {
  // Extract project ref from Supabase URL
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (url) {
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
    if (match) {
      return match[1]
    }
  }
  
  // Fallback to hardcoded project ref (from our diagnostic)
  return 'vfpdyllwquaturpcifpl'
}

/**
 * Creates properly formatted cookie name for Supabase SSR
 */
export function createSSRCookieName(suffix: string): string {
  const projectRef = getSupabaseProjectRef()
  return `sb-${projectRef}-auth-${suffix}`
}