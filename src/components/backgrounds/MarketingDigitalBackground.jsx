import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Marketing Digital
 * Conceito: Dashboards animados + métricas flutuantes + visualização de dados
 */
const MarketingDigitalBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const metricsReference = useRef([]);
  // chartsRef removido - gráficos removidos conforme solicitação
  // dashboardRef removido - Analytics Dashboard removido conforme solicitação

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Métricas flutuantes - REDUZIDO DRASTICAMENTE  
    metricCount: Math.min(performanceConfig?.particleCount || 3, 2), // Era 15/8 → 3/2 (83% redução)
    metricSpeed: performanceConfig?.staticFallback ? 0 : 0.6, // Era 1.2 → 0.6 (50% redução)
    
    // Gráficos removidos conforme solicitação do usuário
    
    // Dashboard removido completamente conforme solicitação
    
    // Cores do tema marketing
    colors: {
      primary: '#FF9FF3',    // Rosa vibrante
      secondary: '#54A0FF',  // Azul
      accent: '#5F27CD',     // Roxo
      metric: '#FF9FF3',     // Rosa para métricas
      chart: '#54A0FF',      // Azul para gráficos
      dashboard: '#5F27CD',  // Roxo para dashboard
      success: '#00D2D3',    // Ciano para valores positivos
      warning: '#FF9F43',    // Laranja para alertas
      background: '#1A1A2E'  // Fundo escuro
    },
    
    // Métricas para animar
    metrics: [
      { label: 'CTR', value: '3.47%', trend: 'up' },
      { label: 'CPC', value: '$0.83', trend: 'down' },
      { label: 'ROI', value: '247%', trend: 'up' },
      { label: 'Conversões', value: '1,284', trend: 'up' },
      { label: 'Impressões', value: '847K', trend: 'up' },
      { label: 'Cliques', value: '29.4K', trend: 'up' },
      { label: 'CPA', value: '$12.45', trend: 'down' },
      { label: 'ROAS', value: '4.2x', trend: 'up' }
    ]
  }), [performanceConfig]);

  // Classe para métricas flutuantes
  class FloatingMetric {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.metricSpeed;
      this.vy = (Math.random() - 0.5) * config.metricSpeed;
      this.opacity = 0.25 + Math.random() * 0.2; // Era 0.5-0.9 → 0.25-0.45 (50% redução)
      this.scale = 0.6 + Math.random() * 0.2; // Era 0.8-1.2 → 0.6-0.8 (33% redução)
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01; // Era 0.02 → 0.01 (50% redução)
      
      // Selecionar métrica aleatória
      this.metric = config.metrics[Math.floor(Math.random() * config.metrics.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.015 + Math.random() * 0.01; // Era 0.03-0.05 → 0.015-0.025 (50% redução)
      
      // Animação de valor - REDUZIDA
      this.valueAnimation = 0;
      this.animationSpeed = 0.025 + Math.random() * 0.025; // Era 0.05-0.1 → 0.025-0.05 (50% redução)
    }

    update() {
      if (config.metricSpeed === 0) return;
      
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;
      this.valueAnimation += this.animationSpeed;
      
      // Bounce suave nas bordas
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -0.8;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -0.8;
      
      // Manter dentro dos limites
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }

    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.rotation);
      context.scale(this.scale, this.scale);
      context.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);

      // Card da métrica - REDUZIDO
      const cardWidth = 90; // Era 120 → 90 (25% redução)
      const cardHeight = 45; // Era 60 → 45 (25% redução)
      
      // Fundo do card com glow
      context.shadowColor = this.metric.trend === 'up' ? config.colors.success : config.colors.warning;
      context.shadowBlur = 15;
      context.fillStyle = config.colors.background + 'CC';
      context.fillRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Borda do card
      context.strokeStyle = this.metric.trend === 'up' ? config.colors.success : config.colors.warning;
      context.lineWidth = 2;
      context.strokeRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Label da métrica
      context.font = '12px Arial';
      context.fillStyle = config.colors.metric;
      context.textAlign = 'center';
      context.fillText(this.metric.label, 0, -15);
      
      // Valor da métrica
      context.font = 'bold 16px Arial';
      context.fillStyle = this.metric.trend === 'up' ? config.colors.success : config.colors.warning;
      context.fillText(this.metric.value, 0, 5);
      
      // Seta de tendência
      const arrowSize = 8;
      context.fillStyle = this.metric.trend === 'up' ? config.colors.success : config.colors.warning;
      context.beginPath();
      if (this.metric.trend === 'up') {
        context.moveTo(-arrowSize/2, 15);
        context.lineTo(0, 8);
        context.lineTo(arrowSize/2, 15);
      } else {
        context.moveTo(-arrowSize/2, 8);
        context.lineTo(0, 15);
        context.lineTo(arrowSize/2, 8);
      }
      context.closePath();
      context.fill();
      
      context.restore();
    }
  }

  // Classe AnimatedChart removida - gráficos removidos conforme solicitação

  // drawDashboard removida - Analytics Dashboard removido conforme solicitação

  // Inicializar elementos
  const initializeElements = (canvas) => {
    metricsReference.current = [];
    
    // Criar métricas flutuantes
    for (let index = 0; index < config.metricCount; index++) {
      metricsReference.current.push(new FloatingMetric(canvas));
    }
    
    // Gráficos removidos conforme solicitação
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    for (const metric of metricsReference.current) {
      metric.update();
      metric.draw(context);
    }
    
    // drawDashboard removido conforme solicitação

    if (config.metricSpeed > 0) {
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

  // Se for versão estática, apenas mostrar gradiente de marketing
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

export default React.memo(MarketingDigitalBackground);
