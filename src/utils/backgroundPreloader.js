/**
 * Sistema de preloading inteligente para backgrounds
 * Implementa estratégias de cache e carregamento baseadas em performance
 */

import { COURSE_SLUGS } from '../types/backgrounds.js';

class BackgroundPreloader {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.priorities = new Map();
    this.maxConcurrentLoads = 1; // Reduzido de 2 para 1 para economia de memória
    this.currentLoads = 0;
    this.loadQueue = [];
    
    // Configurar prioridades baseadas na navegação comum
    this.setPriorities([
      COURSE_SLUGS.PROJETISTA_3D,      // 1º - Homepage destacado
      COURSE_SLUGS.DESIGN_GRAFICO,     // 2º - Popular
      COURSE_SLUGS.PROGRAMACAO,        // 3º - Popular
      COURSE_SLUGS.MARKETING_DIGITAL,  // 4º - Popular
      COURSE_SLUGS.INFORMATICA,        // 5º - Base técnica
      COURSE_SLUGS.EDICAO_VIDEO,       // 6º - Criativo
      COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL, // 7º - Avançado
      COURSE_SLUGS.BUSINESS_INTELLIGENCE    // 8º - Especializado
    ]);

    // Inicializar limpeza periódica
    this.setupPeriodicCleanup();
  }

  setPriorities(courseOrder) {
    courseOrder.forEach((courseSlug, index) => {
      this.priorities.set(courseSlug, index);
    });
  }

  async preloadBackground(courseSlug, options = {}) {
    const {
      priority = this.priorities.get(courseSlug) || 999,
      force = false,
      deviceCapabilities = null
    } = options;

    // Verificar se já está carregado
    if (!force && this.cache.has(courseSlug)) {
      return this.cache.get(courseSlug);
    }

    // Verificar se já está sendo carregado
    if (this.loadingPromises.has(courseSlug)) {
      return this.loadingPromises.get(courseSlug);
    }

    // Criar promise de carregamento
    const loadPromise = this.loadBackgroundComponent(courseSlug, deviceCapabilities);
    this.loadingPromises.set(courseSlug, loadPromise);

    try {
      const component = await loadPromise;
      this.cache.set(courseSlug, component);
      this.loadingPromises.delete(courseSlug);
      
      console.log(`[BackgroundPreloader] Successfully loaded: ${courseSlug}`);
      return component;
    } catch (error) {
      this.loadingPromises.delete(courseSlug);
      console.warn(`[BackgroundPreloader] Failed to load ${courseSlug}:`, error);
      throw error;
    }
  }

  async loadBackgroundComponent(courseSlug, deviceCapabilities) {
    // Dynamic imports baseados no slug
    const componentMap = {
      [COURSE_SLUGS.PROJETISTA_3D]: () => import('../components/backgrounds/Projetista3DBackground'),
      [COURSE_SLUGS.EDICAO_VIDEO]: () => import('../components/backgrounds/EdicaoVideoBackground'),
      [COURSE_SLUGS.INFORMATICA]: () => import('../components/backgrounds/InformaticaBackground'),
      [COURSE_SLUGS.DESIGN_GRAFICO]: () => import('../components/backgrounds/DesignGraficoBackground'),
      [COURSE_SLUGS.PROGRAMACAO]: () => import('../components/backgrounds/ProgramacaoBackground'),
      [COURSE_SLUGS.MARKETING_DIGITAL]: () => import('../components/backgrounds/MarketingDigitalBackground'),
      [COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL]: () => import('../components/backgrounds/IABackground'),
      [COURSE_SLUGS.BUSINESS_INTELLIGENCE]: () => import('../components/backgrounds/BIBackground')
    };

    const loader = componentMap[courseSlug];
    if (!loader) {
      throw new Error(`No background component found for: ${courseSlug}`);
    }

    // Carregar com timeout para evitar travamentos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Background load timeout')), 10000);
    });

    const loadedModule = await Promise.race([loader(), timeoutPromise]);
    return loadedModule.default;
  }

  async preloadAdjacentBackgrounds(currentCourseSlug, deviceCapabilities) {
    const allCourses = Object.values(COURSE_SLUGS);
    const currentIndex = allCourses.indexOf(currentCourseSlug);
    
    if (currentIndex === -1) return;

    // Determinar quais backgrounds precarregar baseado na performance
    const shouldPreload = this.shouldPreloadMore(deviceCapabilities);
    const preloadCount = shouldPreload ? 3 : 2;

    const toPreload = [];
    
    // Adicionar backgrounds adjacentes
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (currentIndex + i) % allCourses.length;
      const prevIndex = (currentIndex - i + allCourses.length) % allCourses.length;
      
      toPreload.push(allCourses[nextIndex]);
      if (i <= 1) { // Só precarregar 1 anterior para economizar recursos
        toPreload.push(allCourses[prevIndex]);
      }
    }

    // Remover duplicatas e o curso atual
    const uniqueToPreload = [...new Set(toPreload)].filter(slug => slug !== currentCourseSlug);

    // Precarregar com prioridade decrescente
    const preloadPromises = uniqueToPreload.map((slug, index) => 
      this.schedulePreload(slug, { 
        priority: index,
        deviceCapabilities 
      })
    );

    // Não aguardar o preload para não bloquear
    Promise.allSettled(preloadPromises).then(results => {
      const successful = results.filter(r => r.status === 'fulfilled').length;
      console.log(`[BackgroundPreloader] Preloaded ${successful}/${uniqueToPreload.length} adjacent backgrounds`);
    });
  }

  shouldPreloadMore(deviceCapabilities) {
    if (!deviceCapabilities) return false;
    
    // Precarregar mais em dispositivos high-end
    return deviceCapabilities.estimatedRAM >= 8 && 
           !deviceCapabilities.isMobile && 
           deviceCapabilities.effectiveNetworkType !== 'slow-2g';
  }

  async schedulePreload(courseSlug, options = {}) {
    return new Promise((resolve, reject) => {
      const task = {
        courseSlug,
        options,
        resolve,
        reject
      };

      if (this.currentLoads < this.maxConcurrentLoads) {
        this.executePreload(task);
      } else {
        this.loadQueue.push(task);
        // Ordenar queue por prioridade
        this.loadQueue.sort((a, b) => (a.options.priority || 999) - (b.options.priority || 999));
      }
    });
  }

  async executePreload(task) {
    this.currentLoads++;
    
    try {
      const component = await this.preloadBackground(task.courseSlug, task.options);
      task.resolve(component);
    } catch (error) {
      task.reject(error);
    } finally {
      this.currentLoads--;
      
      // Processar próximo na queue
      if (this.loadQueue.length > 0) {
        const nextTask = this.loadQueue.shift();
        this.executePreload(nextTask);
      }
    }
  }

  // Preload prioritário para homepage
  async preloadCriticalBackgrounds(deviceCapabilities) {
    const critical = [
      COURSE_SLUGS.PROJETISTA_3D,    // Primeiro da lista
      COURSE_SLUGS.DESIGN_GRAFICO,   // Popular
      COURSE_SLUGS.PROGRAMACAO       // Popular
    ];

    console.log('[BackgroundPreloader] Starting critical preload...');
    
    // Carregar o primeiro imediatamente
    try {
      await this.preloadBackground(critical[0], { priority: 0, deviceCapabilities });
      
      // Outros em background se o device suportar
      if (this.shouldPreloadMore(deviceCapabilities)) {
        critical.slice(1).forEach((slug, index) => {
          this.schedulePreload(slug, { 
            priority: index + 1, 
            deviceCapabilities 
          });
        });
      }
    } catch (error) {
      console.warn('[BackgroundPreloader] Critical preload failed:', error);
    }
  }

  // Limpar cache se necessário (para memory management)
  clearCache(keepRecent = 2) { // Reduzido de 3 para 2
    if (this.cache.size <= keepRecent) return;

    // Manter apenas os mais recentes (algoritmo FIFO simples)
    const entries = Array.from(this.cache.entries());
    const toKeep = entries.slice(-keepRecent);
    
    this.cache.clear();
    toKeep.forEach(([key, value]) => {
      this.cache.set(key, value);
    });

    console.log(`[BackgroundPreloader] Cache cleared, kept ${toKeep.length} recent items`);
  }

  // Limpeza automática periódica
  setupPeriodicCleanup() {
    // Limpar cache a cada 5 minutos
    setInterval(() => {
      if (this.cache.size > 3) {
        this.clearCache(2);
        console.log('[BackgroundPreloader] Periodic cache cleanup executed');
      }
    }, 5 * 60 * 1000); // 5 minutos
  }

  // Estatísticas para debugging
  getStats() {
    return {
      cacheSize: this.cache.size,
      loading: this.loadingPromises.size,
      queueLength: this.loadQueue.length,
      currentLoads: this.currentLoads,
      cachedBackgrounds: Array.from(this.cache.keys())
    };
  }

  // Cleanup para memory leaks
  destroy() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.loadQueue.length = 0;
    this.priorities.clear();
  }
}

// Singleton instance
const backgroundPreloader = new BackgroundPreloader();

// Export named functions para uso direto
export const preloadBackground = (courseSlug, performanceLevel) => {
  return backgroundPreloader.preloadBackground(courseSlug, { 
    deviceCapabilities: { performanceLevel } 
  });
};

export const clearCache = (keepRecent) => {
  return backgroundPreloader.clearCache(keepRecent);
};

export const getStats = () => {
  return backgroundPreloader.getStats();
};

export default backgroundPreloader; 