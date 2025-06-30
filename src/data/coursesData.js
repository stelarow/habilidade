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

  whatYouWillLearn: [
    '✅ Windows 11 completo e produtividade total',
    '✅ Microsoft Office profissional (Word, Excel, PowerPoint)',
    '✅ Excel Fundamental e Avançado completos',
    '✅ Ambientes digitais e navegação na internet',
    '✅ Design com Canva para redes sociais',
    '✅ Inteligência Artificial aplicada ao trabalho',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Certificação profissional reconhecida',
    '✅ Preparação completa para o mercado de trabalho'
  ],

  requirements: [
    'Computador com Windows 10/11 ou superior',
    '8GB de RAM (recomendado 16GB)',
    'Conexão estável com internet',
    'Vontade de aprender tecnologia moderna',
    'Dedicação de 10-15 horas semanais'
  ],

  testimonials: [
    {
      id: 1,
      name: 'Maria José Silva',
      role: 'Assistente Administrativa',
      photo: '/testimonials/maria-jose.jpg',
      rating: 5,
      text: 'Aos 55 anos consegui meu primeiro emprego em escritório graças ao curso completo! O material impresso foi fundamental.',
      result: 'Primeiro emprego formal aos 55 anos'
    },
    {
      id: 2,
      name: 'José Carlos Lima',
      role: 'Aposentado',
      photo: '/testimonials/jose-carlos.jpg',
      rating: 5,
      text: 'Escolhi a modalidade presencial e foi perfeita! Agora domino desde Windows 11 até IA. As apostilas são excelentes!',
      result: 'Transformação digital completa'
    },
    {
      id: 3,
      name: 'Ana Beatriz Santos',
      role: 'Freelancer Digital',
      photo: '/testimonials/ana-beatriz.jpg',
      rating: 5,
      text: 'Optei pelo online e superou expectativas! O módulo de IA e Excel Avançado revolucionou meu trabalho.',
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

  whatYouWillLearn: [
    '✅ Adobe Photoshop profissional para design',
    '✅ Adobe Illustrator para criação vetorial',
    '✅ Adobe InDesign para design editorial',
    '✅ Canva para design rápido e eficiente',
    '✅ CorelDRAW para ilustração e vetorização',
    '✅ Teoria do design e composição visual',
    '✅ Criação de logotipos e identidade visual',
    '✅ Design para redes sociais e marketing',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Portfolio com projetos reais',
    '✅ Certificação profissional reconhecida'
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
      text: 'Em 4 meses já estava faturando R$ 5.000/mês como freelancer! As apostilas são uma referência constante no meu trabalho.',
      result: 'Faturamento R$ 5.000/mês'
    },
    {
      id: 2,
      name: 'Amanda Castro',
      role: 'Social Media Designer',
      photo: '/testimonials/amanda-castro.jpg',
      rating: 5,
      text: 'Optei pela modalidade presencial e foi perfeita! Consegui emprego em agência logo após terminar o curso.',
      result: 'Emprego em agência'
    },
    {
      id: 3,
      name: 'Rafael Silva',
      role: 'Designer Gráfico',
      photo: '/testimonials/rafael-silva.jpg',
      rating: 5,
      text: 'Fiz online e superou expectativas! Criei minha marca e hoje atendo clientes do Brasil inteiro.',
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

  whatYouWillLearn: [
    '✅ Lógica de programação sólida para qualquer linguagem',
    '✅ Python completo para desenvolvimento web e automação',
    '✅ Java para aplicações empresariais robustas',
    '✅ PHP para sistemas web dinâmicos com MySQL',
    '✅ Desenvolvimento de aplicativos Android nativos',
    '✅ Cursor: IDE com IA integrada (em desenvolvimento)',
    '✅ CRUD completo e banco de dados',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Portfolio com projetos reais',
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
      text: 'Saí do zero e consegui meu primeiro emprego como dev em 8 meses! As apostilas foram essenciais para consulta.',
      result: 'Primeiro emprego como dev'
    },
    {
      id: 2,
      name: 'Ana Beatriz',
      role: 'Freelancer Full-Stack',
      photo: '/testimonials/ana-beatriz.jpg',
      rating: 5,
      text: 'Fiz online e foi perfeito! Hoje ganho R$ 12.000/mês como freelancer dominando Python, Java, PHP e Android.',
      result: 'Renda de R$ 12.000/mês'
    },
    {
      id: 3,
      name: 'Carlos Eduardo',
      role: 'Desenvolvedor Android',
      photo: '/testimonials/carlos-eduardo.jpg',
      rating: 5,
      text: 'Escolhi presencial e adorei! Meu app desenvolvido no curso tem mais de 50.000 downloads na Play Store.',
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

  whatYouWillLearn: [
    '✅ Marketing Digital V2: estratégias modernas e eficazes',
    '✅ Mídias Sociais: Facebook, Instagram, Twitter, LinkedIn',
    '✅ Armazenamento em Nuvem para produtividade',
    '✅ IA Marketing: automação inteligente (em desenvolvimento)',
    '✅ Marketing Pessoal: construção de marca pessoal',
    '✅ Facebook Business: campanhas profissionais',
    '✅ Google Analytics e métricas de desempenho',
    '✅ Criação de conteúdo atrativo para redes',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Portfolio com campanhas reais',
    '✅ Certificação profissional reconhecida'
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
      text: 'Fiz presencial e foi incrível! Meu e-commerce saiu de R$ 50K para R$ 300K/mês aplicando as estratégias.',
      result: 'Faturamento de R$ 50K → R$ 300K/mês'
    },
    {
      id: 2,
      name: 'Ricardo Mendes',
      role: 'Gestor de Tráfego',
      photo: '/testimonials/ricardo-mendes.jpg',
      rating: 5,
      text: 'Optei pelo online e me tornei gestor de tráfego! Ganho R$ 12.000/mês com as apostilas sempre comigo.',
      result: 'Renda de R$ 12.000/mês'
    },
    {
      id: 3,
      name: 'Juliana Silva',
      role: 'Agência de Marketing',
      photo: '/testimonials/juliana-silva.jpg',
      rating: 5,
      text: 'Com o material impresso, abri minha agência e já faturei R$ 500K no primeiro ano!',
      result: 'Agência faturando R$ 500K/ano'
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

  whatYouWillLearn: [
    '✅ IA Fundamentos: base sólida em inteligência artificial',
    '✅ IA for Business: aplicação empresarial estratégica',
    '✅ Cursor: em desenvolvimento',
    '✅ Flowlabs: em desenvolvimento',
    '✅ ElevenLabs: em desenvolvimento',
    '✅ HatchCanvas: em desenvolvimento',
    '✅ Prompt Engineering e criação de conteúdo',
    '✅ Integração de IA com negócios',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Projetos práticos com IA',
    '✅ Certificação profissional reconhecida'
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

  whatYouWillLearn: [
    '✅ Excel Fundamental: planilhas e análises básicas',
    '✅ Excel Avançado: fórmulas complexas e VBA',
    '✅ Dashboard: visualizações profissionais no Excel',
    '✅ IA para Análise: em desenvolvimento',
    '✅ Análise de dados empresariais',
    '✅ Tabelas dinâmicas e gráficos avançados',
    '✅ Macros e automação no Excel',
    '✅ Dashboards executivos profissionais',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Portfolio com projetos empresariais',
    '✅ Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11',
    '8GB de RAM mínimo (recomendado 16GB)',
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
      text: 'Fiz presencial e consegui promoção para Analista Sênior com aumento de 80% no salário!',
      result: 'Promoção e aumento de 80%'
    },
    {
      id: 2,
      name: 'Ricardo Pereira',
      role: 'Gerente de Dados',
      photo: '/testimonials/ricardo-pereira.jpg',
      rating: 5,
      text: 'Online foi perfeito! Me tornei especialista em BI e agora lidero transformação digital.',
      result: 'Promoção a Gerente'
    },
    {
      id: 3,
      name: 'Marina Costa',
      role: 'Consultora BI',
      photo: '/testimonials/marina-costa.jpg',
      rating: 5,
      text: 'Com as apostilas sempre comigo, ganho R$ 18.000/mês como consultora implementando soluções BI!',
      result: 'Renda de R$ 18.000/mês'
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
    title: 'Projetista',
    slug: 'projetista-3d',
    shortDescription: 'Domine SketchUp e Enscape para criar projetos arquitetônicos profissionais com renderização em tempo real.',
    longDescription: 'Torne-se um Projetista 3D completo. Aprenda SketchUp para modelagem arquitetônica e Enscape para renderização com inteligência artificial. Curso totalmente presencial e baseado em projetos reais.',
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
        { id: 21, title: 'Introdução ao Enscape e Configuração Inicial', duration: '120 min', type: 'video' },
        { id: 22, title: 'Iluminação Natural e Artificial', duration: '120 min', type: 'video' },
        { id: 23, title: 'Materiais e Texturização no Enscape', duration: '120 min', type: 'video' },
        { id: 24, title: 'Câmeras e Enquadramentos Profissionais', duration: '120 min', type: 'video' },
        { id: 25, title: 'Configurações de Render e Qualidade', duration: '120 min', type: 'video' },
        { id: 26, title: 'Animações e Vídeos com Enscape', duration: '120 min', type: 'video' },
        { id: 27, title: 'Ambientes Externos e Vegetação', duration: '120 min', type: 'video' },
        { id: 28, title: 'Projeto Guiado Completo com Enscape', duration: '120 min', type: 'project' },
      ],
    }
  ],

  whatYouWillLearn: [
    '✅ SketchUp: modelagem 3D profissional para arquitetura',
    '✅ Enscape: renderização em tempo real com IA',
    '✅ Criação de projetos arquitetônicos completos',
    '✅ Layout técnico com normas ABNT',
    '✅ Materiais, texturas e iluminação realista',
    '✅ Componentes dinâmicos e plugins essenciais',
    '✅ Animações e vídeos walkthrough',
    '✅ Realidade virtual e panoramas 360°',
    '✅ Portfólio com projetos reais',
    '✅ Material didático impresso incluso',
    '✅ Modalidades Presencial e Online disponíveis',
    '✅ Certificação profissional reconhecida'
  ],

  requirements: [
    'Computador com Windows 10/11 ou macOS',
    '8GB de RAM (recomendado 16GB)',
    'Placa de vídeo dedicada (recomendado)',
    'SketchUp Pro (orientações de licenciamento)',
    'Enscape (orientações de licenciamento)',
    'Conhecimento básico de desenho técnico (desejável)'
  ],

  testimonials: [
    {
      id: 1,
      name: 'Marcos Silva',
      role: 'Arquiteto',
      photo: '/testimonials/marcos-silva.jpg',
      rating: 5,
      text: 'Fiz o curso presencial e foi incrível! Com SketchUp e Enscape consegui triplicar meus honorários em projetos.',
      result: 'Honorários triplicados'
    },
    {
      id: 2,
      name: 'Fernanda Lima',
      role: 'Designer de Interiores',
      photo: '/testimonials/fernanda-lima.jpg',
      rating: 5,
      text: 'O Enscape revolucionou minha apresentação! Os clientes ficam impressionados com a qualidade das renderizações.',
      result: 'Clientes impressionados'
    },
    {
      id: 3,
      name: 'Carlos Mendes',
      role: 'Projetista Freelancer',
      photo: '/testimonials/carlos-mendes.jpg',
      rating: 5,
      text: 'Com o portfólio criado no curso, consegui meu primeiro emprego em escritório de arquitetura!',
      result: 'Primeiro emprego na área'
    }
  ],

  faq: [
    {
      id: 1,
      question: 'Preciso ter conhecimento prévio em arquitetura?',
      answer: 'Não é obrigatório, mas é recomendável ter noções básicas de desenho técnico. O curso ensina desde os fundamentos.'
    },
    {
      id: 2,
      question: 'Qual a diferença entre as modalidades Presencial e Online?',
      answer: 'Presencial: aulas na escola com professores certificados. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas.'
    },
    {
      id: 3,
      question: 'As apostilas estão incluídas no preço?',
      answer: 'Sim! Material didático impresso completo dos 2 módulos incluso sem custo adicional. Sua referência permanente!'
    },
    {
      id: 4,
      question: 'O que é o Enscape e como funciona a IA?',
      answer: 'Enscape é uma ferramenta de renderização em tempo real que usa IA para otimizar automaticamente iluminação, materiais e ambientação.'
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
    title: 'Curso Projetista Completo - Escola Habilidade | SketchUp, Enscape, Renderização IA - Material Incluso',
    description: 'Torne-se Projetista 3D profissional. SketchUp para modelagem + Enscape para renderização com IA. 56 horas, apostilas inclusas, modalidades presencial e online.',
    keywords: ['projetista', 'sketchup', 'enscape', 'renderização ia', 'arquitetura', 'modelagem 3d', 'apostilas inclusas'],
    ogImage: '/og-images/projetista-3d.jpg',
    ogType: 'website',
  },
};

// ===================================================================
// ✅ LISTA FINAL DOS CURSOS - AGORA COM 7 CURSOS DO CATÁLOGO
// ===================================================================
export const COURSES_DATA = [
  informatica,           // 1. Informática (8 módulos) ✅ CORRIGIDO
  designGrafico,         // 2. Design Gráfico (5 módulos) ✅ CORRIGIDO
  programacao,           // 3. Programação (6 módulos) ✅ CORRIGIDO
  marketingDigital,      // 4. Marketing Digital (6 módulos) ✅ CORRIGIDO
  inteligenciaArtificial,// 5. Inteligência Artificial (6 módulos) ✅ CORRIGIDO
  businessIntelligence,  // 6. Business Intelligence (4 módulos) ✅ CORRIGIDO
  projetista,            // 7. Projetista (2 módulos) ✅ ADICIONADO
];

export default COURSES_DATA; 