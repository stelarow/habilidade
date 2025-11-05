import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { devstartData } from '@/data/devstart';
import { GameController, Rocket, Calendar, Timer, Target, Sparkle } from '@phosphor-icons/react';

const HeroSection = () => {
  const { event, badges } = devstartData;
  const [timeLeft, setTimeLeft] = useState(null);

  // Função para scroll suave até o formulário
  const scrollToInscription = () => {
    const inscriptionElement = document.getElementById('inscricao');
    if (inscriptionElement) {
      inscriptionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Map icon names to actual Phosphor icon components
  const getIcon = (iconName) => {
    const icons = {
      Sparkle: <Sparkle size={20} weight="bold" />,
      Calendar: <Calendar size={20} weight="bold" />,
      Target: <Target size={20} weight="bold" />,
    };
    return icons[iconName] || null;
  };

  // Countdown timer
  useEffect(() => {
    if (!event.startDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(event.startDate) - new Date();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [event.startDate]);

  // Floating blocks animation
  const floatingBlocks = [
    { size: 60, x: 10, y: 20, duration: 20, color: '#E3000F' },
    { size: 80, x: 80, y: 60, duration: 25, color: '#00A2FF' },
    { size: 50, x: 70, y: 10, duration: 18, color: '#FFEB3B' },
    { size: 70, x: 20, y: 70, duration: 22, color: '#00C851' },
    { size: 45, x: 50, y: 50, duration: 15, color: '#6366F1' },
    { size: 55, x: 90, y: 30, duration: 28, color: '#FF6B00' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Floating Blocks Background */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingBlocks.map((block, index) => (
          <motion.div
            key={index}
            className="absolute rounded-lg opacity-20 blur-sm"
            style={{
              width: block.size,
              height: block.size,
              backgroundColor: block.color,
              left: `${block.x}%`,
              top: `${block.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: block.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              >
                <Badge
                  variant={badge.variant === 'success' ? 'default' : badge.variant === 'warning' ? 'destructive' : 'secondary'}
                  className={`text-sm px-4 py-2 font-bold flex items-center gap-2 ${
                    badge.variant === 'success'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : badge.variant === 'warning'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {getIcon(badge.iconName)}
                  {badge.text}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <motion.h1
            className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl flex items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <GameController size={64} weight="fill" className="text-red-500" />
            {event.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-2xl md:text-4xl font-bold text-blue-300 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {event.subtitle}
          </motion.h2>

          {/* Tagline */}
          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {event.tagline}
          </motion.p>

          {/* Countdown Timer */}
          {event.startDate && timeLeft && (
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="inline-block bg-black/40 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-500/30">
                <p className="text-sm text-gray-300 mb-3 uppercase tracking-wider flex items-center justify-center gap-2">
                  <Rocket size={20} weight="fill" className="text-blue-400" />
                  O evento começa em:
                </p>
                <div className="flex gap-4 justify-center">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg w-16 h-16 flex items-center justify-center shadow-lg">
                        <span className="text-2xl md:text-3xl font-black text-white">
                          {String(value).padStart(2, '0')}
                        </span>
                      </div>
                      <span className="text-xs text-gray-300 mt-2 uppercase font-semibold">
                        {unit === 'days' ? 'Dias' : unit === 'hours' ? 'Horas' : unit === 'minutes' ? 'Min' : 'Seg'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <Button
              size="lg"
              onClick={scrollToInscription}
              className="text-xl px-10 py-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-red-400/50 animate-pulse hover:animate-none flex items-center gap-3"
            >
              ACEITAR MISSÃO
              <Rocket size={28} weight="fill" />
            </Button>
          </motion.div>

          {/* Event Details */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-6 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={28} weight="bold" className="text-blue-400" />
              <span className="font-semibold">{event.horario}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer size={28} weight="bold" className="text-green-400" />
              <span className="font-semibold">{event.duracao}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={28} weight="bold" className="text-yellow-400" />
              <span className="font-semibold">{event.vagas} vagas</span>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <span className="text-sm uppercase tracking-wider">Role para saber mais</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
