import { getIconForContext } from '../IconWrapper';

function CourseJourney({ course }) {
  // Dados padrão da jornada caso não existam nos dados do curso
  const defaultSteps = [
    {
      number: 1,
      title: 'Fundamentos',
      description: 'Aprenda conceitos básicos e ferramentas essenciais da profissão',
      icon: 'House'
    },
    {
      number: 2,
      title: 'Prática',
      description: 'Desenvolva projetos reais e construa seu portfólio profissional',
      icon: 'Wrench'
    },
    {
      number: 3,
      title: 'Especialização',
      description: 'Domine técnicas avançadas e tendências atuais do mercado',
      icon: 'Crown'
    },
    {
      number: 4,
      title: 'Profissionalização',
      description: 'Prepare-se para oportunidades de trabalho e networking',
      icon: 'Trophy'
    }
  ];

  // Usa os dados do curso se existirem, senão usa os dados padrão
  const steps = course?.journey?.steps || defaultSteps;

  return (
    <section className="mb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Sua Jornada de Transformação
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Veja como você vai evoluir passo a passo até se tornar um profissional qualificado
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Linha conectora vertical */}
            <div 
              className="absolute left-6 top-12 bottom-12 w-1 rounded-full hidden md:block"
              style={{ 
                background: `linear-gradient(to bottom, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})` 
              }}
            />

            {/* Etapas da jornada */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className="relative flex items-start gap-6 group"
                >
                  {/* Número da etapa com ícone */}
                  <div className="flex-shrink-0 relative">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative"
                      style={{ 
                        background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})` 
                      }}
                    >
                      {step.number}
                    </div>
                    
                    {/* Ícone sobreposto */}
                    <div 
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-md group-hover:scale-110 transition-transform duration-300 z-20"
                      style={{ 
                        backgroundColor: course?.themeColors?.primary || '#2196F3',
                        borderColor: course?.themeColors?.primary || '#2196F3'
                      }}
                    >
                      {getIconForContext(step.icon, 'journey', '#ffffff')}
                    </div>
                  </div>

                  {/* Conteúdo da etapa */}
                  <div className="flex-1 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                      {step.description}
                    </p>

                    {/* Indicador visual de progresso */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="text-sm text-gray-400">
                        Etapa {step.number} de {steps.length}
                      </div>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${(step.number / steps.length) * 100}%`,
                            background: `linear-gradient(90deg, ${course?.themeColors?.gradient?.from || '#2196F3'}, ${course?.themeColors?.gradient?.to || '#00BCD4'})`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseJourney; 