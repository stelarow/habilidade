import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './index.css'
import './styles/fonts.css'
import { initializeErrorLogger } from './utils/frontend-error-logger'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Configuração SSG limpa - SEM client-side logic para evitar hydration mismatch
    // Toda lógica client-side foi movida para useClientOnlyEffects hook
    
    // Inicializa error logger apenas no client e em produção
    if (isClient) {
      const isDevelopment = import.meta.env.DEV;
      const isProduction = window.location.hostname === 'escolahabilidade.com' ||
                          window.location.hostname === 'www.escolahabilidade.com';

      initializeErrorLogger({
        enabled: !isDevelopment && isProduction,
        functionUrl: '/.netlify/functions/error-monitoring/log-error'
      });

      // Initialize lazy analytics loader for performance optimization
      // This will defer GTM loading to prevent main thread blocking
      if (!isDevelopment && isProduction) {
        import('./services/LazyAnalyticsLoader.js')
          .then(({ default: lazyAnalyticsLoader }) => {
            // LazyAnalyticsLoader initializes automatically on import
            console.info('[Performance] Lazy Analytics Loader initialized');
          })
          .catch(error => {
            console.warn('[Performance] Failed to load Lazy Analytics:', error);
          });
      }

    }
    
    return router;
  }
)
