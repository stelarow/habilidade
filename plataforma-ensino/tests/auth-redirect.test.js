/**
 * 🧪 TESTE DE AUTENTICAÇÃO - Auth Redirect Bug Analysis
 * 
 * Este teste reproduz o problema onde usuários logados conseguem acessar
 * páginas auth/login e auth/register (quando não deveriam).
 * 
 * Cenários testados:
 * 1. Usuário não logado → Deve conseguir acessar auth pages
 * 2. Usuário logado → Deve ser redirecionado das auth pages
 * 3. Logs detalhados para análise do comportamento
 */

const puppeteer = require('puppeteer');

// Configuração do teste
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3001',
  testUser: {
    email: 'admin@escolahabilidade.com.br', // Usar usuário existente do sistema
    password: 'admin123' // Senha padrão que deve estar configurada
  },
  timeout: 15000,
  headless: true, // Executar sem interface gráfica
  slowMo: 500 // Velocidade reduzida para observar comportamento
};

class AuthRedirectTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testId = Math.random().toString(36).substr(2, 9);
  }

  async setup() {
    console.log(`[AUTH-TEST-${this.testId}] 🚀 Iniciando teste de redirecionamento auth...`);
    
    this.browser = await puppeteer.launch({
      headless: TEST_CONFIG.headless,
      slowMo: TEST_CONFIG.slowMo,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    
    // Interceptar logs do console da página
    this.page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();
      
      // Filtrar apenas logs relevantes de autenticação
      if (text.includes('[MIDDLEWARE-') || 
          text.includes('[AUTH-LAYOUT-') || 
          text.includes('[LOGIN-') || 
          text.includes('[REGISTER-')) {
        console.log(`[BROWSER-CONSOLE] ${type.toUpperCase()}: ${text}`);
      }
    });

    // Interceptar erros
    this.page.on('error', (error) => {
      console.error(`[AUTH-TEST-${this.testId}] ❌ Page error:`, error.message);
    });

    await this.page.setViewport({ width: 1280, height: 720 });
    console.log(`[AUTH-TEST-${this.testId}] ✅ Browser setup concluído`);
  }

  async testUnauthenticatedAccess() {
    console.log(`\n[AUTH-TEST-${this.testId}] 📝 TESTE 1: Acesso não autenticado às páginas auth`);
    
    // Teste 1.1: Acessar página de login
    console.log(`[AUTH-TEST-${this.testId}] 🔍 Acessando /auth/login sem autenticação...`);
    await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });
    
    const loginPageUrl = this.page.url();
    const hasLoginForm = await this.page.$('form') !== null;
    
    console.log(`[AUTH-TEST-${this.testId}] 📊 Resultado login page:`, {
      finalUrl: loginPageUrl,
      hasForm: hasLoginForm,
      expected: 'Deve permanecer em /auth/login'
    });

    // Teste 1.2: Acessar página de register
    console.log(`[AUTH-TEST-${this.testId}] 🔍 Acessando /auth/register sem autenticação...`);
    await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/register`, { waitUntil: 'networkidle0' });
    
    const registerPageUrl = this.page.url();
    const hasRegisterForm = await this.page.$('form') !== null;
    
    console.log(`[AUTH-TEST-${this.testId}] 📊 Resultado register page:`, {
      finalUrl: registerPageUrl,
      hasForm: hasRegisterForm,
      expected: 'Deve permanecer em /auth/register'
    });

    return {
      loginAccessible: hasLoginForm && loginPageUrl.includes('/auth/login'),
      registerAccessible: hasRegisterForm && registerPageUrl.includes('/auth/register')
    };
  }

  async performLogin() {
    console.log(`\n[AUTH-TEST-${this.testId}] 🔑 EXECUTANDO LOGIN...`);
    
    await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });
    
    // Preencher formulário de login
    await this.page.type('input[name="email"]', TEST_CONFIG.testUser.email);
    await this.page.type('input[name="password"]', TEST_CONFIG.testUser.password);
    
    console.log(`[AUTH-TEST-${this.testId}] 📝 Formulário preenchido, submetendo...`);
    
    // Submeter e aguardar redirect
    await Promise.all([
      this.page.click('button[type="submit"]'),
      this.page.waitForNavigation({ waitUntil: 'networkidle0', timeout: TEST_CONFIG.timeout })
    ]);

    const postLoginUrl = this.page.url();
    console.log(`[AUTH-TEST-${this.testId}] ✅ Login concluído - URL final: ${postLoginUrl}`);
    
    return {
      success: !postLoginUrl.includes('/auth/login'),
      finalUrl: postLoginUrl
    };
  }

  async testAuthenticatedAccess() {
    console.log(`\n[AUTH-TEST-${this.testId}] 🔒 TESTE 2: Acesso autenticado às páginas auth (PROBLEMA)`);
    
    // Aguardar um momento para garantir que auth state está estabelecido
    await this.page.waitForTimeout(1000);
    
    // Teste 2.1: Tentar acessar login page enquanto logado
    console.log(`[AUTH-TEST-${this.testId}] 🚫 Tentando acessar /auth/login enquanto autenticado...`);
    
    const startTime = Date.now();
    await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/login`, { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    
    const loginUrl = this.page.url();
    const hasLoginForm = await this.page.$('form') !== null;
    
    console.log(`[AUTH-TEST-${this.testId}] 📊 Resultado acesso login autenticado:`, {
      finalUrl: loginUrl,
      hasForm: hasLoginForm,
      loadTime: `${loadTime}ms`,
      expected: 'Deveria redirecionar para /dashboard ou /admin',
      isCorrect: !loginUrl.includes('/auth/login')
    });

    // Aguardar possíveis redirects tardios
    await this.page.waitForTimeout(2000);
    const delayedLoginUrl = this.page.url();
    
    if (delayedLoginUrl !== loginUrl) {
      console.log(`[AUTH-TEST-${this.testId}] 🔄 Redirect tardio detectado: ${loginUrl} → ${delayedLoginUrl}`);
    }

    // Teste 2.2: Tentar acessar register page enquanto logado
    console.log(`[AUTH-TEST-${this.testId}] 🚫 Tentando acessar /auth/register enquanto autenticado...`);
    
    const startTime2 = Date.now();
    await this.page.goto(`${TEST_CONFIG.baseUrl}/auth/register`, { waitUntil: 'networkidle0' });
    const loadTime2 = Date.now() - startTime2;
    
    const registerUrl = this.page.url();
    const hasRegisterForm = await this.page.$('form') !== null;
    
    console.log(`[AUTH-TEST-${this.testId}] 📊 Resultado acesso register autenticado:`, {
      finalUrl: registerUrl,
      hasForm: hasRegisterForm,
      loadTime: `${loadTime2}ms`,
      expected: 'Deveria redirecionar para /dashboard ou /admin',
      isCorrect: !registerUrl.includes('/auth/register')
    });

    // Aguardar possíveis redirects tardios
    await this.page.waitForTimeout(2000);
    const delayedRegisterUrl = this.page.url();
    
    if (delayedRegisterUrl !== registerUrl) {
      console.log(`[AUTH-TEST-${this.testId}] 🔄 Redirect tardio detectado: ${registerUrl} → ${delayedRegisterUrl}`);
    }

    return {
      loginBlocked: !delayedLoginUrl.includes('/auth/login'),
      registerBlocked: !delayedRegisterUrl.includes('/auth/register'),
      finalLoginUrl: delayedLoginUrl,
      finalRegisterUrl: delayedRegisterUrl
    };
  }

  async checkAuthState() {
    console.log(`\n[AUTH-TEST-${this.testId}] 🔍 VERIFICANDO ESTADO DE AUTENTICAÇÃO...`);
    
    // Executar JavaScript no browser para verificar estado Supabase
    const authState = await this.page.evaluate(async () => {
      try {
        // Verificar se Supabase está disponível
        if (typeof window.supabase === 'undefined') {
          // Tentar carregar o cliente Supabase se não estiver disponível
          const { createClient } = await import('/src/lib/supabase/client.js');
          window.supabase = createClient();
        }
        
        const { data: { user }, error } = await window.supabase.auth.getUser();
        const { data: { session } } = await window.supabase.auth.getSession();
        
        return {
          hasUser: !!user,
          userId: user?.id || null,
          userEmail: user?.email || null,
          userRole: user?.user_metadata?.role || 'not_set',
          hasSession: !!session,
          sessionCreated: session?.created_at || null,
          error: error?.message || null
        };
      } catch (e) {
        return {
          error: `Failed to check auth state: ${e.message}`,
          hasUser: false,
          hasSession: false
        };
      }
    });

    console.log(`[AUTH-TEST-${this.testId}] 📊 Estado de autenticação:`, authState);
    return authState;
  }

  async cleanup() {
    console.log(`\n[AUTH-TEST-${this.testId}] 🧹 Limpeza final...`);
    
    if (this.page) {
      await this.page.close();
    }
    
    if (this.browser) {
      await this.browser.close();
    }
    
    console.log(`[AUTH-TEST-${this.testId}] ✅ Cleanup concluído`);
  }

  async runFullTest() {
    try {
      await this.setup();
      
      // Fase 1: Testes sem autenticação
      const unauthResults = await this.testUnauthenticatedAccess();
      
      // Fase 2: Fazer login
      const loginResult = await this.performLogin();
      
      if (!loginResult.success) {
        throw new Error('Login falhou - não é possível continuar testes autenticados');
      }
      
      // Verificar estado de auth após login
      const authState = await this.checkAuthState();
      
      // Fase 3: Testes com autenticação (onde o problema deve aparecer)
      const authResults = await this.testAuthenticatedAccess();
      
      // Relatório final
      const report = {
        testId: this.testId,
        timestamp: new Date().toISOString(),
        unauthenticated: unauthResults,
        login: loginResult,
        authState: authState,
        authenticated: authResults,
        issues: {
          canAccessLoginWhenAuth: !authResults.loginBlocked,
          canAccessRegisterWhenAuth: !authResults.registerBlocked
        }
      };
      
      console.log(`\n[AUTH-TEST-${this.testId}] 📋 RELATÓRIO FINAL:`);
      console.log('='.repeat(60));
      console.log('📊 RESULTADOS DOS TESTES:');
      console.log(`   ✅ Acesso não autenticado funciona: ${unauthResults.loginAccessible && unauthResults.registerAccessible}`);
      console.log(`   ✅ Login bem-sucedido: ${loginResult.success}`);
      console.log(`   ✅ Estado auth válido: ${authState.hasUser && authState.hasSession}`);
      console.log(`   ❌ PROBLEMA - Login acessível quando auth: ${!authResults.loginBlocked}`);
      console.log(`   ❌ PROBLEMA - Register acessível quando auth: ${!authResults.registerBlocked}`);
      console.log('='.repeat(60));
      
      if (report.issues.canAccessLoginWhenAuth || report.issues.canAccessRegisterWhenAuth) {
        console.log('🚨 PROBLEMAS DETECTADOS! Usuários autenticados conseguem acessar páginas auth.');
        console.log('📄 Verifique os logs do console do browser acima para detalhes técnicos.');
      } else {
        console.log('✅ Todos os testes passaram! Redirecionamento funcionando corretamente.');
      }
      
      return report;
      
    } catch (error) {
      console.error(`[AUTH-TEST-${this.testId}] ❌ Erro durante teste:`, error.message);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Executar o teste se chamado diretamente
if (require.main === module) {
  (async () => {
    const tester = new AuthRedirectTester();
    try {
      await tester.runFullTest();
      process.exit(0);
    } catch (error) {
      console.error('❌ Teste falhou:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = AuthRedirectTester;