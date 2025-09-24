import React, { useState } from 'react';
import {
  CaretDown,
  CaretUp,
  Play,
  Clock,
  CheckCircle,
  Code,
  FileText,
  ChartBar,
  Database,
  Globe,
  Palette,
  Brain,
  BookOpen
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';

// Dados do currículo baseados na estrutura da página de informática
const curriculum = [
  {
    id: 1,
    title: 'Lógica de Programação',
    description: 'Fundamentos do pensamento computacional',
    duration: '30 horas',
    icon: Code,
    color: 'from-purple-500 to-purple-600',
    lessons: [
      { id: 1, title: 'Introdução à Lógica de Programação', duration: '90 min' },
      { id: 2, title: 'Algoritmos e Fluxogramas', duration: '90 min' },
      { id: 3, title: 'Variáveis e Tipos de Dados', duration: '90 min' },
      { id: 4, title: 'Operadores Aritméticos', duration: '90 min' },
      { id: 5, title: 'Operadores Relacionais', duration: '90 min' },
      { id: 6, title: 'Operadores Lógicos', duration: '90 min' },
      { id: 7, title: 'Estruturas Condicionais I', duration: '90 min' },
      { id: 8, title: 'Estruturas Condicionais II', duration: '90 min' },
      { id: 9, title: 'Laços de Repetição I', duration: '90 min' },
      { id: 10, title: 'Laços de Repetição II', duration: '90 min' },
      { id: 11, title: 'Vetores e Matrizes', duration: '90 min' },
      { id: 12, title: 'Funções e Procedimentos', duration: '90 min' },
      { id: 13, title: 'Resolução de Problemas', duration: '90 min' },
      { id: 14, title: 'Projeto Prático I', duration: '90 min' },
      { id: 15, title: 'Projeto Prático II', duration: '90 min' },
      { id: 16, title: 'Depuração e Testes', duration: '90 min' },
      { id: 17, title: 'Documentação de Código', duration: '90 min' },
      { id: 18, title: 'Exercícios Avançados', duration: '90 min' },
      { id: 19, title: 'Preparação para Python', duration: '90 min' },
      { id: 20, title: 'Revisão e Avaliação', duration: '90 min' }
    ]
  },
  {
    id: 2,
    title: 'Python (Fundamental)',
    description: 'Linguagem versátil para iniciantes e profissionais',
    duration: '40 horas',
    icon: Code,
    color: 'from-purple-600 to-purple-700',
    lessons: [
      { id: 21, title: 'Introdução ao Python', duration: '90 min' },
      { id: 22, title: 'Instalação e Configuração', duration: '90 min' },
      { id: 23, title: 'Sintaxe Básica', duration: '90 min' },
      { id: 24, title: 'Variáveis e Tipos de Dados', duration: '90 min' },
      { id: 25, title: 'Estruturas de Controle', duration: '90 min' },
      { id: 26, title: 'Listas e Tuplas', duration: '90 min' },
      { id: 27, title: 'Dicionários e Sets', duration: '90 min' },
      { id: 28, title: 'Funções', duration: '90 min' },
      { id: 29, title: 'Módulos e Pacotes', duration: '90 min' },
      { id: 30, title: 'Manipulação de Arquivos', duration: '90 min' },
      { id: 31, title: 'Tratamento de Exceções', duration: '90 min' },
      { id: 32, title: 'Programação Orientada a Objetos I', duration: '90 min' },
      { id: 33, title: 'Programação Orientada a Objetos II', duration: '90 min' },
      { id: 34, title: 'Bibliotecas Padrão', duration: '90 min' },
      { id: 35, title: 'Expressões Regulares', duration: '90 min' },
      { id: 36, title: 'Data e Hora', duration: '90 min' },
      { id: 37, title: 'Manipulação de Strings', duration: '90 min' },
      { id: 38, title: 'Compreensão de Listas', duration: '90 min' },
      { id: 39, title: 'Decoradores', duration: '90 min' },
      { id: 40, title: 'Geradores', duration: '90 min' },
      { id: 41, title: 'Testes Unitários', duration: '90 min' },
      { id: 42, title: 'Debugging e Profiling', duration: '90 min' },
      { id: 43, title: 'Projeto Python I', duration: '90 min' },
      { id: 44, title: 'Projeto Python II', duration: '90 min' },
      { id: 45, title: 'Boas Práticas', duration: '90 min' },
      { id: 46, title: 'Preparação para Web', duration: '90 min' }
    ]
  },
  {
    id: 3,
    title: 'HTML5 & CSS3',
    description: 'Estrutura e estilização de páginas web modernas',
    duration: '35 horas',
    icon: Globe,
    color: 'from-blue-500 to-blue-600',
    lessons: [
      { id: 47, title: 'Introdução ao HTML5', duration: '90 min' },
      { id: 48, title: 'Estrutura Básica HTML', duration: '90 min' },
      { id: 49, title: 'Tags Semânticas', duration: '90 min' },
      { id: 50, title: 'Formulários HTML5', duration: '90 min' },
      { id: 51, title: 'Multimídia em HTML', duration: '90 min' },
      { id: 52, title: 'Acessibilidade Web', duration: '90 min' },
      { id: 53, title: 'Introdução ao CSS3', duration: '90 min' },
      { id: 54, title: 'Seletores CSS', duration: '90 min' },
      { id: 55, title: 'Box Model', duration: '90 min' },
      { id: 56, title: 'Layout com Flexbox', duration: '90 min' },
      { id: 57, title: 'Layout com Grid', duration: '90 min' },
      { id: 58, title: 'Responsividade', duration: '90 min' },
      { id: 59, title: 'Media Queries', duration: '90 min' },
      { id: 60, title: 'Animações CSS', duration: '90 min' },
      { id: 61, title: 'Transformações 2D/3D', duration: '90 min' },
      { id: 62, title: 'Gradientes e Sombras', duration: '90 min' },
      { id: 63, title: 'Fonts e Tipografia', duration: '90 min' },
      { id: 64, title: 'Pré-processadores CSS', duration: '90 min' },
      { id: 65, title: 'Bootstrap Framework', duration: '90 min' },
      { id: 66, title: 'CSS Grid Avançado', duration: '90 min' },
      { id: 67, title: 'Performance CSS', duration: '90 min' },
      { id: 68, title: 'Metodologias CSS', duration: '90 min' },
      { id: 69, title: 'Projeto Web I', duration: '90 min' },
      { id: 70, title: 'Projeto Web II', duration: '90 min' }
    ]
  },
  {
    id: 4,
    title: 'JavaScript (ES6+)',
    description: 'Programação interativa e dinâmica para web',
    duration: '45 horas',
    icon: FileText,
    color: 'from-yellow-500 to-yellow-600',
    lessons: [
      { id: 71, title: 'Introdução ao JavaScript', duration: '90 min' },
      { id: 72, title: 'Variáveis e Tipos', duration: '90 min' },
      { id: 73, title: 'Funções', duration: '90 min' },
      { id: 74, title: 'Arrays e Objetos', duration: '90 min' },
      { id: 75, title: 'DOM Manipulation', duration: '90 min' },
      { id: 76, title: 'Eventos', duration: '90 min' },
      { id: 77, title: 'ES6+ Features', duration: '90 min' },
      { id: 78, title: 'Arrow Functions', duration: '90 min' },
      { id: 79, title: 'Destructuring', duration: '90 min' },
      { id: 80, title: 'Template Literals', duration: '90 min' },
      { id: 81, title: 'Promises', duration: '90 min' },
      { id: 82, title: 'Async/Await', duration: '90 min' },
      { id: 83, title: 'Fetch API', duration: '90 min' },
      { id: 84, title: 'Local Storage', duration: '90 min' },
      { id: 85, title: 'JSON Manipulation', duration: '90 min' },
      { id: 86, title: 'Regular Expressions', duration: '90 min' },
      { id: 87, title: 'Closures', duration: '90 min' },
      { id: 88, title: 'Prototypes', duration: '90 min' },
      { id: 89, title: 'Classes ES6', duration: '90 min' },
      { id: 90, title: 'Modules', duration: '90 min' },
      { id: 91, title: 'Error Handling', duration: '90 min' },
      { id: 92, title: 'Performance JavaScript', duration: '90 min' },
      { id: 93, title: 'Testing JavaScript', duration: '90 min' },
      { id: 94, title: 'Node.js Básico', duration: '90 min' },
      { id: 95, title: 'NPM e Pacotes', duration: '90 min' },
      { id: 96, title: 'Webpack Básico', duration: '90 min' },
      { id: 97, title: 'Projeto JavaScript I', duration: '90 min' },
      { id: 98, title: 'Projeto JavaScript II', duration: '90 min' },
      { id: 99, title: 'Projeto JavaScript III', duration: '90 min' },
      { id: 100, title: 'Deploy e Hospedagem', duration: '90 min' }
    ]
  },
  {
    id: 5,
    title: 'Git & Controle de Versão',
    description: 'Gerenciamento profissional de código',
    duration: '20 horas',
    icon: ChartBar,
    color: 'from-orange-500 to-orange-600',
    lessons: [
      { id: 101, title: 'Introdução ao Git', duration: '90 min' },
      { id: 102, title: 'Instalação e Configuração', duration: '90 min' },
      { id: 103, title: 'Repositórios', duration: '90 min' },
      { id: 104, title: 'Commits', duration: '90 min' },
      { id: 105, title: 'Branches', duration: '90 min' },
      { id: 106, title: 'Merge e Rebase', duration: '90 min' },
      { id: 107, title: 'GitHub', duration: '90 min' },
      { id: 108, title: 'Pull Requests', duration: '90 min' },
      { id: 109, title: 'Issues', duration: '90 min' },
      { id: 110, title: 'GitHub Pages', duration: '90 min' },
      { id: 111, title: 'GitLab', duration: '90 min' },
      { id: 112, title: 'Fluxo de Trabalho', duration: '90 min' },
      { id: 113, title: 'Tags e Releases', duration: '90 min' }
    ]
  },
  {
    id: 6,
    title: 'Banco de Dados & SQL',
    description: 'Gerenciamento e consulta de dados',
    duration: '25 horas',
    icon: Database,
    color: 'from-green-500 to-green-600',
    lessons: [
      { id: 114, title: 'Introdução a Bancos de Dados', duration: '90 min' },
      { id: 115, title: 'Modelo Relacional', duration: '90 min' },
      { id: 116, title: 'SQL Básico', duration: '90 min' },
      { id: 117, title: 'SELECT e WHERE', duration: '90 min' },
      { id: 118, title: 'JOIN', duration: '90 min' },
      { id: 119, title: 'GROUP BY e HAVING', duration: '90 min' },
      { id: 120, title: 'INSERT, UPDATE, DELETE', duration: '90 min' },
      { id: 121, title: 'Constraints', duration: '90 min' },
      { id: 122, title: 'Índices', duration: '90 min' },
      { id: 123, title: 'Views', duration: '90 min' },
      { id: 124, title: 'Stored Procedures', duration: '90 min' },
      { id: 125, title: 'MySQL', duration: '90 min' },
      { id: 126, title: 'PostgreSQL', duration: '90 min' },
      { id: 127, title: 'SQLite', duration: '90 min' },
      { id: 128, title: 'NoSQL Básico', duration: '90 min' },
      { id: 129, title: 'MongoDB', duration: '90 min' },
      { id: 130, title: 'Projeto Banco de Dados', duration: '90 min' }
    ]
  },
  {
    id: 7,
    title: 'Frameworks & Bibliotecas',
    description: 'React, Django e ferramentas modernas',
    duration: '30 horas',
    icon: Palette,
    color: 'from-cyan-500 to-cyan-600',
    lessons: [
      { id: 131, title: 'Introdução ao React', duration: '90 min' },
      { id: 132, title: 'JSX', duration: '90 min' },
      { id: 133, title: 'Componentes', duration: '90 min' },
      { id: 134, title: 'Props e State', duration: '90 min' },
      { id: 135, title: 'Hooks', duration: '90 min' },
      { id: 136, title: 'Event Handling', duration: '90 min' },
      { id: 137, title: 'Conditional Rendering', duration: '90 min' },
      { id: 138, title: 'Lists e Keys', duration: '90 min' },
      { id: 139, title: 'Forms', duration: '90 min' },
      { id: 140, title: 'React Router', duration: '90 min' },
      { id: 141, title: 'Introdução ao Django', duration: '90 min' },
      { id: 142, title: 'Models', duration: '90 min' },
      { id: 143, title: 'Views', duration: '90 min' },
      { id: 144, title: 'Templates', duration: '90 min' },
      { id: 145, title: 'URLs', duration: '90 min' },
      { id: 146, title: 'Admin', duration: '90 min' },
      { id: 147, title: 'Forms Django', duration: '90 min' },
      { id: 148, title: 'Authentication', duration: '90 min' },
      { id: 149, title: 'REST APIs', duration: '90 min' },
      { id: 150, title: 'Projeto Framework', duration: '90 min' }
    ]
  },
  {
    id: 8,
    title: 'Inteligência Artificial (Programação)',
    description: 'IA aplicada ao desenvolvimento de software',
    duration: '25 horas',
    icon: Brain,
    color: 'from-pink-500 to-pink-600',
    lessons: [
      { id: 151, title: 'Introdução à IA para Programadores', duration: '90 min' },
      { id: 152, title: 'GitHub Copilot', duration: '90 min' },
      { id: 153, title: 'ChatGPT para Código', duration: '90 min' },
      { id: 154, title: 'Code Review com IA', duration: '90 min' },
      { id: 155, title: 'Geração de Testes', duration: '90 min' },
      { id: 156, title: 'Documentação Automática', duration: '90 min' },
      { id: 157, title: 'Refactoring com IA', duration: '90 min' },
      { id: 158, title: 'Debugging Assistido', duration: '90 min' },
      { id: 159, title: 'APIs de IA', duration: '90 min' },
      { id: 160, title: 'OpenAI API', duration: '90 min' },
      { id: 161, title: 'Machine Learning Básico', duration: '90 min' },
      { id: 162, title: 'TensorFlow.js', duration: '90 min' },
      { id: 163, title: 'Computer Vision Web', duration: '90 min' },
      { id: 164, title: 'NLP com JavaScript', duration: '90 min' },
      { id: 165, title: 'ChatBots', duration: '90 min' },
      { id: 166, title: 'Ética em IA', duration: '90 min' },
      { id: 167, title: 'Projeto IA Final', duration: '90 min' }
    ]
  }
];

export const ProgramacaoNovaCurriculum = () => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (moduleId) => {
    setOpenModule(openModule === moduleId ? null : moduleId);
  };

  const totalHours = curriculum.reduce((acc, module) => {
    return acc + parseFloat(module.duration.replace(' horas', '').replace(',', '.'));
  }, 0);

  const totalLessons = curriculum.reduce((acc, module) => acc + module.lessons.length, 0);

  return (
    <section id="curriculum" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="container mx-auto max-w-7xl">

        {/* Cabeçalho da seção */}
        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">O QUE VOCÊ VAI</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-blue-400 bg-clip-text text-transparent">
              APRENDER
            </span>
          </h2>

          <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
            8 módulos completos, {totalLessons} aulas práticas, {totalHours.toFixed(1)} horas de conteúdo.
            Do básico ao avançado em programação moderna.
          </p>

          {/* Estatísticas do curso */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{curriculum.length}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Módulos</div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{totalLessons}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Aulas</div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4 col-span-2 md:col-span-1">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{totalHours.toFixed(1)}h</div>
              <div className="text-xs sm:text-sm text-zinc-400">Duração</div>
            </div>
          </div>
        </div>

        {/* Módulos do curriculum */}
        <div className="space-y-4">
          {curriculum.map((module) => {
            const IconComponent = module.icon;
            const isOpen = openModule === module.id;

            return (
              <div
                key={module.id}
                className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
              >
                {/* Cabeçalho do módulo */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-3 sm:p-6 text-left flex items-center gap-3 sm:gap-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  <div className="flex-grow min-w-0">
                    {/* Layout Mobile - Nome prioritário */}
                    <div className="sm:hidden">
                      <div className="flex items-center gap-2 text-sm min-w-0">
                        <h3 className="font-bold text-white whitespace-nowrap flex-shrink-0">
                          {module.title}
                        </h3>
                        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                          <span className="text-purple-300 text-xs flex-shrink-0">•</span>
                          <span className="text-purple-300 text-xs whitespace-nowrap flex-shrink-0">{module.duration}</span>
                          <span className="text-zinc-400 text-xs flex-shrink-0">•</span>
                          <div className="flex items-center gap-1 min-w-0 overflow-hidden text-ellipsis">
                            <span className="text-zinc-400 text-xs whitespace-nowrap">{module.lessons.length} aulas</span>
                            <span className="text-zinc-400 text-xs flex-shrink-0">•</span>
                            <span className="text-zinc-400 text-xs whitespace-nowrap truncate">{module.id <= 2 ? 'Básico' : module.id <= 5 ? 'Intermediário' : 'Avançado'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Layout Desktop - Layout original */}
                    <div className="hidden sm:block">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          Módulo {module.id}: {module.title}
                        </h3>
                        <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-3 py-1">
                          <span className="text-purple-300 text-sm font-medium">{module.duration}</span>
                        </div>
                      </div>
                      <p className="text-zinc-400 text-sm">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                        <span>{module.lessons.length} aulas</span>
                        <span>•</span>
                        <span>Nível: {module.id <= 2 ? 'Básico' : module.id <= 5 ? 'Intermediário' : 'Avançado'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {isOpen ? (
                      <CaretUp className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                    ) : (
                      <CaretDown className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Conteúdo expandido do módulo */}
                {isOpen && (
                  <div className="border-t border-zinc-700/50 bg-zinc-900/30 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-zinc-600/50 transition-colors"
                        >
                          <div className={`w-8 h-8 bg-gradient-to-r ${module.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-xs font-bold">{lessonIndex + 1}</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-sm font-medium text-white truncate">{lesson.title}</div>
                            <div className="flex items-center gap-2 text-xs text-zinc-400">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                          <CheckCircle className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-400/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para dominar tudo isso?
            </h3>

            <p className="text-zinc-300 text-lg mb-6">
              Metodologia comprovada, material incluso e suporte vitalício.
              Sua jornada de transformação digital começa aqui.
            </p>

            <button
              onClick={() => handleCTAClick('curriculum')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-blue-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Ver Detalhes do Curso
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};