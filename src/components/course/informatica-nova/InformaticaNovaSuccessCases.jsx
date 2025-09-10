import React, { useState } from 'react';
import { Play, X, CaretLeft, CaretRight, Medal, TrendUp, Users } from '@phosphor-icons/react';

const successCases = [
  {
    id: 1,
    studentName: "Letícia Mendes",
    studentTitle: "Assistente Administrativo",
    studentImage: "/assets/informatica-nova/cases/leticia-mendes/foto.jpg",
    description: "Aprendeu Excel avançado e conseguiu promoção na empresa",
    achievement: "Promoção para Analista",
    portfolio: [
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/leticia-mendes/planilha-vendas.png", 
        title: "Planilha de Vendas Automatizada" 
      },
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/leticia-mendes/dashboard-excel.png", 
        title: "Dashboard Executivo" 
      }
    ]
  },
  {
    id: 2,
    studentName: "Mateus Oliveira",
    studentTitle: "Vendedor",
    studentImage: "/assets/informatica-nova/cases/mateus-oliveira/foto.jpg",
    description: "Utilizou Canva e IA para criar materiais de vendas inovadores",
    achievement: "Aumento de 40% nas vendas",
    portfolio: [
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/mateus-oliveira/post-canva.png", 
        title: "Posts para Redes Sociais" 
      },
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/mateus-oliveira/catalogo-digital.png", 
        title: "Catálogo Digital" 
      },
      { 
        type: "video", 
        src: "/assets/informatica-nova/cases/mateus-oliveira/video-vendas.mp4", 
        poster: "/assets/informatica-nova/cases/mateus-oliveira/video-vendas-poster.jpg", 
        title: "Vídeo de Vendas com IA" 
      }
    ]
  },
  {
    id: 3,
    studentName: "Gabriela Costa Silva",
    studentTitle: "Estudante",
    studentImage: "/assets/informatica-nova/cases/gabriela-costa-silva/foto.jpg",
    description: "Dominou informática e conseguiu primeiro emprego na área administrativa",
    achievement: "Primeiro emprego conquistado",
    portfolio: [
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/gabriela-costa-silva/curriculo-word.png", 
        title: "Currículo Profissional no Word" 
      },
      { 
        type: "image", 
        src: "/assets/informatica-nova/cases/gabriela-costa-silva/apresentacao-powerpoint.png", 
        title: "Apresentação de Projeto" 
      }
    ]
  }
];

export const InformaticaNovaSuccessCases = () => {
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const openCase = (caseItem) => {
    setSelectedCase(caseItem);
    setCurrentMediaIndex(0);
    setIsVideoPlaying(false);
  };

  const closeCase = () => {
    setSelectedCase(null);
    setIsVideoPlaying(false);
  };

  const nextMedia = () => {
    if (selectedCase) {
      const nextIndex = (currentMediaIndex + 1) % selectedCase.portfolio.length;
      setCurrentMediaIndex(nextIndex);
      setIsVideoPlaying(false);
    }
  };

  const prevMedia = () => {
    if (selectedCase) {
      const prevIndex = currentMediaIndex === 0 ? selectedCase.portfolio.length - 1 : currentMediaIndex - 1;
      setCurrentMediaIndex(prevIndex);
      setIsVideoPlaying(false);
    }
  };

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container mx-auto max-w-7xl">
        
        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">HISTÓRIAS</span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent">
              DE SUCESSO
            </span>
          </h2>
          
          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Conheça alunos que transformaram suas carreiras após dominar a informática. 
            Seus projetos reais falam por si só.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">92%</div>
            <div className="text-zinc-400">Taxa de empregabilidade</div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendUp className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">45%</div>
            <div className="text-zinc-400">Aumento médio salarial</div>
          </div>
          
          <div className="text-center bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">150+</div>
            <div className="text-zinc-400">Alunos capacitados</div>
          </div>
        </div>

        {/* Cards dos casos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successCases.map((caseItem) => (
            <div 
              key={caseItem.id}
              className="group bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-green-500/50 transition-all duration-300 cursor-pointer"
              onClick={() => openCase(caseItem)}
            >
              {/* Foto do aluno */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={caseItem.studentImage}
                  alt={caseItem.studentName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge de achievement */}
                <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-semibold">{caseItem.achievement}</span>
                </div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Informações do aluno */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{caseItem.studentName}</h3>
                <p className="text-blue-300 text-sm mb-3 font-medium">{caseItem.studentTitle}</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{caseItem.description}</p>
                
                {/* Portfolio count */}
                <div className="mt-4 pt-4 border-t border-zinc-700/50">
                  <span className="text-xs text-zinc-400">
                    {caseItem.portfolio.length} projeto{caseItem.portfolio.length > 1 ? 's' : ''} desenvolvido{caseItem.portfolio.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de caso detalhado */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            
            {/* Botão fechar */}
            <button
              onClick={closeCase}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl overflow-hidden">
              
              {/* Header com informações do aluno */}
              <div className="p-8 bg-gradient-to-r from-green-500/20 to-emerald-400/20 border-b border-zinc-700/50">
                <div className="flex items-center gap-6">
                  <img
                    src={selectedCase.studentImage}
                    alt={selectedCase.studentName}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{selectedCase.studentName}</h3>
                    <p className="text-green-300 font-medium mb-2">{selectedCase.studentTitle}</p>
                    <div className="bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                      <span className="text-white text-sm font-semibold">{selectedCase.achievement}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-300 mt-4 text-lg">{selectedCase.description}</p>
              </div>

              {/* Portfolio do aluno */}
              <div className="p-8">
                <h4 className="text-xl font-bold text-white mb-6">Portfolio Desenvolvido</h4>
                
                {/* Media atual */}
                <div className="relative bg-zinc-800 rounded-lg overflow-hidden mb-6">
                  {selectedCase.portfolio[currentMediaIndex]?.type === 'video' ? (
                    <div className="relative aspect-video">
                      {!isVideoPlaying ? (
                        <div className="relative w-full h-full">
                          <img
                            src={selectedCase.portfolio[currentMediaIndex].poster}
                            alt={selectedCase.portfolio[currentMediaIndex].title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => setIsVideoPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/70 transition-colors"
                          >
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="w-10 h-10 text-white ml-2" />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <video
                          src={selectedCase.portfolio[currentMediaIndex].src}
                          controls
                          autoPlay
                          className="w-full h-full"
                        />
                      )}
                    </div>
                  ) : (
                    <img
                      src={selectedCase.portfolio[currentMediaIndex]?.src}
                      alt={selectedCase.portfolio[currentMediaIndex]?.title}
                      className="w-full h-auto max-h-[60vh] object-contain"
                    />
                  )}

                  {/* Navegação */}
                  {selectedCase.portfolio.length > 1 && (
                    <>
                      <button
                        onClick={prevMedia}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <CaretLeft className="w-6 h-6" />
                      </button>
                      
                      <button
                        onClick={nextMedia}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                      >
                        <CaretRight className="w-6 h-6" />
                      </button>
                    </>
                  )}
                </div>

                {/* Título do projeto atual */}
                <h5 className="text-lg font-semibold text-white text-center mb-6">
                  {selectedCase.portfolio[currentMediaIndex]?.title}
                </h5>

                {/* Thumbnails */}
                {selectedCase.portfolio.length > 1 && (
                  <div className="flex justify-center gap-3">
                    {selectedCase.portfolio.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentMediaIndex(index);
                          setIsVideoPlaying(false);
                        }}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentMediaIndex ? 'border-green-400' : 'border-zinc-600'
                        }`}
                      >
                        <img
                          src={item.type === 'video' ? item.poster : item.src}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};