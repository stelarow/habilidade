import PropTypes from 'prop-types';
import { GraduationCap, Star, Trophy, Clock, CheckCircle } from '@phosphor-icons/react';

function CourseInstructor({ course }) {
  const { instructor } = course;

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Conheça seu Instrutor</h2>
        <p className="text-gray-400">
          Aprenda com quem realmente entende do assunto
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        
        {/* Instructor Photo & Basic Info */}
        <div className="flex flex-col items-center text-center lg:text-left lg:items-start">
          
          {/* Photo */}
          <div 
            className="w-32 h-32 rounded-full mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})` 
            }}
          >
            {instructor.name.split(' ').map(name => name.charAt(0)).join('')}
          </div>
          
          {/* Name & Title */}
          <h3 className="text-2xl font-bold text-white mb-2">{instructor.name}</h3>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} style={{ color: course.themeColors.primary }} />
            <span className="text-gray-300">{instructor.experience} de experiência</span>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Star size={16} className="text-yellow-400" weight="fill" />
                <span className="text-white font-semibold">4.9</span>
              </div>
              <div className="text-xs text-gray-400">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <GraduationCap size={16} style={{ color: course.themeColors.primary }} />
                <span className="text-white font-semibold">1000+</span>
              </div>
              <div className="text-xs text-gray-400">Alunos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Trophy size={16} className="text-yellow-400" />
                <span className="text-white font-semibold">15+</span>
              </div>
              <div className="text-xs text-gray-400">Prêmios</div>
            </div>
          </div>
        </div>

        {/* Instructor Details */}
        <div className="flex-1">
          
          {/* Bio */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-white mb-4">Sobre o Instrutor</h4>
            <p className="text-gray-300 leading-relaxed text-lg">
              {instructor.bio}
            </p>
          </div>

          {/* Credentials */}
          <div className="mb-8">
            <h4 className="text-xl font-semibold text-white mb-4">Qualificações & Certificações</h4>
            <div className="grid gap-3">
              {instructor.credentials.map((credential, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/30 border border-gray-700"
                >
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: course.themeColors.primary }}
                  />
                  <span className="text-gray-300">{credential}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teaching Philosophy */}
          <div className="p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-3">Filosofia de Ensino</h4>
            <blockquote className="text-gray-300 italic">
              "Acredito que todos podem aprender quando o conteúdo é explicado de forma clara, 
              prática e com exemplos reais. Meu objetivo é não apenas ensinar técnicas, 
              mas formar profissionais completos e confiantes."
            </blockquote>
            <div className="text-right mt-3">
              <span 
                className="text-sm font-medium"
                style={{ color: course.themeColors.primary }}
              >
                - {instructor.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r rounded-xl border border-gray-700"
           style={{ 
             background: `linear-gradient(135deg, ${course.themeColors.primary}10, ${course.themeColors.secondary}10)` 
           }}>
        <h4 className="text-xl font-semibold text-white mb-2">
          Aprenda com um Especialista
        </h4>
        <p className="text-gray-400 mb-4">
          Tenha acesso direto ao conhecimento e experiência de {instructor.name}
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span 
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{ 
              backgroundColor: `${course.themeColors.primary}20`,
              color: course.themeColors.primary 
            }}
          >
            <CheckCircle size={16} weight="duotone" className="text-green-400" />
            Suporte direto com o instrutor
          </span>
          <span 
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{ 
              backgroundColor: `${course.themeColors.primary}20`,
              color: course.themeColors.primary 
            }}
          >
            <CheckCircle size={16} weight="duotone" className="text-green-400" />
            Metodologia comprovada
          </span>
          <span 
            className="px-3 py-1 rounded-full flex items-center gap-1"
            style={{ 
              backgroundColor: `${course.themeColors.primary}20`,
              color: course.themeColors.primary 
            }}
          >
            <CheckCircle size={16} weight="duotone" className="text-green-400" />
            Experiência real de mercado
          </span>
        </div>
      </div>
    </div>
  );
}

CourseInstructor.propTypes = {
  course: PropTypes.shape({
    instructor: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      credentials: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
      gradient: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default CourseInstructor; 