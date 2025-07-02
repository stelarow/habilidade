import PropTypes from 'prop-types';
import { Star, CheckCircle } from 'phosphor-react';

function CourseHero({ course, onEnrollClick }) {

  return (
    <div 
      className="relative text-center mb-16 px-4"
      style={{
        background: `linear-gradient(135deg, ${course.themeColors.gradient.from}15 0%, ${course.themeColors.gradient.to}15 100%), radial-gradient(circle at top, #1a1a1a 0%, #000000 100%)`
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${course.themeColors.primary}40 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${course.themeColors.secondary}40 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto pt-20 pb-16">
        
        {/* Course Badge - Versão Desktop */}
        <div 
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-300 hover:scale-105"
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
          className="sm:hidden flex flex-col items-center gap-3 px-6 py-4 rounded-2xl text-sm font-semibold mb-6 transition-all duration-300 hover:scale-105 max-w-xs mx-auto"
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
            className="w-8 h-px rounded-full"
            style={{ backgroundColor: course.themeColors.primary + '40' }}
          />
          
          {/* Linha 2: Duração e Certificado */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span className="font-medium">Certificado</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="block">Curso de</span>
          <span 
            className="block bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
            }}
          >
            {course.basicInfo.title}
          </span>
        </h1>
        
        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          {course.basicInfo.longDescription}
        </p>
        
        {/* CTA Section */}
        <div className="flex justify-center">
          <div className="flex flex-col gap-4">
            <button
              onClick={onEnrollClick}
              className="group relative px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20"
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
            <div className="flex items-center justify-center gap-2 text-center text-sm text-gray-400">
              <CheckCircle size={16} weight="duotone" className="text-green-400 flex-shrink-0" />
              <span>Entre em contato para valores e condições</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{course.basicInfo.duration}</div>
            <div className="text-sm text-gray-400">de conteúdo</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{course.curriculum.length}</div>
            <div className="text-sm text-gray-400">módulos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {course.curriculum.reduce((total, module) => total + module.lessons.length, 0)}
            </div>
            <div className="text-sm text-gray-400">aulas</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
              <Star size={20} weight="fill" className="text-yellow-400" />
              5.0
            </div>
            <div className="text-sm text-gray-400">avaliação</div>
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