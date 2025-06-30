import React, { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { usePerformanceLevel } from '../hooks/usePerformanceLevel';
import { 
  COURSE_SLUGS, 
  DEFAULT_PERFORMANCE_CONFIG, 
  COURSE_FALLBACK_COLORS 
} from '../types/backgrounds';

// Lazy loading dos componentes de background
const backgroundComponents = {
  [COURSE_SLUGS.PROJETISTA_3D]: React.lazy(() => import('./backgrounds/Projetista3DBackground')),
  [COURSE_SLUGS.EDICAO_VIDEO]: React.lazy(() => import('./backgrounds/EdicaoVideoBackground')),
  [COURSE_SLUGS.INFORMATICA]: React.lazy(() => import('./backgrounds/InformaticaBackground')),
  [COURSE_SLUGS.DESIGN_GRAFICO]: React.lazy(() => import('./backgrounds/DesignGraficoBackground')),
  [COURSE_SLUGS.PROGRAMACAO]: React.lazy(() => import('./backgrounds/ProgramacaoBackground')),
  [COURSE_SLUGS.MARKETING_DIGITAL]: React.lazy(() => import('./backgrounds/MarketingDigitalBackground')),
  [COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL]: React.lazy(() => import('./backgrounds/IABackground')),
  [COURSE_SLUGS.BUSINESS_INTELLIGENCE]: React.lazy(() => import('./backgrounds/BIBackground'))
};

/**
 * Componente de fallback estático baseado nas cores do curso
 */
const StaticFallback = ({ courseSlug, className = '' }) => {
  const colors = COURSE_FALLBACK_COLORS[courseSlug] || ['#6366f1', '#8b5cf6', '#ec4899'];
  
  return (
    <div 
      className={`absolute inset-0 -z-10 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
        opacity: 0.1
      }}
      role="presentation"
      aria-hidden="true"
    />
  );
};

/**
 * Componente de loading para backgrounds
 */
const BackgroundLoader = ({ courseSlug }) => {
  const colors = COURSE_FALLBACK_COLORS[courseSlug] || ['#6366f1'];
  
  return (
    <div 
      className="absolute inset-0 -z-10 flex items-center justify-center"
      style={{ backgroundColor: `${colors[0]}10` }}
    >
      <div 
        className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: `${colors[0]}40` }}
      />
    </div>
  );
};

/**
 * Hook para cache de componentes carregados
 */
const useBackgroundCache = () => {
  const [cache, setCache] = useState(new Map());
  
  const addToCache = useCallback((courseSlug, component) => {
    setCache(prev => new Map(prev).set(courseSlug, component));
  }, []);
  
  const getFromCache = useCallback((courseSlug) => {
    return cache.get(courseSlug);
  }, [cache]);
  
  return { addToCache, getFromCache, hasInCache: cache.has.bind(cache) };
};

/**
 * Componente principal para backgrounds de curso
 */
const CourseBackground = ({ 
  courseSlug, 
  className = '',
  priority = false,
  onLoadComplete = null,
  onError = null
}) => {
  const { 
    performanceLevel, 
    shouldUseStaticVersion,
    shouldUseBasicAnimations,
    deviceCapabilities 
  } = usePerformanceLevel();
  
  const { addToCache, getFromCache, hasInCache } = useBackgroundCache();
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [mountedComponent, setMountedComponent] = useState(null);

  // Configuração de performance para o curso atual
  const performanceConfig = useMemo(() => {
    return DEFAULT_PERFORMANCE_CONFIG[performanceLevel] || DEFAULT_PERFORMANCE_CONFIG.medium;
  }, [performanceLevel]);

  // Determinar se deve carregar o background animado
  const shouldLoadAnimated = useMemo(() => {
    if (shouldUseStaticVersion) return false;
    if (!courseSlug || !backgroundComponents[courseSlug]) return false;
    
    // Verificar se o curso está nos slugs válidos
    return Object.values(COURSE_SLUGS).includes(courseSlug);
  }, [courseSlug, shouldUseStaticVersion]);

  // Carregar componente do background
  const loadBackground = useCallback(async () => {
    if (!shouldLoadAnimated) return;
    
    // Verificar cache primeiro
    if (hasInCache(courseSlug)) {
      const cachedComponent = getFromCache(courseSlug);
      setMountedComponent(cachedComponent);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const BackgroundComponent = backgroundComponents[courseSlug];
      
      if (!BackgroundComponent) {
        throw new Error(`Background component not found for course: ${courseSlug}`);
      }

      // Preload do componente
      const loadedComponent = await BackgroundComponent;
      
      // Adicionar ao cache
      addToCache(courseSlug, loadedComponent.default);
      setMountedComponent(loadedComponent.default);
      
      // Callback de sucesso
      if (onLoadComplete) {
        onLoadComplete(courseSlug, performanceLevel);
      }
      
    } catch (error) {
      console.warn(`Failed to load background for ${courseSlug}:`, error);
      setLoadError(error);
      
      if (onError) {
        onError(error, courseSlug);
      }
    } finally {
      setIsLoading(false);
    }
  }, [courseSlug, shouldLoadAnimated, hasInCache, getFromCache, addToCache, onLoadComplete, onError, performanceLevel]);

  // Carregar background quando slug mudar
  useEffect(() => {
    if (shouldLoadAnimated) {
      loadBackground();
    } else {
      setMountedComponent(null);
    }
  }, [shouldLoadAnimated, loadBackground]);

  // Preload de backgrounds prioritários
  useEffect(() => {
    if (priority && !shouldUseStaticVersion) {
      const preloadNextBackgrounds = async () => {
        const allSlugs = Object.values(COURSE_SLUGS);
        const currentIndex = allSlugs.indexOf(courseSlug);
        
        // Preload do próximo e anterior
        const toPreload = [
          allSlugs[currentIndex + 1],
          allSlugs[currentIndex - 1]
        ].filter(Boolean);

        for (const slug of toPreload) {
          if (!hasInCache(slug) && backgroundComponents[slug]) {
            try {
              const component = await backgroundComponents[slug];
              addToCache(slug, component.default);
            } catch (error) {
              console.warn(`Failed to preload background for ${slug}:`, error);
            }
          }
        }
      };

      // Delay para não bloquear renderização inicial
      const timeoutId = setTimeout(preloadNextBackgrounds, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [priority, courseSlug, shouldUseStaticVersion, hasInCache, addToCache]);

  // Log de debug (apenas em desenvolvimento)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('CourseBackground Debug:', {
        courseSlug,
        performanceLevel,
        shouldLoadAnimated,
        shouldUseStaticVersion,
        deviceCapabilities: deviceCapabilities ? {
          isMobile: deviceCapabilities.isMobile,
          estimatedRAM: deviceCapabilities.estimatedRAM,
          webglSupport: deviceCapabilities.webglSupport
        } : 'loading...'
      });
    }
  }, [courseSlug, performanceLevel, shouldLoadAnimated, shouldUseStaticVersion, deviceCapabilities]);

  // Renderizar baseado no estado atual
  if (shouldUseStaticVersion || loadError) {
    return <StaticFallback courseSlug={courseSlug} className={className} />;
  }

  if (isLoading) {
    return <BackgroundLoader courseSlug={courseSlug} />;
  }

  if (!mountedComponent) {
    return <StaticFallback courseSlug={courseSlug} className={className} />;
  }

  // Renderizar background animado
  const BackgroundComponent = mountedComponent;
  
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Suspense fallback={<BackgroundLoader courseSlug={courseSlug} />}>
        <BackgroundComponent 
          performanceConfig={performanceConfig}
          deviceCapabilities={deviceCapabilities}
          courseSlug={courseSlug}
        />
      </Suspense>
    </div>
  );
};

export default React.memo(CourseBackground);

// Export para uso externo
export { StaticFallback, BackgroundLoader }; 