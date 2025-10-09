import React from 'react';
import { Shield, CheckCircle, Clock, ArrowClockwise, ArrowRight } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Alert, AlertDescription } from '../../ui/alert';
import { ScrollReveal, CardGridReveal } from '../../../components/shared/ScrollReveal';

const guaranteeFeatures = [
  {
    icon: Clock,
    title: "7 Dias para Decidir",
    description: "Tempo suficiente para avaliar todo o conteúdo e metodologia"
  },
  {
    icon: ArrowClockwise,
    title: "Processo Simples",
    description: "Devolução rápida e sem complicações burocráticas"
  },
  {
    icon: CheckCircle,
    title: "100% do Valor",
    description: "Reembolso completo, sem taxas ou descontos"
  }
];

export const InformaticaGuarantee = () => {
  return (
    <section id="garantia" className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12 bg-gradient-to-br from-emerald-500/10 via-zinc-950 to-green-400/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">

        {/* Header Compacto */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-cyan-400 bg-clip-text text-transparent">
                RISCO ZERO
              </span>
              <span className="text-white"> PARA VOCÊ</span>
            </h2>
            <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
              Testamos nossa metodologia com mais de 150 alunos. Temos tanta confiança que oferecemos garantia total.
            </p>
          </div>
        </ScrollReveal>

        {/* Card Principal com Badge */}
        <ScrollReveal animation="zoom-in" delay={0.2}>
          <div className="max-w-4xl mx-auto mb-8">
            <Card className="bg-gradient-to-br from-emerald-500/20 to-green-400/20 backdrop-blur-sm border-2 border-emerald-500/30 text-center">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
                  7 DIAS
                </Badge>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                GARANTIA TOTAL
              </CardTitle>
              <CardDescription className="text-lg text-zinc-200 max-w-xl mx-auto">
                Se não ficar <strong className="text-emerald-400">100% satisfeito</strong>, devolvemos todo o seu dinheiro.
                Sem perguntas, sem complicações.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {guaranteeFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className="bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15 transition-colors">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <IconComponent className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-zinc-300 text-xs leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleCTAClick('guarantee')}
                className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-green-400 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
              >
                <Shield className="w-5 h-5" />
                Começar com Garantia
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Alert com Razões da Garantia */}
        <ScrollReveal animation="slide-right" delay={0.3}>
          <div className="max-w-4xl mx-auto">
          <Alert className="bg-white/5 border-white/10">
            <Shield className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-zinc-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>92% dos alunos ficam satisfeitos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>150+ profissionais aprovaram</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Conteúdo sempre atualizado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Suporte dedicado incluso</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};