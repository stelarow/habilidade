# 05 - Lazy Backgrounds

## Objetivo
Otimizar carregamento de backgrounds animados sem afetar experiência visual.

## Análise
Backgrounds são componentes pesados (~97KB) que podem ser lazy loaded com segurança.

## Implementação

### 1. Estrutura de Lazy Backgrounds
**Arquivo**: `src/components/LazyBackgrounds.jsx`

```javascript
import { lazy, Suspense } from 'react';

// Lazy load todos os backgrounds
const InformaticaBackground = lazy(() => 
  import('./backgrounds/InformaticaBackground.jsx')
);
const ProgramacaoBackground = lazy(() => 
  import('./backgrounds/ProgramacaoBackground.jsx')
);
const DesignGraficoBackground = lazy(() => 
  import('./backgrounds/DesignGraficoBackground.jsx')
);
// ... outros backgrounds

// Fallback simples com gradiente
const BackgroundFallback = ({ className = '' }) => (
  <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-white ${className}`} />
);

// Mapa de backgrounds
export const backgrounds = {
  informatica: InformaticaBackground,
  programacao: ProgramacaoBackground,
  'design-grafico': DesignGraficoBackground,
  // ... outros
};

// Componente wrapper
export const LazyBackground = ({ type, ...props }) => {
  const Background = backgrounds[type];
  
  if (!Background) {
    return <BackgroundFallback {...props} />;
  }
  
  return (
    <Suspense fallback={<BackgroundFallback {...props} />}>
      <Background {...props} />
    </Suspense>
  );
};
```

### 2. Uso nos Componentes
```javascript
// Em vez de importar diretamente
import InformaticaBackground from './backgrounds/InformaticaBackground';

// Usar lazy version
import { LazyBackground } from './LazyBackgrounds';

// No componente
<LazyBackground type="informatica" className="opacity-20" />
```

### 3. Preload em Hover
```javascript
// Preload background quando hover no link do curso
const handleCourseHover = (courseType) => {
  if (backgrounds[courseType]) {
    import(`./backgrounds/${courseType}Background.jsx`);
  }
};
```

## Otimizações Adicionais

### 1. Simplificar Animações em Mobile
```javascript
const isMobile = window.innerWidth < 768;

if (isMobile) {
  // Reduzir complexidade das animações
  return <SimplifiedBackground />;
}
```

### 2. Usar CSS ao invés de JS quando possível
```css
/* Animações CSS são mais performáticas */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.floating-element {
  animation: float 6s ease-in-out infinite;
}
```

### 3. Throttle de Animações
```javascript
import { useReducedMotion } from 'framer-motion';

const shouldReduceMotion = useReducedMotion();

if (shouldReduceMotion) {
  // Desabilitar ou simplificar animações
  return <StaticBackground />;
}
```

## Validação

### Performance
- Medir FCP (First Contentful Paint)
- Verificar se não bloqueia renderização inicial
- Testar em conexões lentas

### Visual
- Confirmar que fallback é aceitável
- Verificar transição suave
- Testar em diferentes dispositivos

## Métricas de Sucesso
- Redução de ~90KB no bundle inicial
- FCP < 1.5s em 3G
- Sem "flash" visual perceptível

## Rollback
Se houver problemas visuais:
1. Manter apenas backgrounds da home estáticos
2. Lazy load apenas páginas de curso
3. Usar imagens estáticas como fallback