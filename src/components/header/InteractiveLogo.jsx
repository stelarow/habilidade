import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePageContext } from '../../hooks/usePageContext';
import { useState, useEffect } from 'react';
import LogoH from '../LogoH';

function InteractiveLogo() {
  const { pageType } = usePageContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Reset click count after 2 seconds
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    
    // Easter egg: triple click for developer info
    if (clickCount === 2) {
      console.log('🎓 Escola Habilidade - Transformando carreiras através da tecnologia');
      setClickCount(0);
    } else {
      setClickCount(prev => prev + 1);
    }

    // Navigation logic
    if (location.pathname === '/') {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    } else {
      navigate('/');
    }
  };

  return (
    <Link 
      to="/" 
      onClick={handleLogoClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="logo-container group flex items-center gap-3 focus:outline-none relative"
      aria-label="Escola Habilidade - Voltar para página inicial"
    >
      {/* Enhanced logo wrapper with animation */}
      <div className="logo-wrapper relative">
        {/* Animated background glow */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg transition-all duration-500 transform ${
            isHovered ? 'opacity-30 scale-110' : 'opacity-0 scale-100'
          }`} 
        />
        
        {/* Pulse effect on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg animate-ping opacity-20" />
        )}
        
        <LogoH 
          size="medium"
          animated={true}
          showFullText={true}
          theme={pageType === 'blogPage' ? 'default' : 'default'}
          className={`relative transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
      </div>
      
      {/* Enhanced contextual tagline */}
      <div className="logo-text-container hidden lg:block">
        <span className={`tagline block text-xs transition-all duration-300 ${
          isHovered ? 'text-gray-200' : 'text-gray-400'
        }`}>
          {pageType === 'home' && 'Tecnologia que transforma carreiras'}
          {pageType === 'coursePage' && 'Aprenda com os melhores'}
          {pageType === 'blogPage' && 'Conhecimento que inspira'}
          {pageType === 'other' && 'Sua jornada começa aqui'}
        </span>
        
        {/* Subtle underline on hover */}
        <div className={`h-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-400 transition-all duration-300 ${
          isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`} />
      </div>
    </Link>
  );
}

export default InteractiveLogo; 