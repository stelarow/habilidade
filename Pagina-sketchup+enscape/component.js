// <stdin>
import React, { useState, useEffect } from "https://esm.sh/react@18.2.0";
import { motion } from "https://esm.sh/framer-motion?deps=react@18.2.0,react-dom@18.2.0";
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  BookOpen,
  Play,
  CheckCircle,
  Star,
  MessageCircle,
  Download,
  Monitor,
  Box,
  Palette,
  Camera,
  Building,
  TreePine,
  Lightbulb,
  Target,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  Phone,
  CalendarCheck,
  GraduationCap,
  Timer,
  AlertCircle
} from "https://esm.sh/lucide-react?deps=react@18.2.0,react-dom@18.2.0";
var CourseHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return /* @__PURE__ */ React.createElement(
    motion.header,
    {
      className: `fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-md" : "bg-transparent"}`,
      initial: { y: -100 },
      animate: { y: 0 },
      transition: { duration: 0.6 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 py-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(
      motion.a,
      {
        href: "#",
        className: "flex items-center gap-2 text-white hover:text-[#d400ff] transition-colors",
        whileHover: { x: -2 }
      },
      /* @__PURE__ */ React.createElement(ArrowLeft, { size: 20 }),
      /* @__PURE__ */ React.createElement("span", null, "Voltar")
    ), /* @__PURE__ */ React.createElement(
      "img",
      {
        src: "https://escolahabilidade.com/wp-content/uploads/2024/06/Design-sem-nome-7.png",
        alt: "Escola Habilidade",
        className: "h-10 w-auto"
      }
    )), /* @__PURE__ */ React.createElement(
      motion.a,
      {
        href: "https://wa.me/5548988559491",
        className: "bg-[#d400ff] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#b300dd] transition-all duration-300",
        whileHover: { scale: 1.05, boxShadow: "0 0 20px #d400ff55" }
      },
      "Matricule-se Agora"
    )))
  );
};
var CourseHero = () => {
  return /* @__PURE__ */ React.createElement("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-radial from-[#110011] to-black" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "assets/architectural-render-bg.jpeg?prompt=Beautiful photorealistic architectural rendering of a modern house with glass windows, wooden details, perfect lighting, 4K quality, architectural visualization",
      alt: "Renderiza\xE7\xE3o Arquitet\xF4nica",
      className: "w-full h-full object-cover opacity-30"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" })), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 container mx-auto px-4" }, /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-2 gap-12 items-center" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: 0.8 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "flex items-center gap-2 bg-[#d400ff]/20 text-[#d400ff] px-4 py-2 rounded-full text-sm font-semibold",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.2 }
      },
      /* @__PURE__ */ React.createElement(GraduationCap, { size: 16 }),
      "Aulas 100% Presenciais"
    )),
    /* @__PURE__ */ React.createElement(
      motion.h1,
      {
        className: "text-4xl md:text-6xl font-bold text-white mb-6 leading-tight",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 }
      },
      "Do ",
      /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "Esbo\xE7o"),
      " ao ",
      /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "Render")
    ),
    /* @__PURE__ */ React.createElement(
      motion.p,
      {
        className: "text-xl text-gray-300 mb-8 leading-relaxed",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.4 }
      },
      "Domine ",
      /* @__PURE__ */ React.createElement("strong", { className: "text-white" }, "SketchUp + Enscape"),
      " para criar projetos arquitet\xF4nicos profissionais com renderiza\xE7\xF5es fotorreal\xEDsticas que impressionam clientes."
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "grid grid-cols-3 gap-6 mb-8",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.5 }
      },
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-[#d400ff]" }, "56h"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-sm" }, "Carga Hor\xE1ria")),
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-[#d400ff]" }, "28"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-sm" }, "Aulas Pr\xE1ticas")),
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-[#d400ff]" }, "6"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-400 text-sm" }, "Projetos Completos"))
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "flex flex-col sm:flex-row gap-4",
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.6 }
      },
      /* @__PURE__ */ React.createElement(
        motion.a,
        {
          href: "https://wa.me/5548988559491",
          className: "bg-[#d400ff] text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center gap-2 justify-center hover:bg-[#b300dd] transition-all duration-300",
          whileHover: { scale: 1.05, boxShadow: "0 0 30px #d400ff88" }
        },
        /* @__PURE__ */ React.createElement(MessageCircle, { size: 20 }),
        "Garanta sua Vaga - 10x R$ 279,30"
      ),
      /* @__PURE__ */ React.createElement(
        motion.a,
        {
          href: "https://wa.me/5548988559491",
          className: "border-2 border-[#d400ff] text-[#d400ff] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 inline-flex items-center gap-2 justify-center",
          whileHover: { scale: 1.05 }
        },
        /* @__PURE__ */ React.createElement(MessageCircle, { size: 20 }),
        "Fale com um Orientador"
      )
    )
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "relative",
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      transition: { delay: 0.4 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "space-y-4",
        initial: { y: 50 },
        animate: { y: 0 },
        transition: { delay: 0.6 }
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "assets/render-1.jpeg?prompt=Photorealistic interior rendering living room modern furniture warm lighting sketchup enscape style",
          alt: "Renderiza\xE7\xE3o Interior",
          className: "rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-[#d400ff]/30"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "assets/render-2.jpeg?prompt=Architectural exterior rendering modern house glass windows landscaping photorealistic",
          alt: "Renderiza\xE7\xE3o Exterior",
          className: "rounded-xl shadow-2xl w-full h-32 object-cover"
        }
      )
    ), /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "space-y-4 mt-8",
        initial: { y: 50 },
        animate: { y: 0 },
        transition: { delay: 0.8 }
      },
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "assets/render-3.jpeg?prompt=Kitchen interior design rendering modern cabinets island marble countertop professional lighting",
          alt: "Renderiza\xE7\xE3o Cozinha",
          className: "rounded-xl shadow-2xl w-full h-32 object-cover"
        }
      ),
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: "assets/render-4.jpeg?prompt=Bedroom interior rendering cozy modern furniture natural lighting architectural visualization",
          alt: "Renderiza\xE7\xE3o Quarto",
          className: "rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-[#d400ff]/30"
        }
      )
    ))
  ))));
};
var AboutCourse = () => {
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-gray-50" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6" }, "Transforme suas ", /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "ideias"), " em projetos profissionais"),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-700 leading-relaxed mb-6" }, "Aprenda a criar desde esbo\xE7os simples at\xE9 renderiza\xE7\xF5es fotorreal\xEDsticas que impressionam clientes e garantem aprova\xE7\xE3o de projetos."),
    /* @__PURE__ */ React.createElement("div", { className: "bg-[#d400ff]/10 rounded-xl p-6 max-w-2xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(CalendarCheck, { className: "text-[#d400ff]", size: 32 }), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-900" }, "Aulas 100% Presenciais")), /* @__PURE__ */ React.createElement("p", { className: "text-gray-700" }, "Aprendizado hands-on em nossa sede equipada com computadores modernos e software atualizado. Acompanhamento individual e networking com colegas da \xE1rea."), /* @__PURE__ */ React.createElement("div", { className: "mt-4 flex items-center justify-center gap-2 text-[#d400ff] font-semibold" }, /* @__PURE__ */ React.createElement(MapPin, { size: 16 }), /* @__PURE__ */ React.createElement("span", null, "Kobrasol - S\xE3o Jos\xE9/SC")))
  ), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8 mb-16" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "text-center p-6",
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(Box, { className: "text-white", size: 32 })),
    /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900 mb-3" }, "Modelagem 3D"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Domine todas as ferramentas do SketchUp para criar modelos 3D precisos e detalhados.")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "text-center p-6",
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay: 0.1 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(Lightbulb, { className: "text-white", size: 32 })),
    /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900 mb-3" }, "Renderiza\xE7\xE3o"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Crie imagens fotorreal\xEDsticas com Enscape, incluindo ilumina\xE7\xE3o e materiais profissionais.")
  ), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "text-center p-6",
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay: 0.2 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(Target, { className: "text-white", size: 32 })),
    /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900 mb-3" }, "Projetos Reais"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, "Desenvolva projetos completos: resid\xEAncias, interiores e documenta\xE7\xE3o t\xE9cnica.")
  )))));
};
var ModuleSection = ({ title, icon: Icon, lessons, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100",
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "p-6 cursor-pointer hover:bg-gray-50 transition-colors",
        onClick: () => setIsExpanded(!isExpanded)
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 bg-${color} rounded-lg flex items-center justify-center` }, /* @__PURE__ */ React.createElement(Icon, { className: "text-white", size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900" }, title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600" }, lessons.length, " aulas \u2022 ", lessons.length * 2, "h total"))), /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { rotate: isExpanded ? 180 : 0 },
          transition: { duration: 0.3 }
        },
        /* @__PURE__ */ React.createElement(ChevronDown, { className: "text-gray-400", size: 24 })
      ))
    ),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        initial: false,
        animate: {
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0
        },
        transition: { duration: 0.3 },
        className: "overflow-hidden"
      },
      /* @__PURE__ */ React.createElement("div", { className: "px-6 pb-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, lessons.map((lesson, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex items-center gap-4 p-4 bg-gray-50 rounded-lg" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 bg-[#d400ff] rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-sm font-bold" }, index + 1)), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-gray-900" }, lesson.name), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-600" }, lesson.type)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-gray-500" }, /* @__PURE__ */ React.createElement(Clock, { size: 16 }), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, lesson.duration))))))
    )
  );
};
var Curriculum = () => {
  const sketchupLessons = [
    { name: "Fundamentos do SketchUp", type: "Modelagem", duration: "120 min" },
    { name: "Modificadores e Geometrias", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado \u2013 Volume Simples", type: "Projeto", duration: "120 min" },
    { name: "Grupos e Componentes", type: "Modelagem", duration: "120 min" },
    { name: "Manipula\xE7\xE3o Avan\xE7ada de Geometrias", type: "Modelagem", duration: "120 min" },
    { name: "Eixos e Superf\xEDcies Inclinadas", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado \u2013 Elementos Arquitet\xF4nicos", type: "Projeto", duration: "120 min" },
    { name: "Materiais e Texturas", type: "Modelagem", duration: "120 min" },
    { name: "Ferramenta Siga-me (Follow Me)", type: "Modelagem", duration: "120 min" },
    { name: "Sandbox e Terrenos", type: "Modelagem", duration: "120 min" },
    { name: "Vetoriza\xE7\xE3o e Logotipos 3D", type: "Modelagem", duration: "120 min" },
    { name: "Ferramentas de S\xF3lidos", type: "Modelagem", duration: "120 min" },
    { name: "Importa\xE7\xE3o de Arquivos CAD", type: "Modelagem", duration: "120 min" },
    { name: "Introdu\xE7\xE3o ao Layout do SketchUp", type: "Modelagem", duration: "120 min" },
    { name: "Documenta\xE7\xE3o T\xE9cnica com Layout", type: "Modelagem", duration: "120 min" },
    { name: "Plugins Essenciais", type: "Modelagem", duration: "120 min" },
    { name: "Componentes Din\xE2micos I", type: "Modelagem", duration: "120 min" },
    { name: "Projeto Guiado \u2013 Interiores Residenciais", type: "Projeto", duration: "120 min" },
    { name: "Projeto Guiado \u2013 Fachada com Terreno", type: "Projeto", duration: "120 min" },
    { name: "Layout Final do Projeto Completo", type: "Projeto", duration: "120 min" }
  ];
  const enscapeLessons = [
    { name: "Introdu\xE7\xE3o ao Enscape e Configura\xE7\xE3o Inicial", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Ilumina\xE7\xE3o Natural e Artificial", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Materiais e Texturiza\xE7\xE3o no Enscape", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "C\xE2meras e Enquadramentos Profissionais", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Configura\xE7\xF5es de Render e Qualidade", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Anima\xE7\xF5es e V\xEDdeos com Enscape", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Ambientes Externos e Vegeta\xE7\xE3o", type: "Renderiza\xE7\xE3o", duration: "120 min" },
    { name: "Projeto Guiado Completo com Enscape", type: "Projeto", duration: "120 min" }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-gradient-radial from-[#110011] to-black" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-6" }, "Grade ", /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "Curricular")),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto" }, "Conte\xFAdo estruturado para levar voc\xEA do b\xE1sico ao n\xEDvel profissional")
  ), /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto space-y-6" }, /* @__PURE__ */ React.createElement(
    ModuleSection,
    {
      title: "SketchUp - Modelagem 3D",
      icon: Box,
      lessons: sketchupLessons,
      color: "[#d400ff]"
    }
  ), /* @__PURE__ */ React.createElement(
    ModuleSection,
    {
      title: "Enscape - Renderiza\xE7\xE3o Fotorreal\xEDstica",
      icon: Camera,
      lessons: enscapeLessons,
      color: "[#d400ff]"
    }
  ))));
};
var CourseProjects = () => {
  const projects = [
    {
      title: "Casa Residencial Completa",
      description: "Projeto de resid\xEAncia unifamiliar com fachada, interiores e terreno paisag\xEDstico",
      image: "assets/project-1.jpeg?prompt=Complete residential house project 3D rendering with garden landscape modern architecture"
    },
    {
      title: "Interiores de Luxo",
      description: "Ambientes internos com materiais nobres, ilumina\xE7\xE3o profissional e mobili\xE1rio",
      image: "assets/project-2.jpeg?prompt=Luxury interior design living room rendering modern furniture marble finishes professional lighting"
    },
    {
      title: "Documenta\xE7\xE3o T\xE9cnica",
      description: "Plantas, cortes, fachadas e detalhamentos t\xE9cnicos usando Layout",
      image: "assets/project-3.jpeg?prompt=Architectural technical drawings floor plans sections elevations layout documentation"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-gray-50" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6" }, "Projetos que voc\xEA vai ", /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "criar")),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-700 max-w-3xl mx-auto" }, "Portfolio real para impressionar clientes e conseguir trabalhos")
  ), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" }, projects.map((project, index) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: index,
      className: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300",
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay: index * 0.1 },
      whileHover: { y: -5 }
    },
    /* @__PURE__ */ React.createElement("div", { className: "aspect-video overflow-hidden" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: project.image,
        alt: project.title,
        className: "w-full h-full object-cover hover:scale-110 transition-transform duration-300"
      }
    )),
    /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900 mb-3" }, project.title), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 leading-relaxed" }, project.description))
  )))));
};
var CompaniesSection = () => {
  const companies = [
    {
      name: "Portinox",
      logo: "assets/_AM4K71sI76P_48oTfwuh.webp",
      description: "Equipamentos Gastron\xF4micos"
    },
    {
      name: "MR",
      logo: "assets/2jNvD0A0IySCMxVqHKKLN.jpeg",
      description: "M\xF3veis Planejados"
    },
    {
      name: "Rinox",
      logo: "assets/Dto_HF1D0esz2RgHkyluP.png",
      description: "Solu\xE7\xF5es Industriais"
    },
    {
      name: "Serralheria Mota",
      logo: "assets/l5v_ub2GBPsN8c9qczmU6.jpeg",
      description: "Serralheria e Metalurgia"
    },
    {
      name: "Steinbach",
      logo: "assets/x3eNjRKuni5TKlKHbFZug.webp",
      description: "Marcenaria"
    },
    {
      name: "Torres",
      logo: "assets/AJ0M1WPOZVRqEu3y-N4j_.avif",
      description: "projetos farmac\xEAuticos"
    },
    {
      name: "Legno",
      logo: "assets/ukKT5CnXfAVP3AS9G4jXs.jpeg",
      description: "M\xF3veis sob Medida"
    },
    {
      name: "Mobili\xE1rio",
      logo: "assets/xYBvu3zwJyVFvvlKHPcz0.jpeg",
      description: "M\xF3veis e Interiores"
    },
    {
      name: "Prot\xE9rmica",
      logo: "assets/dU-RkMhy9INgLG_2WQrOs.png",
      description: "Climatiza\xE7\xE3o"
    },
    {
      name: "Marcenaria JP",
      logo: "assets/sXBkejmP3TgFhiLFB-2NM.jpeg",
      description: "M\xF3veis Planejados"
    },
    {
      name: "Ousadia",
      logo: "assets/p4GIB7Eemw3frRpbKG2zR.jpeg",
      description: "M\xF3veis sob Medida"
    },
    {
      name: "Escadas Imperatriz",
      logo: "assets/PLOSn09XPv1Fkg_lJVsAG.jpeg",
      description: "Escadas e Estruturas"
    },
    {
      name: "Pedra Granada",
      logo: "assets/kI8JxlGaNQo0Ecg5B1uEP.jpeg",
      description: "Marmoraria"
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6" }, "Empresas regionais que fizeram nosso curso de ", /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "projetista")),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-700 max-w-3xl mx-auto" }, "Empresas da regi\xE3o que confiaram na Escola Habilidade para capacitar seus profissionais em projetos")
  ), /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      className: "flex space-x-8",
      animate: {
        x: [0, -(208 * companies.length)]
        // 200px largura + 32px gap (8 * 4px)
      },
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 120,
          // 120 segundos para completar um loop (2x mais lento)
          ease: "linear"
        }
      }
    },
    companies.map((company, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: `first-${index}`,
        className: "group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0",
        whileHover: {
          y: -5,
          boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
          scale: 1.05
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: company.logo,
          alt: company.name,
          className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        }
      )),
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-gray-900 text-sm mb-1" }, company.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600" }, company.description))
    )),
    companies.map((company, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: `second-${index}`,
        className: "group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0",
        whileHover: {
          y: -5,
          boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
          scale: 1.05
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: company.logo,
          alt: company.name,
          className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        }
      )),
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-gray-900 text-sm mb-1" }, company.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600" }, company.description))
    )),
    companies.slice(0, 3).map((company, index) => /* @__PURE__ */ React.createElement(
      motion.div,
      {
        key: `third-${index}`,
        className: "group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0",
        whileHover: {
          y: -5,
          boxShadow: "0 10px 30px rgba(212, 0, 255, 0.15)",
          scale: 1.05
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 flex items-center justify-center mb-4 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement(
        "img",
        {
          src: company.logo,
          alt: company.name,
          className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        }
      )),
      /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-gray-900 text-sm mb-1" }, company.name), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-600" }, company.description))
    ))
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" })), /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8, delay: 0.3 },
      className: "mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
    },
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-[#d400ff] mb-2" }, "50+"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-600" }, "Empresas Atendidas")),
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-[#d400ff] mb-2" }, "200+"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-600" }, "Projetos Entregues")),
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-[#d400ff] mb-2" }, "95%"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-600" }, "Taxa de Aprova\xE7\xE3o")),
    /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-3xl font-bold text-[#d400ff] mb-2" }, "4.9\u2605"), /* @__PURE__ */ React.createElement("div", { className: "text-gray-600" }, "Avalia\xE7\xE3o M\xE9dia"))
  )));
};
var CourseTestimonials = () => {
  const testimonials = [
    {
      name: "Jonatas Torres",
      initials: "JT",
      text: "Estou tendo uma excelente experi\xEAncia com a escola habilidade no curso de SketchUp. O conte\xFAdo \xE9 muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem est\xE1 come\xE7ando. A din\xE2mica das aulas, os exerc\xEDcios pr\xE1ticos e o suporte oferecido fazem toda a diferen\xE7a no aprendizado. J\xE1 estou colocando em pr\xE1tica o que aprendi. Recomendo fortemente a escola para quem deseja aprender SketchUp com qualidade, aten\xE7\xE3o individualizada e foco na aplica\xE7\xE3o pr\xE1tica. Vale muito a pena!"
    },
    {
      name: "Karolain Roberta R\xE9gis",
      initials: "KR",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super din\xE2micas, aprendi ja bastante coisas que ainda n\xE3o sabia, est\xE3o super atualizados no mercado, eles tem deles mesmo at\xE9 IA ajudando o pessoal nas medi\xE7\xF5es e at\xE9 em render rapidos, fora a apostila bem completa"
    },
    {
      name: "Rute Barboza",
      initials: "RB",
      text: "Fiz todos os cursos de projeto com o professor Alessandro, me ajudou demais a colocar as coisas que antes eram apenas sonhos nos meus projetos. Hoje meus clientes conseguem ver o projeto de uma forma realista por conta do meu aprendizado em renderiza\xE7\xE3o. Agrade\xE7o demais ao trabalho da Escola Habilidade e do professor!!!"
    },
    {
      name: "Ana Caroline Orofino",
      initials: "AC",
      text: "Estou adorando as aulas, professor muito atencioso, sempre tr\xE1s quest\xF5es do cotidiano para resolu\xE7\xE3o das atividades!"
    },
    {
      name: "Sabrina Rodrigues",
      initials: "SR",
      text: "Comecei o curso de sketchup e est\xE1 sendo uma experi\xEAncia incr\xEDvel, o professor \xE9 muito atencioso. Estou com grandes expectativas."
    },
    {
      name: "Milene Silva",
      initials: "MS",
      text: "A escola apresenta uma boa estrutura, o professor \xE9 bem atencioso e prestativo, sempre pronto para esclarecer d\xFAvidas durante e fora do hor\xE1rio de aula. Estou adorando."
    }
  ];
  return /* @__PURE__ */ React.createElement("section", { className: "py-20 bg-gradient-radial from-[#110011] to-black" }, /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "text-center mb-16"
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-6" }, "O que dizem nossos ", /* @__PURE__ */ React.createElement("span", { className: "text-[#d400ff]" }, "alunos"))
  ), /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto" }, testimonials.map((testimonial, index) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: index,
      className: "bg-[#1b1b1f] border border-[#d400ff33] rounded-xl p-6 text-center",
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6, delay: index * 0.1 },
      whileHover: {
        boxShadow: "0 0 20px #d400ff55",
        scale: 1.02
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-white text-xl font-bold" }, testimonial.initials)),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-300 italic text-sm mb-4 leading-relaxed line-clamp-6" }, '"', testimonial.text, '"'),
    /* @__PURE__ */ React.createElement("div", { className: "font-bold text-white text-lg" }, testimonial.name)
  )))));
};
var FinalCTA = () => {
  return /* @__PURE__ */ React.createElement("section", { className: "relative py-20 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "assets/cta-background.jpeg?prompt=Beautiful modern architecture interior living room with large windows natural light elegant furniture photorealistic high quality architectural photography",
      alt: "Projeto Arquitet\xF4nico",
      className: "w-full h-full object-cover"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-[#d400ff]/20 via-transparent to-[#d400ff]/20" })), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0" }, [...Array(15)].map((_, i) => /* @__PURE__ */ React.createElement(
    motion.div,
    {
      key: i,
      className: "absolute w-1 h-1 bg-[#d400ff] rounded-full",
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      },
      animate: {
        opacity: [0.2, 0.6, 0.2],
        scale: [0.5, 1.2, 0.5]
      },
      transition: {
        duration: 5,
        repeat: Infinity,
        delay: Math.random() * 5
      }
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 container mx-auto px-4 text-center" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 }
    },
    /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-6xl font-bold text-white mb-6" }, "Comece sua carreira de projetista hoje!"),
    /* @__PURE__ */ React.createElement(
      motion.div,
      {
        className: "inline-flex items-center gap-3 bg-gradient-to-r from-[#d400ff]/20 to-purple-600/20 backdrop-blur-sm border border-[#d400ff]/30 text-white px-6 py-3 rounded-xl text-lg font-semibold mb-6",
        animate: {
          boxShadow: [
            "0 0 20px rgba(212, 0, 255, 0.3)",
            "0 0 30px rgba(212, 0, 255, 0.5)",
            "0 0 20px rgba(212, 0, 255, 0.3)"
          ]
        },
        transition: { duration: 2, repeat: Infinity }
      },
      /* @__PURE__ */ React.createElement(
        motion.div,
        {
          animate: { rotate: [0, 10, -10, 0] },
          transition: { duration: 2, repeat: Infinity }
        },
        /* @__PURE__ */ React.createElement(AlertCircle, { size: 20, className: "text-[#d400ff]" })
      ),
      /* @__PURE__ */ React.createElement("span", { className: "bg-gradient-to-r from-white to-[#d400ff] bg-clip-text text-transparent" }, "OFERTA LIMITADA"),
      /* @__PURE__ */ React.createElement("span", { className: "text-gray-300" }, "\u2022"),
      /* @__PURE__ */ React.createElement("span", { className: "text-yellow-300 font-bold" }, "15 vagas restantes")
    ),
    /* @__PURE__ */ React.createElement("p", { className: "text-xl text-gray-200 mb-4 max-w-3xl mx-auto" }, /* @__PURE__ */ React.createElement("span", { className: "line-through text-gray-400 text-lg" }, "De R$ 4.655,00"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("strong", { className: "text-3xl text-white" }, "Por apenas R$ 2.793,00 \xE0 vista"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-xl" }, "ou ", /* @__PURE__ */ React.createElement("strong", { className: "text-green-400" }, "10x de R$ 279,30"), " sem juros")),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-6 text-gray-300 mb-8" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "Certifica\xE7\xE3o profissional"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "6 projetos completos"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "Suporte vital\xEDcio")),
    /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "text-white mb-2", size: 32 }), /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold" }, "28 Aulas Pr\xE1ticas")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "text-white mb-2", size: 32 }), /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold" }, "Certifica\xE7\xE3o")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "text-white mb-2", size: 32 }), /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold" }, "6 Projetos")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center" }, /* @__PURE__ */ React.createElement(CheckCircle, { className: "text-white mb-2", size: 32 }), /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold" }, "Suporte Vital\xEDcio"))),
    /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center" }, /* @__PURE__ */ React.createElement(
      motion.a,
      {
        href: "https://wa.me/5548988559491",
        className: "bg-gradient-to-r from-[#d400ff] to-[#b300dd] text-white px-12 py-6 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:from-[#b300dd] hover:to-[#9000bb] transition-all duration-300 shadow-2xl",
        whileHover: {
          scale: 1.05,
          boxShadow: "0 0 40px #d400ff88",
          y: -3
        },
        whileTap: { scale: 0.95 }
      },
      /* @__PURE__ */ React.createElement(MessageCircle, { size: 24 }),
      "Garantir Vaga - 10x R$ 279,30"
    ), /* @__PURE__ */ React.createElement(
      motion.button,
      {
        className: "border-2 border-[#d400ff] text-[#d400ff] px-8 py-6 rounded-full font-bold text-lg hover:bg-[#d400ff] hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10",
        whileHover: {
          scale: 1.05,
          boxShadow: "0 0 30px #d400ff44"
        }
      },
      "Tenho D\xFAvidas"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "mt-6 space-y-3" }, /* @__PURE__ */ React.createElement("p", { className: "flex items-center gap-2 justify-center text-yellow-400 font-semibold" }, /* @__PURE__ */ React.createElement(Timer, { size: 16 }), "Oferta v\xE1lida at\xE9 15/08/2025 ou enquanto durarem as vagas"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-6 text-gray-300 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "Pagamento em at\xE9 10x sem juros"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "7 dias de garantia total"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16, className: "text-green-400" }), "Certificado incluso")))
  )), /* @__PURE__ */ React.createElement("div", { className: "container mx-auto px-4 mt-16" }, /* @__PURE__ */ React.createElement(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.8 },
      className: "max-w-4xl mx-auto"
    },
    /* @__PURE__ */ React.createElement("div", { className: "grid md:grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(MapPin, { className: "text-[#d400ff]", size: 24 }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900" }, "Nossa Localiza\xE7\xE3o")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2 text-gray-700" }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold" }, "R. Caetano Jos\xE9 Ferreira, 426"), /* @__PURE__ */ React.createElement("p", null, "Sala 5 - Kobrasol"), /* @__PURE__ */ React.createElement("p", null, "S\xE3o Jos\xE9 - SC, 88102-280")), /* @__PURE__ */ React.createElement(
      motion.a,
      {
        href: "https://maps.google.com/maps?q=R.+Caetano+Jos\xE9+Ferreira,+426,+Sala+5+-+Kobrasol,+S\xE3o+Jos\xE9+-+SC,+88102-280",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 mt-4 text-[#d400ff] hover:text-[#b300dd] font-semibold",
        whileHover: { x: 2 }
      },
      /* @__PURE__ */ React.createElement(ExternalLink, { size: 16 }),
      "Abrir no Google Maps"
    )), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl p-6 shadow-lg" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement(Phone, { className: "text-[#d400ff]", size: 24 }), /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-gray-900" }, "Contato Direto")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 text-sm" }, "WhatsApp / Telefone"), /* @__PURE__ */ React.createElement("p", { className: "text-xl font-bold text-gray-900" }, "(48) 98855-9491")), /* @__PURE__ */ React.createElement(
      motion.a,
      {
        href: "https://wa.me/5548988559491?text=Ol\xE1! Gostaria de mais informa\xE7\xF5es sobre o curso Do Esbo\xE7o ao Render.",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold",
        whileHover: { scale: 1.02 }
      },
      /* @__PURE__ */ React.createElement(MessageCircle, { size: 16 }),
      "Chamar no WhatsApp"
    ))))
  )));
};
var CoursePageApp = () => {
  return /* @__PURE__ */ React.createElement("div", { className: "font-montserrat" }, /* @__PURE__ */ React.createElement("style", { jsx: true, global: true }, `
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
      `), /* @__PURE__ */ React.createElement(CourseHeader, null), /* @__PURE__ */ React.createElement(CourseHero, null), /* @__PURE__ */ React.createElement(AboutCourse, null), /* @__PURE__ */ React.createElement(Curriculum, null), /* @__PURE__ */ React.createElement(CourseProjects, null), /* @__PURE__ */ React.createElement(CompaniesSection, null), /* @__PURE__ */ React.createElement(CourseTestimonials, null), /* @__PURE__ */ React.createElement(FinalCTA, null), /* @__PURE__ */ React.createElement(
    motion.a,
    {
      href: "https://wa.me/5548988559491",
      className: "fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#d400ff] rounded-full flex items-center justify-center shadow-lg",
      whileHover: {
        scale: 1.1,
        boxShadow: "0 0 20px #d400ff88"
      },
      animate: {
        y: [0, -5, 0]
      },
      transition: {
        y: { duration: 2, repeat: Infinity }
      }
    },
    /* @__PURE__ */ React.createElement(MessageCircle, { className: "text-white", size: 24 })
  ));
};
var stdin_default = CoursePageApp;
export {
  stdin_default as default
};
