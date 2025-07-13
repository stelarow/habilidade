'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton } from '@/components/ui'

/**
 * 🧪 TEST PAGE: Auth Middleware Testing
 * 
 * This page allows testing the middleware redirect functionality
 * to ensure authenticated users cannot access login/register pages
 */
export default function TestAuthMiddlewarePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [testResults, setTestResults] = useState<string[]>([])
  const router = useRouter()

  const checkCurrentUser = async () => {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      
      // Get current user info
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setUserInfo(null)
        return
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserInfo({
        id: user.id,
        email: user.email,
        role: profile?.role || 'unknown',
        authenticated: true
      })

    } catch (err: any) {
      console.error('Error checking user:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const testAuthRedirect = (targetRoute: string) => {
    setTestResults(prev => [...prev, `🔄 Testing redirect to: ${targetRoute}`])
    
    // Attempt to navigate to auth route
    // If middleware is working, it should redirect authenticated users
    router.push(targetRoute)
  }

  const testLogout = async () => {
    setIsLoading(true)
    
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      
      setUserInfo(null)
      setTestResults(prev => [...prev, '✅ Logged out successfully'])
      
      // Wait a moment then redirect to login to test
      setTimeout(() => {
        router.push('/auth/login')
      }, 1000)
      
    } catch (err) {
      setTestResults(prev => [...prev, '❌ Error logging out'])
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Auth Middleware Testing
        </h1>
        
        <div className="grid gap-8">
          {/* User Status */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current User Status
            </h2>
            
            <div className="flex gap-4 mb-4">
              <GradientButton 
                onClick={checkCurrentUser}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Check Current User'}
              </GradientButton>
              
              {userInfo && (
                <GradientButton 
                  onClick={testLogout}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Logout
                </GradientButton>
              )}
            </div>

            {userInfo ? (
              <div className="p-4 bg-green-900/30 border border-green-500/30 rounded">
                <h3 className="text-green-400 font-semibold mb-2">✅ Authenticated User:</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Role:</strong> {userInfo.role}</p>
                  <p><strong>ID:</strong> {userInfo.id}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-800/50 border border-gray-600/30 rounded">
                <p className="text-gray-400">👤 No authenticated user</p>
              </div>
            )}
          </div>

          {/* Middleware Tests */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Middleware Redirect Tests
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-3">Test Auth Route Blocking:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <GradientButton 
                    onClick={() => testAuthRedirect('/auth/login')}
                    className="text-left"
                  >
                    🔓 Test /auth/login redirect
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testAuthRedirect('/auth/register')}
                    className="text-left"
                  >
                    📝 Test /auth/register redirect
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testAuthRedirect('/auth/forgot-password')}
                    className="text-left"
                  >
                    🔑 Test /auth/forgot-password (should allow)
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testAuthRedirect('/admin')}
                    className="text-left"
                  >
                    ⚡ Test /admin access
                  </GradientButton>
                </div>
              </div>

              {testResults.length > 0 && (
                <div className="p-4 bg-blue-900/30 border border-blue-500/30 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-blue-400 font-semibold">Test Results:</h3>
                    <button 
                      onClick={clearResults}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-300 font-mono">
                    {testResults.map((result, index) => (
                      <div key={index}>{result}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Expected Behavior */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📋 Expected Behavior
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-white font-semibold">✅ When Authenticated:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li><strong>/auth/login</strong> → Redirect to <code className="bg-gray-800 px-1 rounded">/admin</code> (admin) or <code className="bg-gray-800 px-1 rounded">/dashboard</code> (regular)</li>
                  <li><strong>/auth/register</strong> → Redirect to <code className="bg-gray-800 px-1 rounded">/admin</code> (admin) or <code className="bg-gray-800 px-1 rounded">/dashboard</code> (regular)</li>
                  <li><strong>/auth/forgot-password</strong> → Should be allowed (not restricted)</li>
                  <li><strong>/admin</strong> → Allow if admin, redirect to <code className="bg-gray-800 px-1 rounded">/dashboard</code> if not admin</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold">❌ When Not Authenticated:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li><strong>/auth/login</strong> → Allow access</li>
                  <li><strong>/auth/register</strong> → Allow access</li>
                  <li><strong>/admin</strong> → Redirect to <code className="bg-gray-800 px-1 rounded">/auth/login</code></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold">🔧 Testing Process:</h3>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                  <li>Check current user status</li>
                  <li>If authenticated, try accessing /auth/login or /auth/register</li>
                  <li>Observe if you get redirected based on your role</li>
                  <li>Test both admin and regular user scenarios</li>
                  <li>Test logout and then accessing auth routes</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Security Notes */}
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              🔒 Security Implementation Notes
            </h2>
            
            <div className="space-y-3 text-sm text-red-200">
              <p>
                <strong>Middleware Location:</strong> <code className="bg-red-900/30 px-1 rounded">plataforma-ensino/middleware.ts</code>
              </p>
              <p>
                <strong>Protected Routes:</strong> Specifically <code className="bg-red-900/30 px-1 rounded">/auth/login</code> and <code className="bg-red-900/30 px-1 rounded">/auth/register</code>
              </p>
              <p>
                <strong>Redirect Logic:</strong> Admin role → /admin, All other roles → /dashboard
              </p>
              <p>
                <strong>Performance:</strong> Lightweight checks in middleware for fast response times
              </p>
              <p>
                <strong>Fallback:</strong> Graceful error handling allows requests to proceed if checks fail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}