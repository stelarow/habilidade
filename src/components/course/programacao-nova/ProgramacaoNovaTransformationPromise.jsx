import React from 'react';
import { Code, Laptop, Rocket } from '@phosphor-icons/react';

export const ProgramacaoNovaTransformationPromise = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sua <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Transformação</span> Começa Aqui
          </h2>
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Do zero ao programador: sua jornada completa na programação
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Aprenda a Lógica</h3>
            <p className="text-zinc-300">
              Fundamentos sólidos de programação e resolução de problemas
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Laptop className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Crie Projetos</h3>
            <p className="text-zinc-300">
              Desenvolva aplicações reais para seu portfólio profissional
            </p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Entre no Mercado</h3>
            <p className="text-zinc-300">
              Preparação completa para oportunidades de trabalho
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};