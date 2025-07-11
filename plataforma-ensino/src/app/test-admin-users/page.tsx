// Teste isolado da página admin users
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, requirePermission } from '@/lib/auth/permissions'

export const dynamic = 'force-dynamic'

export default async function TestAdminUsersPage() {
  console.log('[TEST-ADMIN-USERS] 1. Iniciando página users')
  
  const supabase = createClient()
  console.log('[TEST-ADMIN-USERS] 2. Cliente Supabase criado')
  
  let currentUser = null
  let users: any[] = []
  let error = null

  try {
    console.log('[TEST-ADMIN-USERS] 3. Chamando getCurrentUser...')
    currentUser = await getCurrentUser()
    console.log('[TEST-ADMIN-USERS] 4. getCurrentUser retornou:', currentUser ? 'usuário encontrado' : 'usuário não encontrado')
    
    console.log('[TEST-ADMIN-USERS] 5. Verificando permissões...')
    requirePermission(currentUser, 'admin.users.view')
    console.log('[TEST-ADMIN-USERS] 6. Permissões OK')

    console.log('[TEST-ADMIN-USERS] 7. Buscando usuários...')
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('[TEST-ADMIN-USERS] Erro ao buscar usuários:', usersError)
      error = usersError.message
    } else {
      users = usersData || []
      console.log('[TEST-ADMIN-USERS] 8. Usuários carregados:', users.length)
    }
    
  } catch (err: any) {
    console.error('[TEST-ADMIN-USERS] ERRO durante execução:', err)
    error = err.message
  }

  console.log('[TEST-ADMIN-USERS] 9. Renderizando página')

  return (
    <div className="min-h-screen bg-green-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">👥 Teste Admin Users</h1>
        
        {error ? (
          <div className="bg-red-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">❌ Erro Encontrado</h2>
            <p className="text-red-200">{error}</p>
          </div>
        ) : (
          <div className="bg-green-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">✅ Teste Bem-sucedido</h2>
            <p className="text-green-200">
              Página users carregada com sucesso. getCurrentUser() e permissões funcionaram.
            </p>
            <div className="mt-4 text-sm text-green-300">
              <p>Usuário atual: {currentUser ? currentUser.email : 'Nenhum'}</p>
              <p>Usuários carregados: {users.length}</p>
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔍 Componentes Testados</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✅ createClient() do server.ts</li>
            <li>✅ getCurrentUser() do permissions.ts</li>
            <li>✅ requirePermission() check</li>
            <li>✅ Query na tabela users</li>
            <li>✅ Processamento de dados</li>
          </ul>
        </div>

        {users.length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">📋 Usuários (Primeiros 5)</h2>
            <div className="space-y-2">
              {users.slice(0, 5).map((user, index) => (
                <div key={user.id} className="bg-gray-700 p-3 rounded text-sm">
                  {user.email} - {user.role} - {new Date(user.created_at).toLocaleDateString()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}