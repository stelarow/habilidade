import React from 'react';
import { Shield, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { ScrollReveal } from '../../../components/shared/ScrollReveal';

export const MarketingDigitalGuarantee = () => {
  return (
    <section id="garantia" className="px-6 py-20 lg:py-24 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              Garantia{' '}
              <span className="text-white">Absoluta</span>
            </h2>
            <p className="text-lg text-[#cccccc] max-w-2xl mx-auto font-serif">
              Sua satisfação é nossa prioridade
            </p>
          </div>
        </ScrollReveal>

        {/* Guarantee Card */}
        <ScrollReveal animation="zoom-in" delay={0.2}>
          <div className="border border-[#262626] bg-[#141414] p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Shield Icon */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 border-2 border-[#d400ff] flex items-center justify-center rounded-full">
                  <Shield className="w-16 h-16 text-[#d400ff]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-normal text-white tracking-[2px] uppercase mb-4">
                  7 Dias de Garantia
                </h3>
                <p className="text-[#cccccc] font-serif mb-6 leading-relaxed">
                  Se em até 7 dias você não estiver completamente satisfeito com o curso,
                  devolvemos 100% do valor pago. Sem perguntas, sem burocracia.
                  Você não corre nenhum risco.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-[#e6e6e6] font-serif">Reembolso integral em até 5 dias úteis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-[#e6e6e6] font-serif">Suporte disponível durante o período</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-[#e6e6e6] font-serif">Material apostilado incluso</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8">
                  <button
                    onClick={() => handleCTAClick('guarantee')}
                    className="inline-flex items-center px-10 py-4 border border-[#d400ff] text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-[#d400ff] transition-all duration-300 cursor-pointer"
                  >
                    Garantir Minha Vaga
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Additional Trust Badges */}
        <ScrollReveal animation="fade-up" delay={0.4}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="border border-[#262626] p-6 text-center bg-[#0d0d0d]">
              <div className="text-2xl font-normal text-white tracking-[2px] mb-2">100%</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">
                Presencial e Online
              </div>
            </div>
            <div className="border border-[#262626] p-6 text-center bg-[#0d0d0d]">
              <div className="text-2xl font-normal text-white tracking-[2px] mb-2">10+</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">
                Anos de Experiência
              </div>
            </div>
            <div className="border border-[#262626] p-6 text-center bg-[#0d0d0d]">
              <div className="text-2xl font-normal text-white tracking-[2px] mb-2">500+</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono">
                Alunos Formados
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
