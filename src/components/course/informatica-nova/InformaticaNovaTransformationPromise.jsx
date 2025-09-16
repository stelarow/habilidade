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
  Clock
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";

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

export const InformaticaNovaTransformationPromise = () => {
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
        <div className="mb-16">
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

        {/* Timeline de Transformação */}
        <div className="bg-gradient-to-br from-zinc-800/30 to-zinc-900/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Sua Jornada de Transformação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Etapa 1</h4>
              <p className="text-zinc-400 text-sm">Domínio do Windows 11 e fundamentos do Office</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Etapa 2</h4>
              <p className="text-zinc-400 text-sm">Excel avançado e automações que impressionam</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Etapa 3</h4>
              <p className="text-zinc-400 text-sm">Canva profissional e primeiros projetos de IA</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Medal className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">Certificação</h4>
              <p className="text-zinc-400 text-sm">Expert completo em informática moderna</p>
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
                  <span className="text-zinc-200">Certificado oficial de 184 horas</span>
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
                <span className="hidden sm:inline">COMEÇAR TRANSFORMAÇÃO AGORA</span>
                <span className="sm:hidden">COMEÇAR AGORA</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                <Badge variant="destructive" className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-xs sm:text-sm">
                  ⚡ Vagas limitadas
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