// Página de teste para isolar componentes admin que causam headers.split error
export const dynamic = 'force-dynamic'

export default function TestAdminIsolationPage() {
  return (
    <div className="min-h-screen bg-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔬 Isolamento de Componentes Admin</h1>
        
        <div className="bg-purple-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Estratégia de Teste</h2>
          <p className="text-purple-100 mb-4">
            Como o erro começou após a simplificação das páginas admin, vamos testar cada componente 
            individualmente para identificar qual está causando o headers.split error.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📋 Páginas Admin a Testar</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ <a href="/test-admin-dashboard" className="text-blue-400 hover:underline">/admin (dashboard)</a></li>
              <li>✅ <a href="/test-admin-users" className="text-blue-400 hover:underline">/admin/users</a></li>
              <li>✅ <a href="/test-admin-courses" className="text-blue-400 hover:underline">/admin/courses</a></li>
              <li>✅ <a href="/test-admin-enrollments" className="text-blue-400 hover:underline">/admin/enrollments</a></li>
              <li>✅ <a href="/test-admin-categories" className="text-blue-400 hover:underline">/admin/categories</a></li>
              <li>✅ <a href="/test-admin-profile" className="text-blue-400 hover:underline">/admin/profile</a></li>
              <li>✅ <a href="/test-admin-settings" className="text-blue-400 hover:underline">/admin/settings</a></li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🕵️ Componentes a Verificar</h3>
            <ul className="space-y-2 text-sm">
              <li>🔍 AdminLayout.tsx</li>
              <li>🔍 AdminHeader.tsx</li>
              <li>🔍 AdminSidebar.tsx</li>
              <li>🔍 getCurrentUser() calls</li>
              <li>🔍 createClient() usage</li>
              <li>🔍 Supabase queries</li>
              <li>🔍 Permission checks</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-900 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-4">⚠️ Hipóteses</h3>
          <ul className="space-y-2 text-sm text-red-200">
            <li>1. <strong>getCurrentUser()</strong> nas páginas admin pode estar criando cliente Supabase extra</li>
            <li>2. <strong>AdminLayout</strong> pode estar fazendo auth check mesmo após simplificação</li>
            <li>3. <strong>Componentes admin</strong> podem ter imports órfãos de Supabase</li>
            <li>4. <strong>Permission checks</strong> podem estar fazendo queries simultâneas</li>
          </ul>
        </div>

        <div className="bg-blue-900 p-6 rounded-lg mt-6">
          <h3 className="text-lg font-semibold mb-4">📊 Logs a Monitorar</h3>
          <div className="text-sm text-blue-200">
            <p><strong>Sucesso esperado:</strong> Página carrega sem [SERVER_CLIENT] logs excessivos</p>
            <p><strong>Falha esperada:</strong> [SERVER_CLIENT] logs seguidos de TypeError: t.headers.split</p>
            <p><strong>Pista chave:</strong> Qual página admin específica dispara o erro primeiro</p>
          </div>
        </div>
      </div>
    </div>
  )
}