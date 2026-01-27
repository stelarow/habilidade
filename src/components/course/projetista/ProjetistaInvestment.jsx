import {
  CurrencyCircleDollar,
  X,
  CheckCircle,
  CreditCard,
  Clock,
  Rocket,
  ShieldCheck,
  Gift,
  Percent
} from '@phosphor-icons/react';
import { CountdownTimer } from '../../shared/CountdownTimer';

export const ProjetistaInvestment = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 bg-zinc-950">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-purple-500/10 border border-purple-400/20 rounded-full">
            <Gift className="w-4 h-4 text-purple-400" weight="fill" />
            <span className="text-sm font-semibold text-purple-300">OFERTA POR TEMPO LIMITADO</span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              INVESTIMENTO
            </span>
            <br />
            <span className="text-white">PROMOCIONAL</span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/10 to-cyan-500/20 rounded-3xl blur-2xl" />

            <div className="relative rounded-3xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 overflow-hidden">
              {/* Price Comparison Header */}
              <div className="p-8 md:p-10 text-center border-b border-zinc-800">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
                  {/* Original Price */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <X className="w-5 h-5 text-red-400" weight="bold" />
                    <span className="text-lg md:text-xl text-red-400 line-through font-medium">
                      DE: R$ 6.126,00
                    </span>
                  </div>

                  {/* Discount Badge */}
                  <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-400/50 rounded-xl">
                    <Percent className="w-6 h-6 text-yellow-400" weight="bold" />
                    <span className="text-2xl font-black text-yellow-300">43% OFF</span>
                  </div>
                </div>

                {/* Current Price */}
                <div className="flex items-center justify-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-green-400" weight="fill" />
                  <span className="text-3xl md:text-5xl font-black text-green-400">
                    POR: R$ 3.493,00
                  </span>
                </div>
                <p className="text-zinc-400">Valor total do curso completo</p>
              </div>

              {/* Payment Options */}
              <div className="p-8 md:p-10">
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                  {/* Installment Option */}
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-opacity duration-300" />
                    <div className="relative p-6 md:p-8 bg-zinc-800/80 rounded-2xl border border-zinc-700 hover:border-zinc-600 transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
                          <CreditCard className="w-6 h-6 text-white" weight="fill" />
                        </div>
                        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Parcelado</span>
                      </div>

                      <div className="text-3xl md:text-4xl font-black text-white mb-2">
                        7x de R$ 499
                      </div>
                      <p className="text-cyan-400 font-medium">Sem juros no boleto</p>

                      <div className="mt-4 pt-4 border-t border-zinc-700">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
                          <span>Parcelas fixas mensais</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Option - Highlighted */}
                  <div className="relative group">
                    {/* Highlight badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-green-500/30">
                        MELHOR OPÇÃO
                      </span>
                    </div>

                    <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl opacity-60 blur-sm" />
                    <div className="relative p-6 md:p-8 bg-zinc-800 rounded-2xl border-2 border-green-500/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                          <CurrencyCircleDollar className="w-6 h-6 text-white" weight="fill" />
                        </div>
                        <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">À Vista</span>
                      </div>

                      <div className="text-3xl md:text-4xl font-black text-white mb-2">
                        R$ 3.143,70
                      </div>
                      <p className="text-green-400 font-medium">Economize mais 10%</p>

                      <div className="mt-4 pt-4 border-t border-zinc-700">
                        <div className="flex items-center gap-2 text-sm text-green-300">
                          <Gift className="w-4 h-4" weight="fill" />
                          <span>Economia total de R$ 349,30</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid sm:grid-cols-3 gap-4 mb-10">
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <ShieldCheck className="w-6 h-6 text-green-400 flex-shrink-0" weight="fill" />
                    <span className="text-sm text-zinc-300">Garantia de 7 dias</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" weight="fill" />
                    <span className="text-sm text-zinc-300">Certificado Nacional</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                    <CheckCircle className="w-6 h-6 text-cyan-400 flex-shrink-0" weight="fill" />
                    <span className="text-sm text-zinc-300">Suporte Vitalício</span>
                  </div>
                </div>

                {/* Urgency Timer */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-4 bg-yellow-500/10 border border-yellow-400/30 rounded-xl">
                    <Clock className="w-5 h-5 text-yellow-400" weight="fill" />
                    <span className="text-sm font-semibold text-yellow-300">
                      OFERTA VÁLIDA POR:
                    </span>
                    <CountdownTimer bgClassName="bg-yellow-500/20" />
                  </div>
                </div>

                {/* CTA Button - No pulse animation */}
                <div className="text-center">
                  <a
                    href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Quero%20garantir%20minha%20vaga%20no%20Curso%20de%20Projetista%203D%20com%2043%25%20OFF"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <Rocket className="w-6 h-6" weight="bold" />
                    GARANTIR MINHA VAGA AGORA - 43% OFF

                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </div>
                  </a>

                  <p className="mt-4 text-sm text-zinc-500">
                    Vagas limitadas a 4 alunos por turma
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
