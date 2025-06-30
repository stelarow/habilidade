import PropTypes from 'prop-types';
import { Star, Quotes } from 'phosphor-react';

function CourseTestimonials({ course }) {
  if (!course.testimonials || course.testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        weight={index < rating ? 'fill' : 'regular'}
        className={index < rating ? 'text-yellow-400' : 'text-gray-400'}
      />
    ));
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">O que nossos alunos falam</h2>
        <p className="text-gray-400 text-lg">
          Resultados reais de quem já transformou a carreira
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {course.testimonials.map((testimonial) => (
          <div 
            key={testimonial.id}
            className="relative bg-gray-800/30 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group"
          >
            
            {/* Quote Icon */}
            <div className="absolute -top-3 -left-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: course.themeColors.primary }}
              >
                <Quotes size={16} weight="fill" className="text-white" />
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-4">
              {renderStars(testimonial.rating)}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-gray-300 text-lg leading-relaxed mb-6">
              "{testimonial.text}"
            </blockquote>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
                style={{ backgroundColor: course.themeColors.primary }}
              >
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold">{testimonial.name}</div>
                <div className="text-gray-400 text-sm">{testimonial.role}</div>
              </div>
            </div>

            {/* Result Badge */}
            {testimonial.result && (
              <div 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${course.themeColors.primary}20`,
                  color: course.themeColors.primary,
                  border: `1px solid ${course.themeColors.primary}40`
                }}
              >
                🎯 {testimonial.result}
              </div>
            )}

            {/* Hover Effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
              style={{ backgroundColor: course.themeColors.primary }}
            />
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-10 p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-2">
          Pronto para ser o próximo caso de sucesso?
        </h3>
        <p className="text-gray-400 mb-4">
          Junte-se a centenas de alunos que já transformaram suas carreiras
        </p>
        <button
          className="px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105"
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