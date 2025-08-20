import { useMemo, useEffect, useState } from 'react';

function Starfield({ count = 50, className = '', useCSSOnly = true }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [supportsCSSGradients, setSupportsCSSGradients] = useState(true);

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
    
    // Feature detection for CSS gradients support
    const testCSSGradients = () => {
      try {
        const testEl = document.createElement('div');
        testEl.style.background = 'radial-gradient(1px 1px at 50% 50%, #c084fc, transparent)';
        setSupportsCSSGradients(testEl.style.background !== '');
      } catch (e) {
        setSupportsCSSGradients(false);
      }
    };
    
    checkMobile();
    testCSSGradients();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const stars = useMemo(() => {
    // Only generate stars after hydration to prevent SSR/client mismatch
    if (!isHydrated) return [];
    
    // Se preferência de movimento reduzido, não mostrar estrelas
    if (prefersReducedMotion) return [];
    
    // Only generate DOM stars if CSS approach is not supported or not preferred
    if (useCSSOnly && supportsCSSGradients) return [];
    
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
  }, [count, isMobile, prefersReducedMotion, isHydrated, useCSSOnly, supportsCSSGradients]);

  // Não renderizar nada se preferência de movimento reduzido ou não hidratado
  if (prefersReducedMotion || !isHydrated) return null;

  // Use CSS-only approach if supported and preferred
  if (useCSSOnly && supportsCSSGradients) {
    return (
      <div 
        className={`starfield-css ${className}`} 
        aria-hidden="true"
        style={{
          opacity: isMobile ? 0.6 : 0.8 // Slightly reduce opacity on mobile
        }}
      />
    );
  }

  // Fallback to DOM-based approach with reduced star count
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
          }}
        />
      ))}
    </div>
  );
}

export default Starfield; 