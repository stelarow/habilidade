import React from 'react';
import { 
  Wrench, 
  PencilLine, 
  Buildings, 
  Eye,
  ArrowRight,
  CheckCircle
} from '@phosphor-icons/react';

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
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Domine o Workflow Completo do Projeto 3D
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            4 ferramentas profissionais integradas para formar o projetista 3D completo que o mercado procura.
          </p>
          
          {/* Workflow Flow */}
          <div className="flex items-center justify-center flex-wrap gap-4 mb-12">
            <div className="bg-blue-600/20 border-2 border-blue-500/40 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-blue-300 font-medium">Conceito</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-red-600/20 border-2 border-red-500/40 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-red-300 font-medium">Documentação</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-blue-600/20 border-2 border-blue-500/40 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-blue-300 font-medium">Modelagem BIM</span>
            </div>
            <ArrowRight size={20} className="text-gray-400" />
            <div className="bg-orange-600/20 border-2 border-orange-500/40 rounded-xl px-4 py-2 backdrop-blur-sm">
              <span className="text-orange-300 font-medium">Apresentação</span>
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
                className="group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${tool.color}20` }}
                  >
                    <Icon 
                      size={28} 
                      weight="duotone"
                      style={{ color: tool.color }}
                    />
                  </div>
                  <div 
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${course?.themeColors?.primary}20`,
                      color: course?.themeColors?.primary || '#2196F3'
                    }}
                  >
                    {index + 1}º Módulo
                  </div>
                </div>
                
                {/* Tool Info */}
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-gray-200 transition-colors">
                  {tool.name}
                </h3>
                
                <div 
                  className="text-sm font-medium mb-3"
                  style={{ color: tool.color }}
                >
                  {tool.role}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors">
                  {tool.description}
                </p>
                
                {/* Key Feature */}
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" weight="duotone" />
                  <span className="text-sm font-medium text-green-300">
                    {tool.keyFeature}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Resultado: Profissional 3D Completo
            </h3>
            <p className="text-gray-300 mb-6">
              Ao final do curso, você dominará todo o processo: desde a concepção até a apresentação final, 
              preparado para qualquer tipo de projeto no mercado de trabalho.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>94 horas de conteúdo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                <span>4 ferramentas integradas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
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