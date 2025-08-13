/**
 * Sistema de monitoramento para IntersectionObserver consolidado
 * Monitora performance e eficiência da consolidação
 */

import { intersectionObserverManager } from './performanceOptimizer.js';

class ObserverPerformanceMonitor {
  constructor() {
    this.enabled = process.env.NODE_ENV === 'development';
    this.logInterval = 30000; // 30 segundos
    this.intervalId = null;
    this.startTime = Date.now();
  }

  /**
   * Inicializar monitoramento automático
   */
  start() {
    if (!this.enabled) return;

    console.log('🔍 [ObserverMonitor] Iniciando monitoramento de performance...');
    
    // Log inicial
    this.logStats();

    // Monitoramento periódico
    this.intervalId = setInterval(() => {
      this.logStats();
    }, this.logInterval);

    // Log final antes de fechar a página
    window.addEventListener('beforeunload', () => {
      this.stop();
      this.logFinalReport();
    });
  }

  /**
   * Parar monitoramento
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Log das estatísticas atuais
   */
  logStats() {
    if (!this.enabled) return;

    const stats = intersectionObserverManager.getStats();
    
    console.group('📊 [ObserverMonitor] Performance Stats');
    console.log('⏱️  Tempo ativo:', Math.round((Date.now() - this.startTime) / 1000), 's');
    console.table({
      'Total Observers': stats.summary.totalObservers,
      'Total Elements': stats.summary.totalElements,
      'Configurações Únicas': stats.summary.uniqueConfigurations,
      'Elementos/Observer': stats.summary.averageElementsPerObserver,
      'Taxa Consolidação': stats.efficiency.consolidationRatio,
      'Tempo Processamento': stats.efficiency.averageProcessingTime
    });
    
    if (stats.observers.length > 0) {
      console.log('🔍 Detalhes dos Observers:');
      console.table(stats.observers.map(obs => ({
        'Elementos': obs.elementCount,
        'Callbacks': obs.callbackCount,
        'Idade (s)': Math.round(obs.ageMs / 1000),
        'Threshold': obs.options.threshold,
        'RootMargin': obs.options.rootMargin
      })));
    }
    console.groupEnd();
  }

  /**
   * Relatório final de performance
   */
  logFinalReport() {
    if (!this.enabled) return;

    const stats = intersectionObserverManager.getStats();
    const totalTime = Math.round((Date.now() - this.startTime) / 1000);
    
    console.group('🏁 [ObserverMonitor] Relatório Final');
    console.log(`⏱️  Sessão: ${totalTime}s`);
    console.log(`🎯 Eficiência: ${stats.summary.totalObservers} observers para ${stats.summary.uniqueConfigurations} configurações`);
    console.log(`📊 Performance: ${stats.performance.callbackExecutions} callbacks em ${stats.efficiency.averageProcessingTime}`);
    
    // Calcular economia estimada
    const traditionalObservers = stats.summary.totalElements; // 1 observer por elemento
    const actualObservers = stats.summary.totalObservers;
    const reduction = Math.round(((traditionalObservers - actualObservers) / traditionalObservers) * 100);
    
    console.log(`💚 Redução estimada: ${reduction}% menos observers (${traditionalObservers} → ${actualObservers})`);
    console.groupEnd();
  }

  /**
   * Detectar problemas de performance
   */
  detectPerformanceIssues() {
    if (!this.enabled) return;

    const stats = intersectionObserverManager.getStats();
    const issues = [];

    // Verificar processamento lento
    if (stats.performance.averageProcessingTime > 5) {
      issues.push(`⚠️  Processamento lento: ${stats.efficiency.averageProcessingTime}`);
    }

    // Verificar baixa consolidação
    if (parseFloat(stats.efficiency.consolidationRatio) > 0.8) {
      issues.push(`⚠️  Baixa consolidação: ${stats.efficiency.consolidationRatio} (ideal < 0.5)`);
    }

    // Verificar muitos observers
    if (stats.summary.totalObservers > 10) {
      issues.push(`⚠️  Muitos observers: ${stats.summary.totalObservers} (considere otimizar configurações)`);
    }

    if (issues.length > 0) {
      console.group('🚨 [ObserverMonitor] Problemas Detectados');
      issues.forEach(issue => console.warn(issue));
      console.groupEnd();
    }

    return issues;
  }

  /**
   * Benchmark de performance
   */
  benchmark() {
    if (!this.enabled) return;

    const startTime = performance.now();
    const stats = intersectionObserverManager.getStats();
    const endTime = performance.now();

    console.log(`⚡ [ObserverMonitor] Benchmark stats: ${(endTime - startTime).toFixed(2)}ms`);
    
    return {
      duration: endTime - startTime,
      stats
    };
  }
}

// Instância singleton
const observerMonitor = new ObserverPerformanceMonitor();

// Auto-inicializar em desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Aguardar carregamento da página
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => observerMonitor.start(), 1000);
    });
  } else {
    setTimeout(() => observerMonitor.start(), 1000);
  }
}

export default observerMonitor;