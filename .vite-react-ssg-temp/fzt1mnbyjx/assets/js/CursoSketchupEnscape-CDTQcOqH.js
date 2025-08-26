import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { m as motion } from "./lazyMotion-Brq4XrXb.js";
import { ChatCircle, House, CaretRight, GraduationCap, CalendarCheck, MapPin, Cube, Lightbulb, Target, Camera, Warning, CheckCircle, Timer, ArrowSquareOut, Phone, CaretDown, Clock } from "@phosphor-icons/react";
import { I as InteractiveLogo } from "../../main.mjs";
import { T as TrustedCompanies } from "./TrustedCompanies-DWNAMGXJ.js";
import { Link } from "react-router-dom";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
const StandardCourseHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-b border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 py-3", children: [
      /* @__PURE__ */ jsxs("nav", { "aria-label": "Breadcrumb", className: "flex items-center space-x-2 text-sm", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "text-gray-400 hover:text-white transition-colors flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(House, { size: 16, weight: "duotone" }),
          "Início"
        ] }),
        /* @__PURE__ */ jsx(CaretRight, { size: 14, className: "text-gray-600 mx-1" }),
        /* @__PURE__ */ jsx(Link, { to: "/#cursos", className: "text-gray-400 hover:text-white transition-colors", children: "Cursos" }),
        /* @__PURE__ */ jsx(CaretRight, { size: 14, className: "text-gray-600 mx-1" }),
        /* @__PURE__ */ jsx("span", { className: "font-medium text-purple-400", "aria-current": "page", children: "SketchUp + Enscape" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-purple-600" }),
          "Design e Arquitetura"
        ] }),
        /* @__PURE__ */ jsx("div", { children: "•" }),
        /* @__PURE__ */ jsx("div", { children: "Intermediário" }),
        /* @__PURE__ */ jsx("div", { children: "•" }),
        /* @__PURE__ */ jsx("div", { children: "56 horas" }),
        /* @__PURE__ */ jsx("div", { children: "•" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(GraduationCap, { size: 14, weight: "duotone", className: "text-purple-400" }),
          "Certificado"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(
      motion.header,
      {
        className: `fixed top-0 w-full z-50 transition-all duration-300 bg-zinc-900/70 backdrop-blur-md border-b border-gray-800/50`,
        initial: { y: -100 },
        animate: { y: 0 },
        transition: { duration: 0.6 },
        children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
          /* @__PURE__ */ jsx(InteractiveLogo, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-6", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1",
                  onClick: () => scrollToSection("curriculum"),
                  children: "Currículo"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1",
                  onClick: () => scrollToSection("testimonials"),
                  children: "Depoimentos"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1",
                  onClick: () => scrollToSection("contact"),
                  children: "Contato"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              motion.a,
              {
                href: "https://wa.me/5548988559491",
                className: "btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-2",
                whileHover: { scale: 1.05 },
                children: "Matricule-se Agora"
              }
            )
          ] })
        ] }) })
      }
    )
  ] });
};
const CourseHero = () => {
  return /* @__PURE__ */ jsxs("section", { className: "relative min-h-screen flex items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black to-black" }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/images/course/sketchup-enscape/architectural-render-bg.jpeg",
          alt: "Renderização Arquitetônica",
          className: "w-full h-full object-cover opacity-30"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 container mx-auto px-4 pt-32", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.8 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "flex items-center gap-2 bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold",
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.2 },
                children: [
                  /* @__PURE__ */ jsx(GraduationCap, { size: 16 }),
                  "Aulas 100% Presenciais"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxs(
              motion.h1,
              {
                className: "text-4xl md:text-6xl font-bold text-white mb-6 leading-tight",
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.3 },
                children: [
                  "Do ",
                  /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Esboço" }),
                  " ao ",
                  /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Render" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.p,
              {
                className: "text-xl text-gray-300 mb-8 leading-relaxed",
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.4 },
                children: [
                  "Domine ",
                  /* @__PURE__ */ jsx("strong", { className: "text-white", children: "SketchUp + Enscape" }),
                  " para criar projetos arquitetônicos profissionais com renderizações fotorrealísticas que impressionam clientes."
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "grid grid-cols-3 gap-6 mb-8",
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.5 },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400", children: "56h" }),
                    /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Carga Horária" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400", children: "28" }),
                    /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Aulas Práticas" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400", children: "6" }),
                    /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-sm", children: "Projetos Completos" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "flex flex-col sm:flex-row gap-4",
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.6 },
                children: [
                  /* @__PURE__ */ jsxs(
                    motion.a,
                    {
                      href: "https://wa.me/5548988559491",
                      className: "btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-3 text-base inline-flex items-center gap-2 justify-center",
                      whileHover: { scale: 1.05 },
                      children: [
                        /* @__PURE__ */ jsx(ChatCircle, { size: 18 }),
                        "Garanta sua Vaga - 10x R$ 279,30"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    motion.a,
                    {
                      href: "https://wa.me/5548988559491",
                      className: "btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition px-6 py-3 text-base inline-flex items-center gap-2 justify-center border-2 border-white/20",
                      whileHover: { scale: 1.05 },
                      children: [
                        /* @__PURE__ */ jsx(ChatCircle, { size: 18 }),
                        "Fale com um Orientador"
                      ]
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "relative",
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.4 },
          children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "space-y-4",
                initial: { y: 50 },
                animate: { y: 0 },
                transition: { delay: 0.6 },
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: "/images/course/sketchup-enscape/render-1.jpeg",
                      alt: "Renderização Interior",
                      className: "rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-purple-400/30"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: "/images/course/sketchup-enscape/render-2.jpeg",
                      alt: "Renderização Exterior",
                      className: "rounded-xl shadow-2xl w-full h-32 object-cover"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: "space-y-4 mt-8",
                initial: { y: 50 },
                animate: { y: 0 },
                transition: { delay: 0.8 },
                children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: "/images/course/sketchup-enscape/render-3.jpeg",
                      alt: "Renderização Cozinha",
                      className: "rounded-xl shadow-2xl w-full h-32 object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: "/images/course/sketchup-enscape/render-4.jpeg",
                      alt: "Renderização Quarto",
                      className: "rounded-xl shadow-2xl w-full h-48 object-cover border-2 border-purple-400/30"
                    }
                  )
                ]
              }
            )
          ] })
        }
      )
    ] }) })
  ] });
};
const AboutCourse = () => {
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gray-50", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6", children: [
            "Transforme suas ",
            /* @__PURE__ */ jsx("span", { className: "text-purple-600", children: "ideias" }),
            " em projetos profissionais"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-700 leading-relaxed mb-6", children: "Aprenda a criar desde esboços simples até renderizações fotorrealísticas que impressionam clientes e garantem aprovação de projetos." }),
          /* @__PURE__ */ jsxs("div", { className: "bg-purple-600/10 rounded-xl p-6 max-w-2xl mx-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx(CalendarCheck, { className: "text-purple-600", size: 32 }),
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-gray-900", children: "Aulas 100% Presenciais" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: "Aprendizado hands-on em nossa sede equipada com computadores modernos e software atualizado. Acompanhamento individual e networking com colegas da área." }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-center gap-2 text-purple-600 font-semibold", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 16 }),
              /* @__PURE__ */ jsx("span", { children: "Kobrasol - São José/SC" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8 mb-16", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center p-6",
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Cube, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Modelagem 3D" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Domine todas as ferramentas do SketchUp para criar modelos 3D precisos e detalhados." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center p-6",
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: 0.1 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Lightbulb, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Renderização" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Crie imagens fotorrealísticas com Enscape, incluindo iluminação e materiais profissionais." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "text-center p-6",
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: 0.2 },
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Target, { className: "text-white", size: 32 }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: "Projetos Reais" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Desenvolva projetos completos: residências, interiores e documentação técnica." })
          ]
        }
      )
    ] })
  ] }) }) });
};
const ModuleSection = ({ title, icon: Icon, lessons, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100",
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { duration: 0.6 },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "p-6 cursor-pointer hover:bg-gray-50 transition-colors",
            onClick: () => setIsExpanded(!isExpanded),
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: `w-12 h-12 bg-${color} rounded-lg flex items-center justify-center`, children: /* @__PURE__ */ jsx(Icon, { className: "text-white", size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900", children: title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-600", children: [
                    lessons.length,
                    " aulas • ",
                    lessons.length * 2,
                    "h total"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                motion.div,
                {
                  animate: { rotate: isExpanded ? 180 : 0 },
                  transition: { duration: 0.3 },
                  children: /* @__PURE__ */ jsx(CaretDown, { className: "text-gray-400", size: 24 })
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: false,
            animate: {
              height: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0
            },
            transition: { duration: 0.3 },
            className: "overflow-hidden",
            children: /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: lessons.map((lesson, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-4 bg-gray-50 rounded-lg", children: [
              /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-bold", children: index + 1 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-gray-900", children: lesson.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: lesson.type })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-500", children: [
                /* @__PURE__ */ jsx(Clock, { size: 16 }),
                /* @__PURE__ */ jsx("span", { className: "text-sm", children: lesson.duration })
              ] })
            ] }, index)) }) })
          }
        )
      ]
    }
  );
};
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
  return /* @__PURE__ */ jsx("section", { id: "curriculum", className: "py-20 bg-gradient-to-br from-purple-900 to-black", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-6", children: [
            "Grade ",
            /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Curricular" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "Conteúdo estruturado para levar você do básico ao nível profissional" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [
      /* @__PURE__ */ jsx(
        ModuleSection,
        {
          title: "SketchUp - Modelagem 3D",
          icon: Cube,
          lessons: sketchupLessons,
          color: "purple-600"
        }
      ),
      /* @__PURE__ */ jsx(
        ModuleSection,
        {
          title: "Enscape - Renderização Fotorrealística",
          icon: Camera,
          lessons: enscapeLessons,
          color: "purple-600"
        }
      )
    ] })
  ] }) });
};
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
  return /* @__PURE__ */ jsx("section", { className: "py-20 bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-gray-900 mb-6", children: [
            "Projetos que você vai ",
            /* @__PURE__ */ jsx("span", { className: "text-purple-600", children: "criar" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-700 max-w-3xl mx-auto", children: "Portfolio real para impressionar clientes e conseguir trabalhos" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto", children: projects.map((project, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300",
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay: index * 0.1 },
        whileHover: { y: -5 },
        children: [
          /* @__PURE__ */ jsx("div", { className: "aspect-video overflow-hidden", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: project.image,
              alt: project.title,
              className: "w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900 mb-3", children: project.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-600 leading-relaxed", children: project.description })
          ] })
        ]
      },
      index
    )) })
  ] }) });
};
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
  return /* @__PURE__ */ jsx("section", { id: "testimonials", className: "py-20 bg-gradient-to-br from-purple-900 to-black", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: /* @__PURE__ */ jsxs("h2", { className: "text-4xl md:text-5xl font-bold text-white mb-6", children: [
          "O que dizem nossos ",
          /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "alunos" })
        ] })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto", children: testimonials.map((testimonial, index) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "bg-gray-900/80 border border-purple-400/30 rounded-xl p-6 text-center backdrop-blur-sm",
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, delay: index * 0.1 },
        whileHover: {
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
          scale: 1.02
        },
        children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("span", { className: "text-white text-xl font-bold", children: testimonial.initials }) }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-300 italic text-sm mb-4 leading-relaxed line-clamp-6", children: [
            '"',
            testimonial.text,
            '"'
          ] }),
          /* @__PURE__ */ jsx("div", { className: "font-bold text-white text-lg", children: testimonial.name })
        ]
      },
      index
    )) })
  ] }) });
};
const FinalCTA = () => {
  return /* @__PURE__ */ jsxs("section", { id: "contact", className: "relative py-20 overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: "/images/course/sketchup-enscape/cta-background.jpeg",
          alt: "Projeto Arquitetônico",
          className: "w-full h-full object-cover"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: [...Array(15)].map((_, i) => /* @__PURE__ */ jsx(
      motion.div,
      {
        className: "absolute w-1 h-1 bg-purple-400 rounded-full",
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
      },
      i
    )) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-10 container mx-auto px-4 text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-6xl font-bold text-white mb-6", children: "Comece sua carreira de projetista hoje!" }),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              className: "inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-400/30 text-white px-6 py-3 rounded-xl text-lg font-semibold mb-6",
              animate: {
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 30px rgba(147, 51, 234, 0.5)",
                  "0 0 20px rgba(147, 51, 234, 0.3)"
                ]
              },
              transition: { duration: 2, repeat: Infinity },
              children: [
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { rotate: [0, 10, -10, 0] },
                    transition: { duration: 2, repeat: Infinity },
                    children: /* @__PURE__ */ jsx(Warning, { size: 20, className: "text-purple-400" })
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent", children: "OFERTA LIMITADA" }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "•" }),
                /* @__PURE__ */ jsx("span", { className: "text-yellow-300 font-bold", children: "15 vagas restantes" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xl text-gray-200 mb-4 max-w-3xl mx-auto", children: [
            /* @__PURE__ */ jsx("span", { className: "line-through text-gray-400 text-lg", children: "De R$ 4.655,00" }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("strong", { className: "text-3xl text-white", children: "Por apenas R$ 2.793,00 à vista" }),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsxs("span", { className: "text-xl", children: [
              "ou ",
              /* @__PURE__ */ jsx("strong", { className: "text-green-400", children: "10x de R$ 279,30" }),
              " sem juros"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 text-gray-300 mb-8", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
              "Certificação profissional"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
              "6 projetos completos"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
              "Suporte vitalício"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "text-white mb-2", size: 32 }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "28 Aulas Práticas" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "text-white mb-2", size: 32 }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "Certificação" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "text-white mb-2", size: 32 }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "6 Projetos" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "text-white mb-2", size: 32 }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-semibold", children: "Suporte Vitalício" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "https://wa.me/5548988559491",
                className: "bg-gradient-to-r from-purple-600 to-purple-800 text-white px-12 py-6 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-2xl",
                whileHover: {
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(147, 51, 234, 0.5)",
                  y: -3
                },
                whileTap: { scale: 0.95 },
                children: [
                  /* @__PURE__ */ jsx(ChatCircle, { size: 24 }),
                  "Garantir Vaga - 10x R$ 279,30"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.a,
              {
                href: "https://wa.me/5548988559491",
                className: "border-2 border-purple-400 text-purple-400 px-8 py-6 rounded-full font-bold text-lg hover:bg-purple-400 hover:text-white transition-all duration-300 backdrop-blur-sm bg-white/10",
                whileHover: {
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)"
                },
                children: "Tenho Dúvidas"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-3", children: [
            /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-2 justify-center text-yellow-400 font-semibold", children: [
              /* @__PURE__ */ jsx(Timer, { size: 16 }),
              "Oferta válida até 15/08/2025 ou enquanto durarem as vagas"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-6 text-gray-300 text-sm", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
                "Pagamento em até 10x sem juros"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
                "7 dias de garantia total"
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
                "Certificado incluso"
              ] })
            ] })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "relative z-20 container mx-auto px-4 mt-16", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "max-w-4xl mx-auto",
        children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative z-30 bg-white rounded-xl p-6 shadow-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "text-purple-600", size: 24 }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Nossa Localização" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-gray-700", children: [
              /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "R. Caetano José Ferreira, 426" }),
              /* @__PURE__ */ jsx("p", { children: "Sala 5 - Kobrasol" }),
              /* @__PURE__ */ jsx("p", { children: "São José - SC, 88102-280" })
            ] }),
            /* @__PURE__ */ jsxs(
              motion.a,
              {
                href: "https://maps.google.com/maps?q=R.+Caetano+José+Ferreira,+426,+Sala+5+-+Kobrasol,+São+José+-+SC,+88102-280",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 mt-4 text-purple-600 hover:text-purple-700 font-semibold",
                whileHover: { x: 2 },
                children: [
                  /* @__PURE__ */ jsx(ArrowSquareOut, { size: 16 }),
                  "Abrir no Google Maps"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-30 bg-white rounded-xl p-6 shadow-lg", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx(Phone, { className: "text-purple-600", size: 24 }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Contato Direto" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-gray-600 text-sm", children: "WhatsApp / Telefone" }),
                /* @__PURE__ */ jsx("p", { className: "text-xl font-bold text-gray-900", children: "(48) 98855-9491" })
              ] }),
              /* @__PURE__ */ jsxs(
                motion.a,
                {
                  href: "https://wa.me/5548988559491?text=Olá! Gostaria de mais informações sobre o curso Do Esboço ao Render.",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold",
                  whileHover: { scale: 1.02 },
                  children: [
                    /* @__PURE__ */ jsx(ChatCircle, { size: 16 }),
                    "Chamar no WhatsApp"
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ) })
  ] });
};
const CursoSketchupEnscape = () => {
  return /* @__PURE__ */ jsxs("div", { className: "font-sans min-h-screen", children: [
    /* @__PURE__ */ jsx(StandardCourseHeader, {}),
    /* @__PURE__ */ jsx(CourseHero, {}),
    /* @__PURE__ */ jsx(AboutCourse, {}),
    /* @__PURE__ */ jsx(Curriculum, {}),
    /* @__PURE__ */ jsx(CourseProjects, {}),
    /* @__PURE__ */ jsx(TrustedCompanies, { variant: "course", courseSlug: "sketchup-enscape" }),
    /* @__PURE__ */ jsx(CourseTestimonials, {}),
    /* @__PURE__ */ jsx(FinalCTA, {}),
    /* @__PURE__ */ jsx(
      motion.a,
      {
        href: "https://wa.me/5548988559491",
        className: "fixed bottom-6 right-6 z-50 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center shadow-lg",
        whileHover: {
          scale: 1.1,
          boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)"
        },
        animate: {
          y: [0, -5, 0]
        },
        transition: {
          y: { duration: 2, repeat: Infinity }
        },
        children: /* @__PURE__ */ jsx(ChatCircle, { className: "text-white", size: 24 })
      }
    )
  ] });
};
export {
  CursoSketchupEnscape as default
};
