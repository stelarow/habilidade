import PropTypes from 'prop-types';
import { Star, Quotes, Target } from '@phosphor-icons/react';
import { useLayoutEffect, useRef, useState, useDeferredValue } from 'react';

function CourseTestimonials({ course }) {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [expandedCards, setExpandedCards] = useState(new Set());
  
  // Defer expensive operations for better performance
  const deferredExpandedCards = useDeferredValue(expandedCards);

  // Measure container height with useLayoutEffect (Context 7 best practice)
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      setContainerHeight(height);
    }
  }, [course.testimonials]);

  if (!course.testimonials || course.testimonials.length === 0) {
    return null;
  }

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={18}
        weight={index < rating ? 'duotone' : 'regular'}
        className={index < rating ? 'text-yellow-400' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8">
      
      {/* Header - Mobile-first responsive */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">
          O que nossos alunos falam
        </h2>
        <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
          Resultados reais de quem já transformou a carreira
        </p>
      </div>

      {/* Container Query Approach - Context 7 */}
      <div ref={containerRef} className="@container">
        
        {/* Mobile-first Grid - Context 7 best practice */}
        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {course.testimonials.map((testimonial) => {
            const isExpanded = deferredExpandedCards.has(testimonial.id);
            const textIsTruncated = testimonial.text.length > 150;
            
            return (
              <div 
                key={testimonial.id}
                className="relative bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
              >
                
                {/* Quote Icon */}
                <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3">
                  <div 
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: course.themeColors.primary }}
                  >
                    <Quotes size={14} weight="duotone" className="text-white sm:w-[18px] sm:h-[18px]" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text - Smart truncation for mobile */}
                <blockquote className="text-gray-300 leading-relaxed mb-4 sm:mb-6">
                  <span className={`text-sm sm:text-base lg:text-lg ${
                    !isExpanded && textIsTruncated 
                      ? 'line-clamp-3 sm:line-clamp-4' 
                      : ''
                  }`}>
                    "{testimonial.text}"
                  </span>
                  
                  {/* Read More/Less Button - Only on mobile/small screens */}
                  {textIsTruncated && (
                    <button
                      onClick={() => toggleExpanded(testimonial.id)}
                      className="block sm:hidden mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isExpanded ? 'Ler menos' : 'Ler mais'}
                    </button>
                  )}
                </blockquote>

                {/* Author Info - Responsive layout */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg"
                    style={{ backgroundColor: course.themeColors.primary }}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm sm:text-base">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>

                {/* Result Badge - Mobile optimized */}
                {testimonial.result && (
                  <div 
                    className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium"
                    style={{ 
                      backgroundColor: `${course.themeColors.primary}20`,
                      color: course.themeColors.primary,
                      border: `1px solid ${course.themeColors.primary}40`
                    }}
                  >
                    <Target size={12} weight="duotone" className="text-orange-400 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-[120px] sm:max-w-none">
                      {testimonial.result}
                    </span>
                  </div>
                )}

                {/* Hover Effect */}
                <div 
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: course.themeColors.primary }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action - Mobile-first responsive */}
      <div className="text-center mt-6 sm:mt-8 lg:mt-10 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Pronto para ser o próximo caso de sucesso?
        </h3>
        <p className="text-gray-400 mb-4 text-sm sm:text-base">
          Junte-se a centenas de alunos que já transformaram suas carreiras
        </p>
        <button
          className="px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
          style={{
            background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
          }}
        >
          Garantir Minha Vaga
        </button>
      </div>
    </div>
  );
}

CourseTestimonials.propTypes = {
  course: PropTypes.shape({
    testimonials: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      result: PropTypes.string,
    })),
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gradient: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CourseTestimonials; 