import PropTypes from 'prop-types';
import { formatPrice, calculateDiscount } from '../../utils/courseHelpers';

function CourseHero({ course, onEnrollClick }) {
  const discount = calculateDiscount(course.investment);

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
        
        {/* Course Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-300 hover:scale-105"
          style={{ 
            backgroundColor: `${course.themeColors.primary}20`,
            color: course.themeColors.primary,
            border: `1px solid ${course.themeColors.primary}40`,
            boxShadow: `0 0 20px ${course.themeColors.primary}20`
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.themeColors.primary }}></span>
          {course.basicInfo.category} • {course.basicInfo.level} • {course.basicInfo.duration}
          {course.basicInfo.certificate && <span>• Certificado</span>}
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
        
        {/* Price and CTA Section */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
          
          {/* Price Box */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 min-w-[280px]">
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div 
                className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4"
                style={{ backgroundColor: course.themeColors.primary }}
              >
                {discount}% OFF
              </div>
            )}
            
            {/* Current Price */}
            <div className="text-center mb-4">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {formatPrice(course.investment.currentPrice)}
              </div>
              
              {/* Original Price */}
              {discount > 0 && (
                <div className="text-gray-400 line-through text-lg">
                  de {formatPrice(course.investment.originalPrice)}
                </div>
              )}
              
              {/* Installments */}
              <div className="text-green-400 text-sm mt-2">
                ou {course.investment.installments.max}x de {formatPrice(course.investment.installments.value)}
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="text-xs text-gray-400 text-center">
              {course.investment.paymentMethods.join(' • ')}
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col gap-4">
            <button
              onClick={onEnrollClick}
              className="group relative px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20"
              style={{
                background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`,
                boxShadow: `0 10px 30px ${course.themeColors.primary}40`
              }}
            >
              <span className="relative z-10">Matricular-se Agora</span>
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${course.themeColors.gradient.to}, ${course.themeColors.gradient.from})`,
                }}
              />
            </button>
            
            {/* Guarantee */}
            <div className="text-center text-sm text-gray-400">
              ✅ Garantia de 30 dias
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
            <div className="text-2xl font-bold text-white">⭐ 5.0</div>
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
    investment: PropTypes.shape({
      originalPrice: PropTypes.number.isRequired,
      currentPrice: PropTypes.number.isRequired,
      installments: PropTypes.shape({
        max: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      }).isRequired,
      paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
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