import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagem otimizada com lazy loading inteligente,
 * fallback automático e placeholders visuais
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  loading = 'lazy',
  sizes,
  priority = false,
  placeholderColor = 'rgb(39, 39, 42)', // zinc-800
  aspectRatio,
  showPlaceholder = true,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(priority ? src : null);
  const [isWebPSupported, setIsWebPSupported] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Detectar suporte WebP uma única vez
  useEffect(() => {
    if (isWebPSupported !== null) return;

    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const dataURL = canvas.toDataURL('image/webp');
      return dataURL.indexOf('data:image/webp') === 0;
    };

    setIsWebPSupported(checkWebPSupport());
  }, [isWebPSupported]);

  // Carregar imagem quando estiver em view
  useEffect(() => {
    if (!isInView || isWebPSupported === null) return;

    const loadImage = () => {
      if (isWebPSupported && src) {
        // Converter extensão para WebP
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

        // Testar se WebP existe, senão usar original
        const img = new Image();
        img.onload = () => {
          setImageSrc(webpSrc);
          setIsLoaded(true);
        };
        img.onerror = () => {
          // Fallback para original
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            setImageSrc(src);
            setIsLoaded(true);
          };
          fallbackImg.onerror = () => setIsLoaded(true); // Evitar loading infinito
          fallbackImg.src = src;
        };
        img.src = webpSrc;
      } else {
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setIsLoaded(true);
        };
        img.onerror = () => setIsLoaded(true);
        img.src = src;
      }
    };

    loadImage();
  }, [src, isWebPSupported, isInView]);

  // Gerar srcset responsivo
  const generateSrcSet = () => {
    if (!src || !isWebPSupported) return undefined;
    
    const extension = isWebPSupported ? '.webp' : src.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
    const baseName = src.replace(/\.(jpg|jpeg|png)$/i, '');
    
    // Gerar diferentes tamanhos (se existirem)
    const sizes = [320, 640, 768, 1024, 1280];
    return sizes
      .map(size => `${baseName}-${size}w${extension} ${size}w`)
      .join(', ');
  };

  // Loading strategy baseado em prioridade
  const getLoadingStrategy = () => {
    if (priority) return 'eager';
    return loading;
  };

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${showPlaceholder ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : ''} ${className}`}
      style={containerStyle}
    >
      {/* Placeholder com shimmer effect */}
      {showPlaceholder && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      )}

      {/* Loading indicator para imagens críticas */}
      {priority && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}

      {/* Imagem principal */}
      {imageSrc && (
        <img
          src={imageSrc}
          srcSet={generateSrcSet()}
          sizes={sizes}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-500
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={getLoadingStrategy()}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          {...props}
          onError={() => {
            // Fallback final para imagem original se WebP falhar
            if (imageSrc !== src) {
              setImageSrc(src);
            }
            setIsLoaded(true); // Evitar loading infinito
          }}
        />
      )}
    </div>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  sizes: PropTypes.string,
  priority: PropTypes.bool,
  placeholderColor: PropTypes.string,
  aspectRatio: PropTypes.string,
  showPlaceholder: PropTypes.bool,
};

export default OptimizedImage;