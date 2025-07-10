import { Phone, Play } from 'phosphor-react';
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

      {/* WhatsApp Premium */}
      <WhatsAppButton 
        size="medium"
        className="md:w-8 md:h-8" 
      />
    </div>
  );
}

export default SmartCTA; 