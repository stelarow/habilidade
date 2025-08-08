// Lazy-loaded constants for better performance
// Only loaded when specific sections become visible

// Export functions that return data to avoid eager loading
export const getSketchUpLessons = () => Object.freeze([
  { name: "Fundamentos do SketchUp", type: "Modelagem", duration: "120 min" },
  { name: "Modificadores e Geometrias", type: "Modelagem", duration: "120 min" },
  { name: "Projeto Guiado – Volume Simples", type: "Projeto", duration: "120 min" },
  { name: "Grupos e Componentes", type: "Modelagem", duration: "120 min" },
  { name: "Manipulação Avançada de Geometrias", type: "Modelagem", duration: "120 min" },
  { name: "Eixos e Superfícies Inclinadas", type: "Modelagem", duration: "120 min" },
  { name: "Projeto Guiado – Elementos Arquitetônicos", type: "Projeto", duration: "120 min" },
  { name: "Materiais e Texturas", type: "Modelagem", duration: "120 min" },
  { name: "Ferramenta Siga-me (Follow Me)", type: "Modelagem", duration: "120 min" },
  { name: "Sandbox e Terrenos", type: "Modelagem", duration: "120 min" },
  { name: "Vetorização e Logotipos 3D", type: "Modelagem", duration: "120 min" },
  { name: "Ferramentas de Sólidos", type: "Modelagem", duration: "120 min" },
  { name: "Importação de Arquivos CAD", type: "Modelagem", duration: "120 min" },
  { name: "Introdução ao Layout do SketchUp", type: "Modelagem", duration: "120 min" },
  { name: "Documentação Técnica com Layout", type: "Modelagem", duration: "120 min" },
  { name: "Plugins Essenciais", type: "Modelagem", duration: "120 min" },
  { name: "Componentes Dinâmicos I", type: "Modelagem", duration: "120 min" },
  { name: "Projeto Guiado – Interiores Residenciais", type: "Projeto", duration: "120 min" },
  { name: "Projeto Guiado – Fachada com Terreno", type: "Projeto", duration: "120 min" },
  { name: "Layout Final do Projeto Completo", type: "Projeto", duration: "120 min" }
]);

export const getEnscapeLessons = () => Object.freeze([
  { name: "Introdução ao Enscape e Configuração Inicial", type: "Renderização", duration: "120 min" },
  { name: "Iluminação Natural e Artificial", type: "Renderização", duration: "120 min" },
  { name: "Materiais e Texturização no Enscape", type: "Renderização", duration: "120 min" },
  { name: "Câmeras e Enquadramentos Profissionais", type: "Renderização", duration: "120 min" },
  { name: "Configurações de Render e Qualidade", type: "Renderização", duration: "120 min" },
  { name: "Animações e Vídeos com Enscape", type: "Renderização", duration: "120 min" },
  { name: "Ambientes Externos e Vegetação", type: "Renderização", duration: "120 min" },
  { name: "Projeto Guiado Completo com Enscape", type: "Projeto", duration: "120 min" }
]);

// Optimized companies data - only essential logos
export const getCompaniesData = () => Object.freeze([
  {
    name: "Portinox",
    logo: "/assets/cursos/sketchup-enscape/_AM4K71sI76P_48oTfwuh.webp",
    description: "Equipamentos Gastronômicos"
  },
  {
    name: "MR",
    logo: "/assets/cursos/sketchup-enscape/2jNvD0A0IySCMxVqHKKLN.jpeg", 
    description: "Móveis Planejados"
  },
  {
    name: "Rinox",
    logo: "/assets/cursos/sketchup-enscape/Dto_HF1D0esz2RgHkyluP.png",
    description: "Soluções Industriais"
  },
  {
    name: "Steinbach",
    logo: "/assets/cursos/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp",
    description: "Marcenaria"
  },
  {
    name: "Torres",
    logo: "/assets/cursos/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif",
    description: "projetos farmacêuticos"
  },
  {
    name: "Legno",
    logo: "/assets/cursos/sketchup-enscape/ukKT5CnXfAVP3AS9G4jXs.jpeg",
    description: "Móveis sob Medida"
  },
  {
    name: "Mobiliário",
    logo: "/assets/cursos/sketchup-enscape/xYBvu3zwJyVFvvlKHPcz0.jpeg",
    description: "Móveis e Interiores"
  },
  {
    name: "Protérmica",
    logo: "/assets/cursos/sketchup-enscape/dU-RkMhy9INgLG_2WQrOs.png",
    description: "Climatização"
  }
]);

export const getCourseProjects = () => Object.freeze([
  {
    title: "Casa Residencial Completa",
    description: "Projeto de residência unifamiliar com fachada, interiores e terreno paisagístico",
    image: "/assets/cursos/sketchup-enscape/project-1.jpeg"
  },
  {
    title: "Interiores de Luxo", 
    description: "Ambientes internos com materiais nobres, iluminação profissional e mobiliário",
    image: "/assets/cursos/sketchup-enscape/project-2.jpeg"
  },
  {
    title: "Documentação Técnica",
    description: "Plantas, cortes, fachadas e detalhamentos técnicos usando Layout",
    image: "/assets/cursos/sketchup-enscape/project-3.jpeg"
  }
]);

export const getTestimonialsData = () => Object.freeze([
  {
    name: "Jonatas Torres",
    initials: "JT",
    text: "Estou tendo uma excelente experiência com a escola habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara."
  },
  {
    name: "Karolain Roberta Régis",
    initials: "KR", 
    text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi ja bastante coisas que ainda não sabia."
  },
  {
    name: "Rute Barboza",
    initials: "RB",
    text: "Fiz todos os cursos de projeto com o professor Alessandro, me ajudou demais a colocar as coisas que antes eram apenas sonhos nos meus projetos."
  },
  {
    name: "Ana Caroline Orofino", 
    initials: "AC",
    text: "Estou adorando as aulas, professor muito atencioso, sempre trás questões do cotidiano para resolução das atividades!"
  },
  {
    name: "Sabrina Rodrigues",
    initials: "SR",
    text: "Comecei o curso de sketchup e está sendo uma experiência incrível, o professor é muito atencioso. Estou com grandes expectativas."
  },
  {
    name: "Milene Silva",
    initials: "MS",
    text: "A escola apresenta uma boa estrutura, o professor é bem atencioso e prestativo, sempre pronto para esclarecer dúvidas."
  }
]);

export const getCompanyStats = () => Object.freeze([
  { value: "50+", label: "Empresas Atendidas" },
  { value: "200+", label: "Projetos Entregues" },
  { value: "98%", label: "Taxa de Aprovação" },
  { value: "4.9/5", label: "Avaliação Média" }
]);