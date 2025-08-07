import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className = '', onLoad, fallbackSrc, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setError(true);
    if (fallbackSrc && src !== fallbackSrc) {
      // Try fallback image
      setError(false);
    }
  };

  return (
    <div ref={imgRef} className={`lazy-image-container ${className}`}>
      {isIntersecting ? (
        <>
          {!loaded && !error && (
            <div 
              className="animate-pulse bg-gray-300 w-full h-full rounded"
              style={{ minHeight: '100px', aspectRatio: '16/9' }}
            />
          )}
          <img 
            src={error && fallbackSrc ? fallbackSrc : src}
            alt={alt} 
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={`${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ${className}`}
            style={{ display: loaded ? 'block' : 'none' }}
            {...props}
          />
          {error && !fallbackSrc && (
            <div 
              className="flex items-center justify-center bg-gray-200 text-gray-500 text-sm rounded"
              style={{ minHeight: '100px', aspectRatio: '16/9' }}
            >
              Image not available
            </div>
          )}
        </>
      ) : (
        <div 
          className="animate-pulse bg-gray-300 w-full h-full rounded"
          style={{ minHeight: '100px', aspectRatio: '16/9' }}
        />
      )}
    </div>
  );
};

export default LazyImage;