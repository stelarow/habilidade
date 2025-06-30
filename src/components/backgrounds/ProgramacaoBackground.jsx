import React, { useEffect, useRef, useMemo } from 'react';

/**
 * Background animado para o curso de Programação
 * Conceito: Código vivo - linhas de código flutuando + terminais animados
 */
const ProgramacaoBackground = ({ 
  performanceConfig, 
  deviceCapabilities, 
  courseSlug 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const codeSnippetsRef = useRef([]);
  const terminalRef = useRef({ lines: [], cursor: 0 });

  // Configurações baseadas na performance
  const config = useMemo(() => ({
    // Código flutuante
    snippetCount: Math.min(performanceConfig?.particleCount || 20, 6),
    codeSpeed: performanceConfig?.staticFallback ? 0 : 1,
    
    // Terminal animado
    terminalSpeed: performanceConfig?.staticFallback ? 0 : 80, // ms entre caracteres
    terminalLines: 5,
    
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
      this.opacity = 0.4 + Math.random() * 0.4;
      this.fontSize = 12 + Math.random() * 4;
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

    draw(ctx) {
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

  // Desenhar terminal animado
  const drawTerminal = (ctx) => {
    if (config.terminalSpeed === 0) return;
    
    const terminalX = 50;
    const terminalY = 50;
    const terminalWidth = 400;
    const terminalHeight = 200;
    const fontSize = 14;
    const lineHeight = 18;
    
    // Fundo do terminal
    ctx.save();
    ctx.fillStyle = config.colors.background + 'E6';
    ctx.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);
    
    // Borda do terminal
    ctx.strokeStyle = config.colors.terminal;
    ctx.lineWidth = 2;
    ctx.strokeRect(terminalX, terminalY, terminalWidth, terminalHeight);
    
    // Header do terminal
    ctx.fillStyle = config.colors.terminal + '40';
    ctx.fillRect(terminalX, terminalY, terminalWidth, 25);
    
    // Botões do terminal
    ['#FF5F56', '#FFBD2E', '#27CA3F'].forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(terminalX + 15 + index * 20, terminalY + 12, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Conteúdo do terminal
    ctx.font = `${fontSize}px 'Courier New', monospace`;
    ctx.fillStyle = config.colors.terminal;
    
    const currentTime = Date.now();
    const commandIndex = Math.floor(currentTime / 3000) % config.terminalCommands.length;
    const command = config.terminalCommands[commandIndex];
    const progress = (currentTime % 3000) / 3000;
    const visibleChars = Math.floor(command.length * progress);
    const visibleCommand = command.substring(0, visibleChars);
    
    // Linha de comando atual
    ctx.fillText(visibleCommand, terminalX + 10, terminalY + 50);
    
    // Cursor do terminal
    if (progress < 1) {
      const cursorX = terminalX + 10 + ctx.measureText(visibleCommand).width;
      const cursorOpacity = Math.sin(Date.now() * 0.008) * 0.5 + 0.5;
      
      ctx.save();
      ctx.globalAlpha = cursorOpacity;
      ctx.fillStyle = config.colors.cursor;
      ctx.fillRect(cursorX, terminalY + 50 - fontSize, 2, fontSize);
      ctx.restore();
    }
    
    // Linhas anteriores
    for (let i = 1; i <= 3; i++) {
      const prevIndex = (commandIndex - i + config.terminalCommands.length) % config.terminalCommands.length;
      const prevCommand = config.terminalCommands[prevIndex];
      
      ctx.save();
      ctx.globalAlpha = 1 - (i * 0.25);
      ctx.fillText(prevCommand, terminalX + 10, terminalY + 50 + i * lineHeight);
      ctx.restore();
    }
    
    ctx.restore();
  };

  // Inicializar elementos
  const initializeElements = (canvas) => {
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar terminal
    drawTerminal(ctx);
    
    // Atualizar e desenhar snippets de código
    codeSnippetsRef.current.forEach(snippet => {
      snippet.update();
      snippet.draw(ctx);
    });

    if (config.codeSpeed > 0 || config.terminalSpeed > 0) {
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
        mixBlendMode: 'multiply'
      }}
      aria-hidden="true"
    />
  );
};

export default React.memo(ProgramacaoBackground);
