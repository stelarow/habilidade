/**
 * High-Performance Image Component
 * Fixes the performance issues in the original OptimizedImage
 */

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';

const OptimizedImage = memo(({
  src,
  alt = '',
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  placeholder = 'blur',
  quality = 80,
  objectFit = 'cover',
  onLoad,
  onError,
  lazy = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const [currentSrc, setCurrentSrc] = useState(priority ? src : null);
  
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate responsive image URLs
  const generateSrcSet = useCallback((baseSrc) => {
    if (!baseSrc) return '';
    
    const breakpoints = [400, 800, 1200, 1600];
    const urls = breakpoints.map(bp => {
      // Simple query parameter approach - works with most CDNs
      const separator = baseSrc.includes('?') ? '&' : '?';
      return `${baseSrc}${separator}w=${bp}&q=${quality} ${bp}w`;
    });
    
    return urls.join(', ');
  }, [quality]);

  // Generate WebP source if supported
  const generateWebPSrc = useCallback((baseSrc) => {
    if (!baseSrc || !supportsWebP()) return null;
    const separator = baseSrc.includes('?') ? '&' : '?';
    return `${baseSrc}${separator}format=webp&q=${quality}`;
  }, [quality]);

  // Simple WebP support detection
  const supportsWebP = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > 0;
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const currentImg = imgRef.current;
    if (!currentImg) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setCurrentSrc(src);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    observerRef.current.observe(currentImg);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, priority, isInView, src]);

  // Handle image load
  const handleLoad = useCallback((event) => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.(event);
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback((event) => {
    setIsError(true);
    onError?.(event);
  }, [onError]);

  // Generate placeholder styles
  const placeholderStyles = {
    backgroundColor: '#f3f4f6',
    backgroundImage: placeholder === 'blur' 
      ? 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%)'
      : undefined,
    backgroundSize: placeholder === 'blur' ? '20px 20px' : undefined,
    backgroundPosition: placeholder === 'blur' ? '0 0, 0 10px' : undefined,
    transition: 'opacity 0.3s ease'
  };

  // Container styles
  const containerStyles = {
    position: 'relative',
    overflow: 'hidden',
    display: width && height ? 'inline-block' : 'block',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto'
  };

  // Image styles
  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  // If not in view and lazy loading, show placeholder
  if (!isInView && lazy && !priority) {
    return (
      <div 
        ref={imgRef}
        className={`optimized-image-placeholder ${className}`}
        style={{
          ...containerStyles,
          ...placeholderStyles
        }}
        {...props}
      >
        {placeholder === 'blur' && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={containerStyles}
      {...props}
    >
      {/* Placeholder */}
      <div 
        className="absolute inset-0"
        style={{
          ...placeholderStyles,
          opacity: isLoaded ? 0 : 1
        }}
        aria-hidden="true"
      />

      {/* Main Image */}
      {currentSrc && (
        <picture>
          {/* WebP source if supported */}
          {generateWebPSrc(currentSrc) && (
            <source
              type="image/webp"
              srcSet={generateSrcSet(generateWebPSrc(currentSrc))}
              sizes={sizes}
            />
          )}
          
          {/* Fallback source */}
          <source
            srcSet={generateSrcSet(currentSrc)}
            sizes={sizes}
          />
          
          <img
            src={currentSrc}
            alt={alt}
            style={imageStyles}
            loading={lazy && !priority ? 'lazy' : 'eager'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            width={width}
            height={height}
          />
        </picture>
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
          <div className="text-center">
            <svg 
              className="w-8 h-8 mx-auto mb-2 opacity-50" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            Imagem não disponível
          </div>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Preload critical images
export const preloadImage = (src, options = {}) => {
  const { formats = ['webp'], priority = true } = options;
  
  if (!priority || typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  // Add to head if not already present
  const existing = document.head.querySelector(`link[href="${src}"]`);
  if (!existing) {
    document.head.appendChild(link);
  }
};

// HOC for automatic optimization
export const withImageOptimization = (Component) => {
  const OptimizedComponent = React.forwardRef((props, ref) => {
    // Replace img tags with OptimizedImage
    const optimizedProps = { ...props };
    
    if (props.children) {
      optimizedProps.children = React.Children.map(props.children, child => {
        if (React.isValidElement(child) && child.type === 'img') {
          return <OptimizedImage {...child.props} />;
        }
        return child;
      });
    }

    return <Component ref={ref} {...optimizedProps} />;
  });

  OptimizedComponent.displayName = `withImageOptimization(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

export default OptimizedImage;