import { useState } from 'react';
// Removed React Router Link - using native anchor tags for SSG
import { MagnifyingGlass, CaretDown } from '@phosphor-icons/react';
import COURSES_DATA from '../../data/coursesData';
import { searchCourses } from '../../utils/courseHelpers';

function MegaMenu({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['Tecnologia', 'Design & Criação', 'Marketing', 'Gestão'];
  
  const filteredCourses = (() => {
    // Primeiro aplica a busca expandida (inclui módulos e aulas)
    const searchResults = searchTerm 
      ? searchCourses(searchTerm, COURSES_DATA)
      : COURSES_DATA.filter(course => course.basicInfo.active);
    
    // Depois aplica o filtro de categoria
    return selectedCategory 
      ? searchResults.filter(course => course.basicInfo.category === selectedCategory)
      : searchResults;
  })();

  if (!isOpen) return null;

  return (
    <div className="mega-menu absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Busca e Filtros */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none transition"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !selectedCategory 
                    ? 'bg-fuchsia-500 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Todos
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-fuchsia-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.slice(0, 6).map(course => (
            <a
              key={course.basicInfo.id}
              href={`/cursos/${course.basicInfo.slug}`}
              onClick={onClose}
              className="group p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                  }}
                >
                  {course.basicInfo.title.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white group-hover:text-fuchsia-300 transition truncate">
                    {course.basicInfo.title}
                  </h4>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {course.basicInfo.shortDescription}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{course.basicInfo.level}</span>
                    <span>•</span>
                    <span>{course.basicInfo.duration}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Ver Todos os Cursos */}
        {filteredCourses.length > 6 && (
          <div className="mt-6 text-center">
            <a
              href="#cursos"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const element = document.getElementById('cursos');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-semibold rounded-lg hover:from-fuchsia-600 hover:to-cyan-500 transition"
            >
              Ver Todos os Cursos
              <CaretDown size={16} className="rotate-[-90deg]" />
            </a>
          </div>
        )}

        {/* Estado Vazio */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Nenhum curso encontrado para "{searchTerm}"</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="text-fuchsia-400 hover:text-fuchsia-300 transition"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MegaMenu; 