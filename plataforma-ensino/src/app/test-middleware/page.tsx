// Página de teste para reproduzir erro do middleware
export const dynamic = 'force-dynamic'

export default function TestMiddlewarePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Teste de Middleware</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Instruções</h2>
          <p className="text-gray-300 mb-4">
            Esta página força a execução do middleware com logs detalhados.
            Monitore os logs do Netlify para ver exatamente onde o erro acontece.
          </p>
          <div className="text-sm text-gray-400">
            <p><strong>Logs esperados se o middleware funcionar:</strong></p>
            <ul className="list-disc ml-6 mt-2">
              <li>[LOG-TEST] 1. Entrando em updateSession</li>
              <li>[LOG-TEST] 2. supabaseResponse inicializado</li>
              <li>[LOG-TEST] 3. Cliente Supabase criado</li>
              <li>[LOG-TEST] 4. SUCESSO ao chamar getUser()</li>
              <li>[LOG-TEST] 5-9. Fluxo completo</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-900 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">⚠️ Logs esperados se houver erro</h2>
          <div className="text-sm text-red-200">
            <p><strong>Se a tese estiver correta, veremos apenas:</strong></p>
            <ul className="list-disc ml-6 mt-2">
              <li>[LOG-TEST] 1. Entrando em updateSession</li>
              <li>[LOG-TEST] 2. supabaseResponse inicializado</li>
              <li>[LOG-TEST] 3. Cliente Supabase criado</li>
              <li><strong>TypeError: t.headers.split is not a function</strong></li>
            </ul>
            <p className="mt-2 text-red-300">
              Sem logs 4-9 = confirmação da tese
            </p>
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔍 Status da Página</h2>
          <p className="text-blue-200">
            ✅ Página carregada com sucesso<br/>
            ✅ Middleware executado<br/>
            ✅ Logs ativados<br/>
            ⏳ Aguardando análise dos logs...
          </p>
        </div>
      </div>
    </div>
  )
}