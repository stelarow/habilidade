import { jsx } from "react/jsx-runtime";
import React, { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { m as memoryManager } from "./utils-D0CRhHwP.js";
const Projetista3DBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const wireframesRef = useRef([]);
  const config = useMemo(() => ({
    // Grade isométrica - REDUZIDA
    gridSize: (performanceConfig == null ? void 0 : performanceConfig.particleCount) > 100 ? 40 : 60,
    gridOpacity: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0.2 : 0.08,
    // era 0.15
    // Wireframes flutuantes - REDUZIDOS
    wireframeCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 15, 4),
    // era 8
    animationSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.3,
    // era 0.5
    // Cores do tema 3D
    colors: {
      primary: "#FF6B35",
      // Laranja vibrante
      secondary: "#F7931E",
      // Laranja dourado
      accent: "#FFD23F",
      // Amarelo
      grid: "#FF6B35",
      // Laranja para grade
      wireframe: "#F7931E"
      // Laranja dourado para wireframes
    }
  }), [performanceConfig]);
  class Wireframe3D {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.z = Math.random() * 200 - 100;
      this.vx = (Math.random() - 0.5) * config.animationSpeed;
      this.vy = (Math.random() - 0.5) * config.animationSpeed;
      this.vz = (Math.random() - 0.5) * config.animationSpeed;
      this.rotationX = 0;
      this.rotationY = 0;
      this.rotationZ = 0;
      this.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.01,
        // era 0.02
        y: (Math.random() - 0.5) * 0.01,
        // era 0.02
        z: (Math.random() - 0.5) * 0.01
        // era 0.02
      };
      this.type = ["cube", "pyramid", "sphere"][Math.floor(Math.random() * 3)];
      this.size = 15 + Math.random() * 20;
      this.opacity = 0.6 + Math.random() * 0.4;
    }
    update() {
      if (config.animationSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      this.z += this.vz;
      this.rotationX += this.rotationSpeed.x;
      this.rotationY += this.rotationSpeed.y;
      this.rotationZ += this.rotationSpeed.z;
      if (this.x < -50) this.x = this.canvas.width + 50;
      if (this.x > this.canvas.width + 50) this.x = -50;
      if (this.y < -50) this.y = this.canvas.height + 50;
      if (this.y > this.canvas.height + 50) this.y = -50;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      ctx.strokeStyle = config.colors.wireframe;
      ctx.lineWidth = 1;
      const scale = 1 + this.z / 500;
      ctx.scale(scale, scale);
      switch (this.type) {
        case "cube":
          this.drawCube(ctx);
          break;
        case "pyramid":
          this.drawPyramid(ctx);
          break;
        case "sphere":
          this.drawSphere(ctx);
          break;
      }
      ctx.restore();
    }
    drawCube(ctx) {
      const s = this.size;
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      const offset = s * 0.3;
      ctx.beginPath();
      ctx.moveTo(-s / 2, -s / 2);
      ctx.lineTo(-s / 2 + offset, -s / 2 - offset);
      ctx.moveTo(s / 2, -s / 2);
      ctx.lineTo(s / 2 + offset, -s / 2 - offset);
      ctx.moveTo(-s / 2, s / 2);
      ctx.lineTo(-s / 2 + offset, s / 2 - offset);
      ctx.moveTo(s / 2, s / 2);
      ctx.lineTo(s / 2 + offset, s / 2 - offset);
      ctx.moveTo(-s / 2 + offset, -s / 2 - offset);
      ctx.lineTo(s / 2 + offset, -s / 2 - offset);
      ctx.lineTo(s / 2 + offset, s / 2 - offset);
      ctx.lineTo(-s / 2 + offset, s / 2 - offset);
      ctx.closePath();
      ctx.stroke();
    }
    drawPyramid(ctx) {
      const s = this.size;
      const h = s * 0.8;
      ctx.strokeRect(-s / 2, s / 2 - h, s, h);
      ctx.beginPath();
      ctx.moveTo(-s / 2, s / 2 - h);
      ctx.lineTo(0, -s / 2);
      ctx.moveTo(s / 2, s / 2 - h);
      ctx.lineTo(0, -s / 2);
      ctx.moveTo(-s / 2, s / 2);
      ctx.lineTo(0, -s / 2);
      ctx.moveTo(s / 2, s / 2);
      ctx.lineTo(0, -s / 2);
      ctx.stroke();
    }
    drawSphere(ctx) {
      const r = this.size / 2;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 1; i < 3; i++) {
        const y = r * 2 / 3 * (i - 1.5);
        const ellipseWidth = Math.sqrt(r * r - y * y) * 2;
        ctx.beginPath();
        ctx.ellipse(0, y, ellipseWidth / 2, ellipseWidth / 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.ellipse(0, 0, r / 4, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const initializeWireframes = (canvas) => {
    wireframesRef.current = [];
    for (let i = 0; i < config.wireframeCount; i++) {
      wireframesRef.current.push(new Wireframe3D(canvas));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const currentTime = performance.now();
    const deltaTime = currentTime - (animationRef.lastTime || 0);
    if (deltaTime < 33.33) {
      if (config.animationSpeed > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
      return;
    }
    animationRef.lastTime = currentTime;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wireframesRef.current.forEach((wireframe) => {
      wireframe.update();
      wireframe.draw(ctx);
    });
    if (config.animationSpeed > 0) {
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
      initializeWireframes(canvas);
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
const Projetista3DBackground$1 = React.memo(Projetista3DBackground);
const Projetista3DBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Projetista3DBackground$1
}, Symbol.toStringTag, { value: "Module" }));
const EdicaoVideoBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const filmFramesRef = useRef([]);
  const timelineRef = useRef({ position: 0 });
  const cameraRef = useRef(null);
  const config = useMemo(() => ({
    // Timeline - REMOVIDA COMPLETAMENTE
    timelineHeight: 0,
    // Era 60 → 0 (timeline removida)
    timelineSpeed: 0,
    // Era 0.6 → 0 (sem timeline)
    keyframeSpacing: 180,
    // Frames de filme - OTIMIZADOS
    frameCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 8, 4),
    // Era 12/6 -> 8/4
    frameSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.6,
    // Era 0.8 -> 0.6
    frameWidth: 38,
    // Era 45 -> 38
    frameHeight: 25,
    // Era 30 -> 25
    // Câmera de cinema - REMOVIDA
    cameraEnabled: false,
    // Era true → false (câmera removida)
    cameraSpeed: 0,
    // Era 0.02 → 0 (sem animação)
    // Lens flares e sparkles - REMOVIDOS
    sparkleCount: 0,
    // era Math.min(performanceConfig?.particleCount || 20, 6)
    flareIntensity: 0,
    // era performanceConfig?.staticFallback ? 0 : 0.6
    // Cores do tema cinematográfico
    colors: {
      primary: "#FF4757",
      // Vermelho vibrante
      secondary: "#FF3838",
      // Vermelho intenso
      accent: "#FF6B9D",
      // Rosa cinematográfico
      timeline: "#FF4757",
      // Vermelho para timeline
      frame: "#FF3838",
      // Vermelho para frames
      sparkle: "#FF6B9D",
      // Rosa para sparkles
      flare: "#FFFFFF"
      // Branco para lens flares
    }
  }), [performanceConfig]);
  class FilmFrame {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = config.frameWidth;
      this.height = config.frameHeight;
      this.x = Math.random() * (canvas.width + this.width) - this.width;
      this.y = Math.random() * (canvas.height - this.height);
      this.vx = -config.frameSpeed * (0.5 + Math.random() * 0.5);
      this.opacity = 0.2 + Math.random() * 0.3;
      this.rotation = (Math.random() - 0.5) * 0.2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.type = ["scene", "transition", "effect"][Math.floor(Math.random() * 3)];
      this.scale = 0.8 + Math.random() * 0.4;
    }
    update() {
      if (config.frameSpeed === 0) return;
      this.x += this.vx;
      this.rotation += this.rotationSpeed;
      if (this.x < -this.width - 50) {
        this.x = this.canvas.width + 50;
        this.y = Math.random() * (this.canvas.height - this.height);
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;
      switch (this.type) {
        case "scene":
          this.drawScene(ctx);
          break;
        case "transition":
          this.drawTransition(ctx);
          break;
        case "effect":
          this.drawEffect(ctx);
          break;
      }
      ctx.restore();
    }
    drawScene(ctx) {
      ctx.strokeStyle = config.colors.frame;
      ctx.lineWidth = 2;
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      for (let i = 0; i < 4; i++) {
        const y = -this.height / 2 + (i + 0.5) * (this.height / 4);
        ctx.fillStyle = config.colors.frame;
        ctx.fillRect(-this.width / 2 - 5, y - 3, 5, 6);
        ctx.fillRect(this.width / 2, y - 3, 5, 6);
      }
      ctx.fillStyle = config.colors.primary + "30";
      ctx.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, this.width - 8, this.height - 8);
    }
    drawTransition(ctx) {
      ctx.strokeStyle = config.colors.accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      ctx.setLineDash([]);
      const gradient = ctx.createLinearGradient(-this.width / 2, 0, this.width / 2, 0);
      gradient.addColorStop(0, config.colors.primary + "00");
      gradient.addColorStop(0.5, config.colors.accent + "60");
      gradient.addColorStop(1, config.colors.secondary + "00");
      ctx.fillStyle = gradient;
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
    drawEffect(ctx) {
      ctx.strokeStyle = config.colors.sparkle;
      ctx.lineWidth = 1;
      ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
      for (let i = 0; i < 3; i++) {
        const x = (Math.random() - 0.5) * (this.width - 10);
        const y = (Math.random() - 0.5) * (this.height - 10);
        ctx.fillStyle = config.colors.flare;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  class CinemaCamera {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = canvas.width * 0.8;
      this.y = canvas.height * 0.2;
      this.rotation = 0;
      this.bobOffset = 0;
      this.bobSpeed = 0.03;
      this.scale = 0.8 + Math.random() * 0.4;
      this.opacity = 0.6 + Math.random() * 0.3;
      this.lensRotation = 0;
      this.lensSpeed = 0.01;
      this.recordingBlink = 0;
      this.recordingSpeed = 0.1;
    }
    update() {
      if (!config.cameraEnabled || config.cameraSpeed === 0) return;
      this.rotation += config.cameraSpeed;
      this.bobOffset += this.bobSpeed;
      this.lensRotation += this.lensSpeed;
      this.recordingBlink += this.recordingSpeed;
    }
    draw(ctx) {
      if (!config.cameraEnabled) return;
      ctx.save();
      ctx.translate(this.x, this.y + Math.sin(this.bobOffset) * 3);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = config.colors.secondary;
      ctx.fillRect(-30, -20, 60, 40);
      ctx.strokeStyle = config.colors.frame;
      ctx.lineWidth = 2;
      ctx.strokeRect(-30, -20, 60, 40);
      ctx.save();
      ctx.translate(20, 0);
      ctx.rotate(this.lensRotation);
      ctx.strokeStyle = config.colors.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = config.colors.primary + "40";
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = config.colors.flare + "80";
      ctx.beginPath();
      ctx.arc(-3, -3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = config.colors.frame;
      ctx.fillRect(-5, -30, 10, 15);
      ctx.fillStyle = config.colors.primary + "60";
      ctx.fillRect(-25, -15, 20, 12);
      const recordingAlpha = 0.5 + Math.sin(this.recordingBlink) * 0.5;
      ctx.globalAlpha = this.opacity * recordingAlpha;
      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.arc(-20, -25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = this.opacity;
      ctx.font = "8px Arial";
      ctx.fillStyle = config.colors.flare;
      ctx.fillText("REC", -15, -22);
      ctx.strokeStyle = config.colors.secondary;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const angle = i * Math.PI * 2 / 3;
        const legX = Math.cos(angle) * 25;
        const legY = Math.sin(angle) * 25;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.lineTo(legX, 20 + legY);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
  const drawTimeline = (ctx) => {
    if (config.timelineHeight === 0 || config.timelineSpeed === 0) return;
    const { width, height } = ctx.canvas;
    const timelineY = height - config.timelineHeight - 20;
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = config.colors.timeline + "20";
    ctx.fillRect(0, timelineY, width, config.timelineHeight);
    ctx.strokeStyle = config.colors.timeline;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, timelineY, width, config.timelineHeight);
    const keyframeY = timelineY + config.timelineHeight / 2;
    timelineRef.current.position += config.timelineSpeed;
    for (let x = timelineRef.current.position % config.keyframeSpacing - config.keyframeSpacing; x < width + config.keyframeSpacing; x += config.keyframeSpacing) {
      ctx.fillStyle = config.colors.accent;
      ctx.fillRect(x - 2, keyframeY - 15, 4, 30);
      ctx.beginPath();
      ctx.moveTo(x, keyframeY - 8);
      ctx.lineTo(x + 6, keyframeY);
      ctx.lineTo(x, keyframeY + 8);
      ctx.lineTo(x - 6, keyframeY);
      ctx.closePath();
      ctx.fill();
    }
    const playheadX = width * 0.3;
    ctx.fillStyle = config.colors.flare;
    ctx.fillRect(playheadX - 1, timelineY - 10, 2, config.timelineHeight + 20);
    ctx.beginPath();
    ctx.moveTo(playheadX, timelineY - 10);
    ctx.lineTo(playheadX - 8, timelineY - 20);
    ctx.lineTo(playheadX + 8, timelineY - 20);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  const initializeElements = (canvas) => {
    filmFramesRef.current = [];
    for (let i = 0; i < config.frameCount; i++) {
      filmFramesRef.current.push(new FilmFrame(canvas));
    }
    if (config.cameraEnabled) {
      cameraRef.current = new CinemaCamera(canvas);
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTimeline(ctx);
    filmFramesRef.current.forEach((element) => {
      element.update();
      element.draw(ctx);
    });
    if (cameraRef.current) {
      cameraRef.current.update();
      cameraRef.current.draw(ctx);
    }
    if (config.frameSpeed > 0 || config.cameraSpeed > 0) {
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
const EdicaoVideoBackground$1 = React.memo(EdicaoVideoBackground);
const EdicaoVideoBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EdicaoVideoBackground$1
}, Symbol.toStringTag, { value: "Module" }));
const InformaticaBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const matrixRef = useRef({ drops: [] });
  const gridRef = useRef({ offset: 0 });
  const config = useMemo(() => ({
    // Grid digital
    gridSize: 25,
    gridOpacity: 0,
    // Era 0.15 → 0 (grid digital REMOVIDO)
    gridSpeed: 0,
    // Era 0.5 → 0 (sem animação de grid)
    // Partículas conectadas - REDUZIDAS DRASTICAMENTE
    particleCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 8, 4),
    // Era 30/15 → 8/4 (73% redução)
    connectionDistance: 80,
    // Era 120 → 80 (33% redução na distância de conexão)
    particleSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.6,
    // Era 1.2 → 0.6 (50% redução na velocidade)
    // Matrix rain - REDUZIDO DRASTICAMENTE (mantendo orbs intactas)
    matrixColumns: Math.floor((window.innerWidth || 800) / 80),
    // Era /20 → /80 (75% redução)
    matrixSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.8,
    // Era 2 → 0.8 (60% redução)
    matrixOpacity: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.3,
    // Era 0.8 → 0.3 (63% redução)
    // Cores do tema digital
    colors: {
      primary: "#3742FA",
      // Azul primário
      secondary: "#2F3542",
      // Cinza escuro
      accent: "#57606F",
      // Cinza médio
      grid: "#3742FA20",
      // Azul transparente para grid
      particle: "#3742FA",
      // Azul para partículas
      connection: "#57606F40",
      // Cinza transparente para conexões
      matrix: "#3742FA",
      // Azul para matrix rain
      glow: "#70A1FF"
      // Azul claro para efeitos
    },
    // Caracteres para matrix rain
    matrixChars: "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  }), [performanceConfig]);
  class DigitalParticle {
    constructor(canvas) {
      this.canvas = canvas;
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.particleSpeed;
      this.vy = (Math.random() - 0.5) * config.particleSpeed;
      this.size = 1 + Math.random() * 1.5;
      this.life = 1;
      this.decay = 2e-3 + Math.random() * 3e-3;
      this.glow = Math.random() * Math.PI * 2;
      this.glowSpeed = 0.02 + Math.random() * 0.02;
      this.trail = [];
      this.maxTrailLength = 5;
    }
    update() {
      if (config.particleSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
      this.glow += this.glowSpeed;
      this.life -= this.decay;
      if (this.life <= 0) {
        this.life = 1;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
      }
    }
    draw(ctx) {
      this.trail.forEach((point, index) => {
        const alpha = index / this.trail.length * this.life * 0.3;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = config.colors.glow;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.save();
      ctx.globalAlpha = this.life * 0.5;
      const glowIntensity = 0.5 + Math.sin(this.glow) * 0.3;
      ctx.shadowColor = config.colors.glow;
      ctx.shadowBlur = this.size * 1.5 * glowIntensity;
      ctx.fillStyle = config.colors.particle;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    distanceTo(other) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }
  class MatrixDrop {
    constructor(x, fontSize) {
      this.x = x;
      this.y = 0;
      this.fontSize = fontSize;
      this.speed = config.matrixSpeed + Math.random() * 0.8;
      this.chars = [];
      this.opacity = 0.4 + Math.random() * 0.2;
      const length = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < length; i++) {
        this.chars.push(config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)]);
      }
    }
    update(canvasHeight) {
      if (config.matrixSpeed === 0) return;
      this.y += this.speed;
      if (this.y > canvasHeight + this.chars.length * this.fontSize) {
        this.y = -this.chars.length * this.fontSize;
        if (Math.random() < 0.03) {
          const index = Math.floor(Math.random() * this.chars.length);
          this.chars[index] = config.matrixChars[Math.floor(Math.random() * config.matrixChars.length)];
        }
      }
    }
    draw(ctx) {
      if (config.matrixOpacity === 0) return;
      ctx.save();
      ctx.font = `${this.fontSize}px monospace`;
      ctx.globalAlpha = config.matrixOpacity * this.opacity;
      this.chars.forEach((char, index) => {
        const y = this.y + index * this.fontSize;
        const alpha = Math.max(0, 1 - index / this.chars.length);
        ctx.globalAlpha = config.matrixOpacity * this.opacity * alpha;
        ctx.fillStyle = index === 0 ? config.colors.glow : config.colors.matrix;
        ctx.fillText(char, this.x, y);
      });
      ctx.restore();
    }
  }
  const drawDigitalGrid = (ctx) => {
    if (config.gridOpacity === 0) return;
    const { width, height } = ctx.canvas;
    ctx.save();
    ctx.globalAlpha = config.gridOpacity;
    ctx.strokeStyle = config.colors.grid;
    ctx.lineWidth = 1;
    gridRef.current.offset += config.gridSpeed;
    if (gridRef.current.offset >= config.gridSize) {
      gridRef.current.offset = 0;
    }
    for (let x = -gridRef.current.offset; x < width + config.gridSize; x += config.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = -gridRef.current.offset; y < height + config.gridSize; y += config.gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.fillStyle = config.colors.particle;
    for (let x = -gridRef.current.offset; x < width + config.gridSize; x += config.gridSize) {
      for (let y = -gridRef.current.offset; y < height + config.gridSize; y += config.gridSize) {
        if (Math.random() < 0.1) {
          ctx.shadowColor = config.colors.glow;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();
  };
  const drawConnections = (ctx) => {
    ctx.save();
    ctx.strokeStyle = config.colors.connection;
    ctx.lineWidth = 1;
    const particles = particlesRef.current.filter((p) => p instanceof DigitalParticle);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].distanceTo(particles[j]);
        if (distance < config.connectionDistance) {
          const alpha = 1 - distance / config.connectionDistance;
          ctx.globalAlpha = alpha * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  };
  const initializeElements = (canvas) => {
    particlesRef.current = [];
    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push(new DigitalParticle(canvas));
    }
    matrixRef.current.drops = [];
    const fontSize = 14;
    for (let i = 0; i < config.matrixColumns; i++) {
      const x = i * 20;
      matrixRef.current.drops.push(new MatrixDrop(x, fontSize));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDigitalGrid(ctx);
    matrixRef.current.drops.forEach((drop) => {
      drop.update(canvas.height);
      drop.draw(ctx);
    });
    drawConnections(ctx);
    particlesRef.current.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });
    if (config.particleSpeed > 0 || config.gridSpeed > 0 || config.matrixSpeed > 0) {
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
const InformaticaBackground$1 = React.memo(InformaticaBackground);
const InformaticaBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: InformaticaBackground$1
}, Symbol.toStringTag, { value: "Module" }));
const DesignGraficoBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const shapesRef = useRef([]);
  const brushStrokesRef = useRef([]);
  const gradientRef = useRef({ phase: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const config = useMemo(() => ({
    // Formas geométricas
    shapeCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 25, 8),
    shapeSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 1.5,
    // Pinceladas
    brushCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 15, 6),
    brushSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 2,
    // Gradientes dinâmicos
    gradientSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.02,
    gradientIntensity: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0.5 : 1,
    // Cursor effects
    cursorInfluence: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 150,
    // Cores do tema criativo
    colors: {
      primary: "#FF6B9D",
      // Rosa vibrante
      secondary: "#C44569",
      // Rosa escuro
      accent: "#F8B500",
      // Amarelo dourado
      gradient1: "#FF6B9D",
      // Rosa para gradientes
      gradient2: "#FF9F43",
      // Laranja
      gradient3: "#F8B500",
      // Amarelo
      brush: "#FF6B9D80",
      // Rosa semi-transparente
      shape: "#C44569",
      // Rosa escuro para formas
      glow: "#FF9F43"
      // Laranja para glow
    },
    // Tipos de formas
    shapeTypes: ["circle", "triangle", "square", "hexagon", "star"]
  }), [performanceConfig]);
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
      if (this.x <= -this.size || this.x >= this.canvas.width + this.size) {
        this.vx *= -0.8;
        this.x = Math.max(-this.size, Math.min(this.canvas.width + this.size, this.x));
      }
      if (this.y <= -this.size || this.y >= this.canvas.height + this.size) {
        this.vy *= -0.8;
        this.y = Math.max(-this.size, Math.min(this.canvas.height + this.size, this.y));
      }
      this.scale = 0.5 + Math.sin(this.pulse) * 0.2;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(this.scale, this.scale);
      ctx.globalAlpha = this.opacity;
      const colors = [config.colors.gradient1, config.colors.gradient2, config.colors.gradient3];
      const color = colors[this.colorIndex];
      ctx.shadowColor = color;
      ctx.shadowBlur = 20;
      ctx.fillStyle = color;
      switch (this.type) {
        case "circle":
          this.drawCircle(ctx);
          break;
        case "triangle":
          this.drawTriangle(ctx);
          break;
        case "square":
          this.drawSquare(ctx);
          break;
        case "hexagon":
          this.drawHexagon(ctx);
          break;
        case "star":
          this.drawStar(ctx);
          break;
      }
      ctx.restore();
    }
    drawCircle(ctx) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    drawTriangle(ctx) {
      ctx.beginPath();
      const height = this.size * 0.866;
      ctx.moveTo(0, -height / 2);
      ctx.lineTo(-this.size / 2, height / 2);
      ctx.lineTo(this.size / 2, height / 2);
      ctx.closePath();
      ctx.fill();
    }
    drawSquare(ctx) {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    drawHexagon(ctx) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const x = Math.cos(angle) * this.size / 2;
        const y = Math.sin(angle) * this.size / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    drawStar(ctx) {
      ctx.beginPath();
      const spikes = 5;
      const outerRadius = this.size / 2;
      const innerRadius = outerRadius * 0.5;
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = i * Math.PI / spikes;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
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
      this.decay = 2e-3 + Math.random() * 3e-3;
      for (let i = 0; i < 3; i++) {
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
      this.points.push({ x: this.x, y: this.y });
      if (this.points.length > this.maxPoints) {
        this.points.shift();
      }
      this.life -= this.decay;
      if (this.life <= 0) {
        this.life = 1;
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.points = [];
      }
      if (this.x <= 0 || this.x >= this.canvas.width) this.vx *= -1;
      if (this.y <= 0 || this.y >= this.canvas.height) this.vy *= -1;
    }
    draw(ctx) {
      if (this.points.length < 2) return;
      ctx.save();
      ctx.globalAlpha = this.opacity * this.life;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      for (let i = 0; i < this.points.length - 1; i++) {
        const current = this.points[i];
        const next = this.points[i + 1];
        const alpha = i / this.points.length * this.life;
        ctx.globalAlpha = this.opacity * alpha;
        if (i === 0) {
          ctx.moveTo(current.x, current.y);
        } else {
          const xc = (current.x + next.x) / 2;
          const yc = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(current.x, current.y, xc, yc);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  const drawDynamicGradient = (ctx) => {
    const { width, height } = ctx.canvas;
    gradientRef.current.phase += config.gradientSpeed;
    const centerX = width / 2 + Math.sin(gradientRef.current.phase) * 100;
    const centerY = height / 2 + Math.cos(gradientRef.current.phase * 0.7) * 80;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height) * 0.8
    );
    const phase1 = gradientRef.current.phase;
    const phase2 = gradientRef.current.phase + Math.PI * 0.5;
    const phase3 = gradientRef.current.phase + Math.PI;
    const alpha1 = (Math.sin(phase1) + 1) * 0.5 * config.gradientIntensity;
    const alpha2 = (Math.sin(phase2) + 1) * 0.5 * config.gradientIntensity;
    const alpha3 = (Math.sin(phase3) + 1) * 0.5 * config.gradientIntensity;
    gradient.addColorStop(0, `${config.colors.gradient1}${Math.floor(alpha1 * 255).toString(16).padStart(2, "0")}`);
    gradient.addColorStop(0.5, `${config.colors.gradient2}${Math.floor(alpha2 * 255).toString(16).padStart(2, "0")}`);
    gradient.addColorStop(1, `${config.colors.gradient3}${Math.floor(alpha3 * 255).toString(16).padStart(2, "0")}`);
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  };
  const drawCursorEffect = (ctx) => {
    if (config.cursorInfluence === 0) return;
    const { x, y } = mousePosition;
    ctx.save();
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, config.cursorInfluence);
    gradient.addColorStop(0, `${config.colors.glow}40`);
    gradient.addColorStop(1, `${config.colors.glow}00`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  };
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    if (config.cursorInfluence > 0) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [config.cursorInfluence]);
  const initializeElements = (canvas) => {
    shapesRef.current = [];
    brushStrokesRef.current = [];
    for (let i = 0; i < config.shapeCount; i++) {
      shapesRef.current.push(new GeometricShape(canvas));
    }
    for (let i = 0; i < config.brushCount; i++) {
      brushStrokesRef.current.push(new BrushStroke(canvas));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDynamicGradient(ctx);
    drawCursorEffect(ctx);
    brushStrokesRef.current.forEach((brush) => {
      brush.update();
      brush.draw(ctx);
    });
    shapesRef.current.forEach((shape) => {
      shape.update();
      shape.draw(ctx);
    });
    if (config.shapeSpeed > 0 || config.brushSpeed > 0 || config.gradientSpeed > 0) {
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
const DesignGraficoBackground$1 = React.memo(DesignGraficoBackground);
const DesignGraficoBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: DesignGraficoBackground$1
}, Symbol.toStringTag, { value: "Module" }));
const ProgramacaoBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  useRef(null);
  const codeSnippetsRef = useRef([]);
  useRef({ lines: [], cursor: 0 });
  const animationIdRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const startAnimation = useCallback((animationFn) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const animate2 = () => {
      if (!isAnimatingRef.current) return;
      animationFn();
      animationIdRef.current = requestAnimationFrame(animate2);
    };
    animate2();
  }, []);
  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);
  const config = useMemo(() => ({
    // Código flutuante - REDUZIDO
    snippetCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 10, 4),
    // era 20/6
    codeSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 0.6,
    // era 1
    // Terminal animado - REDUZIDO
    terminalSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 120,
    // ms entre caracteres (era 80)
    terminalLines: 3,
    // era 5
    // Cores do tema programação
    colors: {
      primary: "#2ED573",
      // Verde vibrante
      secondary: "#1E90FF",
      // Azul
      accent: "#70A1FF",
      // Azul claro
      code: "#2ED573",
      // Verde para código
      terminal: "#1E90FF",
      // Azul para terminal
      cursor: "#70A1FF",
      // Azul claro para cursor
      comment: "#2ED57360",
      // Verde transparente para comentários
      background: "#0A0A0A"
      // Fundo escuro
    },
    // Snippets de código para animar
    codeSnippets: [
      "function createApp() {",
      "  const app = express();",
      "  return app;",
      "}",
      "",
      "const users = await User.find();",
      "console.log(users.length);",
      "",
      "if (user.isActive) {",
      "  user.lastLogin = new Date();",
      "  await user.save();",
      "}",
      "",
      "export default function App() {",
      "  const [data, setData] = useState();",
      "  return <div>{data}</div>;",
      "}",
      "",
      "class Database {",
      "  constructor(config) {",
      "    this.config = config;",
      "  }",
      "",
      "  async connect() {",
      "    return this.client.connect();",
      "  }",
      "}",
      "",
      "// API Route Handler",
      'app.get("/api/users", async (req, res) => {',
      "  try {",
      "    const users = await getUsersFromDB();",
      "    res.json(users);",
      "  } catch (error) {",
      "    res.status(500).json({ error });",
      "  }",
      "});"
    ],
    // Comandos de terminal
    terminalCommands: [
      "$ npm install react",
      "$ git add .",
      '$ git commit -m "feat: add new feature"',
      "$ npm run build",
      "$ docker build -t app .",
      "$ kubectl apply -f deployment.yaml",
      "$ node server.js"
    ]
  }), [performanceConfig]);
  class FloatingCodeSnippet {
    constructor(canvas) {
      this.canvas = canvas;
      this.lines = [];
      this.x = Math.random() * (canvas.width + 200) - 100;
      this.y = Math.random() * canvas.height;
      this.vx = -config.codeSpeed * (0.5 + Math.random() * 0.5);
      this.vy = (Math.random() - 0.5) * 0.5;
      this.opacity = 0.15 + Math.random() * 0.15;
      this.fontSize = 12 + Math.random() * 3;
      this.lineHeight = this.fontSize + 4;
      this.maxWidth = 200 + Math.random() * 150;
      const startIndex = Math.floor(Math.random() * (config.codeSnippets.length - 8));
      this.lines = config.codeSnippets.slice(startIndex, startIndex + 4 + Math.floor(Math.random() * 4));
      this.typingProgress = 0;
      this.typingSpeed = 0.5 + Math.random() * 1;
      this.fullyTyped = false;
    }
    update() {
      if (config.codeSpeed === 0) return;
      this.x += this.vx;
      this.y += this.vy;
      if (!this.fullyTyped) {
        this.typingProgress += this.typingSpeed;
        if (this.typingProgress >= this.getTotalCharacters()) {
          this.fullyTyped = true;
        }
      }
      if (this.x < -this.maxWidth - 50) {
        this.x = this.canvas.width + 50;
        this.y = Math.random() * this.canvas.height;
        this.typingProgress = 0;
        this.fullyTyped = false;
      }
    }
    getTotalCharacters() {
      return this.lines.join("").length;
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.fontSize}px 'Courier New', monospace`;
      let currentCharCount = 0;
      this.lines.forEach((line, lineIndex) => {
        const y = this.y + lineIndex * this.lineHeight;
        let visibleChars = 0;
        if (this.fullyTyped) {
          visibleChars = line.length;
        } else {
          const remainingChars = Math.max(0, this.typingProgress - currentCharCount);
          visibleChars = Math.min(line.length, remainingChars);
        }
        const visibleText = line.substring(0, visibleChars);
        if (line.startsWith("//") || line.startsWith("/*")) {
          ctx.fillStyle = config.colors.comment;
        } else if (line.includes("function") || line.includes("class") || line.includes("const") || line.includes("let")) {
          ctx.fillStyle = config.colors.primary;
        } else if (line.includes("await") || line.includes("async") || line.includes("return")) {
          ctx.fillStyle = config.colors.secondary;
        } else {
          ctx.fillStyle = config.colors.code;
        }
        ctx.fillText(visibleText, this.x, y);
        if (!this.fullyTyped && currentCharCount <= this.typingProgress && this.typingProgress < currentCharCount + line.length) {
          const cursorX = this.x + ctx.measureText(visibleText).width;
          const cursorOpacity = Math.sin(Date.now() * 8e-3) * 0.5 + 0.5;
          ctx.save();
          ctx.globalAlpha = cursorOpacity;
          ctx.fillStyle = config.colors.cursor;
          ctx.fillRect(cursorX, y - this.fontSize, 2, this.fontSize);
          ctx.restore();
        }
        currentCharCount += line.length;
      });
      ctx.restore();
    }
  }
  const initializeElements = (canvas) => {
    codeSnippetsRef.current = [];
    for (let i = 0; i < config.snippetCount; i++) {
      codeSnippetsRef.current.push(new FloatingCodeSnippet(canvas));
    }
  };
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    memoryManager.registerCanvasContext(ctx);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    codeSnippetsRef.current.forEach((snippet) => {
      snippet.update();
      snippet.draw(ctx);
    });
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
    memoryManager.registerEventListener(window, "resize", handleResize);
    if (config.codeSpeed > 0 || config.terminalSpeed > 0) {
      startAnimation(animate);
    }
    return () => {
      stopAnimation();
    };
  }, [config, deviceCapabilities, startAnimation, stopAnimation]);
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
const ProgramacaoBackground$1 = React.memo(ProgramacaoBackground);
const ProgramacaoBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ProgramacaoBackground$1
}, Symbol.toStringTag, { value: "Module" }));
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
const MarketingDigitalBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MarketingDigitalBackground$1
}, Symbol.toStringTag, { value: "Module" }));
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
const IABackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: IABackground$1
}, Symbol.toStringTag, { value: "Module" }));
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
const BIBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: BIBackground$1
}, Symbol.toStringTag, { value: "Module" }));
const AdministracaoBackground = ({
  performanceConfig,
  deviceCapabilities,
  courseSlug
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const documentsRef = useRef([]);
  const chartsRef = useRef([]);
  const particlesRef = useRef([]);
  const config = useMemo(() => ({
    // Configurações de animação
    documentCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 8, 6),
    chartCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 6, 4),
    particleCount: Math.min((performanceConfig == null ? void 0 : performanceConfig.particleCount) || 20, 15),
    animationSpeed: (performanceConfig == null ? void 0 : performanceConfig.staticFallback) ? 0 : 1,
    // Cores do tema administrativo
    colors: {
      primary: "#6366F1",
      // Azul profissional
      secondary: "#8B5CF6",
      // Roxo executivo
      accent: "#A78BFA",
      // Lilás suave
      light: "#C4B5FD",
      // Claro
      background: "#1E1B4B"
      // Azul escuro
    }
  }), [performanceConfig]);
  class FloatingDocument {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.age = Math.random() * 1e3;
    }
    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = 15 + Math.random() * 20;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.01;
      this.opacity = 0.4 + Math.random() * 0.4;
    }
    update() {
      this.age += 1;
      this.x += this.vx * config.animationSpeed;
      this.y += this.vy * config.animationSpeed;
      this.rotation += this.rotationSpeed * config.animationSpeed;
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
      this.vx += (Math.random() - 0.5) * 0.01;
      this.vy += (Math.random() - 0.5) * 0.01;
      this.vx = Math.max(-1, Math.min(1, this.vx));
      this.vy = Math.max(-1, Math.min(1, this.vy));
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = config.colors.primary;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.2);
      ctx.strokeStyle = config.colors.light;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const y = -this.size / 3 + i * this.size / 4;
        ctx.moveTo(-this.size / 3, y);
        ctx.lineTo(this.size / 3, y);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  class FloatingChart {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.bars = Array(4).fill().map(() => Math.random());
    }
    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = 20 + Math.random() * 15;
      this.opacity = 0.3 + Math.random() * 0.4;
    }
    update() {
      this.x += this.vx * config.animationSpeed;
      this.y += this.vy * config.animationSpeed;
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.globalAlpha = this.opacity;
      const barWidth = this.size / 5;
      for (let i = 0; i < this.bars.length; i++) {
        const height = this.bars[i] * this.size;
        const x = (i - 1.5) * barWidth;
        ctx.fillStyle = i % 2 === 0 ? config.colors.secondary : config.colors.accent;
        ctx.fillRect(x, -height / 2, barWidth * 0.8, height);
      }
      ctx.restore();
    }
  }
  class DataParticle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
    }
    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.size = 2 + Math.random() * 4;
      this.opacity = 0.3 + Math.random() * 0.5;
      this.life = 0;
      this.maxLife = 300 + Math.random() * 200;
    }
    update() {
      this.life++;
      this.x += this.vx * config.animationSpeed;
      this.y += this.vy * config.animationSpeed;
      if (this.life > this.maxLife * 0.8) {
        this.opacity *= 0.98;
      }
      if (this.life > this.maxLife || this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
        this.reset();
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = config.colors.light;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    documentsRef.current.forEach((doc) => {
      doc.update();
      doc.draw(ctx);
    });
    chartsRef.current.forEach((chart) => {
      chart.update();
      chart.draw(ctx);
    });
    particlesRef.current.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });
    if (config.animationSpeed > 0) {
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
      documentsRef.current = Array(config.documentCount).fill().map(() => new FloatingDocument(canvas));
      chartsRef.current = Array(config.chartCount).fill().map(() => new FloatingChart(canvas));
      particlesRef.current = Array(config.particleCount).fill().map(() => new DataParticle(canvas));
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
const AdministracaoBackground$1 = React.memo(AdministracaoBackground);
const AdministracaoBackground$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: AdministracaoBackground$1
}, Symbol.toStringTag, { value: "Module" }));
export {
  AdministracaoBackground$2 as A,
  BIBackground$2 as B,
  DesignGraficoBackground$2 as D,
  EdicaoVideoBackground$2 as E,
  InformaticaBackground$2 as I,
  MarketingDigitalBackground$2 as M,
  Projetista3DBackground$2 as P,
  ProgramacaoBackground$2 as a,
  IABackground$2 as b
};
