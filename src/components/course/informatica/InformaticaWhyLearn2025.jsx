import React, { useEffect, useRef, useState } from 'react';
import {
  TrendUp,
  ArrowRight,
  Lightning,
  Briefcase,
  CurrencyDollar,
  Globe,
  Rocket
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Separator } from "../../ui/separator";
import { Alert, AlertDescription } from "../../ui/alert";
import { Progress } from "../../ui/progress";

const InformaticaWhyLearn2025 = () => {
  const sectionRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [jobProgress, setJobProgress] = useState(0);
  const [salaryProgress, setSalaryProgress] = useState(0);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');

          // Trigger stats animation when stats section becomes visible
          if (entry.target.id === 'stats-section' && !statsVisible) {
            setStatsVisible(true);
            // Animate progress bars
            setTimeout(() => {
              setJobProgress(94);
            }, 500);
            setTimeout(() => {
              setSalaryProgress(45);
            }, 800);
          }
        }
      });
    }, observerOptions);

    // Observar todos os elementos com data-scroll-reveal
    const revealElements = sectionRef.current?.querySelectorAll('[data-scroll-reveal]');
    revealElements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [statsVisible]);

  return (
    <section
      id="diferenciais"
      ref={sectionRef}
      className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-950"
    >
      <div className="container mx-auto max-w-7xl">

        {/* Header do artigo */}
        <header className="mb-12 text-center opacity-0 translate-y-8 transition-all duration-700 max-w-4xl mx-auto" data-scroll-reveal="fade-up">
          <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10 mb-6">
            <TrendUp className="w-3 h-3 mr-1" />
            Análise de Mercado • 2025
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-4 mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              O Mercado Exige
            </span>
            <span className="block text-white mt-2">
              Profissionais Digitais
            </span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            As mudanças com o computador mudaram o jeito de trabalhar
          </p>
        </header>

        {/* Conteúdo principal em layout único */}
        <div className="max-w-4xl mx-auto">
          {/* Blockquote com estatísticas principais */}
          <div
            id="stats-section"
            className="opacity-0 translate-y-8 transition-all duration-700 delay-200"
            data-scroll-reveal="slide-up"
          >
            <blockquote className="text-xl leading-relaxed text-zinc-300 border-l-4 border-blue-500 pl-6 bg-blue-500/5 py-6 rounded-r-lg mb-8">
              <strong className="text-white">As mudanças com o computador mudaram o jeito de trabalhar.</strong> Hoje,
              <mark className="bg-blue-500/20 text-blue-400 px-1 rounded mx-1">94 em cada 100 vagas de emprego</mark>
              pedem que você saiba usar o computador. E as pessoas que sabem usar bem programas como o Excel ganham
              <mark className="bg-blue-500/20 text-blue-400 px-1 rounded mx-1">quase o dobro a mais de salário</mark>
              do que seus colegas.
            </blockquote>

            {/* Progress bars das estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-300 font-medium">Vagas exigem informática</span>
                  <span className="text-blue-400 font-bold text-lg">{jobProgress}%</span>
                </div>
                <Progress
                  value={jobProgress}
                  className="h-2 bg-zinc-800 [&>*]:bg-blue-500"
                />
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-zinc-300 font-medium">Aumento salarial médio</span>
                  <span className="text-green-400 font-bold text-lg">{salaryProgress}%</span>
                </div>
                <Progress
                  value={salaryProgress}
                  className="h-2 bg-zinc-800 [&>*]:bg-green-500"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-blue-500/50 to-transparent my-12" />

          {/* Conteúdo do artigo */}
          <div className="prose prose-lg prose-invert max-w-none space-y-8">

            {/* Título da seção principal */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-400" data-scroll-reveal="fade-up">
              <h2 className="text-3xl font-bold text-white mb-12 text-center">
                Principais razões para investir em informática agora:
              </h2>
            </div>

            {/* Parágrafo 1 - Empregabilidade Garantida */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-600" data-scroll-reveal="fade-up">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/20 mr-3 sm:mr-4">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-green-400">
                  Empregabilidade garantida
                </h3>
              </div>
              <div className="mb-12 pl-4 sm:pl-16">
                <p className="text-lg leading-relaxed text-zinc-300 mb-4">
                  Empresas de todos os tipos procuram pessoas que sabem usar bem o computador. De empresas pequenas a
                  grandes, saber informática é <strong className="text-white">algo básico que pedem</strong>.
                  As mudanças digitais não são mais algo do futuro - é o que está acontecendo agora no mundo do trabalho.
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Pessoas que não sabem usar as ferramentas básicas do computador ficam em
                  <mark className="bg-green-500/20 text-green-400 px-1 rounded">desvantagem grande</mark>,
                  perdendo chances importantes de crescer e se desenvolver no trabalho.
                </p>
              </div>
            </div>

            {/* Parágrafo 2 - Aumento Salarial */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-800" data-scroll-reveal="fade-up">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-500/20 mr-3 sm:mr-4">
                  <CurrencyDollar className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-yellow-400">
                  Aumento salarial comprovado
                </h3>
              </div>
              <div className="mb-12 pl-4 sm:pl-16">
                <p className="text-lg leading-relaxed text-zinc-300 mb-4">
                  Pessoas que têm certificado em informática conseguem melhores oportunidades e salários maiores.
                  Nossos alunos contam que tiveram <mark className="bg-yellow-500/20 text-yellow-400 px-1 rounded">
                  aumentos de 30% a 60%</mark> depois que terminaram o curso.
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Esse não é só um número - é a diferença entre ficar parado e crescer no trabalho.
                  O dinheiro que você investe em aprender informática volta rápido através de promoções, bônus
                  e novas chances de trabalho que antes pareciam <strong className="text-white">impossíveis</strong>.
                </p>
              </div>
            </div>

            {/* Parágrafo 3 - Trabalho Remoto */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-1000" data-scroll-reveal="fade-up">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 mr-3 sm:mr-4">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-blue-400">
                  Trabalho remoto e híbrido
                </h3>
              </div>
              <div className="mb-12 pl-4 sm:pl-16">
                <p className="text-lg leading-relaxed text-zinc-300 mb-4">
                  Sabendo usar as ferramentas digitais, você pode trabalhar de qualquer lugar, aumentando suas
                  chances para além da sua cidade. O lugar onde você mora não é mais um problema para sua carreira.
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Empresas <mark className="bg-blue-500/20 text-blue-400 px-1 rounded">de outros países</mark> estão contratando
                  brasileiros talentosos, oferecendo salários em dólar ou euro e benefícios internacionais.
                  A flexibilidade de trabalhar de casa permite equilibrar vida pessoal e trabalho de um jeito
                  <strong className="text-white">que nunca foi possível antes</strong>.
                </p>
              </div>
            </div>

            {/* Parágrafo 4 - Empreendedorismo */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-1200" data-scroll-reveal="fade-up">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-500/20 mr-3 sm:mr-4">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-purple-400">
                  Empreendedorismo digital
                </h3>
              </div>
              <div className="mb-12 pl-4 sm:pl-16">
                <p className="text-lg leading-relaxed text-zinc-300 mb-4">
                  Crie seu próprio negócio pela internet, ofereça serviços como freelancer ou desenvolva projetos extras
                  para ganhar dinheiro. O conhecimento em informática abre portas para trabalhar por conta própria na internet,
                  onde você precisa de <strong className="text-white">pouco dinheiro para começar</strong> e pode
                  <strong className="text-white"> crescer muito</strong>.
                </p>
                <p className="text-lg leading-relaxed text-zinc-300">
                  Desde dar consultoria em Excel até gerenciar redes sociais, as possibilidades são
                  <mark className="bg-purple-500/20 text-purple-400 px-1 rounded">muitas e estão crescendo</mark>.
                  O mercado digital oferece oportunidades únicas de ganhar dinheiro que não existiam há poucos anos.
                </p>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent my-12" />

            {/* Call to action final com Alert */}
            <div className="opacity-0 translate-y-8 transition-all duration-700 delay-1400" data-scroll-reveal="fade-up">
              <Alert className="border-blue-500/20 bg-blue-500/5 mb-8">
                <Lightning className="h-5 w-5 text-blue-400" />
                <AlertDescription className="text-lg text-zinc-300 leading-relaxed">
                  <strong className="text-white">O momento de começar é agora.</strong> Cada dia sem essas
                  habilidades é uma chance perdida. O mercado não espera - aprenda agora ou fique
                  para trás. Nossa forma de ensinar já mudou a vida de centenas de pessoas em São José e região.
                </AlertDescription>
              </Alert>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={() => handleCTAClick('why-learn-article')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-lg px-8 py-6 rounded-xl font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                >
                  Quero Transformar Minha Carreira →
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                <p className="text-sm text-zinc-500 mt-4">
                  ⏰ Próximas turmas limitadas a 5 alunos cada • Certificado de 170 horas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS para animações */}
      <style jsx>{`
        [data-scroll-reveal].animate-in {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) scale(1) !important;
        }

        mark {
          background: linear-gradient(120deg, transparent 0%, transparent 40%, rgba(59, 130, 246, 0.3) 40%, rgba(59, 130, 246, 0.3) 60%, transparent 60%);
          background-size: 200% 100%;
          animation: highlight 2s ease-in-out;
        }

        @keyframes highlight {
          0% { background-position: 200% 0; }
          100% { background-position: 0 0; }
        }

        .prose mark {
          text-decoration: none;
          padding: 2px 4px;
          border-radius: 4px;
        }

        .prose em {
          font-style: italic;
          font-weight: 500;
        }

        .prose strong {
          font-weight: 600;
        }

        .prose blockquote {
          border: none;
          padding: 0;
          margin: 0;
          font-style: italic;
        }
      `}</style>
    </section>
  );
};

export default InformaticaWhyLearn2025;