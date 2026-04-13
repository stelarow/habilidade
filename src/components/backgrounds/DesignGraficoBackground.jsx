import React, { useEffect, useRef, useMemo, useState } from 'react';

/**
 * Background animado para o curso de Design Gráfico
 * Conceito: Gradientes dinâmicos + formas geométricas flutuantes + pinceladas digitais
 */
const DesignGraficoBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const shapesReference = useRef([]);
  const brushStrokesReference = useRef([]);
  const gradientReference = useRef({ phase: 0 });
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
    shapeTypes: ['circle', 'triangle', 'square', 'hexagon', 'star']
  }), [performanceConfig]);

  // Classe para formas geométricas flutuantes
  class GeometricShape {
    constructor(canvas) {
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

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.opacity;

      // Escolher cor baseada no índice
      const colors = [config.colors.gradient1, config.colors.gradient2, config.colors.gradient3];
      const color = colors[this.colorIndex];
      
      // Glow effect
      context.shadowColor = color;
      context.shadowBlur = 20;
      context.fillStyle = color;

      switch (this.type) {
        case 'circle': {
          this.drawCircle(context);
          break;
        }
        case 'triangle': {
          this.drawTriangle(context);
          break;
        }
        case 'square': {
          this.drawSquare(context);
          break;
        }
        case 'hexagon': {
          this.drawHexagon(context);
          break;
        }
        case 'star': {
          this.drawStar(context);
          break;
        }
      }

      context.restore();
    }

    drawCircle(context) {
      context.beginPath();
      context.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      context.fill();
    }

    drawTriangle(context) {
      context.beginPath();
      const height = this.size * 0.866; // altura de triângulo equilátero
      context.moveTo(0, -height / 2);
      context.lineTo(-this.size / 2, height / 2);
      context.lineTo(this.size / 2, height / 2);
      context.closePath();
      context.fill();
    }

    drawSquare(context) {
      context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }

    drawHexagon(context) {
      context.beginPath();
      for (let index = 0; index < 6; index++) {
        const angle = (index * Math.PI) / 3;
        const x = Math.cos(angle) * this.size / 2;
        const y = Math.sin(angle) * this.size / 2;
        
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
    }

    drawStar(context) {
      context.beginPath();
      const spikes = 5;
      const outerRadius = this.size / 2;
      const innerRadius = outerRadius * 0.5;
      
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
    }
  }

  // Classe para pinceladas digitais
  class BrushStroke {
    constructor(canvas) {
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
      for (let index = 0; index < 3; index++) {
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

    draw(context) {
      if (this.points.length < 2) return;
      
      context.save();
      context.globalAlpha = this.opacity * this.life;
      context.strokeStyle = this.color;
      context.lineWidth = this.width;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      // Desenhar pincelada com gradiente de opacidade
      context.beginPath();
      
      for (let index = 0; index < this.points.length - 1; index++) {
        const current = this.points[index];
        const next = this.points[index + 1];
        const alpha = (index / this.points.length) * this.life;
        
        context.globalAlpha = this.opacity * alpha;
        
        if (index === 0) {
          context.moveTo(current.x, current.y);
        } else {
          // Curva suave entre pontos
          const xc = (current.x + next.x) / 2;
          const yc = (current.y + next.y) / 2;
          context.quadraticCurveTo(current.x, current.y, xc, yc);
        }
      }
      
      context.stroke();
      context.restore();
    }
  }

  // Desenhar gradiente dinâmico de fundo
  const drawDynamicGradient = (context) => {
    const { width, height } = context.canvas;
    
    gradientReference.current.phase += config.gradientSpeed;
    
    // Criar gradiente radial que se move
    const centerX = width / 2 + Math.sin(gradientReference.current.phase) * 100;
    const centerY = height / 2 + Math.cos(gradientReference.current.phase * 0.7) * 80;
    
    const gradient = context.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, Math.max(width, height) * 0.8
    );
    
    // Cores que mudam com o tempo
    const phase1 = gradientReference.current.phase;
    const phase2 = gradientReference.current.phase + Math.PI * 0.5;
    const phase3 = gradientReference.current.phase + Math.PI;
    
    const alpha1 = (Math.sin(phase1) + 1) * 0.5 * config.gradientIntensity;
    const alpha2 = (Math.sin(phase2) + 1) * 0.5 * config.gradientIntensity;
    const alpha3 = (Math.sin(phase3) + 1) * 0.5 * config.gradientIntensity;
    
    gradient.addColorStop(0, `${config.colors.gradient1}${Math.floor(alpha1 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.5, `${config.colors.gradient2}${Math.floor(alpha2 * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(1, `${config.colors.gradient3}${Math.floor(alpha3 * 255).toString(16).padStart(2, '0')}`);
    
    context.save();
    context.globalAlpha = 0.1;
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    context.restore();
  };

  // Efeito do cursor (interatividade)
  const drawCursorEffect = (context) => {
    if (config.cursorInfluence === 0) return;
    
    const { x, y } = mousePosition;
    
    context.save();
    const gradient = context.createRadialGradient(x, y, 0, x, y, config.cursorInfluence);
    gradient.addColorStop(0, `${config.colors.glow}40`);
    gradient.addColorStop(1, `${config.colors.glow}00`);
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.restore();
  };

  // Track mouse position para interatividade
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasReference.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    if (config.cursorInfluence > 0) {
      globalThis.addEventListener('mousemove', handleMouseMove);
      return () => globalThis.removeEventListener('mousemove', handleMouseMove);
    }
  }, [config.cursorInfluence]);

  // Inicializar elementos
  const initializeElements = (canvas) => {
    shapesReference.current = [];
    brushStrokesReference.current = [];
    
    // Criar formas geométricas
    for (let index = 0; index < config.shapeCount; index++) {
      shapesReference.current.push(new GeometricShape(canvas));
    }
    
    // Criar pinceladas
    for (let index = 0; index < config.brushCount; index++) {
      brushStrokesReference.current.push(new BrushStroke(canvas));
    }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    drawDynamicGradient(context);
    drawCursorEffect(context);
    
    // Atualizar e desenhar pinceladas
    for (const brush of brushStrokesReference.current) {
      brush.update();
      brush.draw(context);
    }
    
    // Atualizar e desenhar formas
    for (const shape of shapesReference.current) {
      shape.update();
      shape.draw(context);
    }

    if (config.shapeSpeed > 0 || config.brushSpeed > 0 || config.gradientSpeed > 0) {
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

export default React.memo(DesignGraficoBackground);
