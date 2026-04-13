import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Inteligência Artificial
 * Conceito: Redes neurais + nós conectados + processamento de dados IA
 */
const IABackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const neuralNodesReference = useRef([]);
  const connectionsReference = useRef([]);
  const dataFlowReference = useRef([]);
  const networkReference = useRef({ pulse: 0 });

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Nós neurais
    nodeCount: Math.min(performanceConfig?.particleCount || 18, 9),
    nodeSpeed: performanceConfig?.staticFallback ? 0 : 0.3,
    
    // Conexões
    maxConnections: Math.min(performanceConfig?.particleCount || 12, 6),
    connectionDistance: 150,
    
    // Fluxo de dados
    dataFlowCount: Math.min(performanceConfig?.particleCount || 15, 7),
    dataFlowSpeed: performanceConfig?.staticFallback ? 0 : 1.5,
    
    // Pulso da rede
    networkPulseSpeed: performanceConfig?.staticFallback ? 0 : 0.04,
    
    // Cores do tema IA
    colors: {
      primary: '#00D2D3',    // Ciano
      secondary: '#FF9F43',  // Laranja
      accent: '#54A0FF',     // Azul
      node: '#00D2D3',       // Ciano para nós
      connection: '#54A0FF40', // Azul transparente para conexões
      dataFlow: '#FF9F43',   // Laranja para fluxo de dados
      pulse: '#00D2D3',      // Ciano para pulsos
      glow: '#54A0FF',       // Azul para glow
      background: '#0A0E1A'  // Fundo escuro
    }
  }), [performanceConfig]);

  // Classe para nós neurais
  class NeuralNode {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.nodeSpeed;
      this.vy = (Math.random() - 0.5) * config.nodeSpeed;
      this.size = 6 + Math.random() * 8;
      this.opacity = 0.4 + Math.random() * 0.3;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
      this.activation = 0;
      this.activationSpeed = 0.1 + Math.random() * 0.1;
      this.type = Math.random() < 0.3 ? 'input' : (Math.random() < 0.6 ? 'hidden' : 'output');
      this.connections = [];
      this.lastActivation = 0;
    }

    update() {
      if (config.nodeSpeed === 0) return;
      
      // Movimento suave
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce suave nas bordas
      if (this.x <= this.size || this.x >= this.canvas.width - this.size) {
        this.vx *= -0.9;
        this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
      }
      if (this.y <= this.size || this.y >= this.canvas.height - this.size) {
        this.vy *= -0.9;
        this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
      }
      
      // Atualizar pulso e ativação
      this.pulse += this.pulseSpeed;
      this.activation = Math.sin(this.pulse) * 0.5 + 0.5;
      
      // Simular ativação neural
      if (Math.random() < 0.02) {
        this.lastActivation = 1;
      } else {
        this.lastActivation *= 0.95;
      }
    }

    draw(context) {
      context.save();
      
      // Calcular intensidade baseada na ativação
      const intensity = this.activation * this.opacity + this.lastActivation * 0.5;
      context.globalAlpha = intensity;
      
      // Glow effect baseado no tipo
      let glowColor = config.colors.node;
      if (this.type === 'input') glowColor = config.colors.primary;
      else if (this.type === 'output') glowColor = config.colors.secondary;
      else glowColor = config.colors.accent;
      
      context.shadowColor = glowColor;
      context.shadowBlur = this.size * 1.5 * intensity;
      
      // Desenhar nó principal
      context.fillStyle = glowColor;
      context.beginPath();
      context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      context.fill();
      
      // Anel interno para nós ativos
      if (this.lastActivation > 0.1) {
        context.save();
        context.globalAlpha = this.lastActivation;
        context.strokeStyle = config.colors.glow;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
        context.stroke();
        context.restore();
      }
      
      // Núcleo do nó
      context.globalAlpha = 1;
      context.fillStyle = config.colors.background;
      context.beginPath();
      context.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
      context.fill();
      
      context.restore();
    }

    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.hypot(dx, dy);
    }
  }

  // Classe para fluxo de dados nas conexões
  class DataFlow {
    constructor(startNode, endNode) {
      this.startNode = startNode;
      this.endNode = endNode;
      this.progress = 0;
      this.speed = config.dataFlowSpeed * (0.5 + Math.random() * 0.5);
      this.size = 1.5 + Math.random() * 2;
      this.opacity = 0.5 + Math.random() * 0.3;
      this.color = config.colors.dataFlow;
      this.life = 1;
      this.decay = 0.01 + Math.random() * 0.01;
    }

    update() {
      if (config.dataFlowSpeed === 0) return;
      
      this.progress += this.speed * 0.01;
      this.life -= this.decay;
      
      // Resetar quando chegar ao fim ou morrer
      if (this.progress >= 1 || this.life <= 0) {
        this.progress = 0;
        this.life = 1;
        
        // Ativar nó de destino
        if (this.endNode) {
          this.endNode.lastActivation = Math.min(1, this.endNode.lastActivation + 0.3);
        }
      }
    }

    draw(context) {
      if (!this.startNode || !this.endNode || this.life <= 0) return;
      
      // Calcular posição atual
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      
      context.save();
      context.globalAlpha = this.opacity * this.life;
      
      // Glow effect
      context.shadowColor = this.color;
      context.shadowBlur = this.size * 3;
      
      // Desenhar partícula de dados
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(x, y, this.size, 0, Math.PI * 2);
      context.fill();
      
      // Trail effect
      const trailLength = 5;
      for (let index = 1; index <= trailLength; index++) {
        const trailProgress = Math.max(0, this.progress - (index * 0.02));
        if (trailProgress <= 0) break;
        
        const trailX = this.startNode.x + (this.endNode.x - this.startNode.x) * trailProgress;
        const trailY = this.startNode.y + (this.endNode.y - this.startNode.y) * trailProgress;
        const trailAlpha = this.opacity * this.life * (1 - index / trailLength);
        
        context.save();
        context.globalAlpha = trailAlpha;
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(trailX, trailY, this.size * (1 - index / trailLength), 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
      
      context.restore();
    }
  }

  // Desenhar conexões entre nós
  const drawConnections = (context) => {
    context.save();
    
    networkReference.current.pulse += config.networkPulseSpeed;
    const pulseIntensity = Math.sin(networkReference.current.pulse) * 0.3 + 0.7;
    
    const nodes = neuralNodesReference.current;
    
    for (let index = 0; index < nodes.length; index++) {
      for (let index_ = index + 1; index_ < nodes.length; index_++) {
        const distance = nodes[index].distanceTo(nodes[index_]);
        
        if (distance < config.connectionDistance) {
          const alpha = (1 - distance / config.connectionDistance) * pulseIntensity * 0.7;
          const lineWidth = alpha * 1.5;
          
          // Cor baseada na ativação dos nós
          const nodeActivation = (nodes[index].lastActivation + nodes[index_].lastActivation) / 2;
          const connectionIntensity = Math.max(alpha, nodeActivation);
          
          context.globalAlpha = connectionIntensity;
          context.strokeStyle = config.colors.connection.replace('40', Math.floor(connectionIntensity * 200).toString(16).padStart(2, '0'));
          context.lineWidth = lineWidth;
          
          // Linha principal
          context.beginPath();
          context.moveTo(nodes[index].x, nodes[index].y);
          context.lineTo(nodes[index_].x, nodes[index_].y);
          context.stroke();
          
          // Glow effect para conexões ativas
          if (nodeActivation > 0.3) {
            context.save();
            context.globalAlpha = nodeActivation * 0.4;
            context.strokeStyle = config.colors.pulse;
            context.lineWidth = lineWidth + 1;
            context.beginPath();
            context.moveTo(nodes[index].x, nodes[index].y);
            context.lineTo(nodes[index_].x, nodes[index_].y);
            context.stroke();
            context.restore();
          }
        }
      }
    }
    
    context.restore();
  };

  // Informações da rede neural removidas conforme solicitação

  // Inicializar elementos
  const initializeElements = (canvas) => {
    neuralNodesReference.current = [];
    dataFlowReference.current = [];
    
    // Criar nós neurais
    for (let index = 0; index < config.nodeCount; index++) {
      neuralNodesReference.current.push(new NeuralNode(canvas));
    }
    
    // Criar fluxos de dados
    for (let index = 0; index < config.dataFlowCount; index++) {
      const startIndex = Math.floor(Math.random() * neuralNodesReference.current.length);
      const endIndex = Math.floor(Math.random() * neuralNodesReference.current.length);
      
      if (startIndex !== endIndex) {
        dataFlowReference.current.push(new DataFlow(
          neuralNodesReference.current[startIndex],
          neuralNodesReference.current[endIndex]
        ));
      }
    }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    drawConnections(context);
    
    // Atualizar e desenhar nós
    for (const node of neuralNodesReference.current) {
      node.update();
      node.draw(context);
    }
    
    // Atualizar e desenhar fluxos de dados
    for (const flow of dataFlowReference.current) {
      flow.update();
      flow.draw(context);
    }
    
    // drawNetworkInfo removido conforme solicitação

    if (config.nodeSpeed > 0 || config.dataFlowSpeed > 0 || config.networkPulseSpeed > 0) {
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

  // Se for versão estática, apenas mostrar gradiente de IA
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

export default React.memo(IABackground);
