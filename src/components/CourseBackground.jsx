import React, { lazy, Suspense, useMemo } from 'react';
import usePerformanceLevel from '../hooks/usePerformanceLevel';
import backgroundPreloader from '../utils/backgroundPreloader';
import viewportObserver from '../utils/viewportObserver';
import { 
  COURSE_SLUGS, 
  DEFAULT_PERFORMANCE_CONFIG, 
  COURSE_FALLBACK_COLORS 
} from '../types/backgrounds';

// Lazy loading dos backgrounds com preload inteligente
const backgrounds = {
  'inteligencia-artificial': lazy(() => 
    import('./backgrounds/IABackground.jsx').then(module => ({ default: module.default }))
  ),
  'design-grafico': lazy(() => 
    import('./backgrounds/DesignGraficoBackground.jsx').then(module => ({ default: module.default }))
  ),
  'informatica': lazy(() => 
    import('./backgrounds/InformaticaBackground.jsx').then(module => ({ default: module.default }))
  ),
  'programacao': lazy(() => 
    import('./backgrounds/ProgramacaoBackground.jsx').then(module => ({ default: module.default }))
  ),
  'marketing-digital': lazy(() => 
    import('./backgrounds/MarketingDigitalBackground.jsx').then(module => ({ default: module.default }))
  ),
  'business-intelligence': lazy(() => 
    import('./backgrounds/BIBackground.jsx').then(module => ({ default: module.default }))
  ),
  'edicao-video': lazy(() => 
    import('./backgrounds/EdicaoVideoBackground.jsx').then(module => ({ default: module.default }))
  ),
  'projetista-3d': lazy(() => 
    import('./backgrounds/Projetista3DBackground.jsx').then(module => ({ default: module.default }))
  ),
  'administracao': lazy(() => 
    import('./backgrounds/AdministracaoBackground.jsx').then(module => ({ default: module.default }))
  )
};

/**
 * Componente de fallback estático baseado nas cores do curso
 */
const StaticFallback = ({ courseSlug }) => {
  const gradients = {
    'inteligencia-artificial': 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
    'design-grafico': 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
    'informatica': 'linear-gradient(135deg, #3742FA 0%, #2F3542 50%, #57606F 100%)',
    'programacao': 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
    'marketing-digital': 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)',
    'business-intelligence': 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
    'edicao-video': 'linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)',
    'projetista-3d': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)',
    'administracao': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)'
  };

  return (
    <div 
      className="absolute inset-0 opacity-10 course-background"
      style={{
        background: gradients[courseSlug] || gradients['informatica'],
        willChange: 'auto',
        zIndex: 1
      }}
      aria-hidden="true"
    />
  );
};

/**
 * Componente de loading para backgrounds
 */
const BackgroundLoader = () => (
  <div className="absolute inset-0 course-background" style={{ zIndex: 1 }} aria-hidden="true">
    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 to-zinc-800/20 animate-pulse" />
  </div>
);

/**
 * Componente principal para backgrounds de curso
 */
const CourseBackground = ({ courseSlug, className = '', priority = false }) => {
  const { performanceLevel, deviceCapabilities } = usePerformanceLevel();
  
  // Configuração de performance baseada no nível detectado
  const performanceConfig = useMemo(() => {
    const configs = {
      low: {
        staticFallback: false,
        particleCount: 6,
        enableAnimations: true,
        reducedMotion: false
      },
      medium: {
        staticFallback: false,
        particleCount: 12,
        enableAnimations: true,
        reducedMotion: false
      },
      high: {
        staticFallback: false,
        particleCount: 20,
        enableAnimations: true,
        reducedMotion: false
      }
    };
    
    return configs[performanceLevel] || configs.medium;
  }, [performanceLevel]);

  // Verificar se deve usar fallback estático apenas em casos extremos
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Usar fallback estático apenas se usuário explicitamente prefere movimento reduzido
  if (prefersReducedMotion) {
    return <StaticFallback courseSlug={courseSlug} />;
  }

  const BackgroundComponent = backgrounds[courseSlug];
  
  if (!BackgroundComponent) {
    return <StaticFallback courseSlug={courseSlug} />;
  }

  return (
    <div 
      className={`absolute inset-0 ${className} course-background`} 
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      <Suspense 
        fallback={<BackgroundLoader />}
      >
        <BackgroundComponent 
          performanceConfig={performanceConfig}
          deviceCapabilities={deviceCapabilities}
          courseSlug={courseSlug}
        />
      </Suspense>
    </div>
  );
};

// Preload do background baseado na rota
export const preloadBackground = (courseSlug) => {
  if (backgrounds[courseSlug] && typeof window !== 'undefined') {
    // Preload apenas se connection for boa
    if (navigator.connection?.effectiveType === '4g' || !navigator.connection) {
      import(`./backgrounds/${courseSlug}Background.jsx`).catch(() => {
        // Silently fail - fallback será usado
      });
    }
  }
};

export default React.memo(CourseBackground); 