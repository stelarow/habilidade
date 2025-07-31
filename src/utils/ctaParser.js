/**
 * CTA Parser Utility - Sistema de an�lise e inser��o de CTAs em conte�do
 * Detecta artigos longos e insere CTAs de forma inteligente
 */

// Configura��es padr�o
const DEFAULT_CONFIG = {
  minWordCount: 1000, // M�nimo de palavras para inserir CTAs inline
  maxInlineCTAs: 2, // M�ximo de CTAs inline por artigo
  paragraphThreshold: 3, // M�nimo de par�grafos entre CTAs
  preferredPositions: [0.3, 0.7], // Posi��es preferenciais (30% e 70% do conte�do)
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
 * Analisa se o artigo � longo o suficiente para CTAs inline
 */
export const shouldShowInlineCTAs = (content, config = DEFAULT_CONFIG) => {
  const wordCount = countWords(content);
  return wordCount >= config.minWordCount;
};

/**
 * Extrai par�grafos de conte�do HTML
 */
export const extractParagraphs = (htmlContent) => {
  if (!htmlContent) return [];
  
  // Encontra todos os par�grafos
  const paragraphMatches = htmlContent.match(/<p[^>]*>.*?<\/p>/gi);
  return paragraphMatches || [];
};

/**
 * Calcula posi��es ideais para inserir CTAs
 */
export const calculateOptimalPositions = (paragraphs, config = DEFAULT_CONFIG) => {
  if (paragraphs.length < config.paragraphThreshold * 2) {
    return []; // N�o inserir se h� poucos par�grafos
  }

  const positions = [];
  const totalParagraphs = paragraphs.length;

  // Calcula posi��es baseadas nas prefer�ncias
  config.preferredPositions.forEach(ratio => {
    const targetIndex = Math.floor(totalParagraphs * ratio);
    
    // Garante que n�o seja muito pr�ximo do in�cio ou fim
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
 * Gera CTAs contextuais baseados no conte�do do artigo
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
    // Tecnologia e Programa��o
    programming: {
      keywords: ['programa��o', 'javascript', 'html', 'css', 'web', 'desenvolvimento', 'c�digo'],
      cta: {
        type: 'course',
        title: 'Quer dominar programa��o web?',
        description: 'Aprenda as tecnologias mais demandadas do mercado com nosso curso completo.',
        actionText: 'Ver Curso',
        actionLink: '/curso/programacao-web'
      }
    },
    
    // Design
    design: {
      keywords: ['design', 'photoshop', 'illustrator', 'cria��o', 'visual', 'gr�fico'],
      cta: {
        type: 'course',
        title: 'Transforme ideias em designs incr�veis',
        description: 'Domine as ferramentas profissionais de design gr�fico.',
        actionText: 'Conhecer Curso',
        actionLink: '/curso/design-grafico'
      }
    },
    
    // Marketing
    marketing: {
      keywords: ['marketing', 'digital', 'redes sociais', 'facebook', 'instagram', 'publicidade'],
      cta: {
        type: 'course',
        title: 'Impulsione seu neg�cio online',
        description: 'Aprenda estrat�gias de marketing digital que realmente funcionam.',
        actionText: 'Ver Estrat�gias',
        actionLink: '/curso/marketing-digital'
      }
    },
    
    // Inform�tica
    office: {
      keywords: ['excel', 'word', 'powerpoint', 'office', 'planilha', 'inform�tica', 'windows'],
      cta: {
        type: 'course',
        title: 'Seja expert em inform�tica',
        description: 'Domine as ferramentas essenciais para qualquer profiss�o.',
        actionText: 'Come�ar Agora',
        actionLink: '/curso/informatica'
      }
    },
    
    // Lead Magnets gen�ricos
    ebook: {
      keywords: ['dicas', 'guia', 'tutorial', 'passo a passo', 'como fazer'],
      cta: {
        type: 'leadmagnet',
        title: 'E-book gratuito: Guia completo para iniciantes',
        description: 'Baixe nosso material exclusivo e acelere seu aprendizado.',
        actionText: 'Baixar Gr�tis',
        actionLink: '#ebook-download'
      }
    },
    
    // Newsletter
    newsletter: {
      keywords: ['novidades', 'tecnologia', 'mercado', 'carreira', 'profissional'],
      cta: {
        type: 'newsletter',
        title: 'Fique por dentro das novidades',
        description: 'Receba dicas exclusivas e conte�dos especiais no seu email.',
        actionText: 'Assinar Newsletter',
        actionLink: '#newsletter-signup'
      }
    }
  };

  // Verifica qual template � mais relevante
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

  // Se encontrou uma correspond�ncia, adiciona o CTA
  if (bestMatch && bestScore > 0) {
    ctas.push(bestMatch);
  }

  // Adiciona um CTA gen�rico se n�o houver correspond�ncias espec�ficas
  if (ctas.length === 0) {
    ctas.push({
      type: 'course',
      title: 'Desenvolva novas habilidades',
      description: 'Explore nossos cursos e desenvolva suas habilidades profissionais.',
      actionText: 'Ver Cursos',
      actionLink: '/cursos'
    });
  }

  // Se o artigo for muito longo, adiciona um segundo CTA de tipo diferente
  if (countWords(post.content) > 2000 && ctas.length === 1) {
    ctas.push({
      type: 'newsletter',
      title: 'Gostou do conte�do?',
      description: 'Receba mais artigos como este diretamente no seu email.',
      actionText: 'Assinar',
      actionLink: '#newsletter'
    });
  }

  return ctas;
};

/**
 * Insere CTAs inline no conte�do HTML
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

  // Insere CTAs nas posi��es calculadas
  positions.forEach((position, index) => {
    if (index < ctas.length) {
      const cta = ctas[index];
      const ctaId = `inline-cta-${index}`;
      
      // Cria o elemento CTA (ser� renderizado pelo React)
      const ctaPlaceholder = `<div class="inline-cta-placeholder" data-cta-id="${ctaId}" data-cta-type="${cta.type}" data-cta-title="${encodeURIComponent(cta.title)}" data-cta-description="${encodeURIComponent(cta.description)}" data-cta-action-text="${encodeURIComponent(cta.actionText)}" data-cta-action-link="${encodeURIComponent(cta.actionLink)}"></div>`;
      
      // Encontra a posi��o do par�grafo no conte�do modificado
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