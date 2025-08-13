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
 * Mapeia níveis educacionais para valores válidos do Schema.org
 * @param {string} level - Nível do curso
 * @returns {string} - Valor válido para Schema.org
 */
function mapEducationalLevel(level) {
  const levelMap = {
    'Iniciante': 'Beginner',
    'Intermediário': 'Intermediate', 
    'Avançado': 'Advanced'
  };
  return levelMap[level] || 'Beginner';
}

/**
 * Converte duração para formato ISO 8601
 * @param {string} duration - Duração no formato "X horas"
 * @returns {string} - Formato ISO 8601
 */
function formatDurationToISO8601(duration) {
  if (!duration) return 'PT40H';
  
  const hours = duration.match(/(\d+)\s*horas?/i);
  if (hours && hours[1]) {
    return `PT${hours[1]}H`;
  }
  return 'PT40H'; // Fallback
}

/**
 * Gera seções estruturadas de currículo conforme Schema.org
 * @param {Array} curriculum - Array de módulos do currículo
 * @returns {Array} - Array de seções formatadas para Schema.org
 */
function generateSyllabusSections(curriculum) {
  if (!curriculum || !Array.isArray(curriculum)) {
    return [{
      '@type': 'Syllabus',
      'name': 'Módulo Introdutório',
      'description': 'Conceitos fundamentais e práticas essenciais',
      'timeRequired': 'PT8H'
    }];
  }

  return curriculum.slice(0, 10).map((module, index) => ({
    '@type': 'Syllabus',
    'name': module.title || `Módulo ${index + 1}`,
    'description': module.description || 'Conteúdo especializado do curso',
    'timeRequired': calculateModuleTime(module.lessons)
  }));
}

/**
 * Calcula tempo estimado de um módulo baseado nas aulas
 * @param {Array} lessons - Array de aulas do módulo
 * @returns {string} - Tempo em formato ISO 8601
 */
function calculateModuleTime(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return 'PT4H'; // Fallback
  }
  
  const estimatedHours = Math.max(2, lessons.length * 2);
  return `PT${estimatedHours}H`;
}

/**
 * Mapeia categoria de ofertas para valores válidos do Schema.org
 * @param {number} price - Preço do curso
 * @param {Object} investment - Dados de investimento completos
 * @returns {string} - Categoria válida
 */
function mapOfferCategory(price, investment = {}) {
  if (!price || price === 0) return 'Free';
  
  // Se tem parcelamento, é considerado Paid com facilidades
  if (investment.installments && investment.installments.max > 1) {
    return 'Paid';
  }
  
  return 'Paid';
}

/**
 * Gera metadados do curso para SEO com foco em cursos PRESENCIAIS
 * @param {Object} courseData - Dados do curso
 * @returns {Object} - Metadados estruturados
 */
export function generateCourseMetadata(courseData) {
  const safeCourse = validateAndSanitizeCourse(courseData);
  
  // URL base do site
  const baseUrl = 'https://www.escolahabilidade.com';
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
      'image': [safeCourse.seoMeta.ogImage],
      'provider': {
        '@type': 'Organization',
        'name': 'Escola Habilidade',
        'url': baseUrl,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Florianópolis, SC',
          'addressLocality': 'Florianópolis',
          'addressRegion': 'Santa Catarina',
          'addressCountry': 'BR',
          'postalCode': '88000-000'
        }
      },
      'educationalLevel': mapEducationalLevel(safeCourse.basicInfo.level),
      'inLanguage': 'pt-BR',
      'teaches': teaches,
      'about': [safeCourse.basicInfo.category, 'Formação Profissional', 'Educação Técnica'],
      'timeRequired': formatDurationToISO8601(safeCourse.basicInfo.duration),
      'datePublished': new Date().toISOString().split('T')[0],
      'financialAidEligible': 'Parcelamento disponível em até 12x sem juros',
      'hasCourseInstance': [{
        '@type': 'CourseInstance',
        'courseMode': 'Onsite',
        'courseWorkload': formatDurationToISO8601(safeCourse.basicInfo.duration),
        'courseSchedule': {
          '@type': 'Schedule',
          'duration': 'PT3H',
          'repeatCount': 12,
          'repeatFrequency': 'Weekly',
          'startDate': new Date().toISOString().split('T')[0],
          'endDate': new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        'instructor': [{
          '@type': 'Person',
          'name': instructor.name,
          'description': instructor.bio || 'Professor especializado com experiência de mercado'
        }],
        'location': {
          '@type': 'Place',
          'name': 'Escola Habilidade',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Florianópolis',
            'addressRegion': 'SC',
            'addressCountry': 'BR'
          }
        }
      }],
      'offers': [{
        '@type': 'Offer',
        'category': mapOfferCategory(investment.currentPrice, investment),
        'price': investment.currentPrice,
        'priceCurrency': 'BRL',
        'availability': 'https://schema.org/InStock',
        'validFrom': '2025-01-01',
        'priceValidUntil': '2025-12-31',
        'url': courseUrl,
        'seller': {
          '@type': 'Organization',
          'name': 'Escola Habilidade',
          'url': baseUrl
        }
      }],
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': calculateAverageRating(),
        'reviewCount': safeCourse.testimonials?.length || 50,
        'ratingCount': safeCourse.testimonials?.length || 50,
        'bestRating': 5,
        'worstRating': 1
      },
      'syllabusSections': generateSyllabusSections(safeCourse.curriculum),
      'review': safeCourse.testimonials?.slice(0, 3).map((testimonial, index) => ({
        '@type': 'Review',
        'datePublished': new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
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

/**
 * Valida dados estruturados do curso conforme diretrizes do Google
 * @param {Object} structuredData - Dados estruturados gerados
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[] }
 */
export function validateStructuredData(structuredData) {
  const errors = [];
  const warnings = [];

  try {
    // Validações obrigatórias para Course
    const requiredCourseFields = [
      'name', 'description', 'provider', 'offers', 'hasCourseInstance'
    ];

    requiredCourseFields.forEach(field => {
      if (!structuredData[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });

    // Validar provider
    if (structuredData.provider) {
      if (!structuredData.provider.name) {
        errors.push('provider.name é obrigatório');
      }
      if (structuredData.provider['@type'] !== 'Organization') {
        errors.push('provider deve ter @type "Organization"');
      }
    }

    // Validar offers
    if (structuredData.offers && Array.isArray(structuredData.offers)) {
      structuredData.offers.forEach((offer, index) => {
        if (!offer.category) {
          errors.push(`offers[${index}].category é obrigatório`);
        }
        if (!['Free', 'Paid', 'Subscription', 'Partially Free'].includes(offer.category)) {
          errors.push(`offers[${index}].category deve ser Free, Paid, Subscription ou Partially Free`);
        }
      });
    }

    // Validar hasCourseInstance
    if (structuredData.hasCourseInstance && Array.isArray(structuredData.hasCourseInstance)) {
      structuredData.hasCourseInstance.forEach((instance, index) => {
        const requiredInstanceFields = ['courseMode'];
        
        requiredInstanceFields.forEach(field => {
          if (!instance[field]) {
            errors.push(`hasCourseInstance[${index}].${field} é obrigatório`);
          }
        });

        // Validar courseMode
        if (instance.courseMode && !['Online', 'Onsite', 'Blended'].includes(instance.courseMode)) {
          errors.push(`hasCourseInstance[${index}].courseMode deve ser Online, Onsite ou Blended`);
        }

        // Validar courseSchedule se presente
        if (instance.courseSchedule) {
          if (!instance.courseSchedule.repeatCount || !instance.courseSchedule.repeatFrequency) {
            warnings.push(`hasCourseInstance[${index}].courseSchedule deve ter repeatCount e repeatFrequency`);
          }
          if (!instance.courseSchedule.duration && !instance.courseWorkload) {
            errors.push(`hasCourseInstance[${index}] deve ter courseSchedule.duration ou courseWorkload`);
          }
        }

        // Validar location para cursos presenciais
        if (instance.courseMode === 'Onsite' && !instance.location) {
          errors.push(`hasCourseInstance[${index}] com courseMode "Onsite" deve ter location`);
        }
        
        if (instance.courseMode === 'Blended' && !instance.location) {
          warnings.push(`hasCourseInstance[${index}] com courseMode "Blended" deveria ter location`);
        }
      });
    }

    // Validar educationalLevel
    if (structuredData.educationalLevel && !['Beginner', 'Intermediate', 'Advanced'].includes(structuredData.educationalLevel)) {
      errors.push('educationalLevel deve ser Beginner, Intermediate ou Advanced');
    }

    // Validar format de duração ISO 8601
    if (structuredData.timeRequired && !structuredData.timeRequired.match(/^PT\d+H$/)) {
      warnings.push('timeRequired deve estar no formato ISO 8601 (ex: PT40H)');
    }

    // Validações de qualidade
    if (structuredData.description && structuredData.description.length > 500) {
      warnings.push('Descrição muito longa (>500 caracteres), pode impactar exibição');
    }

    if (structuredData.description && structuredData.description.length < 240) {
      warnings.push('Descrição muito curta (<240 caracteres), recomendado 240-500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Erro de validação: ${error.message}`],
      warnings: []
    };
  }
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
  validateStructuredData,
}; 