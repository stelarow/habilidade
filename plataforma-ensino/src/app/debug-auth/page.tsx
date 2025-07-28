'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserClient, isAdmin, canAccessAdminPanel } from '@/lib/auth/permissions-client'
import type { User } from '@/types'

interface AuthDebugData {
  user: any
  userError: any
  profile: any
  profileError: any
  isAdmin: boolean
  canAccessAdmin: boolean
  cookies: any[]
  timestamp: string
  userAgent: string
  location: string
}

export default function DebugAuthPage() {
  const [debugData, setDebugData] = useState<AuthDebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const collectDebugData = async () => {
      const debugId = Math.random().toString(36).substr(2, 9)
      console.log(`[DEBUG_AUTH-${debugId}] ========== COLLECTING DEBUG DATA ==========`)
      
      try {
        setLoading(true)
        setError(null)

        // Create Supabase client
        const supabase = createClient()
        console.log(`[DEBUG_AUTH-${debugId}] Supabase client created`)

        // Get user from auth
        console.log(`[DEBUG_AUTH-${debugId}] Getting user from auth...`)
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log(`[DEBUG_AUTH-${debugId}] Auth result:`, { 
          hasUser: !!user, 
          userId: user?.id,
          userError: userError?.message 
        })

        // Get user profile if user exists
        let profile = null
        let profileError = null
        
        if (user) {
          console.log(`[DEBUG_AUTH-${debugId}] Getting user profile...`)
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()
          
          profile = data
          profileError = error
          console.log(`[DEBUG_AUTH-${debugId}] Profile result:`, { 
            hasProfile: !!profile, 
            role: profile?.role,
            profileError: profileError?.message 
          })
        }

        // Get current user via permissions client
        console.log(`[DEBUG_AUTH-${debugId}] Getting current user via permissions client...`)
        const currentUser = await getCurrentUserClient()
        console.log(`[DEBUG_AUTH-${debugId}] Current user result:`, { 
          hasCurrentUser: !!currentUser,
          currentUserRole: currentUser?.role 
        })

        // Check admin permissions
        const userIsAdmin = isAdmin(currentUser)
        const userCanAccessAdmin = canAccessAdminPanel(currentUser)
        console.log(`[DEBUG_AUTH-${debugId}] Permission checks:`, { 
          isAdmin: userIsAdmin,
          canAccessAdmin: userCanAccessAdmin 
        })

        // Get cookies (client-side approximation)
        const cookies = document.cookie.split(';').map((cookie: any) => {
          const [name, ...valueParts] = cookie.trim().split('=')
          return {
            name: name?.trim(),
            hasValue: valueParts.length > 0,
            valueLength: valueParts.join('=').length
          }
        }).filter((c: any) => c.name)

        console.log(`[DEBUG_AUTH-${debugId}] Found ${cookies.length} cookies`)

        const debugData: AuthDebugData = {
          user: user ? {
            id: user.id,
            email: user.email,
            role: user.role,
            user_metadata: user.user_metadata,
            app_metadata: user.app_metadata,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            is_anonymous: user.is_anonymous
          } : null,
          userError: userError ? {
            message: userError.message,
            code: (userError as any).code
          } : null,
          profile: profile,
          profileError: profileError ? {
            message: profileError.message,
            code: (profileError as any).code,
            details: (profileError as any).details
          } : null,
          isAdmin: userIsAdmin,
          canAccessAdmin: userCanAccessAdmin,
          cookies: cookies,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          location: window.location.href
        }

        console.log(`[DEBUG_AUTH-${debugId}] Debug data collected:`, debugData)
        setDebugData(debugData)

      } catch (err) {
        console.error(`[DEBUG_AUTH-${debugId}] Error collecting debug data:`, err)
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    }

    collectDebugData()
  }, [])

  const refreshData = () => {
    setLoading(true)
    setTimeout(() => window.location.reload(), 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔍 Debug de Autenticação</h1>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🔍 Debug de Autenticação</h1>
          <button
            onClick={refreshData}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            🔄 Atualizar
          </button>
        </div>

        {error && (
          <div className="bg-red-900 border border-red-600 rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-red-300 mb-2">❌ Erro</h2>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {debugData && (
          <div className="space-y-6">
            {/* Quick Status */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">📊 Status Rápido</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-3 rounded-lg ${debugData.user ? 'bg-green-900' : 'bg-red-900'}`}>
                  <div className="text-sm text-gray-300">Autenticado</div>
                  <div className="text-lg font-bold">{debugData.user ? '✅ Sim' : '❌ Não'}</div>
                </div>
                <div className={`p-3 rounded-lg ${debugData.profile ? 'bg-green-900' : 'bg-red-900'}`}>
                  <div className="text-sm text-gray-300">Perfil</div>
                  <div className="text-lg font-bold">{debugData.profile ? '✅ Sim' : '❌ Não'}</div>
                </div>
                <div className={`p-3 rounded-lg ${debugData.isAdmin ? 'bg-green-900' : 'bg-yellow-900'}`}>
                  <div className="text-sm text-gray-300">Admin</div>
                  <div className="text-lg font-bold">{debugData.isAdmin ? '✅ Sim' : '⚠️ Não'}</div>
                </div>
                <div className={`p-3 rounded-lg ${debugData.canAccessAdmin ? 'bg-green-900' : 'bg-red-900'}`}>
                  <div className="text-sm text-gray-300">Acesso Admin</div>
                  <div className="text-lg font-bold">{debugData.canAccessAdmin ? '✅ Sim' : '❌ Não'}</div>
                </div>
              </div>
            </div>

            {/* User Data */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">👤 Dados do Usuário</h2>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(debugData.user, null, 2)}
              </pre>
              {debugData.userError && (
                <div className="mt-4 p-4 bg-red-900 rounded-lg">
                  <h3 className="font-bold text-red-300">Erro de Usuário:</h3>
                  <pre className="text-sm text-red-200">{JSON.stringify(debugData.userError, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Profile Data */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">📝 Dados do Perfil</h2>
              <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(debugData.profile, null, 2)}
              </pre>
              {debugData.profileError && (
                <div className="mt-4 p-4 bg-red-900 rounded-lg">
                  <h3 className="font-bold text-red-300">Erro de Perfil:</h3>
                  <pre className="text-sm text-red-200">{JSON.stringify(debugData.profileError, null, 2)}</pre>
                </div>
              )}
            </div>

            {/* Cookies */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🍪 Cookies ({debugData.cookies.length})</h2>
              <div className="space-y-2">
                {debugData.cookies.map((cookie, index) => (
                  <div key={index} className="bg-gray-900 p-2 rounded-lg flex justify-between">
                    <span className="font-mono text-sm">{cookie.name}</span>
                    <span className="text-gray-400 text-sm">
                      {cookie.hasValue ? `${cookie.valueLength} chars` : 'empty'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environment Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🌐 Informações do Ambiente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Timestamp:</div>
                  <div className="font-mono">{debugData.timestamp}</div>
                </div>
                <div>
                  <div className="text-gray-400">Location:</div>
                  <div className="font-mono break-all">{debugData.location}</div>
                </div>
                <div className="col-span-full">
                  <div className="text-gray-400">User Agent:</div>
                  <div className="font-mono text-xs break-all">{debugData.userAgent}</div>
                </div>
              </div>
            </div>

            {/* Test Links */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">🔗 Links de Teste</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/admin"
                  className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-center transition-colors"
                >
                  🔒 Testar /admin
                </a>
                <a
                  href="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-center transition-colors"
                >
                  🔑 Login
                </a>
                <a
                  href="/dashboard"
                  className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-center transition-colors"
                >
                  📊 Dashboard
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}