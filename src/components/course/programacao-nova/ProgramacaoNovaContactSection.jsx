import React from 'react';
import { WhatsappLogo, Phone, EnvelopeSimple } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

const ProgramacaoNovaContactSection = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Entre em <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Contato</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Tire suas dúvidas ou garante sua vaga agora mesmo
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <button
            onClick={() => handleCTAClick('contact-whatsapp')}
            className="w-full flex items-center justify-center gap-4 bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <WhatsappLogo className="w-8 h-8" />
            <div className="text-left">
              <div className="text-xl">WhatsApp</div>
              <div className="text-sm opacity-90">(48) 98855-9491</div>
            </div>
          </button>

          <button
            onClick={() => handleCTAClick('contact-phone')}
            className="w-full flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <Phone className="w-8 h-8" />
            <div className="text-left">
              <div className="text-xl">Telefone</div>
              <div className="text-sm opacity-90">(48) 98855-9491</div>
            </div>
          </button>

          <button
            onClick={() => handleCTAClick('contact-email')}
            className="w-full flex items-center justify-center gap-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-6 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <EnvelopeSimple className="w-8 h-8" />
            <div className="text-left">
              <div className="text-xl">Email</div>
              <div className="text-sm opacity-90">contato@escolahabilidade.com.br</div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProgramacaoNovaContactSection;