import { useMemo, useEffect, useState, useCallback } from 'react';

function Starfield({ count = 50, className = '', useCSSOnly = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [renderStars, setRenderStars] = useState(false);

  useEffect(() => {
    // Mark as hydrated (client-only)
    setIsHydrated(true);
    
    // Detectar mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Detectar preferência de movimento reduzido
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Defer star rendering to reduce TBT
    const deferRender = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => setRenderStars(true), { timeout: 2000 });
      } else {
        setTimeout(() => setRenderStars(true), 100);
      }
    };
    
    deferRender();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stars = useMemo(() => {
    // Only generate stars after hydration and render flag
    if (!isHydrated || !renderStars) return [];
    
    // Se preferência de movimento reduzido, não mostrar estrelas
    if (prefersReducedMotion) return [];
    
    // Ultra-optimized star count to reduce TBT
    const maxStars = isMobile ? 6 : 10; // Reduced further
    const starCount = Math.min(count / 5, maxStars);
    
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 1.5 + 1; // Smaller: 1–2.5px
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 3; // Slower: 3–5s
      arr.push({ left, top, size, delay, duration });
    }
    return arr;
  }, [count, isMobile, prefersReducedMotion, isHydrated, renderStars]);

  // Não renderizar nada se preferência de movimento reduzido, não hidratado, ou ainda não é hora de renderizar
  if (prefersReducedMotion || !isHydrated || !renderStars) return null;

  // Always use DOM approach but with optimized star count for consistent layout
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      {stars.map((s, idx) => (
        <span
          key={idx}
          className="star block absolute rounded-full bg-fuchsia-500/80"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            willChange: 'opacity',
            transform: 'translateZ(0)', // Force GPU layer
          }}
        />
      ))}
    </div>
  );
}

export default Starfield; 