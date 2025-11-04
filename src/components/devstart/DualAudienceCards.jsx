import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { audienceCards } from '@/data/devstart';
import {
  Question,
  GameController,
  Books,
  Lightning,
  Sparkle,
  PaintBrush,
  Trophy,
  Brain,
  CheckCircle
} from '@phosphor-icons/react';

const DualAudienceCards = () => {
  const { kids, parents } = audienceCards;

  // Map icon names to actual Phosphor icon components
  const getIcon = (iconName, size = 24) => {
    const icons = {
      GameController: <GameController size={size} weight="fill" className="text-blue-400" />,
      Books: <Books size={size} weight="fill" className="text-red-400" />,
      Sparkle: <Sparkle size={size} weight="fill" className="text-yellow-400" />,
      PaintBrush: <PaintBrush size={size} weight="fill" className="text-purple-400" />,
      Trophy: <Trophy size={size} weight="fill" className="text-yellow-400" />,
      Brain: <Brain size={size} weight="fill" className="text-pink-400" />,
      CheckCircle: <CheckCircle size={size} weight="fill" className="text-green-400" />,
    };
    return icons[iconName] || null;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  const AudienceCard = ({ audience, index }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card
        className={`h-full border-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          audience === kids
            ? 'border-blue-400/50 bg-gradient-to-br from-blue-950 to-blue-900'
            : 'border-red-400/50 bg-gradient-to-br from-red-950 to-red-900'
        }`}
      >
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon(audience.iconName, 48)}
            <CardTitle className={`text-2xl md:text-3xl font-black ${
              audience === kids ? 'text-blue-300' : 'text-red-300'
            }`}>
              {audience.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {audience.benefits.map((benefit, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-3 text-gray-100"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <span className="flex-shrink-0">{getIcon(benefit.iconName, 24)}</span>
                <span className="text-lg font-medium leading-relaxed">{benefit.text}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className={`mt-6 p-4 rounded-lg border-2 ${
              audience === kids
                ? 'border-blue-400/30 bg-blue-900/30'
                : 'border-red-400/30 bg-red-900/30'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm md:text-base text-gray-200 italic font-semibold text-center">
              {audience.cta}
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            Por que criar jogos?
            <Question size={48} weight="bold" className="text-yellow-400" />
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            O DevStart é especial porque ensina de forma divertida e traz benefícios reais!
          </p>
        </motion.div>

        {/* Desktop: Side by Side Cards */}
        <div className="hidden md:grid md:grid-cols-2 gap-8">
          <AudienceCard audience={kids} index={0} />
          <AudienceCard audience={parents} index={1} />
        </div>

        {/* Mobile: Tabs */}
        <div className="md:hidden">
          <Tabs defaultValue="kids" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 border border-gray-700">
              <TabsTrigger
                value="kids"
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 font-bold flex items-center gap-2"
              >
                <GameController size={20} weight="bold" />
                Para Você
              </TabsTrigger>
              <TabsTrigger
                value="parents"
                className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 font-bold flex items-center gap-2"
              >
                <Books size={20} weight="bold" />
                Para os Pais
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kids" className="mt-0">
              <AudienceCard audience={kids} index={0} />
            </TabsContent>

            <TabsContent value="parents" className="mt-0">
              <AudienceCard audience={parents} index={1} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-xl">
            <p className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <Lightning size={32} weight="fill" className="text-yellow-300" />
              Uma experiência que une diversão e aprendizado!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DualAudienceCards;
