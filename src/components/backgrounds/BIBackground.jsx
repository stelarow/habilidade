import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Business Intelligence
 * Conceito: Fluxo de dados + dashboards interativos + visualização de KPIs
 */
const BIBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const dataStreamsReference = useRef([]);
  const kpiCardsReference = useRef([]);
  // dashboardRef removido - dashboard removido conforme solicitação

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Fluxos de dados - REMOVIDO efeito de partículas jato
    streamCount: 0, // Era Math.min(performanceConfig?.particleCount || 15, 8)
    streamSpeed: 0, // Era performanceConfig?.staticFallback ? 0 : 1.5
    
    // KPI Cards - REDUZIDO drasticamente
    kpiCount: Math.min(performanceConfig?.particleCount || 3, 2), // Era 12/6 → 3/2 (83% redução)
    kpiSpeed: performanceConfig?.staticFallback ? 0 : 0.4, // Era 0.8 → 0.4 (50% redução)
    
    // Dashboard removido conforme solicitação do usuário
    
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
      { label: 'Revenue', value: '$2.4M', trend: 'up', format: 'currency' },
      { label: 'Orders', value: '12,847', trend: 'up', format: 'number' },
      { label: 'Conversion', value: '4.2%', trend: 'down', format: 'percentage' }
      // Removidos: Profit Margin, AOV, CLTV (50% redução: 6→3 KPIs)
    ]
  }), [performanceConfig]);

  // Classe para streams de dados
  class DataStream {
    constructor(canvas) {
      this.canvas = canvas;
      this.particles = [];
      this.maxParticles = 8 + Math.floor(Math.random() * 6);
      this.spawnRate = 0.1 + Math.random() * 0.1;
      this.lastSpawn = 0;
      
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
      if (config.streamSpeed === 0) return;
      
      // Spawn new particles
      this.lastSpawn += this.spawnRate;
      if (this.lastSpawn >= 1 && this.particles.length < this.maxParticles) {
        this.particles.push({
          progress: 0,
          speed: config.streamSpeed * (0.8 + Math.random() * 0.4) * 0.01,
          size: 2 + Math.random() * 4,
          opacity: 0.8 + Math.random() * 0.2,
          life: 1,
          decay: 0.005 + Math.random() * 0.005
        });
        this.lastSpawn = 0;
      }
      
      // Update particles
      for (const [index, particle] of this.particles.entries()) {
        particle.progress += particle.speed;
        particle.life -= particle.decay;
        
        if (particle.progress >= 1 || particle.life <= 0) {
          this.particles.splice(index, 1);
        }
      }
    }

    draw(context) {
      context.save();
      context.globalAlpha = this.opacity;
      
      // Desenhar path do stream (opcional, para debug)
      if (false) { // Desabilitado para performance
        context.strokeStyle = config.colors.stream + '20';
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(this.startX, this.startY);
        context.quadraticCurveTo(this.controlX, this.controlY, this.endX, this.endY);
        context.stroke();
      }
      
      // Desenhar partículas
      for (const particle of this.particles) {
        const t = particle.progress;
        
        // Posição ao longo da curva Bézier quadrática
        const x = Math.pow(1-t, 2) * this.startX + 
                  2 * (1-t) * t * this.controlX + 
                  Math.pow(t, 2) * this.endX;
        const y = Math.pow(1-t, 2) * this.startY + 
                  2 * (1-t) * t * this.controlY + 
                  Math.pow(t, 2) * this.endY;
        
        context.save();
        context.globalAlpha = particle.opacity * particle.life;
        
        // Cor baseada no progresso
        const hue = (this.hue + t * 30) % 360;
        context.fillStyle = `hsl(${hue}, 70%, 60%)`;
        
        // Glow effect
        context.shadowColor = context.fillStyle;
        context.shadowBlur = particle.size * 2;
        
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
      }
      
      context.restore();
    }
  }

  // Classe para KPI cards flutuantes
  class FloatingKPI {
    constructor(canvas, kpi) {
      this.canvas = canvas;
      this.kpi = kpi;
      this.x = Math.random() * (canvas.width - 150) + 75;
      this.y = Math.random() * (canvas.height - 100) + 50;
      this.vx = (Math.random() - 0.5) * config.kpiSpeed;
      this.vy = (Math.random() - 0.5) * config.kpiSpeed;
      this.opacity = 0.3 + Math.random() * 0.2; // Era 0.6-0.9 → 0.3-0.5 (50% redução)
      this.scale = 0.6 + Math.random() * 0.2; // Era 0.8-1.2 → 0.6-0.8 (33% redução)
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.03 + Math.random() * 0.02;
      
      // Animação de valor
      this.valueAnimation = 0;
      this.animationSpeed = 0.02 + Math.random() * 0.02;
      this.targetValue = Number.parseFloat(this.kpi.value.replaceAll(/[$,%]/g, ''));
      this.currentValue = this.targetValue * (0.7 + Math.random() * 0.3);
    }

    update() {
      if (config.kpiSpeed === 0) return;
      
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

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);

      // Card do KPI - REDUZIDO
      const cardWidth = 100; // Era 140 → 100 (29% redução)
      const cardHeight = 60; // Era 80 → 60 (25% redução)
      
      // Fundo do card com glow
      context.shadowColor = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      context.shadowBlur = 12;
      context.fillStyle = config.colors.background + 'CC';
      context.fillRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Borda do card
      context.strokeStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      context.lineWidth = 2;
      context.strokeRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Label do KPI
      context.font = '12px Arial';
      context.fillStyle = config.colors.kpi;
      context.textAlign = 'center';
      context.fillText(this.kpi.label, 0, -20);
      
      // Valor animado do KPI
      let displayValue = '';
      if (this.kpi.format === 'currency') {
        displayValue = '$' + (this.currentValue / 1_000_000).toFixed(1) + 'M';
      } else if (this.kpi.format === 'percentage') {
        displayValue = this.currentValue.toFixed(1) + '%';
      } else {
        displayValue = Math.floor(this.currentValue).toLocaleString();
      }
      
      context.font = 'bold 16px Arial';
      context.fillStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      context.fillText(displayValue, 0, 0);
      
      // Indicador de tendência
      const arrowSize = 10;
      context.fillStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      context.beginPath();
      if (this.kpi.trend === 'up') {
        context.moveTo(-arrowSize/2, 20);
        context.lineTo(0, 10);
        context.lineTo(arrowSize/2, 20);
      } else {
        context.moveTo(-arrowSize/2, 10);
        context.lineTo(0, 20);
        context.lineTo(arrowSize/2, 10);
      }
      context.closePath();
      context.fill();
      
      // Mini sparkline
      context.strokeStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      context.lineWidth = 1;
      context.beginPath();
      
      for (let index = 0; index < 10; index++) {
        const x = -cardWidth/2 + 20 + (index / 9) * (cardWidth - 40);
        const variance = Math.sin((index + this.valueAnimation) * 0.5) * 5;
        const y = 25 + variance + (this.kpi.trend === 'up' ? -index * 0.5 : index * 0.5);
        
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      
      context.restore();
    }
  }

  // drawMainDashboard removida - dashboard removido conforme solicitação

  // Inicializar elementos
  const initializeElements = (canvas) => {
    dataStreamsReference.current = [];
    kpiCardsReference.current = [];
    
    // Criar streams de dados
    for (let index = 0; index < config.streamCount; index++) {
      dataStreamsReference.current.push(new DataStream(canvas));
    }
    
    // Criar KPI cards
    for (const kpi of config.kpis.slice(0, config.kpiCount)) {
      kpiCardsReference.current.push(new FloatingKPI(canvas, kpi));
    }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    for (const stream of dataStreamsReference.current) {
      stream.update();
      stream.draw(context);
    }
    
    for (const kpi of kpiCardsReference.current) {
      kpi.update();
      kpi.draw(context);
    }
    
    // drawMainDashboard removido conforme solicitação

    if (config.streamSpeed > 0 || config.kpiSpeed > 0) {
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

export default React.memo(BIBackground);
