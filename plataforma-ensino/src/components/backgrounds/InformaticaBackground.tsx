'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface BackgroundProps {
  performanceConfig?: {
    particleCount?: number;
    staticFallback?: boolean;
  };
  deviceCapabilities?: {
    pixelRatio?: number;
  };
  courseSlug?: string;
}

interface DigitalParticleType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  decay: number;
  glow: number;
  glowSpeed: number;
  trail: Array<{ x: number; y: number }>;
  maxTrailLength: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  distanceTo(other: DigitalParticleType): number;
}

interface MatrixDropType {
  x: number;
  y: number;
  fontSize: number;
  speed: number;
  chars: string[];
  opacity: number;
  update(canvasHeight: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Background animado para o curso de Informática  
 * Conceito: Grid digital pixelizado + partículas conectadas + efeitos matrix-style
 */
const InformaticaBackground: React.FC<BackgroundProps> = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<DigitalParticleType[]>([]);
  const matrixRef = useRef<{ drops: MatrixDropType[] }>({ drops: [] });
  const gridRef = useRef<{ offset: number }>({ offset: 0 });

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Grid digital
    gridSize: 25,
    gridOpacity: 0, // Era 0.15 → 0 (grid digital REMOVIDO)
    gridSpeed: 0, // Era 0.5 → 0 (sem animação de grid)
    
    // Partículas conectadas - REDUZIDAS DRASTICAMENTE
    particleCount: Math.min(performanceConfig?.particleCount || 8, 4), // Era 30/15 → 8/4 (73% redução)
    connectionDistance: 80, // Era 120 → 80 (33% redução na distância de conexão)
    particleSpeed: performanceConfig?.staticFallback ? 0 : 0.6, // Era 1.2 → 0.6 (50% redução na velocidade)
    
    // Matrix rain - REDUZIDO DRASTICAMENTE (mantendo orbs intactas)
    matrixColumns: Math.floor((window.innerWidth || 800) / 80), // Era /20 → /80 (75% redução)
    matrixSpeed: performanceConfig?.staticFallback ? 0 : 0.8, // Era 2 → 0.8 (60% redução)
    matrixOpacity: performanceConfig?.staticFallback ? 0 : 0.3, // Era 0.8 → 0.3 (63% redução)
    
    // Cores do tema digital
    colors: {
      primary: '#3742FA',    // Azul primário
      secondary: '#2F3542',  // Cinza escuro
      accent: '#57606F',     // Cinza médio
      grid: '#3742FA20',     // Azul transparente para grid
      particle: '#3742FA',   // Azul para partículas
      connection: '#57606F40', // Cinza transparente para conexões
      matrix: '#3742FA',     // Azul para matrix rain
      glow: '#70A1FF'        // Azul claro para efeitos
    },
    
    // Caracteres para matrix rain
    matrixChars: '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  }), [performanceConfig]);

  // Classe para partículas conectadas
  class DigitalParticle implements DigitalParticleType {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number = 1;
    decay: number;
    glow: number;
    glowSpeed: number;
    trail: Array<{ x: number; y: number }> = [];
    maxTrailLength: number = 5;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.particleSpeed;
      this.vy = (Math.random() - 0.5) * config.particleSpeed;
      this.size = 1 + Math.random() * 1.5; // Era 2-5 → 1-2.5 (50% redução no tamanho)
      this.decay = 0.002 + Math.random() * 0.003; // Era 0.001-0.003 → 0.002-0.005 (vida mais curta)
      this.glow = Math.random() * Math.PI * 2;
      this.glowSpeed = 0.02 + Math.random() * 0.02; // Era 0.05-0.1 → 0.02-0.04 (60% redução)
    }

    update() {
      if (config.particleSpeed === 0) return;
      
      // Atualizar posição
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce nas bordas
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
      
      // Manter dentro dos limites
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
      
      // Atualizar trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
      
      // Efeito de glow
      this.glow += this.glowSpeed;
      
      // Atualizar vida
      this.life -= this.decay;
      if (this.life <= 0) {
        this.life = 1;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      // Desenhar trail
      this.trail.forEach((point, index) => {
        const alpha = (index / this.trail.length) * this.life * 0.3;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = config.colors.glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Desenhar partícula principal com glow
      ctx.save();
      ctx.globalAlpha = this.life * 0.5; // Era this.life → this.life * 0.5 (50% redução na opacidade)
      
      // Glow effect
      const glowIntensity = 0.5 + Math.sin(this.glow) * 0.3;
      ctx.shadowColor = config.colors.glow;
      ctx.shadowBlur = this.size * 1.5 * glowIntensity; // Era *3 → *1.5 (50% redução no glow)
      
      ctx.fillStyle = config.colors.particle;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }

    distanceTo(other: DigitalParticleType): number {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  // Classe para matrix rain
  class MatrixDrop implements MatrixDropType {
    x: number;
    y: number = 0;
    fontSize: number;
    speed: number;
    chars: string[] = [];
    opacity: number;

    constructor(x: number, fontSize: number) {
      this.x = x;
      this.fontSize = fontSize;
      this.speed = config.matrixSpeed + Math.random() * 0.8; // Era *2 → *0.8 (60% redução)
      this.opacity = 0.4 + Math.random() * 0.2; // Era 0.8-1.0 → 0.4-0.6 (50% redução)
      
      // Gerar string de caracteres - REDUZIDA
      const length = 2 + Math.floor(Math.random() * 4); // Era 5-15 → 2-6 caracteres (60% redução)
      for (let i = 0; i < length; i++) {
        this.chars.push(config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)]);
      }
    }

    update(canvasHeight: number) {
      if (config.matrixSpeed === 0) return;
      
      this.y += this.speed;
      
      // Resetar quando sair da tela
      if (this.y > canvasHeight + this.chars.length * this.fontSize) {
        this.y = -this.chars.length * this.fontSize;
        
        // Trocar alguns caracteres aleatoriamente
        if (Math.random() < 0.03) { // Era 0.1 → 0.03 (70% redução na frequência)
          const index = Math.floor(Math.random() * this.chars.length);
          this.chars[index] = config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)];
        }
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (config.matrixOpacity === 0) return;
      
      ctx.save();
      ctx.font = `${this.fontSize}px monospace`;
      ctx.globalAlpha = config.matrixOpacity * this.opacity;
      
      this.chars.forEach((char, index) => {
        const y = this.y + index * this.fontSize;
        const alpha = Math.max(0, 1 - (index / this.chars.length));
        
        ctx.globalAlpha = config.matrixOpacity * this.opacity * alpha;
        ctx.fillStyle = index === 0 ? config.colors.glow : config.colors.matrix;
        ctx.fillText(char, this.x, y);
      });
      
      ctx.restore();
    }
  }

  // Desenhar conexões entre partículas
  const drawConnections = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = config.colors.connection;
    ctx.lineWidth = 1;
    
    const particles = particlesRef.current.filter(p => p instanceof DigitalParticle);
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);
        
        if (distance < config.connectionDistance) {
          const alpha = 1 - (distance / config.connectionDistance);
          ctx.globalAlpha = alpha * 0.2; // Era * 0.5 → * 0.2 (60% redução na opacidade das conexões)
          
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    ctx.restore();
  };

  // Inicializar elementos
  const initializeElements = (canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    
    // Criar partículas
    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push(new DigitalParticle(canvas));
    }
    
    // Criar matrix drops
    matrixRef.current.drops = [];
    const fontSize = 14;
    for (let i = 0; i < config.matrixColumns; i++) {
      const x = i * 20;
      matrixRef.current.drops.push(new MatrixDrop(x, fontSize));
    }
  };

  // Loop de animação  
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar matrix rain
    matrixRef.current.drops.forEach(drop => {
      drop.update(canvas.height);
      drop.draw(ctx);
    });
    
    // Desenhar conexões primeiro
    drawConnections(ctx);
    
    // Atualizar e desenhar partículas
    particlesRef.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });

    if (config.particleSpeed > 0 || config.gridSpeed > 0 || config.matrixSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Configurar canvas e inicializar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (deviceCapabilities?.pixelRatio || 1);
      canvas.height = rect.height * (deviceCapabilities?.pixelRatio || 1);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      
      // Reinicializar elementos com novo tamanho
      initializeElements(canvas);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Iniciar animação
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, deviceCapabilities, animate, initializeElements]);

  // Se for versão estática, apenas mostrar gradiente digital
  if (performanceConfig?.staticFallback) {
    return (
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 50%, ${config.colors.accent} 100%)`
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'transparent',
        zIndex: 1
      }}
      aria-hidden="true"
    />
  );
};

export default React.memo(InformaticaBackground);