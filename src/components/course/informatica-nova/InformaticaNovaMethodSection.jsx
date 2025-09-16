import React from 'react';
import { Users, UserCheck, Target, Star, CheckCircle, X } from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const InformaticaNovaMethodSection = () => {
  const differentials = [
    {
      icon: Users,
      title: "Turmas Pequenas",
      subtitle: "Máximo 5 alunos",
      description: "Ambiente intimista onde cada aluno recebe atenção individual",
      highlight: "5x mais atenção"
    },
    {
      icon: UserCheck,
      title: "Professor em Sala",
      subtitle: "100% presencial",
      description: "Professor dedicado presente fisicamente em todas as aulas",
      highlight: "Suporte imediato"
    },
    {
      icon: Target,
      title: "Acompanhamento Individual",
      subtitle: "Personalizado",
      description: "Ritmo de aprendizado respeitado com feedback constante",
      highlight: "Seu ritmo"
    }
  ];

  const comparison = {
    traditional: {
      title: "Escola Tradicional",
      items: [
        { text: "Turmas de 20-30 alunos", negative: true },
        { text: "Professor dividido", negative: true },
        { text: "Ritmo padronizado", negative: true },
        { text: "Dúvidas ficam para depois", negative: true }
      ]
    },
    habilidade: {
      title: "Escola Habilidade",
      items: [
        { text: "Máximo 5 alunos por turma", negative: false },
        { text: "Professor dedicado", negative: false },
        { text: "Acompanhamento personalizado", negative: false },
        { text: "Dúvidas resolvidas na hora", negative: false }
      ]
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400" weight="fill" />
            <Star className="w-6 h-6 text-yellow-400" weight="fill" />
            <Star className="w-6 h-6 text-yellow-400" weight="fill" />
            <Star className="w-6 h-6 text-yellow-400" weight="fill" />
            <Star className="w-6 h-6 text-yellow-400" weight="fill" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="text-white">Por que somos uma escola</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 bg-clip-text text-transparent">
              nota 5 estrelas no Google?
            </span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto">
            Nosso método exclusivo com turmas reduzidas garante que cada aluno 
            receba a atenção necessária para dominar completamente a informática
          </p>
        </div>

        {/* Seção Visual - Metodologia em Ação */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                <span className="text-white">Metodologia</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  na Prática
                </span>
              </h3>
              <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                Veja como nossos alunos aprendem fazendo. Cada exercício é acompanhado
                de perto pelo professor, garantindo que você domine cada ferramenta.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Prática desde a primeira aula</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Exercícios do mundo real</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-zinc-200">Correção imediata de erros</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-2xl blur-xl" />
                <img
                  src="/assets/informatica-nova/metodologia/aluno-praticando-photoshop.jpg"
                  alt="Aluno praticando Photoshop em aula presencial"
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-20">
          {differentials.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} className={`bg-zinc-900/50 border-zinc-800 hover:border-blue-500/30 transition-all duration-300 group ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                  <div className="mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs sm:text-sm">
                      {item.highlight}
                    </Badge>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="text-blue-400 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    {item.subtitle}
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-sm sm:text-base">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparação */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Escola Tradicional */}
          <Card className="bg-red-950/20 border-red-500/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-red-400 mb-2">
                  {comparison.traditional.title}
                </h3>
                <p className="text-red-300/70">Como funciona na maioria das escolas</p>
              </div>
              
              <div className="space-y-4">
                {comparison.traditional.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Escola Habilidade */}
          <Card className="bg-green-950/20 border-green-500/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-green-400 mb-2">
                  {comparison.habilidade.title}
                </h3>
                <p className="text-green-300/70">Nossa metodologia exclusiva</p>
              </div>
              
              <div className="space-y-4">
                {comparison.habilidade.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-green-200">{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Bottom */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-400/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Experimente a diferença de aprender em uma turma pequena
            </h3>
            <p className="text-zinc-300 mb-6">
              Junte-se aos 92% de alunos que avaliam nossa escola com 5 estrelas
            </p>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              ⭐ Próxima turma: máximo 5 alunos
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformaticaNovaMethodSection;