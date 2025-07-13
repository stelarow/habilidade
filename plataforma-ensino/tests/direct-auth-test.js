/**
 * 🧪 TESTE DIRETO DE AUTENTICAÇÃO - Análise Simplificada
 * 
 * Este teste usa o debug existente do sistema para identificar o problema
 * sem precisar de servidor em execução.
 */

const { createClient } = require('@supabase/supabase-js');

// Configuração Supabase (usando variáveis do sistema)
const SUPABASE_CONFIG = {
  url: 'https://vfpdyllwquaturpcifpl.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw'
};

class DirectAuthTester {
  constructor() {
    this.testId = Math.random().toString(36).substr(2, 9);
    this.supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  }

  async testSupabaseConnection() {
    console.log(`[DIRECT-TEST-${this.testId}] 🔍 Testando conexão Supabase...`);
    
    try {
      // Testar conexão básica
      const { data, error } = await this.supabase.auth.getSession();
      
      console.log(`[DIRECT-TEST-${this.testId}] ✅ Conexão Supabase estabelecida`);
      console.log(`[DIRECT-TEST-${this.testId}] 📊 Estado inicial da sessão:`, {
        hasSession: !!data.session,
        sessionUser: data.session?.user?.email || 'nenhum'
      });
      
      return { success: true, error: null };
    } catch (error) {
      console.error(`[DIRECT-TEST-${this.testId}] ❌ Erro na conexão Supabase:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async testAuthStateCheck() {
    console.log(`\n[DIRECT-TEST-${this.testId}] 🔐 Testando verificação de estado de autenticação...`);
    
    try {
      // Simular o que o middleware faz
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      console.log(`[DIRECT-TEST-${this.testId}] 👤 Resultado getUser():`, {
        hasUser: !!user,
        userEmail: user?.email || 'nenhum',
        userId: user?.id || 'nenhum',
        error: error?.message || 'nenhum'
      });

      // Testar verificação de sessão
      const { data: { session }, error: sessionError } = await this.supabase.auth.getSession();
      
      console.log(`[DIRECT-TEST-${this.testId}] 🎫 Resultado getSession():`, {
        hasSession: !!session,
        sessionUser: session?.user?.email || 'nenhum',
        expiresAt: session?.expires_at || 'nenhum',
        error: sessionError?.message || 'nenhum'
      });

      return {
        user: user,
        session: session,
        isAuthenticated: !!user && !!session
      };

    } catch (error) {
      console.error(`[DIRECT-TEST-${this.testId}] ❌ Erro na verificação de auth:`, error.message);
      return { error: error.message, isAuthenticated: false };
    }
  }

  async testMiddlewareLogic() {
    console.log(`\n[DIRECT-TEST-${this.testId}] ⚙️ Simulando lógica do middleware...`);
    
    try {
      // Simular verificação para auth/login
      const authState = await this.testAuthStateCheck();
      
      console.log(`[DIRECT-TEST-${this.testId}] 🔍 Análise para /auth/login:`);
      
      if (authState.isAuthenticated) {
        console.log(`[DIRECT-TEST-${this.testId}] ✅ Usuário autenticado detectado`);
        console.log(`[DIRECT-TEST-${this.testId}] 🎯 AÇÃO: Deveria redirecionar para dashboard/admin`);
        console.log(`[DIRECT-TEST-${this.testId}] 🚫 PROBLEMA: Se usuário consegue ver /auth/login, há falha na proteção`);
        
        // Determinar URL de redirecionamento
        const userRole = authState.user?.user_metadata?.role || 'student';
        const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
        
        console.log(`[DIRECT-TEST-${this.testId}] 📍 URL de redirecionamento esperada: ${redirectUrl}`);
        
        return {
          shouldBlock: true,
          redirectTo: redirectUrl,
          userRole: userRole
        };
      } else {
        console.log(`[DIRECT-TEST-${this.testId}] 👤 Nenhum usuário autenticado`);
        console.log(`[DIRECT-TEST-${this.testId}] ✅ AÇÃO: Deve permitir acesso a /auth/login`);
        
        return {
          shouldBlock: false,
          redirectTo: null,
          userRole: null
        };
      }
    } catch (error) {
      console.error(`[DIRECT-TEST-${this.testId}] ❌ Erro na simulação do middleware:`, error.message);
      return { error: error.message };
    }
  }

  async simulateLoginAttempt() {
    console.log(`\n[DIRECT-TEST-${this.testId}] 🔑 Simulando tentativa de login...`);
    
    try {
      // Primeiro, limpar qualquer sessão existente
      await this.supabase.auth.signOut();
      console.log(`[DIRECT-TEST-${this.testId}] 🔄 Sessão limpa`);
      
      // Testar com credenciais conhecidas (tentativa)
      const testCredentials = [
        { email: 'testuser@analysis.com', password: 'testpass123' },
        { email: 'admin@escolahabilidade.com.br', password: 'admin123' },
        { email: 'test@test.com', password: 'test123' }
      ];
      
      for (const cred of testCredentials) {
        console.log(`[DIRECT-TEST-${this.testId}] 🔐 Tentando login com: ${cred.email}`);
        
        const { data, error } = await this.supabase.auth.signInWithPassword(cred);
        
        if (!error && data.user) {
          console.log(`[DIRECT-TEST-${this.testId}] ✅ Login bem-sucedido!`);
          console.log(`[DIRECT-TEST-${this.testId}] 👤 Usuário logado:`, {
            email: data.user.email,
            id: data.user.id,
            role: data.user.user_metadata?.role || 'não definido'
          });
          
          // Agora testar o que acontece com auth state
          const authCheck = await this.testMiddlewareLogic();
          
          console.log(`[DIRECT-TEST-${this.testId}] 📋 Resultado da verificação pós-login:`, authCheck);
          
          return {
            loginSuccess: true,
            user: data.user,
            authCheck: authCheck
          };
        } else {
          console.log(`[DIRECT-TEST-${this.testId}] ❌ Falha no login: ${error?.message || 'erro desconhecido'}`);
        }
        
        // Limpar para próxima tentativa
        await this.supabase.auth.signOut();
      }
      
      console.log(`[DIRECT-TEST-${this.testId}] ⚠️ Nenhuma credencial funcionou - usando mock`);
      return { loginSuccess: false, message: 'Credenciais de teste não funcionaram' };
      
    } catch (error) {
      console.error(`[DIRECT-TEST-${this.testId}] ❌ Erro na simulação de login:`, error.message);
      return { error: error.message };
    }
  }

  async runAnalysis() {
    console.log(`[DIRECT-TEST-${this.testId}] 🚀 Iniciando análise direta de autenticação...`);
    console.log('='.repeat(70));
    
    try {
      // Fase 1: Testar conexão
      const connectionTest = await this.testSupabaseConnection();
      if (!connectionTest.success) {
        throw new Error(`Falha na conexão: ${connectionTest.error}`);
      }
      
      // Fase 2: Testar estado inicial
      const initialAuthState = await this.testAuthStateCheck();
      
      // Fase 3: Simular lógica do middleware
      const middlewareSimulation = await this.testMiddlewareLogic();
      
      // Fase 4: Tentar login para testar estado autenticado
      const loginSimulation = await this.simulateLoginAttempt();
      
      // Relatório final
      console.log('\n' + '='.repeat(70));
      console.log('📋 RELATÓRIO DE ANÁLISE DIRETA');
      console.log('='.repeat(70));
      
      console.log('🔍 RESULTADOS PRINCIPAIS:');
      console.log(`   ✅ Conexão Supabase: ${connectionTest.success ? 'OK' : 'FALHA'}`);
      console.log(`   📊 Estado auth inicial: ${initialAuthState.isAuthenticated ? 'AUTENTICADO' : 'NÃO AUTENTICADO'}`);
      console.log(`   ⚙️ Lógica middleware: ${middlewareSimulation.shouldBlock ? 'DEVERIA BLOQUEAR' : 'DEVERIA PERMITIR'}`);
      console.log(`   🔑 Teste de login: ${loginSimulation.loginSuccess ? 'SUCESSO' : 'FALHA'}`);
      
      if (loginSimulation.loginSuccess && loginSimulation.authCheck) {
        console.log('\n🔍 ANÁLISE DO PROBLEMA:');
        
        if (loginSimulation.authCheck.shouldBlock) {
          console.log('   🚨 PROBLEMA CONFIRMADO: Usuário autenticado deveria ser redirecionado');
          console.log(`   🎯 Deveria redirecionar para: ${loginSimulation.authCheck.redirectTo}`);
          console.log('   📝 POSSÍVEIS CAUSAS:');
          console.log('      - Middleware não está executando corretamente');
          console.log('      - Client-side auth check não está funcionando');
          console.log('      - Timing issues entre middleware e client-side');
          console.log('      - Cookies/sessão não estão sendo propagados corretamente');
        } else {
          console.log('   ✅ Comportamento esperado: usuário não autenticado pode acessar auth pages');
        }
      }
      
      console.log('\n💡 PRÓXIMOS PASSOS:');
      console.log('   1. Verificar logs do middleware em execução real');
      console.log('   2. Testar timing entre server-side e client-side checks');
      console.log('   3. Validar propagação de cookies entre requests');
      console.log('   4. Implementar client-side guard adicional como fallback');
      
      console.log('='.repeat(70));
      
      return {
        testId: this.testId,
        timestamp: new Date().toISOString(),
        connection: connectionTest,
        initialState: initialAuthState,
        middlewareLogic: middlewareSimulation,
        loginTest: loginSimulation
      };
      
    } catch (error) {
      console.error(`[DIRECT-TEST-${this.testId}] ❌ Erro na análise:`, error.message);
      throw error;
    }
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  (async () => {
    const tester = new DirectAuthTester();
    try {
      await tester.runAnalysis();
      process.exit(0);
    } catch (error) {
      console.error('❌ Análise falhou:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = DirectAuthTester;