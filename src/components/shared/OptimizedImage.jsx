import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de imagem simplificado para melhor compatibilidade mobile
 * Usa apenas lazy loading nativo do browser para máxima confiabilidade
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const containerStyle = aspectRatio ? { aspectRatio } : {};

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div
      className={`relative overflow-hidden ${showPlaceholder && !isLoaded ? 'bg-gradient-to-br from-zinc-800 to-zinc-900' : ''} ${className}`}
      style={containerStyle}
    >
      {/* Placeholder simples */}
      {showPlaceholder && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholderColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      )}

      {/* Imagem com lazy loading nativo */}
      {!hasError && (
        <img
          src={src}
          sizes={sizes}
          alt={alt}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          loading={priority ? 'eager' : loading}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}

      {/* Fallback para erro */}
      {hasError && showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-400">
          <span className="text-sm">Imagem não disponível</span>
        </div>
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