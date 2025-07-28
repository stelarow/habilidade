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

interface FilmFrameType {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  x: number;
  y: number;
  vx: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'scene' | 'transition' | 'effect';
  scale: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  drawScene(ctx: CanvasRenderingContext2D): void;
  drawTransition(ctx: CanvasRenderingContext2D): void;
  drawEffect(ctx: CanvasRenderingContext2D): void;
}

interface CinemaCameraType {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  rotation: number;
  bobOffset: number;
  bobSpeed: number;
  scale: number;
  opacity: number;
  lensRotation: number;
  lensSpeed: number;
  recordingBlink: number;
  recordingSpeed: number;
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

/**
 * Background animado para o curso de Edição de Vídeo
 * Conceito: Timeline cinematográfica + frames de filme se movendo lateralmente
 */
const EdicaoVideoBackground: React.FC<BackgroundProps> = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const filmFramesRef = useRef<FilmFrameType[]>([]);
  const timelineRef = useRef({ position: 0 });
  const cameraRef = useRef<CinemaCameraType | null>(null);

  // Configurações baseadas na performance - REDUZIDAS v1.2
  const config = useMemo(() => ({
    // Timeline - REMOVIDA COMPLETAMENTE
    timelineHeight: 0, // Era 60 → 0 (timeline removida)
    timelineSpeed: 0, // Era 0.6 → 0 (sem timeline)
    keyframeSpacing: 180,
    
    // Frames de filme - OTIMIZADOS
    frameCount: Math.min(performanceConfig?.particleCount || 8, 4), // Era 12/6 -> 8/4
    frameSpeed: performanceConfig?.staticFallback ? 0 : 0.6, // Era 0.8 -> 0.6
    frameWidth: 38,   // Era 45 -> 38
    frameHeight: 25,  // Era 30 -> 25
    
    // Câmera de cinema - REMOVIDA
    cameraEnabled: false, // Era true → false (câmera removida)
    cameraSpeed: 0, // Era 0.02 → 0 (sem animação)
    
    // Lens flares e sparkles - REMOVIDOS
    sparkleCount: 0, // era Math.min(performanceConfig?.particleCount || 20, 6)
    flareIntensity: 0, // era performanceConfig?.staticFallback ? 0 : 0.6
    
    // Cores do tema cinematográfico
    colors: {
      primary: '#FF4757',    // Vermelho vibrante
      secondary: '#FF3838',  // Vermelho intenso
      accent: '#FF6B9D',     // Rosa cinematográfico
      timeline: '#FF4757',   // Vermelho para timeline
      frame: '#FF3838',      // Vermelho para frames
      sparkle: '#FF6B9D',    // Rosa para sparkles
      flare: '#FFFFFF'       // Branco para lens flares
    }
  }), [performanceConfig]);

  // Use useRef to store class constructors to avoid recreating them
  const FilmFrameRef = useRef<any>(null);
  const CinemaCameraRef = useRef<any>(null);

  // Initialize class constructors only once
  useMemo(() => {
    // Classe para representar um frame de filme
    class FilmFrame implements FilmFrameType {
      canvas: HTMLCanvasElement;
      width: number;
      height: number;
      x: number;
      y: number;
      vx: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      type: 'scene' | 'transition' | 'effect';
      scale: number;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, configRef: typeof config) {
        this.canvas = canvas;
        this.config = configRef;
        this.width = this.config.frameWidth;
        this.height = this.config.frameHeight;
        this.x = Math.random() * (canvas.width + this.width) - this.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.vx = -this.config.frameSpeed * (0.5 + Math.random() * 0.5);
        this.opacity = 0.2 + Math.random() * 0.3; // Era 0.3-0.7 -> 0.2-0.5
        this.rotation = (Math.random() - 0.5) * 0.2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        
        // Tipo de frame (scene, transition, effect)
        this.type = ['scene', 'transition', 'effect'][Math.floor(Math.random() * 3)] as 'scene' | 'transition' | 'effect';
        this.scale = 0.8 + Math.random() * 0.4;
      }

      update() {
        if (this.config.frameSpeed === 0) return;
        
        this.x += this.vx;
        this.rotation += this.rotationSpeed;
        
        // Reposicionar quando sair da tela
        if (this.x < -this.width - 50) {
          this.x = this.canvas.width + 50;
          this.y = Math.random() * (this.canvas.height - this.height);
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;

        // Desenhar frame baseado no tipo
        switch (this.type) {
          case 'scene':
            this.drawScene(ctx);
            break;
          case 'transition':
            this.drawTransition(ctx);
            break;
          case 'effect':
            this.drawEffect(ctx);
            break;
        }

        ctx.restore();
      }

      drawScene(ctx: CanvasRenderingContext2D) {
        // Frame principal
        ctx.strokeStyle = this.config.colors.frame;
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Buracos de filme nas laterais
        for (let i = 0; i < 4; i++) {
          const y = -this.height/2 + (i + 0.5) * (this.height / 4);
          
          // Lado esquerdo
          ctx.fillStyle = this.config.colors.frame;
          ctx.fillRect(-this.width/2 - 5, y - 3, 5, 6);
          
          // Lado direito  
          ctx.fillRect(this.width/2, y - 3, 5, 6);
        }

        // Conteúdo do frame (simulação)
        ctx.fillStyle = this.config.colors.primary + '30';
        ctx.fillRect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height - 8);
      }

      drawTransition(ctx: CanvasRenderingContext2D) {
        // Frame com efeito de transição
        ctx.strokeStyle = this.config.colors.accent;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        ctx.setLineDash([]);
        
        // Efeito de fade
        const gradient = ctx.createLinearGradient(-this.width/2, 0, this.width/2, 0);
        gradient.addColorStop(0, this.config.colors.primary + '00');
        gradient.addColorStop(0.5, this.config.colors.accent + '60');
        gradient.addColorStop(1, this.config.colors.secondary + '00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
      }

      drawEffect(ctx: CanvasRenderingContext2D) {
        // Frame com efeito especial
        ctx.strokeStyle = this.config.colors.sparkle;
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        
        // Sparkles internos
        for (let i = 0; i < 3; i++) {
          const x = (Math.random() - 0.5) * (this.width - 10);
          const y = (Math.random() - 0.5) * (this.height - 10);
          
          ctx.fillStyle = this.config.colors.flare;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Classe para câmera de cinema
    class CinemaCamera implements CinemaCameraType {
      canvas: HTMLCanvasElement;
      x: number;
      y: number;
      rotation: number = 0;
      bobOffset: number = 0;
      bobSpeed: number = 0.03;
      scale: number;
      opacity: number;
      lensRotation: number = 0;
      lensSpeed: number = 0.01;
      recordingBlink: number = 0;
      recordingSpeed: number = 0.1;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, configRef: typeof config) {
        this.canvas = canvas;
        this.config = configRef;
        this.x = canvas.width * 0.8; // Posição fixa no canto direito
        this.y = canvas.height * 0.2; // Parte superior
        this.scale = 0.8 + Math.random() * 0.4;
        this.opacity = 0.6 + Math.random() * 0.3;
      }

      update() {
        if (!this.config.cameraEnabled || this.config.cameraSpeed === 0) return;
        
        this.rotation += this.config.cameraSpeed;
        this.bobOffset += this.bobSpeed;
        this.lensRotation += this.lensSpeed;
        this.recordingBlink += this.recordingSpeed;
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.config.cameraEnabled) return;
        
        ctx.save();
        ctx.translate(this.x, this.y + Math.sin(this.bobOffset) * 3);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;

        // Corpo da câmera
        ctx.fillStyle = this.config.colors.secondary;
        ctx.fillRect(-30, -20, 60, 40);
        
        // Borda do corpo
        ctx.strokeStyle = this.config.colors.frame;
        ctx.lineWidth = 2;
        ctx.strokeRect(-30, -20, 60, 40);
        
        // Lente principal
        ctx.save();
        ctx.translate(20, 0);
        ctx.rotate(this.lensRotation);
        
        // Círculo externo da lente
        ctx.strokeStyle = this.config.colors.accent;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // Círculo interno da lente
        ctx.fillStyle = this.config.colors.primary + '40';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Reflexo da lente
        ctx.fillStyle = this.config.colors.flare + '80';
        ctx.beginPath();
        ctx.arc(-3, -3, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        // Suporte superior
        ctx.fillStyle = this.config.colors.frame;
        ctx.fillRect(-5, -30, 10, 15);
        
        // Visor
        ctx.fillStyle = this.config.colors.primary + '60';
        ctx.fillRect(-25, -15, 20, 12);
        
        // Botão de gravação (piscando)
        const recordingAlpha = 0.5 + Math.sin(this.recordingBlink) * 0.5;
        ctx.globalAlpha = this.opacity * recordingAlpha;
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(-20, -25, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Texto "REC"
        ctx.globalAlpha = this.opacity;
        ctx.font = '8px Arial';
        ctx.fillStyle = this.config.colors.flare;
        ctx.fillText('REC', -15, -22);
        
        // Tripé (três pernas simples)
        ctx.strokeStyle = this.config.colors.secondary;
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          const angle = (i * Math.PI * 2) / 3;
          const legX = Math.cos(angle) * 25;
          const legY = Math.sin(angle) * 25;
          
          ctx.beginPath();
          ctx.moveTo(0, 20);
          ctx.lineTo(legX, 20 + legY);
          ctx.stroke();
        }

        ctx.restore();
      }
    }

    FilmFrameRef.current = FilmFrame;
    CinemaCameraRef.current = CinemaCamera;
  }, []);

  // Inicializar elementos
  const initializeElements = useCallback((canvas: HTMLCanvasElement) => {
    // Film frames
    filmFramesRef.current = [];
    if (FilmFrameRef.current) {
      for (let i = 0; i < config.frameCount; i++) {
        filmFramesRef.current.push(new FilmFrameRef.current(canvas, config));
      }
    }
    
    // Câmera de cinema
    if (config.cameraEnabled && CinemaCameraRef.current) {
      cameraRef.current = new CinemaCameraRef.current(canvas, config);
    }
  }, [config]);

  // Loop de animação
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar e atualizar film frames
    filmFramesRef.current.forEach((element: any) => {
      element.update();
      element.draw(ctx);
    });

    // Desenhar e atualizar câmera
    if (cameraRef.current) {
      cameraRef.current.update();
      cameraRef.current.draw(ctx);
    }

    if (config.frameSpeed > 0 || config.cameraSpeed > 0) {
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

  // Se for versão estática, apenas mostrar gradiente cinematográfico
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

export default React.memo(EdicaoVideoBackground);