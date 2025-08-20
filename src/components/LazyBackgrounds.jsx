import React, { Suspense, lazy } from 'react';

// Lazy loading dos backgrounds pesados com Suspense otimizado
const backgrounds = {
  informatica: lazy(() => import('./backgrounds/InformaticaBackground.jsx')),
  programacao: lazy(() => import('./backgrounds/ProgramacaoBackground.jsx')),
  'design-grafico': lazy(() => import('./backgrounds/DesignGraficoBackground.jsx')),
  'marketing-digital': lazy(() => import('./backgrounds/MarketingDigitalBackground.jsx')),
  'inteligencia-artificial': lazy(() => import('./backgrounds/IABackground.jsx')),
  'business-intelligence': lazy(() => import('./backgrounds/BIBackground.jsx')),
  'projetista-3d': lazy(() => import('./backgrounds/Projetista3DBackground.jsx')),
  'edicao-video': lazy(() => import('./backgrounds/EdicaoVideoBackground.jsx')),
  administracao: lazy(() => import('./backgrounds/AdministracaoBackground.jsx'))
};

// Fallback otimizado para loading
const BackgroundFallback = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 animate-pulse">
    <div className="absolute inset-0 opacity-20">
      <div className="w-full h-full bg-grid-pattern"></div>
    </div>
  </div>
);

// Componente principal com error boundary interno
const LazyBackground = ({ type, ...props }) => {
  const BackgroundComponent = backgrounds[type];
  
  if (!BackgroundComponent) {
    console.warn(`Background type "${type}" not found`);
    return <BackgroundFallback />;
  }

  return (
    <Suspense key={`lazy-background-${type}`} fallback={<BackgroundFallback />}>
      <BackgroundComponent {...props} />
    </Suspense>
  );
};

export default LazyBackground;

// Export individual components for static imports when needed
export const preloadBackground = (type) => {
  if (backgrounds[type]) {
    backgrounds[type]();
  }
};

// Preload multiple backgrounds
export const preloadBackgrounds = (types) => {
  types.forEach(type => preloadBackground(type));
};