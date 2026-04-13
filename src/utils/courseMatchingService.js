/**
 * Course Matching Service - Sistema inteligente de sugest�o de cursos
 * Analisa conte�do de artigos e sugere cursos relevantes automaticamente
 */

import { coursesData } from '../data/coursesData';

// Cache para melhor performance
const matchingCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

/**
 * Configura��o de matching de cursos
 */
const COURSE_KEYWORDS = {
  'informatica-001': {
    primary: ['inform�tica', 'office', 'windows', 'excel', 'word', 'powerpoint', 'canva'],
    secondary: ['computador', 'microsoft', 'planilha', 'documento', 'apresenta��o'],
    weight: 1
  },
  'design-grafico-002': {
    primary: ['design', 'gr�fico', 'photoshop', 'illustrator', 'indesign', 'cria��o', 'visual'],
    secondary: ['adobe', 'arte', 'criativo', 'layout', 'imagem', 'logotipo'],
    weight: 1
  },
  'programacao-web-003': {
    primary: ['programa��o', 'web', 'html', 'css', 'javascript', 'desenvolvimento', 'site'],
    secondary: ['c�digo', 'frontend', 'backend', 'framework', 'api', 'database'],
    weight: 1.2 // Maior peso por ser �rea em alta demanda
  },
  'marketing-digital-004': {
    primary: ['marketing', 'digital', 'redes sociais', 'facebook', 'instagram', 'publicidade'],
    secondary: ['campanha', 'an�ncio', 'vendas', 'cliente', 'convers�o', 'roi'],
    weight: 1.1
  },
  'excel-avancado-005': {
    primary: ['excel', 'planilha', 'f�rmulas', 'gr�ficos', 'macros', 'vba'],
    secondary: ['dados', 'an�lise', 'relat�rio', 'dashboard', 'pivot'],
    weight: 0.9
  },
  'autocad-006': {
    primary: ['autocad', 'desenho', 't�cnico', 'cad', 'projeto', 'arquitetura'],
    secondary: ['planta', 'engenharia', '2d', '3d', 'modelagem'],
    weight: 0.8
  },
  'ingles-007': {
    primary: ['ingl�s', 'english', 'idioma', 'conversa��o', 'business english'],
    secondary: ['language', 'speaking', 'writing', 'listening', 'grammar'],
    weight: 0.7
  },
  'montagem-manutencao-008': {
    primary: ['montagem', 'manuten��o', 'hardware', 'computador', 't�cnico'],
    secondary: ['pe�as', 'reparo', 'processador', 'mem�ria', 'placa'],
    weight: 0.8
  }
};

/**
 * Extrai e normaliza texto para an�lise
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036F]/g, '') // Remove acentos
    .replaceAll(/[^\w\s]/g, ' ') // Remove pontua��o
    .replaceAll(/\s+/g, ' ') // Normaliza espa�os
    .trim();
};

/**
 * Calcula score de relev�ncia entre texto e curso
 */
const calculateRelevanceScore = (text, courseId) => {
  const keywords = COURSE_KEYWORDS[courseId];
  if (!keywords) return 0;

  const normalizedText = normalizeText(text);
  let score = 0;

  // Pontua��o para palavras-chave prim�rias
  for (const keyword of keywords.primary) {
    const normalizedKeyword = normalizeText(keyword);
    const occurrences = (normalizedText.match(new RegExp(normalizedKeyword, 'g')) || []).length;
    score += occurrences * 3; // Peso 3 para palavras prim�rias
  }

  // Pontua��o para palavras-chave secund�rias
  for (const keyword of keywords.secondary) {
    const normalizedKeyword = normalizeText(keyword);
    const occurrences = (normalizedText.match(new RegExp(normalizedKeyword, 'g')) || []).length;
    score += occurrences * 1; // Peso 1 para palavras secund�rias
  }

  // Aplica peso do curso
  score *= keywords.weight;

  return score;
};

/**
 * Analisa conte�do e sugere cursos relevantes
 */
export const suggestCourses = (post, options = {}) => {
  const {
    maxSuggestions = 3,
    minScore = 1,
    includeGeneric = true,
    useCache = true
  } = options;

  // Cria chave de cache
  const cacheKey = `${post?.slug || 'unknown'}_${maxSuggestions}_${minScore}`;
  
  // Verifica cache
  if (useCache && matchingCache.has(cacheKey)) {
    const cached = matchingCache.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
      return cached.data;
    }
    matchingCache.delete(cacheKey);
  }

  if (!post) return [];

  // Constr�i texto para an�lise
  const analysisText = [
    post.title || '',
    post.content || '',
    post.excerpt || '',
    (post.categories || []).map(c => c.name || c).join(' '),
    (post.tags || []).join(' ')
  ].join(' ');

  // Calcula scores para todos os cursos
  const courseScores = [];

  for (const courseId of Object.keys(COURSE_KEYWORDS)) {
    const score = calculateRelevanceScore(analysisText, courseId);
    
    if (score >= minScore) {
      const course = coursesData?.find(c => c.basicInfo.id === courseId);
      if (course) {
        courseScores.push({
          course,
          score,
          relevanceReason: generateRelevanceReason(analysisText, courseId)
        });
      }
    }
  }

  // Ordena por score e pega os melhores
  courseScores.sort((a, b) => b.score - a.score);
  let suggestions = courseScores.slice(0, maxSuggestions);

  // Se n�o h� sugest�es e includeGeneric � true, adiciona curso gen�rico
  if (suggestions.length === 0 && includeGeneric) {
    const genericCourse = coursesData?.[0]; // Primeiro curso como padr�o
    if (genericCourse) {
      suggestions.push({
        course: genericCourse,
        score: 0.5,
        relevanceReason: 'Recomenda��o baseada no perfil geral do conte�do',
        isGeneric: true
      });
    }
  }

  // Cache do resultado
  if (useCache) {
    matchingCache.set(cacheKey, {
      data: suggestions,
      timestamp: Date.now()
    });
  }

  return suggestions;
};

/**
 * Gera explica��o da relev�ncia do curso
 */
const generateRelevanceReason = (text, courseId) => {
  const keywords = COURSE_KEYWORDS[courseId];
  if (!keywords) return 'Curso relacionado ao conte�do';

  const normalizedText = normalizeText(text);
  const matchedKeywords = [];

  // Encontra palavras-chave que deram match
  for (const keyword of keywords.primary) {
    if (normalizedText.includes(normalizeText(keyword))) {
      matchedKeywords.push(keyword);
    }
  }

  if (matchedKeywords.length === 0) {
    for (const keyword of keywords.secondary) {
      if (normalizedText.includes(normalizeText(keyword))) {
        matchedKeywords.push(keyword);
      }
    }
  }

  if (matchedKeywords.length > 0) {
    const keywordList = matchedKeywords.slice(0, 3).join(', ');
    return `Relacionado a: ${keywordList}`;
  }

  return 'Curso complementar ao conte�do';
};

/**
 * Busca curso espec�fico por ID
 */
export const getCourseById = (courseId) => {
  return coursesData?.find(course => course.basicInfo.id === courseId) || null;
};

/**
 * Busca curso por slug
 */
export const getCourseBySlug = (slug) => {
  return coursesData?.find(course => course.basicInfo.slug === slug) || null;
};

/**
 * Busca cursos por categoria
 */
export const getCoursesByCategory = (category) => {
  if (!category) return [];
  
  const normalizedCategory = normalizeText(category);
  return coursesData?.filter(course => 
    normalizeText(course.basicInfo.category).includes(normalizedCategory)
  ) || [];
};

/**
 * Analisa popularidade de cursos (simulado - em produ��o viria do backend)
 */
export const getCoursePopularity = () => {
  // Simula dados de popularidade baseado em caracter�sticas dos cursos
  return {
    'informatica-001': { views: 1500, conversions: 180, trending: true },
    'design-grafico-002': { views: 1200, conversions: 150, trending: false },
    'programacao-web-003': { views: 2000, conversions: 220, trending: true },
    'marketing-digital-004': { views: 1800, conversions: 200, trending: true },
    'excel-avancado-005': { views: 1000, conversions: 120, trending: false },
    'autocad-006': { views: 800, conversions: 90, trending: false },
    'ingles-007': { views: 600, conversions: 70, trending: false },
    'montagem-manutencao-008': { views: 700, conversions: 80, trending: false }
  };
};

/**
 * Aplica filtros avan�ados �s sugest�es
 */
export const filterSuggestions = (suggestions, filters = {}) => {
  const {
    minLevel = null, // 'Iniciante', 'Intermedi�rio', 'Avan�ado'
    maxDuration = null, // em horas
    requireCertificate = false,
    trending = false
  } = filters;

  let filtered = [...suggestions];

  if (minLevel) {
    const levelOrder = { 'Iniciante': 1, 'Intermedi�rio': 2, 'Avan�ado': 3 };
    const minLevelNumber = levelOrder[minLevel] || 1;
    
    filtered = filtered.filter(item => {
      const courseLevel = levelOrder[item.course.basicInfo.level] || 1;
      return courseLevel >= minLevelNumber;
    });
  }

  if (maxDuration) {
    filtered = filtered.filter(item => {
      const duration = parseDuration(item.course.basicInfo.duration);
      return duration <= maxDuration;
    });
  }

  if (requireCertificate) {
    filtered = filtered.filter(item => item.course.basicInfo.certificate);
  }

  if (trending) {
    const popularity = getCoursePopularity();
    filtered = filtered.filter(item => 
      popularity[item.course.basicInfo.id]?.trending
    );
  }

  return filtered;
};

/**
 * Converte string de dura��o para horas
 */
const parseDuration = (durationString) => {
  if (!durationString) return 0;
  
  const match = durationString.match(/(\d+(?:,\d+)?)/);
  if (match) {
    return Number.parseFloat(match[1].replace(',', '.'));
  }
  
  return 0;
};

/**
 * Limpa cache (�til para testes ou reset)
 */
export const clearCache = () => {
  matchingCache.clear();
};

/**
 * Obt�m estat�sticas do cache
 */
export const getCacheStats = () => {
  return {
    size: matchingCache.size,
    keys: [...matchingCache.keys()]
  };
};

export default {
  suggestCourses,
  getCourseById,
  getCourseBySlug,
  getCoursesByCategory,
  getCoursePopularity,
  filterSuggestions,
  clearCache,
  getCacheStats
};