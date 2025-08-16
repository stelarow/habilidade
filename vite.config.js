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
          console.log('🔧 CHUNK PROCESSING:', id);
          
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
          
          // 3. Bibliotecas pesadas (lazy load) - Fase 1
          if (id.includes('node_modules/html2canvas/') ||
              id.includes('node_modules/jspdf/')) {
            console.log('✅ HEAVY UTILS CHUNK:', id);
            return 'heavy-utils';
          }
          
          // 4. Serviços externos - Fase 1 (mais conservador)
          if (id.includes('node_modules/@emailjs/')) {
            console.log('✅ EXTERNAL SERVICES CHUNK:', id);
            return 'external-services';
          }
          
          // IMPORTANTE: NÃO dividir marked e highlight.js inicialmente
          // Eles podem ser necessários para renderização do blog
          if (id.includes('node_modules/marked/') ||
              id.includes('node_modules/highlight.js/')) {
            console.log('⚠️ KEEPING IN MAIN BUNDLE (blog critical):', id);
            return undefined; // Manter no bundle principal
          }
          
          // Log para outros modules importantes
          if (id.includes('node_modules/')) {
            console.log('📦 OTHER MODULE (main bundle):', id);
          }
          
          // Retornar undefined para manter no bundle principal (mais seguro)
          return undefined;
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
