/**
 * Course Matching Service - Sistema inteligente de sugestão de cursos
 * Analisa conteúdo de artigos e sugere cursos relevantes automaticamente
 */

import { coursesData } from '../data/coursesData';

// Cache para melhor performance
const matchingCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

/**
 * Configuração de matching de cursos
 */
const COURSE_KEYWORDS = {
  'informatica-001': {
    primary: ['informática', 'office', 'windows', 'excel', 'word', 'powerpoint', 'canva'],
    secondary: ['computador', 'microsoft', 'planilha', 'documento', 'apresentação'],
    weight: 1.0
  },
  'design-grafico-002': {
    primary: ['design', 'gráfico', 'photoshop', 'illustrator', 'indesign', 'criação', 'visual'],
    secondary: ['adobe', 'arte', 'criativo', 'layout', 'imagem', 'logotipo'],
    weight: 1.0
  },
  'programacao-web-003': {
    primary: ['programação', 'web', 'html', 'css', 'javascript', 'desenvolvimento', 'site'],
    secondary: ['código', 'frontend', 'backend', 'framework', 'api', 'database'],
    weight: 1.2 // Maior peso por ser área em alta demanda
  },
  'marketing-digital-004': {
    primary: ['marketing', 'digital', 'redes sociais', 'facebook', 'instagram', 'publicidade'],
    secondary: ['campanha', 'anúncio', 'vendas', 'cliente', 'conversão', 'roi'],
    weight: 1.1
  },
  'excel-avancado-005': {
    primary: ['excel', 'planilha', 'fórmulas', 'gráficos', 'macros', 'vba'],
    secondary: ['dados', 'análise', 'relatório', 'dashboard', 'pivot'],
    weight: 0.9
  },
  'autocad-006': {
    primary: ['autocad', 'desenho', 'técnico', 'cad', 'projeto', 'arquitetura'],
    secondary: ['planta', 'engenharia', '2d', '3d', 'modelagem'],
    weight: 0.8
  },
  'ingles-007': {
    primary: ['inglês', 'english', 'idioma', 'conversação', 'business english'],
    secondary: ['language', 'speaking', 'writing', 'listening', 'grammar'],
    weight: 0.7
  },
  'montagem-manutencao-008': {
    primary: ['montagem', 'manutenção', 'hardware', 'computador', 'técnico'],
    secondary: ['peças', 'reparo', 'processador', 'memória', 'placa'],
    weight: 0.8
  }
};

/**
 * Extrai e normaliza texto para análise
 */
const normalizeText = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, ' ') // Remove pontuação
    .replace(/\s+/g, ' ') // Normaliza espaços
    .trim();
};

/**
 * Calcula score de relevância entre texto e curso
 */
const calculateRelevanceScore = (text, courseId) => {
  const keywords = COURSE_KEYWORDS[courseId];
  if (!keywords) return 0;

  const normalizedText = normalizeText(text);
  let score = 0;

  // Pontuação para palavras-chave primárias
  keywords.primary.forEach(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    const occurrences = (normalizedText.match(new RegExp(normalizedKeyword, 'g')) || []).length;
    score += occurrences * 3; // Peso 3 para palavras primárias
  });

  // Pontuação para palavras-chave secundárias
  keywords.secondary.forEach(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    const occurrences = (normalizedText.match(new RegExp(normalizedKeyword, 'g')) || []).length;
    score += occurrences * 1; // Peso 1 para palavras secundárias
  });

  // Aplica peso do curso
  score *= keywords.weight;

  return score;
};

/**
 * Analisa conteúdo e sugere cursos relevantes
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

  // Constrói texto para análise
  const analysisText = [
    post.title || '',
    post.content || '',
    post.excerpt || '',
    (post.categories || []).map(c => c.name || c).join(' '),
    (post.tags || []).join(' ')
  ].join(' ');

  // Calcula scores para todos os cursos
  const courseScores = [];

  Object.keys(COURSE_KEYWORDS).forEach(courseId => {
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
  });

  // Ordena por score e pega os melhores
  courseScores.sort((a, b) => b.score - a.score);
  let suggestions = courseScores.slice(0, maxSuggestions);

  // Se não há sugestões e includeGeneric é true, adiciona curso genérico
  if (suggestions.length === 0 && includeGeneric) {
    const genericCourse = coursesData?.[0]; // Primeiro curso como padrão
    if (genericCourse) {
      suggestions.push({
        course: genericCourse,
        score: 0.5,
        relevanceReason: 'Recomendação baseada no perfil geral do conteúdo',
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
 * Gera explicação da relevância do curso
 */
const generateRelevanceReason = (text, courseId) => {
  const keywords = COURSE_KEYWORDS[courseId];
  if (!keywords) return 'Curso relacionado ao conteúdo';

  const normalizedText = normalizeText(text);
  const matchedKeywords = [];

  // Encontra palavras-chave que deram match
  keywords.primary.forEach(keyword => {
    if (normalizedText.includes(normalizeText(keyword))) {
      matchedKeywords.push(keyword);
    }
  });

  if (matchedKeywords.length === 0) {
    keywords.secondary.forEach(keyword => {
      if (normalizedText.includes(normalizeText(keyword))) {
        matchedKeywords.push(keyword);
      }
    });
  }

  if (matchedKeywords.length > 0) {
    const keywordList = matchedKeywords.slice(0, 3).join(', ');
    return `Relacionado a: ${keywordList}`;
  }

  return 'Curso complementar ao conteúdo';
};

/**
 * Busca curso específico por ID
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
 * Analisa popularidade de cursos (simulado - em produção viria do backend)
 */
export const getCoursePopularity = () => {
  // Simula dados de popularidade baseado em características dos cursos
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
 * Aplica filtros avançados às sugestões
 */
export const filterSuggestions = (suggestions, filters = {}) => {
  const {
    minLevel = null, // 'Iniciante', 'Intermediário', 'Avançado'
    maxDuration = null, // em horas
    requireCertificate = false,
    trending = false
  } = filters;

  let filtered = [...suggestions];

  if (minLevel) {
    const levelOrder = { 'Iniciante': 1, 'Intermediário': 2, 'Avançado': 3 };
    const minLevelNum = levelOrder[minLevel] || 1;
    
    filtered = filtered.filter(item => {
      const courseLevel = levelOrder[item.course.basicInfo.level] || 1;
      return courseLevel >= minLevelNum;
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
 * Converte string de duração para horas
 */
const parseDuration = (durationStr) => {
  if (!durationStr) return 0;
  
  const match = durationStr.match(/(\d+(?:,\d+)?)/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  
  return 0;
};

/**
 * Limpa cache (útil para testes ou reset)
 */
export const clearCache = () => {
  matchingCache.clear();
};

/**
 * Obtém estatísticas do cache
 */
export const getCacheStats = () => {
  return {
    size: matchingCache.size,
    keys: Array.from(matchingCache.keys())
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