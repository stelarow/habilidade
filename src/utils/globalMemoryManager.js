/**
 * Sistema global de memory management que funciona com backgrounds antigos
 * Compatível com todos os componentes existentes
 */

class GlobalMemoryManager {
  constructor() {
    this.isActive = true;
    
    // Only setup browser APIs if we're in a browser environment
    if (globalThis.window !== undefined && typeof document !== 'undefined') {
      this.setupVisibilityAPI();
      this.setupGlobalCleanup();
      
      // Interceptar todos os requestAnimationFrame globalmente
      this.patchRequestAnimationFrame();
    }
  }

  // API de Visibilidade global
  setupVisibilityAPI() {
    // Guard against server-side rendering
    if (typeof document === 'undefined') {
      console.warn('[GlobalMemoryManager] Skipping visibility API setup - running in SSR environment');
      return;
    }

    let isTabActive = true;

    const handleVisibilityChange = () => {
      const wasActive = isTabActive;
      isTabActive = !document.hidden;
      
      if (!isTabActive && wasActive) {
        console.log('[GlobalMemoryManager] Tab inactive - reducing performance');
        this.isActive = false;
      } else if (isTabActive && !wasActive) {
        console.log('[GlobalMemoryManager] Tab active - restoring performance');
        this.isActive = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // Patch global do requestAnimationFrame
  patchRequestAnimationFrame() {
    const originalRAF = globalThis.requestAnimationFrame;
    const originalCAF = globalThis.cancelAnimationFrame;
    
    // Armazenar animações ativas
    this.activeAnimations = new Set();
    
    globalThis.requestAnimationFrame = (callback) => {
      // Se aba não está ativa, reduzir drasticamente a frequência
      if (!this.isActive) {
        // Executar apenas 1 frame por segundo quando inativo
        return setTimeout(() => {
          if (this.isActive) {
            callback(performance.now());
          }
        }, 1000);
      }
      
      const id = originalRAF.call(globalThis, (timestamp) => {
        this.activeAnimations.delete(id);
        callback(timestamp);
      });
      
      this.activeAnimations.add(id);
      return id;
    };
    
    globalThis.cancelAnimationFrame = (id) => {
      this.activeAnimations.delete(id);
      return originalCAF.call(globalThis, id);
    };
  }

  // Limpeza global periódica
  setupGlobalCleanup() {
    // Limpeza a cada 2 minutos
    setInterval(() => {
      this.performCleanup();
    }, 2 * 60 * 1000);
  }

  // Executar limpeza de emergência
  performCleanup() {
    // Forçar garbage collection se disponível
    if (globalThis.gc) {
      globalThis.gc();
    }

    // Limpar contextos de canvas órfãos
    this.cleanupCanvasContexts();

    console.log(`[GlobalMemoryManager] Cleanup - Active animations: ${this.activeAnimations.size}`);
  }

  // Limpar contextos de canvas que podem estar órfãos
  cleanupCanvasContexts() {
    const canvases = document.querySelectorAll('canvas');
    for (const canvas of canvases) {
      try {
        const context = canvas.getContext('2d');
        if (context && canvas.width > 0 && canvas.height > 0 && // Verificar se o canvas ainda está na DOM
          !document.body.contains(canvas)) {
            // Canvas órfão - limpar
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
      } catch {
        // Ignorar erros de contexto
      }
    }
  }

  // Pausar todas as animações ativas
  pauseAllAnimations() {
    for (const id of this.activeAnimations) {
      globalThis.cancelAnimationFrame(id);
    }
    this.activeAnimations.clear();
  }

  // Obter estatísticas
  getStats() {
    const memoryInfo = ('memory' in performance) ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    } : { used: 'N/A', total: 'N/A', limit: 'N/A' };

    return {
      isActive: this.isActive,
      activeAnimations: this.activeAnimations.size,
      memory: memoryInfo,
      isTabVisible: !document.hidden
    };
  }
}

// Inicializar automaticamente quando o módulo é carregado
let globalMemoryManager;

// Only initialize in browser environment
if (globalThis.window !== undefined && typeof document !== 'undefined') {
  // Aguardar DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      globalMemoryManager = new GlobalMemoryManager();
    });
  } else {
    globalMemoryManager = new GlobalMemoryManager();
  }

  // Expor globalmente para debug
  globalThis.globalMemoryManager = globalMemoryManager;
} else {
  // Create a minimal instance for SSR environments
  globalMemoryManager = {
    isActive: true,
    activeAnimations: new Set(),
    getStats: () => ({ isActive: true, activeAnimations: 0, memory: { used: 'N/A', total: 'N/A', limit: 'N/A' }, isTabVisible: true })
  };
}

export default globalMemoryManager; 