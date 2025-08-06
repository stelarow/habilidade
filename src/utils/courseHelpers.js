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
    console.warn('🔧 Dados do curso inválidos:', courseData?.basicInfo?.slug || 'unknown');
    console.warn('📋 Erros encontrados:', validation.errors);
    console.warn('⚠️ Campos obrigatórios faltando:', validation.errors?.filter(err => err.includes('required')) || []);
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
  
  // URL base do site
  const baseUrl = 'https://stelarow.github.io/habilidade';
  const courseUrl = `${baseUrl}/cursos/${safeCourse.basicInfo.slug}`;
  
  // Valores padrão para dados ausentes
  const defaultInvestment = {
    currentPrice: 597,
    originalPrice: 997,
    installments: { max: 12, value: 59.70 }
  };
  
  const defaultInstructor = {
    name: 'Instrutores Especializados da Escola Habilidade',
    bio: 'Professores qualificados com experiência de mercado e formação técnica especializada.'
  };
  
  // Usa dados do curso ou valores padrão
  // Se investment não existe ou tem currentPrice 0, usa valores padrão
  const investment = (safeCourse.investment && safeCourse.investment.currentPrice > 0) 
    ? safeCourse.investment 
    : defaultInvestment;
    
  const instructor = safeCourse.instructor || defaultInstructor;
  
  // Calcula rating médio dos depoimentos
  const calculateAverageRating = () => {
    if (!safeCourse.testimonials || safeCourse.testimonials.length === 0) {
      return 4.8; // Rating padrão alto
    }
    
    const totalRating = safeCourse.testimonials.reduce((sum, testimonial) => {
      return sum + (testimonial.rating || 5);
    }, 0);
    
    return Math.round((totalRating / safeCourse.testimonials.length) * 10) / 10;
  };

  // Extrai habilidades do que será aprendido
  const teaches = safeCourse.whatYouWillLearn?.slice(0, 5) || [
    'Habilidades técnicas profissionais',
    'Competências de mercado',
    'Certificação profissional'
  ];

  return {
    title: safeCourse.seoMeta.title,
    description: safeCourse.seoMeta.description,
    keywords: safeCourse.seoMeta.keywords.join(', '),
    openGraph: {
      title: safeCourse.seoMeta.title,
      description: safeCourse.seoMeta.description,
      type: safeCourse.seoMeta.ogType,
      image: safeCourse.seoMeta.ogImage,
      url: courseUrl,
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
      'url': courseUrl,
      'image': safeCourse.seoMeta.ogImage,
      'provider': {
        '@type': 'EducationalOrganization',
        'name': 'Escola Habilidade',
        'url': baseUrl,
        'sameAs': baseUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'BR',
          'addressLocality': 'Brasil'
        }
      },
      'courseMode': ['https://schema.org/OnlineEventAttendanceMode', 'https://schema.org/OfflineEventAttendanceMode'],
      'educationalLevel': safeCourse.basicInfo.level,
      'inLanguage': 'pt-BR',
      'learningResourceType': 'Course',
      'teaches': teaches,
      'timeRequired': safeCourse.basicInfo.duration,
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': ['https://schema.org/OnlineEventAttendanceMode', 'https://schema.org/OfflineEventAttendanceMode'],
        'courseWorkload': 'PT40H',
        'courseSchedule': {
          '@type': 'Schedule',
          'duration': safeCourse.basicInfo.duration,
          'repeatFrequency': 'ongoing',
          'scheduleTimezone': 'America/Sao_Paulo'
        },
        'instructor': {
          '@type': 'Person',
          'name': instructor.name,
          'description': instructor.bio
        },
        'location': {
          '@type': 'Place',
          'name': 'Escola Habilidade',
          'address': {
            '@type': 'PostalAddress',
            'addressCountry': 'BR',
            'addressLocality': 'Brasil'
          }
        }
      },
      'offers': {
        '@type': 'Offer',
        'price': investment.currentPrice,
        'priceCurrency': 'BRL',
        'availability': 'https://schema.org/InStock',
        'validFrom': '2025-01-01',
        'priceValidUntil': '2025-12-31',
        'url': courseUrl,
        'category': 'EducationalOccupationalCredential',
        'seller': {
          '@type': 'EducationalOrganization',
          'name': 'Escola Habilidade',
          'url': baseUrl
        }
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': calculateAverageRating(),
        'reviewCount': safeCourse.testimonials?.length || 50,
        'bestRating': 5,
        'worstRating': 1
      },
      'review': safeCourse.testimonials?.slice(0, 3).map((testimonial, index) => ({
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': testimonial.rating || 5,
          'bestRating': 5,
          'worstRating': 1
        },
        'author': {
          '@type': 'Person',
          'name': testimonial.name || `Aluno ${index + 1}`
        },
        'reviewBody': testimonial.text || 'Excelente curso, recomendo!'
      })) || []
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
    
    // Busca nos campos básicos
    const basicMatch = (
      title.toLowerCase().includes(term) ||
      shortDescription.toLowerCase().includes(term) ||
      category.toLowerCase().includes(term)
    );
    
    // Busca no currículo (módulos e aulas)
    const curriculumMatch = course.curriculum?.some(module => {
      // Busca no título e descrição do módulo
      const moduleMatch = (
        module.title?.toLowerCase().includes(term) ||
        module.description?.toLowerCase().includes(term)
      );
      
      // Busca nas aulas do módulo
      const lessonsMatch = module.lessons?.some(lesson => 
        lesson.title?.toLowerCase().includes(term)
      );
      
      return moduleMatch || lessonsMatch;
    });
    
    return basicMatch || curriculumMatch;
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