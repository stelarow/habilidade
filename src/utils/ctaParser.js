/**
 * CTA Parser Utility - Sistema de análise e inserção de CTAs em conteúdo
 * Detecta artigos longos e insere CTAs de forma inteligente
 */

// Configurações padrão
const DEFAULT_CONFIG = {
  minWordCount: 1000, // Mínimo de palavras para inserir CTAs inline
  maxInlineCTAs: 2, // Máximo de CTAs inline por artigo
  paragraphThreshold: 3, // Mínimo de parágrafos entre CTAs
  preferredPositions: [0.3, 0.7], // Posições preferenciais (30% e 70% do conteúdo)
};

/**
 * Conta palavras em um texto HTML
 */
export const countWords = (htmlContent) => {
  if (!htmlContent) return 0;
  
  // Remove tags HTML e conta palavras
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
  const words = textContent.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
};

/**
 * Analisa se o artigo é longo o suficiente para CTAs inline
 */
export const shouldShowInlineCTAs = (content, config = DEFAULT_CONFIG) => {
  const wordCount = countWords(content);
  return wordCount >= config.minWordCount;
};

/**
 * Extrai parágrafos de conteúdo HTML
 */
export const extractParagraphs = (htmlContent) => {
  if (!htmlContent) return [];
  
  // Encontra todos os parágrafos
  const paragraphMatches = htmlContent.match(/<p[^>]*>.*?<\/p>/gi);
  return paragraphMatches || [];
};

/**
 * Calcula posições ideais para inserir CTAs
 */
export const calculateOptimalPositions = (paragraphs, config = DEFAULT_CONFIG) => {
  if (paragraphs.length < config.paragraphThreshold * 2) {
    return []; // Não inserir se há poucos parágrafos
  }

  const positions = [];
  const totalParagraphs = paragraphs.length;

  // Calcula posições baseadas nas preferências
  config.preferredPositions.forEach(ratio => {
    const targetIndex = Math.floor(totalParagraphs * ratio);
    
    // Garante que não seja muito próximo do início ou fim
    const minIndex = Math.max(config.paragraphThreshold, 0);
    const maxIndex = Math.min(totalParagraphs - config.paragraphThreshold, totalParagraphs - 1);
    
    const adjustedIndex = Math.max(minIndex, Math.min(maxIndex, targetIndex));
    
    if (adjustedIndex >= 0 && adjustedIndex < totalParagraphs) {
      positions.push(adjustedIndex);
    }
  });

  // Remove duplicatas e ordena
  return [...new Set(positions)].sort((a, b) => a - b).slice(0, config.maxInlineCTAs);
};

/**
 * Gera CTAs contextuais baseados no conteúdo do artigo
 */
export const generateContextualCTAs = (post) => {
  const ctas = [];
  
  if (!post || !post.content) return ctas;

  const content = post.content.toLowerCase();
  const title = (post.title || '').toLowerCase();
  const categories = post.categories?.map(c => (c.name || c).toLowerCase()) || [];
  const tags = post.tags?.map(t => t.toLowerCase()) || [];
  
  const allText = [content, title, ...categories, ...tags].join(' ');

  // Templates de CTA baseados em palavras-chave
  const ctaTemplates = {
    // Tecnologia e Programação
    programming: {
      keywords: ['programação', 'javascript', 'html', 'css', 'web', 'desenvolvimento', 'código'],
      cta: {
        type: 'course',
        title: 'Quer dominar programação web?',
        description: 'Aprenda as tecnologias mais demandadas do mercado com nosso curso completo.',
        actionText: 'Ver Curso',
        actionLink: '/curso/programacao-web'
      }
    },
    
    // Design
    design: {
      keywords: ['design', 'photoshop', 'illustrator', 'criação', 'visual', 'gráfico'],
      cta: {
        type: 'course',
        title: 'Transforme ideias em designs incríveis',
        description: 'Domine as ferramentas profissionais de design gráfico.',
        actionText: 'Conhecer Curso',
        actionLink: '/curso/design-grafico'
      }
    },
    
    // Marketing
    marketing: {
      keywords: ['marketing', 'digital', 'redes sociais', 'facebook', 'instagram', 'publicidade'],
      cta: {
        type: 'course',
        title: 'Impulsione seu negócio online',
        description: 'Aprenda estratégias de marketing digital que realmente funcionam.',
        actionText: 'Ver Estratégias',
        actionLink: '/curso/marketing-digital'
      }
    },
    
    // Informática
    office: {
      keywords: ['excel', 'word', 'powerpoint', 'office', 'planilha', 'informática', 'windows'],
      cta: {
        type: 'course',
        title: 'Seja expert em informática',
        description: 'Domine as ferramentas essenciais para qualquer profissão.',
        actionText: 'Começar Agora',
        actionLink: '/curso/informatica'
      }
    },
    
    // Lead Magnets genéricos
    ebook: {
      keywords: ['dicas', 'guia', 'tutorial', 'passo a passo', 'como fazer'],
      cta: {
        type: 'leadmagnet',
        title: 'E-book gratuito: Guia completo para iniciantes',
        description: 'Baixe nosso material exclusivo e acelere seu aprendizado.',
        actionText: 'Baixar Grátis',
        actionLink: '#ebook-download'
      }
    },
    
    // Newsletter
    newsletter: {
      keywords: ['novidades', 'tecnologia', 'mercado', 'carreira', 'profissional'],
      cta: {
        type: 'newsletter',
        title: 'Fique por dentro das novidades',
        description: 'Receba dicas exclusivas e conteúdos especiais no seu email.',
        actionText: 'Assinar Newsletter',
        actionLink: '#newsletter-signup'
      }
    }
  };

  // Verifica qual template é mais relevante
  let bestMatch = null;
  let bestScore = 0;

  Object.entries(ctaTemplates).forEach(([key, template]) => {
    const matchingKeywords = template.keywords.filter(keyword => 
      allText.includes(keyword)
    );
    
    const score = matchingKeywords.length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = template.cta;
    }
  });

  // Se encontrou uma correspondência, adiciona o CTA
  if (bestMatch && bestScore > 0) {
    ctas.push(bestMatch);
  }

  // Adiciona um CTA genérico se não houver correspondências específicas
  if (ctas.length === 0) {
    ctas.push({
      type: 'course',
      title: 'Desenvolva novas habilidades',
      description: 'Explore nossos cursos e transforme sua carreira profissional.',
      actionText: 'Ver Cursos',
      actionLink: '/cursos'
    });
  }

  // Se o artigo for muito longo, adiciona um segundo CTA de tipo diferente
  if (countWords(post.content) > 2000 && ctas.length === 1) {
    ctas.push({
      type: 'newsletter',
      title: 'Gostou do conteúdo?',
      description: 'Receba mais artigos como este diretamente no seu email.',
      actionText: 'Assinar',
      actionLink: '#newsletter'
    });
  }

  return ctas;
};

/**
 * Insere CTAs inline no conteúdo HTML
 */
export const insertInlineCTAs = (htmlContent, ctas, config = DEFAULT_CONFIG) => {
  if (!shouldShowInlineCTAs(htmlContent, config) || !ctas.length) {
    return htmlContent;
  }

  const paragraphs = extractParagraphs(htmlContent);
  const positions = calculateOptimalPositions(paragraphs, config);

  if (positions.length === 0) {
    return htmlContent;
  }

  let modifiedContent = htmlContent;
  let insertionOffset = 0;

  // Insere CTAs nas posições calculadas
  positions.forEach((position, index) => {
    if (index < ctas.length) {
      const cta = ctas[index];
      const ctaId = `inline-cta-${index}`;
      
      // Cria o elemento CTA (será renderizado pelo React)
      const ctaPlaceholder = `<div class="inline-cta-placeholder" data-cta-id="${ctaId}" data-cta-type="${cta.type}" data-cta-title="${encodeURIComponent(cta.title)}" data-cta-description="${encodeURIComponent(cta.description)}" data-cta-action-text="${encodeURIComponent(cta.actionText)}" data-cta-action-link="${encodeURIComponent(cta.actionLink)}"></div>`;
      
      // Encontra a posição do parágrafo no conteúdo modificado
      const currentParagraphs = extractParagraphs(modifiedContent);
      const adjustedPosition = Math.min(position + insertionOffset, currentParagraphs.length - 1);
      
      if (adjustedPosition >= 0 && adjustedPosition < currentParagraphs.length) {
        const targetParagraph = currentParagraphs[adjustedPosition];
        const paragraphIndex = modifiedContent.indexOf(targetParagraph);
        
        if (paragraphIndex !== -1) {
          const insertionPoint = paragraphIndex + targetParagraph.length;
          modifiedContent = modifiedContent.slice(0, insertionPoint) + 
                          ctaPlaceholder + 
                          modifiedContent.slice(insertionPoint);
          insertionOffset++;
        }
      }
    }
  });

  return modifiedContent;
};

/**
 * Processa placeholders de CTA no DOM (para uso no componente React)
 */
export const processCtaPlaceholders = (containerElement, onCtaRender) => {
  if (!containerElement || typeof onCtaRender !== 'function') return;

  const placeholders = containerElement.querySelectorAll('.inline-cta-placeholder');
  
  placeholders.forEach((placeholder, index) => {
    const ctaData = {
      id: placeholder.dataset.ctaId || `cta-${index}`,
      type: placeholder.dataset.ctaType || 'course',
      title: decodeURIComponent(placeholder.dataset.ctaTitle || ''),
      description: decodeURIComponent(placeholder.dataset.ctaDescription || ''),
      actionText: decodeURIComponent(placeholder.dataset.ctaActionText || 'Ver mais'),
      actionLink: decodeURIComponent(placeholder.dataset.ctaActionLink || '/cursos')
    };

    onCtaRender(placeholder, ctaData);
  });
};

export default {
  countWords,
  shouldShowInlineCTAs,
  extractParagraphs,
  calculateOptimalPositions,
  generateContextualCTAs,
  insertInlineCTAs,
  processCtaPlaceholders,
  DEFAULT_CONFIG
};