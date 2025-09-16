import React, { useState } from 'react';
import { X, CaretLeft, CaretRight, Play, ArrowsOut } from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

const portfolioItems = [
  {
    id: 1,
    title: "Planilha Financeira Completa",
    category: "Excel Avançado",
    src: "/assets/informatica-nova/imagens-projeto/planilha-financeira.png",
    alt: "Planilha financeira completa com gráficos e dashboards"
  },
  {
    id: 2,
    title: "Apresentação Corporativa",
    category: "PowerPoint",
    src: "/assets/informatica-nova/imagens-projeto/apresentacao-corporativa.png",
    alt: "Apresentação PowerPoint profissional"
  },
  {
    id: 3,
    title: "Documento Profissional",
    category: "Word",
    src: "/assets/informatica-nova/imagens-projeto/documento-word.png",
    alt: "Documento Word formatado profissionalmente"
  },
  {
    id: 4,
    title: "Design de Post",
    category: "Canva",
    src: "/assets/informatica-nova/imagens-projeto/design-canva.png",
    alt: "Post criado no Canva para redes sociais"
  },
  {
    id: 5,
    title: "Dashboard Excel",
    category: "Excel Avançado",
    src: "/assets/informatica-nova/imagens-projeto/dashboard-excel.png",
    alt: "Dashboard interativo no Excel"
  },
  {
    id: 6,
    title: "Automação com IA",
    category: "Inteligência Artificial",
    src: "/assets/informatica-nova/imagens-projeto/automacao-ia.png",
    alt: "Projeto de automação usando IA"
  },
  {
    id: 7,
    title: "Organização Windows 11",
    category: "Windows 11",
    src: "/assets/informatica-nova/imagens-projeto/organizacao-windows.png",
    alt: "Sistema Windows 11 organizado"
  },
  {
    id: 8,
    title: "Logotipo Profissional",
    category: "Canva",
    src: "/assets/informatica-nova/imagens-projeto/logotipo-canva.png",
    alt: "Logotipo criado no Canva"
  },
  {
    id: 9,
    title: "Dashboard Real de Aluno",
    category: "Excel Avançado",
    src: "/assets/informatica-nova/imagens-projeto/dashboard-excel-real.png",
    alt: "Dashboard real criado por aluno no curso"
  }
];

export const InformaticaNovaPortfolioSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(portfolioItems[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % portfolioItems.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(portfolioItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? portfolioItems.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(portfolioItems[prevIndex]);
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-950 to-zinc-900">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">PROJETOS</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">
              REAIS
            </span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Veja os projetos que nossos alunos desenvolvem durante o curso. 
            Do Excel básico à Inteligência Artificial aplicada.
          </p>
        </div>

        {/* Componente do Card reutilizável */}
        {(() => {
          const ProjectCard = ({ item, index }) => (
            <div
              className="group relative bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full"
              onClick={() => openLightbox(index)}
            >
              {/* Imagem */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-xs text-blue-300 mb-1 font-medium">
                    {item.category}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                </div>

                {/* Ícone de ampliar */}
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ArrowsOut className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <div className="mb-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {portfolioItems.map((item, index) => (
                    <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <ProjectCard item={item} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          );
        })()}

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={() => handleCTAClick('portfolio')}
            className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
          >
            <Play className="w-5 h-5" />
            CRIAR MEUS PRÓPRIOS PROJETOS
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            
            {/* Botão fechar */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navegação esquerda */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <CaretLeft className="w-6 h-6" />
            </button>

            {/* Navegação direita */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <CaretRight className="w-6 h-6" />
            </button>

            {/* Imagem principal */}
            <div className="bg-zinc-900 rounded-xl overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              
              {/* Informações da imagem */}
              <div className="p-6 bg-zinc-800/50 backdrop-blur-sm">
                <div className="text-blue-300 text-sm mb-2 font-medium">
                  {selectedImage.category}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {selectedImage.title}
                </h3>
              </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center gap-2 mt-6">
              {portfolioItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-400' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};