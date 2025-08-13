import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagem otimizada com fallback automático
 * Tenta WebP primeiro, fallback para formato original se não suportado
 */
const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  sizes,
  priority = false,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isWebPSupported, setIsWebPSupported] = useState(null);

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

  // Gerar URLs WebP se suportado
  useEffect(() => {
    if (isWebPSupported === null) return;
    
    if (isWebPSupported && src) {
      // Converter extensão para WebP
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Testar se WebP existe, senão usar original
      const img = new Image();
      img.onload = () => setImageSrc(webpSrc);
      img.onerror = () => setImageSrc(src); // Fallback para original
      img.src = webpSrc;
    } else {
      setImageSrc(src);
    }
  }, [src, isWebPSupported]);

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

  if (isWebPSupported === null) {
    // Loading placeholder enquanto detecta suporte
    return (
      <div 
        className={`bg-gray-200 animate-pulse ${className}`}
        style={{ aspectRatio: '16/9' }}
        role="img"
        aria-label={`Carregando ${alt}`}
      />
    );
  }

  return (
    <img
      src={imageSrc}
      srcSet={generateSrcSet()}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={getLoadingStrategy()}
      decoding="async"
      {...props}
      onError={() => {
        // Fallback final para imagem original se WebP falhar
        if (imageSrc !== src) {
          setImageSrc(src);
        }
      }}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  sizes: PropTypes.string,
  priority: PropTypes.bool,
};

export default OptimizedImage;