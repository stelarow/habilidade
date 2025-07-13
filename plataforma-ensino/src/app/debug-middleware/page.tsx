'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { GradientButton } from '@/components/ui'

/**
 * 🔍 MIDDLEWARE DEBUG PAGE
 * 
 * This page helps debug middleware functionality by testing
 * authentication redirects in real-time
 */
export default function DebugMiddlewarePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testResults, setTestResults] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        setUserInfo({
          id: user.id,
          email: user.email,
          role: profile?.role || 'unknown',
          profile
        })
      } else {
        setUserInfo(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testMiddlewareRedirect = (route: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestResults(prev => [...prev, `[${timestamp}] 🔄 Testing redirect to: ${route}`])
    
    // Navigate to the route - middleware should intercept if authenticated
    router.push(route)
  }

  const clearLogs = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          🔍 Middleware Debug Center
        </h1>
        
        <div className="grid gap-8">
          {/* Current User Status */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Current Authentication Status
            </h2>
            
            <div className="flex gap-4 mb-4">
              <GradientButton onClick={checkUser} disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Refresh User Status'}
              </GradientButton>
            </div>

            {userInfo ? (
              <div className="p-4 bg-green-900/30 border border-green-500/30 rounded">
                <h3 className="text-green-400 font-semibold mb-2">✅ User Authenticated</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <p><strong>Role:</strong> <span className="font-mono bg-gray-800 px-1 rounded">{userInfo.role}</span></p>
                    <p><strong>ID:</strong> <span className="font-mono text-xs">{userInfo.id}</span></p>
                  </div>
                  <div>
                    <p><strong>Expected Redirect:</strong></p>
                    <p className="font-mono bg-blue-900/30 px-2 py-1 rounded">
                      {userInfo.role === 'admin' ? '/admin' : '/dashboard'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-800/50 border border-gray-600/30 rounded">
                <p className="text-gray-400">👤 No authenticated user - middleware should allow auth routes</p>
              </div>
            )}
          </div>

          {/* Middleware Tests */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🧪 Middleware Redirect Tests
            </h2>
            
            <div className="grid gap-6">
              {/* Auth Route Tests */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  🔐 Auth Route Tests {userInfo ? '(Should redirect)' : '(Should allow)'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/auth/login')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    🔓 Test /auth/login
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/auth/register')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    📝 Test /auth/register
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/auth/forgot-password')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    🔑 Test /auth/forgot-password
                  </GradientButton>
                </div>
              </div>

              {/* Admin Route Tests */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  ⚡ Admin Route Tests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/admin')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    🏠 Test /admin
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/admin/users')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    👥 Test /admin/users
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/admin/courses')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    📚 Test /admin/courses
                  </GradientButton>
                </div>
              </div>

              {/* Navigation Tests */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  🚀 Direct Navigation (No middleware)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    📊 Go to /dashboard
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/courses')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    📖 Go to /courses
                  </GradientButton>
                  
                  <GradientButton 
                    onClick={() => testMiddlewareRedirect('/profile')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    👤 Go to /profile
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  📋 Test Results
                </h2>
                <GradientButton onClick={clearLogs} className="text-sm">
                  Clear Logs
                </GradientButton>
              </div>
              
              <div className="bg-gray-800/50 rounded p-4 max-h-64 overflow-y-auto">
                <div className="space-y-1 text-sm text-gray-300 font-mono">
                  {testResults.map((result, index) => (
                    <div key={index} className="border-b border-gray-700/30 pb-1">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expected Behavior Guide */}
          <div className="bg-zinc-900/70 backdrop-blur-md rounded-lg border border-gray-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📖 Expected Behavior Guide
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-green-400 font-semibold mb-3">✅ When Authenticated:</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>/auth/login →</span>
                    <span className="font-mono">{userInfo?.role === 'admin' ? '/admin' : '/dashboard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/auth/register →</span>
                    <span className="font-mono">{userInfo?.role === 'admin' ? '/admin' : '/dashboard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/auth/forgot-password →</span>
                    <span className="font-mono text-green-400">ALLOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/admin (if admin) →</span>
                    <span className="font-mono text-green-400">ALLOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/admin (if not admin) →</span>
                    <span className="font-mono">/dashboard</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-blue-400 font-semibold mb-3">❌ When Not Authenticated:</h3>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>/auth/login →</span>
                    <span className="font-mono text-green-400">ALLOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/auth/register →</span>
                    <span className="font-mono text-green-400">ALLOW</span>
                  </div>
                  <div className="flex justify-between">
                    <span>/admin →</span>
                    <span className="font-mono">/auth/login</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Console Instructions */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-300 mb-4">
              🔧 Debugging Instructions
            </h2>
            
            <div className="space-y-3 text-sm text-yellow-200">
              <p>
                <strong>1. Open Browser DevTools Console</strong> - Look for middleware logs starting with <code className="bg-yellow-900/30 px-1 rounded">[MIDDLEWARE-...]</code>
              </p>
              <p>
                <strong>2. Test Each Route</strong> - Click the test buttons above and observe the browser behavior
              </p>
              <p>
                <strong>3. Check Redirects</strong> - If middleware is working, you should be redirected away from auth routes when logged in
              </p>
              <p>
                <strong>4. Expected Logs:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 font-mono text-xs">
                <li>[MIDDLEWARE-xxx] 🔥 Processing: /auth/login</li>
                <li>[MIDDLEWARE-xxx] 🔐 Auth route detected: /auth/login</li>
                <li>[MIDDLEWARE-xxx] 🚫 Restricted auth route detected: /auth/login</li>
                <li>[MIDDLEWARE-xxx] ✅ User already authenticated</li>
                <li>[MIDDLEWARE-xxx] 🎯 User role: admin → Redirecting to: /admin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}