import { Trophy, House, CaretLeft, CaretRight, Sparkle } from '@phosphor-icons/react';
import { useState } from 'react';

const studentProjects = [
  {
    id: 1,
    title: "Painel com Nicho e Ripado",
    student: "Amanda Silva",
    image: "/assets/projetista-3d/imagens-projeto/painel-renderizado.png",
    description: "Render Ultra Realístico"
  },
  {
    id: 2,
    title: "Cozinha Moderna",
    student: "Carol Orofino",
    image: "/assets/projetista-3d/cases/carol-orofino/cozinha.png",
    description: "Design de Interiores"
  },
  {
    id: 3,
    title: "Banheiro Residencial", 
    student: "Carol Orofino",
    image: "/assets/projetista-3d/cases/carol-orofino/banheiro.png",
    description: "Projeto Residencial"
  },
  {
    id: 4,
    title: "Quarto Master",
    student: "Carol Orofino", 
    image: "/assets/projetista-3d/cases/carol-orofino/quarto-2.png",
    description: "Ambientação Realística"
  },
  {
    id: 5,
    title: "Sala de Estar",
    student: "Bruno Santos",
    image: "/assets/projetista-3d/imagens-projeto/painel-renderizado.png",
    description: "Projeto Comercial"
  },
  {
    id: 6,
    title: "Escritório Moderno",
    student: "Maria Fernandes",
    image: "/assets/projetista-3d/cases/carol-orofino/cozinha.png",
    description: "Design Corporativo"
  },
  {
    id: 7,
    title: "Casa Completa",
    student: "João Pedro",
    image: "/assets/projetista-3d/cases/carol-orofino/banheiro.png",
    description: "Projeto Arquitetônico"
  },
  {
    id: 8,
    title: "Loft Industrial",
    student: "Ana Carolina",
    image: "/assets/projetista-3d/cases/carol-orofino/quarto-2.png",
    description: "Estilo Industrial"
  }
];

export const ProjetistaPortfolioSection = () => {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-900/50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Trophy className="w-4 h-4" />
            EVOLUÇÃO DOS NOSSOS ALUNOS
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">PROJETOS</span>
            <span className="text-white"> DOS NOSSOS </span>
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">ALUNOS</span>
          </h2>
          
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Veja os resultados profissionais que nossos alunos alcançaram.
            Renders ultra realísticos criados após o curso.
          </p>
        </div>

        {/* Student Projects Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {studentProjects.map((project, index) => {
            // Função para gerar iniciais do nome
            const getInitials = (name) => {
              return name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
            };

            return (
              <div 
                key={project.id}
                className="group rounded-2xl bg-zinc-800/50 backdrop-blur p-4 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image Container */}
                <div className="relative aspect-square bg-zinc-700 rounded-xl overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform duration-300">
                  <img 
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
                    onError={(e) => {
                      // Fallback para caso a imagem não carregue
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  
                  {/* Fallback - Avatar com iniciais (escondido por padrão) */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-400 items-center justify-center text-white font-bold text-4xl hidden"
                    style={{ display: 'none' }}
                  >
                    {getInitials(project.student)}
                  </div>
                  
                  {/* Overlay com título do projeto */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h4 className="text-white font-semibold text-sm line-clamp-2">
                      {project.title}
                    </h4>
                  </div>
                </div>
                
                {/* Student Info */}
                <div className="text-center">
                  {/* Avatar com iniciais do aluno */}
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {getInitials(project.student)}
                  </div>
                  
                  {/* Nome do aluno */}
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                    {project.student}
                  </h3>
                  
                  {/* Descrição */}
                  <p className="text-purple-400 text-xs font-medium">
                    {project.description}
                  </p>
                </div>
              </div>
            );
          })}
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
            <div className="text-2xl font-bold text-yellow-400 mb-1">4.9★</div>
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
}; => setCurrentProject(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProject 
                      ? 'bg-purple-400 scale-125' 
                      : 'bg-zinc-600 hover:bg-purple-400/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextProject}
              className="p-3 rounded-full bg-zinc-800/50 backdrop-blur border border-zinc-700 hover:border-purple-400 transition-colors duration-300 group"
            >
              <CaretRight className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            </button>
          </div>

          {/* Regional Projects */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-sm font-medium text-cyan-400">
              <House className="w-4 h-4" />
              PROJETOS DA REGIÃO
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-zinc-400">
              <div className="p-4 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-lg">
                🏘️ Condomínios de Florianópolis
              </div>
              <div className="p-4 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-lg">
                🏢 Reformas comerciais de São José
              </div>
              <div className="p-4 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-lg">
                🏠 Residências da região
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};