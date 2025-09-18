import React from 'react';
import {
  TrendUp,
  Briefcase,
  CurrencyDollar,
  Users,
  CheckCircle,
  ArrowRight,
  Monitor,
  Brain,
  Medal,
  Clock,
  Table,
  Palette
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Separator } from "../../ui/separator";

const transformationBenefits = [
  {
    icon: TrendUp,
    title: "Aumento Salarial",
    description: "Profissionais com domínio em informática ganham em média 45% mais",
    metric: "+45% salário"
  },
  {
    icon: Briefcase,
    title: "Novas Oportunidades",
    description: "Acesso a vagas em todas as áreas que exigem conhecimento tecnológico",
    metric: "100+ vagas/mês"
  },
  {
    icon: CurrencyDollar,
    title: "Autonomia Financeira",
    description: "Crie projetos freelance usando Excel, Canva e IA para renda extra",
    metric: "R$ 2.000+ extra"
  },
  {
    icon: Users,
    title: "Reconhecimento",
    description: "Torne-se a referência em tecnologia no seu ambiente de trabalho",
    metric: "Expert reconhecido"
  }
];

const beforeAfter = {
  before: [
    "Dificuldade com computadores básicos",
    "Limitado ao papel e caneta",
    "Dependência de outros para tarefas digitais",
    "Perdido nos ambientes digitais",
    "Medo de novas tecnologias"
  ],
  after: [
    "Domínio completo de Windows 11",
    "Excel avançado e automações",
    "Criação profissional no Canva",
    "Uso estratégico de IA no trabalho",
    "Confiança total em tecnologia"
  ]
};

const journeySteps = [
  {
    step: 1,
    title: "Fundamentos",
    subtitle: "Domínio do Windows 11 e Office",
    description: "Domine completamente o sistema operacional mais usado no mundo e os fundamentos do pacote Office",
    icon: Monitor,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
    borderColor: "border-blue-500/30"
  },
  {
    step: 2,
    title: "Produtividade",
    subtitle: "Excel avançado e automações",
    description: "Crie planilhas profissionais, dashboards e automações que impressionam gestores",
    icon: Table,
    color: "from-cyan-500 to-cyan-600",
    bgColor: "from-cyan-500/10 to-cyan-600/10",
    borderColor: "border-cyan-500/30"
  },
  {
    step: 3,
    title: "Criatividade",
    subtitle: "Canva profissional e IA",
    description: "Desenvolva habilidades de design e aprenda a usar IA para potencializar seu trabalho",
    icon: Palette,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
    borderColor: "border-purple-500/30"
  },
  {
    step: "✓",
    title: "Certificação",
    subtitle: "Expert em informática moderna",
    description: "Receba seu certificado de 170 horas e torne-se um profissional reconhecido no mercado",
    icon: Medal,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "from-yellow-500/10 to-yellow-600/10",
    borderColor: "border-yellow-500/30"
  }
];

export const InformaticaTransformationPromise = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-blue-500/10 via-zinc-950 to-cyan-400/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
              SUA VIDA
            </span>
            <br />
            <span className="text-white">ANTES E DEPOIS</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">
              DO CURSO
            </span>
          </h2>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Veja como você estará após dominar completamente a informática moderna.
            Esta não é apenas uma promessa, é nossa garantia baseada em resultados reais.
          </p>
        </div>

        {/* Antes vs Depois */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">

          {/* ANTES */}
          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-4 md:p-8">
            <div className="text-center mb-4 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Monitor className="w-6 h-6 md:w-8 md:h-8 text-white opacity-50" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-2">ANTES DO CURSO</h3>
              <p className="text-sm md:text-base text-zinc-400">Limitações que você vai deixar para trás</p>
            </div>

            <div className="space-y-2 md:space-y-4">
              {beforeAfter.before.map((item, index) => (
                <div key={index} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-red-500/5 rounded-lg border border-red-500/10">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 md:mt-2 flex-shrink-0" />
                  <span className="text-sm md:text-base text-zinc-300 leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DEPOIS */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-4 md:p-8">
            <div className="text-center mb-4 md:mb-8">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Brain className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-green-400 mb-2">DEPOIS DO CURSO</h3>
              <p className="text-sm md:text-base text-zinc-400">Suas novas habilidades e oportunidades</p>
            </div>

            <div className="space-y-2 md:space-y-4">
              {beforeAfter.after.map((item, index) => (
                <div key={index} className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-zinc-300 font-medium leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefícios da Transformação */}
        <div className="mb-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="text-white">O que você </span>
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CONQUISTA
            </span>
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {transformationBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4 md:p-6 text-center hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  <h4 className="text-sm sm:text-lg md:text-xl font-bold text-white mb-2">{benefit.title}</h4>
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">{benefit.description}</p>

                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-2 sm:px-4 py-1 sm:py-2">
                    <span className="text-blue-300 font-semibold text-xs sm:text-sm">{benefit.metric}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nova Timeline de Transformação - Mobile First */}
        <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 md:p-8 mb-16">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Sua Jornada de Transformação
            </h3>
            <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
              Um caminho estruturado e progressivo que te levará do básico ao expert em informática moderna
            </p>
          </div>

          {/* Mobile Layout - Vertical Timeline */}
          <div className="block md:hidden">
            <div className="relative">
              {/* Linha vertical conectora */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 via-purple-500 to-yellow-500"></div>

              <div className="space-y-6">
                {journeySteps.map((step, index) => {
                  const IconComponent = step.icon;

                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Ícone da etapa */}
                      <div className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center flex-shrink-0 ring-4 ring-zinc-900`}>
                        {typeof step.step === 'number' ? (
                          <span className="text-white font-bold text-sm">{step.step}</span>
                        ) : (
                          <IconComponent className="w-6 h-6 text-white" weight="fill" />
                        )}
                      </div>

                      {/* Card da etapa */}
                      <div className={`flex-1 bg-gradient-to-br ${step.bgColor} backdrop-blur-sm border ${step.borderColor} rounded-xl p-4`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold text-lg">{step.title}</h4>
                            <p className="text-zinc-300 text-sm font-medium">{step.subtitle}</p>
                          </div>
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
                            {typeof step.step === 'number' ? `Etapa ${step.step}` : 'Concluído'}
                          </Badge>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>

                        {/* Progress indicator para mobile */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <span>Progresso</span>
                            <div className="flex-1">
                              <Progress value={(index + 1) * 25} className="h-1" />
                            </div>
                            <span>{(index + 1) * 25}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Layout - Horizontal Timeline */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Linha conectora horizontal na altura dos ícones */}
              <div className="absolute top-[56px] left-[12.5%] right-[12.5%] h-1 z-0">
                <div className="absolute inset-0 bg-zinc-700/50 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 via-purple-500 to-yellow-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-4 gap-6 relative">
                {journeySteps.map((step, index) => {
                  const IconComponent = step.icon;
                  const isLast = index === journeySteps.length - 1;

                  return (
                    <div key={index} className="relative group">
                      {/* Removendo linha conectora duplicada entre cards */}

                      {/* Card da etapa */}
                      <div className={`relative bg-gradient-to-br ${step.bgColor} backdrop-blur-sm border ${step.borderColor} rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:border-opacity-60 z-10`}>
                        {/* Ícone com conexão visual */}
                        <div className="relative">
                          {/* Ponto de conexão */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-zinc-900 opacity-50"></div>

                          <div className={`relative w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-4 ring-zinc-900 shadow-lg`}>
                            {typeof step.step === 'number' ? (
                              <span className="text-white font-bold text-lg">{step.step}</span>
                            ) : (
                              <IconComponent className="w-8 h-8 text-white" weight="fill" />
                            )}
                          </div>

                          {/* Indicador de progresso abaixo do ícone */}
                          {index > 0 && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2">
                              <div className="text-xs text-zinc-500 font-medium">
                                {(index + 1) * 25}% concluído
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="space-y-2 mt-6">
                          <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs mb-2">
                            {typeof step.step === 'number' ? `Etapa ${step.step}` : 'Certificação'}
                          </Badge>
                          <h4 className="text-white font-bold text-lg">{step.title}</h4>
                          <p className="text-zinc-300 text-sm font-medium">{step.subtitle}</p>
                          <Separator className="my-3 bg-zinc-700/50" />
                          <p className="text-zinc-400 text-xs leading-relaxed">{step.description}</p>

                          {/* Mini progress bar dentro do card */}
                          <div className="pt-3">
                            <Progress value={(index + 1) * 25} className="h-1 bg-zinc-800" />
                          </div>
                        </div>

                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress summary para desktop */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-4 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-full px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  <span className="text-zinc-400 text-sm">Jornada completa</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-zinc-700" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span className="text-zinc-400 text-sm">170 horas certificadas</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-zinc-700" />
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-yellow-400" weight="fill" />
                  <span className="text-zinc-400 text-sm">Expert certificado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Visual - Reconhecimento */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 rounded-2xl blur-xl" />
                <img
                  src="/assets/informatica-nova/transformacao/aluno-recebendo-premio.jpg"
                  alt="Aluno recebendo reconhecimento na Escola Habilidade"
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-2 mb-4">
                <Medal className="w-6 h-6 text-yellow-400" weight="fill" />
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  Reconhecimento
                </Badge>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                <span className="text-white">Seus esforços</span><br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  RECONHECIDOS
                </span>
              </h3>

              <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                Na Escola Habilidade, cada conquista é celebrada. Reconhecemos o
                progresso dos nossos alunos e incentivamos a excelência em cada etapa.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Certificado oficial de 170 horas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Reconhecimento por projetos de destaque</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Networking com outros profissionais</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA de Transformação */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-400/20 backdrop-blur-sm border-purple-500/30">
          <CardContent className="text-center p-4 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Pronto para sua <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">TRANSFORMAÇÃO</span>?
            </h3>

            <p className="text-zinc-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Esta é sua oportunidade de sair da zona de conforto e dominar as tecnologias
              que vão definir seu sucesso profissional nos próximos anos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => handleCTAClick('transformation')}
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-400 hover:from-purple-600 hover:to-cyan-500 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 text-sm sm:text-base md:text-lg font-bold px-4 sm:px-6 md:px-8 py-3 sm:py-4"
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Iniciar Minha Transformação</span>
                <span className="sm:hidden">Iniciar Transformação</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs sm:text-sm">
                  📅 Turmas mensais
                </Badge>
                <div className="text-zinc-300 text-xs sm:text-sm font-medium">
                  Próxima turma em breve
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};