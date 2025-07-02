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
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dataStreamsRef = useRef([]);
  const kpiCardsRef = useRef([]);
  const dashboardRef = useRef({ animationPhase: 0, dataUpdate: 0 });

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Fluxos de dados - REMOVIDO efeito de partículas jato
    streamCount: 0, // Era Math.min(performanceConfig?.particleCount || 15, 8)
    streamSpeed: 0, // Era performanceConfig?.staticFallback ? 0 : 1.5
    
    // KPI Cards - REDUZIDO drasticamente
    kpiCount: Math.min(performanceConfig?.particleCount || 3, 2), // Era 12/6 → 3/2 (83% redução)
    kpiSpeed: performanceConfig?.staticFallback ? 0 : 0.4, // Era 0.8 → 0.4 (50% redução)
    
    // Dashboard - REDUZIDO
    dashboardSpeed: performanceConfig?.staticFallback ? 0 : 0.01, // Era 0.02 → 0.01 (50% redução)
    
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
      this.particles.forEach((particle, index) => {
        particle.progress += particle.speed;
        particle.life -= particle.decay;
        
        if (particle.progress >= 1 || particle.life <= 0) {
          this.particles.splice(index, 1);
        }
      });
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      // Desenhar path do stream (opcional, para debug)
      if (false) { // Desabilitado para performance
        ctx.strokeStyle = config.colors.stream + '20';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.quadraticCurveTo(this.controlX, this.controlY, this.endX, this.endY);
        ctx.stroke();
      }
      
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
      this.targetValue = parseFloat(this.kpi.value.replace(/[$,%]/g, ''));
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

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);

      // Card do KPI - REDUZIDO
      const cardWidth = 100; // Era 140 → 100 (29% redução)
      const cardHeight = 60; // Era 80 → 60 (25% redução)
      
      // Fundo do card com glow
      ctx.shadowColor = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      ctx.shadowBlur = 12;
      ctx.fillStyle = config.colors.background + 'CC';
      ctx.fillRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Borda do card
      ctx.strokeStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      ctx.lineWidth = 2;
      ctx.strokeRect(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
      
      // Label do KPI
      ctx.font = '12px Arial';
      ctx.fillStyle = config.colors.kpi;
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
      ctx.fillStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
      ctx.fillText(displayValue, 0, 0);
      
      // Indicador de tendência
      const arrowSize = 10;
      ctx.fillStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
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
      ctx.strokeStyle = this.kpi.trend === 'up' ? config.colors.success : config.colors.warning;
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

  // Desenhar dashboard principal
  const drawMainDashboard = (ctx) => {
    if (config.dashboardSpeed === 0) return;
    
    dashboardRef.current.animationPhase += config.dashboardSpeed;
    dashboardRef.current.dataUpdate += 0.01;
    
    const dashX = ctx.canvas.width - 250; // Era 320 → 250 (22% redução)
    const dashY = ctx.canvas.height - 180; // Movido para parte inferior para não atrapalhar textos
    const dashWidth = 220; // Era 300 → 220 (27% redução)
    const dashHeight = 140; // Era 200 → 140 (30% redução)
    
    // Fundo do dashboard
    ctx.save();
    ctx.fillStyle = config.colors.background + 'F0';
    ctx.fillRect(dashX, dashY, dashWidth, dashHeight);
    
    // Borda do dashboard
    ctx.strokeStyle = config.colors.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(dashX, dashY, dashWidth, dashHeight);
    
    // Título do dashboard
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = config.colors.primary;
    ctx.textAlign = 'left';
    ctx.fillText('BI Dashboard', dashX + 15, dashY + 25);
    
    // Timestamp
    ctx.font = '10px Arial';
    ctx.fillStyle = config.colors.accent;
    const now = new Date();
    ctx.fillText(`Updated: ${now.toLocaleTimeString()}`, dashX + 15, dashY + 40);
    
    // Gráfico de tendência principal - SIMPLIFICADO
    ctx.strokeStyle = config.colors.success;
    ctx.lineWidth = 1; // Era 2 → 1 (50% redução)
    ctx.beginPath();
    
    const chartStartX = dashX + 15;
    const chartStartY = dashY + 50; // Era 60 → 50 (ajuste para dashboard menor)
    const chartWidth = dashWidth - 30;
    const chartHeight = 40; // Era 60 → 40 (33% redução)
    
    for (let i = 0; i <= 10; i++) { // Era 20 → 10 pontos (50% redução)
      const x = chartStartX + (i / 10) * chartWidth;
      const baseY = chartStartY + chartHeight/2;
      const trend = Math.sin((i + dashboardRef.current.dataUpdate * 5) * 0.2) * 8; // Era *10*0.3*15 → *5*0.2*8
      const growth = Math.sin((i + dashboardRef.current.dataUpdate * 3) * 0.05) * 10; // Era *5*0.1*20 → *3*0.05*10
      const y = baseY + trend + growth - (i * 0.4); // Era 0.8 → 0.4 (50% redução)
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Área sob a curva
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = config.colors.success;
    ctx.lineTo(chartStartX + chartWidth, chartStartY + chartHeight);
    ctx.lineTo(chartStartX, chartStartY + chartHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    
    // Resumo de métricas - REDUZIDO
    const summaryY = dashY + 110; // Era 140 → 110 (ajuste para dashboard menor)
    const summaryMetrics = [
      { label: 'Active Users', value: '24.8K', color: config.colors.success },
      { label: 'Sessions', value: '156.2K', color: config.colors.primary }
      // Removido: Bounce Rate (33% redução: 3→2 métricas)
    ];
    
    ctx.font = '11px Arial';
    summaryMetrics.forEach((metric, index) => {
      const x = dashX + 15 + index * 90;
      
      ctx.fillStyle = config.colors.accent;
      ctx.textAlign = 'left';
      ctx.fillText(metric.label, x, summaryY);
      
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = metric.color;
      ctx.fillText(metric.value, x, summaryY + 15);
      
      ctx.font = '11px Arial';
    });
    
    // Status indicator
    ctx.fillStyle = config.colors.success;
    ctx.beginPath();
    ctx.arc(dashX + dashWidth - 25, dashY + 15, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.font = '10px Arial';
    ctx.fillStyle = config.colors.success;
    ctx.textAlign = 'right';
    ctx.fillText('Live', dashX + dashWidth - 35, dashY + 20);
    
    ctx.restore();
  };

  // Inicializar elementos
  const initializeElements = (canvas) => {
    dataStreamsRef.current = [];
    kpiCardsRef.current = [];
    
    // Criar streams de dados
    for (let i = 0; i < config.streamCount; i++) {
      dataStreamsRef.current.push(new DataStream(canvas));
    }
    
    // Criar KPI cards
    config.kpis.slice(0, config.kpiCount).forEach(kpi => {
      kpiCardsRef.current.push(new FloatingKPI(canvas, kpi));
    });
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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
    
    drawMainDashboard(ctx);

    if (config.streamSpeed > 0 || config.kpiSpeed > 0 || config.dashboardSpeed > 0) {
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
        mixBlendMode: 'multiply',
        zIndex: -1
      }}
      aria-hidden="true"
    />
  );
};

export default React.memo(BIBackground);
