import { Trophy, House, CaretLeft, CaretRight, Sparkle } from '@phosphor-icons/react';
import { useState } from 'react';
import ProjetistaGalleryWithLightbox from './ProjetistaGalleryWithLightbox';
import { Badge } from '../../ui/badge';

const studentProjects = [
  {
    type: 'image',
    src: "/assets/projetista-3d/imagens-projeto/Painel, com nicho e ripado - imagem renderizada.png",
    title: "Painel com Nicho e Ripado",
    description: "Render Ultra Realístico - Amanda Silva"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/carol-orofino/cena cozinha.png",
    title: "Cozinha Moderna",
    description: "Design de Interiores - Carol Orofino"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/carol-orofino/cena banheiro.png",
    title: "Banheiro Residencial", 
    description: "Projeto Residencial - Carol Orofino"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/carol-orofino/cena quarto.png",
    title: "Quarto Master",
    description: "Ambientação Realística - Carol Orofino"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/debora-chiquetti/sala-estar.png",
    title: "Sala de Estar Planejada",
    description: "Móveis Planejados - Debora Chiquetti"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/salao-beleza.png",
    title: "Projeto Salão de Beleza",
    description: "Design Comercial - Patricia"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png",
    title: "Cozinha Planejada",
    description: "Design Corporativo - Patricia"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/cases/patricia-ricardo-moveis/sala.png",
    title: "Sala de Estar",
    description: "Projeto Residencial - Patricia"
  },
  {
    type: 'image',
    src: "/assets/projetista-3d/imagens-projeto/generation-2f169d5f-c611-4d3e-a5e5-168d6c33520f.png",
    title: "Projeto Moderno",
    description: "Arquitetura Contemporânea"
  }
];

export const ProjetistaPortfolioSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Trophy className="w-4 h-4" />
            APRENDIZADO PRÁTICO
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">PROJETOS</span>
            <span className="text-white"> REALIZADOS EM </span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">AULA</span>
          </h2>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Veja o que você vai criar durante as aulas práticas.
            Projetos reais desenvolvidos passo a passo.
          </p>
        </div>

        {/* Student Projects Gallery with Lightbox */}
        <div className="max-w-6xl mx-auto">
          <ProjetistaGalleryWithLightbox 
            items={studentProjects}
            columns={4}
            className="mb-8"
            showTitles={true}
          />
        </div>

        {/* Learning Journey Section */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              <span className="text-white">Sua </span>
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Jornada de Aprendizado
              </span>
            </h3>
            <p className="text-zinc-400">Domine as 3 etapas essenciais para se tornar um Projetista 3D profissional</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-purple-500/30 via-cyan-400/30 to-purple-500/30 -translate-y-1/2"></div>
            
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/30">
                    Etapa 1
                  </Badge>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">
                  Crie Projetos 2D e 3D
                </h4>
                <p className="text-sm text-zinc-400">
                  Domine as ferramentas essenciais do SketchUp para modelagem tridimensional profissional
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Modelagem 3D</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Ferramentas</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Precisão</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center border border-cyan-400/30">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-400/30">
                    Etapa 2
                  </Badge>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">
                  Detalhe e Crie Pranchetas
                </h4>
                <p className="text-sm text-zinc-400">
                  Desenvolva documentação técnica profissional com plantas, cortes e elevações em escala
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Layout</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Escalas</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Documentação</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="bg-zinc-800/30 backdrop-blur border border-zinc-700/50 rounded-xl p-6 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-purple-400/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Badge variant="outline" className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-purple-400 border-purple-400/30">
                    Etapa 3
                  </Badge>
                </div>
                
                <h4 className="text-lg font-bold text-white mb-2">
                  Renderize Ultra-Realista
                </h4>
                <p className="text-sm text-zinc-400">
                  Crie apresentações impactantes com fotos, vídeos e imagens 360° usando Enscape
                </p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Renderização</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">Vídeos</span>
                  <span className="text-xs px-2 py-1 bg-zinc-700/50 rounded text-zinc-300">360°</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <a 
            href="https://wa.me/5548988559491?text=Olá! Tenho interesse no curso Projetista 3D e gostaria de saber mais informações sobre como transformar minha criatividade em uma carreira sólida."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-purple-400/30 rounded-full text-sm font-medium text-purple-400 mb-4 hover:from-purple-500/30 hover:to-cyan-400/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Sparkle className="w-4 h-4" />
            SEU PROJETO PODE SER O PRÓXIMO
          </a>
          
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Junte-se aos nossos alunos e crie projetos profissionais que impressionam.
            Transforme sua criatividade em uma carreira sólida.
          </p>
        </div>

      </div>
    </section>
  );
};