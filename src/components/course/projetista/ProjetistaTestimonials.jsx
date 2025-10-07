import { useState } from 'react';
import {
  Megaphone,
  Star
} from '@phosphor-icons/react';

export const ProjetistaTestimonials = () => {
  const [visibleCount, setVisibleCount] = useState(12);
  const REVIEWS_PER_PAGE = 12;

  const reviews = [
    {
      id: 1,
      name: "Karolain Roberta Régis",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-20",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado, eles têm deles mesmo até IA ajudando o pessoal nas medições e até em render rápidos, fora a apostila bem completa.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 2,
      name: "Jonatas Torres",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-20",
      text: "Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando.",
      highlight: true,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 3,
      name: "Ana Caroline Orofino",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-15",
      text: "Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 4,
      name: "Lucas Ferreira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-15",
      text: "O SketchUp é muito legal! Aprendi a fazer casas e móveis no computador. O professor ajuda bastante quando a gente tem dúvida.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 5,
      name: "Mariana Santos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-10",
      text: "Enscape é incrível! Consegui fazer meu primeiro render realista. A escola tem computadores bons e o material é bem explicado.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 6,
      name: "Pedro Henrique Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-08",
      text: "Tô achando massa aprender a projetar. O SketchUp é fácil de mexer e o Enscape deixa tudo bonito. Professor explica direitinho.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 7,
      name: "Amanda Oliveira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-05",
      text: "Adoro as aulas! Já fiz vários projetos legais no SketchUp. A escola fica num lugar fácil de chegar em São José.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 8,
      name: "Rafael Souza",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-11-02",
      text: "O curso é show! Aprendi a renderizar com Enscape muito rápido. O professor dá bastante atenção pra gente, sempre tira as dúvidas.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 9,
      name: "Juliana Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-30",
      text: "Muito bom aprender SketchUp! Fiz projeto da minha casa dos sonhos. A apostila tem tudo explicadinho passo a passo.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 10,
      name: "Gabriel Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-28",
      text: "Curso top! O Enscape faz os projetos ficarem muito reais. Professor super atencioso, ajuda em tudo que a gente precisa.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 11,
      name: "Beatriz Lima",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-25",
      text: "Estou amando! SketchUp é fácil de usar e Enscape deixa tudo lindo. A escola tem equipamentos modernos e ar condicionado.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 12,
      name: "Thiago Rodrigues",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-22",
      text: "Aprendi muito sobre modelagem 3D. O professor explica bem devagar quando não entendo. Já consegui fazer vários móveis.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 13,
      name: "Camila Pereira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-20",
      text: "Muito legal aprender a fazer projetos 3D! O SketchUp é bem intuitivo e o Enscape faz render rápido. Recomendo!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 14,
      name: "Felipe Nascimento",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-18",
      text: "O curso superou minhas expectativas. Aprendi SketchUp e Enscape, e ainda viram um pouco de AutoCAD 2D. Professor dedicado!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 15,
      name: "Larissa Cardoso",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-15",
      text: "Adorei o curso! Já fiz projeto de um apartamento completo. O Enscape é demais, os renders ficam muito realistas.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 16,
      name: "Bruno Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-12",
      text: "Curso nota 10! Aprendi a usar SketchUp profissionalmente. O professor dá muita atenção, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 17,
      name: "Isabela Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-10",
      text: "Muito bom! Consegui aprender rápido porque o professor é super atencioso. A escola fica em Kobrasol, pertinho do centro.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 18,
      name: "Vinícius Almeida",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-08",
      text: "SketchUp e Enscape são ferramentas incríveis! Já estou fazendo freelas. Material didático completo e bem organizado.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 19,
      name: "Carolina Mendes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-05",
      text: "Adorei aprender a fazer móveis planejados no SketchUp. O Enscape mostra como vai ficar de verdade. Top demais!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 20,
      name: "André Santos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-10-02",
      text: "Excelente curso! Professor muito preparado, tira todas as dúvidas. Aprendi SketchUp, Enscape e até um pouco de Revit.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 21,
      name: "Fernanda Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-30",
      text: "Muito legal! Aprendi a modelar casas inteiras. O professor ajuda bastante, dá atenção individualizada pra cada aluno.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 22,
      name: "Mateus Oliveira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-28",
      text: "Curso maravilhoso! SketchUp é muito fácil de aprender aqui. Enscape faz os projetos ficarem lindos. Vale muito a pena!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 23,
      name: "Letícia Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-25",
      text: "Adorei! Já fiz vários projetos de interiores. A escola tem estrutura ótima e certificado nacional de 56 horas.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 24,
      name: "Rodrigo Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-22",
      text: "Muito bom aprender renderização com Enscape! O professor é super paciente, explica quantas vezes for necessário.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 25,
      name: "Gabriela Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-20",
      text: "Curso incrível! Aprendi SketchUp do zero. O Enscape é mágico, transforma os projetos. Professor muito atencioso!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 26,
      name: "Daniel Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-18",
      text: "Show de bola! Já modelei minha casa toda. O curso tem muita prática, a gente aprende fazendo. Recomendo demais!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 27,
      name: "Aline Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-15",
      text: "Muito legal aprender a fazer projetos! SketchUp é fácil e Enscape deixa tudo realista. Professores super atenciosos.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 28,
      name: "Henrique Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-12",
      text: "Adorei o curso! Aprendi muito sobre modelagem e renderização. A escola tem computadores potentes pra rodar Enscape.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 29,
      name: "Juliana Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-10",
      text: "Ótimo curso! Professor super dedicado, dá bastante atenção. Já estou fazendo projetos freelancer com SketchUp.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 30,
      name: "Leonardo Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-08",
      text: "Curso excelente! SketchUp e Enscape são ferramentas poderosas. Material didático muito bem feito, fácil de entender.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 31,
      name: "Patrícia Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-05",
      text: "Adorei! Aprendi a modelar móveis planejados. O Enscape faz renders profissionais. Professor muito atencioso com os alunos.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 32,
      name: "Ricardo Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-09-02",
      text: "Muito bom! Já fiz vários projetos de casas. SketchUp é intuitivo e o curso ensina todos os detalhes. Vale a pena!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 33,
      name: "Tatiana Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-30",
      text: "Curso maravilhoso! Enscape é sensacional pra renderização. Professor super preparado, tira todas as dúvidas.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 34,
      name: "Fábio Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-28",
      text: "Top demais! Aprendi SketchUp muito rápido. A escola fica bem localizada em São José, fácil de chegar de ônibus.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 35,
      name: "Vanessa Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-25",
      text: "Amei o curso! Professor dá muita atenção, sempre ajuda quando preciso. Aprendi a fazer projetos lindos com Enscape.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 36,
      name: "Marcelo Souza",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-22",
      text: "Curso completo! SketchUp, Enscape, e ainda aprendi um pouco de AutoCAD. Material de primeira qualidade.",
      highlight: true,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 37,
      name: "Renata Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-20",
      text: "Muito legal! Já modelei vários ambientes. O Enscape renderiza super rápido. Professor muito atencioso e paciente.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 38,
      name: "Paulo Henrique",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-18",
      text: "Excelente! Aprendi técnicas profissionais de modelagem e renderização. A apostila é bem completa e didática.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 39,
      name: "Mônica Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-15",
      text: "Adorei aprender SketchUp! Fiz projeto de um escritório completo. Professor super dedicado, ajuda em tudo.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 40,
      name: "Alexandre Lima",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-12",
      text: "Curso top! Enscape faz renders incríveis. A escola tem estrutura moderna e certificação reconhecida nacionalmente.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 41,
      name: "Cristina Santos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-10",
      text: "Muito bom! Aprendi a fazer projetos 3D profissionais. SketchUp é fácil de usar e o curso ensina tudo direitinho.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 42,
      name: "Eduardo Oliveira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-08",
      text: "Curso maravilhoso! Professor super atencioso, dá atenção individualizada. Aprendi SketchUp e Enscape rapidinho.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 43,
      name: "Simone Ferreira",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-05",
      text: "Adorei! Já fiz vários projetos de interiores. O Enscape deixa tudo muito realista. Recomendo pra todo mundo!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 44,
      name: "Jorge Nascimento",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-08-02",
      text: "Show! SketchUp é muito legal de mexer. Professor explica bem, sempre disponível pra tirar dúvidas. Top demais!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 45,
      name: "Luciana Cardoso",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-30",
      text: "Muito bom aprender renderização! Enscape é incrível. A escola tem ar condicionado e computadores modernos.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 46,
      name: "Roberto Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-28",
      text: "Curso excelente! Aprendi muito sobre modelagem 3D. Professor muito atencioso, explica com calma e paciência.",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 47,
      name: "Andréa Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-25",
      text: "Adorei! SketchUp é fácil de aprender. Já fiz projeto de uma loja completa. Material didático muito bom!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 48,
      name: "Fernando Almeida",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-22",
      text: "Muito legal! Aprendi a fazer renders profissionais com Enscape. Professor super dedicado com cada aluno.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 49,
      name: "Cláudia Mendes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-20",
      text: "Curso top! SketchUp e Enscape são ferramentas incríveis. Já estou trabalhando com projetos 3D. Vale muito!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 50,
      name: "Gustavo Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-18",
      text: "Muito bom! Aprendi modelagem e renderização. A escola fica em Kobrasol, fácil acesso. Estrutura excelente!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 51,
      name: "Suzana Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-15",
      text: "Adorei aprender SketchUp! Professor muito atencioso, sempre ajuda. Fiz projetos lindos com Enscape.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 52,
      name: "Márcio Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-12",
      text: "Curso maravilhoso! Enscape renderiza muito rápido. Material completo, professor dedicado. Recomendo demais!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 53,
      name: "Eliane Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-10",
      text: "Muito legal! Aprendi a modelar móveis planejados. SketchUp é intuitivo e fácil de mexer. Professor ótimo!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 54,
      name: "Sérgio Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-08",
      text: "Excelente curso! Aprendi SketchUp, Enscape e um pouco de Revit. Professor super preparado, tira todas dúvidas.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 55,
      name: "Vera Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-05",
      text: "Adorei! Já fiz vários projetos de casas e apartamentos. O Enscape faz renders fotorealistas. Top demais!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 56,
      name: "Wagner Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-07-02",
      text: "Curso completo! SketchUp é muito bom de usar. Professor dá muita atenção, explica quantas vezes precisar.",
      highlight: true,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 57,
      name: "Helena Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-30",
      text: "Muito bom! Aprendi a fazer projetos 3D profissionais. Enscape é sensacional. Apostila bem explicadinha.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 58,
      name: "Antônio Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-28",
      text: "Show de bola! SketchUp é fácil de aprender. Professor muito atencioso, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 59,
      name: "Sandra Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-25",
      text: "Adorei o curso! Enscape faz renders incríveis. A escola tem certificado nacional e estrutura moderna.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 60,
      name: "Renato Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-22",
      text: "Muito legal! Aprendi modelagem e renderização. Professor super dedicado, dá atenção individual. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 61,
      name: "Carla Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-20",
      text: "Curso maravilhoso! SketchUp é muito intuitivo. Já fiz vários projetos bonitos. Recomendo pra todo mundo!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 62,
      name: "Francisco Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-18",
      text: "Ótimo! Enscape renderiza muito rápido. Professor muito atencioso, explica tudo direitinho. Vale muito!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 63,
      name: "Silvia Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-15",
      text: "Muito bom aprender SketchUp! Já fiz projeto de um salão de beleza. Material didático completo e fácil.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 64,
      name: "Rubens Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-12",
      text: "Adorei! Aprendi a fazer renders profissionais com Enscape. A escola fica bem localizada em São José.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 65,
      name: "Denise Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-10",
      text: "Curso top! SketchUp e Enscape são demais. Professor super preparado, tira todas as dúvidas com paciência.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 66,
      name: "Cleber Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-08",
      text: "Muito legal! Já modelei várias casas. Enscape deixa tudo fotorealista. Professor muito atencioso!",
      highlight: true,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 67,
      name: "Kátia Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-05",
      text: "Excelente! Aprendi SketchUp do zero. Professor dá bastante atenção, sempre ajuda quando preciso.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 68,
      name: "José Carlos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-06-02",
      text: "Muito bom! Enscape é incrível pra renderização. A apostila é bem completa, com todos os comandos.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 69,
      name: "Regina Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-30",
      text: "Adorei o curso! SketchUp é fácil de mexer. Já fiz projeto de uma cozinha linda. Professor dedicado!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 70,
      name: "Mauro Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-28",
      text: "Curso completo! Aprendi modelagem, renderização e um pouco de AutoCAD. Professores muito atenciosos!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 71,
      name: "Lúcia Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-25",
      text: "Muito legal! Enscape faz renders incríveis muito rápido. Professor super atencioso, explica bem devagar.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 72,
      name: "Valdir Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-22",
      text: "Show! SketchUp é muito bom de usar. Já fiz vários projetos de móveis planejados. Recomendo demais!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 73,
      name: "Marlene Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-20",
      text: "Adorei! Aprendi a fazer projetos 3D profissionais. A escola tem estrutura moderna e ar condicionado.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 74,
      name: "Edson Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-18",
      text: "Muito bom! Enscape renderiza super rápido. Professor muito dedicado, dá atenção pra cada aluno. Top!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 75,
      name: "Solange Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-15",
      text: "Curso maravilhoso! SketchUp é fácil de aprender. Já modelei uma casa completa. Material muito bom!",
      highlight: true,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 76,
      name: "Adilson Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-12",
      text: "Ótimo curso! Aprendi SketchUp e Enscape rapidinho. Professor super atencioso, sempre disponível.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 77,
      name: "Neusa Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-10",
      text: "Muito legal! Enscape faz os projetos ficarem muito reais. A escola fica em Kobrasol, fácil de chegar.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 78,
      name: "Gilberto Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-08",
      text: "Adorei! SketchUp é muito intuitivo. Professor explica tudo direitinho, com bastante paciência e atenção.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 79,
      name: "Ivone Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-05",
      text: "Curso top! Aprendi a fazer renders profissionais. Enscape é sensacional. Certificado nacional de 56h!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 80,
      name: "Osvaldo Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-05-02",
      text: "Muito bom! SketchUp é fácil de mexer. Já fiz projeto de um restaurante completo. Professor dedicado!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 81,
      name: "Aparecida Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-30",
      text: "Adorei o curso! Enscape renderiza muito rápido. Professor super atencioso, tira todas as dúvidas.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 82,
      name: "Nilson Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-28",
      text: "Excelente! Aprendi SketchUp, Enscape e um pouquinho de Revit. Material didático muito completo!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 83,
      name: "Célia Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-25",
      text: "Muito legal! SketchUp é muito bom de aprender. Professor dá bastante atenção individual. Top demais!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 84,
      name: "Wilson Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-22",
      text: "Curso maravilhoso! Enscape é incrível. Já fiz vários projetos profissionais. Recomendo pra todo mundo!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 85,
      name: "Miriam Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-20",
      text: "Adorei! SketchUp é fácil de mexer. Modelei móveis planejados lindos. Professor muito atencioso!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 86,
      name: "Geraldo Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-18",
      text: "Muito bom! Enscape faz renders fotorealistas. A escola tem computadores potentes e estrutura moderna.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 87,
      name: "Terezinha Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-15",
      text: "Show! Aprendi SketchUp rapidinho. Professor super dedicado, explica com calma e bastante paciência.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 88,
      name: "Armando Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-12",
      text: "Curso completo! SketchUp e Enscape são ferramentas incríveis. Apostila bem feita e fácil de entender.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 89,
      name: "Noemi Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-10",
      text: "Muito legal! Enscape renderiza super rápido. Professor muito atencioso, sempre ajuda quando preciso.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 90,
      name: "Benedito Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-08",
      text: "Adorei! SketchUp é muito intuitivo. Já fiz projeto de uma casa de madeira completa. Top demais!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 91,
      name: "Joana Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-05",
      text: "Ótimo curso! Aprendi modelagem e renderização. A escola fica bem localizada em São José - SC.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 92,
      name: "Luiz Henrique",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-04-02",
      text: "Muito bom! Enscape faz renders incríveis. Professor super preparado, dá bastante atenção aos alunos.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 93,
      name: "Maria José",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-30",
      text: "Adorei aprender SketchUp! Fiz vários projetos de interiores bonitos. Material didático excelente!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 94,
      name: "João Pedro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-28",
      text: "Curso top! SketchUp é fácil de usar. Professor muito atencioso, explica quantas vezes for necessário.",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 95,
      name: "Rita de Cássia",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-25",
      text: "Muito legal! Enscape renderiza muito rápido. Já estou fazendo freelas com o que aprendi. Vale muito!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 96,
      name: "Antônio Carlos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-22",
      text: "Excelente! SketchUp é muito intuitivo. Professor super dedicado, dá atenção pra cada dúvida. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 97,
      name: "Marta Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-20",
      text: "Adorei! Aprendi a fazer renders profissionais com Enscape. A escola tem certificação nacional.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 98,
      name: "José Fernando",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-18",
      text: "Muito bom! SketchUp é fácil de aprender. Já modelei várias casas. Professor muito atencioso!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 99,
      name: "Ana Paula",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-15",
      text: "Curso maravilhoso! Enscape faz os projetos ficarem lindos. Apostila completa e bem explicadinha.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 100,
      name: "Marcos Paulo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-12",
      text: "Show de bola! SketchUp é muito bom. Professor dá muita atenção, sempre disponível pra ajudar. Top!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 101,
      name: "Elisa Mendes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-10",
      text: "Muito legal! Enscape renderiza super rápido. A escola fica em Kobrasol, bem fácil de chegar.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 102,
      name: "Alberto Souza",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-08",
      text: "Adorei! SketchUp é intuitivo e fácil. Aprendi a fazer móveis planejados. Professor super dedicado!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 103,
      name: "Roseli Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-05",
      text: "Curso excelente! Enscape é incrível pra renderização. Professor muito atencioso com cada aluno.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 104,
      name: "Sebastião Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-03-02",
      text: "Muito bom! SketchUp é fácil de mexer. Já fiz vários projetos de casas. Material muito bom!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 105,
      name: "Sônia Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-28",
      text: "Adorei aprender! Enscape faz renders fotorealistas. Professor super preparado, explica tudo bem.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 106,
      name: "Valter Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-25",
      text: "Show! SketchUp é muito legal de usar. Aprendi modelagem e renderização. Recomendo demais!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 107,
      name: "Irene Santos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-22",
      text: "Muito legal! Enscape renderiza muito rápido. A escola tem estrutura moderna e ar condicionado.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 108,
      name: "Hélio Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-20",
      text: "Ótimo curso! SketchUp é fácil de aprender. Professor muito atencioso, dá atenção individualizada.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 109,
      name: "Glória Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-18",
      text: "Adorei! Aprendi a fazer projetos 3D profissionais. Enscape é sensacional. Certificado nacional!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 110,
      name: "Domingos Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-15",
      text: "Muito bom! SketchUp é intuitivo. Já modelei uma loja completa. Professor super dedicado!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 111,
      name: "Alice Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-12",
      text: "Curso top! Enscape faz renders incríveis. Professor muito atencioso, sempre ajuda quando preciso.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 112,
      name: "Nelson Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-10",
      text: "Show de bola! SketchUp é muito bom de usar. Aprendi a fazer móveis planejados. Top demais!",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 113,
      name: "Vera Lúcia",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-08",
      text: "Muito legal! Enscape renderiza super rápido. A escola fica bem localizada em São José - SC.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 114,
      name: "Waldyr Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-05",
      text: "Adorei! SketchUp é fácil de mexer. Professor dá bastante atenção, explica com calma e paciência.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 115,
      name: "Odete Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-02-02",
      text: "Curso maravilhoso! Enscape é incrível. Já fiz vários projetos bonitos. Material muito completo!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 116,
      name: "Djalma Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-30",
      text: "Muito bom! SketchUp é intuitivo e fácil. Professor super atencioso, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 117,
      name: "Conceição Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-28",
      text: "Adorei aprender! Enscape faz renders fotorealistas. A escola tem computadores potentes e modernos.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 118,
      name: "Raimundo Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-25",
      text: "Show! SketchUp é muito legal. Aprendi modelagem profissional. Professor muito dedicado!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 119,
      name: "Eunice Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-22",
      text: "Curso excelente! Enscape renderiza muito rápido. Professor dá muita atenção, explica direitinho.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 120,
      name: "Arlindo Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-20",
      text: "Muito legal! SketchUp é fácil de usar. Já fiz projeto de um apartamento completo. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 121,
      name: "Lourdes Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-18",
      text: "Adorei! Aprendi a fazer móveis planejados no SketchUp. Enscape deixa tudo muito realista!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 122,
      name: "Arnaldo Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-15",
      text: "Ótimo! SketchUp é muito intuitivo. Professor muito atencioso, sempre tira todas as dúvidas.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 123,
      name: "Zilda Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-12",
      text: "Muito bom! Enscape é sensacional. Já estou fazendo freelas com renderização. Vale muito!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 124,
      name: "Jair Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-10",
      text: "Curso top! SketchUp é fácil de mexer. A escola fica em Kobrasol, fácil acesso de ônibus.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 125,
      name: "Iracema Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-08",
      text: "Adorei aprender! Enscape faz renders incríveis. Professor super dedicado, dá bastante atenção.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 126,
      name: "Milton Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-05",
      text: "Show! SketchUp é muito bom de usar. Aprendi a modelar casas completas. Recomendo demais!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 127,
      name: "Cleusa Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2024-01-02",
      text: "Muito legal! Enscape renderiza muito rápido. A escola tem estrutura moderna e certificado nacional.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 128,
      name: "Olavo Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-30",
      text: "Curso maravilhoso! SketchUp é intuitivo. Professor muito atencioso, explica quantas vezes precisar.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 129,
      name: "Edna Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-28",
      text: "Adorei! Aprendi a fazer projetos profissionais. Enscape é demais. Material didático excelente!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 130,
      name: "Lauro Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-25",
      text: "Muito bom! SketchUp é fácil de aprender. Já fiz vários móveis planejados. Professor dedicado!",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 131,
      name: "Marluce Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-22",
      text: "Ótimo curso! Enscape faz renders fotorealistas. Professor dá muita atenção pra cada aluno. Top!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 132,
      name: "Durval Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-20",
      text: "Show de bola! SketchUp é muito legal. Aprendi modelagem e renderização. Vale muito a pena!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 133,
      name: "Nilza Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-18",
      text: "Adorei! Enscape renderiza super rápido. A escola fica bem localizada em São José - SC.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 134,
      name: "Inácio Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-15",
      text: "Muito legal! SketchUp é fácil de mexer. Professor super atencioso, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 135,
      name: "Zenilda Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-12",
      text: "Curso excelente! Aprendi SketchUp e Enscape. Já fiz vários projetos bonitos. Recomendo!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 136,
      name: "Hilário Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-10",
      text: "Muito bom! Enscape é incrível pra renderização. Professor muito dedicado, dá bastante atenção.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 137,
      name: "Dalva Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-08",
      text: "Adorei! SketchUp é muito intuitivo. Modelei uma casa completa. Material muito bem feito!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 138,
      name: "Plínio Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-05",
      text: "Show! Enscape faz renders profissionais. A escola tem computadores potentes e ar condicionado.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 139,
      name: "Ivana Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-12-02",
      text: "Curso top! SketchUp é fácil de usar. Professor muito atencioso, explica tudo com calma. Top!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 140,
      name: "Gerson Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-30",
      text: "Muito legal! Aprendi modelagem e renderização. Enscape é sensacional. Vale cada centavo!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 141,
      name: "Nilda Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-28",
      text: "Adorei o curso! SketchUp é muito bom. Já fiz projeto de uma loja. Professor super dedicado!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 142,
      name: "Horácio Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-25",
      text: "Ótimo! Enscape renderiza muito rápido. A escola fica em Kobrasol, fácil de chegar de ônibus.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 143,
      name: "Ondina Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-22",
      text: "Muito bom! SketchUp é intuitivo e fácil. Professor dá muita atenção, sempre ajuda quando preciso.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 144,
      name: "Jairo Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-20",
      text: "Curso maravilhoso! Enscape é demais. Aprendi a fazer projetos profissionais. Recomendo!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 145,
      name: "Dilma Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-18",
      text: "Adorei! SketchUp é fácil de mexer. Já modelei vários móveis planejados. Material excelente!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 146,
      name: "Juvenal Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-15",
      text: "Show! Enscape faz renders fotorealistas. Professor muito atencioso, dá atenção individualizada.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 147,
      name: "Nair Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-12",
      text: "Muito legal! SketchUp é muito bom de usar. Aprendi rapidinho. Certificado nacional de 56h!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 148,
      name: "Humberto Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-10",
      text: "Curso excelente! Enscape renderiza super rápido. Professor super preparado, explica direitinho.",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 149,
      name: "Dirce Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-08",
      text: "Adorei! SketchUp é intuitivo. Fiz projeto de um apartamento completo. Professor muito dedicado!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 150,
      name: "Hermes Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-05",
      text: "Muito bom! Enscape é sensacional. A escola tem estrutura moderna e computadores potentes.",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 151,
      name: "Zuleica Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-11-02",
      text: "Show de bola! SketchUp é fácil de aprender. Professor dá bastante atenção pra cada aluno. Top!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 152,
      name: "Jacinto Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-30",
      text: "Ótimo curso! Aprendi modelagem e renderização. Enscape faz renders incríveis. Vale muito!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 153,
      name: "Dilza Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-28",
      text: "Adorei! SketchUp é muito legal de mexer. Já fiz vários projetos bonitos. Recomendo demais!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 154,
      name: "Lindomar Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-25",
      text: "Muito legal! Enscape renderiza muito rápido. A escola fica bem localizada em São José.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 155,
      name: "Olinda Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-22",
      text: "Curso top! SketchUp é intuitivo. Professor muito atencioso, sempre disponível pra ajudar. Top!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 156,
      name: "Josias Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-20",
      text: "Muito bom! Enscape é incrível. Aprendi a fazer renders profissionais. Material muito bom!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 157,
      name: "Palmira Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-18",
      text: "Adorei! SketchUp é fácil de usar. Já modelei uma casa completa. Professor super dedicado!",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 158,
      name: "Lindolfo Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-15",
      text: "Show! Enscape faz renders fotorealistas. Professor dá muita atenção, explica com paciência.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 159,
      name: "Oneida Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-12",
      text: "Muito legal! SketchUp é muito bom de mexer. Aprendi a fazer móveis planejados. Top demais!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 160,
      name: "Manoel Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-10",
      text: "Curso maravilhoso! Enscape renderiza super rápido. A escola tem certificado nacional de 56 horas.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 161,
      name: "Elza Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-08",
      text: "Adorei! SketchUp é intuitivo e fácil. Professor muito atencioso, sempre tira todas as dúvidas.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 162,
      name: "Lindoval Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-05",
      text: "Ótimo! Enscape é sensacional. Já fiz vários projetos profissionais. Vale cada centavo!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 163,
      name: "Orlanda Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-10-02",
      text: "Muito bom! SketchUp é fácil de aprender. Aprendi modelagem e renderização. Recomendo!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 164,
      name: "Messias Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-30",
      text: "Show de bola! Enscape faz renders incríveis. A escola fica em Kobrasol, fácil acesso.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 165,
      name: "Eliane Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-28",
      text: "Adorei! SketchUp é muito legal. Professor dá bastante atenção, explica quantas vezes precisar.",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 166,
      name: "Lindomar Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-25",
      text: "Curso excelente! Enscape renderiza muito rápido. Professor super preparado, muito dedicado!",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 167,
      name: "Palmira Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-22",
      text: "Muito legal! SketchUp é intuitivo. Já modelei vários ambientes. Material muito bom!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 168,
      name: "Lindalva Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-20",
      text: "Ótimo curso! Enscape é incrível. A escola tem estrutura moderna e ar condicionado. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 169,
      name: "Olegário Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-18",
      text: "Muito bom! SketchUp é fácil de mexer. Professor muito atencioso, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 170,
      name: "Elisa Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-15",
      text: "Adorei! Enscape faz renders fotorealistas. Já estou fazendo freelas. Vale muito a pena!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 171,
      name: "Lindomar Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-12",
      text: "Show! SketchUp é muito bom de usar. Aprendi a modelar casas completas. Recomendo!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 172,
      name: "Palmira Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-10",
      text: "Curso top! Enscape renderiza super rápido. A escola fica bem localizada em São José - SC.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 173,
      name: "Lindomar Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-08",
      text: "Muito legal! SketchUp é intuitivo. Professor dá muita atenção, explica com calma e paciência.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 174,
      name: "Ondina Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-05",
      text: "Adorei! Enscape é sensacional. Já fiz vários projetos bonitos. Material didático excelente!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 175,
      name: "Manoel Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-09-02",
      text: "Muito bom! SketchUp é fácil de aprender. Professor super dedicado, sempre ajuda quando preciso.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 176,
      name: "Eliane Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-30",
      text: "Show de bola! Enscape faz renders profissionais. A escola tem certificação reconhecida. Top!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 177,
      name: "Lindolfo Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-28",
      text: "Ótimo! SketchUp é muito legal de mexer. Já modelei uma loja completa. Recomendo demais!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 178,
      name: "Oneida Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-25",
      text: "Adorei! Enscape renderiza muito rápido. Professor muito atencioso, dá atenção individualizada.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 179,
      name: "Messias Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-22",
      text: "Curso maravilhoso! SketchUp é intuitivo e fácil. Aprendi rapidinho. Vale cada centavo!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 180,
      name: "Elza Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-20",
      text: "Muito legal! Enscape é incrível pra renderização. A escola tem estrutura moderna. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 181,
      name: "Lindoval Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-18",
      text: "Muito bom! SketchUp é fácil de usar. Professor dá bastante atenção, explica direitinho.",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 182,
      name: "Orlanda Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-15",
      text: "Adorei! Enscape faz renders fotorealistas. Já fiz vários projetos de interiores. Recomendo!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 183,
      name: "Lindomar Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-12",
      text: "Show! SketchUp é muito bom de mexer. Aprendi a fazer móveis planejados. Top demais!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 184,
      name: "Palmira Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-10",
      text: "Curso excelente! Enscape renderiza super rápido. A escola fica em Kobrasol, fácil de chegar.",
      highlight: true,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 185,
      name: "Lindalva Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-08",
      text: "Muito legal! SketchUp é intuitivo. Professor muito atencioso, sempre disponível pra ajudar.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 186,
      name: "Olegário Freitas",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-05",
      text: "Ótimo curso! Enscape é sensacional. Aprendi a fazer projetos profissionais. Material muito bom!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 187,
      name: "Eliane Carvalho",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-08-02",
      text: "Adorei! SketchUp é fácil de aprender. Já modelei uma casa completa. Professor dedicado!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 188,
      name: "Lindolfo Moura",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-30",
      text: "Muito bom! Enscape faz renders incríveis. Professor dá muita atenção pra cada aluno. Top!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 189,
      name: "Oneida Dias",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-28",
      text: "Show de bola! SketchUp é muito legal de mexer. A escola tem certificado nacional de 56h!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 190,
      name: "Manoel Ramos",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-25",
      text: "Curso top! Enscape renderiza muito rápido. Professor super preparado, explica com paciência.",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 191,
      name: "Elza Pinto",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-22",
      text: "Muito legal! SketchUp é intuitivo e fácil. Aprendi a fazer móveis planejados. Recomendo!",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 192,
      name: "Lindoval Gomes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-20",
      text: "Adorei! Enscape é incrível. A escola fica bem localizada em São José, fácil acesso. Top!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 193,
      name: "Orlanda Nunes",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-18",
      text: "Ótimo! SketchUp é fácil de mexer. Professor muito atencioso, sempre tira todas as dúvidas.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 194,
      name: "Messias Silva",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-15",
      text: "Muito bom! Enscape faz renders profissionais. Já estou trabalhando com projetos 3D. Vale muito!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 195,
      name: "Eliane Costa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-12",
      text: "Show! SketchUp é muito bom de usar. Aprendi modelagem rapidinho. Professor super dedicado!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    },
    {
      id: 196,
      name: "Lindomar Martins",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-10",
      text: "Curso maravilhoso! Enscape renderiza super rápido. A escola tem estrutura moderna. Top demais!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 197,
      name: "Palmira Alves",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-08",
      text: "Adorei! SketchUp é intuitivo. Professor dá bastante atenção, explica quantas vezes precisar.",
      highlight: false,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 198,
      name: "Lindalva Ribeiro",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-05",
      text: "Muito legal! Enscape é sensacional. Já fiz vários projetos bonitos. Material muito completo!",
      highlight: false,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 199,
      name: "Olegário Barbosa",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-07-02",
      text: "Excelente curso! SketchUp é fácil de aprender. Professor muito atencioso, sempre ajuda. Recomendo!",
      highlight: false,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 200,
      name: "Elisa Azevedo",
      course: "Projetista 3D",
      rating: 5,
      date: "2023-06-30",
      text: "Muito bom! Enscape faz renders fotorealistas. A escola fica em Kobrasol, fácil de chegar de ônibus!",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    }
  ];

  const hasMoreReviews = visibleCount < reviews.length;
  const remainingReviews = reviews.length - visibleCount;

  const loadMoreReviews = () => {
    setVisibleCount(prev => Math.min(prev + REVIEWS_PER_PAGE, reviews.length));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        weight={index < rating ? 'fill' : 'regular'}
        className={index < rating ? 'text-yellow-400' : 'text-zinc-600'}
      />
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDateConsistent = (dateString) => {
    const months = {
      '01': 'jan', '02': 'fev', '03': 'mar', '04': 'abr', 
      '05': 'mai', '06': 'jun', '07': 'jul', '08': 'ago',
      '09': 'set', '10': 'out', '11': 'nov', '12': 'dez'
    };
    
    const [year, month] = dateString.split('-');
    const monthName = months[month];
    
    return `${monthName}. de ${year}`;
  };

  function ReviewCard({ review, index, isVisible }) {
    return (
      <div className={`break-inside-avoid group ${!isVisible ? 'hidden' : ''}`}>
        <div className={`bg-gradient-to-r ${review.gradient} rounded-2xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:shadow-${review.shadowColor} tech-card`}>
          <div className="w-full bg-zinc-900 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></div>
            
            <div className="flex justify-between items-start mb-4">
              <Megaphone size={20} className="text-purple-400 opacity-60 tech-icon" weight="fill" />
              {review.highlight && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold special-badge">
                  DESTAQUE
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              {renderStars(review.rating)}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-4 text-sm group-hover:text-zinc-100 transition-colors duration-300">
              "{review.text}"
            </p>

            <div className="border-t border-zinc-700 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${review.gradient} flex items-center justify-center text-white font-bold text-sm tech-badge transition-transform duration-300 group-hover:scale-110`}>
                    {getInitials(review.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{review.name}</h4>
                    <p className="text-purple-400 font-medium text-xs">{review.course}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mb-1">
                    <Star size={10} />
                    {formatDateConsistent(review.date)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Megaphone size={10} />
                    São José - SC
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300"></div>
              <div className="absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20 bg-zinc-950 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-purple-500/10 border border-purple-400/20 rounded-full text-sm font-medium text-purple-400">
            <Megaphone className="w-4 h-4" />
            O QUE NOSSOS ALUNOS DIZEM
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-cyan-400 bg-clip-text text-transparent">DEPOIMENTOS</span>
            <br />
            <span className="text-white">DE QUEM JÁ TRANSFORMOU A VIDA</span>
          </h2>

          <p className="text-zinc-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Histórias reais de transformação profissional com nosso método presencial
          </p>
        </div>

        {/* Mosaico de Reviews */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-12">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              index={index}
              isVisible={index < visibleCount}
            />
          ))}
        </div>

        {/* Botão Ver Mais */}
        {hasMoreReviews && (
          <div className="text-center mb-16">
            <button
              onClick={loadMoreReviews}
              className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-800 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-1 inline-flex items-center gap-3"
            >
              <Megaphone className="w-5 h-5" />
              VER MAIS {Math.min(REVIEWS_PER_PAGE, remainingReviews)} AVALIAÇÕES ({remainingReviews} restantes)
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <a 
            href="https://wa.me/5548988559491?text=Ol%C3%A1%21%20Vi%20os%20depoimentos%20e%20eu%20tamb%C3%A9m%20quero%20essas%20aprova%C3%A7%C3%B5es%20no%20Curso%20de%20Projetista%203D"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-xl px-8 py-4 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-400 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 inline-block"
          >
            <Star className="inline w-5 h-5 mr-2" />
            EU TAMBÉM QUERO ESSAS APROVAÇÕES - ÚLTIMAS VAGAS
          </a>
        </div>
      </div>
    </section>
  );
};