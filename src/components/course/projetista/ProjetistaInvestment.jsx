import { 
  CurrencyCircleDollar, 
  X, 
  CheckCircle, 
  CreditCard, 
  Clock, 
  Lightbulb,
  Rocket
} from '@phosphor-icons/react';
import { CountdownTimer } from '../../shared/CountdownTimer';

export const ProjetistaInvestment = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">INVESTIMENTO</span>
            <br />
            <span className="text-white">PROMOCIONAL</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-8 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
            
            {/* Price Comparison */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400" />
                  <span className="text-2xl text-red-400 line-through">DE: R$ 4.893,00</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-6">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-4xl font-bold text-green-400">POR: R$ 2.793,00</span>
                <span className="text-xl text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full">(43% OFF)</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-6 bg-zinc-700/30 rounded-lg border border-zinc-600">
                <CreditCard className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-cyan-400 mb-2">7x de R$ 399,00</div>
                <div className="text-zinc-300">sem juros</div>
              </div>
              
              <div className="text-center p-6 bg-green-500/10 rounded-lg border border-green-400/20">
                <CurrencyCircleDollar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-400 mb-2">R$ 2.513,70</div>
                <div className="text-green-300">À vista (10% desconto extra)</div>
              </div>
            </div>

            {/* Urgency Timer */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-400/20 border border-yellow-400 rounded-xl mb-4">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium text-yellow-300">
                  OFERTA VÁLIDA POR:
                </span>
                <CountdownTimer bgClassName="bg-yellow-400/30" />
              </div>
              
              <p className="text-red-400 font-semibold">
                🎯 ÚLTIMAS 3 VAGAS DESTA TURMA
              </p>
            </div>

            {/* ROI Message */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-lg text-amber-300">
                <Lightbulb className="w-5 h-5" />
                <span>COM APENAS 1 PROJETO VOCÊ RECUPERA SEU INVESTIMENTO</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 animate-pulse">
                <Rocket className="inline w-6 h-6 mr-3" />
                GARANTIR MINHA VAGA AGORA - 43% OFF
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};