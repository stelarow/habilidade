import { useMemo } from 'react';

function Starfield({ count = 50, className = '' }) {
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 1; // 1–3px
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2; // 2–4s
      arr.push({ left, top, size, delay, duration });
    }
    return arr;
  }, [count]);

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
          }}
        />
      ))}
    </div>
  );
}

export default Starfield; 