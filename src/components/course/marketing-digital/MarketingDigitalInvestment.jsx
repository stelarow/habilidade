import React from 'react';
import { CreditCard, CurrencyDollar, Calendar, CheckCircle, Lightning, ArrowRight, Gift, TrendUp, Clock, Target, Star } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollReveal } from '../../../components/shared/ScrollReveal';

const paymentOptions = [
  {
    icon: Calendar,
    name: "Boleto",
    installments: "12x de R$ 299,90",
    total: "R$ 3.598,80",
    description: "Total em 12x no boleto",
    highlight: false
  },
  {
    icon: CreditCard,
    name: "Cartão",
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
    description: "6% de desconto",
    highlight: false,
    discount: "6% OFF"
  }
];

const included = [
  "82 horas de conteúdo completo",
  "9 módulos do básico ao avançado",
  "Material didático impresso incluído",
  "Formas Presencial e Online",
  "Certificado Profissional reconhecido",
  "Suporte dos professores",
  "Acesso a projetos práticos",
  "Garantia de 7 dias"
];

export const MarketingDigitalInvestment = () => {
  return (
    <section id="investimento" className="px-6 py-20 lg:py-24 bg-[#000000]">
      <div className="container mx-auto max-w-7xl">
        {/* Header - Bugatti style */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              INVISTA NO SEU FUTURO
            </h2>
            <p className="text-lg text-[#cccccc] max-w-3xl mx-auto font-serif leading-relaxed">
              Um investimento que se paga em poucas semanas.
              Profissionais de marketing digital estão entre os mais valorizados do mercado.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Price Card */}
        <ScrollReveal animation="zoom-in" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-16">
            <div className="border border-[#262626] bg-[#0d0d0d]">
              {/* Card Header */}
              <div className="border-b border-[#262626] p-8 text-center bg-[#141414]">
                <div className="inline-flex items-center gap-2 border border-[#3a3a3a] px-4 py-2 mb-4">
                  <Gift className="w-5 h-5 text-[#c3d9f3]" />
                  <span className="text-[#c3d9f3] font-mono text-sm tracking-wider uppercase">Curso Completo</span>
                </div>
                <h3 className="text-2xl font-normal text-white tracking-[1.5px] uppercase mb-2">
                  Marketing Digital Completo
                </h3>
                <p className="text-[#999999] font-serif">9 módulos, 57 aulas, 82 horas</p>
              </div>

              <div className="p-8 md:p-12">
                {/* Payment Options */}
                <div className="mb-10">
                  <h4 className="text-lg font-normal text-white tracking-[1.5px] uppercase text-center mb-8">
                    Escolha como pagar
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    {paymentOptions.map((option, index) => {
                      const IconComponent = option.icon;
                      return (
                        <Card
                          key={index}
                          className={`relative text-center transition-all duration-300 hover:scale-105 ${
                            option.highlight
                              ? 'border-[#c3d9f3]/50 bg-[#141414] ring-1 ring-[#c3d9f3]/20'
                              : 'bg-[#0d0d0d] border-[#262626] hover:border-[#3a3a3a]'
                          }`}
                        >
                          {option.highlight && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <Badge className="bg-white text-black font-mono text-xs tracking-wider px-3 py-1 border-0">
                                RECOMENDADO
                              </Badge>
                            </div>
                          )}

                          {option.discount && (
                            <div className="absolute -top-3 right-2 z-10">
                              <Badge variant="destructive" className="font-mono text-xs tracking-wider px-2 py-1">
                                {option.discount}
                              </Badge>
                            </div>
                          )}

                          <CardHeader className="pb-2 pt-6 px-4">
                            <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                              option.highlight ? 'text-[#c3d9f3]' : 'text-[#999999]'
                            }`} />
                            <CardTitle className="text-white font-normal text-base tracking-wider uppercase">
                              {option.name}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="pt-0 pb-6 px-4 space-y-1">
                            <div className={`text-lg md:text-xl ${
                              option.highlight ? 'text-white' : 'text-[#e6e6e6]'
                            }`}>
                              {option.installments}
                            </div>
                            <div className="text-[#999999] text-xs font-mono">{option.description}</div>
                            {option.name !== "À Vista" && (
                              <div className="text-[#666666] text-xs font-mono mt-2">
                                Total: {option.total}
                              </div>
                            )}
                            {option.name === "À Vista" && (
                              <div className="text-[#666666] text-xs font-mono mt-2 line-through">
                                De: {option.total}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-10">
                  <h4 className="text-lg font-normal text-white tracking-[1.5px] uppercase text-center mb-6">
                    O que está incluído
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {included.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                        <span className="text-[#cccccc] text-sm font-serif">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <button
                    onClick={() => handleCTAClick('investment')}
                    className="inline-flex items-center px-10 py-4 border border-white text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
                  >
                    <Lightning className="w-5 h-5 mr-2" />
                    Escolher Meu Plano
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 text-xs text-[#999999] font-mono tracking-wider">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Garantia de 7 dias</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Pagamento seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span>Acesso imediato</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Comparison Tabs */}
        <ScrollReveal animation="slide-left" delay={0.3}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-normal text-white tracking-[2px] uppercase mb-4">
                Compare o valor
              </h3>
              <p className="text-[#999999] font-serif">Veja a diferença que o conhecimento faz</p>
            </div>

            <Tabs defaultValue="depois" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-[#0d0d0d] border border-[#262626]">
                <TabsTrigger
                  value="antes"
                  className="font-mono text-xs tracking-wider uppercase data-[state=active]:bg-[#262626] data-[state=active]:text-white"
                >
                  Sem o Curso
                </TabsTrigger>
                <TabsTrigger
                  value="depois"
                  className="font-mono text-xs tracking-wider uppercase data-[state=active]:bg-[#c3d9f3]/20 data-[state=active]:text-[#c3d9f3]"
                >
                  Com o Curso
                </TabsTrigger>
              </TabsList>

              <TabsContent value="antes" className="space-y-6">
                <Card className="bg-[#0d0d0d] border-red-500/20">
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 border border-red-500/30 rounded-full">
                        <Clock className="w-8 h-8 text-red-400" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-red-400 font-normal tracking-wider uppercase">
                      SEM Marketing Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-[#cccccc] font-serif">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        Conhecimento básico limitado
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        Dificuldade em gerar resultados online
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        Perde clientes para concorrentes
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        Sem métricas ou dados de campanhas
                      </li>
                    </ul>
                    <Separator className="my-6 bg-red-500/20" />
                    <div className="text-center p-4 border border-red-500/20 bg-red-500/5">
                      <h5 className="text-lg font-normal text-red-400 tracking-wider uppercase mb-2">
                        Custo Real
                      </h5>
                      <p className="text-[#cccccc] font-serif">
                        <strong className="text-red-400">Clientes perdidos</strong> e oportunidades arrancadas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="depois" className="space-y-6">
                <Card className="bg-[#0d0d0d] border-green-500/20">
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 border border-green-500/30 rounded-full">
                        <Star className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-green-400 font-normal tracking-wider uppercase">
                      COM Marketing Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-[#cccccc] font-serif">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        Especialista em campanhas e redes sociais
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        Resultados mensuráveis eROI positivo
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        Atrai clientes de forma consistente
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        Dados e analytics para otimizar resultados
                      </li>
                    </ul>
                    <Separator className="my-6 bg-green-500/20" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 border border-green-500/20 bg-green-500/5">
                        <TrendUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <h6 className="text-sm font-normal text-white tracking-wider uppercase">Aumento</h6>
                        <p className="text-2xl font-normal text-green-400">+40%</p>
                        <p className="text-xs text-[#999999] font-mono">nos ganhos</p>
                      </div>
                      <div className="text-center p-4 border border-[#c3d9f3]/20 bg-[#c3d9f3]/5">
                        <Clock className="w-6 h-6 text-[#c3d9f3] mx-auto mb-2" />
                        <h6 className="text-sm font-normal text-white tracking-wider uppercase">ROI</h6>
                        <p className="text-2xl font-normal text-[#c3d9f3]">3-6</p>
                        <p className="text-xs text-[#999999] font-mono">meses</p>
                      </div>
                      <div className="text-center p-4 border border-purple-500/20 bg-purple-500/5">
                        <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <h6 className="text-sm font-normal text-white tracking-wider uppercase">Clientes</h6>
                        <p className="text-2xl font-normal text-purple-400">∞</p>
                        <p className="text-xs text-[#999999] font-mono">potenciais</p>
                      </div>
                    </div>
                    <div className="text-center p-4 border border-green-500/20 bg-green-500/5">
                      <h5 className="text-lg font-normal text-green-400 tracking-wider uppercase mb-2">
                        Investimento Inteligente
                      </h5>
                      <p className="text-[#cccccc] font-serif mb-2">
                        <strong className="text-white">O curso se paga</strong> com o primeiro cliente conquistado!
                      </p>
                      <div className="text-2xl font-normal text-white tracking-wider">
                        A partir de R$ 299,90/mês
                      </div>
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
