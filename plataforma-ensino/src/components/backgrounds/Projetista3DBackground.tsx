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

interface Wireframe3DType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
  type: 'cube' | 'pyramid' | 'sphere';
  size: number;
  opacity: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  drawCube(ctx: CanvasRenderingContext2D): void;
  drawPyramid(ctx: CanvasRenderingContext2D): void;
  drawSphere(ctx: CanvasRenderingContext2D): void;
}

/**
 * Background animado para o curso de Projetista 3D
 * Conceito: Grade isométrica + wireframes de objetos 3D flutuando
 */
const Projetista3DBackground: React.FC<BackgroundProps> = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<{ 
    current: number | null; 
    lastTime?: number; 
  }>({ current: null });
  const wireframesRef = useRef<Wireframe3DType[]>([]);

  // Configurações baseadas na performance - OTIMIZADAS v1.1
  const config = useMemo(() => ({
    // Grade isométrica - REDUZIDA
    gridSize: performanceConfig?.particleCount! > 100 ? 40 : 60,
    gridOpacity: performanceConfig?.staticFallback ? 0.2 : 0.08, // era 0.15
    
    // Wireframes flutuantes - REDUZIDOS
    wireframeCount: Math.min(performanceConfig?.particleCount || 15, 4), // era 8
    animationSpeed: performanceConfig?.staticFallback ? 0 : 0.3, // era 0.5
    
    // Cores do tema 3D
    colors: {
      primary: '#FF6B35',    // Laranja vibrante
      secondary: '#F7931E',  // Laranja dourado
      accent: '#FFD23F',     // Amarelo
      grid: '#FF6B35',       // Laranja para grade
      wireframe: '#F7931E'   // Laranja dourado para wireframes
    }
  }), [performanceConfig]);

  // Use useRef to store class constructor to avoid recreating it
  const Wireframe3DRef = useRef<any>(null);

  // Initialize class constructor only once
  useMemo(() => {
    // Classe para representar um wireframe 3D
    class Wireframe3D implements Wireframe3DType {
      canvas: HTMLCanvasElement;
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      rotationX: number = 0;
      rotationY: number = 0;
      rotationZ: number = 0;
      rotationSpeed: {
        x: number;
        y: number;
        z: number;
      };
      type: 'cube' | 'pyramid' | 'sphere';
      size: number;
      opacity: number;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, configRef: typeof config) {
        this.canvas = canvas;
        this.config = configRef;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 200 - 100;
        
        // Movimento
        this.vx = (Math.random() - 0.5) * this.config.animationSpeed;
        this.vy = (Math.random() - 0.5) * this.config.animationSpeed;
        this.vz = (Math.random() - 0.5) * this.config.animationSpeed;
        
        // Rotação - REDUZIDA
        this.rotationSpeed = {
          x: (Math.random() - 0.5) * 0.01, // era 0.02
          y: (Math.random() - 0.5) * 0.01, // era 0.02
          z: (Math.random() - 0.5) * 0.01  // era 0.02
        };
        
        // Tipo de wireframe (cubo, pirâmide, esfera)
        this.type = ['cube', 'pyramid', 'sphere'][Math.floor(Math.random() * 3)] as 'cube' | 'pyramid' | 'sphere';
        this.size = 15 + Math.random() * 20; // era 20-50
        this.opacity = 0.6 + Math.random() * 0.4; // TESTE: Opacidade alta para verificar visibilidade
      }

      update() {
        if (this.config.animationSpeed === 0) return;
        
        // Movimento
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        
        // Rotação
        this.rotationX += this.rotationSpeed.x;
        this.rotationY += this.rotationSpeed.y;
        this.rotationZ += this.rotationSpeed.z;
        
        // Reposicionar quando sair da tela
        if (this.x < -50) this.x = this.canvas.width + 50;
        if (this.x > this.canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = this.canvas.height + 50;
        if (this.y > this.canvas.height + 50) this.y = -50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.config.colors.wireframe;
        ctx.lineWidth = 1;

        // Aplicar perspectiva simples baseada em Z
        const scale = 1 + this.z / 500;
        ctx.scale(scale, scale);

        // Desenhar baseado no tipo
        switch (this.type) {
          case 'cube':
            this.drawCube(ctx);
            break;
          case 'pyramid':
            this.drawPyramid(ctx);
            break;
          case 'sphere':
            this.drawSphere(ctx);
            break;
        }

        ctx.restore();
      }

      drawCube(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        // Face frontal
        ctx.strokeRect(-s/2, -s/2, s, s);
        
        // Linhas de profundidade (isométricas)
        const offset = s * 0.3;
        ctx.beginPath();
        // Arestas de profundidade
        ctx.moveTo(-s/2, -s/2);
        ctx.lineTo(-s/2 + offset, -s/2 - offset);
        ctx.moveTo(s/2, -s/2);
        ctx.lineTo(s/2 + offset, -s/2 - offset);
        ctx.moveTo(-s/2, s/2);
        ctx.lineTo(-s/2 + offset, s/2 - offset);
        ctx.moveTo(s/2, s/2);
        ctx.lineTo(s/2 + offset, s/2 - offset);
        
        // Face superior
        ctx.moveTo(-s/2 + offset, -s/2 - offset);
        ctx.lineTo(s/2 + offset, -s/2 - offset);
        ctx.lineTo(s/2 + offset, s/2 - offset);
        ctx.lineTo(-s/2 + offset, s/2 - offset);
        ctx.closePath();
        ctx.stroke();
      }

      drawPyramid(ctx: CanvasRenderingContext2D) {
        const s = this.size;
        const h = s * 0.8;
        
        // Base
        ctx.strokeRect(-s/2, s/2 - h, s, h);
        
        // Linhas para o topo
        ctx.beginPath();
        ctx.moveTo(-s/2, s/2 - h);
        ctx.lineTo(0, -s/2);
        ctx.moveTo(s/2, s/2 - h);
        ctx.lineTo(0, -s/2);
        ctx.moveTo(-s/2, s/2);
        ctx.lineTo(0, -s/2);
        ctx.moveTo(s/2, s/2);
        ctx.lineTo(0, -s/2);
        ctx.stroke();
      }

      drawSphere(ctx: CanvasRenderingContext2D) {
        const r = this.size / 2;
        
        // Círculo principal
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        
        // Linhas de latitude
        for (let i = 1; i < 3; i++) {
          const y = (r * 2 / 3) * (i - 1.5);
          const ellipseWidth = Math.sqrt(r * r - y * y) * 2;
          
          ctx.beginPath();
          ctx.ellipse(0, y, ellipseWidth / 2, ellipseWidth / 8, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Linha de longitude
        ctx.beginPath();
        ctx.ellipse(0, 0, r / 4, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    Wireframe3DRef.current = Wireframe3D;
  }, []);

  // Inicializar wireframes
  const initializeWireframes = useCallback((canvas: HTMLCanvasElement) => {
    wireframesRef.current = [];
    if (Wireframe3DRef.current) {
      for (let i = 0; i < config.wireframeCount; i++) {
        wireframesRef.current.push(new Wireframe3DRef.current(canvas, config));
      }
    }
  }, [config]);

  // Loop de animação com FPS limitado
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - (animationRef.current.lastTime || 0);
    
    // Limitar FPS para 30fps (33.33ms por frame)
    if (deltaTime < 33.33) {
      if (config.animationSpeed > 0) {
        animationRef.current.current = requestAnimationFrame(animate);
      }
      return;
    }
    
    animationRef.current.lastTime = currentTime;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar e atualizar wireframes
    wireframesRef.current.forEach(wireframe => {
      wireframe.update();
      wireframe.draw(ctx);
    });

    if (config.animationSpeed > 0) {
      animationRef.current.current = requestAnimationFrame(animate);
    }
  }, [config]);

  // Configurar canvas e inicializar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Capture the animation ref for cleanup
    const animationRefCurrent = animationRef.current;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (deviceCapabilities?.pixelRatio || 1);
      canvas.height = rect.height * (deviceCapabilities?.pixelRatio || 1);
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      
      // Reinicializar wireframes com novo tamanho
      initializeWireframes(canvas);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Iniciar animação
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      const currentAnimationId = animationRefCurrent?.current;
      if (currentAnimationId) {
        cancelAnimationFrame(currentAnimationId);
        if (animationRefCurrent) {
          animationRefCurrent.current = null;
        }
      }
    };
  }, [config, deviceCapabilities, animate, initializeWireframes]);

  // Se for versão estática, apenas mostrar a grade
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

export default React.memo(Projetista3DBackground);