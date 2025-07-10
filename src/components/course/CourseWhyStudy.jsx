import { getIconForContext } from '../IconWrapper';

function CourseWhyStudy({ course }) {
  // Dados padrão dos benefícios caso não existam nos dados do curso
  const defaultBenefits = [
    {
      icon: 'BookOpen',
      title: 'Guia de aprendizado estruturado',
      description: 'Metodologia estruturada para acelerar seu progresso do básico ao avançado'
    },
    {
      icon: 'TrendUp', 
      title: 'Do básico ao avançado',
      description: 'Evolua gradualmente até dominar completamente a profissão'
    },
    {
      icon: 'Users',
      title: 'Você dentro do mercado',
      description: 'Habilidades realmente demandadas pelas empresas atualmente'
    }
  ];

  // Usa os dados do curso se existirem, senão usa os dados padrão
  const benefits = course?.whyStudy?.benefits || defaultBenefits;

  return (
    <section className="mb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Por que estudar conosco?
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Descubra os benefícios exclusivos que vão acelerar sua jornada profissional
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="text-center">
                {/* Ícone */}
                <div 
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{ 
                    backgroundColor: `${course?.themeColors?.primary}20`,
                    border: `2px solid ${course?.themeColors?.primary}40`
                  }}
                >
                  {getIconForContext(benefit.icon, 'whyStudy', course?.themeColors?.primary || '#2196F3')}
                </div>

                {/* Título */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-white transition-colors">
                  {benefit.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CourseWhyStudy; 