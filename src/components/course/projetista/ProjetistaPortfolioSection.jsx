import { Trophy, House, CaretLeft, CaretRight, Sparkle } from '@phosphor-icons/react';
import { useState } from 'react';

const studentProjects = [
  {
    id: 1,
    title: "Painel com Nicho e Ripado",
    student: "Aluno do Curso",
    image: "/assets/projetista-3d/imagens-projeto/painel-renderizado.png",
    description: "Render Ultra Realístico com Enscape"
  },
  {
    id: 2,
    title: "Cozinha Moderna",
    student: "Carol Orofino",
    image: "/assets/projetista-3d/cases/carol-orofino/cozinha.png",
    description: "Design de interiores profissional"
  },
  {
    id: 3,
    title: "Banheiro Residencial", 
    student: "Carol Orofino",
    image: "/assets/projetista-3d/cases/carol-orofino/banheiro.png",
    description: "Projeto residencial completo"
  },
  {
    id: 4,
    title: "Quarto Master",
    student: "Carol Orofino", 
    image: "/assets/projetista-3d/cases/carol-orofino/quarto-2.png",
    description: "Ambientação e iluminação realística"
  }
];

export const ProjetistaPortfolioSection = () => {
  const [currentProject, setCurrentProject] = useState(0);

  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % studentProjects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + studentProjects.length) % studentProjects.length);
  };

  const project = studentProjects[currentProject];

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

        {/* Student Projects Showcase */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl bg-zinc-800/50 backdrop-blur p-6 border border-zinc-700/50 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 group mb-8">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500 rounded-full text-sm font-medium text-green-400">
                <Sparkle className="w-4 h-4" />
                PROJETO PROFISSIONAL
              </span>
            </div>
            
            <div className="aspect-video bg-zinc-700 rounded-xl overflow-hidden mb-6 relative group">
              <img 
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-lg text-purple-400 font-medium mb-2">
                Por: {project.student}
              </p>
              <p className="text-green-400">
                {project.description}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prevProject}
              className="p-3 rounded-full bg-zinc-800/50 backdrop-blur border border-zinc-700 hover:border-purple-400 transition-colors duration-300 group"
            >
              <CaretLeft className="w-5 h-5 text-zinc-400 group-hover:text-purple-400" />
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {studentProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
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