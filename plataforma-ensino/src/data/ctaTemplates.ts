import type { CTATemplate } from '@/types/cta';

export const ctaTemplates: CTATemplate[] = [
  // Lead Magnet Templates
  {
    id: 'tech-leadmagnet-guide',
    name: 'Guia TÃ©cnico - Tecnologia',
    category: 'tecnologia',
    type: 'leadmagnet',
    description: 'Template para guias tÃ©cnicos e tutoriais em tecnologia',
    usageCount: 245,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Guia Completo: {{articleTopic}}',
        description: 'Baixe nosso guia prÃ¡tico sobre {{articleTopic}} com exemplos reais e implementaÃ§Ãµes passo a passo.',
        buttonText: 'Baixar Guia GrÃ¡tis',
        subtext: 'Material exclusivo Â· Acesso imediato Â· Sem spam',
        benefits: [
          'Exemplos de cÃ³digo prÃ¡ticos',
          'Checklist de implementaÃ§Ã£o',
          'Templates prontos para usar',
          'Dicas de otimizaÃ§Ã£o',
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
    description: 'Template para checklists tÃ©cnicos e listas de verificaÃ§Ã£o',
    usageCount: 189,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'Checklist: {{articleTopic}}',
        description: 'Garanta que vocÃª nÃ£o esqueÃ§a nada importante com nosso checklist completo sobre {{articleTopic}}.',
        buttonText: 'Baixar Checklist',
        subtext: 'PDF otimizado Â· ImprimÃ­vel Â· Gratuito',
        benefits: [
          'Lista completa de verificaÃ§Ã£o',
          'Formato PDF imprimÃ­vel',
          'Baseado em melhores prÃ¡ticas',
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
    name: 'EstratÃ©gia - Marketing',
    category: 'marketing',
    type: 'leadmagnet',
    description: 'Template para estratÃ©gias e planejamentos de marketing',
    usageCount: 312,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'EstratÃ©gia Completa: {{articleTopic}}',
        description: 'Descubra a estratÃ©gia completa sobre {{articleTopic}} que grandes empresas usam para gerar resultados.',
        buttonText: 'Acessar EstratÃ©gia',
        subtext: 'ConteÃºdo exclusivo Â· Cases reais Â· AplicaÃ§Ã£o prÃ¡tica',
        benefits: [
          'Framework comprovado',
          'Cases de sucesso reais',
          'Templates para implementaÃ§Ã£o',
          'MÃ©tricas para medir resultados',
          'Cronograma de execuÃ§Ã£o'
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
    description: 'Newsletter semanal focada em tecnologia e programaÃ§Ã£o',
    usageCount: 892,
    config: {
      type: 'newsletter',
      content: {
        title: 'Newsletter Tech Weekly',
        description: 'Receba semanalmente as melhores novidades em tecnologia, tutoriais exclusivos e tendÃªncias do mercado.',
        buttonText: 'Quero Receber',
        subtext: 'Toda terÃ§a-feira Â· ConteÃºdo curado Â· Cancele quando quiser'
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
        description: 'Os melhores insights de marketing digital, cases de sucesso e tendÃªncias direto na sua caixa de entrada.',
        buttonText: 'Inscrever-se',
        subtext: 'Semanal Â· Cases exclusivos Â· Gratuito'
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
    description: 'PromoÃ§Ã£o de cursos intensivos de tecnologia',
    usageCount: 234,
    config: {
      type: 'course',
      content: {
        title: 'Curso Intensivo: {{articleTopic}}',
        description: 'Domine {{articleTopic}} em apenas 4 semanas com nosso curso intensivo e prÃ¡tico.',
        buttonText: 'Ver Curso',
        subtext: 'Certificado incluso Â· Projetos prÃ¡ticos Â· Suporte 24/7',
        benefits: [
          '4 semanas de conteÃºdo intensivo',
          'Projetos prÃ¡ticos do mercado',
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
    name: 'Consultoria Audit - NegÃ³cios',
    category: 'negocios',
    type: 'consultation',
    description: 'Consulta gratuita para audit de negÃ³cios',
    usageCount: 156,
    config: {
      type: 'consultation',
      content: {
        title: 'Consultoria Gratuita de {{articleTopic}}',
        description: 'Agende uma sessÃ£o gratuita de 30 minutos para analisarmos seu {{articleTopic}} e identificar oportunidades.',
        buttonText: 'Agendar Consultoria',
        subtext: '30 minutos Â· Online Â· Sem compromisso',
        benefits: [
          'AnÃ¡lise completa da situaÃ§Ã£o atual',
          'IdentificaÃ§Ã£o de oportunidades',
          'Plano de aÃ§Ã£o personalizado',
          'RecomendaÃ§Ãµes especÃ­ficas'
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
    description: 'Template de urgÃªncia para ofertas com prazo limitado',
    usageCount: 423,
    config: {
      type: 'urgency',
      content: {
        title: 'Oferta Especial: {{articleTopic}}',
        description: 'Aproveite nossa oferta especial sobre {{articleTopic}} por tempo limitado.',
        buttonText: 'Aproveitar Oferta',
        subtext: 'Oferta vÃ¡lida por tempo limitado'
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
    name: 'Ãltimas Vagas - Curso',
    category: 'educacao',
    type: 'urgency',
    description: 'Template de urgÃªncia para matrÃ­culas com vagas limitadas',
    usageCount: 178,
    config: {
      type: 'urgency',
      content: {
        title: 'Ãltimas Vagas: {{courseTitle}}',
        description: 'Restam poucas vagas para o curso de {{courseTitle}}. Garante jÃ¡ a sua!',
        buttonText: 'Garantir Vaga',
        subtext: 'InÃ­cio em breve Â· Turma limitada'
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
    name: 'InspiraÃ§Ã£o - Design',
    category: 'design',
    type: 'leadmagnet',
    description: 'ColeÃ§Ã£o de inspiraÃ§Ãµes e recursos de design',
    usageCount: 298,
    config: {
      type: 'leadmagnet',
      content: {
        title: 'ColeÃ§Ã£o: {{designTopic}}',
        description: 'Baixe nossa coleÃ§Ã£o exclusiva de {{designTopic}} com mais de 100 exemplos inspiradores.',
        buttonText: 'Baixar ColeÃ§Ã£o',
        subtext: '100+ exemplos Â· Alta resoluÃ§Ã£o Â· Uso comercial',
        benefits: [
          'Mais de 100 exemplos',
          'Alta resoluÃ§Ã£o (300 DPI)',
          'LicenÃ§a para uso comercial',
          'Categorizados por estilo',
          'AtualizaÃ§Ãµes mensais'
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
    description: 'Template genÃ©rico para newsletter de qualquer nicho',
    usageCount: 756,
    config: {
      type: 'newsletter',
      content: {
        title: 'Newsletter {{siteName}}',
        description: 'Receba conteÃºdo exclusivo sobre {{mainTopic}} e fique sempre atualizado com as novidades.',
        buttonText: 'Inscrever-se',
        subtext: 'ConteÃºdo exclusivo Â· Sem spam Â· Cancele quando quiser'
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
    description: 'Templates para conteÃºdo de tecnologia, programaÃ§Ã£o e desenvolvimento',
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
    description: 'Templates para design grÃ¡fico, UX/UI e criatividade',
    color: '#a855f7'
  },
  {
    id: 'negocios',
    name: 'NegÃ³cios',
    description: 'Templates para empreendedorismo, gestÃ£o e consultoria',
    color: '#059669'
  },
  {
    id: 'educacao',
    name: 'EducaÃ§Ã£o',
    description: 'Templates para cursos, treinamentos e conteÃºdo educacional',
    color: '#d97706'
  },
  {
    id: 'universal',
    name: 'Universal',
    description: 'Templates genÃ©ricos que funcionam para qualquer nicho',
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