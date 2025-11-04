import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { faq, location } from '@/data/devstart';
import {
  Question,
  Cake,
  Desktop,
  Monitor,
  Users,
  Calendar,
  Trophy,
  CurrencyCircleDollar,
  MapPin,
  Rocket,
  NotePencil,
  Phone,
  ChatCircle,
  InstagramLogo,
  FacebookLogo
} from '@phosphor-icons/react';

const DevStartFAQ = () => {
  // Map FAQ icon by index
  const getFaqIcon = (index) => {
    const icons = [
      <Cake size={28} weight="bold" className="text-pink-400" />,           // 0: idade
      <Desktop size={28} weight="bold" className="text-blue-400" />,        // 1: programar
      <Monitor size={28} weight="bold" className="text-green-400" />,       // 2: notebook
      <Users size={28} weight="bold" className="text-purple-400" />,        // 3: pais
      <Calendar size={28} weight="bold" className="text-yellow-400" />,     // 4: faltar
      <Trophy size={28} weight="bold" className="text-yellow-400" />,       // 5: certificado
      <CurrencyCircleDollar size={28} weight="bold" className="text-green-400" />, // 6: gratuito
      <MapPin size={28} weight="bold" className="text-red-400" />,          // 7: onde fica
      <Rocket size={28} weight="bold" className="text-blue-400" />,         // 8: continuar
      <NotePencil size={28} weight="bold" className="text-orange-400" />,   // 9: inscrição
    ];
    return icons[index] || <Question size={28} weight="bold" />;
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Question size={48} weight="bold" className="text-purple-400" />
            Perguntas Frequentes
          </h2>
          <p className="text-lg md:text-xl text-gray-300">
            Tire suas dúvidas sobre o DevStart!
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faq.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={`faq-${item.id}`}
                className="border-2 border-gray-700 rounded-xl overflow-hidden bg-gray-900/50 hover:border-gray-600 transition-colors"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline text-left">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0">
                      {getFaqIcon(index)}
                    </span>
                    <span className="text-lg md:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="pl-11 pt-2 border-t border-gray-700"
                  >
                    <p className="text-gray-300 text-base leading-relaxed">
                      {item.answer}
                    </p>

                    {/* Special content for location question */}
                    {item.id === 8 && (
                      <div className="mt-4 space-y-3">
                        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <p className="text-blue-200 text-sm flex items-start gap-2">
                            <MapPin size={20} weight="bold" className="flex-shrink-0 mt-0.5" />
                            <span><strong>Endereço completo:</strong><br />{location.fullAddress}</span>
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(location.mapsUrl, '_blank')}
                            className="bg-green-900/30 border-green-600 text-green-300 hover:bg-green-900/50 flex items-center gap-2"
                          >
                            <MapPin size={18} weight="bold" />
                            Ver no Google Maps
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`tel:${location.phone}`, '_blank')}
                            className="bg-blue-900/30 border-blue-600 text-blue-300 hover:bg-blue-900/50 flex items-center gap-2"
                          >
                            <Phone size={18} weight="bold" />
                            Ligar: {location.phone}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Special content for inscription question */}
                    {item.id === 10 && (
                      <div className="mt-4">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(`https://wa.me/${location.phoneRaw}`, '_blank')}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <ChatCircle size={18} weight="fill" />
                          Falar no WhatsApp
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-2 border-blue-500/50 rounded-xl p-6">
            <p className="text-lg text-gray-200 mb-4">
              <strong className="text-blue-300">Ainda tem dúvidas?</strong> Entre em contato com a gente!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="default"
                onClick={() => window.open(`https://wa.me/${location.phoneRaw}?text=${encodeURIComponent('Olá! Tenho dúvidas sobre o DevStart.')}`, '_blank')}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <ChatCircle size={20} weight="fill" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(location.social.instagram.url, '_blank')}
                className="border-pink-500 text-pink-300 hover:bg-pink-900/30 flex items-center gap-2"
              >
                <InstagramLogo size={20} weight="fill" />
                Instagram
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(location.social.facebook.url, '_blank')}
                className="border-blue-500 text-blue-300 hover:bg-blue-900/30 flex items-center gap-2"
              >
                <FacebookLogo size={20} weight="fill" />
                Facebook
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DevStartFAQ;
