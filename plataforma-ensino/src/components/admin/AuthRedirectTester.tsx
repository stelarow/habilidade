'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getRedirectUrlForCurrentUser } from '@/lib/auth/redirect-helpers'

/**
 * 🧪 AUTH REDIRECT TESTER COMPONENT
 * 
 * Small component for quick testing of redirect logic
 * Can be embedded in any page for debugging purposes
 */
interface AuthRedirectTesterProps {
  showDetails?: boolean
}

export function AuthRedirectTester({ showDetails = false }: AuthRedirectTesterProps) {
  const [isTestingRedirect, setIsTestingRedirect] = useState(false)
  const [redirectResult, setRedirectResult] = useState<{
    redirectUrl: string
    userRole: string
    timestamp: string
  } | null>(null)

  const testRedirect = async () => {
    setIsTestingRedirect(true)
    
    try {
      const supabase = createClient()
      
      // Get user info
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setRedirectResult({
          redirectUrl: '/auth/login',
          userRole: 'unauthenticated',
          timestamp: new Date().toISOString()
        })
        return
      }

      // Get user role
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      // Test redirect URL
      const redirectUrl = await getRedirectUrlForCurrentUser()
      
      setRedirectResult({
        redirectUrl,
        userRole: profile?.role || 'unknown',
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      console.error('Error testing redirect:', error)
    } finally {
      setIsTestingRedirect(false)
    }
  }

  if (!showDetails) {
    return (
      <button
        onClick={testRedirect}
        disabled={isTestingRedirect}
        className="inline-flex items-center px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
      >
        {isTestingRedirect ? '🔄' : '🧪'} Test Redirect
      </button>
    )
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">🧪 Auth Redirect Tester</h3>
        <button
          onClick={testRedirect}
          disabled={isTestingRedirect}
          className="inline-flex items-center px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
        >
          {isTestingRedirect ? 'Testing...' : 'Test Redirect'}
        </button>
      </div>

      {redirectResult && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Role:</span>
            <span className="text-white font-mono">{redirectResult.userRole}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Redirect:</span>
            <span className="text-green-400 font-mono">{redirectResult.redirectUrl}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tested:</span>
            <span className="text-gray-300 font-mono text-xs">
              {new Date(redirectResult.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}