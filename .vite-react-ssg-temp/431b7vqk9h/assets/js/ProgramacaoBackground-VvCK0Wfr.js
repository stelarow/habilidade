import { jsx } from "react/jsx-runtime";
import React, { useRef, useCallback, useMemo, useEffect } from "react";
class MemoryManager {
  constructor() {
    this.activeAnimations = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.canvasContexts = /* @__PURE__ */ new Set();
    this.timers = /* @__PURE__ */ new Set();
    this.isTabActive = true;
    this.memoryThreshold = 100 * 1024 * 1024;
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      this.setupVisibilityAPI();
      this.setupMemoryMonitoring();
    }
  }
  // API de Visibilidade - pausa animações quando aba não está ativa
  setupVisibilityAPI() {
    if (typeof document === "undefined") {
      console.warn("[MemoryManager] Skipping visibility API setup - running in SSR environment");
      return;
    }
    const handleVisibilityChange = () => {
      this.isTabActive = !document.hidden;
      if (!this.isTabActive) {
        this.pauseAllAnimations();
        console.log("[MemoryManager] Tab inactive - animations paused");
      } else {
        this.resumeAllAnimations();
        console.log("[MemoryManager] Tab active - animations resumed");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    this.eventListeners.set("document:visibilitychange", handleVisibilityChange);
  }
  // Monitoramento de memória (quando suportado)
  setupMemoryMonitoring() {
    if (typeof performance === "undefined" || !("memory" in performance)) return;
    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      if (usedMB > 150) {
        console.warn(`[MemoryManager] High memory usage: ${usedMB.toFixed(1)}MB`);
        this.emergencyCleanup();
      }
    };
    const intervalId = setInterval(checkMemory, 3e4);
    this.timers.add(intervalId);
  }
  // Registrar animação
  registerAnimation(id, pauseFn, resumeFn, cleanupFn) {
    const animation = {
      id,
      pauseFn: pauseFn || (() => {
      }),
      resumeFn: resumeFn || (() => {
      }),
      cleanupFn: cleanupFn || (() => {
      }),
      isPaused: false
    };
    this.activeAnimations.add(animation);
    return animation;
  }
  // Pausar todas as animações
  pauseAllAnimations() {
    this.activeAnimations.forEach((animation) => {
      if (!animation.isPaused) {
        animation.pauseFn();
        animation.isPaused = true;
      }
    });
  }
  // Retomar todas as animações
  resumeAllAnimations() {
    if (!this.isTabActive) return;
    this.activeAnimations.forEach((animation) => {
      if (animation.isPaused) {
        animation.resumeFn();
        animation.isPaused = false;
      }
    });
  }
  // Remover animação
  unregisterAnimation(animation) {
    if (animation && animation.cleanupFn) {
      animation.cleanupFn();
    }
    this.activeAnimations.delete(animation);
  }
  // Registrar event listener para cleanup automático
  registerEventListener(element, event, handler, options) {
    const key = `${element.constructor.name}:${event}`;
    element.addEventListener(event, handler, options);
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, handler, options });
  }
  // Registrar contexto de canvas
  registerCanvasContext(context) {
    this.canvasContexts.add(context);
  }
  // Limpeza de emergência
  emergencyCleanup() {
    console.log("[MemoryManager] Emergency cleanup triggered");
    this.pauseAllAnimations();
    if (window.gc) {
      window.gc();
    }
    this.canvasContexts.forEach((ctx) => {
      if (ctx && ctx.canvas) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    });
    setTimeout(() => {
      if (this.isTabActive) {
        this.resumeAllAnimations();
        console.log("[MemoryManager] Animations resumed after cleanup");
      }
    }, 2e3);
  }
  // Limpeza completa
  destroy() {
    this.activeAnimations.forEach((animation) => {
      this.unregisterAnimation(animation);
    });
    this.activeAnimations.clear();
    this.eventListeners.forEach((listeners, key) => {
      listeners.forEach(({ element, handler, options }) => {
        element.removeEventListener(key.split(":")[1], handler, options);
      });
    });
    this.eventListeners.clear();
    this.timers.forEach((timerId) => {
      clearInterval(timerId);
    });
    this.timers.clear();
    this.canvasContexts.clear();
  }
  // Estatísticas para debug
  getStats() {
    const memoryInfo = "memory" in performance ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    } : { used: "N/A", total: "N/A", limit: "N/A" };
    return {
      activeAnimations: this.activeAnimations.size,
      eventListeners: this.eventListeners.size,
      canvasContexts: this.canvasContexts.size,
      timers: this.timers.size,
      isTabActive: this.isTabActive,
      memory: memoryInfo
    };
  }
}
const memoryManager = new MemoryManager();
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
export {
  ProgramacaoBackground$1 as default
};
