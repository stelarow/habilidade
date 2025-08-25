import { jsx } from "react/jsx-runtime";
import React, { useRef, useMemo, useEffect } from "react";
const InformaticaBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const matrixRef = useRef({ drops: [] });
  const gridRef = useRef({ offset: 0 });
  const config = useMemo(() => ({
    // Grid digital
    gridSize: 25,
    gridOpacity: 0,
    // Era 0.15 → 0 (grid digital REMOVIDO)
    gridSpeed: 0,
    // Era 0.5 → 0 (sem animação de grid)
    // Partículas conectadas - REDUZIDAS DRASTICAMENTE
    particleCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 8, 4),
    // Era 30/15 → 8/4 (73% redução)
    connectionDistance: 80,
    // Era 120 → 80 (33% redução na distância de conexão)
    particleSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.6,
    // Era 1.2 → 0.6 (50% redução na velocidade)
    // Matrix rain - REDUZIDO DRASTICAMENTE (mantendo orbs intactas)
    matrixColumns: Math.floor((window.innerWidth || 800) / 80),
    // Era /20 → /80 (75% redução)
    matrixSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.8,
    // Era 2 → 0.8 (60% redução)
    matrixOpacity: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.3,
    // Era 0.8 → 0.3 (63% redução)
    // Cores do tema digital
    colors: {
      primary: "#3742FA",
      // Azul primário
      secondary: "#2F3542",
      // Cinza escuro
      accent: "#57606F",
      // Cinza médio
      grid: "#3742FA20",
      // Azul transparente para grid
      particle: "#3742FA",
      // Azul para partículas
      connection: "#57606F40",
      // Cinza transparente para conexões
      matrix: "#3742FA",
      // Azul para matrix rain
      glow: "#70A1FF"
      // Azul claro para efeitos
    },
    // Caracteres para matrix rain
    matrixChars: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  }), [performanceConfig]);
  class DigitalParticle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.particleSpeed;
      this.vy = (Math.random() - 0.5) * config.particleSpeed;
      this.size = 1 + Math.random() * 1.5;
      this.life = 1;
      this.decay = 2e-3 + Math.random() * 3e-3;
      this.glow = Math.random() * Math.PI * 2;
      this.glowSpeed = 0.02 + Math.random() * 0.02;
      this.trail = [];
      this.maxTrailLength = 5;
    }
    update() {
      if (config.particleSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
      this.glow += this.glowSpeed;
      this.life -= this.decay;
      if (this.life <= 0) {
        this.life = 1;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
      }
    }
    draw(ctx) {
      this.trail.forEach((point, index) => {
        const alpha = index / this.trail.length * this.life * 0.3;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = config.colors.glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.save();
      ctx.globalAlpha = this.life * 0.5;
      const glowIntensity = 0.5 + Math.sin(this.glow) * 0.3;
      ctx.shadowColor = config.colors.glow;
      ctx.shadowBlur = this.size * 1.5 * glowIntensity;
      ctx.fillStyle = config.colors.particle;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  class MatrixDrop {
    constructor(x, fontSize) {
      this.x = x;
      this.y = 0;
      this.fontSize = fontSize;
      this.speed = config.matrixSpeed + Math.random() * 0.8;
      this.chars = [];
      this.opacity = 0.4 + Math.random() * 0.2;
      const length = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < length; i++) {
        this.chars.push(config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)]);
      }
    }
    update(canvasHeight) {
      if (config.matrixSpeed === 0) return;
      this.y += this.speed;
      if (this.y > canvasHeight + this.chars.length * this.fontSize) {
        this.y = -this.chars.length * this.fontSize;
        if (Math.random() < 0.03) {
          const index = Math.floor(Math.random() * this.chars.length);
          this.chars[index] = config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)];
        }
      }
    }
    draw(ctx) {
      if (config.matrixOpacity === 0) return;
      ctx.save();
      ctx.font = `${this.fontSize}px monospace`;
      ctx.globalAlpha = config.matrixOpacity * this.opacity;
      this.chars.forEach((char, index) => {
        const y = this.y + index * this.fontSize;
        const alpha = Math.max(0, 1 - index / this.chars.length);
        ctx.globalAlpha = config.matrixOpacity * this.opacity * alpha;
        ctx.fillStyle = index === 0 ? config.colors.glow : config.colors.matrix;
        ctx.fillText(char, this.x, y);
      });
      ctx.restore();
    }
  }
  const drawDigitalGrid = (ctx) => {
    if (config.gridOpacity === 0) return;
    const { width, height } = ctx.canvas;
    ctx.save();
    ctx.globalAlpha = config.gridOpacity;
    ctx.strokeStyle = config.colors.grid;
    ctx.lineWidth = 1;
    gridRef.current.offset += config.gridSpeed;
    if (gridRef.current.offset >= config.gridSize) {
      gridRef.current.offset = 0;
    }
    for (let x = -gridRef.current.offset; x < width + config.gridSize; x += config.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = -gridRef.current.offset; y < height + config.gridSize; y += config.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.fillStyle = config.colors.particle;
    for (let x = -gridRef.current.offset; x < width + config.gridSize; x += config.gridSize) {
      for (let y = -gridRef.current.offset; y < height + config.gridSize; y += config.gridSize) {
        if (Math.random() < 0.1) {
          ctx.shadowColor = config.colors.glow;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };
  const drawConnections = (ctx) => {
    ctx.save();
    ctx.strokeStyle = config.colors.connection;
    ctx.lineWidth = 1;
    const particles = particlesRef.current.filter((p) => p instanceof DigitalParticle);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);
        if (distance < config.connectionDistance) {
          const alpha = 1 - distance / config.connectionDistance;
          ctx.globalAlpha = alpha * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  };
  const initializeElements = (canvas) => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push(new DigitalParticle(canvas));
    }
    matrixRef.current.drops = [];
    const fontSize = 14;
    for (let i = 0; i < config.matrixColumns; i++) {
      const x = i * 20;
      matrixRef.current.drops.push(new MatrixDrop(x, fontSize));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDigitalGrid(ctx);
    matrixRef.current.drops.forEach((drop) => {
      drop.update(canvas.height);
      drop.draw(ctx);
    });
    drawConnections(ctx);
    particlesRef.current.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });
    if (config.particleSpeed > 0 || config.gridSpeed > 0 || config.matrixSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      canvas.height = rect.height * ((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      const ctx = canvas.getContext("2d");
      ctx.scale((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1, (deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      initializeElements(canvas);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, deviceCapabilities]);
  if (performanceConfig == null ? void 0 : performanceConfig.staticFallback) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-10",
        style: {
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 50%, ${config.colors.accent} 100%)`
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 w-full h-full pointer-events-none",
      style: {
        background: "transparent",
        zIndex: 1
      },
      "aria-hidden": "true"
    }
  );
};
const InformaticaBackground$1 = React.memo(InformaticaBackground);
export {
  InformaticaBackground$1 as default
};
