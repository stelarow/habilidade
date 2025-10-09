import React from 'react';
import { Clock, Shield, WhatsappLogo, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import InformaticaInlineContactForm from './InformaticaInlineContactForm';
import { handleCTAClick } from '../../../utils/ctaUtils';

const InformaticaContactSection = () => {
  return (
    <section id="contato" className="py-16 px-4 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-blue-500/10 via-zinc-950 to-cyan-400/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">
              Fale Conosco em
            </span>
            <br />
            <span className="text-white">3 Passos Rápidos</span>
          </h2>

          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Menos de 1 minuto para receber todas as informações sobre o curso de Informática
          </p>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              <Clock size={32} className="text-blue-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Resposta Rápida</h3>
              <p className="text-zinc-400 text-sm text-center">Respondemos em até 30 minutos no horário comercial</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              <Shield size={32} className="text-green-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">100% Seguro</h3>
              <p className="text-zinc-400 text-sm text-center">Seus dados são protegidos e nunca compartilhados</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-zinc-800/30 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              <WhatsappLogo size={32} className="text-emerald-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">Via WhatsApp</h3>
              <p className="text-zinc-400 text-sm text-center">Atendimento personalizado direto no seu celular</p>
            </div>
          </div>
        </div>

        {/* Formulário de Contato Integrado */}
        <div className="mb-12">
          <InformaticaInlineContactForm />
        </div>

        {/* CTA WhatsApp direto */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Prefere falar diretamente conosco?
            </h3>
            <p className="text-zinc-300 mb-6">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas
            </p>
            <button
              onClick={() => handleCTAClick('contact')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-400 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <WhatsappLogo className="w-5 h-5" />
              Falar com Consultor
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Indicadores de Confiança */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Sem compromisso</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Orientação gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Atendimento especializado</span>
          </div>
        </div>

        {/* Depoimento Rápido */}
        <div className="max-w-2xl mx-auto">
            <div className="bg-zinc-800/40 p-6 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-3">
                  <h4 className="text-white font-medium">Márcia Silva</h4>
                  <p className="text-zinc-400 text-sm">Concluiu o curso há 2 meses</p>
                </div>
              </div>
              <p className="text-zinc-300 italic">
                "O atendimento foi excelente desde o primeiro contato. Tiraram todas as minhas dúvidas e me ajudaram a escolher o melhor horário. Hoje trabalho com Excel e me sinto muito mais confiante!"
              </p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default InformaticaContactSection;