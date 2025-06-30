import { useState, useEffect } from 'react';

/**
 * Hook para detectar o nível de performance do dispositivo
 * e preferências do usuário para otimizar animações
 */
export const usePerformanceLevel = () => {
  const [performanceLevel, setPerformanceLevel] = useState('medium');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState(null);

  useEffect(() => {
    // Detectar preferência de movimento reduzido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Detectar capacidades do dispositivo
    const detectDeviceCapabilities = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      const capabilities = {
        // Memória aproximada (estimativa baseada em navigator.hardwareConcurrency)
        estimatedRAM: navigator.hardwareConcurrency * 0.5, // GB aproximados
        
        // Suporte a WebGL
        webglSupport: !!gl,
        
        // Detecção de GPU (se disponível)
        gpuInfo: gl ? gl.getParameter(gl.RENDERER) : 'unknown',
        
        // Cores do processador
        cores: navigator.hardwareConcurrency || 4,
        
        // Tipo de conexão
        connectionType: navigator.connection?.effectiveType || 'unknown',
        
        // Largura de banda
        downlink: navigator.connection?.downlink || 1,
        
        // Se é mobile
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        
        // Densidade de pixels
        pixelRatio: window.devicePixelRatio || 1
      };

      setDeviceCapabilities(capabilities);

      // Determinar nível de performance baseado nas capacidades
      let level = 'medium';
      
      if (capabilities.isMobile && capabilities.estimatedRAM < 3) {
        level = 'low';
      } else if (capabilities.cores >= 8 && capabilities.webglSupport && !capabilities.isMobile) {
        level = 'high';
      } else if (capabilities.cores >= 4 && capabilities.webglSupport) {
        level = 'medium';
      } else {
        level = 'low';
      }

      // Se usuário prefere movimento reduzido, sempre usar low
      if (mediaQuery.matches) {
        level = 'low';
      }

      setPerformanceLevel(level);
    };

    detectDeviceCapabilities();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Função para forçar um nível específico (útil para testes)
  const setCustomPerformanceLevel = (level) => {
    if (['low', 'medium', 'high'].includes(level)) {
      setPerformanceLevel(level);
    }
  };

  return {
    performanceLevel,
    prefersReducedMotion,
    deviceCapabilities,
    setCustomPerformanceLevel,
    
    // Helpers para componentes
    shouldUseComplexAnimations: performanceLevel === 'high' && !prefersReducedMotion,
    shouldUseBasicAnimations: performanceLevel !== 'low' && !prefersReducedMotion,
    shouldUseStaticVersion: performanceLevel === 'low' || prefersReducedMotion
  };
};

export default usePerformanceLevel; 