import React from 'react';
import { 
  Handshake, 
  CheckCircle,
  Shield,
  Target
} from '@phosphor-icons/react';

const GuaranteeSection = () => {
  const guaranteeFeatures = [
    "Sem risco financeiro",
    "Sem burocracia para cancelamento",
    "Garantia total de satisfação",
    "Decisão sem pressão"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-blue-950/10 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Main Guarantee Box */}
          <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 rounded-3xl p-12 border border-blue-500/30 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-4 mb-6">
                <Shield className="w-16 h-16 text-blue-400" />
                <h2 className="text-4xl md:text-5xl font-black text-white">
                  🛡️ GARANTIA DE 7 DIAS
                </h2>
                <Shield className="w-16 h-16 text-blue-400" />
              </div>
              
              <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-2xl p-6 border border-green-500/20">
                <h3 className="text-2xl font-black text-green-400 mb-2">
                  VOCÊ NÃO PRECISA DECIDIR AGORA
                </h3>
                <p className="text-xl text-white">
                  Comece gratuitamente e pague apenas se ficar satisfeito
                </p>
              </div>
            </div>

            {/* How it Works */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-10">
              
              {/* Left - How it works */}
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-blue-400 mb-6">
                  <Handshake className="inline w-8 h-8 mr-3" />
                  COMO FUNCIONA:
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        Inscreva-se gratuitamente
                      </h4>
                      <p className="text-gray-300">
                        Reserve sua vaga sem nenhum pagamento inicial
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        Participe dos primeiros 7 dias
                      </h4>
                      <p className="text-gray-300">
                        Experimente o método, conheça o professor, veja os resultados
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-600">
                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">
                        Decida com segurança
                      </h4>
                      <p className="text-gray-300">
                        Se gostar, continue. Se não gostar, não pague nada
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Benefits */}
              <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl p-8 border border-gray-600">
                <h3 className="text-2xl font-bold text-green-400 mb-6 text-center">
                  ✅ BENEFÍCIOS DA GARANTIA
                </h3>
                
                <div className="space-y-4">
                  {guaranteeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                      <span className="text-lg text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-500/20 text-center">
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-400 font-bold">
                    PROTEÇÃO TOTAL AO ALUNO
                  </p>
                  <p className="text-gray-300 text-sm">
                    Sua satisfação é nossa prioridade
                  </p>
                </div>
              </div>
            </div>

            {/* Main Promise */}
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-black text-white mb-4">
                  📞 NOSSA PROMESSA PARA VOCÊ:
                </h3>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Comece o curso <strong className="text-green-400">gratuitamente!</strong> Se nos primeiros 7 dias você 
                  sentir que não é para você, <strong className="text-blue-400">não pague nada</strong>. Simples assim.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-600">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Sem risco</p>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-600">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Sem burocracia</p>
              </div>
              <div className="text-center p-4 bg-gray-900/30 rounded-xl border border-gray-600">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold">Garantia total</p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-black text-xl py-5 px-10 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto mb-4">
                <Shield className="w-6 h-6" />
                🛡️ COMEÇAR GRATUITAMENTE - PRIMEIROS 7 DIAS GRÁTIS
              </button>
              
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span>✅ Sem cartão de crédito</span>
                <span>✅ Sem compromisso</span>
                <span>✅ Cancelamento simples</span>
              </div>

              <div className="mt-6 p-4 bg-yellow-900/20 rounded-xl border border-yellow-500/20">
                <p className="text-yellow-400 font-bold mb-2">
                  ⚡ TRANSPARÊNCIA TOTAL
                </p>
                <p className="text-gray-300 text-sm">
                  Estamos tão confiantes na qualidade do nosso curso que oferecemos esta garantia única. 
                  Você só paga se realmente ficar satisfeito com os primeiros 7 dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuaranteeSection;