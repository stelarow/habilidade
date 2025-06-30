/**
 * Observador de viewport para pausar animações quando não visíveis
 * Economiza recursos pausando backgrounds fora da tela
 */

class ViewportObserver {
  constructor() {
    this.observers = new Map();
    this.callbacks = new Map();
  }

  // Observar elemento e chamar callback quando visibilidade mudar
  observe(element, onVisibilityChange, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: '50px', // Margem para preload
      threshold: 0.1 // 10% visível para ativar
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isVisible = entry.isIntersecting;
        onVisibilityChange(isVisible, entry);
      });
    }, finalOptions);

    observer.observe(element);
    this.observers.set(element, observer);
    this.callbacks.set(element, onVisibilityChange);

    return observer;
  }

  // Parar observação de elemento
  unobserve(element) {
    const observer = this.observers.get(element);
    if (observer) {
      observer.unobserve(element);
      this.observers.delete(element);
      this.callbacks.delete(element);
    }
  }

  // Limpar todos os observadores
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.callbacks.clear();
  }
}

// Instância singleton
const viewportObserver = new ViewportObserver();

export default viewportObserver; 