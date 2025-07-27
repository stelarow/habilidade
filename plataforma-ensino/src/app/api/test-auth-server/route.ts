import { createClient } from '@/lib/supabase/server'
import { createDebugClient, testAuthWithDebugClient } from '@/lib/supabase/server-debug'
import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth/session'
import { logError, logDebug } from '@/lib/utils/logger'

// Force dynamic rendering for this API route since it accesses cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const testId = Math.random().toString(36).substr(2, 9)
  logDebug(`[API_AUTH_TEST-${testId}] 🧪 Starting server-side auth test`)

  const results = {
    timestamp: new Date().toISOString(),
    testId,
    tests: {} as any,
    cookies: {},
    headers: {},
    summary: {
      authenticated: false,
      hasProfile: false,
      isAdmin: false,
      errors: [] as string[]
    }
  }

  try {
    // Test 1: Check request cookies
    logDebug(`[API_AUTH_TEST-${testId}] 🍪 Testing cookies...`)
    const cookies = request.cookies.getAll()
    const supabaseCookies = cookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('sb-') ||
      c.name.includes('auth')
    )
    
    results.cookies = {
      total: cookies.length,
      supabase: supabaseCookies.length,
      names: cookies.map(c => c.name),
      supabaseNames: supabaseCookies.map(c => c.name)
    }

    results.tests.cookies = {
      status: 'success',
      data: results.cookies
    }

    // Test 2: Check headers
    logDebug(`[API_AUTH_TEST-${testId}] 📋 Testing headers...`)
    results.headers = {
      authorization: request.headers.get('authorization'),
      cookie: request.headers.get('cookie') ? 'present' : 'missing',
      userAgent: request.headers.get('user-agent')
    }

    results.tests.headers = {
      status: 'success',
      data: results.headers
    }

    // Test 3: Create Supabase client and test auth
    logDebug(`[API_AUTH_TEST-${testId}] 🔐 Testing Supabase server client...`)
    const supabase = createClient()
    
    // Test 3.1: Debug client analysis
    logDebug(`[API_AUTH_TEST-${testId}] 🔍 Running debug client analysis...`)
    const debugResults = await testAuthWithDebugClient()
    
    results.tests.debugClient = {
      status: debugResults.userError ? 'error' : 'success',
      data: debugResults,
      error: debugResults.userError instanceof Error ? debugResults.userError.message : undefined
    }
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      results.tests.supabaseAuth = {
        status: userError ? 'error' : 'success',
        data: {
          hasUser: !!user,
          userId: user?.id,
          userEmail: user?.email,
          error: userError?.message
        },
        error: userError?.message
      }

      if (user) {
        results.summary.authenticated = true
        logDebug(`[API_AUTH_TEST-${testId}] ✅ User authenticated: ${user.id}`)

        // Test 4: Get user profile
        logDebug(`[API_AUTH_TEST-${testId}] 👤 Testing user profile...`)
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        results.tests.userProfile = {
          status: profileError ? 'error' : 'success',
          data: profile,
          error: profileError?.message
        }

        if (profile) {
          results.summary.hasProfile = true
          results.summary.isAdmin = profile.role === 'admin'
          logDebug(`[API_AUTH_TEST-${testId}] 👤 Profile found: ${profile.role}`)

          // Test 5: Test is_admin RPC
          logDebug(`[API_AUTH_TEST-${testId}] 🔧 Testing is_admin RPC...`)
          const { data: isAdminResult, error: adminError } = await supabase.rpc('is_admin')
          
          results.tests.isAdminRPC = {
            status: adminError ? 'error' : 'success',
            data: {
              result: isAdminResult,
              type: typeof isAdminResult,
              expected: profile.role === 'admin'
            },
            error: adminError?.message
          }
        }
      } else {
        logDebug(`[API_AUTH_TEST-${testId}] ❌ No user authenticated`)
        results.summary.errors.push('No authenticated user found')
      }
    } catch (supabaseError) {
      logError(`[API_AUTH_TEST-${testId}] ❌ Supabase error:`, supabaseError)
      results.tests.supabaseAuth = {
        status: 'error',
        error: supabaseError instanceof Error ? supabaseError.message : String(supabaseError)
      }
      results.summary.errors.push('Supabase client error')
    }

    // Test 6: Test session verification function
    logDebug(`[API_AUTH_TEST-${testId}] 🛡️ Testing session verification...`)
    try {
      const session = await verifySession()
      results.tests.sessionVerification = {
        status: 'success',
        data: {
          isAuthenticated: session.isAuthenticated,
          hasUser: !!session.user,
          hasProfile: !!session.profile,
          role: session.profile?.role,
          error: session.error
        }
      }
    } catch (sessionError) {
      results.tests.sessionVerification = {
        status: 'error',
        error: sessionError instanceof Error ? sessionError.message : String(sessionError)
      }
    }

  } catch (error) {
    logError(`[API_AUTH_TEST-${testId}] ❌ Test suite error:`, error)
    results.summary.errors.push(error instanceof Error ? error.message : String(error))
  }

  logDebug(`[API_AUTH_TEST-${testId}] 🏁 Test completed. Summary:`, results.summary)

  return NextResponse.json(results, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}