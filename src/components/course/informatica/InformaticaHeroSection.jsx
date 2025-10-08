import React from 'react';
import { CheckCircle, Star, Users, Clock, ArrowRight, Monitor, BookOpen, Lightning, MapPin, Calendar, Certificate, Desktop, GraduationCap, Brain } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Badge } from '../../../components/ui/badge';

export const InformaticaHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/assets/informatica-nova/hero/1318912.png"
          alt="Curso de Informática Background"
          title="Background do curso de informática"
          className="w-full h-full object-cover object-center filter blur-[0.5px]"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        {/* Overlays para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/40_70%)]" />
      </div>

      {/* Elementos animados de fundo */}
      <div className="absolute top-1/4 left-2 sm:left-1/4 w-40 h-40 sm:w-64 md:w-80 lg:w-96 sm:h-64 md:h-80 lg:h-96 bg-blue-500/20 rounded-full blur-2xl md:blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-2 sm:right-1/4 w-32 h-32 sm:w-56 md:w-64 lg:w-80 sm:h-56 md:h-64 lg:h-80 bg-cyan-400/20 rounded-full blur-2xl md:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Badge de avaliação - Renderização imediata para LCP */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="text-white/90 text-sm font-medium">
            <span>5/5 avaliação dos alunos</span>
          </span>
        </div>

        {/* Título Principal - Renderização imediata para LCP */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Curso Completo de{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Informática
          </span>
          {' '}do Básico ao Avançado
          <span className="block text-2xl md:text-3xl mt-4 text-cyan-300 font-semibold">
            São José • Florianópolis • Palhoça • Biguaçu
          </span>
        </h1>

        {/* Subtítulo - Renderização imediata para LCP */}
        <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
          <span className="font-semibold text-white">Excel do Básico ao Avançado</span>, Word, Canva e{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
            Inteligência Artificial
          </span>{' '}
          com metodologia 100% prática
        </p>

        {/* Badge de Preço */}
        <div className="flex justify-center mb-6">
          <Badge
            variant="default"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-2 text-base font-semibold border-0 shadow-lg"
          >
            A partir de R$ 299,90/mês
          </Badge>
        </div>

        {/* Badges de Destaque - Mobile First */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
          <Badge
            variant="secondary"
            className="bg-blue-500/10 border-blue-400/30 text-white hover:bg-blue-500/20 px-3 py-1.5"
          >
            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-blue-400" />
            <span className="text-xs sm:text-sm">170h de Conteúdo</span>
          </Badge>

          <Badge
            variant="secondary"
            className="bg-green-500/10 border-green-400/30 text-white hover:bg-green-500/20 px-3 py-1.5"
          >
            <Certificate className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-green-400" />
            <span className="text-xs sm:text-sm">Certificado 170h</span>
          </Badge>

          <Badge
            variant="secondary"
            className="bg-purple-500/10 border-purple-400/30 text-white hover:bg-purple-500/20 px-3 py-1.5"
          >
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 text-purple-400" />
            <span className="text-xs sm:text-sm">Excel + IA</span>
          </Badge>
        </div>

        {/* Localidades Atendidas - Texto explícito para SEO */}
        <p className="text-sm sm:text-base text-zinc-400 text-center mb-8">
          📍 Atendemos presencialmente:{' '}
          <span className="text-cyan-400 font-semibold">São José</span>,{' '}
          <span className="text-cyan-400 font-semibold">Florianópolis</span>,{' '}
          <span className="text-cyan-400 font-semibold">Palhoça</span> e{' '}
          <span className="text-cyan-400 font-semibold">Biguaçu</span>
        </p>

        {/* CTAs - Renderização imediata para LCP */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => handleCTAClick('hero')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group cursor-pointer"
          >
            <span>Quero Conhecer o Curso</span>
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <a
            href="#curriculum"
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            Ver Grade Curricular
          </a>
        </div>

        {/* Elementos de credibilidade */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>Certificado Incluso</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>Aulas 100% Presenciais em São José/SC</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>+1000 Alunos Aprovados</span>
          </div>
        </div>
      </div>
    </section>
  );
};