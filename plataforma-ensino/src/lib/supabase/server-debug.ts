import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * 🔍 DEBUG VERSION - Enhanced server client for troubleshooting auth issues
 * This version includes extensive logging to identify cookie and auth problems
 */
export const createDebugClient = () => {
  const clientId = Math.random().toString(36).substr(2, 9)
  console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 🔍 Creating debug server client`)
  
  try {
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    
    // Detailed cookie analysis
    const supabaseCookies = allCookies.filter((c: any) => 
      c.name.includes('supabase') || 
      c.name.includes('sb-') ||
      c.name.includes('auth')
    )
    
    console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 🍪 Cookie Analysis:`, {
      total: allCookies.length,
      supabaseCount: supabaseCookies.length,
      allNames: allCookies.map((c: any) => c.name),
      supabaseDetails: supabaseCookies.map((c: any) => ({
        name: c.name,
        valueLength: c.value?.length || 0,
        valuePrefix: c.value?.substring(0, 20) + '...',
        hasValue: !!c.value
      }))
    })
    
    // Check for specific auth token patterns
    const authToken = allCookies.find((c: any) => c.name === 'supabase.auth.token')
    if (authToken) {
      console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 🔑 Auth Token Found:`, {
        name: authToken.name,
        length: authToken.value?.length,
        startsWithBase64: authToken.value?.startsWith('base64-'),
        prefix: authToken.value?.substring(0, 50) + '...'
      })
      
      // Try to parse the token if it's base64 encoded
      if (authToken.value?.startsWith('base64-')) {
        try {
          const base64Content = authToken.value.substring(7) // Remove 'base64-' prefix
          const decoded = atob(base64Content)
          const parsed = JSON.parse(decoded)
          
          console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 🔓 Token Successfully Parsed:`, {
            hasAccessToken: !!parsed.access_token,
            hasRefreshToken: !!parsed.refresh_token,
            hasUser: !!parsed.user,
            userRole: parsed.user?.user_metadata?.role,
            expiresAt: parsed.expires_at ? new Date(parsed.expires_at * 1000).toISOString() : 'unknown'
          })
        } catch (parseError) {
          console.log(`[DEBUG_SERVER_CLIENT-${clientId}] ❌ Failed to parse token:`, parseError)
        }
      }
    }
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = cookieStore.getAll()
            console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 📋 getAll() returning ${cookies.length} cookies`)
            
            // Log each cookie being returned
            cookies.forEach((cookie: any) => {
              if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
                console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 🔄 Returning cookie: ${cookie.name} (${cookie.value?.length} chars)`)
              }
            })
            
            return cookies
          },
          setAll(cookiesToSet) {
            console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 📝 setAll() with ${cookiesToSet.length} cookies`)
            
            cookiesToSet.forEach((cookie, index) => {
              console.log(`[DEBUG_SERVER_CLIENT-${clientId}] 📝 Cookie ${index + 1}:`, {
                name: cookie.name,
                valueLength: cookie.value?.length || 0,
                options: cookie.options
              })
            })
            
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
              console.log(`[DEBUG_SERVER_CLIENT-${clientId}] ✅ All cookies set successfully`)
            } catch (error) {
              console.log(`[DEBUG_SERVER_CLIENT-${clientId}] ⚠️ setAll() failed (expected in Server Components):`, 
                error instanceof Error ? error.message : error)
            }
          },
        },
      }
    )
  } catch (error) {
    console.error(`[DEBUG_SERVER_CLIENT-${clientId}] ❌ Failed to create client:`, error)
    throw error
  }
}

/**
 * 🧪 Test auth with debug client
 */
export const testAuthWithDebugClient = async () => {
  const testId = Math.random().toString(36).substr(2, 9)
  console.log(`[DEBUG_AUTH_TEST-${testId}] 🧪 Starting debug auth test`)
  
  try {
    const client = createDebugClient()
    
    console.log(`[DEBUG_AUTH_TEST-${testId}] 🔐 Testing getUser()...`)
    const { data: { user }, error: userError } = await client.auth.getUser()
    
    console.log(`[DEBUG_AUTH_TEST-${testId}] 🎯 GetUser Result:`, {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.user_metadata?.role,
      error: userError?.message
    })
    
    if (user) {
      console.log(`[DEBUG_AUTH_TEST-${testId}] 👤 Testing profile query...`)
      const { data: profile, error: profileError } = await client
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      console.log(`[DEBUG_AUTH_TEST-${testId}] 👤 Profile Result:`, {
        hasProfile: !!profile,
        profileRole: profile?.role,
        error: profileError?.message
      })
      
      if (profile) {
        console.log(`[DEBUG_AUTH_TEST-${testId}] ⚙️ Testing is_admin RPC...`)
        const { data: isAdmin, error: adminError } = await client.rpc('is_admin')
        
        console.log(`[DEBUG_AUTH_TEST-${testId}] ⚙️ is_admin Result:`, {
          result: isAdmin,
          type: typeof isAdmin,
          error: adminError?.message
        })
      }
    }
    
    return { user, userError }
  } catch (error) {
    console.error(`[DEBUG_AUTH_TEST-${testId}] ❌ Debug test failed:`, error)
    return { user: null, userError: error }
  }
}