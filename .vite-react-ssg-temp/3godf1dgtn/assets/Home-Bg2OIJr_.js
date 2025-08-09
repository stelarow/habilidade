import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { q as useTypewriter, r as useInView, t as usePosts } from "./utils-DYyrIPL_.js";
import { S as Section, G as GradientButton, L as Loading } from "../main.mjs";
import { Cube, FilmSlate, Desktop, PenNib, Code, ChartLine, Robot, ChartBar, Briefcase, BookOpen, Play, Trophy, Rocket, Star, User, MapPin, Quotes, Calendar, Newspaper, ArrowRight, Question, CaretDown } from "@phosphor-icons/react";
import { B as BlogCard, S as SEOHead } from "./blog-components-BiqxfVKP.js";
import { C as ContactForm } from "./ContactForm-DLVD-A1A.js";
import "prop-types";
import "react-router-dom";
import "@tanstack/react-query";
import "./blog-xsr1A1aF.js";
import "@supabase/supabase-js";
import "marked";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/xml";
import "node-html-parser";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query-devtools";
import "@emailjs/browser";
function Starfield({ count = 50, className = "" }) {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const stars = useMemo(() => {
    if (prefersReducedMotion) return [];
    const starCount = isMobile ? Math.min(count / 2, 25) : count;
    const arr = [];
    for (let i = 0; i < starCount; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 3;
      const duration = Math.random() * 2 + 2;
      arr.push({ left, top, size, delay, duration });
    }
    return arr;
  }, [count, isMobile, prefersReducedMotion]);
  if (prefersReducedMotion) return null;
  return /* @__PURE__ */ jsx("div", { className: `absolute inset-0 pointer-events-none ${className}`, "aria-hidden": "true", children: stars.map((s, idx) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "star block absolute rounded-full bg-fuchsia-500/80",
      style: {
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: `${s.size}px`,
        height: `${s.size}px`,
        animationDelay: `${s.delay}s`,
        animationDuration: `${s.duration}s`,
        willChange: "opacity"
      }
    },
    idx
  )) });
}
function Hero() {
  const words = ["Inteligência Artificial", "Design 3D", "Programação", "Marketing"];
  const text = useTypewriter(words);
  return /* @__PURE__ */ jsxs(Section, { fullHeight: true, className: "flex flex-col items-center justify-center text-center bg-zinc-950 overflow-visible", children: [
    /* @__PURE__ */ jsx(Starfield, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center max-w-4xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("h1", { className: "text-white font-bold text-3xl sm:text-5xl leading-relaxed tracking-tight mb-10", children: [
        /* @__PURE__ */ jsx("span", { className: "block text-5xl sm:text-7xl font-extrabold gradient-text animate-gradient mb-2", children: "Escola Habilidade" }),
        /* @__PURE__ */ jsx("span", { className: "block text-lg sm:text-xl text-purple-400 font-medium mb-6 tracking-wide", children: "Cursos Profissionalizantes em Florianópolis e Região" }),
        /* @__PURE__ */ jsxs("span", { className: "block text-2xl sm:text-3xl text-zinc-300 pb-2", children: [
          "Especialista em ",
          text,
          /* @__PURE__ */ jsx("span", { className: "inline-block animate-blink text-white ml-0.5", children: "|" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm md:text-base lg:text-lg text-center max-w-2xl mx-auto leading-relaxed px-4", children: "Aprenda hoje as habilidades que vão liderar o mercado de amanhã." }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex flex-col sm:flex-row gap-4", children: /* @__PURE__ */ jsx(
        GradientButton,
        {
          href: "#cursos",
          className: "px-6 py-3 text-sm",
          onClick: (e) => {
            e.preventDefault();
            const element = document.getElementById("cursos");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          },
          children: "Ver Cursos"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#cursos",
        "aria-label": "Ir para seção de cursos",
        className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-fuchsia-500 hover:text-cyan-400 transition animate-bounce",
        children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 24 24", className: "w-8 h-8", children: /* @__PURE__ */ jsx("path", { d: "M12 16.5a1 1 0 0 1-.707-.293l-6-6a1 1 0 1 1 1.414-1.414L12 14.086l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16.5z" }) })
      }
    )
  ] });
}
const COURSES = [
  {
    title: "Projetista",
    slug: "projetista-3d",
    icon: Cube,
    desc: "SketchUp, Enscape, Renderização com IA, Projetos 3D…",
    textColor: "text-orange-400",
    borderGradient: "from-orange-500/60 to-amber-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#f97316aa]"
  },
  {
    title: "Edição de Vídeo",
    slug: "edicao-video",
    icon: FilmSlate,
    desc: "Premiere, After Effects, DaVinci Resolve, Motion Graphics…",
    textColor: "text-red-400",
    borderGradient: "from-red-500/60 to-pink-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#f87171aa]"
  },
  {
    title: "Informática",
    slug: "informatica",
    icon: Desktop,
    desc: "Windows, Word, Excel (fundamental → avançado)…",
    textColor: "text-blue-400",
    borderGradient: "from-blue-500/60 to-indigo-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#60a5faaa]"
  },
  {
    title: "Design Gráfico",
    slug: "design-grafico",
    icon: PenNib,
    desc: "Photoshop, Illustrator, InDesign, Canva, Social…",
    textColor: "text-pink-400",
    borderGradient: "from-pink-500/60 to-rose-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#f472b6aa]"
  },
  {
    title: "Programação",
    slug: "programacao",
    icon: Code,
    desc: "Lógica, Python, Java, PHP, Android Studio, Jogos…",
    textColor: "text-green-400",
    borderGradient: "from-green-500/60 to-emerald-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#4ade80aa]"
  },
  {
    title: "Marketing Digital",
    slug: "marketing-digital",
    icon: ChartLine,
    desc: "Social Ads, SEO, Copywriting, Canva, Branding, Analytics…",
    textColor: "text-purple-400",
    borderGradient: "from-purple-500/60 to-violet-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#a78bfaaa]"
  },
  {
    title: "Inteligência Artificial",
    slug: "inteligencia-artificial",
    icon: Robot,
    desc: "Cursor, Prompt Engineering, ChatGPT, Visão…",
    textColor: "text-cyan-400",
    borderGradient: "from-cyan-500/60 to-teal-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#22d3eeaa]"
  },
  {
    title: "Business Intelligence",
    slug: "business-intelligence",
    icon: ChartBar,
    desc: "Master Excel, Power BI, Dashboards, Storytelling de Dados…",
    textColor: "text-indigo-400",
    borderGradient: "from-indigo-500/60 to-blue-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#818cf8aa]"
  },
  {
    title: "Administração",
    slug: "administracao",
    icon: Briefcase,
    desc: "Office, Excel Avançado, DP, Matemática Financeira, Liderança…",
    textColor: "text-violet-400",
    borderGradient: "from-violet-500/60 to-purple-400/60",
    hoverShadow: "hover:shadow-[0_0_25px_#8b5cf6aa]"
  }
];
function CourseCard({ title, slug, icon: Icon, desc, textColor, borderGradient, hoverShadow }) {
  const [ref, visible] = useInView();
  return /* @__PURE__ */ jsx(
    "a",
    {
      ref,
      href: `/cursos/${slug}`,
      className: `card-enter ${visible ? "in-view" : ""} relative clip-card w-full h-[120px] p-[3px] bg-gradient-to-r ${borderGradient} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${hoverShadow} focus-visible:ring-2 ring-fuchsia-500 focus:outline-none block`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "clip-card w-full h-full flex items-center gap-6 px-8 bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition",
          children: [
            /* @__PURE__ */ jsx(Icon, { size: 32, weight: "duotone", className: `${textColor} flex-shrink-0` }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx("h3", { className: `font-semibold text-lg text-left leading-tight truncate ${textColor}`, children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300 leading-snug text-left line-clamp-2", children: desc })
            ] })
          ]
        }
      )
    }
  );
}
function Courses() {
  return /* @__PURE__ */ jsxs(Section, { id: "cursos", className: "px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0", children: [
    /* @__PURE__ */ jsx(Starfield, { className: "opacity-20" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-center text-3xl sm:text-5xl font-bold mb-12", children: "Nossos Cursos" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center max-w-6xl mx-auto", children: COURSES.map((c) => /* @__PURE__ */ jsx(CourseCard, { ...c }, c.title)) })
    ] })
  ] });
}
const STEPS = [
  {
    number: "01",
    title: "Escolha seu Curso",
    description: "Selecione a área que mais combina com seus objetivos",
    icon: BookOpen,
    color: "text-blue-400",
    borderGradient: "from-blue-500/60 to-cyan-400/60"
  },
  {
    number: "02",
    title: "Experimente Grátis",
    description: "Aula experimental sem compromisso",
    icon: Play,
    color: "text-amber-400",
    borderGradient: "from-amber-500/60 to-yellow-400/60",
    isSpecial: true
  },
  {
    number: "03",
    title: "Aprenda na Prática",
    description: "Projetos reais desde o primeiro dia",
    icon: Trophy,
    color: "text-green-400",
    borderGradient: "from-green-500/60 to-emerald-400/60"
  },
  {
    number: "04",
    title: "Acelere sua Carreira",
    description: "Conquiste melhores oportunidades",
    icon: Rocket,
    color: "text-purple-400",
    borderGradient: "from-purple-500/60 to-pink-400/60"
  }
];
function SimpleCard({ step, index }) {
  const [ref, visible] = useInView();
  const { number, title, description, icon: Icon, color, borderGradient, isSpecial } = step;
  const isChooseCard = number === "01";
  const CardWrapper = isChooseCard ? "a" : "div";
  const cardProps = isChooseCard ? { href: "#cursos" } : {};
  return /* @__PURE__ */ jsx(
    CardWrapper,
    {
      ...cardProps,
      className: `${isChooseCard ? "cursor-pointer" : ""} block`,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          ref,
          className: `step-card ${visible ? "in-view" : ""} flex flex-col items-center text-center max-w-xs group`,
          style: { animationDelay: `${index * 0.2}s` },
          children: [
            /* @__PURE__ */ jsxs("div", { className: `mb-4 w-12 h-12 rounded-full bg-gradient-to-r ${borderGradient} flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:scale-110 ${isSpecial ? "tech-badge-special" : "tech-badge"}`, children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" }),
              /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-sm relative z-10", children: number }),
              isSpecial && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full animate-ping" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: `w-64 h-40 bg-gradient-to-r ${borderGradient} rounded-xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${isSpecial ? "group-hover:shadow-amber-500/30" : "group-hover:shadow-cyan-500/30"} tech-card ${isChooseCard ? "group-hover:shadow-blue-500/40" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "w-full h-full bg-zinc-900 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" }),
              /* @__PURE__ */ jsx(
                Icon,
                {
                  size: 28,
                  weight: "duotone",
                  className: `${color} mb-3 tech-icon transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_6px_currentColor]`
                }
              ),
              /* @__PURE__ */ jsx("h3", { className: `font-semibold text-base mb-2 ${color} transition-colors duration-300 group-hover:text-white`, children: title }),
              /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-xs text-center leading-relaxed transition-colors duration-300 group-hover:text-zinc-100", children: description }),
              isChooseCard && /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border border-blue-400 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-blue-400 rounded-full" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" }),
                /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300" }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500" })
              ] })
            ] }) })
          ]
        }
      )
    }
  );
}
function HowItWorksSimple() {
  return /* @__PURE__ */ jsx(Section, { id: "como-funciona", className: "px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0", children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-6xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold mb-6", children: "Habilidades que destacam você no mercado" }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed", children: "Cursos práticos e objetivos para desenvolver suas habilidades. Aprenda fazendo e veja resultados reais na sua vida profissional." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-8 lg:hidden", children: STEPS.map((step, index) => /* @__PURE__ */ jsx(SimpleCard, { step, index }, step.number)) }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:flex items-center justify-center gap-8 xl:gap-12 timeline-dynamic", children: STEPS.map((step, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "dynamic-step",
          style: {
            animationDelay: `${index * 0.8}s`,
            "--step-index": index
          },
          children: [
            /* @__PURE__ */ jsx(SimpleCard, { step, index }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
              /* @__PURE__ */ jsx("div", { className: "ripple-wave" }),
              /* @__PURE__ */ jsx("div", { className: "ripple-wave ripple-wave-2" }),
              /* @__PURE__ */ jsx("div", { className: "ripple-wave ripple-wave-3" })
            ] })
          ]
        },
        step.number
      )) })
    ] })
  ] }) });
}
const Reviews = () => {
  const stats = {
    totalReviews: 127,
    googleRating: 4.9,
    studentsGraduated: 1e3,
    yearsExperience: 8
  };
  const reviews = [
    {
      id: 1,
      name: "Karolain Roberta Régis",
      course: "Projetista",
      rating: 5,
      date: "2024-11-20",
      text: "Estou fazendo o curso e estou adorando, professor atencioso, com atividades super dinâmicas, aprendi já bastante coisas que ainda não sabia, estão super atualizados no mercado, eles têm deles mesmo até IA ajudando o pessoal nas medições e até em render rápidos, fora a apostila bem completa.",
      highlight: true,
      gradient: "from-purple-500/60 to-violet-400/60",
      shadowColor: "purple-500/30"
    },
    {
      id: 2,
      name: "Renan Souza",
      course: "Programação",
      rating: 5,
      date: "2024-10-15",
      text: "Minha experiência na Escola Habilidade está sendo ótima, estou no curso de programação. Curso presencial, atenção total do professor, atividades totalmente práticas e divertidas que chamam totalmente minha atenção.",
      highlight: true,
      gradient: "from-blue-500/60 to-cyan-400/60",
      shadowColor: "blue-500/30"
    },
    {
      id: 3,
      name: "Emily Vitoria",
      course: "Informática Fundamental + Administração de Empresas",
      rating: 5,
      date: "2024-11-20",
      text: "Lugar ótimo e acolhedor, as turmas pequenas realmente facilitam a precisão na hora de aprender e o foco do professor para cada aluno. Recomendo!",
      highlight: false,
      gradient: "from-pink-500/60 to-rose-400/60",
      shadowColor: "pink-500/30"
    },
    {
      id: 4,
      name: "Luiza Bóz Dutra",
      course: "Informática Fundamental",
      rating: 5,
      date: "2024-10-01",
      text: "O espaço é muito acolhedor, e as aulas são bastante explicativas e práticas. Durante as aulas, conseguimos tirar todas as nossas dúvidas, e os professores são extremamente dedicados.",
      highlight: true,
      gradient: "from-amber-500/60 to-yellow-400/60",
      shadowColor: "amber-500/30"
    },
    {
      id: 5,
      name: "Jonatas Torres",
      course: "Projetista",
      rating: 5,
      date: "2024-11-20",
      text: "Estou tendo uma excelente experiência com a Escola Habilidade no curso de SketchUp. O conteúdo é muito bem estruturado, o professor domina o assunto e sabe explicar de forma clara, mesmo para quem está começando.",
      highlight: false,
      gradient: "from-green-500/60 to-emerald-400/60",
      shadowColor: "green-500/30"
    },
    {
      id: 6,
      name: "Ana Caroline Orofino",
      course: "Projetista",
      rating: 5,
      date: "2024-10-15",
      text: "Estou adorando as aulas, professor muito atencioso, sempre traz questões do cotidiano para resolução das atividades!",
      highlight: false,
      gradient: "from-cyan-500/60 to-teal-400/60",
      shadowColor: "cyan-500/30"
    }
  ];
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ jsx(
      Star,
      {
        size: 14,
        weight: index < rating ? "fill" : "regular",
        className: index < rating ? "text-yellow-400" : "text-zinc-600"
      },
      index
    ));
  };
  const getInitials = (name) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };
  function ReviewCard({ review, index }) {
    const [ref, visible] = useInView();
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `card-enter ${visible ? "in-view" : ""} break-inside-avoid group`,
        style: { animationDelay: `${index * 0.1}s` },
        children: /* @__PURE__ */ jsx("div", { className: `bg-gradient-to-r ${review.gradient} rounded-2xl p-[2px] transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-2 group-hover:shadow-${review.shadowColor} tech-card`, children: /* @__PURE__ */ jsxs("div", { className: "w-full bg-zinc-900 rounded-2xl p-6 relative overflow-hidden transition-colors duration-300 group-hover:bg-zinc-800", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsx(Quotes, { size: 20, className: "text-cyan-400 opacity-60 tech-icon", weight: "fill" }),
            review.highlight && /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 px-3 py-1 rounded-full text-xs font-bold special-badge", children: "DESTAQUE" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mb-3", children: renderStars(review.rating) }),
          /* @__PURE__ */ jsxs("p", { className: "text-zinc-300 leading-relaxed mb-4 text-sm group-hover:text-zinc-100 transition-colors duration-300", children: [
            '"',
            review.text,
            '"'
          ] }),
          /* @__PURE__ */ jsx("div", { className: "border-t border-zinc-700 pt-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `w-10 h-10 rounded-full bg-gradient-to-r ${review.gradient} flex items-center justify-center text-white font-bold text-sm tech-badge transition-transform duration-300 group-hover:scale-110`, children: getInitials(review.name) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white text-sm", children: review.name }),
                /* @__PURE__ */ jsx("p", { className: "text-cyan-400 font-medium text-xs", children: review.course })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-zinc-500 mb-1", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 10 }),
                new Date(review.date).toLocaleDateString("pt-BR", {
                  month: "short",
                  year: "numeric"
                })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-xs text-zinc-500", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 10 }),
                "São José - SC"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping" }),
            /* @__PURE__ */ jsx("div", { className: "absolute bottom-3 left-3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-300" }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-ping animation-delay-500" })
          ] })
        ] }) })
      }
    );
  }
  function StatCard({ stat, index }) {
    const [ref, visible] = useInView();
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `card-enter ${visible ? "in-view" : ""} text-center group`,
        style: { animationDelay: `${index * 0.1}s` },
        children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-zinc-800 hover:border-cyan-400/50 transition-all duration-300 group-hover:scale-105 h-24 flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center mb-2 h-6", children: stat.icon }),
          /* @__PURE__ */ jsx("div", { className: "text-2xl md:text-3xl font-bold text-white mb-1 gradient-text", children: stat.value }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-zinc-400 font-medium", children: stat.label })
        ] })
      }
    );
  }
  return /* @__PURE__ */ jsxs(Section, { id: "avaliacoes", className: "px-4 py-8 bg-zinc-950 text-white items-start justify-start min-h-0", children: [
    /* @__PURE__ */ jsx(Starfield, { className: "opacity-10" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 max-w-7xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-6 tech-badge", children: [
          /* @__PURE__ */ jsx(Star, { size: 16, weight: "fill", className: "tech-icon" }),
          "Avaliações"
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold mb-6 text-white", children: "O que nossos alunos dizem" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-lg max-w-2xl mx-auto mb-12 leading-relaxed", children: "Histórias reais de transformação e sucesso profissional" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16", children: [
          /* @__PURE__ */ jsx(
            StatCard,
            {
              stat: {
                icon: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-1", children: renderStars(5) }),
                value: stats.googleRating,
                label: "Google Reviews"
              },
              index: 0
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              stat: {
                icon: /* @__PURE__ */ jsx(Star, { size: 24, weight: "fill", className: "text-yellow-400 tech-icon" }),
                value: `${stats.totalReviews}+`,
                label: "Avaliações"
              },
              index: 1
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              stat: {
                icon: /* @__PURE__ */ jsx(User, { size: 24, weight: "fill", className: "text-cyan-400 tech-icon" }),
                value: `${stats.studentsGraduated}+`,
                label: "Alunos Formados"
              },
              index: 2
            }
          ),
          /* @__PURE__ */ jsx(
            StatCard,
            {
              stat: {
                icon: /* @__PURE__ */ jsx(Trophy, { size: 24, weight: "fill", className: "text-purple-400 tech-icon" }),
                value: stats.yearsExperience,
                label: "Anos de Experiência"
              },
              index: 3
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-16", children: reviews.map((review, index) => /* @__PURE__ */ jsx(ReviewCard, { review, index }, review.id)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-0", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping" }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-8 right-8 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-300" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping animation-delay-500" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-4", children: [
            /* @__PURE__ */ jsx(Trophy, { size: 28, weight: "fill", className: "text-yellow-400 tech-icon" }),
            /* @__PURE__ */ jsx("span", { className: "text-xl font-bold", children: "Seja o próximo sucesso!" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold mb-4", children: "Desenvolva suas habilidades conosco" }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed", children: "Junte-se aos nossos alunos que já aprimoraram suas habilidades e conhecimentos" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
            /* @__PURE__ */ jsx(GradientButton, { href: "#cursos", className: "px-8 py-3", children: "Ver Cursos Disponíveis" }),
            /* @__PURE__ */ jsx(
              GradientButton,
              {
                href: "https://wa.me/5548988559491?text=Olá! Gostaria de agendar uma visita.",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "px-8 py-3",
                children: "Agendar Visita"
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center items-center gap-8 mt-12 opacity-60", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-500 hover:text-purple-400 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx(Trophy, { size: 18, className: "tech-icon" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Certificação Nacional" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-500 hover:text-pink-400 transition-colors duration-300", children: [
          /* @__PURE__ */ jsx(MapPin, { size: 18, className: "tech-icon" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Kobrasol, São José - SC" })
        ] })
      ] })
    ] })
  ] });
};
const LatestBlogSection = () => {
  var _a;
  const { data, isLoading, error } = usePosts(1, 3);
  if (isLoading) {
    return /* @__PURE__ */ jsx(Section, { className: "bg-zinc-900/50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "h-8 bg-zinc-700/50 rounded-lg w-64 mx-auto mb-4 animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/30 rounded w-96 mx-auto animate-pulse" })
      ] }),
      /* @__PURE__ */ jsx(Loading, {})
    ] }) });
  }
  if (error || !((_a = data == null ? void 0 : data.posts) == null ? void 0 : _a.length)) {
    return null;
  }
  const posts = data.posts;
  return /* @__PURE__ */ jsxs(Section, { className: "bg-zinc-900/50 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-5", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-20 left-10 w-32 h-32 border border-purple-400/20 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 right-10 w-24 h-24 border border-blue-400/20 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-40 right-20 w-16 h-16 border border-pink-400/20 rounded-full" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-16 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl", children: /* @__PURE__ */ jsx(Newspaper, { size: 24, className: "text-purple-400" }) }),
          /* @__PURE__ */ jsx(Star, { size: 20, className: "text-yellow-400 animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-zinc-100 mb-4", children: [
          "Últimas",
          " ",
          /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent", children: "Novidades" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-zinc-400 max-w-2xl mx-auto", children: "Fique por dentro das últimas tendências em tecnologia, dicas de carreira e novidades do mercado digital" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:gap-8 mb-10", children: [
        posts[0] && /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Star, { size: 20, className: "text-yellow-400" }),
            "Artigo em Destaque"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsx(BlogCard, { post: posts[0], variant: "featured" }) })
        ] }),
        posts.length > 1 && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-xl font-semibold text-gray-300 mb-6 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Newspaper, { size: 20, className: "text-purple-400" }),
            "Mais Artigos"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: posts.slice(1).map((post, index) => /* @__PURE__ */ jsx(
            BlogCard,
            {
              post,
              variant: "compact",
              index: index + 1
            },
            post.slug
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/20 backdrop-blur-sm hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-500/40 transition-all duration-300 group", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/blog",
            className: "flex items-center gap-3 text-lg font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors",
            children: [
              "Ver Todos os Artigos",
              /* @__PURE__ */ jsx(
                ArrowRight,
                {
                  size: 20,
                  className: "group-hover:translate-x-1 transition-transform duration-300"
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-500 mt-4", children: "Explore nossa biblioteca completa de artigos sobre tecnologia e carreira" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-8 mt-12 pt-8 border-t border-zinc-700/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-purple-400 mb-1", children: "50+" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: "Artigos" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-px h-8 bg-zinc-700/50" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-400 mb-1", children: "5" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: "Categorias" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-px h-8 bg-zinc-700/50" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-400 mb-1", children: "Semanal" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-500", children: "Atualizações" })
        ] })
      ] })
    ] })
  ] });
};
const FAQ_DATA = [
  {
    question: "Quais são os pré-requisitos para os cursos?",
    answer: "A maioria dos nossos cursos não exige conhecimento prévio. Oferecemos desde níveis básicos até avançados. Para cursos específicos como programação avançada, indicamos ter conhecimento básico de lógica."
  },
  {
    question: "Os cursos oferecem certificado?",
    answer: "Sim! Todos os nossos cursos oferecem certificação nacional reconhecida. O certificado é emitido após a conclusão do curso e aprovação nas avaliações."
  },
  {
    question: "Qual é a duração dos cursos?",
    answer: "A duração varia conforme o curso. Temos cursos de 40h (1 mês) até 120h (3 meses). Consulte a carga horária específica de cada curso em nossa grade."
  },
  {
    question: "Como funcionam as aulas?",
    answer: "Nossas aulas são presenciais com metodologia prática. Cada aluno tem acesso a um computador equipado com todos os softwares necessários. Turmas pequenas garantem atenção individualizada."
  },
  {
    question: "Vocês oferecem suporte após o curso?",
    answer: "Sim! Oferecemos suporte pós-curso por 6 meses via WhatsApp para dúvidas técnicas. Também temos um grupo exclusivo de ex-alunos para networking e oportunidades."
  },
  {
    question: "Há desconto para pagamento à vista?",
    answer: "Sim! Oferecemos 10% de desconto para pagamento à vista. Também temos parcelamento em até 12x sem juros no cartão de crédito."
  },
  {
    question: "Posso fazer mais de um curso?",
    answer: "Claro! Incentivamos nossos alunos a expandirem suas habilidades. Oferecemos 15% de desconto para o segundo curso e 20% a partir do terceiro curso."
  },
  {
    question: "Como faço para me matricular?",
    answer: "Entre em contato conosco pelo WhatsApp (48) 98855-9491 ou preencha o formulário de contato. Nossa equipe irá esclarecer todas as dúvidas e auxiliar com a matrícula."
  }
];
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  const [ref, visible] = useInView();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: `card-enter ${visible ? "in-view" : ""} bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700/50 overflow-hidden transition-all duration-300 hover:border-zinc-600/50`,
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: onToggle,
            className: "w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-inset",
            "aria-expanded": isOpen,
            children: [
              /* @__PURE__ */ jsx("span", { className: "font-medium text-white pr-4", children: question }),
              /* @__PURE__ */ jsx(
                CaretDown,
                {
                  size: 20,
                  className: `text-fuchsia-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`,
            children: /* @__PURE__ */ jsx("div", { className: "px-6 pb-4 text-zinc-300 leading-relaxed", children: answer })
          }
        )
      ]
    }
  );
};
const FAQ = () => {
  const [openItems, setOpenItems] = useState(/* @__PURE__ */ new Set([0]));
  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };
  return /* @__PURE__ */ jsx(Section, { id: "faq", className: "py-16 bg-zinc-900 min-h-0", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx(Question, { size: 32, className: "text-fuchsia-400" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold text-white", children: "Perguntas Frequentes" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-lg max-w-2xl mx-auto", children: "Tire suas dúvidas sobre nossos cursos, metodologia e processo de matrícula" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: FAQ_DATA.map((item, index) => /* @__PURE__ */ jsx(
      FAQItem,
      {
        question: item.question,
        answer: item.answer,
        isOpen: openItems.has(index),
        onToggle: () => toggleItem(index)
      },
      index
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mt-12", children: [
      /* @__PURE__ */ jsx("p", { className: "text-zinc-400 mb-4", children: "Não encontrou sua resposta?" }),
      /* @__PURE__ */ jsxs(
        GradientButton,
        {
          href: "https://wa.me/5548988559491?text=Olá! Ainda tenho uma dúvida a respeito dos cursos, pode me ajudar?",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 px-6 py-3 hover:scale-105",
          children: [
            /* @__PURE__ */ jsx(Question, { size: 20 }),
            "Fale Conosco"
          ]
        }
      )
    ] })
  ] }) });
};
function Home() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Escola Habilidade - Cursos em Florianópolis e São José",
        description: "Escola de cursos profissionalizantes em Florianópolis, São José e Palhoça. Cursos de Informática, SketchUp, AutoCAD, Revit, Enscape, Marketing Digital, Programação e IA. Certificado reconhecido. Aulas presenciais e online.",
        keywords: "cursos profissionalizantes florianópolis, escola técnica são josé sc, cursos informática palhoça, curso sketchup florianópolis, curso autocad são josé, curso revit palhoça, curso enscape santa catarina, marketing digital florianópolis, programação são josé, inteligência artificial palhoça, cursos técnicos grande florianópolis, escola habilidade",
        path: "/",
        type: "website"
      }
    ),
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(Courses, {}),
    /* @__PURE__ */ jsx(HowItWorksSimple, {}),
    /* @__PURE__ */ jsx(Reviews, {}),
    /* @__PURE__ */ jsx(LatestBlogSection, {}),
    /* @__PURE__ */ jsx(ContactForm, {}),
    /* @__PURE__ */ jsx(FAQ, {})
  ] });
}
function loader() {
  return null;
}
export {
  Home as Component,
  Home as default,
  loader
};
