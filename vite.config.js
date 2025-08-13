import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateSitemap } from "./src/utils/sitemapGenerator.js"

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


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin()
  ],

  base: '/',
  
  // Definições para remoção de código em produção
  define: {
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  
  ssr: {
    noExternal: ['phosphor-react']
  },
  
  build: {
    // Code splitting otimizado para performance mobile
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          // Vendor chunk para bibliotecas principais (mais granular)
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Router chunk separado
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router';
          }
          // UI Libraries chunk
          if (id.includes('node_modules/@phosphor-icons/') ||
              id.includes('node_modules/lucide-react/') ||
              id.includes('node_modules/react-icons/')) {
            return 'ui-icons';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion/')) {
            return 'animations';
          }
          // Email and external services
          if (id.includes('node_modules/@emailjs/') ||
              id.includes('node_modules/@supabase/') ||
              id.includes('node_modules/axios/')) {
            return 'external-services';
          }
          // Heavy utilities (código pesado raramente usado)
          if (id.includes('node_modules/html2canvas/') ||
              id.includes('node_modules/jspdf/') ||
              id.includes('node_modules/marked/') ||
              id.includes('node_modules/highlight.js/')) {
            return 'heavy-utils';
          }
          // Utils e hooks (código próprio)
          if (id.includes('/src/hooks/') || id.includes('/src/utils/')) {
            return 'app-utils';
          }
          // Blog-specific chunk for better caching
          if (id.includes('/src/services/blogAPI.js') || 
              id.includes('/src/utils/blogCache.js') ||
              id.includes('/src/hooks/useBlogCache.js') ||
              id.includes('/src/services/cacheService.js') ||
              id.includes('/src/utils/imageOptimizer.js') ||
              id.includes('/src/services/imageService.js')) {
            return 'blog-api';
          }
          // Blog components chunk
          if (id.includes('/src/components/blog/')) {
            return 'blog-components';
          }
          // Course components chunk
          if (id.includes('/src/components/course/') ||
              id.includes('/src/pages/courses/')) {
            return 'course-components';
          }
          // Shared components chunk
          if (id.includes('/src/components/shared/') ||
              id.includes('/src/components/header/')) {
            return 'shared-components';
          }
          // Backgrounds em chunk separado (lazy load)
          if (id.includes('/src/components/backgrounds/')) {
            return 'backgrounds';
          }
        },
        // Nomes consistentes para cache
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    
    // Compressão e minificação otimizada
    minify: 'terser',
    terserOptions: {
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
    
    // Otimizações de tamanho agressivas
    chunkSizeWarningLimit: 500, // Limite menor para forçar chunks menores
    sourcemap: false,
    cssCodeSplit: true,
    
    // Otimizações de performance para mobile
    target: ['es2020', 'chrome80', 'safari13'],
    modulePreload: {
      polyfill: false
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
  
  // CSS otimizado
  css: {
    devSourcemap: false,
    modules: false
  }
})
