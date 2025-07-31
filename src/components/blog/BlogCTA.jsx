import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Star, BookOpen } from 'phosphor-react';
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

  // Função para encontrar curso relacionado
  const findRelatedCourse = (post) => {
    if (post?.cta_course_id) {
      return COURSES_DATA?.find(course => course.basicInfo.id === post.cta_course_id);
    }
    
    // Fallback: tentar encontrar por matching de conteúdo
    if (post?.content || post?.title || post?.categories) {
      const content = `${post.title} ${post.content} ${post.categories?.map(c => c.name).join(' ')}`.toLowerCase();
      
      // Palavras-chave para matching - ATUALIZADAS COM MELHORES PRÁTICAS
      const courseKeywords = {
        'informatica': ['informática', 'office', 'windows', 'excel', 'word', 'powerpoint', 'canva'],
        'design-grafico': ['design', 'gráfico', 'photoshop', 'illustrator', 'indesign', 'criação', 'visual'],
        'programacao-web': ['programação', 'web', 'html', 'css', 'javascript', 'desenvolvimento', 'site'],
        'marketing-digital': ['marketing', 'digital', 'redes sociais', 'facebook', 'instagram', 'publicidade'],
        'excel-avancado': ['excel', 'planilha', 'fórmulas', 'gráficos', 'macros', 'vba'],
        'autocad': [
          // Termos específicos do AutoCAD
          'autocad', 'desenho', 'técnico', 'cad', 'projeto', 'arquitetura',
          // NOVOS: Termos relacionados ao SketchUp e Modelagem 3D
          'sketchup', 'shape bender', 'modelagem 3d', 'modelagem', '3d', 'geometria',
          'curvatura', 'extensão', 'plugin', 'arquitetônico', 'design arquitetônico',
          'estruturas', 'fachadas', 'molduras', 'corrimão', 'ornamentos',
          'visualização 3d', 'renderização', 'maquete eletrônica', 'projetos arquitetônicos'
        ],
        'ingles': ['inglês', 'english', 'idioma', 'conversação', 'business english'],
        'montagem-manutencao': ['montagem', 'manutenção', 'hardware', 'computador', 'técnico']
      };

      for (const [courseSlug, keywords] of Object.entries(courseKeywords)) {
        if (keywords.some(keyword => content.includes(keyword))) {
          return COURSES_DATA?.find(course => course.basicInfo.slug === courseSlug);
        }
      }
    }
    
    return null;
  };

  const relatedCourse = variant === 'specific' ? findRelatedCourse(post) : null;

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

  // CTA específico para curso
  if (variant === 'specific' && relatedCourse) {
    return (
      <div className={`${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl" style={styles.container}>
          {/* Modern background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
          
          {/* Status badge - only if truly relevant */}
          {showUrgency && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium">
                <Star size={14} />
                {urgencyText}
              </span>
            </div>
          )}

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6">
            {/* Course image with better layout */}
            <div className="md:col-span-1 flex justify-center">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                {relatedCourse.basicInfo?.image ? (
                  <LazyImage
                    src={relatedCourse.basicInfo.image}
                    alt={relatedCourse.basicInfo.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="p-4 bg-blue-100 rounded-full">
                      <BookOpen size={32} className="text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content with better hierarchy */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-3">
                <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight">
                  {post?.cta_title || `Aprofunde seus conhecimentos em ${relatedCourse.basicInfo.title}`}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {post?.cta_description || `Desenvolva habilidades práticas e atualize seu conhecimento com nosso curso especializado.`}
                </p>
              </div>

              {/* Course highlights with better visual treatment */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <Clock size={16} />
                  {relatedCourse.basicInfo.duration}
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <Users size={16} />
                  {relatedCourse.basicInfo.level}
                </span>
                {relatedCourse.basicInfo.certificate && (
                  <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                    <Star size={16} />
                    Certificado incluso
                  </span>
                )}
              </div>

              {/* CTA Button with modern design */}
              <div className="pt-2">
                <Link
                  to={`/curso/${relatedCourse.basicInfo.slug}`}
                  onClick={() => handleCtaClick('specific_course', relatedCourse.basicInfo.id)}
                  className={`${classes.button} inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  style={styles.button}
                >
                  <span>Ver Detalhes do Curso</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CTA genérico com melhor design
  return (
    <div className={`${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center overflow-hidden shadow-xl" style={styles.container}>
        {/* Modern background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        
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
          {/* Icon with better design */}
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BookOpen size={32} className="text-blue-600" />
              </div>
            </div>
          </div>

          {/* Content with improved copy */}
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl font-semibold text-white leading-tight">
              {post?.cta_title || 'Desenvolva suas habilidades profissionais'}
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
              {post?.cta_description || 'Explore nossos cursos especializados e aprimore seu conhecimento com conteúdo atualizado e certificação reconhecida.'}
            </p>
          </div>

          {/* Value propositions with better visual treatment */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <Star size={16} />
              Certificação reconhecida
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <Users size={16} />
              Instrutores especialistas
            </span>
            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
              <BookOpen size={16} />
              Material didático incluso
            </span>
          </div>

          {/* CTA Button with modern design */}
          <div className="pt-2">
            <Link
              to="/cursos"
              onClick={() => handleCtaClick('generic')}
              className={`${classes.button} inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              style={styles.button}
            >
              <span>Explorar Cursos</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
          )}

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Course image */}
            <div className="md:col-span-1">
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-zinc-700 to-zinc-800">
                {relatedCourse.basicInfo?.image ? (
                  <LazyImage
                    src={relatedCourse.basicInfo.image}
                    alt={relatedCourse.basicInfo.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                    <BookOpen size={48} className="text-purple-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {post?.cta_title || `Transforme sua carreira com o curso de ${relatedCourse.basicInfo.title}`}
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {post?.cta_description || relatedCourse.basicInfo.shortDescription}
                </p>
              </div>

              {/* Course highlights */}
              <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {relatedCourse.basicInfo.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {relatedCourse.basicInfo.level}
                </span>
                {relatedCourse.basicInfo.certificate && (
                  <span className="flex items-center gap-1">
                    <Star size={16} />
                    Certificado incluso
                  </span>
                )}
              </div>

              {/* CTA Button */}
              <div>
                <Link
                  to={`/curso/${relatedCourse.basicInfo.slug}`}
                  onClick={() => handleCtaClick('specific_course', relatedCourse.basicInfo.id)}
                  className={`${classes.button} inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25`}
                  style={styles.button}
                >
                  <span>Dominar Projetos Profissionais</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CTA gen�rico
  return (
    <div className={`${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${className}`}>
      <div className="relative bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 border border-purple-500/30 rounded-2xl text-center overflow-hidden" style={styles.container}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Urgency badge */}
        {showUrgency && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-sm font-medium animate-pulse">
              <Clock size={14} />
              {urgencyText}
            </span>
          </div>
        )}

        <div className="relative space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-full">
              <BookOpen size={40} className="text-purple-300" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">
              {post?.cta_title || 'Transforme sua carreira hoje mesmo'}
            </h3>
            <p className="text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {post?.cta_description || 'Descubra nossos cursos especializados e d� o pr�ximo passo na sua jornada profissional. Certifica��o reconhecida e ensino de qualidade.'}
            </p>
          </div>

          {/* Value propositions */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Star size={16} />
              Certifica��o reconhecida
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} />
              Instrutores especialistas
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              Material did�tico incluso
            </span>
          </div>

          {/* CTA Button */}
          <div>
            <Link
              to="/cursos"
              onClick={() => handleCtaClick('generic')}
              className={`${classes.button} inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25`}
              style={styles.button}
            >
              <span>Acelerar Minha Carreira</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCTA;