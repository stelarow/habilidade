import PropTypes from 'prop-types';
import { Star, CheckCircle } from 'phosphor-react';
import { useDeferredValue, useLayoutEffect, useState } from 'react';

function CourseHero({ course, onEnrollClick }) {
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  const deferredDimensions = useDeferredValue(viewportDimensions);

  // Context 7: Performance hook para viewport tracking
  useLayoutEffect(() => {
    const updateDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions, { passive: true });
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div 
      className="@container relative text-center mb-12 sm:mb-16 px-4"
    >
      {/* Background Pattern - Removido para permitir backgrounds únicos */}

      <div className="relative z-20 max-w-4xl mx-auto pt-16 sm:pt-20 pb-12 sm:pb-16">
        
        {/* Course Badge - Versão Desktop */}
        <div 
          className="hidden @md:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 transition-all duration-300 hover:scale-105 min-h-[36px]"
          style={{ 
            backgroundColor: `${course.themeColors.primary}20`,
            color: course.themeColors.primary,
            border: `1px solid ${course.themeColors.primary}40`,
            boxShadow: `0 0 20px ${course.themeColors.primary}20`
          }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: course.themeColors.primary }}></span>
          <span>
            {course.basicInfo.category} • {course.basicInfo.level} • {course.basicInfo.duration}
            {course.basicInfo.certificate && <span> • Certificado</span>}
          </span>
        </div>

        {/* Course Badge - Versão Mobile (Layout Vertical) */}
        <div 
          className="@md:hidden flex flex-col items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold mb-4 sm:mb-6 transition-all duration-300 hover:scale-105 max-w-xs mx-auto"
          style={{ 
            backgroundColor: `${course.themeColors.primary}15`,
            color: course.themeColors.primary,
            border: `1px solid ${course.themeColors.primary}30`,
            boxShadow: `0 0 20px ${course.themeColors.primary}15`
          }}
        >
          {/* Linha 1: Categoria e Nível */}
          <div className="flex items-center gap-2 text-center">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: course.themeColors.primary }}></span>
            <span className="font-medium">
              {course.basicInfo.category} • {course.basicInfo.level}
            </span>
          </div>
          
          {/* Divisor Visual */}
          <div 
            className="w-6 sm:w-8 h-px rounded-full"
            style={{ backgroundColor: course.themeColors.primary + '40' }}
          />
          
          {/* Linha 2: Duração e Certificado */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                <path d="M13 7h-2v6l5.25 3.15.75-1.23L13 12.4z"/>
              </svg>
              <span className="font-medium">{course.basicInfo.duration}</span>
            </div>
            
            {course.basicInfo.certificate && (
              <>
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: course.themeColors.primary }}
                />
                <div className="flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-medium">Certificado</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Context 7: Title com typography responsiva mobile-first */}
        <h1 className="text-3xl sm:text-4xl @md:text-5xl @lg:text-6xl @xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          <span className="block text-2xl sm:text-3xl @md:text-4xl @lg:text-5xl @xl:text-6xl mb-1 sm:mb-2">Curso de</span>
          <span 
            className="block bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
            }}
          >
            {course.basicInfo.title}
          </span>
        </h1>
        
        {/* Context 7: Description com line-height otimizado para mobile */}
        <p className="text-base sm:text-lg @md:text-xl @lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
          {course.basicInfo.longDescription}
        </p>
        
        {/* Context 7: CTA Section com touch targets otimizados */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              onClick={onEnrollClick}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20 min-h-[44px] min-w-[200px] touch-manipulation active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`,
                boxShadow: `0 10px 30px ${course.themeColors.primary}40`
              }}
            >
              <span className="relative z-10">Solicitar Informações</span>
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${course.themeColors.gradient.to}, ${course.themeColors.gradient.from})`,
                }}
              />
            </button>
            
            {/* Info */}
            <div className="flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-gray-400 px-2">
              <CheckCircle size={14} weight="duotone" className="text-green-400 flex-shrink-0" />
              <span>Entre em contato para valores e condições</span>
            </div>
          </div>
        </div>

        {/* Context 7: Quick Stats com mobile-first grid */}
        <div className="grid grid-cols-2 @sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <div className="text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center">
            <div className="text-lg sm:text-xl @md:text-2xl font-bold text-white">{course.basicInfo.duration}</div>
            <div className="text-xs sm:text-sm text-gray-400 leading-tight">de conteúdo</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center">
            <div className="text-lg sm:text-xl @md:text-2xl font-bold text-white">{course.curriculum.length}</div>
            <div className="text-xs sm:text-sm text-gray-400 leading-tight">módulos</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center">
            <div className="text-lg sm:text-xl @md:text-2xl font-bold text-white">
              {course.curriculum.reduce((total, module) => total + module.lessons.length, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-400 leading-tight">aulas</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center">
            <div className="flex items-center justify-center gap-1 text-lg sm:text-xl @md:text-2xl font-bold text-white">
              <Star size={16} weight="fill" className="text-yellow-400" />
              5.0
            </div>
            <div className="text-xs sm:text-sm text-gray-400 leading-tight">avaliação</div>
          </div>
        </div>
      </div>
    </div>
  );
}

CourseHero.propTypes = {
  course: PropTypes.shape({
    basicInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      certificate: PropTypes.bool.isRequired,
      longDescription: PropTypes.string.isRequired,
    }).isRequired,
    curriculum: PropTypes.arrayOf(PropTypes.shape({
      lessons: PropTypes.array.isRequired,
    })).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gradient: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  onEnrollClick: PropTypes.func,
};

CourseHero.defaultProps = {
  onEnrollClick: () => {},
};

export default CourseHero; 