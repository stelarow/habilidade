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
    question: "Qual Ã© a funÃ§Ã£o principal do HTML em uma pÃ¡gina web?",
    options: [
      "Estilizar a aparÃªncia visual da pÃ¡gina",
      "Definir a estrutura e o conteÃºdo da pÃ¡gina",
      "Adicionar interatividade e funcionalidades dinÃ¢micas",
      "Conectar a pÃ¡gina com banco de dados"
    ],
    correctAnswer: 1,
    explanation: "HTML (HyperText Markup Language) Ã© responsÃ¡vel por definir a estrutura e o conteÃºdo semÃ¢ntico de uma pÃ¡gina web, fornecendo a base sobre a qual CSS e JavaScript podem atuar.",
    points: 25,
    category: 'html'
  },
  {
    id: "q2", 
    question: "Qual propriedade CSS Ã© usada para alterar a cor de fundo de um elemento?",
    options: [
      "color",
      "background-color", 
      "font-color",
      "bg-color"
    ],
    correctAnswer: 1,
    explanation: "A propriedade 'background-color' em CSS Ã© especificamente usada para definir a cor de fundo de elementos HTML. A propriedade 'color' altera apenas a cor do texto.",
    points: 25,
    category: 'css'
  },
  {
    id: "q3",
    question: "Como se declara uma variÃ¡vel em JavaScript moderno (ES6+)?",
    options: [
      "var minhaVariavel = 'valor';",
      "variable minhaVariavel = 'valor';",
      "let minhaVariavel = 'valor';",
      "declare minhaVariavel = 'valor';"
    ],
    correctAnswer: 2,
    explanation: "No JavaScript moderno (ES6+), 'let' Ã© a forma recomendada para declarar variÃ¡veis, pois tem escopo de bloco. 'const' Ã© usado para constantes e 'var' Ã© a forma mais antiga com escopo de funÃ§Ã£o.",
    points: 25,
    category: 'javascript'
  },
  {
    id: "q4",
    question: "Qual Ã© a estrutura bÃ¡sica correta de um documento HTML5?",
    options: [
      "&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;",
      "&lt;!DOCTYPE html&gt;&lt;html&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/html&gt;",
      "&lt;html5&gt;&lt;header&gt;&lt;/header&gt;&lt;content&gt;&lt;/content&gt;&lt;/html5&gt;",
      "&lt;webpage&gt;&lt;head&gt;&lt;/head&gt;&lt;body&gt;&lt;/body&gt;&lt;/webpage&gt;"
    ],
    correctAnswer: 1,
    explanation: "Um documento HTML5 deve comeÃ§ar com '&lt;!DOCTYPE html&gt;' seguido pela estrutura bÃ¡sica com elementos &lt;html&gt;, &lt;head&gt; e &lt;body&gt;. O DOCTYPE informa ao navegador que Ã© um documento HTML5.",
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
      "Um site que tem muitas animaÃ§Ãµes"
    ],
    correctAnswer: 2,
    explanation: "Design responsivo refere-se Ã  capacidade de um site se adaptar e funcionar bem em diferentes dispositivos e tamanhos de tela, desde smartphones atÃ© desktops, proporcionando uma experiÃªncia otimizada para cada dispositivo.",
    points: 25,
    category: 'general'
  },
  {
    id: "q6",
    question: "Qual seletor CSS Ã© usado para aplicar estilos a um elemento com ID especÃ­fico?",
    options: [
      ".meuId",
      "#meuId",
      "*meuId",
      "@meuId"
    ],
    correctAnswer: 1,
    explanation: "O seletor '#' (hashtag) Ã© usado para selecionar elementos por ID em CSS. O '.' (ponto) Ã© usado para classes, '*' para seletor universal, e '@' Ã© usado para regras especiais como @media.",
    points: 25,
    category: 'css'
  },
  {
    id: "q7",
    question: "Qual evento JavaScript Ã© disparado quando a pÃ¡gina termina de carregar?",
    options: [
      "onstart",
      "onready", 
      "onload",
      "onfinish"
    ],
    correctAnswer: 2,
    explanation: "O evento 'onload' (ou 'load') Ã© disparado quando toda a pÃ¡gina, incluindo imagens e recursos externos, termina de carregar. Para DOM pronto, usa-se 'DOMContentLoaded'.",
    points: 25,
    category: 'javascript'
  },
  {
    id: "q8",
    question: "Qual Ã© a diferenÃ§a principal entre &lt;div&gt; e &lt;span&gt; em HTML?",
    options: [
      "NÃ£o hÃ¡ diferenÃ§a, sÃ£o sinÃ´nimos",
      "&lt;div&gt; Ã© para imagens e &lt;span&gt; para texto",
      "&lt;div&gt; Ã© elemento de bloco e &lt;span&gt; Ã© inline",
      "&lt;div&gt; Ã© mais antigo que &lt;span&gt;"
    ],
    correctAnswer: 2,
    explanation: "&lt;div&gt; Ã© um elemento de bloco que ocupa toda a largura disponÃ­vel e quebra linha, enquanto &lt;span&gt; Ã© um elemento inline que se adapta ao conteÃºdo e nÃ£o quebra linha, permitindo elementos ao lado.",
    points: 25,
    category: 'html'
  }
]