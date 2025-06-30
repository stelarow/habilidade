import { validateCourseData, DEFAULT_COURSE_DATA } from '../data/coursesSchema.js';

/**
 * Busca um curso pelo slug
 * @param {string} slug - Slug do curso
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Object|null} - Dados do curso ou null se não encontrado
 */
export function getCourseBySlug(slug, coursesData = []) {
  if (!slug || !Array.isArray(coursesData)) {
    return null;
  }

  const course = coursesData.find(course => 
    course?.basicInfo?.slug === slug && course?.basicInfo?.active === true
  );

  return course || null;
}

/**
 * Valida dados do curso e retorna dados seguros para uso
 * @param {Object} courseData - Dados do curso
 * @returns {Object} - Dados validados com fallbacks
 */
export function validateAndSanitizeCourse(courseData) {
  if (!courseData) {
    return DEFAULT_COURSE_DATA;
  }

  const validation = validateCourseData(courseData);
  
  if (!validation.isValid) {
    console.warn('Dados do curso inválidos:', validation.errors);
    return {
      ...DEFAULT_COURSE_DATA,
      ...courseData,
      basicInfo: {
        ...DEFAULT_COURSE_DATA.basicInfo,
        ...courseData.basicInfo,
      }
    };
  }

  return courseData;
}

/**
 * Gera metadados do curso para SEO
 * @param {Object} courseData - Dados do curso
 * @returns {Object} - Metadados estruturados
 */
export function generateCourseMetadata(courseData) {
  const safeCourse = validateAndSanitizeCourse(courseData);
  
  return {
    title: safeCourse.seoMeta.title,
    description: safeCourse.seoMeta.description,
    keywords: safeCourse.seoMeta.keywords.join(', '),
    openGraph: {
      title: safeCourse.seoMeta.title,
      description: safeCourse.seoMeta.description,
      type: safeCourse.seoMeta.ogType,
      image: safeCourse.seoMeta.ogImage,
      url: `/cursos/${safeCourse.basicInfo.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: safeCourse.seoMeta.title,
      description: safeCourse.seoMeta.description,
      image: safeCourse.seoMeta.ogImage,
    },
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': safeCourse.basicInfo.title,
      'description': safeCourse.basicInfo.longDescription,
      'provider': {
        '@type': 'Organization',
        'name': 'Escola Habilidade',
        'sameAs': 'https://escolahabilidade.com.br',
      },
      'courseMode': 'online',
      'educationalLevel': safeCourse.basicInfo.level,
      'timeRequired': safeCourse.basicInfo.duration,
      'offers': {
        '@type': 'Offer',
        'category': 'EducationalOccupationalCredential',
        'price': safeCourse.investment.currentPrice,
        'priceCurrency': 'BRL',
      },
    },
  };
}

/**
 * Gera URL completa do curso
 * @param {string} slug - Slug do curso
 * @param {boolean} absolute - Se deve retornar URL absoluta
 * @returns {string} - URL do curso
 */
export function generateCourseUrl(slug, absolute = false) {
  const relativePath = `/cursos/${slug}`;
  
  if (absolute) {
    return `${window.location.origin}/habilidade${relativePath}`;
  }
  
  return relativePath;
}

/**
 * Obtém lista de cursos ativos
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Array} - Array com cursos ativos
 */
export function getActiveCourses(coursesData = []) {
  if (!Array.isArray(coursesData)) {
    return [];
  }

  return coursesData.filter(course => 
    course?.basicInfo?.active === true
  );
}

/**
 * Obtém cursos por categoria
 * @param {string} category - Categoria dos cursos
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Array} - Array com cursos da categoria
 */
export function getCoursesByCategory(category, coursesData = []) {
  if (!category || !Array.isArray(coursesData)) {
    return [];
  }

  return coursesData.filter(course => 
    course?.basicInfo?.category === category && 
    course?.basicInfo?.active === true
  );
}

/**
 * Obtém estatísticas dos cursos
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Object} - Estatísticas dos cursos
 */
export function getCoursesStats(coursesData = []) {
  if (!Array.isArray(coursesData)) {
    return {
      total: 0,
      active: 0,
      categories: [],
      levels: [],
    };
  }

  const activeCourses = getActiveCourses(coursesData);
  
  const categories = [...new Set(
    activeCourses.map(course => course.basicInfo.category)
  )];
  
  const levels = [...new Set(
    activeCourses.map(course => course.basicInfo.level)
  )];

  return {
    total: coursesData.length,
    active: activeCourses.length,
    categories,
    levels,
  };
}

/**
 * Busca cursos por termo
 * @param {string} searchTerm - Termo de busca
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Array} - Array com cursos que correspondem à busca
 */
export function searchCourses(searchTerm, coursesData = []) {
  if (!searchTerm || !Array.isArray(coursesData)) {
    return [];
  }

  const term = searchTerm.toLowerCase();
  
  return coursesData.filter(course => {
    if (!course?.basicInfo?.active) return false;
    
    const { title, shortDescription, category } = course.basicInfo;
    
    return (
      title.toLowerCase().includes(term) ||
      shortDescription.toLowerCase().includes(term) ||
      category.toLowerCase().includes(term)
    );
  });
}

/**
 * Calcula desconto do curso
 * @param {Object} investment - Dados de investimento do curso
 * @returns {number} - Percentual de desconto
 */
export function calculateDiscount(investment) {
  if (!investment?.originalPrice || !investment?.currentPrice) {
    return 0;
  }

  const { originalPrice, currentPrice } = investment;
  
  if (currentPrice >= originalPrice) {
    return 0;
  }

  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Formata preço em reais
 * @param {number} price - Preço a ser formatado
 * @returns {string} - Preço formatado
 */
export function formatPrice(price) {
  if (typeof price !== 'number') {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

/**
 * Gera breadcrumbs para o curso
 * @param {Object} courseData - Dados do curso
 * @returns {Array} - Array com estrutura de breadcrumbs
 */
export function generateBreadcrumbs(courseData) {
  const safeCourse = validateAndSanitizeCourse(courseData);
  
  return [
    {
      name: 'Início',
      url: '/',
    },
    {
      name: 'Cursos',
      url: '/#courses',
    },
    {
      name: safeCourse.basicInfo.title,
      url: `/cursos/${safeCourse.basicInfo.slug}`,
    },
  ];
}

export default {
  getCourseBySlug,
  validateAndSanitizeCourse,
  generateCourseMetadata,
  generateCourseUrl,
  getActiveCourses,
  getCoursesByCategory,
  getCoursesStats,
  searchCourses,
  calculateDiscount,
  formatPrice,
  generateBreadcrumbs,
}; 