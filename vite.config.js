import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { generateSitemap } from "./src/utils/sitemapGenerator.js"
import { createHtmlPlugin } from 'vite-plugin-html'
import { createCriticalCssPlugin } from './src/utils/critical-css-plugin.js'

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
    react({ 
      jsxRuntime: 'automatic',
      jsxImportSource: 'react'
    }),
    
    // Plugin para geração do sitemap com todas as rotas e posts
    sitemapPlugin(),
    
    // Plugin para mostrar progresso do SSG
    ssgProgressPlugin(),
    
    // Otimização de CSS crítico - experimental
    process.env.NODE_ENV === 'production' && {
      name: 'critical-css',
      generateBundle(options, bundle) {
        // Plugin customizado para CSS crítico
      }
    }
  ].filter(Boolean),

  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.DEBUG_BUILD': JSON.stringify(process.env.DEBUG_BUILD || 'false')
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'react': 'react',
      'react-dom': 'react-dom'
    }
  },

  css: {
    postcss: {
      plugins: [
        // PostCSS plugins são configurados via postcss.config.js
      ]
    }
  },

  // Configurações específicas para SSG
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    format: 'esm',
    mock: false,
    entry: path.resolve(__dirname, 'src/main.jsx'),
    dirStyle: 'nested'
  },

  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  // Configurações de build otimizadas
  build: {
    // Code splitting otimizado para performance mobile
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {

          
          // 1. React vendor (essencial) - Fase 1
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          
          // 2. Router separado - Fase 1
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router';
          }
          
          // 3. Bibliotecas pesadas - permitir chunks maiores
          if (id.includes('node_modules/html2canvas/') ||
              id.includes('node_modules/jspdf/')) {
            return 'heavy-libs';
          }
          
          // 4. Serviços externos - Fase 1 (mais conservador)
          if (id.includes('node_modules/@emailjs/')) {
            return 'external-services';
          }
          
          // 5. OTIMIZAÇÃO: Dados do blog unificados
          if (id.includes('/data/posts/') && (id.includes('.json') || id.includes('index.js'))) {
            return 'blog-data';
          }
          
          // 6. Consolidar marked e highlight.js em chunk de conteúdo
          if (id.includes('node_modules/marked/') ||
              id.includes('node_modules/highlight.js/')) {
            return 'content-libs';
          }
          
          // 7. Outras bibliotecas node_modules em chunk comum
          if (id.includes('node_modules/')) {
            return 'vendor-libs';
          }
          
          // Retornar undefined para manter no bundle principal
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
    
    // Limite de chunk size ajustado para valor moderno
    chunkSizeWarningLimit: process.env.DEBUG_BUILD === 'true' ? 10000 : 1500,
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
          criticalChunks.some(chunk => dep.includes(chunk))
        );
      }
    },
    
    // Configurações de saída
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    copyPublicDir: true
  },

  // Configurações específicas para SSR/SSG
  ssr: {
    noExternal: ['phosphor-react', '@phosphor-icons/react']
  },

  // Configurações de preview
  preview: {
    port: 4173,
    host: true,
    open: true
  },

  // Otimizações de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@emailjs/browser'
    ],
    exclude: [
      'html2canvas', // Carregamento dinâmico
      'jspdf'        // Carregamento dinâmico
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },

  // Configurações experimentais para performance
  experimental: {
    renderBuiltUrl(filename) {
      return `./${filename}`;
    }
  }
})
