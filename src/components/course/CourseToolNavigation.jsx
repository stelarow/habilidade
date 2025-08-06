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
    <nav className={`course-tool-navigation ${isSticky ? 'sticky' : ''}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-white font-semibold text-sm hidden sm:block">
              Ferramentas do Curso:
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {tools.map((tool) => {
                const Icon = toolIcons[tool.id];
                const isActive = activeSection === tool.id;
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-300 hover:scale-105
                      ${isActive 
                        ? 'bg-white text-gray-900 shadow-lg' 
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                      }
                    `}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}10)`
                    } : {}}
                  >
                    <Icon 
                      size={16} 
                      weight="duotone"
                      style={{ color: isActive ? tool.color : 'currentColor' }}
                    />
                    <span className="hidden sm:inline">{tool.name}</span>
                    <span className="sm:hidden">{tool.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CourseToolNavigation;