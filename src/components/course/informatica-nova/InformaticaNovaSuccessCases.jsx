import React from 'react';
import { Medal, TrendUp, Users, CheckCircle, ArrowRight } from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { handleCTAClick } from '../../../utils/ctaUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const successStories = [
  {
    id: 1,
    image: "/assets/informatica-nova/cases/leticia-mendes/foto.jpg",
    title: "Conquista Profissional",
    description: "Aluna que conquistou nova posição no mercado de trabalho após dominar as ferramentas de informática.",
    achievement: "Nova Oportunidade",
    icon: TrendUp
  },
  {
    id: 2,
    image: "/assets/informatica-nova/cases/mateus-oliveira/foto.jpg",
    title: "Certificação Completa",
    description: "Estudante que completou todo o programa e agora domina Excel, Word, PowerPoint e ferramentas modernas.",
    achievement: "Certificado 170h",
    icon: Medal
  },
  {
    id: 3,
    image: "/assets/informatica-nova/cases/gabriela-costa-silva/foto.jpg",
    title: "Transformação Digital",
    description: "Profissional que saiu do básico e hoje é referência em tecnologia em seu ambiente de trabalho.",
    achievement: "Expert Reconhecido",
    icon: Users
  }
];

export const InformaticaNovaSuccessCases = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Medal className="w-6 h-6 text-green-400" weight="fill" />
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Casos de Sucesso
            </Badge>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">HISTÓRIAS DE</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              TRANSFORMAÇÃO
            </span>
          </h2>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Conheça algumas das transformações que nossos alunos vivenciaram
            após completar o curso de Informática Fundamental.
          </p>
        </div>

        {/* Success Stories Carousel */}
        <div className="mb-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {successStories.map((story) => {
                const IconComponent = story.icon;
                return (
                  <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <Card className="bg-zinc-800/50 border-zinc-700/50 hover:border-green-500/50 transition-all duration-300 group h-full">
                      <CardContent className="p-6">
                        {/* Photo */}
                        <div className="relative mb-6">
                          <AspectRatio ratio={9 / 16} className="w-full overflow-hidden rounded-xl">
                            <img
                              src={story.image}
                              alt={story.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </AspectRatio>

                          {/* Achievement Badge */}
                          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {story.achievement}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center pt-2">
                          <h3 className="text-xl font-bold text-white mb-3">
                            {story.title}
                          </h3>

                          <p className="text-zinc-300 leading-relaxed text-sm">
                            {story.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <div className="text-zinc-400">Alunos Certificados</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">92%</div>
            <div className="text-zinc-400">Taxa de Satisfação</div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">5/5</div>
            <div className="text-zinc-400">Avaliação Google</div>
          </div>
        </div>

        {/* Success Pillars */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Os Pilares do Nosso Sucesso
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Método Comprovado</h4>
              <p className="text-zinc-400 text-sm">Turmas pequenas com acompanhamento individual</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Conteúdo Atualizado</h4>
              <p className="text-zinc-400 text-sm">Ferramentas modernas incluindo IA e Canva</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">Suporte Completo</h4>
              <p className="text-zinc-400 text-sm">Acompanhamento até a certificação final</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => handleCTAClick('success-cases')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-400 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Medal className="w-5 h-5" />
              Quero Ser o Próximo Caso de Sucesso
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InformaticaNovaSuccessCases;