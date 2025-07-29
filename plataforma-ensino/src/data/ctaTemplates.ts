import { CTATemplate } from '@/types/cta';

export const ctaTemplates: CTATemplate[] = [
  // Lead Magnet Templates
  {
    id: 'tech-leadmagnet-guide',
    name: 'Guia Técnico - Tecnologia',
    category: 'tecnologia',
    type: 'leadmagnet',
    description: 'Template para guias técnicos e tutoriais em tecnologia',
    usageCount: 245,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Guia Completo: {{articleTopic}}',
        description: 'Baixe nosso guia prático sobre {{articleTopic}} com exemplos reais e implementações passo a passo.',
        buttonText: 'Baixar Guia Grátis',
        subtext: 'Material exclusivo · Acesso imediato · Sem spam',
        benefits: [
          'Exemplos de código práticos',
          'Checklist de implementação',
          'Templates prontos para usar',
          'Dicas de otimização',
          'Recursos adicionais'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        category: 'tecnologia',
        timing: 'scroll',
        scrollPercent: 50
      },
      isActive: true
    }
  },
  {
    id: 'tech-leadmagnet-checklist',
    name: 'Checklist - Tecnologia',
    category: 'tecnologia',
    type: 'leadmagnet',
    description: 'Template para checklists técnicos e listas de verificação',
    usageCount: 189,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Checklist: {{articleTopic}}',
        description: 'Garanta que você não esqueça nada importante com nosso checklist completo sobre {{articleTopic}}.',
        buttonText: 'Baixar Checklist',
        subtext: 'PDF otimizado · Imprimível · Gratuito',
        benefits: [
          'Lista completa de verificação',
          'Formato PDF imprimível',
          'Baseado em melhores práticas',
          'Atualizado regularmente'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#10b981',
        secondaryColor: '#059669',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'lg',
        shadow: true
      },
      targeting: {
        category: 'tecnologia',
        timing: 'immediate'
      },
      isActive: true
    }
  },

  // Marketing Templates
  {
    id: 'marketing-leadmagnet-estrategia',
    name: 'Estratégia - Marketing',
    category: 'marketing',
    type: 'leadmagnet',
    description: 'Template para estratégias e planejamentos de marketing',
    usageCount: 312,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Estratégia Completa: {{articleTopic}}',
        description: 'Descubra a estratégia completa sobre {{articleTopic}} que grandes empresas usam para gerar resultados.',
        buttonText: 'Acessar Estratégia',
        subtext: 'Conteúdo exclusivo · Cases reais · Aplicação prática',
        benefits: [
          'Framework comprovado',
          'Cases de sucesso reais',
          'Templates para implementação',
          'Métricas para medir resultados',
          'Cronograma de execução'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#f59e0b',
        secondaryColor: '#d97706',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        category: 'marketing',
        timing: 'scroll',
        scrollPercent: 40
      },
      isActive: true
    }
  },

  // Newsletter Templates
  {
    id: 'tech-newsletter-weekly',
    name: 'Newsletter Semanal - Tech',
    category: 'tecnologia',
    type: 'newsletter',
    description: 'Newsletter semanal focada em tecnologia e programação',
    usageCount: 892,
    config: {
      type: 'newsletter',
      content: {
        title: 'Newsletter Tech Weekly',
        description: 'Receba semanalmente as melhores novidades em tecnologia, tutoriais exclusivos e tendências do mercado.',
        buttonText: 'Quero Receber',
        subtext: 'Toda terça-feira · Conteúdo curado · Cancele quando quiser'
      },
      design: {
        theme: 'gradient',
        primaryColor: '#6366f1',
        secondaryColor: '#4f46e5',
        layout: 'vertical',
        buttonStyle: 'solid',
        borderRadius: 'lg',
        shadow: true
      },
      targeting: {
        category: 'tecnologia',
        timing: 'exit-intent'
      },
      isActive: true
    }
  },
  {
    id: 'marketing-newsletter-insights',
    name: 'Newsletter Insights - Marketing',
    category: 'marketing',
    type: 'newsletter',
    description: 'Insights semanais de marketing digital e growth',
    usageCount: 567,
    config: {
      type: 'newsletter',
      content: {
        title: 'Marketing Insights',
        description: 'Os melhores insights de marketing digital, cases de sucesso e tendências direto na sua caixa de entrada.',
        buttonText: 'Inscrever-se',
        subtext: 'Semanal · Cases exclusivos · Gratuito'
      },
      design: {
        theme: 'gradient',
        primaryColor: '#ec4899',
        secondaryColor: '#db2777',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        category: 'marketing',
        timing: 'time',
        timeDelay: 30000
      },
      isActive: true
    }
  },

  // Course Templates
  {
    id: 'tech-course-intensive',
    name: 'Curso Intensivo - Tech',
    category: 'tecnologia',
    type: 'course',
    description: 'Promoção de cursos intensivos de tecnologia',
    usageCount: 234,
    config: {
      type: 'course',
      content: {
        title: 'Curso Intensivo: {{articleTopic}}',
        description: 'Domine {{articleTopic}} em apenas 4 semanas com nosso curso intensivo e prático.',
        buttonText: 'Ver Curso',
        subtext: 'Certificado incluso · Projetos práticos · Suporte 24/7',
        benefits: [
          '4 semanas de conteúdo intensivo',
          'Projetos práticos do mercado',
          'Mentoria personalizada',
          'Certificado reconhecido',
          'Comunidade exclusiva'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#8b5cf6',
        secondaryColor: '#7c3aed',
        layout: 'vertical',
        buttonStyle: 'solid',
        borderRadius: 'lg',
        shadow: true
      },
      targeting: {
        category: 'tecnologia',
        timing: 'scroll',
        scrollPercent: 70
      },
      isActive: true
    }
  },

  // Consultation Templates
  {
    id: 'business-consultation-audit',
    name: 'Consultoria Audit - Negócios',
    category: 'negocios',
    type: 'consultation',
    description: 'Consulta gratuita para audit de negócios',
    usageCount: 156,
    config: {
      type: 'consultation',
      content: {
        title: 'Consultoria Gratuita de {{articleTopic}}',
        description: 'Agende uma sessão gratuita de 30 minutos para analisarmos seu {{articleTopic}} e identificar oportunidades.',
        buttonText: 'Agendar Consultoria',
        subtext: '30 minutos · Online · Sem compromisso',
        benefits: [
          'Análise completa da situação atual',
          'Identificação de oportunidades',
          'Plano de ação personalizado',
          'Recomendações específicas'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#059669',
        secondaryColor: '#047857',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        category: 'negocios',
        timing: 'time',
        timeDelay: 45000
      },
      isActive: true
    }
  },

  // Urgency Templates
  {
    id: 'generic-urgency-limited',
    name: 'Oferta Limitada - Universal',
    category: 'universal',
    type: 'urgency',
    description: 'Template de urgência para ofertas com prazo limitado',
    usageCount: 423,
    config: {
      type: 'urgency',
      content: {
        title: 'Oferta Especial: {{articleTopic}}',
        description: 'Aproveite nossa oferta especial sobre {{articleTopic}} por tempo limitado.',
        buttonText: 'Aproveitar Oferta',
        subtext: 'Oferta válida por tempo limitado'
      },
      design: {
        theme: 'gradient',
        primaryColor: '#dc2626',
        secondaryColor: '#b91c1c',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        timing: 'scroll',
        scrollPercent: 60
      },
      isActive: true
    }
  },
  {
    id: 'course-urgency-enrollment',
    name: 'Últimas Vagas - Curso',
    category: 'educacao',
    type: 'urgency',
    description: 'Template de urgência para matrículas com vagas limitadas',
    usageCount: 178,
    config: {
      type: 'urgency',
      content: {
        title: 'Últimas Vagas: {{courseTitle}}',
        description: 'Restam poucas vagas para o curso de {{courseTitle}}. Garante já a sua!',
        buttonText: 'Garantir Vaga',
        subtext: 'Início em breve · Turma limitada'
      },
      design: {
        theme: 'gradient',
        primaryColor: '#ea580c',
        secondaryColor: '#c2410c',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'lg',
        shadow: true
      },
      targeting: {
        category: 'educacao',
        timing: 'immediate'
      },
      isActive: true
    }
  },

  // Design Templates
  {
    id: 'design-leadmagnet-inspiration',
    name: 'Inspiração - Design',
    category: 'design',
    type: 'leadmagnet',
    description: 'Coleção de inspirações e recursos de design',
    usageCount: 298,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Coleção: {{designTopic}}',
        description: 'Baixe nossa coleção exclusiva de {{designTopic}} com mais de 100 exemplos inspiradores.',
        buttonText: 'Baixar Coleção',
        subtext: '100+ exemplos · Alta resolução · Uso comercial',
        benefits: [
          'Mais de 100 exemplos',
          'Alta resolução (300 DPI)',
          'Licença para uso comercial',
          'Categorizados por estilo',
          'Atualizações mensais'
        ]
      },
      design: {
        theme: 'gradient',
        primaryColor: '#a855f7',
        secondaryColor: '#9333ea',
        layout: 'vertical',
        buttonStyle: 'solid',
        borderRadius: 'xl',
        shadow: true
      },
      targeting: {
        category: 'design',
        timing: 'scroll',
        scrollPercent: 45
      },
      isActive: true
    }
  },

  // Universal Templates
  {
    id: 'universal-newsletter-general',
    name: 'Newsletter Geral - Universal',
    category: 'universal',
    type: 'newsletter',
    description: 'Template genérico para newsletter de qualquer nicho',
    usageCount: 756,
    config: {
      type: 'newsletter',
      content: {
        title: 'Newsletter {{siteName}}',
        description: 'Receba conteúdo exclusivo sobre {{mainTopic}} e fique sempre atualizado com as novidades.',
        buttonText: 'Inscrever-se',
        subtext: 'Conteúdo exclusivo · Sem spam · Cancele quando quiser'
      },
      design: {
        theme: 'gradient',
        primaryColor: '#6b7280',
        secondaryColor: '#4b5563',
        layout: 'horizontal',
        buttonStyle: 'solid',
        borderRadius: 'md',
        shadow: true
      },
      targeting: {
        timing: 'exit-intent'
      },
      isActive: true
    }
  }
];

// Template categories for organization
export const templateCategories = [
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    description: 'Templates para conteúdo de tecnologia, programação e desenvolvimento',
    color: '#3b82f6'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Templates para marketing digital, growth e vendas',
    color: '#ec4899'
  },
  {
    id: 'design',
    name: 'Design',
    description: 'Templates para design gráfico, UX/UI e criatividade',
    color: '#a855f7'
  },
  {
    id: 'negocios',
    name: 'Negócios',
    description: 'Templates para empreendedorismo, gestão e consultoria',
    color: '#059669'
  },
  {
    id: 'educacao',
    name: 'Educação',
    description: 'Templates para cursos, treinamentos e conteúdo educacional',
    color: '#d97706'
  },
  {
    id: 'universal',
    name: 'Universal',
    description: 'Templates genéricos que funcionam para qualquer nicho',
    color: '#6b7280'
  }
];

// Helper functions for template management
export const getTemplatesByCategory = (category: string) => {
  return ctaTemplates.filter(template => template.category === category);
};

export const getTemplatesByType = (type: string) => {
  return ctaTemplates.filter(template => template.type === type);
};

export const getPopularTemplates = (limit = 5) => {
  return ctaTemplates
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, limit);
};

export const searchTemplates = (query: string) => {
  const searchTerm = query.toLowerCase();
  return ctaTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm) ||
    template.description?.toLowerCase().includes(searchTerm) ||
    template.category.toLowerCase().includes(searchTerm)
  );
};

export const getTemplateById = (id: string) => {
  return ctaTemplates.find(template => template.id === id);
};