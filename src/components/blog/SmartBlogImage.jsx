import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'phosphor-react';

/**
 * Smart Blog Image Component
 * Automatically handles small images with intelligent upscaling and fallbacks
 */
const SmartBlogImage = ({ 
  src, 
  alt, 
  className = '',
  style = {},
  sizes = '100vw',
  priority = false,
  onLoad,
  onError,
  ...props 
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    isSmall: false,
    originalDimensions: null,
    optimizedSrc: null
  });
  
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  // Check image dimensions and optimize if needed
  const analyzeAndOptimizeImage = (imgElement) => {
    const { naturalWidth, naturalHeight } = imgElement;
    
    // Store original dimensions
    setImageState(prev => ({
      ...prev,
      originalDimensions: { width: naturalWidth, height: naturalHeight }
    }));

    // Check if image is small (less than 600px width)
    const isSmallImage = naturalWidth < 600;
    
    if (isSmallImage) {
      console.log(`Imagem pequena detectada: ${naturalWidth}x${naturalHeight}. Aplicando otimização...`);
      
      // Create optimized version using canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate better dimensions (max 2x upscale for quality)
      const maxUpscale = 2;
      const targetWidth = Math.min(800, naturalWidth * maxUpscale);
      const targetHeight = (naturalHeight * targetWidth) / naturalWidth;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Apply high-quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Apply subtle sharpening for upscaled images
      ctx.filter = 'contrast(1.05) brightness(1.01)';
      
      // Draw upscaled image
      ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
      
      // Get optimized data URL
      const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      setImageState(prev => ({
        ...prev,
        isSmall: true,
        optimizedSrc: optimizedDataUrl,
        loaded: true
      }));
      
      return true; // Indicates optimization was applied
    }
    
    // Image is adequate size
    setImageState(prev => ({
      ...prev,
      isSmall: false,
      loaded: true
    }));
    
    return false; // No optimization needed
  };

  // Handle image load
  const handleImageLoad = (event) => {
    const imgElement = event.target;
    const wasOptimized = analyzeAndOptimizeImage(imgElement);
    
    // Call original onLoad if provided
    if (onLoad) {
      onLoad(event);
    }
    
    // Log optimization info
    if (wasOptimized) {
      console.log(`✅ Imagem otimizada: ${src}`);
    }
  };

  // Handle image error
  const handleImageError = (event) => {
    setImageState(prev => ({
      ...prev,
      error: true,
      loaded: false
    }));
    
    if (onError) {
      onError(event);
    }
  };

  // Generate responsive sizes based on image dimensions
  const getResponsiveSizes = () => {
    if (!imageState.originalDimensions) return sizes;
    
    const { width } = imageState.originalDimensions;
    
    if (width < 400) return '(max-width: 768px) 100vw, 400px';
    if (width < 600) return '(max-width: 768px) 100vw, 600px';
    if (width < 800) return '(max-width: 768px) 100vw, 800px';
    
    return sizes;
  };

  // Smart CSS classes based on image characteristics
  const getSmartClasses = () => {
    let classes = className;
    
    if (imageState.isSmall) {
      // Add classes for small images
      classes += ' blog-image-optimized';
    }
    
    if (imageState.originalDimensions) {
      const { width, height } = imageState.originalDimensions;
      const aspectRatio = width / height;
      
      // Add aspect ratio classes
      if (aspectRatio > 1.5) classes += ' blog-image-wide';
      else if (aspectRatio < 0.8) classes += ' blog-image-tall';
      else classes += ' blog-image-standard';
    }
    
    return classes;
  };

  // Smart styles with image optimization
  const getSmartStyles = () => {
    let smartStyles = { ...style };
    
    if (imageState.isSmall && imageState.originalDimensions) {
      // Limit max width for small images to prevent over-stretching
      const { width } = imageState.originalDimensions;
      const maxWidth = Math.min(600, width * 2);
      
      smartStyles = {
        ...smartStyles,
        maxWidth: `${maxWidth}px`,
        height: 'auto',
        // Subtle enhancement for upscaled images
        filter: imageState.optimizedSrc ? 'contrast(1.02) brightness(1.01)' : undefined
      };
    }
    
    return smartStyles;
  };

  // Determine which src to use
  const getEffectiveSrc = () => {
    return imageState.optimizedSrc || src;
  };

  return (
    <div className="smart-blog-image-container relative">
      {/* Main Image */}
      <img
        ref={imgRef}
        src={getEffectiveSrc()}
        alt={alt}
        className={getSmartClasses()}
        style={getSmartStyles()}
        sizes={getResponsiveSizes()}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
      
      {/* Optimization Indicator (Development Only) */}
      {process.env.NODE_ENV === 'development' && imageState.isSmall && imageState.loaded && (
        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-75">
          Otimizada {imageState.originalDimensions?.width}x{imageState.originalDimensions?.height}
        </div>
      )}
      
      {/* Error State */}
      {imageState.error && (
        <div className="flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 min-h-[200px]">
          <div className="text-center text-zinc-500 dark:text-zinc-400">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p className="text-sm">Falha ao carregar imagem</p>
            <p className="text-xs mt-1">{alt}</p>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {!imageState.loaded && !imageState.error && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse rounded-lg" />
      )}
    </div>
  );
};

export default SmartBlogImage;