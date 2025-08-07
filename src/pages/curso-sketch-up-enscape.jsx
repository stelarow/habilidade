import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
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
import { useNavigate } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';

// Componente Header da página do curso
const CourseHeader = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-[#d400ff] transition-colors"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft size={20} />
              <span>Voltar</span>
            </motion.button>
            <img 
              src="/logo-escola-habilidade.png" 
              alt="Escola Habilidade" 
              className="h-10 w-auto"
              onError={(error) => {
                error.target.src = "https://escolahabilidade.com/wp-content/uploads/2024/06/Design-sem-nome-7.png";
              }}
            />
          </div>
          <motion.a
            href="https://wa.me/5548984587067"
            className="bg-[#d400ff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#b300dd] transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px #d400ff55" }}
          >
            Matricule-se Agora
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
};

// Componente Hero do Curso
const CourseHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-[#110011] to-black"></div>
      
      {/* Background com renderização 3D */}
      <div className="absolute inset-0">
        <img 
          src="/assets/cursos/sketchup-enscape/architectural-render-bg.jpeg"
          alt="Renderização Arquitetônica"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo textual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <motion.div 
                className="flex items-center gap-2 bg-[#d400ff]/20 text-[#d400ff] px-4 py-2 rounded-full text-sm font-semibold"
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
              Do <span className="text-[#d400ff]">Esboço</span> ao <span className="text-[#d400ff]">Render</span>
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
                <div className="text-2xl font-bold text-[#d400ff]">56h</div>
                <div className="text-gray-400 text-sm">Carga Horária</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#d400ff]">28</div>
                <div className="text-gray-400 text-sm">Aulas Práticas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#d400ff]">6</div>
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
                href="https://wa.me/5548984587067"
                className="bg-[#d400ff] text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 justify-center hover:bg-[#b300dd] transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px #d400ff88" }}
              >
                <MessageCircle size={20} />
                Garanta sua Vaga - 10x R$ 399,90
              </motion.a>
              
              <motion.a
                href="https://wa.me/5548984587067"
                className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center gap-2 justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <MessageCircle size={20} />
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
                  src="/assets/cursos/sketchup-enscape/render-1.jpeg"
                  alt="Renderização Interior"
                  className="rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-[#d400ff]/30"
                />
                <img 
                  src="/assets/cursos/sketchup-enscape/render-2.jpeg"
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
                  src="/assets/cursos/sketchup-enscape/render-3.jpeg"
                  alt="Renderização Cozinha"
                  className="rounded-xl shadow-2xl w-full h-32 object-cover"
                />
                <img 
                  src="/assets/cursos/sketchup-enscape/render-4.jpeg"
                  alt="Renderização Quarto"
                  className="rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-[#d400ff]/30"
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
              Transforme suas <span className="text-[#d400ff]">ideias</span> em projetos profissionais
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Aprenda a criar desde esboços simples até renderizações fotorrealísticas 
              que impressionam clientes e garantem aprovação de projetos.
            </p>
            
            {/* Destaque para aulas presenciais */}
            <div className="bg-[#d400ff]/10 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CalendarCheck className="text-[#d400ff]" size={32} />
                <h3 className="text-2xl font-bold text-gray-900">Aulas 100% Presenciais</h3>
              </div>
              <p className="text-gray-700">
                Aprendizado hands-on em nossa sede equipada com computadores modernos e software atualizado. 
                Acompanhamento individual e networking com colegas da área.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-[#d400ff] font-semibold">
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
              <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
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
const ModuleSection = ({ title, lessons, icon: IconComponent }) => {
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
            <div className={`w-12 h-12 bg-[#d400ff] rounded-lg flex items-center justify-center`}>
              <IconComponent className="text-white" size={24} />
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
                <div className="w-8 h-8 bg-[#d400ff] rounded-full flex items-center justify-center">
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
    <section className="py-20 bg-gradient-radial from-[#110011] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Grade <span className="text-[#d400ff]">Curricular</span>
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
          />
          
          <ModuleSection 
            title="Enscape - Renderização Fotorrealística"
            icon={Camera}
            lessons={enscapeLessons}
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
            Projetos que você vai <span className="text-[#d400ff]">criar</span>
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

// Componente Empresas Atendidas
const CompaniesSection = () => {
  const companies = [
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
      name: "Serralheria Mota",
      logo: "/assets/cursos/sketchup-enscape/l5v_ub2GBPsN8c9qczmU6.jpeg",
      description: "Serralheria e Metalurgia"
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
    },
    {
      name: "Marcenaria JP",
      logo: "/assets/cursos/sketchup-enscape/sXBkejmP3TgFhiLFB-2NM.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Ousadia",
      logo: "/assets/cursos/sketchup-enscape/p4GIB7Eemw3frRpbKG2zR.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Escadas Imperatriz",
      logo: "/assets/cursos/sketchup-enscape/PLOSn09XPv1Fkg_lJVsAG.jpeg",
      description: "Escadas e Estruturas"
    },
    {
      name: "Pedra Granada",
      logo: "/assets/cursos/sketchup-enscape/kI8JxlGaNQo0Ecg5B1uEP.jpeg",
      description: "Marmoraria"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empresas regionais que fizeram nosso curso de <span className="text-[#d400ff]">projetista</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Empresas da região que confiaram na Escola Habilidade para capacitar seus profissionais em projetos
          </p>
        </motion.div>

        {/* Carrossel infinito de logos */}
        <div className="relative overflow-hidden max-w-7xl mx-auto">
          <motion.div 
            className="flex space-x-8"
            animate={{
              x: [0, -(208 * companies.length)] // 200px largura + 32px gap (8 * 4px)
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 120, // 120 segundos para completar um loop (2x mais lento)
                ease: "linear"
              }
            }}
          >
            {/* Primeira sequência de logos */}
            {companies.map((company, index) => (
              <motion.div
                key={`first-${index}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
                  scale: 1.05
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{company.name}</h3>
                  <p className="text-xs text-gray-600">{company.description}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Segunda sequência de logos (para continuidade perfeita) */}
            {companies.map((company, index) => (
              <motion.div
                key={`second-${index}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
                  scale: 1.05
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{company.name}</h3>
                  <p className="text-xs text-gray-600">{company.description}</p>
                </div>
              </motion.div>
            ))}
            
            {/* Terceira sequência para garantir continuidade */}
            {companies.slice(0, 3).map((company, index) => (
              <motion.div
                key={`third-${index}`}
                className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0"
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
                  scale: 1.05
                }}
              >
                <div className="w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                  <img 
                    src={company.logo}
                    alt={company.name}
                    className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{company.name}</h3>
                  <p className="text-xs text-gray-600">{company.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Gradientes nas bordas para efeito de fade */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        </div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[#d400ff] mb-2">50+</div>
            <div className="text-gray-600">Empresas Atendidas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#d400ff] mb-2">200+</div>
            <div className="text-gray-600">Projetos Entregues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#d400ff] mb-2">95%</div>
            <div className="text-gray-600">Taxa de Aprovação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#d400ff] mb-2">4.9★</div>
            <div className="text-gray-600">Avaliação Média</div>
          </div>
        </motion.div>
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
    <section className="py-20 bg-gradient-radial from-[#110011] to-black">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            O que dizem nossos <span className="text-[#d400ff]">alunos</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-[#1b1b1f] border border-[#d400ff33] rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                boxShadow: "0 0 20px #d400ff55",
                scale: 1.02
              }}
            >
              <div className="w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4">
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
    <section className="relative py-20 overflow-hidden">
      {/* Background com foto de projeto */}
      <div className="absolute inset-0">
        <img 
          src="/assets/cursos/sketchup-enscape/cta-background.jpeg"
          alt="Projeto Arquitetônico"
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90"></div>
        {/* Overlay roxo sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#d400ff]/20 via-transparent to-[#d400ff]/20"></div>
      </div>

      {/* Elementos flutuantes sutis */}
      <div className="absolute inset-0">
        {Array.from({length: 15}).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-[#d400ff] rounded-full"
            style={{
              left: `${(index * 23.7) % 100}%`, // Deterministic positioning
              top: `${(index * 47.3) % 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: (index * 0.3) % 5, // Deterministic delay
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
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#d400ff]/20 to-purple-600/20 backdrop-blur-sm border border-[#d400ff]/30 text-white px-6 py-3 rounded-xl text-lg font-semibold mb-6"
            animate={{ 
              boxShadow: [
                "0 0 20px rgba(212, 0, 255, 0.3)",
                "0 0 30px rgba(212, 0, 255, 0.5)",
                "0 0 20px rgba(212, 0, 255, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle size={20} className="text-[#d400ff]" />
            </motion.div>
            <span className="bg-gradient-to-r from-white to-[#d400ff] bg-clip-text text-transparent">
              OFERTA LIMITADA
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-yellow-300 font-bold">15 vagas restantes</span>
          </motion.div>
          <p className="text-xl text-gray-200 mb-4 max-w-3xl mx-auto">
            <span className="line-through text-gray-400 text-lg">De R$ 4.999,00</span>
            <br />
            <strong className="text-3xl text-white">Por apenas R$ 3.999,00 à vista</strong>
            <br />
            <span className="text-xl">ou <strong className="text-green-400">10x de R$ 399,90</strong> sem juros</span>
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
              href="https://wa.me/5548984587067"
              className="bg-gradient-to-r from-[#d400ff] to-[#b300dd] text-white px-12 py-6 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:from-[#b300dd] hover:to-[#9000bb] transition-all duration-300 shadow-2xl"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 40px #d400ff88",
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle size={24} />
              Garantir Vaga - 10x R$ 399,90
            </motion.a>
            
            <motion.button
              className="border-2 border-[#d400ff] text-[#d400ff] px-8 py-6 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px #d400ff44" 
              }}
            >
              Tenho Dúvidas
            </motion.button>
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
      <div className="container mx-auto px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Informações de Localização */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="text-[#d400ff]" size={24} />
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
                className="inline-flex items-center gap-2 mt-4 text-[#d400ff] hover:text-[#b300dd] font-semibold"
                whileHover={{ x: 2 }}
              >
                <ExternalLink size={16} />
                Abrir no Google Maps
              </motion.a>
            </div>

            {/* Informações de Contato */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="text-[#d400ff]" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Contato Direto</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">WhatsApp / Telefone</p>
                  <p className="text-xl font-bold text-gray-900">(48) 98458-7067</p>
                </div>
                <motion.a
                  href="https://wa.me/5548984587067?text=Olá! Gostaria de mais informações sobre o curso Do Esboço ao Render."
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
const CursoSketchUpEnscape = () => {
  return (
    <div className="font-montserrat">
      <Helmet>
        <title>Curso SketchUp + Enscape - Do Esboço ao Render | Escola Habilidade</title>
        <meta name="description" content="Domine SketchUp + Enscape para criar projetos arquitetônicos profissionais com renderizações fotorrealísticas. 56h de curso, 28 aulas práticas, 6 projetos completos. Aulas presenciais em São José/SC." />
        <meta name="keywords" content="curso sketchup, curso enscape, renderização 3d, arquitetura, design, são josé sc, escola habilidade" />
        <meta property="og:title" content="Curso SketchUp + Enscape - Do Esboço ao Render" />
        <meta property="og:description" content="Aprenda a criar projetos arquitetônicos profissionais com renderizações fotorrealísticas que impressionam clientes." />
        <meta property="og:image" content="/assets/cursos/sketchup-enscape/architectural-render-bg.jpeg" />
        <link rel="canonical" href="https://escolahabilidade.com/cursos/sketchup-enscape" />
      </Helmet>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, #110011, #000000);
        }
        
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      
      <CourseHeader />
      <CourseHero />
      <AboutCourse />
      <Curriculum />
      <CourseProjects />
      <CompaniesSection />
      <CourseTestimonials />
      <FinalCTA />
      
      {/* Floating WhatsApp */}
      <motion.a
        href="https://wa.me/5548984587067"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center shadow-lg"
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 0 20px #d400ff88"
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

export default CursoSketchUpEnscape;