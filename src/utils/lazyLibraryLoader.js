/**
 * Utility para carregar bibliotecas pesadas condicionalmente
 * Reduz bundle inicial removendo dependências não críticas
 */

class LazyLibraryLoader {
  constructor() {
    this.loadedLibraries = new Map();
    this.loadingPromises = new Map();
  }

  /**
   * Carrega html2canvas apenas quando necessário
   */
  async loadHtml2Canvas() {
    if (this.loadedLibraries.has('html2canvas')) {
      return this.loadedLibraries.get('html2canvas');
    }

    if (this.loadingPromises.has('html2canvas')) {
      return this.loadingPromises.get('html2canvas');
    }

    const loadPromise = import('html2canvas').then(module => {
      const html2canvas = module.default;
      this.loadedLibraries.set('html2canvas', html2canvas);
      this.loadingPromises.delete('html2canvas');
      
      console.log('📦 html2canvas loaded dynamically');
      return html2canvas;
    });

    this.loadingPromises.set('html2canvas', loadPromise);
    return loadPromise;
  }

  /**
   * Carrega jsPDF apenas quando necessário
   */
  async loadJsPDF() {
    if (this.loadedLibraries.has('jspdf')) {
      return this.loadedLibraries.get('jspdf');
    }

    if (this.loadingPromises.has('jspdf')) {
      return this.loadingPromises.get('jspdf');
    }

    const loadPromise = import('jspdf').then(module => {
      const { jsPDF } = module;
      this.loadedLibraries.set('jspdf', jsPDF);
      this.loadingPromises.delete('jspdf');
      
      console.log('📦 jsPDF loaded dynamically');
      return jsPDF;
    });

    this.loadingPromises.set('jspdf', loadPromise);
    return loadPromise;
  }

  /**
   * Carrega markdown utilities (marked + highlight.js)
   */
  async loadMarkdownUtils() {
    if (this.loadedLibraries.has('markdown')) {
      return this.loadedLibraries.get('markdown');
    }

    if (this.loadingPromises.has('markdown')) {
      return this.loadingPromises.get('markdown');
    }

    const loadPromise = Promise.all([
      import('marked'),
      import('highlight.js')
    ]).then(([markedModule, hlJsModule]) => {
      const marked = markedModule.marked;
      const hljs = hlJsModule.default;
      
      const utils = { marked, hljs };
      this.loadedLibraries.set('markdown', utils);
      this.loadingPromises.delete('markdown');
      
      console.log('📦 Markdown utilities loaded dynamically');
      return utils;
    });

    this.loadingPromises.set('markdown', loadPromise);
    return loadPromise;
  }

  /**
   * Carrega Framer Motion apenas quando animações são necessárias
   */
  async loadFramerMotion() {
    if (this.loadedLibraries.has('framer-motion')) {
      return this.loadedLibraries.get('framer-motion');
    }

    if (this.loadingPromises.has('framer-motion')) {
      return this.loadingPromises.get('framer-motion');
    }

    const loadPromise = import('framer-motion').then(module => {
      const framerMotion = module;
      this.loadedLibraries.set('framer-motion', framerMotion);
      this.loadingPromises.delete('framer-motion');
      
      console.log('📦 Framer Motion loaded dynamically');
      return framerMotion;
    });

    this.loadingPromises.set('framer-motion', loadPromise);
    return loadPromise;
  }

  /**
   * Método genérico para carregar qualquer biblioteca
   */
  async loadLibrary(name, importFunction) {
    if (this.loadedLibraries.has(name)) {
      return this.loadedLibraries.get(name);
    }

    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name);
    }

    const loadPromise = importFunction().then(module => {
      this.loadedLibraries.set(name, module);
      this.loadingPromises.delete(name);
      
      console.log(`📦 ${name} loaded dynamically`);
      return module;
    });

    this.loadingPromises.set(name, loadPromise);
    return loadPromise;
  }

  /**
   * Preload bibliotecas baseado em user interaction
   */
  preloadOnUserInteraction() {
    let hasInteracted = false;

    const preloadLibraries = () => {
      if (hasInteracted) return;
      hasInteracted = true;

      // Preload apenas quando usuário interagir
      setTimeout(() => {
        // Preload Framer Motion se ainda não carregado
        if (!this.loadedLibraries.has('framer-motion')) {
          this.loadFramerMotion().catch(() => {});
        }
      }, 2000);
    };

    // Listen for user interactions
    ['mousedown', 'touchstart', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, preloadLibraries, { 
        once: true, 
        passive: true 
      });
    });
  }

  /**
   * Relatório de uso das bibliotecas
   */
  getUsageReport() {
    return {
      loadedLibraries: Array.from(this.loadedLibraries.keys()),
      pendingLoads: Array.from(this.loadingPromises.keys()),
      totalLoaded: this.loadedLibraries.size
    };
  }
}

// Singleton instance
const libraryLoader = new LazyLibraryLoader();

// Auto-setup preload on user interaction
if (typeof window !== 'undefined') {
  libraryLoader.preloadOnUserInteraction();
}

export default libraryLoader;