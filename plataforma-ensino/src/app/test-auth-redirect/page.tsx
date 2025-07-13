'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRedirectUrlForCurrentUser } from '@/lib/auth/redirect-helpers'
import { GradientButton } from '@/components/ui'

/**
 * 🧪 TEST PAGE: Auth Redirect Testing
 * 
 * This page allows testing the role-based redirect functionality
 * to ensure admin users are properly redirected to /admin after login
 */
export default function TestAuthRedirectPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState<string>('')
  const [userInfo, setUserInfo] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const testCurrentUserRedirect = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const supabase = createClient()
      
      // Get current user info
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        setError('No authenticated user found')
        setUserInfo(null)
        setRedirectUrl('/auth/login')
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
        profile: profile
      })

      // Test redirect URL determination
      const redirectDestination = await getRedirectUrlForCurrentUser()
      setRedirectUrl(redirectDestination)

    } catch (err: any) {
      setError(err.message || 'Error testing redirect')
    } finally {
      setIsLoading(false)
    }
  }

  const performActualRedirect = async () => {
    if (redirectUrl) {
      router.push(redirectUrl)
    }
  }

  const testLoginRedirect = async (email: string, password: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      const supabase = createClient()
      
      // Sign out first to test fresh login
      await supabase.auth.signOut()
      
      // Sign in
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        throw authError
      }

      // Wait a moment for auth state to update
      setTimeout(async () => {
        const redirectDestination = await getRedirectUrlForCurrentUser()
        console.log('🎯 Test login redirect destination:', redirectDestination)
        setRedirectUrl(redirectDestination)
        
        // Perform actual redirect
        router.push(redirectDestination)
      }, 300)

    } catch (err: any) {
      setError(err.message || 'Error testing login redirect')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🧪 Auth Redirect Testing
        </h1>
        
        <div className="grid gap-8">
          {/* Current User Test */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Test Current User Redirect
            </h2>
            
            <GradientButton 
              onClick={testCurrentUserRedirect}
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? 'Testing...' : 'Test Current User Redirect'}
            </GradientButton>

            {userInfo && (
              <div className="mb-4 p-4 bg-gray-800 rounded">
                <h3 className="text-green-400 font-semibold mb-2">Current User Info:</h3>
                <pre className="text-sm text-gray-300 overflow-auto">
                  {JSON.stringify(userInfo, null, 2)}
                </pre>
              </div>
            )}

            {redirectUrl && (
              <div className="mb-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded">
                <h3 className="text-blue-400 font-semibold mb-2">Redirect Destination:</h3>
                <p className="text-white font-mono">{redirectUrl}</p>
                
                <GradientButton 
                  onClick={performActualRedirect}
                  className="mt-2"
                >
                  Go to Redirect URL
                </GradientButton>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-900/30 border border-red-500/30 rounded">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Test Instructions */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📋 Testing Instructions
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <div>
                <h3 className="text-white font-semibold">Expected Behavior:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Admin users</strong> should be redirected to <code className="bg-gray-800 px-1 rounded">/admin</code></li>
                  <li><strong>Instructor users</strong> should be redirected to <code className="bg-gray-800 px-1 rounded">/dashboard</code></li>
                  <li><strong>Student users</strong> should be redirected to <code className="bg-gray-800 px-1 rounded">/dashboard</code></li>
                  <li><strong>Unauthenticated users</strong> should be redirected to <code className="bg-gray-800 px-1 rounded">/auth/login</code></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold">Test Scenarios:</h3>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Login as admin user and verify redirect to /admin</li>
                  <li>Login as regular user and verify redirect to /dashboard</li>
                  <li>Access /auth/login while already logged in (should redirect based on role)</li>
                  <li>Email verification flow should redirect based on role</li>
                </ol>
              </div>

              <div>
                <h3 className="text-white font-semibold">Implementation Details:</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Client-side redirect: <code className="bg-gray-800 px-1 rounded">src/app/auth/login/page.tsx</code></li>
                  <li>Server-side redirect: <code className="bg-gray-800 px-1 rounded">src/app/auth/callback/route.ts</code></li>
                  <li>Middleware redirect: <code className="bg-gray-800 px-1 rounded">src/lib/supabase/middleware.ts</code></li>
                  <li>Utilities: <code className="bg-gray-800 px-1 rounded">src/lib/auth/redirect-helpers.ts</code></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Role Information */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🎭 Role-Based Redirect Rules
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-900/20 border border-purple-500/30 rounded">
                <span className="text-purple-300 font-semibold">Admin</span>
                <span className="font-mono text-white">/admin</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                <span className="text-blue-300 font-semibold">Instructor</span>
                <span className="font-mono text-white">/dashboard</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-900/20 border border-green-500/30 rounded">
                <span className="text-green-300 font-semibold">Student</span>
                <span className="font-mono text-white">/dashboard</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-600/30 rounded">
                <span className="text-gray-300 font-semibold">Unauthenticated</span>
                <span className="font-mono text-white">/auth/login</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}