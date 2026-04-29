import React, { useState } from 'react';
import { Star, CaretLeft, CaretRight, MapPin, Calendar, ArrowRight, Quotes } from '@phosphor-icons/react';
import { motion, AnimatePresence } from '../../../utils/motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { ScrollReveal, CardGridReveal } from '../../../components/shared/ScrollReveal';

const testimonials = [
  {
    id: 1,
    name: 'Maria Eduarda Costa',
    role: 'Marketing Digital',
    rating: 5,
    text: 'Aprender sobre Marketing Pessoal mudou minha postura profissional. Hoje me sinto muito mais confiante para divulgar meu trabalho e attracting new clients.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 2,
    name: 'Isabela Freitas',
    role: 'Criadora de Conteúdo',
    rating: 5,
    text: 'Finalmente aprendi a usar Inteligência Artificial para gerar conteúdo e criar meus posts nas redes sociais. Recomendo demais! O módulo de ChatGPT foi revelador.',
    location: 'Florianópolis - SC',
    date: 'nov. de 2024'
  },
  {
    id: 3,
    name: 'Natália Campos',
    role: 'Entusiasta de Marketing',
    rating: 5,
    text: 'Adorei como o curso conectou marketing digital com inteligência artificial. Inovador e surpreendente! Já consigo ver resultados nas minhas redes.',
    location: 'Palhoça - SC',
    date: 'jan. de 2025'
  },
  {
    id: 4,
    name: 'Fabiola Moraes',
    role: 'Profissional de Marketing',
    rating: 5,
    text: 'Depois do curso, consegui o emprego que tanto sonhei na área de marketing digital. Obrigada Escola Habilidade por me ajudar nesse caminho!',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 5,
    name: 'Julia Ramos',
    role: 'Gestora de Anúncios',
    rating: 5,
    text: 'Antes desse curso, eu tinha muito medo de mexer com os anúncios das redes sociais. As aulas sobre Facebook Business foram um divisor de águas.',
    location: 'Biguaçu - SC',
    date: 'nov. de 2024'
  },
  {
    id: 6,
    name: 'Carlos Eduardo Santos',
    role: 'Empreendedor Digital',
    rating: 5,
    text: 'Monteí minha loja virtual depois de aprender Google Ads e Meta Business. O curso me deu todas as ferramentas que eu precisava. Super recomendo!',
    location: 'São José - SC',
    date: 'jan. de 2025'
  }
];

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const avatarColors = [
  'bg-[#141414] border border-[#262626]',
  'bg-[#141414] border border-[#262626]',
  'bg-[#141414] border border-[#262626]',
  'bg-[#141414] border border-[#262626]',
  'bg-[#141414] border border-[#262626]',
  'bg-[#141414] border border-[#262626]'
];

export const MarketingDigitalTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((previous) => (previous + 1) % testimonials.length);
  };

  const previousTestimonial = () => {
    setCurrentIndex((previous) => (previous - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-[#d4a017]' : 'text-[#666666]'}`}
        weight={index < rating ? "fill" : "regular"}
      />
    ));
  };

  return (
    <section id="depoimentos" className="px-6 py-20 lg:py-24 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header - Bugatti style */}
        <div className="text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              TRANSFORMAÇÕES{' '}
              <span className="text-[#d400ff]">REAIS</span>
            </h2>
            <p className="text-lg text-[#cccccc] max-w-3xl mx-auto font-serif">
              Histórias de profissionais que conquistaram resultados com marketing digital
            </p>
          </ScrollReveal>
        </div>

        {/* Testimonial Carousel */}
        <ScrollReveal animation="zoom-in" delay={0.2}>
          <div className="relative max-w-4xl mx-auto mb-12">
            <div className="relative min-h-[350px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  {/* Bugatti-style card */}
                  <div className="border border-[#262626] bg-[#141414] p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="ring-2 ring-[#d400ff]/30">
                          <Avatar className="w-24 h-24 md:w-28 md:h-28">
                            <AvatarFallback
                              className={`${avatarColors[currentIndex % avatarColors.length]} text-white font-mono text-lg md:text-xl tracking-wider`}
                            >
                              {getInitials(testimonials[currentIndex].name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Content - Serif for body text */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex justify-center md:justify-start gap-1 mb-4">
                          {renderStars(testimonials[currentIndex].rating)}
                        </div>

                        <blockquote className="text-lg md:text-xl text-[#e6e6e6] mb-6 leading-relaxed font-serif italic">
                          "{testimonials[currentIndex].text}"
                        </blockquote>

                        <div>
                          <div className="text-xl text-white tracking-[1.5px] uppercase font-normal mb-1">
                            {testimonials[currentIndex].name}
                          </div>
                          <div className="text-[#999999] text-sm font-mono tracking-wider uppercase mb-2">
                            {testimonials[currentIndex].role}
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-[#999999] font-mono tracking-wider">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{testimonials[currentIndex].location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{testimonials[currentIndex].date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Arrows - Bugatti style circular */}
            <button
              onClick={previousTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 border border-[#3a3a3a] flex items-center justify-center text-white hover:border-[#d400ff] transition-colors rounded-full"
            >
              <CaretLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 border border-[#3a3a3a] flex items-center justify-center text-white hover:border-[#d400ff] transition-colors rounded-full"
            >
              <CaretRight className="w-6 h-6" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#d400ff]' : 'bg-[#666666] hover:bg-[#999999]'
                }`}
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Stats - Bugatti style */}
        <CardGridReveal
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto"
          staggerDelay={0.15}
        >
          <div className="text-center border border-[#262626] p-6 bg-[#0d0d0d]">
            <div className="text-3xl font-normal text-white tracking-[2px] mb-2">5/5</div>
            <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Avaliação média</div>
            <div className="flex justify-center gap-1 mt-2">
              {renderStars(5)}
            </div>
          </div>

          <div className="text-center border border-[#262626] p-6 bg-[#0d0d0d]">
            <div className="text-3xl font-normal text-white tracking-[2px] mb-2">500+</div>
            <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Alunos formados</div>
          </div>

          <div className="text-center border border-[#262626] p-6 bg-[#0d0d0d]">
            <div className="text-3xl font-normal text-white tracking-[2px] mb-2">92%</div>
            <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Taxa de satisfação</div>
          </div>
        </CardGridReveal>

        {/* CTA */}
        <ScrollReveal animation="zoom-in" delay={0.4}>
          <div className="text-center mt-16">
            <div className="border border-[#262626] bg-[#0d0d0d] p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-normal text-white tracking-[2px] uppercase mb-4">
                Quer ser o próximo?
              </h3>
              <p className="text-[#cccccc] font-serif mb-6">
                Nossa equipe conhece cada detalhe do curso e pode ajudar você a dar o próximo passo
              </p>
              <button
                onClick={() => handleCTAClick('testimonials')}
                className="inline-flex items-center px-10 py-4 border border-[#d400ff] text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-[#d400ff] transition-all duration-300 cursor-pointer"
              >
                Falar com Especialista
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
