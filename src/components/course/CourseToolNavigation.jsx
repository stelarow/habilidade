import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  PencilLine, 
  Buildings, 
  Eye 
} from 'phosphor-react';

const CourseToolNavigation = ({ course, activeSection, onSectionChange }) => {
  const [isSticky, setIsSticky] = useState(false);

  const toolIcons = {
    sketchup: Wrench,
    autocad: PencilLine,
    revit: Buildings,
    enscape: Eye
  };

  const tools = [
    { id: 'sketchup', name: 'SketchUp Pro', color: '#005CAF' },
    { id: 'autocad', name: 'AutoCAD 2D', color: '#E51937' },
    { id: 'revit', name: 'Revit BIM', color: '#0078BE' },
    { id: 'enscape', name: 'Enscape IA', color: '#FF6B35' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToolClick = (toolId) => {
    const element = document.getElementById(toolId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      onSectionChange(toolId);
    }
  };

  return (
    <div className="relative">
      {/* Seção de Introdução às Ferramentas */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Explore Cada Ferramenta em Detalhes
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Clique em uma ferramenta para conhecer todo o conteúdo que você vai aprender
          </p>
        </div>
      </section>

      {/* Navigation melhorada - mais sutil e integrada */}
      <nav className={`course-tool-navigation-improved ${isSticky ? 'sticky top-0 z-40' : ''} transition-all duration-300`}>
        <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                {tools.map((tool, index) => {
                  const Icon = toolIcons[tool.id];
                  const isActive = activeSection === tool.id;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool.id)}
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                        transition-all duration-300 min-w-[120px] justify-center
                        ${isActive 
                          ? 'bg-gray-800/80 shadow-lg border-2 scale-105 text-white' 
                          : 'bg-gray-800/30 text-gray-300 hover:bg-gray-800/60 hover:shadow-md border-2 border-transparent hover:text-white'
                        }
                      `}
                      style={isActive ? {
                        borderColor: tool.color,
                        background: `linear-gradient(135deg, ${tool.color}20, rgba(31, 41, 55, 0.8))`
                      } : {}}
                    >
                      <Icon 
                        size={18} 
                        weight="duotone"
                        style={{ color: isActive ? tool.color : '#9CA3AF' }}
                      />
                      <span className="font-semibold">
                        {tool.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default CourseToolNavigation;