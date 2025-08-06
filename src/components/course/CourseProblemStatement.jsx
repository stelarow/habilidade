import React from 'react';
import { 
  TrendUp,
  Users,
  Lightbulb,
  ArrowRight
} from 'phosphor-react';

const CourseProblemStatement = ({ course }) => {
  const problems = [
    {
      icon: TrendUp,
      title: "Renders que Demoram Dias",
      description: "Profissionais perdem projetos por não conseguir entregar visualizações rápidas e profissionais para clientes exigentes.",
      stat: "8+ horas"
    },
    {
      icon: Users,
      title: "Projetos Rejeitados por Clientes", 
      description: "Apresentações amadoras com SketchUp básico fazem você perder para concorrentes com renders fotorrealísticos.",
      stat: "40% rejeição"
    },
    {
      icon: Lightbulb,
      title: "Retrabalho por Incompatibilidade",
      description: "Arquivos que não conversam entre si geram horas de retrabalho e atraso na entrega de projetos técnicos.",
      stat: "15h perdidas"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Problemas que Todo Projetista 3D Enfrenta
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Você está perdendo projetos e clientes porque ainda não domina o workflow completo 
            do profissional 3D moderno: do desenho técnico até renderizações fotorrealísticas instantâneas.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            
            return (
              <div 
                key={index}
                className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-500/20 border-2 border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-red-400" weight="duotone" />
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {problem.stat}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-gray-200 transition-colors">
                  {problem.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Solution Transition */}
        <div className="text-center">
          <div 
            className="inline-flex items-center gap-4 rounded-full px-8 py-4 backdrop-blur-sm border border-blue-500/30"
            style={{ 
              background: `linear-gradient(135deg, ${course?.themeColors?.gradient?.from || '#2196F3'}20, ${course?.themeColors?.gradient?.to || '#21CBF3'}20)`
            }}
          >
            <span className="text-lg text-white font-medium">
              A solução? Domine SketchUp + AutoCAD + Revit + Enscape com IA em um curso só
            </span>
            <ArrowRight 
              size={20} 
              className="font-bold" 
              style={{ color: course?.themeColors?.primary || '#2196F3' }}
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseProblemStatement;