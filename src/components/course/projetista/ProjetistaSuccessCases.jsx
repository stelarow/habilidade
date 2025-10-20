import {
  Trophy,
  UserCheck,
  Buildings,
  Eye,
  PlayCircle,
  ArrowRight,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import ProjetistaGalleryWithLightbox from './ProjetistaGalleryWithLightbox';
import MediaModal from '../../shared/MediaModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '../../ui/carousel';

const successCases = [
  {
    id: 1,
    name: "Carol Orofino",
    profession: "Designer de Interiores",
    company: "Freelancer",
    testimonial: "Renders profissionais que encantam os clientes",
    icon: UserCheck,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/cena banheiro.png", title: "Banheiro Moderno" },
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/cena cozinha.png", title: "Cozinha Planejada" },
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/cena quarto 1.png", title: "Quarto Infantil" },
      { type: "video", src: "/assets/projetista-3d/cases/carol-orofino/video externo.mp4", poster: "/assets/projetista-3d/cases/carol-orofino/video externo-poster.jpg", title: "Apresentação Externa" }
    ]
  },
  {
    id: 2,
    name: "Debora Chiquetti",
    profession: "Móveis Planejados",
    company: "Legnomobilli Móveis",
    testimonial: "Domínio total em móveis planejados",
    icon: UserCheck,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/debora-chiquetti/sala-estar.png", title: "Sala de Estar Planejada" },
      { type: "image", src: "/assets/projetista-3d/cases/debora-chiquetti/painel-sala.png", title: "Painel Sala de Estar" },
      { type: "video", src: "/assets/projetista-3d/cases/debora-chiquetti/animacao-sala.mp4", poster: "/assets/projetista-3d/cases/debora-chiquetti/animacao-sala-poster.jpg", title: "Animação Sala de Estar" },
      { type: "video", src: "/assets/projetista-3d/cases/debora-chiquetti/animacao-painel.mp4", poster: "/assets/projetista-3d/cases/debora-chiquetti/animacao-painel-poster.jpg", title: "Animação do Painel" }
    ]
  },
  {
    id: 3,
    name: "Elton",
    profession: "Empresário",
    company: "Santa Madeira Casas",
    testimonial: "Projetos residenciais profissionais para minha empresa",
    icon: Buildings,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
    projects: [
      { type: "video", src: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725.mp4", poster: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725-poster.jpg", title: "Novo Projeto - Apresentação Profissional" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/generation-26c8b422-1bc0-46ca-aaf7-17479539234c.png", title: "Novo Projeto - Render Premium 1" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/generation-59a09ff0-85cb-4c30-8a15-9ea5b45ce26f.png", title: "Novo Projeto - Render Premium 2" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/Projeto Chalé Alfredo Vagner esquerda.png", title: "Projeto Chalé Alfredo Vagner" },
      { type: "video", src: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_dont_202508261226.mp4", poster: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_dont_202508261226-poster.jpg", title: "Apresentação da Empresa" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.19.jpeg", title: "Projeto Residencial 1" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.20.jpeg", title: "Projeto Residencial 2" }
    ]
  },
  {
    id: 4,
    name: "Patrícia",
    profession: "Empresária",
    company: "Ricardo Móveis",
    testimonial: "Renders que transformaram minha marcenária de móveis",
    icon: Buildings,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/salao-beleza.png", title: "Projeto Salão de Beleza" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza.mp4", poster: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza-poster.jpg", title: "Apresentação Salão de Beleza" },
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png", title: "Cozinha Planejada" },
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png", title: "Sala de Estar" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-cozinha.mp4", poster: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-cozinha-poster.jpg", title: "Tour Virtual Cozinha" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-sala.mp4", poster: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-sala-poster.jpg", title: "Tour Virtual Sala" }
    ]
  }
];

// Componente de Badge para contador de projetos
const ProjectCounter = ({ current, total, accentColor }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-purple-400/30`}>
    <span className="text-xs font-semibold text-white">
      {current} / {total} projetos
    </span>
  </div>
);

export const ProjetistaSuccessCases = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    items: [],
    currentIndex: 0
  });

  // Estado para rastrear índice atual de cada carousel
  const [carouselIndexes, setCarouselIndexes] = useState(
    successCases.reduce((acc, case_) => {
      acc[case_.id] = 0;
      return acc;
    }, {})
  );

  const handleMediaClick = (caseProjects, itemIndex) => {
    setModalState({
      isOpen: true,
      items: caseProjects,
      currentIndex: itemIndex
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleNavigateModal = (newIndex) => {
    setModalState(prev => ({ ...prev, currentIndex: newIndex }));
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 overflow-x-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Trophy className="w-4 h-4" />
            4 TRAJETÓRIAS DE SUCESSO
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">CONHEÇA ALUNOS</span>
            <br />
            <span className="text-white">QUE SE DESTACAM NO MERCADO</span>
          </h2>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            4 perfis diferentes, 4 histórias de transformação.
            Freelancers e empresários que mudaram de vida.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {successCases.map((case_, index) => {
            const IconComponent = case_.icon;
            const currentIndex = carouselIndexes[case_.id] || 0;

            return (
              <div
                key={case_.id}
                className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group animate-fade-in flex flex-col overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${case_.bgColor} border ${case_.borderColor}`}>
                    <IconComponent className={`w-6 h-6 ${case_.color}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {case_.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-1">
                      {case_.profession} • {case_.company}
                    </p>
                    <p className={`text-sm font-medium ${case_.color}`}>
                      "{case_.testimonial}"
                    </p>
                  </div>
                </div>

                {/* Carousel de Projetos */}
                <div className="mb-4 flex-1 relative overflow-hidden w-full max-w-full">
                  <Carousel
                    className="w-full max-w-full"
                    opts={{
                      loop: true,
                      align: 'start',
                      containScroll: 'trimSnaps'
                    }}
                    setApi={(api) => {
                      if (api) {
                        api.on('select', () => {
                          setCarouselIndexes(prev => ({
                            ...prev,
                            [case_.id]: api.selectedScrollSnap()
                          }));
                        });
                      }
                    }}
                  >
                    <CarouselContent className="!ml-0 w-full max-w-full">
                      {case_.projects.map((project, projectIndex) => (
                        <CarouselItem key={projectIndex} className="!pl-0 w-full max-w-full">
                          <div className="w-full max-w-full px-0">
                            <div
                              className="w-full max-w-full cursor-pointer group/item"
                              onClick={() => handleMediaClick(case_.projects, projectIndex)}
                            >
                              {project.type === 'video' ? (
                                <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                                <VideoPlayer
                                  src={project.src}
                                  poster={project.poster}
                                  title={project.title}
                                  muted={true}
                                  autoPlay={false}
                                  controls={false}
                                  className="hover:scale-105 transition-transform duration-300"
                                  aspectRatio="aspect-video"
                                />
                                {/* Overlay com ícone de play */}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" weight="fill" />
                                </div>
                              </div>
                            ) : (
                              <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                                <img
                                  src={project.src}
                                  alt={project.title}
                                  title={`${project.title} - Projeto profissional desenvolvido no curso Projetista 3D`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                {/* Overlay hover */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                              </div>
                            )}

                            {/* Título do projeto */}
                            <div className="mt-3 px-1">
                              <p className="text-sm font-medium text-white line-clamp-1">
                                {project.title}
                              </p>
                            </div>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    {/* Setas customizadas com gradiente */}
                    <CarouselPrevious
                      className="left-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-none text-white shadow-lg"
                    />
                    <CarouselNext
                      className="right-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 border-none text-white shadow-lg"
                    />
                  </Carousel>
                </div>

                {/* Badge contador + Dots */}
                <div className="flex items-center justify-between mt-4">
                  <ProjectCounter
                    current={currentIndex + 1}
                    total={case_.projects.length}
                    accentColor={case_.color}
                  />

                  {/* Dots indicadores */}
                  <div className="flex gap-1.5">
                    {case_.projects.map((_, dotIndex) => (
                      <div
                        key={dotIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          dotIndex === currentIndex
                            ? `${case_.color.replace('text-', 'bg-')} w-6`
                            : 'bg-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Seu nome pode ser o próximo dessa lista
            </h3>
            <p className="text-zinc-400 mb-6">
              Junte-se aos nossos alunos de sucesso e transforme sua carreira com projetos profissionais
            </p>
            <a 
              href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Vi%20os%20casos%20de%20sucesso%20e%20quero%20saber%20mais%20sobre%20o%20Curso%20de%20Projetista%203D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1"
            >
              <Trophy className="inline w-5 h-5 mr-2" />
              QUERO ESSES RESULTADOS TAMBÉM
              <ArrowRight className="inline w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Modal para visualização ampliada */}
      <MediaModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        items={modalState.items}
        currentIndex={modalState.currentIndex}
        onNavigate={handleNavigateModal}
      />
    </section>
  );
};

export default ProjetistaSuccessCases;