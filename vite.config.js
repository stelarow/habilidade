import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Otimização do React para produção
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? [
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ] : []
      }
    })
  ],
  base: '/',
  
  build: {
    // Code splitting otimizado para 2025
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk para bibliotecas principais
          vendor: ['react', 'react-dom'],
          // Router chunk separado
          router: ['react-router-dom'],
          // Utils e hooks
          utils: [
            './src/hooks/useInView.js',
            './src/hooks/useViewportSize.js',
            './src/hooks/usePerformanceLevel.js',
            './src/utils/memoryManager.js'
          ],
          // Backgrounds em chunk separado (lazy load)
          backgrounds: [
            './src/components/backgrounds/IABackground.jsx',
            './src/components/backgrounds/DesignGraficoBackground.jsx',
            './src/components/backgrounds/InformaticaBackground.jsx',
            './src/components/backgrounds/ProgramacaoBackground.jsx',
            './src/components/backgrounds/MarketingDigitalBackground.jsx',
            './src/components/backgrounds/BIBackground.jsx',
            './src/components/backgrounds/EdicaoVideoBackground.jsx',
            './src/components/backgrounds/Projetista3DBackground.jsx'
          ]
        },
        // Nomes consistentes para cache
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Compressão e minificação avançada
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        unused: true,
        dead_code: true
      },
      format: {
        comments: false
      }
    },
    
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
