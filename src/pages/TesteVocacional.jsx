import React, { useState, useEffect, useRef, Component, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from '../utils/lazyMotion.jsx';
import { Helmet } from '@dr.pogodin/react-helmet';
import LogoH from '../components/LogoH';
import { analytics } from '../utils/analytics';
import { generatePDF as generatePDFWorker, onLoadProgress } from '../utils/pdfWorker';
import { 
  Brain,
  Code,
  Palette,
  TrendUp,
  Users,
  BookOpen,
  MapPin,
  CaretRight,
  CaretLeft,
  Check,
  Star,
  ChatCircle,
  Phone,
  Target,
  Trophy,
  Clock,
  DownloadSimple,
  ShareNetwork,
  ArrowsClockwise,
  User,
  Lightbulb,
  Camera,
  ChartPie,
  ChartBar,
  Pulse
} from '@phosphor-icons/react';

// Hook seguro para operações DOM que funciona tanto no cliente quanto servidor
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Error Boundary para capturar erros de DOM Manipulation
class DOMErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Captura erros DOM relacionados ao React 19 + Framer Motion
    const isDOMError = error.message && (
      error.message.includes('removeChild') ||
      error.message.includes('insertBefore') ||
      error.message.includes('appendChild') ||
      error.message.includes('Node')
    );
    
    if (isDOMError) {
      return { hasError: true, error };
    }
    // Para outros erros, relança para o Error Boundary pai
    throw error;
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debugging
    console.warn('🔧 DOM Error Boundary caught:', error.message);
    console.warn('🔧 Error Details:', errorInfo);
    console.warn('🔧 React Version: 19.1.0, Framer Motion: 12.23.12');
    
    // Track error para analytics
    if (typeof analytics?.trackError === 'function') {
      analytics.trackError(`React19_DOM_Error: ${error.message}`, 'DOM_BOUNDARY');
    }
  }

  render() {
    if (this.state.hasError) {
      // Renderização alternativa sem animações Framer Motion
      return (
        <div className={this.props.className || ''}>
          {this.props.fallbackChildren || this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

// Componente Radar Chart customizado
// Componente Gráfico de Barras para todas as 8 áreas
const BarChart = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={item.area}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 capitalize">
              {item.area === 'gestao' ? 'Gestão' : 
               item.area === 'educacao' ? 'Educação' : 
               item.area === 'comunicacao' ? 'Comunicação' :
               item.area === 'logica' ? 'Lógica' : item.area}
            </span>
            <span className="text-sm font-bold text-gray-600">{item.score}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${
                index === 0 ? 'bg-[#d400ff]' : 
                index === 1 ? 'bg-purple-400' : 
                index === 2 ? 'bg-blue-400' :
                'bg-gray-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${item.score}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
const RadarChart = ({ data, size = 200 }) => {
  const center = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (Math.PI * 2) / data.length;
  
  const points = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const value = item.value / 100;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return { x, y, label: item.label, value: item.value, color: item.color };
  });

  const maxPoints = data.map((item, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    return { x, y };
  });

  return (
    <div className="relative">
      <svg width={size} height={size} className="drop-shadow-lg">
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}
        
        {/* Grid lines */}
        {maxPoints.map((point, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={point.x}
            y2={point.y}
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity={0.3}
          />
        ))}

        {/* Data area */}
        <motion.polygon
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="rgba(212, 0, 255, 0.2)"
          stroke="#d400ff"
          strokeWidth="2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Data points */}
        {points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={point.color}
            stroke="white"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      {data.map((item, index) => {
        const angle = angleStep * index - Math.PI / 2;
        const labelRadius = radius + 25;
        const x = center + Math.cos(angle) * labelRadius;
        const y = center + Math.sin(angle) * labelRadius;
        
        return (
          <motion.div
            key={index}
            className="absolute text-xs font-semibold text-gray-700 text-center"
            style={{
              left: x - 30,
              top: y - 10,
              width: 60,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
          >
            <div className={`text-${item.color.replace('#', '')}`}>
              {item.label}
            </div>
            <div className="text-gray-600 font-bold">{item.value}%</div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Perguntas do teste vocacional - Metodologia baseada em MIT, Harvard e Stanford
// As 8 primeiras perguntas científicas do arquivo de referência
const questions = [
  // SEÇÃO 1: VALORES PROFISSIONAIS (baseado no modelo VIPS do MIT)
  {
    id: 1,
    section: "Valores Profissionais",
    question: "Pensando no seu futuro, o que é mais importante para você em uma carreira?",
    answers: [
      { text: "Resolver problemas complexos e inovar", scores: { tecnologia: 3, logica: 2, criatividade: 1 } },
      { text: "Ajudar pessoas e fazer diferença na sociedade", scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Liderar equipes e tomar decisões estratégicas", scores: { gestao: 3, comunicacao: 2, marketing: 1 } },
      { text: "Criar e expressar ideias artisticamente", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Trabalhar com dados e análises detalhadas", scores: { logica: 3, tecnologia: 2, gestao: 1 } }
    ]
  },
  {
    id: 2,
    section: "Valores Profissionais",
    question: "Qual ambiente de trabalho você prefere?",
    answers: [
      { text: "Laboratório/escritório com tecnologia avançada", scores: { tecnologia: 3, logica: 2, design: 1, comunicacao: -1 } },
      { text: "Interação direta com pessoas e comunidade", scores: { educacao: 3, comunicacao: 3, marketing: 1, tecnologia: -1 } },
      { text: "Escritório corporativo com reuniões e apresentações", scores: { gestao: 3, marketing: 2, comunicacao: 2, criatividade: -1 } },
      { text: "Estúdio criativo com liberdade de expressão", scores: { design: 3, criatividade: 3, marketing: 1, logica: -1 } },
      { text: "Ambiente estruturado com processos bem definidos", scores: { logica: 3, gestao: 2, tecnologia: 1, criatividade: -1 } }
    ]
  },
  {
    id: 3,
    section: "Valores Profissionais", 
    question: "No dia a dia, o que te dá mais energia para trabalhar?",
    answers: [
      { text: "Resolver um quebra-cabeça lógico ou problema complexo", scores: { logica: 3, tecnologia: 2, criatividade: 1 } },
      { text: "Interagir com clientes e colegas de equipe", scores: { comunicacao: 3, educacao: 2, marketing: 1 } },
      { text: "Ver uma ideia sua tomar forma e virar algo concreto", scores: { design: 3, criatividade: 3, tecnologia: 1 } },
      { text: "Otimizar um processo para torná-lo mais eficiente", scores: { gestao: 3, logica: 2, tecnologia: 1 } },
      { text: "Aprender algo novo e dominar uma nova habilidade", scores: { educacao: 2, tecnologia: 2, criatividade: 2 } }
    ]
  },
  {
    id: 4,
    section: "Valores Profissionais",
    question: "Como você define sucesso profissional?",
    answers: [
      { text: "Criar tecnologias que revolucionem o mundo", scores: { tecnologia: 3, logica: 2, criatividade: 2 } },
      { text: "Formar pessoas e transmitir conhecimento", scores: { educacao: 3, comunicacao: 3, gestao: 1 } },
      { text: "Construir e liderar uma empresa de sucesso", scores: { gestao: 3, marketing: 3, comunicacao: 2 } },
      { text: "Criar obras e designs reconhecidos mundialmente", scores: { design: 3, criatividade: 3, marketing: 2 } },
      { text: "Dominar minha área técnica e ser referência", scores: { tecnologia: 2, logica: 3, educacao: 1 } }
    ]
  },
  {
    id: 5,
    section: "Valores Profissionais",
    question: "Qual tipo de contribuição você quer deixar?",
    answers: [
      { text: "Soluções tecnológicas que facilitem a vida", scores: { tecnologia: 3, logica: 2, gestao: 1 } },
      { text: "Pessoas mais capacitadas e desenvolvidas", scores: { educacao: 3, comunicacao: 2, gestao: 2 } },
      { text: "Organizações mais eficientes e bem geridas", scores: { gestao: 3, logica: 2, comunicacao: 1 } },
      { text: "Mundo mais belo e inspirador através do design", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Marcas e produtos conhecidos por milhões", scores: { marketing: 3, comunicacao: 2, design: 2 } }
    ]
  },
  // SEÇÃO 2: INTERESSES PROFISSIONAIS (Holland RIASEC - Stanford)
  {
    id: 6,
    section: "Interesses Profissionais",
    question: "Nas horas livres, você prefere:",
    answers: [
      { text: "Montar/desmontar equipamentos eletrônicos", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Participar de trabalhos voluntários e sociais", scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Organizar eventos ou liderar grupos de amigos", scores: { gestao: 3, comunicacao: 2, marketing: 2 } },
      { text: "Desenhar, fotografar ou criar conteúdo visual", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Fazer planilhas ou organizar informações", scores: { logica: 3, gestao: 2, tecnologia: 1 } }
    ]
  },
  {
    id: 7,
    section: "Interesses Profissionais",
    question: "Qual tipo de desafio te anima mais?",
    answers: [
      { text: "Programar um aplicativo ou sistema complexo", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Ensinar algo novo e ver pessoas aprendendo", scores: { educacao: 3, comunicacao: 3, gestao: 1 } },
      { text: "Convencer pessoas sobre uma ideia ou projeto", scores: { marketing: 3, comunicacao: 3, gestao: 2 } },
      { text: "Criar uma campanha visual impactante", scores: { design: 3, criatividade: 3, marketing: 2 } },
      { text: "Analisar dados para encontrar padrões ocultos", scores: { logica: 3, tecnologia: 2, gestao: 1 } }
    ]
  },
  {
    id: 8,
    section: "Interesses Profissionais",
    question: "Qual atividade você faria por horas sem se cansar?",
    answers: [
      { text: "Codificar e resolver bugs complexos", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Preparar aulas e materiais educativos", scores: { educacao: 3, comunicacao: 2, design: 1 } },
      { text: "Planejar estratégias de marketing e vendas", scores: { marketing: 3, gestao: 2, comunicacao: 2 } },
      { text: "Criar designs e experiências visuais", scores: { design: 3, criatividade: 3, tecnologia: 1 } },
      { text: "Analisar processos e otimizar operações", scores: { logica: 3, gestao: 3, tecnologia: 2 } }
    ]
  }
];
// SEÇÃO 3: HABILIDADES E APTIDÕES (nova seção baseada em metodologia científica)
const additionalQuestions = [
  {
    id: 9,
    section: "Habilidades e Aptidões",
    question: "Com qual destas tarefas você se sente mais à vontade?",
    answers: [
      { text: "Organizar uma planilha com dados complexos", scores: { logica: 3, gestao: 2, tecnologia: 1 } },
      { text: "Criar uma apresentação visualmente atraente", scores: { design: 3, comunicacao: 2, criatividade: 2 } },
      { text: "Resolver um problema técnico em computador/software", scores: { tecnologia: 3, logica: 2, criatividade: 1 } },
      { text: "Escrever um texto persuasivo para convencer alguém", scores: { marketing: 3, comunicacao: 3, educacao: 1 } },
      { text: "Coordenar um projeto com várias pessoas", scores: { gestao: 3, comunicacao: 2, educacao: 1 } }
    ]
  },
  {
    id: 10,
    section: "Habilidades e Aptidões",
    question: "Quando você aprende algo novo, prefere:",
    answers: [
      { text: "Ler manuais e entender a teoria por trás", scores: { logica: 3, educacao: 2, tecnologia: 1, criatividade: -1 } },
      { text: "Colocar a mão na massa e aprender fazendo", scores: { tecnologia: 2, criatividade: 3, design: 2, logica: -1 } },
      { text: "Discutir com outras pessoas e trocar ideias", scores: { comunicacao: 3, educacao: 2, gestao: 1, tecnologia: -1 } },
      { text: "Assistir vídeos e exemplos visuais", scores: { design: 2, marketing: 2, criatividade: 2, logica: -1 } },
      { text: "Fazer anotações organizadas e esquemas", scores: { logica: 3, gestao: 2, educacao: 1, criatividade: -1 } }
    ]
  },
  {
    id: 11,
    section: "Habilidades e Aptidões",
    question: "Em um projeto em equipe, você naturalmente:",
    answers: [
      { text: "Assume a liderança e organiza as tarefas", scores: { gestao: 3, comunicacao: 2, educacao: 1 } },
      { text: "Foca na parte técnica e implementação", scores: { tecnologia: 3, logica: 2, design: 1 } },
      { text: "Cuida da apresentação e comunicação visual", scores: { design: 3, criatividade: 2, marketing: 2 } },
      { text: "Pesquisa e traz informações relevantes", scores: { logica: 2, educacao: 3, comunicacao: 1 } },
      { text: "Promove o projeto e busca engajamento", scores: { marketing: 3, comunicacao: 3, gestao: 1 } }
    ]
  },
  {
    id: 12,
    section: "Preferências de Trabalho",
    question: "Qual situação profissional te deixaria mais realizado?",
    answers: [
      { text: "Desenvolver um app que milhões de pessoas usam", scores: { tecnologia: 3, criatividade: 2, marketing: 1 } },
      { text: "Ver ex-alunos conquistas incríveis após seus ensinamentos", scores: { educacao: 3, comunicacao: 2, gestao: 1 } },
      { text: "Liderar uma empresa que gera centenas de empregos", scores: { gestao: 3, marketing: 2, comunicacao: 2 } },
      { text: "Criar um design que inspire pessoas no mundo todo", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Resolver um problema complexo que ninguém conseguiu", scores: { logica: 3, tecnologia: 2, criatividade: 1 } }
    ]
  },
  {
    id: 13,
    section: "Preferências de Trabalho",
    question: "Como você lida melhor com a pressão e deadlines?",
    answers: [
      { text: "Criando sistemas e processos organizados", scores: { gestao: 3, logica: 2, tecnologia: 1 } },
      { text: "Focando na solução técnica mais eficiente", scores: { tecnologia: 3, logica: 3, criatividade: 1 } },
      { text: "Buscando soluções criativas e inovadoras", scores: { criatividade: 3, design: 2, marketing: 1 } },
      { text: "Comunicando claramente com a equipe", scores: { comunicacao: 3, gestao: 2, educacao: 1 } },
      { text: "Analisando dados para tomar a melhor decisão", scores: { logica: 3, gestao: 2, tecnologia: 1 } }
    ]
  }
];

// Combinar perguntas originais com as novas
const allQuestions = [...questions, ...additionalQuestions];

// Cursos da Escola Habilidade
const courses = [
  {
    id: 'informatica',
    name: 'Informática',
    subtitle: 'Windows 11 + Office + Ambientes Digitais + IA',
    description: 'Curso completo de informática com Windows 11, Office, ambientes digitais, Canva e IA aplicada',
    duration: '184,5h',
    price: 'Consulte valores',
    areas: ['educacao', 'gestao', 'comunicacao', 'tecnologia'],
    icon: BookOpen,
    image: 'keys/curso-informatica?prompt=Professional computer workspace with Office applications'
  },
  {
    id: 'design-grafico',
    name: 'Design Gráfico',
    subtitle: 'Photoshop + Illustrator + InDesign + Canva + CorelDRAW',
    description: 'Domine Photoshop, Illustrator, InDesign, Canva e CorelDRAW para criar designs profissionais',
    duration: '90h',
    price: 'Consulte valores',
    areas: ['design', 'criatividade', 'marketing'],
    icon: Palette,
    image: 'keys/curso-design?prompt=Graphic design workspace with creative tools and colorful designs'
  },
  {
    id: 'programacao',
    name: 'Programação',
    subtitle: 'Lógica + Python + Java + PHP + Android + IA',
    description: 'Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e Cursor com IA',
    duration: '118h',
    price: 'Consulte valores',
    areas: ['tecnologia', 'logica', 'gestao'],
    icon: Code,
    image: 'keys/curso-programacao?prompt=Modern programming workspace with code on multiple monitors'
  },
  {
    id: 'marketing-digital',
    name: 'Marketing Digital',
    subtitle: 'Estratégias Digitais + Redes Sociais + Ads',
    description: 'Estratégias completas de marketing digital para vender online',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['marketing', 'comunicacao', 'gestao'],
    icon: TrendUp,
    image: 'keys/curso-marketing?prompt=Digital marketing dashboard with social media analytics and charts'
  },
  {
    id: 'inteligencia-artificial',
    name: 'Inteligência Artificial',
    subtitle: 'IA + Machine Learning + Aplicações Práticas',
    description: 'Domine inteligência artificial e suas aplicações no mercado de trabalho',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['tecnologia', 'logica', 'criatividade'],
    icon: Brain,
    image: 'keys/curso-ia?prompt=AI workspace with machine learning and data analysis'
  },
  {
    id: 'business-intelligence',
    name: 'Business Intelligence',
    subtitle: 'Power BI + Análise de Dados + Dashboard',
    description: 'Análise de dados e criação de dashboards profissionais',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['gestao', 'logica', 'tecnologia'],
    icon: ChartBar,
    image: 'keys/curso-bi?prompt=Business intelligence dashboard with charts and data analysis'
  },
  {
    id: 'projetista-3d',
    name: 'Projetista 3D Completo',
    subtitle: 'SketchUp + Enscape + V-Ray + IA',
    description: 'Crie projetos 3D profissionais com renderizações fotorrealísticas',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['design', 'tecnologia', 'criatividade'],
    icon: Camera,
    image: 'keys/curso-sketchup?prompt=3D architectural rendering modern house SketchUp professional'
  },
  {
    id: 'edicao-video',
    name: 'Edição de Vídeo',
    subtitle: 'Premier + After Effects + Criação de Conteúdo',
    description: 'Edição profissional de vídeos para redes sociais e mercado audiovisual',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['design', 'criatividade', 'marketing'],
    icon: Pulse,
    image: 'keys/curso-video?prompt=Video editing workspace with timeline and effects'
  },
  {
    id: 'administracao',
    name: 'Administração',
    subtitle: 'Gestão + Liderança + RH + Projetos',
    description: 'Desenvolva habilidades de liderança, gestão e administração empresarial',
    duration: 'Consulte',
    price: 'Consulte valores',
    areas: ['gestao', 'comunicacao', 'educacao'],
    icon: Users,
    image: 'keys/curso-gestao?prompt=Business leadership meeting with charts and professional team'
  }
];


// Componente Hero
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-16">
      {/* Fundo com partículas */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Brain className="text-[#d400ff]" size={32} />
            <span className="text-white font-semibold text-lg">Teste Vocacional Inteligente</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Descubra seu <span className="text-[#d400ff]">Curso Ideal</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
            Em apenas 13 perguntas científicas, descubra o curso da Escola Habilidade que mais combina com você. <strong className="text-[#d400ff]">Metodologia inspirada no MIT, Harvard e Stanford</strong> — disponível para toda a <span className="text-[#d400ff] font-semibold">Grande Florianópolis</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-8">
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-[#d400ff]" />
              Apenas 5 minutos
            </span>
            <span className="flex items-center gap-2">
              <Target size={16} className="text-[#d400ff]" />
              100% personalizado
            </span>
            <span className="flex items-center gap-2">
              <Trophy size={16} className="text-[#d400ff]" />
              Resultado profissional
            </span>
          </div>

          <motion.button
            onClick={() => document.getElementById('teste').scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#d400ff] to-purple-600 text-white px-12 py-6 rounded-full font-bold text-xl hover:from-purple-600 hover:to-[#d400ff] transition-all duration-300 inline-flex items-center gap-3"
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 40px rgba(212, 0, 255, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Brain size={24} />
            Começar Teste Gratuito
            <CaretRight size={20} />
          </motion.button>
        </motion.div>

        {/* Benefícios do teste */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBar className="text-[#d400ff]" size={32} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Análise Completa</h3>
            <p className="text-gray-300">Dashboard detalhado com suas afinidades profissionais</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-[#d400ff]" size={32} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Recomendação Inteligente</h3>
            <p className="text-gray-300">Cursos selecionados especificamente para você</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#d400ff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="text-[#d400ff]" size={32} />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Cursos Locais</h3>
            <p className="text-gray-300">Aulas presenciais na Grande Florianópolis</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Componente do Teste Vocacional
const VocationalTest = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAnswer = (answerIndex, scores) => {
    const question = allQuestions[currentQuestion];
    const answer = question.answers[answerIndex];
    
    // Track resposta
    analytics.trackQuestionAnswered(
      currentQuestion + 1,
      question.question,
      answer.text
    );
    
    const newAnswers = {
      ...answers,
      [currentQuestion]: { answerIndex, scores }
    };
    setAnswers(newAnswers);

    if (currentQuestion < allQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        // Track progresso
        analytics.trackTestProgress(currentQuestion + 2, allQuestions.length);
      }, 300);
    } else {
      setIsCompleted(true);
      const results = calculateResults(newAnswers);
      
      // Track conclusão
      const timeSpent = analytics.measureTestDuration.end();
      const primaryArea = results[0]?.area || 'não identificado';
      const secondaryArea = results[1]?.area || 'não identificado';
      
      analytics.trackTestCompleted(
        { primaryArea, secondaryArea },
        timeSpent
      );
      
      setTimeout(() => {
        onComplete(results);
      }, 300);
    }
  };

  const calculateResults = (allAnswers) => {
    const totals = {
      tecnologia: 0,
      design: 0,
      marketing: 0,
      gestao: 0,
      educacao: 0,
      criatividade: 0,
      comunicacao: 0,
      logica: 0
    };

    Object.values(allAnswers).forEach(answer => {
      Object.entries(answer.scores).forEach(([area, score]) => {
        totals[area] += score;
      });
    });

    // Ajustar scores negativos para valores mínimos de 0
    const adjustedTotals = {};
    const minScore = Math.min(...Object.values(totals));
    const adjustment = minScore < 0 ? Math.abs(minScore) : 0;
    
    Object.entries(totals).forEach(([area, score]) => {
      adjustedTotals[area] = score + adjustment;
    });

    // Normalizar para porcentagem
    const maxScore = Math.max(...Object.values(adjustedTotals));
    const normalizedResults = Object.entries(adjustedTotals).map(([area, score]) => ({
      area,
      score: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
    }));

    return normalizedResults;
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-white" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Teste Concluído!
          </h3>
          <p className="text-gray-600 mb-6">
            Analisando seus resultados e preparando suas recomendações...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d400ff]"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / allQuestions.length) * 100;
  const question = allQuestions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto" key="vocational-test-container">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pergunta {currentQuestion + 1} de {allQuestions.length}</span>
          <span>{Math.round(progress)}% completo</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-[#d400ff] h-2 rounded-full"
            key="progress-bar-animation"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={`question-${currentQuestion}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          {question.question}
        </h3>

        <div className="grid gap-4 max-w-2xl mx-auto">
          {question.answers.map((answer, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index, answer.scores)}
              className="p-6 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-[#d400ff] hover:bg-purple-50 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">{answer.text}</span>
                <CaretRight className="text-[#d400ff] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Back Button */}
        {currentQuestion > 0 && (
          <motion.button
            onClick={goBack}
            className="mt-8 text-gray-600 hover:text-[#d400ff] inline-flex items-center gap-2"
            whileHover={{ x: -2 }}
          >
            <CaretLeft size={16} />
            Voltar
          </motion.button>
        )}
        </motion.div>
    </div>
  );
};

// Componente Results Dashboard
const ResultsDashboard = ({ results, onRestart }) => {
  const [showCourses, setShowCourses] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ phase: '', progress: 0, message: '' });
  const resultsRef = useRef(null);
  const pdfContentRef = useRef(null);

  // Setup PDF progress callback
  useEffect(() => {
    const unsubscribe = onLoadProgress((progress) => {
      setPdfProgress(progress);
    });
    return unsubscribe;
  }, []);

  // Preparar dados para o gráfico radar
  const radarData = [
    { label: 'Tecnologia', value: results.find(r => r.area === 'tecnologia')?.score || 0, color: '#3b82f6' },
    { label: 'Design', value: results.find(r => r.area === 'design')?.score || 0, color: '#f59e0b' },
    { label: 'Marketing', value: results.find(r => r.area === 'marketing')?.score || 0, color: '#10b981' },
    { label: 'Gestão', value: results.find(r => r.area === 'gestao')?.score || 0, color: '#8b5cf6' },
    { label: 'Educação', value: results.find(r => r.area === 'educacao')?.score || 0, color: '#f97316' },
    { label: 'Criatividade', value: results.find(r => r.area === 'criatividade')?.score || 0, color: '#ec4899' }
  ];

  // Encontrar área dominante
  const dominantArea = results.reduce((prev, current) => 
    (prev.score > current.score) ? prev : current
  );

  // Recomendar cursos baseado no perfil
  // Calcular score de compatibilidade baseado nas top 3 áreas
  const calculateCourseCompatibility = (course, userResults) => {
    // Ordenar resultados do usuário por score (maior para menor)
    const topAreas = userResults.sort((a, b) => b.score - a.score).slice(0, 3);
    
    let compatibilityScore = 0;
    
    // Atribuir pesos: 1ª área (3 pontos), 2ª área (2 pontos), 3ª área (1 ponto)
    topAreas.forEach((userArea, index) => {
      if (course.areas.includes(userArea.area)) {
        const weight = 3 - index; // 3, 2, 1
        compatibilityScore += weight;
      }
    });
    
    return {
      ...course,
      compatibilityScore,
      compatibilityPercentage: Math.round((compatibilityScore / 6) * 100) // Máximo possível: 6 pontos
    };
  };
  const recommendedCourses = courses
    .map(course => calculateCourseCompatibility(course, results))
    .filter(course => course.compatibilityScore > 0) // Apenas cursos com alguma compatibilidade
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore) // Ordenar por score (maior primeiro)
    .slice(0, 3); // Pegar os top 3 cursos;

  // Mensagens personalizadas por perfil
  const getPersonalizedMessage = (results) => {
    // Ordenar por score e pegar as top 3 áreas
    const topAreas = results.sort((a, b) => b.score - a.score).slice(0, 3);
    const [first, second, third] = topAreas;
    
    // Definir perfis combinados mais comuns
    const combinedProfiles = {
      // Tecnologia + outras áreas
      'tecnologia-logica': "Você tem um perfil **Tecnológico-Analítico**! Combina habilidades técnicas com raciocínio lógico excepcional. É ideal para desenvolvimento de software, programação de sistemas complexos, análise de dados e inteligência artificial.",
      'tecnologia-criatividade': "Seu perfil é **Tecnológico-Criativo**! Une conhecimento técnico com pensamento inovador. Perfeito para design de interfaces, desenvolvimento de games, soluções criativas em tech e projetos que exigem tanto código quanto criatividade.",
      'tecnologia-design': "Você é **Tecnológico-Visual**! Combina programação com senso estético. Ideal para desenvolvimento front-end, UX/UI design, criação de aplicativos visuais e projetos que unem código e design.",
      
      // Design + outras áreas
      'design-marketing': "Seu perfil é **Criativo-Estratégico**! Combina talento visual com visão comercial. Excelente para marketing digital, gestão de redes sociais, criação de campanhas visuais e branding que realmente vendem.",
      'design-comunicacao': "Você tem perfil **Visual-Comunicativo**! Une criação visual com habilidades de comunicação. Perfeito para produção de conteúdo, design editorial, apresentações impactantes e comunicação visual.",
      
      // Marketing + outras áreas
      'marketing-gestao': "Seu perfil é **Comercial-Estratégico**! Combina visão de negócios com liderança. Ideal para gestão comercial, empreendedorismo, desenvolvimento de negócios e liderança de equipes comerciais.",
      'marketing-comunicacao': "Você é **Comunicativo-Persuasivo**! Excellence em comunicação e persuasão. Perfeito para vendas, marketing digital, relações públicas e qualquer área que exija convencer e engajar pessoas.",
      
      // Gestão + outras áreas
      'gestao-logica': "Seu perfil é **Gerencial-Analítico**! Combina liderança com análise sistemática. Ideal para gestão de projetos, business intelligence, consultoria empresarial e cargos que exigem decisões baseadas em dados.",
      'gestao-educacao': "Você tem perfil **Líder-Educador**! Une capacidade de gestão com desenvolvimento de pessoas. Excelente para gestão de recursos humanos, treinamentos corporativos e liderança de equipes.",
      
      // Educação + outras áreas
      'educacao-comunicacao': "Seu perfil é **Educativo-Comunicativo**! Combina ensino com excelente comunicação. Perfeito para treinamentos, palestras, criação de conteúdo educativo e qualquer área que envolva transmitir conhecimento.",
      
      // Lógica + outras áreas
      'logica-gestao': "Você é **Analítico-Organizacional**! Combina raciocínio lógico com visão de processos. Ideal para análise de dados, otimização de processos, business intelligence e consultoria analítica."
    };
    
    // Criar chave para perfil combinado
    const profileKey = `${first.area}-${second.area}`;
    
    // Se existe perfil combinado específico, usar ele
    if (combinedProfiles[profileKey]) {
      return combinedProfiles[profileKey];
    }
    
    // Caso contrário, usar mensagem baseada na área dominante com menção da segunda área
    const singleAreaMessages = {
      tecnologia: `Você tem um **perfil técnico e analítico** com forte afinidade por ${second.area === 'logica' ? 'raciocínio lógico' : second.area === 'design' ? 'criação visual' : second.area === 'criatividade' ? 'inovação' : second.area}. Adora resolver problemas complexos usando tecnologia e criar soluções que realmente funcionam.`,
      design: `Sua **criatividade é seu grande diferencial**, combinada com ${second.area === 'marketing' ? 'visão comercial' : second.area === 'comunicacao' ? 'habilidades de comunicação' : second.area === 'tecnologia' ? 'conhecimento técnico' : second.area}. Você tem olhar estético apurado e transforma ideias em realidade visual.`,
      marketing: `Você é um **comunicador nato com visão estratégica**, especialmente forte em ${second.area === 'comunicacao' ? 'persuasão' : second.area === 'gestao' ? 'liderança' : second.area === 'design' ? 'comunicação visual' : second.area}. Entende como conectar pessoas, produtos e ideias de forma eficaz.`,
      gestao: `**Líder por natureza**, com forte capacidade de ${second.area === 'comunicacao' ? 'comunicação' : second.area === 'logica' ? 'análise' : second.area === 'marketing' ? 'visão comercial' : second.area}. Tem facilidade para organizar, planejar e coordenar pessoas e projetos para alcançar resultados.`,
      educacao: `**Ensinar é sua vocação natural**, combinada com ${second.area === 'comunicacao' ? 'excelente comunicação' : second.area === 'gestao' ? 'capacidade organizacional' : second.area === 'tecnologia' ? 'conhecimento técnico' : second.area}. Tem paciência e satisfação em desenvolver outras pessoas.`,
      criatividade: `Sua **mente criativa é sua maior força**, especialmente quando aplicada à ${second.area === 'design' ? 'criação visual' : second.area === 'tecnologia' ? 'inovação técnica' : second.area === 'marketing' ? 'comunicação criativa' : second.area}. Pensa fora da caixa e encontra soluções únicas.`,
      comunicacao: `**Comunicação é seu talento natural**, potencializada por sua ${second.area === 'marketing' ? 'visão estratégica' : second.area === 'educacao' ? 'vocação para ensinar' : second.area === 'gestao' ? 'capacidade de liderança' : second.area}. Se expressa bem e consegue influenciar pessoas positivamente.`,
      logica: `**Raciocínio lógico é seu diferencial**, especialmente quando combinado com ${second.area === 'tecnologia' ? 'conhecimento técnico' : second.area === 'gestao' ? 'visão organizacional' : second.area === 'educacao' ? 'capacidade de ensinar' : second.area}. Resolve problemas complexos de forma sistemática e organizada.`
    };
    
    return singleAreaMessages[first.area] || "Você tem um **perfil único e diversificado** com múltiplas fortalezas profissionais!";
  };

  // Função para gerar PDF usando o novo PDF Worker
  const generatePDF = async () => {
    console.log('📄 TESTE VOCACIONAL: Starting PDF generation with PDF Worker');
    if (!pdfContentRef.current) {
      console.error('❌ PDF: pdfContentRef not found');
      return;
    }
    
    setIsGeneratingPDF(true);
    setPdfProgress({ phase: 'start', progress: 0, message: 'Iniciando...' });
    
    // Track download do PDF
    analytics.trackPDFDownload(dominantArea.area);
    
    try {
      // Usar o PDF Worker para geração
      const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filename = `Teste-Vocacional-Escola-Habilidade-${hoje}.pdf`;
      
      await generatePDFWorker(pdfContentRef.current, filename);
      
      console.log('✅ PDF: Generated successfully using PDF Worker');
      
    } catch (error) {
      console.error('❌ PDF: Generation failed:', error);
      alert(error.message || 'Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
      setPdfProgress({ phase: '', progress: 0, message: '' });
    }
  };

  // Preload removido: PDF Worker carrega bibliotecas apenas quando necessário

  // Função para compartilhar resultados
  const shareResults = async () => {
    const areaName = dominantArea.area === 'gestao' ? 'Gestão' : 
                    dominantArea.area === 'educacao' ? 'Educação' : 
                    dominantArea.area === 'comunicacao' ? 'Comunicação' :
                    dominantArea.area === 'logica' ? 'Lógica' : dominantArea.area;
    
    const shareText = `🎯 Descobri meu perfil vocacional na Escola Habilidade!
    
📊 Meu perfil dominante: ${areaName} (${dominantArea.score}%)
${getPersonalizedMessage(results)}

✅ Resultado baseado em metodologia científica de MIT, Harvard e Stanford
📍 Cursos presenciais em Florianópolis, São José e Palhoça

Faça seu teste gratuito: https://escolahabilidade.com/teste-vocacional
#TesteVocacional #EscolaHabilidade #Florianópolis`;

    if (navigator.share) {
      // API Web Share (móvel)
      try {
        await navigator.share({
          title: 'Meu Resultado do Teste Vocacional - Escola Habilidade',
          text: shareText,
          url: 'https://escolahabilidade.com/teste-vocacional'
        });
        // Track compartilhamento bem sucedido
        analytics.trackResultShared('native_share');
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare(shareText);
        }
      }
    } else {
      fallbackShare(shareText);
    }
  };

  // Função alternativa de compartilhamento
  const fallbackShare = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Texto copiado! Cole em suas redes sociais para compartilhar 📋');
        // Track compartilhamento via clipboard
        analytics.trackResultShared('clipboard');
      }).catch(() => {
        openWhatsAppShare(text);
      });
    } else {
      openWhatsAppShare(text);
    }
  };

  // Abrir WhatsApp com texto pré-preenchido
  const openWhatsAppShare = (text) => {
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    // Track compartilhamento via WhatsApp
    analytics.trackResultShared('whatsapp');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCourses(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Analytics para perfis combinados e compatibilidade de cursos
  useEffect(() => {
    // Preparar dados para analytics
    const topAreas = results.sort((a, b) => b.score - a.score).slice(0, 3);
    const [first, second] = topAreas;
    
    // Determinar tipo de perfil
    const combinedProfiles = {
      'tecnologia-logica': 'Tecnológico-Analítico',
      'tecnologia-criatividade': 'Tecnológico-Criativo',
      'tecnologia-design': 'Tecnológico-Visual',
      'design-marketing': 'Criativo-Estratégico',
      'design-comunicacao': 'Visual-Comunicativo',
      'marketing-gestao': 'Comercial-Estratégico',
      'marketing-comunicacao': 'Comunicativo-Persuasivo',
      'gestao-logica': 'Gerencial-Analítico',
      'gestao-educacao': 'Líder-Educador',
      'educacao-comunicacao': 'Educativo-Comunicativo',
      'logica-gestao': 'Analítico-Organizacional'
    };
    
    const profileKey = `${first.area}-${second.area}`;
    const profileType = combinedProfiles[profileKey] || `${first.area}-dominante`;
    
    // Track perfil combinado
    analytics.trackCombinedProfile(topAreas, profileType);
    
    // Track compatibilidade de cursos
    analytics.trackCourseCompatibility(recommendedCourses, {
      primaryArea: first.area,
      secondaryArea: second.area
    });
  }, [results, recommendedCourses]);

  return (
    <motion.div
      ref={resultsRef}
      key="vocational-results-dashboard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      {/* Container específico para PDF (exclui botões de ação) */}
      <div ref={pdfContentRef}>
      {/* Header dos Resultados */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Star className="text-white" size={40} />
        </motion.div>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <Trophy className="text-[#d400ff]" size={24} />
          <span className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
            Análise Científica MIT • Harvard • Stanford
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Seu Perfil Vocacional Está Pronto! 🎉
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          <strong>Baseado em metodologias validadas por 2+ milhões de estudantes:</strong><br />
          {getPersonalizedMessage(results)}
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Gráfico Radar */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ChartPie className="text-[#d400ff]" size={20} />
              <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Metodologia RIASEC - Stanford
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Seu Perfil Profissional</h3>
            <p className="text-gray-600">Análise científica das suas afinidades por área</p>
          </div>
          
          <div className="flex justify-center">
            <RadarChart data={radarData} size={300} />
          </div>
        </motion.div>

        {/* Ranking das Áreas */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-6">
            <ChartBar className="text-[#d400ff]" size={20} />
            <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Modelo VIPS - MIT
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Análise Completa de Todas as Áreas</h3>
          <p className="text-gray-600 mb-6">Veja sua pontuação em todas as 8 áreas vocacionais analisadas</p>
          
          <BarChart data={results.sort((a, b) => b.score - a.score)} />
        </motion.div>
      </div>

      {/* Cursos Recomendados */}
      {showCourses && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-[#d400ff] to-purple-600 rounded-2xl p-8 text-white mb-8"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="text-white" size={24} />
              <span className="text-sm uppercase tracking-wide text-purple-100 font-semibold">
                Metodologia MIT • Harvard • Stanford
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-4">Cursos Cientificamente Recomendados 🎯</h3>
            <p className="text-purple-100 text-lg">
              Baseado na análise do seu perfil VIPS, estes cursos têm alta compatibilidade com você em Florianópolis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {recommendedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <course.icon className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{course.name}</h4>
                    <p className="text-purple-100 text-sm">{course.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-purple-100 mb-4">{course.description}</p>
                
                {/* Badge de Compatibilidade */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white/20 rounded-full px-3 py-1 flex items-center gap-2">
                    <Star size={14} className="text-yellow-300" />
                    <span className="text-white text-sm font-semibold">
                      {course.compatibilityPercentage}% Compatible
                    </span>
                  </div>
                  <span className="text-purple-100 text-xs">
                    Baseado no seu perfil científico
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm">Duração: {course.duration}</span>
                  <span className="font-bold">{course.price}</span>
                </div>
                
                <motion.a
                  href={`https://wa.me/5548988559491?text=${encodeURIComponent(
                    `Olá! Fiz o teste vocacional científico e obtive ${dominantArea.score}% de afinidade com ${
                      dominantArea.area === 'gestao' ? 'Gestão' : 
                      dominantArea.area === 'educacao' ? 'Educação' : 
                      dominantArea.area === 'comunicacao' ? 'Comunicação' :
                      dominantArea.area === 'logica' ? 'Lógica' : 
                      dominantArea.area.charAt(0).toUpperCase() + dominantArea.area.slice(1)
                    }.\n\n` +
                    `O curso ${course.name} foi recomendado para meu perfil.\n` +
                    `Gostaria de saber mais sobre:\n` +
                    `• Valores e formas de pagamento\n` +
                    `• Horários disponíveis\n` +
                    `• Início das próximas turmas\n` +
                    `• Local das aulas (Florianópolis, São José ou Palhoça)`
                  )}`}
                  className="w-full bg-white text-[#d400ff] py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChatCircle size={18} />
                  Quero Este Curso
                </motion.a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer para PDF - Informações de contato */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mt-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <LogoH 
            size="small"
            animated={true}
            showFullText={true}
            textColor="text-gray-700"
            className="opacity-80"
          />
        </div>
        <p className="text-gray-600 text-sm mb-2">
          Transformando carreiras através da tecnologia • Grande Florianópolis
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Phone size={12} />
            (48) 98855-9491
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            Florianópolis • São José • Palhoça
          </span>
          <span>www.escolahabilidade.com</span>
        </div>
      </div>
      </div>

      {/* Ações */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href={`https://wa.me/5548988559491?text=${encodeURIComponent(
              `Olá! Acabei de fazer o teste vocacional científico e meus resultados foram:\n\n` +
              `🎯 Perfil Dominante: ${dominantArea.area === 'gestao' ? 'Gestão' : 
                dominantArea.area === 'educacao' ? 'Educação' : 
                dominantArea.area === 'comunicacao' ? 'Comunicação' :
                dominantArea.area === 'logica' ? 'Lógica' : 
                dominantArea.area.charAt(0).toUpperCase() + dominantArea.area.slice(1)} (${dominantArea.score}%)\n\n` +
              `📊 Top 3 Áreas:\n` +
              results.sort((a, b) => b.score - a.score).slice(0, 3).map((r, i) => 
                `${i + 1}. ${r.area === 'gestao' ? 'Gestão' : 
                  r.area === 'educacao' ? 'Educação' : 
                  r.area === 'comunicacao' ? 'Comunicação' :
                  r.area === 'logica' ? 'Lógica' : 
                  r.area.charAt(0).toUpperCase() + r.area.slice(1)}: ${r.score}%`
              ).join('\n') + `\n\n` +
              `📚 Cursos Recomendados:\n` +
              recommendedCourses.map(course => 
                `• ${course.name} - ${course.subtitle}`
              ).join('\n') + `\n\n` +
              `Gostaria de saber mais detalhes sobre os cursos e valores!`
            )}`}
            className="bg-[#d400ff] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-purple-600 transition-all duration-300 inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 0, 255, 0.4)" }}
          >
            <ChatCircle size={20} />
            Falar Conosco
          </motion.a>
          
          <motion.button
            onClick={onRestart}
            className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <ArrowsClockwise size={20} />
            Refazer Teste
          </motion.button>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <motion.button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: isGeneratingPDF ? 1 : 1.05 }}
            whileTap={{ scale: isGeneratingPDF ? 1 : 0.95 }}
          >
            <DownloadSimple size={14} />
            {isGeneratingPDF ? (
              pdfProgress.message || 'Gerando PDF...'
            ) : (
              'Resultado em PDF'
            )}
          </motion.button>
          
          <motion.button
            onClick={shareResults}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShareNetwork size={14} />
            Compartilhar
          </motion.button>
          
          <a
            href="tel:+5548988559491"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300"
          >
            <Phone size={14} />
            (48) 98855-9491
          </a>
        </div>
      </div>
    </motion.div>
  );
};

// Componente Principal
const TesteVocacional = () => {
  const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'test', 'results'
  const [results, setResults] = useState(null);
  
  // Track page view on mount
  useEffect(() => {
    console.log('🎯 TESTE VOCACIONAL: Component mounted');
    console.log('📊 TESTE VOCACIONAL: Initial state - step:', currentStep);
    analytics.trackTestPageView();
  }, []);


  const handleStartTest = () => {
    console.log('🚀 TESTE VOCACIONAL: Starting test');
    setCurrentStep('test');
    // Track início do teste
    analytics.trackTestStart();
    analytics.measureTestDuration.start();
    
    // Scroll automático para o início do teste com delay mínimo
    setTimeout(() => {
      const testSection = document.getElementById('teste-section');
      if (testSection) {
        testSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };

  const handleTestComplete = (testResults) => {
    console.log('✅ TESTE VOCACIONAL: Test completed', testResults);
    setResults(testResults);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setResults(null);
    // Track reiniciar teste
    analytics.trackTestRestart();
  };


  return (
    <>
      <Helmet>
        <title>Teste Vocacional Científico - Metodologia MIT, Harvard, Stanford | Escola Habilidade</title>
        <meta 
          name="description" 
          content="Descubra seu curso ideal com nosso teste vocacional científico baseado em metodologias de MIT, Harvard e Stanford. Florianópolis, São José, Palhoça." 
        />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
            
            body {
              font-family: 'Montserrat', sans-serif;
            }
            
            html {
              scroll-behavior: smooth;
            }
          `}
        </style>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {currentStep === 'intro' && <Hero />}

        <main className={currentStep === 'intro' ? 'pt-0' : 'pt-20'}>
        {currentStep === 'intro' && (
          <motion.section 
            key="vocational-test-intro-section" 
            id="teste" 
            className="py-20 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center max-w-4xl mx-auto"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mb-6">
                    <Trophy className="text-[#d400ff]" size={20} />
                    <span className="text-[#d400ff] font-bold text-sm uppercase tracking-wide">
                      Metodologia MIT • Harvard • Stanford
                    </span>
                  </div>
                </div>
                
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Teste Vocacional Científico - Como Funciona?
                </h2>
                
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="text-[#d400ff]" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Responda</h3>
                    <p className="text-gray-600">13 perguntas científicas baseadas no modelo VIPS (Valores, Interesses, Personalidade, Habilidades)</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Pulse className="text-[#d400ff]" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Analisamos</h3>
                    <p className="text-gray-600">Análise baseada no modelo Holland RIASEC validado por universidades mundiais</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="text-[#d400ff]" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Recomendamos</h3>
                    <p className="text-gray-600">Cursos personalizados com base no seu resultado</p>
                  </div>
                </div>

                <motion.button
                  onClick={handleStartTest}
                  className="bg-[#d400ff] text-white px-12 py-6 rounded-full font-bold text-xl hover:bg-purple-600 transition-all duration-300 inline-flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brain size={24} />
                  Iniciar Teste Agora
                  <CaretRight size={20} />
                </motion.button>
              </motion.div>
            </div>
          </motion.section>
        )}

        {currentStep === 'test' && (
          <motion.section 
            key="vocational-test-questions-section"
            id="teste-section" 
            className="py-20 bg-gray-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="container mx-auto px-4">
              <DOMErrorBoundary 
                className="max-w-4xl mx-auto"
                fallbackChildren={
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Brain className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Teste Vocacional
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Recarregue a página para continuar com o teste.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-[#d400ff] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 transition-all duration-300"
                    >
                      Recarregar Página
                    </button>
                  </div>
                }
              >
                <VocationalTest onComplete={handleTestComplete} />
              </DOMErrorBoundary>
            </div>
          </motion.section>
        )}

        {currentStep === 'results' && (
          <motion.section 
            key="vocational-test-results-section"
            className="py-20 bg-gray-50"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="container mx-auto px-4">
              <DOMErrorBoundary 
                className="max-w-6xl mx-auto"
                fallbackChildren={
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Star className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Resultados do Teste
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Houve um problema ao exibir seus resultados. Tente recarregar a página.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-[#d400ff] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 transition-all duration-300"
                      >
                        Recarregar Página
                      </button>
                      <button
                        onClick={handleRestart}
                        className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-3 rounded-full font-bold hover:bg-[#d400ff] hover:text-white transition-all duration-300"
                      >
                        Refazer Teste
                      </button>
                    </div>
                  </div>
                }
              >
                <ResultsDashboard results={results} onRestart={handleRestart} />
              </DOMErrorBoundary>
            </div>
          </motion.section>
        )}
      </main>

      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/5548988559491?text=Olá! Gostaria de saber mais sobre os cursos da Escola Habilidade."
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 20px rgba(212, 0, 255, 0.5)"
        }}
        animate={{ 
          y: [0, -5, 0],
        }}
        transition={{ 
          y: { duration: 2, repeat: Infinity }
        }}
      >
        <ChatCircle className="text-white" size={24} />
      </motion.a>

      {/* Schema.org para SEO Local */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Escola Habilidade - Teste Vocacional",
          "description": "Teste vocacional gratuito para descobrir o curso ideal em Florianópolis, São José e Palhoça",
          "url": "https://escolahabilidade.com/teste-vocacional",
          "areaServed": [
            {
              "@type": "City",
              "name": "Florianópolis"
            },
            {
              "@type": "City", 
              "name": "São José"
            },
            {
              "@type": "City",
              "name": "Palhoça"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "R. Caetano José Ferreira, 426 - Sala 5",
            "addressLocality": "Kobrasol",
            "addressRegion": "SC",
            "postalCode": "88102-280",
            "addressCountry": "BR"
          },
          "telephone": "+55-48-98855-9491",
          "offers": [
            {
              "@type": "Service",
              "name": "Teste Vocacional Gratuito",
              "description": "Descubra qual curso combina com seu perfil"
            }
          ]
        })
      }} />
      </div>
    </>
  );
};

export default TesteVocacional;