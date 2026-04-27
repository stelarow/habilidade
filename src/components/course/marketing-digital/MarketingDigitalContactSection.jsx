import React from 'react';
import { Clock, Shield, WhatsappLogo, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

const MarketingDigitalInlineContactForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleCTAClick('contact-form');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-[#999999] font-mono tracking-wider uppercase">
            Nome
          </label>
          <input
            type="text"
            required
            className="w-full bg-transparent border-b border-[#262626] py-3 text-white placeholder-[#666666] focus:border-white focus:outline-none transition-colors font-serif"
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#999999] font-mono tracking-wider uppercase">
            Email
          </label>
          <input
            type="email"
            required
            className="w-full bg-transparent border-b border-[#262626] py-3 text-white placeholder-[#666666] focus:border-white focus:outline-none transition-colors font-serif"
            placeholder="seu@email.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#999999] font-mono tracking-wider uppercase">
            Telefone
          </label>
          <input
            type="tel"
            required
            className="w-full bg-transparent border-b border-[#262626] py-3 text-white placeholder-[#666666] focus:border-white focus:outline-none transition-colors font-serif"
            placeholder="(48) 9 9999-9999"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[#999999] font-mono tracking-wider uppercase">
            Cidade
          </label>
          <input
            type="text"
            required
            className="w-full bg-transparent border-b border-[#262626] py-3 text-white placeholder-[#666666] focus:border-white focus:outline-none transition-colors font-serif"
            placeholder="Sua cidade"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-[#999999] font-mono tracking-wider uppercase">
          Mensagem (opcional)
        </label>
        <textarea
          className="w-full bg-transparent border-b border-[#262626] py-3 text-white placeholder-[#666666] focus:border-white focus:outline-none transition-colors font-serif resize-none"
          rows="3"
          placeholder="Deixe uma mensagem..."
        />
      </div>

      <div className="text-center pt-4">
        <button
          type="submit"
          className="inline-flex items-center px-10 py-4 border border-white text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
        >
          Enviar Mensagem
          <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>
    </form>
  );
};

const MarketingDigitalContactSection = () => {
  return (
    <section id="contato" className="px-6 py-20 lg:py-24 bg-[#0d0d0d]">
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-normal tracking-[3px] text-white mb-6 uppercase">
            Fale Conosco em{' '}
            <span className="text-[#c3d9f3]">3 Passos</span>
          </h2>

          <p className="text-lg text-[#cccccc] mb-8 max-w-2xl mx-auto font-serif">
            Menos de 1 minuto para receber todas as informações sobre o curso de Marketing Digital
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="border border-[#262626] p-6 text-center bg-[#141414]">
              <Clock size={32} className="text-[#c3d9f3] mx-auto mb-3" />
              <h3 className="text-white font-normal tracking-wider uppercase mb-2">Resposta Rápida</h3>
              <p className="text-[#999999] text-sm font-serif">Respondemos em até 30 minutos</p>
            </div>

            <div className="border border-[#262626] p-6 text-center bg-[#141414]">
              <Shield size={32} className="text-white mx-auto mb-3" />
              <h3 className="text-white font-normal tracking-wider uppercase mb-2">100% Seguro</h3>
              <p className="text-[#999999] text-sm font-serif">Dados protegidos</p>
            </div>

            <div className="border border-[#262626] p-6 text-center bg-[#141414]">
              <WhatsappLogo size={32} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-normal tracking-wider uppercase mb-2">Via WhatsApp</h3>
              <p className="text-[#999999] text-sm font-serif">Atendimento personalizado</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mb-12">
          <MarketingDigitalInlineContactForm />
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center mb-12">
          <div className="border border-[#262626] p-6 bg-[#141414] max-w-2xl mx-auto">
            <h3 className="text-lg font-normal text-white tracking-wider uppercase mb-4">
              Prefere falar diretamente?
            </h3>
            <p className="text-[#cccccc] font-serif mb-6">
              Nossa equipe está pronta para esclarecer todas as suas dúvidas
            </p>
            <button
              onClick={() => handleCTAClick('contact-whatsapp')}
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-green-600 transition-all duration-300 cursor-pointer"
            >
              <WhatsappLogo className="w-5 h-5 mr-2" />
              Falar com Consultor
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-[#999999] font-mono tracking-wider">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Sem compromisso</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Orientação gratuita</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Atendimento especializado</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingDigitalContactSection;