import { useEffect } from 'react';
import useGoogleAnalytics from '../hooks/useGoogleAnalytics';
import useScrollToHash from '../hooks/useScrollToHash';
import useUrlCleanup from '../hooks/useUrlCleanup';

/**
 * Componente que executa efeitos não-críticos após o render inicial
 * Melhora LCP ao adiar hooks pesados
 */
function DeferredEffects() {
  // Esses hooks executam apenas quando o componente é montado
  // (que acontece após requestIdleCallback no Layout)
  useGoogleAnalytics();
  useScrollToHash();
  useUrlCleanup();

  return null; // Não renderiza nada
}

export default DeferredEffects;
