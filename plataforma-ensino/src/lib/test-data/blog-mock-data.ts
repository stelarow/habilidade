/**
 * FEATURE_004_TESTE_UI - Blog UI Test Data
 * Mock data library for blog UI testing and validation
 * Created for visual testing purposes only - no real functionality
 */

export interface MockAuthor {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  count: number;
}

export interface MockTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface MockCourse {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  duration: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  thumbnail: string;
}

export interface MockArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
  thumbnail: string;
  author: MockAuthor;
  category: MockCategory;
  tags: MockTag[];
  relatedCourse?: MockCourse;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface MockSearchResult {
  query: string;
  total: number;
  articles: MockArticle[];
  suggestions: string[];
}

// Mock Authors
export const mockAuthors: MockAuthor[] = [
  {
    id: '1',
    name: 'Alessandro Ferreira',
    avatar: '/images/authors/alessandro.jpg',
    bio: 'Fundador da Escola Habilidade, especialista em educação digital e desenvolvimento de habilidades práticas.',
    role: 'Fundador & CEO'
  },
  {
    id: '2',
    name: 'Marina Silva',
    avatar: '/images/authors/marina.jpg',
    bio: 'Coordenadora Pedagógica com 10+ anos de experiência em metodologias ativas de ensino.',
    role: 'Coordenadora Pedagógica'
  },
  {
    id: '3',
    name: 'Carlos Eduardo',
    avatar: '/images/authors/carlos.jpg',
    bio: 'Desenvolvedor Full-Stack e instrutor de tecnologia, especialista em React e Node.js.',
    role: 'Instrutor de Tecnologia'
  },
  {
    id: '4',
    name: 'Juliana Santos',
    avatar: '/images/authors/juliana.jpg',
    bio: 'Designer UX/UI e consultora em transformação digital para pequenas e médias empresas.',
    role: 'Instrutora de Design'
  }
];

// Mock Categories
export const mockCategories: MockCategory[] = [
  {
    id: '1',
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Artigos sobre desenvolvimento web, programação e inovação tecnológica',
    color: '#8b5cf6',
    count: 45
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'Conteúdos sobre UX/UI, design gráfico e experiência do usuário',
    color: '#06b6d4',
    count: 32
  },
  {
    id: '3',
    name: 'Educação',
    slug: 'educacao',
    description: 'Metodologias de ensino, pedagogia digital e aprendizagem online',
    color: '#10b981',
    count: 28
  },
  {
    id: '4',
    name: 'Carreira',
    slug: 'carreira',
    description: 'Desenvolvimento profissional, mercado de trabalho e networking',
    color: '#f59e0b',
    count: 23
  },
  {
    id: '5',
    name: 'Empreendedorismo',
    slug: 'empreendedorismo',
    description: 'Gestão de negócios, startups e desenvolvimento de produtos',
    color: '#ef4444',
    count: 19
  }
];

// Mock Tags
export const mockTags: MockTag[] = [
  { id: '1', name: 'React', slug: 'react', count: 15 },
  { id: '2', name: 'JavaScript', slug: 'javascript', count: 28 },
  { id: '3', name: 'UX Design', slug: 'ux-design', count: 12 },
  { id: '4', name: 'Node.js', slug: 'nodejs', count: 10 },
  { id: '5', name: 'Figma', slug: 'figma', count: 8 },
  { id: '6', name: 'TypeScript', slug: 'typescript', count: 14 },
  { id: '7', name: 'CSS', slug: 'css', count: 20 },
  { id: '8', name: 'Vue.js', slug: 'vuejs', count: 7 },
  { id: '9', name: 'Python', slug: 'python', count: 11 },
  { id: '10', name: 'UI Design', slug: 'ui-design', count: 9 }
];

// Mock Courses
export const mockCourses: MockCourse[] = [
  {
    id: '1',
    name: 'Desenvolvimento Web Completo',
    description: 'Aprenda HTML, CSS, JavaScript e React do zero ao avançado',
    slug: 'desenvolvimento-web-completo',
    price: 497,
    duration: '120 horas',
    level: 'Iniciante',
    thumbnail: '/images/courses/web-dev.jpg'
  },
  {
    id: '2',
    name: 'Design UX/UI Profissional',
    description: 'Domine as ferramentas e metodologias do design digital moderno',
    slug: 'design-ux-ui-profissional',
    price: 397,
    duration: '80 horas',
    level: 'Intermediário',
    thumbnail: '/images/courses/ux-ui.jpg'
  },
  {
    id: '3',
    name: 'Marketing Digital Estratégico',
    description: 'Estratégias completas para crescimento online e vendas digitais',
    slug: 'marketing-digital-estrategico',
    price: 347,
    duration: '60 horas',
    level: 'Iniciante',
    thumbnail: '/images/courses/marketing.jpg'
  }
];

// Mock Articles
export const mockArticles: MockArticle[] = [
  {
    id: '1',
    title: 'Como o React 18 Revolucionou o Desenvolvimento Frontend',
    slug: 'react-18-revolucionou-desenvolvimento-frontend',
    excerpt: 'Descubra as principais novidades do React 18 e como elas impactam o desenvolvimento de aplicações modernas.',
    content: `# Como o React 18 Revolucionou o Desenvolvimento Frontend

O React 18 trouxe mudanças significativas que transformaram a forma como desenvolvemos aplicações web. Neste artigo, vamos explorar as principais novidades e seu impacto no ecossistema frontend.

## Concurrent Features

O React 18 introduziu recursos concurrent que permitem ao React interromper, pausar e retomar o trabalho de renderização. Isso resulta em uma experiência de usuário mais fluida e responsiva.

### Suspense para SSR

O novo Suspense permite carregar componentes de forma assíncrona no servidor, melhorando significativamente a performance inicial da aplicação.`,
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    featured: true,
    readTime: 8,
    views: 1250,
    likes: 87,
    thumbnail: '/images/articles/react-18.jpg',
    author: mockAuthors[2],
    category: mockCategories[0],
    tags: [mockTags[0], mockTags[1], mockTags[5]],
    relatedCourse: mockCourses[0],
    seo: {
      metaTitle: 'React 18: Como Revolucionou o Frontend | Escola Habilidade',
      metaDescription: 'Descubra as principais novidades do React 18 e como elas impactam o desenvolvimento de aplicações modernas. Concurrent features, Suspense e muito mais.',
      keywords: ['React 18', 'Frontend', 'JavaScript', 'Desenvolvimento Web', 'Concurrent Features']
    }
  },
  {
    id: '2',
    title: 'Design System: A Base para Produtos Digitais Consistentes',
    slug: 'design-system-produtos-digitais-consistentes',
    excerpt: 'Aprenda como criar e implementar um design system eficaz que acelera o desenvolvimento e garante consistência visual.',
    content: `# Design System: A Base para Produtos Digitais Consistentes

Um design system bem estruturado é fundamental para manter a consistência visual e acelerar o desenvolvimento de produtos digitais.`,
    publishedAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-12T14:30:00Z',
    featured: true,
    readTime: 12,
    views: 980,
    likes: 65,
    thumbnail: '/images/articles/design-system.jpg',
    author: mockAuthors[3],
    category: mockCategories[1],
    tags: [mockTags[2], mockTags[9], mockTags[4]],
    relatedCourse: mockCourses[1],
    seo: {
      metaTitle: 'Design System: Guia Completo para Produtos Consistentes',
      metaDescription: 'Aprenda como criar e implementar um design system eficaz que acelera o desenvolvimento e garante consistência visual em produtos digitais.',
      keywords: ['Design System', 'UX Design', 'UI Design', 'Consistência', 'Componentes']
    }
  },
  {
    id: '3',
    title: 'Metodologias Ativas: Transformando a Educação Digital',
    slug: 'metodologias-ativas-educacao-digital',
    excerpt: 'Descubra como as metodologias ativas estão revolucionando o ensino online e engajando mais os estudantes.',
    content: `# Metodologias Ativas: Transformando a Educação Digital

As metodologias ativas representam uma mudança fundamental na forma como ensinamos e aprendemos, especialmente no ambiente digital.`,
    publishedAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-10T09:15:00Z',
    featured: false,
    readTime: 10,
    views: 750,
    likes: 42,
    thumbnail: '/images/articles/metodologias-ativas.jpg',
    author: mockAuthors[1],
    category: mockCategories[2],
    tags: [mockTags[0], mockTags[1]],
    seo: {
      metaTitle: 'Metodologias Ativas na Educação Digital | Escola Habilidade',
      metaDescription: 'Descubra como as metodologias ativas estão revolucionando o ensino online e engajando mais os estudantes. PBL, sala invertida e gamificação.',
      keywords: ['Metodologias Ativas', 'Educação Digital', 'PBL', 'Gamificação', 'Ensino Online']
    }
  }
];

// Helper Functions
export function getArticlesByCategory(categorySlug: string): MockArticle[] {
  return mockArticles.filter(article => article.category.slug === categorySlug);
}

export function getArticlesByTag(tagSlug: string): MockArticle[] {
  return mockArticles.filter(article => 
    article.tags.some(tag => tag.slug === tagSlug)
  );
}

export function getFeaturedArticles(): MockArticle[] {
  return mockArticles.filter(article => article.featured);
}

export function getRecentArticles(limit: number = 5): MockArticle[] {
  return mockArticles
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function searchArticles(query: string): MockSearchResult {
  const lowercaseQuery = query.toLowerCase();
  const results = mockArticles.filter(article =>
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.excerpt.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery) ||
    article.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery)) ||
    article.category.name.toLowerCase().includes(lowercaseQuery)
  );

  const suggestions = mockTags
    .filter(tag => tag.name.toLowerCase().includes(lowercaseQuery))
    .slice(0, 5)
    .map(tag => tag.name);

  return {
    query,
    total: results.length,
    articles: results,
    suggestions
  };
}

export function getArticleBySlug(slug: string): MockArticle | undefined {
  return mockArticles.find(article => article.slug === slug);
}

export function getRelatedArticles(article: MockArticle, limit: number = 3): MockArticle[] {
  return mockArticles
    .filter(a => a.id !== article.id)
    .filter(a => 
      a.category.id === article.category.id ||
      a.tags.some(tag => article.tags.some(articleTag => articleTag.id === tag.id))
    )
    .slice(0, limit);
}

export function generatePaginatedArticles(page: number, perPage: number = 9): {
  articles: MockArticle[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const articles = mockArticles.slice(start, end);
  const total = mockArticles.length;
  const totalPages = Math.ceil(total / perPage);

  return {
    articles,
    pagination: {
      page,
      perPage,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

export default {
  mockAuthors,
  mockCategories,
  mockTags,
  mockCourses,
  mockArticles,
  getArticlesByCategory,
  getArticlesByTag,
  getFeaturedArticles,
  getRecentArticles,
  searchArticles,
  getArticleBySlug,
  getRelatedArticles,
  generatePaginatedArticles
};