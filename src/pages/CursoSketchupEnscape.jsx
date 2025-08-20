import React, { useState, useEffect } from 'react';
import { motion } from '../utils/lazyMotion.jsx';
import { 
  Clock,
  CheckCircle,
  MessageCircle,
  Box,
  Camera,
  Lightbulb,
  Target,
  ChevronDown,
  ExternalLink,
  MapPin,
  Phone,
  CalendarCheck,
  GraduationCap,
  Timer,
  AlertCircle
} from 'lucide-react';
import { CaretRight, House } from '@phosphor-icons/react';
import InteractiveLogo from '../components/header/InteractiveLogo';
import TrustedCompanies from '../components/TrustedCompanies';
import { Link } from 'react-router-dom';

// Componente Header padronizado da escola
const StandardCourseHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              <House size={16} weight="duotone" />
              Início
            </Link>
            <CaretRight size={14} className="text-gray-600 mx-1" />
            <Link to="/#cursos" className="text-gray-400 hover:text-white transition-colors">
              Cursos
            </Link>
            <CaretRight size={14} className="text-gray-600 mx-1" />
            <span className="font-medium text-purple-400" aria-current="page">
              SketchUp + Enscape
            </span>
          </nav>
          
          {/* Quick Course Info */}
          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Design e Arquitetura
            </div>
            <div>•</div>
            <div>Intermediário</div>
            <div>•</div>
            <div>56 horas</div>
            <div>•</div>
            <div className="flex items-center gap-1">
              <GraduationCap size={14} weight="duotone" className="text-purple-400" />
              Certificado
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 bg-zinc-900/70 backdrop-blur-md border-b border-gray-800/50`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            <InteractiveLogo />
            
            {/* Navigation Menu */}
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-6">
                <button
                  className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
                  onClick={() => scrollToSection('curriculum')}
                >
                  Currículo
                </button>
                <button
                  className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
                  onClick={() => scrollToSection('testimonials')}
                >
                  Depoimentos
                </button>
                <button
                  className="text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1"
                  onClick={() => scrollToSection('contact')}
                >
                  Contato
                </button>
              </nav>
              <motion.a
                href="https://wa.me/5548988559491"
                className="btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-2"
                whileHover={{ scale: 1.05 }}
              >
                Matricule-se Agora
              </motion.a>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

// Componente Hero do Curso
const CourseHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black to-black"></div>
      
      {/* Background com renderização 3D */}
      <div className="absolute inset-0">
        <img 
          src="/images/course/sketchup-enscape/architectural-render-bg.jpeg"
          alt="Renderização Arquitetônica"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo textual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <motion.div 
                className="flex items-center gap-2 bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GraduationCap size={16} />
                Aulas 100% Presenciais
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Do <span className="text-purple-400">Esboço</span> ao <span className="text-purple-400">Render</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Domine <strong className="text-white">SketchUp + Enscape</strong> para criar projetos arquitetônicos 
              profissionais com renderizações fotorrealísticas que impressionam clientes.
            </motion.p>

            {/* Estatísticas do curso */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">56h</div>
                <div className="text-gray-400 text-sm">Carga Horária</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">28</div>
                <div className="text-gray-400 text-sm">Aulas Práticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">6</div>
                <div className="text-gray-400 text-sm">Projetos Completos</div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.a
                href="https://wa.me/5548988559491"
                className="btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-3 text-base inline-flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={18} />
                Garanta sua Vaga - 10x R$ 279,30
              </motion.a>
              
              <motion.a
                href="https://wa.me/5548988559491"
                className="btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-3 text-base inline-flex items-center gap-2 justify-center border-2 border-white/20"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={18} />
                Fale com um Orientador
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Showcase de renderizações */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="space-y-4"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <img 
                  src="/images/course/sketchup-enscape/render-1.jpeg"
                  alt="Renderização Interior"
                  className="rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-purple-400/30"
                />
                <img 
                  src="/images/course/sketchup-enscape/render-2.jpeg"
                  alt="Renderização Exterior"
                  className="rounded-xl shadow-2xl w-full h-32 object-cover"
                />
              </motion.div>
              <motion.div 
                className="space-y-4 mt-8"
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <img 
                  src="/images/course/sketchup-enscape/render-3.jpeg"
                  alt="Renderização Cozinha"
                  className="rounded-xl shadow-2xl w-full h-32 object-cover"
                />
                <img 
                  src="/images/course/sketchup-enscape/render-4.jpeg"
                  alt="Renderização Quarto"
                  className="rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-purple-400/30"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Componente sobre o curso
const AboutCourse = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transforme suas <span className="text-purple-600">ideias</span> em projetos profissionais
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Aprenda a criar desde esboços simples até renderizações fotorrealísticas 
              que impressionam clientes e garantem aprovação de projetos.
            </p>
            
            {/* Destaque para aulas presenciais */}
            <div className="bg-purple-600/10 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CalendarCheck className="text-purple-600" size={32} />
                <h3 className="text-2xl font-bold text-gray-900">Aulas 100% Presenciais</h3>
              </div>
              <p className="text-gray-700">
                Aprendizado hands-on em nossa sede equipada com computadores modernos e software atualizado. 
                Acompanhamento individual e networking com colegas da área.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-purple-600 font-semibold">
                <MapPin size={16} />
                <span>Kobrasol - São José/SC</span>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Modelagem 3D</h3>
              <p className="text-gray-600">
                Domine todas as ferramentas do SketchUp para criar modelos 3D precisos e detalhados.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Renderização</h3>
              <p className="text-gray-600">
                Crie imagens fotorrealísticas com Enscape, incluindo iluminação e materiais profissionais.
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Projetos Reais</h3>
              <p className="text-gray-600">
                Desenvolva projetos completos: residências, interiores e documentação técnica.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente do Módulo de Aulas
const ModuleSection = ({ title, icon: Icon, lessons, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-${color} rounded-lg flex items-center justify-center`}>
              <Icon className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600">{lessons.length} aulas • {lessons.length * 2}h total</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="text-gray-400" size={24} />
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{lesson.name}</h4>
                  <p className="text-sm text-gray-600">{lesson.type}</p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={16} />
                  <span className="text-sm">{lesson.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Componente Grade Curricular
const Curriculum = () => {
  const sketchupLessons = [
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
  ];

  const enscapeLessons = [
    { name: "Introdução ao Enscape e Configuração Inicial", type: "Renderização", duration: "120 min" },
    { name: "Iluminação Natural e Artificial", type: "Renderização", duration: "120 min" },
    { name: "Materiais e Texturização no Enscape", type: "Renderização", duration: "120 min" },
    { name: "Câmeras e Enquadramentos Profissionais", type: "Renderização", duration: "120 min" },
    { name: "Configurações de Render e Qualidade", type: "Renderização", duration: "120 min" },
    { name: "Animações e Vídeos com Enscape", type: "Renderização", duration: "120 min" },
    { name: "Ambientes Externos e Vegetação", type: "Renderização", duration: "120 min" },
    { name: "Projeto Guiado Completo com Enscape", type: "Projeto", duration: "120 min" }
  ];

  return (
    <section id="curriculum" className="py-20 bg-gradient-to-br from-purple-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grade <span className="text-purple-400">Curricular</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Conteúdo estruturado para levar você do básico ao nível profissional
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          <ModuleSection 
            title="SketchUp - Modelagem 3D"
            icon={Box}
            lessons={sketchupLessons}
            color="purple-600"
          />
          
          <ModuleSection 
            title="Enscape - Renderização Fotorrealística"
            icon={Camera}
            lessons={enscapeLessons}
            color="purple-600"
          />
        </div>
      </div>
    </section>
  );
};

// Componente Projetos do Curso
const CourseProjects = () => {
  const projects = [
    {
      title: "Casa Residencial Completa",
      description: "Projeto de residência unifamiliar com fachada, interiores e terreno paisagístico",
      image: "/images/course/sketchup-enscape/project-1.jpeg"
    },
    {
      title: "Interiores de Luxo", 
      description: "Ambientes internos com materiais nobres, iluminação profissional e mobiliário",
      image: "/images/course/sketchup-enscape/project-2.jpeg"
    },
    {
      title: "Documentação Técnica",
      description: "Plantas, cortes, fachadas e detalhamentos técnicos usando Layout",
      image: "/images/course/sketchup-enscape/project-3.jpeg"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Projetos que você vai <span className="text-purple-600">criar</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Portfolio real para impressionar clientes e conseguir trabalhos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                <p className="text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


// Componente Depoimentos específicos
const CourseTestimonials = () => {
  const testimonials = [
    {
      name: "Jonatas Torres",
      initials: "JT",
      text: "Estou tendo uma excelente experiência com a escola habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando. A dinâmica das aulas, os exercícios práticos e o suporte oferecido fazem toda a diferença no aprendizado. Já estou colocando em prática o que aprendi. Recomendo fortemente a escola para quem deseja aprender SketchUp com qualidade, atenção individualizada e foco na aplicação prática. Vale muito a pena!"
    },
    {
      name: "Karolain Roberta Régis",
      initials: "KR",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi ja bastante coisas que ainda não sabia, estão super atualizados no mercado, eles tem deles mesmo até IA ajudando o pessoal nas medições e até em render rapidos, fora a apostila bem completa"
    },
    {
      name: "Rute Barboza",
      initials: "RB",
      text: "Fiz todos os cursos de projeto com o professor Alessandro, me ajudou demais a colocar as coisas que antes eram apenas sonhos nos meus projetos. Hoje meus clientes conseguem ver o projeto de uma forma realista por conta do meu aprendizado em renderização. Agradeço demais ao trabalho da Escola Habilidade e do professor!!!"
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
      text: "A escola apresenta uma boa estrutura, o professor é bem atencioso e prestativo, sempre pronto para esclarecer dúvidas durante e fora do horário de aula. Estou adorando."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-900 to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            O que dizem nossos <span className="text-purple-400">alunos</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-900/80 border border-purple-400/30 rounded-xl p-6 text-center backdrop-blur-sm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
                scale: 1.02
              }}
            >
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">
                  {testimonial.initials}
                </span>
              </div>
              <p className="text-gray-300 italic text-sm mb-4 leading-relaxed line-clamp-6">
                "{testimonial.text}"
              </p>
              <div className="font-bold text-white text-lg">{testimonial.name}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente CTA Final
const FinalCTA = () => {
  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background com foto de projeto */}
      <div className="absolute inset-0">
        <img 
          src="/images/course/sketchup-enscape/cta-background.jpeg"
          alt="Projeto Arquitetônico"
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
        {/* Overlay roxo sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20"></div>
      </div>

      {/* Elementos flutuantes sutis */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comece sua carreira de projetista hoje!
          </h2>
          <motion.div 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-400/30 text-white px-6 py-3 rounded-xl text-lg font-semibold mb-6"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(147, 51, 234, 0.3)",
                "0 0 30px rgba(147, 51, 234, 0.5)",
                "0 0 20px rgba(147, 51, 234, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle size={20} className="text-purple-400" />
            </motion.div>
            <span className="bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              OFERTA LIMITADA
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-yellow-300 font-bold">15 vagas restantes</span>
          </motion.div>
          <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
            <span className="line-through text-gray-400 text-lg">De R$ 4.655,00</span>
            <br />
            <strong className="text-3xl text-white">Por apenas R$ 2.793,00 à vista</strong>
            <br />
            <span className="text-xl">ou <strong className="text-green-400">10x de R$ 279,30</strong> sem juros</span>
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-gray-300 mb-8">
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Certificação profissional
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              6 projetos completos
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-400" />
              Suporte vitalício
            </span>
          </div>
          
          {/* Benefícios rápidos */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="flex flex-col items-center">
              <CheckCircle className="text-white mb-2" size={32} />
              <span className="text-white font-semibold">28 Aulas Práticas</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="text-white mb-2" size={32} />
              <span className="text-white font-semibold">Certificação</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="text-white mb-2" size={32} />
              <span className="text-white font-semibold">6 Projetos</span>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="text-white mb-2" size={32} />
              <span className="text-white font-semibold">Suporte Vitalício</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="https://wa.me/5548988559491"
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-12 py-6 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-2xl"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 40px rgba(147, 51, 234, 0.5)",
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={24} />
              Garantir Vaga - 10x R$ 279,30
            </motion.a>
            
            <motion.a
              href="https://wa.me/5548988559491"
              className="border-2 border-purple-400 text-purple-400 px-8 py-6 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)" 
              }}
            >
              Tenho Dúvidas
            </motion.a>
          </div>

          <div className="mt-6 space-y-3">
            <p className="flex items-center gap-2 justify-center text-yellow-400 font-semibold">
              <Timer size={16} />
              Oferta válida até 15/08/2025 ou enquanto durarem as vagas
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-300 text-sm">
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" />
                Pagamento em até 10x sem juros
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" />
                7 dias de garantia total
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={16} className="text-green-400" />
                Certificado incluso
              </span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Seção de Localização */}
      <div className="relative z-20 container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Informações de Localização */}
            <div className="relative z-30 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Nossa Localização</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-semibold">R. Caetano José Ferreira, 426</p>
                <p>Sala 5 - Kobrasol</p>
                <p>São José - SC, 88102-280</p>
              </div>
              <motion.a
                href="https://maps.google.com/maps?q=R.+Caetano+José+Ferreira,+426,+Sala+5+-+Kobrasol,+São+José+-+SC,+88102-280"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                whileHover={{ x: 2 }}
              >
                <ExternalLink size={16} />
                Abrir no Google Maps
              </motion.a>
            </div>

            {/* Informações de Contato */}
            <div className="relative z-30 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-purple-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Contato Direto</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">WhatsApp / Telefone</p>
                  <p className="text-xl font-bold text-gray-900">(48) 98855-9491</p>
                </div>
                <motion.a
                  href="https://wa.me/5548988559491?text=Olá! Gostaria de mais informações sobre o curso Do Esboço ao Render."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold"
                  whileHover={{ scale: 1.02 }}
                >
                  <MessageCircle size={16} />
                  Chamar no WhatsApp
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Componente principal da página
const CursoSketchupEnscape = () => {
  return (
    <div className="font-sans min-h-screen">
      
      <StandardCourseHeader />
      <CourseHero />
      <AboutCourse />
      <Curriculum />
      <CourseProjects />
      <TrustedCompanies variant="course" courseSlug="sketchup-enscape" />
      <CourseTestimonials />
      <FinalCTA />
      
      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/5548988559491"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)"
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
    </div>
  );
};

export default CursoSketchupEnscape;