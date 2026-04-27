import React, { useState } from 'react';
import {
  CaretDown,
  CaretUp,
  Play,
  CheckCircle,
  Palette,
  Megaphone,
  User,
  FacebookLogo,
  ShareNetwork,
  ChartLine,
  ChatCircle,
  Target
} from '@phosphor-icons/react';
import { handleCTAClick } from '../../../utils/ctaUtils';
import { ScrollReveal } from '../../../components/shared/ScrollReveal';

const curriculum = [
  {
    id: 1,
    title: 'Canva',
    description: 'Design gráfico para criar conteúdo profissional',
    duration: '10 horas',
    icon: Palette,
    color: 'from-[#00D4AA] to-[#00B894]',
    lessons: [
      { id: 1, title: 'Introdução ao Canva' },
      { id: 2, title: 'Templates e identidade visual' },
      { id: 3, title: 'Criando posts para redes sociais' },
      { id: 4, title: 'Design deStories e reels' },
      { id: 5, title: 'Criação de banners e flyers' },
      { id: 6, title: 'Carrosséis e apresentações' },
      { id: 7, title: 'Mockups e materiais profissionais' }
    ]
  },
  {
    id: 2,
    title: 'Marketing Digital',
    description: 'Estratégias e fundamentos do marketing online',
    duration: '12 horas',
    icon: Megaphone,
    color: 'from-[#3F51B5] to-[#5C6BC0]',
    lessons: [
      { id: 8, title: 'O que é Marketing Digital?' },
      { id: 9, title: 'Conhecendo seu público-alvo e persona' },
      { id: 10, title: 'Escolhendo canais de divulgação' },
      { id: 11, title: 'Marketing no Facebook e Instagram' },
      { id: 12, title: 'Conteúdos atrativos para redes sociais' },
      { id: 13, title: 'Google Meu Negócio e Google Ads' },
      { id: 14, title: 'Google Analytics e métricas' },
      { id: 15, title: 'Como vender mais e atrair leads' }
    ]
  },
  {
    id: 3,
    title: 'Marketing Pessoal',
    description: 'Construção e posicionamento da sua marca',
    duration: '8 horas',
    icon: User,
    color: 'from-[#E91E63] to-[#C2185B]',
    lessons: [
      { id: 16, title: 'Valores e autoconhecimento' },
      { id: 17, title: 'Networking e relacionamentos' },
      { id: 18, title: 'Branding pessoal' },
      { id: 19, title: 'Qualificação profissional' },
      { id: 20, title: 'Posicionamento online' }
    ]
  },
  {
    id: 4,
    title: 'Facebook Business',
    description: 'Campanhas e anúncios profissionais no Facebook',
    duration: '14 horas',
    icon: FacebookLogo,
    color: 'from-[#1877F2] to-[#0D65D9]',
    lessons: [
      { id: 21, title: 'Conhecendo o Facebook Business' },
      { id: 22, title: 'Criando conta de usuário e página' },
      { id: 23, title: 'Configurações avançadas' },
      { id: 24, title: 'Criação de públicos' },
      { id: 25, title: 'Gerenciador de anúncios' },
      { id: 26, title: 'Criando campanhas I' },
      { id: 27, title: 'Criando campanhas II' },
      { id: 28, title: 'Publicando campanhas' },
      { id: 29, title: 'Leads e Pixel de conversão' },
      { id: 30, title: 'Análise de dados' }
    ]
  },
  {
    id: 5,
    title: 'Mídias Sociais',
    description: 'Estratégias para todas as redes sociais',
    duration: '10 horas',
    icon: ShareNetwork,
    color: 'from-[#E1306C] to-[#833AB4]',
    lessons: [
      { id: 31, title: 'Introdução a mídias sociais' },
      { id: 32, title: 'Conhecendo Instagram' },
      { id: 33, title: 'Conhecendo Facebook' },
      { id: 34, title: 'Conhecendo Twitter/X' },
      { id: 35, title: 'Conhecendo LinkedIn' },
      { id: 36, title: 'Conhecendo YouTube' },
      { id: 37, title: 'Estratégia de conteúdo' },
      { id: 38, title: 'Engajamento e comunidade' }
    ]
  },
  {
    id: 6,
    title: 'Meta Business',
    description: 'Plataforma completa de anúncios Meta',
    duration: '8 horas',
    icon: ChartLine,
    color: 'from-[#0081FB] to-[#0066CC]',
    lessons: [
      { id: 39, title: 'Visão geral Meta Business' },
      { id: 40, title: 'Configurações e permissões' },
      { id: 41, title: 'Catálogo de produtos' },
      { id: 42, title: 'Campanhas avançadas' },
      { id: 43, title: 'Remarketing e conversões' }
    ]
  },
  {
    id: 7,
    title: 'Google Ads',
    description: 'Anúncios pagos no Google e YouTube',
    duration: '8 horas',
    icon: Target,
    color: 'from-[#EA4335] to-[#FBBC05]',
    lessons: [
      { id: 44, title: 'Introdução ao Google Ads' },
      { id: 45, title: 'Estrutura de campanhas' },
      { id: 46, title: 'Palavras-chave eLance' },
      { id: 47, title: 'Anúncios responsivos' },
      { id: 48, title: 'Remarketing display' },
      { id: 49, title: 'YouTube Ads' }
    ]
  },
  {
    id: 8,
    title: 'Chat GPT',
    description: 'Inteligência artificial para marketing',
    duration: '6 horas',
    icon: ChatCircle,
    color: 'from-[#10A37F] to-[#0D8A6C]',
    lessons: [
      { id: 50, title: 'Introdução ao ChatGPT' },
      { id: 51, title: 'Prompt engineering para marketing' },
      { id: 52, title: 'Criação de conteúdo com IA' },
      { id: 53, title: 'Automação de processos' }
    ]
  },
  {
    id: 9,
    title: 'Técnicas de Vendas',
    description: 'Fechamento e conversão de clientes',
    duration: '6 horas',
    icon: Target,
    color: 'from-[#FF6B00] to-[#E65100]',
    lessons: [
      { id: 54, title: 'Fundamentos de vendas' },
      { id: 55, title: 'Qualificação de leads' },
      { id: 56, title: 'Objection handling' },
      { id: 57, title: 'Fechamento e follow-up' }
    ]
  }
];

export const MarketingDigitalCurriculum = () => {
  const [openModule, setOpenModule] = useState(null);

  const toggleModule = (moduleId) => {
    setOpenModule(openModule === moduleId ? null : moduleId);
  };

  const totalHours = curriculum.reduce((accumulator, module) => {
    return accumulator + Number.parseFloat(module.duration.replace(' horas', '').replace(',', '.'));
  }, 0);

  const totalLessons = curriculum.reduce((accumulator, module) => accumulator + module.lessons.length, 0);

  return (
    <section id="curriculo" className="px-6 py-20 lg:py-24 bg-[#000000]">
      <div className="container mx-auto max-w-7xl">
        {/* Header - Bugatti style uppercase */}
        <div className="text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[3px] text-white mb-6 uppercase">
              O QUE VOCÊ VAI APRENDER
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={0.2}>
            <p className="text-lg text-[#cccccc] max-w-3xl mx-auto leading-relaxed font-serif mb-8">
              {curriculum.length} módulos completos, {totalLessons} aulas práticas, {totalHours} horas de conteúdo.
              Do básico ao avançado em marketing digital.
            </p>
          </ScrollReveal>

          {/* Stats - Bugatti style grid */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="border border-[#262626] p-4 text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">{curriculum.length}</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono mt-1">Módulos</div>
            </div>

            <div className="border border-[#262626] p-4 text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">{totalLessons}</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono mt-1">Aulas</div>
            </div>

            <div className="border border-[#262626] p-4 text-center">
              <div className="text-2xl font-normal text-white tracking-[2px]">{totalHours}h</div>
              <div className="text-[#999999] text-xs tracking-[2px] uppercase font-mono mt-1">Duração</div>
            </div>
          </div>
        </div>

        {/* Module List - Bugatti style cards */}
        <div className="space-y-4">
          {curriculum.map((module, index) => {
            const IconComponent = module.icon;
            const isOpen = openModule === module.id;

            return (
              <ScrollReveal
                key={module.id}
                animation="slide-left"
                delay={index * 0.08}
              >
                <div className="border border-[#262626] bg-[#0d0d0d] hover:border-[#3a3a3a] transition-all duration-300">
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 text-left flex items-center gap-6 hover:bg-[#141414]/30 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>

                    {/* Module Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-normal text-white tracking-[1.5px] uppercase">
                          Módulo {module.id}: {module.title}
                        </h3>
                      </div>
                      <p className="text-[#999999] text-sm font-serif">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-[#666666] font-mono tracking-[1px] uppercase">
                        <span>{module.lessons.length} aulas</span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <CaretUp className="w-5 h-5 text-[#999999]" />
                      ) : (
                        <CaretDown className="w-5 h-5 text-[#999999]" />
                      )}
                    </div>
                  </button>

                  {/* Module Content */}
                  {isOpen && (
                    <div className="border-t border-[#262626] p-6 bg-[#0d0d0d]/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-3 p-3 border border-[#262626] hover:border-[#3a3a3a] transition-colors"
                          >
                            <div className={`w-8 h-8 bg-gradient-to-br ${module.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <span className="text-white text-xs font-mono">{lessonIndex + 1}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="text-sm text-white truncate">{lesson.title}</div>
                            </div>
                            <CheckCircle className="w-4 h-4 text-[#666666] flex-shrink-0" />
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

        {/* CTA - Bugatti style */}
        <ScrollReveal animation="zoom-in" delay={0.3}>
          <div className="text-center mt-16">
            <div className="border border-[#262626] bg-[#0d0d0d] p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-normal text-white tracking-[2px] uppercase mb-4">
                Pronto para começar?
              </h3>
              <p className="text-[#cccccc] font-serif mb-6">
                Material incluído, suporte dos professores e certificado profissional.
              </p>
              <button
                onClick={() => handleCTAClick('curriculum')}
                className="inline-flex items-center px-10 py-4 border border-white text-white font-mono text-sm tracking-[2.5px] uppercase rounded-full hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                Ver Detalhes do Curso
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
