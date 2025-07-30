// Mockdata para validaÃ§Ã£o de UI/UX do Blog
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
    bio: 'Especialista em educaÃ§Ã£o profissional com mais de 10 anos de experiÃªncia em design e tecnologia.',
    role: 'Diretor AcadÃªmico',
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
    bio: 'Designer grÃ¡fica e educadora, especialista em metodologias ativas de aprendizagem.',
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
    bio: 'Desenvolvedor full-stack e instrutor de programaÃ§Ã£o com paixÃ£o por ensinar tecnologia.',
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
    name: 'Design GrÃ¡fico',
    slug: 'design-grafico',
    description: 'Artigos sobre design, criatividade e ferramentas visuais',
    color: '#FF6B6B',
    count: 12
  },
  {
    id: 'marketing-digital',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    description: 'EstratÃ©gias e tendÃªncias em marketing online',
    color: '#4ECDC4',
    count: 8
  },
  {
    id: 'desenvolvimento',
    name: 'Desenvolvimento',
    slug: 'desenvolvimento',
    description: 'ProgramaÃ§Ã£o, tecnologia e desenvolvimento de software',
    color: '#45B7D1',
    count: 15
  },
  {
    id: 'empreendedorismo',
    name: 'Empreendedorismo',
    slug: 'empreendedorismo',
    description: 'Dicas para empreendedores e gestÃ£o de negÃ³cios',
    color: '#96CEB4',
    count: 6
  },
  {
    id: 'produtividade',
    name: 'Produtividade',
    slug: 'produtividade',
    description: 'MÃ©todos e ferramentas para aumentar a produtividade',
    color: '#FECA57',
    count: 9
  }
];

// Mock Posts
export const mockPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'As 10 TendÃªncias de Design GrÃ¡fico para 2024',
    slug: 'tendencias-design-grafico-2024',
    excerpt: 'Descubra as principais tendÃªncias que estÃ£o moldando o design grÃ¡fico em 2024 e como aplicÃ¡-las em seus projetos.',
    content: `
      <h2>IntroduÃ§Ã£o</h2>
      <p>O design grÃ¡fico estÃ¡ em constante evoluÃ§Ã£o, e 2024 trouxe tendÃªncias fascinantes que estÃ£o redefinindo a forma como criamos e comunicamos visualmente.</p>
      
      <h2>1. Minimalismo Expressivo</h2>
      <p>O minimalismo continua forte, mas agora com um toque mais expressivo e emocional...</p>
      
      <h2>2. Cores Vibrantes e Gradientes</h2>
      <p>Paletas de cores ousadas e gradientes dinÃ¢micos estÃ£o dominando o cenÃ¡rio...</p>
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
    tags: ['design', 'tendÃªncias', 'cores', 'tipografia'],
    seo: {
      title: 'TendÃªncias de Design GrÃ¡fico 2024 | Escola Habilidade',
      description: 'ConheÃ§a as 10 principais tendÃªncias de design grÃ¡fico para 2024 e mantenha-se atualizado no mercado criativo.',
      keywords: ['design grÃ¡fico', 'tendÃªncias 2024', 'cores', 'tipografia', 'minimalismo']
    },
    featured: true,
    relatedPosts: ['post-2', 'post-3']
  },
  {
    id: 'post-2',
    title: 'Como Criar uma EstratÃ©gia de Marketing Digital Eficaz',
    slug: 'estrategia-marketing-digital-eficaz',
    excerpt: 'Passo a passo completo para desenvolver uma estratÃ©gia de marketing digital que realmente converte.',
    content: `
      <h2>Planejamento EstratÃ©gico</h2>
      <p>Uma estratÃ©gia de marketing digital eficaz comeÃ§a com um planejamento sÃ³lido...</p>
      
      <h2>Definindo seu PÃºblico-Alvo</h2>
      <p>Conhecer profundamente seu pÃºblico Ã© fundamental para o sucesso...</p>
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
    tags: ['marketing', 'estratÃ©gia', 'digital', 'conversÃ£o'],
    seo: {
      title: 'EstratÃ©gia de Marketing Digital Eficaz | Guia Completo',
      description: 'Aprenda a criar uma estratÃ©gia de marketing digital que converte com nosso guia passo a passo.',
      keywords: ['marketing digital', 'estratÃ©gia', 'conversÃ£o', 'pÃºblico-alvo', 'ROI']
    },
    featured: false,
    relatedPosts: ['post-1', 'post-4']
  },
  {
    id: 'post-3',
    title: 'JavaScript ES2024: Novidades e Recursos AvanÃ§ados',
    slug: 'javascript-es2024-novidades',
    excerpt: 'Explore as mais recentes funcionalidades do JavaScript ES2024 e como elas podem melhorar seu cÃ³digo.',
    content: `
      <h2>Novos Recursos do ES2024</h2>
      <p>O JavaScript continua evoluindo rapidamente, e o ES2024 trouxe recursos incrÃ­veis...</p>
      
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
    tags: ['javascript', 'es2024', 'programaÃ§Ã£o', 'web development'],
    seo: {
      title: 'JavaScript ES2024: Guia Completo das Novidades',
      description: 'Descubra todos os novos recursos do JavaScript ES2024 com exemplos prÃ¡ticos e aplicaÃ§Ãµes reais.',
      keywords: ['javascript', 'es2024', 'programaÃ§Ã£o', 'desenvolvimento web', 'novidades']
    },
    featured: true,
    relatedPosts: ['post-5', 'post-6']
  },
  {
    id: 'post-4',
    title: 'Empreendedorismo Digital: Como ComeÃ§ar do Zero',
    slug: 'empreendedorismo-digital-como-comecar',
    excerpt: 'Guia prÃ¡tico para quem quer comeÃ§ar no empreendedorismo digital sem experiÃªncia prÃ©via.',
    content: `
      <h2>Primeiros Passos</h2>
      <p>ComeÃ§ar no empreendedorismo digital pode parecer intimidador, mas com a abordagem certa...</p>
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
    tags: ['empreendedorismo', 'digital', 'startup', 'negÃ³cios'],
    seo: {
      title: 'Empreendedorismo Digital: Guia Completo para Iniciantes',
      description: 'Aprenda como comeÃ§ar no empreendedorismo digital do zero com dicas prÃ¡ticas e estratÃ©gias comprovadas.',
      keywords: ['empreendedorismo digital', 'startup', 'negÃ³cios online', 'como comeÃ§ar']
    },
    featured: false
  },
  {
    id: 'post-5',
    title: '10 TÃ©cnicas de Produtividade para Desenvolvedores',
    slug: 'tecnicas-produtividade-desenvolvedores',
    excerpt: 'Aumente sua eficiÃªncia e qualidade de cÃ³digo com essas tÃ©cnicas comprovadas de produtividade.',
    content: `
      <h2>GestÃ£o de Tempo</h2>
      <p>A gestÃ£o eficaz do tempo Ã© crucial para desenvolvedores...</p>
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
    tags: ['produtividade', 'desenvolvimento', 'tÃ©cnicas', 'eficiÃªncia'],
    seo: {
      title: 'TÃ©cnicas de Produtividade para Desenvolvedores',
      description: 'Descubra 10 tÃ©cnicas essenciais para aumentar sua produtividade como desenvolvedor.',
      keywords: ['produtividade', 'desenvolvedores', 'tÃ©cnicas', 'eficiÃªncia', 'gestÃ£o tempo']
    },
    featured: false
  },
  {
    id: 'post-6',
    title: 'UX/UI Design: PrincÃ­pios Fundamentais para Iniciantes',
    slug: 'ux-ui-design-principios-fundamentais',
    excerpt: 'Aprenda os princÃ­pios bÃ¡sicos de UX/UI Design e como aplicÃ¡-los em seus projetos.',
    content: `
      <h2>O que Ã© UX/UI Design?</h2>
      <p>UX/UI Design sÃ£o disciplinas complementares que focam na experiÃªncia do usuÃ¡rio...</p>
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
    tags: ['ux', 'ui', 'design', 'experiÃªncia usuÃ¡rio'],
    seo: {
      title: 'UX/UI Design: Guia Completo para Iniciantes',
      description: 'Aprenda os princÃ­pios fundamentais de UX/UI Design com exemplos prÃ¡ticos e dicas de profissionais.',
      keywords: ['ux design', 'ui design', 'experiÃªncia usuÃ¡rio', 'interface', 'usabilidade']
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
      description: 'Novo artigo publicado: "TendÃªncias de Design GrÃ¡fico 2024"'
    },
    {
      date: '2024-01-12T14:30:00Z',
      action: 'publish',
      description: 'Novo artigo publicado: "EstratÃ©gia de Marketing Digital"'
    },
    {
      date: '2024-01-10T09:15:00Z',
      action: 'publish',
      description: 'Novo artigo publicado: "JavaScript ES2024"'
    }
  ]
};