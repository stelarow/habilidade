'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 🔍 SIMPLE MIDDLEWARE TEST
 * 
 * Basic test to verify if middleware is executing at all
 */
export default function SimpleMiddlewareTest() {
  const [testLogs, setTestLogs] = useState<string[]>([])
  const router = useRouter()

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const testRoute = (route: string) => {
    addLog(`🔄 Testing navigation to: ${route}`)
    addLog(`📢 Check browser console for [MIDDLEWARE-xxx] logs`)
    addLog(`⏱️ If no middleware logs appear, middleware is NOT executing`)
    
    // Navigate to route - middleware should intercept
    router.push(route)
  }

  const clearLogs = () => {
    setTestLogs([])
  }

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🔍 Simple Middleware Test</h1>
        
        <div className="space-y-6">
          {/* Simple Test Buttons */}
          <div className="bg-gray-900 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Quick Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testRoute('/auth/login')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Test /auth/login
              </button>
              <button
                onClick={() => testRoute('/auth/register')}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
              >
                Test /auth/register
              </button>
              <button
                onClick={() => testRoute('/admin')}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
              >
                Test /admin
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-yellow-300">🔧 Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Open Browser DevTools Console</strong> (F12)</li>
              <li><strong>Click any test button above</strong></li>
              <li><strong>Look for logs starting with [MIDDLEWARE-xxx]</strong></li>
              <li><strong>If NO middleware logs appear:</strong> Middleware is not executing</li>
              <li><strong>If middleware logs appear:</strong> Check authentication logic</li>
            </ol>
          </div>

          {/* Test Logs */}
          {testLogs.length > 0 && (
            <div className="bg-gray-900 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">📋 Test Logs</h2>
                <button
                  onClick={clearLogs}
                  className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="bg-black p-4 rounded max-h-48 overflow-y-auto">
                <div className="space-y-1 text-xs font-mono">
                  {testLogs.map((log, index) => (
                    <div key={index} className="text-gray-300">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expected Console Output */}
          <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-green-300">✅ Expected Console Output</h2>
            <div className="bg-black p-4 rounded text-xs font-mono space-y-1">
              <div className="text-green-400">[MIDDLEWARE-abc123] 🔥 Processing: /auth/login</div>
              <div className="text-yellow-400">[MIDDLEWARE-abc123] 🔐 Auth route detected: /auth/login</div>
              <div className="text-purple-400">[MIDDLEWARE-abc123] 🚫 Restricted auth route detected: /auth/login</div>
              <div className="text-blue-400">[MIDDLEWARE-abc123] ✅ User already authenticated</div>
              <div className="text-red-400">[MIDDLEWARE-abc123] 🎯 User role: admin → Redirecting to: /admin</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}