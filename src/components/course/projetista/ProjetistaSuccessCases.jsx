import { 
  Trophy, 
  UserCheck, 
  Buildings, 
  Eye, 
  PlayCircle,
  ArrowRight
} from '@phosphor-icons/react';

const successCases = [
  {
    id: 1,
    name: "Carol Orofino",
    profession: "Designer de Interiores",
    company: "Freelancer",
    testimonial: "Renders profissionais que aumentaram contratos em 300%",
    icon: UserCheck,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/banheiro.png", title: "Banheiro" },
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/cozinha.png", title: "Cozinha" },
      { type: "image", src: "/assets/projetista-3d/cases/carol-orofino/quarto-1.png", title: "Quarto 1" },
      { type: "video", src: "/assets/projetista-3d/cases/carol-orofino/video-externo.mp4", title: "Vídeo Técnico" }
    ]
  },
  {
    id: 2,
    name: "Lauren",
    profession: "Móveis Planejados",
    company: "Legnomobilli Móveis",
    testimonial: "Domínio total em armários e móveis sob medida",
    icon: UserCheck,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/lauren/armario.jpeg", title: "Armário Render" },
      { type: "video", src: "/assets/projetista-3d/cases/lauren/video-armario.mp4", title: "Vídeo Animado" }
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
      { type: "video", src: "/assets/projetista-3d/cases/elton-santa-madeira/video-empresa.mp4", title: "Vídeo Empresa" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/casa-1.jpeg", title: "Casa 1" },
      { type: "image", src: "/assets/projetista-3d/cases/elton-santa-madeira/casa-2.jpeg", title: "Casa 2" }
    ]
  },
  {
    id: 4,
    name: "Patrícia",
    profession: "Empresária",
    company: "Ricardo Móveis",
    testimonial: "Renders que transformaram minha loja de móveis",
    icon: Buildings,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
    projects: [
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png", title: "Cozinha" },
      { type: "image", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png", title: "Sala" },
      { type: "video", src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-cozinha.mp4", title: "Vídeo Cozinha" }
    ]
  }
];

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
                className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group animate-fade-in"
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

                {/* Projects Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {case_.projects.slice(0, 4).map((project, projectIndex) => (
                    <div 
                      key={projectIndex}
                      className="relative aspect-video bg-zinc-700 rounded-lg overflow-hidden group/project"
                    >
                      {project.type === 'video' ? (
                        <div className="relative w-full h-full bg-zinc-800 flex items-center justify-center">
                          <PlayCircle className="w-12 h-12 text-white/80" />
                          <div className="absolute inset-0 bg-black/40" />
                          <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                            {project.title}
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img 
                            src={project.src}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                            {project.title}
                          </span>
                        </div>
                      )}
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover/project:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* View More Button */}
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-lg hover:border-purple-400 transition-colors duration-300 group/btn">
                  <Eye className="w-4 h-4 text-zinc-400 group-hover/btn:text-purple-400" />
                  <span className="text-sm font-medium text-zinc-400 group-hover/btn:text-purple-400">
                    Ver Portfólio Completo
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-400 group-hover/btn:text-purple-400 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </button>
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