# Guia de Extração Inteligente de Artigos - Foco no Conteúdo Principal

## Objetivo

Extrair com precisão o conteúdo principal de um artigo a partir de uma URL, eliminando ruídos como anúncios, menus, barras laterais, pop-ups e outros elementos não relacionados ao conteúdo do artigo.

## 1. Identificação do Conteúdo Principal

### 1.1 Seletores Prioritários para Conteúdo

A IA deve procurar o conteúdo principal nesta ordem de prioridade:

```
1. <article> - Tag semântica HTML5 para artigos
2. <main> - Tag semântica para conteúdo principal
3. [role="main"] - Atributo ARIA para conteúdo principal
4. [role="article"] - Atributo ARIA para artigos
5. .post-content, .article-content, .entry-content - Classes comuns
6. .content, .main-content - Classes genéricas
7. #content, #main - IDs comuns
8. [itemprop="articleBody"] - Schema.org markup
```

### 1.2 Análise de Densidade de Texto

```typescript
// Algoritmo para identificar blocos de conteúdo principal
analyzeTextDensity(element) {
  const textLength = element.textContent.length;
  const linkDensity = calculateLinkDensity(element);
  const paragraphCount = element.querySelectorAll('p').length;
  const wordCount = element.textContent.split(/\s+/).length;
  
  // Conteúdo principal geralmente tem:
  // - Alta densidade de texto (>100 palavras)
  // - Baixa densidade de links (<30%)
  // - Múltiplos parágrafos
  // - Estrutura hierárquica (h1, h2, h3)
  
  return {
    isMainContent: textLength > 500 && 
                   linkDensity < 0.3 && 
                   paragraphCount > 2 &&
                   wordCount > 100
  };
}
```

## 2. Elementos a Extrair do Artigo

### 2.1 Conteúdo Essencial

```typescript
interface ArticleContent {
  // Metadados principais
  title: string;           // h1, .title, [itemprop="headline"]
  author: string;          // .author, [itemprop="author"], .by-line
  publishDate: string;     // time, .date, [itemprop="datePublished"]
  updateDate?: string;     // [itemprop="dateModified"]
  
  // Corpo do artigo
  introduction: string;    // Primeiro parágrafo ou .lead/.intro
  mainContent: string;     // Conteúdo principal processado
  sections: Section[];     // Seções com hierarquia preservada
  
  // Elementos de suporte
  images: Image[];         // Apenas imagens dentro do conteúdo
  codeBlocks: Code[];      // <pre>, <code>, .highlight
  quotes: Quote[];         // <blockquote>, .quote
  lists: List[];           // <ul>, <ol> relevantes
  tables: Table[];         // <table> com dados
}
```

### 2.2 Hierarquia de Seções

```typescript
interface Section {
  level: number;         // h1=1, h2=2, etc.
  title: string;         // Texto do heading
  content: string;       // Conteúdo da seção
  subsections: Section[]; // Subseções aninhadas
}

// Preservar estrutura hierárquica
extractSections(article) {
  const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const sections = [];
  
  headings.forEach(heading => {
    const section = {
      level: parseInt(heading.tagName[1]),
      title: heading.textContent.trim(),
      content: extractUntilNextHeading(heading),
      subsections: []
    };
    sections.push(section);
  });
  
  return buildHierarchy(sections);
}
```

## 3. Elementos a Ignorar (Ruídos)

### 3.1 Seletores de Exclusão

```typescript
const NOISE_SELECTORS = [
  // Navegação e menus
  'nav', 'header', 'footer',
  '.navigation', '.menu', '.navbar',
  
  // Anúncios e publicidade
  '.ad', '.ads', '.advertisement',
  '[class*="ad-"]', '[id*="ad-"]',
  '.sponsor', '.promoted',
  
  // Sidebars e widgets
  'aside', '.sidebar', '.widget',
  '.related-posts', '.popular-posts',
  
  // Pop-ups e modais
  '.modal', '.popup', '.overlay',
  '.newsletter-signup', '.subscribe-box',
  
  // Comentários e social
  '.comments', '#comments', '.disqus',
  '.social-share', '.share-buttons',
  
  // Elementos de UI
  '.breadcrumb', '.pagination',
  '.back-to-top', '.print-button',
  
  // Scripts e estilos
  'script', 'style', 'noscript',
  
  // Elementos ocultos
  '[style*="display:none"]',
  '[style*="visibility:hidden"]',
  '.hidden', '[hidden]'
];

// Remover todos os elementos de ruído
function removeNoise(document) {
  NOISE_SELECTORS.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => el.remove());
  });
}
```

### 3.2 Padrões de Texto a Ignorar

```typescript
const NOISE_PATTERNS = [
  // Call-to-actions genéricos
  /subscribe to our newsletter/i,
  /follow us on/i,
  /share this article/i,
  
  // Textos de navegação
  /previous article|next article/i,
  /back to top/i,
  /read more articles/i,
  
  // Disclaimers repetitivos
  /copyright \d{4}/i,
  /all rights reserved/i,
  /terms and conditions/i,
  
  // Promoções
  /limited time offer/i,
  /sign up now/i,
  /download our app/i
];

function cleanText(text) {
  NOISE_PATTERNS.forEach(pattern => {
    text = text.replace(pattern, '');
  });
  return text.trim();
}
```

## 4. Extração de Imagens Relevantes

### 4.1 Identificação de Imagens do Artigo

```typescript
function extractArticleImages(articleElement) {
  const images = [];
  
  // Apenas imagens dentro do conteúdo principal
  const imgElements = articleElement.querySelectorAll('img');
  
  imgElements.forEach(img => {
    // Filtrar imagens relevantes
    if (isRelevantImage(img)) {
      images.push({
        src: img.src,
        alt: img.alt || extractImageContext(img),
        caption: findImageCaption(img),
        width: img.naturalWidth,
        height: img.naturalHeight,
        isHero: isHeroImage(img),
        context: getImageContext(img)
      });
    }
  });
  
  return images;
}

function isRelevantImage(img) {
  // Ignorar ícones e imagens pequenas
  if (img.width < 100 || img.height < 100) return false;
  
  // Ignorar logos e avatares
  if (img.classList.contains('logo') || 
      img.classList.contains('avatar') ||
      img.src.includes('logo') ||
      img.src.includes('avatar')) return false;
  
  // Ignorar imagens de tracking
  if (img.src.includes('pixel') || 
      img.src.includes('tracking')) return false;
  
  return true;
}
```

### 4.2 Hero Image (Imagem Principal)

```typescript
function identifyHeroImage(article) {
  // Prioridade para encontrar hero image
  const selectors = [
    '.hero-image',
    '.featured-image',
    '.post-thumbnail',
    'figure img:first-of-type',
    'img[itemprop="image"]',
    // Primeira imagem grande no artigo
    'img[width>600]'
  ];
  
  for (const selector of selectors) {
    const img = article.querySelector(selector);
    if (img && isRelevantImage(img)) {
      return img;
    }
  }
  
  return null;
}
```

## 5. Processamento de Código

### 5.1 Extração de Blocos de Código

```typescript
function extractCodeBlocks(article) {
  const codeBlocks = [];
  
  // Seletores comuns para código
  const codeSelectors = [
    'pre code',
    'pre',
    '.highlight',
    '.code-block',
    '[class*="language-"]'
  ];
  
  codeSelectors.forEach(selector => {
    article.querySelectorAll(selector).forEach(element => {
      const language = detectLanguage(element);
      const code = extractCleanCode(element);
      
      if (code.trim()) {
        codeBlocks.push({
          language,
          code,
          hasLineNumbers: hasLineNumbers(element),
          explanation: findCodeExplanation(element)
        });
      }
    });
  });
  
  return codeBlocks;
}

function detectLanguage(element) {
  // Detectar linguagem através de classes
  const classNames = element.className;
  const langMatch = classNames.match(/language-(\w+)/);
  
  if (langMatch) return langMatch[1];
  
  // Detectar através de comentários ou conteúdo
  return inferLanguageFromContent(element.textContent);
}
```

## 6. Limpeza e Normalização

### 6.1 Limpeza de HTML

```typescript
function cleanHTML(html) {
  // Remover atributos desnecessários
  const attributesToRemove = [
    'style', 'onclick', 'onload', 
    'data-ad-', 'data-tracking-'
  ];
  
  // Remover comentários HTML
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remover espaços em branco excessivos
  html = html.replace(/\s+/g, ' ');
  
  // Remover tags vazias
  html = html.replace(/<(\w+)(\s[^>]*)?>[\s]*<\/\1>/g, '');
  
  return html;
}
```

### 6.2 Normalização de Texto

```typescript
function normalizeText(text) {
  return text
    // Remover espaços múltiplos
    .replace(/\s+/g, ' ')
    // Remover espaços no início/fim
    .trim()
    // Normalizar quebras de linha
    .replace(/\n{3,}/g, '\n\n')
    // Remover caracteres invisíveis
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    // Corrigir pontuação com espaços
    .replace(/\s+([.,!?;:])/g, '$1')
    .replace(/([.,!?;:])\s*$/g, '$1');
}
```

## 7. Validação de Qualidade

### 7.1 Critérios de Qualidade do Conteúdo Extraído

```typescript
function validateExtractedContent(content) {
  const validation = {
    hasTitle: !!content.title && content.title.length > 5,
    hasMainContent: content.mainContent.length > 200,
    hasStructure: content.sections.length > 0,
    textQuality: calculateTextQuality(content.mainContent),
    completeness: assessCompleteness(content),
    noiseLevel: calculateNoiseLevel(content)
  };
  
  validation.overallQuality = 
    (validation.hasTitle ? 20 : 0) +
    (validation.hasMainContent ? 30 : 0) +
    (validation.hasStructure ? 20 : 0) +
    (validation.textQuality * 20) +
    (validation.completeness * 10) +
    ((1 - validation.noiseLevel) * 10);
  
  return validation;
}

function assessCompleteness(content) {
  // Verificar se o artigo parece completo
  const indicators = {
    hasIntroduction: !!content.introduction,
    hasConclusion: detectConclusion(content.mainContent),
    sectionFlow: checkSectionContinuity(content.sections),
    minWordCount: content.mainContent.split(/\s+/).length > 300
  };
  
  return Object.values(indicators).filter(Boolean).length / 4;
}
```

## 8. Estratégias Avançadas

### 8.1 Machine Learning para Detecção de Conteúdo

```typescript
// Usar heurísticas baseadas em padrões comuns
function scoreContentBlock(element) {
  let score = 0;
  
  // Pontuação positiva
  if (element.querySelector('p')) score += 5;
  if (element.textContent.length > 200) score += 10;
  if (element.querySelector('h2, h3')) score += 5;
  if (element.querySelector('img')) score += 3;
  if (element.querySelector('pre, code')) score += 5;
  
  // Pontuação negativa
  if (element.querySelector('a').length / element.textContent.length > 0.3) score -= 10;
  if (element.className.includes('sidebar')) score -= 20;
  if (element.className.includes('ad')) score -= 30;
  
  return score;
}
```

### 8.2 Fallback para Sites Difíceis

```typescript
function extractWithReadability(html) {
  // Algoritmo similar ao Readability/Mercury Parser
  // 1. Clonar documento
  // 2. Remover scripts/styles
  // 3. Calcular scores de conteúdo
  // 4. Identificar nó com maior score
  // 5. Expandir para incluir contexto
  // 6. Limpar e retornar
  
  const candidates = findContentCandidates(html);
  const bestCandidate = selectBestCandidate(candidates);
  return cleanAndExtract(bestCandidate);
}
```

## 9. Exemplo de Fluxo Completo

```typescript
async function extractArticleFromURL(url) {
  // 1. Buscar HTML
  const html = await fetchHTML(url);
  
  // 2. Criar DOM virtual
  const doc = parseHTML(html);
  
  // 3. Remover ruídos
  removeNoise(doc);
  
  // 4. Identificar conteúdo principal
  const articleElement = findMainContent(doc);
  
  // 5. Extrair componentes
  const content = {
    title: extractTitle(doc, articleElement),
    author: extractAuthor(doc, articleElement),
    publishDate: extractDate(doc, articleElement),
    introduction: extractIntroduction(articleElement),
    mainContent: extractMainContent(articleElement),
    sections: extractSections(articleElement),
    images: extractArticleImages(articleElement),
    codeBlocks: extractCodeBlocks(articleElement)
  };
  
  // 6. Limpar e normalizar
  content.mainContent = cleanHTML(content.mainContent);
  content.mainContent = normalizeText(content.mainContent);
  
  // 7. Validar qualidade
  const validation = validateExtractedContent(content);
  
  if (validation.overallQuality < 60) {
    // Tentar estratégia alternativa
    return extractWithReadability(html);
  }
  
  return content;
}
```

## 10. Tratamento de Sites Específicos

### 10.1 Padrões Comuns por Plataforma

```typescript
const PLATFORM_PATTERNS = {
  medium: {
    article: 'article',
    title: 'h1',
    content: 'section',
    ignore: ['.highlightMenu', '.postActions']
  },
  wordpress: {
    article: '.post, .entry, article',
    title: '.entry-title, h1.title',
    content: '.entry-content, .post-content',
    ignore: ['.sharedaddy', '.jp-relatedposts']
  },
  substack: {
    article: '.post',
    title: '.post-title',
    content: '.body',
    ignore: ['.subscribe-widget', '.comment-section']
  }
};
```

## Conclusão

A extração inteligente de artigos requer:

1. **Identificação precisa** do conteúdo principal
2. **Remoção agressiva** de ruídos e distrações
3. **Preservação cuidadosa** da estrutura e hierarquia
4. **Validação contínua** da qualidade
5. **Estratégias de fallback** para casos difíceis

O objetivo é extrair APENAS o que é relevante para o aprendizado, criando uma experiência de leitura limpa e focada.