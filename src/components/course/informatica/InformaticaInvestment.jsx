import React from 'react';
import { CreditCard, CurrencyDollar, Calendar, CheckCircle, Lightning, ArrowRight, Gift, TrendUp, Clock, Target, Star } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollReveal, CardGridReveal } from '../../../components/shared/ScrollReveal';

const paymentOptions = [
  {
    icon: Calendar,
    name: "Boleto Bancário",
    installments: "12x de R$ 299,90",
    total: "R$ 3.598,80",
    description: "Total parcelado em 12x no boleto",
    highlight: false
  },
  {
    icon: CreditCard,
    name: "Cartão de Crédito",
    installments: "10x de R$ 359,88",
    total: "R$ 3.598,80",
    description: "Sem juros no cartão",
    highlight: true
  },
  {
    icon: CurrencyDollar,
    name: "À Vista",
    installments: "R$ 3.382,87",
    total: "R$ 3.598,80",
    description: "6% de desconto à vista",
    highlight: false,
    discount: "6% OFF"
  }
];

const included = [
  "184,5 horas de conteúdo completo",
  "8 módulos do básico ao avançado",
  "Material didático impresso incluso",
  "Modalidades Presencial e Online",
  "Certificado Nacional reconhecido",
  "Suporte vitalício dos professores",
  "Acesso a projetos práticos reais",
  "Garantia incondicional de 7 dias"
];

export const InformaticaInvestment = () => {
  return (
    <section id="investimento" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <ScrollReveal animation="fade-up">
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
        </ScrollReveal>

        {/* Card principal de preço */}
        <ScrollReveal animation="zoom-in" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-3xl overflow-hidden">
            
            {/* Cabeçalho do card */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-400/20 backdrop-blur-sm border-b border-green-500/30 p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-blue-500/30">
                <Gift className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Curso Completo</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Curso Completo de Informática</h3>
              <p className="text-zinc-300">Do Windows 11 à Inteligência Artificial</p>
            </div>

            <div className="p-8 md:p-12">
              {/* Opções de Pagamento */}
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-white text-center mb-8">Escolha sua forma de pagamento</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {paymentOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <Card
                        key={index}
                        className={`relative text-center transition-all duration-300 hover:scale-105 ${
                          option.highlight
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-400/20 border-green-500/50 ring-2 ring-green-500/30 shadow-lg shadow-green-500/20'
                            : 'bg-zinc-800/50 border-zinc-700/50 hover:border-zinc-600/50'
                        }`}
                      >
                        {/* Badge de destaque */}
                        {option.highlight && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-400 text-white text-xs font-bold px-2 py-1 border-0">
                              RECOMENDADO
                            </Badge>
                          </div>
                        )}

                        {/* Badge de desconto */}
                        {option.discount && (
                          <div className="absolute -top-2 right-2 z-10">
                            <Badge variant="destructive" className="text-xs font-bold px-2 py-1">
                              {option.discount}
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="pb-2 pt-4 px-3 md:px-6 md:pt-6">
                          <IconComponent className={`w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 ${
                            option.highlight ? 'text-green-400' : 'text-zinc-400'
                          }`} />

                          <CardTitle className="text-white font-bold text-base md:text-lg mb-1">{option.name}</CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0 pb-4 px-3 md:px-6 space-y-1">
                          <div className={`text-lg md:text-xl font-bold ${
                            option.highlight ? 'text-green-400' : 'text-white'
                          }`}>
                            {option.installments}
                          </div>

                          <div className="text-zinc-400 text-xs md:text-sm">{option.description}</div>

                          {option.name !== "À Vista" && (
                            <div className="text-zinc-500 text-xs">
                              Total: {option.total}
                            </div>
                          )}

                          {option.name === "À Vista" && (
                            <div className="text-zinc-500 text-xs">
                              <span className="line-through">De: {option.total}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
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
                  className="group relative overflow-hidden rounded-xl px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-400 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto mb-4 cursor-pointer"
                >
                  <Lightning className="w-6 h-6" />
                  Escolher Meu Plano
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
        </ScrollReveal>

        {/* Comparação de valor com design moderno */}
        <ScrollReveal animation="slide-left" delay={0.3}>
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare o <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">VALOR</span> do seu investimento
            </h3>
            <p className="text-zinc-400 text-lg">Veja a diferença que o conhecimento faz na sua carreira</p>
          </div>

          <Tabs defaultValue="depois" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-800/50 border border-zinc-700/50">
              <TabsTrigger value="antes" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-300">
                Situação Atual
              </TabsTrigger>
              <TabsTrigger value="depois" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-300">
                Após o Curso
              </TabsTrigger>
            </TabsList>

            <TabsContent value="antes" className="space-y-6">
              <Card className="bg-gradient-to-br from-red-500/5 to-orange-500/5 border-red-500/20 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
                      <Clock className="w-8 h-8 text-red-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-red-400">SEM o Curso de Informática</CardTitle>
                  <CardDescription className="text-zinc-400">Sua situação profissional atual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-400" />
                        Limitações Profissionais
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-zinc-300">
                          <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          Conhecimento básico limitado
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          Dependente de colegas para tarefas
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          Dificuldade com novas tecnologias
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0"></div>
                          Insegurança no ambiente digital
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <TrendUp className="w-5 h-5 text-red-400" />
                        Impacto na Carreira
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Potencial de Crescimento</span>
                            <span className="text-sm text-red-400">30%</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full bg-red-500 transition-all" style={{ width: '30%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Competitividade no Mercado</span>
                            <span className="text-sm text-red-400">25%</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full bg-red-500 transition-all" style={{ width: '25%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Oportunidades Perdidas</span>
                            <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                              ALTA
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 bg-red-500/20" />

                  <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <h5 className="text-xl font-bold text-red-400 mb-2">Custo Real</h5>
                    <p className="text-zinc-300">
                      <strong className="text-red-400">Oportunidades perdidas</strong> e estagnação profissional
                    </p>
                    <p className="text-sm text-zinc-500 mt-2">Valor estimado: R$ 50.000+ em oportunidades não aproveitadas</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="depois" className="space-y-6">
              <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30">
                      <Star className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-green-400">COM o Curso de Informática</CardTitle>
                  <CardDescription className="text-zinc-400">Seu potencial após a formação completa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-400" />
                        Transformação Profissional
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          Expert em informática moderna
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          Autonomia total no trabalho
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          Domínio de IA e tecnologias
                        </li>
                        <li className="flex items-start gap-3 text-zinc-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          Confiança no ambiente digital
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <TrendUp className="w-5 h-5 text-green-400" />
                        Crescimento de Carreira
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Potencial de Crescimento</span>
                            <span className="text-sm text-green-400">95%</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full bg-green-500 transition-all" style={{ width: '95%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Competitividade no Mercado</span>
                            <span className="text-sm text-green-400">90%</span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                            <div className="h-full bg-green-500 transition-all" style={{ width: '90%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-zinc-400">Aumento Salarial Esperado</span>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              +45%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 bg-green-500/20" />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <TrendUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                      <h6 className="text-sm sm:text-base font-bold text-green-400">Aumento Médio</h6>
                      <p className="text-xl sm:text-2xl font-bold text-white">45%</p>
                      <p className="text-xs text-zinc-400">no salário</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-1 sm:mb-2" />
                      <h6 className="text-sm sm:text-base font-bold text-blue-400">ROI</h6>
                      <p className="text-xl sm:text-2xl font-bold text-white">3-6</p>
                      <p className="text-xs text-zinc-400">meses para se pagar</p>
                    </div>
                    <div className="text-center p-3 sm:p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-1 sm:mb-2" />
                      <h6 className="text-sm sm:text-base font-bold text-purple-400">Oportunidades</h6>
                      <p className="text-xl sm:text-2xl font-bold text-white">∞</p>
                      <p className="text-xs text-zinc-400">possibilidades</p>
                    </div>
                  </div>

                  <div className="text-center p-4 sm:p-6 bg-gradient-to-r from-green-500/10 to-emerald-400/10 rounded-xl border border-green-500/20">
                    <h5 className="text-lg sm:text-xl font-bold text-green-400 mb-2">Investimento Inteligente</h5>
                    <p className="text-sm sm:text-base text-zinc-300 mb-2">
                      <strong className="text-green-400">O curso se paga sozinho</strong> com o primeiro aumento ou nova oportunidade!
                    </p>
                    <div className="text-xl sm:text-2xl font-bold text-green-400">
                      A partir de R$ 299,90/mês
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">Valor total muito menor que o retorno obtido</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};