import React from 'react';
import { CheckCircle, Users, Clock, BookOpen } from '@phosphor-icons/react';

const ProgramacaoNovaMethodSection = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Nossa <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Metodologia</span>
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Aprenda programação de forma prática e eficiente com nossa metodologia comprovada
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Teoria + Prática</h3>
            <p className="text-zinc-300">
              Conceitos fundamentais aplicados em projetos reais desde o primeiro dia
            </p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Turmas Reduzidas</h3>
            <p className="text-zinc-300">
              Máximo 12 alunos por turma para atendimento personalizado
            </p>
          </div>

          <div className="bg-zinc-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Flexibilidade</h3>
            <p className="text-zinc-300">
              Horários adaptados à sua rotina, manhã, tarde ou noite
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramacaoNovaMethodSection;