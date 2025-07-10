/**
 * Sistema de gerenciamento de memória para prevenir vazamentos
 * Monitora e limita uso de recursos das animações
 */

class MemoryManager {
  constructor() {
    this.activeAnimations = new Set();
    this.eventListeners = new Map();
    this.canvasContexts = new Set();
    this.timers = new Set();
    this.isTabActive = true;
    this.memoryThreshold = 100 * 1024 * 1024; // 100MB
    
    this.setupVisibilityAPI();
    this.setupMemoryMonitoring();
  }

  // API de Visibilidade - pausa animações quando aba não está ativa
  setupVisibilityAPI() {
    const handleVisibilityChange = () => {
      this.isTabActive = !document.hidden;
      
      if (!this.isTabActive) {
        this.pauseAllAnimations();
        console.log('[MemoryManager] Tab inactive - animations paused');
      } else {
        this.resumeAllAnimations();
        console.log('[MemoryManager] Tab active - animations resumed');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.eventListeners.set('document:visibilitychange', handleVisibilityChange);
  }

  // Monitoramento de memória (quando suportado)
  setupMemoryMonitoring() {
    if (!('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      if (usedMB > 150) { // Limiar de 150MB
        console.warn(`[MemoryManager] High memory usage: ${usedMB.toFixed(1)}MB`);
        this.emergencyCleanup();
      }
    };

    // Verificar memória a cada 30 segundos
    const intervalId = setInterval(checkMemory, 30000);
    this.timers.add(intervalId);
  }

  // Registrar animação
  registerAnimation(id, pauseFn, resumeFn, cleanupFn) {
    const animation = {
      id,
      pauseFn: pauseFn || (() => {}),
      resumeFn: resumeFn || (() => {}),
      cleanupFn: cleanupFn || (() => {}),
      isPaused: false
    };
    
    this.activeAnimations.add(animation);
    return animation;
  }

  // Pausar todas as animações
  pauseAllAnimations() {
    this.activeAnimations.forEach(animation => {
      if (!animation.isPaused) {
        animation.pauseFn();
        animation.isPaused = true;
      }
    });
  }

  // Retomar todas as animações
  resumeAllAnimations() {
    if (!this.isTabActive) return;
    
    this.activeAnimations.forEach(animation => {
      if (animation.isPaused) {
        animation.resumeFn();
        animation.isPaused = false;
      }
    });
  }

  // Remover animação
  unregisterAnimation(animation) {
    if (animation && animation.cleanupFn) {
      animation.cleanupFn();
    }
    this.activeAnimations.delete(animation);
  }

  // Registrar event listener para cleanup automático
  registerEventListener(element, event, handler, options) {
    const key = `${element.constructor.name}:${event}`;
    
    element.addEventListener(event, handler, options);
    
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, handler, options });
  }

  // Registrar contexto de canvas
  registerCanvasContext(context) {
    this.canvasContexts.add(context);
  }

  // Limpeza de emergência
  emergencyCleanup() {
    console.log('[MemoryManager] Emergency cleanup triggered');
    
    // Pausar todas as animações
    this.pauseAllAnimations();
    
    // Forçar garbage collection se disponível
    if (window.gc) {
      window.gc();
    }
    
    // Limpar canvas contexts
    this.canvasContexts.forEach(ctx => {
      if (ctx && ctx.canvas) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    });
    
    // Aguardar um pouco antes de retomar
    setTimeout(() => {
      if (this.isTabActive) {
        this.resumeAllAnimations();
        console.log('[MemoryManager] Animations resumed after cleanup');
      }
    }, 2000);
  }

  // Limpeza completa
  destroy() {
    // Parar todas as animações
    this.activeAnimations.forEach(animation => {
      this.unregisterAnimation(animation);
    });
    this.activeAnimations.clear();

    // Remover event listeners
    this.eventListeners.forEach((listeners, key) => {
      listeners.forEach(({ element, handler, options }) => {
        element.removeEventListener(key.split(':')[1], handler, options);
      });
    });
    this.eventListeners.clear();

    // Limpar timers
    this.timers.forEach(timerId => {
      clearInterval(timerId);
    });
    this.timers.clear();

    // Limpar canvas contexts
    this.canvasContexts.clear();
  }

  // Estatísticas para debug
  getStats() {
    const memoryInfo = ('memory' in performance) ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    } : { used: 'N/A', total: 'N/A', limit: 'N/A' };

    return {
      activeAnimations: this.activeAnimations.size,
      eventListeners: this.eventListeners.size,
      canvasContexts: this.canvasContexts.size,
      timers: this.timers.size,
      isTabActive: this.isTabActive,
      memory: memoryInfo
    };
  }
}

// Singleton instance
const memoryManager = new MemoryManager();

export default memoryManager; 