import { Trophy, House, CaretLeft, CaretRight, Sparkle } from '@phosphor-icons/react';
import { useState } from 'react';
import ProjetistaGalleryWithLightbox from './ProjetistaGalleryWithLightbox';

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
    src: "/assets/projetista-3d/cases/lauren/armario.jpeg",
    title: "Armário Planejado",
    description: "Móveis sob Medida - Lauren"
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

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">200+</div>
            <div className="text-sm text-zinc-400">Alunos Formados</div>
          </div>
          
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="text-2xl font-bold text-cyan-400 mb-1">500+</div>
            <div className="text-sm text-zinc-400">Projetos Criados</div>
          </div>
          
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="text-2xl font-bold text-green-400 mb-1">95%</div>
            <div className="text-sm text-zinc-400">Taxa de Sucesso</div>
          </div>
          
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50">
            <div className="text-2xl font-bold text-yellow-400 mb-1">4.9⭐</div>
            <div className="text-sm text-zinc-400">Avaliação Média</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-400/20 border border-purple-400/30 rounded-full text-sm font-medium text-purple-400 mb-4">
            <Sparkle className="w-4 h-4" />
            SEU PROJETO PODE SER O PRÓXIMO
          </div>
          
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Junte-se aos nossos alunos e crie projetos profissionais que impressionam.
            Transforme sua criatividade em uma carreira sólida.
          </p>
        </div>

      </div>
    </section>
  );
};