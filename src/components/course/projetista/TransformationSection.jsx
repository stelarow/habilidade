import React, { useState } from 'react';
import { 
  Camera, 
  Trophy, 
  Hand, 
  Star, 
  CheckCircle, 
  Rocket,
  ArrowLeft,
  ArrowRight
} from '@phosphor-icons/react';
import OptimizedImage from '../../shared/OptimizedImage';

const TransformationSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const beforeExamples = [
    "Esboços à mão no papel",
    "Desenhos simples com caneta", 
    "Plantas básicas sem detalhes",
    "Dificuldade para visualizar o projeto final",
    "Clientes confusos com a proposta"
  ];

  const afterProjects = [
    {
      name: "CAROL",
      description: "Renders fotorrealísticos",
      details: "banheiro, cozinha, quartos",
      image: "/assets/projetista-3d/cases/carol-orofino/cena banheiro.png"
    },
    {
      name: "LAUREN", 
      description: "Armários 3D com vídeos animados",
      details: "móveis planejados profissionais",
      image: "/assets/projetista-3d/cases/lauren/armario.jpeg"
    },
    {
      name: "ELTON",
      description: "Projetos empresariais",
      details: "Santa Madeira Casas",
      image: "/assets/projetista-3d/cases/elton-santa-madeira/WhatsApp Image 2025-08-19 at 18.03.19.jpeg"
    },
    {
      name: "PATRÍCIA",
      description: "Renders comerciais",
      details: "Ricardo Móveis",
      image: "/assets/projetista-3d/cases/patricia-ricardo-moveis/cozinha.png"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % afterProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + afterProjects.length) % afterProjects.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-zinc-950 via-purple-950/20 to-zinc-950">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              TRANSFORMAÇÃO REAL
            </span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-xl text-gray-300">
            <Camera className="w-6 h-6 text-purple-400" />
            <p>VEJA A EVOLUÇÃO REAL DOS NOSSOS ALUNOS</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          
          {/* ANTES - Seção de Dor */}
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-2xl p-8 mb-8 border border-red-500/20">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                <Hand className="w-6 h-6" />
                <h3 className="text-2xl font-bold">ANTES DO CURSO - COMO NOSSOS ALUNOS ENTREGAVAM:</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {beforeExamples.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-300">
                    <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Seta de Transformação */}
          <div className="text-center my-12">
            <div className="text-4xl font-black text-purple-400">
              ⬇️ TRANSFORMAÇÃO ⬇️
            </div>
          </div>

          {/* DEPOIS - Seção de Sucesso */}
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/20">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
                <Star className="w-6 h-6" />
                <h3 className="text-2xl font-bold">DEPOIS DO CURSO - PROJETOS PROFISSIONAIS:</h3>
              </div>

              {/* Carrossel de Projetos */}
              <div className="relative max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-8">
                  
                  {/* Botão Anterior */}
                  <button 
                    onClick={prevSlide}
                    className="p-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-full transition-all duration-300"
                    aria-label="Projeto anterior"
                  >
                    <ArrowLeft className="w-6 h-6 text-purple-400" />
                  </button>

                  {/* Projeto Atual */}
                  <div className="text-center space-y-6 flex-1 max-w-lg">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-purple-500/20">
                      <OptimizedImage
                        src={afterProjects[currentSlide].image}
                        alt={`Projeto de ${afterProjects[currentSlide].name} - ${afterProjects[currentSlide].description}`}
                        className="w-full h-full object-cover"
                        lazy={true}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-purple-400">
                        {afterProjects[currentSlide].name}
                      </h4>
                      <p className="text-xl text-green-400 font-semibold">
                        {afterProjects[currentSlide].description}
                      </p>
                      <p className="text-gray-300">
                        {afterProjects[currentSlide].details}
                      </p>
                    </div>
                  </div>

                  {/* Botão Próximo */}
                  <button 
                    onClick={nextSlide}
                    className="p-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-full transition-all duration-300"
                    aria-label="Próximo projeto"
                  >
                    <ArrowRight className="w-6 h-6 text-purple-400" />
                  </button>
                </div>

                {/* Indicadores */}
                <div className="flex justify-center gap-2 mt-6">
                  {afterProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-purple-400 w-8' 
                          : 'bg-gray-600 hover:bg-gray-400'
                      }`}
                      aria-label={`Ver projeto ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-12 text-center space-y-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Aumento de 200% a 300% nos contratos</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Clientes impressionados</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Valores 3x maiores</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg py-4 px-8 rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto">
                <Rocket className="w-6 h-6" />
                QUERO ESSA TRANSFORMAÇÃO - GARANTIR VAGA
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TransformationSection;