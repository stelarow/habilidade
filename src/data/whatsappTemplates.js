/**
 * WhatsApp message templates for different contexts and categories
 */
export const whatsappTemplates = {
  // Generic template for general inquiries
  generic: {
    message: 'Vi o site da Escola Habilidade e gostaria de saber mais sobre os cursos dispon�veis. Pode me ajudar? =
',
    includeGreeting: true
  },

  // Templates by context (where the contact originated)
  byContext: {
    'floating-button': {
      message: 'Vi seu site e tenho interesse nos cursos da Escola Habilidade. Pode me dar mais informa��es?',
      includeGreeting: true
    },
    'contact-section': {
      message: 'Li o artigo "{article}" e fiquei interessado(a) em saber mais sobre os cursos relacionados. Voc�s podem me ajudar?',
      includeGreeting: true
    },
    'article': {
      message: 'Acabei de ler o artigo "{article}" e gostaria de conversar sobre como posso me aprofundar nessa �rea atrav�s dos cursos de voc�s.',
      includeGreeting: true
    },
    'quick-contact': {
      message: 'Gostaria de uma consulta r�pida sobre os cursos da Escola Habilidade. Podem me atender?',
      includeGreeting: true
    },
    'consultation-widget': {
      message: 'Gostaria de agendar a consulta gratuita de 15 minutos para conversar sobre os cursos.',
      includeGreeting: true
    }
  },

  // Templates by article category
  byCategory: {
    'tecnologia': {
      message: 'Li sobre {category} no artigo "{article}" e quero saber mais sobre os cursos de tecnologia de voc�s. Quais s�o as op��es dispon�veis?',
      includeGreeting: true
    },
    'educacao': {
      message: 'O artigo "{article}" me interessou muito! Gostaria de saber como posso me capacitar melhor na �rea educacional com os cursos de voc�s.',
      includeGreeting: true
    },
    'carreira': {
      message: 'Depois de ler "{article}", percebi que preciso me qualificar melhor. Quais cursos voc�s recomendam para desenvolvimento de carreira?',
      includeGreeting: true
    },
    'design': {
      message: 'Vi o artigo sobre {category} "{article}" e fiquei muito interessado(a) nos cursos de design! Podem me dar mais detalhes?',
      includeGreeting: true
    },
    'programacao': {
      message: 'O artigo "{article}" me motivou a aprender programa��o! Quais s�o os cursos dispon�veis nessa �rea?',
      includeGreeting: true
    },
    'marketing': {
      message: 'Li sobre {category} no artigo "{article}" e quero me especializar em marketing digital. Que cursos voc�s oferecem?',
      includeGreeting: true
    },
    'inteligencia-artificial': {
      message: 'Ap�s ler "{article}", fiquei fascinado(a) com IA! Voc�s t�m cursos nessa �rea? Como posso come�ar?',
      includeGreeting: true
    },
    'business-intelligence': {
      message: 'O artigo "{article}" sobre BI me interessou muito. Gostaria de saber sobre os cursos de an�lise de dados de voc�s.',
      includeGreeting: true
    }
  },

  // Mobile-specific templates (shorter and more direct)
  mobile: {
    generic: {
      message: 'Vi o site e quero saber sobre os cursos. Pode ajudar?',
      includeGreeting: true
    },
    article: {
      message: 'Li "{article}" e quero info sobre cursos relacionados.',
      includeGreeting: true
    }
  },

  // Templates for specific actions
  actions: {
    'schedule-consultation': {
      message: 'Gostaria de agendar uma consulta gratuita de 15 minutos para conversar sobre qual curso seria ideal para meu perfil.',
      includeGreeting: true
    },
    'course-info': {
      message: 'Preciso de informa��es detalhadas sobre os cursos: valores, dura��o, metodologia e certifica��o.',
      includeGreeting: true
    },
    'enrollment-help': {
      message: 'Quero me matricular em um curso mas preciso de ajuda para escolher o melhor para mim. Podem me orientar?',
      includeGreeting: true
    },
    'payment-options': {
      message: 'Gostaria de saber sobre formas de pagamento, parcelamento e se voc�s t�m alguma promo��o vigente.',
      includeGreeting: true
    },
    'technical-support': {
      message: 'Preciso de ajuda t�cnica/suporte. Podem me atender?',
      includeGreeting: true
    }
  },

  // Templates for different times of day
  timeSpecific: {
    morning: {
      prefix: 'Bom dia!',
      suffix: 'Aproveitando a manh� para pesquisar sobre cursos!'
    },
    afternoon: {
      prefix: 'Boa tarde!',
      suffix: 'Estou no intervalo do trabalho pesquisando cursos.'
    },
    evening: {
      prefix: 'Boa noite!',
      suffix: 'Aproveitando a noite para planejar meu desenvolvimento profissional.'
    },
    weekend: {
      prefix: 'Ol�!',
      suffix: 'Aproveitando o fim de semana para pesquisar sobre qualifica��o profissional.'
    }
  }
};

/**
 * Get template based on multiple criteria
 * @param {Object} criteria - Selection criteria
 * @returns {Object} Selected template
 */
export const getTemplate = (criteria = {}) => {
  const { 
    context = 'generic', 
    category = null, 
    isMobile = false, 
    action = null,
    hasArticle = false 
  } = criteria;

  // Priority order: action > category > context > mobile > generic
  if (action && whatsappTemplates.actions[action]) {
    return whatsappTemplates.actions[action];
  }

  if (category && whatsappTemplates.byCategory[category.toLowerCase()]) {
    return whatsappTemplates.byCategory[category.toLowerCase()];
  }

  if (hasArticle && whatsappTemplates.byContext.article) {
    return whatsappTemplates.byContext.article;
  }

  if (context && whatsappTemplates.byContext[context]) {
    return whatsappTemplates.byContext[context];
  }

  if (isMobile && whatsappTemplates.mobile.generic) {
    return whatsappTemplates.mobile.generic;
  }

  return whatsappTemplates.generic;
};

/**
 * Course-specific templates for more targeted messaging
 */
export const courseTemplates = {
  'projetista-3d': {
    message: 'Vi sobre design 3D e me interessei pelo curso de Projetista 3D. Quais s�o os pr�-requisitos e como funciona?',
    relatedKeywords: ['3d', 'design', 'modelagem', 'autocad', 'sketchup']
  },
  'edicao-video': {
    message: 'Tenho interesse em edi��o de v�deo. O curso de voc�s ensina quais programas? Adobe Premiere, After Effects?',
    relatedKeywords: ['video', 'edicao', 'premiere', 'after effects', 'audiovisual']
  },
  'informatica': {
    message: 'Preciso melhorar minhas habilidades em inform�tica. O curso cobre Office, internet e conceitos b�sicos?',
    relatedKeywords: ['informatica', 'office', 'windows', 'basico', 'computador']
  },
  'design-grafico': {
    message: 'Quero trabalhar com design gr�fico. O curso ensina Photoshop, Illustrator e conceitos de design?',
    relatedKeywords: ['design', 'grafico', 'photoshop', 'illustrator', 'visual']
  },
  'programacao': {
    message: 'Tenho interesse em aprender programa��o. Quais linguagens voc�s ensinam? � para iniciantes?',
    relatedKeywords: ['programacao', 'codigo', 'desenvolvimento', 'web', 'javascript']
  },
  'marketing-digital': {
    message: 'Quero me especializar em marketing digital. O curso cobre redes sociais, Google Ads, SEO?',
    relatedKeywords: ['marketing', 'digital', 'redes sociais', 'google ads', 'seo']
  },
  'inteligencia-artificial': {
    message: 'IA est� em alta! O curso de voc�s � pr�tico? Ensina Machine Learning e aplica��es reais?',
    relatedKeywords: ['ia', 'inteligencia artificial', 'machine learning', 'python', 'dados']
  },
  'business-intelligence': {
    message: 'Trabalho com dados e quero me especializar em BI. Voc�s ensinam Power BI, Tableau, an�lise de dados?',
    relatedKeywords: ['bi', 'business intelligence', 'dados', 'power bi', 'dashboard']
  }
};

/**
 * Get course-specific template based on article content or keywords
 * @param {string} content - Article content or keywords
 * @returns {Object|null} Course template or null
 */
export const getCourseTemplate = (content = '') => {
  const lowerContent = content.toLowerCase();
  
  for (const [courseKey, template] of Object.entries(courseTemplates)) {
    const hasKeyword = template.relatedKeywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      return { course: courseKey, ...template };
    }
  }
  
  return null;
};