import { useMemo, useEffect, useState } from 'react';

function Starfield({ count = 50, className = '', useCSSOnly = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stars = useMemo(() => {
    // Only generate stars after hydration to prevent SSR/client mismatch
    if (!isHydrated) return [];
    
    // Se preferência de movimento reduzido, não mostrar estrelas
    if (prefersReducedMotion) return [];
    
    // Generate optimized star count regardless of approach
    // This ensures consistent layout
    
    // Reduzir estrelas drasticamente para melhor performance - máximo 15
    const maxStars = 15;
    const starCount = isMobile ? Math.min(maxStars / 2, 8) : Math.min(count / 4, maxStars);
    
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 1; // 1–3px
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2; // 2–4s
      arr.push({ left, top, size, delay, duration });
    }
    return arr;
  }, [count, isMobile, prefersReducedMotion, isHydrated]);

  // Não renderizar nada se preferência de movimento reduzido ou não hidratado
  if (prefersReducedMotion || !isHydrated) return null;

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