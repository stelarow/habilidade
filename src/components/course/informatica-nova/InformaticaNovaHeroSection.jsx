import React from 'react';
import { CheckCircle, Star, Users, Clock, ArrowRight, Monitor, BookOpen, Lightning } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

export const InformaticaNovaHeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/assets/informatica-nova/hero/hero-bg-new.jpg"
          alt="Curso de Informática Background"
          className="w-full h-full object-cover filter blur-[0.5px]"
        />
        {/* Overlays para legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_black/40_70%)]" />
      </div>

      {/* Elementos animados de fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Conteúdo do Hero */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto text-center pt-12 sm:pt-16 md:pt-8">
          

          {/* Título principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">CURSO</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">
              INFORMÁTICA
            </span>
            <br />
            <span className="text-white">COMPLETO</span>
            <br />
            <span className="text-cyan-300 text-2xl md:text-3xl lg:text-4xl font-semibold">
              GRANDE FLORIANÓPOLIS
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg md:text-2xl text-zinc-300 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed">
            <strong className="text-cyan-400">Excel avançado</strong>, <strong className="text-blue-400">Word profissional</strong>, PowerPoint e <strong className="text-purple-400">IA aplicada</strong>. 
            <strong className="text-green-400">Curso presencial de informática</strong> em São José, Grande Florianópolis.
          </p>

          {/* Stats importantes */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 mb-8 md:mb-12 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-6">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <Clock className="w-5 h-5 md:w-8 md:h-8 text-blue-400" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-white mb-1">184,5h</div>
              <div className="text-xs md:text-sm text-zinc-400">Carga horária completa</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-6">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <BookOpen className="w-5 h-5 md:w-8 md:h-8 text-cyan-400" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-white mb-1">8 Módulos</div>
              <div className="text-xs md:text-sm text-zinc-400">Do básico ao avançado</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 md:p-6">
              <div className="flex items-center justify-center mb-2 md:mb-3">
                <Users className="w-5 h-5 md:w-8 md:h-8 text-purple-400" />
              </div>
              <div className="text-lg md:text-2xl font-bold text-white mb-1">150+</div>
              <div className="text-xs md:text-sm text-zinc-400">Alunos aprovados</div>
            </div>
          </div>

          {/* Lista de benefícios principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-12 max-w-3xl mx-auto text-left">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Curso completo de Windows 11 e Office</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Excel básico ao avançado profissional</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Design no Canva para redes sociais</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">IA aplicada na prática</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Apostilas e certificado inclusos</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Aulas presenciais em São José</span>
            </div>
          </div>

          {/* CTA principal */}
          <div className="space-y-6">
            <button 
              onClick={() => handleCTAClick('hero')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg md:text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Monitor className="w-6 h-6" />
              DOMINAR INFORMÁTICA AGORA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Preço em destaque */}
            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-emerald-400/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-2">
                <span className="text-green-300 text-sm">💸 Parcelamento em até </span>
                <span className="text-green-300 font-bold">12x de R$ 59,70</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};