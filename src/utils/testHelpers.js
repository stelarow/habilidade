/**
 * Helpers para testes básicos
 * Contém mocks de dados e utilitários de validação
 */

// Mock de dados básicos de curso para testes
export const MOCK_COURSE_DATA = {
  basicInfo: {
    id: 'test-course-1',
    title: 'Curso de Teste',
    slug: 'curso-teste',
    shortDescription: 'Um curso de teste para validação',
    longDescription: 'Este é um curso de teste usado para validar a estrutura de dados e componentes.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '40 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 497,
    currentPrice: 297,
    discount: 40,
    installments: {
      max: 12,
      value: 29.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX'],
  },
  instructor: {
    name: 'Professor Teste',
    bio: 'Instrutor especializado em testes e validação de sistemas.',
    photo: '/test-instructor.jpg',
    experience: '5 anos',
    credentials: ['Certificação em Testes', 'Especialização em QA'],
  },
  curriculum: [
    {
      id: 1,
      title: 'Módulo 1: Introdução',
      description: 'Introdução aos conceitos básicos',
      lessons: [
        {
          id: 1,
          title: 'Primeira aula',
          duration: '30 min',
          type: 'video',
        },
        {
          id: 2,
          title: 'Exercício prático',
          duration: '15 min',
          type: 'exercise',
        },
      ],
    },
  ],
  whatYouWillLearn: [
    'Conceitos básicos de teste',
    'Validação de dados',
    'Boas práticas de desenvolvimento',
  ],
  requirements: [
    'Conhecimento básico de JavaScript',
    'Computador com acesso à internet',
  ],
  testimonials: [
    {
      id: 1,
      name: 'Maria Silva',
      role: 'Desenvolvedora',
      photo: '/test-student.jpg',
      rating: 5,
      text: 'Excelente curso, muito didático!',
      result: 'Conseguiu emprego na área',
    },
  ],
  faq: [
    {
      id: 1,
      question: 'Este curso tem certificado?',
      answer: 'Sim, ao final do curso você recebe um certificado de conclusão.',
    },
  ],
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
    title: 'Curso de Teste - Escola Habilidade',
    description: 'Aprenda os conceitos fundamentais de teste com nossa metodologia exclusiva.',
    keywords: ['teste', 'curso', 'escola habilidade'],
    ogImage: '/og-curso-teste.jpg',
    ogType: 'website',
  },
};

// Mock de array com múltiplos cursos
export const MOCK_COURSES_ARRAY = [
  MOCK_COURSE_DATA,
  {
    ...MOCK_COURSE_DATA,
    basicInfo: {
      ...MOCK_COURSE_DATA.basicInfo,
      id: 'test-course-2',
      title: 'Segundo Curso de Teste',
      slug: 'segundo-curso-teste',
      category: 'Design',
      level: 'Intermediário',
    },
  },
  {
    ...MOCK_COURSE_DATA,
    basicInfo: {
      ...MOCK_COURSE_DATA.basicInfo,
      id: 'test-course-3',
      title: 'Terceiro Curso de Teste',
      slug: 'terceiro-curso-teste',
      active: false, // Curso inativo para testes
    },
  },
];

/**
 * Valida se um objeto tem a estrutura esperada
 * @param {Object} obj - Objeto a ser validado
 * @param {Array} requiredFields - Campos obrigatórios
 * @returns {Object} - { isValid: boolean, missingFields: string[] }
 */
export function validateObjectStructure(obj, requiredFields) {
  if (!obj || typeof obj !== 'object') {
    return {
      isValid: false,
      missingFields: requiredFields,
    };
  }

  const missingFields = requiredFields.filter(field => {
    const keys = field.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (!current || typeof current !== 'object' || !(key in current)) {
        return true;
      }
      current = current[key];
    }
    
    return false;
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Testa se todas as rotas de cursos estão funcionando
 * @param {Array} courseSlugs - Array com slugs dos cursos
 * @returns {Promise<Object>} - Resultado dos testes de rota
 */
export async function testCourseRoutes(courseSlugs) {
  const results = {
    total: courseSlugs.length,
    passed: 0,
    failed: 0,
    errors: [],
  };

  for (const slug of courseSlugs) {
    try {
      // Simula teste de rota (em um ambiente real, faria fetch ou navegação)
      const routePattern = /^[a-z0-9-]+$/;
      
      if (!routePattern.test(slug)) {
        throw new Error(`Slug inválido: ${slug}`);
      }
      
      results.passed++;
    } catch (error) {
      results.failed++;
      results.errors.push({
        slug,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Valida integridade dos dados de todos os cursos
 * @param {Array} coursesData - Array com dados dos cursos
 * @returns {Object} - Resultado da validação
 */
export function validateCoursesDataIntegrity(coursesData) {
  if (!Array.isArray(coursesData)) {
    return {
      isValid: false,
      errors: ['coursesData deve ser um array'],
    };
  }

  const errors = [];
  const slugs = new Set();
  const ids = new Set();

  coursesData.forEach((course, index) => {
    // Validar estrutura básica
    const requiredFields = [
      'basicInfo.id',
      'basicInfo.title',
      'basicInfo.slug',
      'basicInfo.active',
      'investment.currentPrice',
      'instructor.name',
      'curriculum',
      'themeColors.primary',
    ];

    const validation = validateObjectStructure(course, requiredFields);
    
    if (!validation.isValid) {
      errors.push(`Curso ${index}: campos obrigatórios ausentes: ${validation.missingFields.join(', ')}`);
    }

    // Validar IDs únicos
    if (course?.basicInfo?.id) {
      if (ids.has(course.basicInfo.id)) {
        errors.push(`Curso ${index}: ID duplicado: ${course.basicInfo.id}`);
      }
      ids.add(course.basicInfo.id);
    }

    // Validar slugs únicos
    if (course?.basicInfo?.slug) {
      if (slugs.has(course.basicInfo.slug)) {
        errors.push(`Curso ${index}: Slug duplicado: ${course.basicInfo.slug}`);
      }
      slugs.add(course.basicInfo.slug);
    }

    // Validar preços
    if (course?.investment) {
      const { originalPrice, currentPrice } = course.investment;
      if (currentPrice > originalPrice) {
        errors.push(`Curso ${index}: Preço atual maior que preço original`);
      }
    }

    // Validar currículo
    if (course?.curriculum && Array.isArray(course.curriculum)) {
      course.curriculum.forEach((module, moduleIndex) => {
        if (!module.lessons || !Array.isArray(module.lessons) || module.lessons.length === 0) {
          errors.push(`Curso ${index}, Módulo ${moduleIndex}: deve ter pelo menos uma aula`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      totalCourses: coursesData.length,
      uniqueIds: ids.size,
      uniqueSlugs: slugs.size,
    },
  };
}

/**
 * Simula teste de performance de carregamento
 * @param {Function} loadFunction - Função que carrega os dados
 * @returns {Promise<Object>} - Métricas de performance
 */
export async function testLoadingPerformance(loadFunction) {
  const startTime = performance.now();
  
  try {
    const result = await loadFunction();
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      success: true,
      duration: Math.round(duration),
      result,
      performance: {
        excellent: duration < 100,
        good: duration < 300,
        acceptable: duration < 1000,
        slow: duration >= 1000,
      },
    };
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    return {
      success: false,
      duration: Math.round(duration),
      error: error.message,
    };
  }
}

/**
 * Lista de slugs válidos para testes de rota
 */
export const VALID_COURSE_SLUGS = [
  'projetista-3d',
  'edicao-video',
  'informatica',
  'design-grafico',
  'programacao',
  'marketing-digital',
  'inteligencia-artificial',
  'business-intelligence',
];

/**
 * Executa suite básica de testes
 * @returns {Promise<Object>} - Resultado de todos os testes
 */
export async function runBasicTestSuite() {
  console.log('🧪 Executando suite básica de testes...');

  const results = {
    timestamp: new Date().toISOString(),
    tests: {},
  };

  try {
    // Teste 1: Validação de estrutura de dados
    console.log('📋 Testando estrutura de dados...');
    results.tests.dataStructure = validateCoursesDataIntegrity([MOCK_COURSE_DATA]);

    // Teste 2: Validação de rotas
    console.log('🛣️ Testando rotas...');
    results.tests.routes = await testCourseRoutes(VALID_COURSE_SLUGS);

    // Teste 3: Performance de carregamento
    console.log('⚡ Testando performance...');
    results.tests.performance = await testLoadingPerformance(async () => {
      return new Promise(resolve => {
        setTimeout(() => resolve(MOCK_COURSES_ARRAY), 50);
      });
    });

    // Resumo
    const totalTests = Object.keys(results.tests).length;
    const passedTests = Object.values(results.tests).filter(test => 
      test.isValid !== false && test.success !== false
    ).length;

    results.summary = {
      total: totalTests,
      passed: passedTests,
      failed: totalTests - passedTests,
      success: passedTests === totalTests,
    };

    console.log('✅ Suite de testes concluída:', results.summary);
    
  } catch (error) {
    console.error('❌ Erro ao executar testes:', error);
    results.error = error.message;
  }

  return results;
}

// Mock básico de curso para testes
export const MOCK_COURSE = {
  basicInfo: {
    id: 'test-1',
    title: 'Curso Teste',
    slug: 'curso-teste',
    shortDescription: 'Descrição curta',
    longDescription: 'Descrição longa do curso',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '40h',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 497,
    currentPrice: 297,
    installments: { max: 12, value: 29.70 },
    paymentMethods: ['Cartão de crédito'],
  },
  instructor: {
    name: 'Professor Teste',
    bio: 'Bio do instrutor',
    photo: '/test.jpg',
    experience: '5 anos',
    credentials: ['Certificação'],
  },
  curriculum: [],
  whatYouWillLearn: ['Item 1', 'Item 2'],
  requirements: ['Requisito 1'],
  testimonials: [],
  faq: [],
  themeColors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#06B6D4',
    gradient: { from: '#3B82F6', to: '#8B5CF6' },
  },
  seoMeta: {
    title: 'Título SEO',
    description: 'Descrição SEO',
    keywords: ['palavra1', 'palavra2'],
    ogImage: '/og.jpg',
    ogType: 'website',
  },
};

// Slugs válidos para teste
export const VALID_SLUGS = [
  'projetista-3d',
  'edicao-video',
  'informatica',
  'design-grafico',
  'programacao',
  'marketing-digital',
  'inteligencia-artificial',
  'business-intelligence',
];

export default {
  MOCK_COURSE_DATA,
  MOCK_COURSES_ARRAY,
  VALID_COURSE_SLUGS,
  validateObjectStructure,
  testCourseRoutes,
  validateCoursesDataIntegrity,
  testLoadingPerformance,
  runBasicTestSuite,
  MOCK_COURSE,
  VALID_SLUGS,
}; 