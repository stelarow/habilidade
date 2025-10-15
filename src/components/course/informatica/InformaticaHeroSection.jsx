import React from 'react';
import { MapPin } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Badge } from '../../../components/ui/badge';

export const InformaticaHeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
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
        {/* Overlays escurecidos para reduzir poluição visual */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/60_70%)]" />
      </div>

      {/* Elementos animados de fundo */}
      <div className="absolute top-1/4 left-2 sm:left-1/4 w-40 h-40 sm:w-64 md:w-80 lg:w-96 sm:h-64 md:h-80 lg:h-96 bg-blue-500/20 rounded-full blur-2xl md:blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-2 sm:right-1/4 w-32 h-32 sm:w-56 md:w-64 lg:w-80 sm:h-56 md:h-64 lg:h-80 bg-cyan-400/20 rounded-full blur-2xl md:blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Título Principal - Renderização imediata para LCP */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          Curso Completo de{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Informática
          </span>
          {' '}do Básico ao Avançado
          <span className="block text-lg md:text-xl mt-4 text-cyan-300 font-semibold">
            São José • Florianópolis • Palhoça • Biguaçu
          </span>
        </h1>

        {/* Subtítulo - Renderização imediata para LCP */}
        <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed">
          <span className="font-semibold text-white">Excel do Básico ao Avançado</span>, Word, Canva e{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
            Inteligência Artificial
          </span>{' '}
          com aulas totalmente práticas
        </p>

        {/* Linha de benefícios compacta */}
        <div className="flex items-center justify-center gap-3 text-sm md:text-base text-zinc-300 mb-8">
          <MapPin className="hidden sm:block w-5 h-5 text-cyan-400" />
          <span>
            <strong className="text-white">170h de conteúdo</strong> • Certificado nacional • <strong className="text-cyan-400">Excel + IA</strong> • <strong className="text-yellow-400">4.9★</strong> avaliação
          </span>
        </div>

        {/* Badge de Preço */}
        <div className="flex justify-center mb-8">
          <Badge
            variant="default"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-2 text-base font-semibold border-0 shadow-lg"
          >
            A partir de R$ 299,90/mês
          </Badge>
        </div>

        {/* CTA Principal */}
        <div className="mb-12">
          <button
            onClick={() => handleCTAClick('hero')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl group cursor-pointer"
          >
            <span>Quero Conhecer o Curso</span>
            <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 pt-8 border-t border-zinc-700/50">
          <p className="text-sm text-zinc-300 mb-4">
            Método comprovado e aprovado por:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
            <div className="text-xs text-center">
              <div className="text-2xl font-bold text-blue-400">1000+</div>
              <div className="text-zinc-300">Alunos</div>
            </div>
            <div className="text-xs text-center">
              <div className="text-2xl font-bold text-cyan-400">50+</div>
              <div className="text-zinc-300">Empresas</div>
            </div>
            <div className="text-xs text-center">
              <div className="text-2xl font-bold text-blue-400">10+</div>
              <div className="text-zinc-300">Anos</div>
            </div>
            <div className="text-xs text-center">
              <div className="text-2xl font-bold text-yellow-400">4.9★</div>
              <div className="text-zinc-300">Avaliação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};