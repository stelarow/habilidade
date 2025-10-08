/**
 * Singleton IntersectionObserver Pool
 * Gerencia um único observer para múltiplos elementos
 * Reduz overhead e melhora performance significativamente
 */

class IntersectionObserverPool {
  constructor() {
    this.observers = new Map(); // threshold -> observer
    this.callbacks = new Map(); // element -> callback
    this.elements = new Set(); // tracked elements
  }

  /**
   * Obtém ou cria um observer para um threshold específico
   */
  getObserver(threshold = 0.1, rootMargin = '0px') {
    const key = `${threshold}-${rootMargin}`;

    if (!this.observers.has(key)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const callback = this.callbacks.get(entry.target);
            if (callback) {
              callback(entry);
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );

      this.observers.set(key, observer);
    }

    return this.observers.get(key);
  }

  /**
   * Observa um elemento com callback
   */
  observe(element, callback, options = {}) {
    if (!element || this.elements.has(element)) return;

    const { threshold = 0.1, rootMargin = '0px' } = options;
    const observer = this.getObserver(threshold, rootMargin);

    this.callbacks.set(element, callback);
    this.elements.add(element);
    observer.observe(element);
  }

  /**
   * Para de observar um elemento
   */
  unobserve(element) {
    if (!element || !this.elements.has(element)) return;

    // Encontra o observer correto e desconecta
    this.observers.forEach((observer) => {
      observer.unobserve(element);
    });

    this.callbacks.delete(element);
    this.elements.delete(element);
  }

  /**
   * Limpa todos os observers (útil para cleanup)
   */
  disconnect() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });

    this.observers.clear();
    this.callbacks.clear();
    this.elements.clear();
  }

  /**
   * Retorna estatísticas de uso (debug)
   */
  getStats() {
    return {
      observers: this.observers.size,
      trackedElements: this.elements.size,
      callbacks: this.callbacks.size
    };
  }
}

// Singleton instance
const observerPool = new IntersectionObserverPool();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    observerPool.disconnect();
  });
}

export default observerPool;
