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

      // Defer lazy analytics loader para após first paint (otimização LCP)
      if (!isDevelopment && isProduction) {
        // Usa requestIdleCallback para carregar apenas quando browser está idle
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            import('./services/LazyAnalyticsLoader.js')
              .then(({ default: lazyAnalyticsLoader }) => {
                console.info('[Performance] Lazy Analytics Loader initialized (deferred)');
              })
              .catch(error => {
                console.warn('[Performance] Failed to load Lazy Analytics:', error);
              });
          }, { timeout: 3000 });
        } else {
          // Fallback: aguarda 1s para garantir que LCP já aconteceu
          setTimeout(() => {
            import('./services/LazyAnalyticsLoader.js')
              .then(({ default: lazyAnalyticsLoader }) => {
                console.info('[Performance] Lazy Analytics Loader initialized (deferred)');
              })
              .catch(error => {
                console.warn('[Performance] Failed to load Lazy Analytics:', error);
              });
          }, 1000);
        }
      }

    }
    
    return router;
  }
)
