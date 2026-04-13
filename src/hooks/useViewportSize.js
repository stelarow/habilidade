import { useState, useEffect } from 'react';

export const useViewportSize = () => {
  const [viewport, setViewport] = useState({
    width: globalThis.window === undefined ? 0 : window.innerWidth,
    height: globalThis.window === undefined ? 0 : window.innerHeight,
    isMobile: globalThis.window === undefined ? false : window.innerWidth < 768,
    isTablet: globalThis.window === undefined ? false : window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: globalThis.window === undefined ? false : window.innerWidth >= 1024,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', updateViewport);
    updateViewport(); // Initial call

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  return viewport;
}; 