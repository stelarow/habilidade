'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';

export default function TestSupabasePage() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        
        // Teste 1: Verificar variáveis de ambiente
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          throw new Error('Variáveis de ambiente do Supabase não configuradas');
        }

        // Teste 2: Consulta simples para testar conexão
        const { error: simpleError } = await supabase
          .from('categories')
          .select('*')
          .limit(1);

        if (simpleError && simpleError.code !== 'PGRST116') {
          console.error('Erro na consulta simples:', simpleError);
          throw new Error(`Erro na consulta: ${simpleError.message}`);
        }

        // Teste 3: Verificar tabelas principais
        const { data: tables, error: tablesError } = await supabase
          .from('categories')
          .select('*')
          .limit(1);

        if (tablesError && tablesError.code !== 'PGRST116') {
          console.error('Erro ao verificar tabelas:', tablesError);
          // Não vamos falhar aqui, pois pode ser apenas uma tabela vazia
        }

        // Teste 4: Verificar auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        setConnectionInfo({
          url: url,
          hasKey: !!key,
          tablesAccessible: !tablesError || tablesError.code === 'PGRST116',
          authWorking: !authError,
          user: user,
          timestamp: new Date().toISOString()
        });

        setStatus('connected');
        
      } catch (err: any) {
        console.error('Erro no teste:', err);
        setError(err.message);
        setStatus('error');
      }
    }

    testConnection();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            🔄 Testando Conexão Supabase
          </h1>
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="animate-pulse">Conectando...</div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            🧪 Teste de Conexão Supabase
          </h1>
          
          <div className="bg-red-900/50 border border-red-600 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              ❌ Erro de Conexão
            </h2>
            <p className="text-red-300 mb-4">{error}</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
              📋 Próximos Passos:
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Configurar variáveis de ambiente no arquivo .env.local</li>
              <li>• Criar projeto no Supabase</li>
              <li>• Executar o schema do banco de dados</li>
              <li>• Configurar as credenciais corretamente</li>
            </ul>
          </div>

          <div className="bg-blue-900/30 border border-blue-600 p-4 rounded-lg mt-6">
            <p className="text-blue-300 text-sm">
              💡 Esta página testa a conectividade básica com o Supabase. Acesse: <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:3001/test-supabase</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          🧪 Teste de Conexão Supabase
        </h1>
        
        <div className="bg-green-900/50 border border-green-600 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
            ✅ Conexão Estabelecida
          </h2>
          <p className="text-green-300">Supabase está conectado e funcionando corretamente!</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-4">📊 Informações da Conexão:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">URL do Projeto:</span>
              <span className="text-green-400 font-mono">{connectionInfo?.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Chave Configurada:</span>
              <span className="text-green-400">{connectionInfo?.hasKey ? '✅ Sim' : '❌ Não'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tabelas Acessíveis:</span>
              <span className="text-green-400">{connectionInfo?.tablesAccessible ? '✅ Sim' : '❌ Não'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Autenticação:</span>
              <span className="text-green-400">{connectionInfo?.authWorking ? '✅ Funcionando' : '❌ Erro'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Usuário Logado:</span>
              <span className="text-gray-400">{connectionInfo?.user ? '✅ Sim' : '❌ Não'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp:</span>
              <span className="text-gray-300 font-mono text-xs">{connectionInfo?.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-600 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
            🚀 Próximos Passos:
          </h3>
          <ul className="space-y-2 text-blue-300">
            <li>• ✅ <strong>Banco configurado</strong> - Schema completo aplicado</li>
            <li>• 🔐 <strong>Implementar autenticação</strong> - Login/registro funcional</li>
            <li>• 📊 <strong>Dashboard</strong> - Interface de administração</li>
            <li>• 📚 <strong>Conteúdo</strong> - Adicionar cursos e dados</li>
            <li>• 🎥 <strong>Video Player</strong> - Integração com React Player</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
          >
            🏠 Voltar para Home
          </a>
        </div>
      </div>
    </div>
  );
} 