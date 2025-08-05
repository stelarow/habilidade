/**
 * Dados completos dos cursos da Escola Habilidade - VERSÃO CORRIGIDA
 * Baseado EXATAMENTE no CATALOGO_CURSOS_REFINADO.md
 * Cada curso segue o schema definido em coursesSchema.js
 */

// ===================================================================
// CURSO 1: INFORMÁTICA (8 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const informatica = {
  basicInfo: {
    id: 'informatica-001',
    title: 'Informática',
    slug: 'informatica',
    shortDescription: 'Curso completo de informática com Windows 11, Office, ambientes digitais, Canva e IA aplicada.',
    longDescription: 'Domine a informática moderna com nosso curso mais completo. Aprenda Windows 11, pacote Office completo, ambientes digitais, Canva e inteligência artificial aplicada. 8 módulos completos para preparação total no mercado de trabalho.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '184,5 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso de todos os 8 módulos',
      'Apostilas detalhadas com exercícios práticos',
      'Referência permanente para estudos',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Windows 11',
      description: 'Sistema operacional moderno e produtividade total',
      duration: '18 horas',
      lessons: [
        { id: 1, title: 'Introdução ao Windows 11', duration: '90 min', type: 'video' },
        { id: 2, title: 'Aplicativos Parte I', duration: '90 min', type: 'video' },
        { id: 3, title: 'Microsoft Edge', duration: '90 min', type: 'video' },
        { id: 4, title: 'Explorador de Arquivos Parte I', duration: '90 min', type: 'video' },
        { id: 5, title: 'Explorador de Arquivos Parte II', duration: '90 min', type: 'video' },
        { id: 6, title: 'Personalizando o Sistema', duration: '90 min', type: 'video' },
        { id: 7, title: 'Acessibilidade Parte I', duration: '90 min', type: 'video' },
        { id: 8, title: 'Aplicativos Parte II', duration: '90 min', type: 'video' },
        { id: 9, title: 'Aplicativos Parte III', duration: '90 min', type: 'video' },
        { id: 10, title: 'Aplicativos Parte ', duration: '90 min', type: 'video' }, // ✅ CORRIGIDO - SEM "IV"
        { id: 11, title: 'Barra de Tarefas', duration: '90 min', type: 'video' },
        { id: 12, title: 'Acessibilidade Parte II', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Word (Fundamental)',
      description: 'Processamento de texto profissional',
      duration: '21 horas',
      lessons: [
        { id: 13, title: 'Introdução ao Word 2019', duration: '90 min', type: 'video' },
        { id: 14, title: 'Iniciando um documento', duration: '90 min', type: 'video' },
        { id: 15, title: 'Formatando texto e nova Ferramenta de Aprendizagem', duration: '90 min', type: 'video' },
        { id: 16, title: 'Inserção de tabelas e ícones SVG', duration: '90 min', type: 'video' },
        { id: 17, title: 'Inserção de elementos gráficos I', duration: '90 min', type: 'video' },
        { id: 18, title: 'Inserção de elementos gráficos e imagens 3D', duration: '90 min', type: 'video' },
        { id: 19, title: 'Criação de estruturas de texto I', duration: '90 min', type: 'video' },
        { id: 20, title: 'Criação de estruturas de texto II', duration: '90 min', type: 'video' },
        { id: 21, title: 'Inserção de elementos de texto e nova sintaxe LaTeX', duration: '90 min', type: 'video' },
        { id: 22, title: 'Layout da página', duration: '90 min', type: 'video' },
        { id: 23, title: 'Design', duration: '90 min', type: 'video' },
        { id: 24, title: 'Revisão', duration: '90 min', type: 'video' },
        { id: 25, title: 'Armazenamento e compartilhamento', duration: '90 min', type: 'video' },
        { id: 26, title: 'Impressão', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Excel (Fundamental)',
      description: 'Planilhas eletrônicas para análise de dados',
      duration: '27 horas',
      lessons: [
        { id: 27, title: 'Introdução, Desenvolvendo a Primeira Planilha', duration: '90 min', type: 'video' },
        { id: 28, title: 'Formatação Básica', duration: '90 min', type: 'video' },
        { id: 29, title: 'Menu Revisão', duration: '90 min', type: 'video' },
        { id: 30, title: 'Operações Aritméticas Básicas', duration: '90 min', type: 'video' },
        { id: 31, title: 'Explorando Porcentagens', duration: '90 min', type: 'video' },
        { id: 32, title: 'Fórmulas Relativas', duration: '90 min', type: 'video' },
        { id: 33, title: 'Funções Comuns', duration: '90 min', type: 'video' },
        { id: 34, title: 'Gráficos Parte I', duration: '90 min', type: 'video' },
        { id: 35, title: 'Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 36, title: 'Validação de Dados', duration: '90 min', type: 'video' },
        { id: 37, title: 'Funções de Pesquisas Básicas', duration: '90 min', type: 'video' },
        { id: 38, title: 'Funções Comuns II', duration: '90 min', type: 'video' },
        { id: 39, title: 'Fórmulas de texto e AutoSoma', duration: '90 min', type: 'video' },
        { id: 40, title: 'Funções Financeiras Básicas', duration: '90 min', type: 'video' },
        { id: 41, title: 'Gráficos Parte II', duration: '90 min', type: 'video' },
        { id: 42, title: 'Funções de Data e Hora Básicas', duration: '90 min', type: 'video' },
        { id: 43, title: 'Gerenciador de Nomes', duration: '90 min', type: 'video' },
        { id: 44, title: 'Configurações, Auditoria e Exibição', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 4,
      title: 'Excel (Avançado)',
      description: 'Análise avançada de dados e automatização',
      duration: '19,5 horas',
      lessons: [
        { id: 45, title: 'Revisão de Fórmulas e Funções', duration: '90 min', type: 'video' },
        { id: 46, title: 'Funções de Texto', duration: '90 min', type: 'video' },
        { id: 47, title: 'Funções Lógicas', duration: '90 min', type: 'video' },
        { id: 48, title: 'Funções de Matemática/Trigonometria e Estatísticas – Parte 1', duration: '90 min', type: 'video' },
        { id: 49, title: 'Funções Estatísticas – Parte 2', duration: '90 min', type: 'video' },
        { id: 50, title: 'Funções de Data e Hora', duration: '90 min', type: 'video' },
        { id: 51, title: 'Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações', duration: '90 min', type: 'video' },
        { id: 52, title: 'Funções de Pesquisa e Referência', duration: '90 min', type: 'video' },
        { id: 53, title: 'Tabela Dinâmica e Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 54, title: 'Gráfico Dinâmico e Classificação de dados', duration: '90 min', type: 'video' },
        { id: 55, title: 'Utilizando Formulários', duration: '90 min', type: 'video' },
        { id: 56, title: 'Utilizando Macros e Noções de VBA', duration: '90 min', type: 'video' },
        { id: 57, title: 'Solver e Funções Financeiras', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 5,
      title: 'PowerPoint (Fundamental)',
      description: 'Apresentações profissionais e impactantes',
      duration: '18 horas',
      lessons: [
        { id: 58, title: 'Introdução ao Power Point 2019', duration: '90 min', type: 'video' },
        { id: 59, title: 'Ferramentas', duration: '90 min', type: 'video' },
        { id: 60, title: 'Iniciando uma apresentação', duration: '90 min', type: 'video' },
        { id: 61, title: 'Texto', duration: '90 min', type: 'video' },
        { id: 62, title: 'Layout de slide', duration: '90 min', type: 'video' },
        { id: 63, title: 'Elementos gráficos I', duration: '90 min', type: 'video' },
        { id: 64, title: 'Elementos gráficos II', duration: '90 min', type: 'video' },
        { id: 65, title: 'Multimídia', duration: '90 min', type: 'video' },
        { id: 66, title: 'Transições', duration: '90 min', type: 'video' },
        { id: 67, title: 'Testes de apresentação', duration: '90 min', type: 'video' },
        { id: 68, title: 'Revisão', duration: '90 min', type: 'video' },
        { id: 69, title: 'Projeto', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 6,
      title: 'Ambientes Digitais',
      description: 'Navegação e ferramentas da internet moderna',
      duration: '24 horas',
      lessons: [
        { id: 70, title: 'Introdução à Internet', duration: '90 min', type: 'video' },
        { id: 71, title: 'Navegação na Web', duration: '90 min', type: 'video' },
        { id: 72, title: 'Recursos e Pesquisa na Web', duration: '90 min', type: 'video' },
        { id: 73, title: 'Comunicação Online: E-mail', duration: '90 min', type: 'video' },
        { id: 74, title: 'Ferramenta de Produtividade: Google Drive', duration: '90 min', type: 'video' },
        { id: 75, title: 'Internet das Coisas (IoT)', duration: '90 min', type: 'video' },
        { id: 76, title: 'Videoconferências e Google Agenda', duration: '90 min', type: 'video' },
        { id: 77, title: 'Segurança Online', duration: '90 min', type: 'video' },
        { id: 78, title: 'Privacidade e Proteção de Dados', duration: '90 min', type: 'video' },
        { id: 79, title: 'Compras e Transações Online', duration: '90 min', type: 'video' },
        { id: 80, title: 'Streaming de Áudio: Spotify', duration: '90 min', type: 'video' },
        { id: 81, title: 'Streaming de Vídeo: YouTube', duration: '90 min', type: 'video' },
        { id: 82, title: 'Mensagens Instantâneas: WhatsApp', duration: '90 min', type: 'video' },
        { id: 83, title: 'Redes Sociais: Facebook', duration: '90 min', type: 'video' },
        { id: 84, title: 'Redes Sociais: Instagram', duration: '90 min', type: 'video' },
        { id: 85, title: 'Redes Sociais: TikTok', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 7,
      title: 'Canva',
      description: 'Design gráfico acessível para todos',
      duration: '18 horas',
      lessons: [
        { id: 86, title: 'Crie uma conta', duration: '90 min', type: 'video' },
        { id: 87, title: 'Conhecendo o Canva', duration: '90 min', type: 'video' },
        { id: 88, title: 'Biblioteca de modelos', duration: '90 min', type: 'video' },
        { id: 89, title: 'Editando templates', duration: '90 min', type: 'video' },
        { id: 90, title: 'Criando logotipos', duration: '90 min', type: 'video' },
        { id: 91, title: 'Designer profissional', duration: '90 min', type: 'video' },
        { id: 92, title: 'Vinhetas/Vídeos', duration: '90 min', type: 'video' },
        { id: 93, title: 'E-books e cartões', duration: '90 min', type: 'video' },
        { id: 94, title: 'Catálogo digital e proposta comercial', duration: '90 min', type: 'video' },
        { id: 95, title: 'Mockups', duration: '90 min', type: 'video' },
        { id: 96, title: 'Canva para Smartphone – Etapa 1', duration: '90 min', type: 'video' },
        { id: 97, title: 'Canva para Smartphone – Etapa 2', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 8,
      title: 'Inteligência Artificial (Informática)',
      description: 'IA aplicada à produtividade e trabalho',
      duration: '24 horas',
      lessons: [
        { id: 98, title: 'Introdução e História da Inteligência Artificial', duration: '90 min', type: 'video' },
        { id: 99, title: 'Machine Learning', duration: '90 min', type: 'video' },
        { id: 100, title: 'Prompt Engineering', duration: '90 min', type: 'video' },
        { id: 101, title: 'GPT, Bard e Copilot', duration: '90 min', type: 'video' },
        { id: 102, title: 'Estudando e Pesquisando com IAs', duration: '90 min', type: 'video' },
        { id: 103, title: 'Melhorando o Prompt', duration: '90 min', type: 'video' },
        { id: 104, title: 'Gerando Imagens', duration: '90 min', type: 'video' },
        { id: 105, title: 'Gerando Posts para Redes Sociais', duration: '90 min', type: 'video' },
        { id: 106, title: 'HARPA AI – Parte 1', duration: '90 min', type: 'video' },
        { id: 107, title: 'HARPA AI – Parte 2', duration: '90 min', type: 'video' },
        { id: 108, title: 'Gerando Vídeos', duration: '90 min', type: 'video' },
        { id: 109, title: 'Gerando Vídeos através de Imagens', duration: '90 min', type: 'video' },
        { id: 110, title: 'Gerando Áudios', duration: '90 min', type: 'video' },
        { id: 111, title: 'Gerando Vídeos com D-ID', duration: '90 min', type: 'video' },
        { id: 112, title: 'PI (Inteligência Artificial Personalizada)', duration: '90 min', type: 'video' },
        { id: 113, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: '90 min', type: 'project' },
      ],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Guia de aprendizado estruturado',
        description: 'Metodologia comprovada para acelerar seu progresso do básico ao profissional'
      },
      {
        icon: 'TrendUp',
        title: 'Do básico ao avançado',
        description: 'Evolução gradual e consistente até dominar completamente a informática'
      },
      {
        icon: 'Users',
        title: 'Você dentro do mercado',
        description: 'Habilidades de informática realmente demandadas pelas empresas'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Fundamentos',
        description: 'Domine Windows 11 e fundamentos da informática moderna',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Produtividade',
        description: 'Desenvolva expertise com Office e ferramentas digitais',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Especialização',
        description: 'Avance com Excel, Canva e técnicas profissionais',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Inovação',
        description: 'Domine Inteligência Artificial e destaque-se no mercado',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Windows 11 completo e produtividade total',
    'Microsoft Office profissional (Word, Excel, PowerPoint)',
    'Excel Fundamental e Avançado completos',
    'Ambientes digitais e navegação na internet',
    'Design com Canva para redes sociais',
    'Inteligência Artificial aplicada ao trabalho',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Certificação profissional reconhecida',
    'Preparação completa para o mercado de trabalho'
  ],

  requirements: [
    'Computador com Windows 10/11 ou superior',
    '8GB de RAM (recomendado 16GB)',
    'Conexão estável com internet',
    'Vontade de aprender tecnologia moderna',
    'Dedicação de 10-15 horas semanais'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 997,
    currentPrice: 597,
    discount: 40,
    installments: {
      max: 12,
      value: 59.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Equipe de Instrutores Especializados',
    bio: 'Nossa equipe é formada por profissionais certificados em Windows, Office e IA com mais de 10 anos de experiência no ensino de informática para todas as idades.',
    photo: '/instructors/team-informatica.jpg',
    experience: '10+ anos',
    credentials: [
      'Certificação Microsoft Office Specialist',
      'Especialização em Windows 11',
      'Formação em Inteligência Artificial',
      'Experiência corporativa em TI'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Letícia Mendes',
      role: 'Informática Fundamental',
      photo: '/testimonials/leticia-mendes.jpg', // Placeholder image
      rating: 5,
      text: 'Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 2,
      name: 'Mateus Oliveira',
      role: 'Informática Fundamental',
      photo: '/testimonials/mateus-oliveira.jpg', // Placeholder image
      rating: 5,
      text: 'O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 3,
      name: 'Gabriela Costa Silva',
      role: 'Informática Fundamental',
      photo: '/testimonials/gabriela-costa-silva.jpg', // Placeholder image
      rating: 5,
      text: 'A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.',
      location: 'São José - SC',
      date: 'jan. de 2025'
    },
    {
      id: 4,
      name: 'Lucas Felipe Ribeiro',
      role: 'Informática Fundamental',
      photo: '/testimonials/lucas-felipe-ribeiro.jpg', // Placeholder image
      rating: 5,
      text: 'Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 5,
      name: 'Carolina Almeida',
      role: 'Informática Fundamental',
      photo: '/testimonials/carolina-almeida.jpg', // Placeholder image
      rating: 5,
      text: 'As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.',
      location: 'São José - SC',
      date: 'nov. de 2024'
    },
    {
      id: 6,
      name: 'Pedro Henrique Soares',
      role: 'Informática Fundamental',
      photo: '/testimonials/pedro-henrique-soares.jpg', // Placeholder image
      rating: 5,
      text: 'Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.',
      location: 'São José - SC',
      date: 'dez. de 2024'
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
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 8 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'Como a IA está integrada no curso?',
      answer: 'Ensinamos IA de forma prática: ChatGPT para produtividade, geração de imagens, vídeos, automações e muito mais.'
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
    title: 'Curso de Informática Completo - Escola Habilidade | Windows 11, Office, IA - Material Incluso',
    description: 'Curso mais completo de Informática: Windows 11, Office, Excel, ambientes digitais, Canva e IA. 184+ horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['informática completa', 'windows 11', 'office', 'excel', 'inteligência artificial', 'canva', 'apostilas inclusas'],
    ogImage: '/og-images/informatica.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 2: DESIGN GRÁFICO (5 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const designGrafico = {
  basicInfo: {
    id: 'design-grafico-002',
    title: 'Design Gráfico',
    slug: 'design-grafico',
    shortDescription: 'Domine Photoshop, Illustrator, InDesign, Canva e CorelDRAW para criar designs profissionais.',
    longDescription: 'Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW com teorias fundamentais do design. 5 módulos completos para dominar o design profissional.',
    category: 'Design & Criação',
    level: 'Intermediário',
    duration: '90 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 5 módulos de design',
      'Apostilas com exercícios práticos e projetos',
      'Referência permanente para consulta',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Photoshop (Adobe Photoshop CC)',
      description: 'Edição e manipulação de imagens profissional',
      duration: '30 horas',
      lessons: [
        { id: 1, title: 'Conhecendo o Photoshop', duration: '90 min', type: 'video' },
        { id: 2, title: 'Inserindo Imagens, Painéis e Outras Ferramentas', duration: '90 min', type: 'video' },
        { id: 3, title: 'Unidades de medida, Objeto Inteligente, Conceito das Camadas, Modos de Mesclagem', duration: '90 min', type: 'video' },
        { id: 4, title: 'Formas básicas', duration: '90 min', type: 'video' },
        { id: 5, title: 'Espelhando e rotacionando imagens', duration: '90 min', type: 'video' },
        { id: 6, title: 'Ferramentas de Seleção 1: Seleção Rápida, Varinha Mágica; Remover Olhos Vermelhos', duration: '90 min', type: 'video' },
        { id: 7, title: 'Ferramentas de Seleção 2: Caneta, Laços, Letreiros', duration: '90 min', type: 'video' },
        { id: 8, title: 'Utilizando a ferramenta Borracha; Conceito de Máscaras', duration: '90 min', type: 'video' },
        { id: 9, title: 'Retirando o fundo de uma imagem com Caneta, Filtros e algumas aplicações', duration: '90 min', type: 'video' },
        { id: 10, title: 'Zoom, Ferramenta Carimbo e alterar a cor de uma forma', duration: '90 min', type: 'video' },
        { id: 11, title: 'Ferramenta de Texto', duration: '90 min', type: 'video' },
        { id: 12, title: 'Matiz/Saturação e Desfoque Gaussiano', duration: '90 min', type: 'video' },
        { id: 13, title: 'Ajustes de imagem 1 (Brilho/Contraste, Níveis, Matiz/Saturação)', duration: '90 min', type: 'video' },
        { id: 14, title: 'Ajustes de imagem 2 (Preto e Branco, Filtro de Fotos)', duration: '90 min', type: 'video' },
        { id: 15, title: 'Conhecendo Mockup; Ajustando imagem em perspectiva', duration: '90 min', type: 'video' },
        { id: 16, title: 'Inserindo pincéis e novas fontes', duration: '90 min', type: 'video' },
        { id: 17, title: 'Efeito Dupla Exposição', duration: '90 min', type: 'video' },
        { id: 18, title: 'Efeito Desintegração', duration: '90 min', type: 'video' },
        { id: 19, title: 'Efeito Glitch', duration: '90 min', type: 'video' },
        { id: 20, title: 'Projeto: Criando um Cartão de Visitas', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Illustrator (Adobe Illustrator CC)',
      description: 'Criação de ilustrações e logotipos vetoriais',
      duration: '24 horas',
      lessons: [
        { id: 21, title: 'Ferramentas básicas e interface', duration: '90 min', type: 'video' },
        { id: 22, title: 'Ferramenta de criação de formas', duration: '90 min', type: 'video' },
        { id: 23, title: 'Editando formas básicas', duration: '90 min', type: 'video' },
        { id: 24, title: 'Ferramenta de caneta e criação de formas livres', duration: '90 min', type: 'video' },
        { id: 25, title: 'Criação de desenhos utilizando formas', duration: '90 min', type: 'video' },
        { id: 26, title: 'Trabalhando com camadas', duration: '90 min', type: 'video' },
        { id: 27, title: 'Opacidade, Mesclagem e Máscara', duration: '90 min', type: 'video' },
        { id: 28, title: 'Pathfinder', duration: '90 min', type: 'video' },
        { id: 29, title: 'Cores', duration: '90 min', type: 'video' },
        { id: 30, title: 'Gradientes', duration: '90 min', type: 'video' },
        { id: 31, title: 'Régua e linhas de guia', duration: '90 min', type: 'video' },
        { id: 32, title: 'Tipografia e texto', duration: '90 min', type: 'video' },
        { id: 33, title: 'Criando um Logotipo', duration: '90 min', type: 'video' },
        { id: 34, title: 'Criando Padrões', duration: '90 min', type: 'video' },
        { id: 35, title: 'Pincéis', duration: '90 min', type: 'video' },
        { id: 36, title: 'Conceitos finais e finalizando arquivos', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'InDesign (Adobe InDesign CS6)',
      description: 'Diagramação e design editorial profissional',
      duration: '18 horas',
      lessons: [
        { id: 37, title: 'Apresentação e Área de Trabalho', duration: '90 min', type: 'video' },
        { id: 38, title: 'Caixas, Ferramentas de Desenho, Réguas e Elementos', duration: '90 min', type: 'video' },
        { id: 39, title: 'Paletas Swatches e Stroke', duration: '90 min', type: 'video' },
        { id: 40, title: 'Configurando Página, Posicionamento e Salvando Arquivo', duration: '90 min', type: 'video' },
        { id: 41, title: 'Formatação de Textos', duration: '90 min', type: 'video' },
        { id: 42, title: 'Listas, Conta-Gotas, Efeitos e Colunas', duration: '90 min', type: 'video' },
        { id: 43, title: 'Redimensionamento de Caixas de Texto e Free Transform', duration: '90 min', type: 'video' },
        { id: 44, title: 'Cores, Gradientes, Paste e Corner Options', duration: '90 min', type: 'video' },
        { id: 45, title: 'Scale, Step and Repeat, Alinhamento e Pathfinder', duration: '90 min', type: 'video' },
        { id: 46, title: 'Text Frame, Transparência e Text Wrap', duration: '90 min', type: 'video' },
        { id: 47, title: 'Página Mestre, Paleta Links, Numeração e Exportação', duration: '90 min', type: 'video' },
        { id: 48, title: 'Exercício Prático (Projeto Final)', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'Canva',
      description: 'Design gráfico acessível para todos',
      duration: '18 horas',
      note: 'Mesmo conteúdo do curso listado em Informática – 12 aulas, 18h',
      lessons: [
        { id: 49, title: 'Crie uma conta', duration: '90 min', type: 'video' },
        { id: 50, title: 'Conhecendo o Canva', duration: '90 min', type: 'video' },
        { id: 51, title: 'Biblioteca de modelos', duration: '90 min', type: 'video' },
        { id: 52, title: 'Editando templates', duration: '90 min', type: 'video' },
        { id: 53, title: 'Criando logotipos', duration: '90 min', type: 'video' },
        { id: 54, title: 'Designer profissional', duration: '90 min', type: 'video' },
        { id: 55, title: 'Vinhetas/Vídeos', duration: '90 min', type: 'video' },
        { id: 56, title: 'E-books e cartões', duration: '90 min', type: 'video' },
        { id: 57, title: 'Catálogo digital e proposta comercial', duration: '90 min', type: 'video' },
        { id: 58, title: 'Mockups', duration: '90 min', type: 'video' },
        { id: 59, title: 'Canva para Smartphone – Etapa 1', duration: '90 min', type: 'video' },
        { id: 60, title: 'Canva para Smartphone – Etapa 2', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 5,
      title: 'CorelDRAW',
      description: 'Ilustração e design vetorial profissional',
      duration: '24 horas',
      lessons: [
        { id: 61, title: 'Introdução ao CorelDRAW', duration: '90 min', type: 'video' },
        { id: 62, title: 'Trabalhando com Cores', duration: '90 min', type: 'video' },
        { id: 63, title: 'Ferramentas de Formas Básicas e Formatação', duration: '90 min', type: 'video' },
        { id: 64, title: 'Importação e Exportação de Arquivos', duration: '90 min', type: 'video' },
        { id: 65, title: 'Ferramentas de Texto', duration: '90 min', type: 'video' },
        { id: 66, title: 'Camadas e Objetos', duration: '90 min', type: 'video' },
        { id: 67, title: 'Efeitos e Transformações', duration: '90 min', type: 'video' },
        { id: 68, title: 'Ferramentas de Desenho Avançado', duration: '90 min', type: 'video' },
        { id: 69, title: 'Ferramentas de Desenho Avançado – Parte 2', duration: '90 min', type: 'video' },
        { id: 70, title: 'Ferramenta PowerTRACE', duration: '90 min', type: 'video' },
        { id: 71, title: 'Ferramenta PowerClip', duration: '90 min', type: 'video' },
        { id: 72, title: 'Estilos e Modelos', duration: '90 min', type: 'video' },
        { id: 73, title: 'Texto Artístico Avançado', duration: '90 min', type: 'video' },
        { id: 74, title: 'Efeitos 3D', duration: '90 min', type: 'video' },
        { id: 75, title: 'Projetos de Design', duration: '90 min', type: 'video' },
        { id: 76, title: 'Projeto Final', duration: '90 min', type: 'project' },
      ],
    }
  ],

  // ✅ Novos campos para componentes  
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Guia completo de design',
        description: 'Metodologia estruturada para dominar todas as ferramentas Adobe e design profissional'
      },
      {
        icon: 'TrendUp', 
        title: 'Do iniciante ao expert',
        description: 'Evolução progressiva desde conceitos básicos até projetos complexos'
      },
      {
        icon: 'Users',
        title: 'Portfolio profissional',
        description: 'Crie projetos reais que impressionam clientes e empregadores'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Fundamentos',
        description: 'Domine Photoshop e conceitos básicos de design visual',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Criação Vetorial',
        description: 'Desenvolva expertise em Illustrator e criação de logotipos',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Design Editorial',
        description: 'Avance com InDesign, CorelDRAW e projetos complexos',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Profissionalização',
        description: 'Construa portfolio completo e destaque-se no mercado',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Adobe Photoshop profissional para design',
    'Adobe Illustrator para criação vetorial',
    'Adobe InDesign para design editorial',
    'Canva para design rápido e eficiente',
    'CorelDRAW para ilustração e vetorização',
    'Teoria do design e composição visual',
    'Criação de logotipos e identidade visual',
    'Design para redes sociais e marketing',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Portfolio com projetos reais',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Adobe Creative Cloud (orientações de licenciamento)',
    'Tablet gráfico (recomendado)',
    'Senso estético e criatividade'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Design Masters Team',
    bio: 'Equipe de designers profissionais com certificação Adobe e experiência em agências e estúdios de design. Especialistas em formar novos talentos.',
    photo: '/instructors/team-design.jpg',
    experience: '8+ anos',
    credentials: [
      'Adobe Certified Expert (ACE)',
      'Experiência em agências de publicidade',
      'Portfolio internacional de clientes',
      'Formação em Design Gráfico'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Julia Menezes',
      role: 'Designer Gráfico',
      photo: '/testimonials/julia-menezes.jpg', // Placeholder image
      rating: 5,
      text: 'Entrei no curso sem saber nada e hoje já consigo criar artes incríveis. As aulas são leves, criativas e práticas. Me surpreendi!',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 2,
      name: 'Anderson Carvalho',
      role: 'Designer Gráfico',
      photo: '/testimonials/anderson-carvalho.jpg', // Placeholder image
      rating: 5,
      text: 'O curso tem uma pegada bem atualizada, cheia de referências visuais que realmente inspiram. O professor dá atenção individualizada e isso fez toda a diferença no meu desenvolvimento.',
      location: 'São José - SC',
      date: 'nov. de 2024'
    },
    {
      id: 3,
      name: 'Camila Pacheco',
      role: 'Designer Gráfico',
      photo: '/testimonials/camila-pacheco.jpg', // Placeholder image
      rating: 5,
      text: 'A Escola Habilidade oferece um ambiente que realmente estimula a criação. Estou curtindo muito as aulas, principalmente pelas propostas práticas que me desafiam.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 4,
      name: 'Marcelo Andrade',
      role: 'Designer Gráfico',
      photo: '/testimonials/marcelo-andrade.jpg', // Placeholder image
      rating: 5,
      text: 'Estou tendo uma experiência fantástica. Além de ensinar técnicas, o curso ajuda no desenvolvimento da criatividade. Aprender aqui tem sido leve e produtivo.',
      location: 'São José - SC',
      date: 'jan. de 2025'
    },
    {
      id: 5,
      name: 'Larissa Almeida',
      role: 'Designer Gráfico',
      photo: '/testimonials/larissa-almeida.jpg', // Placeholder image
      rating: 5,
      text: 'Fui surpreendida positivamente! Aprendi várias ferramentas digitais que nem conhecia, e estou usando em projetos reais. Muito além do básico!',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 6,
      name: 'Samuel Oliveira',
      role: 'Designer Gráfico',
      photo: '/testimonials/samuel-oliveira.jpg', // Placeholder image
      rating: 5,
      text: 'As aulas são tão boas que passam voando. O professor é claro nas explicações, e a prática constante me ajudou a evoluir mais rápido do que eu imaginava.',
      location: 'São José - SC',
      date: 'dez. de 2024'
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
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 5 módulos incluso sem custo adicional. Sua referência permanente!'
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
    title: 'Curso Design Gráfico Completo - Escola Habilidade | Photoshop, Illustrator, InDesign, Canva - Material Incluso',
    description: 'Torne-se Designer Gráfico profissional. 5 módulos: Photoshop, Illustrator, InDesign, Canva, CorelDRAW. 90 horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['design gráfico', 'photoshop', 'illustrator', 'indesign', 'canva', 'coreldraw', 'apostilas inclusas'],
    ogImage: '/og-images/design-grafico.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 3: PROGRAMAÇÃO (6 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const programacao = {
  basicInfo: {
    id: 'programacao-003',
    title: 'Programação',
    slug: 'programacao',
    shortDescription: 'Domine Lógica, Python, Java, PHP, Android e Cursor IA para desenvolvimento completo.',
    longDescription: 'Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e o revolucionário Cursor com IA. 6 módulos completos do zero ao primeiro emprego como programador.',
    category: 'Tecnologia',
    level: 'Iniciante',
    duration: '118 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 6 módulos de programação',
      'Apostilas com códigos, exercícios e projetos práticos',
      'Referência permanente para desenvolvimento',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Lógica de Programação',
      description: 'Fundamentos lógicos para qualquer linguagem de programação',
      duration: '21 horas',
      lessons: [
        { id: 1, title: 'Introdução à Programação', duration: '90 min', type: 'video' },
        { id: 2, title: 'Variáveis, constantes e tipos de dados', duration: '90 min', type: 'video' },
        { id: 3, title: 'Primeiro programa (Algoritmos)', duration: '90 min', type: 'video' },
        { id: 4, title: 'Tipos de operadores', duration: '90 min', type: 'video' },
        { id: 5, title: 'Estrutura de decisão – Parte 1', duration: '90 min', type: 'video' },
        { id: 6, title: 'Estrutura de decisão – Parte 2', duration: '90 min', type: 'video' },
        { id: 7, title: 'Estrutura de repetição – Parte 1', duration: '90 min', type: 'video' },
        { id: 8, title: 'Estrutura de repetição – Parte 2', duration: '90 min', type: 'video' },
        { id: 9, title: 'Manipulação de vetores', duration: '90 min', type: 'video' },
        { id: 10, title: 'Manipulação de matrizes', duration: '90 min', type: 'video' },
        { id: 11, title: 'Funções e procedimentos', duration: '90 min', type: 'video' },
        { id: 12, title: 'Modularização', duration: '90 min', type: 'video' },
        { id: 13, title: 'Prática 1 (exercícios integrados)', duration: '90 min', type: 'exercise' },
        { id: 14, title: 'Prática 2 (projeto final)', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Python',
      description: 'Python do básico ao avançado para desenvolvimento profissional',
      duration: '24 horas',
      lessons: [
        { id: 15, title: 'Iniciando no Python', duration: '90 min', type: 'video' },
        { id: 16, title: 'Primeiros passos com Python', duration: '90 min', type: 'video' },
        { id: 17, title: 'If, Else e Elif (Estruturas de decisão)', duration: '90 min', type: 'video' },
        { id: 18, title: 'Loops (Estruturas de repetição)', duration: '90 min', type: 'video' },
        { id: 19, title: 'Listas', duration: '90 min', type: 'video' },
        { id: 20, title: 'Strings', duration: '90 min', type: 'video' },
        { id: 21, title: 'Funções', duration: '90 min', type: 'video' },
        { id: 22, title: 'Lidando com erros', duration: '90 min', type: 'video' },
        { id: 23, title: 'Módulos e pacotes', duration: '90 min', type: 'video' },
        { id: 24, title: 'Objetos (introdução à OOP)', duration: '90 min', type: 'video' },
        { id: 25, title: 'Dicionários', duration: '90 min', type: 'video' },
        { id: 26, title: 'Arquivos', duration: '90 min', type: 'video' },
        { id: 27, title: 'Bibliotecas externas', duration: '90 min', type: 'video' },
        { id: 28, title: 'Data e hora', duration: '90 min', type: 'video' },
        { id: 29, title: 'Expressões regulares', duration: '90 min', type: 'video' },
        { id: 30, title: 'Projeto final', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 3,
      title: 'Java',
      description: 'Java para aplicações robustas e empresariais',
      duration: '24 horas',
      lessons: [
        { id: 31, title: 'Introdução ao Java', duration: '90 min', type: 'video' },
        { id: 32, title: 'Interface, componentes e variáveis', duration: '90 min', type: 'video' },
        { id: 33, title: 'Operadores matemáticos, relacionais e controle de fluxo', duration: '90 min', type: 'video' },
        { id: 34, title: 'Estrutura de repetição (For e While)', duration: '90 min', type: 'video' },
        { id: 35, title: 'Manipulação de Strings', duration: '90 min', type: 'video' },
        { id: 36, title: 'Variáveis compostas', duration: '90 min', type: 'video' },
        { id: 37, title: 'Orientação a Objetos: Introdução', duration: '90 min', type: 'video' },
        { id: 38, title: 'Projeto sem Orientação a Objetos (comparativo)', duration: '90 min', type: 'video' },
        { id: 39, title: 'Orientação a Objetos: Classes', duration: '90 min', type: 'video' },
        { id: 40, title: 'Orientação a Objetos: Métodos', duration: '90 min', type: 'video' },
        { id: 41, title: 'Orientação a Objetos: Métodos II', duration: '90 min', type: 'video' },
        { id: 42, title: 'Encapsulamento', duration: '90 min', type: 'video' },
        { id: 43, title: 'OOP: Vetor, Laço e Lista', duration: '90 min', type: 'video' },
        { id: 44, title: 'Herança', duration: '90 min', type: 'video' },
        { id: 45, title: 'Sobreposição e Interface Gráfica I', duration: '90 min', type: 'video' },
        { id: 46, title: 'Interface Gráfica II', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 4,
      title: 'Programação PHP (Versão 2)',
      description: 'PHP para desenvolvimento web e sistemas dinâmicos',
      duration: '30 horas',
      lessons: [
        { id: 47, title: 'Introdução ao PHP', duration: '90 min', type: 'video' },
        { id: 48, title: 'Notepad++ e Conceitos Básicos de Programação', duration: '90 min', type: 'video' },
        { id: 49, title: 'Operadores de Comparação, Lógicos e Estrutura Condicional', duration: '90 min', type: 'video' },
        { id: 50, title: 'Estrutura Condicional e Estrutura de Repetição', duration: '90 min', type: 'video' },
        { id: 51, title: 'Estrutura de Repetição, Strings e Funções', duration: '90 min', type: 'video' },
        { id: 52, title: 'Variáveis Compostas', duration: '90 min', type: 'video' },
        { id: 53, title: 'Hospedagem de Site (publicação)', duration: '90 min', type: 'video' },
        { id: 54, title: 'Cookies e Sessões', duration: '90 min', type: 'video' },
        { id: 55, title: 'Integração PHP com HTML', duration: '90 min', type: 'video' },
        { id: 56, title: 'Banco de Dados – Parte 1', duration: '90 min', type: 'video' },
        { id: 57, title: 'Banco de Dados – Parte 2', duration: '90 min', type: 'video' },
        { id: 58, title: 'Projeto Etapa 1: Estrutura, Conexão, Exibir Categorias e Produtos', duration: '90 min', type: 'project' },
        { id: 59, title: 'Projeto Etapa 2: Detalhes do Produto e Área Administrativa', duration: '90 min', type: 'project' },
        { id: 60, title: 'Projeto Etapa 3: Excluir Categoria e Cadastrar Produtos', duration: '90 min', type: 'project' },
        { id: 61, title: 'Projeto Etapa 4: Editar e Atualizar Produtos', duration: '90 min', type: 'project' },
        { id: 62, title: 'Projeto Etapa 5: Excluir Produto e Área de Pedidos', duration: '90 min', type: 'project' },
        { id: 63, title: 'Projeto Etapa 6: Excluir Pedido e Cadastrar Cliente', duration: '90 min', type: 'project' },
        { id: 64, title: 'Projeto Etapa 7: Listar Pedidos dos Clientes', duration: '90 min', type: 'project' },
        { id: 65, title: 'Projeto Etapa 8: Editar e Atualizar (funcionalidades finais)', duration: '90 min', type: 'project' },
        { id: 66, title: 'Ativar/Desativar Cliente, Login e Hospedagem', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 5,
      title: 'Desenvolvedor de Aplicativos (Android v.2)',
      description: 'Desenvolvimento de apps nativos para Android',
      duration: '24 horas',
      lessons: [
        { id: 67, title: 'Introdução ao Android Studio', duration: '90 min', type: 'video' },
        { id: 68, title: 'Interface e componentes', duration: '90 min', type: 'video' },
        { id: 69, title: 'Variáveis e tipos', duration: '90 min', type: 'video' },
        { id: 70, title: 'Operadores matemáticos e estruturas condicionais', duration: '90 min', type: 'video' },
        { id: 71, title: 'Estruturas condicionais, tratamento de texto e layout', duration: '90 min', type: 'video' },
        { id: 72, title: 'Layout, Arrays e navegando entre telas (Activities)', duration: '90 min', type: 'video' },
        { id: 73, title: 'Orientação a Objetos (Métodos, Classes e Herança)', duration: '90 min', type: 'video' },
        { id: 74, title: 'Modificadores de acesso', duration: '90 min', type: 'video' },
        { id: 75, title: 'XML e layout adaptável', duration: '90 min', type: 'video' },
        { id: 76, title: 'Guidelines (Diretrizes de design)', duration: '90 min', type: 'video' },
        { id: 77, title: 'Chain, GridLayout e Componentes de formulário', duration: '90 min', type: 'video' },
        { id: 78, title: 'Componentes de formulário (continuação)', duration: '90 min', type: 'video' },
        { id: 79, title: 'Mídia + Projeto "Cadastro de Clientes"', duration: '90 min', type: 'project' },
        { id: 80, title: 'Banco de Dados + Projeto "Cadastro de Clientes"', duration: '90 min', type: 'project' },
        { id: 81, title: 'Banco de Dados + Projeto "Cadastro de Clientes" (continuação)', duration: '90 min', type: 'project' },
        { id: 82, title: 'Projeto "Cadastro de Clientes" + Publicação na Google Play', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 6,
      title: 'Cursor (IDE com IA integrada)',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Do zero ao programador',
        description: 'Metodologia comprovada que leva iniciantes ao primeiro emprego em programação'
      },
      {
        icon: 'TrendUp',
        title: 'Múltiplas linguagens',
        description: 'Domine Python, Java, PHP e Android para ser um desenvolvedor versátil'
      },
      {
        icon: 'Users',
        title: 'Mercado em alta',
        description: 'Programadores são os profissionais mais demandados do mercado atual'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Lógica',
        description: 'Fundamentos sólidos de lógica de programação e algoritmos',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Linguagens',
        description: 'Domine Python, Java e PHP com projetos práticos',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Mobile & Web',
        description: 'Desenvolva aplicativos Android e sistemas web completos',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Carreira',
        description: 'Portfolio profissional e preparação para oportunidades',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Lógica de programação sólida para qualquer linguagem',
    'Python completo para desenvolvimento web e automação',
    'Java para aplicações empresariais robustas',
    'PHP para sistemas web dinâmicos com MySQL',
    'Desenvolvimento de aplicativos Android nativos',
    'Cursor: IDE com IA integrada (em desenvolvimento)',
    'CRUD completo e banco de dados',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Portfolio com projetos reais',
    'Preparação completa para o mercado de trabalho',
    'Do zero ao primeiro emprego como programador'
  ],

  requirements: [
    'Computador com Windows, Mac ou Linux',
    '8GB de RAM mínimo (recomendado 16GB)',
    'Conexão estável com internet',
    'Inglês básico (recomendado)',
    'Dedicação de 15-20 horas semanais',
    'Vontade de resolver problemas lógicos'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1497,
    currentPrice: 897,
    discount: 40,
    installments: {
      max: 12,
      value: 89.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Code Academy Team',
    bio: 'Equipe de desenvolvedores sênior com experiência em múltiplas linguagens e projetos de grande escala. Especialistas em formar novos programadores.',
    photo: '/instructors/team-programacao.jpg',
    experience: '12+ anos',
    credentials: [
      'Certificação em Python e Java',
      'Experiência em startups e grandes empresas',
      'Projetos open source reconhecidos',
      'Formação em Ciência da Computação'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Paulo Henrique Santos',
      role: 'Programação',
      photo: '/testimonials/paulo-henrique-santos.jpg', // Placeholder image
      rating: 5,
      text: 'O curso de Programação mudou minha forma de pensar. Nunca imaginei que aprender lógica e código pudesse ser tão prático. As aulas são muito bem organizadas.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 2,
      name: 'Letícia Ribeiro',
      role: 'Programação',
      photo: '/testimonials/leticia-ribeiro.jpg', // Placeholder image
      rating: 5,
      text: 'Escolhi o curso sem saber nada de programação e já estou desenvolvendo meus primeiros projetos. O professor tem uma didática incrível e sempre nos motiva.',
      location: 'São José - SC',
      date: 'jan. de 2025'
    },
    {
      id: 3,
      name: 'Lucas Vinícius',
      role: 'Programação',
      photo: '/testimonials/lucas-vinicius.jpg', // Placeholder image
      rating: 5,
      text: 'As aulas são envolventes, com desafios reais que deixam tudo mais interessante. Cada aula me motiva a ir mais longe na área.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 4,
      name: 'Isadora Lima',
      role: 'Programação',
      photo: '/testimonials/isadora-lima.jpg', // Placeholder image
      rating: 5,
      text: 'Estou impressionada com a evolução que tive. O curso é direto ao ponto, com muita prática. O professor torna assuntos complexos fáceis de entender.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 5,
      name: 'Thiago Bernardes',
      role: 'Programação',
      photo: '/testimonials/thiago-bernardes.jpg', // Placeholder image
      rating: 5,
      text: 'O curso tem foco total no que é realmente útil. As atividades práticas e os projetos me deram mais confiança para pensar no mercado.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 6,
      name: 'Natália Pereira',
      role: 'Programação',
      photo: '/testimonials/natalia-pereira.jpg', // Placeholder image
      rating: 5,
      text: 'O professor cria um ambiente acolhedor, onde a gente se sente à vontade pra errar e aprender. Gostei muito dos projetos em sala, me ajudaram a ver tudo na prática.',
      location: 'São José - SC',
      date: 'dez. de 2024'
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
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'O que é o Cursor e quando estará disponível?',
      answer: 'Cursor é um IDE com IA integrada para desenvolvimento. O conteúdo programático está sendo desenvolvido pela equipe.'
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
    title: 'Curso de Programação Completo - Escola Habilidade | Python, Java, PHP, Android, Cursor IA - Material Incluso',
    description: 'Torne-se Programador Full-Stack. 6 módulos: Lógica, Python, Java, PHP, Android e Cursor IA. 118 horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['programação', 'python', 'java', 'php', 'android', 'cursor ai', 'full-stack', 'apostilas inclusas'],
    ogImage: '/og-images/programacao.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 4: MARKETING DIGITAL (6 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const marketingDigital = {
  basicInfo: {
    id: 'marketing-digital-004',
    title: 'Marketing Digital',
    slug: 'marketing-digital',
    shortDescription: 'Domine Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business.',
    longDescription: 'Torne-se um especialista em Marketing Digital. Aprenda Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business. 6 módulos completos para gerar resultados reais.',
    category: 'Marketing',
    level: 'Intermediário',
    duration: '68 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 6 módulos de marketing',
      'Apostilas com estratégias, templates e cases práticos',
      'Referência permanente para campanhas',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Marketing Digital (Versão 2)',
      description: 'Base estratégica para dominar o marketing online',
      duration: '18 horas',
      lessons: [
        { id: 1, title: 'O que é o Marketing Digital?', duration: '90 min', type: 'video' },
        { id: 2, title: 'Descobrindo seu público-alvo e persona', duration: '90 min', type: 'video' },
        { id: 3, title: 'Como escolher seus Canais de Divulgação e Venda', duration: '90 min', type: 'video' },
        { id: 4, title: 'Facebook (Marketing na plataforma)', duration: '90 min', type: 'video' },
        { id: 5, title: 'Instagram (Marketing na plataforma)', duration: '90 min', type: 'video' },
        { id: 6, title: 'Conteúdos Atrativos para Redes Sociais I', duration: '90 min', type: 'video' },
        { id: 7, title: 'Conteúdos Atrativos para Redes Sociais II', duration: '90 min', type: 'video' },
        { id: 8, title: 'Google Meu Negócio e Google Ads', duration: '90 min', type: 'video' },
        { id: 9, title: 'Google Analytics', duration: '90 min', type: 'video' },
        { id: 10, title: 'Como vender mais e atrair mais Leads', duration: '90 min', type: 'video' },
        { id: 11, title: 'Criando uma Campanha no Facebook I', duration: '90 min', type: 'video' },
        { id: 12, title: 'Criando uma Campanha no Facebook II', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Mídias Sociais',
      description: 'Estratégias para redes sociais e comunicação digital',
      duration: '15 horas',
      lessons: [
        { id: 13, title: 'Introdução a Mídias Sociais', duration: '90 min', type: 'video' },
        { id: 14, title: 'Redes Sociais (conceito geral)', duration: '90 min', type: 'video' },
        { id: 15, title: 'Conhecendo o Twitter', duration: '90 min', type: 'video' },
        { id: 16, title: 'Conhecendo o Instagram', duration: '90 min', type: 'video' },
        { id: 17, title: 'Conhecendo o Facebook', duration: '90 min', type: 'video' },
        { id: 18, title: 'Conhecendo o Facebook Messenger', duration: '90 min', type: 'video' },
        { id: 19, title: 'Criando uma Página no Facebook', duration: '90 min', type: 'video' },
        { id: 20, title: 'Conhecendo o LinkedIn', duration: '90 min', type: 'video' },
        { id: 21, title: 'Conhecendo o YouTube', duration: '90 min', type: 'video' },
        { id: 22, title: 'Conhecendo o WhatsApp', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Armazenamento na Nuvem',
      description: 'Ferramentas de produtividade e colaboração online',
      duration: '6 horas',
      lessons: [
        { id: 23, title: 'Google Drive', duration: '90 min', type: 'video' },
        { id: 24, title: 'Compartilhamento de Arquivos e Trabalho em Conjunto', duration: '90 min', type: 'video' },
        { id: 25, title: 'Dropbox', duration: '90 min', type: 'video' },
        { id: 26, title: 'Compartilhamento de Arquivos e Arquivos Offline', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 4,
      title: 'Inteligência Artificial (Marketing)',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    },
    {
      id: 5,
      title: 'Marketing Pessoal',
      description: 'Desenvolvimento de marca pessoal e networking',
      duration: '3 horas',
      lessons: [
        { id: 27, title: 'Marketing Pessoal – Valores e Auto-Conhecimento', duration: '90 min', type: 'video' },
        { id: 28, title: 'Networking, Branding e Qualificação Profissional', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 6,
      title: 'Facebook Business',
      description: 'Estratégias avançadas para campanhas no Facebook',
      duration: '24 horas',
      lessons: [
        { id: 29, title: 'Conhecendo o Facebook Business', duration: '90 min', type: 'video' },
        { id: 30, title: 'Criando Conta de Usuário e Página', duration: '90 min', type: 'video' },
        { id: 31, title: 'Menu Configurações I', duration: '90 min', type: 'video' },
        { id: 32, title: 'Menu Configurações II', duration: '90 min', type: 'video' },
        { id: 33, title: 'Menu Configurações III', duration: '90 min', type: 'video' },
        { id: 34, title: 'Criação de Públicos I', duration: '90 min', type: 'video' },
        { id: 35, title: 'Criação de Públicos II', duration: '90 min', type: 'video' },
        { id: 36, title: 'Criação de Públicos III', duration: '90 min', type: 'video' },
        { id: 37, title: 'Gerenciador de Anúncios', duration: '90 min', type: 'video' },
        { id: 38, title: 'Criação de Campanha I', duration: '90 min', type: 'video' },
        { id: 39, title: 'Criação de Campanha II', duration: '90 min', type: 'video' },
        { id: 40, title: 'Criação de Campanha III', duration: '90 min', type: 'video' },
        { id: 41, title: 'Criação de Campanha IV', duration: '90 min', type: 'video' },
        { id: 42, title: 'Publicando Campanhas', duration: '90 min', type: 'video' },
        { id: 43, title: 'Leads e Pixel (Ferramentas de Conversão)', duration: '90 min', type: 'video' },
        { id: 44, title: 'Gerando e Analisando Dados', duration: '90 min', type: 'video' },
      ],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Estratégias que funcionam',
        description: 'Metodologia comprovada para gerar resultados reais em marketing digital'
      },
      {
        icon: 'TrendUp',
        title: 'Multiplique vendas',
        description: 'Técnicas avançadas para aumentar faturamento e conquistar clientes'
      },
      {
        icon: 'Users',
        title: 'Mercado em expansão',
        description: 'Marketing digital é essencial para qualquer negócio moderno'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Fundamentos',
        description: 'Domine os pilares do marketing digital e mídias sociais',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Estratégia',
        description: 'Desenvolva campanhas eficazes e conteúdo atrativo',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Automação',
        description: 'Facebook Business, IA Marketing e ferramentas avançadas',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Resultados',
        description: 'Portfolio com campanhas reais e marca pessoal consolidada',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Marketing Digital V2: estratégias modernas e eficazes',
    'Mídias Sociais: Facebook, Instagram, Twitter, LinkedIn',
    'Armazenamento em Nuvem para produtividade',
    'IA Marketing: automação inteligente (em desenvolvimento)',
    'Marketing Pessoal: construção de marca pessoal',
    'Facebook Business: campanhas profissionais',
    'Google Analytics e métricas de desempenho',
    'Criação de conteúdo atrativo para redes',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Portfolio com campanhas reais',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows, Mac ou Linux',
    'Conexão estável com internet',
    'Conta Google (Gmail)',
    'Conta Facebook pessoal',
    'Orçamento inicial para testes (R$ 300-500)',
    'Conhecimentos básicos de informática'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 597,
    discount: 33,
    installments: {
      max: 12,
      value: 59.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Digital Marketing Masters',
    bio: 'Equipe de especialistas em marketing digital com experiência em agências e campanhas de grande alcance. Experts em resultados mensuráveis.',
    photo: '/instructors/team-marketing.jpg',
    experience: '8+ anos',
    credentials: [
      'Certificação Google Ads e Analytics',
      'Facebook Blueprint Certified',
      'Experiência em agências de publicidade',
      'Cases de sucesso em e-commerce'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Maria Eduarda Costa',
      role: 'Profissional Confiante',
      photo: '/testimonials/maria-eduarda-costa.jpg',
      rating: 5,
      text: 'Aprender sobre Marketing Pessoal mudou minha postura profissional. Hoje me sinto muito mais confiante para divulgar meu trabalho.',
      result: 'Postura profissional transformada'
    },
    {
      id: 2,
      name: 'Isabela Freitas',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/isabela-freitas.jpg',
      rating: 5,
      text: 'Finalmente aprendi a usar Inteligência Artificial para gerar conteúdo e criar meus posts nas redes sociais. Recomendo demais!',
      result: 'Conteúdo com IA'
    },
    {
      id: 3,
      name: 'Natália Campos',
      role: 'Entusiasta de Marketing',
      photo: '/testimonials/natalia-campos.jpg',
      rating: 5,
      text: 'Adorei como o curso conectou marketing digital com inteligência artificial. Inovador e surpreendente!',
      result: 'Combinação inovadora'
    },
    {
      id: 4,
      name: 'Fabiola Moraes',
      role: 'Profissional de Marketing',
      photo: '/testimonials/fabiola-moraes.jpg',
      rating: 5,
      text: 'Depois do curso, consegui o emprego que tanto sonhei na área de marketing digital. Obrigada Escola Habilidade por me ajudar nesse caminho!',
      result: 'Emprego dos sonhos'
    },
    {
      id: 5,
      name: 'Julia Ramos',
      role: 'Gestora de Anúncios',
      photo: '/testimonials/julia-ramos.jpg',
      rating: 5,
      text: 'Antes desse curso, eu tinha muito medo de mexer com os anúncios das redes sociais. As aulas sobre Facebook Business foram um divisor de águas. Hoje já consigo ter retorno real dos anúncios que crio.',
      result: 'Retorno real dos anúncios'
    },
    {
      id: 4,
      name: 'Ana Caroline Barros',
      role: 'Designer em Transição',
      photo: '/testimonials/ana-caroline-barros.jpg',
      rating: 5,
      text: 'Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!',
      result: 'Transição de carreira'
    },
    {
      id: 5,
      name: 'Camila Medeiros',
      role: 'Empreendedora',
      photo: '/testimonials/camila-medeiros.jpg',
      rating: 5,
      text: 'Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.',
      result: 'Identidade visual própria'
    },
    {
      id: 6,
      name: 'Aline Silva',
      role: 'Designer Aprendiz',
      photo: '/testimonials/aline-silva.jpg',
      rating: 5,
      text: 'Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.',
      result: 'Domínio de múltiplos softwares'
    },
    {
      id: 7,
      name: 'Yasmin Camile',
      role: 'Designer Criativa',
      photo: '/testimonials/yasmin-camile.jpg',
      rating: 5,
      text: 'O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!',
      result: 'Diferencial com IA'
    },
    {
      id: 8,
      name: 'Carlos Souza',
      role: 'Designer Evoluído',
      photo: '/testimonials/carlos-souza.jpg',
      rating: 5,
      text: 'Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!',
      result: 'Evolução visível'
    },
    {
      id: 9,
      name: 'Patrícia Lima',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'O Canva me salvou! Agora tudo que eu posto tem cara de profissional!',
      result: 'Conteúdo profissional'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Funciona para qualquer tipo de negócio?',
      answer: 'Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos, profissionais liberais e empresas B2B.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'Como funciona o módulo de IA Marketing?',
      answer: 'O módulo de IA Marketing está em desenvolvimento. O conteúdo será disponibilizado assim que finalizado pela equipe.'
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
    title: 'Curso Marketing Digital Completo - Escola Habilidade | Marketing V2, Mídias Sociais, Facebook Business - Material Incluso',
    description: 'Torne-se especialista em Marketing Digital. 6 módulos: Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal, Facebook Business. 68 horas, apostilas inclusas.',
    keywords: ['marketing digital', 'marketing v2', 'mídias sociais', 'facebook business', 'marketing pessoal', 'apostilas inclusas'],
    ogImage: '/og-images/marketing-digital.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 5: INTELIGÊNCIA ARTIFICIAL (6 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const inteligenciaArtificial = {
  basicInfo: {
    id: 'inteligencia-artificial-005',
    title: 'Inteligência Artificial',
    slug: 'inteligencia-artificial',
    shortDescription: 'Domine IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas.',
    longDescription: 'Curso completo de Inteligência Artificial. Aprenda IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas. 6 módulos para dominar IA criativa e aplicada aos negócios.',
    category: 'Tecnologia',
    level: 'Intermediário',
    duration: '31,5 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos módulos disponíveis',
      'Apostilas com prompts, tutoriais e projetos práticos',
      'Referência permanente para IA aplicada',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Inteligência Artificial (Fundamentos)',
      description: 'Conteúdo já detalhado acima em Informática – módulo "Inteligência Artificial", 16 aulas, 24h',
      duration: '24 horas',
      note: 'Mesmo conteúdo do módulo de IA do curso de Informática',
      lessons: [
        { id: 1, title: 'Introdução e História da Inteligência Artificial', duration: '90 min', type: 'video' },
        { id: 2, title: 'Machine Learning', duration: '90 min', type: 'video' },
        { id: 3, title: 'Prompt Engineering', duration: '90 min', type: 'video' },
        { id: 4, title: 'GPT, Bard e Copilot', duration: '90 min', type: 'video' },
        { id: 5, title: 'Estudando e Pesquisando com IAs', duration: '90 min', type: 'video' },
        { id: 6, title: 'Melhorando o Prompt', duration: '90 min', type: 'video' },
        { id: 7, title: 'Gerando Imagens', duration: '90 min', type: 'video' },
        { id: 8, title: 'Gerando Posts para Redes Sociais', duration: '90 min', type: 'video' },
        { id: 9, title: 'HARPA AI – Parte 1', duration: '90 min', type: 'video' },
        { id: 10, title: 'HARPA AI – Parte 2', duration: '90 min', type: 'video' },
        { id: 11, title: 'Gerando Vídeos', duration: '90 min', type: 'video' },
        { id: 12, title: 'Gerando Vídeos através de Imagens', duration: '90 min', type: 'video' },
        { id: 13, title: 'Gerando Áudios', duration: '90 min', type: 'video' },
        { id: 14, title: 'Gerando Vídeos com D-ID', duration: '90 min', type: 'video' },
        { id: 15, title: 'PI (Inteligência Artificial Personalizada)', duration: '90 min', type: 'video' },
        { id: 16, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Inteligência Artificial for Business ("Empreendendo com IA nos Negócios")',
      description: 'IA aplicada aos negócios e empreendedorismo',
      duration: '7,5 horas',
      lessons: [
        { id: 17, title: 'Criando Minha Marca', duration: '90 min', type: 'video' },
        { id: 18, title: 'Mapeando Público-Alvo', duration: '90 min', type: 'video' },
        { id: 19, title: 'Criando Argumentos de Vendas Personalizados', duration: '90 min', type: 'video' },
        { id: 20, title: 'Gerando Posts', duration: '90 min', type: 'video' },
        { id: 21, title: 'Gerenciando Relacionamento com o Cliente', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Cursor',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    },
    {
      id: 4,
      title: 'Flowlabs',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    },
    {
      id: 5,
      title: 'ElevenLabs',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    },
    {
      id: 6,
      title: 'HatchCanvas',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Domine o futuro',
        description: 'Inteligência Artificial é a tecnologia que está revolucionando todos os setores'
      },
      {
        icon: 'TrendUp',
        title: 'Multiplique produtividade',
        description: 'Automatize tarefas e aumente eficiência com ferramentas de IA avançadas'
      },
      {
        icon: 'Users',
        title: 'Diferencial competitivo',
        description: 'Profissionais com IA ganham 300% mais e têm acesso às melhores oportunidades'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Fundamentos IA',
        description: 'Domine conceitos básicos, prompts e ferramentas essenciais',
        icon: 'House'
      },
      {
        number: 2,
        title: 'IA nos Negócios',
        description: 'Aplique IA estrategicamente para crescimento empresarial',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Ferramentas Avançadas',
        description: 'Cursor, Flowlabs, ElevenLabs e HatchCanvas em desenvolvimento',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Especialização',
        description: 'Torne-se especialista em IA e lidere a transformação digital',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'IA Fundamentos: base sólida em inteligência artificial',
    'IA for Business: aplicação empresarial estratégica',
    'Cursor: em desenvolvimento',
    'Flowlabs: em desenvolvimento',
    'ElevenLabs: em desenvolvimento',
    'HatchCanvas: em desenvolvimento',
    'Prompt Engineering e criação de conteúdo',
    'Integração de IA com negócios',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Projetos práticos com IA',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows, Mac ou Linux',
    'Conexão estável com internet de alta velocidade',
    'Conta Google para integrações',
    'Inglês básico (interface das ferramentas)',
    'Criatividade e vontade de inovar'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 497,
    discount: 38,
    installments: {
      max: 12,
      value: 49.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'AI Innovation Team',
    bio: 'Equipe especializada em Inteligência Artificial com experiência em desenvolvimento de soluções criativas e aplicações empresariais. Experts em ferramentas de IA emergentes.',
    photo: '/instructors/team-ia.jpg',
    experience: '6+ anos',
    credentials: [
      'Especialização em Machine Learning',
      'Experiência com ferramentas de IA generativa',
      'Projetos em empresas de tecnologia',
      'Formação em Ciência de Dados'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Leonardo Costa',
      role: 'Creator de Conteúdo',
      photo: '/testimonials/leonardo-costa.jpg',
      rating: 5,
      text: 'Fiz presencial e foi sensacional! Com IA criei conteúdo automaticamente e aumentei 500% minha produtividade.',
      result: 'Produtividade +500%'
    },
    {
      id: 2,
      name: 'Fernanda Oliveira',
      role: 'Agência Digital',
      photo: '/testimonials/fernanda-oliveira.jpg',
      rating: 5,
      text: 'Optei pelo online e minha agência oferece serviços IA! Triplicou o faturamento em 6 meses.',
      result: 'Faturamento x3 em 6 meses'
    },
    {
      id: 3,
      name: 'Carlos Mendes',
      role: 'Consultor IA',
      photo: '/testimonials/carlos-mendes.jpg',
      rating: 5,
      text: 'Com as apostilas sempre comigo, me especializei em IA e ganho R$ 20.000/mês como consultor!',
      result: 'Renda de R$ 20.000/mês'
    },
    {
      id: 4,
      name: 'Ana Caroline Barros',
      role: 'Designer em Transição',
      photo: '/testimonials/ana-caroline-barros.jpg',
      rating: 5,
      text: 'Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!',
      result: 'Transição de carreira'
    },
    {
      id: 5,
      name: 'Camila Medeiros',
      role: 'Empreendedora',
      photo: '/testimonials/camila-medeiros.jpg',
      rating: 5,
      text: 'Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.',
      result: 'Identidade visual própria'
    },
    {
      id: 6,
      name: 'Aline Silva',
      role: 'Designer Aprendiz',
      photo: '/testimonials/aline-silva.jpg',
      rating: 5,
      text: 'Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.',
      result: 'Domínio de múltiplos softwares'
    },
    {
      id: 7,
      name: 'Yasmin Camile',
      role: 'Designer Criativa',
      photo: '/testimonials/yasmin-camile.jpg',
      rating: 5,
      text: 'O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!',
      result: 'Diferencial com IA'
    },
    {
      id: 8,
      name: 'Carlos Souza',
      role: 'Designer Evoluído',
      photo: '/testimonials/carlos-souza.jpg',
      rating: 5,
      text: 'Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!',
      result: 'Evolução visível'
    },
    {
      id: 9,
      name: 'Patrícia Lima',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'O Canva me salvou! Agora tudo que eu posto tem cara de profissional!',
      result: 'Conteúdo profissional'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Preciso conhecimento técnico em programação?',
      answer: 'Não! As ferramentas são visuais e intuitivas. Ensinamos tudo do zero, focado no uso prático das IAs disponíveis.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso dos módulos disponíveis incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'Quando os módulos em desenvolvimento estarão prontos?',
      answer: 'Cursor, Flowlabs, ElevenLabs e HatchCanvas estão sendo desenvolvidos. O conteúdo será liberado conforme finalizado pela equipe.'
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
    title: 'Curso Inteligência Artificial Completo - Escola Habilidade | IA Fundamentos, IA Business, Cursor, Flowlabs - Material Incluso',
    description: 'Domine IA completa. 6 módulos: IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs, HatchCanvas. Apostilas inclusas, modalidades presencial e online.',
    keywords: ['inteligência artificial', 'ia fundamentos', 'ia business', 'cursor ai', 'flowlabs', 'elevenlabs', 'apostilas inclusas'],
    ogImage: '/og-images/inteligencia-artificial.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 6: BUSINESS INTELLIGENCE (4 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const businessIntelligence = {
  basicInfo: {
    id: 'business-intelligence-006',
    title: 'Business Intelligence',
    slug: 'business-intelligence',
    shortDescription: 'Domine Excel Fundamental, Excel Avançado, Dashboard e IA para Análise de dados inteligente.',
    longDescription: 'Curso completo de Business Intelligence com IA. Domine Excel Fundamental, Excel Avançado, Dashboard profissional e IA para Análise. 4 módulos completos para transformar dados em insights estratégicos.',
    category: 'Análise de Dados',
    level: 'Intermediário',
    duration: '54 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 4 módulos de BI',
      'Apostilas com fórmulas, dashboards e análises práticas',
      'Referência permanente para análise de dados',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Excel (Fundamental) (base para análise de dados)',
      description: 'Conteúdo já detalhado acima em Informática – módulo "Excel Fundamental", 18 aulas, 27h',
      duration: '27 horas',
      note: 'Mesmo conteúdo do módulo Excel Fundamental do curso de Informática',
      lessons: [
        { id: 1, title: 'Introdução, Desenvolvendo a Primeira Planilha', duration: '90 min', type: 'video' },
        { id: 2, title: 'Formatação Básica', duration: '90 min', type: 'video' },
        { id: 3, title: 'Menu Revisão', duration: '90 min', type: 'video' },
        { id: 4, title: 'Operações Aritméticas Básicas', duration: '90 min', type: 'video' },
        { id: 5, title: 'Explorando Porcentagens', duration: '90 min', type: 'video' },
        { id: 6, title: 'Fórmulas Relativas', duration: '90 min', type: 'video' },
        { id: 7, title: 'Funções Comuns', duration: '90 min', type: 'video' },
        { id: 8, title: 'Gráficos Parte I', duration: '90 min', type: 'video' },
        { id: 9, title: 'Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 10, title: 'Validação de Dados', duration: '90 min', type: 'video' },
        { id: 11, title: 'Funções de Pesquisas Básicas', duration: '90 min', type: 'video' },
        { id: 12, title: 'Funções Comuns II', duration: '90 min', type: 'video' },
        { id: 13, title: 'Fórmulas de texto e AutoSoma', duration: '90 min', type: 'video' },
        { id: 14, title: 'Funções Financeiras Básicas', duration: '90 min', type: 'video' },
        { id: 15, title: 'Gráficos Parte II', duration: '90 min', type: 'video' },
        { id: 16, title: 'Funções de Data e Hora Básicas', duration: '90 min', type: 'video' },
        { id: 17, title: 'Gerenciador de Nomes', duration: '90 min', type: 'video' },
        { id: 18, title: 'Configurações, Auditoria e Exibição', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Excel (Avançado) (análise e modelagem de dados)',
      description: 'Conteúdo já detalhado acima em Informática – módulo "Excel Avançado", 13 aulas, 19,5h',
      duration: '19,5 horas',
      note: 'Mesmo conteúdo do módulo Excel Avançado do curso de Informática',
      lessons: [
        { id: 19, title: 'Revisão de Fórmulas e Funções', duration: '90 min', type: 'video' },
        { id: 20, title: 'Funções de Texto', duration: '90 min', type: 'video' },
        { id: 21, title: 'Funções Lógicas', duration: '90 min', type: 'video' },
        { id: 22, title: 'Funções de Matemática/Trigonometria e Estatísticas – Parte 1', duration: '90 min', type: 'video' },
        { id: 23, title: 'Funções Estatísticas – Parte 2', duration: '90 min', type: 'video' },
        { id: 24, title: 'Funções de Data e Hora', duration: '90 min', type: 'video' },
        { id: 25, title: 'Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações', duration: '90 min', type: 'video' },
        { id: 26, title: 'Funções de Pesquisa e Referência', duration: '90 min', type: 'video' },
        { id: 27, title: 'Tabela Dinâmica e Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 28, title: 'Gráfico Dinâmico e Classificação de dados', duration: '90 min', type: 'video' },
        { id: 29, title: 'Utilizando Formulários', duration: '90 min', type: 'video' },
        { id: 30, title: 'Utilizando Macros e Noções de VBA', duration: '90 min', type: 'video' },
        { id: 31, title: 'Solver e Funções Financeiras', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Dashboard (Excel Dashboard)',
      description: 'Criação de dashboards profissionais no Excel',
      duration: '7,5 horas',
      lessons: [
        { id: 32, title: 'O que é Dashboard?', duration: '90 min', type: 'video' },
        { id: 33, title: 'Práticas de uso no Dashboard', duration: '90 min', type: 'video' },
        { id: 34, title: 'Praticando Dashboard (exercícios)', duration: '90 min', type: 'exercise' },
        { id: 35, title: 'Dashboard com Matrizes', duration: '90 min', type: 'video' },
        { id: 36, title: 'Projeto Final (Construção de um dashboard completo)', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 4,
      title: 'IA para Análise de Dados e Criação de Dashboard',
      description: 'Conteúdo programático não encontrado no site Ouro Moderno',
      duration: '0 horas',
      note: 'Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve',
      lessons: [],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Dados em insights',
        description: 'Transforme dados brutos em insights estratégicos que geram resultados'
      },
      {
        icon: 'TrendUp',
        title: 'Carreira em alta',
        description: 'Analistas de BI estão entre os profissionais mais valorizados do mercado'
      },
      {
        icon: 'Users',
        title: 'Decisões inteligentes',
        description: 'Dashboards e análises que orientam decisões executivas estratégicas'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Excel Básico',
        description: 'Fundamentos sólidos em planilhas e análise de dados',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Excel Avançado',
        description: 'Fórmulas complexas, VBA e automação profissional',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Dashboards',
        description: 'Visualizações executivas e painéis de controle profissionais',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'BI Especialista',
        description: 'IA para análise e especialização completa em Business Intelligence',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Excel Fundamental: planilhas e análises básicas',
    'Excel Avançado: fórmulas complexas e VBA',
    'Dashboard: visualizações profissionais no Excel',
    'IA para Análise: em desenvolvimento',
    'Análise de dados empresariais',
    'Tabelas dinâmicas e gráficos avançados',
    'Macros e automação no Excel',
    'Dashboards executivos profissionais',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Portfolio com projetos empresariais',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11',
    '8GB de RAM mínimo (recomendado 16GB)',
    'Microsoft Excel instalado',
    'Conhecimento básico de matemática',
    'Experiência empresarial (recomendado)'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 697,
    discount: 22,
    installments: {
      max: 12,
      value: 69.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Business Intelligence Experts',
    bio: 'Equipe de analistas de dados sênior com experiência em transformação digital empresarial. Especialistas em Excel, Dashboard e BI aplicado aos negócios.',
    photo: '/instructors/team-bi.jpg',
    experience: '10+ anos',
    credentials: [
      'Certificação Microsoft Excel Expert',
      'Especialização em Business Intelligence',
      'Experiência em análise de dados corporativos',
      'Projetos de transformação digital'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Paula Costa',
      role: 'Analista Aprendiz',
      photo: '/testimonials/paula-costa.jpg',
      rating: 5,
      text: 'A didática é muito boa! O professor explica de um jeito que realmente dá vontade de continuar.',
      result: 'Didática excelente'
    },
    {
      id: 2,
      name: 'Heitor Barbosa',
      role: 'Profissional de Dados',
      photo: '/testimonials/heitor-barbosa.jpg',
      rating: 5,
      text: 'Esse curso é um divisor de águas pra quem quer crescer na área de dados.',
      result: 'Divisor de águas'
    },
    {
      id: 3,
      name: 'Carlos Petri',
      role: 'Aluno Satisfeito',
      photo: '/testimonials/carlos-petri.jpg',
      rating: 5,
      text: 'Me identifiquei muito com a forma de ensinar. Já indiquei pra dois colegas!',
      result: 'Indicação para colegas'
    },
    {
      id: 4,
      name: 'Vitor Santos',
      role: 'Analista Recomendador',
      photo: '/testimonials/vitor-santos.jpg',
      rating: 5,
      text: 'Recomendo pra qualquer pessoa que queira melhorar profissionalmente com análise de dados!',
      result: 'Melhoria profissional'
    },
    {
      id: 5,
      name: 'Fernanda Campos',
      role: 'Analista BI Júnior',
      photo: '/testimonials/fernanda-campos.jpg',
      rating: 5,
      text: 'Entrei no curso sem saber absolutamente nada de Excel. Sempre tive dificuldade com números e achava que análise de dados era só pra quem fazia TI. Mas o jeito que o conteúdo foi organizado me deu muita segurança. Hoje, faço dashboards completos, automatizo relatórios no Power BI e uso IA pra gerar apresentações de forma rápida. O curso me ajudou a conquistar uma vaga nova com aumento salarial. Gratidão eterna!',
      result: 'Nova vaga com aumento'
    },
    {
      id: 6,
      name: 'João Paulo',
      role: 'Analista Evoluído',
      photo: '/testimonials/joao-paulo.jpg',
      rating: 5,
      text: 'A estrutura do curso é muito bem pensada. As aulas são diretas, com exemplos práticos e desafios que te forçam a aprender de verdade. Em poucas semanas, saí do nível básico para conseguir montar gráficos dinâmicos, usar funções lógicas e até começar a explorar o VBA. Senti uma evolução real, e isso me motivou ainda mais a seguir nessa área de BI.',
      result: 'Evolução real e motivação'
    },
    {
      id: 4,
      name: 'Ana Caroline Barros',
      role: 'Designer em Transição',
      photo: '/testimonials/ana-caroline-barros.jpg',
      rating: 5,
      text: 'Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!',
      result: 'Transição de carreira'
    },
    {
      id: 5,
      name: 'Camila Medeiros',
      role: 'Empreendedora',
      photo: '/testimonials/camila-medeiros.jpg',
      rating: 5,
      text: 'Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.',
      result: 'Identidade visual própria'
    },
    {
      id: 6,
      name: 'Aline Silva',
      role: 'Designer Aprendiz',
      photo: '/testimonials/aline-silva.jpg',
      rating: 5,
      text: 'Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.',
      result: 'Domínio de múltiplos softwares'
    },
    {
      id: 7,
      name: 'Yasmin Camile',
      role: 'Designer Criativa',
      photo: '/testimonials/yasmin-camile.jpg',
      rating: 5,
      text: 'O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!',
      result: 'Diferencial com IA'
    },
    {
      id: 8,
      name: 'Carlos Souza',
      role: 'Designer Evoluído',
      photo: '/testimonials/carlos-souza.jpg',
      rating: 5,
      text: 'Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!',
      result: 'Evolução visível'
    },
    {
      id: 9,
      name: 'Patrícia Lima',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'O Canva me salvou! Agora tudo que eu posto tem cara de profissional!',
      result: 'Conteúdo profissional'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Preciso conhecimento prévio em Excel?',
      answer: 'Não! Começamos do Excel Fundamental e evoluímos até Excel Avançado com fórmulas complexas e VBA.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 4 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'Quando o módulo de IA para Análise estará disponível?',
      answer: 'O módulo de IA para Análise de Dados está sendo desenvolvido. O conteúdo será liberado assim que finalizado.'
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
    title: 'Curso Business Intelligence Completo - Escola Habilidade | Excel Fundamental, Excel Avançado, Dashboard, IA - Material Incluso',
    description: 'Torne-se especialista em Business Intelligence. 4 módulos: Excel Fundamental, Excel Avançado, Dashboard, IA para Análise. 54 horas, apostilas inclusas.',
    keywords: ['business intelligence', 'excel avançado', 'dashboard', 'ia para análise', 'bi', 'apostilas inclusas'],
    ogImage: '/og-images/business-intelligence.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 7: PROJETISTA (2 MÓDULOS CONFORME CATÁLOGO)
// ===================================================================
const projetista = {
  basicInfo: {
    id: 'projetista-007',
    title: 'Curso SketchUp Projetista 3D',
    slug: 'projetista-3d',
    shortDescription: 'Curso SketchUp e Enscape presencial em São José SC. Aprenda modelagem 3D e renderização com IA para projetos arquitetônicos profissionais.',
    longDescription: 'Curso Projetista 3D presencial com SketchUp, Enscape e Inteligência Artificial. Única escola em Santa Catarina com esta combinação. 56 horas práticas, turmas pequenas e certificado reconhecido.',
    category: 'Arquitetura & Design',
    level: 'Intermediário',
    duration: '56 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 2 módulos',
      'Apostilas com projetos práticos e exercícios',
      'Referência permanente para consulta profissional',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores certificados internacionalmente'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  // ✅ Por que presencial? - Diferencial competitivo
  whyPresencial: {
    title: 'Por que Escolher o Curso Presencial?',
    subtitle: 'Único curso SketchUp + Enscape + IA presencial em Santa Catarina',
    benefits: [
      {
        icon: 'users',
        title: 'Turmas Pequenas',
        description: 'Máximo 8 alunos por turma garantem atenção individualizada do professor.'
      },
      {
        icon: 'handshake',
        title: 'Suporte Imediato',
        description: 'Professor ao seu lado para tirar dúvidas na hora e corrigir erros em tempo real.'
      },
      {
        icon: 'network',
        title: 'Networking Local',
        description: 'Conheça outros profissionais de SC e forme sua rede de contatos na área.'
      },
      {
        icon: 'computer',
        title: 'Equipamentos Profissionais',
        description: 'Use computadores com placas de vídeo dedicadas para Enscape sem limitações.'
      },
      {
        icon: 'certificate',
        title: 'Certificado Presencial',
        description: 'Certificado nacional com diferencial de curso presencial reconhecido pelo mercado.'
      },
      {
        icon: 'location',
        title: 'Localização Estratégica',
        description: 'São José - SC, no coração da Grande Florianópolis, fácil acesso da região.'
      }
    ]
  },

  curriculum: [
    {
      id: 1,
      title: 'SketchUp',
      description: 'Modelagem 3D profissional para arquitetura e design',
      duration: '40 horas',
              lessons: [
        { id: 1, title: 'Fundamentos do SketchUp', duration: '120 min', type: 'video' },
        { id: 2, title: 'Modificadores e Geometrias', duration: '120 min', type: 'video' },
        { id: 3, title: 'Projeto Guiado – Volume Simples', duration: '120 min', type: 'project' },
        { id: 4, title: 'Grupos e Componentes', duration: '120 min', type: 'video' },
        { id: 5, title: 'Manipulação Avançada de Geometrias', duration: '120 min', type: 'video' },
        { id: 6, title: 'Eixos e Superfícies Inclinadas', duration: '120 min', type: 'video' },
        { id: 7, title: 'Projeto Guiado – Elementos Arquitetônicos', duration: '120 min', type: 'project' },
        { id: 8, title: 'Materiais e Texturas', duration: '120 min', type: 'video' },
        { id: 9, title: 'Ferramenta Siga-me (Follow Me)', duration: '120 min', type: 'video' },
        { id: 10, title: 'Sandbox e Terrenos', duration: '120 min', type: 'video' },
        { id: 11, title: 'Vetorização e Logotipos 3D', duration: '120 min', type: 'video' },
        { id: 12, title: 'Ferramentas de Sólidos', duration: '120 min', type: 'video' },
        { id: 13, title: 'Importação de Arquivos CAD', duration: '120 min', type: 'video' },
        { id: 14, title: 'Introdução ao Layout do SketchUp', duration: '120 min', type: 'video' },
        { id: 15, title: 'Documentação Técnica com Layout', duration: '120 min', type: 'video' },
        { id: 16, title: 'Plugins Essenciais', duration: '120 min', type: 'video' },
        { id: 17, title: 'Componentes Dinâmicos I', duration: '120 min', type: 'video' },
        { id: 18, title: 'Projeto Guiado – Interiores Residenciais', duration: '120 min', type: 'project' },
        { id: 19, title: 'Projeto Guiado – Fachada com Terreno', duration: '120 min', type: 'project' },
        { id: 20, title: 'Layout Final do Projeto Completo', duration: '120 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Enscape',
      description: 'Renderização em tempo real e realidade virtual com IA',
      duration: '16 horas',
      lessons: [
        { id: 1, title: 'Introdução ao Enscape e Configuração Inicial', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 2, title: 'Iluminação Natural e Artificial', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 3, title: 'Materiais e Texturização no Enscape', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 4, title: 'Câmeras e Enquadramentos Profissionais', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 5, title: 'Configurações de Render e Qualidade', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 6, title: 'Animações e Vídeos com Enscape', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 7, title: 'Ambientes Externos e Vegetação', label: 'Renderização', duration: '120 min', type: 'video' },
        { id: 8, title: 'Projeto Guiado Completo com Enscape', label: 'Projeto', duration: '120 min', type: 'project' },
      ],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Projetos profissionais',
        description: 'Crie projetos arquitetônicos 3D com padrão internacional de qualidade'
      },
      {
        icon: 'TrendUp',
        title: 'Mercado em crescimento',
        description: 'Arquitetura e design 3D são áreas em expansão com alta demanda'
      },
      {
        icon: 'Users',
        title: 'Destaque no mercado',
        description: 'Projetos com IA e renderização realista impressionam clientes'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'SketchUp Básico',
        description: 'Fundamentos de modelagem 3D e ferramentas essenciais',
        icon: 'House'
      },
      {
        number: 2,
        title: 'SketchUp Avançado',
        description: 'Projetos completos, componentes dinâmicos e plugins',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Enscape IA',
        description: 'Renderização em tempo real com inteligência artificial',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Portfolio',
        description: 'Projetos reais e apresentações profissionais',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'SketchUp: modelagem 3D profissional para arquitetura',
    'Enscape: renderização em tempo real com IA',
    'Criação de projetos arquitetônicos completos',
    'Layout técnico com normas ABNT',
    'Materiais, texturas e iluminação realista',
    'Componentes dinâmicos e plugins essenciais',
    'Animações e vídeos walkthrough',
    'Realidade virtual e panoramas 360°',
    'Portfólio com projetos reais',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Placa de vídeo dedicada (recomendado)',
    'SketchUp Pro (orientações de licenciamento)',
    'Enscape (orientações de licenciamento)',
    'Conhecimento básico de desenho técnico (desejável)'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1297,
    currentPrice: 997,
    discount: 23,
    installments: {
      max: 12,
      value: 99.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: '3D Architecture Masters',
    bio: 'Equipe de arquitetos e designers certificados em SketchUp e Enscape com experiência internacional. Especialistas em projetos arquitetônicos e renderização profissional.',
    photo: '/instructors/team-projetista.jpg',
    experience: '12+ anos',
    credentials: [
      'Certificação SketchUp Pro Internacional',
      'Enscape Certified Professional',
      'Experiência em escritórios de arquitetura',
      'Projetos premiados em concursos nacionais'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Juliana Marques',
      role: 'Projetista',
      photo: '/testimonials/juliana-marques.jpg', // Placeholder image
      rating: 5,
      text: 'Estou adorando o curso de Projetista na Escola Habilidade! O professor explica tudo de um jeito fácil e traz exemplos reais que fazem toda a diferença. Sinto que evoluí bastante desde que comecei.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 2,
      name: 'Carlos Eduardo Oliveira',
      role: 'Projetista',
      photo: '/testimonials/carlos-eduardo-oliveira.jpg', // Placeholder image
      rating: 5,
      text: 'O curso está sendo ótimo. Aulas práticas, dinâmicas e professor super atencioso. Já estou conseguindo aplicar no meu trabalho tudo que aprendo aqui.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 3,
      name: 'Amanda Cristina Silva',
      role: 'Projetista',
      photo: '/testimonials/amanda-cristina-silva.jpg', // Placeholder image
      rating: 5,
      text: 'Gostei muito das aulas de SketchUp e Enscape! O ambiente da Escola Habilidade é super acolhedor, e as atividades são bem organizadas, tornando o aprendizado mais leve.',
      location: 'São José - SC',
      date: 'jan. de 2025'
    },
    {
      id: 4,
      name: 'Rodrigo dos Santos Pereira',
      role: 'Projetista',
      photo: '/testimonials/rodrigo-dos-santos-pereira.jpg', // Placeholder image
      rating: 5,
      text: 'Excelente curso, professor super experiente e com bastante conhecimento de mercado. Já consegui evoluir bastante na parte prática e me sinto mais preparado para projetos reais.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    },
    {
      id: 5,
      name: 'Bruna Almeida',
      role: 'Projetista',
      photo: '/testimonials/bruna-almeida.jpg', // Placeholder image
      rating: 5,
      text: 'Estou tendo uma ótima experiência com o curso. A parte prática é muito bem feita, o professor sempre incentiva a criatividade e a aplicação dos conceitos em situações reais.',
      location: 'São José - SC',
      date: 'nov. de 2024'
    },
    {
      id: 6,
      name: 'Thiago Henrique Lopes',
      role: 'Projetista',
      photo: '/testimonials/thiago-henrique-lopes.jpg', // Placeholder image
      rating: 5,
      text: 'Curso presencial muito bom, com aulas bem organizadas. Adorei como o professor relaciona tudo com o dia a dia do projetista. Me sinto mais seguro a cada aula.',
      location: 'São José - SC',
      date: 'dez. de 2024'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Quanto tempo leva para aprender SketchUp do zero?',
      answer: 'No nosso curso presencial de 56 horas, você aprende SketchUp desde o básico até projetos avançados em 2 meses. Incluímos também Enscape para renderização em tempo real e técnicas com inteligência artificial.'
    },
    {
      id: 2,
      question: 'Qual diferença entre curso SketchUp presencial e online?',
      answer: 'O curso presencial em São José SC oferece prática hands-on, suporte imediato do professor e networking com outros alunos. Turmas pequenas garantem atenção individualizada que cursos online não conseguem oferecer.'
    },
    {
      id: 3,
      question: 'Como funciona renderização com Enscape e inteligência artificial?',
      answer: 'O Enscape renderiza projetos SketchUp em tempo real (segundos vs horas). Com IA, otimizamos automaticamente iluminação, materiais e ambientação. Você aprende essas técnicas avançadas no nosso curso.'
    },
    {
      id: 4,
      question: 'Preciso saber AutoCAD para fazer curso de projetista 3D?',
      answer: 'Não é obrigatório. O SketchUp é mais intuitivo que AutoCAD para modelagem 3D. Começamos do zero e em 56 horas você estará criando projetos arquitetônicos completos.'
    },
    {
      id: 5,
      question: 'Quanto ganha um projetista 3D em Santa Catarina?',
      answer: 'Projetistas 3D em SC ganham entre R$ 2.500-6.000. Com SketchUp + Enscape, profissionais freelancers cobram R$ 150-300 por projeto renderizado. Nosso curso prepara você para esse mercado.'
    },
    {
      id: 6,
      question: 'Existe curso SketchUp certificado em Florianópolis?',
      answer: 'Sim! Nossa escola em São José (Grande Florianópolis) oferece certificado nacional reconhecido. Somos a única escola em SC com curso presencial de SketchUp + Enscape + IA.'
    },
    {
      id: 7,
      question: 'Posso trabalhar como projetista freelancer após o curso?',
      answer: 'Absolutamente! Ensinamos desde modelagem até precificação de projetos. Muitos alunos começam freelances ainda durante o curso. O mercado de projetos 3D está aquecido em SC.'
    },
    {
      id: 8,
      question: 'O que está incluído no curso projetista 3D presencial?',
      answer: '56 horas de aulas práticas, material didático completo, certificado nacional, suporte pós-curso e acesso aos softwares SketchUp Pro e Enscape durante as aulas.'
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
    title: 'Curso SketchUp e Enscape São José SC | Projetista 3D com IA | Escola Habilidade',
    description: 'Curso Projetista 3D com SketchUp e Enscape + IA em São José SC. 56h presenciais, certificado reconhecido. Turmas pequenas, avaliação 4.9★',
    keywords: ['curso sketchup', 'curso enscape', 'projetista 3d são josé', 'curso sketchup santa catarina', 'renderização tempo real', 'sketchup presencial', 'enscape inteligência artificial', 'curso projetista florianópolis'],
    ogImage: '/og-images/projetista-3d.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 8: EDIÇÃO DE VÍDEO (2 MÓDULOS CONFORME DEFINIDO)
// ===================================================================
const edicaoVideo = {
  basicInfo: {
    id: 'edicao-video-008',
    title: 'Edição de Vídeo',
    slug: 'edicao-video',
    shortDescription: 'Domine Adobe Premiere Pro CC e After Effects CC para criar vídeos profissionais e motion graphics.',
    longDescription: 'Aprenda edição de vídeo profissional do zero ao avançado. Domine Adobe Premiere Pro CC e After Effects CC para se tornar um editor completo e requisitado no mercado audiovisual.',
    category: 'Audiovisual',
    level: 'Intermediário',
    duration: '48 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso dos 2 módulos',
      'Apostilas com projetos práticos e exercícios',
      'Referência permanente para consulta profissional',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Adobe Premiere Pro CC',
      description: 'Edição profissional de vídeos com o software líder do mercado',
      duration: '27 horas',
      lessons: [
        { id: 1, title: 'Introdução ao programa', duration: '90 min', type: 'video' },
        { id: 2, title: 'Ferramentas básicas de edição', duration: '90 min', type: 'video' },
        { id: 3, title: 'Transições de vídeo e adicionando texto', duration: '90 min', type: 'video' },
        { id: 4, title: 'Transição Swish e Keyframes', duration: '90 min', type: 'video' },
        { id: 5, title: 'Efeitos de vídeo', duration: '90 min', type: 'video' },
        { id: 6, title: 'Transição RGB, Transições e Efeitos de áudio', duration: '90 min', type: 'video' },
        { id: 7, title: 'Animação', duration: '90 min', type: 'video' },
        { id: 8, title: 'Criando Lower Thirds (redes sociais e nome)', duration: '90 min', type: 'video' },
        { id: 9, title: 'Criar intro para os vídeos', duration: '90 min', type: 'video' },
        { id: 10, title: 'Frame Hold e bordas desfocadas', duration: '90 min', type: 'video' },
        { id: 11, title: 'Smooth Transitions e Glitchs', duration: '90 min', type: 'video' },
        { id: 12, title: 'Vídeo em preto e branco e efeito Fisheye', duration: '90 min', type: 'video' },
        { id: 13, title: 'Transição usando pessoas e acelerar, desacelerar e reverter vídeos', duration: '90 min', type: 'video' },
        { id: 14, title: 'Efeito Flash', duration: '90 min', type: 'video' },
        { id: 15, title: 'Efeito mágica', duration: '90 min', type: 'video' },
        { id: 16, title: 'Correção de cor, predefinições e adicionando Luts', duration: '90 min', type: 'video' },
        { id: 17, title: 'Adicionar créditos a partir de gráficos essenciais', duration: '90 min', type: 'video' },
        { id: 18, title: 'Renderizar projeto', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 2,
      title: 'Adobe After Effects CC',
      description: 'Motion graphics e efeitos visuais cinematográficos',
      duration: '21 horas',
      lessons: [
        { id: 19, title: 'Workspace e Composições', duration: '90 min', type: 'video' },
        { id: 20, title: 'Background e Composição', duration: '90 min', type: 'video' },
        { id: 21, title: 'Máscara', duration: '90 min', type: 'video' },
        { id: 22, title: 'Correção de cores', duration: '90 min', type: 'video' },
        { id: 23, title: 'Controles de câmera', duration: '90 min', type: 'video' },
        { id: 24, title: 'Sincronização e efeitos de áudio', duration: '90 min', type: 'video' },
        { id: 25, title: 'Efeitos', duration: '90 min', type: 'video' },
        { id: 26, title: 'Efeito de revelação de texto', duration: '90 min', type: 'video' },
        { id: 27, title: 'Finalizando o projeto e renderizando', duration: '90 min', type: 'video' },
        { id: 28, title: 'Processo de sincronização de vídeos', duration: '90 min', type: 'video' },
        { id: 29, title: 'Transição suave (Zoom)', duration: '90 min', type: 'video' },
        { id: 30, title: 'Editor gráfico de efeitos', duration: '90 min', type: 'video' },
        { id: 31, title: 'Transições e Ancoragem', duration: '90 min', type: 'video' },
        { id: 32, title: 'Projeto Final', duration: '90 min', type: 'project' },
      ],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Vídeos profissionais',
        description: 'Crie vídeos cinematográficos e motion graphics de padrão internacional'
      },
      {
        icon: 'TrendUp',
        title: 'Mercado crescente',
        description: 'Editores de vídeo estão entre os profissionais mais procurados'
      },
      {
        icon: 'Users',
        title: 'YouTube e redes sociais',
        description: 'Domine criação de conteúdo para todas as plataformas digitais'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Premiere Básico',
        description: 'Fundamentos de edição e ferramentas essenciais',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Premiere Avançado',
        description: 'Efeitos, transições e correção de cor profissional',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'After Effects',
        description: 'Motion graphics e efeitos visuais cinematográficos',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Editor Profissional',
        description: 'Portfolio completo e projetos comerciais',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Adobe Premiere Pro CC: edição profissional completa',
    'Adobe After Effects CC: motion graphics e VFX',
    'Técnicas avançadas de transições e efeitos',
    'Correção de cor e gradação cinematográfica',
    'Criação de intros, vinhetas e lower thirds',
    'Sincronização perfeita de áudio e vídeo',
    'Efeitos visuais e composição profissional',
    'Workflow otimizado para YouTube e redes sociais',
    'Renderização e exportação em múltiplos formatos',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '16GB de RAM (mínimo 8GB)',
    'Placa de vídeo dedicada (recomendado)',
    'Adobe Creative Cloud (Premiere + After Effects)',
    'SSD com 100GB livres',
    'Conhecimentos básicos de informática'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 447,
    discount: 44,
    installments: {
      max: 12,
      value: 44.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
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
    },
    {
      id: 4,
      name: 'Ana Caroline Barros',
      role: 'Designer em Transição',
      photo: '/testimonials/ana-caroline-barros.jpg',
      rating: 5,
      text: 'Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!',
      result: 'Transição de carreira'
    },
    {
      id: 5,
      name: 'Camila Medeiros',
      role: 'Empreendedora',
      photo: '/testimonials/camila-medeiros.jpg',
      rating: 5,
      text: 'Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.',
      result: 'Identidade visual própria'
    },
    {
      id: 6,
      name: 'Aline Silva',
      role: 'Designer Aprendiz',
      photo: '/testimonials/aline-silva.jpg',
      rating: 5,
      text: 'Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.',
      result: 'Domínio de múltiplos softwares'
    },
    {
      id: 7,
      name: 'Yasmin Camile',
      role: 'Designer Criativa',
      photo: '/testimonials/yasmin-camile.jpg',
      rating: 5,
      text: 'O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!',
      result: 'Diferencial com IA'
    },
    {
      id: 8,
      name: 'Carlos Souza',
      role: 'Designer Evoluído',
      photo: '/testimonials/carlos-souza.jpg',
      rating: 5,
      text: 'Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!',
      result: 'Evolução visível'
    },
    {
      id: 9,
      name: 'Patrícia Lima',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'O Canva me salvou! Agora tudo que eu posto tem cara de profissional!',
      result: 'Conteúdo profissional'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Quais softwares serão utilizados no curso?',
      answer: 'Adobe Premiere Pro CC e After Effects CC. Orientamos sobre licenciamento e oferecemos alternativas para prática.'
    },
    {
      id: 2,
      question: 'Funciona para iniciantes completos em edição?',
      answer: 'Sim! Começamos do absoluto zero, ensinando desde os fundamentos até edições cinematográficas profissionais.'
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
    title: 'Curso Edição de Vídeo Completo - Escola Habilidade | Premiere Pro CC, After Effects CC - Material Incluso',
    description: 'Torne-se Editor de Vídeo profissional. Adobe Premiere Pro CC e After Effects CC. 48 horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['edição de vídeo', 'premiere pro cc', 'after effects cc', 'motion graphics', 'youtube', 'editor', 'apostilas inclusas'],
    ogImage: '/og-images/edicao-video.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// CURSO 9: ADMINISTRAÇÃO (9 MÓDULOS CONFORME ESPECIFICADO)
// ===================================================================
const administracao = {
  basicInfo: {
    id: 'administracao-009',
    title: 'Administração',
    slug: 'administracao',
    shortDescription: 'Curso completo de administração com Windows 11, Office completo, Matemática Financeira, Departamento Pessoal e Liderança.',
    longDescription: 'Domine as ferramentas essenciais para administração moderna. Aprenda Windows 11, Office completo (Word, Excel, PowerPoint), Matemática Financeira, Departamento Pessoal, Crédito & Cobrança e Liderança Eficaz. 9 módulos completos para formação administrativa completa.',
    category: 'Negócios',
    level: 'Iniciante',
    duration: '153 horas',
    certificate: true,
    active: true,
  },
  
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: 'Apostilas impressas completas de cada módulo',
    details: [
      'Material didático impresso de todos os 9 módulos',
      'Apostilas detalhadas com exercícios práticos',
      'Referência permanente para estudos administrativos',
      'Incluído no preço do curso sem custo adicional'
    ]
  },

  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: 'Aulas presenciais na escola com instrutores especializados'
    },
    online: {
      available: true,
      description: 'Acesso remoto às aulas com suporte online'
    }
  },

  curriculum: [
    {
      id: 1,
      title: 'Windows 11',
      description: 'Sistema operacional moderno para administração',
      duration: '18 horas',
      lessons: [
        { id: 1, title: 'Introdução ao Windows 11', duration: '90 min', type: 'video' },
        { id: 2, title: 'Aplicativos Parte I', duration: '90 min', type: 'video' },
        { id: 3, title: 'Microsoft Edge', duration: '90 min', type: 'video' },
        { id: 4, title: 'Explorador de Arquivos Parte I', duration: '90 min', type: 'video' },
        { id: 5, title: 'Explorador de Arquivos Parte II', duration: '90 min', type: 'video' },
        { id: 6, title: 'Personalizando o Sistema', duration: '90 min', type: 'video' },
        { id: 7, title: 'Acessibilidade Parte I', duration: '90 min', type: 'video' },
        { id: 8, title: 'Aplicativos Parte II', duration: '90 min', type: 'video' },
        { id: 9, title: 'Aplicativos Parte III', duration: '90 min', type: 'video' },
        { id: 10, title: 'Aplicativos Parte IV', duration: '90 min', type: 'video' },
        { id: 11, title: 'Barra de Tarefas', duration: '90 min', type: 'video' },
        { id: 12, title: 'Acessibilidade Parte II', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Word Fundamental',
      description: 'Processamento de texto para documentos administrativos',
      duration: '21 horas',
      lessons: [
        { id: 13, title: 'Introdução ao word 2019', duration: '90 min', type: 'video' },
        { id: 14, title: 'Iniciando um documento', duration: '90 min', type: 'video' },
        { id: 15, title: 'Formatando texto e utilização da nova Ferramenta de Aprendizagem', duration: '90 min', type: 'video' },
        { id: 16, title: 'Inserção de tabelas e ícones SVGs', duration: '90 min', type: 'video' },
        { id: 17, title: 'Inserção de elementos gráficos I', duration: '90 min', type: 'video' },
        { id: 18, title: 'Inserção de elementos gráficos e imagens 3D', duration: '90 min', type: 'video' },
        { id: 19, title: 'Criação de estruturas de texto I', duration: '90 min', type: 'video' },
        { id: 20, title: 'Criação de estruturas de texto II', duration: '90 min', type: 'video' },
        { id: 21, title: 'Inserção de elementos de texto e nova sintaxe LaTeX', duration: '90 min', type: 'video' },
        { id: 22, title: 'Layout da página', duration: '90 min', type: 'video' },
        { id: 23, title: 'Design', duration: '90 min', type: 'video' },
        { id: 24, title: 'Revisão', duration: '90 min', type: 'video' },
        { id: 25, title: 'Armazenamento e compartilhamento', duration: '90 min', type: 'video' },
        { id: 26, title: 'Impressão', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Excel Fundamental',
      description: 'Planilhas eletrônicas para gestão administrativa',
      duration: '27 horas',
      lessons: [
        { id: 27, title: 'Introdução, Desenvolvendo a Primeira Planilha', duration: '90 min', type: 'video' },
        { id: 28, title: 'Formatação Básica', duration: '90 min', type: 'video' },
        { id: 29, title: 'Menu Revisão', duration: '90 min', type: 'video' },
        { id: 30, title: 'Operações Aritméticas Básicas', duration: '90 min', type: 'video' },
        { id: 31, title: 'Explorando Porcentagens', duration: '90 min', type: 'video' },
        { id: 32, title: 'Fórmulas Relativas', duration: '90 min', type: 'video' },
        { id: 33, title: 'Funções Comuns', duration: '90 min', type: 'video' },
        { id: 34, title: 'Gráficos Parte I', duration: '90 min', type: 'video' },
        { id: 35, title: 'Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 36, title: 'Validação de Dados', duration: '90 min', type: 'video' },
        { id: 37, title: 'Funções De Pesquisas Básicas', duration: '90 min', type: 'video' },
        { id: 38, title: 'Funções Comuns II', duration: '90 min', type: 'video' },
        { id: 39, title: 'Fórmulas de texto e AutoSoma', duration: '90 min', type: 'video' },
        { id: 40, title: 'Funções Financeiras Básicas', duration: '90 min', type: 'video' },
        { id: 41, title: 'Gráficos Parte II', duration: '90 min', type: 'video' },
        { id: 42, title: 'Funções de Data e Hora Básicas', duration: '90 min', type: 'video' },
        { id: 43, title: 'Gerenciador de Nomes', duration: '90 min', type: 'video' },
        { id: 44, title: 'Configurações, auditoria e exibição', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 4,
      title: 'Excel Avançado',
      description: 'Análise avançada de dados administrativos',
      duration: '19,5 horas',
      lessons: [
        { id: 45, title: 'Revisão de Fórmulas e Funções', duration: '90 min', type: 'video' },
        { id: 46, title: 'Funções De Texto', duration: '90 min', type: 'video' },
        { id: 47, title: 'Funções Lógicas', duration: '90 min', type: 'video' },
        { id: 48, title: 'Funções de Matemática, Trigonometria e Funções de Estatísticas – Parte 1', duration: '90 min', type: 'video' },
        { id: 49, title: 'Funções de Estatísticas – Parte 2', duration: '90 min', type: 'video' },
        { id: 50, title: 'Funções de Data e Hora', duration: '90 min', type: 'video' },
        { id: 51, title: 'Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações', duration: '90 min', type: 'video' },
        { id: 52, title: 'Funções de Pesquisa e Referência', duration: '90 min', type: 'video' },
        { id: 53, title: 'Tabela Dinâmica e Formatação Condicional', duration: '90 min', type: 'video' },
        { id: 54, title: 'Gráfico Dinâmico e Classificação de dados', duration: '90 min', type: 'video' },
        { id: 55, title: 'Utilizando Formulários', duration: '90 min', type: 'video' },
        { id: 56, title: 'Utilizando Macros e Noções de VBA', duration: '90 min', type: 'video' },
        { id: 57, title: 'Solver e Funções Financeiras', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 5,
      title: 'Matemática Financeira',
      description: 'Gestão financeira com HP12C e conceitos aplicados',
      duration: '19,5 horas',
      lessons: [
        { id: 58, title: 'Introdução ao uso da HP12C', duration: '90 min', type: 'video' },
        { id: 59, title: 'Conhecendo a Calculadora', duration: '90 min', type: 'video' },
        { id: 60, title: 'Configurando a Calculadora', duration: '90 min', type: 'video' },
        { id: 61, title: 'Registradores, Funções e Códigos de Erros', duration: '90 min', type: 'video' },
        { id: 62, title: 'Introdução à Mat.Finaceira e Diagrama de Fluxo', duration: '90 min', type: 'video' },
        { id: 63, title: 'Juros Simples e Juros Compostos', duration: '90 min', type: 'video' },
        { id: 64, title: 'Séries Uniformes, Não-Uniformes e Amortização', duration: '90 min', type: 'video' },
        { id: 65, title: 'Taxas de Juros e Descontos', duration: '90 min', type: 'video' },
        { id: 66, title: 'Gestão de Custo e Formação de Preço', duration: '90 min', type: 'video' },
        { id: 67, title: 'Mercados Financeiros', duration: '90 min', type: 'video' },
        { id: 68, title: 'Estatística – I', duration: '90 min', type: 'video' },
        { id: 69, title: 'Estatística – II', duration: '90 min', type: 'video' },
        { id: 70, title: 'Noções Básicas de Contabilidade', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 6,
      title: 'Power Point',
      description: 'Apresentações profissionais para administração',
      duration: '18 horas',
      lessons: [
        { id: 71, title: 'Introdução ao Power Point 2019', duration: '90 min', type: 'video' },
        { id: 72, title: 'Ferramentas', duration: '90 min', type: 'video' },
        { id: 73, title: 'Iniciando uma apresentação', duration: '90 min', type: 'video' },
        { id: 74, title: 'Texto', duration: '90 min', type: 'video' },
        { id: 75, title: 'Layout de slide', duration: '90 min', type: 'video' },
        { id: 76, title: 'Elementos gráficos I', duration: '90 min', type: 'video' },
        { id: 77, title: 'Elementos gráficos II', duration: '90 min', type: 'video' },
        { id: 78, title: 'Multimídia', duration: '90 min', type: 'video' },
        { id: 79, title: 'Transições', duration: '90 min', type: 'video' },
        { id: 80, title: 'Testes de apresentação', duration: '90 min', type: 'video' },
        { id: 81, title: 'Revisão', duration: '90 min', type: 'video' },
        { id: 82, title: 'Projeto', duration: '90 min', type: 'project' },
      ],
    },
    {
      id: 7,
      title: 'Departamento Pessoal',
      description: 'Gestão de pessoas e folha de pagamento',
      duration: '13,5 horas',
      lessons: [
        { id: 83, title: 'Conceitos Gerais', duration: '90 min', type: 'video' },
        { id: 84, title: 'Importância do DP', duration: '90 min', type: 'video' },
        { id: 85, title: 'Seguridade Social', duration: '90 min', type: 'video' },
        { id: 86, title: 'Remuneração', duration: '90 min', type: 'video' },
        { id: 87, title: 'Pagamentos e Descontos 1', duration: '90 min', type: 'video' },
        { id: 88, title: 'Pagamentos e Descontos 2', duration: '90 min', type: 'video' },
        { id: 89, title: 'Jornada de Trabalho 1', duration: '90 min', type: 'video' },
        { id: 90, title: 'Jornada de trabalho 2', duration: '90 min', type: 'video' },
        { id: 91, title: 'Rescisão de Contrato de Trabalho', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 8,
      title: 'Crédito, Cobrança e Atendimento',
      description: 'Gestão financeira e relacionamento com clientes',
      duration: '9 horas',
      lessons: [
        { id: 92, title: 'Operações de Crédito – Financiamento', duration: '90 min', type: 'video' },
        { id: 93, title: 'Operações de Crédito – Empréstimos', duration: '90 min', type: 'video' },
        { id: 94, title: 'Análise de Crédito', duration: '90 min', type: 'video' },
        { id: 95, title: 'Limites de Crédito', duration: '90 min', type: 'video' },
        { id: 96, title: 'Políticas de Crédito e Cobrança', duration: '90 min', type: 'video' },
        { id: 97, title: 'Atendimento de Cobrança', duration: '90 min', type: 'video' },
      ],
    },
    {
      id: 9,
      title: 'Liderança Eficaz',
      description: 'Desenvolvimento de competências de liderança',
      duration: '7,5 horas',
      lessons: [
        { id: 98, title: 'Objetivos da Liderança', duration: '90 min', type: 'video' },
        { id: 99, title: 'Comunicação e Empatia', duration: '90 min', type: 'video' },
        { id: 100, title: 'Liderança x Chefia', duration: '90 min', type: 'video' },
        { id: 101, title: 'Responsabilidade pelos erros', duration: '90 min', type: 'video' },
        { id: 102, title: 'Delegando e formando sucessores', duration: '90 min', type: 'video' },
      ],
    }
  ],

  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: 'BookOpen',
        title: 'Formação administrativa completa',
        description: 'Do operacional ao estratégico: todas as ferramentas para administrar com excelência'
      },
      {
        icon: 'TrendUp',
        title: 'Mercado sempre demandando',
        description: 'Administradores são essenciais em qualquer empresa - área com demanda constante'
      },
      {
        icon: 'Users',
        title: 'Múltiplas oportunidades',
        description: 'Trabalhe em empresas, seja freelancer ou empreenda com conhecimento sólido'
      }
    ]
  },

  journey: {
    steps: [
      {
        number: 1,
        title: 'Fundamentos',
        description: 'Domine Windows 11 e Office para administração moderna',
        icon: 'House'
      },
      {
        number: 2,
        title: 'Análise',
        description: 'Excel avançado e matemática financeira para decisões estratégicas',
        icon: 'Wrench'
      },
      {
        number: 3,
        title: 'Gestão',
        description: 'Departamento pessoal, crédito & cobrança para gestão completa',
        icon: 'Crown'
      },
      {
        number: 4,
        title: 'Liderança',
        description: 'Desenvolva competências de liderança e gerencie equipes',
        icon: 'Trophy'
      }
    ]
  },

  whatYouWillLearn: [
    'Windows 11: produtividade total em administração',
    'Office completo: Word, Excel e PowerPoint profissionais',
    'Excel Fundamental e Avançado com análise de dados',
    'Matemática Financeira com HP12C',
    'Departamento Pessoal e gestão de pessoas',
    'Crédito, Cobrança e Atendimento ao cliente',
    'Liderança Eficaz e gestão de equipes',
    'Contabilidade básica e controles financeiros',
    'Apresentações executivas e relatórios',
    'Material didático impresso incluso',
    'Modalidades Presencial e Online disponíveis',
    'Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11 ou superior',
    '8GB de RAM (recomendado)',
    'Conexão estável com internet',
    'Microsoft Office (orientações de licenciamento)',
    'Calculadora HP12C (orientações de aquisição)',
    'Vontade de aprender gestão administrativa'
  ],

  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.70,
    },
    paymentMethods: ['Cartão de crédito', 'PIX', 'Boleto bancário'],
  },

  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: 'Equipe de Instrutores em Administração',
    bio: 'Nossa equipe é formada por administradores, contadores e especialistas em gestão com mais de 15 anos de experiência em ensino e prática empresarial.',
    photo: '/instructors/team-administracao.jpg',
    experience: '15+ anos',
    credentials: [
      'Graduação em Administração e Contabilidade',
      'Certificação Microsoft Office Specialist',
      'Especialização em Gestão de Pessoas',
      'Experiência em Departamento Pessoal',
      'Matemática Financeira Aplicada'
    ],
  },

  testimonials: [
    {
      id: 1,
      name: 'Sandra Oliveira',
      role: 'Assistente Administrativa',
      photo: '/testimonials/sandra-oliveira.jpg',
      rating: 5,
      text: 'Estava desempregada há 2 anos. Com o curso completo, consegui trabalho em 3 meses! O Excel avançado foi fundamental.',
      result: 'Emprego em 3 meses'
    },
    {
      id: 2,
      name: 'Roberto Santos',
      role: 'Supervisor Administrativo',
      photo: '/testimonials/roberto-santos.jpg',
      rating: 5,
      text: 'O módulo de liderança transformou minha gestão de equipe. Recebi promoção e aumento salarial de 40%.',
      result: 'Promoção e 40% aumento'
    },
    {
      id: 3,
      name: 'Juliana Costa',
      role: 'Analista Financeira',
      photo: '/testimonials/juliana-costa.jpg',
      rating: 5,
      text: 'Matemática financeira e Excel avançado me deram base para trabalhar no mercado financeiro. Hoje ganho R$ 6.000/mês.',
      result: 'Renda de R$ 6.000/mês'
    },
    {
      id: 4,
      name: 'Ana Caroline Barros',
      role: 'Designer em Transição',
      photo: '/testimonials/ana-caroline-barros.jpg',
      rating: 5,
      text: 'Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!',
      result: 'Transição de carreira'
    },
    {
      id: 5,
      name: 'Camila Medeiros',
      role: 'Empreendedora',
      photo: '/testimonials/camila-medeiros.jpg',
      rating: 5,
      text: 'Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.',
      result: 'Identidade visual própria'
    },
    {
      id: 6,
      name: 'Aline Silva',
      role: 'Designer Aprendiz',
      photo: '/testimonials/aline-silva.jpg',
      rating: 5,
      text: 'Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.',
      result: 'Domínio de múltiplos softwares'
    },
    {
      id: 7,
      name: 'Yasmin Camile',
      role: 'Designer Criativa',
      photo: '/testimonials/yasmin-camile.jpg',
      rating: 5,
      text: 'O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!',
      result: 'Diferencial com IA'
    },
    {
      id: 8,
      name: 'Carlos Souza',
      role: 'Designer Evoluído',
      photo: '/testimonials/carlos-souza.jpg',
      rating: 5,
      text: 'Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!',
      result: 'Evolução visível'
    },
    {
      id: 9,
      name: 'Patrícia Lima',
      role: 'Criadora de Conteúdo',
      photo: '/testimonials/patricia-lima.jpg',
      rating: 5,
      text: 'O Canva me salvou! Agora tudo que eu posto tem cara de profissional!',
      result: 'Conteúdo profissional'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'É adequado para quem não tem experiência em administração?',
      answer: 'Sim! Começamos do básico com Windows 11 e evoluímos gradualmente até gestão avançada. Perfeito para iniciantes.'
    },
    {
      id: 2,
      question: 'Preciso ter a calculadora HP12C?',
      answer: 'Oferecemos orientações de aquisição. Durante o curso você pode usar simuladores online até adquirir a sua.'
    },
    {
      id: 3,
      question: 'O curso prepara para qual tipo de trabalho?',
      answer: 'Assistente/Analista Administrativo, Departamento Pessoal, Financeiro, Atendimento, Supervisão e gestão de equipes.'
    },
    {
      id: 4,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 9 módulos incluso sem custo adicional.'
    }
  ],

  themeColors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#A78BFA',
    gradient: {
      from: '#6366F1',
      to: '#8B5CF6',
    },
  },

  seoMeta: {
    title: 'Curso de Administração Completo - Escola Habilidade | Office, DP, Matemática Financeira - Material Incluso',
    description: 'Curso completo de Administração: Windows 11, Office, Excel Avançado, Matemática Financeira, DP, Liderança. 153 horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['administração completa', 'office', 'excel avançado', 'departamento pessoal', 'matemática financeira', 'liderança', 'apostilas inclusas'],
    ogImage: '/og-images/administracao.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// ✅ LISTA FINAL DOS CURSOS - AGORA COM 9 CURSOS DO CATÁLOGO
// ===================================================================
export const COURSES_DATA = [
  informatica,           // 1. Informática (8 módulos) ✅ CORRIGIDO
  designGrafico,         // 2. Design Gráfico (5 módulos) ✅ CORRIGIDO
  programacao,           // 3. Programação (6 módulos) ✅ CORRIGIDO
  marketingDigital,      // 4. Marketing Digital (6 módulos) ✅ CORRIGIDO
  inteligenciaArtificial,// 5. Inteligência Artificial (6 módulos) ✅ CORRIGIDO
  businessIntelligence,  // 6. Business Intelligence (4 módulos) ✅ CORRIGIDO
  projetista,            // 7. Projetista (2 módulos) ✅ ADICIONADO
  edicaoVideo,           // 8. Edição de Vídeo (2 módulos) ✅ ADICIONADO
  administracao,         // 9. Administração (9 módulos) ✅ ADICIONADO
];

export default COURSES_DATA; 