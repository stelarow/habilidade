import React from 'react';
import { 
  ArrowRight,
  CheckCircle,
  Play
} from '@phosphor-icons/react';

const CourseWorkflowSection = ({ workflowExamples, toolComparisons, themeColors }) => {
  const toolColors = {
    'AutoCAD 2D': '#E51937',
    'SketchUp Pro': '#005CAF', 
    'Revit': '#0078BE',
    'Enscape': '#FF6B35'
  };

  return (
    <section id="workflow" className="course-workflow-section py-16">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Workflow Integrado Profissional
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprenda como combinar todas as ferramentas em projetos reais, 
            do esboço técnico até a apresentação final
          </p>
        </div>

        {/* Workflow Examples */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {Object.entries(workflowExamples).map(([key, workflow]) => (
            <div key={key} className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {workflow.title}
                </h3>
                <p className="text-gray-300">
                  {workflow.description}
                </p>
              </div>

              <div className="space-y-6">
                {workflow.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    {/* Step Number */}
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        backgroundColor: toolColors[step.tool] || themeColors.primary
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">
                          {step.tool}
                        </h4>
                        {index < workflow.steps.length - 1 && (
                          <ArrowRight size={16} className="text-gray-400" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">
                        {step.description}
                      </p>
                      <p className="text-gray-400 text-xs">
                        <strong>Entrega:</strong> {step.deliverable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result */}
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-green-300 font-medium mb-1">Resultado Final</h5>
                    <p className="text-green-200 text-sm">{workflow.result}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tool Comparison Guide */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-3">
              Guia de Escolha de Ferramentas
            </h3>
            <p className="text-gray-300">
              Quando usar cada ferramenta para máxima eficiência
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolComparisons.map((comparison, index) => (
              <div 
                key={index}
                className="bg-gray-700/30 border border-gray-600/20 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
              >
                <div className="mb-3">
                  <h4 className="text-white font-medium text-sm mb-1">
                    {comparison.scenario}
                  </h4>
                  <div 
                    className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                    style={{
                      backgroundColor: toolColors[comparison.recommendation] || themeColors.primary
                    }}
                  >
                    {comparison.recommendation}
                  </div>
                </div>
                <p className="text-gray-300 text-sm">
                  {comparison.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h4 className="text-2xl font-bold text-white mb-4">
              Pronto para Dominar o Workflow Completo?
            </h4>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Aprenda o workflow integrado que os escritórios de arquitetura de Santa Catarina 
              estão usando para projetos mais eficientes e apresentações impactantes.
            </p>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contato');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${themeColors.gradient.from}, ${themeColors.gradient.to})`
              }}
            >
              <Play size={20} weight="fill" />
              Iniciar Formação Completa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseWorkflowSection;