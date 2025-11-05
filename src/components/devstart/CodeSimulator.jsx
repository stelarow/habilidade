import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { codeSimulator } from '@/data/devstart';
import { Desktop, CheckCircle, Confetti, Fire, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, GameController } from '@phosphor-icons/react';
import RobloxCharacter from './RobloxCharacter';

const CodeSimulator = () => {
  const { title, description, steps } = codeSimulator;
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentCode, setCurrentCode] = useState([]);
  const [blockState, setBlockState] = useState({
    created: false,
    colored: false,
    scripted: false,
    tested: false,
  });
  const [playerDead, setPlayerDead] = useState(false);

  // Novos estados para jogo interativo
  const [playerPos, setPlayerPos] = useState({ x: 15, y: 30 }); // Agora em percentuais
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  // Ref para o container do jogo
  const gameContainerRef = useRef(null);

  // Posições e tamanhos em percentuais para responsividade
  const blockPosPercent = { x: 65, y: 40, w: 18, h: 18 }; // Percentuais da tela
  const playerSizePercent = 12; // 12% da largura do container

  // Detectar tamanho do container e se é mobile
  useEffect(() => {
    const updateContainerSize = () => {
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Atualizar no mount
    updateContainerSize();

    // Atualizar no resize com debounce
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateContainerSize, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Calcular posições em pixels a partir dos percentuais
  const getPixelPosition = (percentX, percentY) => ({
    x: (percentX / 100) * containerSize.width,
    y: (percentY / 100) * containerSize.height,
  });

  const getPixelSize = (percent) => (percent / 100) * containerSize.width;

  // Posições calculadas em pixels
  const playerPixelPos = getPixelPosition(playerPos.x, playerPos.y);
  const blockPixelPos = getPixelPosition(blockPosPercent.x, blockPosPercent.y);
  const playerPixelSize = getPixelSize(playerSizePercent);
  const blockPixelSize = {
    w: getPixelSize(blockPosPercent.w),
    h: getPixelSize(blockPosPercent.h),
  };

  // Função para checar colisão (recebe percentuais)
  const checkCollision = (percentX, percentY) => {
    const playerPx = getPixelPosition(percentX, percentY);
    const playerSz = getPixelSize(playerSizePercent);
    const blockPx = getPixelPosition(blockPosPercent.x, blockPosPercent.y);
    const blockSz = {
      w: getPixelSize(blockPosPercent.w),
      h: getPixelSize(blockPosPercent.h),
    };

    return (
      playerPx.x < blockPx.x + blockSz.w &&
      playerPx.x + playerSz > blockPx.x &&
      playerPx.y < blockPx.y + blockSz.h &&
      playerPx.y + playerSz > blockPx.y
    );
  };

  // Função de movimento (agora trabalha com percentuais)
  const move = (direction) => {
    if (!isGameActive || gameOver) return;

    setPlayerPos((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      // Step em percentual (2.5% do container por movimento)
      const stepPercent = 2.5;

      switch (direction) {
        case 'up':
          newY -= stepPercent;
          break;
        case 'down':
          newY += stepPercent;
          break;
        case 'left':
          newX -= stepPercent;
          break;
        case 'right':
          newX += stepPercent;
          break;
      }

      // Limites da área de jogo (0-100% menos o tamanho do player)
      const maxX = 100 - playerSizePercent;
      const maxY = 100 - (playerSizePercent * 1.25); // Player é 25% mais alto
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // Checar colisão com o bloco
      if (blockState.scripted && checkCollision(newX, newY)) {
        setGameOver(true);
        setPlayerDead(true);
        setIsGameActive(false);
        toast.error('Você morreu! 💀 Clique em "Jogar Novamente"');
      }

      return { x: newX, y: newY };
    });
  };

  // Controles de teclado (desktop)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isGameActive || gameOver || isMobile) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          move('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          move('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          move('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          move('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameActive, gameOver, isMobile, blockState.scripted]);

  const handleStepClick = (step) => {
    // Verificar se pode executar este passo (precisa seguir ordem)
    const requiredStep = step.id - 1;
    if (requiredStep > 0 && !completedSteps.includes(requiredStep)) {
      toast.error('Complete os passos anteriores primeiro! 🚫');
      return;
    }

    // Se já completou, não faz nada
    if (completedSteps.includes(step.id)) {
      toast.info('Você já completou este passo! ✅');
      return;
    }

    // Adicionar código
    setCurrentCode((prev) => [...prev, step.code]);

    // Atualizar estado do bloco
    switch (step.action) {
      case 'createBlock':
        setBlockState((prev) => ({ ...prev, created: true }));
        break;
      case 'paintRed':
        setBlockState((prev) => ({ ...prev, colored: true }));
        break;
      case 'addScript':
        setBlockState((prev) => ({ ...prev, scripted: true }));
        break;
      case 'test':
        setBlockState((prev) => ({ ...prev, tested: true }));
        setIsGameActive(true);
        setGameOver(false);
        setPlayerDead(false);
        setPlayerPos({ x: 15, y: 30 }); // Valores em percentual
        toast.success('Jogo iniciado! ' + (isMobile ? 'Toque nas setas para mover! 📱' : 'Use as setas do teclado! ⌨️'));
        break;
    }

    // Marcar como completado
    setCompletedSteps((prev) => [...prev, step.id]);

    // Mostrar toast de feedback
    toast.success(step.feedback);
  };

  const resetSimulator = () => {
    setCompletedSteps([]);
    setCurrentCode([]);
    setBlockState({ created: false, colored: false, scripted: false, tested: false });
    setPlayerDead(false);
    setIsGameActive(false);
    setGameOver(false);
    setPlayerPos({ x: 15, y: 30 }); // Valores em percentual
    toast.info('Simulador reiniciado! 🔄');
  };

  const resetGame = () => {
    setPlayerPos({ x: 15, y: 30 }); // Valores em percentual
    setPlayerDead(false);
    setGameOver(false);
    setIsGameActive(true);
    toast.info('Jogo reiniciado! Boa sorte! 🎮');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-blue-500/30 bg-gray-900/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-300 flex items-center gap-2">
                <Desktop size={32} weight="bold" />
                Simulador de Código Roblox
              </CardTitle>
              <CardDescription className="text-gray-400">
                Siga os passos abaixo e veja o resultado em tempo real!
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Seção de Código (sempre visível) */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  💻 Código
                </h3>

                {/* Control Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {steps.map((step) => (
                    <Button
                      key={step.id}
                      onClick={() => handleStepClick(step)}
                      disabled={completedSteps.includes(step.id)}
                      variant={completedSteps.includes(step.id) ? 'outline' : 'default'}
                      className={`h-auto py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 whitespace-normal text-center ${
                        completedSteps.includes(step.id)
                          ? 'bg-green-900 text-green-300 border-green-600'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {completedSteps.includes(step.id) && <CheckCircle size={18} weight="fill" className="flex-shrink-0" />}
                      <span className="flex-1">{step.label}</span>
                    </Button>
                  ))}
                </div>

                {/* Code Display */}
                <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 min-h-[200px]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-mono">script.lua</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetSimulator}
                      className="text-xs text-gray-400 hover:text-white"
                    >
                      🔄 Reiniciar Tudo
                    </Button>
                  </div>
                  <div className="font-mono text-sm space-y-2">
                    {currentCode.length === 0 ? (
                      <p className="text-gray-500 italic">
                        -- Clique nos botões acima para começar a programar!
                      </p>
                    ) : (
                      currentCode.map((code, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <pre className="text-green-400 whitespace-pre-wrap">{code}</pre>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Progresso: {completedSteps.length} / {steps.length} passos
                  </span>
                  {completedSteps.length === steps.length && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-green-400 font-bold flex items-center gap-2"
                    >
                      <Confetti size={20} weight="fill" />
                      Completo!
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-700" />

              {/* Seção de Preview/Jogo (sempre visível) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <GameController size={24} weight="fill" />
                    Preview do Jogo
                  </h3>
                  {isGameActive && (
                    <div className="text-xs px-3 py-1 bg-green-600 text-white rounded-full font-semibold animate-pulse">
                      ● JOGO ATIVO
                    </div>
                  )}
                </div>

                {/* Game Area - Responsivo */}
                <div
                  ref={gameContainerRef}
                  className="bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg p-4 md:p-8 relative overflow-hidden w-full"
                  style={{
                    aspectRatio: isMobile ? '4/3' : '16/9',
                    minHeight: isMobile ? '400px' : '450px',
                    maxHeight: isMobile ? '500px' : '600px'
                  }}
                >
                  {/* Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:20px_20px]" />

                  {/* Scene Container */}
                  <div className="relative z-10 h-full">
                    {/* Block (posição absoluta responsiva) */}
                    <AnimatePresence>
                      {blockState.created && (
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{
                            scale: 1,
                            rotate: [0, 5, -5, 0],
                          }}
                          exit={{ scale: 0 }}
                          transition={{
                            scale: { duration: 0.5 },
                            rotate: { duration: 2, repeat: Infinity },
                          }}
                          className={`absolute rounded-lg shadow-2xl border-4 ${
                            blockState.colored
                              ? 'bg-red-600 border-red-800'
                              : 'bg-gray-400 border-gray-600'
                          } ${blockState.scripted ? 'animate-pulse' : ''}`}
                          style={{
                            left: `${blockPixelPos.x}px`,
                            top: `${blockPixelPos.y}px`,
                            width: `${blockPixelSize.w}px`,
                            height: `${blockPixelSize.h}px`
                          }}
                        >
                          {blockState.scripted && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Fire size={blockPixelSize.w * 0.4} weight="fill" className="text-orange-400" />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Player (posição controlável responsiva) */}
                    <AnimatePresence>
                      {blockState.tested && (
                        <motion.div
                          className="absolute flex items-center justify-center"
                          style={{
                            left: `${playerPixelPos.x}px`,
                            top: `${playerPixelPos.y}px`,
                            width: `${playerPixelSize}px`,
                            height: `${playerPixelSize * 1.25}px`
                          }}
                          animate={{
                            y: playerDead ? -50 : 0,
                            opacity: playerDead ? 0 : 1,
                            rotate: playerDead ? 360 : 0,
                          }}
                          transition={{ duration: playerDead ? 1 : 0.1 }}
                        >
                          {/* Glow effect para destacar personagem */}
                          {!playerDead && isGameActive && (
                            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-pulse"
                                 style={{ transform: 'scale(1.5)' }} />
                          )}
                          <div className="relative z-10">
                            <RobloxCharacter isDead={playerDead} size={playerPixelSize} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Death Message */}
                    <AnimatePresence>
                      {playerDead && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        >
                          <div className="bg-red-600 text-white font-black text-xl md:text-2xl px-6 py-3 rounded-lg shadow-2xl border-4 border-red-800 flex items-center gap-3">
                            <span className="text-3xl">💀</span>
                            VOCÊ MORREU!
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Instructions */}
                    {!blockState.created && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
                        <p className="text-center text-white text-lg font-semibold bg-black/30 px-6 py-3 rounded-lg">
                          👆 Clique em "Criar Bloco" acima para começar!
                        </p>
                      </div>
                    )}

                    {blockState.created && !blockState.tested && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
                        <p className="text-center text-white text-lg font-semibold bg-black/30 px-6 py-3 rounded-lg">
                          Continue os passos acima e depois clique em "▶️ TESTAR!"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                {isGameActive && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="text-center">
                      <span className="text-sm text-gray-400 font-semibold">
                        {isMobile ? '📱 Use os botões abaixo para mover' : '⌨️ Use as setas do teclado (ou WASD) para mover'}
                      </span>
                    </div>

                    {/* Botões Direcionais (apenas mobile) */}
                    {isMobile && (
                      <div className="flex flex-col items-center gap-2">
                        <Button
                          onClick={() => move('up')}
                          size="lg"
                          className="w-16 h-16 bg-blue-600 hover:bg-blue-700"
                        >
                          <ArrowUp size={32} weight="bold" />
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => move('left')}
                            size="lg"
                            className="w-16 h-16 bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowLeft size={32} weight="bold" />
                          </Button>
                          <Button
                            onClick={() => move('down')}
                            size="lg"
                            className="w-16 h-16 bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowDown size={32} weight="bold" />
                          </Button>
                          <Button
                            onClick={() => move('right')}
                            size="lg"
                            className="w-16 h-16 bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowRight size={32} weight="bold" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Botão Jogar Novamente */}
                {gameOver && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center"
                  >
                    <Button
                      onClick={resetGame}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6"
                    >
                      🔄 Jogar Novamente
                    </Button>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <p className="text-lg text-gray-300">
            <span className="font-bold text-blue-400">Incrível, né?</span> E isso é só o começo!
            No DevStart você vai aprender muito mais! 🚀
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CodeSimulator;
