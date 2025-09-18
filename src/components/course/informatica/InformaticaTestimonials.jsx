import React, { useState } from 'react';
import { Star, CaretLeft, CaretRight, Quotes, MapPin, Calendar, ArrowRight, Users } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { handleCTAClick } from '../../../utils/ctaUtils';

// Depoimentos reais dos dados do coursesData.js
const testimonials = [
  {
    id: 1,
    name: 'Letícia Mendes',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 2,
    name: 'Mateus Oliveira',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 3,
    name: 'Gabriela Costa Silva',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.',
    location: 'São José - SC',
    date: 'jan. de 2025'
  },
  {
    id: 4,
    name: 'Lucas Felipe Ribeiro',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  },
  {
    id: 5,
    name: 'Carolina Almeida',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.',
    location: 'São José - SC',
    date: 'nov. de 2024'
  },
  {
    id: 6,
    name: 'Pedro Henrique Soares',
    role: 'Informática Fundamental',
    rating: 5,
    text: 'Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.',
    location: 'São José - SC',
    date: 'dez. de 2024'
  }
];

// Função para extrair iniciais do nome
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Cores de fundo para os avatares
const avatarColors = [
  'bg-gradient-to-br from-blue-500 to-blue-600',
  'bg-gradient-to-br from-green-500 to-green-600',
  'bg-gradient-to-br from-purple-500 to-purple-600',
  'bg-gradient-to-br from-pink-500 to-pink-600',
  'bg-gradient-to-br from-indigo-500 to-indigo-600',
  'bg-gradient-to-br from-red-500 to-red-600'
];

export const InformaticaTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}
        weight={i < rating ? "fill" : "regular"}
      />
    ));
  };

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            O que nossos alunos falam sobre{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              a transformação
            </span>
          </h2>
          <p className="text-zinc-300 text-lg max-w-3xl mx-auto">
            Histórias reais de pessoas que mudaram suas vidas através da tecnologia
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="relative min-h-[400px] md:min-h-[300px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <div className="bg-gradient-to-br from-zinc-800/80 to-zinc-700/80 backdrop-blur-sm border border-zinc-600/50 rounded-2xl p-8 md:p-12 shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="ring-4 ring-yellow-500/30 shadow-2xl rounded-full">
                        <Avatar className="w-24 h-24 md:w-32 md:h-32">
                          <AvatarFallback
                            className={`${avatarColors[currentIndex % avatarColors.length]} text-white font-bold text-lg md:text-2xl`}
                          >
                            {getInitials(testimonials[currentIndex].name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex justify-center md:justify-start gap-1 mb-4">
                        {renderStars(testimonials[currentIndex].rating)}
                      </div>
                      
                      <blockquote className="text-lg md:text-xl text-zinc-200 mb-6 leading-relaxed">
                        "{testimonials[currentIndex].text}"
                      </blockquote>

                      <div>
                        <div className="font-bold text-xl text-white mb-1">
                          {testimonials[currentIndex].name}
                        </div>
                        <div className="text-zinc-400 mb-2">
                          {testimonials[currentIndex].role}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-zinc-400">
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

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <CaretLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <CaretRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-400' : 'bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">5/5</div>
            <div className="text-zinc-400">Avaliação média</div>
            <div className="flex justify-center gap-1 mt-2">
              {renderStars(5)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <div className="text-zinc-400">Alunos aprovados</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">92%</div>
            <div className="text-zinc-400">Taxa de satisfação</div>
          </div>
        </div>

        {/* Seção Visual - Ambiente da Escola */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="text-white">Ambiente</span>{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Acolhedor
              </span>
            </h3>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Na Escola Habilidade, aprender é divertido! Nosso ambiente descontraído
              e acolhedor faz toda a diferença no seu aprendizado.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-400/20 rounded-2xl blur-xl" />
            <div className="relative max-h-[400px] md:max-h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              <AspectRatio ratio={21/9} className="bg-zinc-800/50">
                <img
                  src="/assets/informatica-nova/depoimentos/alunas-felizes-escola.jpg"
                  alt="Alunas felizes na Escola Habilidade"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
              </AspectRatio>
            </div>
          </div>
        </div>

        {/* CTA após depoimentos */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Quer conversar com um especialista?
            </h3>
            <p className="text-zinc-300 text-lg mb-6">
              Nossa equipe conhece cada detalhe do curso e pode ajudar você a dar o próximo passo
            </p>
            <button
              onClick={() => handleCTAClick('testimonials')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-yellow-500 to-orange-500 shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Users className="w-5 h-5" />
              Falar com Especialista
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};