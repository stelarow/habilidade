'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  data?: any
  error?: string
  duration?: number
}

interface AuthState {
  user: any | null
  profile: any | null
  cookies: any[]
  session: any | null
}

export default function AuthTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    cookies: [],
    session: null
  })
  const [isRunning, setIsRunning] = useState(false)

  const updateTest = (name: string, update: Partial<TestResult>) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name)
      if (existing) {
        return prev.map(t => t.name === name ? { ...t, ...update } : t)
      }
      return [...prev, { name, status: 'pending', ...update } as TestResult]
    })
  }

  const runTest = async (name: string, testFn: () => Promise<any>) => {
    const startTime = Date.now()
    updateTest(name, { status: 'pending' })
    
    try {
      const result = await testFn()
      const duration = Date.now() - startTime
      updateTest(name, { 
        status: 'success', 
        data: result,
        duration 
      })
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest(name, { 
        status: 'error', 
        error: error instanceof Error ? error.message : String(error),
        duration 
      })
      throw error
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTests([])
    
    const supabase = createClient()

    try {
      // Test 1: Check cookies
      const cookies = await runTest('Cookies Available', async () => {
        const allCookies = document.cookie.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=')
          return { name, value: value || '' }
        }).filter(cookie => cookie.name)
        
        const supabaseCookies = allCookies.filter(cookie => 
          cookie.name.includes('supabase') || 
          cookie.name.includes('sb-') ||
          cookie.name.includes('auth')
        )
        
        return {
          total: allCookies.length,
          supabase: supabaseCookies.length,
          cookies: supabaseCookies
        }
      })

      // Test 2: Get Auth User
      const user = await runTest('Supabase Auth User', async () => {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
      })

      // Test 3: Get Session
      const session = await runTest('Supabase Session', async () => {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
      })

      // Test 4: Get User Profile
      let profile = null
      if (user) {
        profile = await runTest('User Profile from DB', async () => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
          if (error) throw error
          return data
        })
      }

      // Test 5: Test is_admin RPC
      if (user) {
        await runTest('is_admin() RPC Call', async () => {
          const { data, error } = await supabase.rpc('is_admin')
          if (error) throw error
          return { result: data, type: typeof data }
        })
      }

      // Test 6: Test Auth State Changes
      await runTest('Auth State Listener', async () => {
        return new Promise((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            resolve({
              event,
              hasSession: !!session,
              userId: session?.user?.id
            })
            subscription.unsubscribe()
          })
        })
      })

      // Test 7: Server-side fetch test
      await runTest('Server-side Auth Test', async () => {
        const response = await fetch('/api/test-auth-server')
        const data = await response.json()
        return data
      })

      // Update auth state
      setAuthState({
        user,
        profile,
        cookies: cookies.cookies,
        session
      })

    } catch (error) {
      console.error('Test suite failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'success': return '✅'
      case 'error': return '❌'
    }
  }

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-400'
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">🔍 Authentication Diagnostic Center</h1>
          <p className="text-gray-400 mb-4">
            Complete authentication system testing and debugging
          </p>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            {isRunning ? '🔄 Running Tests...' : '🚀 Run All Tests'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Results */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🧪 Test Results</h2>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="border-l-4 border-gray-600 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${getStatusColor(test.status)}`}>
                        {getStatusIcon(test.status)} {test.name}
                      </h3>
                      {test.duration && (
                        <span className="text-sm text-gray-400">
                          {test.duration}ms
                        </span>
                      )}
                    </div>
                    
                    {test.status === 'error' && (
                      <p className="text-red-400 text-sm mb-2">
                        Error: {test.error}
                      </p>
                    )}
                    
                    {test.data && (
                      <pre className="bg-gray-900 p-3 rounded text-xs overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auth State Summary */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🔐 Authentication State</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-400 mb-2">User Info</h3>
                  <div className="bg-gray-900 p-3 rounded">
                    {authState.user ? (
                      <div className="text-sm space-y-1">
                        <p><strong>ID:</strong> {authState.user.id}</p>
                        <p><strong>Email:</strong> {authState.user.email}</p>
                        <p><strong>Created:</strong> {new Date(authState.user.created_at).toLocaleString()}</p>
                        <p><strong>Last Sign In:</strong> {authState.user.last_sign_in_at ? new Date(authState.user.last_sign_in_at).toLocaleString() : 'Never'}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">No user authenticated</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-green-400 mb-2">Profile Data</h3>
                  <div className="bg-gray-900 p-3 rounded">
                    {authState.profile ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Full Name:</strong> {authState.profile.full_name}</p>
                        <p><strong>Role:</strong> <span className="font-bold text-yellow-400">{authState.profile.role}</span></p>
                        <p><strong>Created:</strong> {new Date(authState.profile.created_at).toLocaleString()}</p>
                        <p><strong>Last Login:</strong> {authState.profile.last_login || 'Never'}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">No profile found</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-purple-400 mb-2">Session Info</h3>
                  <div className="bg-gray-900 p-3 rounded">
                    {authState.session ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Access Token:</strong> {authState.session.access_token ? '✅ Present' : '❌ Missing'}</p>
                        <p><strong>Refresh Token:</strong> {authState.session.refresh_token ? '✅ Present' : '❌ Missing'}</p>
                        <p><strong>Expires At:</strong> {new Date(authState.session.expires_at * 1000).toLocaleString()}</p>
                        <p><strong>Token Type:</strong> {authState.session.token_type}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400">No session found</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-orange-400 mb-2">Cookies ({authState.cookies.length})</h3>
                  <div className="bg-gray-900 p-3 rounded max-h-40 overflow-y-auto">
                    {authState.cookies.length > 0 ? (
                      <div className="text-xs space-y-1">
                        {authState.cookies.map((cookie, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-mono">{cookie.name}</span>
                            <span className="text-gray-500 truncate ml-2" style={{maxWidth: '200px'}}>
                              {cookie.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No Supabase cookies found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}