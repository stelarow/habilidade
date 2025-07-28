'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';

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

interface FloatingDocumentType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  age: number;
  reset(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface FloatingChartType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  bars: number[];
  reset(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface DataParticleType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  reset(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Background animado para o curso de Administração
 * Conceito: Elementos flutuantes representando dados, gráficos e documentos administrativos
 * com movimento suave e cores empresariais
 */
const AdministracaoBackground: React.FC<BackgroundProps> = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const documentsRef = useRef<FloatingDocumentType[]>([]);
  const chartsRef = useRef<FloatingChartType[]>([]);
  const particlesRef = useRef<DataParticleType[]>([]);

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Configurações de animação
    documentCount: Math.min(performanceConfig?.particleCount || 8, 6),
    chartCount: Math.min(performanceConfig?.particleCount || 6, 4),
    particleCount: Math.min(performanceConfig?.particleCount || 20, 15),
    animationSpeed: performanceConfig?.staticFallback ? 0 : 1,
    
    // Cores do tema administrativo
    colors: {
      primary: '#6366F1',     // Azul profissional
      secondary: '#8B5CF6',   // Roxo executivo
      accent: '#A78BFA',      // Lilás suave
      light: '#C4B5FD',       // Claro
      background: '#1E1B4B',  // Azul escuro
    }
  }), [performanceConfig]);

  // Classe para documentos flutuantes (memoizada para estabilidade entre renders)
  const FloatingDocument = useMemo(() => {
    return class implements FloatingDocumentType {
      canvas: HTMLCanvasElement;
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      rotation: number = 0;
      rotationSpeed: number = 0;
      opacity: number = 0;
      age: number = 0;

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.reset();
        this.age = Math.random() * 1000;
      }

      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = 15 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.opacity = 0.4 + Math.random() * 0.4;
      }

      update() {
        this.age += 1;
        this.x += this.vx * config.animationSpeed;
        this.y += this.vy * config.animationSpeed;
        this.rotation += this.rotationSpeed * config.animationSpeed;

        // Rebote nas bordas
        if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

        // Movimento fluido
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;
        this.vx = Math.max(-1, Math.min(1, this.vx));
        this.vy = Math.max(-1, Math.min(1, this.vy));
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        // Desenhar documento
        ctx.fillStyle = config.colors.primary;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size * 1.2);
        
        // Linhas do documento
        ctx.strokeStyle = config.colors.light;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const y = -this.size/3 + (i * this.size/4);
          ctx.moveTo(-this.size/3, y);
          ctx.lineTo(this.size/3, y);
        }
        ctx.stroke();

        ctx.restore();
      }
    };
  }, [config]);

  // Classe para gráficos flutuantes (memoizada para estabilidade entre renders)
  const FloatingChart = useMemo(() => {
    return class implements FloatingChartType {
    canvas: HTMLCanvasElement;
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
    size: number = 0;
    opacity: number = 0;
    bars: number[] = [];

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.reset();
      this.bars = Array(4).fill(0).map(() => Math.random());
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = 20 + Math.random() * 15;
      this.opacity = 0.3 + Math.random() * 0.4;
    }

    update() {
      this.x += this.vx * config.animationSpeed;
      this.y += this.vy * config.animationSpeed;

      // Rebote nas bordas
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;

      // Desenhar gráfico de barras
      const barWidth = this.size / 5;
      for (let i = 0; i < this.bars.length; i++) {
        const height = this.bars[i] * this.size;
        const x = (i - 1.5) * barWidth;
        
        ctx.fillStyle = i % 2 === 0 ? config.colors.secondary : config.colors.accent;
        ctx.fillRect(x, -height/2, barWidth * 0.8, height);
      }

      ctx.restore();
    }
    };
  }, [config]);

  // Classe para partículas de dados (memoizada para estabilidade entre renders)
  const DataParticle = useMemo(() => {
    return class implements DataParticleType {
    canvas: HTMLCanvasElement;
    x: number = 0;
    y: number = 0;
    vx: number = 0;
    vy: number = 0;
    size: number = 0;
    opacity: number = 0;
    life: number = 0;
    maxLife: number = 0;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.reset();
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = 2 + Math.random() * 4;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 200;
    }

    update() {
      this.life++;
      this.x += this.vx * config.animationSpeed;
      this.y += this.vy * config.animationSpeed;

      // Fade out no final da vida
      if (this.life > this.maxLife * 0.8) {
        this.opacity *= 0.98;
      }

      // Reset se morreu ou saiu da tela
      if (this.life > this.maxLife || this.x < 0 || this.x > this.canvas.width || 
          this.y < 0 || this.y > this.canvas.height) {
        this.reset();
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = config.colors.light;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    };
  }, [config]);

  // Loop de animação
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar documentos
    documentsRef.current.forEach((doc: any) => {
      doc.update();
      doc.draw(ctx);
    });

    // Atualizar e desenhar gráficos
    chartsRef.current.forEach((chart: any) => {
      chart.update();
      chart.draw(ctx);
    });

    // Atualizar e desenhar partículas
    particlesRef.current.forEach((particle: any) => {
      particle.update();
      particle.draw(ctx);
    });

    if (config.animationSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [config.animationSpeed]);

  // Setup do canvas
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
      
      // Recriar elementos com novo tamanho
      documentsRef.current = Array(config.documentCount).fill(0).map(() => new FloatingDocument(canvas));
      chartsRef.current = Array(config.chartCount).fill(0).map(() => new FloatingChart(canvas));
      particlesRef.current = Array(config.particleCount).fill(0).map(() => new DataParticle(canvas));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, deviceCapabilities, animate, FloatingDocument, FloatingChart, DataParticle]);

  // Fallback estático para performance baixa
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

export default React.memo(AdministracaoBackground);