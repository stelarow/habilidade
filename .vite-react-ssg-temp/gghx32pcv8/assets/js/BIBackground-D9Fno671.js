import { jsx } from "react/jsx-runtime";
import React, { useRef, useMemo, useEffect } from "react";
const BIBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const dataStreamsRef = useRef([]);
  const kpiCardsRef = useRef([]);
  const config = useMemo(() => ({
    // Fluxos de dados - REMOVIDO efeito de partículas jato
    streamCount: 0,
    // Era Math.min(performanceConfig?.particleCount || 15, 8)
    streamSpeed: 0,
    // Era performanceConfig?.staticFallback ? 0 : 1.5
    // KPI Cards - REDUZIDO drasticamente
    kpiCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 3, 2),
    // Era 12/6 → 3/2 (83% redução)
    kpiSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.4,
    // Era 0.8 → 0.4 (50% redução)
    // Dashboard removido conforme solicitação do usuário
    // Cores do tema BI
    colors: {
      primary: "#FF6348",
      // Vermelho coral
      secondary: "#FF9F43",
      // Laranja
      accent: "#FFDD59",
      // Amarelo
      stream: "#FF6348",
      // Vermelho para streams
      kpi: "#FF9F43",
      // Laranja para KPIs
      dashboard: "#FFDD59",
      // Amarelo para dashboard
      success: "#2ED573",
      // Verde para valores positivos
      warning: "#FF9F43",
      // Laranja para alertas
      background: "#2C2C2C"
      // Fundo escuro
    },
    // KPIs para animar - REDUZIDO para apenas 3 principais
    kpis: [
      { label: "Revenue", value: "$2.4M", trend: "up", format: "currency" },
      { label: "Orders", value: "12,847", trend: "up", format: "number" },
      { label: "Conversion", value: "4.2%", trend: "down", format: "percentage" }
      // Removidos: Profit Margin, AOV, CLTV (50% redução: 6→3 KPIs)
    ]
  }), [performanceConfig]);
  class DataStream {
    constructor(canvas) {
      this.canvas = canvas;
      this.particles = [];
      this.maxParticles = 8 + Math.floor(Math.random() * 6);
      this.spawnRate = 0.1 + Math.random() * 0.1;
      this.lastSpawn = 0;
      this.startX = Math.random() * canvas.width;
      this.startY = canvas.height + 50;
      this.endX = Math.random() * canvas.width;
      this.endY = -50;
      this.controlX = this.startX + (Math.random() - 0.5) * 200;
      this.controlY = canvas.height / 2 + (Math.random() - 0.5) * 100;
      this.opacity = 0.4 + Math.random() * 0.4;
      this.hue = Math.random() * 60;
    }
    update() {
      if (config.streamSpeed === 0) return;
      this.lastSpawn += this.spawnRate;
      if (this.lastSpawn >= 1 && this.particles.length < this.maxParticles) {
        this.particles.push({
          progress: 0,
          speed: config.streamSpeed * (0.8 + Math.random() * 0.4) * 0.01,
          size: 2 + Math.random() * 4,
          opacity: 0.8 + Math.random() * 0.2,
          life: 1,
          decay: 5e-3 + Math.random() * 5e-3
        });
        this.lastSpawn = 0;
      }
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
      this.particles.forEach((particle) => {
        const t = particle.progress;
        const x = Math.pow(1 - t, 2) * this.startX + 2 * (1 - t) * t * this.controlX + Math.pow(t, 2) * this.endX;
        const y = Math.pow(1 - t, 2) * this.startY + 2 * (1 - t) * t * this.controlY + Math.pow(t, 2) * this.endY;
        ctx.save();
        ctx.globalAlpha = particle.opacity * particle.life;
        const hue = (this.hue + t * 30) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
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
  class FloatingKPI {
    constructor(canvas, kpi) {
      this.canvas = canvas;
      this.kpi = kpi;
      this.x = Math.random() * (canvas.width - 150) + 75;
      this.y = Math.random() * (canvas.height - 100) + 50;
      this.vx = (Math.random() - 0.5) * config.kpiSpeed;
      this.vy = (Math.random() - 0.5) * config.kpiSpeed;
      this.opacity = 0.3 + Math.random() * 0.2;
      this.scale = 0.6 + Math.random() * 0.2;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.03 + Math.random() * 0.02;
      this.valueAnimation = 0;
      this.animationSpeed = 0.02 + Math.random() * 0.02;
      this.targetValue = parseFloat(this.kpi.value.replace(/[$,%]/g, ""));
      this.currentValue = this.targetValue * (0.7 + Math.random() * 0.3);
    }
    update() {
      if (config.kpiSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.pulse += this.pulseSpeed;
      this.valueAnimation += this.animationSpeed;
      if (this.x <= 75 || this.x >= this.canvas.width - 75) this.vx *= -0.8;
      if (this.y <= 50 || this.y >= this.canvas.height - 50) this.vy *= -0.8;
      this.x = Math.max(75, Math.min(this.canvas.width - 75, this.x));
      this.y = Math.max(50, Math.min(this.canvas.height - 50, this.y));
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
      const cardWidth = 100;
      const cardHeight = 60;
      ctx.shadowColor = this.kpi.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.shadowBlur = 12;
      ctx.fillStyle = config.colors.background + "CC";
      ctx.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      ctx.strokeStyle = this.kpi.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.lineWidth = 2;
      ctx.strokeRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
      ctx.font = "12px Arial";
      ctx.fillStyle = config.colors.kpi;
      ctx.textAlign = "center";
      ctx.fillText(this.kpi.label, 0, -20);
      let displayValue = "";
      if (this.kpi.format === "currency") {
        displayValue = "$" + (this.currentValue / 1e6).toFixed(1) + "M";
      } else if (this.kpi.format === "percentage") {
        displayValue = this.currentValue.toFixed(1) + "%";
      } else {
        displayValue = Math.floor(this.currentValue).toLocaleString();
      }
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = this.kpi.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.fillText(displayValue, 0, 0);
      const arrowSize = 10;
      ctx.fillStyle = this.kpi.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.beginPath();
      if (this.kpi.trend === "up") {
        ctx.moveTo(-arrowSize / 2, 20);
        ctx.lineTo(0, 10);
        ctx.lineTo(arrowSize / 2, 20);
      } else {
        ctx.moveTo(-arrowSize / 2, 10);
        ctx.lineTo(0, 20);
        ctx.lineTo(arrowSize / 2, 10);
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.kpi.trend === "up" ? config.colors.success : config.colors.warning;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const x = -cardWidth / 2 + 20 + i / 9 * (cardWidth - 40);
        const variance = Math.sin((i + this.valueAnimation) * 0.5) * 5;
        const y = 25 + variance + (this.kpi.trend === "up" ? -i * 0.5 : i * 0.5);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  const initializeElements = (canvas) => {
    dataStreamsRef.current = [];
    kpiCardsRef.current = [];
    for (let i = 0; i < config.streamCount; i++) {
      dataStreamsRef.current.push(new DataStream(canvas));
    }
    config.kpis.slice(0, config.kpiCount).forEach((kpi) => {
      kpiCardsRef.current.push(new FloatingKPI(canvas, kpi));
    });
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dataStreamsRef.current.forEach((stream) => {
      stream.update();
      stream.draw(ctx);
    });
    kpiCardsRef.current.forEach((kpi) => {
      kpi.update();
      kpi.draw(ctx);
    });
    if (config.streamSpeed > 0 || config.kpiSpeed > 0) {
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
const BIBackground$1 = React.memo(BIBackground);
export {
  BIBackground$1 as default
};
