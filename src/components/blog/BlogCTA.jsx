import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Not needed for SSG
import { ArrowRight, Clock, Users, Star, BookOpen } from '@phosphor-icons/react';
import LazyImage from '../LazyImage';
import COURSES_DATA from '../../data/coursesData';
import { useCTAResponsive } from '../../hooks/useCTAResponsive';

/**
 * BlogCTA Component - Sistema inteligente de CTAs contextuais
 * Implementa CTAs espec�ficos por curso ou gen�ricos para convers�o
 */
const BlogCTA = ({ 
  post, 
  variant = 'specific', // 'specific' | 'generic'
  showUrgency = false,
  urgencyText = 'Inscrições abertas',
  className = '',
  onCtaClick = null // Para tracking de analytics
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { classes, styles, isMobile, shouldStack } = useCTAResponsive();

  // Animação de entrada suave
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Mapeamento correto dos dados dos cursos da página principal
  const COURSE_MAPPING = {
    'projetista-3d': {
      title: 'Projetista',
      slug: 'projetista-3d', 
      icon: 'Cube',
      desc: 'SketchUp, Enscape, Renderização com IA, Projetos 3D…',
      textColor: 'text-orange-400',
      borderGradient: 'from-orange-500/60 to-amber-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#f97316aa]',
    },
    'edicao-video': {
      title: 'Edição de Vídeo',
      slug: 'edicao-video',
      icon: 'FilmSlate', 
      desc: 'Premiere, After Effects, DaVinci Resolve, Motion Graphics…',
      textColor: 'text-red-400',
      borderGradient: 'from-red-500/60 to-pink-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#f87171aa]',
    },
    'informatica': {
      title: 'Informática',
      slug: 'informatica',
      icon: 'Desktop',
      desc: 'Windows, Word, Excel (fundamental → avançado)…',
      textColor: 'text-blue-400',
      borderGradient: 'from-blue-500/60 to-indigo-400/60', 
      hoverShadow: 'hover:shadow-[0_0_25px_#60a5faaa]',
    },
    'design-grafico': {
      title: 'Design Gráfico',
      slug: 'design-grafico',
      icon: 'PenNib',
      desc: 'Photoshop, Illustrator, InDesign, Canva, Social…',
      textColor: 'text-pink-400',
      borderGradient: 'from-pink-500/60 to-rose-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#f472b6aa]',
    },
    'programacao': {
      title: 'Programação',
      slug: 'programacao',
      icon: 'Code',
      desc: 'Lógica, Python, Java, PHP, Android Studio, Jogos…',
      textColor: 'text-green-400',
      borderGradient: 'from-green-500/60 to-emerald-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#4ade80aa]',
    },
    'marketing-digital': {
      title: 'Marketing Digital',
      slug: 'marketing-digital',
      icon: 'ChartLine',
      desc: 'Social Ads, SEO, Copywriting, Canva, Branding, Analytics…',
      textColor: 'text-purple-400',
      borderGradient: 'from-purple-500/60 to-violet-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#a78bfaaa]',
    },
    'inteligencia-artificial': {
      title: 'Inteligência Artificial',
      slug: 'inteligencia-artificial',
      icon: 'Robot',
      desc: 'Cursor, Prompt Engineering, ChatGPT, Visão…',
      textColor: 'text-cyan-400',
      borderGradient: 'from-cyan-500/60 to-teal-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#22d3eeaa]',
    },
    'business-intelligence': {
      title: 'Business Intelligence',
      slug: 'business-intelligence',
      icon: 'ChartBar',
      desc: 'Master Excel, Power BI, Dashboards, Storytelling de Dados…',
      textColor: 'text-indigo-400',
      borderGradient: 'from-indigo-500/60 to-blue-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#818cf8aa]',
    },
    'administracao': {
      title: 'Administração',
      slug: 'administracao',
      icon: 'Briefcase',
      desc: 'Office, Excel Avançado, DP, Matemática Financeira, Liderança…',
      textColor: 'text-violet-400',
      borderGradient: 'from-violet-500/60 to-purple-400/60',
      hoverShadow: 'hover:shadow-[0_0_25px_#8b5cf6aa]',
    },
  };

  // Função corrigida para encontrar curso relacionado
  const findRelatedCourse = (post) => {
    if (post?.cta_course_id) {
      return COURSES_DATA?.find(course => course.basicInfo.id === post.cta_course_id);
    }
    
    // Fallback: matching por conteúdo com algoritmo corrigido
    if (post?.content || post?.title || post?.categories) {
      const content = `${post.title || ''} ${post.content || ''} ${post.categories?.map(c => c.name).join(' ') || ''}`.toLowerCase();
      
      // ALGORITMO CORRIGIDO: Palavras-chave mais específicas e ordenadas por prioridade
      const courseKeywords = {
        // 1. PROJETISTA - Termos mais específicos primeiro
        'projetista-3d': [
          'sketchup', 'shape bender', 'enscape', 'modelagem 3d', 'renderização 3d',
          'projetos arquitetônicos', 'arquitetura 3d', 'maquete eletrônica', 
          'geometria 3d', 'curvatura 3d', 'extensão sketchup', 'plugin sketchup',
          'visualização arquitetônica', 'projeto 3d', 'desenho arquitetônico 3d'
        ],
        
        // 2. DESIGN GRÁFICO - Removidos termos conflitantes
        'design-grafico': [
          'photoshop', 'illustrator', 'indesign', 'design gráfico', 'identidade visual',
          'logotipo', 'branding visual', 'diagramação', 'layout', 'tipografia',
          'cores', 'composição visual', 'arte gráfica', 'criação gráfica'
        ],
        
        // 3. INFORMÁTICA - Mantido
        'informatica': [
          'windows', 'word', 'powerpoint', 'office', 'informática básica',
          'computador básico', 'digitação', 'internet básica'
        ],
        
        // 4. PROGRAMAÇÃO - Mantido
        'programacao': [
          'programação', 'código', 'python', 'java', 'php', 'javascript', 'html', 'css',
          'desenvolvimento', 'software', 'app', 'aplicativo', 'sistema'
        ],
        
        // 5. MARKETING DIGITAL - Mantido
        'marketing-digital': [
          'marketing digital', 'redes sociais', 'facebook ads', 'instagram', 'google ads',
          'seo', 'copywriting', 'tráfego pago', 'analytics', 'social media'
        ],
        
        // 6. INTELIGÊNCIA ARTIFICIAL - Mantido
        'inteligencia-artificial': [
          'inteligência artificial', 'ia', 'chatgpt', 'prompt engineering', 'machine learning',
          'cursor ai', 'copilot', 'automação ia'
        ],
        
        // 7. BUSINESS INTELLIGENCE - Mantido 
        'business-intelligence': [
          'power bi', 'business intelligence', 'dashboard', 'kpi', 'data visualization',
          'análise de dados', 'storytelling dados'
        ],
        
        // 8. EDIÇÃO DE VÍDEO - Mantido
        'edicao-video': [
          'premiere', 'after effects', 'davinci resolve', 'edição vídeo', 'motion graphics',
          'vídeo', 'montagem', 'pós-produção'
        ],
        
        // 9. ADMINISTRAÇÃO - Mantido
        'administracao': [
          'administração', 'gestão', 'liderança', 'dp', 'departamento pessoal',
          'matemática financeira', 'excel avançado admin'
        ],
        
        // 10. EXCEL AVANÇADO - Incluído na categoria Business Intelligence
        'business-intelligence-excel': [
          'excel', 'planilha', 'fórmulas excel', 'gráficos excel', 'macros', 'vba'
        ]
      };

      // Busca em ordem de prioridade - curso mais específico primeiro
      for (const [courseSlug, keywords] of Object.entries(courseKeywords)) {
        if (keywords.some(keyword => content.includes(keyword))) {
          const courseData = COURSES_DATA?.find(course => course.basicInfo.slug === courseSlug);
          if (courseData) {
            return courseData;
          }
        }
      }
    }
    
    return null;
  };

  const relatedCourse = variant === 'specific' ? findRelatedCourse(post) : null;
  const courseStyle = relatedCourse ? COURSE_MAPPING[relatedCourse.basicInfo.slug] : null;

  // Handle CTA click tracking
  const handleCtaClick = (ctaType, courseId = null) => {
    if (onCtaClick) {
      onCtaClick({
        type: ctaType,
        postSlug: post?.slug,
        courseId: courseId,
        timestamp: Date.now(),
        urgencyShown: showUrgency
      });
    }
  };

  // CTA específico para curso - Usando design dos cards da página principal
  if (variant === 'specific' && relatedCourse && courseStyle) {
    return (
      <div className={`${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
        <div className="relative w-full max-w-2xl mx-auto">
          {/* Status badge - similar to homepage */}
          {showUrgency && (
            <div className="absolute -top-3 right-4 z-10">
              <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse">
                <Star size={14} />
                {urgencyText}
              </span>
            </div>
          )}

          {/* Card principal - baseado no design da homepage */}
          <a
            href={`/cursos/${courseStyle.slug}`}
            onClick={() => handleCtaClick('specific_course', relatedCourse.basicInfo.id)}
            className={`card-enter in-view relative clip-card w-full h-auto p-[3px] bg-gradient-to-r ${courseStyle.borderGradient} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${courseStyle.hoverShadow} focus-visible:ring-2 ring-fuchsia-500 focus:outline-none block`}
          >
            <div className="clip-card w-full h-full bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition">
              
              {/* Header com título personalizado */}
              <div className="px-8 pt-6 pb-4">
                <h3 className={`text-2xl font-bold leading-tight ${courseStyle.textColor}`}>
                  {post?.cta_title || `Domine ${courseStyle.title} na Prática`}
                </h3>
                <p className="text-gray-300 mt-3 leading-relaxed">
                  {post?.cta_description || `Desenvolva habilidades práticas e atualize seu conhecimento com nosso curso especializado em ${courseStyle.title}.`}
                </p>
              </div>

              {/* Content area - similar ao card da homepage mas expandido */}
              <div className="flex items-center gap-6 px-8 pb-6">
                
                {/* Área do curso - sem ícone, mas com melhor destaque */}
                <div className="flex flex-col gap-3 min-w-0 flex-1">
                  <div className={`text-lg font-semibold ${courseStyle.textColor}`}>
                    {courseStyle.title}
                  </div>
                  <p className="text-sm text-zinc-300 leading-snug">
                    {courseStyle.desc}
                  </p>
                  
                  {/* Course highlights */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2">
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                      <Clock size={12} />
                      {relatedCourse.basicInfo.duration}
                    </span>
                    <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                      <Users size={12} />
                      {relatedCourse.basicInfo.level}
                    </span>
                    {relatedCourse.basicInfo.certificate && (
                      <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                        <Star size={12} />
                        Certificado incluso
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex-shrink-0">
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${courseStyle.borderGradient.replace('/60', '')} text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`}>
                    <span>Ver Detalhes</span>
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }

  // CTA genérico - design simplificado
  return (
    <div className={`${classes.container} cta-main cta-type-generic transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center overflow-hidden shadow-xl max-w-2xl mx-auto" style={styles.container}>
        {/* Modern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        
        {/* Status badge */}
        {showUrgency && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium">
              <Star size={14} />
              {urgencyText}
            </span>
          </div>
        )}

        <div className="relative space-y-6 p-8">
          {/* Content sem ícone */}
          <div className="space-y-4">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {post?.cta_title || 'Desenvolva suas habilidades profissionais'}
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {post?.cta_description || 'Explore nossos cursos especializados e aprimore seu conhecimento com conteúdo atualizado e certificação reconhecida.'}
            </p>
          </div>

          {/* Value propositions */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <Star size={16} />
              Certificação reconhecida
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <Users size={16} />
              Instrutores especialistas
            </span>
          </div>

          {/* CTA Button */}
          <div className="pt-2">
            <a
              href="/cursos"
              onClick={() => handleCtaClick('generic')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <span>Explorar Cursos</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCTA;