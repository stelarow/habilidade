import { Phone, Play, User } from 'phosphor-react';
import { useSmartCTA } from '../../hooks/useSmartCTA';
import GradientButton from '../GradientButton';
import WhatsAppButton from './WhatsAppButton';

function SmartCTA() {
  const ctaConfig = useSmartCTA();

  return (
    <div className="cta-group flex items-center gap-3">
      {/* CTA Primário */}
      <GradientButton
        href={ctaConfig.primary.href}
        target={ctaConfig.primary.href.startsWith('http') ? '_blank' : undefined}
        rel={ctaConfig.primary.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`
          hidden md:inline-flex items-center gap-2 font-medium transition-all duration-300
          ${ctaConfig.primary.style === 'compact' 
            ? 'px-3 py-2 text-xs' 
            : 'px-6 py-3 text-sm'
          }
        `}
      >
        {ctaConfig.primary.href.includes('#contato') && <Phone size={16} weight="bold" />}
        {ctaConfig.primary.label === 'Aula Grátis' && <Play size={16} weight="bold" />}
        {ctaConfig.primary.label}
      </GradientButton>

      {/* Área do Aluno - Mobile Only */}
      <a
        href="https://ead.escolahabilidade.com"
        target="_blank"
        rel="noopener noreferrer"
        className="
          md:hidden w-10 h-10 rounded-full 
          bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 
          hover:from-fuchsia-700 hover:via-purple-700 hover:to-blue-700 
          flex items-center justify-center 
          transition-all duration-300 
          hover:scale-110 
          shadow-lg 
          hover:shadow-fuchsia-500/25
          focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900
        "
        title="Área do Aluno - Plataforma de Ensino"
        aria-label="Acessar área do aluno"
      >
        <User 
          size={16} 
          weight="bold" 
          className="text-white" 
        />
      </a>

      {/* WhatsApp Premium */}
      <WhatsAppButton 
        size="medium"
        className="md:w-8 md:h-8" 
      />
    </div>
  );
}

export default SmartCTA; 