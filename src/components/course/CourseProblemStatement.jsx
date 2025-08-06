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
      title: "Mercado Exige Versatilidade",
      description: "Empresas buscam profissionais que dominem múltiplas ferramentas, não apenas uma.",
      stat: "73% das vagas"
    },
    {
      icon: Users,
      title: "Competição Acirrada",
      description: "Profissionais limitados a uma ferramenta têm menos oportunidades no mercado.",
      stat: "35% a menos"
    },
    {
      icon: Lightbulb,
      title: "Projetos Mais Complexos",
      description: "Clientes modernos exigem soluções completas: do conceito à apresentação final.",
      stat: "90% dos projetos"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Por que apenas SketchUp não é mais suficiente?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            O mercado de projeto 3D evoluiu. Hoje, ser um profissional completo 
            significa dominar todo o workflow: do conceito técnico à apresentação visual impactante.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            
            return (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8 text-center hover:bg-gray-700/50 transition-all duration-300"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} className="text-red-400" weight="duotone" />
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {problem.stat}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-4">
                  {problem.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Solution Transition */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/30 rounded-full px-8 py-4">
            <span className="text-lg text-white font-medium">
              A solução? Um curso completo que te prepara para o mercado real
            </span>
            <ArrowRight size={20} className="text-blue-400" weight="bold" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseProblemStatement;