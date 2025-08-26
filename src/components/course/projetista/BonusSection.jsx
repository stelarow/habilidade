import React from 'react';
import { 
  Gift, 
  Lightning, 
  Target,
  CheckCircle,
  Clock
} from '@phosphor-icons/react';

const BonusSection = () => {
  const bonuses = [
    {
      title: "Guia de Precificação de Projetos",
      value: "R$ 97",
      description: "Manual completo com tabelas e estratégias para precificar seus projetos 3D",
      icon: "💰"
    },
    {
      title: "Templates Prontos SketchUp/Revit",
      value: "R$ 397", 
      description: "Biblioteca com 50+ templates profissionais para acelerar seus projetos",
      icon: "📐"
    },
    {
      title: "Biblioteca de Materiais Enscape",
      value: "R$ 297",
      description: "500+ materiais premium para renderizações fotorrealísticas",
      icon: "🎨"
    },
    {
      title: "Manual de Ergonomia",
      value: "R$ 297",
      description: "Guia completo com medidas e normas técnicas para projetos residenciais",
      icon: "📏"
    }
  ];

  const totalValue = bonuses.reduce((sum, bonus) => {
    return sum + parseInt(bonus.value.replace('R$ ', ''));
  }, 0);

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-green-950/10 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
              <Gift className="w-10 h-10 text-green-500" />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                BÔNUS EXCLUSIVOS
              </span>
            </h2>
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl px-6 py-4 border border-green-500/20 inline-block">
              <p className="text-2xl font-black text-green-400">
                VALOR TOTAL: R$ {totalValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Bonuses Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {bonuses.map((bonus, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 rounded-2xl p-6 border border-gray-600 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                
                {/* Bonus Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{bonus.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        PRESENTE {index + 1}:
                      </h3>
                      <p className="text-lg text-green-400 font-semibold">
                        {bonus.title}
                      </p>
                    </div>
                  </div>
                  
                  {/* Value Badge */}
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-full px-4 py-2 border border-green-400/30">
                    <span className="text-white font-black text-sm">{bonus.value}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed mb-4">
                  {bonus.description}
                </p>

                {/* Check Mark */}
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Incluso gratuitamente</span>
                </div>
              </div>
            ))}
          </div>

          {/* Urgency Box */}
          <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-2xl p-8 border border-orange-500/30 text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Lightning className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h3 className="text-2xl font-black text-white">
                ⚡ OFERTA LIMITADA
              </h3>
              <Lightning className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
            
            <div className="space-y-4">
              <p className="text-xl text-orange-400 font-bold">
                DISPONÍVEL APENAS PARA OS PRÓXIMOS 10 ALUNOS
              </p>
              
              <div className="flex items-center justify-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-white">
                  Após atingir a cota, os bônus não estarão mais disponíveis
                </span>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 h-full w-3/4 animate-pulse"></div>
                </div>
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>7 vagas preenchidas</span>
                  <span>3 vagas restantes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/20">
            <div className="text-center space-y-6">
              <h3 className="text-3xl font-black text-white">
                🎁 RESUMO DOS PRESENTES
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl mb-2">{bonus.icon}</div>
                    <div className="text-sm text-gray-300">{bonus.title}</div>
                    <div className="text-green-400 font-bold">{bonus.value}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-600 pt-6">
                <div className="text-2xl text-gray-400 line-through mb-2">
                  Valor se comprado separadamente: R$ {totalValue.toLocaleString()}
                </div>
                <div className="text-3xl font-black text-green-400 mb-4">
                  INCLUSO GRATUITAMENTE: R$ 0,00
                </div>
                <div className="text-lg text-white">
                  💰 <strong>Economia total:</strong> R$ {totalValue.toLocaleString()}
                </div>
              </div>

              {/* CTA */}
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black text-xl py-5 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                <Target className="w-6 h-6" />
                QUERO TODOS OS BÔNUS - GARANTIR VAGA AGORA
              </button>
              
              <p className="text-gray-400 text-sm">
                🚨 Oferta válida apenas para as próximas 3 vagas desta turma
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BonusSection;