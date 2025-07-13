'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';

interface PerformanceConfig {
  particleCount?: number;
  staticFallback?: boolean;
}

interface DeviceCapabilities {
  pixelRatio?: number;
}

interface IABackgroundProps {
  performanceConfig?: PerformanceConfig;
  deviceCapabilities?: DeviceCapabilities;
  courseSlug?: string;
}

interface NeuralNodeType {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
  activation: number;
  activationSpeed: number;
  type: 'input' | 'hidden' | 'output';
  connections: any[];
  lastActivation: number;
  distanceTo: (other: NeuralNodeType) => number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

interface DataFlowType {
  startNode: NeuralNodeType;
  endNode: NeuralNodeType;
  progress: number;
  speed: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  decay: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Background animado para o curso de Inteligência Artificial
 * Conceito: Redes neurais + nós conectados + processamento de dados IA
 */
const IABackground: React.FC<IABackgroundProps> = ({ 
  performanceConfig = {}, 
  deviceCapabilities = {}, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const neuralNodesRef = useRef<NeuralNodeType[]>([]);
  const connectionsRef = useRef<any[]>([]);
  const dataFlowRef = useRef<DataFlowType[]>([]);
  const networkRef = useRef({ pulse: 0 });

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

  // Use useRef to store class constructors to avoid recreating them
  const NeuralNodeRef = useRef<any>(null);
  const DataFlowRef = useRef<any>(null);

  // Initialize class constructors only once
  useMemo(() => {
    // Classe para nós neurais
    class NeuralNode implements NeuralNodeType {
      canvas: HTMLCanvasElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      pulse: number;
      pulseSpeed: number;
      activation: number;
      activationSpeed: number;
      type: 'input' | 'hidden' | 'output';
      connections: any[];
      lastActivation: number;
      config: typeof config;

      constructor(canvas: HTMLCanvasElement, configRef: typeof config) {
        this.canvas = canvas;
        this.config = configRef;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * this.config.nodeSpeed;
        this.vy = (Math.random() - 0.5) * this.config.nodeSpeed;
        this.size = 6 + Math.random() * 8;
        this.opacity = 0.4 + Math.random() * 0.3;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.activation = 0;
        this.activationSpeed = 0.1 + Math.random() * 0.1;
        this.type = Math.random() < 0.3 ? 'input' : Math.random() < 0.6 ? 'hidden' : 'output';
        this.connections = [];
        this.lastActivation = 0;
      }

      update() {
        if (this.config.nodeSpeed === 0) return;
        
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

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        
        // Calcular intensidade baseada na ativação
        const intensity = this.activation * this.opacity + this.lastActivation * 0.5;
        ctx.globalAlpha = intensity;
        
        // Glow effect baseado no tipo
        let glowColor = this.config.colors.node;
        if (this.type === 'input') glowColor = this.config.colors.primary;
        else if (this.type === 'output') glowColor = this.config.colors.secondary;
        else glowColor = this.config.colors.accent;
        
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = this.size * 1.5 * intensity;
        
        // Desenhar nó principal
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Anel interno para nós ativos
        if (this.lastActivation > 0.1) {
          ctx.save();
          ctx.globalAlpha = this.lastActivation;
          ctx.strokeStyle = this.config.colors.glow;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        
        // Núcleo do nó
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.config.colors.background;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }

      distanceTo(other: NeuralNodeType): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
      }
    }

    // Classe para fluxo de dados nas conexões
    class DataFlow implements DataFlowType {
      startNode: NeuralNodeType;
      endNode: NeuralNodeType;
      progress: number;
      speed: number;
      size: number;
      opacity: number;
      color: string;
      life: number;
      decay: number;
      config: typeof config;

      constructor(startNode: NeuralNodeType, endNode: NeuralNodeType, configRef: typeof config) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.config = configRef;
        this.progress = 0;
        this.speed = this.config.dataFlowSpeed * (0.5 + Math.random() * 0.5);
        this.size = 1.5 + Math.random() * 2;
        this.opacity = 0.5 + Math.random() * 0.3;
        this.color = this.config.colors.dataFlow;
        this.life = 1;
        this.decay = 0.01 + Math.random() * 0.01;
      }

      update() {
        if (this.config.dataFlowSpeed === 0) return;
        
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

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.startNode || !this.endNode || this.life <= 0) return;
        
        // Calcular posição atual
        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        
        ctx.save();
        ctx.globalAlpha = this.opacity * this.life;
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.size * 3;
        
        // Desenhar partícula de dados
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail effect
        const trailLength = 5;
        for (let i = 1; i <= trailLength; i++) {
          const trailProgress = Math.max(0, this.progress - (i * 0.02));
          if (trailProgress <= 0) break;
          
          const trailX = this.startNode.x + (this.endNode.x - this.startNode.x) * trailProgress;
          const trailY = this.startNode.y + (this.endNode.y - this.startNode.y) * trailProgress;
          const trailAlpha = this.opacity * this.life * (1 - i / trailLength);
          
          ctx.save();
          ctx.globalAlpha = trailAlpha;
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(trailX, trailY, this.size * (1 - i / trailLength), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        
        ctx.restore();
      }
    }

    NeuralNodeRef.current = NeuralNode;
    DataFlowRef.current = DataFlow;
  }, []);

  // Store drawing functions in useRef to avoid recreating them
  const drawConnectionsRef = useRef<((ctx: CanvasRenderingContext2D) => void) | null>(null);

  // Initialize drawing functions only once
  useMemo(() => {
    // Desenhar conexões entre nós
    drawConnectionsRef.current = (ctx: CanvasRenderingContext2D) => {
      ctx.save();
      
      networkRef.current.pulse += config.networkPulseSpeed;
      const pulseIntensity = Math.sin(networkRef.current.pulse) * 0.3 + 0.7;
      
      const nodes = neuralNodesRef.current;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].distanceTo(nodes[j]);
          
          if (distance < config.connectionDistance) {
            const alpha = (1 - distance / config.connectionDistance) * pulseIntensity * 0.7;
            const lineWidth = alpha * 1.5;
            
            // Cor baseada na ativação dos nós
            const nodeActivation = (nodes[i].lastActivation + nodes[j].lastActivation) / 2;
            const connectionIntensity = Math.max(alpha, nodeActivation);
            
            ctx.globalAlpha = connectionIntensity;
            ctx.strokeStyle = config.colors.connection.replace('40', Math.floor(connectionIntensity * 200).toString(16).padStart(2, '0'));
            ctx.lineWidth = lineWidth;
            
            // Linha principal
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            
            // Glow effect para conexões ativas
            if (nodeActivation > 0.3) {
              ctx.save();
              ctx.globalAlpha = nodeActivation * 0.4;
              ctx.strokeStyle = config.colors.pulse;
              ctx.lineWidth = lineWidth + 1;
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }
      
      ctx.restore();
    };
  }, [config]);

  // Inicializar elementos
  const initializeElements = useCallback((canvas: HTMLCanvasElement) => {
    neuralNodesRef.current = [];
    dataFlowRef.current = [];
    
    // Criar nós neurais
    if (NeuralNodeRef.current) {
      for (let i = 0; i < config.nodeCount; i++) {
        neuralNodesRef.current.push(new NeuralNodeRef.current(canvas, config));
      }
    }
    
    // Criar fluxos de dados
    if (DataFlowRef.current) {
      for (let i = 0; i < config.dataFlowCount; i++) {
        const startIndex = Math.floor(Math.random() * neuralNodesRef.current.length);
        const endIndex = Math.floor(Math.random() * neuralNodesRef.current.length);
        
        if (startIndex !== endIndex) {
          dataFlowRef.current.push(new DataFlowRef.current(
            neuralNodesRef.current[startIndex],
            neuralNodesRef.current[endIndex],
            config
          ));
        }
      }
    }
  }, [config]);

  // Loop de animação
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar elementos na ordem correta
    if (drawConnectionsRef.current) {
      drawConnectionsRef.current(ctx);
    }
    
    // Atualizar e desenhar nós
    neuralNodesRef.current.forEach(node => {
      node.update();
      node.draw(ctx);
    });
    
    // Atualizar e desenhar fluxos de dados
    dataFlowRef.current.forEach(flow => {
      flow.update();
      flow.draw(ctx);
    });

    if (config.nodeSpeed > 0 || config.dataFlowSpeed > 0 || config.networkPulseSpeed > 0) {
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
      if (ctx) {
        ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      }
      
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

export default React.memo(IABackground);