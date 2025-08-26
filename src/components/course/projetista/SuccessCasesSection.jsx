import React, { useState } from 'react';
import { 
  Trophy, 
  Star, 
  UserCheck, 
  Buildings, 
  Eye,
  PlayCircle,
  Camera
} from '@phosphor-icons/react';
import OptimizedImage from '../../shared/OptimizedImage';
import OptimizedVideo from '../../shared/OptimizedVideo';

const SuccessCasesSection = () => {
  const [activeCase, setActiveCase] = useState(0);

  const successCases = [
    {
      name: "CAROL OROFINO",
      role: "Designer de Interiores",
      icon: <UserCheck className="w-6 h-6 text-purple-400" />,
      quote: "Renders profissionais que aumentaram contratos em 300%",
      description: "Freelancer especializada em projetos residenciais",
      projects: [
        {
          title: "Banheiro Fotorrealístico",
          image: "/assets/projetista-3d/cases/carol-orofino/cena banheiro.png",
          type: "render"
        },
        {
          title: "Cozinha Moderna",
          image: "/assets/projetista-3d/cases/carol-orofino/cena cozinha.png", 
          type: "render"
        },
        {
          title: "Quarto Principal",
          image: "/assets/projetista-3d/cases/carol-orofino/cena quarto.png",
          type: "render"
        },
        {
          title: "Vídeo Técnico Profissional",
          video: "/assets/projetista-3d/cases/carol-orofino/video externo.mp4",
          poster: "/assets/projetista-3d/cases/carol-orofino/cena quarto 1.png",
          type: "video"
        }
      ]
    },
    {
      name: "LAUREN",
      role: "Legnomobilli Móveis Planejados",
      icon: <UserCheck className="w-6 h-6 text-blue-400" />,
      quote: "Domínio total em armários e móveis sob medida",
      description: "Especialista em móveis planejados com animações 3D",
      projects: [
        {
          title: "Armário Planejado",
          image: "/assets/projetista-3d/cases/lauren/armario.jpeg",
          type: "render"
        },
        {
          title: "Animação do Armário",
          video: "/assets/projetista-3d/cases/lauren/video-armario.mp4",
          poster: "/assets/projetista-3d/cases/lauren/armario.jpeg",
          type: "video"
        }
      ]
    },
    {
      name: "ELTON",
      role: "EMPRESA SANTA MADEIRA CASAS",
      icon: <Buildings className="w-6 h-6 text-green-400" />,
      quote: "Projetos residenciais profissionais para minha empresa",
      description: "Empresário que revolucionou sua construtora",
      projects: [
        {
          title: "Casa Residencial - Projeto 1",
          image: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.19.jpeg",
          type: "render"
        },
        {
          title: "Casa Residencial - Projeto 2", 
          image: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.20.jpeg",
          type: "render"
        },
        {
          title: "Vídeo Empresarial",
          video: "/assets/projetista-3d/cases/elton-santa-madeira/The_camera_dont_202508261226.mp4",
          poster: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.19.jpeg",
          type: "video"
        }
      ]
    },
    {
      name: "PATRÍCIA", 
      role: "EMPRESA RICARDO MÓVEIS",
      icon: <Buildings className="w-6 h-6 text-cyan-400" />,
      quote: "Renders que transformaram minha loja de móveis",
      description: "Empresária que modernizou sua loja com renderizações",
      projects: [
        {
          title: "Cozinha Comercial",
          image: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png",
          type: "render"
        },
        {
          title: "Sala Comercial",
          image: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png",
          type: "render"
        },
        {
          title: "Vídeo da Cozinha",
          video: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-cozinha.mp4", 
          poster: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png",
          type: "video"
        },
        {
          title: "Vídeo da Sala",
          video: "/assets/projetista-3d/cases/patricia-ricardo-moveis/video-sala.mp4",
          poster: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png", 
          type: "video"
        }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-blue-950/10 to-zinc-950">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              CASOS DE SUCESSO
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CONHEÇA ALUNOS QUE SE DESTACAM NO MERCADO - 4 TRAJETÓRIAS DIFERENTES
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          
          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {successCases.map((case_item, index) => (
              <button
                key={index}
                onClick={() => setActiveCase(index)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeCase === index 
                    ? 'border-purple-500 bg-gradient-to-r from-purple-900/30 to-blue-900/30' 
                    : 'border-gray-700 bg-gray-900/20 hover:border-purple-400'
                }`}
              >
                <div className="text-center space-y-2">
                  {case_item.icon}
                  <h3 className="font-bold text-white text-sm">{case_item.name}</h3>
                  <p className="text-xs text-gray-400">{case_item.role}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Case Content */}
          <div className="bg-gradient-to-r from-gray-900/40 to-gray-800/40 backdrop-blur rounded-2xl p-8 border border-gray-700">
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                {successCases[activeCase].icon}
                <h3 className="text-3xl font-black text-white">
                  {successCases[activeCase].name}
                </h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-xl text-purple-400 font-semibold">
                  {successCases[activeCase].role}
                </p>
                <blockquote className="text-lg text-green-400 italic">
                  "{successCases[activeCase].quote}"
                </blockquote>
                <p className="text-gray-300">
                  {successCases[activeCase].description}
                </p>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {successCases[activeCase].projects.map((project, projectIndex) => (
                <div key={projectIndex} className="group">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-600 group-hover:border-purple-500 transition-all duration-300">
                    
                    {project.type === 'video' ? (
                      <div className="relative">
                        <OptimizedVideo
                          src={project.video}
                          poster={project.poster}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          lazy={true}
                          controls={false}
                          autoplay={false}
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <PlayCircle className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <OptimizedImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          lazy={true}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 right-4">
                            <Camera className="w-6 h-6 text-white mb-2" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  </div>
                  
                  <div className="mt-3 text-center">
                    <h4 className="font-semibold text-white text-sm">{project.title}</h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-900/30 to-blue-900/30 px-6 py-3 rounded-full border border-green-500/20">
                <Star className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  Resultados comprovados em projetos reais
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg py-4 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
              <Eye className="w-6 h-6" />
              VER TODOS OS PORTFÓLIOS - QUERO ESSES RESULTADOS
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessCasesSection;