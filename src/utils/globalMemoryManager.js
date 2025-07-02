/**
 * Sistema global de memory management que funciona com backgrounds antigos
 * Compatível com todos os componentes existentes
 */

class GlobalMemoryManager {
  constructor() {
    this.isActive = true;
    this.setupVisibilityAPI();
    this.setupGlobalCleanup();
    
    // Interceptar todos os requestAnimationFrame globalmente
    this.patchRequestAnimationFrame();
  }

  // API de Visibilidade global
  setupVisibilityAPI() {
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
    const originalRAF = window.requestAnimationFrame;
    const originalCAF = window.cancelAnimationFrame;
    
    // Armazenar animações ativas
    this.activeAnimations = new Set();
    
    window.requestAnimationFrame = (callback) => {
      // Se aba não está ativa, reduzir drasticamente a frequência
      if (!this.isActive) {
        // Executar apenas 1 frame por segundo quando inativo
        return setTimeout(() => {
          if (this.isActive) {
            callback(performance.now());
          }
        }, 1000);
      }
      
      const id = originalRAF.call(window, (timestamp) => {
        this.activeAnimations.delete(id);
        callback(timestamp);
      });
      
      this.activeAnimations.add(id);
      return id;
    };
    
    window.cancelAnimationFrame = (id) => {
      this.activeAnimations.delete(id);
      return originalCAF.call(window, id);
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
    if (window.gc) {
      window.gc();
    }

    // Limpar contextos de canvas órfãos
    this.cleanupCanvasContexts();

    console.log(`[GlobalMemoryManager] Cleanup - Active animations: ${this.activeAnimations.size}`);
  }

  // Limpar contextos de canvas que podem estar órfãos
  cleanupCanvasContexts() {
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
      try {
        const ctx = canvas.getContext('2d');
        if (ctx && canvas.width > 0 && canvas.height > 0) {
          // Verificar se o canvas ainda está na DOM
          if (!document.body.contains(canvas)) {
            // Canvas órfão - limpar
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      } catch (e) {
        // Ignorar erros de contexto
      }
    });
  }

  // Pausar todas as animações ativas
  pauseAllAnimations() {
    this.activeAnimations.forEach(id => {
      window.cancelAnimationFrame(id);
    });
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

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    globalMemoryManager = new GlobalMemoryManager();
  });
} else {
  globalMemoryManager = new GlobalMemoryManager();
}

// Expor globalmente para debug
window.globalMemoryManager = globalMemoryManager;

export default globalMemoryManager; 