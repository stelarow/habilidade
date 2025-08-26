import { jsx } from "react/jsx-runtime";
import React, { useRef, useMemo, useEffect } from "react";
const IABackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const neuralNodesRef = useRef([]);
  useRef([]);
  const dataFlowRef = useRef([]);
  const networkRef = useRef({ pulse: 0 });
  const config = useMemo(() => ({
    // Nós neurais
    nodeCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 18, 9),
    nodeSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.3,
    // Conexões
    maxConnections: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 12, 6),
    connectionDistance: 150,
    // Fluxo de dados
    dataFlowCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 15, 7),
    dataFlowSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 1.5,
    // Pulso da rede
    networkPulseSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.04,
    // Cores do tema IA
    colors: {
      primary: "#00D2D3",
      // Ciano
      secondary: "#FF9F43",
      // Laranja
      accent: "#54A0FF",
      // Azul
      node: "#00D2D3",
      // Ciano para nós
      connection: "#54A0FF40",
      // Azul transparente para conexões
      dataFlow: "#FF9F43",
      // Laranja para fluxo de dados
      pulse: "#00D2D3",
      // Ciano para pulsos
      glow: "#54A0FF",
      // Azul para glow
      background: "#0A0E1A"
      // Fundo escuro
    }
  }), [performanceConfig]);
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
      this.type = Math.random() < 0.3 ? "input" : Math.random() < 0.6 ? "hidden" : "output";
      this.connections = [];
      this.lastActivation = 0;
    }
    update() {
      if (config.nodeSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= this.size || this.x >= this.canvas.width - this.size) {
        this.vx *= -0.9;
        this.x = Math.max(this.size, Math.min(this.canvas.width - this.size, this.x));
      }
      if (this.y <= this.size || this.y >= this.canvas.height - this.size) {
        this.vy *= -0.9;
        this.y = Math.max(this.size, Math.min(this.canvas.height - this.size, this.y));
      }
      this.pulse += this.pulseSpeed;
      this.activation = Math.sin(this.pulse) * 0.5 + 0.5;
      if (Math.random() < 0.02) {
        this.lastActivation = 1;
      } else {
        this.lastActivation *= 0.95;
      }
    }
    draw(ctx) {
      ctx.save();
      const intensity = this.activation * this.opacity + this.lastActivation * 0.5;
      ctx.globalAlpha = intensity;
      let glowColor = config.colors.node;
      if (this.type === "input") glowColor = config.colors.primary;
      else if (this.type === "output") glowColor = config.colors.secondary;
      else glowColor = config.colors.accent;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = this.size * 1.5 * intensity;
      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      if (this.lastActivation > 0.1) {
        ctx.save();
        ctx.globalAlpha = this.lastActivation;
        ctx.strokeStyle = config.colors.glow;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = config.colors.background;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
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
      if (this.progress >= 1 || this.life <= 0) {
        this.progress = 0;
        this.life = 1;
        if (this.endNode) {
          this.endNode.lastActivation = Math.min(1, this.endNode.lastActivation + 0.3);
        }
      }
    }
    draw(ctx) {
      if (!this.startNode || !this.endNode || this.life <= 0) return;
      const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
      const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
      ctx.save();
      ctx.globalAlpha = this.opacity * this.life;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.size * 3;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fill();
      const trailLength = 5;
      for (let i = 1; i <= trailLength; i++) {
        const trailProgress = Math.max(0, this.progress - i * 0.02);
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
  const drawConnections = (ctx) => {
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
          const nodeActivation = (nodes[i].lastActivation + nodes[j].lastActivation) / 2;
          const connectionIntensity = Math.max(alpha, nodeActivation);
          ctx.globalAlpha = connectionIntensity;
          ctx.strokeStyle = config.colors.connection.replace("40", Math.floor(connectionIntensity * 200).toString(16).padStart(2, "0"));
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
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
  const initializeElements = (canvas) => {
    neuralNodesRef.current = [];
    dataFlowRef.current = [];
    for (let i = 0; i < config.nodeCount; i++) {
      neuralNodesRef.current.push(new NeuralNode(canvas));
    }
    for (let i = 0; i < config.dataFlowCount; i++) {
      const startIndex = Math.floor(Math.random() * neuralNodesRef.current.length);
      const endIndex = Math.floor(Math.random() * neuralNodesRef.current.length);
      if (startIndex !== endIndex) {
        dataFlowRef.current.push(new DataFlow(
          neuralNodesRef.current[startIndex],
          neuralNodesRef.current[endIndex]
        ));
      }
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections(ctx);
    neuralNodesRef.current.forEach((node) => {
      node.update();
      node.draw(ctx);
    });
    dataFlowRef.current.forEach((flow) => {
      flow.update();
      flow.draw(ctx);
    });
    if (config.nodeSpeed > 0 || config.dataFlowSpeed > 0 || config.networkPulseSpeed > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * ((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      canvas.height = rect.height * ((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      const ctx = canvas.getContext("2d");
      ctx.scale((deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1, (deviceCapabilities == null ? void 0 : deviceCapabilities.pixelRatio) || 1);
      initializeElements(canvas);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    animate();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config, deviceCapabilities]);
  if (performanceConfig == null ? void 0 : performanceConfig.staticFallback) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 opacity-10",
        style: {
          background: `linear-gradient(135deg, ${config.colors.primary} 0%, ${config.colors.secondary} 50%, ${config.colors.accent} 100%)`
        }
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 w-full h-full pointer-events-none",
      style: {
        background: "transparent",
        zIndex: 1
      },
      "aria-hidden": "true"
    }
  );
};
const IABackground$1 = React.memo(IABackground);
export {
  IABackground$1 as default
};
