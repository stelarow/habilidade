import { useState, useEffect } from 'react';

/**
 * Hook para detectar o nível de performance do dispositivo
 * e preferências do usuário para otimizar animações
 */
const usePerformanceLevel = () => {
  const [performanceLevel, setPerformanceLevel] = useState('medium');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    cores: 4,
    isMobile: false,
    webglSupport: true
  });

  useEffect(() => {
    // Detectar preferência de movimento reduzido apenas uma vez
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const initialPrefersReduced = mediaQuery.matches;
    setPrefersReducedMotion(initialPrefersReduced);

    // Detectar capacidades do dispositivo uma única vez
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    
    let level = 'medium';
    if (isMobile && cores < 4) {
      level = 'low';
    } else if (cores >= 8 && !isMobile) {
      level = 'high';
    }
    
    // Não forçar 'low' para prefers-reduced-motion aqui
    // O CourseBackground vai lidar com isso diretamente

    setPerformanceLevel(level);
    setDeviceCapabilities({
      cores,
      isMobile,
      webglSupport: true
    });

    // Listener para mudanças (mas não re-detecta capacidades)
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setPerformanceLevel('low');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []); // Array vazio - executa apenas uma vez

  return {
    performanceLevel,
    prefersReducedMotion,
    deviceCapabilities,
    
    // Helpers para componentes
    shouldUseComplexAnimations: performanceLevel === 'high' && !prefersReducedMotion,
    shouldUseBasicAnimations: performanceLevel !== 'low' && !prefersReducedMotion,
    shouldUseStaticVersion: performanceLevel === 'low' || prefersReducedMotion
  };
};

export default usePerformanceLevel; 