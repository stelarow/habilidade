'use client';

import React, { useEffect, useRef, useMemo, useCallback } from 'react';

interface PerformanceConfig {
  particleCount?: number;
  staticFallback?: boolean;
}

interface DeviceCapabilities {
  pixelRatio?: number;
}

interface ProgramacaoBackgroundProps {
  performanceConfig?: PerformanceConfig;
  deviceCapabilities?: DeviceCapabilities;
  courseSlug?: string;
}

/**
 * Background animado para o curso de Programação
 * Conceito: Código vivo - linhas de código flutuando + terminais animados
 */
const ProgramacaoBackground: React.FC<ProgramacaoBackgroundProps> = ({ 
  performanceConfig = {}, 
  deviceCapabilities = {}, 
  courseSlug 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const codeSnippetsRef = useRef<any[]>([]);
  const terminalRef = useRef<{ lines: any[]; cursor: number }>({ lines: [], cursor: 0 });
  
  // Controle de animação para canvas
  const animationIdRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);

  const startAnimation = useCallback((animationFn: () => void) => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    const animate = () => {
      if (!isAnimatingRef.current) return;
      animationFn();
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const stopAnimation = useCallback(() => {
    isAnimatingRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  }, []);

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Código flutuante - REDUZIDO
    snippetCount: Math.min(performanceConfig?.particleCount || 10, 4), // era 20/6
    codeSpeed: performanceConfig?.staticFallback ? 0 : 0.6, // era 1
    
    // Terminal animado - REDUZIDO
    terminalSpeed: performanceConfig?.staticFallback ? 0 : 120, // ms entre caracteres (era 80)
    terminalLines: 3, // era 5
    
    // Cores do tema programação
    colors: {
      primary: '#2ED573',    // Verde vibrante
      secondary: '#1E90FF',  // Azul
      accent: '#70A1FF',     // Azul claro
      code: '#2ED573',       // Verde para código
      terminal: '#1E90FF',   // Azul para terminal
      cursor: '#70A1FF',     // Azul claro para cursor
      comment: '#2ED57360',  // Verde transparente para comentários
      background: '#0A0A0A'  // Fundo escuro
    },
    
    // Snippets de código para animar
    codeSnippets: [
      'function createApp() {',
      '  const app = express();',
      '  return app;',
      '}',
      '',
      'const users = await User.find();',
      'console.log(users.length);',
      '',
      'if (user.isActive) {',
      '  user.lastLogin = new Date();',
      '  await user.save();',
      '}',
      '',
      'export default function App() {',
      '  const [data, setData] = useState();',
      '  return <div>{data}</div>;',
      '}',
      '',
      'class Database {',
      '  constructor(config) {',
      '    this.config = config;',
      '  }',
      '',
      '  async connect() {',
      '    return this.client.connect();',
      '  }',
      '}',
      '',
      '// API Route Handler',
      'app.get("/api/users", async (req, res) => {',
      '  try {',
      '    const users = await getUsersFromDB();',
      '    res.json(users);',
      '  } catch (error) {',
      '    res.status(500).json({ error });',
      '  }',
      '});'
    ],
    
    // Comandos de terminal
    terminalCommands: [
      '$ npm install react',
      '$ git add .',
      '$ git commit -m "feat: add new feature"',
      '$ npm run build',
      '$ docker build -t app .',
      '$ kubectl apply -f deployment.yaml',
      '$ node server.js'
    ]
  }), [performanceConfig]);

  // Classe para snippets de código flutuante
  class FloatingCodeSnippet {
    canvas: HTMLCanvasElement;
    lines: string[];
    x: number;
    y: number;
    vx: number;
    vy: number;
    opacity: number;
    fontSize: number;
    lineHeight: number;
    maxWidth: number;
    typingProgress: number;
    typingSpeed: number;
    fullyTyped: boolean;

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.lines = [];
      this.x = Math.random() * (canvas.width + 200) - 100;
      this.y = Math.random() * canvas.height;
      this.vx = -config.codeSpeed * (0.5 + Math.random() * 0.5);
      this.vy = (Math.random() - 0.5) * 0.5;
      this.opacity = 0.15 + Math.random() * 0.15; // Opacidade bem baixa para não atrapalhar leitura
      this.fontSize = 12 + Math.random() * 3; // era 12-16
      this.lineHeight = this.fontSize + 4;
      this.maxWidth = 200 + Math.random() * 150;
      
      // Selecionar um snippet aleatório
      const startIndex = Math.floor(Math.random() * (config.codeSnippets.length - 8));
      this.lines = config.codeSnippets.slice(startIndex, startIndex + 4 + Math.floor(Math.random() * 4));
      
      // Efeito de digitação
      this.typingProgress = 0;
      this.typingSpeed = 0.5 + Math.random() * 1;
      this.fullyTyped = false;
    }

    update() {
      if (config.codeSpeed === 0) return;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Efeito de digitação
      if (!this.fullyTyped) {
        this.typingProgress += this.typingSpeed;
        if (this.typingProgress >= this.getTotalCharacters()) {
          this.fullyTyped = true;
        }
      }
      
      // Reposicionar quando sair da tela
      if (this.x < -this.maxWidth - 50) {
        this.x = this.canvas.width + 50;
        this.y = Math.random() * this.canvas.height;
        this.typingProgress = 0;
        this.fullyTyped = false;
      }
    }

    getTotalCharacters(): number {
      return this.lines.join('').length;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.font = `${this.fontSize}px 'Courier New', monospace`;
      
      let currentCharCount = 0;
      
      this.lines.forEach((line, lineIndex) => {
        const y = this.y + lineIndex * this.lineHeight;
        
        // Determinar quantos caracteres desta linha desenhar
        let visibleChars = 0;
        if (this.fullyTyped) {
          visibleChars = line.length;
        } else {
          const remainingChars = Math.max(0, this.typingProgress - currentCharCount);
          visibleChars = Math.min(line.length, remainingChars);
        }
        
        const visibleText = line.substring(0, visibleChars);
        
        // Colorir baseado no tipo de linha
        if (line.startsWith('//') || line.startsWith('/*')) {
          ctx.fillStyle = config.colors.comment;
        } else if (line.includes('function') || line.includes('class') || line.includes('const') || line.includes('let')) {
          ctx.fillStyle = config.colors.primary;
        } else if (line.includes('await') || line.includes('async') || line.includes('return')) {
          ctx.fillStyle = config.colors.secondary;
        } else {
          ctx.fillStyle = config.colors.code;
        }
        
        ctx.fillText(visibleText, this.x, y);
        
        // Cursor piscando na linha atual
        if (!this.fullyTyped && currentCharCount <= this.typingProgress && 
            this.typingProgress < currentCharCount + line.length) {
          const cursorX = this.x + ctx.measureText(visibleText).width;
          const cursorOpacity = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
          
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

  // Inicializar elementos
  const initializeElements = (canvas: HTMLCanvasElement) => {
    codeSnippetsRef.current = [];
    
    // Criar snippets de código
    for (let i = 0; i < config.snippetCount; i++) {
      codeSnippetsRef.current.push(new FloatingCodeSnippet(canvas));
    }
  };

  // Loop de animação
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar snippets de código
    codeSnippetsRef.current.forEach(snippet => {
      snippet.update();
      snippet.draw(ctx);
    });
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
      if (ctx) {
        ctx.scale(deviceCapabilities?.pixelRatio || 1, deviceCapabilities?.pixelRatio || 1);
      }
      
      // Reinicializar elementos com novo tamanho
      initializeElements(canvas);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Iniciar animação apenas se não for versão estática
    if (config.codeSpeed > 0 || config.terminalSpeed > 0) {
      startAnimation(animate);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      stopAnimation();
    };
  }, [config, deviceCapabilities, startAnimation, stopAnimation]);

  // Se for versão estática, apenas mostrar gradiente de programação
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

export default React.memo(ProgramacaoBackground);