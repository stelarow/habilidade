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
  variants,
  whileTap,
  whileDrag,
  whileFocus,
  exit,
  drag,
  layout,
  layoutId,
  ...properties
}, reference) => {
  const fallbackStyle = {
    ...style,
    transition: 'all 0.3s ease-in-out',
    ...(whileHover && {
      cursor: 'pointer'
    })
  };

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (whileHover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (whileHover) setIsHovered(false);
  };

  const hoverStyle = globalThis.window !== undefined && isHovered && whileHover ? {
    transform: whileHover.scale ? `scale(${whileHover.scale})` : (whileHover.y ? `translateY(${whileHover.y}px)` : 'none'),
    boxShadow: whileHover.boxShadow || 'none'
  } : {};

  return (
    <div
      ref={reference}
      className={className}
      style={{ ...fallbackStyle, ...hoverStyle }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...properties}
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
  const LazyMotionComponent = forwardRef((properties, reference) => {
    const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
    const [isLoading, setIsLoading] = useState(!motionCache.has('framer-motion'));

    useEffect(() => {
      if (globalThis.window === undefined) return;

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

      if (motionModule) {
        setIsLoading(false);
      } else {
        loadMotion();
      }

      return () => {
        mounted = false;
      };
    }, [motionModule]);

    // Return fallback while loading, on server, or if motion failed to load
    if (globalThis.window === undefined || isLoading || !motionModule?.motion) {
      const fallbackProps = { ...properties };
      delete fallbackProps.initial;
      delete fallbackProps.animate;
      delete fallbackProps.whileHover;
      delete fallbackProps.whileInView;
      delete fallbackProps.viewport;
      delete fallbackProps.transition;
      delete fallbackProps.variants;
      delete fallbackProps.whileTap;
      delete fallbackProps.whileDrag;
      delete fallbackProps.whileFocus;
      delete fallbackProps.exit;
      delete fallbackProps.drag;
      delete fallbackProps.layout;
      delete fallbackProps.layoutId;

      if (elementType === 'section') {
        return <section ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'span') {
        return <span ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'p') {
        return <p ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'h1') {
        return <h1 ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'h2') {
        return <h2 ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'h3') {
        return <h3 ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'button') {
        return <button ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'img') {
        return <img ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'ul') {
        return <ul ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'li') {
        return <li ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'nav') {
        return <nav ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'header') {
        return <header ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'main') {
        return <main ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'article') {
        return <article ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'aside') {
        return <aside ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'footer') {
        return <footer ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'a') {
        return <a ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'form') {
        return <form ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'input') {
        return <input ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'textarea') {
        return <textarea ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'label') {
        return <label ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'select') {
        return <select ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'option') {
        return <option ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'svg') {
        return <svg ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'circle') {
        return <circle ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'polygon') {
        return <polygon ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'line') {
        return <line ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'path') {
        return <path ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'g') {
        return <g ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'text') {
        return <text ref={reference} {...fallbackProps} />;
      }
      if (elementType === 'rect') {
        return <rect ref={reference} {...fallbackProps} />;
      }

      return <FallbackDiv ref={reference} {...fallbackProps} />;
    }

    const MotionElement = motionModule.motion[elementType];
    return <MotionElement ref={reference} {...properties} />;
  });

  LazyMotionComponent.displayName = `LazyMotion${elementType.charAt(0).toUpperCase() + elementType.slice(1)}`;
  return LazyMotionComponent;
};

/**
 * Lazy AnimatePresence Component
 */
const LazyAnimatePresence = ({ children, ...properties }) => {
  const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
  const [isLoading, setIsLoading] = useState(!motionCache.has('framer-motion'));

  useEffect(() => {
    if (globalThis.window === undefined) return;

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

    if (motionModule) {
      setIsLoading(false);
    } else {
      loadMotion();
    }

    return () => {
      mounted = false;
    };
  }, [motionModule]);

  if (globalThis.window === undefined || isLoading || !motionModule?.AnimatePresence) {
    return <>{children}</>;
  }

  const { AnimatePresence } = motionModule;
  return <AnimatePresence {...properties}>{children}</AnimatePresence>;
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

export const useReducedMotion = () => {
  const [motionModule, setMotionModule] = useState(motionCache.get('framer-motion'));
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const mediaQuery = globalThis.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handleChange = (e) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (globalThis.window === undefined) return;

    if (!motionModule) {
      loadFramerMotion().then(module => {
        if (module?.useReducedMotion) {
          setMotionModule(module);
        }
      });
    }
  }, [motionModule]);

  if (motionModule?.useReducedMotion && globalThis.window !== undefined) {
    return motionModule.useReducedMotion();
  }

  return prefersReduced;
};

export const preloadFramerMotion = () => {
  return loadFramerMotion();
};

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
