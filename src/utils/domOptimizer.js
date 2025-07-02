/**
 * Utilitário para otimização de DOM e gerenciamento de elementos
 * Baseado nas melhores práticas de 2025 para Core Web Vitals
 */

class DOMOptimizer {
  constructor() {
    this.intersectionObserver = null;
    this.mutationObserver = null;
    this.visibleElements = new Set();
    this.cleanupTasks = new Set();
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
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupMutationObserver();
    this.setupPeriodicCleanup();
    this.optimizeInitialDOM();
  }

  /**
   * Configura observador de visibilidade para elementos
   */
  setupIntersectionObserver() {
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

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false
    });
  }

  /**
   * Otimiza elemento individual
   */
  optimizeElement(element) {
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
    if (this.shouldObserveElement(element)) {
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
    // Otimizar scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Preparar para animações
    document.body.style.willChange = 'auto';
    
    // Aplicar font-display: swap para fontes
    const fontFaces = document.styleSheets;
    Array.from(fontFaces).forEach(sheet => {
      try {
        Array.from(sheet.cssRules || []).forEach(rule => {
          if (rule.type === CSSRule.FONT_FACE_RULE) {
            rule.style.fontDisplay = 'swap';
          }
        });
      } catch (e) {
        // Ignorar erros de CORS
      }
    });
  }

  /**
   * Limpeza periódica
   */
  setupPeriodicCleanup() {
    setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  /**
   * Executa limpeza de elementos
   */
  performCleanup() {
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
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.cleanupTasks.forEach(task => task());
  }
}

// Instância global
const domOptimizer = new DOMOptimizer();

export default domOptimizer; 