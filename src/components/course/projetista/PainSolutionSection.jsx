import React from 'react';
import { 
  Question, 
  Hand, 
  Books, 
  Briefcase, 
  ArrowsClockwise, 
  Timer, 
  Target,
  CheckCircle
} from '@phosphor-icons/react';

const PainSolutionSection = () => {
  const painPoints = [
    {
      icon: <Books className="w-6 h-6 text-red-400" />,
      text: "A FACULDADE NÃO PREPARA para o mercado real?"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-red-400" />,
      text: "PERDEU OPORTUNIDADES por não dominar as ferramentas?"
    },
    {
      icon: <ArrowsClockwise className="w-6 h-6 text-red-400" />,
      text: "QUER MUDAR DE CARREIRA e entrar na arquitetura?"
    },
    {
      icon: <Timer className="w-6 h-6 text-red-400" />,
      text: "CANSADO DE DEPENDER DE TERCEIROS para seus projetos?"
    },
    {
      icon: <Target className="w-6 h-6 text-red-400" />,
      text: "PRECISA SE QUALIFICAR para conseguir emprego/estágio?"
    }
  ];

  const solutions = [
    "Método prático e presencial",
    "Suporte individualizado", 
    "Turmas pequenas (máx 4 alunos)",
    "Professor experiente com informações de mercado"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-red-950/10 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 flex items-center justify-center gap-3">
              <Question className="w-10 h-10 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                PARA QUEM É ESTE CURSO?
              </span>
            </h2>
            <div className="flex items-center justify-center gap-2 text-xl text-gray-300 mb-8">
              <Hand className="w-6 h-6 text-purple-400" />
              <p>Você se encaixa em algum ponto abaixo?</p>
            </div>
          </div>

          {/* Pain Points */}
          <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl p-8 mb-12 border border-red-500/20">
            <div className="space-y-6">
              {painPoints.map((pain, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-700">
                  {pain.icon}
                  <p className="text-lg text-gray-200 font-medium">{pain.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution */}
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-green-400 mb-4">
                ✅ NOSSA SOLUÇÃO COMPLETA
              </h3>
              <p className="text-xl text-gray-300">
                Tudo que você precisa para se tornar um Projetista 3D profissional
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-900/40 rounded-xl border border-green-500/20">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <p className="text-lg text-white font-medium">{solution}</p>
                </div>
              ))}
            </div>

            {/* Highlight Box */}
            <div className="mt-8 bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-xl p-6 border border-purple-500/30">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-purple-400 mb-2">
                  🎯 DIFERENCIAL EXCLUSIVO
                </h4>
                <p className="text-lg text-white">
                  <strong>Único curso presencial</strong> de SketchUp + Enscape em São José SC com 
                  <span className="text-green-400 font-bold"> certificado nacional</span> e 
                  <span className="text-purple-400 font-bold"> turmas de apenas 4 alunos</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xl py-5 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                <Target className="w-6 h-6" />
                SIM, QUERO SOLUÇÃO PRESENCIAL - GARANTIR VAGA
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                ⚡ Resposta imediata • 🎯 Suporte individual • 🏆 Resultados garantidos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSolutionSection;