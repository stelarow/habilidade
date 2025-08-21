import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { generateSitemap } from "./src/utils/sitemapGenerator.js"
import purgeCss from 'vite-plugin-purgecss'
import { createHtmlPlugin } from 'vite-plugin-html'

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

// Plugin para otimização de CSS crítico
const criticalCssPlugin = () => {
  return {
    name: 'critical-css-plugin',
    generateBundle(options, bundle) {
      // Find the main CSS file
      const cssFiles = Object.keys(bundle).filter(fileName => 
        fileName.startsWith('assets/css/') && fileName.endsWith('.css')
      );
      
      if (cssFiles.length > 0) {
        console.log('🎨 CSS files found:', cssFiles);
        // Critical CSS will be handled by HTML transformation
      }
    },
    transformIndexHtml(html) {
      // Add async CSS loading script
      const asyncCssScript = `
        <script>
          (function() {
            const cssFiles = document.querySelectorAll('link[rel="stylesheet"]');
            cssFiles.forEach(function(link) {
              if (link.href.includes('app-')) {
                // Convert to async loading
                link.media = 'print';
                link.onload = function() { this.media = 'all'; };
                
                // Add noscript fallback
                const noscript = document.createElement('noscript');
                const fallbackLink = link.cloneNode();
                fallbackLink.media = 'all';
                noscript.appendChild(fallbackLink);
                link.parentNode.insertBefore(noscript, link.nextSibling);
              }
            });
          })();
        </script>
      `;
      
      return html.replace('</head>', asyncCssScript + '</head>');
    }
  };
};


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin(),
    criticalCssPlugin(),
    ...(process.env.DEBUG_BUILD !== 'true' ? [
      purgeCss({
        content: [
          './index.html',
          './src/**/*.{js,jsx,ts,tsx}',
          './src/**/*.css'
        ],
        safelist: [
          // Preserve classes that might be added dynamically
          /^bg-/, /^text-/, /^border-/, /^hover:/, /^focus:/,
          // Keep animation classes
          /^animate-/, /^transition-/, /^transform/,
          // Blog specific classes
          /^hljs/, /^language-/, /^code/,
          // Component states
          /^active/, /^disabled/, /^loading/
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      })
    ] : []),
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
