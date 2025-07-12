'use client';

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';

interface PerformanceConfig {
  particleCount?: number;
  staticFallback?: boolean;
}

interface DeviceCapabilities {
  pixelRatio?: number;
}

interface DesignGraficoBackgroundProps {
  performanceConfig?: PerformanceConfig;
  deviceCapabilities?: DeviceCapabilities;
  courseSlug?: string;
}

/**
 * Background animado para o curso de Design Gráfico
 * Conceito: Gradientes dinâmicos + formas geométricas flutuantes + pinceladas digitais
 */
const DesignGraficoBackground: React.FC<DesignGraficoBackgroundProps> = ({ 
  performanceConfig = {}, 
  deviceCapabilities = {}, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const shapesRef = useRef<any[]>([]);
  const brushStrokesRef = useRef<any[]>([]);
  const gradientRef = useRef({ phase: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Formas geométricas
    shapeCount: Math.min(performanceConfig?.particleCount || 25, 8),
    shapeSpeed: performanceConfig?.staticFallback ? 0 : 1.5,
    
    // Pinceladas
    brushCount: Math.min(performanceConfig?.particleCount || 15, 6),
    brushSpeed: performanceConfig?.staticFallback ? 0 : 2,
    
    // Gradientes dinâmicos
    gradientSpeed: performanceConfig?.staticFallback ? 0 : 0.02,
    gradientIntensity: performanceConfig?.staticFallback ? 0.5 : 1,
    
    // Cursor effects
    cursorInfluence: performanceConfig?.staticFallback ? 0 : 150,
    
    // Cores do tema criativo
    colors: {
      primary: '#FF6B9D',    // Rosa vibrante
      secondary: '#C44569',  // Rosa escuro
      accent: '#F8B500',     // Amarelo dourado
      gradient1: '#FF6B9D',  // Rosa para gradientes
      gradient2: '#FF9F43',  // Laranja
      gradient3: '#F8B500',  // Amarelo
      brush: '#FF6B9D80',    // Rosa semi-transparente
      shape: '#C44569',      // Rosa escuro para formas
      glow: '#FF9F43'        // Laranja para glow
    },
    
    // Tipos de formas
    shapeTypes: ['circle', 'triangle', 'square', 'hexagon', 'star'] as const
  }), [performanceConfig]);

  // Classe para formas geométricas flutuantes
  class GeometricShape {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    type: typeof config.shapeTypes[number];
    colorIndex: number;
    pulse: number;
    pulseSpeed: number;
    scale: number;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.shapeSpeed;
      this.vy = (Math.random() - 0.5) * config.shapeSpeed;
      this.size = 20 + Math.random() * 60;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.05;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.type = config.shapeTypes[Math.floor(Math.random() * config.shapeTypes.length)];
      this.colorIndex = Math.floor(Math.random() * 3);
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.scale = 0.5 + Math.random() * 0.5;
    }

    update() {
      if (config.shapeSpeed === 0) return;
      
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;
      
      // Bounce suave nas bordas
      if (this.x <= -this.size || this.x >= this.canvas.width + this.size) {
        this.vx *= -0.8;
        this.x = Math.max(-this.size, Math.min(this.canvas.width + this.size, this.x));
      }
      if (this.y <= -this.size || this.y >= this.canvas.height + this.size) {
        this.vy *= -0.8;
        this.y = Math.max(-this.size, Math.min(this.canvas.height + this.size, this.y));
      }
      
      // Efeito de respiração
      this.scale = 0.5 + Math.sin(this.pulse) * 0.2;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;

      // Escolher cor baseada no índice
      const colors = [config.colors.gradient1, config.colors.gradient2, config.colors.gradient3];
      const color = colors[this.colorIndex];
      
      // Glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = color;

      switch (this.type) {
        case 'circle':
          this.drawCircle(ctx);
          break;
        case 'triangle':
          this.drawTriangle(ctx);
          break;
        case 'square':
          this.drawSquare(ctx);
          break;
        case 'hexagon':
          this.drawHexagon(ctx);
          break;
        case 'star':
          this.drawStar(ctx);
          break;
      }

      ctx.restore();
    }

    drawCircle(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    drawTriangle(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      const height = this.size * 0.866; // altura de triângulo equilátero
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(-this.size / 2, height / 2);
      ctx.lineTo(this.size / 2, height / 2);
      ctx.closePath();
      ctx.fill();
    }

    drawSquare(ctx: CanvasRenderingContext2D) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    drawHexagon(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * this.size / 2;
        const y = Math.sin(angle) * this.size / 2;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }

    drawStar(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      const spikes = 5;
      const outerRadius = this.size / 2;
      const innerRadius = outerRadius * 0.5;
      
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();  
      ctx.fill();
    }
  }

  // Classe para pinceladas digitais
  class BrushStroke {
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    vx: number;
    vy: number;
    points: Array<{x: number; y: number}>;
    maxPoints: number;
    opacity: number;
    width: number;
    color: string;
    life: number;
    decay: number;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.brushSpeed;
      this.vy = (Math.random() - 0.5) * config.brushSpeed;
      this.points = [];
      this.maxPoints = 8 + Math.floor(Math.random() * 12);
      this.opacity = 0.2 + Math.random() * 0.4;
      this.width = 2 + Math.random() * 8;
      this.color = [config.colors.gradient1, config.colors.gradient2, config.colors.gradient3][Math.floor(Math.random() * 3)];
      this.life = 1;
      this.decay = 0.002 + Math.random() * 0.003;
      
      // Inicializar com alguns pontos
      for (let i = 0; i < 3; i++) {
        this.points.push({
          x: this.x + (Math.random() - 0.5) * 20,
          y: this.y + (Math.random() - 0.5) * 20
        });
      }
    }

    update() {
      if (config.brushSpeed === 0) return;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Adicionar novo ponto
      this.points.push({ x: this.x, y: this.y });
      
      // Remover pontos antigos
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }
      
      // Atualizar vida
      this.life -= this.decay;
      
      // Resetar quando morrer
      if (this.life <= 0) {
        this.life = 1;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.points = [];
      }
      
      // Bounce nas bordas
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
      if (this.points.length < 2) return;
      
      ctx.save();
      ctx.globalAlpha = this.opacity * this.life;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Desenhar pincelada com gradiente de opacidade
      ctx.beginPath();
      
      for (let i = 0; i < this.points.length - 1; i++) {
        const current = this.points[i];
        const next = this.points[i + 1];
        const alpha = (i / this.points.length) * this.life;
        
        ctx.globalAlpha = this.opacity * alpha;
        
        if (i === 0) {
          ctx.moveTo(current.x, current.y);
        } else {
          // Curva suave entre pontos
          const xc = (current.x + next.x) / 2;
          const yc = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(current.x, current.y, xc, yc);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }
  }

  // Desenhar gradiente dinâmico de fundo
  const drawDynamicGradient = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = ctx.canvas;
    
    gradientRef.current.phase += config.gradientSpeed;
    
    // Criar gradiente radial que se move
    const centerX = width / 2 + Math.sin(gradientRef.current.phase) * 100;
    const centerY = height / 2 + Math.cos(gradientRef.current.phase * 0.7) * 80;
    
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(width, height) * 0.8
    );
    
    // Cores que mudam com o tempo
    const phase1 = gradientRef.current.phase;
    const phase2 = gradientRef.current.phase + Math.PI * 0.5;
    const phase3 = gradientRef.current.phase + Math.PI;
    
    const alpha1 = (Math.sin(phase1) + 1) * 0.5 * config.gradientIntensity;
    const alpha2 = (Math.sin(phase2) + 1) * 0.5 * config.gradientIntensity;
    const alpha3 = (Math.sin(phase3) + 1) * 0.5 * config.gradientIntensity;
    
    gradient.addColorStop(0, `${config.colors.gradient1}${Math.floor(alpha1 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.5, `${config.colors.gradient2}${Math.floor(alpha2 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${config.colors.gradient3}${Math.floor(alpha3 * 255).toString(16).padStart(2, '0')}`);
    
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  };

  // Efeito do cursor (interatividade)
  const drawCursorEffect = (ctx: CanvasRenderingContext2D) => {
    if (config.cursorInfluence === 0) return;
    
    const { x, y } = mousePosition;
    
    ctx.save();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, config.cursorInfluence);
    gradient.addColorStop(0, `${config.colors.glow}40`);
    gradient.addColorStop(1, `${config.colors.glow}00`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  };

  // Track mouse position para interatividade
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    if (config.cursorInfluence > 0) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [config.cursorInfluence]);

  // Inicializar elementos
  const initializeElements = useCallback((canvas: HTMLCanvasElement) => {
    shapesRef.current = [];
    brushStrokesRef.current = [];
    
    // Criar formas geométricas
    for (let i = 0; i < config.shapeCount; i++) {
      shapesRef.current.push(new GeometricShape(canvas));
    }
    
    // Criar pinceladas
    for (let i = 0; i < config.brushCount; i++) {
      brushStrokesRef.current.push(new BrushStroke(canvas));
    }
  }, [config.shapeCount, config.brushCount]);

  // Loop de animação
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    drawDynamicGradient(ctx);
    drawCursorEffect(ctx);
    
    // Atualizar e desenhar pinceladas
    brushStrokesRef.current.forEach(brush => {
      brush.update();
      brush.draw(ctx);
    });
    
    // Atualizar e desenhar formas
    shapesRef.current.forEach(shape => {
      shape.update();
      shape.draw(ctx);
    });

    if (config.shapeSpeed > 0 || config.brushSpeed > 0 || config.gradientSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [config.shapeSpeed, config.brushSpeed, config.gradientSpeed, mousePosition]);

  // Configurar canvas e inicializar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (deviceCapabilities?.pixelRatio || 1);
      canvas.height = rect.height * (deviceCapabilities?.pixelRatio || 1);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      }
      
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

  // Se for versão estática, apenas mostrar gradiente criativo
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

export default React.memo(DesignGraficoBackground);