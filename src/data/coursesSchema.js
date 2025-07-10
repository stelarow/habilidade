import PropTypes from 'prop-types';

/**
 * Schema de validação para dados de curso
 * Define a estrutura obrigatória e tipos de dados esperados
 */

// Schema para informações básicas do curso
export const CourseBasicInfoSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  longDescription: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  level: PropTypes.oneOf(['Iniciante', 'Intermediário', 'Avançado']).isRequired,
  duration: PropTypes.string.isRequired,
  certificate: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired,
});

// Schema para investimento e formas de pagamento
export const CourseInvestmentSchema = PropTypes.shape({
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  discount: PropTypes.number,
  installments: PropTypes.shape({
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired,
});

// Schema para instrutor
export const InstructorSchema = PropTypes.shape({
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  experience: PropTypes.string.isRequired,
  credentials: PropTypes.arrayOf(PropTypes.string).isRequired,
});

// Schema para módulo do currículo
export const CurriculumModuleSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['video', 'text', 'exercise', 'project']).isRequired,
  })).isRequired,
});

// Schema para depoimento
export const TestimonialSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  result: PropTypes.string,
});

// Schema para FAQ
export const FAQItemSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
});

// Schema para cores temáticas
export const ThemeColorsSchema = PropTypes.shape({
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
  gradient: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }).isRequired,
});

// Schema para meta tags SEO
export const SEOMetaSchema = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  ogImage: PropTypes.string.isRequired,
  ogType: PropTypes.string.isRequired,
});

// Schema completo do curso
export const CourseSchema = PropTypes.shape({
  basicInfo: CourseBasicInfoSchema.isRequired,
  investment: CourseInvestmentSchema.isRequired,
  instructor: InstructorSchema.isRequired,
  curriculum: PropTypes.arrayOf(CurriculumModuleSchema).isRequired,
  whatYouWillLearn: PropTypes.arrayOf(PropTypes.string).isRequired,
  requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
  testimonials: PropTypes.arrayOf(TestimonialSchema).isRequired,
  faq: PropTypes.arrayOf(FAQItemSchema).isRequired,
  themeColors: ThemeColorsSchema.isRequired,
  seoMeta: SEOMetaSchema.isRequired,
});

/**
 * Função para validar estrutura de dados do curso
 * @param {Object} courseData - Dados do curso para validar
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateCourseData(courseData) {
  const errors = [];

  try {
    // Validações básicas
    if (!courseData) {
      errors.push('Dados do curso não fornecidos');
      return { isValid: false, errors };
    }

    // Validar campos obrigatórios
    const requiredFields = [
      'basicInfo', 'investment', 'instructor', 'curriculum',
      'whatYouWillLearn', 'requirements', 'testimonials', 'faq',
      'themeColors', 'seoMeta'
    ];

    requiredFields.forEach(field => {
      if (!courseData[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });

    // Validar basicInfo
    if (courseData.basicInfo) {
      if (!courseData.basicInfo.slug?.match(/^[a-z0-9-]+$/)) {
        errors.push('Slug deve conter apenas letras minúsculas, números e hífens');
      }
    }

    // Validar investment
    if (courseData.investment) {
      if (courseData.investment.currentPrice > courseData.investment.originalPrice) {
        errors.push('Preço atual não pode ser maior que o preço original');
      }
    }

    // Validar curriculum
    if (Array.isArray(courseData.curriculum)) {
      courseData.curriculum.forEach((module, index) => {
        if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
          errors.push(`Módulo ${index + 1} deve ter pelo menos uma aula`);
        }
      });
    }

    // Validar testimonials ratings
    if (Array.isArray(courseData.testimonials)) {
      courseData.testimonials.forEach((testimonial, index) => {
        if (testimonial.rating < 1 || testimonial.rating > 5) {
          errors.push(`Rating do depoimento ${index + 1} deve estar entre 1 e 5`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };

  } catch (error) {
    return {
      isValid: false,
      errors: [`Erro de validação: ${error.message}`]
    };
  }
}

/**
 * Tipos de dados padrão para fallbacks
 */
export const DEFAULT_COURSE_DATA = {
  basicInfo: {
    id: '',
    title: 'Curso não encontrado',
    slug: 'not-found',
    shortDescription: 'Este curso não está disponível',
    longDescription: 'Este curso não está disponível no momento.',
    category: 'Geral',
    level: 'Iniciante',
    duration: '0 horas',
    certificate: false,
    active: false,
  },
  investment: {
    originalPrice: 0,
    currentPrice: 0,
    discount: 0,
    installments: {
      max: 1,
      value: 0,
    },
    paymentMethods: ['Cartão de crédito'],
  },
  instructor: {
    name: 'Instrutor não definido',
    bio: 'Biografia não disponível',
    photo: '/placeholder-instructor.jpg',
    experience: '0 anos',
    credentials: [],
  },
  curriculum: [],
  whatYouWillLearn: [],
  requirements: [],
  testimonials: [],
  faq: [],
  themeColors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    gradient: {
      from: '#3B82F6',
      to: '#8B5CF6',
    },
  },
  seoMeta: {
    title: 'Curso não encontrado - Escola Habilidade',
    description: 'Este curso não está disponível no momento.',
    keywords: ['curso', 'escola habilidade'],
    ogImage: '/og-default.jpg',
    ogType: 'website',
  },
};

export default {
  CourseSchema,
  validateCourseData,
  DEFAULT_COURSE_DATA,
}; 