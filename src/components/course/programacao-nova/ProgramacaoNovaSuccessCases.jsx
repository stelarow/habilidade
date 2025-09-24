import React from 'react';
import { Trophy, TrendUp, Briefcase } from '@phosphor-icons/react';

export const ProgramacaoNovaSuccessCases = () => {
  return (
    <section className="py-20 bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Casos de <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Sucesso</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Veja como nossos alunos transformaram suas carreiras com programação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">João Silva</h3>
            <p className="text-zinc-300 mb-4">
              "De vendedor a desenvolvedor Python. Consegui meu primeiro emprego na área em 6 meses!"
            </p>
            <div className="text-sm text-purple-400">
              Desenvolvedor Python Jr.
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8 border border-blue-500/20">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
              <TrendUp className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Maria Santos</h3>
            <p className="text-zinc-300 mb-4">
              "Criei meu próprio site de vendas e aumentei minha renda em 200% trabalhando em casa."
            </p>
            <div className="text-sm text-blue-400">
              Freelancer Web
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Carlos Lima</h3>
            <p className="text-zinc-300 mb-4">
              "Consegui uma promoção na empresa aplicando automações que aprendi no curso."
            </p>
            <div className="text-sm text-green-400">
              Analista de Sistemas
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};