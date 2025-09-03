import { 
  Trophy, 
  UserCheck, 
  Buildings, 
  Eye, 
  PlayCircle,
  ArrowRight
} from '@phosphor-icons/react';
import VideoPlayer from './VideoPlayer';
import ProjetistaGalleryWithLightbox from './ProjetistaGalleryWithLightbox';

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
      { type: "video", src: "/assets/projetista-3d/cases/carol-orofino/video externo.mp4", title: "Apresentação Externa" }
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
      { type: "video", src: "/assets/projetista-3d/cases/debora-chiquetti/animacao-sala.mp4", title: "Animação Sala de Estar" },
      { type: "video", src: "/assets/projetista-3d/cases/debora-chiquetti/animacao-painel.mp4", title: "Animação do Painel" }
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
      { type: "video", src: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_stand_202508271725.mp4", title: "Novo Projeto - Apresentação Profissional" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/generation-26c8b422-1bc0-46ca-aaf7-17479539234c.png", title: "Novo Projeto - Render Premium 1" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/generation-59a09ff0-85cb-4c30-8a15-9ea5b45ce26f.png", title: "Novo Projeto - Render Premium 2" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/Projeto Chalé Alfredo Vagner esquerda.png", title: "Projeto Chalé Alfredo Vagner" },
      { type: "video", src: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_dont_202508261226.mp4", title: "Apresentação da Empresa" },
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
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-salao-beleza.mp4", title: "Apresentação Salão de Beleza" },
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png", title: "Cozinha Planejada" },
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png", title: "Sala de Estar" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-cozinha.mp4", title: "Tour Virtual Cozinha" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-sala.mp4", title: "Tour Virtual Sala" }
    ]
  }
];

// Novo layout compacto - vídeo principal + 2 imagens à direita + demais embaixo
const renderCompactLayout = (projects, caseId) => {
  const videoItem = projects.find(item => item.type === 'video');
  const imageItems = projects.filter(item => item.type === 'image');
  const topImages = imageItems.slice(0, 2); // Primeiras 2 imagens
  const bottomItems = imageItems.slice(2); // Restante das imagens

  return (
    <div className="space-y-4">
      {/* Linha Superior: Vídeo (2/3) + 2 Imagens (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vídeo Principal - Ocupa 2 colunas */}
        {videoItem && (
          <div className="lg:col-span-2">
            <div className="group relative aspect-video bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <video
                src={videoItem.src}
                className="w-full h-full object-cover"
                muted
                loop
                onMouseEnter={(e) => e.target.play()}
                onMouseLeave={(e) => e.target.pause()}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold shadow-lg">
                  VÍDEO
                </div>
              </div>
              {/* Título do vídeo */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
                <h4 className="text-white font-bold text-lg line-clamp-2">
                  {videoItem.title}
                </h4>
              </div>
            </div>
          </div>
        )}

        {/* 2 Imagens na Direita - 1 coluna, empilhadas */}
        <div className="space-y-4">
          {topImages.map((item, index) => (
            <div key={`${caseId}-top-${index}`} className="group relative aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Título da imagem */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-medium line-clamp-1">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Linha Inferior: Itens Restantes em Grid */}
      {bottomItems.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bottomItems.map((item, index) => (
            <div key={`${caseId}-bottom-${index}`} className="group relative aspect-[4/3] bg-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              {item.type === 'video' ? (
                <>
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <PlayCircle className="w-8 h-8 text-white/80" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded font-medium">
                      VÍDEO
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
              {/* Título */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-medium line-clamp-1">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjetistaSuccessCases = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
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
            return (
              <div 
                key={case_.id} 
                className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group animate-fade-in flex flex-col"
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

                {/* Projects Gallery with Compact Layout */}
                <div className="mb-6 flex-1">
                  {renderCompactLayout(case_.projects, case_.id)}
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
    </section>
  );
};

export default ProjetistaSuccessCases;