import React, { useState } from 'react';
import { 
  CaretDown,
  CaretUp,
  CheckCircle,
  Briefcase,
  MapPin,
  TrendUp
} from '@phosphor-icons/react';

const CourseToolSection = ({ tool, toolData, themeColors }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'features',
      title: 'Principais Recursos',
      icon: CheckCircle,
      items: toolData.keyFeatures,
      color: themeColors.primary
    },
    {
      id: 'professional',
      title: 'Uso Profissional',
      icon: Briefcase,
      items: toolData.professionalUse,
      color: themeColors.secondary
    },
    {
      id: 'local',
      title: 'Aplicações Locais - Grande Florianópolis',
      icon: MapPin,
      items: toolData.localApplications,
      color: '#10B981'
    },
    {
      id: 'career',
      title: 'Oportunidades de Carreira',
      icon: TrendUp,
      items: toolData.careerOpportunities,
      color: '#8B5CF6'
    }
  ];

  return (
    <section id={tool} className="course-tool-section scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {toolData.title}
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            {toolData.subtitle}
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-400 leading-relaxed text-lg">
              {toolData.description}
            </p>
          </div>
        </div>

        {/* Progressive Disclosure Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <div 
                key={section.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${section.color}20` }}
                    >
                      <Icon 
                        size={20} 
                        weight="duotone"
                        style={{ color: section.color }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {section.title}
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded">
                      {section.items.length} itens
                    </span>
                  </div>
                  {isExpanded ? (
                    <CaretUp size={20} className="text-gray-400" />
                  ) : (
                    <CaretDown size={20} className="text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <ul className="space-y-3">
                      {section.items.map((item, index) => (
                        <li 
                          key={index}
                          className="flex items-start gap-3 text-gray-300"
                        >
                          <CheckCircle 
                            size={16} 
                            weight="duotone"
                            className="mt-0.5 flex-shrink-0"
                            style={{ color: section.color }}
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-white mb-2">
              Domine {toolData.title.split(':')[0]} Profissionalmente
            </h4>
            <p className="text-gray-300 mb-4">
              Aprenda com projetos reais da Grande Florianópolis
            </p>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contato');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${themeColors.gradient.from}, ${themeColors.gradient.to})`
              }}
            >
              Garantir Minha Vaga
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseToolSection;