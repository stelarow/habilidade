import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { missions } from '@/data/devstart';
import {
  Calendar,
  Lightbulb,
  CheckCircle,
  Trophy,
  GraduationCap,
  MapTrifold,
  Lightning,
  Path,
  Globe
} from '@phosphor-icons/react';

const MissionTimeline = () => {
  const [openItem, setOpenItem] = useState('mission-1');
  const [progressValue, setProgressValue] = useState(0);

  // Map icon names to actual Phosphor icon components
  const getIcon = (iconName, size = 32) => {
    const icons = {
      MapTrifold: <MapTrifold size={size} weight="bold" className="text-blue-400" />,
      Lightning: <Lightning size={size} weight="bold" className="text-yellow-400" />,
      Path: <Path size={size} weight="bold" className="text-red-400" />,
      Globe: <Globe size={size} weight="bold" className="text-green-400" />,
    };
    return icons[iconName] || null;
  };

  // Calcular progresso baseado no item aberto
  useEffect(() => {
    if (openItem) {
      const missionNumber = parseInt(openItem.split('-')[1]);
      const progress = (missionNumber / missions.length) * 100;
      setProgressValue(progress);
    }
  }, [openItem]);

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Calendar size={48} weight="bold" className="text-blue-400" />
            Sua Jornada em 4 Semanas
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Cada semana é uma nova missão! Veja o que você vai aprender:
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-gray-400 font-semibold">Progresso:</span>
              <span className="text-lg text-blue-400 font-bold">{Math.round(progressValue)}%</span>
            </div>
            <Progress
              value={progressValue}
              className="h-3 bg-gray-800"
            />
          </div>
        </motion.div>

        {/* Missions Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="space-y-4"
          >
            {missions.map((mission, index) => (
              <AccordionItem
                key={mission.week}
                value={`mission-${mission.week}`}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                  openItem === `mission-${mission.week}`
                    ? 'border-blue-400 shadow-lg shadow-blue-500/20 bg-gray-800/50'
                    : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
                }`}
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                  <div className="flex items-center gap-4 w-full text-left">
                    {/* Week Badge */}
                    <Badge
                      className={`flex-shrink-0 text-lg font-black px-4 py-2 ${
                        openItem === `mission-${mission.week}`
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      #{mission.week}
                    </Badge>

                    {/* Mission Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(mission.iconName)}
                        <h3 className={`text-xl md:text-2xl font-bold transition-colors ${
                          openItem === `mission-${mission.week}`
                            ? 'text-blue-300'
                            : 'text-white group-hover:text-blue-300'
                        }`}>
                          Semana {mission.week}: {mission.title}
                        </h3>
                      </div>
                      <p className="text-sm md:text-base text-gray-400">
                        {mission.shortDescription}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pt-4 border-t border-gray-700"
                  >
                    {/* Description */}
                    <div>
                      <p className="text-gray-300 text-base leading-relaxed mb-4">
                        {mission.description}
                      </p>
                      {mission.example && (
                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <p className="text-sm text-blue-200 italic flex items-start gap-2">
                            <Lightbulb size={20} weight="fill" className="text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span><strong>Exemplo:</strong> {mission.example}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Learnings */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <CheckCircle size={24} weight="fill" className="text-green-400" />
                        O que você vai aprender:
                      </h4>
                      <ul className="space-y-2">
                        {mission.learnings.map((learning, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-start gap-3 text-gray-200"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <span className="text-green-400 text-xl flex-shrink-0">•</span>
                            <span>{learning}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Final Reward (Week 4) */}
                    {mission.finalReward && (
                      <div className="bg-gradient-to-r from-yellow-900/30 to-green-900/30 border-2 border-yellow-500/50 p-4 rounded-lg">
                        <p className="text-yellow-200 font-semibold flex items-center gap-2">
                          <Trophy size={28} weight="fill" className="text-yellow-400 flex-shrink-0" />
                          {mission.finalReward}
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-green-900/30 border-2 border-green-500/50 px-6 py-4 rounded-full">
            <GraduationCap size={40} weight="fill" className="text-green-400 flex-shrink-0" />
            <p className="text-lg font-bold text-green-300">
              Ao final das 4 semanas, você será um Game Developer certificado!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionTimeline;
