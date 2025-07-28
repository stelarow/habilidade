import { createClient } from '@/lib/supabase/server'
import { headers, cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function DebugServerPage() {
  const debugId = Math.random().toString(36).substr(2, 9)
  console.log(`[DEBUG_SERVER-${debugId}] ========== SERVER-SIDE DEBUG PAGE ==========`)

  // Get headers
  const headersList = headers()
  const allHeaders = Object.fromEntries(headersList.entries())
  
  // Get cookies
  const cookieStore = cookies()
  const allCookies = cookieStore.getAll()
  
  console.log(`[DEBUG_SERVER-${debugId}] Found ${allCookies.length} cookies`)
  console.log(`[DEBUG_SERVER-${debugId}] Headers count: ${Object.keys(allHeaders).length}`)

  // Create Supabase client
  const debugData: any = {
    timestamp: new Date().toISOString(),
    path: '/debug-server',
    method: 'GET'
  }

  try {
    console.log(`[DEBUG_SERVER-${debugId}] Creating Supabase client...`)
    const supabase = createClient()
    
    console.log(`[DEBUG_SERVER-${debugId}] Getting user...`)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log(`[DEBUG_SERVER-${debugId}] User result:`, { 
      hasUser: !!user, 
      userId: user?.id,
      userError: userError?.message 
    })

    debugData.user = user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      is_anonymous: user.is_anonymous
    } : null

    debugData.userError = userError ? {
      message: userError.message,
      code: (userError as any).code
    } : null

    // Get profile if user exists
    if (user) {
      console.log(`[DEBUG_SERVER-${debugId}] Getting profile...`)
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log(`[DEBUG_SERVER-${debugId}] Profile result:`, { 
        hasProfile: !!profile, 
        role: profile?.role,
        profileError: profileError?.message 
      })

      debugData.profile = profile
      debugData.profileError = profileError ? {
        message: profileError.message,
        code: (profileError as any).code,
        details: (profileError as any).details
      } : null
    }

  } catch (error) {
    console.error(`[DEBUG_SERVER-${debugId}] Error:`, error)
    debugData.error = error instanceof Error ? error.message : String(error)
  }

  // Middleware headers
  const middlewareHeaders = {
    'x-user-id': headersList.get('x-user-id'),
    'x-user-role': headersList.get('x-user-role'),
    'x-user-email': headersList.get('x-user-email'),
    'x-user-name': headersList.get('x-user-name')
  }

  debugData.middlewareHeaders = middlewareHeaders
  debugData.cookies = allCookies.map((c: any) => ({
    name: c.name,
    hasValue: !!c.value,
    valueLength: c.value?.length || 0
  }))

  const supabaseCookies = allCookies.filter((c: any) => 
    c.name.includes('supabase') || c.name.includes('sb-')
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🖥️ Debug Server-Side</h1>
        
        {/* Quick Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📊 Status Server-Side</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded-lg ${debugData.user ? 'bg-green-900' : 'bg-red-900'}`}>
              <div className="text-sm text-gray-300">Usuário</div>
              <div className="text-lg font-bold">{debugData.user ? '✅ Encontrado' : '❌ Não encontrado'}</div>
            </div>
            <div className={`p-3 rounded-lg ${debugData.profile ? 'bg-green-900' : 'bg-red-900'}`}>
              <div className="text-sm text-gray-300">Perfil</div>
              <div className="text-lg font-bold">{debugData.profile ? '✅ Encontrado' : '❌ Não encontrado'}</div>
            </div>
            <div className={`p-3 rounded-lg ${debugData.profile?.role === 'admin' ? 'bg-green-900' : 'bg-yellow-900'}`}>
              <div className="text-sm text-gray-300">Role</div>
              <div className="text-lg font-bold">{debugData.profile?.role || '❓ Não definido'}</div>
            </div>
            <div className={`p-3 rounded-lg ${middlewareHeaders['x-user-role'] === 'admin' ? 'bg-green-900' : 'bg-red-900'}`}>
              <div className="text-sm text-gray-300">Header Role</div>
              <div className="text-lg font-bold">{middlewareHeaders['x-user-role'] || '❌ Não definido'}</div>
            </div>
          </div>
        </div>

        {/* Middleware Headers */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔧 Headers do Middleware</h2>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(middlewareHeaders, null, 2)}
          </pre>
        </div>

        {/* Supabase Cookies */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🍪 Cookies Supabase ({supabaseCookies.length})</h2>
          {supabaseCookies.length > 0 ? (
            <div className="space-y-2">
              {supabaseCookies.map((cookie, index) => (
                <div key={index} className="bg-gray-900 p-2 rounded-lg flex justify-between">
                  <span className="font-mono text-sm">{cookie.name}</span>
                  <span className="text-gray-400 text-sm">
                    {cookie.value ? `${cookie.value.length} chars` : 'empty'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-yellow-400">❌ Nenhum cookie Supabase encontrado</div>
          )}
        </div>

        {/* User Data */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">👤 Dados do Usuário (Server)</h2>
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
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">📝 Dados do Perfil (Server)</h2>
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

        {/* All Debug Data */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">🔍 Dados Completos de Debug</h2>
          <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">🔗 Navegação</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="/debug-auth"
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-center transition-colors"
            >
              🔍 Debug Client
            </a>
            <a
              href="/admin"
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-lg text-center transition-colors"
            >
              🔒 Testar /admin
            </a>
            <a
              href="/auth/login"
              className="bg-green-600 hover:bg-green-700 p-3 rounded-lg text-center transition-colors"
            >
              🔑 Login
            </a>
            <a
              href="/"
              className="bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-center transition-colors"
            >
              🏠 Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}