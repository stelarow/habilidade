/**
 * Lazy Motion - Dynamic loading wrapper for Framer Motion
 * Reduces initial bundle size by loading motion components on demand
 * Provides fallback components during loading for smooth UX
 */

import React, { useState, useEffect, forwardRef } from 'react';

// Cache for loaded Framer Motion modules
const motionCache = new Map();
const loadingPromises = new Map();

/**
 * Dynamic import of Framer Motion with caching
 */
const loadFramerMotion = async () => {
  if (motionCache.has('framer-motion')) {
    return motionCache.get('framer-motion');
  }

  if (loadingPromises.has('framer-motion')) {
    return loadingPromises.get('framer-motion');
  }

  const loadPromise = import('framer-motion').then(module => {
    motionCache.set('framer-motion', module);
    loadingPromises.delete('framer-motion');
    return module;
  }).catch(error => {
    console.warn('Failed to load framer-motion:', error);
    loadingPromises.delete('framer-motion');
    return null;
  });

  loadingPromises.set('framer-motion', loadPromise);
  return loadPromise;
};

/**
 * Fallback component during motion loading
 * Uses basic CSS transitions to maintain visual consistency
 */
const FallbackDiv = forwardRef(({ 
  children, 
  className = '', 
  style = {},
  initial,
  animate,
  whileHover,
  whileInView,
  viewport,
  transition,
  ...props 
}, ref) => {
  // Remove motion-specific props before passing to DOM
  const { 
    initial: _, 
    animate: __, 
    whileHover: ___, 
    whileInView: ____, 
    viewport: _____, 
    transition: ______, 
    ...domProps 
  } = props;

  const fallbackStyle = {
    ...style,
    transition: 'all 0.3s ease-in-out',
    ...(whileHover && {
      cursor: 'pointer'
    })
  };

  // Only use state on client side
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (whileHover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (whileHover) setIsHovered(false);
  };

  const hoverStyle = typeof window !== 'undefined' && isHovered && whileHover ? {
    transform: whileHover.scale ? `scale(${whileHover.scale})` : whileHover.y ? `translateY(${whileHover.y}px)` : 'none',
    boxShadow: whileHover.boxShadow || 'none'
  } : {};

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...fallbackStyle, ...hoverStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...domProps}
    >
      {children}
    </div>
  );
});

FallbackDiv.displayName = 'FallbackDiv';

/**
 * Lazy Motion Component Factory
 * Creates motion components that load Framer Motion dynamically
 */
const createLazyMotionComponent = (elementType = 'div') => {
  const LazyMotionComponent = forwardRef((props, ref) => {
    const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
    const [isLoading, setIsLoading] = useState(!motionCache.has('framer-motion'));

    useEffect(() => {
      if (typeof window === 'undefined') return; // Skip on server
      
      let mounted = true;

      const loadMotion = async () => {
        try {
          const module = await loadFramerMotion();
          if (mounted && module) {
            setMotionModule(module);
          }
        } catch (error) {
          console.warn('Error loading framer-motion:', error);
        } finally {
          if (mounted) {
            setIsLoading(false);
          }
        }
      };

      if (!motionModule) {
        loadMotion();
      } else {
        setIsLoading(false);
      }

      return () => {
        mounted = false;
      };
    }, [motionModule]);

    // Return fallback while loading, on server, or if motion failed to load
    if (typeof window === 'undefined' || isLoading || !motionModule?.motion) {
      // Remove motion-specific props for fallback
      const { 
        initial, 
        animate, 
        whileHover, 
        whileInView, 
        viewport, 
        transition,
        variants,
        whileTap,
        whileDrag,
        whileFocus,
        exit,
        drag,
        layout,
        layoutId,
        style,
        ...fallbackProps 
      } = props;

      if (elementType === 'section') {
        return <section ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'span') {
        return <span ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'p') {
        return <p ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'h1') {
        return <h1 ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'h2') {
        return <h2 ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'h3') {
        return <h3 ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'button') {
        return <button ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'img') {
        return <img ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'ul') {
        return <ul ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'li') {
        return <li ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'nav') {
        return <nav ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'header') {
        return <header ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'main') {
        return <main ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'article') {
        return <article ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'aside') {
        return <aside ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'footer') {
        return <footer ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'a') {
        return <a ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'form') {
        return <form ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'input') {
        return <input ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'textarea') {
        return <textarea ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'label') {
        return <label ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'select') {
        return <select ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'option') {
        return <option ref={ref} {...fallbackProps} />;
      }
      // SVG elements
      if (elementType === 'svg') {
        return <svg ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'circle') {
        return <circle ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'polygon') {
        return <polygon ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'line') {
        return <line ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'path') {
        return <path ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'g') {
        return <g ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'text') {
        return <text ref={ref} {...fallbackProps} />;
      }
      if (elementType === 'rect') {
        return <rect ref={ref} {...fallbackProps} />;
      }
      
      // Default to div with enhanced behavior only on client
      return <FallbackDiv ref={ref} {...props} />;
    }

    // Return actual motion component
    const MotionElement = motionModule.motion[elementType];
    return <MotionElement ref={ref} {...props} />;
  });

  LazyMotionComponent.displayName = `LazyMotion${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`;
  return LazyMotionComponent;
};

/**
 * Lazy AnimatePresence Component
 */
const LazyAnimatePresence = ({ children, ...props }) => {
  const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
  const [isLoading, setIsLoading] = useState(!motionCache.has('framer-motion'));

  useEffect(() => {
    if (typeof window === 'undefined') return; // Skip on server
    
    let mounted = true;

    const loadMotion = async () => {
      try {
        const module = await loadFramerMotion();
        if (mounted && module) {
          setMotionModule(module);
        }
      } catch (error) {
        console.warn('Error loading framer-motion:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    if (!motionModule) {
      loadMotion();
    } else {
      setIsLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [motionModule]);

  // Return children without animation wrapper while loading or on server
  if (typeof window === 'undefined' || isLoading || !motionModule?.AnimatePresence) {
    return <>{children}</>;
  }

  // Return actual AnimatePresence
  const { AnimatePresence } = motionModule;
  return <AnimatePresence {...props}>{children}</AnimatePresence>;
};

// Export lazy motion components
export const motion = {
  div: createLazyMotionComponent('div'),
  section: createLazyMotionComponent('section'),
  span: createLazyMotionComponent('span'),
  p: createLazyMotionComponent('p'),
  h1: createLazyMotionComponent('h1'),
  h2: createLazyMotionComponent('h2'),
  h3: createLazyMotionComponent('h3'),
  button: createLazyMotionComponent('button'),
  img: createLazyMotionComponent('img'),
  ul: createLazyMotionComponent('ul'),
  li: createLazyMotionComponent('li'),
  nav: createLazyMotionComponent('nav'),
  header: createLazyMotionComponent('header'),
  main: createLazyMotionComponent('main'),
  article: createLazyMotionComponent('article'),
  aside: createLazyMotionComponent('aside'),
  footer: createLazyMotionComponent('footer'),
  a: createLazyMotionComponent('a'),
  form: createLazyMotionComponent('form'),
  input: createLazyMotionComponent('input'),
  textarea: createLazyMotionComponent('textarea'),
  label: createLazyMotionComponent('label'),
  select: createLazyMotionComponent('select'),
  option: createLazyMotionComponent('option'),
  // SVG elements
  svg: createLazyMotionComponent('svg'),
  circle: createLazyMotionComponent('circle'),
  polygon: createLazyMotionComponent('polygon'),
  line: createLazyMotionComponent('line'),
  path: createLazyMotionComponent('path'),
  g: createLazyMotionComponent('g'),
  text: createLazyMotionComponent('text'),
  rect: createLazyMotionComponent('rect')
};

export const AnimatePresence = LazyAnimatePresence;

/**
 * Hook to check if Framer Motion is loaded
 */
export const useMotionReady = () => {
  const [isReady, setIsReady] = useState(motionCache.has('framer-motion'));

  useEffect(() => {
    if (isReady) return;

    loadFramerMotion().then(module => {
      if (module) {
        setIsReady(true);
      }
    });
  }, [isReady]);

  return isReady;
};

/**
 * Lazy useReducedMotion hook
 * Falls back to media query check if Framer Motion isn't loaded
 */
export const useReducedMotion = () => {
  const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Fallback check using media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!motionModule) {
      loadFramerMotion().then(module => {
        if (module?.useReducedMotion) {
          setMotionModule(module);
        }
      });
    }
  }, [motionModule]);

  // Use Framer Motion's hook if available, otherwise use fallback
  if (motionModule?.useReducedMotion && typeof window !== 'undefined') {
    return motionModule.useReducedMotion();
  }

  return prefersReduced;
};

/**
 * Preload Framer Motion (for strategic preloading)
 */
export const preloadFramerMotion = () => {
  return loadFramerMotion();
};

/**
 * Get motion loading stats (for debugging)
 */
export const getMotionStats = () => {
  return {
    cached: motionCache.has('framer-motion'),
    loading: loadingPromises.has('framer-motion'),
    cacheSize: motionCache.size
  };
};

export default {
  motion,
  AnimatePresence,
  useMotionReady,
  useReducedMotion,
  preloadFramerMotion,
  getMotionStats
};