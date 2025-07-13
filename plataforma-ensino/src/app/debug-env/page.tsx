'use client'

import { useState, useEffect } from 'react'

/**
 * 🔍 ENVIRONMENT & CONFIGURATION DEBUG
 * 
 * Verifies that all required environment variables and configurations are present
 */
export default function DebugEnvPage() {
  const [envCheck, setEnvCheck] = useState<any>(null)
  const [cookieCheck, setCookieCheck] = useState<string[]>([])

  useEffect(() => {
    // Check environment variables (client-side)
    setEnvCheck({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseUrlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseKeyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) + '...',
    })

    // Check cookies
    const cookies = document.cookie.split(';').filter(c => c.trim())
    setCookieCheck(cookies.map(c => c.trim().substring(0, 50) + '...'))
  }, [])

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Environment & Configuration Debug</h1>
        
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">🌍 Environment Variables</h2>
            {envCheck ? (
              <div className="space-y-2">
                <div className={`p-3 rounded ${envCheck.supabaseUrl ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                  <div className="flex justify-between items-center">
                    <span>NEXT_PUBLIC_SUPABASE_URL</span>
                    <span className={envCheck.supabaseUrl ? 'text-green-400' : 'text-red-400'}>
                      {envCheck.supabaseUrl ? '✅' : '❌'}
                    </span>
                  </div>
                  {envCheck.supabaseUrl && (
                    <div className="text-xs text-gray-400 mt-1">{envCheck.supabaseUrlValue}</div>
                  )}
                </div>
                
                <div className={`p-3 rounded ${envCheck.supabaseKey ? 'bg-green-900/30 border border-green-500/30' : 'bg-red-900/30 border border-red-500/30'}`}>
                  <div className="flex justify-between items-center">
                    <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                    <span className={envCheck.supabaseKey ? 'text-green-400' : 'text-red-400'}>
                      {envCheck.supabaseKey ? '✅' : '❌'}
                    </span>
                  </div>
                  {envCheck.supabaseKey && (
                    <div className="text-xs text-gray-400 mt-1">{envCheck.supabaseKeyValue}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Loading...</div>
            )}
          </div>

          {/* Cookies */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">🍪 Current Cookies ({cookieCheck.length})</h2>
            {cookieCheck.length > 0 ? (
              <div className="bg-black p-4 rounded max-h-48 overflow-y-auto">
                <div className="space-y-1 text-xs font-mono">
                  {cookieCheck.map((cookie, index) => (
                    <div key={index} className="text-gray-300 border-b border-gray-800 pb-1">
                      {cookie}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-400">No cookies found</div>
            )}
          </div>

          {/* Middleware Checker */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-blue-300">🔧 Middleware Verification Steps</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-blue-400">1.</span>
                <div>
                  <strong>Check Console for Middleware Logs</strong>
                  <p className="text-gray-400">Navigate to /auth/login and look for logs starting with [MIDDLEWARE-xxx]</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400">2.</span>
                <div>
                  <strong>Verify Environment Variables</strong>
                  <p className="text-gray-400">Both Supabase URL and Key must be present (checked above)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400">3.</span>
                <div>
                  <strong>Check Authentication Cookies</strong>
                  <p className="text-gray-400">Look for supabase-related cookies in the list above</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-blue-400">4.</span>
                <div>
                  <strong>Restart Development Server</strong>
                  <p className="text-gray-400">Run: npm run dev (middleware changes require restart)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">🚀 Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/auth/login"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-center block"
              >
                → Go to Login (Check Console)
              </a>
              <a
                href="/debug-middleware-simple"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-center block"
              >
                → Simple Middleware Test
              </a>
              <a
                href="/debug-middleware"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center block"
              >
                → Full Middleware Debug
              </a>
            </div>
          </div>

          {/* Troubleshooting Guide */}
          <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-300">❌ If Middleware Still Not Working</h2>
            <div className="space-y-2 text-sm">
              <p><strong>1. Check Next.js Version:</strong> Ensure you're using Next.js 13+ with App Router</p>
              <p><strong>2. Verify File Location:</strong> middleware.ts must be in the root of your project (same level as app/)</p>
              <p><strong>3. Check Matcher:</strong> Ensure the matcher pattern matches your routes</p>
              <p><strong>4. Environment Variables:</strong> Make sure .env.local is in the root and contains both variables</p>
              <p><strong>5. Restart Everything:</strong> Stop dev server, clear .next cache, restart</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}