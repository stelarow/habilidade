import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook que automaticamente faz scroll para elementos com ID baseado no hash da URL
 * Funciona tanto para navegação interna quanto redirecionamentos externos
 */
function useScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    // Função para fazer scroll para o elemento
    const scrollToElement = (hash) => {
      if (!hash) return;
      
      // Remove o # do hash
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        // Aguarda um pouco para garantir que o DOM está pronto
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start' 
          });
        }, 100);
      }
    };

    // Scroll imediato se há hash na URL atual
    if (location.hash) {
      scrollToElement(location.hash);
    }

    // Listener para mudanças de hash (navegação interna)
    const handleHashChange = () => {
      scrollToElement(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]);
}

export default useScrollToHash;