import { useState, useEffect, useRef } from 'react';
import observerPool from '../utils/IntersectionObserverPool';

/**
 * Hook para animações baseadas em scroll
 * Usa Singleton IntersectionObserverPool para melhor performance
 * @param {Object} options - Opções de configuração
 * @returns {Array} - [ref, isVisible, hasAnimated]
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    once = true,
    delay = 0,
    duration = 600,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleIntersection = (entry) => {
      if (entry.isIntersecting) {
        if (delay > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }, delay);
        } else {
          setIsVisible(true);
          if (once) setHasAnimated(true);
        }
      } else if (!once && !hasAnimated) {
        setIsVisible(false);
      }
    };

    // Usa o pool compartilhado ao invés de criar novo observer
    observerPool.observe(element, handleIntersection, { threshold });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observerPool.unobserve(element);
    };
  }, [threshold, once, delay, hasAnimated]);

  return [elementRef, isVisible, hasAnimated];
}

/**
 * Hook para animação de contadores
 * @param {number} end - Valor final
 * @param {number} duration - Duração em ms
 * @param {boolean} start - Se deve iniciar a animação
 * @returns {number} - Valor atual do contador
 */
export function useCounterAnimation(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start]);

  return count;
}

/**
 * Hook para animação de typewriter
 * @param {string} text - Texto para animar
 * @param {number} speed - Velocidade em ms por caractere
 * @param {boolean} start - Se deve iniciar a animação
 * @returns {string} - Texto atual
 */
export function useTypewriterAnimation(text, speed = 50, start = false) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!start || currentIndex >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [text, speed, start, currentIndex]);

  useEffect(() => {
    if (start) {
      setDisplayText('');
      setCurrentIndex(0);
    }
  }, [start, text]);

  return displayText;
}

/**
 * Hook para animação de elementos em sequência
 * @param {number} count - Número de elementos
 * @param {number} delay - Delay entre elementos
 * @param {boolean} start - Se deve iniciar a animação
 * @returns {Array} - Array de booleans indicando visibilidade
 */
export function useStaggerAnimation(count, delay = 100, start = false) {
  const [visibleItems, setVisibleItems] = useState(new Array(count).fill(false));

  useEffect(() => {
    if (!start) return;

    const timers = [];
    
    for (let i = 0; i < count; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => {
          const newItems = [...prev];
          newItems[i] = true;
          return newItems;
        });
      }, i * delay);
      
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [count, delay, start]);

  return visibleItems;
}

export default {
  useScrollAnimation,
  useCounterAnimation,
  useTypewriterAnimation,
  useStaggerAnimation,
}; 