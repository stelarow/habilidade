import React from 'react';
import { CreditCard, Calendar, CheckCircle } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

export const ProgramacaoNovaInvestment = () => {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Investimento</span> no seu Futuro
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Transforme sua carreira com um investimento que vale a pena
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Plano Parcelado */}
          <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Parcelado</h3>
              <div className="text-4xl font-bold text-purple-400 mb-1">R$ 299,90</div>
              <div className="text-zinc-400">por mês (12x)</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">170 horas de curso</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Material incluso</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Certificado nacional</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Suporte vitalício</span>
              </li>
            </ul>

            <button
              onClick={() => handleCTAClick('investment-parcelado')}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 cursor-pointer"
            >
              Quero me Inscrever
            </button>
          </div>

          {/* Plano À Vista */}
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/30 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                MAIS POPULAR
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">À Vista</h3>
              <div className="text-4xl font-bold text-green-400 mb-1">R$ 3.382,87</div>
              <div className="text-zinc-400">
                <span className="line-through">R$ 3.598,80</span> (6% desconto)
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">170 horas de curso</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Material incluso</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Certificado nacional</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">Suporte vitalício</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300 font-bold">Economia de R$ 215,93</span>
              </li>
            </ul>

            <button
              onClick={() => handleCTAClick('investment-avista')}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 cursor-pointer"
            >
              Quero Economizar 6%
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};