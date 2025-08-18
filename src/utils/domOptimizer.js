/**
 * Utilitário para otimização de DOM e gerenciamento de elementos
 * Baseado nas melhores práticas de 2025 para Core Web Vitals
 * Compatible with SSG/SSR environments
 */

class DOMOptimizer {
  constructor() {
    this.intersectionObserver = null;
    this.mutationObserver = null;
    this.visibleElements = new Set();
    this.cleanupTasks = new Set();
    this.isServer = typeof window === 'undefined';
    this.isHydrated = false; // Flag to track hydration status
    this.config = {
      // Limites para elementos DOM
      maxVisibleElements: 200,
      maxTotalElements: 800,
      
      // Configurações do IntersectionObserver
      rootMargin: '100px',
      threshold: [0, 0.1, 0.5],
      
      // Debounce para operações custosas
      debounceDelay: 100,
      
      // Configurações de limpeza
      cleanupInterval: 5000,
      maxIdleTime: 30000
    };
    
    // Don't auto-initialize to avoid hydration issues
    // Will be manually initialized after hydration
  }

  init() {
    if (this.isServer) return;
    
    this.setupIntersectionObserver();
    this.setupMutationObserver();
    this.setupPeriodicCleanup();
    
    // Only run initial DOM optimization if hydrated
    if (this.isHydrated) {
      this.optimizeInitialDOM();
    }
  }

  /**
   * Initialize optimizer after hydration is complete
   */
  initializeAfterHydration() {
    if (this.isServer) return;
    
    this.isHydrated = true;
    this.init();
    this.optimizeInitialDOM();
  }

  /**
   * Configura observador de visibilidade para elementos
   */
  setupIntersectionObserver() {
    // Check if IntersectionObserver is available (browser environment)
    if (typeof IntersectionObserver === 'undefined') {
      console.warn('[DOMOptimizer] IntersectionObserver not available, skipping setup');
      return;
    }

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleElementVisible(entry.target);
        } else {
          this.handleElementHidden(entry.target);
        }
      });
    }, {
      rootMargin: this.config.rootMargin,
      threshold: this.config.threshold
    });
  }

  /**
   * Configura observador de mutações DOM
   */
  setupMutationObserver() {
    if (this.isServer || typeof MutationObserver === 'undefined') {
      console.warn('[DOMOptimizer] MutationObserver not available, skipping setup');
      return;
    }

    this.mutationObserver = new MutationObserver(
      this.debounce((mutations) => {
        mutations.forEach(mutation => {
          // Otimizar novos elementos adicionados
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.optimizeElement(node);
            }
          });
        });
      }, this.config.debounceDelay)
    );

    if (typeof document !== 'undefined' && document.body) {
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }
  }

  /**
   * Otimiza elemento individual
   */
  optimizeElement(element) {
    if (this.isServer || !element) return;

    // Aplicar lazy loading para imagens
    if (element.tagName === 'IMG' && !element.hasAttribute('loading')) {
      element.setAttribute('loading', 'lazy');
    }

    // Otimizar elementos com animações
    if (element.classList?.contains('animate-')) {
      this.optimizeAnimatedElement(element);
    }

    // Aplicar contain para elementos isolados
    if (this.shouldApplyContainment(element)) {
      element.style.contain = 'layout style paint';
    }

    // Observar visibilidade se necessário
    if (this.shouldObserveElement(element) && this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }

  /**
   * Otimiza elementos com animações
   */
  optimizeAnimatedElement(element) {
    // Aplicar will-change apenas quando necessário
    const animationClasses = Array.from(element.classList)
      .filter(cls => cls.startsWith('animate-'));

    if (animationClasses.length > 0) {
      // Detectar propriedades animadas
      const hasTransform = animationClasses.some(cls => 
        cls.includes('fade') || cls.includes('slide') || cls.includes('scale')
      );
      const hasOpacity = animationClasses.some(cls => 
        cls.includes('fade') || cls.includes('pulse')
      );

      if (hasTransform && hasOpacity) {
        element.style.willChange = 'transform, opacity';
      } else if (hasTransform) {
        element.style.willChange = 'transform';
      } else if (hasOpacity) {
        element.style.willChange = 'opacity';
      }

      // Remover will-change após animação
      const cleanup = () => {
        element.style.willChange = 'auto';
        element.removeEventListener('animationend', cleanup);
        element.removeEventListener('transitionend', cleanup);
      };

      element.addEventListener('animationend', cleanup, { once: true });
      element.addEventListener('transitionend', cleanup, { once: true });
    }
  }

  /**
   * Determina se elemento deve ter containment
   */
  shouldApplyContainment(element) {
    // Elementos com backgrounds animados
    if (element.classList?.contains('course-background')) return true;
    
    // Cards e componentes isolados
    if (element.classList?.contains('card-') || 
        element.classList?.contains('course-card')) return true;
    
    // Elementos com overflow
    if (getComputedStyle(element).overflow !== 'visible') return true;
    
    return false;
  }

  /**
   * Determina se elemento deve ser observado
   */
  shouldObserveElement(element) {
    // Elementos com animações on-scroll
    if (element.classList?.contains('animate-on-scroll')) return true;
    
    // Elementos custosos para renderizar
    if (element.tagName === 'CANVAS') return true;
    if (element.classList?.contains('course-background')) return true;
    
    // Elementos com muitos filhos
    if (element.children?.length > 20) return true;
    
    return false;
  }

  /**
   * Manipula elemento que se tornou visível
   */
  handleElementVisible(element) {
    this.visibleElements.add(element);
    
    // Ativar animações se necessário
    if (element.classList?.contains('animate-on-scroll')) {
      element.classList.add('in-view');
    }

    // Verificar limite de elementos visíveis
    if (this.visibleElements.size > this.config.maxVisibleElements) {
      this.cullHiddenElements();
    }
  }

  /**
   * Manipula elemento que se tornou oculto
   */
  handleElementHidden(element) {
    this.visibleElements.delete(element);
    
    // Pausar animações se necessário
    if (element.classList?.contains('animate-on-scroll')) {
      element.classList.remove('in-view');
    }

    // Limpar will-change se não estiver animando
    if (!element.style.animationPlayState === 'running') {
      element.style.willChange = 'auto';
    }
  }

  /**
   * Remove elementos ocultos desnecessários
   */
  cullHiddenElements() {
    if (this.isServer || typeof document === 'undefined') return;

    const allElements = document.querySelectorAll('[data-dom-optimized]');
    const hiddenElements = Array.from(allElements)
      .filter(el => !this.visibleElements.has(el))
      .slice(this.config.maxTotalElements);

    hiddenElements.forEach(element => {
      // Marcar para remoção temporária
      if (element.parentNode && !element.classList.contains('critical')) {
        element.style.display = 'none';
        element.setAttribute('data-hidden-by-optimizer', 'true');
      }
    });
  }

  /**
   * Otimização inicial do DOM
   */
  optimizeInitialDOM() {
    if (this.isServer || typeof document === 'undefined') return;

    // Otimizar elementos existentes
    document.querySelectorAll('*').forEach(element => {
      this.optimizeElement(element);
      element.setAttribute('data-dom-optimized', 'true');
    });

    // Remover comentários HTML desnecessários
    this.removeComments();
    
    // Aplicar otimizações globais
    this.applyGlobalOptimizations();
  }

  /**
   * Remove comentários HTML para reduzir tamanho DOM
   */
  removeComments() {
    if (this.isServer || typeof document === 'undefined' || typeof NodeFilter === 'undefined') return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_COMMENT
    );

    const comments = [];
    let node;
    while (node = walker.nextNode()) {
      comments.push(node);
    }

    comments.forEach(comment => {
      if (!comment.nodeValue.includes('KEEP')) {
        comment.remove();
      }
    });
  }

  /**
   * Aplica otimizações globais
   */
  applyGlobalOptimizations() {
    if (this.isServer || typeof document === 'undefined') return;

    // Otimizar scrolling
    if (document.documentElement) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Preparar para animações
    if (document.body) {
      document.body.style.willChange = 'auto';
    }
    
    // Aplicar font-display: swap para fontes
    if (document.styleSheets) {
      const fontFaces = document.styleSheets;
      Array.from(fontFaces).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (typeof CSSRule !== 'undefined' && rule.type === CSSRule.FONT_FACE_RULE) {
              rule.style.fontDisplay = 'swap';
            }
          });
        } catch (e) {
          // Ignorar erros de CORS
        }
      });
    }
  }

  /**
   * Limpeza periódica
   */
  setupPeriodicCleanup() {
    if (this.isServer || typeof setInterval === 'undefined') return;

    setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Executa limpeza de elementos
   */
  performCleanup() {
    if (this.isServer || typeof document === 'undefined' || typeof window === 'undefined') return;

    // Restaurar elementos ocultos se necessário
    document.querySelectorAll('[data-hidden-by-optimizer="true"]').forEach(element => {
      const rect = element.getBoundingClientRect();
      const isNearViewport = rect.top < window.innerHeight + 500 && 
                            rect.bottom > -500;
      
      if (isNearViewport) {
        element.style.display = '';
        element.removeAttribute('data-hidden-by-optimizer');
      }
    });

    // Limpar will-change ociosos
    document.querySelectorAll('[style*="will-change"]').forEach(element => {
      if (!element.style.animationPlayState === 'running' &&
          !element.matches(':hover') &&
          !element.classList.contains('animating')) {
        element.style.willChange = 'auto';
      }
    });
  }

  /**
   * Debounce utility
   */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  /**
   * Destruir otimizador
   */
  destroy() {
    if (this.isServer) return;

    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.cleanupTasks) {
      this.cleanupTasks.forEach(task => task());
    }
  }
}

// Instância global
const domOptimizer = new DOMOptimizer();

export default domOptimizer; 