/**
 * useCTAResponsive Hook - Hook para otimizações responsivas de CTAs
 * Gerencia comportamento específico para diferentes dispositivos
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook principal para responsividade de CTAs
 */
export const useCTAResponsive = (options = {}) => {
  const {
    breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    },
    enableSticky = true,
    stickyThreshold = 0.8, // 80% da página scrollada
    touchOptimization = true
  } = options;

  const [deviceType, setDeviceType] = useState('desktop');
  const [isTouch, setIsTouch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  // Detecta tipo de dispositivo
  const detectDeviceType = useCallback(() => {
    const width = window.innerWidth;
    
    if (width < breakpoints.mobile) {
      return 'mobile';
    } else if (width < breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }, [breakpoints]);

  // Detecta capacidade de touch
  const detectTouch = useCallback(() => {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }, []);

  // Calcula progresso de scroll
  const calculateScrollProgress = useCallback(() => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return height > 0 ? (winScroll / height) : 0;
  }, []);

  // Handler de resize
  const handleResize = useCallback(() => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setDeviceType(detectDeviceType());
  }, [detectDeviceType]);

  // Handler de scroll
  const handleScroll = useCallback(() => {
    const progress = calculateScrollProgress();
    setScrollProgress(progress);
    
    if (enableSticky && deviceType === 'mobile') {
      setShowSticky(progress >= stickyThreshold);
    }
  }, [calculateScrollProgress, enableSticky, deviceType, stickyThreshold]);

  // Configuração inicial e listeners
  useEffect(() => {
    setDeviceType(detectDeviceType());
    setIsTouch(detectTouch());
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleResize, handleScroll, detectDeviceType, detectTouch]);

  // Configurações específicas por dispositivo
  const getDeviceConfig = useCallback(() => {
    const baseConfig = {
      buttonSize: 'medium',
      spacing: 'normal',
      animation: 'normal',
      layout: 'horizontal'
    };

    switch (deviceType) {
      case 'mobile':
        return {
          ...baseConfig,
          buttonSize: 'large',
          spacing: 'compact',
          animation: isTouch ? 'reduced' : 'normal',
          layout: 'vertical',
          minTouchTarget: 48,
          stackContent: true
        };
      
      case 'tablet':
        return {
          ...baseConfig,
          buttonSize: 'medium',
          spacing: 'normal',
          minTouchTarget: 44,
          stackContent: viewport.width < 900
        };
      
      default:
        return {
          ...baseConfig,
          buttonSize: 'medium',
          spacing: 'normal',
          minTouchTarget: 40,
          stackContent: false
        };
    }
  }, [deviceType, isTouch, viewport.width]);

  // Estilos CSS otimizados para o dispositivo atual
  const getResponsiveStyles = useCallback(() => {
    const config = getDeviceConfig();
    
    return {
      container: {
        padding: config.spacing === 'compact' ? '1rem' : '1.5rem',
        margin: config.spacing === 'compact' ? '1rem 0' : '1.5rem 0'
      },
      button: {
        minHeight: `${config.minTouchTarget}px`,
        fontSize: config.buttonSize === 'large' ? '1.125rem' : '1rem',
        padding: config.buttonSize === 'large' ? '1rem 1.5rem' : '0.75rem 1.25rem',
        width: config.stackContent ? '100%' : 'auto'
      },
      layout: {
        flexDirection: config.layout === 'vertical' ? 'column' : 'row',
        gap: config.spacing === 'compact' ? '1rem' : '1.5rem'
      }
    };
  }, [getDeviceConfig]);

  // Classes CSS para aplicar
  const getResponsiveClasses = useCallback(() => {
    const config = getDeviceConfig();
    
    return {
      container: [
        'cta-container',
        `cta-${deviceType}`,
        isTouch && 'cta-touch',
        config.stackContent && 'cta-stacked'
      ].filter(Boolean).join(' '),
      
      button: [
        'cta-button',
        `cta-button-${config.buttonSize}`,
        config.animation === 'reduced' && 'cta-reduced-motion'
      ].filter(Boolean).join(' ')
    };
  }, [getDeviceConfig, deviceType, isTouch]);

  return {
    // Estado do dispositivo
    deviceType,
    isTouch,
    viewport,
    scrollProgress,
    showSticky,
    
    // Configurações
    config: getDeviceConfig(),
    styles: getResponsiveStyles(),
    classes: getResponsiveClasses(),
    
    // Utilidades
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    shouldStack: getDeviceConfig().stackContent,
    
    // Métricas de performance
    metrics: {
      viewportRatio: viewport.width / viewport.height,
      isLandscape: viewport.width > viewport.height,
      isPortrait: viewport.height > viewport.width,
      pixelDensity: window.devicePixelRatio || 1
    }
  };
};

/**
 * Hook para otimizações de performance de CTAs
 */
export const useCTAPerformance = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [loadTime, setLoadTime] = useState(null);

  useEffect(() => {
    const startTime = performance.now();
    
    const timer = setTimeout(() => {
      const endTime = performance.now();
      setLoadTime(endTime - startTime);
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const markInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  return {
    isVisible,
    hasInteracted,
    loadTime,
    markInteraction,
    performanceMetrics: {
      timeToVisible: loadTime,
      hasUserEngagement: hasInteracted
    }
  };
};

/**
 * Hook para gerenciamento de imagens responsivas em CTAs
 */
export const useCTAImages = (images = {}) => {
  const { deviceType, viewport } = useCTAResponsive();
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());

  // Seleciona imagem apropriada para o dispositivo
  const getOptimalImage = useCallback((imageSet) => {
    if (!imageSet) return null;

    // Se é uma string simples, retorna ela
    if (typeof imageSet === 'string') return imageSet;

    // Seleciona baseado no dispositivo e densidade de pixels
    const pixelRatio = window.devicePixelRatio || 1;
    const isHighDPI = pixelRatio >= 2;

    if (deviceType === 'mobile') {
      return imageSet.mobile || imageSet.small || imageSet.default;
    } else if (deviceType === 'tablet') {
      return imageSet.tablet || imageSet.medium || imageSet.default;
    } else {
      const desktopImage = isHighDPI ? imageSet.desktopRetina : imageSet.desktop;
      return desktopImage || imageSet.large || imageSet.default;
    }
  }, [deviceType]);

  // Pré-carrega imagem
  const preloadImage = useCallback((src) => {
    if (!src || loadedImages.has(src)) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve(src);
      };
      
      img.onerror = () => {
        setImageErrors(prev => new Set([...prev, src]));
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      img.src = src;
    });
  }, [loadedImages]);

  return {
    getOptimalImage,
    preloadImage,
    isImageLoaded: (src) => loadedImages.has(src),
    hasImageError: (src) => imageErrors.has(src),
    loadedImages: Array.from(loadedImages),
    imageErrors: Array.from(imageErrors)
  };
};

/**
 * Hook para A/B testing de CTAs
 */
export const useCTAVariant = (testConfig = {}) => {
  const {
    variants = ['A', 'B'],
    distribution = [0.5, 0.5],
    persistKey = 'cta_variant',
    forceVariant = null
  } = testConfig;

  const [currentVariant, setCurrentVariant] = useState(() => {
    // Se há uma variante forçada, use ela
    if (forceVariant && variants.includes(forceVariant)) {
      return forceVariant;
    }

    // Tenta recuperar do localStorage
    try {
      const stored = localStorage.getItem(persistKey);
      if (stored && variants.includes(stored)) {
        return stored;
      }
    } catch (error) {
      console.warn('Error reading CTA variant from localStorage:', error);
    }

    // Seleciona aleatoriamente baseado na distribuição
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < variants.length; i++) {
      cumulative += distribution[i] || (1 / variants.length);
      if (random <= cumulative) {
        const selectedVariant = variants[i];
        
        // Persiste a escolha
        try {
          localStorage.setItem(persistKey, selectedVariant);
        } catch (error) {
          console.warn('Error saving CTA variant to localStorage:', error);
        }
        
        return selectedVariant;
      }
    }

    return variants[0]; // Fallback
  });

  return {
    variant: currentVariant,
    isVariant: (variantName) => currentVariant === variantName,
    setVariant: (variantName) => {
      if (variants.includes(variantName)) {
        setCurrentVariant(variantName);
        try {
          localStorage.setItem(persistKey, variantName);
        } catch (error) {
          console.warn('Error saving CTA variant:', error);
        }
      }
    }
  };
};

export default useCTAResponsive;