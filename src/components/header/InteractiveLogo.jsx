import { Link, useLocation } from 'react-router-dom';
import LogoH from '../LogoH';

function InteractiveLogo() {
  const location = useLocation();

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      e.preventDefault();
      globalThis.location.href = '/';
    }
  };

  return (
    <Link 
      to="/" 
      onClick={handleLogoClick}
      className="logo-container group flex items-center gap-3 focus:outline-none min-h-[3rem] flex-shrink-0 min-w-fit"
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
    </Link>
  );
}

export default InteractiveLogo; 