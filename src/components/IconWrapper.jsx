import { 
  BookOpen, 
  TrendUp, 
  Users, 
  House, 
  Wrench, 
  Crown, 
  Trophy,
  Star,
  Lightning,
  CheckCircle,
  ArrowRight,
  Target,
  Briefcase,
  PaperPlaneTilt,
  User,
  Envelope,
  Phone,
  Check,
  ChatCircle,
  Buildings
} from 'phosphor-react';

// Mapeamento de ícones disponíveis
const ICON_MAP = {
  BookOpen,
  TrendUp,
  Users,
  House,
  Wrench,
  Crown,
  Trophy,
  Star,
  Lightning,
  CheckCircle,
  ArrowRight,
  Target,
  Briefcase,
  PaperPlaneTilt,
  User,
  Envelope,
  Phone,
  Check,
  ChatCircle,
  Buildings
};

// Configurações por contexto
export const ICON_CONFIGS = {
  whyStudy: {
    size: 32,
    weight: 'duotone',
    className: 'transition-all duration-300'
  },
  journey: {
    size: 24,
    weight: 'duotone',
    className: 'transition-all duration-300'
  },
  cta: {
    size: 20,
    weight: 'bold',
    className: 'transition-all duration-300'
  },
  benefits: {
    size: 20,
    weight: 'duotone',
    className: 'transition-colors duration-200'
  }
};

/**
 * Componente wrapper para ícones com contexto
 */
function IconWrapper({ 
  name, 
  context = 'benefits', 
  color = null, 
  size = null, 
  weight = null, 
  className = '', 
  ...props 
}) {
  const IconComponent = ICON_MAP[name] || BookOpen;
  const config = ICON_CONFIGS[context] || ICON_CONFIGS.benefits;
  
  const finalProps = {
    size: size || config.size,
    weight: weight || config.weight,
    className: `${config.className} ${className}`.trim(),
    ...(color && { style: { color } }),
    ...props
  };
  
  return <IconComponent {...finalProps} />;
}

/**
 * Hook/helper para obter ícone com contexto
 */
export function getIconForContext(iconName, context, color = null, overrides = {}) {
  return (
    <IconWrapper 
      name={iconName}
      context={context}
      color={color}
      {...overrides}
    />
  );
}

export default IconWrapper; 