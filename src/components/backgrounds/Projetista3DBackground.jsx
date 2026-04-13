import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Projetista 3D
 * Conceito: Grade isométrica + wireframes de objetos 3D flutuando
 */
const Projetista3DBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const wireframesReference = useRef([]);

  // Configurações baseadas na performance - OTIMIZADAS v1.1
  const config = useMemo(() => ({
    // Grade isométrica - REDUZIDA
    gridSize: performanceConfig?.particleCount > 100 ? 40 : 60,
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

  // Classe para representar um wireframe 3D
  class Wireframe3D {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.z = Math.random() * 200 - 100;
      
      // Movimento
      this.vx = (Math.random() - 0.5) * config.animationSpeed;
      this.vy = (Math.random() - 0.5) * config.animationSpeed;
      this.vz = (Math.random() - 0.5) * config.animationSpeed;
      
      // Rotação - REDUZIDA
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;
      this.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01, // era 0.02
        y: (Math.random() - 0.5) * 0.01, // era 0.02
        z: (Math.random() - 0.5) * 0.01  // era 0.02
      };
      
      // Tipo de wireframe (cubo, pirâmide, esfera)
      this.type = ['cube', 'pyramid', 'sphere'][Math.floor(Math.random() * 3)];
      this.size = 15 + Math.random() * 20; // era 20-50
      this.opacity = 0.6 + Math.random() * 0.4; // TESTE: Opacidade alta para verificar visibilidade
    }

    update() {
      if (config.animationSpeed === 0) return;
      
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

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.globalAlpha = this.opacity;
      context.strokeStyle = config.colors.wireframe;
      context.lineWidth = 1;

      // Aplicar perspectiva simples baseada em Z
      const scale = 1 + this.z / 500;
      context.scale(scale, scale);

      // Desenhar baseado no tipo
      switch (this.type) {
        case 'cube': {
          this.drawCube(context);
          break;
        }
        case 'pyramid': {
          this.drawPyramid(context);
          break;
        }
        case 'sphere': {
          this.drawSphere(context);
          break;
        }
      }

      context.restore();
    }

    drawCube(context) {
      const s = this.size;
      // Face frontal
      context.strokeRect(-s/2, -s/2, s, s);
      
      // Linhas de profundidade (isométricas)
      const offset = s * 0.3;
      context.beginPath();
      // Arestas de profundidade
      context.moveTo(-s/2, -s/2);
      context.lineTo(-s/2 + offset, -s/2 - offset);
      context.moveTo(s/2, -s/2);
      context.lineTo(s/2 + offset, -s/2 - offset);
      context.moveTo(-s/2, s/2);
      context.lineTo(-s/2 + offset, s/2 - offset);
      context.moveTo(s/2, s/2);
      context.lineTo(s/2 + offset, s/2 - offset);
      
      // Face superior
      context.moveTo(-s/2 + offset, -s/2 - offset);
      context.lineTo(s/2 + offset, -s/2 - offset);
      context.lineTo(s/2 + offset, s/2 - offset);
      context.lineTo(-s/2 + offset, s/2 - offset);
      context.closePath();
      context.stroke();
    }

    drawPyramid(context) {
      const s = this.size;
      const h = s * 0.8;
      
      // Base
      context.strokeRect(-s/2, s/2 - h, s, h);
      
      // Linhas para o topo
      context.beginPath();
      context.moveTo(-s/2, s/2 - h);
      context.lineTo(0, -s/2);
      context.moveTo(s/2, s/2 - h);
      context.lineTo(0, -s/2);
      context.moveTo(-s/2, s/2);
      context.lineTo(0, -s/2);
      context.moveTo(s/2, s/2);
      context.lineTo(0, -s/2);
      context.stroke();
    }

    drawSphere(context) {
      const r = this.size / 2;
      
      // Círculo principal
      context.beginPath();
      context.arc(0, 0, r, 0, Math.PI * 2);
      context.stroke();
      
      // Linhas de latitude
      for (let index = 1; index < 3; index++) {
        const y = (r * 2 / 3) * (index - 1.5);
        const ellipseWidth = Math.sqrt(r * r - y * y) * 2;
        
        context.beginPath();
        context.ellipse(0, y, ellipseWidth / 2, ellipseWidth / 8, 0, 0, Math.PI * 2);
        context.stroke();
      }
      
      // Linha de longitude
      context.beginPath();
      context.ellipse(0, 0, r / 4, r, 0, 0, Math.PI * 2);
      context.stroke();
    }
  }

  // Grade isométrica removida por solicitação do usuário
  const drawIsometricGrid = (context) => {
    // Grid removido - apenas wireframes 3D agora
    return;
  };

  // Inicializar wireframes
  const initializeWireframes = (canvas) => {
    wireframesReference.current = [];
    for (let index = 0; index < config.wireframeCount; index++) {
      wireframesReference.current.push(new Wireframe3D(canvas));
    }
  };

  // Loop de animação com FPS limitado
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - (animationReference.lastTime || 0);
    
    // Limitar FPS para 30fps (33.33ms por frame)
    if (deltaTime < 33.33) {
      if (config.animationSpeed > 0) {
        animationReference.current = requestAnimationFrame(animate);
      }
      return;
    }
    
    animationReference.lastTime = currentTime;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar grade isométrica
    drawIsometricGrid(context);

    // Desenhar e atualizar wireframes
    for (const wireframe of wireframesReference.current) {
      wireframe.update();
      wireframe.draw(context);
    }

    if (config.animationSpeed > 0) {
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
      
      // Reinicializar wireframes com novo tamanho
      initializeWireframes(canvas);
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

export default React.memo(Projetista3DBackground); 