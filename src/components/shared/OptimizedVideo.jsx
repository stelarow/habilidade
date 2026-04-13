import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from '@phosphor-icons/react';

const OptimizedVideo = ({ 
  src, 
  poster, 
  alt,
  className = "",
  autoplay = false,
  muted = true,
  controls = false,
  lazy = true,
  onLoadStart,
  onError,
  fallbackImage
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const videoReference = useRef(null);
  const observerReference = useRef(null);

  // Lazy loading com Intersection Observer
  useEffect(() => {
    if (!lazy) return;

    observerReference.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observerReference.current?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (videoReference.current) {
      observerReference.current.observe(videoReference.current);
    }

    return () => observerReference.current?.disconnect();
  }, [lazy]);

  // Determinar fontes de vídeo baseadas no src
  const getVideoSources = (baseSource) => {
    const baseName = baseSource.replace(/\.[^/.]+$/, ''); // Remove extensão
    return [
      { src: `${baseName}.webm`, type: 'video/webm' },
      { src: `${baseName}.mp4`, type: 'video/mp4' }
    ];
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.warn('Erro ao carregar vídeo:', src);
    setHasError(true);
    setIsLoading(false);
    onError?.(e);
  };

  const togglePlay = () => {
    if (videoReference.current) {
      if (isPlaying) {
        videoReference.current.pause();
      } else {
        videoReference.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Renderizar fallback se houver erro
  if (hasError && fallbackImage) {
    return (
      <img 
        src={fallbackImage}
        alt={alt}
        className={`${className} object-cover`}
        loading={lazy ? 'lazy' : 'eager'}
      />
    );
  }

  return (
    <div className={`relative ${className}`} ref={videoReference}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Vídeo principal - só carrega quando visível */}
      {isVisible && (
        <video
          ref={videoReference}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop
          playsInline
          controls={controls}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onError={handleError}
          preload={lazy ? 'metadata' : 'auto'}
        >
          {/* Múltiplas fontes para compatibilidade */}
          {getVideoSources(src).map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          
          {/* Fallback para browsers sem suporte a vídeo */}
          {fallbackImage && (
            <img 
              src={fallbackImage}
              alt={alt}
              className="w-full h-full object-cover"
            />
          )}
        </video>
      )}

      {/* Controles customizados (opcional) */}
      {!controls && !autoplay && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity group"
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
        >
          {isPlaying ? (
            <Pause className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
      )}
    </div>
  );
};

export default OptimizedVideo;