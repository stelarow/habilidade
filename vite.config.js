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
  
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  
  ssr: {
    noExternal: ['phosphor-react']
  },
  
  build: {
    // Code splitting otimizado para 2025 com foco em blog
    rollupOptions: {
      external: [],
      output: {
        manualChunks(id) {
          // Vendor chunk para bibliotecas principais
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          // Router chunk separado
          if (id.includes('node_modules/react-router-dom/')) {
            return 'router';
          }
          // Utils e hooks
          if (id.includes('/src/hooks/') || id.includes('/src/utils/')) {
            return 'utils';
          }
          // Blog-specific chunk for better caching
          if (id.includes('/src/services/blogAPI.js') || 
              id.includes('/src/utils/blogCache.js') ||
              id.includes('/src/hooks/useBlogCache.js') ||
              id.includes('/src/services/cacheService.js') ||
              id.includes('/src/utils/imageOptimizer.js') ||
              id.includes('/src/services/imageService.js')) {
            return 'blog';
          }
          // Blog components chunk
          if (id.includes('/src/components/blog/')) {
            return 'blog-components';
          }
          // Backgrounds em chunk separado (lazy load)
          if (id.includes('/src/components/backgrounds/')) {
            return 'backgrounds';
          }
        },
        // Nomes consistentes para cache
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Compressão e minificação 
    minify: 'esbuild',
    
    // Otimizações de tamanho
    chunkSizeWarningLimit: 1000,
    sourcemap: false, // Desabilitar source maps em produção para reduzir tamanho
    cssCodeSplit: true,
    
    // Otimizações de performance
    target: ['es2020', 'chrome80', 'safari13'],
    modulePreload: {
      polyfill: false
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
  
  // Pre-bundling de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@emailjs/browser',
      'phosphor-react'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  
  // CSS otimizado
  css: {
    devSourcemap: false,
    modules: false
  }
})
