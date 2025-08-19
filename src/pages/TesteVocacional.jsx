import React, { useState, useEffect, useRef, Component, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from '@dr.pogodin/react-helmet';
import LogoH from '../components/LogoH';
import { analytics } from '../utils/analytics';
import { generatePDF as generatePDFWorker, onLoadProgress } from '../utils/pdfWorker';
import { 
  Brain,
  Code,
  Palette,
  TrendingUp,
  Users,
  BookOpen,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Star,
  MessageCircle,
  Phone,
  Target,
  Award,
  Clock,
  Download,
  Share2,
  RefreshCw,
  User,
  Lightbulb,
  Camera,
  PieChart,
  BarChart3,
  Activity
} from 'lucide-react';

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
    question: "O que mais te motiva em uma carreira?",
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
      { text: "Laboratório/escritório com tecnologia avançada", scores: { tecnologia: 3, logica: 2, design: 1 } },
      { text: "Interação direta com pessoas e comunidade", scores: { educacao: 3, comunicacao: 3, marketing: 1 } },
      { text: "Escritório corporativo com reuniões e apresentações", scores: { gestao: 3, marketing: 2, comunicacao: 2 } },
      { text: "Estúdio criativo com liberdade de expressão", scores: { design: 3, criatividade: 3, marketing: 1 } },
      { text: "Ambiente estruturado com processos bem definidos", scores: { logica: 3, gestao: 2, tecnologia: 1 } }
    ]
  },
  {
    id: 3,
    section: "Valores Profissionais", 
    question: "Qual é sua principal motivação no trabalho?",
    answers: [
      { text: "Autonomia e flexibilidade para inovar", scores: { tecnologia: 2, criatividade: 3, design: 2 } },
      { text: "Reconhecimento e impacto social do meu trabalho", scores: { educacao: 3, comunicacao: 2, marketing: 1 } },
      { text: "Crescimento na carreira e liderança", scores: { gestao: 3, marketing: 2, comunicacao: 1 } },
      { text: "Estabilidade e segurança financeira", scores: { logica: 2, gestao: 2, tecnologia: 2 } },
      { text: "Desafios intelectuais constantes", scores: { tecnologia: 3, logica: 3, criatividade: 1 } }
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
    icon: TrendingUp,
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
    icon: BarChart3,
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
    icon: Activity,
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
            Em apenas 8 perguntas científicas, descubra o curso da Escola Habilidade que mais combina com você. <strong className="text-[#d400ff]">Metodologia inspirada no MIT, Harvard e Stanford</strong> — disponível para toda a <span className="text-[#d400ff] font-semibold">Grande Florianópolis</span>.
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
              <Award size={16} className="text-[#d400ff]" />
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
            <ArrowRight size={20} />
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
              <BarChart3 className="text-[#d400ff]" size={32} />
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
    const question = questions[currentQuestion];
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

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        // Track progresso
        analytics.trackTestProgress(currentQuestion + 2, questions.length);
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

    // Normalizar para porcentagem
    const maxScore = Math.max(...Object.values(totals));
    const normalizedResults = Object.entries(totals).map(([area, score]) => ({
      area,
      score: Math.round((score / maxScore) * 100)
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto" key="vocational-test-container">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
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
                <ArrowRight className="text-[#d400ff] opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
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
            <ArrowLeft size={16} />
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
  const recommendedCourses = courses.filter(course => 
    course.areas.includes(dominantArea.area)
  ).slice(0, 2);

  // Mensagens personalizadas por perfil
  const getPersonalizedMessage = (area) => {
    const messages = {
      tecnologia: "Você tem um perfil técnico e analítico! Adora resolver problemas usando lógica e criar soluções inovadoras.",
      design: "Sua criatividade é seu diferencial! Você tem olhar estético apurado e gosta de trabalhar com elementos visuais.",
      marketing: "Você é um comunicador nato! Tem facilidade para persuadir e entende como conectar pessoas a produtos/serviços.",
      gestao: "Líder por natureza! Você tem facilidade para organizar, planejar e coordenar pessoas e projetos.",
      educacao: "Ensinar é sua vocação! Você tem paciência e satisfação em transmitir conhecimento para outras pessoas.",
      criatividade: "Sua mente criativa é sua maior força! Você pensa fora da caixa e adora inovar.",
      comunicacao: "Comunicação é seu talento! Você se expressa bem e consegue convencer pessoas facilmente.",
      logica: "Raciocínio lógico é seu forte! Você resolve problemas de forma sistemática e organizada."
    };
    return messages[area] || "Você tem um perfil único e diversificado!";
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
    analytics.trackPDFDownloaded(dominantArea.area);
    
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
${getPersonalizedMessage(dominantArea.area)}

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
          <Award className="text-[#d400ff]" size={24} />
          <span className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
            Análise Científica MIT • Harvard • Stanford
          </span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Seu Perfil Vocacional Está Pronto! 🎉
        </h2>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          <strong>Baseado em metodologias validadas por 2+ milhões de estudantes:</strong><br />
          {getPersonalizedMessage(dominantArea.area)}
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
              <PieChart className="text-[#d400ff]" size={20} />
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
            <BarChart3 className="text-[#d400ff]" size={20} />
            <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
              Modelo VIPS - MIT
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Ranking Científico de Afinidades</h3>
          
          <div className="space-y-4">
            {results
              .sort((a, b) => b.score - a.score)
              .map((result, index) => (
                <motion.div
                  key={result.area}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-[#d400ff]' : index === 1 ? 'bg-purple-400' : 'bg-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800 capitalize">
                      {result.area === 'gestao' ? 'Gestão' : 
                       result.area === 'educacao' ? 'Educação' : 
                       result.area === 'comunicacao' ? 'Comunicação' :
                       result.area === 'logica' ? 'Lógica' : result.area}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-[#d400ff]' : index === 1 ? 'bg-purple-400' : 'bg-gray-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, delay: 1.2 + index * 0.1 }}
                      />
                    </div>
                    <span className="font-bold text-gray-700 w-12 text-right">
                      {result.score}%
                    </span>
                  </div>
                </motion.div>
              ))}
          </div>
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
              <Award className="text-white" size={24} />
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
                  <MessageCircle size={18} />
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
            <MessageCircle size={20} />
            Falar Conosco
          </motion.a>
          
          <motion.button
            onClick={onRestart}
            className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <RefreshCw size={20} />
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
            <Download size={14} />
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
            <Share2 size={14} />
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
                    <Award className="text-[#d400ff]" size={20} />
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
                    <p className="text-gray-600">8 perguntas científicas baseadas no modelo VIPS (Valores, Interesses, Personalidade, Habilidades)</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Activity className="text-[#d400ff]" size={32} />
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
                  <ArrowRight size={20} />
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
        <MessageCircle className="text-white" size={24} />
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