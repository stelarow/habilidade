import { WhatsappLogo } from 'phosphor-react';

function WhatsAppButton({ className = '', size = 'medium', ...props }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10', 
    large: 'w-12 h-12'
  };

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18
  };

  return (
    <a
      href="https://wa.me/5548988559491"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r from-green-500 via-green-400 to-cyan-400 
        hover:from-green-600 hover:via-green-500 hover:to-cyan-500 
        flex items-center justify-center 
        transition-all duration-300 
        hover:scale-110 
        shadow-lg 
        hover:shadow-green-500/25
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `}
      title="WhatsApp - Contato Direto"
      aria-label="Entrar em contato via WhatsApp"
      {...props}
    >
      <WhatsappLogo 
        size={iconSizes[size]} 
        weight="bold" 
        className="text-white" 
      />
    </a>
  );
}

export default WhatsAppButton; 