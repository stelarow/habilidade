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
    
    // Only setup browser APIs if we're in a browser environment
    if (globalThis.window !== undefined && typeof document !== 'undefined') {
      this.setupVisibilityAPI();
      this.setupMemoryMonitoring();
    }
  }

  // API de Visibilidade - pausa animações quando aba não está ativa
  setupVisibilityAPI() {
    // Guard against server-side rendering
    if (typeof document === 'undefined') {
      console.warn('[MemoryManager] Skipping visibility API setup - running in SSR environment');
      return;
    }

    const handleVisibilityChange = () => {
      this.isTabActive = !document.hidden;
      
      if (this.isTabActive) {
        this.resumeAllAnimations();
        console.log('[MemoryManager] Tab active - animations resumed');
      } else {
        this.pauseAllAnimations();
        console.log('[MemoryManager] Tab inactive - animations paused');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    this.eventListeners.set('document:visibilitychange', handleVisibilityChange);
  }

  // Monitoramento de memória (quando suportado)
  setupMemoryMonitoring() {
    // Guard against server-side rendering
    if (typeof performance === 'undefined' || !('memory' in performance)) return;

    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      
      if (usedMB > 150) { // Limiar de 150MB
        console.warn(`[MemoryManager] High memory usage: ${usedMB.toFixed(1)}MB`);
        this.emergencyCleanup();
      }
    };

    // Verificar memória a cada 30 segundos
    const intervalId = setInterval(checkMemory, 30_000);
    this.timers.add(intervalId);
  }

  // Registrar animação
  registerAnimation(id, pauseFunction, resumeFunction, cleanupFunction) {
    const animation = {
      id,
      pauseFn: pauseFunction || (() => {}),
      resumeFn: resumeFunction || (() => {}),
      cleanupFn: cleanupFunction || (() => {}),
      isPaused: false
    };
    
    this.activeAnimations.add(animation);
    return animation;
  }

  // Pausar todas as animações
  pauseAllAnimations() {
    for (const animation of this.activeAnimations) {
      if (!animation.isPaused) {
        animation.pauseFn();
        animation.isPaused = true;
      }
    }
  }

  // Retomar todas as animações
  resumeAllAnimations() {
    if (!this.isTabActive) return;
    
    for (const animation of this.activeAnimations) {
      if (animation.isPaused) {
        animation.resumeFn();
        animation.isPaused = false;
      }
    }
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
    if (globalThis.gc) {
      globalThis.gc();
    }
    
    // Limpar canvas contexts
    for (const context of this.canvasContexts) {
      if (context && context.canvas) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }
    }
    
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
    for (const animation of this.activeAnimations) {
      this.unregisterAnimation(animation);
    }
    this.activeAnimations.clear();

    // Remover event listeners
    for (const [key, listeners] of this.eventListeners.entries()) {
      for (const { element, handler, options } of listeners) {
        element.removeEventListener(key.split(':')[1], handler, options);
      }
    }
    this.eventListeners.clear();

    // Limpar timers
    for (const timerId of this.timers) {
      clearInterval(timerId);
    }
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