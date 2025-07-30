import type { CTATemplate, CTAConfiguration } from '@/types/cta';
import { ctaTemplates, getTemplatesByCategory, getTemplatesByType } from '@/data/ctaTemplates';

// Variable interpolation for template content
export function interpolateTemplate(
  template: string, 
  variables: Record<string, string>
): string {
  let result = template;
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  
  // Clean up any remaining template variables
  result = result.replace(/{{.*?}}/g, '');
  
  return result;
}

// Context-aware CTA recommendations
export interface CTAContext {
  articleTitle: string;
  articleCategory: string;
  articleTags: string[];
  userSegment?: string;
  userBehavior?: {
    timeOnPage: number;
    scrollDepth: number;
    previousVisits: number;
    engagementLevel: 'low' | 'medium' | 'high';
  };
  pageMetrics?: {
    conversionRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };
}

export function getContextualRecommendations(
  context: CTAContext,
  limit: number = 3
): CTATemplate[] {
  let recommendations: { template: CTATemplate; score: number }[] = [];
  
  // Score each template based on context
  ctaTemplates.forEach(template => {
    let score = 0;
    
    // Category matching (high weight)
    if (template.category === context.articleCategory) {
      score += 50;
    } else if (template.category === 'universal') {
      score += 20;
    }
    
    // User behavior scoring
    if (context.userBehavior) {
      const { engagementLevel, scrollDepth, timeOnPage } = context.userBehavior;
      
      // High engagement users - show more complex CTAs
      if (engagementLevel === 'high') {
        if (template.type === 'course' || template.type === 'consultation') {
          score += 30;
        }
      }
      
      // Medium engagement - lead magnets work well
      if (engagementLevel === 'medium') {
        if (template.type === 'leadmagnet' || template.type === 'newsletter') {
          score += 25;
        }
      }
      
      // Low engagement - simple newsletter signup
      if (engagementLevel === 'low') {
        if (template.type === 'newsletter') {
          score += 35;
        }
      }
      
      // High scroll depth suggests interested user
      if (scrollDepth > 70) {
        if (template.config.targeting?.timing === 'scroll') {
          score += 15;
        }
      }
      
      // Long time on page suggests interest
      if (timeOnPage > 120000) { // 2 minutes
        if (template.type === 'leadmagnet' || template.type === 'course') {
          score += 20;
        }
      }
    }
    
    // Page performance scoring
    if (context.pageMetrics) {
      const { conversionRate, bounceRate } = context.pageMetrics;
      
      // High converting pages should use proven templates
      if (conversionRate > 0.05) { // 5%+
        score += template.usageCount ? Math.min(template.usageCount / 10, 20) : 0;
      }
      
      // High bounce rate pages need more engaging CTAs
      if (bounceRate > 0.7) {
        if (template.type === 'urgency' || template.config.design?.theme === 'gradient') {
          score += 15;
        }
      }
    }
    
    // Tag matching
    const tagMatches = context.articleTags.some(tag => 
      template.description?.toLowerCase().includes(tag.toLowerCase()) ||
      template.name.toLowerCase().includes(tag.toLowerCase())
    );
    if (tagMatches) {
      score += 10;
    }
    
    // Popularity bonus
    if (template.usageCount) {
      score += Math.min(template.usageCount / 50, 10);
    }
    
    recommendations.push({ template, score });
  });
  
  // Sort by score and return top results
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.template);
}

// Smart defaults based on context
export function getSmartDefaults(context: CTAContext): Partial<CTAConfiguration> {
  const defaults: Partial<CTAConfiguration> = {
    targeting: {
      category: context.articleCategory,
      timing: 'scroll',
      scrollPercent: 50,
    },
    isActive: true,
  };
  
  // Adjust timing based on user behavior
  if (context.userBehavior) {
    const { engagementLevel, scrollDepth } = context.userBehavior;
    
    if (engagementLevel === 'high') {
      defaults.targeting!.timing = 'immediate';
    } else if (engagementLevel === 'low') {
      defaults.targeting!.timing = 'exit-intent';
    } else if (scrollDepth > 80) {
      defaults.targeting!.scrollPercent = 70;
    }
  }
  
  return defaults;
}

// A/B testing template variants
export function generateABVariants(
  baseTemplate: CTATemplate,
  context: CTAContext
): CTATemplate[] {
  const variants: CTATemplate[] = [];
  
  // Variant A - Original
  variants.push({
    ...baseTemplate,
    id: `${baseTemplate.id}-variant-a`,
    name: `${baseTemplate.name} (Variant A)`,
  });
  
  // Variant B - Different colors
  const variantB = JSON.parse(JSON.stringify(baseTemplate));
  variantB.id = `${baseTemplate.id}-variant-b`;
  variantB.name = `${baseTemplate.name} (Variant B)`;
  
  if (variantB.config.design) {
    // Swap primary and secondary colors
    const tempColor = variantB.config.design.primaryColor;
    variantB.config.design.primaryColor = variantB.config.design.secondaryColor;
    variantB.config.design.secondaryColor = tempColor;
  }
  
  variants.push(variantB);
  
  // Variant C - Different button text (if applicable)
  if (baseTemplate.config.content?.buttonText) {
    const variantC = JSON.parse(JSON.stringify(baseTemplate));
    variantC.id = `${baseTemplate.id}-variant-c`;
    variantC.name = `${baseTemplate.name} (Variant C)`;
    
    const alternativeButtons = {
      'Baixar Gr�tis': 'Obter Agora',
      'Inscrever-se': 'Quero Receber',
      'Ver Curso': 'Saber Mais',
      'Agendar Consultoria': 'Falar Conosco',
      'Aproveitar Oferta': 'Garantir Desconto',
    };
    
    const currentButton = variantC.config.content!.buttonText;
    const altButton = alternativeButtons[currentButton as keyof typeof alternativeButtons];
    
    if (altButton) {
      variantC.config.content!.buttonText = altButton;
      variants.push(variantC);
    }
  }
  
  return variants;
}

// Performance-based optimization
export function optimizeTemplate(
  template: CTATemplate,
  performanceData: {
    views: number;
    clicks: number;
    conversions: number;
    avgTimeToAction: number;
  }
): CTATemplate {
  const optimized = JSON.parse(JSON.stringify(template));
  const ctr = performanceData.clicks / performanceData.views;
  const conversionRate = performanceData.conversions / performanceData.clicks;
  
  // Low CTR - try more urgent timing
  if (ctr < 0.02 && optimized.config.targeting) {
    optimized.config.targeting.timing = 'immediate';
  }
  
  // Low conversion rate - simplify the CTA
  if (conversionRate < 0.1) {
    if (optimized.config.content?.benefits) {
      // Reduce benefits to top 3
      optimized.config.content.benefits = optimized.config.content.benefits.slice(0, 3);
    }
    
    // Make button text more action-oriented
    if (optimized.config.content?.buttonText) {
      const actionButtons = {
        'Ver': 'Acessar',
        'Conhecer': 'Descobrir',
        'Saber': 'Ver',
      };
      
      let buttonText = optimized.config.content.buttonText;
      Object.entries(actionButtons).forEach(([old, newer]) => {
        buttonText = buttonText.replace(old, newer);
      });
      optimized.config.content.buttonText = buttonText;
    }
  }
  
  // Slow action time - add urgency elements
  if (performanceData.avgTimeToAction > 30000) { // 30 seconds
    if (optimized.config.content) {
      optimized.config.content.subtext = 'Oferta limitada � A��o r�pida recomendada';
    }
  }
  
  return optimized;
}

// Template personalization based on user segment
export function personalizeForSegment(
  template: CTATemplate,
  segment: string
): CTATemplate {
  const personalized = JSON.parse(JSON.stringify(template));
  
  const segmentCustomizations = {
    'new-visitors': {
      contentSuffix: ' (Especial para Novos Visitantes)',
      benefits: ['Desconto especial', 'Acesso imediato', 'Sem compromisso'],
      timing: 'time' as const,
      timeDelay: 15000,
    },
    'returning-visitors': {
      contentSuffix: ' (Oferta Exclusiva)',
      benefits: ['Conte�do avan�ado', 'Acesso premium', 'Comunidade exclusiva'],
      timing: 'scroll' as const,
      scrollPercent: 40,
    },
    'high-value': {
      contentSuffix: ' (Premium)',
      benefits: ['Mentoria 1-on-1', 'Acesso vital�cio', 'Suporte priorit�rio'],
      timing: 'immediate' as const,
    },
    'mobile-users': {
      layout: 'vertical' as const,
      borderRadius: 'lg' as const,
      benefits: personalized.config.content?.benefits?.slice(0, 3) || [],
    },
  };
  
  const customization = segmentCustomizations[segment as keyof typeof segmentCustomizations];
  
  if (customization) {
    // Apply content customizations
    if ('contentSuffix' in customization && customization.contentSuffix && personalized.config.content) {
      personalized.config.content.title += customization.contentSuffix;
    }
    
    if ('benefits' in customization && customization.benefits && personalized.config.content) {
      personalized.config.content.benefits = customization.benefits;
    }
    
    // Apply targeting customizations
    if (personalized.config.targeting) {
      if ('timing' in customization && customization.timing) {
        personalized.config.targeting.timing = customization.timing;
      }
      if ('timeDelay' in customization && customization.timeDelay) {
        personalized.config.targeting.timeDelay = customization.timeDelay;
      }
      if ('scrollPercent' in customization && customization.scrollPercent) {
        personalized.config.targeting.scrollPercent = customization.scrollPercent;
      }
    }
    
    // Apply design customizations
    if (personalized.config.design) {
      if ('layout' in customization && customization.layout) {
        personalized.config.design.layout = customization.layout;
      }
      if ('borderRadius' in customization && customization.borderRadius) {
        personalized.config.design.borderRadius = customization.borderRadius;
      }
    }
  }
  
  return personalized;
}

// Template validation and optimization suggestions
export function validateTemplate(template: CTATemplate): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  
  // Content validation
  if (template.config.content) {
    const { title, description, buttonText } = template.config.content;
    
    if (title && title.length > 60) {
      warnings.push('T�tulo muito longo - pode ser cortado em dispositivos m�veis');
    }
    
    if (description && description.length > 200) {
      warnings.push('Descri��o muito longa - pode reduzir convers�es');
    }
    
    if (buttonText && buttonText.length > 25) {
      warnings.push('Texto do bot�o muito longo - pode n�o caber em mobile');
    }
    
    if (template.config.content.benefits && template.config.content.benefits.length > 5) {
      suggestions.push('Considere reduzir os benef�cios para m�ximo 3-4 itens');
    }
  }
  
  // Design validation
  if (template.config.design) {
    const { primaryColor, secondaryColor } = template.config.design;
    
    // Check color contrast (simplified)
    if (primaryColor === secondaryColor) {
      warnings.push('Cores prim�ria e secund�ria s�o iguais - pode reduzir legibilidade');
    }
  }
  
  // Targeting validation
  if (template.config.targeting) {
    const { timing, timeDelay, scrollPercent } = template.config.targeting;
    
    if (timing === 'time' && !timeDelay) {
      warnings.push('Timing por tempo configurado mas sem delay definido');
    }
    
    if (timing === 'scroll' && !scrollPercent) {
      warnings.push('Timing por scroll configurado mas sem porcentagem definida');
    }
    
    if (scrollPercent && scrollPercent > 90) {
      suggestions.push('Porcentagem de scroll muito alta - muitos usu�rios podem n�o ver o CTA');
    }
  }
  
  const isValid = warnings.length === 0;
  
  return { isValid, warnings, suggestions };
}

// Context-aware variable extraction
export function extractContextVariables(context: CTAContext): Record<string, string> {
  return {
    articleTopic: context.articleTitle,
    mainTopic: context.articleCategory,
    articleTitle: context.articleTitle,
    siteName: 'Stelarow Habilidade',
    courseTitle: context.articleTitle,
    designTopic: context.articleTitle,
  };
}