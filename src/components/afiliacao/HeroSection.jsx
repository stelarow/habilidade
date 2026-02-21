import { motion } from 'framer-motion';
import { CurrencyDollar } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { hero } from '@/data/afiliacao';

const HeroSection = () => {
  const scrollToForm = () => {
    const el = document.getElementById('formulario');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(to_bottom_right,#030712,#14532d_35%,#4d4400)]">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl flex items-center justify-center gap-3">
            <CurrencyDollar size={48} weight="fill" className="text-yellow-400" />
            {hero.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {hero.subtitle}
          </p>

          <Button
            size="lg"
            onClick={scrollToForm}
            className="text-xl px-10 py-8 bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-black rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-400/50"
          >
            {hero.cta}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
