import { jsx } from "react/jsx-runtime";
import React, { useRef, useMemo, useEffect } from "react";
const MarketingDigitalBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const metricsRef = useRef([]);
  const config = useMemo(() => ({
    // Métricas flutuantes - REDUZIDO DRASTICAMENTE  
    metricCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 3, 2),
    // Era 15/8 → 3/2 (83% redução)
    metricSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.6,
    // Era 1.2 → 0.6 (50% redução)
    // Gráficos removidos conforme solicitação do usuário
    // Dashboard removido completamente conforme solicitação
    // Cores do tema marketing
    colors: {
      primary: "#FF9FF3",
      // Rosa vibrante
      secondary: "#54A0FF",
      // Azul
      accent: "#5F27CD",
      // Roxo
      metric: "#FF9FF3",
      // Rosa para métricas
      chart: "#54A0FF",
      // Azul para gráficos
      dashboard: "#5F27CD",
      // Roxo para dashboard
      success: "#00D2D3",
      // Ciano para valores positivos
      warning: "#FF9F43",
      // Laranja para alertas
      background: "#1A1A2E"
      // Fundo escuro
    },
    // Métricas para animar
    metrics: [
      { label: "CTR", value: "3.47%", trend: "up" },
      { label: "CPC", value: "$0.83", trend: "down" },
      { label: "ROI", value: "247%", trend: "up" },
      { label: "Conversões", value: "1,284", trend: "up" },
      { label: "Impressões", value: "847K", trend: "up" },
      { label: "Cliques", value: "29.4K", trend: "up" },
      { label: "CPA", value: "$12.45", trend: "down" },
      { label: "ROAS", value: "4.2x", trend: "up" }
    ]
  }), [performanceConfig]);
  class FloatingMetric {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.metricSpeed;
      this.vy = (Math.random() - 0.5) * config.metricSpeed;
      this.opacity = 0.25 + Math.random() * 0.2;
      this.scale = 0.6 + Math.random() * 0.2;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.metric = config.metrics[Math.floor(Math.random() * config.metrics.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.015 + Math.random() * 0.01;
      this.valueAnimation = 0;
      this.animationSpeed = 0.025 + Math.random() * 0.025;
    }
    update() {
      if (config.metricSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;
      this.valueAnimation += this.animationSpeed;
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -0.8;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -0.8;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulse) * 0.2);
      const cardWidth = 90;
      const cardHeight = 45;
      ctx.shadowColor = this.metric.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.shadowBlur = 15;
      ctx.fillStyle = config.colors.background + "CC";
      ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      ctx.strokeStyle = this.metric.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.lineWidth = 2;
      ctx.strokeRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      ctx.font = "12px Arial";
      ctx.fillStyle = config.colors.metric;
      ctx.textAlign = "center";
      ctx.fillText(this.metric.label, 0, -15);
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = this.metric.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.fillText(this.metric.value, 0, 5);
      const arrowSize = 8;
      ctx.fillStyle = this.metric.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.beginPath();
      if (this.metric.trend === "up") {
        ctx.moveTo(-arrowSize / 2, 15);
        ctx.lineTo(0, 8);
        ctx.lineTo(arrowSize / 2, 15);
      } else {
        ctx.moveTo(-arrowSize / 2, 8);
        ctx.lineTo(0, 15);
        ctx.lineTo(arrowSize / 2, 8);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  const initializeElements = (canvas) => {
    metricsRef.current = [];
    for (let i = 0; i < config.metricCount; i++) {
      metricsRef.current.push(new FloatingMetric(canvas));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    metricsRef.current.forEach((metric) => {
      metric.update();
      metric.draw(ctx);
    });
    if (config.metricSpeed > 0) {
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
const MarketingDigitalBackground$1 = React.memo(MarketingDigitalBackground);
export {
  MarketingDigitalBackground$1 as default
};
