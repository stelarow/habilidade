// Otimizações para reduzir JavaScript não utilizado

// 1. Tree shaking explícito para bibliotecas específicas
export const optimizedImports = {
  // Phosphor Icons - importar apenas os ícones necessários
  phosphorIcons: [
    'ArrowRight',
    'Check', 
    'X',
    'Menu',
    'Phone',
    'Envelope',
    'MapPin',
    'Clock',
    'Star',
    'Play',
    'Download',
    'Share',
    'Heart',
    'Eye',
    'Calendar',
    'User',
    'GraduationCap',
    'Certificate',
    'Rocket',
    'Shield',
    'Globe'
  ],

  // Lucide Icons - apenas essenciais
  lucideIcons: [
    'ChevronDown',
    'ChevronUp', 
    'ChevronRight',
    'ChevronLeft',
    'Search',
    'Filter',
    'Grid',
    'List',
    'BookOpen',
    'Users',
    'TrendingUp',
    'Award'
  ],

  // React Icons - importações específicas
  reactIcons: [
    'FaWhatsapp',
    'FaGoogle',
    'FaFacebook',
    'FaLinkedin',
    'FaInstagram',
    'FaYoutube',
    'FaArrowRight',
    'FaCheck',
    'FaStar'
  ]
};

// 2. Lazy loading para funcionalidades pesadas
export const heavyFeatures = {
  // HTML2Canvas - apenas quando necessário
  html2canvas: () => import('html2canvas'),
  
  // jsPDF - apenas para export
  jspdf: () => import('jspdf'),
  
  // Highlight.js - apenas para blog posts
  highlightjs: () => import('highlight.js'),
  
  // Framer Motion - componentes específicos
  framerMotion: {
    motion: () => import('framer-motion').then(mod => ({ motion: mod.motion })),
    AnimatePresence: () => import('framer-motion').then(mod => ({ AnimatePresence: mod.AnimatePresence })),
    useAnimation: () => import('framer-motion').then(mod => ({ useAnimation: mod.useAnimation }))
  }
};

// 3. Remover polyfills desnecessários
export const removeUnnecessaryPolyfills = () => {
  // Remove polyfills para browsers modernos
  if (typeof window !== 'undefined') {
    // Verificar se o browser suporta features modernas
    const hasModernSupport = 
      'IntersectionObserver' in window &&
      'fetch' in window &&
      'Promise' in window &&
      'Map' in window &&
      'Set' in window;

    if (hasModernSupport) {
      // Não carregar polyfills
      return true;
    }
  }
  return false;
};

// 4. Otimizar imports de bibliotecas
export const optimizedLibraryImports = {
  // Lodash - evitar importar toda a biblioteca
  lodash: {
    debounce: () => import('lodash/debounce'),
    throttle: () => import('lodash/throttle'),
    cloneDeep: () => import('lodash/cloneDeep'),
    isEqual: () => import('lodash/isEqual')
  },

  // Date-fns - apenas funções necessárias
  dateFns: {
    format: () => import('date-fns/format'),
    parseISO: () => import('date-fns/parseISO'),
    isValid: () => import('date-fns/isValid')
  }
};

// 5. Configuração para Vite - tree shaking agressivo
export const viteOptimizations = {
  define: {
    // Remover código de desenvolvimento
    __DEV__: false,
    'process.env.NODE_ENV': '"production"',
    // Remover console.log em produção
    'console.log': '(() => {})',
    'console.debug': '(() => {})',
    'console.info': '(() => {})',
    'console.warn': '(() => {})'
  },

  // Rollup optimizations
  rollupOptions: {
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  }
};

// 6. Análise de bundle - detectar código não utilizado
export const analyzeBundleUsage = () => {
  if (typeof window !== 'undefined' && window.performance) {
    // Detectar recursos não utilizados
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.transferSize && entry.transferSize > 50000) {
          console.warn(`Large bundle detected: ${entry.name} (${entry.transferSize} bytes)`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// 7. Preload seletivo baseado na rota
export const routeBasedPreloading = {
  '/': ['shared-components', 'app-utils'],
  '/blog': ['blog-api', 'blog-components'],
  '/blog/*': ['blog-api', 'blog-components', 'heavy-utils'],
  '/cursos/*': ['course-components', 'animations'],
  '/contato': ['external-services']
};

// 8. Remover bibliotecas não utilizadas do bundle final
export const unusedLibraries = [
  // Adicionar aqui bibliotecas que não são mais utilizadas
  // 'old-library-name'
];

// 9. Configuração de módulos externos (CDN)
export const externalModules = {
  // Carregar via CDN em produção para reduzir bundle size
  development: {},
  production: {
    // 'react': 'React',
    // 'react-dom': 'ReactDOM'
  }
};

// 10. Performance budget - alertas para bundles grandes
export const performanceBudget = {
  maxAssetSize: 500000, // 500KB
  maxEntrypointSize: 1000000, // 1MB
  hints: 'warning'
};