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
    shortDescription: 'Domine Premiere Pro e After Effects para criar vídeos profissionais e motion graphics.',
    longDescription: 'Aprenda edição de vídeo profissional do zero ao avançado. Domine Adobe Premiere Pro e After Effects para se tornar um editor completo e requisitado no mercado audiovisual.',
    category: 'Audiovisual',
    level: 'Intermediário',
    duration: '48 horas',
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
      'Certificação Adobe Premiere Pro Expert',
      'Motion Designer profissional',
      'Editora oficial do YouTube Creators',
      'Mais de 1.000 vídeos editados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Adobe Premiere Pro Completo',
      description: 'Edição profissional de vídeos com o software líder do mercado',
      lessons: [
        { id: 1, title: 'Introdução ao programa', duration: '90 min', type: 'video' },
        { id: 2, title: 'Ferramentas básicas de edição', duration: '90 min', type: 'video' },
        { id: 3, title: 'Transições de vídeo e adicionando texto', duration: '90 min', type: 'video' },
        { id: 4, title: 'Transição Swish e Keyframes', duration: '90 min', type: 'video' },
        { id: 5, title: 'Efeitos de vídeo avançados', duration: '90 min', type: 'video' },
        { id: 6, title: 'Transição RGB, Transições e Efeitos de áudio', duration: '90 min', type: 'video' },
        { id: 7, title: 'Animação e movimento', duration: '90 min', type: 'video' },
        { id: 8, title: 'Criando Lower Thirds (redes sociais e nome)', duration: '90 min', type: 'video' },
        { id: 9, title: 'Criar intro para os vídeos', duration: '90 min', type: 'video' },
        { id: 10, title: 'Frame Hold e bordas desfocadas', duration: '90 min', type: 'video' },
        { id: 11, title: 'Smooth Transitions e Glitchs', duration: '90 min', type: 'video' },
        { id: 12, title: 'Vídeo em preto e branco e efeito Fisheye', duration: '90 min', type: 'video' },
        { id: 13, title: 'Transição usando pessoas e acelerar/desacelerar', duration: '90 min', type: 'video' },
        { id: 14, title: 'Efeito Flash criativo', duration: '90 min', type: 'video' },
        { id: 15, title: 'Efeito mágica e transformações', duration: '90 min', type: 'video' },
        { id: 16, title: 'Correção de cor, predefinições e LUTs', duration: '90 min', type: 'video' },
        { id: 17, title: 'Adicionar créditos com gráficos essenciais', duration: '90 min', type: 'video' },
        { id: 18, title: 'Renderizar projeto e exportação final', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Adobe After Effects',
      description: 'Motion graphics e efeitos visuais cinematográficos',
      lessons: [
        { id: 19, title: 'Workspace e Composições', duration: '90 min', type: 'video' },
        { id: 20, title: 'Background e Composição avançada', duration: '90 min', type: 'video' },
        { id: 21, title: 'Máscara e rotoscopia', duration: '90 min', type: 'video' },
        { id: 22, title: 'Correção de cores profissional', duration: '90 min', type: 'video' },
        { id: 23, title: 'Controles de câmera 3D', duration: '90 min', type: 'video' },
        { id: 24, title: 'Sincronização e efeitos de áudio', duration: '90 min', type: 'video' },
        { id: 25, title: 'Efeitos visuais e plugins', duration: '90 min', type: 'video' },
        { id: 26, title: 'Efeito de revelação de texto', duration: '90 min', type: 'video' },
        { id: 27, title: 'Finalizando o projeto e renderizando', duration: '90 min', type: 'video' },
        { id: 28, title: 'Processo de sincronização de vídeos', duration: '90 min', type: 'video' },
        { id: 29, title: 'Transição suave (Zoom) e movimento', duration: '90 min', type: 'video' },
        { id: 30, title: 'Editor gráfico de efeitos', duration: '90 min', type: 'video' },
        { id: 31, title: 'Transições e Ancoragem avançada', duration: '90 min', type: 'video' },
        { id: 32, title: 'Projeto Final: Motion Graphics completo', duration: '90 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Adobe Premiere Pro completo e profissional',
    '✅ After Effects para motion graphics e efeitos',
    '✅ Técnicas avançadas de edição e transições',
    '✅ Correção de cor e gradação cinematográfica',
    '✅ Criação de intros, vinhetas e lower thirds',
    '✅ Sincronização de áudio e vídeo',
    '✅ Efeitos visuais e composição 3D',
    '✅ Workflow profissional para YouTube e TV',
    '✅ Portfolio com projetos comerciais',
    '✅ Preparação para mercado audiovisual'
  ],
  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '16GB de RAM (mínimo 8GB)',
    'Placa de vídeo dedicada (recomendado)',
    'Adobe Creative Cloud (Premiere + After Effects)',
    'SSD com 100GB livres',
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
      role: 'Editora Freelancer',
      photo: '/testimonials/isabela-rodrigues.jpg',
      rating: 5,
      text: 'Me tornei freelancer e agora ganho R$ 8.000/mês editando vídeos para empresas.',
      result: 'Renda de R$ 8.000/mês'
    },
    {
      id: 3,
      name: 'Lucas Ferreira',
      role: 'Motion Designer',
      photo: '/testimonials/lucas-ferreira.jpg',
      rating: 5,
      text: 'Consegui trabalho em produtora de TV logo após terminar o curso. After Effects mudou minha vida!',
      result: 'Emprego em produtora de TV'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Quais softwares serão utilizados no curso?',
      answer: 'Adobe Premiere Pro e After Effects. Orientamos sobre licenciamento e oferecemos alternativas gratuitas para prática.'
    },
    {
      id: 2,
      question: 'Funciona para iniciantes completos em edição?',
      answer: 'Sim! Começamos do absoluto zero, ensinando desde ligar o programa até edições cinematográficas profissionais.'
    },
    {
      id: 3,
      question: 'Vou conseguir trabalhar como editor após o curso?',
      answer: 'Sim! Muitos alunos conseguem trabalho em 3-6 meses. Ensinamos portfolio, precificação e como conseguir clientes.'
    },
    {
      id: 4,
      question: 'O curso serve para YouTube e redes sociais?',
      answer: 'Perfeitamente! Ensinamos formatos específicos para YouTube, Instagram, TikTok e outras plataformas.'
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
    title: 'Curso Edição de Vídeo Completo - Escola Habilidade | Premiere Pro, After Effects',
    description: 'Torne-se Editor de Vídeo profissional. Curso completo com Adobe Premiere Pro e After Effects. 48 horas práticas, portfolio incluso.',
    keywords: ['edição de vídeo', 'premiere pro', 'after effects', 'motion graphics', 'youtube', 'editor'],
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
    shortDescription: 'Curso completo de informática com Windows 11, Office avançado e IA aplicada para dominar a tecnologia moderna.',
    longDescription: 'Torne-se um expert em informática com nosso curso mais completo. Aprenda Windows 11, pacote Office avançado, ambientes digitais, Canva e inteligência artificial aplicada. Do básico ao profissional em 184+ horas de conteúdo prático e atualizado.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '184,5 horas',
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
    name: 'Fernando Santos',
    bio: 'Especialista em Tecnologia da Informação com mais de 15 anos de experiência. Certificado Microsoft e especialista em IA aplicada, já formou mais de 5.000 alunos em informática moderna.',
    photo: '/instructors/fernando-santos.jpg',
    experience: '15 anos',
    credentials: [
      'Certificação Microsoft Office Specialist Expert',
      'Especialista em Windows 11 e IA',
      'Instrutor credenciado Microsoft e Google',
      'Certificação em Ambientes Digitais',
      'Mais de 5.000 alunos transformados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Windows 11 Completo',
      description: 'Domínio total do sistema operacional mais moderno da Microsoft',
      lessons: [
        { id: 1, title: 'Exploração da interface do Windows', duration: '90 min', type: 'video' },
        { id: 2, title: 'Painel de controle', duration: '90 min', type: 'video' },
        { id: 3, title: 'Gerenciamento de pastas/arquivos', duration: '90 min', type: 'video' },
        { id: 4, title: 'Configurações de rede', duration: '90 min', type: 'video' },
        { id: 5, title: 'Recursos de segurança do sistema (firewall, contas de usuário)', duration: '90 min', type: 'video' },
        { id: 6, title: 'Personalização do sistema', duration: '90 min', type: 'video' },
        { id: 7, title: 'Navegação na internet', duration: '90 min', type: 'video' },
        { id: 8, title: 'Noções de manutenção básica', duration: '90 min', type: 'video' },
        { id: 9, title: 'Recursos avançados do Windows 11', duration: '90 min', type: 'video' },
        { id: 10, title: 'Integração com serviços Microsoft', duration: '90 min', type: 'video' },
        { id: 11, title: 'Solução de problemas comuns', duration: '90 min', type: 'video' },
        { id: 12, title: 'Projeto prático: Configuração empresarial', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Word Fundamental',
      description: 'Microsoft Word do básico ao avançado para documentos profissionais',
      lessons: [
        { id: 13, title: 'Introdução ao Microsoft Word', duration: '90 min', type: 'video' },
        { id: 14, title: 'Formatação etapa I e Inserir Imagens', duration: '90 min', type: 'video' },
        { id: 15, title: 'Formatação etapa II e Inserir Formas', duration: '90 min', type: 'video' },
        { id: 16, title: 'SmartArt e WordArt', duration: '90 min', type: 'video' },
        { id: 17, title: 'Guia Desenhar', duration: '90 min', type: 'video' },
        { id: 18, title: 'Bordas e Sombreamento', duration: '90 min', type: 'video' },
        { id: 19, title: 'Marcadores e Numeração', duration: '90 min', type: 'video' },
        { id: 20, title: 'Tabelas Etapa 1', duration: '90 min', type: 'video' },
        { id: 21, title: 'Tabelas Etapa 2', duration: '90 min', type: 'video' },
        { id: 22, title: 'Colunas', duration: '90 min', type: 'video' },
        { id: 23, title: 'Tabulação, Cabeçalho e Rodapé', duration: '90 min', type: 'video' },
        { id: 24, title: 'Configurar Página e Parágrafo', duration: '90 min', type: 'video' },
        { id: 25, title: 'Trabalhando com modelos', duration: '90 min', type: 'video' },
        { id: 26, title: 'Criando Estilos', duration: '90 min', type: 'video' },
        { id: 27, title: 'Criando Índice Etapa I', duration: '90 min', type: 'video' },
        { id: 28, title: 'Criando Índice Etapa II', duration: '90 min', type: 'video' },
        { id: 29, title: 'Verificação Ortográfica e Revisão', duration: '90 min', type: 'video' },
        { id: 30, title: 'Guia Exibir, Impressão e Gerar PDF', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'PowerPoint Fundamental',
      description: 'Apresentações profissionais e impactantes com PowerPoint',
      lessons: [
        { id: 31, title: 'Introdução ao Microsoft PowerPoint', duration: '90 min', type: 'video' },
        { id: 32, title: 'Trabalhando com Slides', duration: '90 min', type: 'video' },
        { id: 33, title: 'Trabalhando com formas', duration: '90 min', type: 'video' },
        { id: 34, title: 'Aplicando Temas', duration: '90 min', type: 'video' },
        { id: 35, title: 'Mais Temas', duration: '90 min', type: 'video' },
        { id: 36, title: 'Animando Elementos', duration: '90 min', type: 'video' },
        { id: 37, title: 'Transição entre Slides', duration: '90 min', type: 'video' },
        { id: 38, title: 'Adicionando Mídia I', duration: '90 min', type: 'video' },
        { id: 39, title: 'Adicionando Mídia II', duration: '90 min', type: 'video' },
        { id: 40, title: 'Trabalhando com Tabelas', duration: '90 min', type: 'video' },
        { id: 41, title: 'Trabalhando com Gráficos', duration: '90 min', type: 'video' },
        { id: 42, title: 'Slide Mestre', duration: '90 min', type: 'video' },
        { id: 43, title: 'Adicionando Interatividade', duration: '90 min', type: 'video' },
        { id: 44, title: 'Criando Infográficos', duration: '90 min', type: 'video' },
        { id: 45, title: 'Animação Avançada I', duration: '90 min', type: 'video' },
        { id: 46, title: 'Animação Avançada II', duration: '90 min', type: 'video' },
        { id: 47, title: 'Configurando a apresentação de slides', duration: '90 min', type: 'video' },
        { id: 48, title: 'Dicas e Truques', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 4,
      title: 'Excel Fundamental',
      description: 'Excel do básico ao intermediário para análise de dados',
      lessons: [
        { id: 49, title: 'Introdução e primeira planilha', duration: '90 min', type: 'video' },
        { id: 50, title: 'Formatação básica', duration: '90 min', type: 'video' },
        { id: 51, title: 'Uso da guia Revisão', duration: '90 min', type: 'video' },
        { id: 52, title: 'Operações aritméticas', duration: '90 min', type: 'video' },
        { id: 53, title: 'Porcentagens', duration: '90 min', type: 'video' },
        { id: 54, title: 'Referências relativas/absolutas', duration: '90 min', type: 'video' },
        { id: 55, title: 'Funções comuns (SOMA, MÉDIA etc.)', duration: '90 min', type: 'video' },
        { id: 56, title: 'Gráficos (parte I)', duration: '90 min', type: 'video' },
        { id: 57, title: 'Gráficos (parte II)', duration: '90 min', type: 'video' },
        { id: 58, title: 'Formatação condicional', duration: '90 min', type: 'video' },
        { id: 59, title: 'Validação de dados', duration: '90 min', type: 'video' },
        { id: 60, title: 'Funções de pesquisa (PROCV)', duration: '90 min', type: 'video' },
        { id: 61, title: 'Fórmulas de texto e autosoma', duration: '90 min', type: 'video' },
        { id: 62, title: 'Funções financeiras básicas', duration: '90 min', type: 'video' },
        { id: 63, title: 'Gerenciador de nomes', duration: '90 min', type: 'video' },
        { id: 64, title: 'Auditoria e impressão', duration: '90 min', type: 'video' },
        { id: 65, title: 'Projeto prático empresarial', duration: '90 min', type: 'project' },
        { id: 66, title: 'Preparação para Excel Avançado', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 5,
      title: 'Excel Avançado',
      description: 'Excel profissional com fórmulas complexas, macros e VBA',
      lessons: [
        { id: 67, title: 'Revisão de fórmulas básicas', duration: '90 min', type: 'video' },
        { id: 68, title: 'Funções de texto', duration: '90 min', type: 'video' },
        { id: 69, title: 'Funções lógicas', duration: '90 min', type: 'video' },
        { id: 70, title: 'Funções de matemática e estatística (parte I)', duration: '90 min', type: 'video' },
        { id: 71, title: 'Funções de matemática e estatística (parte II)', duration: '90 min', type: 'video' },
        { id: 72, title: 'Funções de data e hora', duration: '90 min', type: 'video' },
        { id: 73, title: 'Ferramentas de auditoria e teste de hipóteses', duration: '90 min', type: 'video' },
        { id: 74, title: 'Funções de informação', duration: '90 min', type: 'video' },
        { id: 75, title: 'Funções de pesquisa e referência', duration: '90 min', type: 'video' },
        { id: 76, title: 'Tabela dinâmica e formatação condicional', duration: '90 min', type: 'video' },
        { id: 77, title: 'Gráfico dinâmico e classificação', duration: '90 min', type: 'video' },
        { id: 78, title: 'Formulários no Excel', duration: '90 min', type: 'video' },
        { id: 79, title: 'Introdução a Macros e VBA', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 6,
      title: 'Ambientes Digitais',
      description: 'Computação em nuvem e ferramentas colaborativas modernas',
      lessons: [
        { id: 80, title: 'Introdução à computação em nuvem', duration: '90 min', type: 'video' },
        { id: 81, title: 'Utilização de Google Drive/Docs e similares', duration: '90 min', type: 'video' },
        { id: 82, title: 'Ferramentas de videoconferência e chamadas online', duration: '90 min', type: 'video' },
        { id: 83, title: 'Aplicativos de acesso remoto', duration: '90 min', type: 'video' },
        { id: 84, title: 'Noções de segurança digital', duration: '90 min', type: 'video' },
        { id: 85, title: 'Etiqueta e boa conduta na internet', duration: '90 min', type: 'video' },
        { id: 86, title: 'Backup e sincronização na nuvem', duration: '90 min', type: 'video' },
        { id: 87, title: 'Colaboração em tempo real', duration: '90 min', type: 'video' },
        { id: 88, title: 'Ferramentas de produtividade online', duration: '90 min', type: 'video' },
        { id: 89, title: 'Integração entre plataformas', duration: '90 min', type: 'video' },
        { id: 90, title: 'Trabalho remoto eficiente', duration: '90 min', type: 'video' },
        { id: 91, title: 'Gestão de arquivos na nuvem', duration: '90 min', type: 'video' },
        { id: 92, title: 'Compartilhamento seguro', duration: '90 min', type: 'video' },
        { id: 93, title: 'Tendências em ambientes digitais', duration: '90 min', type: 'video' },
        { id: 94, title: 'Projeto prático: Escritório digital', duration: '90 min', type: 'project' },
        { id: 95, title: 'Certificação final', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 7,
      title: 'Canva Profissional',
      description: 'Design gráfico acessível para criar materiais visuais impactantes',
      lessons: [
        { id: 96, title: 'Introdução ao Canva', duration: '90 min', type: 'video' },
        { id: 97, title: 'Escolha de layouts e modelos', duration: '90 min', type: 'video' },
        { id: 98, title: 'Inserção de textos e imagens', duration: '90 min', type: 'video' },
        { id: 99, title: 'Personalização de cores e fontes', duration: '90 min', type: 'video' },
        { id: 100, title: 'Criação de posts para Instagram/Facebook', duration: '90 min', type: 'video' },
        { id: 101, title: 'Elaboração de banners e cartões', duration: '90 min', type: 'video' },
        { id: 102, title: 'Download/exportação dos designs', duration: '90 min', type: 'video' },
        { id: 103, title: 'Templates avançados', duration: '90 min', type: 'video' },
        { id: 104, title: 'Branding com Canva', duration: '90 min', type: 'video' },
        { id: 105, title: 'Materiais para impressão', duration: '90 min', type: 'video' },
        { id: 106, title: 'Animações básicas', duration: '90 min', type: 'video' },
        { id: 107, title: 'Projeto final: Kit de identidade visual', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 8,
      title: 'Inteligência Artificial Aplicada',
      description: 'IA prática para produtividade e criação de conteúdo',
      lessons: [
        { id: 108, title: 'Introdução e História da Inteligência Artificial', duration: '90 min', type: 'video' },
        { id: 109, title: 'Machine Learning', duration: '90 min', type: 'video' },
        { id: 110, title: 'Prompt', duration: '90 min', type: 'video' },
        { id: 111, title: 'GPT, Bard e Copilot', duration: '90 min', type: 'video' },
        { id: 112, title: 'Estudando e Pesquisando com IAs', duration: '90 min', type: 'video' },
        { id: 113, title: 'Melhorando o Prompt', duration: '90 min', type: 'video' },
        { id: 114, title: 'Gerando Imagens', duration: '90 min', type: 'video' },
        { id: 115, title: 'Gerando Posts para Redes Sociais', duration: '90 min', type: 'video' },
        { id: 116, title: 'HARPA AI Parte 1', duration: '90 min', type: 'video' },
        { id: 117, title: 'HARPA AI Parte 2', duration: '90 min', type: 'video' },
        { id: 118, title: 'Gerando vídeos', duration: '90 min', type: 'video' },
        { id: 119, title: 'Gerando vídeos através de imagens', duration: '90 min', type: 'video' },
        { id: 120, title: 'Gerando áudios', duration: '90 min', type: 'video' },
        { id: 121, title: 'Gerando vídeos com D-ID', duration: '90 min', type: 'video' },
        { id: 122, title: 'PI', duration: '90 min', type: 'video' },
        { id: 123, title: 'Projeto Liga das IAs', duration: '90 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Windows 11 completo e produtividade avançada',
    '✅ Microsoft Office profissional (Word, Excel, PowerPoint)',
    '✅ Excel Fundamental e Avançado com Macros e VBA',
    '✅ Ambientes digitais e computação em nuvem',
    '✅ Design com Canva para redes sociais e impressão',
    '✅ Inteligência Artificial aplicada ao trabalho',
    '✅ Segurança digital e proteção de dados',
    '✅ Preparação completa para o mercado de trabalho',
    '✅ Certificação profissional reconhecida',
    '✅ Portfolio de projetos práticos'
  ],
  requirements: [
    'Computador com Windows 10/11 ou superior',
    '8GB de RAM (recomendado 16GB)',
    'Conexão estável com internet',
    'Vontade de aprender e se modernizar',
    'Dedicação de 10-15 horas semanais'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Maria José Silva',
      role: 'Assistente Administrativa',
      photo: '/testimonials/maria-jose.jpg',
      rating: 5,
      text: 'Aos 55 anos consegui meu primeiro emprego em escritório graças ao curso completo! O conteúdo sobre IA me surpreendeu muito.',
      result: 'Primeiro emprego formal aos 55 anos'
    },
    {
      id: 2,
      name: 'José Carlos Lima',
      role: 'Aposentado',
      photo: '/testimonials/jose-carlos.jpg',
      rating: 5,
      text: 'Agora domino desde o Windows 11 até IA! Uso o Canva para criar materiais para minha igreja. Curso excepcional!',
      result: 'Transformação digital completa'
    },
    {
      id: 3,
      name: 'Ana Beatriz Santos',
      role: 'Freelancer Digital',
      photo: '/testimonials/ana-beatriz.jpg',
      rating: 5,
      text: 'O módulo de IA e Excel Avançado revolucionou meu trabalho. Agora ofereço serviços mais avançados e ganho 3x mais!',
      result: 'Aumento de 300% na renda'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'É adequado para pessoas sem conhecimento em informática?',
      answer: 'Sim! Começamos do absoluto zero com Windows 11 e evoluímos gradualmente até tecnologias avançadas como IA aplicada.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre Excel Fundamental e Avançado?',
      answer: 'Fundamental ensina o básico (fórmulas simples, gráficos). Avançado inclui Macros, VBA, funções complexas e tabelas dinâmicas.'
    },
    {
      id: 3,
      question: 'Preciso ter computador próprio?',
      answer: 'Recomendamos ter seu próprio equipamento para prática constante, mas oferecemos suporte para configurações alternativas.'
    },
    {
      id: 4,
      question: 'Como a IA está integrada no curso?',
      answer: 'Ensinamos IA de forma prática: ChatGPT para produtividade, geração de imagens, vídeos, automações web e muito mais.'
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
    title: 'Curso de Informática Completo - Escola Habilidade | Windows 11, Office, IA',
    description: 'Curso mais completo de Informática: Windows 11, Office avançado, Excel com VBA, ambientes digitais, Canva e IA aplicada. 184+ horas de conteúdo prático. Certificação inclusa.',
    keywords: ['informática completa', 'windows 11', 'office avançado', 'excel vba', 'inteligência artificial', 'canva', 'ambientes digitais'],
    ogImage: '/og-images/informatica.jpg',
    ogType: 'website',
  },
};

// Curso 4: Projetista 3D
const projetista3d = {
  basicInfo: {
    id: 'projetista-3d-004',
    title: 'Projetista 3D',
    slug: 'projetista-3d',
    shortDescription: 'Domine AutoCAD, SketchUp, V-Ray e Enscape para criar projetos arquitetônicos profissionais.',
    longDescription: 'Torne-se um Projetista 3D completo. Aprenda AutoCAD técnico, SketchUp para modelagem 3D, renderização realista com V-Ray e o revolucionário Enscape com inteligência artificial.',
    category: 'Arquitetura',
    level: 'Intermediário',
    duration: '88 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 1297,
    currentPrice: 697,
    discount: 46,
    installments: {
      max: 12,
      value: 69.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Arquiteto Rafael Miranda',
    bio: 'Arquiteto e urbanista com mais de 15 anos de experiência. Especialista em projetos residenciais e comerciais, domina as principais ferramentas 3D do mercado.',
    photo: '/instructors/rafael-miranda.jpg',
    experience: '15 anos',
    credentials: [
      'Arquiteto e Urbanista - UFRJ',
      'Certificação Autodesk AutoCAD Professional',
      'Especialista SketchUp Pro',
      'Instrutor certificado V-Ray',
      'Enscape AI Expert Certified',
      'Mais de 500 projetos executados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'AutoCAD Técnico',
      description: 'Desenho técnico 2D profissional para arquitetura e engenharia',
      lessons: [
        { id: 1, title: 'Introdução do programa e principais ferramentas', duration: '90 min', type: 'video' },
        { id: 2, title: 'Configuração do ambiente de desenho', duration: '90 min', type: 'video' },
        { id: 3, title: 'Comandos de desenho básicos', duration: '90 min', type: 'video' },
        { id: 4, title: 'Comandos de edição e modificação', duration: '90 min', type: 'video' },
        { id: 5, title: 'Trabalhando com layers (camadas)', duration: '90 min', type: 'video' },
        { id: 6, title: 'Dimensionamento e cotas', duration: '90 min', type: 'video' },
        { id: 7, title: 'Textos e anotações técnicas', duration: '90 min', type: 'video' },
        { id: 8, title: 'Blocos e bibliotecas', duration: '90 min', type: 'video' },
        { id: 9, title: 'Hachuras e preenchimentos', duration: '90 min', type: 'video' },
        { id: 10, title: 'Trabalhando com referências externas', duration: '90 min', type: 'video' },
        { id: 11, title: 'Layout e configuração de impressão', duration: '90 min', type: 'video' },
        { id: 12, title: 'Configuração de escala e viewport', duration: '90 min', type: 'video' },
        { id: 13, title: 'Criação de templates profissionais', duration: '90 min', type: 'video' },
        { id: 14, title: 'Plot e configuração de impressão', duration: '90 min', type: 'video' },
        { id: 15, title: 'Padronização ABNT e normas técnicas', duration: '90 min', type: 'video' },
        { id: 16, title: 'Comandos avançados e customização', duration: '90 min', type: 'video' },
        { id: 17, title: 'Projeto arquitetônico - Cortes e fachadas', duration: '90 min', type: 'project' },
        { id: 18, title: 'Detalhamento técnico e executivo', duration: '90 min', type: 'project' },
        { id: 19, title: 'Portfolio: Projeto técnico completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'SketchUp Pro',
      description: 'Modelagem 3D intuitiva e eficiente para arquitetura',
      lessons: [
        { id: 20, title: 'Interface e navegação 3D', duration: '90 min', type: 'video' },
        { id: 21, title: 'Ferramentas básicas de modelagem', duration: '90 min', type: 'video' },
        { id: 22, title: 'Criação de formas complexas', duration: '90 min', type: 'video' },
        { id: 23, title: 'Grupos e componentes', duration: '90 min', type:'video' },
        { id: 24, title: 'Materiais e texturas', duration: '90 min', type: 'video' },
        { id: 25, title: 'Importação de plantas 2D', duration: '90 min', type: 'video' },
        { id: 26, title: 'Modelagem arquitetônica - Estrutura', duration: '90 min', type: 'video' },
        { id: 27, title: 'Modelagem arquitetônica - Detalhes', duration: '90 min', type: 'video' },
        { id: 28, title: 'Biblioteca 3D Warehouse', duration: '90 min', type: 'video' },
        { id: 29, title: 'Scenes e animação', duration: '90 min', type: 'video' },
        { id: 30, title: 'Layout e apresentação 2D', duration: '90 min', type: 'video' },
        { id: 31, title: 'Extensões e plugins essenciais', duration: '90 min', type: 'video' },
        { id: 32, title: 'Modelagem de terreno e topografia', duration: '90 min', type: 'video' },
        { id: 33, title: 'Projeto residencial completo', duration: '90 min', type: 'project' },
        { id: 34, title: 'Projeto comercial 3D', duration: '90 min', type: 'project' },
        { id: 35, title: 'Portfolio: Apresentação arquitetônica', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'V-Ray Renderização',
      description: 'Renderização fotorrealística para arquitetura',
      lessons: [
        { id: 36, title: 'Configuração do V-Ray no SketchUp', duration: '90 min', type: 'video' },
        { id: 37, title: 'Materiais V-Ray básicos', duration: '90 min', type: 'video' },
        { id: 38, title: 'Iluminação natural e artificial', duration: '90 min', type: 'video' },
        { id: 39, title: 'Configurações de render', duration: '90 min', type: 'video' },
        { id: 40, title: 'Câmeras e composição', duration: '90 min', type: 'video' },
        { id: 41, title: 'Materiais avançados (vidro, metal, madeira)', duration: '90 min', type: 'video' },
        { id: 42, title: 'Ambiente externo e HDRI', duration: '90 min', type: 'video' },
        { id: 43, title: 'Pós-produção básica', duration: '90 min', type: 'video' },
        { id: 44, title: 'Render de interiores fotorrealístico', duration: '90 min', type: 'project' },
        { id: 45, title: 'Render de fachada profissional', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'Enscape - Renderização com IA ⭐',
      description: 'O futuro da visualização arquitetônica: renderização instantânea com inteligência artificial',
      lessons: [
        { id: 46, title: 'Introdução ao Enscape e integração SketchUp', duration: '120 min', type: 'video' },
        { id: 47, title: 'Renderização em tempo real', duration: '120 min', type: 'video' },
        { id: 48, title: 'Materiais inteligentes e biblioteca IA', duration: '120 min', type: 'video' },
        { id: 49, title: 'Iluminação automática com IA', duration: '120 min', type: 'video' },
        { id: 50, title: 'Realidade Virtual (VR) para clientes', duration: '120 min', type: 'video' },
        { id: 51, title: 'Panoramas 360° interativos', duration: '120 min', type: 'video' },
        { id: 52, title: 'Videos e animações automáticas', duration: '120 min', type: 'video' },
        { id: 53, title: 'Vegetação e paisagismo com IA', duration: '120 min', type: 'video' },
        { id: 54, title: 'Ambientação automática de interiores', duration: '120 min', type: 'video' },
        { id: 55, title: 'Configurações avançadas de qualidade', duration: '120 min', type: 'video' },
        { id: 56, title: 'Integração com nuvem e compartilhamento', duration: '120 min', type: 'video' },
        { id: 57, title: 'Projeto Final: Apresentação VR completa', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ AutoCAD técnico para projetos executivos',
    '✅ SketchUp Pro para modelagem 3D rápida',
    '✅ V-Ray para renderização fotorrealística',
    '✅ Enscape: renderização instantânea com IA',
    '✅ Realidade Virtual (VR) para apresentações',
    '✅ Panoramas 360° interativos',
    '✅ Workflow completo de projeto 3D',
    '✅ Portfolio profissional de arquitetura',
    '✅ Normas ABNT e padrões técnicos',
    '✅ Preparação para mercado arquitetônico'
  ],
  requirements: [
    'Computador com Windows 10/11',
    '16GB de RAM (mínimo 8GB)',
    'Placa de vídeo dedicada (NVIDIA recomendada)',
    'SSD com 50GB livres',
    'Licenças dos softwares (orientação inclusa)',
    'Conhecimentos básicos de desenho técnico'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Marina Souza',
      role: 'Arquiteta',
      photo: '/testimonials/marina-souza.jpg',
      rating: 5,
      text: 'Consegui meu primeiro emprego em escritório de arquitetura 3 meses após o curso. Enscape impressionou os clientes!',
      result: 'Emprego em escritório de arquitetura'
    },
    {
      id: 2,
      name: 'Eduardo Santos',
      role: 'Projetista Freelancer',
      photo: '/testimonials/eduardo-santos.jpg',
      rating: 5,
      text: 'Como freelancer, ganho R$ 15.000/mês fazendo projetos 3D. O Enscape me fez ganhar 5x mais rápido!',
      result: 'Renda de R$ 15.000/mês'
    },
    {
      id: 3,
      name: 'Camila Lima',
      role: 'Designer de Interiores',
      photo: '/testimonials/camila-lima.jpg',
      rating: 5,
      text: 'Meus clientes ficam impressionados com as apresentações em VR. Fechei 90% mais contratos!',
      result: '90% mais contratos fechados'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio em AutoCAD?',
      answer: 'Não! Começamos do absoluto zero, ensinando desde os comandos básicos até projetos executivos profissionais.'
    },
    {
      id: 2,
      question: 'O que é o Enscape e como a IA ajuda na renderização?',
      answer: 'Enscape é uma ferramenta que renderiza em tempo real usando IA para otimizar iluminação, materiais e ambientação automaticamente.'
    },
    {
      id: 3,
      question: 'Vou conseguir trabalhar como projetista após o curso?',
      answer: 'Sim! Muitos alunos conseguem trabalho em escritórios ou como freelancers entre 3-6 meses, com portfolio completo.'
    },
    {
      id: 4,
      question: 'Como funciona a apresentação em Realidade Virtual?',
      answer: 'Com Enscape, você cria experiências VR onde clientes "caminham" dentro do projeto usando óculos VR ou pelo computador.'
    }
  ],
  themeColors: {
    primary: '#795548',
    secondary: '#8D6E63',
    accent: '#BCAAA4',
    gradient: {
      from: '#795548',
      to: '#8D6E63',
    },
  },
  seoMeta: {
    title: 'Curso Projetista 3D Completo - Escola Habilidade | AutoCAD, SketchUp, V-Ray, Enscape',
    description: 'Torne-se Projetista 3D profissional. AutoCAD técnico, SketchUp, V-Ray e Enscape com IA. 88 horas, VR incluso.',
    keywords: ['projetista 3d', 'autocad', 'sketchup', 'vray', 'enscape', 'arquitetura', 'realidade virtual'],
    ogImage: '/og-images/projetista-3d.jpg',
    ogType: 'website',
  },
};

// Curso 5: Programação
const programacao = {
  basicInfo: {
    id: 'programacao-005',
    title: 'Programação',
    slug: 'programacao',
    shortDescription: 'Aprenda programação do zero ao avançado: Python, Java, PHP, Android e Cursor IA.',
    longDescription: 'Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e o revolucionário Cursor com IA. Do zero ao primeiro emprego como programador.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '118 horas',
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
    bio: 'Desenvolvedor Full-Stack Senior com 12+ anos de experiência. Especialista em múltiplas linguagens e IA para desenvolvimento. Formou mais de 3.000 programadores.',
    photo: '/instructors/rodrigo-oliveira.jpg',
    experience: '12 anos',
    credentials: [
      'Engenheiro de Software - USP',
      'Especialista Full-Stack (Python, Java, PHP)',
      'Certificação em Desenvolvimento Android',
      'Cursor AI Expert Certified',
      'Mais de 3.000 devs formados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Lógica de Programação',
      description: 'Fundamentos lógicos para qualquer linguagem de programação',
      lessons: [
        { id: 1, title: 'Fundamentos lógicos para qualquer linguagem', duration: '90 min', type: 'video' },
        { id: 2, title: 'Tipos de dados essenciais', duration: '90 min', type: 'video' },
        { id: 3, title: 'Fluxogramas e diagramas', duration: '90 min', type: 'video' },
        { id: 4, title: 'Pseudocódigo e algoritmos', duration: '90 min', type: 'video' },
        { id: 5, title: 'Estruturas condicionais', duration: '90 min', type: 'video' },
        { id: 6, title: 'Estruturas de repetição', duration: '90 min', type: 'video' },
        { id: 7, title: 'Funções e procedimentos', duration: '90 min', type: 'video' },
        { id: 8, title: 'Resolução de problemas práticos', duration: '90 min', type: 'exercise' },
        { id: 9, title: 'Preparação para linguagens específicas', duration: '90 min', type: 'video' },
        { id: 10, title: 'Projeto: Algoritmo completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Python Completo',
      description: 'Python do básico ao avançado para desenvolvimento profissional',
      lessons: [
        { id: 11, title: 'Iniciando no Python (instalação e primeiras sintaxes)', duration: '90 min', type: 'video' },
        { id: 12, title: 'Entrada e saída de dados', duration: '90 min', type: 'video' },
        { id: 13, title: 'Estruturas condicionais (if, else, elif)', duration: '90 min', type: 'video' },
        { id: 14, title: 'Loops (for, while)', duration: '90 min', type: 'video' },
        { id: 15, title: 'Tipos de dados fundamentais (listas, strings, dicionários)', duration: '90 min', type: 'video' },
        { id: 16, title: 'Criação de funções', duration: '90 min', type: 'video' },
        { id: 17, title: 'Tratamento de erros (exceções)', duration: '90 min', type: 'video' },
        { id: 18, title: 'Módulos e pacotes', duration: '90 min', type: 'video' },
        { id: 19, title: 'Programação orientada a objetos básica', duration: '90 min', type: 'video' },
        { id: 20, title: 'Classes e objetos avançados', duration: '90 min', type: 'video' },
        { id: 21, title: 'Manipulação de arquivos', duration: '90 min', type: 'video' },
        { id: 22, title: 'Uso de bibliotecas externas', duration: '90 min', type: 'video' },
        { id: 23, title: 'Trabalhando com datas e horas', duration: '90 min', type: 'video' },
        { id: 24, title: 'Introdução a expressões regulares', duration: '90 min', type: 'video' },
        { id: 25, title: 'APIs e requisições web', duration: '90 min', type: 'video' },
        { id: 26, title: 'Projeto final integrando conceitos', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Java Desenvolvimento',
      description: 'Java para aplicações robustas e empresariais',
      lessons: [
        { id: 27, title: 'Introdução ao Java e configuração do ambiente', duration: '90 min', type: 'video' },
        { id: 28, title: 'Uso de interface e componentes básicos', duration: '90 min', type: 'video' },
        { id: 29, title: 'Variáveis e operadores (matemáticos e relacionais)', duration: '90 min', type: 'video' },
        { id: 30, title: 'Estruturas de controle de fluxo (if/else, loops)', duration: '90 min', type: 'video' },
        { id: 31, title: 'Manipulação de strings', duration: '90 min', type: 'video' },
        { id: 32, title: 'Arrays (variáveis compostas)', duration: '90 min', type: 'video' },
        { id: 33, title: 'Orientação a objetos (classes, métodos, atributos)', duration: '90 min', type: 'video' },
        { id: 34, title: 'Encapsulamento e modificadores', duration: '90 min', type: 'video' },
        { id: 35, title: 'Vetores e coleções', duration: '90 min', type: 'video' },
        { id: 36, title: 'Conceitos de herança e polimorfismo', duration: '90 min', type: 'video' },
        { id: 37, title: 'Interface gráfica (construção de GUI)', duration: '90 min', type: 'video' },
        { id: 38, title: 'Tratamento de exceções', duration: '90 min', type: 'video' },
        { id: 39, title: 'Conexão com banco de dados', duration: '90 min', type: 'video' },
        { id: 40, title: 'Desenvolvimento de pequenos projetos', duration: '90 min', type: 'video' },
        { id: 41, title: 'NetBeans e ferramentas de desenvolvimento', duration: '90 min', type: 'video' },
        { id: 42, title: 'Projeto empresarial completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'Programação PHP',
      description: 'PHP para desenvolvimento web e sistemas dinâmicos',
      lessons: [
        { id: 43, title: 'Sintaxe básica do PHP', duration: '90 min', type: 'video' },
        { id: 44, title: 'Variáveis e tipos de dados', duration: '90 min', type: 'video' },
        { id: 45, title: 'Estruturas de controle', duration: '90 min', type: 'video' },
        { id: 46, title: 'Funções e arrays em PHP', duration: '90 min', type: 'video' },
        { id: 47, title: 'Formulários HTML e método POST/GET', duration: '90 min', type: 'video' },
        { id: 48, title: 'Processamento de formulários', duration: '90 min', type: 'video' },
        { id: 49, title: 'Introdução ao MySQL', duration: '90 min', type: 'video' },
        { id: 50, title: 'Interação com MySQL - Conexão', duration: '90 min', type: 'video' },
        { id: 51, title: 'CRUD - Criar dados', duration: '90 min', type: 'video' },
        { id: 52, title: 'CRUD - Ler dados', duration: '90 min', type: 'video' },
        { id: 53, title: 'CRUD - Atualizar dados', duration: '90 min', type: 'video' },
        { id: 54, title: 'CRUD - Deletar dados', duration: '90 min', type: 'video' },
        { id: 55, title: 'Sessões e autenticação', duration: '90 min', type: 'video' },
        { id: 56, title: 'Sistema de login completo', duration: '90 min', type: 'video' },
        { id: 57, title: 'Validação e segurança', duration: '90 min', type: 'video' },
        { id: 58, title: 'Upload de arquivos', duration: '90 min', type: 'video' },
        { id: 59, title: 'Paginação e filtros', duration: '90 min', type: 'video' },
        { id: 60, title: 'Projeto: Portal de notícias', duration: '90 min', type: 'project' },
        { id: 61, title: 'Deploy e hospedagem', duration: '90 min', type: 'video' },
        { id: 62, title: 'Portfolio: Sistema web completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 5,
      title: 'Desenvolvedor de Aplicativos Android',
      description: 'Desenvolvimento de apps nativos para Android',
      lessons: [
        { id: 63, title: 'Configuração do ambiente Android Studio', duration: '90 min', type: 'video' },
        { id: 64, title: 'Primeira aplicação Android', duration: '90 min', type: 'video' },
        { id: 65, title: 'Fundamentos de UI/UX em Android', duration: '90 min', type: 'video' },
        { id: 66, title: 'Layouts e Views', duration: '90 min', type: 'video' },
        { id: 67, title: 'Manipulação de componentes (botões, texto)', duration: '90 min', type: 'video' },
        { id: 68, title: 'Eventos e interatividade', duration: '90 min', type: 'video' },
        { id: 69, title: 'Navegação entre telas (Activities)', duration: '90 min', type: 'video' },
        { id: 70, title: 'Intents e passagem de dados', duration: '90 min', type: 'video' },
        { id: 71, title: 'Armazenamento com SQLite', duration: '90 min', type: 'video' },
        { id: 72, title: 'SharedPreferences e configurações', duration: '90 min', type: 'video' },
        { id: 73, title: 'Acesso aos recursos do dispositivo', duration: '90 min', type: 'video' },
        { id: 74, title: 'Usando sensores e câmera', duration: '90 min', type: 'video' },
        { id: 75, title: 'Notificações e serviços', duration: '90 min', type: 'video' },
        { id: 76, title: 'Integração com APIs', duration: '90 min', type: 'video' },
        { id: 77, title: 'Testes e debugging', duration: '90 min', type: 'video' },
        { id: 78, title: 'Publicação básica de aplicativos', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 6,
      title: 'Cursor - Editor de Código com IA ⭐',
      description: 'O futuro da programação: desenvolvimento acelerado por inteligência artificial',
      lessons: [
        { id: 79, title: 'Introdução ao Desenvolvimento com IA', duration: '120 min', type: 'video' },
        { id: 80, title: 'Geração e Edição de Código com Prompts', duration: '120 min', type: 'video' },
        { id: 81, title: 'Chat com a Base de Código (Codebase-Aware Chat)', duration: '120 min', type: 'video' },
        { id: 82, title: 'Debugging e Correções com um Clique', duration: '120 min', type: 'video' },
        { id: 83, title: 'Gerando Documentação e Comentários', duration: '120 min', type: 'video' },
        { id: 84, title: 'Refatoração de Código com IA', duration: '120 min', type: 'video' },
        { id: 85, title: 'Migrando e Entendendo Código Legado', duration: '120 min', type: 'video' },
        { id: 86, title: 'Projeto Prático - Construindo uma Funcionalidade', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Lógica de programação sólida para qualquer linguagem',
    '✅ Python completo para desenvolvimento web e automação',
    '✅ Java para aplicações empresariais robustas',
    '✅ PHP para sistemas web dinâmicos com MySQL',
    '✅ Desenvolvimento de aplicativos Android nativos',
    '✅ Cursor: programação assistida por IA revolucionária',
    '✅ CRUD completo e banco de dados',
    '✅ Portfolio com 6 projetos reais',
    '✅ Preparação completa para o mercado de trabalho',
    '✅ Do zero ao primeiro emprego como programador'
  ],
  requirements: [
    'Computador com Windows, Mac ou Linux',
    '8GB de RAM mínimo (recomendado 16GB)',
    'Conexão estável com internet',
    'Inglês básico (recomendado)',
    'Dedicação de 15-20 horas semanais',
    'Vontade de resolver problemas lógicos'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Gabriel Santos',
      role: 'Desenvolvedor Jr.',
      photo: '/testimonials/gabriel-santos.jpg',
      rating: 5,
      text: 'Saí do zero e consegui meu primeiro emprego como dev em 8 meses! O Cursor revolucionou minha produtividade.',
      result: 'Primeiro emprego como dev'
    },
    {
      id: 2,
      name: 'Ana Beatriz',
      role: 'Freelancer Full-Stack',
      photo: '/testimonials/ana-beatriz.jpg',
      rating: 5,
      text: 'Hoje trabalho como freelancer full-stack e ganho R$ 12.000/mês. Domino Python, Java, PHP e Android!',
      result: 'Renda de R$ 12.000/mês'
    },
    {
      id: 3,
      name: 'Carlos Eduardo',
      role: 'Desenvolvedor Android',
      photo: '/testimonials/carlos-eduardo.jpg',
      rating: 5,
      text: 'Meu app desenvolvido no curso tem mais de 50.000 downloads na Play Store!',
      result: 'App com 50K+ downloads'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio em programação?',
      answer: 'Não! Começamos do absoluto zero com lógica de programação e evoluímos gradualmente até linguagens avançadas.'
    },
    {
      id: 2,
      question: 'Quanto tempo para conseguir o primeiro emprego?',
      answer: 'Nossos alunos conseguem o primeiro emprego entre 6-12 meses, dependendo da dedicação e projetos desenvolvidos.'
    },
    {
      id: 3,
      question: 'O que é o Cursor e por que é revolucionário?',
      answer: 'Cursor é um editor que usa IA para escrever, corrigir e explicar código automaticamente. É o futuro da programação!'
    },
    {
      id: 4,
      question: 'Vou conseguir criar aplicativos para Android?',
      answer: 'Sim! Ensinamos desde o básico até publicação na Play Store. Muitos alunos já têm apps publicados.'
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
    title: 'Curso de Programação Completo - Escola Habilidade | Python, Java, PHP, Android, Cursor IA',
    description: 'Torne-se Programador Full-Stack. Curso completo: Lógica, Python, Java, PHP, Android e Cursor IA. Do zero ao primeiro emprego. 118 horas práticas.',
    keywords: ['programação', 'python', 'java', 'php', 'android', 'cursor ai', 'full-stack', 'desenvolvedor'],
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
    shortDescription: 'Estratégias completas de marketing digital: Google Ads, Facebook Ads, conteúdo e funis de vendas.',
    longDescription: 'Torne-se um especialista em Marketing Digital. Aprenda estratégias completas: Google Ads, Facebook Ads, Marketing de Conteúdo, funis de vendas e automação para gerar resultados reais.',
    category: 'Marketing',
    level: 'Intermediário',
    duration: '60 horas',
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
    name: 'Digital Marketer Bruno Alves',
    bio: 'Especialista em Marketing Digital há mais de 8 anos. Gerenciou mais de R$ 50 milhões em mídia paga e ajudou centenas de empresas a aumentarem suas vendas online.',
    photo: '/instructors/bruno-alves.jpg',
    experience: '8 anos',
    credentials: [
      'Certificação Google Ads Expert',
      'Facebook Blueprint Certified',
      'Especialista em Growth Marketing',
      'Gestor de + R$ 50 milhões em mídia paga',
      'Consultor de grandes marcas'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos do Marketing Digital',
      description: 'Base estratégica para dominar o marketing online',
      lessons: [
        { id: 1, title: 'Funil de vendas e funil de valor', duration: '90 min', type: 'video' },
        { id: 2, title: 'Persona e público-alvo', duration: '90 min', type: 'video' },
        { id: 3, title: 'Análise de concorrência', duration: '90 min', type: 'video' },
        { id: 4, title: 'Posicionamento de marca digital', duration: '90 min', type: 'video' },
        { id: 5, title: 'Métricas e KPIs essenciais', duration: '90 min', type: 'video' },
        { id: 6, title: 'Google Analytics setup completo', duration: '90 min', type: 'video' },
        { id: 7, title: 'Facebook Business Manager', duration: '90 min', type: 'video' },
        { id: 8, title: 'Pixel do Facebook e conversões', duration: '90 min', type: 'video' },
        { id: 9, title: 'Estratégia multicanal', duration: '90 min', type: 'video' },
        { id: 10, title: 'Budget e planejamento de investimento', duration: '90 min', type: 'video' },
        { id: 11, title: 'Landing pages que convertem', duration: '90 min', type: 'video' },
        { id: 12, title: 'A/B Testing e otimização', duration: '90 min', type: 'video' },
        { id: 13, title: 'Marketing automation básico', duration: '90 min', type: 'video' },
        { id: 14, title: 'CRM e gestão de leads', duration: '90 min', type: 'video' },
        { id: 15, title: 'Projeto: Estratégia digital completa', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Google Ads Profissional',
      description: 'Domínio completo da maior plataforma de anúncios do mundo',
      lessons: [
        { id: 16, title: 'Configuração de conta Google Ads', duration: '90 min', type: 'video' },
        { id: 17, title: 'Palavras-chave e pesquisa de mercado', duration: '90 min', type: 'video' },
        { id: 18, title: 'Campanhas de Pesquisa (Search)', duration: '90 min', type: 'video' },
        { id: 19, title: 'Anúncios de Display eficazes', duration: '90 min', type: 'video' },
        { id: 20, title: 'YouTube Ads e vídeo marketing', duration: '90 min', type: 'video' },
        { id: 21, title: 'Google Shopping para e-commerce', duration: '90 min', type: 'video' },
        { id: 22, title: 'Campanhas de remarketing', duration: '90 min', type: 'video' },
        { id: 23, title: 'Extensões de anúncios', duration: '90 min', type: 'video' },
        { id: 24, title: 'Otimização e Quality Score', duration: '90 min', type: 'video' },
        { id: 25, title: 'Análise de dados e relatórios', duration: '90 min', type: 'video' },
        { id: 26, title: 'Scripts e automatizações', duration: '90 min', type: 'video' },
        { id: 27, title: 'Projeto: Campanha Google Ads completa', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Facebook e Instagram Ads',
      description: 'Estratégias avançadas para redes sociais que mais convertem',
      lessons: [
        { id: 28, title: 'Facebook Business Suite completo', duration: '90 min', type: 'video' },
        { id: 29, title: 'Segmentação avançada de público', duration: '90 min', type: 'video' },
        { id: 30, title: 'Criação de campanhas Facebook', duration: '90 min', type: 'video' },
        { id: 31, title: 'Instagram Ads e Stories', duration: '90 min', type: 'video' },
        { id: 32, title: 'Criativos que convertem', duration: '90 min', type: 'video' },
        { id: 33, title: 'Lookalike Audiences', duration: '90 min', type: 'video' },
        { id: 34, title: 'Retargeting e funis complexos', duration: '90 min', type: 'video' },
        { id: 35, title: 'Messenger Ads e chat marketing', duration: '90 min', type: 'video' },
        { id: 36, title: 'Otimização de campanhas', duration: '90 min', type: 'video' },
        { id: 37, title: 'Escala e budget dinâmico', duration: '90 min', type: 'video' },
        { id: 38, title: 'Análise e atribuição', duration: '90 min', type: 'video' },
        { id: 39, title: 'Projeto: Campanha Facebook Ads ROI+', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'Marketing de Conteúdo e Automação',
      description: 'Estratégias de conteúdo que geram leads e vendas',
      lessons: [
        { id: 40, title: 'Estratégia de conteúdo digital', duration: '90 min', type: 'video' },
        { id: 41, title: 'SEO para marketing de conteúdo', duration: '90 min', type: 'video' },
        { id: 42, title: 'Blog corporativo que converte', duration: '90 min', type: 'video' },
        { id: 43, title: 'E-mail marketing profissional', duration: '90 min', type: 'video' },
        { id: 44, title: 'Automação de marketing', duration: '90 min', type: 'video' },
        { id: 45, title: 'Lead magnets e iscas digitais', duration: '90 min', type: 'video' },
        { id: 46, title: 'Nutrição de leads', duration: '90 min', type: 'video' },
        { id: 47, title: 'WhatsApp Business e automação', duration: '90 min', type: 'video' },
        { id: 48, title: 'Influencer marketing', duration: '90 min', type: 'video' },
        { id: 49, title: 'Marketing de afiliados', duration: '90 min', type: 'video' },
        { id: 50, title: 'Webinars e eventos online', duration: '90 min', type: 'video' },
        { id: 51, title: 'Growth hacking aplicado', duration: '90 min', type: 'video' },
        { id: 52, title: 'Métricas avançadas e ROI', duration: '90 min', type: 'video' },
        { id: 53, title: 'Relatórios executivos', duration: '90 min', type: 'video' },
        { id: 54, title: 'Projeto Final: Campanha 360° completa', duration: '90 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Google Ads com certificação profissional',
    '✅ Facebook e Instagram Ads avançado',
    '✅ Funis de vendas que convertem',
    '✅ Marketing de conteúdo estratégico',
    '✅ E-mail marketing e automação',
    '✅ Analytics e métricas avançadas',
    '✅ SEO aplicado ao marketing',
    '✅ Growth hacking e escala',
    '✅ WhatsApp Business automação',
    '✅ Portfolio com resultados reais'
  ],
  requirements: [
    'Computador com Windows, Mac ou Linux',
    'Conexão estável com internet',
    'Conta Google (Gmail)',
    'Conta Facebook pessoal',
    'Orçamento inicial para testes (R$ 300-500)',
    'Conhecimentos básicos de informática'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Fernanda Costa',
      role: 'E-commerce Owner',
      photo: '/testimonials/fernanda-costa.jpg',
      rating: 5,
      text: 'Meu e-commerce saiu de R$ 50K para R$ 300K/mês aplicando as estratégias do curso!',
      result: 'Faturamento de R$ 50K → R$ 300K/mês'
    },
    {
      id: 2,
      name: 'Ricardo Mendes',
      role: 'Gestor de Tráfego',
      photo: '/testimonials/ricardo-mendes.jpg',
      rating: 5,
      text: 'Me tornei gestor de tráfego e ganho R$ 12.000/mês gerenciando campanhas para empresas.',
      result: 'Renda de R$ 12.000/mês'
    },
    {
      id: 3,
      name: 'Juliana Silva',
      role: 'Agência de Marketing',
      photo: '/testimonials/juliana-silva.jpg',
      rating: 5,
      text: 'Abri minha agência de marketing digital e já faturei R$ 500K no primeiro ano!',
      result: 'Agência faturando R$ 500K/ano'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso investir dinheiro em anúncios para aprender?',
      answer: 'Sim, recomendamos R$ 300-500 para testes práticos. Ensinamos como otimizar cada centavo investido.'
    },
    {
      id: 2,
      question: 'Funciona para qualquer tipo de negócio?',
      answer: 'Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos, profissionais liberais e empresas B2B.'
    },
    {
      id: 3,
      question: 'Vou conseguir trabalhar como gestor de tráfego?',
      answer: 'Sim! Muitos alunos se tornam gestores de tráfego freelancers ou em agências, ganhando R$ 8-15K/mês.'
    },
    {
      id: 4,
      question: 'Como comprovo os resultados para clientes?',
      answer: 'Ensinamos a criar relatórios profissionais com métricas, ROI e dashboards que impressionam clientes.'
    }
  ],
  themeColors: {
    primary: '#3F51B5',
    secondary: '#5C6BC0',
    accent: '#7986CB',
    gradient: {
      from: '#3F51B5',
      to: '#5C6BC0',
    },
  },
  seoMeta: {
    title: 'Curso Marketing Digital Completo - Escola Habilidade | Google Ads, Facebook Ads, Tráfego Pago',
    description: 'Torne-se especialista em Marketing Digital. Google Ads, Facebook Ads, funis de vendas e automação. 60 horas práticas com resultados reais.',
    keywords: ['marketing digital', 'google ads', 'facebook ads', 'tráfego pago', 'funil de vendas', 'gestor de tráfego'],
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
    shortDescription: 'Domine Flowlabs, ElevenLabs, HatchCanvas e ferramentas IA revolucionárias para criação de conteúdo.',
    longDescription: 'Curso prático de Inteligência Artificial focado em criação de conteúdo. Aprenda Flowlabs para fluxos IA, ElevenLabs para voz sintética, HatchCanvas para design, e como aplicar IA criativa no seu negócio.',
    category: 'Tecnologia',
    level: 'Intermediário',
    duration: '39 horas',
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
    name: 'Especialista IA Camila Torres',
    bio: 'Especialista em IA Criativa com 8+ anos de experiência. Expert certificada em Flowlabs, ElevenLabs e HatchCanvas. Criou mais de 10.000 conteúdos usando IA.',
    photo: '/instructors/camila-torres.jpg',
    experience: '8 anos',
    credentials: [
      'Especialista em IA Criativa',
      'Certificação Flowlabs Expert',
      'ElevenLabs Voice AI Certified',
      'HatchCanvas Design Professional',
      'Mais de 10.000 conteúdos IA criados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Flowlabs - Automação IA Inteligente ⭐',
      description: 'Criação de fluxos automatizados com inteligência artificial',
      lessons: [
        { id: 1, title: 'Introdução ao Flowlabs e IA de fluxos', duration: '90 min', type: 'video' },
        { id: 2, title: 'Configuração de conta e primeiros fluxos', duration: '90 min', type: 'video' },
        { id: 3, title: 'Automação de tarefas com IA', duration: '90 min', type: 'video' },
        { id: 4, title: 'Integração com outras ferramentas', duration: '90 min', type: 'video' },
        { id: 5, title: 'Fluxos complexos multi-etapas', duration: '90 min', type: 'video' },
        { id: 6, title: 'Monitoramento e otimização', duration: '90 min', type: 'video' },
        { id: 7, title: 'Templates e bibliotecas', duration: '90 min', type: 'video' },
        { id: 8, title: 'Projeto: Sistema de automação completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'ElevenLabs - Síntese de Voz com IA ⭐',
      description: 'Criação de vozes sintéticas realistas e personalizadas',
      lessons: [
        { id: 9, title: 'Fundamentos da síntese de voz IA', duration: '90 min', type: 'video' },
        { id: 10, title: 'Interface ElevenLabs e configurações', duration: '90 min', type: 'video' },
        { id: 11, title: 'Clonagem de voz personalizada', duration: '90 min', type: 'video' },
        { id: 12, title: 'Geração de áudio profissional', duration: '90 min', type: 'video' },
        { id: 13, title: 'Controle de emoção e entonação', duration: '90 min', type: 'video' },
        { id: 14, title: 'Integração com outras plataformas', duration: '90 min', type: 'video' },
        { id: 15, title: 'Otimização de qualidade e performance', duration: '90 min', type: 'video' },
        { id: 16, title: 'Projeto: Criação de podcast com IA', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'HatchCanvas - Design Gráfico com IA ⭐',
      description: 'Criação de designs profissionais usando inteligência artificial',
      lessons: [
        { id: 17, title: 'Introdução ao design com IA', duration: '90 min', type: 'video' },
        { id: 18, title: 'Interface HatchCanvas e ferramentas', duration: '90 min', type: 'video' },
        { id: 19, title: 'Geração automática de layouts', duration: '90 min', type: 'video' },
        { id: 20, title: 'Personalização de designs IA', duration: '90 min', type: 'video' },
        { id: 21, title: 'Templates inteligentes e bibliotecas', duration: '90 min', type: 'video' },
        { id: 22, title: 'Otimização para diferentes formatos', duration: '90 min', type: 'video' },
        { id: 23, title: 'Integração com fluxos de trabalho', duration: '90 min', type: 'video' },
        { id: 24, title: 'Projeto: Identidade visual completa com IA', duration: '90 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Flowlabs: automação inteligente com IA',
    '✅ ElevenLabs: síntese de voz profissional',
    '✅ HatchCanvas: design gráfico automatizado',
    '✅ Integração entre ferramentas IA',
    '✅ Workflows criativos otimizados',
    '✅ Criação de conteúdo em escala',
    '✅ Monetização de serviços IA',
    '✅ Portfolio com projetos reais'
  ],
  requirements: [
    'Computador com Windows, Mac ou Linux',
    'Conexão estável com internet de alta velocidade',
    'Conta Google para integrações',
    'Inglês básico (interface das ferramentas)',
    'Criatividade e vontade de inovar'
  ],
  testimonials: [
    {
      id: 1,
      name: 'Leonardo Costa',
      role: 'Creator de Conteúdo',
      photo: '/testimonials/leonardo-costa.jpg',
      rating: 5,
      text: 'Com IA criei 1000+ posts automaticamente e aumentei minha produtividade em 500%!',
      result: 'Produtividade +500%'
    },
    {
      id: 2,
      name: 'Fernanda Oliveira',
      role: 'Agência Digital',
      photo: '/testimonials/fernanda-oliveira.jpg',
      rating: 5,
      text: 'Minha agência oferece serviços IA e triplicou o faturamento em 6 meses!',
      result: 'Faturamento x3 em 6 meses'
    },
    {
      id: 3,
      name: 'Carlos Mendes',
      role: 'Freelancer IA',
      photo: '/testimonials/carlos-mendes.jpg',
      rating: 5,
      text: 'Me especializei em IA e agora ganho R$ 20.000/mês como consultor!',
      result: 'Renda de R$ 20.000/mês'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso conhecimento técnico em programação?',
      answer: 'Não! As ferramentas são visuais e intuitivas. Ensinamos tudo do zero, focado no uso prático.'
    },
    {
      id: 2,
      question: 'Como a IA vai impactar meu negócio?',
      answer: 'IA pode automatizar 80% das tarefas criativas, permitindo focar no estratégico e crescer exponencialmente.'
    },
    {
      id: 3,
      question: 'Essas ferramentas são pagas?',
      answer: 'Sim, mas orientamos sobre planos ideais para cada caso e como monetizar rapidamente o investimento.'
    },
    {
      id: 4,
      question: 'Vou conseguir competir com quem já usa IA?',
      answer: 'Sim! O curso te coloca no mesmo nível dos specialists em IA, com estratégias avançadas exclusivas.'
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
    title: 'Curso Inteligência Artificial - Escola Habilidade | Flowlabs, ElevenLabs, HatchCanvas IA',
    description: 'Domine IA criativa com Flowlabs, ElevenLabs e HatchCanvas. 39 horas práticas para criar conteúdo automatizado e monetizar IA.',
    keywords: ['inteligência artificial', 'flowlabs', 'elevenlabs', 'hatchcanvas', 'ia criativa', 'automação'],
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
    shortDescription: 'Domine Power BI, SQL, Excel e revolucionário Dashboard IA para análise inteligente de dados.',
    longDescription: 'Curso completo de Business Intelligence com IA. Domine Power BI, SQL, Excel avançado e o inovador Dashboard IA para transformar dados em insights estratégicos automaticamente.',
    category: 'Análise de Dados',
    level: 'Intermediário',
    duration: '62,5 horas',
    certificate: true,
    active: true,
  },
  investment: {
    originalPrice: 997,
    currentPrice: 697,
    discount: 30,
    installments: {
      max: 12,
      value: 69.70,
    },
    paymentMethods: ['Cartão de crédito', 'Boleto', 'PIX', 'Parcelamento'],
  },
  instructor: {
    name: 'Especialista BI André Campos',
    bio: 'Especialista em Business Intelligence com 12+ anos de experiência. Expert em Dashboard IA e análise preditiva. Consultor sênior para Fortune 500.',
    photo: '/instructors/andre-campos.jpg',
    experience: '12 anos',
    credentials: [
      'MBA em Business Intelligence & Analytics',
      'Microsoft Power BI Expert Certified',
      'Dashboard IA Specialist',
      'Consultor BI Senior para Fortune 500',
      'Mais de 200 dashboards implementados'
    ],
  },
  curriculum: [
    {
      id: 1,
      title: 'Fundamentos de Business Intelligence',
      description: 'Base sólida em BI e análise de dados empresariais',
      lessons: [
        { id: 1, title: 'Introdução ao Business Intelligence', duration: '90 min', type: 'video' },
        { id: 2, title: 'Modelagem dimensional e Data Warehouse', duration: '90 min', type: 'video' },
        { id: 3, title: 'ETL e processos de integração', duration: '90 min', type: 'video' },
        { id: 4, title: 'KPIs e métricas estratégicas', duration: '90 min', type: 'video' },
        { id: 5, title: 'Governança de dados', duration: '90 min', type: 'video' },
        { id: 6, title: 'Storytelling com dados', duration: '90 min', type: 'video' },
        { id: 7, title: 'Projeto: Arquitetura BI básica', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Power BI Avançado',
      description: 'Dashboards profissionais e análises complexas',
      lessons: [
        { id: 8, title: 'Power BI Desktop interface avançada', duration: '90 min', type: 'video' },
        { id: 9, title: 'Modelagem de dados no Power BI', duration: '90 min', type: 'video' },
        { id: 10, title: 'DAX - Linguagem de fórmulas', duration: '90 min', type: 'video' },
        { id: 11, title: 'Medidas calculadas e colunas', duration: '90 min', type: 'video' },
        { id: 12, title: 'Visualizações avançadas', duration: '90 min', type: 'video' },
        { id: 13, title: 'Power BI Service e colaboração', duration: '90 min', type: 'video' },
        { id: 14, title: 'Segurança e permissionamento', duration: '90 min', type: 'video' },
        { id: 15, title: 'Power BI Mobile e alertas', duration: '90 min', type: 'video' },
        { id: 16, title: 'Integração com outras ferramentas', duration: '90 min', type: 'video' },
        { id: 17, title: 'Projeto: Dashboard executivo completo', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Dashboard IA - BI Agêntico ⭐',
      description: 'O futuro do BI: dashboards inteligentes que se atualizam automaticamente',
      lessons: [
        { id: 18, title: 'Introdução ao BI Agêntico com IA', duration: '120 min', type: 'video' },
        { id: 19, title: 'Configuração de Dashboard IA', duration: '120 min', type: 'video' },
        { id: 20, title: 'Análise preditiva automatizada', duration: '120 min', type: 'video' },
        { id: 21, title: 'Alertas inteligentes e anomalias', duration: '120 min', type: 'video' },
        { id: 22, title: 'Insights automáticos por IA', duration: '120 min', type: 'video' },
        { id: 23, title: 'Relatórios narrados por IA', duration: '120 min', type: 'video' },
        { id: 24, title: 'Integração com chatbots corporativos', duration: '120 min', type: 'video' },
        { id: 25, title: 'Projeto Final: Dashboard IA empresarial', duration: '120 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Power BI completo e avançado',
    '✅ SQL para análise de dados',
    '✅ Dashboard IA: BI agêntico revolucionário',
    '✅ Análise preditiva automatizada',
    '✅ Modelagem dimensional profissional',
    '✅ DAX e medidas calculadas',
    '✅ Storytelling com dados',
    '✅ Insights automáticos por IA',
    '✅ Governança e segurança de dados',
    '✅ Portfolio com projetos empresariais'
  ],
  requirements: [
    'Computador com Windows 10/11',
    '8GB de RAM mínimo (recomendado 16GB)',
    'Microsoft Excel instalado',
    'Power BI Desktop (gratuito)',
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
      text: 'Consegui promoção para Analista Sênior e aumento de 80% no salário com Dashboard IA!',
      result: 'Promoção e aumento de 80%'
    },
    {
      id: 2,
      name: 'Ricardo Pereira',
      role: 'Gerente de Dados',
      photo: '/testimonials/ricardo-pereira.jpg',
      rating: 5,
      text: 'Me tornei especialista em BI agêntico e agora lidero transformação digital na empresa.',
      result: 'Promoção a Gerente'
    },
    {
      id: 3,
      name: 'Marina Costa',
      role: 'Consultora BI',
      photo: '/testimonials/marina-costa.jpg',
      rating: 5,
      text: 'Como consultora em Dashboard IA, ganho R$ 18.000/mês implementando soluções inteligentes!',
      result: 'Renda de R$ 18.000/mês'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso conhecer programação para usar Dashboard IA?',
      answer: 'Não é obrigatório! Ensinamos SQL do básico e o Dashboard IA tem interface intuitiva.'
    },
    {
      id: 2,
      question: 'O que é BI Agêntico?',
      answer: 'É BI que usa IA para gerar insights automáticos, detectar anomalias e criar relatórios narrados sozinho.'
    },
    {
      id: 3,
      question: 'Qual diferencial do Dashboard IA?',
      answer: 'Ele monitora dados 24/7, aprende padrões automaticamente e alerta sobre oportunidades e riscos.'
    },
    {
      id: 4,
      question: 'Vou conseguir trabalhar como especialista BI?',
      answer: 'Sim! O mercado de BI com IA está explodindo e profissionais certificados ganham 50-100% mais.'
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
    title: 'Business Intelligence com IA - Escola Habilidade | Power BI, Dashboard IA, SQL',
    description: 'Torne-se especialista em Business Intelligence com IA. Power BI, Dashboard IA agêntico, SQL. 62,5 horas práticas com certificação.',
    keywords: ['business intelligence', 'power bi', 'dashboard ia', 'sql', 'bi agêntico', 'análise de dados'],
    ogImage: '/og-images/business-intelligence.jpg',
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
    duration: '96 horas',
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
        { id: 1, title: 'Teoria das cores', duration: '90 min', type: 'video' },
        { id: 2, title: 'Tipografia essencial', duration: '90 min', type: 'video' },
        { id: 3, title: 'Composição e hierarquia', duration: '90 min', type: 'video' },
        { id: 4, title: 'Análise de layouts', duration: '90 min', type: 'exercise' },
      ],
    },
    {
      id: 2,
      title: 'Adobe Photoshop Profissional',
      description: 'Edição e manipulação de imagens para design gráfico',
      lessons: [
        { id: 5, title: 'Interface e configurações básicas', duration: '90 min', type: 'video' },
        { id: 6, title: 'Ferramentas de seleção avançadas', duration: '90 min', type: 'video' },
        { id: 7, title: 'Camadas e efeitos especiais', duration: '90 min', type: 'video' },
        { id: 8, title: 'Tratamento e correção de imagens', duration: '90 min', type: 'video' },
        { id: 9, title: 'Composições e montagens', duration: '90 min', type: 'video' },
        { id: 10, title: 'Projeto: Banner publicitário', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Adobe Illustrator Vetorial',
      description: 'Criação de ilustrações e logotipos vetoriais',
      lessons: [
        { id: 11, title: 'Workspace e ferramentas vetoriais', duration: '90 min', type: 'video' },
        { id: 12, title: 'Desenho com pen tool e formas', duration: '90 min', type: 'video' },
        { id: 13, title: 'Cores, gradientes e padrões', duration: '90 min', type: 'video' },
        { id: 14, title: 'Tipografia criativa', duration: '90 min', type: 'video' },
        { id: 15, title: 'Criação de logotipos profissionais', duration: '90 min', type: 'video' },
        { id: 16, title: 'Projeto: Identidade visual completa', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'Adobe InDesign Editorial',
      description: 'Diagramação e design editorial profissional',
      lessons: [
        { id: 17, title: 'Interface e páginas mestras', duration: '90 min', type: 'video' },
        { id: 18, title: 'Texto e tipografia editorial', duration: '90 min', type: 'video' },
        { id: 19, title: 'Imagens e gráficos', duration: '90 min', type: 'video' },
        { id: 20, title: 'Estilos e formatação automática', duration: '90 min', type: 'video' },
        { id: 21, title: 'Projeto: Revista/catálogo completo', duration: '90 min', type: 'project' },
      ],
    }
  ],
  whatYouWillLearn: [
    '✅ Adobe Photoshop profissional para design',
    '✅ Adobe Illustrator para criação vetorial',
    '✅ Adobe InDesign para design editorial',
    '✅ Teoria do design e composição visual',
    '✅ Criação de logotipos e identidade visual',
    '✅ Design para redes sociais e marketing',
    '✅ Portfolio com projetos reais',
    '✅ Precificação e mercado de trabalho'
  ],
  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Adobe Creative Cloud (orientações de licenciamento)',
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
      text: 'Em 4 meses já estava faturando R$ 5.000/mês como freelancer de design!',
      result: 'Faturamento R$ 5.000/mês'
    },
    {
      id: 2,
      name: 'Amanda Castro',
      role: 'Social Media Designer',
      photo: '/testimonials/amanda-castro.jpg',
      rating: 5,
      text: 'Consegui emprego em agência de publicidade logo após terminar o curso.',
      result: 'Emprego em agência'
    },
    {
      id: 3,
      name: 'Rafael Silva',
      role: 'Designer Gráfico',
      photo: '/testimonials/rafael-silva.jpg',
      rating: 5,
      text: 'Criei minha própria marca e hoje atendo clientes do Brasil inteiro!',
      result: 'Negócio próprio nacional'
    }
  ],
  faq: [
    {
      id: 1,
      question: 'Preciso ter talento artístico natural?',
      answer: 'Não! Design é técnica que se aprende. Ensinamos desde o básico até você desenvolver seu próprio estilo criativo.'
    },
    {
      id: 2,
      question: 'Os softwares Adobe são fornecidos?',
      answer: 'Orientamos como obter as licenças oficiais e oferecemos alternativas gratuitas como GIMP e Inkscape para prática.'
    },
    {
      id: 3,
      question: 'Vou conseguir trabalhar como designer freelancer?',
      answer: 'Sim! Ensinamos não só a técnica, mas também precificação, como conseguir clientes e montar portfolio vencedor.'
    },
    {
      id: 4,
      question: 'O curso serve para design de redes sociais?',
      answer: 'Perfeitamente! Ensinamos design para Instagram, Facebook, LinkedIn e todas as principais plataformas.'
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
    title: 'Curso Design Gráfico - Escola Habilidade | Photoshop, Illustrator, InDesign',
    description: 'Torne-se Designer Gráfico profissional. Curso completo com Photoshop, Illustrator, InDesign e teoria do design. 96 horas práticas, certificação inclusa.',
    keywords: ['design gráfico', 'photoshop', 'illustrator', 'indesign', 'identidade visual', 'logotipos'],
    ogImage: '/og-images/design-grafico.jpg',
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