import React from 'react';
import { 
  Wrench, 
  PencilLine, 
  Buildings, 
  Eye,
  ArrowRight,
  CheckCircle
} from 'phosphor-react';

const CourseToolsOverview = ({ course }) => {
  const tools = [
    { 
      id: 'sketchup', 
      name: 'SketchUp Pro', 
      icon: Wrench,
      color: '#005CAF',
      role: 'Modelagem 3D',
      description: 'Base sólida em criação de modelos 3D profissionais',
      keyFeature: '20 aulas práticas'
    },
    { 
      id: 'autocad', 
      name: 'AutoCAD 2D', 
      icon: PencilLine,
      color: '#E51937',
      role: 'Documentação Técnica',
      description: 'Plantas baixas e documentação técnica profissional',
      keyFeature: '15 projetos técnicos'
    },
    { 
      id: 'revit', 
      name: 'Revit BIM', 
      icon: Buildings,
      color: '#0078BE',
      role: 'BIM & Compatibilização',
      description: 'Metodologia BIM para projetos de grande escala',
      keyFeature: '10 casos reais'
    },
    { 
      id: 'enscape', 
      name: 'Enscape IA', 
      icon: Eye,
      color: '#FF6B35',
      role: 'Renderização Realista',
      description: 'Visualizações fotorrealísticas com inteligência artificial',
      keyFeature: '8 renderizações'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Domine o Workflow Completo do Projeto 3D
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            4 ferramentas profissionais integradas para formar o projetista 3D completo que o mercado procura.
          </p>
          
          {/* Workflow Flow */}
          <div className="flex items-center justify-center flex-wrap gap-4 mb-12">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2">
              <span className="text-blue-700 font-medium">Conceito</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-2">
              <span className="text-red-700 font-medium">Documentação</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2">
              <span className="text-blue-700 font-medium">Modelagem BIM</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-2">
              <span className="text-orange-700 font-medium">Apresentação</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            
            return (
              <div 
                key={tool.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}15` }}
                  >
                    <Icon 
                      size={28} 
                      weight="duotone"
                      style={{ color: tool.color }}
                    />
                  </div>
                  <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {index + 1}º Módulo
                  </div>
                </div>
                
                {/* Tool Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {tool.name}
                </h3>
                
                <div 
                  className="text-sm font-medium mb-3"
                  style={{ color: tool.color }}
                >
                  {tool.role}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {tool.description}
                </p>
                
                {/* Key Feature */}
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" weight="duotone" />
                  <span className="text-sm font-medium text-green-700">
                    {tool.keyFeature}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Resultado: Profissional 3D Completo
            </h3>
            <p className="text-gray-600 mb-6">
              Ao final do curso, você dominará todo o processo: desde a concepção até a apresentação final, 
              preparado para qualquer tipo de projeto no mercado de trabalho.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>94 horas de conteúdo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>4 ferramentas integradas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Certificado profissional</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CourseToolsOverview;