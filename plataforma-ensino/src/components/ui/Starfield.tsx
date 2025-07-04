'use client';

import { useMemo, useEffect, useState } from 'react';

interface StarfieldProps {
  count?: number;
  className?: string;
}

interface Star {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

function Starfield({ count = 50, className = '' }: StarfieldProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
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
    // Se preferência de movimento reduzido, não mostrar estrelas
    if (prefersReducedMotion) return [];
    
    // Reduzir estrelas em mobile para melhor performance
    const starCount = isMobile ? Math.min(count / 2, 25) : count;
    
    const arr: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 1; // 1–3px
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2; // 2–4s
      arr.push({ left, top, size, delay, duration });
    }
    return arr;
  }, [count, isMobile, prefersReducedMotion]);

  // Não renderizar nada se preferência de movimento reduzido
  if (prefersReducedMotion) return null;

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