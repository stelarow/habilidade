import React from 'react';
import { 
  CurrencyCircleDollar, 
  Lightning, 
  X, 
  CheckCircle, 
  CreditCard, 
  Lightbulb,
  Rocket,
  Target
} from '@phosphor-icons/react';
import CountdownTimer from './CountdownTimer';

const InvestmentSection = () => {
  const originalPrice = 4893;
  const discountedPrice = 2793;
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  const cashPrice = Math.round(discountedPrice * 0.9); // 10% desconto à vista
  const installmentPrice = Math.round(discountedPrice / 7);

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 flex items-center justify-center gap-3">
              <CurrencyCircleDollar className="w-10 h-10 text-green-500" />
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                INVESTIMENTO PROMOCIONAL
              </span>
            </h2>
          </div>

          {/* Main Pricing Box */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-10 border border-purple-500/30 shadow-2xl mb-8">
            
            {/* Price Comparison */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-6 mb-6">
                
                {/* Original Price */}
                <div className="bg-red-900/20 rounded-2xl p-6 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-6 h-6 text-red-400" />
                    <span className="text-red-400 font-bold">DE:</span>
                  </div>
                  <div className="text-3xl font-black text-gray-400 line-through">
                    R$ {originalPrice.toLocaleString()}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-4xl text-purple-400">→</div>

                {/* Discounted Price */}
                <div className="bg-green-900/20 rounded-2xl p-6 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">POR:</span>
                  </div>
                  <div className="text-4xl font-black text-green-400">
                    R$ {discountedPrice.toLocaleString()}
                  </div>
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold mt-2">
                    {discountPercentage}% OFF
                  </div>
                </div>
              </div>

              {/* Discount Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-3 rounded-full border border-yellow-400/30 mb-6">
                <Lightning className="w-6 h-6 text-white" />
                <span className="text-white font-black text-xl">
                  DESCONTO DE R$ {(originalPrice - discountedPrice).toLocaleString()}
                </span>
                <Lightning className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              
              {/* Installments */}
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/20">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-blue-400 mb-2">
                    PARCELADO
                  </h3>
                  <div className="text-3xl font-black text-white mb-2">
                    7x de R$ {installmentPrice}
                  </div>
                  <p className="text-gray-300">sem juros</p>
                  <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-500/20">
                    <p className="text-blue-300 text-sm">
                      💳 Cartão de crédito ou débito
                    </p>
                  </div>
                </div>
              </div>

              {/* Cash Payment */}
              <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-2xl p-6 border border-green-500/20 relative">
                
                {/* Best Deal Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 px-4 py-1 rounded-full border border-green-400/30">
                    <span className="text-white font-bold text-sm">⭐ MELHOR OFERTA</span>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <CurrencyCircleDollar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-green-400 mb-2">
                    À VISTA
                  </h3>
                  <div className="text-3xl font-black text-green-400 mb-2">
                    R$ {cashPrice.toLocaleString()}
                  </div>
                  <p className="text-gray-300 mb-2">(10% desconto extra)</p>
                  <div className="text-sm text-green-400 font-semibold">
                    Economia de R$ {(discountedPrice - cashPrice).toLocaleString()}
                  </div>
                  <div className="mt-4 p-3 bg-green-900/20 rounded-xl border border-green-500/20">
                    <p className="text-green-300 text-sm">
                      💰 PIX, Transferência ou Cartão à vista
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency Timer */}
            <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-2xl p-6 border border-orange-500/20 mb-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-orange-400 mb-4">
                  ⏰ OFERTA VÁLIDA POR TEMPO LIMITADO
                </h3>
                <CountdownTimer className="text-xl" />
                <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-red-900/20 rounded-xl p-3 border border-red-500/20">
                    <p className="text-red-400 font-bold text-sm">🔥 ÚLTIMAS</p>
                    <p className="text-white text-lg font-black">3 VAGAS</p>
                  </div>
                  <div className="bg-orange-900/20 rounded-xl p-3 border border-orange-500/20">
                    <p className="text-orange-400 font-bold text-sm">📅 DESTA</p>
                    <p className="text-white text-lg font-black">TURMA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROI Guarantee */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-green-900/20 rounded-2xl p-6 border border-yellow-500/20 mb-8">
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-yellow-400 mb-2">
                  💡 RETORNO DO INVESTIMENTO GARANTIDO
                </h3>
                <p className="text-lg text-white leading-relaxed">
                  <strong className="text-green-400">COM APENAS 1 PROJETO</strong> você recupera todo o seu investimento. 
                  Nossos alunos cobram entre <strong className="text-purple-400">R$ 3.000 a R$ 8.000</strong> por projeto 3D.
                </p>
              </div>
            </div>

            {/* Main CTA */}
            <div className="text-center">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-2xl py-6 px-12 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-4 mx-auto mb-4">
                <Rocket className="w-8 h-8" />
                GARANTIR MINHA VAGA AGORA - {discountPercentage}% OFF
              </button>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
                <span>✅ Acesso imediato</span>
                <span>✅ Suporte 24h</span>
                <span>✅ Certificado incluso</span>
              </div>

              {/* Security Badges */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-gray-900/40 rounded-xl p-3 text-center border border-gray-600">
                  <div className="text-green-400 text-xl">🔒</div>
                  <p className="text-xs text-gray-300">Pagamento Seguro</p>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-3 text-center border border-gray-600">
                  <div className="text-blue-400 text-xl">🛡️</div>
                  <p className="text-xs text-gray-300">Garantia 7 dias</p>
                </div>
                <div className="bg-gray-900/40 rounded-xl p-3 text-center border border-gray-600">
                  <div className="text-purple-400 text-xl">⚡</div>
                  <p className="text-xs text-gray-300">Turma Limitada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alternative CTA */}
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Ainda tem dúvidas? Entre em contato conosco
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 mx-auto">
              <Target className="w-5 h-5" />
              💬 Falar com Especialista via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;