/**
 * DevStart Event Data
 * Dados centralizados para a página do evento DevStart - Missão: Criar Seu Jogo
 */

export const devstartData = {
  // Informações principais do evento
  event: {
    title: "MISSÃO: DEVSTART",
    subtitle: "Crie seu PRÓPRIO JOGO no Roblox!",
    tagline: "E aí! Bora criar seu PRÓPRIO JOGO?",
    description: "Imagina só: em vez de só jogar Roblox, você vai criar o seu próprio mapa, suas próprias regras e seus próprios desafios!",
    vagas: 30,
    horario: "14h às 17h",
    duracao: "4 encontros semanais",
    startDate: null, // null = data a definir | ou new Date('2025-02-15') para definir
    gratuito: true,
    certificado: true,
    idadeMinima: 8,
  },

  // Localização e contato
  location: {
    name: "Escola Habilidade",
    address: "R. Caetano José Ferreira, 426 - Sala 5",
    neighborhood: "Kobrasol",
    city: "São José",
    state: "SC",
    cep: "88102-280",
    fullAddress: "R. Caetano José Ferreira, 426 - Sala 5 - Kobrasol, São José - SC, 88102-280",
    phone: "(48) 98855-9491",
    phoneRaw: "5548988559491", // para WhatsApp API
    mapsUrl: "https://www.google.com/maps/place/Escola+Habilidade/data=!4m2!3m1!1s0x0:0xd345f5e77312fdec?sa=X&ved=1t:2428&ictx=111",
    website: "https://www.escolahabilidade.com",
  },

  // Redes sociais
  social: {
    instagram: {
      url: "https://www.instagram.com/habilidade.escola/",
      handle: "@habilidade.escola"
    },
  },

  // Badges do Hero
  badges: [
    { text: "GRATUITO", variant: "success", iconName: "Sparkle" },
    { text: "4 SEMANAS", variant: "primary", iconName: "Calendar" },
    { text: "30 VAGAS", variant: "warning", iconName: "Target" },
  ],

  // Missões (4 semanas)
  missions: [
    {
      week: 1,
      title: "Criando seu Mundo!",
      iconName: "MapTrifold",
      color: "#00A2FF", // Azul
      shortDescription: "Vamos abrir o Roblox Studio e construir o seu mapa. É a hora de soltar a imaginação!",
      description: "O que vamos fazer? Vamos abrir o Roblox Studio e construir o seu mapa. Você vai aprender a colocar chão, montanhas, água e a construir a base do seu desafio. É a hora de soltar a imaginação!",
      learnings: [
        "Abrir e navegar no Roblox Studio",
        "Construir terrenos e ambientes",
        "Adicionar elementos como água e montanhas",
        "Criar a base do seu desafio Obby",
      ],
    },
    {
      week: 2,
      title: "Dando Poderes ao Jogo!",
      iconName: "Lightning",
      color: "#FFEB3B", // Amarelo
      shortDescription: "Vamos aprender a usar 'códigos mágicos' para fazer coisas acontecerem!",
      description: "O que vamos fazer? Seu mundo ainda está parado. Nessa aula, vamos aprender a usar uns 'códigos mágicos' (que os programadores chamam de scripts) para fazer coisas acontecerem.",
      learnings: [
        "Introdução aos scripts (códigos)",
        "Criar o famoso bloco de lava vermelho",
        "Programar morte ao pisar no bloco",
        "Adicionar checkpoints para salvar progresso",
      ],
      example: "Vamos criar o famoso 'bloco de lava' vermelho. Se o jogador pisar nele, ele volta para o começo! Vamos criar também o checkpoint para salvar o jogo.",
    },
    {
      week: 3,
      title: "Criando Desafios Malucos!",
      iconName: "Path",
      color: "#E3000F", // Vermelho Roblox
      shortDescription: "Hora de deixar o jogo difícil e divertido com obstáculos dinâmicos!",
      description: "O que vamos fazer? Agora é hora de deixar o jogo difícil e divertido! Vamos fazer plataformas que se mexem sozinhas, blocos que somem quando você pisa, e obstáculos que giram para tentar te derrubar.",
      learnings: [
        "Criar plataformas que se movem sozinhas",
        "Programar blocos que desaparecem",
        "Adicionar obstáculos rotativos",
        "Balancear dificuldade e diversão",
      ],
    },
    {
      week: 4,
      title: "Mostrando seu Jogo pro Mundo!",
      iconName: "Globe",
      color: "#00C851", // Verde
      shortDescription: "Publique seu jogo online DE VERDADE e mostre para todo mundo!",
      description: "O que vamos fazer? Você terminou seu jogo! Nessa última aula, vamos apertar o botão de 'PUBLICAR'. Sério! Seu jogo vai ficar online DE VERDADE. Você vai poder copiar o link e mandar no WhatsApp para seus amigos e sua família jogarem no celular ou no computador deles!",
      learnings: [
        "Publicar o jogo no Roblox",
        "Compartilhar link com amigos",
        "Testar o jogo online",
        "Receber certificado de conclusão",
      ],
      finalReward: "No final, você ainda ganha um certificado bonito dizendo que você completou a missão e criou seu primeiro jogo!",
    },
  ],

  // Cards para duplo público (crianças + pais)
  audienceCards: {
    kids: {
      title: "PARA VOCÊ, JOVEM DEV!",
      iconName: "GameController",
      color: "#00A2FF",
      benefits: [
        { iconName: "Sparkle", text: "Vai ser MUITO mais legal que só jogar" },
        { iconName: "PaintBrush", text: "Crie mapas, regras e desafios do SEU jeito" },
        { iconName: "Trophy", text: "Publique DE VERDADE e mostre pros amigos" },
        { iconName: "Brain", text: "Aprenda os segredos dos criadores de jogos" },
      ],
      cta: "Imagina a cara dos seus amigos quando você mostrar SEU jogo!",
    },
    parents: {
      title: "PARA PAIS E RESPONSÁVEIS",
      iconName: "Books",
      color: "#E3000F",
      benefits: [
        { iconName: "CheckCircle", text: "Desenvolvimento de raciocínio lógico" },
        { iconName: "CheckCircle", text: "Criatividade aplicada à tecnologia" },
        { iconName: "CheckCircle", text: "Introdução à programação de forma lúdica" },
        { iconName: "CheckCircle", text: "Certificado de conclusão" },
        { iconName: "CheckCircle", text: "100% gratuito e presencial" },
      ],
      cta: "Invista no futuro do seu filho com educação tecnológica de qualidade!",
    },
  },

  // FAQ - Perguntas Frequentes
  faq: [
    {
      id: 1,
      question: "Qual a idade mínima para participar?",
      answer: "A partir de 8 anos! O curso é pensado para crianças e adolescentes que já sabem ler e escrever e têm interesse em criar jogos.",
    },
    {
      id: 2,
      question: "Preciso saber programar antes?",
      answer: "Não! O DevStart é para iniciantes completos. Começamos do zero e ensinamos tudo passo a passo de forma lúdica e divertida.",
    },
    {
      id: 3,
      question: "Preciso levar notebook ou computador?",
      answer: "Não é necessário! A Escola Habilidade fornece todos os computadores com Roblox Studio já instalado. Só precisa trazer vontade de aprender!",
    },
    {
      id: 4,
      question: "Os pais podem acompanhar as aulas?",
      answer: "Sim! Na primeira aula, os pais são bem-vindos para conhecer a escola e ver como funciona. Nas demais aulas, recomendamos que as crianças participem sozinhas para maior autonomia, mas os pais podem aguardar na recepção.",
    },
    {
      id: 5,
      question: "E se meu filho faltar em um encontro?",
      answer: "Não tem problema! Podemos repassar o conteúdo perdido antes da próxima aula ou disponibilizar material de apoio. Mas recomendamos não faltar para aproveitar ao máximo a experiência!",
    },
    {
      id: 6,
      question: "Como funciona o certificado?",
      answer: "Ao completar as 4 semanas e publicar o jogo, o aluno recebe um certificado digital de conclusão do DevStart, comprovando as habilidades adquiridas em criação de jogos e programação básica.",
    },
    {
      id: 7,
      question: "O DevStart é realmente gratuito?",
      answer: "Sim, 100% gratuito! Não há nenhum custo de inscrição, material ou mensalidade. É nossa forma de apresentar o mundo da programação para novos talentos!",
    },
    {
      id: 8,
      question: "Onde fica a escola?",
      answer: "Estamos localizados na R. Caetano José Ferreira, 426 - Sala 5, Kobrasol, São José - SC, CEP 88102-280. Fácil acesso e estacionamento disponível nas proximidades.",
    },
    {
      id: 9,
      question: "Posso continuar aprendendo depois do DevStart?",
      answer: "Com certeza! Se você curtir criar jogos e quiser se aprofundar, oferecemos cursos completos de programação onde você pode aprender a criar apps, sites e jogos ainda mais complexos!",
    },
    {
      id: 10,
      question: "Como faço a inscrição?",
      answer: "Basta preencher o formulário nesta página clicando em 'ACEITAR MISSÃO' ou 'GARANTIR MINHA VAGA'. Também pode entrar em contato pelo WhatsApp: (48) 98855-9491.",
    },
  ],

  // Dados do simulador de código
  codeSimulator: {
    title: "Experimente Criar um Bloco de Lava! 🔥",
    description: "Veja como é fácil programar no Roblox Studio. Clique nos botões abaixo para criar seu primeiro bloco de lava passo a passo!",
    steps: [
      {
        id: 1,
        label: "Criar Bloco",
        action: "createBlock",
        code: "local part = Instance.new('Part')",
        feedback: "Bloco criado! ✅",
      },
      {
        id: 2,
        label: "Pintar de Vermelho",
        action: "paintRed",
        code: "part.Color = Color3.new(1, 0, 0)",
        feedback: "Bloco ficou vermelho! 🔴",
      },
      {
        id: 3,
        label: "Adicionar Script de Lava",
        action: "addScript",
        code: "part.Touched:Connect(function(hit)\n  if hit.Parent:FindFirstChild('Humanoid') then\n    hit.Parent.Humanoid.Health = 0\n  end\nend)",
        feedback: "Script adicionado! Agora o bloco é mortal! ⚡",
      },
      {
        id: 4,
        label: "▶️ TESTAR!",
        action: "test",
        code: "-- Executando teste...",
        feedback: "Parabéns! Você criou um bloco mortal! 🔥 O jogador pisou e voltou ao início!",
      },
    ],
  },

  // CTA Final
  finalCTA: {
    title: "VAGAS LIMITADAS!",
    description: "Não perca a chance de criar seu primeiro jogo! Garanta sua vaga agora mesmo!",
    urgency: "APENAS 30 VAGAS DISPONÍVEIS",
    buttonText: "GARANTIR MINHA VAGA GRÁTIS! 🎮",
  },

  // Seção "E Depois?"
  afterDevStart: {
    title: "E DEPOIS?",
    subtitle: "Curtiu criar jogos? Esse é só o COMEÇO!",
    description: "No DevStart você aprende o básico de programação. Depois, pode continuar no nosso curso completo e virar um MESTRE DA PROGRAMAÇÃO!",
    benefits: [
      "Crie apps profissionais",
      "Desenvolva sites completos",
      "Construa jogos mais complexos",
      "Domine várias linguagens de programação",
    ],
    cta: {
      text: "Conhecer Curso Completo →",
      link: "/cursos", // ajustar para a rota correta
    },
  },

  // EmailJS Configuration (reutilizar do site)
  emailConfig: {
    serviceId: import.meta.env?.VITE_EMAILJS_SERVICE_ID || '',
    templateId: "template_devstart", // criar novo template específico
    publicKey: import.meta.env?.VITE_EMAILJS_PUBLIC_KEY || '',
    to: "alessandro.ferreira@escolahabilidade.com",
  },

  // WhatsApp Fallback
  whatsappFallback: {
    message: `Olá! Gostaria de me inscrever no DevStart - Missão: Criar Seu Jogo!`,
    url: function(message = this.message) {
      const phone = devstartData.location.phoneRaw;
      return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    },
  },

  // SEO / Meta Tags
  seo: {
    title: "DevStart - Crie Seu Jogo no Roblox | Escola Habilidade",
    description: "Curso gratuito de 4 encontros para criar seu próprio jogo de Obby no Roblox! Aprenda programação de forma lúdica. Para crianças a partir de 8 anos. Vagas limitadas!",
    keywords: "roblox, programação infantil, curso gratuito, criar jogos, roblox studio, obby, são josé, escola habilidade",
    ogImage: "/images/devstart-og.jpg", // criar imagem OG
    url: "https://www.escolahabilidade.com/devstart",
  },
};

// Exportações nomeadas para facilitar imports específicos
export const {
  event,
  location,
  social,
  missions,
  faq,
  audienceCards,
  codeSimulator,
  finalCTA,
  afterDevStart,
  badges,
  emailConfig,
  whatsappFallback,
  seo
} = devstartData;

export default devstartData;
