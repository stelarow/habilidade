import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  Mail,
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

// Componente Header baseado no header original do site
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Skip Links */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-fuchsia-600 text-white px-4 py-2 rounded-md z-[60] transition-all"
      >
        Pular para o conteúdo principal
      </a>
      
      <header className="fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50 border-b border-gray-800/50" role="banner">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img 
                src="https://escolahabilidade.com/wp-content/uploads/2024/06/Design-sem-nome-7.png" 
                alt="Escola Habilidade" 
                className="h-10 w-auto"
              />
              <div className="hidden lg:block">
                <span className="block text-xs text-gray-400">
                  Tecnologia que transforma carreiras
                </span>
              </div>
            </div>

            {/* Navegação Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <a 
                href="https://escolahabilidade.com/cursos/"
                className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
              >
                Cursos
              </a>
              <a 
                href="https://escolahabilidade.com/#sobre"
                className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
              >
                Sobre
              </a>
              <a 
                href="https://escolahabilidade.com/#contato"
                className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
              >
                Contato
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {/* CTA Primário */}
              <motion.a
                href="https://wa.me/5548988559491?text=Olá! Gostaria de saber mais sobre os cursos da Escola Habilidade."
                className="hidden md:inline-flex bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 hover:from-fuchsia-700 hover:via-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 items-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }}
              >
                <Phone size={16} />
                Fale Conosco
              </motion.a>

              {/* Área do Aluno - Mobile Only */}
              <a
                href="https://ead.escolahabilidade.com"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 hover:from-fuchsia-700 hover:via-purple-700 hover:to-blue-700 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-fuchsia-500/25 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                title="Área do Aluno - Plataforma de Ensino"
                aria-label="Acessar área do aluno"
              >
                <User size={16} weight="bold" className="text-white" />
              </a>

              {/* WhatsApp Premium */}
              <motion.a
                href="https://wa.me/5548988559491?text=Olá! Gostaria de saber mais sobre os cursos da Escola Habilidade."
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                title="Falar no WhatsApp"
                aria-label="Entrar em contato via WhatsApp"
                whileHover={{ scale: 1.1 }}
              >
                <MessageCircle size={20} className="text-white" />
              </motion.a>
              
              {/* Botão Mobile */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                className="md:hidden flex flex-col justify-center gap-[3px] p-2 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm"
              >
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-zinc-900/95 border-t border-gray-800/50"
          >
            <nav className="px-4 py-4 space-y-3">
              <a 
                href="https://escolahabilidade.com/cursos/"
                className="block text-white hover:text-fuchsia-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cursos
              </a>
              <a 
                href="https://escolahabilidade.com/#sobre"
                className="block text-white hover:text-fuchsia-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre
              </a>
              <a 
                href="https://escolahabilidade.com/#contato"
                className="block text-white hover:text-fuchsia-300 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </a>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Overlay para fechar menu ao clicar fora */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

// Componente Hero
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Fundo com partículas */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
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
    const newAnswers = {
      ...answers,
      [currentQuestion]: { answerIndex, scores }
    };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      setIsCompleted(true);
      const results = calculateResults(newAnswers);
      setTimeout(() => {
        onComplete(results);
      }, 500);
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
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Pergunta {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round(progress)}% completo</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-[#d400ff] h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
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
  const resultsRef = useRef(null);

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

  // Função para gerar PDF do resultado
  const generatePDF = async () => {
    if (!resultsRef.current) return;
    
    setIsGeneratingPDF(true);
    
    try {
      // Capturar a área dos resultados
      const canvas = await html2canvas(resultsRef.current, {
        height: resultsRef.current.scrollHeight,
        width: resultsRef.current.scrollWidth,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#f9fafb'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calcular dimensões para o PDF
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Adicionar título
      pdf.setFontSize(20);
      pdf.setTextColor(212, 0, 255);
      pdf.text('Resultado do Teste Vocacional', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Escola Habilidade - Metodologia MIT, Harvard e Stanford', pageWidth / 2, 30, { align: 'center' });
      
      // Adicionar imagem dos resultados
      if (imgHeight > pageHeight - 40) {
        // Se a imagem for maior que uma página, redimensionar
        const scaledHeight = pageHeight - 40;
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
        pdf.addImage(imgData, 'PNG', (pageWidth - scaledWidth) / 2, 35, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, 'PNG', 0, 35, imgWidth, imgHeight);
      }
      
      // Adicionar informações de contato no rodapé
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Escola Habilidade - (48) 98855-9491', pageWidth / 2, pageHeight - 20, { align: 'center' });
      pdf.text('Florianópolis • São José • Palhoça - SC', pageWidth / 2, pageHeight - 15, { align: 'center' });
      pdf.text('www.escolahabilidade.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Salvar o PDF
      const hoje = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      pdf.save(`Teste-Vocacional-Escola-Habilidade-${hoje}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
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
      <AnimatePresence>
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
                    href={`https://wa.me/5548988559491?text=Olá! Fiz o teste vocacional e gostaria de saber mais sobre o curso ${course.name}.`}
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
      </AnimatePresence>

      {/* Ações */}
      <div className="text-center space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="https://wa.me/5548988559491?text=Olá! Acabei de fazer o teste vocacional científico e gostaria de saber mais sobre os cursos recomendados."
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
            {isGeneratingPDF ? 'Gerando PDF...' : 'Resultado em PDF'}
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

  const handleStartTest = () => {
    setCurrentStep('test');
  };

  const handleTestComplete = (testResults) => {
    setResults(testResults);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setCurrentStep('intro');
    setResults(null);
  };

  useEffect(() => {
    // SEO and meta tags
    document.title = "Teste Vocacional Científico - Metodologia MIT, Harvard, Stanford | Escola Habilidade";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Descubra seu curso ideal com nosso teste vocacional científico baseado em metodologias de MIT, Harvard e Stanford. Florianópolis, São José, Palhoça.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Descubra seu curso ideal com nosso teste vocacional científico baseado em metodologias de MIT, Harvard e Stanford. Florianópolis, São José, Palhoça.';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <Header />

      {currentStep === 'intro' && <Hero />}

      <main className="pt-20" id="main-content">
        {currentStep === 'intro' && (
          <section id="teste" className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
          </section>
        )}

        {currentStep === 'test' && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <VocationalTest onComplete={handleTestComplete} />
            </div>
          </section>
        )}

        {currentStep === 'results' && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
              <ResultsDashboard results={results} onRestart={handleRestart} />
            </div>
          </section>
        )}
      </main>

      {/* Footer com informações locais */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <img 
                src="https://escolahabilidade.com/wp-content/uploads/2024/06/Design-sem-nome-7.png" 
                alt="Escola Habilidade" 
                className="h-12 w-auto mb-4 opacity-80"
              />
              <p className="text-gray-400 mb-4">
                Cursos de tecnologia na Grande Florianópolis. 
                Transformando carreiras desde 2019.
              </p>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} />
                <span>Atendemos Florianópolis, São José e Palhoça</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Nossos Cursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/informatica/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Informática Completa
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/design-grafico/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Design Gráfico
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/programacao/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Programação Full-Stack
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/marketing-digital/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Marketing Digital
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/inteligencia-artificial/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Inteligência Artificial
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/business-intelligence/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Business Intelligence
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/projetista-3d/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Projetista 3D Completo
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/edicao-video/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Edição de Vídeo
                  </a>
                </li>
                <li>
                  <a 
                    href="https://escolahabilidade.com/cursos/administracao/" 
                    className="hover:text-white transition-colors duration-300 hover:underline"
                  >
                    Administração
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Contato</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(48) 98855-9491</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>alessandro.ferreira@escolahabilidade.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>R. Caetano José Ferreira, 426 - Kobrasol</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 Escola Habilidade. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Cursos em Florianópolis • São José • Palhoça - Santa Catarina
            </p>
          </div>
        </div>
      </footer>

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
  );
};

export default TesteVocacional;