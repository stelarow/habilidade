// Mockdata para validação de UI/UX do Blog
// FEATURE_009_VALIDACAO_UI_BLOG.md - Tarefa 4

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: BlogCategory;
  author: Author;
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  comments: number;
  status: 'draft' | 'published' | 'scheduled';
  tags: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  featured: boolean;
  relatedPosts?: string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  count: number;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface BlogMetrics {
  totalPosts: number;
  totalViews: number;
  avgReadingTime: number;
  mostViewedCategory: string;
  recentActivity: {
    date: string;
    action: string;
    description: string;
  }[];
}

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    name: 'Alessandro Ferreira',
    email: 'alessandro@escolahabilidade.com',
    avatar: '/images/avatars/alessandro.jpg',
    bio: 'Especialista em educação profissional com mais de 10 anos de experiência em design e tecnologia.',
    role: 'Diretor Acadêmico',
    social: {
      linkedin: 'https://linkedin.com/in/alessandro-ferreira',
      instagram: 'https://instagram.com/alessandro_educa'
    }
  },
  {
    id: 'author-2',
    name: 'Mariana Silva',
    email: 'mariana@escolahabilidade.com',
    avatar: '/images/avatars/mariana.jpg',
    bio: 'Designer gráfica e educadora, especialista em metodologias ativas de aprendizagem.',
    role: 'Coordenadora de Design',
    social: {
      linkedin: 'https://linkedin.com/in/mariana-silva',
      twitter: 'https://twitter.com/mari_design'
    }
  },
  {
    id: 'author-3',
    name: 'Carlos Oliveira',
    email: 'carlos@escolahabilidade.com',
    avatar: '/images/avatars/carlos.jpg',
    bio: 'Desenvolvedor full-stack e instrutor de programação com paixão por ensinar tecnologia.',
    role: 'Instrutor de Tecnologia',
    social: {
      linkedin: 'https://linkedin.com/in/carlos-oliveira-dev',
      twitter: 'https://twitter.com/carlos_codes'
    }
  }
];

// Mock Categories
export const mockCategories: BlogCategory[] = [
  {
    id: 'design-grafico',
    name: 'Design Gráfico',
    slug: 'design-grafico',
    description: 'Artigos sobre design, criatividade e ferramentas visuais',
    color: '#FF6B6B',
    count: 12
  },
  {
    id: 'marketing-digital',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    description: 'Estratégias e tendências em marketing online',
    color: '#4ECDC4',
    count: 8
  },
  {
    id: 'desenvolvimento',
    name: 'Desenvolvimento',
    slug: 'desenvolvimento',
    description: 'Programação, tecnologia e desenvolvimento de software',
    color: '#45B7D1',
    count: 15
  },
  {
    id: 'empreendedorismo',
    name: 'Empreendedorismo',
    slug: 'empreendedorismo',
    description: 'Dicas para empreendedores e gestão de negócios',
    color: '#96CEB4',
    count: 6
  },
  {
    id: 'produtividade',
    name: 'Produtividade',
    slug: 'produtividade',
    description: 'Métodos e ferramentas para aumentar a produtividade',
    color: '#FECA57',
    count: 9
  }
];

// Mock Posts
export const mockPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'As 10 Tendências de Design Gráfico para 2024',
    slug: 'tendencias-design-grafico-2024',
    excerpt: 'Descubra as principais tendências que estão moldando o design gráfico em 2024 e como aplicá-las em seus projetos.',
    content: `
      <h2>Introdução</h2>
      <p>O design gráfico está em constante evolução, e 2024 trouxe tendências fascinantes que estão redefinindo a forma como criamos e comunicamos visualmente.</p>
      
      <h2>1. Minimalismo Expressivo</h2>
      <p>O minimalismo continua forte, mas agora com um toque mais expressivo e emocional...</p>
      
      <h2>2. Cores Vibrantes e Gradientes</h2>
      <p>Paletas de cores ousadas e gradientes dinâmicos estão dominando o cenário...</p>
    `,
    image: '/images/blog/design-trends-2024.jpg',
    category: mockCategories[0],
    author: mockAuthors[1],
    publishedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    views: 1247,
    likes: 89,
    comments: 23,
    status: 'published',
    tags: ['design', 'tendências', 'cores', 'tipografia'],
    seo: {
      title: 'Tendências de Design Gráfico 2024 | Escola Habilidade',
      description: 'Conheça as 10 principais tendências de design gráfico para 2024 e mantenha-se atualizado no mercado criativo.',
      keywords: ['design gráfico', 'tendências 2024', 'cores', 'tipografia', 'minimalismo']
    },
    featured: true,
    relatedPosts: ['post-2', 'post-3']
  },
  {
    id: 'post-2',
    title: 'Como Criar uma Estratégia de Marketing Digital Eficaz',
    slug: 'estrategia-marketing-digital-eficaz',
    excerpt: 'Passo a passo completo para desenvolver uma estratégia de marketing digital que realmente converte.',
    content: `
      <h2>Planejamento Estratégico</h2>
      <p>Uma estratégia de marketing digital eficaz começa com um planejamento sólido...</p>
      
      <h2>Definindo seu Público-Alvo</h2>
      <p>Conhecer profundamente seu público é fundamental para o sucesso...</p>
    `,
    image: '/images/blog/marketing-strategy.jpg',
    category: mockCategories[1],
    author: mockAuthors[0],
    publishedAt: '2024-01-12T14:30:00Z',
    readingTime: 12,
    views: 892,
    likes: 67,
    comments: 18,
    status: 'published',
    tags: ['marketing', 'estratégia', 'digital', 'conversão'],
    seo: {
      title: 'Estratégia de Marketing Digital Eficaz | Guia Completo',
      description: 'Aprenda a criar uma estratégia de marketing digital que converte com nosso guia passo a passo.',
      keywords: ['marketing digital', 'estratégia', 'conversão', 'público-alvo', 'ROI']
    },
    featured: false,
    relatedPosts: ['post-1', 'post-4']
  },
  {
    id: 'post-3',
    title: 'JavaScript ES2024: Novidades e Recursos Avançados',
    slug: 'javascript-es2024-novidades',
    excerpt: 'Explore as mais recentes funcionalidades do JavaScript ES2024 e como elas podem melhorar seu código.',
    content: `
      <h2>Novos Recursos do ES2024</h2>
      <p>O JavaScript continua evoluindo rapidamente, e o ES2024 trouxe recursos incríveis...</p>
      
      <h2>Array Grouping</h2>
      <p>Uma das funcionalidades mais aguardadas finalmente chegou...</p>
    `,
    image: '/images/blog/javascript-es2024.jpg',
    category: mockCategories[2],
    author: mockAuthors[2],
    publishedAt: '2024-01-10T09:15:00Z',
    readingTime: 15,
    views: 1456,
    likes: 123,
    comments: 34,
    status: 'published',
    tags: ['javascript', 'es2024', 'programação', 'web development'],
    seo: {
      title: 'JavaScript ES2024: Guia Completo das Novidades',
      description: 'Descubra todos os novos recursos do JavaScript ES2024 com exemplos práticos e aplicações reais.',
      keywords: ['javascript', 'es2024', 'programação', 'desenvolvimento web', 'novidades']
    },
    featured: true,
    relatedPosts: ['post-5', 'post-6']
  },
  {
    id: 'post-4',
    title: 'Empreendedorismo Digital: Como Começar do Zero',
    slug: 'empreendedorismo-digital-como-comecar',
    excerpt: 'Guia prático para quem quer começar no empreendedorismo digital sem experiência prévia.',
    content: `
      <h2>Primeiros Passos</h2>
      <p>Começar no empreendedorismo digital pode parecer intimidador, mas com a abordagem certa...</p>
    `,
    image: '/images/blog/empreendedorismo-digital.jpg',
    category: mockCategories[3],
    author: mockAuthors[0],
    publishedAt: '2024-01-08T16:45:00Z',
    readingTime: 10,
    views: 634,
    likes: 45,
    comments: 12,
    status: 'published',
    tags: ['empreendedorismo', 'digital', 'startup', 'negócios'],
    seo: {
      title: 'Empreendedorismo Digital: Guia Completo para Iniciantes',
      description: 'Aprenda como começar no empreendedorismo digital do zero com dicas práticas e estratégias comprovadas.',
      keywords: ['empreendedorismo digital', 'startup', 'negócios online', 'como começar']
    },
    featured: false
  },
  {
    id: 'post-5',
    title: '10 Técnicas de Produtividade para Desenvolvedores',
    slug: 'tecnicas-produtividade-desenvolvedores',
    excerpt: 'Aumente sua eficiência e qualidade de código com essas técnicas comprovadas de produtividade.',
    content: `
      <h2>Gestão de Tempo</h2>
      <p>A gestão eficaz do tempo é crucial para desenvolvedores...</p>
    `,
    image: '/images/blog/produtividade-dev.jpg',
    category: mockCategories[4],
    author: mockAuthors[2],
    publishedAt: '2024-01-05T11:20:00Z',
    readingTime: 7,
    views: 789,
    likes: 56,
    comments: 19,
    status: 'published',
    tags: ['produtividade', 'desenvolvimento', 'técnicas', 'eficiência'],
    seo: {
      title: 'Técnicas de Produtividade para Desenvolvedores',
      description: 'Descubra 10 técnicas essenciais para aumentar sua produtividade como desenvolvedor.',
      keywords: ['produtividade', 'desenvolvedores', 'técnicas', 'eficiência', 'gestão tempo']
    },
    featured: false
  },
  {
    id: 'post-6',
    title: 'UX/UI Design: Princípios Fundamentais para Iniciantes',
    slug: 'ux-ui-design-principios-fundamentais',
    excerpt: 'Aprenda os princípios básicos de UX/UI Design e como aplicá-los em seus projetos.',
    content: `
      <h2>O que é UX/UI Design?</h2>
      <p>UX/UI Design são disciplinas complementares que focam na experiência do usuário...</p>
    `,
    image: '/images/blog/ux-ui-fundamentals.jpg',
    category: mockCategories[0],
    author: mockAuthors[1],
    publishedAt: '2024-01-03T13:10:00Z',
    readingTime: 11,
    views: 1023,
    likes: 78,
    comments: 25,
    status: 'published',
    tags: ['ux', 'ui', 'design', 'experiência usuário'],
    seo: {
      title: 'UX/UI Design: Guia Completo para Iniciantes',
      description: 'Aprenda os princípios fundamentais de UX/UI Design com exemplos práticos e dicas de profissionais.',
      keywords: ['ux design', 'ui design', 'experiência usuário', 'interface', 'usabilidade']
    },
    featured: true
  }
];

// Utility Functions
export function getPostsByCategory(categorySlug: string): BlogPost[] {
  return mockPosts.filter(post => post.category.slug === categorySlug);
}

export function getFeaturedPosts(): BlogPost[] {
  return mockPosts.filter(post => post.featured);
}

export function getPopularPosts(limit: number = 5): BlogPost[] {
  return [...mockPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getRecentPosts(limit: number = 5): BlogPost[] {
  return [...mockPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function searchPosts(query: string): BlogPost[] {
  const searchTerm = query.toLowerCase();
  return mockPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.category.name.toLowerCase().includes(searchTerm)
  );
}

export function getRelatedPosts(postId: string, limit: number = 3): BlogPost[] {
  const currentPost = mockPosts.find(post => post.id === postId);
  if (!currentPost) return [];

  // Get posts from same category
  const relatedPosts = mockPosts.filter(post => 
    post.id !== postId && 
    post.category.id === currentPost.category.id
  );

  // If not enough posts in same category, add posts with similar tags
  if (relatedPosts.length < limit) {
    const tagMatches = mockPosts.filter(post => 
      post.id !== postId &&
      post.category.id !== currentPost.category.id &&
      post.tags.some(tag => currentPost.tags.includes(tag))
    );
    relatedPosts.push(...tagMatches);
  }

  return relatedPosts.slice(0, limit);
}

// Mock Metrics
export const mockMetrics: BlogMetrics = {
  totalPosts: mockPosts.length,
  totalViews: mockPosts.reduce((sum, post) => sum + post.views, 0),
  avgReadingTime: Math.round(mockPosts.reduce((sum, post) => sum + post.readingTime, 0) / mockPosts.length),
  mostViewedCategory: 'Desenvolvimento',
  recentActivity: [
    {
      date: '2024-01-15T10:00:00Z',
      action: 'publish',
      description: 'Novo artigo publicado: "Tendências de Design Gráfico 2024"'
    },
    {
      date: '2024-01-12T14:30:00Z',
      action: 'publish',
      description: 'Novo artigo publicado: "Estratégia de Marketing Digital"'
    },
    {
      date: '2024-01-10T09:15:00Z',
      action: 'publish',
      description: 'Novo artigo publicado: "JavaScript ES2024"'
    }
  ]
};