import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { finalCTA } from '@/data/devstart';
import { Warning, Siren, Sparkle, GameController, Trophy, Rocket, User } from '@phosphor-icons/react';

const CTAFinal = ({ scrollToNextSection }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-red-950 via-orange-950 to-red-900 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Animated Alert Circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-red-500/20 blur-xl"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            left: `${20 + i * 15}%`,
            top: `${10 + i * 10}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Alert Badge */}
          <motion.div
            className="mb-6 inline-block"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Badge className="bg-yellow-500 text-black text-sm md:text-lg px-4 md:px-6 py-2 md:py-3 font-black shadow-2xl border-2 md:border-4 border-yellow-300 flex items-center gap-1.5 md:gap-2">
              <Warning size={20} weight="fill" className="md:w-6 md:h-6" />
              {finalCTA.urgency}
            </Badge>
          </motion.div>

          {/* Main Alert */}
          <Alert className="border-4 border-yellow-500/50 bg-black/40 backdrop-blur-lg shadow-2xl">
            <AlertTitle className="text-3xl md:text-5xl font-black text-white mb-4 text-center flex items-center justify-center gap-3">
              <Siren size={56} weight="fill" className="text-red-500" />
              {finalCTA.title}
            </AlertTitle>
            <AlertDescription className="text-lg md:text-2xl text-gray-200 text-center font-semibold mb-6">
              {finalCTA.description}
            </AlertDescription>

            {/* Countdown-style Urgency Indicators */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <motion.div
                className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-red-300">30</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">Vagas Totais</div>
              </motion.div>

              <motion.div
                className="bg-yellow-900/50 border-2 border-yellow-500 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-yellow-300">4</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">Sábados Apenas</div>
              </motion.div>

              <motion.div
                className="bg-green-900/50 border-2 border-green-500 rounded-lg p-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl md:text-4xl font-black text-green-300">100%</div>
                <div className="text-xs md:text-sm text-gray-300 font-semibold">Gratuito</div>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                onClick={() => scrollToNextSection('cta-final')}
                className="text-base md:text-xl lg:text-2xl px-6 md:px-12 lg:px-16 py-4 md:py-6 lg:py-10 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-black rounded-full shadow-2xl border-2 md:border-4 border-yellow-300 transform transition-all duration-300"
              >
                {finalCTA.buttonText}
              </Button>
            </motion.div>

            {/* Bottom Warning */}
            <motion.p
              className="text-center mt-6 text-sm md:text-base text-yellow-200 font-bold"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⏰ As inscrições podem fechar a qualquer momento!
            </motion.p>
          </Alert>

          {/* Benefits Reminder */}
          <motion.div
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {[
              { icon: <Sparkle size={40} weight="fill" className="text-yellow-300" />, text: 'Totalmente Gratuito' },
              { icon: <GameController size={40} weight="fill" className="text-blue-400" />, text: 'Crie Seu Jogo' },
              { icon: <Trophy size={40} weight="fill" className="text-yellow-400" />, text: 'Certificado Incluso' },
              { icon: <Rocket size={40} weight="fill" className="text-red-400" />, text: 'Publique Online' },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
                whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                {benefit.icon}
                <span className="text-sm font-semibold text-center">{benefit.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-8 flex items-center justify-center gap-2 text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center"
                >
                  <User size={24} weight="fill" className="text-white" />
                </div>
              ))}
            </div>
            <span className="text-sm font-semibold">
              +100 alunos já aprenderam com a Escola Habilidade!
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTAFinal;
