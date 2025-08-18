import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './index.css'
import { initializeErrorLogger } from './utils/frontend-error-logger'

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes, isClient, initialState }) => {
    // Configuração SSG limpa - SEM client-side logic para evitar hydration mismatch
    // Toda lógica client-side foi movida para useClientOnlyEffects hook
    
    // Inicializa error logger apenas no client
    if (isClient) {
      initializeErrorLogger({
        enabled: true,
        functionUrl: '/.netlify/functions/error-monitoring/log-error'
      });
    }
    
    return router;
  }
)
