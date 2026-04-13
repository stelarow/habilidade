/**
 * Lazy Analytics Loader - Otimizado para LCP
 * Defers Google Analytics/GTM loading para após interação ou scroll significativo
 */

import observerPool from '../utils/IntersectionObserverPool';

class LazyAnalyticsLoader {
  constructor() {
    this.gtmId = 'G-J4RJQLG6WP';
    this.isLoaded = false;
    this.eventQueue = [];
    this.scrollThreshold = 0.5; // Carregar após 50% de scroll
    this.interactionEvents = ['click', 'touchstart', 'keydown'];
    this.scrollListener = null;

    // Only initialize in browser environment
    if (globalThis.window !== undefined) {
      this.init();
    }
  }

  init() {
    // Load immediately if user prefers reduced motion (accessibility)
    if (this.hasReducedMotionPreference()) {
      this.loadAnalytics();
      return;
    }

    // Set up interaction observers (apenas eventos críticos)
    this.setupInteractionObserver();

    // Set up scroll observer para carregar após scroll significativo
    this.setupScrollObserver();

    // Set up intersection observer usando pool compartilhado
    this.setupIntersectionObserver();

    // REMOVIDO: Fallback timeout de 3s - carrega apenas sob demanda
  }

  hasReducedMotionPreference() {
    if (globalThis.window === undefined) return false;
    return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  setupInteractionObserver() {
    if (typeof document === 'undefined') return;

    const loadOnInteraction = () => {
      this.loadAnalytics();
      this.cleanup();
    };

    // Apenas eventos de interação real (removido mousemove)
    for (const event of this.interactionEvents) {
      document.addEventListener(event, loadOnInteraction, { passive: true, once: true });
    }
  }

  setupScrollObserver() {
    if (globalThis.window === undefined) return;

    let ticking = false;
    this.scrollListener = () => {
      if (!ticking && !this.isLoaded) {
        globalThis.requestAnimationFrame(() => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight));
          if (scrollPercent >= this.scrollThreshold) {
            this.loadAnalytics();
            this.cleanup();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  setupIntersectionObserver() {
    if (globalThis.window === undefined || typeof document === 'undefined') return;

    // Aguarda o footer estar disponível no DOM
    const waitForFooter = () => {
      const footer = document.querySelector('footer');
      if (footer) {
        // Usa o pool compartilhado ao invés de criar novo observer
        observerPool.observe(footer, (entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            this.loadAnalytics();
            this.cleanup();
            observerPool.unobserve(footer);
          }
        }, {
          rootMargin: '200px',
          threshold: 0.1
        });
      } else {
        // Retry após um frame se footer ainda não existe
        requestAnimationFrame(waitForFooter);
      }
    };

    waitForFooter();
  }

  cleanup() {
    // Remove event listeners após carregar
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
      this.scrollListener = null;
    }

    for (const event of this.interactionEvents) {
      document.removeEventListener(event, this.loadAnalytics, { passive: true });
    }
  }

  loadAnalytics() {
    if (this.isLoaded || globalThis.window === undefined) return;
    
    this.isLoaded = true;
    
    // Initialize dataLayer if not exists
    globalThis.dataLayer = globalThis.dataLayer || [];
    
    // Load GTM script
    this.loadGTMScript()
      .then(() => {
        this.initializeGTM();
        this.replayQueuedEvents();
      })
      .catch(error => {
        console.warn('[LazyAnalytics] Failed to load GTM:', error);
      });
  }

  loadGTMScript() {
    return new Promise((resolve, reject) => {
      if (typeof document === 'undefined') {
        reject(new Error('Document not available'));
        return;
      }
      
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gtmId}`;
      
      script.addEventListener('load', resolve);
      script.onerror = reject;
      
      document.head.append(script);
    });
  }

  initializeGTM() {
    if (globalThis.window === undefined || typeof document === 'undefined') return;
    
    // Initialize gtag function
    function gtag() {
      globalThis.dataLayer.push(arguments);
    }
    
    globalThis.gtag = gtag;
    
    // Configure GTM
    gtag('js', new Date());
    gtag('config', this.gtmId, {
      // Optimize for performance
      page_title: document.title,
      page_location: globalThis.location.href,
      // Reduce sampling for better performance
      sample_rate: 100,
      // Disable automatic page views (we'll track manually)
      send_page_view: false
    });

    // Send initial page view
    gtag('event', 'page_view', {
      page_title: document.title,
      page_location: globalThis.location.href,
      page_path: globalThis.location.pathname
    });
  }

  replayQueuedEvents() {
    if (globalThis.window === undefined) return;
    
    // Replay all queued events
    for (const { eventName, parameters } of this.eventQueue) {
      if (typeof gtag === 'function') {
        gtag('event', eventName, parameters);
      }
    }
    
    // Clear the queue
    this.eventQueue = [];
  }

  // Queue events before analytics loads
  queueEvent(eventName, parameters = {}) {
    if (globalThis.window === undefined) return;
    
    if (this.isLoaded && typeof gtag === 'function') {
      gtag('event', eventName, parameters);
    } else {
      this.eventQueue.push({ eventName, parameters });
    }
  }

  // Public method to check if analytics is ready
  isReady() {
    return globalThis.window !== undefined && this.isLoaded && typeof globalThis.gtag === 'function';
  }

  // Force load analytics (for testing or special cases)
  forceLoad() {
    this.loadAnalytics();
  }
}

// Create singleton instance
const lazyAnalyticsLoader = new LazyAnalyticsLoader();

// Expose globally for other services
if (globalThis.window !== undefined) {
  globalThis.lazyAnalyticsLoader = lazyAnalyticsLoader;
}

export default lazyAnalyticsLoader;