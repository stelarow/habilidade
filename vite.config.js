import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { generateSitemap } from "./src/utils/sitemapGenerator.js"
import { createHtmlPlugin } from 'vite-plugin-html'
import { createCriticalCssPlugin } from './src/utils/critical-css-plugin.js'
import { createSSGCriticalCSSPlugin } from './src/utils/ssg-critical-css-plugin.js'
import { createSafeCopyPlugin } from './src/utils/safe-copy-plugin.js'
import { createProgressiveHydrationPlugin } from './src/utils/progressive-hydration-plugin.js'

// Custom plugin for sitemap generation
const sitemapPlugin = () => {
  return {
    name: 'sitemap-plugin',
    generateBundle: async function() {
      try {
        const sitemap = await generateSitemap();
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: sitemap
        });
        console.log('Sitemap generated successfully');
      } catch (error) {
        console.warn('Failed to generate sitemap:', error);
      }
    }
  };
};

// SSG progress logger plugin (no force exit)
const ssgProgressPlugin = () => {
  let isSSR = false;
  return {
    name: 'ssg-progress-logger',
    configResolved(config) {
      isSSR = config.build.ssr;
    },
    writeBundle() {
      if (isSSR) {
        console.log('🎯 SSR build completed, preparing for SSG rendering...');
      } else {
        console.log('🎯 Client build completed');
      }
    },
    closeBundle() {
      if (isSSR) {
        console.log('🏁 SSG build process ready for page rendering');
      }
    }
  };
};

// Advanced Critical CSS Plugin - Mobile Performance Optimized


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin(),
    ssgProgressPlugin(), // Log SSG build progress without force exit
    createSafeCopyPlugin(), // Safe copy plugin to handle file copying with retry
    createProgressiveHydrationPlugin(), // Progressive hydration optimization
    // Critical CSS plugins in correct order
    createCriticalCssPlugin(), // Analyzes bundles and prepares for SSG
    createSSGCriticalCSSPlugin(), // Post-processes HTML after SSG
    createHtmlPlugin({
      minify: process.env.DEBUG_BUILD !== 'true'
    })
  ],

base: '/',
  
  // Definições condicionais baseadas em DEBUG_BUILD
  define: {
    __DEV__: process.env.DEBUG_BUILD === 'true',
    'process.env.NODE_ENV': JSON.stringify(process.env.DEBUG_BUILD === 'true' ? 'development' : 'production')
  },
  
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  
  ssr: {
    noExternal: [
      'phosphor-react',
      '@phosphor-icons/react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-separator',
      '@radix-ui/react-tabs',
      '@radix-ui/react-icons',
      'class-variance-authority'
    ]
  },
  
  build: {
    // Code splitting otimizado para performance mobile
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {

          
          // 1. React vendor (essencial) - Fase 1
          if (id.includes('node_modules/react/') || 
              id.includes('node_modules/react-dom/')) {
            console.log('✅ REACT VENDOR CHUNK:', id);
            return 'react-vendor';
          }
          
          // 2. Router separado - Fase 1
          if (id.includes('node_modules/react-router-dom/')) {
            console.log('✅ ROUTER CHUNK:', id);
            return 'router';
          }
          
          // 3. Bibliotecas pesadas - REMOVIDO: Permitir lazy loading verdadeiro
          // html2canvas e jspdf agora são carregados dinamicamente apenas quando necessário
          
          // 4. Serviços externos - Fase 1 (mais conservador)
          if (id.includes('node_modules/@emailjs/')) {
            console.log('✅ EXTERNAL SERVICES CHUNK:', id);
            return 'external-services';
          }
          
          // 5. OTIMIZAÇÃO: Dados do blog unificados
          if (id.includes('/data/posts/') && (id.includes('.json') || id.includes('index.js'))) {
            console.log('📝 BLOG DATA CHUNK:', id);
            return 'blog-data';
          }
          
          // IMPORTANTE: NÃO dividir marked e highlight.js inicialmente
          // Eles podem ser necessários para renderização do blog
          if (id.includes('node_modules/marked/') ||
              id.includes('node_modules/highlight.js/')) {
            console.log('⚠️ KEEPING IN MAIN BUNDLE (blog critical):', id);
            return undefined; // Manter no bundle principal
          }
          
          // Log para outros modules importantes

          
          // Retornar undefined para manter no bundle principal (mais seguro)
          return undefined;
        },
        // Nomes consistentes para cache
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Compressão e minificação condicional para debug
    minify: process.env.DEBUG_BUILD === 'true' ? false : 'terser',
    terserOptions: process.env.DEBUG_BUILD === 'true' ? undefined : {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        unused: true,
        dead_code: true
      },
      mangle: true,
      format: {
        comments: false
      }
    },
    
    // Otimizações de tamanho agressivas (desabilitadas no debug)
    chunkSizeWarningLimit: process.env.DEBUG_BUILD === 'true' ? 10000 : 500, // Limite maior para debug
    sourcemap: process.env.DEBUG_BUILD === 'true' ? true : false, // Sourcemaps para debug
    cssCodeSplit: true,
    
    // Otimizações de performance para mobile
    target: ['es2020', 'chrome80', 'safari13'],
    modulePreload: {
      polyfill: false,
      // Progressive hydration: only preload critical chunks
      resolveDependencies: (url, deps, { hostType }) => {
        const criticalChunks = ['react-vendor', 'router', 'external-services'];
        return deps.filter(dep =>
          criticalChunks.some(chunk => dep.includes(chunk)) ||
          dep.includes('main') ||
          dep.includes('index')
        );
      }
    },
    
    // Tree shaking agressivo
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },
  
  // Otimizações para desenvolvimento
  server: {
    hmr: {
      overlay: false
    },
    // Configuração para SPA - redirecionar todas as rotas para index.html
    historyApiFallback: true
  },
  
  // Pre-bundling de dependências otimizado
  optimizeDeps: {
    include: [
      'react/jsx-runtime',
      'react-dom/client',
      'react-router-dom',
      '@emailjs/browser'
    ],
    exclude: [
      '@vite/client', 
      '@vite/env',
      // Lazy load heavy libraries
      'html2canvas',
      'jspdf',
      'highlight.js',
      'framer-motion'
    ],
    // Force rebuild when dependencies change
    force: false
  },
  
  // CSS otimizado para mobile performance com code splitting avançado
  css: {
    devSourcemap: false,
    modules: false,
    // Configurações avançadas para otimização de CSS
    preprocessorOptions: {
      css: {
        charset: false // Remove charset declarations for smaller files
      }
    }
  }
})
