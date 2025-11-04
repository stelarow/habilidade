import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { codeSimulator } from '@/data/devstart';
import { Desktop, NotePencil, Eye, CheckCircle, Confetti, Fire, Skull, User } from '@phosphor-icons/react';

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
        setTimeout(() => {
          setPlayerDead(true);
          setTimeout(() => setPlayerDead(false), 2000);
        }, 1000);
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
    toast.info('Simulador reiniciado! 🔄');
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

            <CardContent>
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800">
                  <TabsTrigger value="code" className="data-[state=active]:bg-blue-600 flex items-center gap-2">
                    <NotePencil size={20} weight="bold" />
                    Código
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-green-600 flex items-center gap-2">
                    <Eye size={20} weight="bold" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                {/* Code Tab */}
                <TabsContent value="code" className="space-y-6">
                  {/* Control Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {steps.map((step) => (
                      <Button
                        key={step.id}
                        onClick={() => handleStepClick(step)}
                        disabled={completedSteps.includes(step.id)}
                        variant={completedSteps.includes(step.id) ? 'outline' : 'default'}
                        className={`h-auto py-3 px-4 text-sm font-semibold flex items-center gap-2 ${
                          completedSteps.includes(step.id)
                            ? 'bg-green-900 text-green-300 border-green-600'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        {completedSteps.includes(step.id) && <CheckCircle size={18} weight="fill" />}
                        {step.label}
                      </Button>
                    ))}
                  </div>

                  {/* Code Display */}
                  <div className="bg-gray-950 border border-gray-700 rounded-lg p-4 min-h-[300px]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                      <span className="text-xs text-gray-400 font-mono">script.lua</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetSimulator}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        🔄 Reiniciar
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
                </TabsContent>

                {/* Preview Tab */}
                <TabsContent value="preview">
                  <div className="bg-gradient-to-b from-sky-300 to-sky-500 rounded-lg p-8 min-h-[400px] relative overflow-hidden">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:20px_20px]" />

                    {/* Scene */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center gap-8">
                      {/* Block */}
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
                            className={`w-32 h-32 rounded-lg shadow-2xl border-4 ${
                              blockState.colored
                                ? 'bg-red-600 border-red-800'
                                : 'bg-gray-400 border-gray-600'
                            } ${blockState.scripted ? 'animate-pulse' : ''}`}
                          >
                            {blockState.scripted && (
                              <div className="w-full h-full flex items-center justify-center">
                                <Fire size={48} weight="fill" className="text-orange-400" />
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Player */}
                      <AnimatePresence>
                        {blockState.tested && (
                          <motion.div
                            initial={{ x: -200, opacity: 0 }}
                            animate={{
                              x: playerDead ? 0 : 0,
                              y: playerDead ? -100 : 0,
                              opacity: playerDead ? 0 : 1,
                              rotate: playerDead ? 720 : 0,
                            }}
                            transition={{ duration: 1 }}
                          >
                            {playerDead ? (
                              <Skull size={64} weight="fill" className="text-gray-300" />
                            ) : (
                              <User size={64} weight="fill" className="text-blue-400" />
                            )}
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
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                          >
                            <div className="bg-red-600 text-white font-black text-2xl px-6 py-3 rounded-lg shadow-2xl border-4 border-red-800 flex items-center gap-3">
                              <Skull size={32} weight="fill" />
                              VOCÊ MORREU!
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Instructions */}
                      {!blockState.created && (
                        <p className="text-center text-white text-lg font-semibold bg-black/30 px-6 py-3 rounded-lg">
                          👈 Clique em "Criar Bloco" na aba Código para começar!
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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
