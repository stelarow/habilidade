// Quiz Questions for Chapter 2: Web Development Fundamentals
// Based on typical Chapter 2 content covering HTML, CSS, and JavaScript basics

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  points: number
  category: 'html' | 'css' | 'javascript' | 'general'
}

export const chapter2Questions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Qual é a função principal do HTML em uma página web?",
    options: [
      "Estilizar a aparência visual da página",
      "Definir a estrutura e o conteúdo da página",
      "Adicionar interatividade e funcionalidades dinâmicas",
      "Conectar a página com banco de dados"
    ],
    correctAnswer: 1,
    explanation: "HTML (HyperText Markup Language) é responsável por definir a estrutura e o conteúdo semântico de uma página web, fornecendo a base sobre a qual CSS e JavaScript podem atuar.",
    points: 25,
    category: 'html'
  },
  {
    id: "q2", 
    question: "Qual propriedade CSS é usada para alterar a cor de fundo de um elemento?",
    options: [
      "color",
      "background-color", 
      "font-color",
      "bg-color"
    ],
    correctAnswer: 1,
    explanation: "A propriedade 'background-color' em CSS é especificamente usada para definir a cor de fundo de elementos HTML. A propriedade 'color' altera apenas a cor do texto.",
    points: 25,
    category: 'css'
  },
  {
    id: "q3",
    question: "Como se declara uma variável em JavaScript moderno (ES6+)?",
    options: [
      "var minhaVariavel = 'valor';",
      "variable minhaVariavel = 'valor';",
      "let minhaVariavel = 'valor';",
      "declare minhaVariavel = 'valor';"
    ],
    correctAnswer: 2,
    explanation: "No JavaScript moderno (ES6+), 'let' é a forma recomendada para declarar variáveis, pois tem escopo de bloco. 'const' é usado para constantes e 'var' é a forma mais antiga com escopo de função.",
    points: 25,
    category: 'javascript'
  },
  {
    id: "q4",
    question: "Qual é a estrutura básica correta de um documento HTML5?",
    options: [
      "&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;",
      "&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;",
      "&lt;html5&gt;&lt;header&gt;&lt;/header&gt;&lt;content&gt;&lt;/content&gt;&lt;/html5&gt;",
      "&lt;webpage&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/webpage&gt;"
    ],
    correctAnswer: 1,
    explanation: "Um documento HTML5 deve começar com '&lt;!DOCTYPE html&gt;' seguido pela estrutura básica com elementos &lt;html&gt;, &lt;head&gt; e &lt;body&gt;. O DOCTYPE informa ao navegador que é um documento HTML5.",
    points: 25,
    category: 'html'
  },
  {
    id: "q5",
    question: "O que significa 'responsivo' no contexto de desenvolvimento web?",
    options: [
      "Um site que carrega rapidamente",
      "Um site que responde a comandos de voz",
      "Um site que se adapta a diferentes tamanhos de tela",
      "Um site que tem muitas animações"
    ],
    correctAnswer: 2,
    explanation: "Design responsivo refere-se à capacidade de um site se adaptar e funcionar bem em diferentes dispositivos e tamanhos de tela, desde smartphones até desktops, proporcionando uma experiência otimizada para cada dispositivo.",
    points: 25,
    category: 'general'
  },
  {
    id: "q6",
    question: "Qual seletor CSS é usado para aplicar estilos a um elemento com ID específico?",
    options: [
      ".meuId",
      "#meuId",
      "*meuId",
      "@meuId"
    ],
    correctAnswer: 1,
    explanation: "O seletor '#' (hashtag) é usado para selecionar elementos por ID em CSS. O '.' (ponto) é usado para classes, '*' para seletor universal, e '@' é usado para regras especiais como @media.",
    points: 25,
    category: 'css'
  },
  {
    id: "q7",
    question: "Qual evento JavaScript é disparado quando a página termina de carregar?",
    options: [
      "onstart",
      "onready", 
      "onload",
      "onfinish"
    ],
    correctAnswer: 2,
    explanation: "O evento 'onload' (ou 'load') é disparado quando toda a página, incluindo imagens e recursos externos, termina de carregar. Para DOM pronto, usa-se 'DOMContentLoaded'.",
    points: 25,
    category: 'javascript'
  },
  {
    id: "q8",
    question: "Qual é a diferença principal entre &lt;div&gt; e &lt;span&gt; em HTML?",
    options: [
      "Não há diferença, são sinônimos",
      "&lt;div&gt; é para imagens e &lt;span&gt; para texto",
      "&lt;div&gt; é elemento de bloco e &lt;span&gt; é inline",
      "&lt;div&gt; é mais antigo que &lt;span&gt;"
    ],
    correctAnswer: 2,
    explanation: "&lt;div&gt; é um elemento de bloco que ocupa toda a largura disponível e quebra linha, enquanto &lt;span&gt; é um elemento inline que se adapta ao conteúdo e não quebra linha, permitindo elementos ao lado.",
    points: 25,
    category: 'html'
  }
]