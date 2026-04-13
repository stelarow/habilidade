import { useEffect, useRef } from 'react';

// Hook that scales and fades an element based on window scroll position.
// maxDistance: pixels after which effect reaches maximum.
export default function useScrollTransform(maxDistance = 200, scaleReduction = 0.1, opacityReduction = 0.3) {
  const reference = useRef(null);

  useEffect(() => {
    const element = reference.current;
    if (!element) return;

    const handleScroll = () => {
      const y = window.scrollY;
      const factor = Math.min(y / maxDistance, 1);
      const scale = 1 - scaleReduction * factor;
      const opacity = 1 - opacityReduction * factor;
      element.style.transform = `scale(${scale})`;
      element.style.opacity = opacity.toString();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxDistance, scaleReduction, opacityReduction]);

  return reference;
}
