# Performance Optimization Guide - Escola Habilidade

## 📊 Current Performance Analysis

Based on PageSpeed Insights analysis for mobile performance, the following Core Web Vitals need attention:

## ✅ **ETAPA 1 - ANÁLISE BASELINE COMPLETADA** ✅ (13/08/2025)

### 🔍 **Descobertas da Análise do Codebase**

#### **Pontos Fortes Identificados:**
- ✅ **Code Splitting Avançado**: `vite.config.js` com 12 chunks manuais otimizados
- ✅ **Lazy Loading Implementado**: Sistema robusto em `LazyComponents.jsx` e `routes.jsx`
- ✅ **Otimização de Imagens**: WebP + fallback em `OptimizedImage.jsx`
- ✅ **SSG Configurado**: `vite-react-ssg` para geração estática
- ✅ **Dynamic Imports**: Sistema inteligente em `utils/dynamicImports.js`
- ✅ **Bundle Optimization**: Terser agressivo e tree shaking habilitado

#### **Oportunidades Críticas Identificadas:**
⚠️ **IntersectionObserver Overuse**
- **Problema**: 20+ arquivos usando IntersectionObserver separadamente
- **Impacto**: Múltiplos observers competindo pela thread principal
- **Arquivos Afetados**: `BlogCard.jsx`, `TableOfContents.jsx`, `useInView.js`, `main.jsx`
- **Solução**: Consolidar em observer manager centralizado

⚠️ **Bundle Size Opportunities**
- **Atual**: Chunks de 500KB, bibliotecas pesadas ainda bundled
- **Potencial**: Redução de 30-40% com splitting granular
- **Target**: Chunks de 250KB com loading condicional

⚠️ **Priority Loading Gap**
- **Atual**: Lazy loading básico implementado
- **Oportunidade**: Sistema de prioridades de 5 níveis (critical→onDemand)
- **Network Adaptation**: Ausente - precisa implementar

⚠️ **Resource Hints Suboptimized**
- **Atual**: Preconnects estáticos em `main.jsx`
- **Oportunidade**: Resource hints dinâmicos baseados em user journey

### 📈 **Métricas Baseline Atuais**
- **Bundle Size**: ~500KB chunks (target: ~250KB)
- **Code Splitting**: 12 chunks manuais (pode otimizar para 15-18)
- **Lazy Loading**: Básico implementado (precisa sistema de prioridades)
- **Image Loading**: WebP + fallback ✅ (precisa responsive otimization)
- **IntersectionObserver**: 20+ instâncias (consolidar para 1-3)

### 🎯 **Arquitetura de Performance Descoberta**
```
src/
├── main.jsx                    # 🔧 Preconnects + Image Observer 
├── routes.jsx                  # ✅ Lazy routes implementado
├── components/
│   ├── LazyComponents.jsx      # ✅ Sistema lazy robusto
│   └── shared/OptimizedImage.jsx # ✅ WebP + fallback
├── utils/
│   ├── dynamicImports.js       # ✅ Sistema inteligente
│   └── performanceOptimizer.js # 🔧 Observer manager existe
└── vite.config.js             # ✅ Code splitting avançado
```

### 🚀 **Próximas Etapas Priorizadas** (Atualizado)
1. **✅ ETAPA 1 CONCLUÍDA** - Análise baseline do codebase
2. **🚨 ETAPA 2** - Critical Observer Consolidation (PRIORIDADE MÁXIMA)
3. **📋 ETAPA 3** - Priority-Based Loading System (ALTO IMPACTO) 
4. **📋 ETAPA 4** - Enhanced Bundle Splitting (MÉDIO IMPACTO)
5. **📋 ETAPA 5** - Network & Runtime Optimization
6. **📋 ETAPA 6** - Advanced Optimizations
7. **📋 ETAPA 7** - Monitoring & Analytics

### 📊 **Framework Tools Utilizados**
- **Serena MCP**: Análise estrutural e pattern detection
- **Ref Documentation**: Vite performance best practices
- **Code Analysis**: 20+ arquivos examinados
- **Pattern Recognition**: IntersectionObserver usage mapping

### Core Web Vitals Thresholds
- **FCP (First Contentful Paint)**: Target < 1.8s (Good), < 3s (Needs Improvement)
- **LCP (Largest Contentful Paint)**: Target < 2.5s (Good), < 4s (Needs Improvement)  
- **CLS (Cumulative Layout Shift)**: Target < 0.10 (Good), < 0.25 (Needs Improvement)
- **TBT (Total Blocking Time)**: Target < 200ms (Good), < 600ms (Needs Improvement)
- **TTFB (Time to First Byte)**: Target < 0.8s (Good), < 1.8s (Needs Improvement)

## 🚀 Priority 1: Critical Performance Optimizations

### 1. Implementar Lazy Loading Avançado

#### A. Component-Level Code Splitting
```javascript
// src/App.jsx - Implementar lazy loading para todas as rotas
import { lazy, Suspense } from 'react';

// Substituir imports diretos por lazy loading
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const CourseInfoPage = lazy(() => import('./pages/CourseInfoPage'));

// Adicionar preload para rotas críticas
const preloadCriticalRoutes = () => {
  import('./pages/Home');
  import('./components/header/Header');
};

// Chamar no App mount
useEffect(() => {
  // Preload após 2s de idle
  const timer = setTimeout(preloadCriticalRoutes, 2000);
  return () => clearTimeout(timer);
}, []);
```

#### B. Image Lazy Loading com Native API
```javascript
// src/components/shared/OptimizedImage.jsx
const OptimizedImage = ({ src, alt, critical = false, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={critical ? "eager" : "lazy"}
      decoding={critical ? "sync" : "async"}
      fetchpriority={critical ? "high" : "auto"}
      {...props}
    />
  );
};
```

#### C. Estratégia de Carregamento por Prioridade

##### Mapeamento de Prioridades e Thresholds
```javascript
// src/config/lazyLoadingStrategy.js
export const LOADING_PRIORITIES = {
  // CRÍTICO (carrega imediatamente - sem lazy loading)
  critical: {
    components: ['Header', 'Navigation', 'HeroSection'],
    images: ['logo', 'hero-background'],
    threshold: 0, // Carrega imediatamente
    rootMargin: '0px',
    strategy: 'eager'
  },
  
  // IMPORTANTE (carrega muito antes de aparecer)
  high: {
    components: ['CoursesSection', 'MainCTA', 'Features'],
    images: ['course-thumbnails', 'instructor-photos'],
    threshold: 0.01, // 1% visível
    rootMargin: '50px 0px 100px 0px', // Mobile: 50px, Desktop: 100px
    strategy: 'lazy-near'
  },
  
  // NORMAL (carrega pouco antes de aparecer)
  medium: {
    components: ['Testimonials', 'Gallery', 'FAQ', 'AboutSection'],
    images: ['testimonial-photos', 'gallery-images'],
    threshold: 0.1, // 10% visível
    rootMargin: '200px 0px 200px 0px', // 200px de margem
    strategy: 'lazy-standard'
  },
  
  // BAIXA (carrega quando próximo de aparecer)
  low: {
    components: ['Footer', 'Newsletter', 'SocialLinks', 'Partners'],
    images: ['partner-logos', 'footer-decorations'],
    threshold: 0.25, // 25% visível
    rootMargin: '500px 0px 500px 0px', // 500px de margem
    strategy: 'lazy-delayed'
  },
  
  // ON-DEMAND (carrega apenas quando solicitado)
  onDemand: {
    components: ['Modal', 'PDFViewer', 'VideoPlayer', 'ImageZoom'],
    images: ['pdf-previews', 'video-thumbnails', 'high-res-images'],
    threshold: 1.0, // 100% visível ou ação do usuário
    rootMargin: '0px',
    strategy: 'user-triggered'
  }
};

// Hook para aplicar estratégia
export const useLazyLoadingStrategy = (elementType, priority = 'medium') => {
  const [shouldLoad, setShouldLoad] = useState(
    priority === 'critical' // Critical sempre carrega
  );
  const elementRef = useRef(null);
  
  useEffect(() => {
    if (priority === 'critical' || priority === 'onDemand') {
      return; // Critical já carregou, onDemand espera trigger
    }
    
    const config = LOADING_PRIORITIES[priority];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin
      }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [priority]);
  
  return { shouldLoad, elementRef };
};
```

##### Implementação por Tipo de Conteúdo
```javascript
// src/components/LazyWrapper.jsx
const LazyWrapper = ({ 
  children, 
  priority = 'medium',
  fallback = <Skeleton />,
  onLoad = () => {}
}) => {
  const { shouldLoad, elementRef } = useLazyLoadingStrategy('component', priority);
  
  // Adaptive loading baseado em conexão
  const networkSpeed = useNetworkSpeed();
  const adjustedPriority = adjustNetworkPriority(priority, networkSpeed);
  
  return (
    <div ref={elementRef}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

// Ajuste dinâmico baseado em rede
const adjustNetworkPriority = (basePriority, networkSpeed) => {
  const adjustments = {
    '4g': { offset: 0 },    // Mantém prioridade original
    '3g': { offset: -1 },   // Reduz prioridade em 1 nível
    '2g': { offset: -2 },   // Reduz prioridade em 2 níveis
    'slow-2g': { offset: -3 } // Carrega apenas crítico
  };
  
  // Mapear prioridades para índices
  const priorities = ['critical', 'high', 'medium', 'low', 'onDemand'];
  const currentIndex = priorities.indexOf(basePriority);
  const adjustment = adjustments[networkSpeed]?.offset || 0;
  const newIndex = Math.max(0, Math.min(4, currentIndex + adjustment));
  
  return priorities[newIndex];
};
```

##### Métricas de Decisão e Monitoramento
```javascript
// src/utils/lazyLoadingMetrics.js
class LazyLoadingMetrics {
  constructor() {
    this.metrics = {
      componentsLoaded: {},
      imagesLoaded: {},
      loadTimes: {},
      priorities: {}
    };
  }
  
  trackComponentLoad(componentName, priority, loadTime) {
    this.metrics.componentsLoaded[componentName] = {
      priority,
      loadTime,
      timestamp: Date.now(),
      viewportPosition: window.scrollY,
      networkSpeed: navigator.connection?.effectiveType || 'unknown'
    };
    
    // Enviar para analytics
    this.reportMetrics(componentName, priority, loadTime);
  }
  
  reportMetrics(component, priority, time) {
    // Verificar se a estratégia está funcionando
    const isEffective = this.evaluateEffectiveness(priority, time);
    
    if (window.gtag) {
      gtag('event', 'lazy_loading', {
        component_name: component,
        priority_level: priority,
        load_time_ms: time,
        is_effective: isEffective,
        network_type: navigator.connection?.effectiveType
      });
    }
    
    // Log de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LazyLoad] ${component} (${priority}): ${time}ms - ${isEffective ? '✅' : '⚠️'}`);
    }
  }
  
  evaluateEffectiveness(priority, loadTime) {
    // Thresholds de efetividade por prioridade
    const thresholds = {
      critical: 100,   // Deve carregar em < 100ms
      high: 500,       // Deve carregar em < 500ms
      medium: 1000,    // Deve carregar em < 1s
      low: 2000,       // Deve carregar em < 2s
      onDemand: 3000   // Deve carregar em < 3s quando solicitado
    };
    
    return loadTime <= (thresholds[priority] || 1000);
  }
  
  getReport() {
    const totalComponents = Object.keys(this.metrics.componentsLoaded).length;
    const avgLoadTime = Object.values(this.metrics.loadTimes)
      .reduce((a, b) => a + b, 0) / totalComponents;
    
    return {
      totalComponentsLoaded: totalComponents,
      averageLoadTime: avgLoadTime,
      byPriority: this.groupByPriority(),
      effectiveness: this.calculateOverallEffectiveness()
    };
  }
}

export default new LazyLoadingMetrics();
```

### 2. Otimizar Bundle Size e Code Splitting

#### A. Atualizar vite.config.js
```javascript
// vite.config.js - Adicionar otimizações
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Chunks mais granulares para melhor caching
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          'ui-icons': ['@phosphor-icons/react', 'lucide-react'],
          'blog-runtime': ['/src/services/blogAPI.js', '/src/utils/blogCache.js'],
          // Separar componentes pesados
          'heavy-components': ['framer-motion'],
          'pdf-utils': ['html2canvas', 'jspdf'],
        }
      }
    },
    // Reduzir limite de chunk para forçar splitting
    chunkSizeWarningLimit: 250,
    // Ativar CSS code splitting
    cssCodeSplit: true,
    // Usar esbuild para minificação mais rápida
    minify: 'esbuild',
    // Ativar tree shaking agressivo
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      tryCatchDeoptimization: false
    }
  },
  
  // Warm up de arquivos frequentes
  server: {
    warmup: {
      clientFiles: [
        './src/App.jsx',
        './src/pages/Home.jsx',
        './src/components/header/Header.jsx',
      ]
    }
  }
});
```

### 3. Otimizar Recursos Críticos

#### A. Preconnect e DNS Prefetch
```html
<!-- index.html - Adicionar no <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://fonts.gstatic.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">

<!-- Preload de fonte crítica -->
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" as="style">
```

#### B. Resource Hints Dinâmicos
```javascript
// src/hooks/useResourceHints.js
export const useResourceHints = () => {
  useEffect(() => {
    // Prefetch próxima navegação provável
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const link = entry.target;
          const href = link.getAttribute('href');
          if (href && href.startsWith('/')) {
            // Prefetch da rota
            import(`./pages/${href.slice(1)}.jsx`).catch(() => {});
          }
        }
      });
    }, { rootMargin: '50px' });

    // Observar links de navegação
    document.querySelectorAll('a[href^="/"]').forEach(link => {
      observer.observe(link);
    });

    return () => observer.disconnect();
  }, []);
};
```

## 🎯 Priority 2: Otimizações de Renderização

### 4. Reduzir CLS (Cumulative Layout Shift)

#### A. Definir Dimensões Explícitas
```css
/* src/styles/performance.css */
/* Reservar espaço para elementos carregados dinamicamente */
.hero-image {
  aspect-ratio: 16/9;
  min-height: 400px;
  background-color: #f0f0f0;
}

.course-card {
  min-height: 280px;
  contain: layout style paint;
}

/* Font loading optimization */
@font-face {
  font-family: 'Montserrat';
  font-display: swap; /* Evita FOIT */
  font-weight: 400 700;
  src: local('Montserrat'),
       url('/fonts/montserrat.woff2') format('woff2');
}
```

#### B. Skeleton Screens
```javascript
// src/components/shared/Skeleton.jsx
const Skeleton = ({ type = 'text', lines = 1 }) => {
  return (
    <div className="animate-pulse">
      {type === 'card' ? (
        <div className="bg-gray-200 rounded-lg h-64 w-full" />
      ) : (
        Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="bg-gray-200 h-4 rounded mb-2" 
               style={{ width: `${100 - i * 10}%` }} />
        ))
      )}
    </div>
  );
};
```

### 5. Otimizar JavaScript Execution

#### A. Debounce e Throttle
```javascript
// src/utils/performance.js
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
```

#### B. React Performance Optimizations
```javascript
// src/hooks/useOptimizedState.js
import { useState, useCallback, useMemo } from 'react';

export const useOptimizedState = (initialState) => {
  const [state, setState] = useState(initialState);
  
  // Memoize setState para evitar re-renders
  const optimizedSetState = useCallback((newState) => {
    setState(prev => {
      // Evitar updates desnecessários
      if (JSON.stringify(prev) === JSON.stringify(newState)) {
        return prev;
      }
      return newState;
    });
  }, []);
  
  return [state, optimizedSetState];
};
```

## 🔧 Priority 3: Otimizações de Rede

### 6. Implementar Service Worker para Caching

```javascript
// public/sw.js
const CACHE_NAME = 'escola-habilidade-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/assets/logo.svg',
  // Adicionar recursos críticos
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200) {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Cache images and fonts
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|woff2?)$/)) {
                cache.put(event.request, responseToCache);
              }
            });
          
          return response;
        });
      })
  );
});
```

### 7. Otimizar Requests de API

```javascript
// src/services/optimizedAPI.js
class OptimizedAPIService {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }
  
  async fetchWithCache(url, options = {}) {
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    
    // Return cached data if fresh
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      const maxAge = options.maxAge || 5 * 60 * 1000; // 5 min default
      
      if (Date.now() - timestamp < maxAge) {
        return data;
      }
    }
    
    // Dedup concurrent requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }
    
    // Make request
    const promise = fetch(url, options)
      .then(res => res.json())
      .then(data => {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        this.pendingRequests.delete(cacheKey);
        return data;
      });
    
    this.pendingRequests.set(cacheKey, promise);
    return promise;
  }
  
  // Batch API requests
  async batchFetch(urls) {
    return Promise.all(urls.map(url => this.fetchWithCache(url)));
  }
}

export default new OptimizedAPIService();
```

## 📱 Priority 4: Mobile-Specific Optimizations

### 8. Adaptive Loading

```javascript
// src/hooks/useAdaptiveLoading.js
export const useAdaptiveLoading = () => {
  const [quality, setQuality] = useState('high');
  
  useEffect(() => {
    // Network Information API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateQuality = () => {
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData;
        
        if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
          setQuality('low');
        } else if (effectiveType === '3g') {
          setQuality('medium');
        } else {
          setQuality('high');
        }
      };
      
      updateQuality();
      connection.addEventListener('change', updateQuality);
      
      return () => connection.removeEventListener('change', updateQuality);
    }
    
    // Fallback: Check device memory
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
      setQuality('medium');
    }
  }, []);
  
  return quality;
};

// Uso no componente
const MyComponent = () => {
  const quality = useAdaptiveLoading();
  
  return (
    <div>
      {quality === 'high' && <HighQualityContent />}
      {quality === 'medium' && <MediumQualityContent />}
      {quality === 'low' && <LowQualityContent />}
    </div>
  );
};
```

### 9. Touch Optimizations

```javascript
// src/utils/touchOptimizations.js
// Passive event listeners para scroll performance
export const addPassiveEventListener = (element, event, handler) => {
  element.addEventListener(event, handler, { passive: true });
};

// CSS para melhor responsividade ao toque
const touchStyles = `
  .touch-target {
    min-height: 44px;
    min-width: 44px;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation; /* Evita delay de 300ms */
  }
  
  /* Otimizar scroll em mobile */
  .scrollable {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-y: contain;
    will-change: scroll-position;
  }
`;
```

## 🛠️ Priority 5: Tailwind CSS Optimizations

### 10. Configurar PurgeCSS Agressivo

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Remover classes não utilizadas
  safelist: [
    // Apenas classes dinâmicas essenciais
    'bg-blue-500',
    'text-red-600',
    /^animate-/,
  ],
  theme: {
    extend: {
      // Remover cores não utilizadas
      colors: {
        zinc: {
          // Apenas tons utilizados
          50: '#fafafa',
          900: '#18181b',
        },
      },
    },
  },
  // Otimizações de produção
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: true,
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
```

### 11. PostCSS Optimizations

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    // Adicionar minificação CSS
    'cssnano': {
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        colormin: true,
        calc: true,
      }]
    },
    // Remove CSS não utilizado
    '@fullhuman/postcss-purgecss': {
      content: ['./src/**/*.{js,jsx}', './index.html'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }
  },
};
```

## 📊 Métricas e Monitoramento

### 12. Implementar Real User Monitoring (RUM)

```javascript
// src/utils/performanceMonitoring.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.init();
  }
  
  init() {
    // Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });
      
      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ entryTypes: ['first-input'] });
      
      // CLS
      let clsValue = 0;
      let clsEntries = [];
      
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        }
        this.metrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    }
    
    // Navigation Timing
    window.addEventListener('load', () => {
      const timing = performance.timing;
      this.metrics.ttfb = timing.responseStart - timing.fetchStart;
      this.metrics.domContentLoaded = timing.domContentLoadedEventEnd - timing.fetchStart;
      this.metrics.windowLoaded = timing.loadEventEnd - timing.fetchStart;
      
      // Send metrics after 5 seconds
      setTimeout(() => this.reportMetrics(), 5000);
    });
  }
  
  reportMetrics() {
    // Send to analytics or monitoring service
    console.log('Performance Metrics:', this.metrics);
    
    // Example: Send to Google Analytics
    if (window.gtag) {
      Object.entries(this.metrics).forEach(([key, value]) => {
        gtag('event', 'performance', {
          metric_name: key,
          value: Math.round(value),
          metric_unit: 'milliseconds'
        });
      });
    }
  }
}

// Initialize on app load
export default new PerformanceMonitor();
```

## 🚦 Checklist de Implementação (Atualizado com Base na Análise)

### ✅ **ETAPA 1 CONCLUÍDA** - Análise Baseline (1 dia)
- [x] Analisar estrutura atual do codebase
- [x] Mapear 20+ arquivos com IntersectionObserver
- [x] Identificar oportunidades de bundle optimization
- [x] Documentar baseline e próximas etapas

### **ETAPA 2: Critical Observer Consolidation** (1-2 dias) - **PRIORIDADE MÁXIMA**
- [ ] Consolidar 20+ IntersectionObserver em manager centralizado
- [ ] Refatorar `useInView.js` para usar manager único
- [ ] Atualizar `BlogCard.jsx`, `TableOfContents.jsx`, `main.jsx`
- [ ] Implementar performance monitoring de observers
- [ ] Testar impacto na thread principal

### **ETAPA 3: Priority-Based Loading System** (2-3 dias) - **ALTO IMPACTO**
- [ ] Implementar 5-tier loading strategy (critical→onDemand)
- [ ] Criar `src/config/lazyLoadingStrategy.js`
- [ ] Implementar `useLazyLoadingStrategy` hook
- [ ] Adicionar network-adaptive loading
- [ ] Atualizar componentes para usar priority system

### **ETAPA 4: Enhanced Bundle Splitting** (2-3 dias) - **MÉDIO IMPACTO**
- [ ] Otimizar vite.config.js para chunks de 250KB
- [ ] Implementar conditional loading para heavy libraries
- [ ] Adicionar warmup de arquivos frequentes
- [ ] Implementar dynamic resource hints
- [ ] Configurar preload inteligente baseado em rota

### **ETAPA 5: Network & Runtime Optimization** (2-3 dias)
- [ ] Implementar Service Worker para caching
- [ ] Adicionar cache de API com deduplicação
- [ ] Implementar debounce/throttle onde necessário
- [ ] Otimizar re-renders com React.memo/useMemo
- [ ] Configurar adaptive loading baseado em conexão

### **ETAPA 6: Advanced Optimizations** (1-2 dias)
- [ ] ✅ Lazy loading para imagens (já implementado)
- [ ] ✅ Preconnect/dns-prefetch (já implementado)
- [ ] Implementar virtual scrolling para listas longas
- [ ] Adicionar CSS contain para layout optimization
- [ ] Implementar font loading optimization

### **ETAPA 7: Monitoring & Analytics** (1-2 dias)
- [ ] Implementar RUM (Real User Monitoring)
- [ ] Configurar alertas de performance
- [ ] Criar dashboard de métricas Core Web Vitals
- [ ] Implementar A/B testing para otimizações
- [ ] Configurar continuous performance monitoring

## 📈 Resultados Esperados

Após implementação completa:

- **FCP**: Redução de 40-50% (target < 1.5s)
- **LCP**: Redução de 35-45% (target < 2.0s)
- **CLS**: Redução de 60-70% (target < 0.05)
- **TBT**: Redução de 50-60% (target < 150ms)
- **Bundle Size**: Redução de 30-40%
- **Score Mobile PSI**: Aumento para 85-95

## 🔄 Manutenção Contínua

### Monitoramento Semanal
- Revisar métricas de Core Web Vitals
- Analisar bundle size trends
- Verificar cache hit rates
- Revisar erros de JavaScript

### Auditoria Mensal
- Executar Lighthouse audit completo
- Revisar dependências não utilizadas
- Atualizar estratégias de cache
- Otimizar novas features adicionadas

### Ferramentas Recomendadas
- **Lighthouse CI**: Integração contínua de performance
- **Bundle Analyzer**: Análise de bundle size
- **Chrome DevTools**: Profiling e debugging
- **WebPageTest**: Testes de performance reais
- **Calibre**: Monitoramento contínuo de performance

## 📚 Referências

- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Tailwind CSS Performance](https://tailwindcss.com/docs/optimizing-for-production)
- [MDN Web Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)