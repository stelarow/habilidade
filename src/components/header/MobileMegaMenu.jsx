import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  X, CaretRight, GraduationCap, WhatsappLogo, 
  BookOpen, Star, Phone, House, MagnifyingGlass, Play, Question 
} from 'phosphor-react';
import { usePageContext } from '../../hooks/usePageContext';
import { ADAPTIVE_NAVIGATION } from '../../constants/adaptiveNavigation';
import COURSES_DATA from '../../data/coursesData';
import { searchCourses, getCourseBySlug } from '../../utils/courseHelpers';
import GradientButton from '../GradientButton';

function MobileMegaMenu({ isOpen, onClose }) {
  const { pageType } = usePageContext();
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('navigation');

  let currentNavigation = ADAPTIVE_NAVIGATION[pageType] || ADAPTIVE_NAVIGATION.home;
  
  // Para páginas de curso, filtra o FAQ se não existir
  if (pageType === 'coursePage' && slug) {
    const course = getCourseBySlug(slug, COURSES_DATA);
    if (course && (!course.faq || course.faq.length === 0)) {
      currentNavigation = currentNavigation.filter(link => link.label !== 'FAQ');
    }
  }
  
  const featuredCourses = COURSES_DATA
    .filter(course => course.basicInfo.active)
    .slice(0, 3);

  const filteredCourses = searchTerm 
    ? searchCourses(searchTerm, COURSES_DATA)
    : COURSES_DATA.filter(course => course.basicInfo.active);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Mapeamento de ícones
  const getIconComponent = (iconName) => {
    const icons = {
      BookOpen, Star, Phone, House, Play, Question
    };
    return icons[iconName] || BookOpen;
  };

  return (
    <div className="mobile-mega-menu fixed inset-0 z-[100] lg:hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl overflow-y-auto">
        
        {/* Header do Menu */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap size={24} className="text-fuchsia-400" />
              <span className="font-semibold text-white">Menu</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition"
              aria-label="Fechar menu"
            >
              <X size={24} className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Tabs de Navegação */}
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('navigation')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
                activeTab === 'navigation' 
                  ? 'bg-fuchsia-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Navegação
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${
                activeTab === 'courses' 
                  ? 'bg-fuchsia-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Cursos
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4">
          {activeTab === 'navigation' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Navegação Principal
                </h3>
                <nav className="space-y-2">
                  {currentNavigation.map((link) => {
                    const IconComponent = getIconComponent(link.icon);

                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition"
                      >
                        <IconComponent size={20} className="text-fuchsia-400 flex-shrink-0" />
                        <div className="flex-1">
                          <span className="text-white font-medium block">{link.label}</span>
                          <span className="text-gray-400 text-sm">{link.description}</span>
                        </div>
                        <CaretRight size={16} className="text-gray-400 group-hover:text-white transition flex-shrink-0" />
                      </a>
                    );
                  })}
                </nav>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Cursos em Destaque
                </h3>
                <div className="space-y-3">
                  {featuredCourses.map(course => (
                    <Link
                      key={course.basicInfo.id}
                      to={`/cursos/${course.basicInfo.slug}`}
                      onClick={onClose}
                      className="group block p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                          }}
                        >
                          {course.basicInfo.title.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white group-hover:text-fuchsia-300 transition truncate">
                            {course.basicInfo.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {course.basicInfo.level} • {course.basicInfo.duration}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-4">
              <div className="relative">
                <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none transition"
                />
              </div>

              <div className="space-y-3">
                {filteredCourses.map(course => (
                  <Link
                    key={course.basicInfo.id}
                    to={`/cursos/${course.basicInfo.slug}`}
                    onClick={onClose}
                    className="group block p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                        }}
                      >
                        {course.basicInfo.title.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white group-hover:text-fuchsia-300 transition">
                          {course.basicInfo.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {course.basicInfo.shortDescription}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{course.basicInfo.level}</span>
                          <span>•</span>
                          <span>{course.basicInfo.duration}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Estado Vazio */}
              {filteredCourses.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Nenhum curso encontrado</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-fuchsia-400 hover:text-fuchsia-300 transition"
                  >
                    Limpar busca
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA Fixo */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4">
          <GradientButton
            href="https://wa.me/5548988559491"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 text-center font-semibold flex items-center justify-center gap-2"
          >
            <WhatsappLogo size={20} />
            Falar no WhatsApp
          </GradientButton>
        </div>
      </div>
    </div>
  );
}

export default MobileMegaMenu; 