import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import memoryManager from '../../utils/memoryManager';

/**
 * Background animado para o curso de Programação
 * Conceito: Código vivo - linhas de código flutuando + terminais animados
 */
const ProgramacaoBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasReference = useRef(null);
  const animationReference = useRef(null);
  const codeSnippetsReference = useRef([]);
  const terminalReference = useRef({ lines: [], cursor: 0 });
  
  // Controle de animação para canvas
  const animationIdReference = useRef(null);
  const isAnimatingReference = useRef(false);

  const startAnimation = useCallback((animationFunction) => {
    if (isAnimatingReference.current) return;
    
    isAnimatingReference.current = true;
    const animate = () => {
      if (!isAnimatingReference.current) return;
      animationFunction();
      animationIdReference.current = requestAnimationFrame(animate);
    };
    animate();
  }, []);

  const stopAnimation = useCallback(() => {
    isAnimatingReference.current = false;
    if (animationIdReference.current) {
      cancelAnimationFrame(animationIdReference.current);
      animationIdReference.current = null;
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
    constructor(canvas) {
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

    getTotalCharacters() {
      return this.lines.join('').length;
    }

    draw(context) {
      context.save();
      context.globalAlpha = this.opacity;
      context.font = `${this.fontSize}px 'Courier New', monospace`;
      
      let currentCharCount = 0;
      
      for (const [lineIndex, line] of this.lines.entries()) {
        const y = this.y + lineIndex * this.lineHeight;
        
        // Determinar quantos caracteres desta linha desenhar
        let visibleChars = 0;
        if (this.fullyTyped) {
          visibleChars = line.length;
        } else {
          const remainingChars = Math.max(0, this.typingProgress - currentCharCount);
          visibleChars = Math.min(line.length, remainingChars);
        }
        
        const visibleText = line.slice(0, Math.max(0, visibleChars));
        
        // Colorir baseado no tipo de linha
        if (line.startsWith('//') || line.startsWith('/*')) {
          context.fillStyle = config.colors.comment;
        } else if (line.includes('function') || line.includes('class') || line.includes('const') || line.includes('let')) {
          context.fillStyle = config.colors.primary;
        } else if (line.includes('await') || line.includes('async') || line.includes('return')) {
          context.fillStyle = config.colors.secondary;
        } else {
          context.fillStyle = config.colors.code;
        }
        
        context.fillText(visibleText, this.x, y);
        
        // Cursor piscando na linha atual
        if (!this.fullyTyped && currentCharCount <= this.typingProgress && 
            this.typingProgress < currentCharCount + line.length) {
          const cursorX = this.x + context.measureText(visibleText).width;
          const cursorOpacity = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
          
          context.save();
          context.globalAlpha = cursorOpacity;
          context.fillStyle = config.colors.cursor;
          context.fillRect(cursorX, y - this.fontSize, 2, this.fontSize);
          context.restore();
        }
        
        currentCharCount += line.length;
      }
      
      context.restore();
    }
  }

  // Terminal removido conforme solicitação do usuário

  // Inicializar elementos
  const initializeElements = (canvas) => {
    codeSnippetsReference.current = [];
    
    // Criar snippets de código
    for (let index = 0; index < config.snippetCount; index++) {
      codeSnippetsReference.current.push(new FloatingCodeSnippet(canvas));
    }
  };

  // Loop de animação com memory management
  const animate = () => {
    const canvas = canvasReference.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    
    // Registrar contexto para memory management
    memoryManager.registerCanvasContext(context);
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Atualizar e desenhar snippets de código
    for (const snippet of codeSnippetsReference.current) {
      snippet.update();
      snippet.draw(context);
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
    
    // Usar memory manager para event listeners
    memoryManager.registerEventListener(globalThis, 'resize', handleResize);

    // Iniciar animação apenas se não for versão estática
    if (config.codeSpeed > 0 || config.terminalSpeed > 0) {
      startAnimation(animate);
    }

    return () => {
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

export default React.memo(ProgramacaoBackground);
