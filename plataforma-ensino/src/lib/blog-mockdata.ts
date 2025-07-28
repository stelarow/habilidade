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
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  description: string;
  count: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  content: string;
  publishedAt: string;
  likes: number;
}

export interface BlogMetrics {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  avgReadingTime: number;
  topCategories: { category: string; count: number }[];
  recentActivity: {
    date: string;
    posts: number;
    views: number;
  }[];
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  price: number;
  duration: string;
}

// Dados Mockados
export const mockCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Design Gráfico',
    slug: 'design-grafico',
    color: '#d400ff',
    description: 'Artigos sobre design gráfico, criatividade e ferramentas',
    count: 15
  },
  {
    id: '2',
    name: 'Marketing Digital',
    slug: 'marketing-digital',
    color: '#00c4ff',
    description: 'Estratégias de marketing digital e redes sociais',
    count: 23
  },
  {
    id: '3',
    name: 'Desenvolvimento Web',
    slug: 'desenvolvimento-web',
    color: '#a000ff',
    description: 'Tutoriais e dicas sobre desenvolvimento web',
    count: 18
  },
  {
    id: '4',
    name: 'Empreendedorismo',
    slug: 'empreendedorismo',
    color: '#ff6b6b',
    description: 'Conteúdo sobre empreendedorismo e negócios',
    count: 12
  },
  {
    id: '5',
    name: 'Produtividade',
    slug: 'produtividade',
    color: '#4ecdc4',
    description: 'Dicas para aumentar a produtividade e organização',
    count: 9
  }
];

export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Designer gráfica especializada em branding e identidade visual',
    socialLinks: {
      twitter: '@anasilva',
      linkedin: 'anasilva',
      instagram: '@anasilva_design'
    }
  },
  {
    id: '2',
    name: 'Carlos Santos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Especialista em marketing digital com 10 anos de experiência',
    socialLinks: {
      twitter: '@carlossantos',
      linkedin: 'carlossantos'
    }
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Desenvolvedora full-stack e instrutora de programação',
    socialLinks: {
      twitter: '@mariaoliveira',
      linkedin: 'mariaoliveira'
    }
  }
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Tendências de Design Gráfico para 2024',
    slug: '10-tendencias-design-grafico-2024',
    excerpt: 'Descubra as principais tendências de design gráfico que dominarão o mercado em 2024 e como aplicá-las em seus projetos.',
    content: `
      <h2>As Principais Tendências de Design para 2024</h2>
      <p>O mundo do design gráfico está em constante evolução, e 2024 promete trazer mudanças significativas na forma como criamos e percebemos o design visual.</p>
      
      <h3>1. Tipografia Experimental</h3>
      <p>A tipografia experimental continuará sendo uma tendência forte, com designers explorando formas únicas de comunicar através das letras.</p>
      
      <h3>2. Cores Vibrantes e Gradientes</h3>
      <p>O uso de cores vibrantes e gradientes complexos está se tornando cada vez mais popular, criando composições visualmente impactantes.</p>
      
      <h3>3. Design Sustentável</h3>
      <p>A consciência ambiental está influenciando o design, com foco em soluções sustentáveis e responsáveis.</p>
    `,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    category: mockCategories[0],
    author: mockAuthors[0],
    publishedAt: '2024-01-15',
    readingTime: 8,
    views: 2543,
    likes: 187,
    comments: 23,
    status: 'published',
    tags: ['design', 'tendências', '2024', 'criatividade'],
    seo: {
      metaTitle: '10 Tendências de Design Gráfico para 2024 | Escola Habilidade',
      metaDescription: 'Descubra as principais tendências de design gráfico que dominarão 2024. Guia completo com exemplos práticos.',
      keywords: ['design gráfico', 'tendências 2024', 'design trends', 'criatividade']
    }
  },
  {
    id: '2',
    title: 'Como Criar uma Estratégia de Marketing Digital Eficaz',
    slug: 'estrategia-marketing-digital-eficaz',
    excerpt: 'Aprenda passo a passo como desenvolver uma estratégia de marketing digital que gera resultados reais para seu negócio.',
    content: `
      <h2>Construindo uma Estratégia de Marketing Digital</h2>
      <p>Uma estratégia bem definida é fundamental para o sucesso no marketing digital.</p>
    `,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    category: mockCategories[1],
    author: mockAuthors[1],
    publishedAt: '2024-01-12',
    readingTime: 12,
    views: 3217,
    likes: 294,
    comments: 41,
    status: 'published',
    tags: ['marketing digital', 'estratégia', 'ROI', 'campanhas'],
    seo: {
      metaTitle: 'Estratégia de Marketing Digital Eficaz | Guia Completo',
      metaDescription: 'Aprenda a criar estratégias de marketing digital que convertem. Metodologia testada e aprovada.',
      keywords: ['marketing digital', 'estratégia', 'conversão', 'ROI']
    }
  },
  {
    id: '3',
    title: 'Introdução ao React: Seu Primeiro Componente',
    slug: 'introducao-react-primeiro-componente',
    excerpt: 'Um guia iniciante para criar seu primeiro componente React, com exemplos práticos e dicas importantes.',
    content: `
      <h2>Começando com React</h2>
      <p>React é uma das bibliotecas JavaScript mais populares para construção de interfaces de usuário.</p>
    `,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category: mockCategories[2],
    author: mockAuthors[2],
    publishedAt: '2024-01-10',
    readingTime: 15,
    views: 1876,
    likes: 156,
    comments: 28,
    status: 'published',
    tags: ['react', 'javascript', 'frontend', 'desenvolvimento'],
    seo: {
      metaTitle: 'Introdução ao React: Primeiro Componente | Tutorial',
      metaDescription: 'Aprenda React do zero com este tutorial prático. Crie seu primeiro componente em minutos.',
      keywords: ['react', 'javascript', 'componente', 'tutorial']
    }
  },
  {
    id: '4',
    title: 'Como Validar sua Ideia de Negócio',
    slug: 'como-validar-ideia-negocio',
    excerpt: 'Descubra métodos práticos para validar sua ideia de negócio antes de investir tempo e dinheiro.',
    content: `
      <h2>Validação de Ideias de Negócio</h2>
      <p>Antes de investir recursos em uma ideia, é crucial validá-la no mercado.</p>
    `,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    category: mockCategories[3],
    author: mockAuthors[1],
    publishedAt: '2024-01-08',
    readingTime: 10,
    views: 2198,
    likes: 203,
    comments: 35,
    status: 'published',
    tags: ['empreendedorismo', 'validação', 'startup', 'negócios'],
    seo: {
      metaTitle: 'Como Validar sua Ideia de Negócio | Guia Prático',
      metaDescription: 'Métodos comprovados para validar ideias de negócio. Evite fracassos e maximize suas chances de sucesso.',
      keywords: ['validação', 'ideia de negócio', 'startup', 'empreendedorismo']
    }
  },
  {
    id: '5',
    title: '7 Técnicas de Produtividade para Freelancers',
    slug: '7-tecnicas-produtividade-freelancers',
    excerpt: 'Técnicas comprovadas para aumentar sua produtividade como freelancer e melhorar a qualidade de vida.',
    content: `
      <h2>Produtividade para Freelancers</h2>
      <p>Trabalhar como freelancer exige disciplina e organização excepcionais.</p>
    `,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=400&fit=crop',
    category: mockCategories[4],
    author: mockAuthors[0],
    publishedAt: '2024-01-05',
    readingTime: 7,
    views: 1543,
    likes: 128,
    comments: 19,
    status: 'published',
    tags: ['produtividade', 'freelancer', 'organização', 'trabalho remoto'],
    seo: {
      metaTitle: '7 Técnicas de Produtividade para Freelancers | Dicas Práticas',
      metaDescription: 'Aumente sua produtividade como freelancer com estas 7 técnicas comprovadas. Melhore sua qualidade de vida.',
      keywords: ['produtividade', 'freelancer', 'organização', 'técnicas']
    }
  },
  {
    id: '6',
    title: 'Design System: Como Criar e Implementar',
    slug: 'design-system-como-criar-implementar',
    excerpt: 'Guia completo para criar e implementar um design system eficaz em seus projetos.',
    content: `
      <h2>O que é um Design System?</h2>
      <p>Um design system é uma coleção de componentes reutilizáveis guiados por padrões claros.</p>
    `,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=400&fit=crop',
    category: mockCategories[0],
    author: mockAuthors[0],
    publishedAt: '2024-01-03',
    readingTime: 20,
    views: 3456,
    likes: 312,
    comments: 67,
    status: 'draft',
    tags: ['design system', 'UI/UX', 'componentes', 'design'],
    seo: {
      metaTitle: 'Design System: Guia Completo | Como Criar e Implementar',
      metaDescription: 'Aprenda a criar design systems eficazes. Guia passo a passo com exemplos práticos.',
      keywords: ['design system', 'UI/UX', 'design', 'componentes']
    }
  }
];

export const mockComments: BlogComment[] = [
  {
    id: '1',
    postId: '1',
    author: 'João Silva',
    content: 'Excelente artigo! As tendências apresentadas são muito relevantes para o mercado atual.',
    publishedAt: '2024-01-16',
    likes: 12
  },
  {
    id: '2',
    postId: '1',
    author: 'Maria Santos',
    content: 'Adorei as dicas sobre tipografia experimental. Já estou aplicando em meus projetos!',
    publishedAt: '2024-01-17',
    likes: 8
  },
  {
    id: '3',
    postId: '2',
    author: 'Pedro Costa',
    content: 'Muito útil! Finalmente entendi como estruturar uma estratégia de marketing digital.',
    publishedAt: '2024-01-13',
    likes: 15
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Design Gráfico Completo',
    slug: 'design-grafico-completo',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
    description: 'Aprenda design gráfico do básico ao avançado',
    price: 197,
    duration: '8 semanas'
  },
  {
    id: '2',
    name: 'Marketing Digital Avançado',
    slug: 'marketing-digital-avancado',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    description: 'Domine as estratégias de marketing digital',
    price: 297,
    duration: '12 semanas'
  },
  {
    id: '3',
    name: 'Desenvolvimento Web Frontend',
    slug: 'desenvolvimento-web-frontend',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
    description: 'Torne-se um desenvolvedor frontend completo',
    price: 397,
    duration: '16 semanas'
  }
];

export const mockMetrics: BlogMetrics = {
  totalPosts: 147,
  totalViews: 125430,
  totalLikes: 8937,
  totalComments: 1256,
  avgReadingTime: 11,
  topCategories: [
    { category: 'Marketing Digital', count: 23 },
    { category: 'Desenvolvimento Web', count: 18 },
    { category: 'Design Gráfico', count: 15 },
    { category: 'Empreendedorismo', count: 12 },
    { category: 'Produtividade', count: 9 }
  ],
  recentActivity: [
    { date: '2024-01-15', posts: 3, views: 1247 },
    { date: '2024-01-14', posts: 1, views: 892 },
    { date: '2024-01-13', posts: 2, views: 1456 },
    { date: '2024-01-12', posts: 1, views: 734 },
    { date: '2024-01-11', posts: 0, views: 623 },
    { date: '2024-01-10', posts: 2, views: 1123 },
    { date: '2024-01-09', posts: 1, views: 856 }
  ]
};

// Funções utilitárias
export const getPostsByCategory = (categorySlug: string): BlogPost[] => {
  return mockPosts.filter(post => post.category.slug === categorySlug);
};

export const getPopularPosts = (limit: number = 5): BlogPost[] => {
  return [...mockPosts]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const getRecentPosts = (limit: number = 5): BlogPost[] => {
  return [...mockPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const searchPosts = (query: string): BlogPost[] => {
  const lowerQuery = query.toLowerCase();
  return mockPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
  return mockPosts
    .filter(post => 
      post.id !== currentPost.id && 
      post.category.id === currentPost.category.id
    )
    .slice(0, limit);
};