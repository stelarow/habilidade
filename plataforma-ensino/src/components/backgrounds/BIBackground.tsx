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

interface DataStreamType {
  canvas: HTMLCanvasElement;
  particles: Array<{
    progress: number;
    speed: number;
    size: number;
    opacity: number;
    life: number;
    decay: number;
  }>;
  maxParticles: number;
  spawnRate: number;
  lastSpawn: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  opacity: number;
  hue: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

interface FloatingKPIType {
  canvas: HTMLCanvasElement;
  kpi: {
    label: string;
    value: string;
    trend: 'up' | 'down';
    format: 'currency' | 'number' | 'percentage';
  };
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;
  pulse: number;
  pulseSpeed: number;
  valueAnimation: number;
  animationSpeed: number;
  targetValue: number;
  currentValue: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Background animado para o curso de Business Intelligence
 * Conceito: Fluxo de dados + dashboards interativos + visualização de KPIs
 */
const BIBackground: React.FC<BackgroundProps> = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const dataStreamsRef = useRef<DataStreamType[]>([]);
  const kpiCardsRef = useRef<FloatingKPIType[]>([]);

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Fluxos de dados - REMOVIDO efeito de partículas jato
    streamCount: 0, // Era Math.min(performanceConfig?.particleCount || 15, 8)
    streamSpeed: 0, // Era performanceConfig?.staticFallback ? 0 : 1.5
    
    // KPI Cards - REDUZIDO drasticamente
    kpiCount: Math.min(performanceConfig?.particleCount || 3, 2), // Era 12/6 → 3/2 (83% redução)
    kpiSpeed: performanceConfig?.staticFallback ? 0 : 0.4, // Era 0.8 → 0.4 (50% redução)
    
    // Cores do tema BI
    colors: {
      primary: '#FF6348',    // Vermelho coral
      secondary: '#FF9F43',  // Laranja
      accent: '#FFDD59',     // Amarelo
      stream: '#FF6348',     // Vermelho para streams
      kpi: '#FF9F43',        // Laranja para KPIs
      dashboard: '#FFDD59',  // Amarelo para dashboard
      success: '#2ED573',    // Verde para valores positivos
      warning: '#FF9F43',    // Laranja para alertas
      background: '#2C2C2C'  // Fundo escuro
    },
    
    // KPIs para animar - REDUZIDO para apenas 3 principais
    kpis: [
      { label: 'Revenue', value: '$2.4M', trend: 'up' as const, format: 'currency' as const },
      { label: 'Orders', value: '12,847', trend: 'up' as const, format: 'number' as const },
      { label: 'Conversion', value: '4.2%', trend: 'down' as const, format: 'percentage' as const }
    ]
  }), [performanceConfig]);

  // Use useRef to store class constructors to avoid recreating them
  const DataStreamRef = useRef<any>(null);
  const FloatingKPIRef = useRef<any>(null);

  // Initialize class constructors only once
  useMemo(() => {
    // Classe para streams de dados
    class DataStream implements DataStreamType {
      canvas: HTMLCanvasElement;
      particles: Array<{
        progress: number;
        speed: number;
        size: number;
        opacity: number;
        life: number;
        decay: number;
      }> = [];
      maxParticles: number;
      spawnRate: number;
      lastSpawn: number = 0;
      startX: number;
      startY: number;
      endX: number;
      endY: number;
      controlX: number;
      controlY: number;
      opacity: number;
      hue: number;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, configRef: typeof config) {
        this.canvas = canvas;
        this.config = configRef;
        this.maxParticles = 8 + Math.floor(Math.random() * 6);
        this.spawnRate = 0.1 + Math.random() * 0.1;
        
        // Definir path do stream
        this.startX = Math.random() * canvas.width;
        this.startY = canvas.height + 50;
        this.endX = Math.random() * canvas.width;
        this.endY = -50;
        
        // Curvatura do path
        this.controlX = this.startX + (Math.random() - 0.5) * 200;
        this.controlY = canvas.height / 2 + (Math.random() - 0.5) * 100;
        
        this.opacity = 0.4 + Math.random() * 0.4;
        this.hue = Math.random() * 60; // Variação de cor
      }

      update() {
        if (this.config.streamSpeed === 0) return;
        
        // Spawn new particles
        this.lastSpawn += this.spawnRate;
        if (this.lastSpawn >= 1 && this.particles.length < this.maxParticles) {
          this.particles.push({
            progress: 0,
            speed: this.config.streamSpeed * (0.8 + Math.random() * 0.4) * 0.01,
            size: 2 + Math.random() * 4,
            opacity: 0.8 + Math.random() * 0.2,
            life: 1,
            decay: 0.005 + Math.random() * 0.005
          });
          this.lastSpawn = 0;
        }
        
        // Update particles
        this.particles.forEach((particle, index) => {
          particle.progress += particle.speed;
          particle.life -= particle.decay;
          
          if (particle.progress >= 1 || particle.life <= 0) {
            this.particles.splice(index, 1);
          }
        });
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Desenhar partículas
        this.particles.forEach(particle => {
          const t = particle.progress;
          
          // Posição ao longo da curva Bézier quadrática
          const x = Math.pow(1-t, 2) * this.startX + 
                    2 * (1-t) * t * this.controlX + 
                    Math.pow(t, 2) * this.endX;
          const y = Math.pow(1-t, 2) * this.startY + 
                    2 * (1-t) * t * this.controlY + 
                    Math.pow(t, 2) * this.endY;
          
          ctx.save();
          ctx.globalAlpha = particle.opacity * particle.life;
          
          // Cor baseada no progresso
          const hue = (this.hue + t * 30) % 360;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          
          // Glow effect
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = particle.size * 2;
          
          ctx.beginPath();
          ctx.arc(x, y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        });
        
        ctx.restore();
      }
    }

    // Classe para KPI cards flutuantes
    class FloatingKPI implements FloatingKPIType {
      canvas: HTMLCanvasElement;
      kpi: {
        label: string;
        value: string;
        trend: 'up' | 'down';
        format: 'currency' | 'number' | 'percentage';
      };
      x: number;
      y: number;
      vx: number;
      vy: number;
      opacity: number;
      scale: number;
      rotation: number = 0;
      rotationSpeed: number;
      pulse: number;
      pulseSpeed: number;
      valueAnimation: number = 0;
      animationSpeed: number;
      targetValue: number;
      currentValue: number;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, kpi: typeof config.kpis[0], configRef: typeof config) {
        this.canvas = canvas;
        this.kpi = kpi;
        this.config = configRef;
        this.x = Math.random() * (canvas.width - 150) + 75;
        this.y = Math.random() * (canvas.height - 100) + 50;
        this.vx = (Math.random() - 0.5) * this.config.kpiSpeed;
        this.vy = (Math.random() - 0.5) * this.config.kpiSpeed;
        this.opacity = 0.3 + Math.random() * 0.2; // Era 0.6-0.9 → 0.3-0.5 (50% redução)
        this.scale = 0.6 + Math.random() * 0.2; // Era 0.8-1.2 → 0.6-0.8 (33% redução)
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.03 + Math.random() * 0.02;
        
        // Animação de valor
        this.animationSpeed = 0.02 + Math.random() * 0.02;
        this.targetValue = parseFloat(this.kpi.value.replace(/[$,%]/g, ''));
        this.currentValue = this.targetValue * (0.7 + Math.random() * 0.3);
      }

      update() {
        if (this.config.kpiSpeed === 0) return;
        
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.pulse += this.pulseSpeed;
        this.valueAnimation += this.animationSpeed;
        
        // Bounce suave nas bordas
        if (this.x <= 75 || this.x >= this.canvas.width - 75) this.vx *= -0.8;
        if (this.y <= 50 || this.y >= this.canvas.height - 50) this.vy *= -0.8;
        
        // Manter dentro dos limites
        this.x = Math.max(75, Math.min(this.canvas.width - 75, this.x));
        this.y = Math.max(50, Math.min(this.canvas.height - 50, this.y));
        
        // Animar valor até o target
        if (Math.abs(this.currentValue - this.targetValue) > 0.01) {
          this.currentValue += (this.targetValue - this.currentValue) * 0.1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);

        // Card do KPI - REDUZIDO
        const cardWidth = 100; // Era 140 → 100 (29% redução)
        const cardHeight = 60; // Era 80 → 60 (25% redução)
        
        // Fundo do card com glow
        ctx.shadowColor = this.kpi.trend === 'up' ? this.config.colors.success : this.config.colors.warning;
        ctx.shadowBlur = 12;
        ctx.fillStyle = this.config.colors.background + 'CC';
        ctx.fillRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
        
        // Borda do card
        ctx.strokeStyle = this.kpi.trend === 'up' ? this.config.colors.success : this.config.colors.warning;
        ctx.lineWidth = 2;
        ctx.strokeRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
        
        // Label do KPI
        ctx.font = '12px Arial';
        ctx.fillStyle = this.config.colors.kpi;
        ctx.textAlign = 'center';
        ctx.fillText(this.kpi.label, 0, -20);
        
        // Valor animado do KPI
        let displayValue = '';
        if (this.kpi.format === 'currency') {
          displayValue = '$' + (this.currentValue / 1000000).toFixed(1) + 'M';
        } else if (this.kpi.format === 'percentage') {
          displayValue = this.currentValue.toFixed(1) + '%';
        } else {
          displayValue = Math.floor(this.currentValue).toLocaleString();
        }
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = this.kpi.trend === 'up' ? this.config.colors.success : this.config.colors.warning;
        ctx.fillText(displayValue, 0, 0);
        
        // Indicador de tendência
        const arrowSize = 10;
        ctx.fillStyle = this.kpi.trend === 'up' ? this.config.colors.success : this.config.colors.warning;
        ctx.beginPath();
        if (this.kpi.trend === 'up') {
          ctx.moveTo(-arrowSize/2, 20);
          ctx.lineTo(0, 10);
          ctx.lineTo(arrowSize/2, 20);
        } else {
          ctx.moveTo(-arrowSize/2, 10);
          ctx.lineTo(0, 20);
          ctx.lineTo(arrowSize/2, 10);
        }
        ctx.closePath();
        ctx.fill();
        
        // Mini sparkline
        ctx.strokeStyle = this.kpi.trend === 'up' ? this.config.colors.success : this.config.colors.warning;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i < 10; i++) {
          const x = -cardWidth/2 + 20 + (i / 9) * (cardWidth - 40);
          const variance = Math.sin((i + this.valueAnimation) * 0.5) * 5;
          const y = 25 + variance + (this.kpi.trend === 'up' ? -i * 0.5 : i * 0.5);
          
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        ctx.restore();
      }
    }

    DataStreamRef.current = DataStream as any;
    FloatingKPIRef.current = FloatingKPI as any;
  }, [config]);

  // Inicializar elementos
  const initializeElements = useCallback((canvas: HTMLCanvasElement) => {
    dataStreamsRef.current = [];
    kpiCardsRef.current = [];
    
    // Criar streams de dados
    if (DataStreamRef.current) {
      for (let i = 0; i < config.streamCount; i++) {
        dataStreamsRef.current.push(new DataStreamRef.current(canvas, config));
      }
    }
    
    // Criar KPI cards
    if (FloatingKPIRef.current) {
      config.kpis.slice(0, config.kpiCount).forEach(kpi => {
        kpiCardsRef.current.push(new FloatingKPIRef.current(canvas, kpi, config));
      });
    }
  }, [config]);

  // Loop de animação
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    dataStreamsRef.current.forEach(stream => {
      stream.update();
      stream.draw(ctx);
    });
    
    kpiCardsRef.current.forEach(kpi => {
      kpi.update();
      kpi.draw(ctx);
    });

    if (config.streamSpeed > 0 || config.kpiSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [config]);

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

  // Se for versão estática, apenas mostrar gradiente de BI
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

export default React.memo(BIBackground);