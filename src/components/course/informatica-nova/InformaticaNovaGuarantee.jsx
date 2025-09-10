import React from 'react';
import { Shield, CheckCircle, Clock, ArrowClockwise, ArrowRight } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

const guaranteeFeatures = [
  {
    icon: Clock,
    title: "7 Dias para Decidir",
    description: "Tempo suficiente para avaliar todo o conteúdo e metodologia"
  },
  {
    icon: ArrowClockwise,
    title: "Processo Simples",
    description: "Devolução rápida e sem complicações burocráticas"
  },
  {
    icon: CheckCircle,
    title: "100% do Valor",
    description: "Reembolso completo, sem taxas ou descontos"
  }
];

export const InformaticaNovaGuarantee = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-green-400/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-cyan-400 bg-clip-text text-transparent">
              RISCO ZERO
            </span>
            <br />
            <span className="text-white">PARA VOCÊ</span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Testamos nossa metodologia com mais de 150 alunos. 
            Temos tanta confiança que oferecemos garantia total.
          </p>
        </div>

        {/* Card principal da garantia */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/20 to-green-400/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            
            {/* Ícone principal */}
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <Shield className="w-12 h-12 text-white" />
            </div>

            {/* Título principal */}
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                GARANTIA DE 7 DIAS
              </span>
            </h3>

            {/* Descrição */}
            <p className="text-xl text-zinc-200 leading-relaxed mb-8 max-w-2xl mx-auto">
              Se por qualquer motivo você não ficar <strong className="text-emerald-400">100% satisfeito</strong> com o curso, 
              devolvemos todo o seu dinheiro. Sem perguntas, sem complicações.
            </p>

            {/* Features da garantia */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {guaranteeFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Selo de confiança */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
              <h4 className="text-lg font-bold text-white mb-4">Por que oferecemos essa garantia?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">92% dos alunos ficam completamente satisfeitos</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">Metodologia testada e aprovada por 150+ profissionais</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">Conteúdo atualizado e aplicado ao mercado real</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-zinc-300 text-sm">Suporte dedicado durante todo o curso</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={() => handleCTAClick('guarantee')}
              className="group relative overflow-hidden rounded-xl px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-400 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Shield className="w-6 h-6" />
              COMEÇAR SEM RISCOS AGORA
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Nota adicional */}
            <p className="text-zinc-400 text-sm mt-6">
              ⚡ Essa é nossa forma de demonstrar total confiança no valor que entregamos
            </p>
          </div>
        </div>

        {/* Depoimento sobre a garantia */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <div className="bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8">
            <p className="text-zinc-300 italic text-lg leading-relaxed mb-4">
              "A garantia de 7 dias me deu toda a segurança para começar. Mas já na primeira semana 
              sabia que tinha feito a escolha certa. O conteúdo é incrível!"
            </p>
            <div className="text-blue-300 font-medium">Carolina Almeida, São José - SC</div>
          </div>
        </div>
      </div>
    </section>
  );
};