import React from 'react';
import { CreditCard, CurrencyDollar, Calendar, CheckCircle, Lightning, ArrowRight, Gift } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

const paymentMethods = [
  {
    icon: CreditCard,
    name: "Cartão de Crédito",
    description: "Até 12x sem juros",
    highlight: true
  },
  {
    icon: CurrencyDollar,
    name: "PIX",
    description: "Desconto à vista",
    highlight: false
  },
  {
    icon: Calendar,
    name: "Boleto Bancário",
    description: "Pagamento à vista",
    highlight: false
  }
];

const included = [
  "184,5 horas de conteúdo completo",
  "8 módulos do básico ao avançado",
  "Material didático impresso incluso",
  "Modalidades Presencial e Online",
  "Certificado Nacional reconhecido",
  "Suporte vitalício dos instrutores",
  "Acesso a projetos práticos reais",
  "Garantia incondicional de 7 dias"
];

export const InformaticaNovaInvestment = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">INVISTA NO SEU</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              FUTURO
            </span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Um investimento que se paga em poucas semanas. 
            Profissionais com domínio em informática ganham em média 45% mais.
          </p>
        </div>

        {/* Card principal de preço */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl overflow-hidden">
            
            {/* Cabeçalho do card */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-400/20 backdrop-blur-sm border-b border-green-500/30 p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-green-500/90 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <Gift className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">OFERTA ESPECIAL</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Curso Completo de Informática</h3>
              <p className="text-zinc-300">Do Windows 11 à Inteligência Artificial</p>
            </div>

            <div className="p-8 md:p-12">
              {/* Preços */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-zinc-400 text-xl line-through">R$ 997</div>
                  <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-bold text-sm">40% OFF</span>
                  </div>
                </div>
                
                <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                  R$ 597
                </div>
                
                <div className="text-zinc-300 text-lg mb-2">
                  ou <span className="font-bold text-green-400">12x de R$ 59,70</span>
                </div>
                
                <div className="text-zinc-400 text-sm">
                  *Parcelamento sem juros no cartão
                </div>
              </div>

              {/* Métodos de pagamento */}
              <div className="mb-10">
                <h4 className="text-lg font-bold text-white text-center mb-6">Formas de Pagamento</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {paymentMethods.map((method, index) => {
                    const IconComponent = method.icon;
                    return (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border text-center ${
                          method.highlight 
                            ? 'bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20' 
                            : 'bg-zinc-800/30 border-zinc-700/50'
                        }`}
                      >
                        <IconComponent className={`w-8 h-8 mx-auto mb-3 ${
                          method.highlight ? 'text-green-400' : 'text-zinc-400'
                        }`} />
                        <div className="text-white font-semibold text-sm mb-1">{method.name}</div>
                        <div className="text-zinc-400 text-xs">{method.description}</div>
                        {method.highlight && (
                          <div className="mt-2">
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                              RECOMENDADO
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* O que está incluído */}
              <div className="mb-10">
                <h4 className="text-lg font-bold text-white text-center mb-6">O que está incluído:</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-zinc-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <button 
                  onClick={() => handleCTAClick('investment')}
                  className="group relative overflow-hidden rounded-xl px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-400 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 animate-pulse flex items-center justify-center gap-3 mx-auto mb-4 cursor-pointer"
                >
                  <Lightning className="w-6 h-6" />
                  GARANTIR MINHA VAGA AGORA
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Garantia de 7 dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Acesso imediato</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparação de valor */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-400/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center text-white mb-8">
              Compare o <span className="text-blue-400">VALOR</span> do seu investimento
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sem o curso */}
              <div className="text-center">
                <h4 className="text-lg font-bold text-red-400 mb-4">SEM o curso</h4>
                <div className="space-y-3 text-sm text-zinc-400">
                  <div>❌ Limitado a tarefas básicas</div>
                  <div>❌ Dependente de outros</div>
                  <div>❌ Oportunidades perdidas</div>
                  <div>❌ Salário estagnado</div>
                </div>
                <div className="mt-6 text-2xl font-bold text-red-400">
                  Custo: Oportunidades perdidas
                </div>
              </div>

              {/* Com o curso */}
              <div className="text-center">
                <h4 className="text-lg font-bold text-green-400 mb-4">COM o curso</h4>
                <div className="space-y-3 text-sm text-zinc-300">
                  <div>✅ Expert em informática moderna</div>
                  <div>✅ Autonomia total</div>
                  <div>✅ Novas oportunidades</div>
                  <div>✅ Aumento salarial de 45%</div>
                </div>
                <div className="mt-6 text-2xl font-bold text-green-400">
                  Investimento: R$ 597
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8 p-6 bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-zinc-300 text-lg">
                <strong className="text-green-400">O curso se paga sozinho</strong> com o primeiro aumento ou nova oportunidade!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};