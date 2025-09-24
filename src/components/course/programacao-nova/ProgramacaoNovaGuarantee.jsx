import React from 'react';
import { Shield, CheckCircle } from '@phosphor-icons/react';

export const ProgramacaoNovaGuarantee = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="w-10 h-10 text-green-400" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Garantia</span> de 7 Dias
          </h2>

          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Experimente nosso curso por 7 dias. Se não ficar satisfeito, devolvemos 100% do seu investimento.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Sem burocracia</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Reembolso total</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <span className="text-zinc-300">Satisfação garantida</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};