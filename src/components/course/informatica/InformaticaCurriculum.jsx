import React, { useState } from 'react';
import {
  CaretDown,
  CaretUp,
  Play,
  Clock,
  CheckCircle,
  Monitor,
  FileText,
  ChartBar,
  Presentation,
  Globe,
  Palette,
  Brain,
  BookOpen
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { ScrollReveal, CardGridReveal } from '../../../components/shared/ScrollReveal';

// Dados do currículo baseados nos dados reais do coursesData.js
const curriculum = [
  {
    id: 1,
    title: 'Windows 11',
    description: 'Sistema operacional moderno e produtividade total',
    duration: '18 horas',
    icon: Monitor,
    color: 'from-blue-500 to-blue-600',
    lessons: [
      { id: 1, title: 'Introdução ao Windows 11', duration: '90 min' },
      { id: 2, title: 'Aplicativos Parte I', duration: '90 min' },
      { id: 3, title: 'Microsoft Edge', duration: '90 min' },
      { id: 4, title: 'Explorador de Arquivos Parte I', duration: '90 min' },
      { id: 5, title: 'Explorador de Arquivos Parte II', duration: '90 min' },
      { id: 6, title: 'Personalizando o Sistema', duration: '90 min' },
      { id: 7, title: 'Acessibilidade Parte I', duration: '90 min' },
      { id: 8, title: 'Aplicativos Parte II', duration: '90 min' },
      { id: 9, title: 'Aplicativos Parte III', duration: '90 min' },
      { id: 10, title: 'Aplicativos Parte IV', duration: '90 min' },
      { id: 11, title: 'Barra de Tarefas', duration: '90 min' },
      { id: 12, title: 'Acessibilidade Parte II', duration: '90 min' }
    ]
  },
  {
    id: 2,
    title: 'Word (Fundamental)',
    description: 'Processamento de texto profissional',
    duration: '21 horas',
    icon: FileText,
    color: 'from-blue-600 to-blue-700',
    lessons: [
      { id: 13, title: 'Introdução ao Word 2019', duration: '90 min' },
      { id: 14, title: 'Iniciando um documento', duration: '90 min' },
      { id: 15, title: 'Formatando texto e nova Ferramenta de Aprendizagem', duration: '90 min' },
      { id: 16, title: 'Inserção de tabelas e ícones SVG', duration: '90 min' },
      { id: 17, title: 'Inserção de elementos gráficos I', duration: '90 min' },
      { id: 18, title: 'Inserção de elementos gráficos e imagens 3D', duration: '90 min' },
      { id: 19, title: 'Criação de estruturas de texto I', duration: '90 min' },
      { id: 20, title: 'Criação de estruturas de texto II', duration: '90 min' },
      { id: 21, title: 'Inserção de elementos de texto e nova sintaxe LaTeX', duration: '90 min' },
      { id: 22, title: 'Layout da página', duration: '90 min' },
      { id: 23, title: 'Design', duration: '90 min' },
      { id: 24, title: 'Revisão', duration: '90 min' },
      { id: 25, title: 'Armazenamento e compartilhamento', duration: '90 min' },
      { id: 26, title: 'Impressão', duration: '90 min' }
    ]
  },
  {
    id: 3,
    title: 'Excel (Fundamental)',
    description: 'Planilhas eletrônicas para análise de dados',
    duration: '27 horas',
    icon: ChartBar,
    color: 'from-green-500 to-green-600',
    lessons: [
      { id: 27, title: 'Introdução, Desenvolvendo a Primeira Planilha', duration: '90 min' },
      { id: 28, title: 'Formatação Básica', duration: '90 min' },
      { id: 29, title: 'Menu Revisão', duration: '90 min' },
      { id: 30, title: 'Operações Aritméticas Básicas', duration: '90 min' },
      { id: 31, title: 'Explorando Porcentagens', duration: '90 min' },
      { id: 32, title: 'Fórmulas Relativas', duration: '90 min' },
      { id: 33, title: 'Funções Comuns', duration: '90 min' },
      { id: 34, title: 'Gráficos Parte I', duration: '90 min' },
      { id: 35, title: 'Formatação Condicional', duration: '90 min' },
      { id: 36, title: 'Validação de Dados', duration: '90 min' },
      { id: 37, title: 'Funções de Pesquisas Básicas', duration: '90 min' },
      { id: 38, title: 'Funções Comuns II', duration: '90 min' },
      { id: 39, title: 'Fórmulas de texto e AutoSoma', duration: '90 min' },
      { id: 40, title: 'Funções Financeiras Básicas', duration: '90 min' },
      { id: 41, title: 'Gráficos Parte II', duration: '90 min' },
      { id: 42, title: 'Funções de Data e Hora Básicas', duration: '90 min' },
      { id: 43, title: 'Gerenciador de Nomes', duration: '90 min' },
      { id: 44, title: 'Configurações, Auditoria e Exibição', duration: '90 min' }
    ]
  },
  {
    id: 4,
    title: 'Excel (Avançado)',
    description: 'Análise avançada de dados e automatização',
    duration: '19,5 horas',
    icon: ChartBar,
    color: 'from-green-600 to-green-700',
    lessons: [
      { id: 45, title: 'Revisão de Fórmulas e Funções', duration: '90 min' },
      { id: 46, title: 'Funções de Texto', duration: '90 min' },
      { id: 47, title: 'Funções Lógicas', duration: '90 min' },
      { id: 48, title: 'Funções de Matemática/Trigonometria e Estatísticas – Parte 1', duration: '90 min' },
      { id: 49, title: 'Funções Estatísticas – Parte 2', duration: '90 min' },
      { id: 50, title: 'Funções de Data e Hora', duration: '90 min' },
      { id: 51, title: 'Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações', duration: '90 min' },
      { id: 52, title: 'Funções de Pesquisa e Referência', duration: '90 min' },
      { id: 53, title: 'Tabela Dinâmica e Formatação Condicional', duration: '90 min' },
      { id: 54, title: 'Gráfico Dinâmico e Classificação de dados', duration: '90 min' },
      { id: 55, title: 'Utilizando Formulários', duration: '90 min' },
      { id: 56, title: 'Utilizando Macros e Noções de VBA', duration: '90 min' },
      { id: 57, title: 'Solver e Funções Financeiras', duration: '90 min' }
    ]
  },
  {
    id: 5,
    title: 'PowerPoint (Fundamental)',
    description: 'Apresentações profissionais e impactantes',
    duration: '18 horas',
    icon: Presentation,
    color: 'from-orange-500 to-orange-600',
    lessons: [
      { id: 58, title: 'Introdução ao Power Point 2019', duration: '90 min' },
      { id: 59, title: 'Ferramentas', duration: '90 min' },
      { id: 60, title: 'Iniciando uma apresentação', duration: '90 min' },
      { id: 61, title: 'Texto', duration: '90 min' },
      { id: 62, title: 'Layout de slide', duration: '90 min' },
      { id: 63, title: 'Elementos gráficos I', duration: '90 min' },
      { id: 64, title: 'Elementos gráficos II', duration: '90 min' },
      { id: 65, title: 'Multimídia', duration: '90 min' },
      { id: 66, title: 'Transições', duration: '90 min' },
      { id: 67, title: 'Testes de apresentação', duration: '90 min' },
      { id: 68, title: 'Revisão', duration: '90 min' },
      { id: 69, title: 'Projeto', duration: '90 min' }
    ]
  },
  {
    id: 6,
    title: 'Ambientes Digitais',
    description: 'Navegação e ferramentas da internet moderna',
    duration: '24 horas',
    icon: Globe,
    color: 'from-cyan-500 to-cyan-600',
    lessons: [
      { id: 70, title: 'Introdução à Internet', duration: '90 min' },
      { id: 71, title: 'Navegação na Web', duration: '90 min' },
      { id: 72, title: 'Recursos e Pesquisa na Web', duration: '90 min' },
      { id: 73, title: 'Comunicação Online: E-mail', duration: '90 min' },
      { id: 74, title: 'Ferramenta de Produtividade: Google Drive', duration: '90 min' },
      { id: 75, title: 'Internet das Coisas (IoT)', duration: '90 min' },
      { id: 76, title: 'Videoconferências e Google Agenda', duration: '90 min' },
      { id: 77, title: 'Segurança Online', duration: '90 min' },
      { id: 78, title: 'Privacidade e Proteção de Dados', duration: '90 min' },
      { id: 79, title: 'Compras e Transações Online', duration: '90 min' },
      { id: 80, title: 'Streaming de Áudio: Spotify', duration: '90 min' },
      { id: 81, title: 'Streaming de Vídeo: YouTube', duration: '90 min' },
      { id: 82, title: 'Mensagens Instantâneas: WhatsApp', duration: '90 min' },
      { id: 83, title: 'Redes Sociais: Facebook', duration: '90 min' },
      { id: 84, title: 'Redes Sociais: Instagram', duration: '90 min' },
      { id: 85, title: 'Redes Sociais: TikTok', duration: '90 min' }
    ]
  },
  {
    id: 7,
    title: 'Canva',
    description: 'Design gráfico acessível para todos',
    duration: '18 horas',
    icon: Palette,
    color: 'from-purple-500 to-purple-600',
    lessons: [
      { id: 86, title: 'Crie uma conta', duration: '90 min' },
      { id: 87, title: 'Conhecendo o Canva', duration: '90 min' },
      { id: 88, title: 'Biblioteca de modelos', duration: '90 min' },
      { id: 89, title: 'Editando templates', duration: '90 min' },
      { id: 90, title: 'Criando logotipos', duration: '90 min' },
      { id: 91, title: 'Designer profissional', duration: '90 min' },
      { id: 92, title: 'Vinhetas/Vídeos', duration: '90 min' },
      { id: 93, title: 'E-books e cartões', duration: '90 min' },
      { id: 94, title: 'Catálogo digital e proposta comercial', duration: '90 min' },
      { id: 95, title: 'Mockups', duration: '90 min' },
      { id: 96, title: 'Canva para Smartphone – Etapa 1', duration: '90 min' },
      { id: 97, title: 'Canva para Smartphone – Etapa 2', duration: '90 min' }
    ]
  },
  {
    id: 8,
    title: 'Inteligência Artificial (Informática)',
    description: 'IA aplicada à produtividade e trabalho',
    duration: '24 horas',
    icon: Brain,
    color: 'from-pink-500 to-pink-600',
    lessons: [
      { id: 98, title: 'Introdução e História da Inteligência Artificial', duration: '90 min' },
      { id: 99, title: 'Machine Learning', duration: '90 min' },
      { id: 100, title: 'Prompt Engineering', duration: '90 min' },
      { id: 101, title: 'GPT, Bard e Copilot', duration: '90 min' },
      { id: 102, title: 'Estudando e Pesquisando com IAs', duration: '90 min' },
      { id: 103, title: 'Melhorando o Prompt', duration: '90 min' },
      { id: 104, title: 'Gerando Imagens', duration: '90 min' },
      { id: 105, title: 'Gerando Posts para Redes Sociais', duration: '90 min' },
      { id: 106, title: 'HARPA AI – Parte 1', duration: '90 min' },
      { id: 107, title: 'HARPA AI – Parte 2', duration: '90 min' },
      { id: 108, title: 'Gerando Vídeos', duration: '90 min' },
      { id: 109, title: 'Gerando Vídeos através de Imagens', duration: '90 min' },
      { id: 110, title: 'Gerando Áudios', duration: '90 min' },
      { id: 111, title: 'Gerando Vídeos com D-ID', duration: '90 min' },
      { id: 112, title: 'PI (Inteligência Artificial Personalizada)', duration: '90 min' },
      { id: 113, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: '90 min' }
    ]
  }
];

export const InformaticaCurriculum = () => {
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

          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">O QUE VOCÊ VAI</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-600 to-cyan-400 bg-clip-text text-transparent">
                APRENDER
              </span>
            </h2>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
              8 módulos completos, {totalLessons} aulas práticas, {totalHours.toFixed(1)} horas de conteúdo.
              Do básico ao avançado em informática moderna.
            </p>
          </ScrollReveal>

          {/* Estatísticas do curso */}
          <CardGridReveal
            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto"
            staggerDelay={0.1}
          >
            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{curriculum.length}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Módulos</div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-center mb-2">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{totalLessons}</div>
              <div className="text-xs sm:text-sm text-zinc-400">Aulas</div>
            </div>

            <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl p-3 sm:p-4 col-span-2 md:col-span-1">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white">{totalHours.toFixed(1)}h</div>
              <div className="text-xs sm:text-sm text-zinc-400">Duração</div>
            </div>
          </CardGridReveal>
        </div>

        {/* Módulos do curriculum */}
        <div className="space-y-4">
          {curriculum.map((module, index) => {
            const IconComponent = module.icon;
            const isOpen = openModule === module.id;

            return (
              <ScrollReveal
                key={module.id}
                animation="slide-left"
                delay={index * 0.1}
              >
                <div className="bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all duration-300">

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
                          <span className="text-blue-300 text-xs flex-shrink-0">•</span>
                          <span className="text-blue-300 text-xs whitespace-nowrap flex-shrink-0">{module.duration}</span>
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
                        <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-full px-3 py-1">
                          <span className="text-blue-300 text-sm font-medium">{module.duration}</span>
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
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA final */}
        <ScrollReveal animation="zoom-in" delay={0.3}>
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-400/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Pronto para dominar tudo isso?
            </h3>
            
            <p className="text-zinc-300 text-lg mb-6">
              Metodologia comprovada, material incluso e suporte vitalício. 
              Sua jornada de transformação digital começa aqui.
            </p>
            
            <button
              onClick={() => handleCTAClick('curriculum')}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Ver Detalhes do Curso
            </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};