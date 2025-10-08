import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { useParams } from 'react-router-dom';
import useToggle from '../hooks/useToggle';
import { usePageContext } from '../hooks/usePageContext';
import { ADAPTIVE_NAVIGATION } from '../constants/adaptiveNavigation';
import { getCourseBySlug } from '../utils/courseHelpers';
import COURSES_DATA from '../data/coursesData';
import InteractiveLogo from './header/InteractiveLogo';
import SmartCTA from './header/SmartCTA';
import MegaMenu from './header/MegaMenu';
import MobileMegaMenu from './header/MobileMegaMenu';

function Header() {
  const [mobileMenuOpen, toggleMobileMenu, , closeMobileMenu] = useToggle(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { pageType } = usePageContext();
  const { slug } = useParams();

  // Usa navegação adaptativa baseada no contexto da página
  let currentNavigation = ADAPTIVE_NAVIGATION[pageType] || ADAPTIVE_NAVIGATION.home;
  
  // Para páginas de curso, filtra o FAQ se não existir
  if (pageType === 'coursePage' && slug) {
    const course = getCourseBySlug(slug, COURSES_DATA);
    if (course && (!course.faq || course.faq.length === 0)) {
      currentNavigation = currentNavigation.filter(link => link.label !== 'FAQ');
    }
  }

  const handleNavClick = () => {
    setMegaMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50 border-b border-gray-800/50" role="banner">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16 min-h-[4rem] flex-nowrap">
            
            <div className="flex-shrink-0">
              <InteractiveLogo />
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center overflow-hidden">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="flex items-center gap-1 text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
                aria-expanded={megaMenuOpen}
                aria-haspopup="true"
              >
                Cursos
                <CaretDown size={14} className={`transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Links adaptativos baseados no contexto da página */}
              {currentNavigation
                .filter(link => link.label !== 'Cursos')
                .map(({ label, href }) => (
                <a 
                  key={href} 
                  href={href}
                  onClick={(e) => {
                    handleNavClick();
                    // Handle smooth scrolling for anchor links
                    if (href.startsWith('#')) {
                      e.preventDefault();
                      const element = document.getElementById(href.substring(1));
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1 whitespace-nowrap"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 flex-shrink-0">
              <SmartCTA />
              
              {/* Botão Mobile */}
              <button
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="md:hidden flex flex-col justify-center gap-[3px] p-2 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm"
              >
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <MegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
        />
      </header>

      <MobileMegaMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Overlay para fechar menu ao clicar fora */}
      {megaMenuOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-30"
          onClick={() => setMegaMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Header; 