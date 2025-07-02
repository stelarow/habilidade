import { Link, useLocation } from 'react-router-dom';
import { usePageContext } from '../../hooks/usePageContext';
import LogoH from '../LogoH';

function InteractiveLogo() {
  const { pageType } = usePageContext();
  const location = useLocation();

  const handleLogoClick = (e) => {
    // Se já estamos na homepage, fazer scroll para o topo
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
    // Se não estamos na homepage, o Link normal funcionará (ir para "/")
  };

  return (
    <Link 
      to="/" 
      onClick={handleLogoClick}
      className="logo-container group flex items-center gap-3 focus:outline-none"
    >
      {/* "H" Estilizada - Logo da Escola */}
      <div className="logo-wrapper relative">
        <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 group-focus:opacity-20 transition-opacity duration-300 transform scale-110" />
        <LogoH 
          size="medium"
          animated={true}
          showFullText={true}
          className="relative transition-all duration-300 group-hover:scale-105 group-focus:scale-105"
        />
      </div>
      
      {/* Tagline Contextual */}
      <div className="logo-text-container hidden lg:block">
        <span className="tagline block text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {pageType === 'home' && 'Tecnologia que transforma carreiras'}
          {pageType === 'coursePage' && 'Aprenda com os melhores'}
          {pageType === 'other' && 'Sua jornada começa aqui'}
        </span>
      </div>
    </Link>
  );
}

export default InteractiveLogo; 