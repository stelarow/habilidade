// Force save
import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Edição de Vídeo
 * Conceito: Timeline cinematográfica + frames de filme se movendo lateralmente
 */
const EdicaoVideoBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const filmFramesRef = useRef([]);
  const timelineRef = useRef({ position: 0 });
  const cameraRef = useRef(null);

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

  // Classe para representar um frame de filme
  class FilmFrame {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = config.frameWidth;
      this.height = config.frameHeight;
      this.x = Math.random() * (canvas.width + this.width) - this.width;
      this.y = Math.random() * (canvas.height - this.height);
      this.vx = -config.frameSpeed * (0.5 + Math.random() * 0.5);
      this.opacity = 0.2 + Math.random() * 0.3; // Era 0.3-0.7 -> 0.2-0.5
      this.rotation = (Math.random() - 0.5) * 0.2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      
      // Tipo de frame (scene, transition, effect)
      this.type = ['scene', 'transition', 'effect'][Math.floor(Math.random() * 3)];
      this.scale = 0.8 + Math.random() * 0.4;
    }

    update() {
      if (config.frameSpeed === 0) return;
      
      this.x += this.vx;
      this.rotation += this.rotationSpeed;
      
      // Reposicionar quando sair da tela
      if (this.x < -this.width - 50) {
        this.x = this.canvas.width + 50;
        this.y = Math.random() * (this.canvas.height - this.height);
      }
    }

    draw(ctx) {
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

    drawScene(ctx) {
      // Frame principal
      ctx.strokeStyle = config.colors.frame;
      ctx.lineWidth = 2;
      ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      
      // Buracos de filme nas laterais
      for (let i = 0; i < 4; i++) {
        const y = -this.height/2 + (i + 0.5) * (this.height / 4);
        
        // Lado esquerdo
        ctx.fillStyle = config.colors.frame;
        ctx.fillRect(-this.width/2 - 5, y - 3, 5, 6);
        
        // Lado direito  
        ctx.fillRect(this.width/2, y - 3, 5, 6);
      }

      // Conteúdo do frame (simulação)
      ctx.fillStyle = config.colors.primary + '30';
      ctx.fillRect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height - 8);
    }

    drawTransition(ctx) {
      // Frame com efeito de transição
      ctx.strokeStyle = config.colors.accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      ctx.setLineDash([]);
      
      // Efeito de fade
      const gradient = ctx.createLinearGradient(-this.width/2, 0, this.width/2, 0);
      gradient.addColorStop(0, config.colors.primary + '00');
      gradient.addColorStop(0.5, config.colors.accent + '60');
      gradient.addColorStop(1, config.colors.secondary + '00');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    drawEffect(ctx) {
      // Frame com efeito especial
      ctx.strokeStyle = config.colors.sparkle;
      ctx.lineWidth = 1;
      ctx.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      
      // Sparkles internos
      for (let i = 0; i < 3; i++) {
        const x = (Math.random() - 0.5) * (this.width - 10);
        const y = (Math.random() - 0.5) * (this.height - 10);
        
        ctx.fillStyle = config.colors.flare;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Classe para sparkles cinematográficos
  class CinematicSparkle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.life = 1;
      this.decay = 0.005 + Math.random() * 0.01;
      this.size = 1 + Math.random() * 3;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = 0.1 + Math.random() * 0.1;
    }

    update() {
      if (config.flareIntensity === 0) return;
      
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.twinkle += this.twinkleSpeed;
      
      // Reposicionar quando morrer
      if (this.life <= 0) {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.life = 1;
      }
    }

    draw(ctx) {
      if (this.life <= 0) return;
      
      ctx.save();
      ctx.translate(this.x, this.y);
      
      const alpha = this.life * Math.sin(this.twinkle) * config.flareIntensity;
      ctx.globalAlpha = Math.max(0, alpha);
      
      // Sparkle em formato de estrela
      ctx.fillStyle = config.colors.flare;
      ctx.beginPath();
      
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size * 0.5;
      
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
      ctx.restore();
    }
  }

  // Classe para câmera de cinema
  class CinemaCamera {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = canvas.width * 0.8; // Posição fixa no canto direito
      this.y = canvas.height * 0.2; // Parte superior
      this.rotation = 0;
      this.bobOffset = 0;
      this.bobSpeed = 0.03;
      this.scale = 0.8 + Math.random() * 0.4;
      this.opacity = 0.6 + Math.random() * 0.3;
      this.lensRotation = 0;
      this.lensSpeed = 0.01;
      this.recordingBlink = 0;
      this.recordingSpeed = 0.1;
    }

    update() {
      if (!config.cameraEnabled || config.cameraSpeed === 0) return;
      
      this.rotation += config.cameraSpeed;
      this.bobOffset += this.bobSpeed;
      this.lensRotation += this.lensSpeed;
      this.recordingBlink += this.recordingSpeed;
    }

    draw(ctx) {
      if (!config.cameraEnabled) return;
      
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.bobOffset) * 3);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;

      // Corpo da câmera
      ctx.fillStyle = config.colors.secondary;
      ctx.fillRect(-30, -20, 60, 40);
      
      // Borda do corpo
      ctx.strokeStyle = config.colors.frame;
      ctx.lineWidth = 2;
      ctx.strokeRect(-30, -20, 60, 40);
      
      // Lente principal
      ctx.save();
      ctx.translate(20, 0);
      ctx.rotate(this.lensRotation);
      
      // Círculo externo da lente
      ctx.strokeStyle = config.colors.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      // Círculo interno da lente
      ctx.fillStyle = config.colors.primary + '40';
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Reflexo da lente
      ctx.fillStyle = config.colors.flare + '80';
      ctx.beginPath();
      ctx.arc(-3, -3, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      
      // Suporte superior
      ctx.fillStyle = config.colors.frame;
      ctx.fillRect(-5, -30, 10, 15);
      
      // Visor
      ctx.fillStyle = config.colors.primary + '60';
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
      ctx.fillStyle = config.colors.flare;
      ctx.fillText('REC', -15, -22);
      
      // Tripé (três pernas simples)
      ctx.strokeStyle = config.colors.secondary;
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

  // Desenhar timeline cinematográfica
  const drawTimeline = (ctx) => {
    if (config.timelineHeight === 0 || config.timelineSpeed === 0) return; // Não desenhar se removida
    
    const { width, height } = ctx.canvas;
    const timelineY = height - config.timelineHeight - 20;
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    
    // Fundo da timeline
    ctx.fillStyle = config.colors.timeline + '20';
    ctx.fillRect(0, timelineY, width, config.timelineHeight);
    
    // Borda da timeline
    ctx.strokeStyle = config.colors.timeline;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, timelineY, width, config.timelineHeight);
    
    // Keyframes na timeline
    const keyframeY = timelineY + config.timelineHeight / 2;
    timelineRef.current.position += config.timelineSpeed;
    
    for (let x = (timelineRef.current.position % config.keyframeSpacing) - config.keyframeSpacing; 
         x < width + config.keyframeSpacing; 
         x += config.keyframeSpacing) {
      
      // Keyframe marker
      ctx.fillStyle = config.colors.accent;
      ctx.fillRect(x - 2, keyframeY - 15, 4, 30);
      
      // Keyframe diamond
      ctx.beginPath();
      ctx.moveTo(x, keyframeY - 8);
      ctx.lineTo(x + 6, keyframeY);
      ctx.lineTo(x, keyframeY + 8);
      ctx.lineTo(x - 6, keyframeY);
      ctx.closePath();
      ctx.fill();
    }
    
    // Playhead
    const playheadX = width * 0.3;
    ctx.fillStyle = config.colors.flare;
    ctx.fillRect(playheadX - 1, timelineY - 10, 2, config.timelineHeight + 20);
    
    // Playhead triangle
    ctx.beginPath();
    ctx.moveTo(playheadX, timelineY - 10);
    ctx.lineTo(playheadX - 8, timelineY - 20);
    ctx.lineTo(playheadX + 8, timelineY - 20);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  // Inicializar elementos - AUMENTADOS + CÂMERA
  const initializeElements = (canvas) => {
    // Film frames - AUMENTADOS
    filmFramesRef.current = [];
    for (let i = 0; i < config.frameCount; i++) {
      filmFramesRef.current.push(new FilmFrame(canvas));
    }
    
    // Câmera de cinema - NOVA
    if (config.cameraEnabled) {
      cameraRef.current = new CinemaCamera(canvas);
    }
    
    // Sparkles removidos para simplicidade
    // for (let i = 0; i < config.sparkleCount; i++) {
    //   filmFramesRef.current.push(new CinematicSparkle(canvas));
    // }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar timeline (se ativa)
    drawTimeline(ctx);

    // Desenhar e atualizar film frames
    filmFramesRef.current.forEach(element => {
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
  }, [config, deviceCapabilities]);

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