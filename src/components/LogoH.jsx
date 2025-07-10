import { usePageContext } from '../hooks/usePageContext';

const LOGO_SIZES = {
  small: 'text-xl sm:text-2xl',
  medium: 'text-2xl sm:text-4xl',
  large: 'text-4xl sm:text-6xl',
  hero: 'text-6xl sm:text-8xl'
};

const LOGO_THEMES = {
  default: 'gradient-text',
  ai: 'gradient-text-ai',
  design: 'gradient-text-design',
  programming: 'gradient-text-programming',
  marketing: 'gradient-text-marketing'
};

function LogoH({ 
  size = 'medium',
  animated = true,
  theme = 'default',
  showFullText = true,
  className = '',
  ...props 
}) {
  const { pageType } = usePageContext();

  const logoClasses = `
    font-extrabold
    ${LOGO_SIZES[size]}
    ${LOGO_THEMES[theme]}
    ${animated ? 'animate-gradient' : ''}
    ${className}
  `.trim();

  const textClasses = `
    text-white font-semibold
    ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}
  `.trim();

  return (
    <div className="flex items-center gap-2 sm:gap-3" {...props}>
      {/* "H" Estilizada - Sempre visível */}
      <span className={logoClasses}>
        H
      </span>
      
      {/* Texto "Escola Habilidade" - Sempre visível */}
      {showFullText && (
        <span className={textClasses}>
          Escola Habilidade
        </span>
      )}
    </div>
  );
}

export default LogoH; 