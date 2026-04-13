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
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const filmFramesReference = useRef([]);
  const timelineReference = useRef({ position: 0 });
  const cameraReference = useRef(null);

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

    draw(context) {
      context.save();
      context.translate(this.x + this.width/2, this.y + this.height/2);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.opacity;

      // Desenhar frame baseado no tipo
      switch (this.type) {
        case 'scene': {
          this.drawScene(context);
          break;
        }
        case 'transition': {
          this.drawTransition(context);
          break;
        }
        case 'effect': {
          this.drawEffect(context);
          break;
        }
      }

      context.restore();
    }

    drawScene(context) {
      // Frame principal
      context.strokeStyle = config.colors.frame;
      context.lineWidth = 2;
      context.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      
      // Buracos de filme nas laterais
      for (let index = 0; index < 4; index++) {
        const y = -this.height/2 + (index + 0.5) * (this.height / 4);
        
        // Lado esquerdo
        context.fillStyle = config.colors.frame;
        context.fillRect(-this.width/2 - 5, y - 3, 5, 6);
        
        // Lado direito  
        context.fillRect(this.width/2, y - 3, 5, 6);
      }

      // Conteúdo do frame (simulação)
      context.fillStyle = config.colors.primary + '30';
      context.fillRect(-this.width/2 + 4, -this.height/2 + 4, this.width - 8, this.height - 8);
    }

    drawTransition(context) {
      // Frame com efeito de transição
      context.strokeStyle = config.colors.accent;
      context.lineWidth = 1.5;
      context.setLineDash([4, 2]);
      context.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      context.setLineDash([]);
      
      // Efeito de fade
      const gradient = context.createLinearGradient(-this.width/2, 0, this.width/2, 0);
      gradient.addColorStop(0, config.colors.primary + '00');
      gradient.addColorStop(0.5, config.colors.accent + '60');
      gradient.addColorStop(1, config.colors.secondary + '00');
      
      context.fillStyle = gradient;
      context.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    }

    drawEffect(context) {
      // Frame com efeito especial
      context.strokeStyle = config.colors.sparkle;
      context.lineWidth = 1;
      context.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
      
      // Sparkles internos
      for (let index = 0; index < 3; index++) {
        const x = (Math.random() - 0.5) * (this.width - 10);
        const y = (Math.random() - 0.5) * (this.height - 10);
        
        context.fillStyle = config.colors.flare;
        context.beginPath();
        context.arc(x, y, 1, 0, Math.PI * 2);
        context.fill();
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

    draw(context) {
      if (this.life <= 0) return;
      
      context.save();
      context.translate(this.x, this.y);
      
      const alpha = this.life * Math.sin(this.twinkle) * config.flareIntensity;
      context.globalAlpha = Math.max(0, alpha);
      
      // Sparkle em formato de estrela
      context.fillStyle = config.colors.flare;
      context.beginPath();
      
      const spikes = 4;
      const outerRadius = this.size;
      const innerRadius = this.size * 0.5;
      
      for (let index = 0; index < spikes * 2; index++) {
        const radius = index % 2 === 0 ? outerRadius : innerRadius;
        const angle = (index * Math.PI) / spikes;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      
      context.closePath();
      context.fill();
      context.restore();
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

    draw(context) {
      if (!config.cameraEnabled) return;
      
      context.save();
      context.translate(this.x, this.y + Math.sin(this.bobOffset) * 3);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.opacity;

      // Corpo da câmera
      context.fillStyle = config.colors.secondary;
      context.fillRect(-30, -20, 60, 40);
      
      // Borda do corpo
      context.strokeStyle = config.colors.frame;
      context.lineWidth = 2;
      context.strokeRect(-30, -20, 60, 40);
      
      // Lente principal
      context.save();
      context.translate(20, 0);
      context.rotate(this.lensRotation);
      
      // Círculo externo da lente
      context.strokeStyle = config.colors.accent;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(0, 0, 15, 0, Math.PI * 2);
      context.stroke();
      
      // Círculo interno da lente
      context.fillStyle = config.colors.primary + '40';
      context.beginPath();
      context.arc(0, 0, 10, 0, Math.PI * 2);
      context.fill();
      
      // Reflexo da lente
      context.fillStyle = config.colors.flare + '80';
      context.beginPath();
      context.arc(-3, -3, 4, 0, Math.PI * 2);
      context.fill();
      
      context.restore();
      
      // Suporte superior
      context.fillStyle = config.colors.frame;
      context.fillRect(-5, -30, 10, 15);
      
      // Visor
      context.fillStyle = config.colors.primary + '60';
      context.fillRect(-25, -15, 20, 12);
      
      // Botão de gravação (piscando)
      const recordingAlpha = 0.5 + Math.sin(this.recordingBlink) * 0.5;
      context.globalAlpha = this.opacity * recordingAlpha;
      context.fillStyle = '#FF0000';
      context.beginPath();
      context.arc(-20, -25, 3, 0, Math.PI * 2);
      context.fill();
      
      // Texto "REC"
      context.globalAlpha = this.opacity;
      context.font = '8px Arial';
      context.fillStyle = config.colors.flare;
      context.fillText('REC', -15, -22);
      
      // Tripé (três pernas simples)
      context.strokeStyle = config.colors.secondary;
      context.lineWidth = 2;
      for (let index = 0; index < 3; index++) {
        const angle = (index * Math.PI * 2) / 3;
        const legX = Math.cos(angle) * 25;
        const legY = Math.sin(angle) * 25;
        
        context.beginPath();
        context.moveTo(0, 20);
        context.lineTo(legX, 20 + legY);
        context.stroke();
      }

      context.restore();
    }
  }

  // Desenhar timeline cinematográfica
  const drawTimeline = (context) => {
    if (config.timelineHeight === 0 || config.timelineSpeed === 0) return; // Não desenhar se removida
    
    const { width, height } = context.canvas;
    const timelineY = height - config.timelineHeight - 20;
    
    context.save();
    context.globalAlpha = 0.8;
    
    // Fundo da timeline
    context.fillStyle = config.colors.timeline + '20';
    context.fillRect(0, timelineY, width, config.timelineHeight);
    
    // Borda da timeline
    context.strokeStyle = config.colors.timeline;
    context.lineWidth = 2;
    context.strokeRect(0, timelineY, width, config.timelineHeight);
    
    // Keyframes na timeline
    const keyframeY = timelineY + config.timelineHeight / 2;
    timelineReference.current.position += config.timelineSpeed;
    
    for (let x = (timelineReference.current.position % config.keyframeSpacing) - config.keyframeSpacing; 
         x < width + config.keyframeSpacing; 
         x += config.keyframeSpacing) {
      
      // Keyframe marker
      context.fillStyle = config.colors.accent;
      context.fillRect(x - 2, keyframeY - 15, 4, 30);
      
      // Keyframe diamond
      context.beginPath();
      context.moveTo(x, keyframeY - 8);
      context.lineTo(x + 6, keyframeY);
      context.lineTo(x, keyframeY + 8);
      context.lineTo(x - 6, keyframeY);
      context.closePath();
      context.fill();
    }
    
    // Playhead
    const playheadX = width * 0.3;
    context.fillStyle = config.colors.flare;
    context.fillRect(playheadX - 1, timelineY - 10, 2, config.timelineHeight + 20);
    
    // Playhead triangle
    context.beginPath();
    context.moveTo(playheadX, timelineY - 10);
    context.lineTo(playheadX - 8, timelineY - 20);
    context.lineTo(playheadX + 8, timelineY - 20);
    context.closePath();
    context.fill();
    
    context.restore();
  };

  // Inicializar elementos - AUMENTADOS + CÂMERA
  const initializeElements = (canvas) => {
    // Film frames - AUMENTADOS
    filmFramesReference.current = [];
    for (let index = 0; index < config.frameCount; index++) {
      filmFramesReference.current.push(new FilmFrame(canvas));
    }
    
    // Câmera de cinema - NOVA
    if (config.cameraEnabled) {
      cameraReference.current = new CinemaCamera(canvas);
    }
    
    // Sparkles removidos para simplicidade
    // for (let i = 0; i < config.sparkleCount; i++) {
    //   filmFramesRef.current.push(new CinematicSparkle(canvas));
    // }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar timeline (se ativa)
    drawTimeline(context);

    // Desenhar e atualizar film frames
    for (const element of filmFramesReference.current) {
      element.update();
      element.draw(context);
    }

    // Desenhar e atualizar câmera
    if (cameraReference.current) {
      cameraReference.current.update();
      cameraReference.current.draw(context);
    }

    if (config.frameSpeed > 0 || config.cameraSpeed > 0) {
      animationReference.current = requestAnimationFrame(animate);
    }
  };

  // Configurar canvas e inicializar
  useEffect(() => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (deviceCapabilities?.pixelRatio || 1);
      canvas.height = rect.height * (deviceCapabilities?.pixelRatio || 1);
      
      const context = canvas.getContext('2d');
      context.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      
      // Reinicializar elementos com novo tamanho
      initializeElements(canvas);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Iniciar animação
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationReference.current) {
        cancelAnimationFrame(animationReference.current);
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
      ref={canvasReference}
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