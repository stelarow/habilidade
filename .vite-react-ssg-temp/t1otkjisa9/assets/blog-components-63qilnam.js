import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Tag, Clock, Calendar, User, WarningCircle, ArrowCounterClockwise, House, Funnel, FileText, MagnifyingGlass, Article, CaretRight, CaretDown, X, Hash, TrendUp, Share, Check, LinkSimple, FacebookLogo, TwitterLogo, LinkedinLogo, WhatsappLogo, List, Star, Users, ArrowRight } from "@phosphor-icons/react";
import { u as usePrefetchPost, a as useBlogResponsive, g as getAnimationClasses, c as combineClasses, b as getStaggeredDelay, d as useCategories, e as useCTAResponsive } from "./utils-CtCVPYGt.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
const informatica = {
  basicInfo: {
    id: "informatica-001",
    title: "Informática",
    slug: "informatica",
    shortDescription: "Curso completo de informática com Windows 11, Office, ambientes digitais, Canva e IA aplicada.",
    longDescription: "Domine a informática moderna com nosso curso mais completo. Aprenda Windows 11, pacote Office completo, ambientes digitais, Canva e inteligência artificial aplicada. 8 módulos completos para preparação total no mercado de trabalho.",
    category: "Tecnologia",
    level: "Iniciante",
    duration: "184,5 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso de todos os 8 módulos",
      "Apostilas detalhadas com exercícios práticos",
      "Referência permanente para estudos",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Windows 11",
      description: "Sistema operacional moderno e produtividade total",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "Introdução ao Windows 11", duration: "90 min", type: "video" },
        { id: 2, title: "Aplicativos Parte I", duration: "90 min", type: "video" },
        { id: 3, title: "Microsoft Edge", duration: "90 min", type: "video" },
        { id: 4, title: "Explorador de Arquivos Parte I", duration: "90 min", type: "video" },
        { id: 5, title: "Explorador de Arquivos Parte II", duration: "90 min", type: "video" },
        { id: 6, title: "Personalizando o Sistema", duration: "90 min", type: "video" },
        { id: 7, title: "Acessibilidade Parte I", duration: "90 min", type: "video" },
        { id: 8, title: "Aplicativos Parte II", duration: "90 min", type: "video" },
        { id: 9, title: "Aplicativos Parte III", duration: "90 min", type: "video" },
        { id: 10, title: "Aplicativos Parte ", duration: "90 min", type: "video" },
        // ✅ CORRIGIDO - SEM "IV"
        { id: 11, title: "Barra de Tarefas", duration: "90 min", type: "video" },
        { id: 12, title: "Acessibilidade Parte II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Word (Fundamental)",
      description: "Processamento de texto profissional",
      duration: "21 horas",
      lessons: [
        { id: 13, title: "Introdução ao Word 2019", duration: "90 min", type: "video" },
        { id: 14, title: "Iniciando um documento", duration: "90 min", type: "video" },
        { id: 15, title: "Formatando texto e nova Ferramenta de Aprendizagem", duration: "90 min", type: "video" },
        { id: 16, title: "Inserção de tabelas e ícones SVG", duration: "90 min", type: "video" },
        { id: 17, title: "Inserção de elementos gráficos I", duration: "90 min", type: "video" },
        { id: 18, title: "Inserção de elementos gráficos e imagens 3D", duration: "90 min", type: "video" },
        { id: 19, title: "Criação de estruturas de texto I", duration: "90 min", type: "video" },
        { id: 20, title: "Criação de estruturas de texto II", duration: "90 min", type: "video" },
        { id: 21, title: "Inserção de elementos de texto e nova sintaxe LaTeX", duration: "90 min", type: "video" },
        { id: 22, title: "Layout da página", duration: "90 min", type: "video" },
        { id: 23, title: "Design", duration: "90 min", type: "video" },
        { id: 24, title: "Revisão", duration: "90 min", type: "video" },
        { id: 25, title: "Armazenamento e compartilhamento", duration: "90 min", type: "video" },
        { id: 26, title: "Impressão", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Excel (Fundamental)",
      description: "Planilhas eletrônicas para análise de dados",
      duration: "27 horas",
      lessons: [
        { id: 27, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 28, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 29, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 30, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 31, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 32, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 33, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 34, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 35, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 36, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 37, title: "Funções de Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 38, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 39, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 40, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 41, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 42, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 43, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 44, title: "Configurações, Auditoria e Exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Excel (Avançado)",
      description: "Análise avançada de dados e automatização",
      duration: "19,5 horas",
      lessons: [
        { id: 45, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 46, title: "Funções de Texto", duration: "90 min", type: "video" },
        { id: 47, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 48, title: "Funções de Matemática/Trigonometria e Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 49, title: "Funções Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 50, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 51, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 52, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 53, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 54, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 55, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 56, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 57, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "PowerPoint (Fundamental)",
      description: "Apresentações profissionais e impactantes",
      duration: "18 horas",
      lessons: [
        { id: 58, title: "Introdução ao Power Point 2019", duration: "90 min", type: "video" },
        { id: 59, title: "Ferramentas", duration: "90 min", type: "video" },
        { id: 60, title: "Iniciando uma apresentação", duration: "90 min", type: "video" },
        { id: 61, title: "Texto", duration: "90 min", type: "video" },
        { id: 62, title: "Layout de slide", duration: "90 min", type: "video" },
        { id: 63, title: "Elementos gráficos I", duration: "90 min", type: "video" },
        { id: 64, title: "Elementos gráficos II", duration: "90 min", type: "video" },
        { id: 65, title: "Multimídia", duration: "90 min", type: "video" },
        { id: 66, title: "Transições", duration: "90 min", type: "video" },
        { id: 67, title: "Testes de apresentação", duration: "90 min", type: "video" },
        { id: 68, title: "Revisão", duration: "90 min", type: "video" },
        { id: 69, title: "Projeto", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Ambientes Digitais",
      description: "Navegação e ferramentas da internet moderna",
      duration: "24 horas",
      lessons: [
        { id: 70, title: "Introdução à Internet", duration: "90 min", type: "video" },
        { id: 71, title: "Navegação na Web", duration: "90 min", type: "video" },
        { id: 72, title: "Recursos e Pesquisa na Web", duration: "90 min", type: "video" },
        { id: 73, title: "Comunicação Online: E-mail", duration: "90 min", type: "video" },
        { id: 74, title: "Ferramenta de Produtividade: Google Drive", duration: "90 min", type: "video" },
        { id: 75, title: "Internet das Coisas (IoT)", duration: "90 min", type: "video" },
        { id: 76, title: "Videoconferências e Google Agenda", duration: "90 min", type: "video" },
        { id: 77, title: "Segurança Online", duration: "90 min", type: "video" },
        { id: 78, title: "Privacidade e Proteção de Dados", duration: "90 min", type: "video" },
        { id: 79, title: "Compras e Transações Online", duration: "90 min", type: "video" },
        { id: 80, title: "Streaming de Áudio: Spotify", duration: "90 min", type: "video" },
        { id: 81, title: "Streaming de Vídeo: YouTube", duration: "90 min", type: "video" },
        { id: 82, title: "Mensagens Instantâneas: WhatsApp", duration: "90 min", type: "video" },
        { id: 83, title: "Redes Sociais: Facebook", duration: "90 min", type: "video" },
        { id: 84, title: "Redes Sociais: Instagram", duration: "90 min", type: "video" },
        { id: 85, title: "Redes Sociais: TikTok", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 7,
      title: "Canva",
      description: "Design gráfico acessível para todos",
      duration: "18 horas",
      lessons: [
        { id: 86, title: "Crie uma conta", duration: "90 min", type: "video" },
        { id: 87, title: "Conhecendo o Canva", duration: "90 min", type: "video" },
        { id: 88, title: "Biblioteca de modelos", duration: "90 min", type: "video" },
        { id: 89, title: "Editando templates", duration: "90 min", type: "video" },
        { id: 90, title: "Criando logotipos", duration: "90 min", type: "video" },
        { id: 91, title: "Designer profissional", duration: "90 min", type: "video" },
        { id: 92, title: "Vinhetas/Vídeos", duration: "90 min", type: "video" },
        { id: 93, title: "E-books e cartões", duration: "90 min", type: "video" },
        { id: 94, title: "Catálogo digital e proposta comercial", duration: "90 min", type: "video" },
        { id: 95, title: "Mockups", duration: "90 min", type: "video" },
        { id: 96, title: "Canva para Smartphone – Etapa 1", duration: "90 min", type: "video" },
        { id: 97, title: "Canva para Smartphone – Etapa 2", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 8,
      title: "Inteligência Artificial (Informática)",
      description: "IA aplicada à produtividade e trabalho",
      duration: "24 horas",
      lessons: [
        { id: 98, title: "Introdução e História da Inteligência Artificial", duration: "90 min", type: "video" },
        { id: 99, title: "Machine Learning", duration: "90 min", type: "video" },
        { id: 100, title: "Prompt Engineering", duration: "90 min", type: "video" },
        { id: 101, title: "GPT, Bard e Copilot", duration: "90 min", type: "video" },
        { id: 102, title: "Estudando e Pesquisando com IAs", duration: "90 min", type: "video" },
        { id: 103, title: "Melhorando o Prompt", duration: "90 min", type: "video" },
        { id: 104, title: "Gerando Imagens", duration: "90 min", type: "video" },
        { id: 105, title: "Gerando Posts para Redes Sociais", duration: "90 min", type: "video" },
        { id: 106, title: "HARPA AI – Parte 1", duration: "90 min", type: "video" },
        { id: 107, title: "HARPA AI – Parte 2", duration: "90 min", type: "video" },
        { id: 108, title: "Gerando Vídeos", duration: "90 min", type: "video" },
        { id: 109, title: "Gerando Vídeos através de Imagens", duration: "90 min", type: "video" },
        { id: 110, title: "Gerando Áudios", duration: "90 min", type: "video" },
        { id: 111, title: "Gerando Vídeos com D-ID", duration: "90 min", type: "video" },
        { id: 112, title: "PI (Inteligência Artificial Personalizada)", duration: "90 min", type: "video" },
        { id: 113, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Guia de aprendizado estruturado",
        description: "Metodologia comprovada para acelerar seu progresso do básico ao profissional"
      },
      {
        icon: "TrendUp",
        title: "Do básico ao avançado",
        description: "Evolução gradual e consistente até dominar completamente a informática"
      },
      {
        icon: "Users",
        title: "Você dentro do mercado",
        description: "Habilidades de informática realmente demandadas pelas empresas"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Windows 11 e fundamentos da informática moderna",
        icon: "House"
      },
      {
        number: 2,
        title: "Produtividade",
        description: "Desenvolva expertise com Office e ferramentas digitais",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Especialização",
        description: "Avance com Excel, Canva e técnicas profissionais",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Inovação",
        description: "Domine Inteligência Artificial e destaque-se no mercado",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Windows 11 completo e produtividade total",
    "Microsoft Office profissional (Word, Excel, PowerPoint)",
    "Excel Fundamental e Avançado completos",
    "Ambientes digitais e navegação na internet",
    "Design com Canva para redes sociais",
    "Inteligência Artificial aplicada ao trabalho",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida",
    "Preparação completa para o mercado de trabalho"
  ],
  requirements: [
    "Computador com Windows 10/11 ou superior",
    "8GB de RAM (recomendado 16GB)",
    "Conexão estável com internet",
    "Vontade de aprender tecnologia moderna",
    "Dedicação de 10-15 horas semanais"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 997,
    currentPrice: 597,
    discount: 40,
    installments: {
      max: 12,
      value: 59.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Equipe de Instrutores Especializados",
    bio: "Nossa equipe é formada por profissionais certificados em Windows, Office e IA com mais de 10 anos de experiência no ensino de informática para todas as idades.",
    photo: "/instructors/team-informatica.jpg",
    experience: "10+ anos",
    credentials: [
      "Certificação Microsoft Office Specialist",
      "Especialização em Windows 11",
      "Formação em Inteligência Artificial",
      "Experiência corporativa em TI"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Letícia Mendes",
      role: "Informática Fundamental",
      photo: "/testimonials/leticia-mendes.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Mateus Oliveira",
      role: "Informática Fundamental",
      photo: "/testimonials/mateus-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 3,
      name: "Gabriela Costa Silva",
      role: "Informática Fundamental",
      photo: "/testimonials/gabriela-costa-silva.jpg",
      // Placeholder image
      rating: 5,
      text: "A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 4,
      name: "Lucas Felipe Ribeiro",
      role: "Informática Fundamental",
      photo: "/testimonials/lucas-felipe-ribeiro.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Carolina Almeida",
      role: "Informática Fundamental",
      photo: "/testimonials/carolina-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 6,
      name: "Pedro Henrique Soares",
      role: "Informática Fundamental",
      photo: "/testimonials/pedro-henrique-soares.jpg",
      // Placeholder image
      rating: 5,
      text: "Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "É adequado para pessoas sem conhecimento em informática?",
      answer: "Sim! Começamos do absoluto zero com Windows 11 e evoluímos gradualmente até tecnologias avançadas como IA aplicada."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 8 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Como a IA está integrada no curso?",
      answer: "Ensinamos IA de forma prática: ChatGPT para produtividade, geração de imagens, vídeos, automações e muito mais."
    }
  ],
  themeColors: {
    primary: "#2196F3",
    secondary: "#00BCD4",
    accent: "#03DAC6",
    gradient: {
      from: "#2196F3",
      to: "#00BCD4"
    }
  },
  seoMeta: {
    title: "Curso de Informática Básica Florianópolis - Windows 11, Office e Excel - Escola Habilidade São José",
    description: "Curso completo de informática básica em Florianópolis e São José SC. Windows 11, Excel, Word, PowerPoint, Canva e IA aplicada. 184h, material incluso, aulas presenciais e online.",
    keywords: ["curso informática básica florianópolis", "windows 11 são josé sc", "excel completo grande florianópolis", "office santa catarina", "informática iniciante SC"],
    ogImage: "/og-images/informatica.jpg",
    ogType: "website"
  }
};
const designGrafico = {
  basicInfo: {
    id: "design-grafico-002",
    title: "Design Gráfico",
    slug: "design-grafico",
    shortDescription: "Domine Photoshop, Illustrator, InDesign, Canva e CorelDRAW para criar designs profissionais.",
    longDescription: "Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW com teorias fundamentais do design. 5 módulos completos para dominar o design profissional.",
    category: "Design & Criação",
    level: "Intermediário",
    duration: "90 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 5 módulos de design",
      "Apostilas com exercícios práticos e projetos",
      "Referência permanente para consulta",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Photoshop (Adobe Photoshop CC)",
      description: "Edição e manipulação de imagens profissional",
      duration: "30 horas",
      lessons: [
        { id: 1, title: "Conhecendo o Photoshop", duration: "90 min", type: "video" },
        { id: 2, title: "Inserindo Imagens, Painéis e Outras Ferramentas", duration: "90 min", type: "video" },
        { id: 3, title: "Unidades de medida, Objeto Inteligente, Conceito das Camadas, Modos de Mesclagem", duration: "90 min", type: "video" },
        { id: 4, title: "Formas básicas", duration: "90 min", type: "video" },
        { id: 5, title: "Espelhando e rotacionando imagens", duration: "90 min", type: "video" },
        { id: 6, title: "Ferramentas de Seleção 1: Seleção Rápida, Varinha Mágica; Remover Olhos Vermelhos", duration: "90 min", type: "video" },
        { id: 7, title: "Ferramentas de Seleção 2: Caneta, Laços, Letreiros", duration: "90 min", type: "video" },
        { id: 8, title: "Utilizando a ferramenta Borracha; Conceito de Máscaras", duration: "90 min", type: "video" },
        { id: 9, title: "Retirando o fundo de uma imagem com Caneta, Filtros e algumas aplicações", duration: "90 min", type: "video" },
        { id: 10, title: "Zoom, Ferramenta Carimbo e alterar a cor de uma forma", duration: "90 min", type: "video" },
        { id: 11, title: "Ferramenta de Texto", duration: "90 min", type: "video" },
        { id: 12, title: "Matiz/Saturação e Desfoque Gaussiano", duration: "90 min", type: "video" },
        { id: 13, title: "Ajustes de imagem 1 (Brilho/Contraste, Níveis, Matiz/Saturação)", duration: "90 min", type: "video" },
        { id: 14, title: "Ajustes de imagem 2 (Preto e Branco, Filtro de Fotos)", duration: "90 min", type: "video" },
        { id: 15, title: "Conhecendo Mockup; Ajustando imagem em perspectiva", duration: "90 min", type: "video" },
        { id: 16, title: "Inserindo pincéis e novas fontes", duration: "90 min", type: "video" },
        { id: 17, title: "Efeito Dupla Exposição", duration: "90 min", type: "video" },
        { id: 18, title: "Efeito Desintegração", duration: "90 min", type: "video" },
        { id: 19, title: "Efeito Glitch", duration: "90 min", type: "video" },
        { id: 20, title: "Projeto: Criando um Cartão de Visitas", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Illustrator (Adobe Illustrator CC)",
      description: "Criação de ilustrações e logotipos vetoriais",
      duration: "24 horas",
      lessons: [
        { id: 21, title: "Ferramentas básicas e interface", duration: "90 min", type: "video" },
        { id: 22, title: "Ferramenta de criação de formas", duration: "90 min", type: "video" },
        { id: 23, title: "Editando formas básicas", duration: "90 min", type: "video" },
        { id: 24, title: "Ferramenta de caneta e criação de formas livres", duration: "90 min", type: "video" },
        { id: 25, title: "Criação de desenhos utilizando formas", duration: "90 min", type: "video" },
        { id: 26, title: "Trabalhando com camadas", duration: "90 min", type: "video" },
        { id: 27, title: "Opacidade, Mesclagem e Máscara", duration: "90 min", type: "video" },
        { id: 28, title: "Pathfinder", duration: "90 min", type: "video" },
        { id: 29, title: "Cores", duration: "90 min", type: "video" },
        { id: 30, title: "Gradientes", duration: "90 min", type: "video" },
        { id: 31, title: "Régua e linhas de guia", duration: "90 min", type: "video" },
        { id: 32, title: "Tipografia e texto", duration: "90 min", type: "video" },
        { id: 33, title: "Criando um Logotipo", duration: "90 min", type: "video" },
        { id: 34, title: "Criando Padrões", duration: "90 min", type: "video" },
        { id: 35, title: "Pincéis", duration: "90 min", type: "video" },
        { id: 36, title: "Conceitos finais e finalizando arquivos", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "InDesign (Adobe InDesign CS6)",
      description: "Diagramação e design editorial profissional",
      duration: "18 horas",
      lessons: [
        { id: 37, title: "Apresentação e Área de Trabalho", duration: "90 min", type: "video" },
        { id: 38, title: "Caixas, Ferramentas de Desenho, Réguas e Elementos", duration: "90 min", type: "video" },
        { id: 39, title: "Paletas Swatches e Stroke", duration: "90 min", type: "video" },
        { id: 40, title: "Configurando Página, Posicionamento e Salvando Arquivo", duration: "90 min", type: "video" },
        { id: 41, title: "Formatação de Textos", duration: "90 min", type: "video" },
        { id: 42, title: "Listas, Conta-Gotas, Efeitos e Colunas", duration: "90 min", type: "video" },
        { id: 43, title: "Redimensionamento de Caixas de Texto e Free Transform", duration: "90 min", type: "video" },
        { id: 44, title: "Cores, Gradientes, Paste e Corner Options", duration: "90 min", type: "video" },
        { id: 45, title: "Scale, Step and Repeat, Alinhamento e Pathfinder", duration: "90 min", type: "video" },
        { id: 46, title: "Text Frame, Transparência e Text Wrap", duration: "90 min", type: "video" },
        { id: 47, title: "Página Mestre, Paleta Links, Numeração e Exportação", duration: "90 min", type: "video" },
        { id: 48, title: "Exercício Prático (Projeto Final)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "Canva",
      description: "Design gráfico acessível para todos",
      duration: "18 horas",
      note: "Mesmo conteúdo do curso listado em Informática – 12 aulas, 18h",
      lessons: [
        { id: 49, title: "Crie uma conta", duration: "90 min", type: "video" },
        { id: 50, title: "Conhecendo o Canva", duration: "90 min", type: "video" },
        { id: 51, title: "Biblioteca de modelos", duration: "90 min", type: "video" },
        { id: 52, title: "Editando templates", duration: "90 min", type: "video" },
        { id: 53, title: "Criando logotipos", duration: "90 min", type: "video" },
        { id: 54, title: "Designer profissional", duration: "90 min", type: "video" },
        { id: 55, title: "Vinhetas/Vídeos", duration: "90 min", type: "video" },
        { id: 56, title: "E-books e cartões", duration: "90 min", type: "video" },
        { id: 57, title: "Catálogo digital e proposta comercial", duration: "90 min", type: "video" },
        { id: 58, title: "Mockups", duration: "90 min", type: "video" },
        { id: 59, title: "Canva para Smartphone – Etapa 1", duration: "90 min", type: "video" },
        { id: 60, title: "Canva para Smartphone – Etapa 2", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "CorelDRAW",
      description: "Ilustração e design vetorial profissional",
      duration: "24 horas",
      lessons: [
        { id: 61, title: "Introdução ao CorelDRAW", duration: "90 min", type: "video" },
        { id: 62, title: "Trabalhando com Cores", duration: "90 min", type: "video" },
        { id: 63, title: "Ferramentas de Formas Básicas e Formatação", duration: "90 min", type: "video" },
        { id: 64, title: "Importação e Exportação de Arquivos", duration: "90 min", type: "video" },
        { id: 65, title: "Ferramentas de Texto", duration: "90 min", type: "video" },
        { id: 66, title: "Camadas e Objetos", duration: "90 min", type: "video" },
        { id: 67, title: "Efeitos e Transformações", duration: "90 min", type: "video" },
        { id: 68, title: "Ferramentas de Desenho Avançado", duration: "90 min", type: "video" },
        { id: 69, title: "Ferramentas de Desenho Avançado – Parte 2", duration: "90 min", type: "video" },
        { id: 70, title: "Ferramenta PowerTRACE", duration: "90 min", type: "video" },
        { id: 71, title: "Ferramenta PowerClip", duration: "90 min", type: "video" },
        { id: 72, title: "Estilos e Modelos", duration: "90 min", type: "video" },
        { id: 73, title: "Texto Artístico Avançado", duration: "90 min", type: "video" },
        { id: 74, title: "Efeitos 3D", duration: "90 min", type: "video" },
        { id: 75, title: "Projetos de Design", duration: "90 min", type: "video" },
        { id: 76, title: "Projeto Final", duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes  
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Guia completo de design",
        description: "Metodologia estruturada para dominar todas as ferramentas Adobe e design profissional"
      },
      {
        icon: "TrendUp",
        title: "Do iniciante ao expert",
        description: "Evolução progressiva desde conceitos básicos até projetos complexos"
      },
      {
        icon: "Users",
        title: "Portfolio profissional",
        description: "Crie projetos reais que impressionam clientes e empregadores"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Photoshop e conceitos básicos de design visual",
        icon: "House"
      },
      {
        number: 2,
        title: "Criação Vetorial",
        description: "Desenvolva expertise em Illustrator e criação de logotipos",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Design Editorial",
        description: "Avance com InDesign, CorelDRAW e projetos complexos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Profissionalização",
        description: "Construa portfolio completo e destaque-se no mercado",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Adobe Photoshop profissional para design",
    "Adobe Illustrator para criação vetorial",
    "Adobe InDesign para design editorial",
    "Canva para design rápido e eficiente",
    "CorelDRAW para ilustração e vetorização",
    "Teoria do design e composição visual",
    "Criação de logotipos e identidade visual",
    "Design para redes sociais e marketing",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com projetos reais",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "8GB de RAM (recomendado 16GB)",
    "Adobe Creative Cloud (orientações de licenciamento)",
    "Tablet gráfico (recomendado)",
    "Senso estético e criatividade"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Design Masters Team",
    bio: "Equipe de designers profissionais com certificação Adobe e experiência em agências e estúdios de design. Especialistas em formar novos talentos.",
    photo: "/instructors/team-design.jpg",
    experience: "8+ anos",
    credentials: [
      "Adobe Certified Expert (ACE)",
      "Experiência em agências de publicidade",
      "Portfolio internacional de clientes",
      "Formação em Design Gráfico"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Julia Menezes",
      role: "Designer Gráfico",
      photo: "/testimonials/julia-menezes.jpg",
      // Placeholder image
      rating: 5,
      text: "Entrei no curso sem saber nada e hoje já consigo criar artes incríveis. As aulas são leves, criativas e práticas. Me surpreendi!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Anderson Carvalho",
      role: "Designer Gráfico",
      photo: "/testimonials/anderson-carvalho.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso tem uma pegada bem atualizada, cheia de referências visuais que realmente inspiram. O professor dá atenção individualizada e isso fez toda a diferença no meu desenvolvimento.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 3,
      name: "Camila Pacheco",
      role: "Designer Gráfico",
      photo: "/testimonials/camila-pacheco.jpg",
      // Placeholder image
      rating: 5,
      text: "A Escola Habilidade oferece um ambiente que realmente estimula a criação. Estou curtindo muito as aulas, principalmente pelas propostas práticas que me desafiam.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 4,
      name: "Marcelo Andrade",
      role: "Designer Gráfico",
      photo: "/testimonials/marcelo-andrade.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou tendo uma experiência fantástica. Além de ensinar técnicas, o curso ajuda no desenvolvimento da criatividade. Aprender aqui tem sido leve e produtivo.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 5,
      name: "Larissa Almeida",
      role: "Designer Gráfico",
      photo: "/testimonials/larissa-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "Fui surpreendida positivamente! Aprendi várias ferramentas digitais que nem conhecia, e estou usando em projetos reais. Muito além do básico!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 6,
      name: "Samuel Oliveira",
      role: "Designer Gráfico",
      photo: "/testimonials/samuel-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são tão boas que passam voando. O professor é claro nas explicações, e a prática constante me ajudou a evoluir mais rápido do que eu imaginava.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso ter talento artístico natural?",
      answer: "Não! Design é técnica que se aprende. Ensinamos desde o básico até você desenvolver seu próprio estilo criativo."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 5 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "O curso serve para design de redes sociais?",
      answer: "Perfeitamente! Ensinamos design para Instagram, Facebook, LinkedIn e todas as principais plataformas."
    }
  ],
  themeColors: {
    primary: "#9C27B0",
    secondary: "#E91E63",
    accent: "#FF5722",
    gradient: {
      from: "#9C27B0",
      to: "#E91E63"
    }
  },
  seoMeta: {
    title: "Curso Design Gráfico Completo - Escola Habilidade | Photoshop, Illustrator, InDesign, Canva - Material Incluso",
    description: "Torne-se Designer Gráfico profissional. 5 módulos: Photoshop, Illustrator, InDesign, Canva, CorelDRAW. 90 horas, apostilas inclusas, modalidades presencial e online.",
    keywords: ["design gráfico", "photoshop", "illustrator", "indesign", "canva", "coreldraw", "apostilas inclusas"],
    ogImage: "/og-images/design-grafico.jpg",
    ogType: "website"
  }
};
const programacao = {
  basicInfo: {
    id: "programacao-003",
    title: "Programação",
    slug: "programacao",
    shortDescription: "Domine Lógica, Python, Java, PHP, Android e Cursor IA para desenvolvimento completo.",
    longDescription: "Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e o revolucionário Cursor com IA. 6 módulos completos do zero ao primeiro emprego como programador.",
    category: "Tecnologia",
    level: "Iniciante",
    duration: "118 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 6 módulos de programação",
      "Apostilas com códigos, exercícios e projetos práticos",
      "Referência permanente para desenvolvimento",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Lógica de Programação",
      description: "Fundamentos lógicos para qualquer linguagem de programação",
      duration: "21 horas",
      lessons: [
        { id: 1, title: "Introdução à Programação", duration: "90 min", type: "video" },
        { id: 2, title: "Variáveis, constantes e tipos de dados", duration: "90 min", type: "video" },
        { id: 3, title: "Primeiro programa (Algoritmos)", duration: "90 min", type: "video" },
        { id: 4, title: "Tipos de operadores", duration: "90 min", type: "video" },
        { id: 5, title: "Estrutura de decisão – Parte 1", duration: "90 min", type: "video" },
        { id: 6, title: "Estrutura de decisão – Parte 2", duration: "90 min", type: "video" },
        { id: 7, title: "Estrutura de repetição – Parte 1", duration: "90 min", type: "video" },
        { id: 8, title: "Estrutura de repetição – Parte 2", duration: "90 min", type: "video" },
        { id: 9, title: "Manipulação de vetores", duration: "90 min", type: "video" },
        { id: 10, title: "Manipulação de matrizes", duration: "90 min", type: "video" },
        { id: 11, title: "Funções e procedimentos", duration: "90 min", type: "video" },
        { id: 12, title: "Modularização", duration: "90 min", type: "video" },
        { id: 13, title: "Prática 1 (exercícios integrados)", duration: "90 min", type: "exercise" },
        { id: 14, title: "Prática 2 (projeto final)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Python",
      description: "Python do básico ao avançado para desenvolvimento profissional",
      duration: "24 horas",
      lessons: [
        { id: 15, title: "Iniciando no Python", duration: "90 min", type: "video" },
        { id: 16, title: "Primeiros passos com Python", duration: "90 min", type: "video" },
        { id: 17, title: "If, Else e Elif (Estruturas de decisão)", duration: "90 min", type: "video" },
        { id: 18, title: "Loops (Estruturas de repetição)", duration: "90 min", type: "video" },
        { id: 19, title: "Listas", duration: "90 min", type: "video" },
        { id: 20, title: "Strings", duration: "90 min", type: "video" },
        { id: 21, title: "Funções", duration: "90 min", type: "video" },
        { id: 22, title: "Lidando com erros", duration: "90 min", type: "video" },
        { id: 23, title: "Módulos e pacotes", duration: "90 min", type: "video" },
        { id: 24, title: "Objetos (introdução à OOP)", duration: "90 min", type: "video" },
        { id: 25, title: "Dicionários", duration: "90 min", type: "video" },
        { id: 26, title: "Arquivos", duration: "90 min", type: "video" },
        { id: 27, title: "Bibliotecas externas", duration: "90 min", type: "video" },
        { id: 28, title: "Data e hora", duration: "90 min", type: "video" },
        { id: 29, title: "Expressões regulares", duration: "90 min", type: "video" },
        { id: 30, title: "Projeto final", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 3,
      title: "Java",
      description: "Java para aplicações robustas e empresariais",
      duration: "24 horas",
      lessons: [
        { id: 31, title: "Introdução ao Java", duration: "90 min", type: "video" },
        { id: 32, title: "Interface, componentes e variáveis", duration: "90 min", type: "video" },
        { id: 33, title: "Operadores matemáticos, relacionais e controle de fluxo", duration: "90 min", type: "video" },
        { id: 34, title: "Estrutura de repetição (For e While)", duration: "90 min", type: "video" },
        { id: 35, title: "Manipulação de Strings", duration: "90 min", type: "video" },
        { id: 36, title: "Variáveis compostas", duration: "90 min", type: "video" },
        { id: 37, title: "Orientação a Objetos: Introdução", duration: "90 min", type: "video" },
        { id: 38, title: "Projeto sem Orientação a Objetos (comparativo)", duration: "90 min", type: "video" },
        { id: 39, title: "Orientação a Objetos: Classes", duration: "90 min", type: "video" },
        { id: 40, title: "Orientação a Objetos: Métodos", duration: "90 min", type: "video" },
        { id: 41, title: "Orientação a Objetos: Métodos II", duration: "90 min", type: "video" },
        { id: 42, title: "Encapsulamento", duration: "90 min", type: "video" },
        { id: 43, title: "OOP: Vetor, Laço e Lista", duration: "90 min", type: "video" },
        { id: 44, title: "Herança", duration: "90 min", type: "video" },
        { id: 45, title: "Sobreposição e Interface Gráfica I", duration: "90 min", type: "video" },
        { id: 46, title: "Interface Gráfica II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Programação PHP (Versão 2)",
      description: "PHP para desenvolvimento web e sistemas dinâmicos",
      duration: "30 horas",
      lessons: [
        { id: 47, title: "Introdução ao PHP", duration: "90 min", type: "video" },
        { id: 48, title: "Notepad++ e Conceitos Básicos de Programação", duration: "90 min", type: "video" },
        { id: 49, title: "Operadores de Comparação, Lógicos e Estrutura Condicional", duration: "90 min", type: "video" },
        { id: 50, title: "Estrutura Condicional e Estrutura de Repetição", duration: "90 min", type: "video" },
        { id: 51, title: "Estrutura de Repetição, Strings e Funções", duration: "90 min", type: "video" },
        { id: 52, title: "Variáveis Compostas", duration: "90 min", type: "video" },
        { id: 53, title: "Hospedagem de Site (publicação)", duration: "90 min", type: "video" },
        { id: 54, title: "Cookies e Sessões", duration: "90 min", type: "video" },
        { id: 55, title: "Integração PHP com HTML", duration: "90 min", type: "video" },
        { id: 56, title: "Banco de Dados – Parte 1", duration: "90 min", type: "video" },
        { id: 57, title: "Banco de Dados – Parte 2", duration: "90 min", type: "video" },
        { id: 58, title: "Projeto Etapa 1: Estrutura, Conexão, Exibir Categorias e Produtos", duration: "90 min", type: "project" },
        { id: 59, title: "Projeto Etapa 2: Detalhes do Produto e Área Administrativa", duration: "90 min", type: "project" },
        { id: 60, title: "Projeto Etapa 3: Excluir Categoria e Cadastrar Produtos", duration: "90 min", type: "project" },
        { id: 61, title: "Projeto Etapa 4: Editar e Atualizar Produtos", duration: "90 min", type: "project" },
        { id: 62, title: "Projeto Etapa 5: Excluir Produto e Área de Pedidos", duration: "90 min", type: "project" },
        { id: 63, title: "Projeto Etapa 6: Excluir Pedido e Cadastrar Cliente", duration: "90 min", type: "project" },
        { id: 64, title: "Projeto Etapa 7: Listar Pedidos dos Clientes", duration: "90 min", type: "project" },
        { id: 65, title: "Projeto Etapa 8: Editar e Atualizar (funcionalidades finais)", duration: "90 min", type: "project" },
        { id: 66, title: "Ativar/Desativar Cliente, Login e Hospedagem", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 5,
      title: "Desenvolvedor de Aplicativos (Android v.2)",
      description: "Desenvolvimento de apps nativos para Android",
      duration: "24 horas",
      lessons: [
        { id: 67, title: "Introdução ao Android Studio", duration: "90 min", type: "video" },
        { id: 68, title: "Interface e componentes", duration: "90 min", type: "video" },
        { id: 69, title: "Variáveis e tipos", duration: "90 min", type: "video" },
        { id: 70, title: "Operadores matemáticos e estruturas condicionais", duration: "90 min", type: "video" },
        { id: 71, title: "Estruturas condicionais, tratamento de texto e layout", duration: "90 min", type: "video" },
        { id: 72, title: "Layout, Arrays e navegando entre telas (Activities)", duration: "90 min", type: "video" },
        { id: 73, title: "Orientação a Objetos (Métodos, Classes e Herança)", duration: "90 min", type: "video" },
        { id: 74, title: "Modificadores de acesso", duration: "90 min", type: "video" },
        { id: 75, title: "XML e layout adaptável", duration: "90 min", type: "video" },
        { id: 76, title: "Guidelines (Diretrizes de design)", duration: "90 min", type: "video" },
        { id: 77, title: "Chain, GridLayout e Componentes de formulário", duration: "90 min", type: "video" },
        { id: 78, title: "Componentes de formulário (continuação)", duration: "90 min", type: "video" },
        { id: 79, title: 'Mídia + Projeto "Cadastro de Clientes"', duration: "90 min", type: "project" },
        { id: 80, title: 'Banco de Dados + Projeto "Cadastro de Clientes"', duration: "90 min", type: "project" },
        { id: 81, title: 'Banco de Dados + Projeto "Cadastro de Clientes" (continuação)', duration: "90 min", type: "project" },
        { id: 82, title: 'Projeto "Cadastro de Clientes" + Publicação na Google Play', duration: "90 min", type: "project" }
      ]
    },
    {
      id: 6,
      title: "Cursor (IDE com IA integrada)",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Do zero ao programador",
        description: "Metodologia comprovada que leva iniciantes ao primeiro emprego em programação"
      },
      {
        icon: "TrendUp",
        title: "Múltiplas linguagens",
        description: "Domine Python, Java, PHP e Android para ser um desenvolvedor versátil"
      },
      {
        icon: "Users",
        title: "Mercado em alta",
        description: "Programadores são os profissionais mais demandados do mercado atual"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Lógica",
        description: "Fundamentos sólidos de lógica de programação e algoritmos",
        icon: "House"
      },
      {
        number: 2,
        title: "Linguagens",
        description: "Domine Python, Java e PHP com projetos práticos",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Mobile & Web",
        description: "Desenvolva aplicativos Android e sistemas web completos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Carreira",
        description: "Portfolio profissional e preparação para oportunidades",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Lógica de programação sólida para qualquer linguagem",
    "Python completo para desenvolvimento web e automação",
    "Java para aplicações empresariais robustas",
    "PHP para sistemas web dinâmicos com MySQL",
    "Desenvolvimento de aplicativos Android nativos",
    "Cursor: IDE com IA integrada (em desenvolvimento)",
    "CRUD completo e banco de dados",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com projetos reais",
    "Preparação completa para o mercado de trabalho",
    "Do zero ao primeiro emprego como programador"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "8GB de RAM mínimo (recomendado 16GB)",
    "Conexão estável com internet",
    "Inglês básico (recomendado)",
    "Dedicação de 15-20 horas semanais",
    "Vontade de resolver problemas lógicos"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1497,
    currentPrice: 897,
    discount: 40,
    installments: {
      max: 12,
      value: 89.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Code Academy Team",
    bio: "Equipe de desenvolvedores sênior com experiência em múltiplas linguagens e projetos de grande escala. Especialistas em formar novos programadores.",
    photo: "/instructors/team-programacao.jpg",
    experience: "12+ anos",
    credentials: [
      "Certificação em Python e Java",
      "Experiência em startups e grandes empresas",
      "Projetos open source reconhecidos",
      "Formação em Ciência da Computação"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Paulo Henrique Santos",
      role: "Programação",
      photo: "/testimonials/paulo-henrique-santos.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso de Programação mudou minha forma de pensar. Nunca imaginei que aprender lógica e código pudesse ser tão prático. As aulas são muito bem organizadas.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Letícia Ribeiro",
      role: "Programação",
      photo: "/testimonials/leticia-ribeiro.jpg",
      // Placeholder image
      rating: 5,
      text: "Escolhi o curso sem saber nada de programação e já estou desenvolvendo meus primeiros projetos. O professor tem uma didática incrível e sempre nos motiva.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 3,
      name: "Lucas Vinícius",
      role: "Programação",
      photo: "/testimonials/lucas-vinicius.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são envolventes, com desafios reais que deixam tudo mais interessante. Cada aula me motiva a ir mais longe na área.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 4,
      name: "Isadora Lima",
      role: "Programação",
      photo: "/testimonials/isadora-lima.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou impressionada com a evolução que tive. O curso é direto ao ponto, com muita prática. O professor torna assuntos complexos fáceis de entender.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Thiago Bernardes",
      role: "Programação",
      photo: "/testimonials/thiago-bernardes.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso tem foco total no que é realmente útil. As atividades práticas e os projetos me deram mais confiança para pensar no mercado.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 6,
      name: "Natália Pereira",
      role: "Programação",
      photo: "/testimonials/natalia-pereira.jpg",
      // Placeholder image
      rating: 5,
      text: "O professor cria um ambiente acolhedor, onde a gente se sente à vontade pra errar e aprender. Gostei muito dos projetos em sala, me ajudaram a ver tudo na prática.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso ter conhecimento prévio em programação?",
      answer: "Não! Começamos do absoluto zero com lógica de programação e evoluímos gradualmente até linguagens avançadas."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "O que é o Cursor e quando estará disponível?",
      answer: "Cursor é um IDE com IA integrada para desenvolvimento. O conteúdo programático está sendo desenvolvido pela equipe."
    }
  ],
  themeColors: {
    primary: "#4CAF50",
    secondary: "#8BC34A",
    accent: "#CDDC39",
    gradient: {
      from: "#4CAF50",
      to: "#8BC34A"
    }
  },
  seoMeta: {
    title: "Curso de Programação Florianópolis - Python, Java, PHP e Android - Escola Habilidade São José",
    description: "Curso completo de programação em Florianópolis e São José SC. Aprenda Python, Java, PHP e desenvolvimento Android do zero ao primeiro emprego. 118 horas, material incluso, modalidades presencial e online.",
    keywords: ["curso programação florianópolis", "python são josé sc", "java grande florianópolis", "php desenvolvimento web", "android programação", "escola técnica programação SC"],
    ogImage: "/og-images/programacao.jpg",
    ogType: "website"
  }
};
const marketingDigital = {
  basicInfo: {
    id: "marketing-digital-004",
    title: "Marketing Digital",
    slug: "marketing-digital",
    shortDescription: "Domine Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business.",
    longDescription: "Torne-se um especialista em Marketing Digital. Aprenda Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business. 6 módulos completos para gerar resultados reais.",
    category: "Marketing",
    level: "Intermediário",
    duration: "68 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 6 módulos de marketing",
      "Apostilas com estratégias, templates e cases práticos",
      "Referência permanente para campanhas",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Marketing Digital (Versão 2)",
      description: "Base estratégica para dominar o marketing online",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "O que é o Marketing Digital?", duration: "90 min", type: "video" },
        { id: 2, title: "Descobrindo seu público-alvo e persona", duration: "90 min", type: "video" },
        { id: 3, title: "Como escolher seus Canais de Divulgação e Venda", duration: "90 min", type: "video" },
        { id: 4, title: "Facebook (Marketing na plataforma)", duration: "90 min", type: "video" },
        { id: 5, title: "Instagram (Marketing na plataforma)", duration: "90 min", type: "video" },
        { id: 6, title: "Conteúdos Atrativos para Redes Sociais I", duration: "90 min", type: "video" },
        { id: 7, title: "Conteúdos Atrativos para Redes Sociais II", duration: "90 min", type: "video" },
        { id: 8, title: "Google Meu Negócio e Google Ads", duration: "90 min", type: "video" },
        { id: 9, title: "Google Analytics", duration: "90 min", type: "video" },
        { id: 10, title: "Como vender mais e atrair mais Leads", duration: "90 min", type: "video" },
        { id: 11, title: "Criando uma Campanha no Facebook I", duration: "90 min", type: "video" },
        { id: 12, title: "Criando uma Campanha no Facebook II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Mídias Sociais",
      description: "Estratégias para redes sociais e comunicação digital",
      duration: "15 horas",
      lessons: [
        { id: 13, title: "Introdução a Mídias Sociais", duration: "90 min", type: "video" },
        { id: 14, title: "Redes Sociais (conceito geral)", duration: "90 min", type: "video" },
        { id: 15, title: "Conhecendo o Twitter", duration: "90 min", type: "video" },
        { id: 16, title: "Conhecendo o Instagram", duration: "90 min", type: "video" },
        { id: 17, title: "Conhecendo o Facebook", duration: "90 min", type: "video" },
        { id: 18, title: "Conhecendo o Facebook Messenger", duration: "90 min", type: "video" },
        { id: 19, title: "Criando uma Página no Facebook", duration: "90 min", type: "video" },
        { id: 20, title: "Conhecendo o LinkedIn", duration: "90 min", type: "video" },
        { id: 21, title: "Conhecendo o YouTube", duration: "90 min", type: "video" },
        { id: 22, title: "Conhecendo o WhatsApp", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Armazenamento na Nuvem",
      description: "Ferramentas de produtividade e colaboração online",
      duration: "6 horas",
      lessons: [
        { id: 23, title: "Google Drive", duration: "90 min", type: "video" },
        { id: 24, title: "Compartilhamento de Arquivos e Trabalho em Conjunto", duration: "90 min", type: "video" },
        { id: 25, title: "Dropbox", duration: "90 min", type: "video" },
        { id: 26, title: "Compartilhamento de Arquivos e Arquivos Offline", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Inteligência Artificial (Marketing)",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 5,
      title: "Marketing Pessoal",
      description: "Desenvolvimento de marca pessoal e networking",
      duration: "3 horas",
      lessons: [
        { id: 27, title: "Marketing Pessoal – Valores e Auto-Conhecimento", duration: "90 min", type: "video" },
        { id: 28, title: "Networking, Branding e Qualificação Profissional", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Facebook Business",
      description: "Estratégias avançadas para campanhas no Facebook",
      duration: "24 horas",
      lessons: [
        { id: 29, title: "Conhecendo o Facebook Business", duration: "90 min", type: "video" },
        { id: 30, title: "Criando Conta de Usuário e Página", duration: "90 min", type: "video" },
        { id: 31, title: "Menu Configurações I", duration: "90 min", type: "video" },
        { id: 32, title: "Menu Configurações II", duration: "90 min", type: "video" },
        { id: 33, title: "Menu Configurações III", duration: "90 min", type: "video" },
        { id: 34, title: "Criação de Públicos I", duration: "90 min", type: "video" },
        { id: 35, title: "Criação de Públicos II", duration: "90 min", type: "video" },
        { id: 36, title: "Criação de Públicos III", duration: "90 min", type: "video" },
        { id: 37, title: "Gerenciador de Anúncios", duration: "90 min", type: "video" },
        { id: 38, title: "Criação de Campanha I", duration: "90 min", type: "video" },
        { id: 39, title: "Criação de Campanha II", duration: "90 min", type: "video" },
        { id: 40, title: "Criação de Campanha III", duration: "90 min", type: "video" },
        { id: 41, title: "Criação de Campanha IV", duration: "90 min", type: "video" },
        { id: 42, title: "Publicando Campanhas", duration: "90 min", type: "video" },
        { id: 43, title: "Leads e Pixel (Ferramentas de Conversão)", duration: "90 min", type: "video" },
        { id: 44, title: "Gerando e Analisando Dados", duration: "90 min", type: "video" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Estratégias que funcionam",
        description: "Metodologia comprovada para gerar resultados reais em marketing digital"
      },
      {
        icon: "TrendUp",
        title: "Multiplique vendas",
        description: "Técnicas avançadas para aumentar faturamento e conquistar clientes"
      },
      {
        icon: "Users",
        title: "Mercado em expansão",
        description: "Marketing digital é essencial para qualquer negócio moderno"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine os pilares do marketing digital e mídias sociais",
        icon: "House"
      },
      {
        number: 2,
        title: "Estratégia",
        description: "Desenvolva campanhas eficazes e conteúdo atrativo",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Automação",
        description: "Facebook Business, IA Marketing e ferramentas avançadas",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Resultados",
        description: "Portfolio com campanhas reais e marca pessoal consolidada",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Marketing Digital V2: estratégias modernas e eficazes",
    "Mídias Sociais: Facebook, Instagram, Twitter, LinkedIn",
    "Armazenamento em Nuvem para produtividade",
    "IA Marketing: automação inteligente (em desenvolvimento)",
    "Marketing Pessoal: construção de marca pessoal",
    "Facebook Business: campanhas profissionais",
    "Google Analytics e métricas de desempenho",
    "Criação de conteúdo atrativo para redes",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com campanhas reais",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "Conexão estável com internet",
    "Conta Google (Gmail)",
    "Conta Facebook pessoal",
    "Orçamento inicial para testes (R$ 300-500)",
    "Conhecimentos básicos de informática"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 597,
    discount: 33,
    installments: {
      max: 12,
      value: 59.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Digital Marketing Masters",
    bio: "Equipe de especialistas em marketing digital com experiência em agências e campanhas de grande alcance. Experts em resultados mensuráveis.",
    photo: "/instructors/team-marketing.jpg",
    experience: "8+ anos",
    credentials: [
      "Certificação Google Ads e Analytics",
      "Facebook Blueprint Certified",
      "Experiência em agências de publicidade",
      "Cases de sucesso em e-commerce"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Maria Eduarda Costa",
      role: "Profissional Confiante",
      photo: "/testimonials/maria-eduarda-costa.jpg",
      rating: 5,
      text: "Aprender sobre Marketing Pessoal mudou minha postura profissional. Hoje me sinto muito mais confiante para divulgar meu trabalho.",
      result: "Postura profissional transformada"
    },
    {
      id: 2,
      name: "Isabela Freitas",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/isabela-freitas.jpg",
      rating: 5,
      text: "Finalmente aprendi a usar Inteligência Artificial para gerar conteúdo e criar meus posts nas redes sociais. Recomendo demais!",
      result: "Conteúdo com IA"
    },
    {
      id: 3,
      name: "Natália Campos",
      role: "Entusiasta de Marketing",
      photo: "/testimonials/natalia-campos.jpg",
      rating: 5,
      text: "Adorei como o curso conectou marketing digital com inteligência artificial. Inovador e surpreendente!",
      result: "Combinação inovadora"
    },
    {
      id: 4,
      name: "Fabiola Moraes",
      role: "Profissional de Marketing",
      photo: "/testimonials/fabiola-moraes.jpg",
      rating: 5,
      text: "Depois do curso, consegui o emprego que tanto sonhei na área de marketing digital. Obrigada Escola Habilidade por me ajudar nesse caminho!",
      result: "Emprego dos sonhos"
    },
    {
      id: 5,
      name: "Julia Ramos",
      role: "Gestora de Anúncios",
      photo: "/testimonials/julia-ramos.jpg",
      rating: 5,
      text: "Antes desse curso, eu tinha muito medo de mexer com os anúncios das redes sociais. As aulas sobre Facebook Business foram um divisor de águas. Hoje já consigo ter retorno real dos anúncios que crio.",
      result: "Retorno real dos anúncios"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Funciona para qualquer tipo de negócio?",
      answer: "Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos, profissionais liberais e empresas B2B."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Como funciona o módulo de IA Marketing?",
      answer: "O módulo de IA Marketing está em desenvolvimento. O conteúdo será disponibilizado assim que finalizado pela equipe."
    }
  ],
  themeColors: {
    primary: "#3F51B5",
    secondary: "#5C6BC0",
    accent: "#7986CB",
    gradient: {
      from: "#3F51B5",
      to: "#5C6BC0"
    }
  },
  seoMeta: {
    title: "Curso Marketing Digital Completo - Escola Habilidade | Marketing V2, Mídias Sociais, Facebook Business - Material Incluso",
    description: "Torne-se especialista em Marketing Digital. 6 módulos: Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal, Facebook Business. 68 horas, apostilas inclusas.",
    keywords: ["marketing digital", "marketing v2", "mídias sociais", "facebook business", "marketing pessoal", "apostilas inclusas"],
    ogImage: "/og-images/marketing-digital.jpg",
    ogType: "website"
  }
};
const inteligenciaArtificial = {
  basicInfo: {
    id: "inteligencia-artificial-005",
    title: "Inteligência Artificial",
    slug: "inteligencia-artificial",
    shortDescription: "Domine IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas.",
    longDescription: "Curso completo de Inteligência Artificial. Aprenda IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas. 6 módulos para dominar IA criativa e aplicada aos negócios.",
    category: "Tecnologia",
    level: "Intermediário",
    duration: "31,5 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos módulos disponíveis",
      "Apostilas com prompts, tutoriais e projetos práticos",
      "Referência permanente para IA aplicada",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Inteligência Artificial (Fundamentos)",
      description: 'Conteúdo já detalhado acima em Informática – módulo "Inteligência Artificial", 16 aulas, 24h',
      duration: "24 horas",
      note: "Mesmo conteúdo do módulo de IA do curso de Informática",
      lessons: [
        { id: 1, title: "Introdução e História da Inteligência Artificial", duration: "90 min", type: "video" },
        { id: 2, title: "Machine Learning", duration: "90 min", type: "video" },
        { id: 3, title: "Prompt Engineering", duration: "90 min", type: "video" },
        { id: 4, title: "GPT, Bard e Copilot", duration: "90 min", type: "video" },
        { id: 5, title: "Estudando e Pesquisando com IAs", duration: "90 min", type: "video" },
        { id: 6, title: "Melhorando o Prompt", duration: "90 min", type: "video" },
        { id: 7, title: "Gerando Imagens", duration: "90 min", type: "video" },
        { id: 8, title: "Gerando Posts para Redes Sociais", duration: "90 min", type: "video" },
        { id: 9, title: "HARPA AI – Parte 1", duration: "90 min", type: "video" },
        { id: 10, title: "HARPA AI – Parte 2", duration: "90 min", type: "video" },
        { id: 11, title: "Gerando Vídeos", duration: "90 min", type: "video" },
        { id: 12, title: "Gerando Vídeos através de Imagens", duration: "90 min", type: "video" },
        { id: 13, title: "Gerando Áudios", duration: "90 min", type: "video" },
        { id: 14, title: "Gerando Vídeos com D-ID", duration: "90 min", type: "video" },
        { id: 15, title: "PI (Inteligência Artificial Personalizada)", duration: "90 min", type: "video" },
        { id: 16, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: 'Inteligência Artificial for Business ("Empreendendo com IA nos Negócios")',
      description: "IA aplicada aos negócios e empreendedorismo",
      duration: "7,5 horas",
      lessons: [
        { id: 17, title: "Criando Minha Marca", duration: "90 min", type: "video" },
        { id: 18, title: "Mapeando Público-Alvo", duration: "90 min", type: "video" },
        { id: 19, title: "Criando Argumentos de Vendas Personalizados", duration: "90 min", type: "video" },
        { id: 20, title: "Gerando Posts", duration: "90 min", type: "video" },
        { id: 21, title: "Gerenciando Relacionamento com o Cliente", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Cursor",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 4,
      title: "Flowlabs",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 5,
      title: "ElevenLabs",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 6,
      title: "HatchCanvas",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Domine o futuro",
        description: "Inteligência Artificial é a tecnologia que está revolucionando todos os setores"
      },
      {
        icon: "TrendUp",
        title: "Multiplique produtividade",
        description: "Automatize tarefas e aumente eficiência com ferramentas de IA avançadas"
      },
      {
        icon: "Users",
        title: "Diferencial competitivo",
        description: "Profissionais com IA ganham 300% mais e têm acesso às melhores oportunidades"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos IA",
        description: "Domine conceitos básicos, prompts e ferramentas essenciais",
        icon: "House"
      },
      {
        number: 2,
        title: "IA nos Negócios",
        description: "Aplique IA estrategicamente para crescimento empresarial",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Ferramentas Avançadas",
        description: "Cursor, Flowlabs, ElevenLabs e HatchCanvas em desenvolvimento",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Especialização",
        description: "Torne-se especialista em IA e lidere a transformação digital",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "IA Fundamentos: base sólida em inteligência artificial",
    "IA for Business: aplicação empresarial estratégica",
    "Cursor: em desenvolvimento",
    "Flowlabs: em desenvolvimento",
    "ElevenLabs: em desenvolvimento",
    "HatchCanvas: em desenvolvimento",
    "Prompt Engineering e criação de conteúdo",
    "Integração de IA com negócios",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Projetos práticos com IA",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "Conexão estável com internet de alta velocidade",
    "Conta Google para integrações",
    "Inglês básico (interface das ferramentas)",
    "Criatividade e vontade de inovar"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 497,
    discount: 38,
    installments: {
      max: 12,
      value: 49.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "AI Innovation Team",
    bio: "Equipe especializada em Inteligência Artificial com experiência em desenvolvimento de soluções criativas e aplicações empresariais. Experts em ferramentas de IA emergentes.",
    photo: "/instructors/team-ia.jpg",
    experience: "6+ anos",
    credentials: [
      "Especialização em Machine Learning",
      "Experiência com ferramentas de IA generativa",
      "Projetos em empresas de tecnologia",
      "Formação em Ciência de Dados"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Leonardo Costa",
      role: "Creator de Conteúdo",
      photo: "/testimonials/leonardo-costa.jpg",
      rating: 5,
      text: "Fiz presencial e foi sensacional! Com IA criei conteúdo automaticamente e aumentei 500% minha produtividade.",
      result: "Produtividade +500%"
    },
    {
      id: 2,
      name: "Fernanda Oliveira",
      role: "Agência Digital",
      photo: "/testimonials/fernanda-oliveira.jpg",
      rating: 5,
      text: "Optei pelo online e minha agência oferece serviços IA! Triplicou o faturamento em 6 meses.",
      result: "Faturamento x3 em 6 meses"
    },
    {
      id: 3,
      name: "Carlos Mendes",
      role: "Consultor IA",
      photo: "/testimonials/carlos-mendes.jpg",
      rating: 5,
      text: "Com as apostilas sempre comigo, me especializei em IA e ganho R$ 20.000/mês como consultor!",
      result: "Renda de R$ 20.000/mês"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso conhecimento técnico em programação?",
      answer: "Não! As ferramentas são visuais e intuitivas. Ensinamos tudo do zero, focado no uso prático das IAs disponíveis."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso dos módulos disponíveis incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Quando os módulos em desenvolvimento estarão prontos?",
      answer: "Cursor, Flowlabs, ElevenLabs e HatchCanvas estão sendo desenvolvidos. O conteúdo será liberado conforme finalizado pela equipe."
    }
  ],
  themeColors: {
    primary: "#673AB7",
    secondary: "#9C27B0",
    accent: "#E1BEE7",
    gradient: {
      from: "#673AB7",
      to: "#9C27B0"
    }
  },
  seoMeta: {
    title: "Curso Inteligência Artificial Completo - Escola Habilidade | IA Fundamentos, IA Business, Cursor, Flowlabs - Material Incluso",
    description: "Domine IA completa. 6 módulos: IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs, HatchCanvas. Apostilas inclusas, modalidades presencial e online.",
    keywords: ["inteligência artificial", "ia fundamentos", "ia business", "cursor ai", "flowlabs", "elevenlabs", "apostilas inclusas"],
    ogImage: "/og-images/inteligencia-artificial.jpg",
    ogType: "website"
  }
};
const businessIntelligence = {
  basicInfo: {
    id: "business-intelligence-006",
    title: "Business Intelligence",
    slug: "business-intelligence",
    shortDescription: "Domine Excel Fundamental, Excel Avançado, Dashboard e IA para Análise de dados inteligente.",
    longDescription: "Curso completo de Business Intelligence com IA. Domine Excel Fundamental, Excel Avançado, Dashboard profissional e IA para Análise. 4 módulos completos para transformar dados em insights estratégicos.",
    category: "Análise de Dados",
    level: "Intermediário",
    duration: "54 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 4 módulos de BI",
      "Apostilas com fórmulas, dashboards e análises práticas",
      "Referência permanente para análise de dados",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Excel (Fundamental) (base para análise de dados)",
      description: 'Conteúdo já detalhado acima em Informática – módulo "Excel Fundamental", 18 aulas, 27h',
      duration: "27 horas",
      note: "Mesmo conteúdo do módulo Excel Fundamental do curso de Informática",
      lessons: [
        { id: 1, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 2, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 3, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 4, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 5, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 6, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 7, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 8, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 9, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 10, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 11, title: "Funções de Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 12, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 13, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 14, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 15, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 16, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 17, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 18, title: "Configurações, Auditoria e Exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Excel (Avançado) (análise e modelagem de dados)",
      description: 'Conteúdo já detalhado acima em Informática – módulo "Excel Avançado", 13 aulas, 19,5h',
      duration: "19,5 horas",
      note: "Mesmo conteúdo do módulo Excel Avançado do curso de Informática",
      lessons: [
        { id: 19, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 20, title: "Funções de Texto", duration: "90 min", type: "video" },
        { id: 21, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 22, title: "Funções de Matemática/Trigonometria e Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 23, title: "Funções Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 24, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 25, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 26, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 27, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 28, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 29, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 30, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 31, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Dashboard (Excel Dashboard)",
      description: "Criação de dashboards profissionais no Excel",
      duration: "7,5 horas",
      lessons: [
        { id: 32, title: "O que é Dashboard?", duration: "90 min", type: "video" },
        { id: 33, title: "Práticas de uso no Dashboard", duration: "90 min", type: "video" },
        { id: 34, title: "Praticando Dashboard (exercícios)", duration: "90 min", type: "exercise" },
        { id: 35, title: "Dashboard com Matrizes", duration: "90 min", type: "video" },
        { id: 36, title: "Projeto Final (Construção de um dashboard completo)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "IA para Análise de Dados e Criação de Dashboard",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Dados em insights",
        description: "Transforme dados brutos em insights estratégicos que geram resultados"
      },
      {
        icon: "TrendUp",
        title: "Carreira em alta",
        description: "Analistas de BI estão entre os profissionais mais valorizados do mercado"
      },
      {
        icon: "Users",
        title: "Decisões inteligentes",
        description: "Dashboards e análises que orientam decisões executivas estratégicas"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Excel Básico",
        description: "Fundamentos sólidos em planilhas e análise de dados",
        icon: "House"
      },
      {
        number: 2,
        title: "Excel Avançado",
        description: "Fórmulas complexas, VBA e automação profissional",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Dashboards",
        description: "Visualizações executivas e painéis de controle profissionais",
        icon: "Crown"
      },
      {
        number: 4,
        title: "BI Especialista",
        description: "IA para análise e especialização completa em Business Intelligence",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Excel Fundamental: planilhas e análises básicas",
    "Excel Avançado: fórmulas complexas e VBA",
    "Dashboard: visualizações profissionais no Excel",
    "IA para Análise: em desenvolvimento",
    "Análise de dados empresariais",
    "Tabelas dinâmicas e gráficos avançados",
    "Macros e automação no Excel",
    "Dashboards executivos profissionais",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com projetos empresariais",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11",
    "8GB de RAM mínimo (recomendado 16GB)",
    "Microsoft Excel instalado",
    "Conhecimento básico de matemática",
    "Experiência empresarial (recomendado)"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 697,
    discount: 22,
    installments: {
      max: 12,
      value: 69.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Business Intelligence Experts",
    bio: "Equipe de analistas de dados sênior com experiência em transformação digital empresarial. Especialistas em Excel, Dashboard e BI aplicado aos negócios.",
    photo: "/instructors/team-bi.jpg",
    experience: "10+ anos",
    credentials: [
      "Certificação Microsoft Excel Expert",
      "Especialização em Business Intelligence",
      "Experiência em análise de dados corporativos",
      "Projetos de transformação digital"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Paula Costa",
      role: "Analista Aprendiz",
      photo: "/testimonials/paula-costa.jpg",
      rating: 5,
      text: "A didática é muito boa! O professor explica de um jeito que realmente dá vontade de continuar.",
      result: "Didática excelente"
    },
    {
      id: 2,
      name: "Heitor Barbosa",
      role: "Profissional de Dados",
      photo: "/testimonials/heitor-barbosa.jpg",
      rating: 5,
      text: "Esse curso é um divisor de águas pra quem quer crescer na área de dados.",
      result: "Divisor de águas"
    },
    {
      id: 3,
      name: "Carlos Petri",
      role: "Aluno Satisfeito",
      photo: "/testimonials/carlos-petri.jpg",
      rating: 5,
      text: "Me identifiquei muito com a forma de ensinar. Já indiquei pra dois colegas!",
      result: "Indicação para colegas"
    },
    {
      id: 4,
      name: "Vitor Santos",
      role: "Analista Recomendador",
      photo: "/testimonials/vitor-santos.jpg",
      rating: 5,
      text: "Recomendo pra qualquer pessoa que queira melhorar profissionalmente com análise de dados!",
      result: "Melhoria profissional"
    },
    {
      id: 5,
      name: "Fernanda Campos",
      role: "Analista BI Júnior",
      photo: "/testimonials/fernanda-campos.jpg",
      rating: 5,
      text: "Entrei no curso sem saber absolutamente nada de Excel. Sempre tive dificuldade com números e achava que análise de dados era só pra quem fazia TI. Mas o jeito que o conteúdo foi organizado me deu muita segurança. Hoje, faço dashboards completos, automatizo relatórios no Power BI e uso IA pra gerar apresentações de forma rápida. O curso me ajudou a conquistar uma vaga nova com aumento salarial. Gratidão eterna!",
      result: "Nova vaga com aumento"
    },
    {
      id: 6,
      name: "João Paulo",
      role: "Analista Evoluído",
      photo: "/testimonials/joao-paulo.jpg",
      rating: 5,
      text: "A estrutura do curso é muito bem pensada. As aulas são diretas, com exemplos práticos e desafios que te forçam a aprender de verdade. Em poucas semanas, saí do nível básico para conseguir montar gráficos dinâmicos, usar funções lógicas e até começar a explorar o VBA. Senti uma evolução real, e isso me motivou ainda mais a seguir nessa área de BI.",
      result: "Evolução real e motivação"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso conhecimento prévio em Excel?",
      answer: "Não! Começamos do Excel Fundamental e evoluímos até Excel Avançado com fórmulas complexas e VBA."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 4 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Quando o módulo de IA para Análise estará disponível?",
      answer: "O módulo de IA para Análise de Dados está sendo desenvolvido. O conteúdo será liberado assim que finalizado."
    }
  ],
  themeColors: {
    primary: "#1976D2",
    secondary: "#2196F3",
    accent: "#03DAC6",
    gradient: {
      from: "#1976D2",
      to: "#2196F3"
    }
  },
  seoMeta: {
    title: "Curso Business Intelligence Completo - Escola Habilidade | Excel Fundamental, Excel Avançado, Dashboard, IA - Material Incluso",
    description: "Torne-se especialista em Business Intelligence. 4 módulos: Excel Fundamental, Excel Avançado, Dashboard, IA para Análise. 54 horas, apostilas inclusas.",
    keywords: ["business intelligence", "excel avançado", "dashboard", "ia para análise", "bi", "apostilas inclusas"],
    ogImage: "/og-images/business-intelligence.jpg",
    ogType: "website"
  }
};
const projetista = {
  basicInfo: {
    id: "projetista-007",
    title: "Projetista 3D Completo",
    slug: "projetista-3d",
    shortDescription: "Formação completa em Projetista 3D com SketchUp, AutoCAD, Revit e Enscape presencial em São José SC. Do esboço ao render com IA.",
    longDescription: "Curso Projetista 3D presencial completo: SketchUp + AutoCAD + Revit + Enscape com IA. Única escola em SC com formação integrada em todas as ferramentas do projetista moderno. 94 horas práticas.",
    category: "Arquitetura & Design",
    level: "Intermediário",
    duration: "94 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 2 módulos",
      "Apostilas com projetos práticos e exercícios",
      "Referência permanente para consulta profissional",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores certificados internacionalmente"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  // ✅ Por que presencial? - Diferencial competitivo
  whyPresencial: {
    title: "Por que Escolher o Curso Presencial?",
    subtitle: "Único curso SketchUp + Enscape + IA presencial em Santa Catarina",
    benefits: [
      {
        icon: "users",
        title: "Turmas Pequenas",
        description: "Máximo 8 alunos por turma garantem atenção individualizada do professor."
      },
      {
        icon: "handshake",
        title: "Suporte Imediato",
        description: "Professor ao seu lado para tirar dúvidas na hora e corrigir erros em tempo real."
      },
      {
        icon: "network",
        title: "Networking Local",
        description: "Conheça outros profissionais de SC e forme sua rede de contatos na área."
      },
      {
        icon: "computer",
        title: "Equipamentos Profissionais",
        description: "Use computadores com placas de vídeo dedicadas para Enscape sem limitações."
      },
      {
        icon: "certificate",
        title: "Certificado Presencial",
        description: "Certificado nacional com diferencial de curso presencial reconhecido pelo mercado."
      },
      {
        icon: "location",
        title: "Localização Estratégica",
        description: "São José - SC, no coração da Grande Florianópolis, fácil acesso da região."
      }
    ]
  },
  curriculum: [
    {
      id: 1,
      title: "SketchUp",
      description: "Modelagem 3D profissional para arquitetura e design",
      duration: "40 horas",
      lessons: [
        { id: 1, title: "Fundamentos do SketchUp", duration: "120 min", type: "video" },
        { id: 2, title: "Modificadores e Geometrias", duration: "120 min", type: "video" },
        { id: 3, title: "Projeto Guiado – Volume Simples", duration: "120 min", type: "project" },
        { id: 4, title: "Grupos e Componentes", duration: "120 min", type: "video" },
        { id: 5, title: "Manipulação Avançada de Geometrias", duration: "120 min", type: "video" },
        { id: 6, title: "Eixos e Superfícies Inclinadas", duration: "120 min", type: "video" },
        { id: 7, title: "Projeto Guiado – Elementos Arquitetônicos", duration: "120 min", type: "project" },
        { id: 8, title: "Materiais e Texturas", duration: "120 min", type: "video" },
        { id: 9, title: "Ferramenta Siga-me (Follow Me)", duration: "120 min", type: "video" },
        { id: 10, title: "Sandbox e Terrenos", duration: "120 min", type: "video" },
        { id: 11, title: "Vetorização e Logotipos 3D", duration: "120 min", type: "video" },
        { id: 12, title: "Ferramentas de Sólidos", duration: "120 min", type: "video" },
        { id: 13, title: "Importação de Arquivos CAD", duration: "120 min", type: "video" },
        { id: 14, title: "Introdução ao Layout do SketchUp", duration: "120 min", type: "video" },
        { id: 15, title: "Documentação Técnica com Layout", duration: "120 min", type: "video" },
        { id: 16, title: "Plugins Essenciais", duration: "120 min", type: "video" },
        { id: 17, title: "Componentes Dinâmicos I", duration: "120 min", type: "video" },
        { id: 18, title: "Projeto Guiado – Interiores Residenciais", duration: "120 min", type: "project" },
        { id: 19, title: "Projeto Guiado – Fachada com Terreno", duration: "120 min", type: "project" },
        { id: 20, title: "Layout Final do Projeto Completo", duration: "120 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Enscape",
      description: "Renderização em tempo real e realidade virtual com IA",
      duration: "16 horas",
      lessons: [
        { id: 1, title: "Introdução ao Enscape e Configuração Inicial", label: "Renderização", duration: "120 min", type: "video" },
        { id: 2, title: "Iluminação Natural e Artificial", label: "Renderização", duration: "120 min", type: "video" },
        { id: 3, title: "Materiais e Texturização no Enscape", label: "Renderização", duration: "120 min", type: "video" },
        { id: 4, title: "Câmeras e Enquadramentos Profissionais", label: "Renderização", duration: "120 min", type: "video" },
        { id: 5, title: "Configurações de Render e Qualidade", label: "Renderização", duration: "120 min", type: "video" },
        { id: 6, title: "Animações e Vídeos com Enscape", label: "Renderização", duration: "120 min", type: "video" },
        { id: 7, title: "Ambientes Externos e Vegetação", label: "Renderização", duration: "120 min", type: "video" },
        { id: 8, title: "Projeto Guiado Completo com Enscape", label: "Projeto", duration: "120 min", type: "project" }
      ]
    },
    {
      id: 3,
      title: "AutoCAD 2D",
      description: "Desenho técnico 2D profissional e documentação",
      duration: "22 horas",
      lessons: [
        { id: 1, title: "Introdução ao AutoCAD 2020", duration: "60 min", type: "video" },
        { id: 2, title: "Interface de Usuário", duration: "60 min", type: "video" },
        { id: 3, title: "Formas básicas", duration: "60 min", type: "video" },
        { id: 4, title: "Formas II", duration: "60 min", type: "video" },
        { id: 5, title: "Formas III", duration: "60 min", type: "video" },
        { id: 6, title: "Snapping", duration: "60 min", type: "video" },
        { id: 7, title: "Perspectiva", duration: "60 min", type: "video" },
        { id: 8, title: "Coordenadas dinâmicas e absolutas", duration: "60 min", type: "video" },
        { id: 9, title: "Revisão: Perspectiva", duration: "60 min", type: "video" },
        { id: 10, title: "Edições de formas I", duration: "60 min", type: "video" },
        { id: 11, title: "Edições de formas II", duration: "60 min", type: "video" },
        { id: 12, title: "Edição de formas: Revisão", duration: "60 min", type: "video" },
        { id: 13, title: "Paramétrico", duration: "60 min", type: "video" },
        { id: 14, title: "Blocos", duration: "60 min", type: "video" },
        { id: 15, title: "Organizando Objetos", duration: "60 min", type: "video" },
        { id: 16, title: "Layers", duration: "60 min", type: "video" },
        { id: 17, title: "Propriedades e Hachuras", duration: "60 min", type: "video" },
        { id: 18, title: "Menu Anotação: Texto", duration: "60 min", type: "video" },
        { id: 19, title: "Menu Anotação: Cotas", duration: "60 min", type: "video" },
        { id: 20, title: "Customização", duration: "60 min", type: "video" },
        { id: 21, title: "Projeto: Parte 1", duration: "60 min", type: "project" },
        { id: 22, title: "Projeto: Parte 2", duration: "60 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "Revit",
      description: "BIM (Building Information Modeling) e projetos paramétricos",
      duration: "16 horas",
      lessons: [
        { id: 1, title: "Conhecendo o Revit", duration: "60 min", type: "video" },
        { id: 2, title: "Primeiras configurações", duration: "60 min", type: "video" },
        { id: 3, title: "Aprendendo sobre paredes", duration: "60 min", type: "video" },
        { id: 4, title: "Aprendendo sobre pisos", duration: "60 min", type: "video" },
        { id: 5, title: "Aprendendo sobre janelas e portas", duration: "60 min", type: "video" },
        { id: 6, title: "Aprendendo sobre forros e telhados", duration: "60 min", type: "video" },
        { id: 7, title: "Aprendendo sobre componentes", duration: "60 min", type: "video" },
        { id: 8, title: "Aprendendo sobre componentes parte 2", duration: "60 min", type: "video" },
        { id: 9, title: "Criando materiais de pisos", duration: "60 min", type: "video" },
        { id: 10, title: "Criando materiais de telhado", duration: "60 min", type: "video" },
        { id: 11, title: "Configurando o terreno", duration: "60 min", type: "video" },
        { id: 12, title: "Configurando o terreno parte 2", duration: "60 min", type: "video" },
        { id: 13, title: "Finalizando o terreno e iniciando a estrutura", duration: "60 min", type: "video" },
        { id: 14, title: "Documentando o projeto", duration: "60 min", type: "video" },
        { id: 15, title: "Preparando pranchas", duration: "60 min", type: "video" },
        { id: 16, title: "Renderizando o projeto", duration: "60 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Projetos profissionais",
        description: "Crie projetos arquitetônicos 3D com padrão internacional de qualidade"
      },
      {
        icon: "TrendUp",
        title: "Mercado em crescimento",
        description: "Arquitetura e design 3D são áreas em expansão com alta demanda"
      },
      {
        icon: "Users",
        title: "Destaque no mercado",
        description: "Projetos com IA e renderização realista impressionam clientes"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "SketchUp Pro",
        description: "Modelagem 3D profissional e documentação técnica",
        icon: "House"
      },
      {
        number: 2,
        title: "AutoCAD 2D",
        description: "Desenho técnico, blocos e documentação ABNT",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Revit BIM",
        description: "Projetos paramétricos e Building Information Modeling",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Enscape Render",
        description: "Renderização em tempo real com inteligência artificial",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "SketchUp Pro: modelagem 3D profissional e Layout técnico",
    "AutoCAD 2D: desenho técnico, blocos e documentação ABNT",
    "Revit: BIM (Building Information Modeling) e projetos paramétricos",
    "Enscape: renderização em tempo real com inteligência artificial",
    "Workflow integrado: do esboço 2D ao render fotorrealístico",
    "Criação de projetos arquitetônicos completos",
    "Materiais, texturas e iluminação profissional",
    "Componentes dinâmicos e bibliotecas BIM",
    "Animações, vídeos walkthrough e panoramas 360°",
    "Documentação técnica e apresentações para clientes",
    "Portfólio com projetos reais multi-ferramenta",
    "Certificação profissional reconhecida pelo mercado"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "8GB de RAM (recomendado 16GB)",
    "Placa de vídeo dedicada (recomendado)",
    "SketchUp Pro (orientações de licenciamento)",
    "AutoCAD (orientações de licenciamento)",
    "Revit (orientações de licenciamento)",
    "Enscape (orientações de licenciamento)",
    "Conhecimento básico de desenho técnico (desejável)"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1897,
    currentPrice: 1497,
    discount: 21,
    installments: {
      max: 12,
      value: 149.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Architecture Pro Team",
    bio: "Equipe especializada em projetos arquitetônicos com certificações internacionais em SketchUp, AutoCAD, Revit e Enscape. Experiência em escritórios de arquitetura e projetos BIM.",
    photo: "/instructors/team-projetista.jpg",
    experience: "15+ anos",
    credentials: [
      "Certificação SketchUp Pro Internacional",
      "AutoCAD Certified Professional",
      "Autodesk Revit Architecture Specialist",
      "Enscape Certified Professional",
      "Experiência em escritórios de arquitetura",
      "Projetos BIM premiados em concursos nacionais"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Juliana Marques",
      role: "Projetista",
      photo: "/testimonials/juliana-marques.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou adorando o curso de Projetista na Escola Habilidade! O professor explica tudo de um jeito fácil e traz exemplos reais que fazem toda a diferença. Sinto que evoluí bastante desde que comecei.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Carlos Eduardo Oliveira",
      role: "Projetista",
      photo: "/testimonials/carlos-eduardo-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso está sendo ótimo. Aulas práticas, dinâmicas e professor super atencioso. Já estou conseguindo aplicar no meu trabalho tudo que aprendo aqui.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 3,
      name: "Amanda Cristina Silva",
      role: "Projetista",
      photo: "/testimonials/amanda-cristina-silva.jpg",
      // Placeholder image
      rating: 5,
      text: "Gostei muito das aulas de SketchUp e Enscape! O ambiente da Escola Habilidade é super acolhedor, e as atividades são bem organizadas, tornando o aprendizado mais leve.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 4,
      name: "Rodrigo dos Santos Pereira",
      role: "Projetista",
      photo: "/testimonials/rodrigo-dos-santos-pereira.jpg",
      // Placeholder image
      rating: 5,
      text: "Excelente curso, professor super experiente e com bastante conhecimento de mercado. Já consegui evoluir bastante na parte prática e me sinto mais preparado para projetos reais.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Bruna Almeida",
      role: "Projetista",
      photo: "/testimonials/bruna-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou tendo uma ótima experiência com o curso. A parte prática é muito bem feita, o professor sempre incentiva a criatividade e a aplicação dos conceitos em situações reais.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 6,
      name: "Thiago Henrique Lopes",
      role: "Projetista",
      photo: "/testimonials/thiago-henrique-lopes.jpg",
      // Placeholder image
      rating: 5,
      text: "Curso presencial muito bom, com aulas bem organizadas. Adorei como o professor relaciona tudo com o dia a dia do projetista. Me sinto mais seguro a cada aula.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  // ✅ Enhanced Content Sections - Seções deep-dive por ferramenta
  enhancedSections: {
    sketchup: {
      id: "sketchup",
      title: "SketchUp Pro: Modelagem 3D Intuitiva e Profissional",
      subtitle: "A ferramenta mais popular para modelagem 3D arquitetônica",
      description: "SketchUp Pro é o software de modelagem 3D mais intuitivo e amplamente usado por arquitetos, designers e projetistas em todo o mundo. Com sua interface simples e ferramentas poderosas, permite criar desde conceitos iniciais até projetos técnicos completos com documentação profissional.",
      keyFeatures: [
        "Interface intuitiva de arrastar e empurrar",
        "Biblioteca 3D Warehouse com milhões de componentes",
        "LayOut para documentação técnica e pranchas",
        "Plugins e extensões para produtividade",
        "Integração com ferramentas BIM e CAD",
        "Suporte para realidade virtual e aumentada"
      ],
      professionalUse: [
        "Concepção e desenvolvimento de projetos arquitetônicos",
        "Criação de maquetes eletrônicas e estudos volumétricos",
        "Desenvolvimento de projetos de interiores e mobiliário",
        "Paisagismo e planejamento urbano",
        "Projetos de reforma e retrofitting",
        "Apresentações para clientes e aprovações"
      ],
      localApplications: [
        "Projetos residenciais em condomínios de Florianópolis",
        "Reformas de apartamentos no centro de São José",
        "Projetos comerciais na região da Grande Florianópolis",
        "Paisagismo para residências de Palhoça",
        "Projetos de pousadas e estabelecimentos turísticos em SC"
      ],
      careerOpportunities: [
        "Projetista 3D em escritórios de arquitetura",
        "Designer de interiores freelancer",
        "Consultor em modelagem 3D",
        "Especialista em visualização arquitetônica",
        "Instrutor de SketchUp e softwares 3D"
      ]
    },
    autocad: {
      id: "autocad",
      title: "AutoCAD 2D: Desenho Técnico e Documentação Profissional",
      subtitle: "O padrão internacional para projetos técnicos bidimensionais",
      description: "AutoCAD é o software líder mundial em desenho técnico 2D, estabelecendo o padrão da indústria há mais de 40 anos. Essencial para documentação técnica, plantas baixas, cortes, fachadas e detalhamentos que seguem normas ABNT e internacionais, garantindo precisão milimétrica em todos os projetos.",
      keyFeatures: [
        "Precisão dimensional absoluta com coordenadas",
        "Ferramentas de desenho técnico padronizadas",
        "Layers organizados para diferentes disciplinas",
        "Blocos dinâmicos e bibliotecas personalizadas",
        "Cotas automáticas e anotações técnicas",
        "Compatibilidade universal com fornecedores e órgãos"
      ],
      professionalUse: [
        "Plantas baixas técnicas com precisão milimétrica",
        "Cortes, fachadas e detalhes construtivos",
        "Projetos elétricos, hidráulicos e estruturais",
        "Layouts de fabricação e montagem industrial",
        "Desenhos para aprovação em prefeituras",
        "Documentação técnica para execução de obras"
      ],
      localApplications: [
        "Aprovações de projetos na Prefeitura de Florianópolis",
        "Documentação técnica para construtoras de São José",
        "Projetos de reforma seguindo código de obras de Palhoça",
        "Plantas para licenciamento ambiental em SC",
        "Desenhos técnicos para indústria metal-mecânica da região"
      ],
      careerOpportunities: [
        "Desenhista técnico em construtoras",
        "Projetista em escritórios de engenharia",
        "Especialista em aprovações e licenças",
        "Freelancer em projetos técnicos",
        "Consultor em padronização de desenhos"
      ]
    },
    revit: {
      id: "revit",
      title: "Revit: BIM e Projetos Paramétricos Inteligentes",
      subtitle: "Building Information Modeling para projetos colaborativos",
      description: "Revit representa a evolução do desenho técnico para o BIM (Building Information Modeling), criando projetos paramétricos inteligentes onde cada elemento possui informações completas. Permite colaboração multidisciplinar, detecção automática de interferências e geração de documentação técnica atualizada em tempo real.",
      keyFeatures: [
        "Modelagem paramétrica inteligente",
        "Famílias BIM com informações completas",
        "Colaboração multidisciplinar em tempo real",
        "Detecção automática de interferências",
        "Quantitativos automáticos e orçamento",
        "Integração com análise energética e estrutural"
      ],
      professionalUse: [
        "Projetos BIM integrados multidisciplinares",
        "Coordenação entre arquitetura, estrutura e instalações",
        "Quantitativos automáticos para orçamento",
        "Simulações energéticas e sustentabilidade",
        "Projetos para construção industrializada",
        "Facility management pós-obra"
      ],
      localApplications: [
        "Grandes empreendimentos residenciais em Florianópolis",
        "Projetos comerciais com certificação sustentável",
        "Hospitais e edifícios públicos complexos em SC",
        "Retrofit de edifícios históricos do centro",
        "Projetos industriais com integração 4.0"
      ],
      careerOpportunities: [
        "Especialista BIM em grandes construtoras",
        "Coordenador de projetos multidisciplinares",
        "Consultor em implementação BIM",
        "Projetista sênior com foco em sustentabilidade",
        "Gerente de projetos complexos"
      ]
    },
    enscape: {
      id: "enscape",
      title: "Enscape: Renderização em Tempo Real com IA",
      subtitle: "Visualização fotorrealística instantânea e realidade virtual",
      description: "Enscape revolucionou a visualização arquitetônica ao oferecer renderização em tempo real diretamente dentro do SketchUp e Revit. Com inteligência artificial avançada, produz imagens fotorrealísticas instantaneamente, além de vídeos walkthrough, panoramas 360° e experiências de realidade virtual imersivas.",
      keyFeatures: [
        "Renderização em tempo real (segundos vs horas)",
        "Inteligência artificial para iluminação automática",
        "Materiais PBR fotorrealísticos",
        "Realidade virtual e panoramas 360°",
        "Animações e vídeos walkthrough automáticos",
        "Biblioteca de objetos e vegetação realística"
      ],
      professionalUse: [
        "Apresentações instantâneas para clientes",
        "Vídeos promocionais para marketing imobiliário",
        "Realidade virtual para vendas antecipadas",
        "Estudos de iluminação natural e artificial",
        "Validação de projetos antes da execução",
        "Portfolio profissional de alta qualidade"
      ],
      localApplications: [
        "Renders para construtoras de Florianópolis",
        "VR tours para imobiliárias da Grande Floripa",
        "Visualizações para aprovação de clientes em São José",
        "Marketing digital para arquitetos de Palhoça",
        "Apresentações para investidores imobiliários"
      ],
      careerOpportunities: [
        "Especialista em visualização arquitetônica",
        "Artista 3D freelancer",
        "Coordenador de marketing visual",
        "Consultor em realidade virtual",
        "Diretor de arte para construtoras"
      ]
    }
  },
  // ✅ Workflow Integration Examples
  workflowExamples: {
    residential: {
      title: "Projeto Residencial Completo",
      description: "Workflow integrado do conceito inicial ao marketing final",
      steps: [
        {
          tool: "AutoCAD 2D",
          description: "Levantamento topográfico e plantas técnicas base",
          deliverable: "Plantas baixas precisas com cotas e especificações"
        },
        {
          tool: "SketchUp Pro",
          description: "Modelagem 3D volumétrica e estudos de implantação",
          deliverable: "Maquete 3D com terreno e contexto urbano"
        },
        {
          tool: "Revit",
          description: "Detalhamento BIM com informações construtivas",
          deliverable: "Projeto executivo com quantitativos automáticos"
        },
        {
          tool: "Enscape",
          description: "Renderização e realidade virtual para apresentação",
          deliverable: "Imagens fotorrealísticas e tour virtual 360°"
        }
      ],
      result: "Projeto completo desde aprovação até marketing, com toda documentação técnica e apresentação profissional para clientes e investidores."
    },
    commercial: {
      title: "Espaço Comercial Multidisciplinar",
      description: "Coordenação BIM completa com todas as disciplinas",
      steps: [
        {
          tool: "AutoCAD 2D",
          description: "Layout funcional e zoneamento de atividades",
          deliverable: "Plantas de layout com fluxos e dimensionamento"
        },
        {
          tool: "Revit",
          description: "Coordenação entre arquitetura, estrutura e MEP",
          deliverable: "Modelo BIM integrado sem interferências"
        },
        {
          tool: "SketchUp Pro",
          description: "Estudos de ambientação e mobiliário customizado",
          deliverable: "Modelo 3D com mobiliário e identidade visual"
        },
        {
          tool: "Enscape",
          description: "Apresentação imersiva para aprovação e marketing",
          deliverable: "Walkthrough interativo e imagens promocionais"
        }
      ],
      result: "Projeto comercial coordenado com todas as disciplinas, apresentação profissional e documentação completa para execução."
    }
  },
  // ✅ Tool Comparison Guide
  toolComparisons: [
    {
      scenario: "Projeto inicial e conceituação",
      recommendation: "SketchUp Pro",
      reason: "Interface intuitiva permite explorar rapidamente diferentes soluções volumétricas e conceituais."
    },
    {
      scenario: "Documentação técnica e aprovações",
      recommendation: "AutoCAD 2D",
      reason: "Precisão dimensional e compatibilidade universal com órgãos aprovadores e normas ABNT."
    },
    {
      scenario: "Projetos complexos multidisciplinares",
      recommendation: "Revit",
      reason: "BIM permite coordenação entre disciplinas, detecção de conflitos e informações completas."
    },
    {
      scenario: "Apresentação para clientes",
      recommendation: "Enscape",
      reason: "Renderização instantânea e realidade virtual criam apresentações impactantes e convincentes."
    },
    {
      scenario: "Projetos pequenos e médios",
      recommendation: "SketchUp + AutoCAD",
      reason: "Combinação ideal: agilidade na concepção 3D e precisão na documentação técnica."
    },
    {
      scenario: "Grandes empreendimentos",
      recommendation: "Revit + Enscape",
      reason: "BIM para coordenação complexa e Enscape para marketing e aprovações de investidores."
    }
  ],
  // ✅ Regional Professional Network
  regionalNetwork: {
    title: "Rede Profissional Grande Florianópolis",
    subtitle: "Conecte-se com o mercado local de arquitetura e construção",
    description: "Nossa escola mantém conexões ativas com escritórios de arquitetura, construtoras e profissionais liberais da Grande Florianópolis, criando oportunidades de networking e inserção no mercado.",
    partners: [
      {
        type: "Escritórios de Arquitetura",
        examples: ["Arquitetos em Florianópolis", "Estúdios de Design em São José", "Escritórios Integrados em Palhoça"],
        opportunities: "Estágios, vagas júnior, projetos freelance"
      },
      {
        type: "Construtoras e Incorporadoras",
        examples: ["Grandes construtoras da capital", "Incorporadoras regionais", "Construtoras especializadas"],
        opportunities: "Vagas em compatibilização, coordenação BIM, visualização"
      },
      {
        type: "Profissionais Liberais",
        examples: ["Arquitetos autônomos", "Designers freelancers", "Consultores BIM"],
        opportunities: "Parcerias, terceirizações, mentorias"
      }
    ],
    events: [
      "Meetups mensais de profissionais 3D",
      "Workshops com escritórios parceiros",
      "Palestras sobre mercado imobiliário local",
      "Networking events pós-curso"
    ],
    marketInsights: [
      "Tendências do mercado imobiliário catarinense",
      "Oportunidades em projetos sustentáveis",
      "Demanda por profissionais BIM em SC",
      "Freelancing vs CLT: cenário local",
      "Precificação de projetos na região"
    ]
  },
  faq: [
    {
      id: 1,
      question: "Quanto tempo leva para dominar todas as ferramentas do projetista?",
      answer: "No nosso curso presencial de 94 horas, você aprende SketchUp, AutoCAD, Revit e Enscape desde o básico até projetos profissionais em 3 meses. Workflow completo: do esboço 2D ao render fotorrealístico com IA."
    },
    {
      id: 2,
      question: "Por que fazer o curso completo ao invés de ferramentas separadas?",
      answer: "O diferencial é o workflow integrado: aprenda como SketchUp, AutoCAD, Revit e Enscape trabalham juntos em projetos reais. Economiza tempo e garante conhecimento prático de como as ferramentas se complementam profissionalmente."
    },
    {
      id: 3,
      question: "Como funciona renderização com Enscape e inteligência artificial?",
      answer: "O Enscape renderiza projetos SketchUp em tempo real (segundos vs horas). Com IA, otimizamos automaticamente iluminação, materiais e ambientação. Você aprende essas técnicas avançadas no nosso curso."
    },
    {
      id: 4,
      question: "Preciso saber AutoCAD para fazer curso de projetista 3D?",
      answer: "Não é obrigatório. O SketchUp é mais intuitivo que AutoCAD para modelagem 3D. Começamos do zero e em 56 horas você estará criando projetos arquitetônicos completos."
    },
    {
      id: 5,
      question: "Quanto ganha um projetista 3D em Santa Catarina?",
      answer: "Projetistas 3D em SC ganham entre R$ 2.500-6.000. Com SketchUp + Enscape, profissionais freelancers cobram R$ 150-300 por projeto renderizado. Nosso curso prepara você para esse mercado."
    },
    {
      id: 6,
      question: "Existe curso SketchUp certificado em Florianópolis?",
      answer: "Sim! Nossa escola em São José (Grande Florianópolis) oferece certificado nacional reconhecido. Somos a única escola em SC com curso presencial de SketchUp + Enscape + IA."
    },
    {
      id: 7,
      question: "Posso trabalhar como projetista freelancer após o curso?",
      answer: "Absolutamente! Ensinamos desde modelagem até precificação de projetos. Muitos alunos começam freelances ainda durante o curso. O mercado de projetos 3D está aquecido em SC."
    },
    {
      id: 8,
      question: "O que está incluído no curso projetista 3D completo?",
      answer: "94 horas de aulas práticas, material didático completo de 4 módulos, certificado nacional, suporte pós-curso e acesso aos softwares SketchUp Pro, AutoCAD, Revit e Enscape durante as aulas."
    }
  ],
  themeColors: {
    primary: "#FF6B35",
    secondary: "#F7931E",
    accent: "#FFD23F",
    gradient: {
      from: "#FF6B35",
      to: "#F7931E"
    }
  },
  seoMeta: {
    title: "Curso Projetista 3D Completo São José SC | SketchUp AutoCAD Revit Enscape | Escola Habilidade",
    description: "Formação Completa Projetista 3D: SketchUp + AutoCAD + Revit + Enscape com IA em São José SC. 94h presenciais, do esboço ao render. Certificado reconhecido.",
    keywords: ["curso projetista 3d", "curso sketchup", "curso autocad", "curso revit", "curso enscape", "projetista 3d são josé", "sketchup autocad revit", "formação completa projetista", "curso bim santa catarina"],
    ogImage: "/og-images/projetista-3d.jpg",
    ogType: "website"
  }
};
const edicaoVideo = {
  basicInfo: {
    id: "edicao-video-008",
    title: "Edição de Vídeo",
    slug: "edicao-video",
    shortDescription: "Domine Adobe Premiere Pro CC e After Effects CC para criar vídeos profissionais e motion graphics.",
    longDescription: "Aprenda edição de vídeo profissional do zero ao avançado. Domine Adobe Premiere Pro CC e After Effects CC para se tornar um editor completo e requisitado no mercado audiovisual.",
    category: "Audiovisual",
    level: "Intermediário",
    duration: "48 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 2 módulos",
      "Apostilas com projetos práticos e exercícios",
      "Referência permanente para consulta profissional",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Adobe Premiere Pro CC",
      description: "Edição profissional de vídeos com o software líder do mercado",
      duration: "27 horas",
      lessons: [
        { id: 1, title: "Introdução ao programa", duration: "90 min", type: "video" },
        { id: 2, title: "Ferramentas básicas de edição", duration: "90 min", type: "video" },
        { id: 3, title: "Transições de vídeo e adicionando texto", duration: "90 min", type: "video" },
        { id: 4, title: "Transição Swish e Keyframes", duration: "90 min", type: "video" },
        { id: 5, title: "Efeitos de vídeo", duration: "90 min", type: "video" },
        { id: 6, title: "Transição RGB, Transições e Efeitos de áudio", duration: "90 min", type: "video" },
        { id: 7, title: "Animação", duration: "90 min", type: "video" },
        { id: 8, title: "Criando Lower Thirds (redes sociais e nome)", duration: "90 min", type: "video" },
        { id: 9, title: "Criar intro para os vídeos", duration: "90 min", type: "video" },
        { id: 10, title: "Frame Hold e bordas desfocadas", duration: "90 min", type: "video" },
        { id: 11, title: "Smooth Transitions e Glitchs", duration: "90 min", type: "video" },
        { id: 12, title: "Vídeo em preto e branco e efeito Fisheye", duration: "90 min", type: "video" },
        { id: 13, title: "Transição usando pessoas e acelerar, desacelerar e reverter vídeos", duration: "90 min", type: "video" },
        { id: 14, title: "Efeito Flash", duration: "90 min", type: "video" },
        { id: 15, title: "Efeito mágica", duration: "90 min", type: "video" },
        { id: 16, title: "Correção de cor, predefinições e adicionando Luts", duration: "90 min", type: "video" },
        { id: 17, title: "Adicionar créditos a partir de gráficos essenciais", duration: "90 min", type: "video" },
        { id: 18, title: "Renderizar projeto", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Adobe After Effects CC",
      description: "Motion graphics e efeitos visuais cinematográficos",
      duration: "21 horas",
      lessons: [
        { id: 19, title: "Workspace e Composições", duration: "90 min", type: "video" },
        { id: 20, title: "Background e Composição", duration: "90 min", type: "video" },
        { id: 21, title: "Máscara", duration: "90 min", type: "video" },
        { id: 22, title: "Correção de cores", duration: "90 min", type: "video" },
        { id: 23, title: "Controles de câmera", duration: "90 min", type: "video" },
        { id: 24, title: "Sincronização e efeitos de áudio", duration: "90 min", type: "video" },
        { id: 25, title: "Efeitos", duration: "90 min", type: "video" },
        { id: 26, title: "Efeito de revelação de texto", duration: "90 min", type: "video" },
        { id: 27, title: "Finalizando o projeto e renderizando", duration: "90 min", type: "video" },
        { id: 28, title: "Processo de sincronização de vídeos", duration: "90 min", type: "video" },
        { id: 29, title: "Transição suave (Zoom)", duration: "90 min", type: "video" },
        { id: 30, title: "Editor gráfico de efeitos", duration: "90 min", type: "video" },
        { id: 31, title: "Transições e Ancoragem", duration: "90 min", type: "video" },
        { id: 32, title: "Projeto Final", duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Vídeos profissionais",
        description: "Crie vídeos cinematográficos e motion graphics de padrão internacional"
      },
      {
        icon: "TrendUp",
        title: "Mercado crescente",
        description: "Editores de vídeo estão entre os profissionais mais procurados"
      },
      {
        icon: "Users",
        title: "YouTube e redes sociais",
        description: "Domine criação de conteúdo para todas as plataformas digitais"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Premiere Básico",
        description: "Fundamentos de edição e ferramentas essenciais",
        icon: "House"
      },
      {
        number: 2,
        title: "Premiere Avançado",
        description: "Efeitos, transições e correção de cor profissional",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "After Effects",
        description: "Motion graphics e efeitos visuais cinematográficos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Editor Profissional",
        description: "Portfolio completo e projetos comerciais",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Adobe Premiere Pro CC: edição profissional completa",
    "Adobe After Effects CC: motion graphics e VFX",
    "Técnicas avançadas de transições e efeitos",
    "Correção de cor e gradação cinematográfica",
    "Criação de intros, vinhetas e lower thirds",
    "Sincronização perfeita de áudio e vídeo",
    "Efeitos visuais e composição profissional",
    "Workflow otimizado para YouTube e redes sociais",
    "Renderização e exportação em múltiplos formatos",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "16GB de RAM (mínimo 8GB)",
    "Placa de vídeo dedicada (recomendado)",
    "Adobe Creative Cloud (Premiere + After Effects)",
    "SSD com 100GB livres",
    "Conhecimentos básicos de informática"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 447,
    discount: 44,
    installments: {
      max: 12,
      value: 44.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Mariana Costa",
    bio: "Editora de vídeo e motion designer com mais de 10 anos de experiência. Trabalhou para grandes marcas e canais do YouTube com milhões de seguidores.",
    photo: "/instructors/mariana-costa.jpg",
    experience: "10 anos",
    credentials: [
      "Especialista em Adobe Creative Suite",
      "Certificação Adobe Premiere Pro Expert",
      "Motion Designer profissional",
      "Editora oficial do YouTube Creators",
      "Mais de 1.000 vídeos editados"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Pedro Henrique Silva",
      role: "YouTuber",
      photo: "/testimonials/pedro-henrique.jpg",
      rating: 5,
      text: "Meu canal cresceu de 10K para 500K inscritos após aplicar as técnicas do curso!",
      result: "Canal com 500K inscritos"
    },
    {
      id: 2,
      name: "Isabela Rodrigues",
      role: "Editora Freelancer",
      photo: "/testimonials/isabela-rodrigues.jpg",
      rating: 5,
      text: "Me tornei freelancer e agora ganho R$ 8.000/mês editando vídeos para empresas.",
      result: "Renda de R$ 8.000/mês"
    },
    {
      id: 3,
      name: "Lucas Ferreira",
      role: "Motion Designer",
      photo: "/testimonials/lucas-ferreira.jpg",
      rating: 5,
      text: "Consegui trabalho em produtora de TV logo após terminar o curso. After Effects mudou minha vida!",
      result: "Emprego em produtora de TV"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Quais softwares serão utilizados no curso?",
      answer: "Adobe Premiere Pro CC e After Effects CC. Orientamos sobre licenciamento e oferecemos alternativas para prática."
    },
    {
      id: 2,
      question: "Funciona para iniciantes completos em edição?",
      answer: "Sim! Começamos do absoluto zero, ensinando desde os fundamentos até edições cinematográficas profissionais."
    },
    {
      id: 3,
      question: "Vou conseguir trabalhar como editor após o curso?",
      answer: "Sim! Muitos alunos conseguem trabalho em 3-6 meses. Ensinamos portfolio, precificação e como conseguir clientes."
    },
    {
      id: 4,
      question: "O curso serve para YouTube e redes sociais?",
      answer: "Perfeitamente! Ensinamos formatos específicos para YouTube, Instagram, TikTok e outras plataformas."
    }
  ],
  themeColors: {
    primary: "#E91E63",
    secondary: "#9C27B0",
    accent: "#FF4081",
    gradient: {
      from: "#E91E63",
      to: "#9C27B0"
    }
  },
  seoMeta: {
    title: "Curso de Edição de Vídeo Florianópolis - Adobe Premiere Pro e After Effects - Escola Habilidade",
    description: "Curso profissional de edição de vídeo em Florianópolis e São José SC. Aprenda Premiere Pro CC e After Effects CC com certificado reconhecido. Material didático incluso, aulas presenciais e online.",
    keywords: ["curso edição de vídeo florianópolis", "premiere pro são josé", "after effects grande florianópolis", "curso adobe premiere", "edição profissional vídeo SC", "escola técnica audiovisual"],
    ogImage: "/og-images/edicao-video.jpg",
    ogType: "website"
  }
};
const administracao = {
  basicInfo: {
    id: "administracao-009",
    title: "Administração",
    slug: "administracao",
    shortDescription: "Curso completo de administração com Windows 11, Office completo, Matemática Financeira, Departamento Pessoal e Liderança.",
    longDescription: "Domine as ferramentas essenciais para administração moderna. Aprenda Windows 11, Office completo (Word, Excel, PowerPoint), Matemática Financeira, Departamento Pessoal, Crédito & Cobrança e Liderança Eficaz. 9 módulos completos para formação administrativa completa.",
    category: "Negócios",
    level: "Iniciante",
    duration: "153 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso de todos os 9 módulos",
      "Apostilas detalhadas com exercícios práticos",
      "Referência permanente para estudos administrativos",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Windows 11",
      description: "Sistema operacional moderno para administração",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "Introdução ao Windows 11", duration: "90 min", type: "video" },
        { id: 2, title: "Aplicativos Parte I", duration: "90 min", type: "video" },
        { id: 3, title: "Microsoft Edge", duration: "90 min", type: "video" },
        { id: 4, title: "Explorador de Arquivos Parte I", duration: "90 min", type: "video" },
        { id: 5, title: "Explorador de Arquivos Parte II", duration: "90 min", type: "video" },
        { id: 6, title: "Personalizando o Sistema", duration: "90 min", type: "video" },
        { id: 7, title: "Acessibilidade Parte I", duration: "90 min", type: "video" },
        { id: 8, title: "Aplicativos Parte II", duration: "90 min", type: "video" },
        { id: 9, title: "Aplicativos Parte III", duration: "90 min", type: "video" },
        { id: 10, title: "Aplicativos Parte IV", duration: "90 min", type: "video" },
        { id: 11, title: "Barra de Tarefas", duration: "90 min", type: "video" },
        { id: 12, title: "Acessibilidade Parte II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Word Fundamental",
      description: "Processamento de texto para documentos administrativos",
      duration: "21 horas",
      lessons: [
        { id: 13, title: "Introdução ao word 2019", duration: "90 min", type: "video" },
        { id: 14, title: "Iniciando um documento", duration: "90 min", type: "video" },
        { id: 15, title: "Formatando texto e utilização da nova Ferramenta de Aprendizagem", duration: "90 min", type: "video" },
        { id: 16, title: "Inserção de tabelas e ícones SVGs", duration: "90 min", type: "video" },
        { id: 17, title: "Inserção de elementos gráficos I", duration: "90 min", type: "video" },
        { id: 18, title: "Inserção de elementos gráficos e imagens 3D", duration: "90 min", type: "video" },
        { id: 19, title: "Criação de estruturas de texto I", duration: "90 min", type: "video" },
        { id: 20, title: "Criação de estruturas de texto II", duration: "90 min", type: "video" },
        { id: 21, title: "Inserção de elementos de texto e nova sintaxe LaTeX", duration: "90 min", type: "video" },
        { id: 22, title: "Layout da página", duration: "90 min", type: "video" },
        { id: 23, title: "Design", duration: "90 min", type: "video" },
        { id: 24, title: "Revisão", duration: "90 min", type: "video" },
        { id: 25, title: "Armazenamento e compartilhamento", duration: "90 min", type: "video" },
        { id: 26, title: "Impressão", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Excel Fundamental",
      description: "Planilhas eletrônicas para gestão administrativa",
      duration: "27 horas",
      lessons: [
        { id: 27, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 28, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 29, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 30, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 31, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 32, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 33, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 34, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 35, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 36, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 37, title: "Funções De Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 38, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 39, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 40, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 41, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 42, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 43, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 44, title: "Configurações, auditoria e exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Excel Avançado",
      description: "Análise avançada de dados administrativos",
      duration: "19,5 horas",
      lessons: [
        { id: 45, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 46, title: "Funções De Texto", duration: "90 min", type: "video" },
        { id: 47, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 48, title: "Funções de Matemática, Trigonometria e Funções de Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 49, title: "Funções de Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 50, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 51, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 52, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 53, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 54, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 55, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 56, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 57, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "Matemática Financeira",
      description: "Gestão financeira com HP12C e conceitos aplicados",
      duration: "19,5 horas",
      lessons: [
        { id: 58, title: "Introdução ao uso da HP12C", duration: "90 min", type: "video" },
        { id: 59, title: "Conhecendo a Calculadora", duration: "90 min", type: "video" },
        { id: 60, title: "Configurando a Calculadora", duration: "90 min", type: "video" },
        { id: 61, title: "Registradores, Funções e Códigos de Erros", duration: "90 min", type: "video" },
        { id: 62, title: "Introdução à Mat.Finaceira e Diagrama de Fluxo", duration: "90 min", type: "video" },
        { id: 63, title: "Juros Simples e Juros Compostos", duration: "90 min", type: "video" },
        { id: 64, title: "Séries Uniformes, Não-Uniformes e Amortização", duration: "90 min", type: "video" },
        { id: 65, title: "Taxas de Juros e Descontos", duration: "90 min", type: "video" },
        { id: 66, title: "Gestão de Custo e Formação de Preço", duration: "90 min", type: "video" },
        { id: 67, title: "Mercados Financeiros", duration: "90 min", type: "video" },
        { id: 68, title: "Estatística – I", duration: "90 min", type: "video" },
        { id: 69, title: "Estatística – II", duration: "90 min", type: "video" },
        { id: 70, title: "Noções Básicas de Contabilidade", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Power Point",
      description: "Apresentações profissionais para administração",
      duration: "18 horas",
      lessons: [
        { id: 71, title: "Introdução ao Power Point 2019", duration: "90 min", type: "video" },
        { id: 72, title: "Ferramentas", duration: "90 min", type: "video" },
        { id: 73, title: "Iniciando uma apresentação", duration: "90 min", type: "video" },
        { id: 74, title: "Texto", duration: "90 min", type: "video" },
        { id: 75, title: "Layout de slide", duration: "90 min", type: "video" },
        { id: 76, title: "Elementos gráficos I", duration: "90 min", type: "video" },
        { id: 77, title: "Elementos gráficos II", duration: "90 min", type: "video" },
        { id: 78, title: "Multimídia", duration: "90 min", type: "video" },
        { id: 79, title: "Transições", duration: "90 min", type: "video" },
        { id: 80, title: "Testes de apresentação", duration: "90 min", type: "video" },
        { id: 81, title: "Revisão", duration: "90 min", type: "video" },
        { id: 82, title: "Projeto", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 7,
      title: "Departamento Pessoal",
      description: "Gestão de pessoas e folha de pagamento",
      duration: "13,5 horas",
      lessons: [
        { id: 83, title: "Conceitos Gerais", duration: "90 min", type: "video" },
        { id: 84, title: "Importância do DP", duration: "90 min", type: "video" },
        { id: 85, title: "Seguridade Social", duration: "90 min", type: "video" },
        { id: 86, title: "Remuneração", duration: "90 min", type: "video" },
        { id: 87, title: "Pagamentos e Descontos 1", duration: "90 min", type: "video" },
        { id: 88, title: "Pagamentos e Descontos 2", duration: "90 min", type: "video" },
        { id: 89, title: "Jornada de Trabalho 1", duration: "90 min", type: "video" },
        { id: 90, title: "Jornada de trabalho 2", duration: "90 min", type: "video" },
        { id: 91, title: "Rescisão de Contrato de Trabalho", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 8,
      title: "Crédito, Cobrança e Atendimento",
      description: "Gestão financeira e relacionamento com clientes",
      duration: "9 horas",
      lessons: [
        { id: 92, title: "Operações de Crédito – Financiamento", duration: "90 min", type: "video" },
        { id: 93, title: "Operações de Crédito – Empréstimos", duration: "90 min", type: "video" },
        { id: 94, title: "Análise de Crédito", duration: "90 min", type: "video" },
        { id: 95, title: "Limites de Crédito", duration: "90 min", type: "video" },
        { id: 96, title: "Políticas de Crédito e Cobrança", duration: "90 min", type: "video" },
        { id: 97, title: "Atendimento de Cobrança", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 9,
      title: "Liderança Eficaz",
      description: "Desenvolvimento de competências de liderança",
      duration: "7,5 horas",
      lessons: [
        { id: 98, title: "Objetivos da Liderança", duration: "90 min", type: "video" },
        { id: 99, title: "Comunicação e Empatia", duration: "90 min", type: "video" },
        { id: 100, title: "Liderança x Chefia", duration: "90 min", type: "video" },
        { id: 101, title: "Responsabilidade pelos erros", duration: "90 min", type: "video" },
        { id: 102, title: "Delegando e formando sucessores", duration: "90 min", type: "video" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Formação administrativa completa",
        description: "Do operacional ao estratégico: todas as ferramentas para administrar com excelência"
      },
      {
        icon: "TrendUp",
        title: "Mercado sempre demandando",
        description: "Administradores são essenciais em qualquer empresa - área com demanda constante"
      },
      {
        icon: "Users",
        title: "Múltiplas oportunidades",
        description: "Trabalhe em empresas, seja freelancer ou empreenda com conhecimento sólido"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Windows 11 e Office para administração moderna",
        icon: "House"
      },
      {
        number: 2,
        title: "Análise",
        description: "Excel avançado e matemática financeira para decisões estratégicas",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Gestão",
        description: "Departamento pessoal, crédito & cobrança para gestão completa",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Liderança",
        description: "Desenvolva competências de liderança e gerencie equipes",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Windows 11: produtividade total em administração",
    "Office completo: Word, Excel e PowerPoint profissionais",
    "Excel Fundamental e Avançado com análise de dados",
    "Matemática Financeira com HP12C",
    "Departamento Pessoal e gestão de pessoas",
    "Crédito, Cobrança e Atendimento ao cliente",
    "Liderança Eficaz e gestão de equipes",
    "Contabilidade básica e controles financeiros",
    "Apresentações executivas e relatórios",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou superior",
    "8GB de RAM (recomendado)",
    "Conexão estável com internet",
    "Microsoft Office (orientações de licenciamento)",
    "Calculadora HP12C (orientações de aquisição)",
    "Vontade de aprender gestão administrativa"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Equipe de Instrutores em Administração",
    bio: "Nossa equipe é formada por administradores, contadores e especialistas em gestão com mais de 15 anos de experiência em ensino e prática empresarial.",
    photo: "/instructors/team-administracao.jpg",
    experience: "15+ anos",
    credentials: [
      "Graduação em Administração e Contabilidade",
      "Certificação Microsoft Office Specialist",
      "Especialização em Gestão de Pessoas",
      "Experiência em Departamento Pessoal",
      "Matemática Financeira Aplicada"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Sandra Oliveira",
      role: "Assistente Administrativa",
      photo: "/testimonials/sandra-oliveira.jpg",
      rating: 5,
      text: "Estava desempregada há 2 anos. Com o curso completo, consegui trabalho em 3 meses! O Excel avançado foi fundamental.",
      result: "Emprego em 3 meses"
    },
    {
      id: 2,
      name: "Roberto Santos",
      role: "Supervisor Administrativo",
      photo: "/testimonials/roberto-santos.jpg",
      rating: 5,
      text: "O módulo de liderança transformou minha gestão de equipe. Recebi promoção e aumento salarial de 40%.",
      result: "Promoção e 40% aumento"
    },
    {
      id: 3,
      name: "Juliana Costa",
      role: "Analista Financeira",
      photo: "/testimonials/juliana-costa.jpg",
      rating: 5,
      text: "Matemática financeira e Excel avançado me deram base para trabalhar no mercado financeiro. Hoje ganho R$ 6.000/mês.",
      result: "Renda de R$ 6.000/mês"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "É adequado para quem não tem experiência em administração?",
      answer: "Sim! Começamos do básico com Windows 11 e evoluímos gradualmente até gestão avançada. Perfeito para iniciantes."
    },
    {
      id: 2,
      question: "Preciso ter a calculadora HP12C?",
      answer: "Oferecemos orientações de aquisição. Durante o curso você pode usar simuladores online até adquirir a sua."
    },
    {
      id: 3,
      question: "O curso prepara para qual tipo de trabalho?",
      answer: "Assistente/Analista Administrativo, Departamento Pessoal, Financeiro, Atendimento, Supervisão e gestão de equipes."
    },
    {
      id: 4,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 9 módulos incluso sem custo adicional."
    }
  ],
  themeColors: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    gradient: {
      from: "#6366F1",
      to: "#8B5CF6"
    }
  },
  seoMeta: {
    title: "Curso de Administração Completo - Escola Habilidade | Office, DP, Matemática Financeira - Material Incluso",
    description: "Curso completo de Administração: Windows 11, Office, Excel Avançado, Matemática Financeira, DP, Liderança. 153 horas, apostilas inclusas, modalidades presencial e online.",
    keywords: ["administração completa", "office", "excel avançado", "departamento pessoal", "matemática financeira", "liderança", "apostilas inclusas"],
    ogImage: "/og-images/administracao.jpg",
    ogType: "website"
  }
};
const COURSES_DATA = [
  informatica,
  // 1. Informática (8 módulos) ✅ CORRIGIDO
  designGrafico,
  // 2. Design Gráfico (5 módulos) ✅ CORRIGIDO
  programacao,
  // 3. Programação (6 módulos) ✅ CORRIGIDO
  marketingDigital,
  // 4. Marketing Digital (6 módulos) ✅ CORRIGIDO
  inteligenciaArtificial,
  // 5. Inteligência Artificial (6 módulos) ✅ CORRIGIDO
  businessIntelligence,
  // 6. Business Intelligence (4 módulos) ✅ CORRIGIDO
  projetista,
  // 7. Projetista (2 módulos) ✅ ADICIONADO
  edicaoVideo,
  // 8. Edição de Vídeo (2 módulos) ✅ ADICIONADO
  administracao
  // 9. Administração (9 módulos) ✅ ADICIONADO
];
const BlogBadge = ({
  children,
  variant = "category",
  size = "medium",
  categorySlug,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseClasses = "inline-flex items-center gap-1 font-medium rounded-full border transition-all duration-300";
  const categoryColors = {
    "tecnologia": "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
    "educacao": "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
    "carreira": "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
    "design": "bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30",
    "programacao": "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30",
    "marketing": "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
    "ia": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30",
    "bi": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30"
  };
  const variants = {
    category: categorySlug ? categoryColors[categorySlug] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/30" : "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    tag: "bg-zinc-700/50 text-zinc-400 border-zinc-600/50 hover:bg-zinc-600/50 hover:text-zinc-300",
    status: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30",
    featured: "bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30",
    new: "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
    premium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30"
  };
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base"
  };
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();
  return /* @__PURE__ */ jsxs("span", { className: classes, ...props, children: [
    Icon && /* @__PURE__ */ jsx(Icon, { size: size === "small" ? 12 : size === "large" ? 16 : 14 }),
    children
  ] });
};
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(" ").length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
};
const formatDate = (dateString) => {
  if (!dateString) return "Data não disponível";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  const now = /* @__PURE__ */ new Date();
  const diffInDays = Math.floor((now - date) / (1e3 * 60 * 60 * 24));
  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  return lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) + "..." : truncated + "...";
};
const BlogCard = ({ post, variant = "standard", index = 0 }) => {
  var _a;
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    isInView: false
  });
  const [isPrefetched, setIsPrefetched] = useState(false);
  const cardRef = useRef(null);
  const prefetchTimeoutRef = useRef(null);
  const imageRef = useRef(null);
  const prefetchPost = usePrefetchPost();
  const { getTypographyClasses, shouldUseAnimations } = useBlogResponsive();
  const getImageSrc = () => {
    if (post.featured_image_url && post.featured_image_url !== null) return post.featured_image_url;
    if (post.featuredImage && typeof post.featuredImage === "object" && post.featuredImage.url) return post.featuredImage.url;
    if (post.featuredImage && typeof post.featuredImage === "string") return post.featuredImage;
    if (post.imageUrl && post.imageUrl !== null) return post.imageUrl;
    return null;
  };
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageState((prev) => ({ ...prev, isInView: true }));
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px"
      }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleImageLoad = () => {
    setImageState((prev) => ({ ...prev, loaded: true, error: false }));
  };
  const handleImageError = () => {
    setImageState((prev) => ({ ...prev, error: true, loaded: true }));
  };
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.publishedAt || post.created_at || post.published_at);
  const excerpt = truncateText(post.excerpt || post.content, 150);
  const primaryCategory = ((_a = post.categories) == null ? void 0 : _a[0]) || post.category;
  const categorySlug = (primaryCategory == null ? void 0 : primaryCategory.slug) || "tecnologia";
  const categoryName = (primaryCategory == null ? void 0 : primaryCategory.name) || "Tecnologia";
  const imageSrc = getImageSrc();
  const EnhancedPlaceholder = () => {
    const categoryGradients = {
      "tecnologia": "from-blue-600/30 via-purple-600/25 to-cyan-600/30",
      "programacao": "from-purple-600/30 via-blue-600/25 to-indigo-600/30",
      "educacao": "from-green-600/30 via-emerald-600/25 to-teal-600/30",
      "carreira": "from-orange-600/30 via-yellow-600/25 to-amber-600/30",
      "design": "from-pink-600/30 via-rose-600/25 to-red-600/30",
      "arquitetura": "from-cyan-600/30 via-teal-600/25 to-blue-600/30"
    };
    const gradient = categoryGradients[categorySlug] || categoryGradients.tecnologia;
    return /* @__PURE__ */ jsxs("div", { className: `w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`, children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 w-8 h-8 border border-purple-300/30 rounded-full animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 right-8 w-6 h-6 border border-blue-300/30 rounded-full animate-pulse delay-1000" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-12 w-4 h-4 border border-pink-300/30 rounded-full animate-pulse delay-500" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/3 left-12 w-5 h-5 border border-green-300/30 rounded-full animate-pulse delay-700" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center text-zinc-300 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-4 opacity-70 transform group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-full h-full", children: /* @__PURE__ */ jsx("path", { d: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-base font-semibold opacity-90 mb-2", children: categoryName }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-1.5 bg-gradient-to-r from-purple-400/60 to-blue-400/60 rounded-full" }) })
      ] })
    ] });
  };
  const handleMouseEnter = () => {
    if (!isPrefetched && post.slug) {
      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchPost(post.slug);
        setIsPrefetched(true);
      }, 200);
    }
  };
  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
      prefetchTimeoutRef.current = null;
    }
  };
  React.useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const animationClasses = shouldUseAnimations() ? getAnimationClasses("fade") : "";
  const variantStyles = {
    standard: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50",
    featured: "blog-card-featured border-2 border-purple-500/20",
    compact: "bg-zinc-800/40 border border-zinc-700/40"
  };
  const cardClasses = combineClasses(
    "group rounded-xl overflow-hidden transition-all duration-500 ease-out",
    isMobile ? "active:border-purple-500/50 active:shadow-lg active:shadow-purple-500/10 active:scale-[0.98]" : "hover:border-purple-500/50 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer",
    !isMobile && "hover:ring-1 hover:ring-purple-500/20",
    variantStyles[variant],
    animationClasses
  );
  const handleCardClick = (e) => {
    if (e.target.tagName === "A") {
      return;
    }
    if (post.slug) {
      window.location.href = `/blog/${post.slug}`;
    }
  };
  return /* @__PURE__ */ jsx(
    "article",
    {
      ref: cardRef,
      className: cardClasses,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleCardClick,
      style: { cursor: "pointer" },
      children: /* @__PURE__ */ jsxs("div", { className: "block w-full h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: `relative bg-zinc-700/50 overflow-hidden ${isMobile ? "h-40" : "h-48"} pointer-events-none`, children: [
          imageSrc ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                ref: imageRef,
                src: imageSrc,
                alt: post.title,
                className: `w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageState.loaded ? "opacity-100" : "opacity-0"}`,
                onLoad: handleImageLoad,
                onError: handleImageError,
                loading: "lazy"
              }
            ),
            (!imageState.loaded || imageState.error) && /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsx(EnhancedPlaceholder, {}) }),
            !imageState.loaded && !imageState.error && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-zinc-800/50", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" }) })
          ] }) : /* @__PURE__ */ jsx(EnhancedPlaceholder, {}),
          primaryCategory && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-10", children: /* @__PURE__ */ jsx(
            BlogBadge,
            {
              variant: "category",
              categorySlug,
              size: "small",
              icon: Tag,
              children: categoryName
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-10", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium", children: [
            /* @__PURE__ */ jsx(Clock, { size: 12 }),
            readingTime,
            " min"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${isMobile ? "p-4" : "p-6"} pointer-events-none`, children: [
          /* @__PURE__ */ jsx("h2", { className: combineClasses(
            "font-bold text-zinc-100 mb-3 line-clamp-2 group-hover:text-purple-300 transition-all duration-300 transform group-hover:translate-x-1",
            getTypographyClasses("title")
          ), children: post.title }),
          excerpt && /* @__PURE__ */ jsx("p", { className: combineClasses(
            "text-zinc-400 mb-4 line-clamp-3 leading-relaxed",
            getTypographyClasses("body")
          ), children: excerpt }),
          /* @__PURE__ */ jsxs("div", { className: `text-xs text-zinc-500 ${isMobile ? "space-y-2" : "flex items-center justify-between"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isMobile ? "justify-between" : "gap-4"}`, children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 hover:text-zinc-400 transition-colors", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 12, className: "group-hover:text-purple-400 transition-colors" }),
                formattedDate
              ] }),
              post.author_name && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 hover:text-zinc-400 transition-colors", children: [
                /* @__PURE__ */ jsx(User, { size: 12, className: "group-hover:text-purple-400 transition-colors" }),
                post.author_name
              ] })
            ] }),
            post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-zinc-600 group-hover:text-zinc-500 transition-colors px-2 py-1 bg-zinc-800/50 rounded-full", children: [
              "+",
              post.tags.length,
              " tags"
            ] })
          ] }),
          post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-3 -mb-1", children: [
            post.tags.slice(0, 3).map((tag, tagIndex) => /* @__PURE__ */ jsxs(
              "span",
              {
                className: "inline-block px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded text-xs hover:bg-zinc-600/50 transition-colors",
                children: [
                  "#",
                  tag
                ]
              },
              tagIndex
            )),
            post.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "inline-block px-2 py-1 bg-zinc-700/50 text-zinc-500 rounded text-xs", children: [
              "+",
              post.tags.length - 3
            ] })
          ] })
        ] })
      ] })
    }
  );
};
const SEOHead = ({
  title = "Escola Habilidade",
  description = "Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.",
  keywords = "",
  path = "",
  image = null,
  author = "Escola Habilidade",
  type = "website",
  publishedDate = null,
  modifiedDate = null,
  noindex = false,
  canonical = null,
  schemaData = null,
  breadcrumbs = null,
  faqData = null,
  courseData = null,
  localBusinessData = null
}) => {
  const safeTitle = String(title || "Escola Habilidade");
  const safeDescription = String(description || "Desenvolva suas habilidades com cursos de tecnologia, design e negócios. Educação de qualidade para o mercado digital.");
  const safeKeywords = keywords ? String(keywords).trim() : "";
  const safeAuthor = String(author || "Escola Habilidade");
  const baseUrl = process.env.NODE_ENV === "production" ? "https://www.escolahabilidade.com" : "http://localhost:5173";
  const fullUrl = `${baseUrl}${path}`;
  const canonicalUrl = canonical || fullUrl;
  const defaultImage = `${baseUrl}/assets/logos/original/logo-original.png`;
  const ogImage = image || defaultImage;
  const generateSchemaData = () => {
    const schemas = [];
    if (schemaData) {
      schemas.push(schemaData);
    } else {
      const baseSchema = {
        "@context": "https://schema.org",
        "@type": type === "article" ? "Article" : "WebPage",
        name: safeTitle,
        description: safeDescription,
        url: fullUrl,
        image: ogImage,
        author: {
          "@type": "Organization",
          name: "Escola Habilidade",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: defaultImage
          }
        },
        publisher: {
          "@type": "Organization",
          name: "Escola Habilidade",
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: defaultImage
          }
        }
      };
      if (type === "article") {
        baseSchema.headline = safeTitle;
        baseSchema.datePublished = publishedDate;
        baseSchema.dateModified = modifiedDate || publishedDate;
        baseSchema.mainEntityOfPage = {
          "@type": "WebPage",
          "@id": fullUrl
        };
      }
      schemas.push(baseSchema);
    }
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.path}`
        }))
      });
    }
    if (faqData && faqData.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      });
    }
    if (courseData) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseData.name,
        description: courseData.description,
        provider: {
          "@type": "EducationalOrganization",
          name: "Escola Habilidade"
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: courseData.mode || "https://schema.org/MixedEventAttendanceMode",
          courseWorkload: courseData.workload || "PT40H"
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "BRL",
          category: "EducationalOccupationalCredential"
        }
      });
    }
    if (localBusinessData) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: localBusinessData.name || "Escola Habilidade",
        description: localBusinessData.description,
        address: localBusinessData.address,
        telephone: localBusinessData.telephone,
        areaServed: localBusinessData.areaServed,
        openingHours: localBusinessData.openingHours
      });
    }
    return schemas.length === 1 ? schemas[0] : schemas;
  };
  const keywordsMeta = safeKeywords ? /* @__PURE__ */ jsx("meta", { name: "keywords", content: safeKeywords }) : null;
  const robotsMeta = noindex ? /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }) : null;
  const articleMetas = [];
  if (type === "article" && publishedDate) {
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:published_time", content: publishedDate }, "published"));
    if (modifiedDate) {
      articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: modifiedDate }, "modified"));
    }
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:author", content: safeAuthor }, "author"));
    articleMetas.push(/* @__PURE__ */ jsx("meta", { property: "article:section", content: "Blog" }, "section"));
  }
  return /* @__PURE__ */ jsxs(Helmet, { children: [
    /* @__PURE__ */ jsx("title", { children: safeTitle }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: safeDescription }),
    keywordsMeta,
    /* @__PURE__ */ jsx("meta", { name: "author", content: safeAuthor }),
    /* @__PURE__ */ jsx("link", { rel: "canonical", href: canonicalUrl }),
    robotsMeta,
    /* @__PURE__ */ jsx("meta", { property: "og:type", content: type }),
    /* @__PURE__ */ jsx("meta", { property: "og:title", content: safeTitle }),
    /* @__PURE__ */ jsx("meta", { property: "og:description", content: safeDescription }),
    /* @__PURE__ */ jsx("meta", { property: "og:url", content: fullUrl }),
    /* @__PURE__ */ jsx("meta", { property: "og:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
    /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
    /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Escola Habilidade" }),
    /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "pt_BR" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: safeTitle }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: safeDescription }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: ogImage }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@escolahabilidade" }),
    /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@escolahabilidade" }),
    articleMetas,
    /* @__PURE__ */ jsx("meta", { name: "format-detection", content: "telephone=no" }),
    /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#d400ff" }),
    /* @__PURE__ */ jsx("meta", { name: "mobile-web-app-capable", content: "yes" }),
    /* @__PURE__ */ jsx("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
    /* @__PURE__ */ jsx("meta", { name: "apple-mobile-web-app-status-bar-style", content: "default" }),
    /* @__PURE__ */ jsx("meta", { name: "msapplication-TileColor", content: "#d400ff" }),
    /* @__PURE__ */ jsx("link", { rel: "preload", href: "/assets/logos/original/logo-original.png", as: "image" }),
    /* @__PURE__ */ jsx("meta", { name: "referrer", content: "strict-origin-when-cross-origin" }),
    /* @__PURE__ */ jsx("meta", { httpEquiv: "content-language", content: "pt-br" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.region", content: "BR-SC" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.placename", content: "Florianópolis, Santa Catarina, Brasil" }),
    /* @__PURE__ */ jsx("meta", { name: "geo.position", content: "-27.5858;-48.6117" }),
    /* @__PURE__ */ jsx("meta", { name: "ICBM", content: "-27.5858, -48.6117" }),
    /* @__PURE__ */ jsx("meta", { name: "revisit-after", content: "7 days" }),
    /* @__PURE__ */ jsx("meta", { name: "rating", content: "general" }),
    /* @__PURE__ */ jsx("meta", { name: "distribution", content: "global" }),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(generateSchemaData()) }
      }
    )
  ] });
};
const BlogCardSkeleton = ({ variant = "standard" }) => {
  const variantStyles = {
    standard: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50",
    featured: "border-2 border-zinc-700/50",
    compact: "bg-zinc-800/40 border border-zinc-700/40"
  };
  return /* @__PURE__ */ jsx("article", { className: `group rounded-xl overflow-hidden transition-all duration-300 ${variantStyles[variant]} animate-pulse`, children: /* @__PURE__ */ jsxs("div", { className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative bg-zinc-700/50 overflow-hidden h-48", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-zinc-600/30 to-zinc-700/30" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-zinc-600/50 rounded-full" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-16 bg-zinc-600/50 rounded-full" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-600/50 rounded mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-600/30 rounded w-3/4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/30 rounded w-2/3" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-3 w-16 bg-zinc-700/50 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-24 bg-zinc-700/50 rounded" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-12 bg-zinc-700/30 rounded" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 w-16 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-14 bg-zinc-700/30 rounded" })
      ] })
    ] })
  ] }) });
};
const SkeletonHeader = () => /* @__PURE__ */ jsxs("div", { className: "text-center mb-12 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-12 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded mx-auto mb-4 w-48" }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-700/70 rounded mx-auto w-96" }),
    /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-700/70 rounded mx-auto w-80" })
  ] })
] });
const SkeletonFilters = () => /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-4 animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 max-w-4xl mx-auto", children: [
  /* @__PURE__ */ jsx("div", { className: "flex-1 h-12 bg-zinc-800 border border-zinc-700 rounded-lg" }),
  /* @__PURE__ */ jsx("div", { className: "w-full md:w-48 h-12 bg-zinc-800 border border-zinc-700 rounded-lg" })
] }) });
const BlogLoading = () => {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx(SkeletonHeader, {}),
    /* @__PURE__ */ jsx(SkeletonFilters, {}),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: Array.from({ length: 9 }).map((_, index) => /* @__PURE__ */ jsx(BlogCardSkeleton, {}, index)) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-zinc-400", children: [
      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-zinc-400 border-t-purple-500 rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-lg", children: "Carregando artigos..." })
    ] }) })
  ] });
};
const BlogError = ({ error, onRetry }) => {
  const getErrorInfo = () => {
    const errorMessage = (error == null ? void 0 : error.message) || "Erro desconhecido";
    if (errorMessage.includes("indisponivel") || errorMessage.includes("ECONNREFUSED")) {
      return {
        title: "Servidor Temporariamente Indispon�vel",
        description: "Nosso servidor est� passando por manuten��o. Tente novamente em alguns minutos.",
        icon: "�",
        showRetry: true
      };
    }
    if (errorMessage.includes("timeout") || errorMessage.includes("rede")) {
      return {
        title: "Problema de Conex�o",
        description: "Verifique sua conex�o com a internet e tente novamente.",
        icon: "<",
        showRetry: true
      };
    }
    if (errorMessage.includes("404") || errorMessage.includes("nao encontrado")) {
      return {
        title: "Conte�do N�o Encontrado",
        description: "Os artigos que voc� est� procurando n�o foram encontrados.",
        icon: "=�",
        showRetry: false
      };
    }
    return {
      title: "Erro Inesperado",
      description: "Algo deu errado ao carregar os artigos. Tente novamente.",
      icon: "�",
      showRetry: true
    };
  };
  const errorInfo = getErrorInfo();
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(WarningCircle, { size: 48, className: "text-red-400" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: errorInfo.icon })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-100 mb-4", children: errorInfo.title }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-lg leading-relaxed mb-2", children: errorInfo.description }),
      process.env.NODE_ENV === "development" && (error == null ? void 0 : error.message) && /* @__PURE__ */ jsxs("details", { className: "mt-4 text-left", children: [
        /* @__PURE__ */ jsx("summary", { className: "text-sm text-zinc-500 cursor-pointer hover:text-zinc-400", children: "Detalhes t�cnicos" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 p-3 bg-zinc-800 rounded-lg text-xs text-zinc-400 font-mono", children: error.message })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      errorInfo.showRetry && onRetry && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onRetry,
          className: "inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(ArrowCounterClockwise, { size: 20 }),
            "Tentar Novamente"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(House, { size: 20 }),
            "Voltar ao In�cio"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-700", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "Se o problema persistir, entre em contato conosco atrav�s do",
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://wa.me/5548988559491",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-purple-400 hover:text-purple-300 underline",
          children: "WhatsApp"
        }
      )
    ] }) })
  ] }) });
};
const BlogEmpty = ({ hasFilters, onClearFilters }) => {
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-4 bg-zinc-700/30 rounded-full flex items-center justify-center", children: hasFilters ? /* @__PURE__ */ jsx(Funnel, { size: 48, className: "text-zinc-500" }) : /* @__PURE__ */ jsx(FileText, { size: 48, className: "text-zinc-500" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: hasFilters ? "🔍" : "📝" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-100 mb-4", children: hasFilters ? "Nenhum artigo encontrado" : "Ainda não temos artigos" }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-lg leading-relaxed", children: hasFilters ? "Tente ajustar os filtros para encontrar o conteúdo que você está procurando." : "Estamos trabalhando em novos conteúdos incríveis para você. Fique ligado!" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      hasFilters && onClearFilters && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onClearFilters,
          className: "inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(MagnifyingGlass, { size: 20 }),
            "Limpar Filtros"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(House, { size: 20 }),
            "Ver Cursos"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-700", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "Que tal conhecer nossos",
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "text-purple-400 hover:text-purple-300 underline",
          children: "cursos disponíveis"
        }
      ),
      " ",
      "enquanto aguarda novos artigos?"
    ] }) })
  ] }) });
};
const BlogHeader = ({ breadcrumbs = [] }) => {
  const defaultBreadcrumbs = [
    { label: "Início", href: "/", icon: House },
    { label: "Blog", href: "/blog", icon: Article }
  ];
  const allBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs];
  return /* @__PURE__ */ jsx("section", { className: "bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800/50 pt-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "mb-4", children: /* @__PURE__ */ jsx("ol", { className: "flex items-center gap-2 text-sm", children: allBreadcrumbs.map((crumb, index) => {
      const isLast = index === allBreadcrumbs.length - 1;
      const Icon = crumb.icon;
      return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
        index > 0 && /* @__PURE__ */ jsx(CaretRight, { size: 14, className: "text-zinc-600" }),
        isLast ? /* @__PURE__ */ jsxs(
          "span",
          {
            className: "flex items-center gap-1 text-zinc-400 font-medium",
            "aria-current": "page",
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { size: 16 }),
              crumb.label
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: crumb.href,
            onClick: crumb.href === "/" ? (e) => {
              e.preventDefault();
              window.location.href = "/";
            } : void 0,
            className: "flex items-center gap-1 text-zinc-300 hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm px-1 py-0.5",
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { size: 16 }),
              crumb.label
            ]
          }
        )
      ] }, index);
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Article, { size: 32, className: "text-fuchsia-400" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-1", children: "Blog" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm", children: "Artigos sobre tecnologia, educação e desenvolvimento de carreira" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-zinc-800/50", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Navegue pelas categorias ou use a busca para encontrar conteúdo específico" }) })
  ] }) });
};
const BlogLayout = ({
  children,
  title = "Blog - Escola Habilidade",
  description = "Artigos sobre tecnologia, educação e desenvolvimento de carreira",
  breadcrumbs = [],
  showBlogHeader = true,
  className = "",
  path = "/blog"
  // Add path parameter
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title,
        description,
        path,
        type: "website"
      }
    ),
    showBlogHeader && /* @__PURE__ */ jsx(BlogHeader, { breadcrumbs }),
    /* @__PURE__ */ jsx("div", { className: `py-8 ${className}`, children })
  ] });
};
const ResponsiveBlogGrid = ({
  children,
  variant = "standard",
  // standard, masonry, featured
  columns = "auto",
  // auto, 1, 2, 3, 4
  gap = "medium",
  // small, medium, large
  animation = "fade",
  // fade, slide, none
  className = "",
  ...props
}) => {
  useBlogResponsive();
  const gapSizes = {
    small: "gap-3",
    medium: "gap-6",
    large: "gap-8"
  };
  const getColumnClasses = () => {
    if (columns === "auto") {
      switch (variant) {
        case "masonry":
          return "columns-1 md:columns-2 lg:columns-3";
        case "featured":
          return "grid grid-cols-1 lg:grid-cols-3";
        default:
          return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      }
    }
    const columnMap = {
      1: "grid grid-cols-1",
      2: "grid grid-cols-1 md:grid-cols-2",
      3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    };
    return columnMap[columns] || columnMap[3];
  };
  const baseClasses = variant === "masonry" ? "blog-grid-masonry" : combineClasses(getColumnClasses(), gapSizes[gap]);
  const animationClasses = getAnimationClasses(animation);
  const gridClasses = combineClasses(
    baseClasses,
    animationClasses,
    className
  );
  if (variant === "masonry") {
    return /* @__PURE__ */ jsx("div", { className: gridClasses, ...props, children: React.Children.map(children, (child, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: combineClasses(
          "break-inside-avoid mb-6",
          animationClasses,
          getStaggeredDelay(index)
        ),
        children: child
      },
      index
    )) });
  }
  if (variant === "featured" && React.Children.count(children) > 0) {
    const childrenArray = React.Children.toArray(children);
    const featuredPost = childrenArray[0];
    const remainingPosts = childrenArray.slice(1);
    return /* @__PURE__ */ jsxs("div", { className: combineClasses("space-y-8", className), ...props, children: [
      /* @__PURE__ */ jsx("div", { className: combineClasses(
        "featured-post",
        animationClasses,
        getStaggeredDelay(0)
      ), children: featuredPost }),
      remainingPosts.length > 0 && /* @__PURE__ */ jsx("div", { className: combineClasses(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
        gapSizes[gap]
      ), children: remainingPosts.map((child, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: combineClasses(
            animationClasses,
            getStaggeredDelay(index + 1)
          ),
          children: child
        },
        index + 1
      )) })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: gridClasses, ...props, children: React.Children.map(children, (child, index) => /* @__PURE__ */ jsx(
    "div",
    {
      className: combineClasses(
        animationClasses,
        getStaggeredDelay(index)
      ),
      children: child
    },
    index
  )) });
};
const BlogGridContainer = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: combineClasses(
        "w-full max-w-7xl mx-auto px-4",
        className
      ),
      ...props,
      children
    }
  );
};
const BlogGridSection = ({
  title,
  subtitle,
  children,
  sidebar,
  className = "",
  ...props
}) => {
  const { isMobile } = useBlogResponsive();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: combineClasses("space-y-6", className),
      ...props,
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
          title && /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-white", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "text-zinc-400 max-w-2xl mx-auto", children: subtitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: combineClasses(
          sidebar && !isMobile ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : "w-full"
        ), children: [
          /* @__PURE__ */ jsx("div", { className: sidebar && !isMobile ? "lg:col-span-3" : "w-full", children }),
          sidebar && !isMobile && /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "sticky top-20 space-y-6", children: sidebar }) })
        ] })
      ]
    }
  );
};
const BlogNavigation = ({
  searchQuery = "",
  onSearchChange,
  selectedCategory = null,
  onCategoryChange,
  showSearch = true,
  showCategories = true,
  showPopular = true,
  className = "",
  variant = "sidebar"
  // 'sidebar', 'horizontal', 'compact'
}) => {
  var _a;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [popularPosts] = useState([]);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = ((_a = categoriesData == null ? void 0 : categoriesData.data) == null ? void 0 : _a.categories) || [];
  const handleSearchInput = (event) => {
    const value = event.target.value;
    onSearchChange == null ? void 0 : onSearchChange(value);
    const searchParams = new URLSearchParams(location.search);
    if (value.trim()) {
      searchParams.set("search", value.trim());
    } else {
      searchParams.delete("search");
    }
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };
  const handleCategorySelect = (categorySlug) => {
    onCategoryChange == null ? void 0 : onCategoryChange(categorySlug === selectedCategory ? null : categorySlug);
    if (categorySlug && categorySlug !== selectedCategory) {
      navigate(`/blog/categoria/${categorySlug}`);
    } else if (categorySlug === selectedCategory) {
      navigate("/blog");
    }
  };
  const clearFilters = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    onSearchChange == null ? void 0 : onSearchChange("");
    onCategoryChange == null ? void 0 : onCategoryChange(null);
    navigate("/blog");
  };
  const activeFiltersCount = [
    searchQuery == null ? void 0 : searchQuery.trim(),
    selectedCategory
  ].filter(Boolean).length;
  useEffect(() => {
    const handleKeyDown = (event) => {
      var _a2, _b;
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        (_a2 = searchInputRef.current) == null ? void 0 : _a2.focus();
      }
      if (event.key === "Escape" && isSearchFocused) {
        (_b = searchInputRef.current) == null ? void 0 : _b.blur();
        if (searchQuery) {
          onSearchChange == null ? void 0 : onSearchChange("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, isSearchFocused, onSearchChange]);
  const SearchSection = () => showSearch && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: `relative ${isSearchFocused ? "ring-2 ring-purple-500/50" : ""} rounded-lg transition-all duration-200`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(
        MagnifyingGlass,
        {
          size: 20,
          className: `transition-colors ${isSearchFocused ? "text-purple-400" : "text-zinc-500"}`
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: searchInputRef,
          type: "text",
          placeholder: "Pesquisar artigos... (Ctrl+K)",
          defaultValue: searchQuery,
          onChange: handleSearchInput,
          onFocus: () => setIsSearchFocused(true),
          onBlur: () => setIsSearchFocused(false),
          className: "w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none transition-colors"
        }
      ),
      searchQuery && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            if (searchInputRef.current) {
              searchInputRef.current.value = "";
              onSearchChange == null ? void 0 : onSearchChange("");
            }
          },
          className: "absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      )
    ] }),
    isSearchFocused && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-2 p-3 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-lg text-xs text-zinc-400", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: "Pressione Enter para pesquisar" }),
      /* @__PURE__ */ jsx("span", { children: "Esc para limpar" })
    ] }) })
  ] });
  const CategoriesSection = () => showCategories && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-zinc-100 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Tag, { size: 20, className: "text-purple-400" }),
        "Categorias"
      ] }),
      selectedCategory && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCategorySelect(null),
          className: "text-xs text-zinc-500 hover:text-purple-400 transition-colors",
          children: "Limpar"
        }
      )
    ] }),
    categoriesLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-8 bg-zinc-700/30 rounded animate-pulse" }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      categories.map((category) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleCategorySelect(category.slug),
          className: `w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${selectedCategory === category.slug ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" : "bg-zinc-800/30 border border-transparent text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50"}`,
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Hash, { size: 14 }),
              category.name
            ] }),
            category.post_count && /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded-full ${selectedCategory === category.slug ? "bg-purple-400/20 text-purple-200" : "bg-zinc-600/50 text-zinc-400"}`, children: category.post_count })
          ]
        },
        category.id
      )),
      categories.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-zinc-500", children: [
        /* @__PURE__ */ jsx(Tag, { size: 24, className: "mx-auto mb-2 opacity-30" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Nenhuma categoria dispon�vel" })
      ] })
    ] })
  ] });
  const PopularSection = () => showPopular && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-zinc-100 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(TrendUp, { size: 20, className: "text-orange-400" }),
      "Posts Populares"
    ] }),
    popularPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-zinc-500", children: [
      /* @__PURE__ */ jsx(Article, { size: 24, className: "mx-auto mb-2 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Posts populares em breve" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: popularPosts.slice(0, 5).map((post) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/blog/${post.slug}`,
        className: "block p-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-transparent hover:border-zinc-600/50 rounded-lg transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-zinc-200 line-clamp-2 mb-1", children: post.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-zinc-500", children: [
            /* @__PURE__ */ jsx(Clock, { size: 12 }),
            /* @__PURE__ */ jsxs("span", { children: [
              post.reading_time || 5,
              " min de leitura"
            ] })
          ] })
        ]
      },
      post.id
    )) })
  ] });
  const ActiveFilters = () => activeFiltersCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg", children: [
    /* @__PURE__ */ jsx(Funnel, { size: 16, className: "text-purple-400" }),
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-purple-300", children: [
      activeFiltersCount,
      " filtro",
      activeFiltersCount !== 1 ? "s" : "",
      " ativo",
      activeFiltersCount !== 1 ? "s" : ""
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: clearFilters,
        className: "ml-auto text-xs text-purple-400 hover:text-purple-300 transition-colors underline",
        children: "Limpar todos"
      }
    )
  ] });
  if (variant === "horizontal") {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 max-w-md", children: /* @__PURE__ */ jsx(SearchSection, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsFilterOpen(!isFilterOpen),
            className: "flex items-center gap-2 px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-lg text-zinc-300 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Funnel, { size: 16 }),
              "Filtros",
              activeFiltersCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full", children: activeFiltersCount }),
              /* @__PURE__ */ jsx(CaretDown, { size: 16, className: `transition-transform ${isFilterOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        isFilterOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full right-0 mt-2 w-80 p-4 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl z-50", children: /* @__PURE__ */ jsx(CategoriesSection, {}) })
      ] })
    ] });
  }
  if (variant === "compact") {
    return /* @__PURE__ */ jsxs("div", { className: `space-y-4 ${className}`, children: [
      /* @__PURE__ */ jsx(SearchSection, {}),
      /* @__PURE__ */ jsx(ActiveFilters, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `space-y-6 ${className}`, children: [
    /* @__PURE__ */ jsx(SearchSection, {}),
    /* @__PURE__ */ jsx(ActiveFilters, {}),
    /* @__PURE__ */ jsx(CategoriesSection, {}),
    /* @__PURE__ */ jsx(PopularSection, {})
  ] });
};
const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) return null;
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "mb-8", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-2 text-sm", children: [
    /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "flex items-center text-zinc-400 hover:text-zinc-300 transition-colors",
        children: /* @__PURE__ */ jsx(House, { size: 16 })
      }
    ) }),
    items.map((item, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(CaretRight, { size: 12, className: "text-zinc-600" }),
      item.current ? /* @__PURE__ */ jsx("span", { className: "text-zinc-300 font-medium truncate max-w-xs md:max-w-md", children: item.label }) : /* @__PURE__ */ jsx(
        Link,
        {
          to: item.path,
          className: "text-zinc-400 hover:text-zinc-300 transition-colors truncate max-w-xs md:max-w-md",
          children: item.label
        }
      )
    ] }, index))
  ] }) });
};
const ShareButtons = ({ url, title, compact = false, variant = "default" }) => {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  React.useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      setIsWebShareSupported(true);
    }
  }, []);
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
  };
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url
        });
      } catch (error) {
        console.log("Share cancelled or error:", error);
      }
    }
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      } catch (fallbackError) {
        console.error("Failed to copy: ", fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };
  const handleSocialShare = (platform) => {
    if (isMobile) {
      window.open(shareUrls[platform], "_blank");
      return;
    }
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      shareUrls[platform],
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };
  if (compact) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      isWebShareSupported && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleNativeShare,
          className: "p-2 text-zinc-400 hover:text-purple-300 transition-colors",
          "aria-label": "Compartilhar",
          children: /* @__PURE__ */ jsx(Share, { size: 20 })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCopyLink,
          className: "p-2 text-zinc-400 hover:text-purple-300 transition-colors",
          "aria-label": "Copiar link",
          children: copied ? /* @__PURE__ */ jsx(Check, { size: 20, className: "text-green-400" }) : /* @__PURE__ */ jsx(LinkSimple, { size: 20 })
        }
      )
    ] });
  }
  if (variant === "minimal") {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400 font-medium", children: "Compartilhar" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("facebook"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-600/20 border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no Facebook",
            children: /* @__PURE__ */ jsx(
              FacebookLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-blue-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("twitter"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-sky-600/20 border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no Twitter",
            children: /* @__PURE__ */ jsx(
              TwitterLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-sky-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("linkedin"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-blue-700/20 border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200",
            "aria-label": "Compartilhar no LinkedIn",
            children: /* @__PURE__ */ jsx(
              LinkedinLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-blue-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => handleSocialShare("whatsapp"),
            className: "group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-green-600/20 border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200",
            "aria-label": "Compartilhar no WhatsApp",
            children: /* @__PURE__ */ jsx(
              WhatsappLogo,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-green-400 transition-colors"
              }
            )
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCopyLink,
            className: `group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${copied ? "bg-green-600/20 border-green-500/30" : "bg-zinc-800/50 hover:bg-zinc-600/20 border-zinc-700/50 hover:border-zinc-500/30"}`,
            "aria-label": "Copiar link",
            children: copied ? /* @__PURE__ */ jsx(Check, { size: 18, className: "text-green-400" }) : /* @__PURE__ */ jsx(
              LinkSimple,
              {
                size: 18,
                className: "text-zinc-400 group-hover:text-zinc-300 transition-colors"
              }
            )
          }
        )
      ] }),
      isWebShareSupported && /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleNativeShare,
          className: "flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-zinc-200 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200 text-sm",
          children: [
            /* @__PURE__ */ jsx(Share, { size: 16 }),
            /* @__PURE__ */ jsx("span", { children: "Compartilhar" })
          ]
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    isWebShareSupported && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleNativeShare,
        className: "flex items-center gap-3 w-full px-4 py-3 bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 rounded-lg border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx(Share, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Compartilhar" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`, children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("facebook"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(FacebookLogo, { size: 20, className: "text-blue-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Facebook" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("twitter"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-sky-600/10 text-zinc-200 hover:text-sky-300 rounded-lg border border-zinc-700/50 hover:border-sky-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(TwitterLogo, { size: 20, className: "text-sky-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Twitter" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("linkedin"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-blue-600/10 text-zinc-200 hover:text-blue-300 rounded-lg border border-zinc-700/50 hover:border-blue-600/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(LinkedinLogo, { size: 20, className: "text-blue-500" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "LinkedIn" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleSocialShare("whatsapp"),
          className: "flex items-center gap-3 px-4 py-3 bg-zinc-800/50 hover:bg-green-600/10 text-zinc-200 hover:text-green-300 rounded-lg border border-zinc-700/50 hover:border-green-500/30 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, className: "text-green-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "WhatsApp" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleCopyLink,
        className: `flex items-center gap-3 w-full px-4 py-3 rounded-lg border transition-all duration-200 ${copied ? "bg-green-600/20 border-green-500/30 text-green-300" : "bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-200 hover:text-zinc-100 border-zinc-700/50 hover:border-zinc-600/50"}`,
        children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Check, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Link copiado!" })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(LinkSimple, { size: 20 }),
          /* @__PURE__ */ jsx("span", { children: "Copiar link" })
        ] })
      }
    )
  ] });
};
const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXJyZWdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleLoad = () => {
    setIsLoaded(true);
  };
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: imgRef,
      className: `relative overflow-hidden ${className}`,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: placeholder,
            alt: "",
            className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`,
            "aria-hidden": "true"
          }
        ),
        isInView && /* @__PURE__ */ jsx(
          "img",
          {
            src: hasError ? placeholder : src,
            alt,
            onLoad: handleLoad,
            onError: handleError,
            className: `w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`,
            loading: "lazy"
          }
        ),
        !isLoaded && isInView && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-zinc-800/50", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" }) })
      ]
    }
  );
};
const extractHeaders = (content) => {
  let element;
  if (typeof content === "string") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    element = tempDiv;
  } else if (content instanceof HTMLElement) {
    element = content;
  } else {
    return [];
  }
  const headers = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
  return Array.from(headers).map((header, index) => {
    var _a;
    const level = parseInt(header.tagName.charAt(1));
    const text = ((_a = header.textContent) == null ? void 0 : _a.trim()) || "";
    const slug = generateSlug(text, index);
    if (!header.id) {
      header.id = slug;
    }
    return {
      level,
      text,
      slug: header.id || slug,
      element: header
    };
  }).filter((header) => header.text.length > 0);
};
const generateSlug = (text, index) => {
  if (!text || typeof text !== "string") {
    return `header-${index}`;
  }
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim("-") || `header-${index}`;
};
const TOCItem = ({ header, isActive, onClick, isCollapsed }) => {
  const indentLevel = Math.max(0, header.level - 1);
  const indentClass = `ml-${Math.min(indentLevel * 4, 12)}`;
  return /* @__PURE__ */ jsx("li", { className: `toc-item level-${header.level}`, children: /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onClick(header),
      className: combineClasses(
        "w-full text-left py-2 px-3 rounded-md transition-all duration-200 group flex items-center gap-2",
        "hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:outline-none",
        isActive ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-500" : "text-zinc-400 hover:text-zinc-300",
        indentClass
      ),
      title: header.text,
      children: [
        /* @__PURE__ */ jsx(
          Hash,
          {
            size: 14,
            className: combineClasses(
              "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
              isActive && "opacity-100"
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { className: combineClasses(
          "truncate text-sm leading-relaxed",
          header.level === 1 && "font-semibold",
          header.level === 2 && "font-medium",
          header.level >= 3 && "font-normal"
        ), children: header.text })
      ]
    }
  ) });
};
const TableOfContents = ({
  content = null,
  containerSelector = null,
  className = "",
  title = "Índice",
  collapsible = true,
  initiallyCollapsed = false,
  minHeaders = 3,
  maxLevel = 6,
  offsetTop = 100,
  smoothScroll = true,
  updateUrlHash = true,
  showProgress = false,
  mobileBreakpoint = 768
}) => {
  const [headers, setHeaders] = useState([]);
  const [activeHeader, setActiveHeader] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const observerRef = useRef(null);
  const headersRef = useRef([]);
  const tocRef = useRef(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);
  useEffect(() => {
    let extractedHeaders = [];
    if (content) {
      extractedHeaders = extractHeaders(content);
    } else if (containerSelector) {
      const container = document.querySelector(containerSelector);
      if (container) {
        extractedHeaders = extractHeaders(container);
      }
    } else {
      const article = document.querySelector("article") || document.querySelector("main") || document.querySelector(".blog-content");
      if (article) {
        extractedHeaders = extractHeaders(article);
      }
    }
    const filteredHeaders = extractedHeaders.filter((h) => h.level <= maxLevel);
    if (filteredHeaders.length >= minHeaders) {
      setHeaders(filteredHeaders);
      headersRef.current = filteredHeaders;
    } else {
      setHeaders([]);
      headersRef.current = [];
    }
  }, [content, containerSelector, maxLevel, minHeaders]);
  useEffect(() => {
    if (headers.length === 0) return;
    const observerOptions = {
      rootMargin: `-${offsetTop}px 0px -80% 0px`,
      threshold: 0
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const visibleHeaders = entries.filter((entry) => entry.isIntersecting).map((entry) => {
        const header = headersRef.current.find((h) => h.element === entry.target);
        return { header, ratio: entry.intersectionRatio };
      }).filter((item) => item.header);
      if (visibleHeaders.length > 0) {
        const mostVisible = visibleHeaders.reduce(
          (prev, current) => prev.ratio > current.ratio ? prev : current
        );
        setActiveHeader(mostVisible.header.slug);
        if (updateUrlHash && mostVisible.header.slug) {
          const newUrl = `${window.location.pathname}${window.location.search}#${mostVisible.header.slug}`;
          window.history.replaceState(null, "", newUrl);
        }
      }
    }, observerOptions);
    headers.forEach((header) => {
      if (header.element) {
        observerRef.current.observe(header.element);
      }
    });
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headers, offsetTop, updateUrlHash]);
  useEffect(() => {
    if (!showProgress || headers.length === 0) return;
    let ticking = false;
    const calculateProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScrollableDistance = documentHeight - windowHeight;
        if (maxScrollableDistance <= 0) {
          setReadingProgress(100);
        } else {
          const progress = Math.round(scrollTop / maxScrollableDistance * 100);
          setReadingProgress(Math.min(100, Math.max(0, progress)));
        }
        ticking = false;
      });
    };
    calculateProgress();
    const handleScroll = () => {
      calculateProgress();
    };
    const handleResize = () => {
      calculateProgress();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [showProgress, headers]);
  const handleHeaderClick = useCallback((header) => {
    if (!header.element) return;
    const yOffset = -offsetTop;
    const y = header.element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    if (smoothScroll) {
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo(0, y);
    }
    if (updateUrlHash) {
      const newUrl = `${window.location.pathname}${window.location.search}#${header.slug}`;
      window.history.pushState(null, "", newUrl);
    }
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  }, [offsetTop, smoothScroll, updateUrlHash, isMobile, collapsible]);
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);
  if (headers.length === 0) {
    return null;
  }
  const tocContent = /* @__PURE__ */ jsxs("div", { className: combineClasses(
    "toc-container bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden",
    className
  ), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-zinc-700/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(List, { size: 18, className: "text-zinc-400" }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-zinc-200 text-sm", children: title }),
        showProgress && /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
          Math.round(readingProgress),
          "%"
        ] })
      ] }),
      collapsible && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleCollapse,
          className: "p-1 text-zinc-400 hover:text-zinc-300 transition-colors",
          "aria-label": isCollapsed ? "Expandir Índice" : "Recolher Índice",
          children: isCollapsed ? /* @__PURE__ */ jsx(CaretRight, { size: 16 }) : /* @__PURE__ */ jsx(CaretDown, { size: 16 })
        }
      )
    ] }),
    showProgress && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "px-4 py-2 border-b border-zinc-700/50", children: /* @__PURE__ */ jsx("div", { className: "w-full bg-zinc-700 rounded-full h-1", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-purple-500 h-1 rounded-full transition-all duration-300",
        style: { width: `${readingProgress}%` }
      }
    ) }) }),
    !isCollapsed && /* @__PURE__ */ jsxs(
      "nav",
      {
        className: `toc-nav p-2 ${isMobile ? "max-h-[50vh] overflow-y-auto" : "max-h-[calc(100vh-200px)] overflow-visible"}`,
        role: "navigation",
        "aria-label": "Índice do artigo",
        style: {
          // Custom scrollbar styling para quando necessário no mobile
          scrollbarWidth: "thin",
          scrollbarColor: "#4A5568 #2D3748"
        },
        children: [
          /* @__PURE__ */ jsx("style", { jsx: true, children: `
            .toc-nav::-webkit-scrollbar {
              width: 4px;
            }
            .toc-nav::-webkit-scrollbar-track {
              background: #2D3748;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb {
              background: #4A5568;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb:hover {
              background: #718096;
            }
          ` }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: headers.map((header, index) => /* @__PURE__ */ jsx(
            TOCItem,
            {
              header,
              isActive: activeHeader === header.slug,
              onClick: handleHeaderClick,
              isCollapsed
            },
            `${header.slug}-${index}`
          )) })
        ]
      }
    )
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsx("div", { className: combineClasses(
      "toc-mobile sticky top-20 z-30 mb-6",
      className
    ), children: tocContent });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: tocRef,
      className: combineClasses(
        "toc-desktop sticky top-24 max-h-[calc(100vh-6rem)]",
        className
      ),
      children: tocContent
    }
  );
};
const BlogCTA = ({
  post,
  variant = "specific",
  // 'specific' | 'generic'
  showUrgency = false,
  urgencyText = "Inscrições abertas",
  className = "",
  onCtaClick = null
  // Para tracking de analytics
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { classes, styles } = useCTAResponsive();
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  const COURSE_MAPPING = {
    "projetista-3d": {
      title: "Projetista",
      slug: "projetista-3d",
      icon: "Cube",
      desc: "SketchUp, Enscape, Renderização com IA, Projetos 3D…",
      textColor: "text-orange-400",
      borderGradient: "from-orange-500/60 to-amber-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f97316aa]"
    },
    "edicao-video": {
      title: "Edição de Vídeo",
      slug: "edicao-video",
      icon: "FilmSlate",
      desc: "Premiere, After Effects, DaVinci Resolve, Motion Graphics…",
      textColor: "text-red-400",
      borderGradient: "from-red-500/60 to-pink-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f87171aa]"
    },
    "informatica": {
      title: "Informática",
      slug: "informatica",
      icon: "Desktop",
      desc: "Windows, Word, Excel (fundamental → avançado)…",
      textColor: "text-blue-400",
      borderGradient: "from-blue-500/60 to-indigo-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#60a5faaa]"
    },
    "design-grafico": {
      title: "Design Gráfico",
      slug: "design-grafico",
      icon: "PenNib",
      desc: "Photoshop, Illustrator, InDesign, Canva, Social…",
      textColor: "text-pink-400",
      borderGradient: "from-pink-500/60 to-rose-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f472b6aa]"
    },
    "programacao": {
      title: "Programação",
      slug: "programacao",
      icon: "Code",
      desc: "Lógica, Python, Java, PHP, Android Studio, Jogos…",
      textColor: "text-green-400",
      borderGradient: "from-green-500/60 to-emerald-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#4ade80aa]"
    },
    "marketing-digital": {
      title: "Marketing Digital",
      slug: "marketing-digital",
      icon: "ChartLine",
      desc: "Social Ads, SEO, Copywriting, Canva, Branding, Analytics…",
      textColor: "text-purple-400",
      borderGradient: "from-purple-500/60 to-violet-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#a78bfaaa]"
    },
    "inteligencia-artificial": {
      title: "Inteligência Artificial",
      slug: "inteligencia-artificial",
      icon: "Robot",
      desc: "Cursor, Prompt Engineering, ChatGPT, Visão…",
      textColor: "text-cyan-400",
      borderGradient: "from-cyan-500/60 to-teal-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#22d3eeaa]"
    },
    "business-intelligence": {
      title: "Business Intelligence",
      slug: "business-intelligence",
      icon: "ChartBar",
      desc: "Master Excel, Power BI, Dashboards, Storytelling de Dados…",
      textColor: "text-indigo-400",
      borderGradient: "from-indigo-500/60 to-blue-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#818cf8aa]"
    },
    "administracao": {
      title: "Administração",
      slug: "administracao",
      icon: "Briefcase",
      desc: "Office, Excel Avançado, DP, Matemática Financeira, Liderança…",
      textColor: "text-violet-400",
      borderGradient: "from-violet-500/60 to-purple-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#8b5cf6aa]"
    }
  };
  const findRelatedCourse = (post2) => {
    var _a;
    if (post2 == null ? void 0 : post2.cta_course_id) {
      return COURSES_DATA == null ? void 0 : COURSES_DATA.find((course) => course.basicInfo.id === post2.cta_course_id);
    }
    if ((post2 == null ? void 0 : post2.content) || (post2 == null ? void 0 : post2.title) || (post2 == null ? void 0 : post2.categories)) {
      const content = `${post2.title || ""} ${post2.content || ""} ${((_a = post2.categories) == null ? void 0 : _a.map((c) => c.name).join(" ")) || ""}`.toLowerCase();
      const courseKeywords = {
        // 1. PROJETISTA - Termos mais específicos primeiro
        "projetista-3d": [
          "sketchup",
          "shape bender",
          "enscape",
          "modelagem 3d",
          "renderização 3d",
          "projetos arquitetônicos",
          "arquitetura 3d",
          "maquete eletrônica",
          "geometria 3d",
          "curvatura 3d",
          "extensão sketchup",
          "plugin sketchup",
          "visualização arquitetônica",
          "projeto 3d",
          "desenho arquitetônico 3d"
        ],
        // 2. DESIGN GRÁFICO - Removidos termos conflitantes
        "design-grafico": [
          "photoshop",
          "illustrator",
          "indesign",
          "design gráfico",
          "identidade visual",
          "logotipo",
          "branding visual",
          "diagramação",
          "layout",
          "tipografia",
          "cores",
          "composição visual",
          "arte gráfica",
          "criação gráfica"
        ],
        // 3. INFORMÁTICA - Mantido
        "informatica": [
          "windows",
          "word",
          "powerpoint",
          "office",
          "informática básica",
          "computador básico",
          "digitação",
          "internet básica"
        ],
        // 4. PROGRAMAÇÃO - Mantido
        "programacao": [
          "programação",
          "código",
          "python",
          "java",
          "php",
          "javascript",
          "html",
          "css",
          "desenvolvimento",
          "software",
          "app",
          "aplicativo",
          "sistema"
        ],
        // 5. MARKETING DIGITAL - Mantido
        "marketing-digital": [
          "marketing digital",
          "redes sociais",
          "facebook ads",
          "instagram",
          "google ads",
          "seo",
          "copywriting",
          "tráfego pago",
          "analytics",
          "social media"
        ],
        // 6. INTELIGÊNCIA ARTIFICIAL - Mantido
        "inteligencia-artificial": [
          "inteligência artificial",
          "ia",
          "chatgpt",
          "prompt engineering",
          "machine learning",
          "cursor ai",
          "copilot",
          "automação ia"
        ],
        // 7. BUSINESS INTELLIGENCE - Mantido 
        "business-intelligence": [
          "power bi",
          "business intelligence",
          "dashboard",
          "kpi",
          "data visualization",
          "análise de dados",
          "storytelling dados"
        ],
        // 8. EDIÇÃO DE VÍDEO - Mantido
        "edicao-video": [
          "premiere",
          "after effects",
          "davinci resolve",
          "edição vídeo",
          "motion graphics",
          "vídeo",
          "montagem",
          "pós-produção"
        ],
        // 9. ADMINISTRAÇÃO - Mantido
        "administracao": [
          "administração",
          "gestão",
          "liderança",
          "dp",
          "departamento pessoal",
          "matemática financeira",
          "excel avançado admin"
        ],
        // 10. EXCEL AVANÇADO - Incluído na categoria Business Intelligence
        "business-intelligence-excel": [
          "excel",
          "planilha",
          "fórmulas excel",
          "gráficos excel",
          "macros",
          "vba"
        ]
      };
      for (const [courseSlug, keywords] of Object.entries(courseKeywords)) {
        if (keywords.some((keyword) => content.includes(keyword))) {
          const courseData = COURSES_DATA == null ? void 0 : COURSES_DATA.find((course) => course.basicInfo.slug === courseSlug);
          if (courseData) {
            return courseData;
          }
        }
      }
    }
    return null;
  };
  const relatedCourse = variant === "specific" ? findRelatedCourse(post) : null;
  const courseStyle = relatedCourse ? COURSE_MAPPING[relatedCourse.basicInfo.slug] : null;
  const handleCtaClick = (ctaType, courseId = null) => {
    if (onCtaClick) {
      onCtaClick({
        type: ctaType,
        postSlug: post == null ? void 0 : post.slug,
        courseId,
        timestamp: Date.now(),
        urgencyShown: showUrgency
      });
    }
  };
  if (variant === "specific" && relatedCourse && courseStyle) {
    return /* @__PURE__ */ jsx("div", { className: `${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-2xl mx-auto", children: [
      showUrgency && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 right-4 z-10", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse", children: [
        /* @__PURE__ */ jsx(Star, { size: 14 }),
        urgencyText
      ] }) }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `/cursos/${courseStyle.slug}`,
          onClick: () => handleCtaClick("specific_course", relatedCourse.basicInfo.id),
          className: `card-enter in-view relative clip-card w-full h-auto p-[3px] bg-gradient-to-r ${courseStyle.borderGradient} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${courseStyle.hoverShadow} focus-visible:ring-2 ring-fuchsia-500 focus:outline-none block`,
          children: /* @__PURE__ */ jsxs("div", { className: "clip-card w-full h-full bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-8 pt-6 pb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold leading-tight ${courseStyle.textColor}`, children: (post == null ? void 0 : post.cta_title) || `Domine ${courseStyle.title} na Prática` }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 mt-3 leading-relaxed", children: (post == null ? void 0 : post.cta_description) || `Desenvolva habilidades práticas e atualize seu conhecimento com nosso curso especializado em ${courseStyle.title}.` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-8 pb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: `text-lg font-semibold ${courseStyle.textColor}`, children: courseStyle.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300 leading-snug", children: courseStyle.desc }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-gray-400 mt-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Clock, { size: 12 }),
                    relatedCourse.basicInfo.duration
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Users, { size: 12 }),
                    relatedCourse.basicInfo.level
                  ] }),
                  relatedCourse.basicInfo.certificate && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Star, { size: 12 }),
                    "Certificado incluso"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 bg-gradient-to-r ${courseStyle.borderGradient.replace("/60", "")} text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`, children: [
                /* @__PURE__ */ jsx("span", { children: "Ver Detalhes" }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "transition-transform group-hover:translate-x-1" })
              ] }) })
            ] })
          ] })
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `${classes.container} cta-main cta-type-generic transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center overflow-hidden shadow-xl max-w-2xl mx-auto", style: styles.container, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" }),
    showUrgency && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium", children: [
      /* @__PURE__ */ jsx(Star, { size: 14 }),
      urgencyText
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative space-y-6 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold text-white leading-tight", children: (post == null ? void 0 : post.cta_title) || "Desenvolva suas habilidades profissionais" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed max-w-2xl mx-auto", children: (post == null ? void 0 : post.cta_description) || "Explore nossos cursos especializados e aprimore seu conhecimento com conteúdo atualizado e certificação reconhecida." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-sm text-gray-400", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full", children: [
          /* @__PURE__ */ jsx(Star, { size: 16 }),
          "Certificação reconhecida"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full", children: [
          /* @__PURE__ */ jsx(Users, { size: 16 }),
          "Instrutores especialistas"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/cursos",
          onClick: () => handleCtaClick("generic"),
          className: "inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Explorar Cursos" }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 20, className: "transition-transform group-hover:translate-x-1" })
          ]
        }
      ) })
    ] })
  ] }) });
};
export {
  BlogCard as B,
  COURSES_DATA as C,
  LazyImage as L,
  ResponsiveBlogGrid as R,
  SEOHead as S,
  TableOfContents as T,
  BlogLayout as a,
  BlogLoading as b,
  BlogError as c,
  BlogEmpty as d,
  BlogGridContainer as e,
  BlogGridSection as f,
  Breadcrumbs as g,
  BlogNavigation as h,
  ShareButtons as i,
  BlogCTA as j
};
