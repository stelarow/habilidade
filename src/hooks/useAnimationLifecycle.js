import { useEffect, useRef, useCallback } from 'react';
import memoryManager from '../utils/memoryManager';

/**
 * Hook para gerenciar ciclo de vida de animações com memory management
 * Integra com o MemoryManager para prevenir vazamentos
 */
export const useAnimationLifecycle = (componentId, dependencies = []) => {
  const animationRef = useRef(null);
  const animationIdRef = useRef(null);
  const registeredAnimationRef = useRef(null);
  const isPausedRef = useRef(false);

  // Função para pausar animação
  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isPausedRef.current = true;
  }, []);

  // Função para retomar animação
  const resumeAnimation = useCallback((animateFunction) => {
    if (!isPausedRef.current || !animateFunction) return;
    
    isPausedRef.current = false;
    const animate = () => {
      if (!isPausedRef.current) {
        animateFunction();
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  // Função para iniciar animação
  const startAnimation = useCallback((animateFunction) => {
    if (!animateFunction) return;

    // Limpar animação anterior se existir
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    isPausedRef.current = false;
    
    const animate = () => {
      if (!isPausedRef.current) {
        animateFunction();
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Registrar no memory manager
    if (!registeredAnimationRef.current) {
      registeredAnimationRef.current = memoryManager.registerAnimation(
        `${componentId}-${Date.now()}`,
        pauseAnimation,
        () => resumeAnimation(animateFunction),
        () => {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
        }
      );
    }
  }, [componentId, pauseAnimation, resumeAnimation]);

  // Função para parar animação
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (registeredAnimationRef.current) {
      memoryManager.unregisterAnimation(registeredAnimationRef.current);
      registeredAnimationRef.current = null;
    }

    isPausedRef.current = true;
  }, []);

  // Cleanup automático
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  // Reiniciar animação quando dependências mudarem
  useEffect(() => {
    // Não fazer nada aqui, deixar para o componente decidir quando reiniciar
  }, dependencies);

  return {
    startAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation,
    isAnimating: !isPausedRef.current && !!animationRef.current,
    isPaused: isPausedRef.current
  };
};

export default useAnimationLifecycle; 