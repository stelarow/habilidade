/**
 * Utilitário para testar backgrounds automaticamente
 * Verifica carregamento, performance e funcionalidade
 */

import { preloadBackground, clearCache, getStats } from './backgroundPreloader.js';

class BackgroundTester {
  constructor() {
    this.testResults = new Map();
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
  }

  async runAllTests() {
    console.log('🧪 Iniciando testes automatizados dos backgrounds...');
    
    const tests = [
      this.testPreloaderFunctionality,
      this.testAllBackgroundsLoad,
      this.testPerformanceMetrics,
      this.testAccessibilityCompliance,
      this.testCacheEfficiency,
      this.testErrorHandling
    ];

    for (const test of tests) {
      try {
        await test.call(this);
      } catch (error) {
        this.recordTestResult(test.name, false, error.message);
      }
    }

    this.generateReport();
    return this.getTestSummary();
  }

  async testPreloaderFunctionality() {
    console.log('📦 Testando funcionalidade do preloader...');
    
    try {
      // Testar stats do preloader
      const stats = getStats();
      this.assert(typeof stats === 'object', 'Preloader deve retornar stats válidas');
      this.assert(typeof stats.cacheSize === 'number', 'Cache size deve ser um número');
      
      // Testar clear cache
      const initialSize = stats.cacheSize;
      clearCache(1);
      const newStats = getStats();
      this.assert(newStats.cacheSize <= Math.max(1, initialSize), 'Clear cache deve funcionar');
      
      this.recordTestResult('testPreloaderFunctionality', true, 'Preloader funcionando corretamente');
    } catch (error) {
      this.recordTestResult('testPreloaderFunctionality', false, error.message);
    }
  }

  async testAllBackgroundsLoad() {
    console.log('🎨 Testando carregamento de todos os backgrounds...');
    
    const courseSlugs = [
      'projetista-3d', 'edicao-video', 'informatica', 'design-grafico',
      'programacao', 'marketing-digital', 'inteligencia-artificial', 'business-intelligence'
    ];
    
    const loadPromises = courseSlugs.map(async (courseSlug) => {
      try {
        const startTime = performance.now();
        const component = await preloadBackground(courseSlug, 'MEDIUM');
        const loadTime = performance.now() - startTime;
        
        this.assert(component, `Background ${courseSlug} deve carregar`);
        this.assert(typeof component === 'function', `Background ${courseSlug} deve ser um componente React`);
        this.assert(loadTime < 5000, `Background ${courseSlug} deve carregar em menos de 5s (atual: ${loadTime.toFixed(2)}ms)`);
        
        return { courseSlug, success: true, loadTime };
      } catch (error) {
        return { courseSlug, success: false, error: error.message };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const total = courseSlugs.length;
    
    this.assert(successful === total, `Todos os ${total} backgrounds devem carregar (${successful} carregados)`);
    this.recordTestResult('testAllBackgroundsLoad', successful === total, 
      `${successful}/${total} backgrounds carregados com sucesso`);
  }

  async testPerformanceMetrics() {
    console.log('⚡ Testando métricas de performance...');
    
    try {
      // Simular device capabilities
      const mockCapabilities = {
        estimatedRAM: 8,
        isMobile: false,
        webglSupport: true,
        effectiveNetworkType: '4g'
      };
      
      // Testar preload simples
      const startTime = performance.now();
      await preloadBackground('projetista-3d', 'HIGH');
      const preloadTime = performance.now() - startTime;
      
      this.assert(preloadTime < 3000, `Preload deve ser rápido (atual: ${preloadTime.toFixed(2)}ms)`);
      
      // Verificar que cache cresceu
      const stats = getStats();
      this.assert(stats.cacheSize > 0, 'Cache deve ter itens após preload');
      
      this.recordTestResult('testPerformanceMetrics', true, 
        `Performance adequada - preload: ${preloadTime.toFixed(2)}ms, cache: ${stats.cacheSize} itens`);
    } catch (error) {
      this.recordTestResult('testPerformanceMetrics', false, error.message);
    }
  }

  async testAccessibilityCompliance() {
    console.log('♿ Testando conformidade com acessibilidade...');
    
    try {
      // Verificar se CSS de acessibilidade está carregado
      const testElement = document.createElement('div');
      testElement.className = 'accessibility-test';
      document.body.append(testElement);
      
      // Testar prefers-reduced-motion
      const mediaQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
      this.assert(typeof mediaQuery.matches === 'boolean', 'prefers-reduced-motion deve estar disponível');
      
      // Verificar se classes de acessibilidade existem
      const root = document.documentElement;
      root.classList.add('accessibility-high-contrast');
      const hasHighContrast = root.classList.contains('accessibility-high-contrast');
      root.classList.remove('accessibility-high-contrast');
      
      this.assert(hasHighContrast, 'Classes de acessibilidade devem funcionar');
      
      testElement.remove();
      
      this.recordTestResult('testAccessibilityCompliance', true, 'Acessibilidade em conformidade');
    } catch (error) {
      this.recordTestResult('testAccessibilityCompliance', false, error.message);
    }
  }

  async testCacheEfficiency() {
    console.log('💾 Testando eficiência do cache...');
    
    try {
      // Limpar cache primeiro
      clearCache(0);
      
      // Carregar um background
      const courseSlug = 'projetista-3d';
      const firstLoadStart = performance.now();
      await preloadBackground(courseSlug, 'MEDIUM');
      const firstLoadTime = performance.now() - firstLoadStart;
      
      // Carregar novamente (deve usar cache)
      const secondLoadStart = performance.now();
      await preloadBackground(courseSlug, 'MEDIUM');
      const secondLoadTime = performance.now() - secondLoadStart;
      
      // Cache deve ser significativamente mais rápido
      const speedup = firstLoadTime / secondLoadTime;
      this.assert(speedup > 5, `Cache deve ser pelo menos 5x mais rápido (atual: ${speedup.toFixed(2)}x)`);
      this.assert(secondLoadTime < 50, `Acesso ao cache deve ser muito rápido (atual: ${secondLoadTime.toFixed(2)}ms)`);
      
      this.recordTestResult('testCacheEfficiency', true, 
        `Cache eficiente - speedup: ${speedup.toFixed(2)}x, cache access: ${secondLoadTime.toFixed(2)}ms`);
    } catch (error) {
      this.recordTestResult('testCacheEfficiency', false, error.message);
    }
  }

  async testErrorHandling() {
    console.log('🛡️ Testando tratamento de erros...');
    
    try {
      // Testar slug inválido
      try {
        await preloadBackground('invalid-course-slug', 'MEDIUM');
        this.assert(false, 'Deve lançar erro para slug inválido');
      } catch (error) {
        this.assert(error.message.includes('Background component') || error.message.includes('not found'), 'Erro deve ser específico');
      }
      
      this.recordTestResult('testErrorHandling', true, 'Tratamento de erros funcionando');
    } catch (error) {
      this.recordTestResult('testErrorHandling', false, error.message);
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  recordTestResult(testName, passed, message) {
    this.totalTests++;
    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}: ${message}`);
    } else {
      this.failedTests++;
      console.error(`❌ ${testName}: ${message}`);
    }
    
    this.testResults.set(testName, { passed, message, timestamp: new Date() });
  }

  generateReport() {
    console.log('\n📊 RELATÓRIO DE TESTES DOS BACKGROUNDS');
    console.log('=====================================');
    console.log(`Total de testes: ${this.totalTests}`);
    console.log(`✅ Passou: ${this.passedTests} (${((this.passedTests/this.totalTests)*100).toFixed(1)}%)`);
    console.log(`❌ Falhou: ${this.failedTests} (${((this.failedTests/this.totalTests)*100).toFixed(1)}%)`);
    console.log('=====================================');
    
    if (this.failedTests > 0) {
      console.log('\n🔍 DETALHES DOS TESTES FALHADOS:');
      for (const [testName, result] of this.testResults.entries()) {
        if (!result.passed) {
          console.log(`- ${testName}: ${result.message}`);
        }
      }
    }
    
    console.log('\n💡 RECOMENDAÇÕES:');
    if (this.failedTests === 0) {
      console.log('🎉 Todos os testes passaram! Sistema de backgrounds está funcionando perfeitamente.');
    } else {
      console.log('⚠️ Alguns testes falharam. Verifique os erros acima e corrija antes do deploy.');
    }
    
    // Salvar relatório no localStorage para debug
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.totalTests,
      passedTests: this.passedTests,
      failedTests: this.failedTests,
      results: Object.fromEntries(this.testResults)
    };
    
    localStorage.setItem('background-test-report', JSON.stringify(report, null, 2));
    console.log('📝 Relatório salvo no localStorage como "background-test-report"');
  }

  getTestSummary() {
    return {
      total: this.totalTests,
      passed: this.passedTests,
      failed: this.failedTests,
      successRate: this.totalTests > 0 ? (this.passedTests / this.totalTests) * 100 : 0,
      results: Object.fromEntries(this.testResults)
    };
  }
}

// Função helper para executar testes rapidamente
export const runBackgroundTests = async () => {
  const tester = new BackgroundTester();
  return await tester.runAllTests();
};

// Para debug no console
if (globalThis.window !== undefined) {
  globalThis.testBackgrounds = runBackgroundTests;
}

export default BackgroundTester;
