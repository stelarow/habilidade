import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { generateSitemap } from "./src/utils/sitemapGenerator.js"
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
      } catch (error) {
        console.warn('Sitemap generation failed:', error.message);
      }
    }
  };
};

// SSG progress logger plugin (minimal output)
const ssgProgressPlugin = () => {
  return {
    name: 'ssg-progress-logger'
  };
};

// Advanced Critical CSS Plugin - Mobile Performance Optimized


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin(),
    ssgProgressPlugin(),
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

  //
  server: {
    hmr: {
      overlay: false
    },
    // Configuração para SPA - redirecionar todas as rotas para index.html
    historyApiFallback: true
  },

  // Configurações de build otimizadas
  build: {
    // Code splitting otimizado para performance mobile
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          // React vendor (essencial)
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }

          // Router separado
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router';
          }

          // Serviços externos
          if (id.includes('node_modules/@emailjs/')) {
            return 'external-services';
          }

          // Dados do blog unificados
          if (id.includes('/data/posts/') && (id.includes('.json') || id.includes('index.js'))) {
            return 'blog-data';
          }

          // marked e highlight.js - manter no bundle principal (blog critical)
          if (id.includes('node_modules/marked/') ||
              id.includes('node_modules/highlight.js/')) {
            return undefined;
          }

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
    chunkSizeWarningLimit: process.env.DEBUG_BUILD === 'true' ? 10000 : 1500, // Increased from 500KB to 1500KB for better chunk utilization, // Limite maior para debug
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

  ssr: {
    noExternal: [
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
