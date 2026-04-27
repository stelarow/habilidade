import React from 'react';
import { MapPin, Lightning, Users, ChartLine } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Badge } from '../../../components/ui/badge';

export const MarketingDigitalHeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Pure black background per Bugatti design */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Full-bleed hero image */}
      <div className="absolute inset-0">
        <img
          src="/assets/marketing-digital/hero/marketing-hero.jpeg"
          alt="Marketing Digital Course"
          title="Curso de Marketing Digital"
          className="w-full h-full object-cover object-center"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        {/* Overlays for text legibility - Bugatti style */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
      </div>

      {/* Content - Uppercase headlines with wide tracking per Bugatti */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 sm:pt-16 md:pt-0 text-center">
        {/* Main Headline - Bugatti Display style */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-8 leading-tight uppercase">
          CURSO DE{' '}
          <span className="text-white tracking-[4px]">
            MARKETING DIGITAL
          </span>
        </h1>

        {/* Subtitle - Body text uses serif */}
        <p className="text-lg md:text-xl text-[#cccccc] mb-6 max-w-4xl mx-auto leading-relaxed font-serif">
          Atraia clientes, crie estratégias online,{' '}
          <span className="text-white">cresça nas redes sociais</span>{' '}
          e gere resultados reais para negócios ou projetos pessoais.
        </p>

        {/* Compact benefits line */}
        <div className="flex items-center justify-center gap-4 text-sm text-[#999999] mb-8 tracking-[2px] uppercase">
          <MapPin className="hidden sm:block w-5 h-5 text-[#c3d9f3]" />
          <span>
            <strong className="text-white">82h de conteúdo</strong> • Certificado nacional • 9 módulos
          </span>
        </div>

        {/* Price Badge - Bugatti style pill button */}
        <div className="flex justify-center mb-8">
          <Badge
            variant="outline"
            className="border border-white/50 text-white px-6 py-2 text-base font-mono tracking-[2.5px] uppercase hover:border-white/70 transition-colors"
          >
            A partir de R$ 299,90/mês
          </Badge>
        </div>

        {/* CTA - Bugatti pill button with transparent background */}
        <div className="mb-12">
          <button
            onClick={() => handleCTAClick('hero')}
            className="inline-flex items-center px-10 py-4 border border-white text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
          >
            <span>Quero Conhecer o Curso</span>
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-[#262626]">
          <p className="text-xs text-[#999999] mb-6 tracking-[2px] uppercase font-mono">
            Aprovado por profissionais:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-90">
            <div className="text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">500+</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Alunos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">50+</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">5★</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">Avaliação</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
