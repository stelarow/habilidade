/**
 * Dados completos dos 8 cursos da Escola Habilidade
 * Cada curso segue o schema definido em coursesSchema.js
 */

// Curso 1: Projetista 3D
const projetista3D = {
  basicInfo: {
    id: 'projetista-3d-001',
    title: 'Projetista 3D',
    slug: 'projetista-3d',
    shortDescription: 'Domine as principais ferramentas de modelagem 3D e criação de projetos profissionais.',
    longDescription: 'Torne-se um especialista em projetos 3D com nosso curso completo. Aprenda desde os fundamentos até técnicas avançadas de modelagem, renderização e animação 3D para arquitetura, design de produto e visualização.',
    category: 'Design & Criação',
    level: 'Intermediário',
    duration: '80 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 897,
    currentPrice: 497,
    discount: 45,
    installments: {
      max: 12,
      value: 49.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Rafael Medeiros',
    bio: 'Arquiteto e Designer 3D com mais de 8 anos de experiência em projetos de arquitetura e visualização. Especialista em AutoCAD, SketchUp, 3ds Max e V-Ray.',
    photo: '/instructors/rafael-medeiros.jpg',
    experience: '8 anos',
    credentials: [
      'Arquiteto e Urbanista - CREA',
      'Especialização em Design 3D',
      'Certificação Autodesk Professional',
      'Mais de 200 projetos executados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos do Design 3D',
      description: 'Introdução aos conceitos básicos de modelagem 3D e suas aplicações',
      lessons: [
        { id: 1, title: 'História e evolução do 3D', duration: '45 min', type: 'video' },
        { id: 2, title: 'Softwares e ferramentas principais', duration: '60 min', type: 'video' },
        { id: 3, title: 'Configuração do ambiente de trabalho', duration: '30 min', type: 'video' },
        { id: 4, title: 'Primeiros modelos 3D', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'AutoCAD Avançado',
      description: 'Domínio completo do AutoCAD para projetos técnicos',
      lessons: [
        { id: 5, title: 'Interface e comandos básicos', duration: '60 min', type: 'video' },
        { id: 6, title: 'Desenho técnico e cotas', duration: '75 min', type: 'video' },
        { id: 7, title: 'Blocos e bibliotecas', duration: '45 min', type: 'video' },
        { id: 8, title: 'Projeto arquitetônico completo', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Dominar AutoCAD, SketchUp e 3ds Max',
    'Criar modelos 3D profissionais',
    'Técnicas avançadas de renderização',
    'Iluminação e materiais realistas',
    'Animações e apresentações 3D',
    'Workflow profissional de projetos',
    'Portfolio de projetos reais'
  ],
  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Placa de vídeo dedicada',
    'Conhecimentos básicos de informática',
    'Interesse em design e arquitetura'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Ana Carolina Santos',
      role: 'Arquiteta',
      photo: '/testimonials/ana-carolina.jpg',
      rating: 5,
      text: 'O curso me transformou em uma profissional completa em 3D. Consegui triplicar minha renda em 6 meses!',
      result: 'Aumento de 300% na renda'
    },
    {
      id: 2,
      name: 'Carlos Eduardo Lima',
      role: 'Designer de Produto',
      photo: '/testimonials/carlos-eduardo.jpg',
      rating: 5,
      text: 'Metodologia incrível! Aprendi em 3 meses o que levaria anos para dominar sozinho.',
      result: 'Contratado em multinacional'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio em 3D?',
      answer: 'Não! O curso foi desenvolvido para iniciantes, começando do zero e evoluindo gradualmente.'
    },
    {
      id: 2,
      question: 'Qual a diferença dos softwares ensinados?',
      answer: 'AutoCAD para desenho técnico, SketchUp para modelagem rápida e 3ds Max para renderização avançada.'
    }
  ],
  themeColors: {
    primary: '#FF6B35',
    secondary: '#F7931E',
    accent: '#FFD23F',
    gradient: {
      from: '#FF6B35',
      to: '#F7931E',
    },
  },
  seoMeta: {
    title: 'Curso Projetista 3D - Escola Habilidade | AutoCAD, SketchUp, 3ds Max',
    description: 'Torne-se um Projetista 3D profissional. Curso completo com AutoCAD, SketchUp e 3ds Max. Certificação inclusa e suporte vitalício.',
    keywords: ['projetista 3d', 'autocad', 'sketchup', '3ds max', 'curso 3d', 'modelagem 3d'],
    ogImage: '/og-images/projetista-3d.jpg',
    ogType: 'website',
  },
};

// Curso 2: Edição de Vídeo
const edicaoVideo = {
  basicInfo: {
    id: 'edicao-video-002',
    title: 'Edição de Vídeo',
    slug: 'edicao-video',
    shortDescription: 'Domine as técnicas profissionais de edição de vídeo e motion graphics.',
    longDescription: 'Aprenda a criar vídeos profissionais do zero ao avançado. Domine Adobe Premiere, After Effects e DaVinci Resolve para se tornar um editor de vídeo completo e requisitado no mercado.',
    category: 'Audiovisual',
    level: 'Intermediário',
    duration: '75 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 797,
    currentPrice: 447,
    discount: 44,
    installments: {
      max: 12,
      value: 44.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Mariana Costa',
    bio: 'Editora de vídeo e motion designer com mais de 10 anos de experiência. Trabalhou para grandes marcas e canais do YouTube com milhões de seguidores.',
    photo: '/instructors/mariana-costa.jpg',
    experience: '10 anos',
    credentials: [
      'Especialista em Adobe Creative Suite',
      'Certificação DaVinci Resolve',
      'Editora oficial do YouTube Creators',
      'Mais de 500 vídeos editados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos da Edição',
      description: 'Base teórica e prática da edição de vídeo',
      lessons: [
        { id: 1, title: 'Linguagem audiovisual', duration: '50 min', type: 'video' },
        { id: 2, title: 'Configuração de projetos', duration: '40 min', type: 'video' },
        { id: 3, title: 'Timeline e organização', duration: '45 min', type: 'video' },
        { id: 4, title: 'Primeira edição prática', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Adobe Premiere Pro',
      description: 'Domínio completo do software líder em edição',
      lessons: [
        { id: 5, title: 'Interface e workspace', duration: '45 min', type: 'video' },
        { id: 6, title: 'Ferramentas de corte', duration: '60 min', type: 'video' },
        { id: 7, title: 'Efeitos e transições', duration: '75 min', type: 'video' },
        { id: 8, title: 'Projeto comercial completo', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Adobe Premiere Pro avançado',
    'After Effects para motion graphics',
    'DaVinci Resolve para colorização',
    'Criação de vinhetas e intro',
    'Efeitos especiais e composição',
    'Workflow profissional',
    'Portfolio de vídeos comerciais'
  ],
  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '16GB de RAM (mínimo 8GB)',
    'Placa de vídeo dedicada',
    'SSD com 50GB livres',
    'Conhecimentos básicos de informática'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Pedro Henrique Silva',
      role: 'YouTuber',
      photo: '/testimonials/pedro-henrique.jpg',
      rating: 5,
      text: 'Meu canal cresceu de 10K para 500K inscritos após aplicar as técnicas do curso!',
      result: 'Canal com 500K inscritos'
    },
    {
      id: 2,
      name: 'Isabela Rodrigues',
      role: 'Produtora Audiovisual',
      photo: '/testimonials/isabela-rodrigues.jpg',
      rating: 5,
      text: 'Me tornei freelancer e agora ganho R$ 8.000/mês editando vídeos para empresas.',
      result: 'Renda de R$ 8.000/mês'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Quais softwares serão utilizados?',
      answer: 'Adobe Premiere Pro, After Effects, DaVinci Resolve e Audition. Todas as licenças são fornecidas.'
    },
    {
      id: 2,
      question: 'Funciona para iniciantes completos?',
      answer: 'Sim! Começamos do absoluto zero, ensinando desde ligar o programa até edições profissionais.'
    }
  ],
  themeColors: {
    primary: '#E91E63',
    secondary: '#9C27B0',
    accent: '#FF4081',
    gradient: {
      from: '#E91E63',
      to: '#9C27B0',
    },
  },
  seoMeta: {
    title: 'Curso Edição de Vídeo - Escola Habilidade | Premiere, After Effects',
    description: 'Torne-se um Editor de Vídeo profissional. Curso completo com Adobe Premiere, After Effects e DaVinci Resolve. Certificação inclusa.',
    keywords: ['edição de vídeo', 'premiere pro', 'after effects', 'davinci resolve', 'motion graphics'],
    ogImage: '/og-images/edicao-video.jpg',
    ogType: 'website',
  },
};

// Curso 3: Informática
const informatica = {
  basicInfo: {
    id: 'informatica-003',
    title: 'Informática',
    slug: 'informatica',
    shortDescription: 'Curso completo de informática do básico ao avançado para o mercado de trabalho.',
    longDescription: 'Domine todas as ferramentas essenciais de informática. Do Windows ao pacote Office, passando por internet, segurança digital e muito mais. Ideal para quem quer se destacar no mercado.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '60 horas',
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
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Fernando Santos',
    bio: 'Técnico em Informática e instrutor certificado Microsoft. Mais de 15 anos ensinando informática para todas as idades.',
    photo: '/instructors/fernando-santos.jpg',
    experience: '15 anos',
    credentials: [
      'Certificação Microsoft Office Specialist',
      'Técnico em Informática - CREA',
      'Instrutor credenciado Microsoft',
      'Mais de 3.000 alunos formados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Windows e Sistema Operacional',
      description: 'Domínio completo do Windows e gerenciamento de arquivos',
      lessons: [
        { id: 1, title: 'Interface do Windows', duration: '45 min', type: 'video' },
        { id: 2, title: 'Gerenciamento de arquivos', duration: '60 min', type: 'video' },
        { id: 3, title: 'Configurações do sistema', duration: '50 min', type: 'video' },
        { id: 4, title: 'Prática com Windows', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Pacote Office Completo',
      description: 'Word, Excel, PowerPoint e Outlook profissionais',
      lessons: [
        { id: 5, title: 'Word avançado', duration: '75 min', type: 'video' },
        { id: 6, title: 'Excel com fórmulas', duration: '90 min', type: 'video' },
        { id: 7, title: 'PowerPoint profissional', duration: '60 min', type: 'video' },
        { id: 8, title: 'Projeto empresarial', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Windows avançado e produtividade',
    'Microsoft Office completo',
    'Internet e navegação segura',
    'E-mail e comunicação digital',
    'Segurança digital e antivírus',
    'Organização digital pessoal',
    'Preparação para concursos'
  ],
  requirements: [
    'Computador com Windows 7 ou superior',
    '4GB de RAM mínimo',
    'Conhecimento básico de leitura',
    'Vontade de aprender'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Maria José Silva',
      role: 'Assistente Administrativa',
      photo: '/testimonials/maria-jose.jpg',
      rating: 5,
      text: 'Aos 55 anos consegui meu primeiro emprego em escritório graças ao curso!',
      result: 'Primeiro emprego formal'
    },
    {
      id: 2,
      name: 'José Carlos Lima',
      role: 'Aposentado',
      photo: '/testimonials/jose-carlos.jpg',
      rating: 5,
      text: 'Agora consigo usar o computador para tudo e ainda ajudo meus netos!',
      result: 'Inclusão digital completa'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'É adequado para pessoas mais velhas?',
      answer: 'Perfeitamente! Nossa metodologia é especialmente desenvolvida para todas as idades.'
    },
    {
      id: 2,
      question: 'Preciso ter computador próprio?',
      answer: 'Recomendamos, mas você pode praticar em lan houses ou bibliotecas públicas.'
    }
  ],
  themeColors: {
    primary: '#2196F3',
    secondary: '#00BCD4',
    accent: '#03DAC6',
    gradient: {
      from: '#2196F3',
      to: '#00BCD4',
    },
  },
  seoMeta: {
    title: 'Curso de Informática - Escola Habilidade | Windows, Office, Internet',
    description: 'Curso completo de Informática do básico ao avançado. Windows, Office, Internet e mais. Certificação inclusa e metodologia para todas as idades.',
    keywords: ['curso informática', 'windows', 'office', 'excel', 'word', 'powerpoint'],
    ogImage: '/og-images/informatica.jpg',
    ogType: 'website',
  },
};

// Curso 4: Design Gráfico
const designGrafico = {
  basicInfo: {
    id: 'design-grafico-004',
    title: 'Design Gráfico',
    slug: 'design-grafico',
    shortDescription: 'Torne-se um designer gráfico profissional com Photoshop, Illustrator e Corel Draw.',
    longDescription: 'Aprenda design gráfico do zero ao profissional. Domine Photoshop, Illustrator, CorelDraw e as teorias fundamentais do design para criar projetos incríveis e se destacar no mercado.',
    category: 'Design & Criação',
    level: 'Intermediário',
    duration: '85 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 997,
    currentPrice: 597,
    discount: 40,
    installments: {
      max: 12,
      value: 59.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Camila Ribeiro',
    bio: 'Designer Gráfica formada pela ESPM com 12 anos de mercado. Especialista em identidade visual e design editorial.',
    photo: '/instructors/camila-ribeiro.jpg',
    experience: '12 anos',
    credentials: [
      'Bacharelado em Design Gráfico - ESPM',
      'Especialização em Branding',
      'Adobe Certified Expert',
      'Mais de 200 marcas criadas'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos do Design',
      description: 'Teoria das cores, tipografia e composição visual',
      lessons: [
        { id: 1, title: 'Teoria das cores', duration: '60 min', type: 'video' },
        { id: 2, title: 'Tipografia essencial', duration: '45 min', type: 'video' },
        { id: 3, title: 'Composição e hierarquia', duration: '50 min', type: 'video' },
        { id: 4, title: 'Análise de layouts', duration: '75 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Adobe Creative Suite',
      description: 'Photoshop, Illustrator e InDesign profissionais',
      lessons: [
        { id: 5, title: 'Photoshop avançado', duration: '90 min', type: 'video' },
        { id: 6, title: 'Illustrator vetorial', duration: '85 min', type: 'video' },
        { id: 7, title: 'InDesign editorial', duration: '70 min', type: 'video' },
        { id: 8, title: 'Identidade visual completa', duration: '150 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Photoshop, Illustrator e InDesign',
    'Teoria do design e composição',
    'Criação de logotipos e marcas',
    'Design editorial e layouts',
    'Marketing visual e social media',
    'Portfolio profissional',
    'Precificação de trabalhos'
  ],
  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Adobe Creative Cloud',
    'Tablet gráfico (recomendado)',
    'Senso estético e criatividade'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Lucas Mendes',
      role: 'Designer Freelancer',
      photo: '/testimonials/lucas-mendes.jpg',
      rating: 5,
      text: 'Em 4 meses já estava faturando R$ 5.000/mês como freelancer!',
      result: 'Faturamento R$ 5.000/mês'
    },
    {
      id: 2,
      name: 'Amanda Castro',
      role: 'Social Media',
      photo: '/testimonials/amanda-castro.jpg',
      rating: 5,
      text: 'Consegui emprego em agência de publicidade logo após terminar o curso.',
      result: 'Emprego em agência'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter talento artístico natural?',
      answer: 'Não! Design é técnica que se aprende. Ensinamos desde o básico até você desenvolver seu próprio estilo.'
    },
    {
      id: 2,
      question: 'Os softwares são fornecidos?',
      answer: 'Orientamos como obter as licenças e oferecemos alternativas gratuitas como GIMP e Inkscape.'
    }
  ],
  themeColors: {
    primary: '#9C27B0',
    secondary: '#E91E63',
    accent: '#FF5722',
    gradient: {
      from: '#9C27B0',
      to: '#E91E63',
    },
  },
  seoMeta: {
    title: 'Curso Design Gráfico - Escola Habilidade | Photoshop, Illustrator',
    description: 'Torne-se Designer Gráfico profissional. Curso completo com Photoshop, Illustrator, CorelDraw e teoria do design. Certificação inclusa.',
    keywords: ['design gráfico', 'photoshop', 'illustrator', 'corel draw', 'identidade visual'],
    ogImage: '/og-images/design-grafico.jpg',
    ogType: 'website',
  },
};

// Curso 5: Programação
const programacao = {
  basicInfo: {
    id: 'programacao-005',
    title: 'Programação',
    slug: 'programacao',
    shortDescription: 'Aprenda programação do zero e torne-se um desenvolvedor full-stack.',
    longDescription: 'Curso completo de programação web moderna. Aprenda HTML, CSS, JavaScript, React, Node.js e banco de dados. Do zero ao primeiro emprego como programador.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '120 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 1497,
    currentPrice: 897,
    discount: 40,
    installments: {
      max: 12,
      value: 89.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Rodrigo Oliveira',
    bio: 'Desenvolvedor Full-Stack Senior com 10+ anos de experiência. Trabalhou no Google e ensinou mais de 5.000 programadores.',
    photo: '/instructors/rodrigo-oliveira.jpg',
    experience: '10 anos',
    credentials: [
      'Engenheiro de Software - USP',
      'Ex-Google Developer',
      'Especialista React/Node.js',
      'Mais de 5.000 devs formados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos Web',
      description: 'HTML, CSS e JavaScript do básico ao avançado',
      lessons: [
        { id: 1, title: 'HTML semântico', duration: '90 min', type: 'video' },
        { id: 2, title: 'CSS moderno e responsivo', duration: '120 min', type: 'video' },
        { id: 3, title: 'JavaScript ES6+', duration: '150 min', type: 'video' },
        { id: 4, title: 'Primeiro site completo', duration: '180 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Desenvolvimento Avançado',
      description: 'React, Node.js e banco de dados',
      lessons: [
        { id: 5, title: 'React e componentes', duration: '120 min', type: 'video' },
        { id: 6, title: 'Node.js e APIs', duration: '100 min', type: 'video' },
        { id: 7, title: 'Banco de dados SQL', duration: '90 min', type: 'video' },
        { id: 8, title: 'App full-stack completo', duration: '240 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'HTML5, CSS3 e JavaScript moderno',
    'React e desenvolvimento frontend',
    'Node.js e APIs REST',
    'Banco de dados SQL e NoSQL',
    'Git e controle de versão',
    'Deploy e hospedagem',
    'Portfolio de projetos reais'
  ],
  requirements: [
    'Computador com Windows, Mac ou Linux',
    '8GB de RAM mínimo',
    'Conexão estável com internet',
    'Inglês básico (recomendado)',
    'Lógica de programação (será ensinada)'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Gabriel Santos',
      role: 'Desenvolvedor Jr.',
      photo: '/testimonials/gabriel-santos.jpg',
      rating: 5,
      text: 'Saí do zero e consegui meu primeiro emprego como dev em 8 meses!',
      result: 'Primeiro emprego como dev'
    },
    {
      id: 2,
      name: 'Ana Beatriz',
      role: 'Freelancer Dev',
      photo: '/testimonials/ana-beatriz.jpg',
      rating: 5,
      text: 'Hoje trabalho como freelancer e ganho R$ 12.000/mês desenvolvendo sistemas.',
      result: 'Renda de R$ 12.000/mês'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio?',
      answer: 'Não! Começamos do absoluto zero, ensinando lógica de programação e conceitos básicos.'
    },
    {
      id: 2,
      question: 'Quanto tempo para conseguir emprego?',
      answer: 'Nossos alunos conseguem o primeiro emprego entre 6-12 meses, dependendo da dedicação.'
    }
  ],
  themeColors: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    accent: '#CDDC39',
    gradient: {
      from: '#4CAF50',
      to: '#8BC34A',
    },
  },
  seoMeta: {
    title: 'Curso de Programação - Escola Habilidade | JavaScript, React, Node.js',
    description: 'Torne-se Programador Full-Stack. Curso completo com JavaScript, React, Node.js e muito mais. Do zero ao primeiro emprego.',
    keywords: ['programação', 'javascript', 'react', 'nodejs', 'desenvolvedor web'],
    ogImage: '/og-images/programacao.jpg',
    ogType: 'website',
  },
};

// Curso 6: Marketing Digital
const marketingDigital = {
  basicInfo: {
    id: 'marketing-digital-006',
    title: 'Marketing Digital',
    slug: 'marketing-digital',
    shortDescription: 'Domine as estratégias de marketing digital e impulsione qualquer negócio online.',
    longDescription: 'Curso completo de marketing digital. Aprenda Google Ads, Facebook Ads, SEO, redes sociais, e-mail marketing e analytics. Torne-se um especialista em marketing digital.',
    category: 'Marketing & Vendas',
    level: 'Intermediário',
    duration: '90 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 797,
    currentPrice: 497,
    discount: 38,
    installments: {
      max: 12,
      value: 49.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Carolina Alves',
    bio: 'Especialista em Marketing Digital com 8 anos de experiência. Gerenciou campanhas de mais de R$ 10 milhões em investimento.',
    photo: '/instructors/carolina-alves.jpg',
    experience: '8 anos',
    credentials: [
      'Certificação Google Ads',
      'Facebook Blueprint Certified',
      'Especialização em Growth Hacking',
      'R$ 10M+ em campanhas gerenciadas'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos do Marketing Digital',
      description: 'Base teórica e estratégica do marketing online',
      lessons: [
        { id: 1, title: 'Jornada do cliente digital', duration: '60 min', type: 'video' },
        { id: 2, title: 'Funil de vendas e conversão', duration: '75 min', type: 'video' },
        { id: 3, title: 'Métricas e KPIs essenciais', duration: '45 min', type: 'video' },
        { id: 4, title: 'Primeira estratégia digital', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Tráfego Pago e Orgânico',
      description: 'Google Ads, Facebook Ads e SEO profissional',
      lessons: [
        { id: 5, title: 'Google Ads completo', duration: '120 min', type: 'video' },
        { id: 6, title: 'Facebook e Instagram Ads', duration: '100 min', type: 'video' },
        { id: 7, title: 'SEO e marketing de conteúdo', duration: '90 min', type: 'video' },
        { id: 8, title: 'Campanha completa multi-canal', duration: '180 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Google Ads e campanhas pagas',
    'Facebook e Instagram Ads',
    'SEO e marketing de conteúdo',
    'E-mail marketing e automação',
    'Analytics e métricas',
    'Funil de vendas e conversão',
    'Gestão de redes sociais'
  ],
  requirements: [
    'Computador com internet estável',
    'Conhecimentos básicos de internet',
    'Perfil no Facebook e Google',
    'Vontade de empreender',
    'Capital inicial para testes (R$ 500)'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Marcos Silva',
      role: 'Empreendedor',
      photo: '/testimonials/marcos-silva.jpg',
      rating: 5,
      text: 'Aumentei as vendas da minha loja online em 400% em 3 meses!',
      result: 'Aumento de 400% nas vendas'
    },
    {
      id: 2,
      name: 'Patricia Lima',
      role: 'Consultora Digital',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'Me tornei consultora de marketing e faturei R$ 50.000 no primeiro semestre.',
      result: 'Faturamento R$ 50.000'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso investir dinheiro em anúncios?',
      answer: 'Recomendamos pelo menos R$ 500 para testes práticos, mas ensinamos como começar sem investimento.'
    },
    {
      id: 2,
      question: 'Funciona para qualquer tipo de negócio?',
      answer: 'Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos e negócios locais.'
    }
  ],
  themeColors: {
    primary: '#FF9800',
    secondary: '#FF5722',
    accent: '#FFC107',
    gradient: {
      from: '#FF9800',
      to: '#FF5722',
    },
  },
  seoMeta: {
    title: 'Marketing Digital - Escola Habilidade | Google Ads, Facebook Ads, SEO',
    description: 'Domine Marketing Digital profissionalmente. Google Ads, Facebook Ads, SEO e muito mais. Aumente suas vendas exponencialmente.',
    keywords: ['marketing digital', 'google ads', 'facebook ads', 'seo', 'redes sociais'],
    ogImage: '/og-images/marketing-digital.jpg',
    ogType: 'website',
  },
};

// Curso 7: Inteligência Artificial
const inteligenciaArtificial = {
  basicInfo: {
    id: 'inteligencia-artificial-007',
    title: 'Inteligência Artificial',
    slug: 'inteligencia-artificial',
    shortDescription: 'Domine IA, Machine Learning e ferramentas de automação para o futuro.',
    longDescription: 'Curso prático de Inteligência Artificial. Aprenda Python, Machine Learning, ChatGPT, automação e como aplicar IA no seu negócio. Prepare-se para o futuro do trabalho.',
    category: 'Tecnologia',
    level: 'Avançado',
    duration: '100 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 1297,
    currentPrice: 797,
    discount: 39,
    installments: {
      max: 12,
      value: 79.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Dr. Rafael Mendes',
    bio: 'PhD em Inteligência Artificial pela USP. Pesquisador e consultor em IA para grandes empresas. Especialista em aplicações práticas de IA.',
    photo: '/instructors/rafael-mendes.jpg',
    experience: '12 anos',
    credentials: [
      'PhD em Inteligência Artificial - USP',
      'Pesquisador em Machine Learning',
      'Consultor IA para Fortune 500',
      'Mais de 50 artigos publicados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos de IA',
      description: 'Base teórica e prática da Inteligência Artificial',
      lessons: [
        { id: 1, title: 'História e conceitos de IA', duration: '75 min', type: 'video' },
        { id: 2, title: 'Python para IA', duration: '120 min', type: 'video' },
        { id: 3, title: 'Bibliotecas essenciais', duration: '90 min', type: 'video' },
        { id: 4, title: 'Primeiro modelo de IA', duration: '150 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Machine Learning Avançado',
      description: 'Algoritmos, modelos e aplicações práticas',
      lessons: [
        { id: 5, title: 'Algoritmos de ML', duration: '100 min', type: 'video' },
        { id: 6, title: 'Deep Learning e redes neurais', duration: '130 min', type: 'video' },
        { id: 7, title: 'Processamento de linguagem natural', duration: '110 min', type: 'video' },
        { id: 8, title: 'Sistema de IA completo', duration: '200 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Python para Inteligência Artificial',
    'Machine Learning e Deep Learning',
    'Processamento de linguagem natural',
    'Visão computacional',
    'Automação inteligente',
    'Integração de IA em negócios',
    'Ética e futuro da IA'
  ],
  requirements: [
    'Computador com 16GB de RAM',
    'Conhecimento básico de programação',
    'Matemática do ensino médio',
    'Inglês técnico (recomendado)',
    'Disponibilidade para estudo intensivo'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Leonardo Costa',
      role: 'Cientista de Dados',
      photo: '/testimonials/leonardo-costa.jpg',
      rating: 5,
      text: 'Me tornei especialista em IA e triplicei meu salário como cientista de dados!',
      result: 'Aumento de 300% no salário'
    },
    {
      id: 2,
      name: 'Fernanda Oliveira',
      role: 'Empreendedora Tech',
      photo: '/testimonials/fernanda-oliveira.jpg',
      rating: 5,
      text: 'Criei uma startup de IA que foi avaliada em R$ 2 milhões em um ano!',
      result: 'Startup avaliada em R$ 2M'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ser programador para aprender IA?',
      answer: 'Conhecimento básico de programação ajuda, mas ensinamos Python do zero focado em IA.'
    },
    {
      id: 2,
      question: 'IA vai substituir meu emprego?',
      answer: 'Não! Profissionais que dominam IA serão os mais valorizados. O curso te prepara para isso.'
    }
  ],
  themeColors: {
    primary: '#673AB7',
    secondary: '#9C27B0',
    accent: '#E1BEE7',
    gradient: {
      from: '#673AB7',
      to: '#9C27B0',
    },
  },
  seoMeta: {
    title: 'Curso Inteligência Artificial - Escola Habilidade | Python, Machine Learning',
    description: 'Domine Inteligência Artificial e Machine Learning. Curso prático com Python, automação e aplicações reais de IA.',
    keywords: ['inteligência artificial', 'machine learning', 'python', 'ia', 'automação'],
    ogImage: '/og-images/inteligencia-artificial.jpg',
    ogType: 'website',
  },
};

// Curso 8: Business Intelligence
const businessIntelligence = {
  basicInfo: {
    id: 'business-intelligence-008',
    title: 'Business Intelligence',
    slug: 'business-intelligence',
    shortDescription: 'Transforme dados em insights estratégicos com Power BI, SQL e análise avançada.',
    longDescription: 'Curso completo de Business Intelligence. Domine Power BI, SQL, Excel avançado e análise de dados para se tornar o profissional mais requisitado pelas empresas.',
    category: 'Análise de Dados',
    level: 'Intermediário',
    duration: '95 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 897,
    currentPrice: 597,
    discount: 33,
    installments: {
      max: 12,
      value: 59.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Marcos Vinicius',
    bio: 'Especialista em Business Intelligence com 15 anos de experiência. Consultor sênior em grandes corporações e professor universitário.',
    photo: '/instructors/marcos-vinicius.jpg',
    experience: '15 anos',
    credentials: [
      'MBA em Business Intelligence',
      'Certificação Microsoft Power BI',
      'Consultor BI Senior',
      'Professor universitário'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos de BI',
      description: 'Conceitos e ferramentas essenciais de Business Intelligence',
      lessons: [
        { id: 1, title: 'Introdução ao BI', duration: '60 min', type: 'video' },
        { id: 2, title: 'Modelagem de dados', duration: '90 min', type: 'video' },
        { id: 3, title: 'ETL e Data Warehouse', duration: '75 min', type: 'video' },
        { id: 4, title: 'Primeiro dashboard', duration: '120 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Power BI Avançado',
      description: 'Dashboards interativos e análises profissionais',
      lessons: [
        { id: 5, title: 'Power BI Desktop completo', duration: '120 min', type: 'video' },
        { id: 6, title: 'DAX e medidas calculadas', duration: '100 min', type: 'video' },
        { id: 7, title: 'Power BI Service e compartilhamento', duration: '80 min', type: 'video' },
        { id: 8, title: 'Projeto empresarial completo', duration: '180 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    'Power BI completo e avançado',
    'SQL para análise de dados',
    'Excel avançado com Power Query',
    'Modelagem dimensional',
    'Dashboards interativos',
    'Storytelling com dados',
    'Governança de dados'
  ],
  requirements: [
    'Computador com Windows 10/11',
    '8GB de RAM mínimo',
    'Microsoft Excel instalado',
    'Conhecimento básico de matemática',
    'Experiência empresarial (recomendado)'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Juliana Santos',
      role: 'Analista de BI',
      photo: '/testimonials/juliana-santos.jpg',
      rating: 5,
      text: 'Consegui promoção para Analista Sênior e aumento de 80% no salário!',
      result: 'Promoção e aumento de 80%'
    },
    {
      id: 2,
      name: 'Ricardo Pereira',
      role: 'Gerente de Dados',
      photo: '/testimonials/ricardo-pereira.jpg',
      rating: 5,
      text: 'Me tornei especialista em BI e agora lidero uma equipe de 10 analistas.',
      result: 'Promoção a Gerente'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso conhecer programação?',
      answer: 'Não é obrigatório! Ensinamos SQL do básico e o Power BI é uma ferramenta visual.'
    },
    {
      id: 2,
      question: 'Qual o perfil ideal para BI?',
      answer: 'Profissionais analíticos que gostam de dados e querem ajudar empresas na tomada de decisão.'
    }
  ],
  themeColors: {
    primary: '#1976D2',
    secondary: '#2196F3',
    accent: '#03DAC6',
    gradient: {
      from: '#1976D2',
      to: '#2196F3',
    },
  },
  seoMeta: {
    title: 'Business Intelligence - Escola Habilidade | Power BI, SQL, Excel',
    description: 'Torne-se especialista em Business Intelligence. Curso completo com Power BI, SQL e análise de dados. Certificação inclusa.',
    keywords: ['business intelligence', 'power bi', 'sql', 'análise de dados', 'dashboard'],
    ogImage: '/og-images/business-intelligence.jpg',
    ogType: 'website',
  },
};

// Lista completa de todos os cursos
export const COURSES_DATA = [
  projetista3D,
  edicaoVideo,
  informatica,
  designGrafico,
  programacao,
  marketingDigital,
  inteligenciaArtificial,
  businessIntelligence,
];

export default COURSES_DATA; 