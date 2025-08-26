import React from 'react';
import { 
  Question, 
  X, 
  CheckCircle, 
  Rocket,
  Clock,
  Users,
  Target,
  Trophy
} from '@phosphor-icons/react';

const ComparisonSection = () => {
  const comparisonOptions = [
    {
      title: "SOZINHO",
      icon: <X className="w-8 h-8 text-red-400" />,
      bgColor: "from-red-900/30 to-orange-900/30",
      borderColor: "border-red-500/30",
      features: [
        { text: "Lento", icon: <Clock className="w-5 h-5 text-red-400" /> },
        { text: "Difícil", icon: <X className="w-5 h-5 text-red-400" /> },
        { text: "Sem ajuda", icon: <X className="w-5 h-5 text-red-400" /> },
        { text: "Sem direcionamento", icon: <X className="w-5 h-5 text-red-400" /> },
        { text: "Muitos erros", icon: <X className="w-5 h-5 text-red-400" /> }
      ],
      timeToResult: "6 meses a 1 ano",
      successRate: "20%",
      cost: "Grátis (mas tempo é dinheiro)"
    },
    {
      title: "ONLINE",
      icon: <X className="w-8 h-8 text-yellow-600" />,
      bgColor: "from-yellow-900/30 to-orange-900/30",
      borderColor: "border-yellow-500/30",
      features: [
        { text: "Sem suporte", icon: <X className="w-5 h-5 text-yellow-600" /> },
        { text: "Genérico", icon: <X className="w-5 h-5 text-yellow-600" /> },
        { text: "Dúvidas sem resposta", icon: <X className="w-5 h-5 text-yellow-600" /> },
        { text: "Falta de prática", icon: <X className="w-5 h-5 text-yellow-600" /> },
        { text: "Alto abandono", icon: <X className="w-5 h-5 text-yellow-600" /> }
      ],
      timeToResult: "3-6 meses",
      successRate: "35%",
      cost: "R$ 300-800"
    },
    {
      title: "NOSSO MÉTODO",
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      bgColor: "from-green-900/30 to-blue-900/30",
      borderColor: "border-green-500/30",
      features: [
        { text: "Presencial", icon: <Users className="w-5 h-5 text-green-400" /> },
        { text: "Individualizado", icon: <Target className="w-5 h-5 text-green-400" /> },
        { text: "Suporte direto", icon: <CheckCircle className="w-5 h-5 text-green-400" /> },
        { text: "Prática intensiva", icon: <Trophy className="w-5 h-5 text-green-400" /> },
        { text: "Resultado garantido", icon: <CheckCircle className="w-5 h-5 text-green-400" /> }
      ],
      timeToResult: "56 horas (2 meses)",
      successRate: "95%",
      cost: "R$ 2.793 (7x R$ 399)",
      highlight: true
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-gray-950/20 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 flex items-center justify-center gap-3">
              <Question className="w-10 h-10 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                3 CAMINHOS POSSÍVEIS
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              VOCÊ COMPREENDE O TAMANHO DESTA OPORTUNIDADE?<br/>
              <strong className="text-purple-400">Você tem 3 caminhos, qual você prefere?</strong>
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {comparisonOptions.map((option, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br ${option.bgColor} rounded-2xl p-6 border ${option.borderColor} relative ${
                  option.highlight ? 'ring-2 ring-green-400/50 scale-105' : ''
                } transition-all duration-300`}
              >
                
                {/* Highlight Badge */}
                {option.highlight && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-2 rounded-full border border-green-400/30">
                      <span className="text-white font-black text-sm">🏆 RECOMENDADO</span>
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6 pt-4">
                  {option.icon}
                  <h3 className="text-2xl font-black text-white mt-3 mb-2">
                    {option.title}
                  </h3>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3 p-2">
                      {feature.icon}
                      <span className={`font-medium ${
                        option.highlight ? 'text-white' : 'text-gray-300'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-600">
                    <div className="text-sm text-gray-400">Tempo para resultado:</div>
                    <div className={`font-bold ${option.highlight ? 'text-green-400' : 'text-gray-200'}`}>
                      {option.timeToResult}
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-600">
                    <div className="text-sm text-gray-400">Taxa de sucesso:</div>
                    <div className={`font-bold text-xl ${
                      option.highlight ? 'text-green-400' : 
                      index === 1 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {option.successRate}
                    </div>
                  </div>

                  <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-600">
                    <div className="text-sm text-gray-400">Investimento:</div>
                    <div className={`font-bold ${option.highlight ? 'text-green-400' : 'text-gray-200'}`}>
                      {option.cost}
                    </div>
                  </div>
                </div>

                {/* Action */}
                {option.highlight ? (
                  <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-black py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                    ✅ ESCOLHO ESTE CAMINHO
                  </button>
                ) : (
                  <div className="w-full bg-gray-700/50 text-gray-400 font-bold py-3 px-4 rounded-xl text-center border border-gray-600">
                    {index === 0 ? "😔 Caminho Longo" : "🤔 Caminho Incerto"}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Why Choose Us */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/20 mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-white mb-4">
                🎯 POR QUE NOSSO MÉTODO É SUPERIOR?
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-2">PRESENCIAL</h4>
                <p className="text-sm text-gray-300">Interação direta com professor e colegas</p>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-2">INDIVIDUALIZADO</h4>
                <p className="text-sm text-gray-300">Máximo 4 alunos por turma</p>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-2">PRÁTICA</h4>
                <p className="text-sm text-gray-300">56 horas de hands-on</p>
              </div>

              <div className="text-center p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h4 className="font-bold text-white mb-2">GARANTIDO</h4>
                <p className="text-sm text-gray-300">95% de aproveitamento</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/20">
              <h3 className="text-2xl font-bold text-white mb-4">
                🚀 A DECISÃO É SUA!
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Você pode continuar tentando sozinho, fazer um curso genérico online, 
                ou <strong className="text-green-400">escolher o método comprovado</strong> que já transformou 
                <strong className="text-purple-400"> 200+ profissionais</strong> na região.
              </p>
              
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-xl py-5 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                <Rocket className="w-6 h-6" />
                ESCOLHO O MÉTODO PRESENCIAL - GARANTIR VAGA AGORA
              </button>
              
              <p className="text-gray-400 text-sm mt-4">
                ⚡ Últimas 3 vagas desta turma • 🛡️ Garantia de 7 dias • 🏆 95% de satisfação
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;