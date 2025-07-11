// Página de teste que simula acesso admin para reproduzir erro específico
export const dynamic = 'force-dynamic'

export default function TestAdminErrorPage() {
  return (
    <div className="min-h-screen bg-red-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🚨 Teste Admin Error</h1>
        
        <div className="bg-red-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Objetivo</h2>
          <p className="text-red-100 mb-4">
            Esta página simula a navegação para /admin que está causando o erro headers.split.
            Como esta URL NÃO começa com /admin, não vai trigger a verificação de admin no middleware,
            mas ainda vai executar getUser().
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Teste Comparativo</h2>
          <div className="text-sm text-gray-300">
            <p className="mb-2"><strong>Cenário 1:</strong> /test-middleware (esta página)</p>
            <p className="mb-2">→ Não aciona verificação admin</p>
            <p className="mb-4">→ Só executa getUser() básico</p>
            
            <p className="mb-2"><strong>Cenário 2:</strong> /admin (página real)</p>
            <p className="mb-2">→ Aciona verificação admin no middleware</p>
            <p className="mb-2">→ Faz getUser() + query na tabela users</p>
            <p className="mb-2">→ <span className="text-red-400">AQUI que o erro acontece?</span></p>
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔬 Hipótese de Teste</h2>
          <p className="text-blue-200">
            Se o erro SÓ acontece em rotas /admin/*, então o problema não é no getUser() básico,
            mas sim na combinação getUser() + query da tabela users + verificação de role admin.
          </p>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-900 rounded">
          <p className="text-yellow-200 text-sm">
            💡 Compare os logs desta página com os logs de uma tentativa de acesso real ao /admin
          </p>
        </div>
      </div>
    </div>
  )
}