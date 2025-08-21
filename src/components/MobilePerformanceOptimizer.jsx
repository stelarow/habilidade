/**
 * Mobile Performance Optimizer Component
 * Handles anti-FOUC, progressive enhancement, and mobile-specific optimizations
 */

import { useEffect, useState } from 'react';

/**
 * Mobile Performance Optimizer Hook
 * Manages mobile-specific performance optimizations
 */
export const useMobilePerformanceOptimizer = () => {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase()) ||
                            window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
      return isMobileDevice;
    };

    const mobile = checkMobile();
    
    // Mobile-optimized readiness check
    const makeReady = () => {
      // Remove FOUC prevention class
      document.documentElement.classList.remove('fouc-prevent');
      document.documentElement.classList.add('fouc-ready');
      
      // Apply mobile-specific optimizations
      if (mobile) {
        // Optimize touch interactions
        document.body.style.touchAction = 'manipulation';
        document.body.style.webkitTouchCallout = 'none';
        
        // Prevent zoom on input focus (mobile)
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && !viewport.content.includes('user-scalable=no')) {
          viewport.content += ', user-scalable=no';
        }
      }
      
      setIsReady(true);
    };

    // Use requestAnimationFrame for smoother transition
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(makeReady);
      });
    } else {
      requestAnimationFrame(makeReady);
    }

    // Resize listener for responsive optimizations
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isReady, isMobile };
};

/**
 * Progressive Enhancement Wrapper
 * Provides fallback content while assets load
 */
export const ProgressiveEnhancer = ({ 
  children, 
  fallback = null, 
  className = '',
  enableTransition = true 
}) => {
  const { isReady, isMobile } = useMobilePerformanceOptimizer();

  const transitionClass = enableTransition 
    ? 'transition-opacity duration-300 ease-in-out' 
    : '';

  if (!isReady && fallback) {
    return (
      <div className={`${className} ${transitionClass} opacity-100`}>
        {fallback}
      </div>
    );
  }

  return (
    <div 
      className={`${className} ${transitionClass} ${isReady ? 'opacity-100' : 'opacity-0'}`}
      data-mobile={isMobile}
    >
      {children}
    </div>
  );
};

/**
 * Critical CSS Loader
 * Ensures critical styles are applied before content renders
 */
export const CriticalCssLoader = ({ children }) => {
  const [criticalLoaded, setCriticalLoaded] = useState(false);

  useEffect(() => {
    // Multiple methods to check if critical CSS is loaded
    const checkCriticalCss = () => {
      // Method 1: Check for critical CSS style tag
      const criticalStyle = document.querySelector('style[data-critical]');
      if (criticalStyle) {
        console.log('[Mobile Performance] Critical CSS detected via style tag');
        return true;
      }
      
      // Method 2: Check for data attribute
      const criticalLoaded = document.documentElement.getAttribute('data-critical-loaded');
      if (criticalLoaded === 'true') {
        console.log('[Mobile Performance] Critical CSS detected via data attribute');
        return true;
      }
      
      // Method 3: Check computed styles (basic check)
      const bodyStyles = window.getComputedStyle(document.body);
      if (bodyStyles.backgroundColor && bodyStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        console.log('[Mobile Performance] Critical CSS detected via computed styles');
        return true;
      }
      
      return false;
    };

    if (checkCriticalCss()) {
      setCriticalLoaded(true);
    } else {
      let pollCount = 0;
      const maxPolls = 50; // 500ms total
      
      // Poll for critical CSS (fallback)
      const pollInterval = setInterval(() => {
        pollCount++;
        if (checkCriticalCss()) {
          clearInterval(pollInterval);
          setCriticalLoaded(true);
        } else if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setCriticalLoaded(true);
          console.warn('[Mobile Performance] Critical CSS timeout after 500ms - proceeding with fallback');
        }
      }, 10);

      // Robust fallback timeout
      const fallbackTimeout = setTimeout(() => {
        clearInterval(pollInterval);
        setCriticalLoaded(true);
        console.warn('[Mobile Performance] Critical CSS timeout - falling back gracefully');
      }, 500);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);

  if (!criticalLoaded) {
    return (
      <div className="fouc-prevent">
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return children;
};

/**
 * Mobile-First Image Component
 * Optimizes image loading for mobile devices
 */
export const MobileOptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  ...props 
}) => {
  const { isMobile } = useMobilePerformanceOptimizer();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  // Use smaller images for mobile if available
  const optimizedSrc = isMobile && src.includes('.')
    ? src.replace(/(\.[^.]+)$/, '-mobile$1')
    : src;

  return (
    <div className={`relative ${className}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        loading={loading}
        onLoad={handleLoad}
        className={`
          transition-opacity duration-300
          ${imageLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        {...props}
        onError={(e) => {
          // Fallback to original image if mobile version fails
          if (e.target.src !== src) {
            e.target.src = src;
          }
        }}
      />
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded" />
      )}
    </div>
  );
};

/**
 * Performance Monitor (Development Only)
 * Monitors Core Web Vitals and mobile performance metrics
 */
export const PerformanceMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      let totalCLS = 0;
      let clsCount = 0;
      let lastLogTime = 0;
      const LOG_THROTTLE_MS = 2000; // Log aggregated CLS every 2 seconds
      
      // Monitor FCP, LCP, CLS
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'paint') {
            console.log(`[Mobile Performance] ${entry.name}:`, entry.startTime + 'ms');
          }
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('[Mobile Performance] LCP:', entry.startTime + 'ms');
          }
          if (entry.entryType === 'layout-shift') {
            // Only log significant CLS values and aggregate small ones
            if (entry.value > 0.01) {
              console.log('[Mobile Performance] Significant CLS detected:', entry.value.toFixed(6));
            }
            
            // Aggregate all CLS values
            totalCLS += entry.value;
            clsCount++;
            
            const now = Date.now();
            if (now - lastLogTime > LOG_THROTTLE_MS && totalCLS > 0) {
              console.log(`[Mobile Performance] CLS Summary: ${totalCLS.toFixed(6)} total (${clsCount} shifts)`);
              lastLogTime = now;
            }
          }
        });
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });

      // Log final CLS on cleanup
      return () => {
        if (totalCLS > 0) {
          console.log(`[Mobile Performance] Final CLS: ${totalCLS.toFixed(6)} (${clsCount} total shifts)`);
        }
        observer.disconnect();
      };
    }
  }, []);

  return null;
};

export default {
  useMobilePerformanceOptimizer,
  ProgressiveEnhancer,
  CriticalCssLoader,
  MobileOptimizedImage,
  PerformanceMonitor
};