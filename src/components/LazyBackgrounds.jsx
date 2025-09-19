/**
 * Lazy Backgrounds - Progressive Loading for Heavy Canvas Components
 */

import { lazy, Suspense } from 'react';
import { withIslandHydration } from './shared/IslandComponent';

// Lazy load all background components
const IABackground = lazy(() => import('./backgrounds/IABackground'));
const InformaticaBackground = lazy(() => import('./backgrounds/InformaticaBackground'));
const MarketingDigitalBackground = lazy(() => import('./backgrounds/MarketingDigitalBackground'));
const ProgramacaoBackground = lazy(() => import('./backgrounds/ProgramacaoBackground'));
const Projetista3DBackground = lazy(() => import('./backgrounds/Projetista3DBackground'));
const AdministracaoBackground = lazy(() => import('./backgrounds/AdministracaoBackground'));
const BIBackground = lazy(() => import('./backgrounds/BIBackground'));
const DesignGraficoBackground = lazy(() => import('./backgrounds/DesignGraficoBackground'));
const EdicaoVideoBackground = lazy(() => import('./backgrounds/EdicaoVideoBackground'));

// Background fallback component
const BackgroundFallback = ({ type }) => (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-50">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white/20 text-xs">
        Carregando {type}...
      </div>
    </div>
  </div>
);

// Create lazy island versions of backgrounds
export const LazyIABackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="IA" />}>
      <IABackground {...props} />
    </Suspense>
  ),
  { name: 'IABackground', critical: false }
);

export const LazyInformaticaBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Informática" />}>
      <InformaticaBackground {...props} />
    </Suspense>
  ),
  { name: 'InformaticaBackground', critical: false }
);

export const LazyMarketingDigitalBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Marketing Digital" />}>
      <MarketingDigitalBackground {...props} />
    </Suspense>
  ),
  { name: 'MarketingDigitalBackground', critical: false }
);

export const LazyProgramacaoBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Programação" />}>
      <ProgramacaoBackground {...props} />
    </Suspense>
  ),
  { name: 'ProgramacaoBackground', critical: false }
);

export const LazyProjetista3DBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Projetista 3D" />}>
      <Projetista3DBackground {...props} />
    </Suspense>
  ),
  { name: 'Projetista3DBackground', critical: false }
);

export const LazyAdministracaoBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Administração" />}>
      <AdministracaoBackground {...props} />
    </Suspense>
  ),
  { name: 'AdministracaoBackground', critical: false }
);

export const LazyBIBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Business Intelligence" />}>
      <BIBackground {...props} />
    </Suspense>
  ),
  { name: 'BIBackground', critical: false }
);

export const LazyDesignGraficoBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Design Gráfico" />}>
      <DesignGraficoBackground {...props} />
    </Suspense>
  ),
  { name: 'DesignGraficoBackground', critical: false }
);

export const LazyEdicaoVideoBackground = withIslandHydration(
  (props) => (
    <Suspense fallback={<BackgroundFallback type="Edição de Vídeo" />}>
      <EdicaoVideoBackground {...props} />
    </Suspense>
  ),
  { name: 'EdicaoVideoBackground', critical: false }
);

// Export helper function to get lazy background by type
export const getLazyBackground = (type) => {
  const backgrounds = {
    'ia': LazyIABackground,
    'informatica': LazyInformaticaBackground,
    'marketing-digital': LazyMarketingDigitalBackground,
    'programacao': LazyProgramacaoBackground,
    'projetista-3d': LazyProjetista3DBackground,
    'administracao': LazyAdministracaoBackground,
    'business-intelligence': LazyBIBackground,
    'design-grafico': LazyDesignGraficoBackground,
    'edicao-video': LazyEdicaoVideoBackground
  };

  return backgrounds[type] || null;
};