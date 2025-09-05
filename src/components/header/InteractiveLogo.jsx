import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePageContext } from '../../hooks/usePageContext';
import LogoH from '../LogoH';

function InteractiveLogo() {
  const { pageType } = usePageContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    // Se estamos em uma página do blog, forçar navegação completa
    if (location.pathname.startsWith('/blog')) {
      e.preventDefault();
      // Usar window.location para forçar recarregamento completo
      window.location.href = '/';
    } else if (location.pathname === '/') {
      // Se já estamos na homepage, fazer scroll para o topo
      e.preventDefault();
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
    // Para outras páginas, o Link do React Router fará a navegação normalmente
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
          {pageType === 'coursePage' && 'Aprenda com os melhores'}
          {pageType === 'other' && 'Sua jornada começa aqui'}
        </span>
      </div>
    </Link>
  );
}

export default InteractiveLogo; 