import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para gerenciar ciclo de vida de animações e otimizar will-change
 * Remove will-change automaticamente quando animações terminam
 */
export default function useAnimationLifecycle({
  willChangeProps: willChangeProperties = 'opacity, transform',
  removeDelay = 100,
  onComplete = null
} = {}) {
  const elementReference = useRef(null);
  const timeoutReference = useRef(null);
  const isAnimating = useRef(false);

  // Aplicar will-change no início da animação
  const startAnimation = useCallback(() => {
    const element = elementReference.current;
    if (!element || isAnimating.current) return;
    
    isAnimating.current = true;
    element.style.willChange = willChangeProperties;
    
    // Adicionar contain para melhor performance
    element.style.contain = 'layout style paint';
    
    // Garantir que está em layer própria
    if (!element.style.transform.includes('translateZ')) {
      element.style.transform += ' translateZ(0)';
    }
  }, [willChangeProperties]);

  // Remover will-change ao final da animação
  const endAnimation = useCallback(() => {
    if (timeoutReference.current) {
      clearTimeout(timeoutReference.current);
    }
    
    timeoutReference.current = setTimeout(() => {
      const element = elementReference.current;
      if (element && isAnimating.current) {
        element.style.willChange = 'auto';
        element.style.contain = '';
        isAnimating.current = false;
        
        if (onComplete) {
          onComplete();
        }
      }
    }, removeDelay);
  }, [removeDelay, onComplete]);

  // Detectar fim de animação automaticamente
  useEffect(() => {
    const element = elementReference.current;
    if (!element) return;

    const handleAnimationEnd = () => {
      endAnimation();
    };

    const handleTransitionEnd = () => {
      endAnimation();
    };

    element.addEventListener('animationend', handleAnimationEnd);
    element.addEventListener('transitionend', handleTransitionEnd);

    return () => {
      element.removeEventListener('animationend', handleAnimationEnd);
      element.removeEventListener('transitionend', handleTransitionEnd);
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, [endAnimation]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
      const element = elementReference.current;
      if (element) {
        element.style.willChange = 'auto';
        element.style.contain = '';
      }
    };
  }, []);

  return {
    ref: elementReference,
    startAnimation,
    endAnimation,
    isAnimating: isAnimating.current
  };
} 