import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook para preload inteligente de recursos
 * Implementa preload baseado em probabilidade de navegação
 */
export default function useResourcePreloader() {
  const location = useLocation();
  const preloadedResources = useRef(new Set());
  const hoverTimeouts = useRef(new Map());

  // Mapeamento de recursos por rota
  const routeResources = {
    '/': {
      priority: ['home', 'courses-preview'],
      backgrounds: ['informatica', 'programacao'], // Mais populares
      chunks: ['./src/components/Courses.jsx', './src/components/Hero.jsx']
    },
    '/cursos/informatica': {
      priority: ['informatica-background'],
      related: ['programacao', 'business-intelligence'],
      chunks: ['./src/components/backgrounds/InformaticaBackground.jsx']
    },
    '/cursos/programacao': {
      priority: ['programacao-background'],
      related: ['informatica', 'design-grafico'],
      chunks: ['./src/components/backgrounds/ProgramacaoBackground.jsx']
    },
    '/cursos/design-grafico': {
      priority: ['design-background'],
      related: ['edicao-video', 'marketing-digital'],
      chunks: ['./src/components/backgrounds/DesignGraficoBackground.jsx']
    }
    // ... outros cursos
  };

  /**
   * Preload de recurso com verificação de capacidade
   */
  const preloadResource = useCallback(async (resourcePath, priority = 'low') => {
    if (preloadedResources.current.has(resourcePath)) return;

    // Verificar capacidade da rede
    const connection = navigator.connection;
    if (connection && connection.effectiveType === 'slow-2g') return;

    // Verificar memória disponível
    if (navigator.deviceMemory && navigator.deviceMemory < 4 && priority === 'low') return;

    try {
      if (resourcePath.startsWith('./')) {
        // Preload de chunks JavaScript
        const link = document.createElement('link');
        link.rel = 'modulepreload';
        link.href = resourcePath;
        document.head.appendChild(link);
      } else if (resourcePath.endsWith('.css')) {
        // Preload de CSS
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resourcePath;
        link.as = 'style';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      } else if (resourcePath.includes('background')) {
        // Preload de background (lazy import)
        const backgroundName = resourcePath.replace('-background', '');
        import(`../components/backgrounds/${backgroundName}Background.jsx`).catch(() => {
          // Silently fail
        });
      }

      preloadedResources.current.add(resourcePath);
    } catch (error) {
      console.warn('Preload failed for:', resourcePath, error);
    }
  }, []);

  /**
   * Preload baseado na rota atual
   */
  const preloadForRoute = useCallback((routePath) => {
    const resources = routeResources[routePath];
    if (!resources) return;

    // Preload de alta prioridade
    if (resources.priority) {
      resources.priority.forEach(resource => {
        preloadResource(resource, 'high');
      });
    }

    // Preload de chunks
    if (resources.chunks) {
      resources.chunks.forEach(chunk => {
        preloadResource(chunk, 'medium');
      });
    }

    // Preload relacionados (baixa prioridade)
    if (resources.related) {
      setTimeout(() => {
        resources.related.forEach(related => {
          preloadResource(`${related}-background`, 'low');
        });
      }, 2000);
    }
  }, [preloadResource]);

  /**
   * Preload no hover de links
   */
  const handleLinkHover = useCallback((event) => {
    const link = event.target.closest('a');
    if (!link || !link.href) return;

    const href = new URL(link.href).pathname;
    const timeoutId = setTimeout(() => {
      preloadForRoute(href);
    }, 100); // Delay para evitar preload desnecessário

    hoverTimeouts.current.set(link, timeoutId);
  }, [preloadForRoute]);

  /**
   * Limpar timeout no mouse leave
   */
  const handleLinkLeave = useCallback((event) => {
    const link = event.target.closest('a');
    if (!link) return;

    const timeoutId = hoverTimeouts.current.get(link);
    if (timeoutId) {
      clearTimeout(timeoutId);
      hoverTimeouts.current.delete(link);
    }
  }, []);

  /**
   * Preload baseado em viewport intersection
   */
  const observeLinksInViewport = useCallback(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = new URL(link.href).pathname;
          
          // Preload com delay para links visíveis
          setTimeout(() => {
            preloadForRoute(href);
          }, 1500);
          
          observer.unobserve(link);
        }
      });
    }, {
      rootMargin: '100px'
    });

    // Observar links de cursos
    document.querySelectorAll('a[href*="/cursos/"]').forEach(link => {
      observer.observe(link);
    });

    return () => observer.disconnect();
  }, [preloadForRoute]);

  // Preload baseado na rota atual
  useEffect(() => {
    preloadForRoute(location.pathname);
  }, [location.pathname, preloadForRoute]);

  // Setup de event listeners
  useEffect(() => {
    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    document.addEventListener('mouseleave', handleLinkLeave, { passive: true });
    
    const cleanupObserver = observeLinksInViewport();

    return () => {
      document.removeEventListener('mouseover', handleLinkHover);
      document.removeEventListener('mouseleave', handleLinkLeave);
      
      // Limpar timeouts
      hoverTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
      hoverTimeouts.current.clear();
      
      cleanupObserver();
    };
  }, [handleLinkHover, handleLinkLeave, observeLinksInViewport]);

  /**
   * Preload manual de recurso
   */
  const preload = useCallback((resourcePath, priority = 'medium') => {
    preloadResource(resourcePath, priority);
  }, [preloadResource]);

  /**
   * Verificar se recurso foi preloaded
   */
  const isPreloaded = useCallback((resourcePath) => {
    return preloadedResources.current.has(resourcePath);
  }, []);

  /**
   * Limpar cache de preload
   */
  const clearPreloadCache = useCallback(() => {
    preloadedResources.current.clear();
  }, []);

  return {
    preload,
    isPreloaded,
    clearPreloadCache,
    preloadedCount: preloadedResources.current.size
  };
} 