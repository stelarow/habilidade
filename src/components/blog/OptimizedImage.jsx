/**
 * OptimizedImage - Advanced responsive image component with multiple format support
 * Features: WebP/AVIF support, lazy loading, blur placeholders, intersection observer
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getImageOptimizer } from '../../utils/imageOptimizer.js';

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  width,
  height,
  sizes = '100vw',
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  quality = 80,
  formats = ['avif', 'webp', 'jpg'],
  breakpoints = [640, 768, 1024, 1280, 1536],
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(null);
  const [isInView, setIsInView] = useState(priority); // If priority, load immediately
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const imageOptimizer = useRef(getImageOptimizer());

  // Generate optimized image sources
  const generateSources = useCallback(() => {
    if (!src) return [];

    const sources = [];
    
    // Generate sources for each format
    formats.forEach(format => {
      const srcSet = breakpoints
        .map(width => {
          const optimizedSrc = imageOptimizer.current.generateUrl(src, {
            width,
            format,
            quality
          });
          return `${optimizedSrc} ${width}w`;
        })
        .join(', ');

      sources.push({
        type: `image/${format === 'jpg' ? 'jpeg' : format}`,
        srcSet,
        sizes
      });
    });

    return sources;
  }, [src, formats, breakpoints, quality, sizes]);

  // Generate fallback src
  const getFallbackSrc = useCallback(() => {
    if (!src) return '';
    
    // Use original or generate optimized fallback
    const fallbackWidth = width || breakpoints[Math.floor(breakpoints.length / 2)];
    return imageOptimizer.current.generateUrl(src, {
      width: fallbackWidth,
      format: 'jpg',
      quality
    });
  }, [src, width, breakpoints, quality]);

  // Intersection Observer setup for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before the image enters viewport
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

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

    // Try fallback to JPEG if other formats fail
    if (currentSrc && !currentSrc.includes('.jpg')) {
      const fallbackSrc = getFallbackSrc();
      setCurrentSrc(fallbackSrc);
    }
  }, [onError, currentSrc, getFallbackSrc]);

  // Update current src when in view
  useEffect(() => {
    if (isInView && !currentSrc) {
      setCurrentSrc(getFallbackSrc());
    }
  }, [isInView, currentSrc, getFallbackSrc]);

  // Generate placeholder styles
  const getPlaceholderStyles = () => {
    const baseStyles = {
      backgroundColor: '#f3f4f6',
      transition: 'opacity 0.3s ease-in-out'
    };

    if (placeholder === 'blur' && blurDataURL) {
      return {
        ...baseStyles,
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        transform: 'scale(1.1)' // Prevent blur edges
      };
    }

    if (placeholder === 'empty') {
      return baseStyles;
    }

    // Default gradient placeholder
    return {
      ...baseStyles,
      background: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
    };
  };

  // Container styles
  const containerStyles = {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto'
  };

  // Image styles
  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out'
  };

  // Placeholder overlay styles
  const placeholderOverlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isLoaded ? 0 : 1,
    ...getPlaceholderStyles()
  };

  const sources = generateSources();

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={containerStyles}
      {...props}
    >
      {/* Placeholder */}
      <div 
        style={placeholderOverlayStyles}
        className="image-placeholder"
        aria-hidden="true"
      />

      {/* Image with multiple sources */}
      {isInView && (
        <picture>
          {sources.map((source, index) => (
            <source
              key={index}
              type={source.type}
              srcSet={source.srcSet}
              sizes={source.sizes}
            />
          ))}
          <img
            src={currentSrc}
            alt={alt}
            style={imageStyles}
            loading={loading}
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
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '0.5rem',
            color: '#dc2626',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ marginBottom: '0.5rem' }}
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <path d="m12 17 .01 0"/>
          </svg>
          <div>Falha ao carregar imagem</div>
        </div>
      )}
    </div>
  );
};

// Preload function for critical images
export const preloadImage = (src, options = {}) => {
  const { formats = ['webp'], priority = true } = options;
  
  if (!priority) return;

  const imageOptimizer = getImageOptimizer();
  
  formats.forEach(format => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageOptimizer.generateUrl(src, {
      width: 1024, // Reasonable default for preload
      format,
      quality: 80
    });
    
    // Add to document head
    document.head.appendChild(link);
  });
};

// HOC for automatic image optimization
export const withImageOptimization = (WrappedComponent) => {
  return React.forwardRef((props, ref) => {
    // Transform image props automatically
    const optimizedProps = { ...props };
    
    if (props.images) {
      optimizedProps.images = props.images.map(img => ({
        ...img,
        component: OptimizedImage
      }));
    }

    return <WrappedComponent ref={ref} {...optimizedProps} />;
  });
};

// Generate blur data URL for placeholder
export const generateBlurDataURL = (width = 10, height = 10) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  
  // Create a simple gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1); // Very low quality for small size
};

export default OptimizedImage;