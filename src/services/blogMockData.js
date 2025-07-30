// Temporary mock data for blog functionality
// This will be replaced with actual API calls once endpoints are implemented

const mockCategories = [
  {
    id: 1,
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Artigos sobre tecnologia e inovação',
    postCount: 5,
    color: '#3B82F6'
  },
  {
    id: 2,
    name: 'Educação',
    slug: 'educacao',
    description: 'Conteúdos educacionais e metodologias',
    postCount: 8,
    color: '#10B981'
  },
  {
    id: 3,
    name: 'Carreira',
    slug: 'carreira',
    description: 'Dicas para desenvolvimento profissional',
    postCount: 6,
    color: '#F59E0B'
  },
  {
    id: 4,
    name: 'Programação',
    slug: 'programacao',
    description: 'Tutoriais e conceitos de programação',
    postCount: 12,
    color: '#8B5CF6'
  },
  {
    id: 5,
    name: 'Design',
    slug: 'design',
    description: 'Tendências e técnicas de design',
    postCount: 4,
    color: '#EF4444'
  }
];

const mockPosts = [
  {
    id: 1,
    title: 'Como Começar na Programação em 2024',
    slug: 'como-comecar-programacao-2024',
    excerpt: 'Guia completo para iniciantes que querem entrar no mundo da programação.',
    content: 'A programação é uma das habilidades mais valiosas no mercado atual. Neste guia, você aprenderá os primeiros passos para se tornar um programador.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[3], // Programação
    featuredImage: '/assets/blog/programacao-2024.jpg',
    publishedAt: '2024-01-15T10:00:00.000Z',
    readingTime: 8,
    tags: ['programação', 'iniciantes', 'carreira'],
    views: 1250,
    likes: 89
  },
  {
    id: 2,
    title: 'Design Thinking na Educação Tecnológica',
    slug: 'design-thinking-educacao-tecnologica',
    excerpt: 'Como aplicar metodologias de design para melhorar o aprendizado.',
    content: 'O Design Thinking revoluciona a forma como aprendemos e ensinamos tecnologia, criando experiências mais envolventes e eficazes.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[1], // Educação
    featuredImage: '/assets/blog/design-thinking.jpg',
    publishedAt: '2024-01-10T14:30:00.000Z',
    readingTime: 6,
    tags: ['design thinking', 'educação', 'metodologia'],
    views: 892,
    likes: 67
  },
  {
    id: 3,
    title: 'Tendências Tecnológicas para 2024',
    slug: 'tendencias-tecnologicas-2024',
    excerpt: 'As principais tecnologias que vão dominar o mercado este ano.',
    content: 'Inteligência Artificial, Machine Learning, blockchain e outras tecnologias que estão moldando o futuro digital.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[0], // Tecnologia
    featuredImage: '/assets/blog/tendencias-2024.jpg',
    publishedAt: '2024-01-05T09:15:00.000Z',
    readingTime: 10,
    tags: ['tecnologia', 'tendências', 'futuro'],
    views: 2104,
    likes: 156
  },
  {
    id: 4,
    title: 'Construindo uma Carreira Sólida em Tech',
    slug: 'construindo-carreira-solida-tech',
    excerpt: 'Estratégias essenciais para desenvolver uma carreira de sucesso na área tecnológica.',
    content: 'O mercado de tecnologia oferece inúmeras oportunidades. Saiba como se posicionar e crescer profissionalmente.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[2], // Carreira
    featuredImage: '/assets/blog/carreira-tech.jpg',
    publishedAt: '2023-12-28T16:45:00.000Z',
    readingTime: 7,
    tags: ['carreira', 'tecnologia', 'crescimento'],
    views: 1567,
    likes: 98
  },
  {
    id: 5,
    title: 'Princípios Fundamentais de UX/UI Design',
    slug: 'principios-fundamentais-ux-ui-design',
    excerpt: 'Entenda os conceitos básicos que todo designer deve conhecer.',
    content: 'UX/UI Design vai muito além de fazer interfaces bonitas. Conheça os princípios que criam experiências memoráveis.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[4], // Design
    featuredImage: '/assets/blog/ux-ui-design.jpg',
    publishedAt: '2023-12-20T11:20:00.000Z',
    readingTime: 9,
    tags: ['design', 'ux', 'ui', 'interface'],
    views: 934,
    likes: 72
  },
  {
    id: 6,
    title: 'JavaScript Moderno: ES2024 e Suas Novidades',
    slug: 'javascript-moderno-es2024-novidades',
    excerpt: 'Explore as mais recentes funcionalidades do JavaScript e como usá-las.',
    content: 'O JavaScript continua evoluindo. Descubra as novidades do ES2024 e como elas podem melhorar seu código.',
    author: { name: 'Escola Habilidade', avatar: '/assets/avatars/default.jpg' },
    category: mockCategories[3], // Programação
    featuredImage: '/assets/blog/javascript-es2024.jpg',
    publishedAt: '2023-12-15T13:10:00.000Z',
    readingTime: 12,
    tags: ['javascript', 'es2024', 'programação', 'web'],
    views: 1823,
    likes: 134
  }
];

export { mockCategories, mockPosts };
export default { categories: mockCategories, posts: mockPosts };