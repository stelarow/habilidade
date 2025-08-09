var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ViteReactSSG } from "vite-react-ssg";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { Component, useState, useEffect, useCallback, Suspense } from "react";
import { useLocation, useNavigate, Link, useParams, Outlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PropTypes from "prop-types";
import { WhatsappLogo, Phone, Play, User, MagnifyingGlass, CaretDown, GraduationCap, X, CaretRight, Question, House, Star, BookOpen, Clock, MapPin, InstagramLogo, Heart } from "@phosphor-icons/react";
import { f as usePageContext, h as useSmartCTA, s as searchCourses, i as getCourseBySlug, j as useToggle, k as usePerformanceLevel, l as useGoogleAnalytics, n as useUrlCleanup, o as useScrollToHash, p as domOptimizer } from "./assets/utils-DYyrIPL_.js";
import { C as COURSES_DATA } from "./assets/blog-components-BiqxfVKP.js";
import "./assets/blog-xsr1A1aF.js";
import "@supabase/supabase-js";
import "marked";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/xml";
import "node-html-parser";
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache settings
        staleTime: 5 * 60 * 1e3,
        // 5 minutes
        gcTime: 10 * 60 * 1e3,
        // 10 minutes (formerly cacheTime)
        // Retry settings
        retry: (failureCount, error) => {
          var _a, _b;
          if (((_a = error == null ? void 0 : error.response) == null ? void 0 : _a.status) >= 400 && ((_b = error == null ? void 0 : error.response) == null ? void 0 : _b.status) < 500) {
            return false;
          }
          return failureCount < 3;
        },
        // Performance settings
        refetchOnWindowFocus: false,
        // Disable refetch on window focus for better UX
        refetchOnReconnect: true,
        // Refetch when reconnecting to internet
        // Force refetch on mount to handle navigation between similar routes
        refetchOnMount: "always",
        // Background refetch settings
        refetchInterval: false,
        // No automatic background refetching
        refetchIntervalInBackground: false
      },
      mutations: {
        // Retry mutations once
        retry: 1
      }
    }
  });
};
let queryClient;
const getQueryClient = () => {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
};
const QueryProvider = ({ children }) => {
  const client = getQueryClient();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client, children: [
    children,
    process.env.NODE_ENV === "development" && /* @__PURE__ */ jsx(
      ReactQueryDevtools,
      {
        initialIsOpen: false,
        position: "bottom-right",
        buttonPosition: "bottom-right"
      }
    )
  ] });
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    __publicField(this, "handleReset", () => {
      this.setState({ hasError: false, error: null, errorInfo: null });
    });
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleReset);
      }
      return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("div", { className: "text-6xl mb-4", children: "⚠️" }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "Algo deu errado" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8", children: "Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para corrigir o problema." }),
          process.env.NODE_ENV === "development" && this.state.error && /* @__PURE__ */ jsxs("div", { className: "bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6 text-left", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-red-400 font-semibold mb-2", children: "Detalhes do erro (apenas em desenvolvimento):" }),
            /* @__PURE__ */ jsx("pre", { className: "text-red-300 text-sm overflow-auto", children: this.state.error.toString() }),
            this.state.errorInfo && /* @__PURE__ */ jsx("pre", { className: "text-red-300 text-xs mt-2 overflow-auto", children: this.state.errorInfo.componentStack })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: this.handleReset,
              className: "inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105",
              children: "Tentar Novamente"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.location.href = "/",
              className: "inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300",
              children: "Voltar ao Início"
            }
          )
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onError: PropTypes.func
};
ErrorBoundary.defaultProps = {
  fallback: null,
  onError: null
};
const ADAPTIVE_NAVIGATION = {
  home: [
    { label: "Cursos", href: "#cursos", icon: "BookOpen", description: "Conheça nossos cursos" },
    { label: "Como Funciona", href: "#como-funciona", icon: "Play", description: "Veja nossa metodologia" },
    { label: "Avaliações", href: "#avaliacoes", icon: "Star", description: "Depoimentos dos alunos" },
    { label: "Blog", href: "/blog", icon: "Article", description: "Artigos e conteúdos", external: true },
    { label: "FAQ", href: "#faq", icon: "Question", description: "Dúvidas frequentes" },
    { label: "Contato", href: "#contato", icon: "Phone", description: "Fale conosco" }
  ],
  coursePage: [
    { label: "Currículo", href: "#curriculo", icon: "BookOpen", description: "Grade do curso" },
    { label: "Depoimentos", href: "#depoimentos", icon: "Star", description: "Avaliações dos alunos" },
    { label: "FAQ", href: "#faq", icon: "Question", description: "Dúvidas frequentes" },
    { label: "Blog", href: "/blog", icon: "Article", description: "Artigos e conteúdos", external: true },
    { label: "Contato", href: "#contato", icon: "Phone", description: "Tire suas dúvidas" }
  ],
  blogPage: [
    { label: "Início", href: "/", icon: "House", description: "Voltar ao início", external: true },
    { label: "Cursos", href: "/#cursos", icon: "BookOpen", description: "Conheça nossos cursos", external: true },
    { label: "Tecnologia", href: "/blog/categoria/tecnologia", icon: "Code", description: "Artigos de tecnologia", external: true },
    { label: "Carreira", href: "/blog/categoria/carreira", icon: "Briefcase", description: "Dicas de carreira", external: true },
    { label: "Contato", href: "/#contato", icon: "Phone", description: "Fale conosco", external: true }
  ]
};
const LOGO_SIZES = {
  small: "text-xl sm:text-2xl",
  medium: "text-2xl sm:text-4xl",
  large: "text-4xl sm:text-6xl",
  hero: "text-6xl sm:text-8xl"
};
const LOGO_THEMES = {
  default: "gradient-text",
  ai: "gradient-text-ai",
  design: "gradient-text-design",
  programming: "gradient-text-programming",
  marketing: "gradient-text-marketing"
};
function LogoH({
  size = "medium",
  animated = true,
  theme = "default",
  showFullText = true,
  className = "",
  ...props
}) {
  const { pageType } = usePageContext();
  const logoClasses = `
    font-extrabold
    ${LOGO_SIZES[size]}
    ${LOGO_THEMES[theme]}
    ${animated ? "animate-gradient" : ""}
    ${className}
  `.trim();
  const textClasses = `
    text-white font-semibold
    ${size === "small" ? "text-sm" : size === "medium" ? "text-base sm:text-lg" : "text-lg sm:text-xl"}
  `.trim();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", ...props, children: [
    /* @__PURE__ */ jsx("span", { className: logoClasses, children: "H" }),
    showFullText && /* @__PURE__ */ jsx("span", { className: textClasses, children: "Escola Habilidade" })
  ] });
}
function InteractiveLogo() {
  const { pageType } = usePageContext();
  const location = useLocation();
  useNavigate();
  const handleLogoClick = (e) => {
    if (location.pathname.startsWith("/blog")) {
      e.preventDefault();
      window.location.href = "/";
    } else if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to: "/",
      onClick: handleLogoClick,
      className: "logo-container group flex items-center gap-3 focus:outline-none",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "logo-wrapper relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 group-focus:opacity-20 transition-opacity duration-300 transform scale-110" }),
          /* @__PURE__ */ jsx(
            LogoH,
            {
              size: "medium",
              animated: true,
              showFullText: true,
              className: "relative transition-all duration-300 group-hover:scale-105 group-focus:scale-105"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "logo-text-container hidden lg:block", children: /* @__PURE__ */ jsxs("span", { className: "tagline block text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300", children: [
          pageType === "home" && "Tecnologia que transforma carreiras",
          pageType === "coursePage" && "Aprenda com os melhores",
          pageType === "other" && "Sua jornada começa aqui"
        ] }) })
      ]
    }
  );
}
function GradientButton({ href, children, className = "", ...props }) {
  const base = "btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition";
  const classes = `${base} ${className}`;
  if (href) {
    const handleClick = (e) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const element = document.getElementById(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    return /* @__PURE__ */ jsx("a", { href, className: classes, onClick: handleClick, ...props, children });
  }
  return /* @__PURE__ */ jsx("button", { type: "button", className: classes, ...props, children });
}
function WhatsAppButton({ className = "", size = "medium", ...props }) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };
  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18
  };
  return /* @__PURE__ */ jsx(
    "a",
    {
      href: "https://wa.me/5548988559491",
      target: "_blank",
      rel: "noopener noreferrer",
      className: `
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-r from-green-500 via-green-400 to-cyan-400 
        hover:from-green-600 hover:via-green-500 hover:to-cyan-500 
        flex items-center justify-center 
        transition-all duration-300 
        hover:scale-110 
        shadow-lg 
        hover:shadow-green-500/25
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
        ${className}
      `,
      title: "WhatsApp - Contato Direto",
      "aria-label": "Entrar em contato via WhatsApp",
      ...props,
      children: /* @__PURE__ */ jsx(
        WhatsappLogo,
        {
          size: iconSizes[size],
          weight: "bold",
          className: "text-white"
        }
      )
    }
  );
}
function SmartCTA() {
  const ctaConfig = useSmartCTA();
  return /* @__PURE__ */ jsxs("div", { className: "cta-group flex items-center gap-3", children: [
    /* @__PURE__ */ jsxs(
      GradientButton,
      {
        href: ctaConfig.primary.href,
        target: ctaConfig.primary.href.startsWith("http") ? "_blank" : void 0,
        rel: ctaConfig.primary.href.startsWith("http") ? "noopener noreferrer" : void 0,
        className: `
          hidden md:inline-flex items-center gap-2 font-medium transition-all duration-300
          ${ctaConfig.primary.style === "compact" ? "px-3 py-2 text-xs" : "px-6 py-3 text-sm"}
        `,
        children: [
          ctaConfig.primary.href.includes("#contato") && /* @__PURE__ */ jsx(Phone, { size: 16, weight: "bold" }),
          ctaConfig.primary.label === "Aula Grátis" && /* @__PURE__ */ jsx(Play, { size: 16, weight: "bold" }),
          ctaConfig.primary.label
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "https://ead.escolahabilidade.com",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "\r\n          md:hidden w-10 h-10 rounded-full \r\n          bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 \r\n          hover:from-fuchsia-700 hover:via-purple-700 hover:to-blue-700 \r\n          flex items-center justify-center \r\n          transition-all duration-300 \r\n          hover:scale-110 \r\n          shadow-lg \r\n          hover:shadow-fuchsia-500/25\r\n          focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900\r\n        ",
        title: "Área do Aluno - Plataforma de Ensino",
        "aria-label": "Acessar área do aluno",
        children: /* @__PURE__ */ jsx(
          User,
          {
            size: 16,
            weight: "bold",
            className: "text-white"
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      WhatsAppButton,
      {
        size: "medium",
        className: "md:w-8 md:h-8"
      }
    )
  ] });
}
function MegaMenu({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categories = ["Tecnologia", "Design & Criação", "Marketing", "Gestão"];
  const filteredCourses = (() => {
    const searchResults = searchTerm ? searchCourses(searchTerm, COURSES_DATA) : COURSES_DATA.filter((course) => course.basicInfo.active);
    return selectedCategory ? searchResults.filter((course) => course.basicInfo.category === selectedCategory) : searchResults;
  })();
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "mega-menu absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 shadow-2xl z-40", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto p-6", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(MagnifyingGlass, { size: 20, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Buscar cursos...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none transition"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCategory(null),
            className: `px-4 py-2 rounded-lg text-sm font-medium transition ${!selectedCategory ? "bg-fuchsia-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`,
            children: "Todos"
          }
        ),
        categories.map((category) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSelectedCategory(category),
            className: `px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === category ? "bg-fuchsia-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`,
            children: category
          },
          category
        ))
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredCourses.slice(0, 6).map((course) => /* @__PURE__ */ jsx(
      "a",
      {
        href: `/cursos/${course.basicInfo.slug}`,
        onClick: onClose,
        className: "group p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600 transition",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0",
              style: {
                background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
              },
              children: course.basicInfo.title.charAt(0)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white group-hover:text-fuchsia-300 transition truncate", children: course.basicInfo.title }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-1 line-clamp-2", children: course.basicInfo.shortDescription }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-2 text-xs text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { children: course.basicInfo.level }),
              /* @__PURE__ */ jsx("span", { children: "•" }),
              /* @__PURE__ */ jsx("span", { children: course.basicInfo.duration })
            ] })
          ] })
        ] })
      },
      course.basicInfo.id
    )) }),
    filteredCourses.length > 6 && /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsxs(
      "a",
      {
        href: "#cursos",
        onClick: (e) => {
          e.preventDefault();
          onClose();
          const element = document.getElementById("cursos");
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        },
        className: "inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white font-semibold rounded-lg hover:from-fuchsia-600 hover:to-cyan-500 transition",
        children: [
          "Ver Todos os Cursos",
          /* @__PURE__ */ jsx(CaretDown, { size: 16, className: "rotate-[-90deg]" })
        ]
      }
    ) }),
    filteredCourses.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-400 mb-4", children: [
        'Nenhum curso encontrado para "',
        searchTerm,
        '"'
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setSearchTerm("");
            setSelectedCategory(null);
          },
          className: "text-fuchsia-400 hover:text-fuchsia-300 transition",
          children: "Limpar filtros"
        }
      )
    ] })
  ] }) });
}
function MobileMegaMenu({ isOpen, onClose }) {
  const { pageType } = usePageContext();
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("navigation");
  let currentNavigation = ADAPTIVE_NAVIGATION[pageType] || ADAPTIVE_NAVIGATION.home;
  if (pageType === "coursePage" && slug) {
    const course = getCourseBySlug(slug, COURSES_DATA);
    if (course && (!course.faq || course.faq.length === 0)) {
      currentNavigation = currentNavigation.filter((link) => link.label !== "FAQ");
    }
  }
  const featuredCourses = COURSES_DATA.filter((course) => course.basicInfo.active).slice(0, 3);
  const filteredCourses = searchTerm ? searchCourses(searchTerm, COURSES_DATA) : COURSES_DATA.filter((course) => course.basicInfo.active);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const getIconComponent = (iconName) => {
    const icons = {
      BookOpen,
      Star,
      Phone,
      House,
      Play,
      Question
    };
    return icons[iconName] || BookOpen;
  };
  return /* @__PURE__ */ jsxs("div", { className: "mobile-mega-menu fixed inset-0 z-[100] lg:hidden", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-0 h-full w-full max-w-sm bg-gray-900 shadow-2xl overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "sticky top-0 bg-gray-900 border-b border-gray-800 p-4 z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(GraduationCap, { size: 24, className: "text-fuchsia-400" }),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-white", children: "Menu" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: onClose,
              className: "p-2 rounded-lg hover:bg-gray-800 transition",
              "aria-label": "Fechar menu",
              children: /* @__PURE__ */ jsx(X, { size: 24, className: "text-gray-400 hover:text-white" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex bg-gray-800 rounded-lg p-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("navigation"),
              className: `flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${activeTab === "navigation" ? "bg-fuchsia-500 text-white" : "text-gray-400 hover:text-white"}`,
              children: "Navegação"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setActiveTab("courses"),
              className: `flex-1 py-2 px-3 text-sm font-medium rounded-md transition ${activeTab === "courses" ? "bg-fuchsia-500 text-white" : "text-gray-400 hover:text-white"}`,
              children: "Cursos"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
        activeTab === "navigation" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3", children: "Navegação Principal" }),
            /* @__PURE__ */ jsx("nav", { className: "space-y-2", children: currentNavigation.map((link) => {
              const IconComponent = getIconComponent(link.icon);
              return /* @__PURE__ */ jsxs(
                "a",
                {
                  href: link.href,
                  onClick: onClose,
                  className: "group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition",
                  children: [
                    /* @__PURE__ */ jsx(IconComponent, { size: 20, className: "text-fuchsia-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-white font-medium block", children: link.label }),
                      /* @__PURE__ */ jsx("span", { className: "text-gray-400 text-sm", children: link.description })
                    ] }),
                    /* @__PURE__ */ jsx(CaretRight, { size: 16, className: "text-gray-400 group-hover:text-white transition flex-shrink-0" })
                  ]
                },
                link.href
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3", children: "Cursos em Destaque" }),
            /* @__PURE__ */ jsx("div", { className: "space-y-3", children: featuredCourses.map((course) => /* @__PURE__ */ jsx(
              "a",
              {
                href: `/cursos/${course.basicInfo.slug}`,
                onClick: onClose,
                className: "group block p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
                      style: {
                        background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                      },
                      children: course.basicInfo.title.charAt(0)
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-medium text-white group-hover:text-fuchsia-300 transition truncate", children: course.basicInfo.title }),
                    /* @__PURE__ */ jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [
                      course.basicInfo.level,
                      " • ",
                      course.basicInfo.duration
                    ] })
                  ] })
                ] })
              },
              course.basicInfo.id
            )) })
          ] })
        ] }),
        activeTab === "courses" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(MagnifyingGlass, { size: 20, className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Buscar cursos...",
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-fuchsia-400 focus:outline-none transition"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: filteredCourses.map((course) => /* @__PURE__ */ jsx(
            "a",
            {
              href: `/cursos/${course.basicInfo.slug}`,
              onClick: onClose,
              className: "group block p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg border border-gray-700/50 transition",
              children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0",
                    style: {
                      background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                    },
                    children: course.basicInfo.title.charAt(0)
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-medium text-white group-hover:text-fuchsia-300 transition", children: course.basicInfo.title }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 mt-1 line-clamp-2", children: course.basicInfo.shortDescription }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-500", children: [
                    /* @__PURE__ */ jsx("span", { children: course.basicInfo.level }),
                    /* @__PURE__ */ jsx("span", { children: "•" }),
                    /* @__PURE__ */ jsx("span", { children: course.basicInfo.duration })
                  ] })
                ] })
              ] })
            },
            course.basicInfo.id
          )) }),
          filteredCourses.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-8", children: [
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4", children: "Nenhum curso encontrado" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setSearchTerm(""),
                className: "text-fuchsia-400 hover:text-fuchsia-300 transition",
                children: "Limpar busca"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4", children: /* @__PURE__ */ jsxs(
        GradientButton,
        {
          href: "https://wa.me/5548988559491",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-full py-3 text-center font-semibold flex items-center justify-center gap-2",
          children: [
            /* @__PURE__ */ jsx(WhatsappLogo, { size: 20 }),
            "Falar no WhatsApp"
          ]
        }
      ) })
    ] })
  ] });
}
function Header() {
  const [mobileMenuOpen, toggleMobileMenu, , closeMobileMenu] = useToggle(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const { pageType } = usePageContext();
  const { slug } = useParams();
  let currentNavigation = ADAPTIVE_NAVIGATION[pageType] || ADAPTIVE_NAVIGATION.home;
  if (pageType === "coursePage" && slug) {
    const course = getCourseBySlug(slug, COURSES_DATA);
    if (course && (!course.faq || course.faq.length === 0)) {
      currentNavigation = currentNavigation.filter((link) => link.label !== "FAQ");
    }
  }
  const handleNavClick = () => {
    setMegaMenuOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "#main-content",
        className: "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-fuchsia-600 text-white px-4 py-2 rounded-md z-[60] transition-all",
        children: "Pular para o conteúdo principal"
      }
    ),
    /* @__PURE__ */ jsxs("header", { className: "fixed top-0 w-full bg-zinc-900/70 backdrop-blur-md z-50 border-b border-gray-800/50", role: "banner", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-7xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-16", children: [
        /* @__PURE__ */ jsx(InteractiveLogo, {}),
        /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setMegaMenuOpen(!megaMenuOpen),
              className: "flex items-center gap-1 text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1",
              "aria-expanded": megaMenuOpen,
              "aria-haspopup": "true",
              children: [
                "Cursos",
                /* @__PURE__ */ jsx(CaretDown, { size: 14, className: `transition-transform duration-200 ${megaMenuOpen ? "rotate-180" : ""}` })
              ]
            }
          ),
          currentNavigation.filter((link) => link.label !== "Cursos").map(({ label, href }) => /* @__PURE__ */ jsx(
            "a",
            {
              href,
              onClick: (e) => {
                handleNavClick();
                if (href.startsWith("#")) {
                  e.preventDefault();
                  const element = document.getElementById(href.substring(1));
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              },
              className: "text-white hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm px-2 py-1",
              children: label
            },
            href
          ))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(SmartCTA, {}),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: toggleMobileMenu,
              "aria-label": mobileMenuOpen ? "Fechar menu" : "Abrir menu",
              "aria-expanded": mobileMenuOpen,
              className: "md:hidden flex flex-col justify-center gap-[3px] p-2 transition focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm",
              children: [
                /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}` }),
                /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 bg-white transition-opacity duration-300 ${mobileMenuOpen ? "opacity-0" : ""}` }),
                /* @__PURE__ */ jsx("span", { className: `w-6 h-0.5 bg-white transition-transform duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}` })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        MegaMenu,
        {
          isOpen: megaMenuOpen,
          onClose: () => setMegaMenuOpen(false)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      MobileMegaMenu,
      {
        isOpen: mobileMenuOpen,
        onClose: closeMobileMenu
      }
    ),
    megaMenuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 bg-transparent z-30",
        onClick: () => setMegaMenuOpen(false)
      }
    )
  ] });
}
function Section({ id, className = "", fullHeight = false, children, ...props }) {
  const minHeight = fullHeight ? "min-h-screen" : "min-h-0";
  const base = `relative flex flex-col items-center justify-center ${minHeight} px-4`;
  const classes = `${base} ${className}`;
  return /* @__PURE__ */ jsx("section", { id, className: classes, ...props, children });
}
const Footer = () => {
  return /* @__PURE__ */ jsx(Section, { className: "bg-zinc-950 text-white py-16 min-h-0", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          LogoH,
          {
            size: "small",
            animated: false,
            showFullText: true,
            className: "mb-2"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm leading-relaxed", children: "Transformando vidas através da educação tecnológica. Cursos práticos e atualizados para o mercado de trabalho." }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-400", children: [
          /* @__PURE__ */ jsx(Clock, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Seg-Sex: 8h às 18h" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-fuchsia-400", children: "Navegação" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/", className: "text-zinc-300 hover:text-white transition-colors", children: "Início" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#cursos", onClick: (e) => {
            var _a;
            e.preventDefault();
            (_a = document.getElementById("cursos")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          }, className: "text-zinc-300 hover:text-white transition-colors", children: "Cursos" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/blog", className: "text-zinc-300 hover:text-white transition-colors", children: "Blog" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#como-funciona", onClick: (e) => {
            var _a;
            e.preventDefault();
            (_a = document.getElementById("como-funciona")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          }, className: "text-zinc-300 hover:text-white transition-colors", children: "Como Funciona" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "#contato", onClick: (e) => {
            var _a;
            e.preventDefault();
            (_a = document.getElementById("contato")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          }, className: "text-zinc-300 hover:text-white transition-colors", children: "Contato" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-fuchsia-400", children: "Nossa Localização" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 text-zinc-300", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "mt-1 flex-shrink-0" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              /* @__PURE__ */ jsx("p", { children: "R. Caetano José Ferreira, 426" }),
              /* @__PURE__ */ jsx("p", { children: "Sala 5 - Kobrasol" }),
              /* @__PURE__ */ jsx("p", { children: "São José - SC, 88102-280" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full h-32 bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700", children: [
              /* @__PURE__ */ jsx(
                "iframe",
                {
                  src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.0113289745933!2d-48.6175692!3d-27.5923906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527492f4454ef8d%3A0xd345f5e77312fdec!2sEscola%20Habilidade!5e0!3m2!1spt-BR!2sbr!4v1736172000000!5m2!1spt-BR!2sbr",
                  width: "100%",
                  height: "100%",
                  style: { border: 0 },
                  allowFullScreen: "",
                  loading: "lazy",
                  referrerPolicy: "no-referrer-when-downgrade",
                  title: "Localização da Escola Habilidade",
                  className: "rounded-lg"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute inset-0 bg-transparent cursor-pointer",
                  onClick: () => window.open("https://www.google.com/maps/place/Escola+Habilidade/@-27.5923906,-48.6175692,17z/data=!3m1!4b1!4m6!3m5!1s0x9527492f4454ef8d:0xd345f5e77312fdec!8m2!3d-27.5923906!4d-48.6149943!16s%2Fg%2F11w49mrz34", "_blank"),
                  title: "Abrir no Google Maps"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500 mt-1", children: "Clique para abrir no Google Maps" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-fuchsia-400", children: "Contato" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-300", children: [
            /* @__PURE__ */ jsx(Phone, { size: 16 }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "tel:+5548988559491",
                className: "text-sm hover:text-white transition-colors",
                children: "(48) 98855-9491"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-300", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16 }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Kobrasol - São José/SC" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-fuchsia-400", children: "Contato Rápido" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://wa.me/5548988559491",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors group",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, className: "text-white" }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-white text-sm font-medium", children: "WhatsApp" }),
                  /* @__PURE__ */ jsx("div", { className: "text-green-100 text-xs", children: "(48) 98855-9491" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://instagram.com/habilidade.escola",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all group",
              children: [
                /* @__PURE__ */ jsx(InstagramLogo, { size: 20, className: "text-white" }),
                /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-white text-sm font-medium", children: "Instagram" }),
                  /* @__PURE__ */ jsx("div", { className: "text-purple-100 text-xs", children: "@habilidade.escola" })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-zinc-800 pt-8 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-zinc-400 text-sm flex items-center justify-center gap-2", children: [
      "© 2024 Escola Habilidade. Feito com ",
      /* @__PURE__ */ jsx(Heart, { size: 16, className: "text-red-500" }),
      " em São José/SC."
    ] }) })
  ] }) });
};
const AccessibilityControls = ({
  onAnimationToggle,
  onReducedMotionToggle,
  onContrastChange,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    animationsEnabled: true,
    respectReducedMotion: true,
    highContrast: false,
    reduceTransparency: false,
    pauseOnFocus: true
  });
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibility-settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn("Failed to parse accessibility settings:", error);
      }
    }
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setSettings((prev) => ({ ...prev, animationsEnabled: false }));
    }
    const handleChange = (e) => {
      setSettings((prev) => ({
        ...prev,
        animationsEnabled: !e.matches,
        respectReducedMotion: true
      }));
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  useEffect(() => {
    localStorage.setItem("accessibility-settings", JSON.stringify(settings));
    applySettingsToDocument(settings);
    if (onAnimationToggle) onAnimationToggle(settings.animationsEnabled);
    if (onReducedMotionToggle) onReducedMotionToggle(settings.respectReducedMotion);
    if (onContrastChange) onContrastChange(settings.highContrast);
  }, [settings, onAnimationToggle, onReducedMotionToggle, onContrastChange]);
  const applySettingsToDocument = useCallback((newSettings) => {
    const root = document.documentElement;
    root.classList.toggle("accessibility-no-animations", !newSettings.animationsEnabled);
    root.classList.toggle("accessibility-high-contrast", newSettings.highContrast);
    root.classList.toggle("accessibility-reduced-transparency", newSettings.reduceTransparency);
    root.classList.toggle("accessibility-pause-on-focus", newSettings.pauseOnFocus);
    root.style.setProperty("--animation-duration", newSettings.animationsEnabled ? "1s" : "0s");
    root.style.setProperty("--transition-duration", newSettings.animationsEnabled ? "0.3s" : "0s");
    root.style.setProperty("--opacity-level", newSettings.reduceTransparency ? "1" : "0.1");
  }, []);
  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);
  const resetToDefaults = useCallback(() => {
    const defaults = {
      animationsEnabled: true,
      respectReducedMotion: true,
      highContrast: false,
      reduceTransparency: false,
      pauseOnFocus: true
    };
    setSettings(defaults);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "A") {
        e.preventDefault();
        updateSetting("animationsEnabled", !settings.animationsEnabled);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        updateSetting("highContrast", !settings.highContrast);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settings, isOpen, updateSetting]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: `fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`,
        onClick: () => setIsOpen(!isOpen),
        "aria-label": "Abrir controles de acessibilidade",
        "aria-expanded": isOpen,
        title: "Controles de Acessibilidade (Ctrl+Shift+A)",
        children: /* @__PURE__ */ jsx(
          "svg",
          {
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            "aria-hidden": "true",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              }
            )
          }
        )
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "fixed top-16 right-4 z-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6 w-80 max-w-[calc(100vw-2rem)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-white", children: "Acessibilidade" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setIsOpen(false),
            className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1",
            "aria-label": "Fechar controles",
            children: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" }) })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "animations", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Animações de fundo" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "animations",
              type: "checkbox",
              checked: settings.animationsEnabled,
              onChange: (e) => updateSetting("animationsEnabled", e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "reduced-motion", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Respeitar preferência do sistema" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "reduced-motion",
              type: "checkbox",
              checked: settings.respectReducedMotion,
              onChange: (e) => updateSetting("respectReducedMotion", e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "high-contrast", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Alto contraste" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "high-contrast",
              type: "checkbox",
              checked: settings.highContrast,
              onChange: (e) => updateSetting("highContrast", e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "reduce-transparency", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Reduzir transparência" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "reduce-transparency",
              type: "checkbox",
              checked: settings.reduceTransparency,
              onChange: (e) => updateSetting("reduceTransparency", e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("label", { htmlFor: "pause-on-focus", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Pausar no foco" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "pause-on-focus",
              type: "checkbox",
              checked: settings.pauseOnFocus,
              onChange: (e) => updateSetting("pauseOnFocus", e.target.checked),
              className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 pt-4 border-t border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "Atalhos do teclado:" }),
        /* @__PURE__ */ jsxs("ul", { className: "text-xs text-gray-600 dark:text-gray-400 space-y-1", children: [
          /* @__PURE__ */ jsx("li", { children: "Ctrl+Shift+A: Toggle animações" }),
          /* @__PURE__ */ jsx("li", { children: "Ctrl+Shift+C: Toggle contraste" }),
          /* @__PURE__ */ jsx("li", { children: "ESC: Fechar este painel" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: resetToDefaults,
          className: "w-full mt-4 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          children: "Restaurar padrões"
        }
      )
    ] }),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-30 bg-black bg-opacity-25",
        onClick: () => setIsOpen(false),
        "aria-hidden": "true"
      }
    )
  ] });
};
const AccessibilityControls$1 = React.memo(AccessibilityControls);
function Layout() {
  useLocation();
  const { performanceLevel } = usePerformanceLevel();
  useGoogleAnalytics();
  useUrlCleanup();
  useScrollToHash();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (performanceLevel === "LOW") {
        document.documentElement.style.setProperty("--animation-duration", "0.1s");
        document.documentElement.style.setProperty("--transition-duration", "0.1s");
      }
      return () => {
        domOptimizer.destroy();
      };
    }
  }, [performanceLevel]);
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsxs("div", { className: "App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50", children: [
    /* @__PURE__ */ jsx(AccessibilityControls$1, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "relative z-10", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) }) }) });
}
function CourseLayout() {
  useLocation();
  const { performanceLevel } = usePerformanceLevel();
  useGoogleAnalytics();
  useUrlCleanup();
  useScrollToHash();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (performanceLevel === "LOW") {
        document.documentElement.style.setProperty("--animation-duration", "0.1s");
        document.documentElement.style.setProperty("--transition-duration", "0.1s");
      }
      return () => {
        domOptimizer.destroy();
      };
    }
  }, [performanceLevel]);
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsxs("div", { className: "App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50", children: [
    /* @__PURE__ */ jsx(AccessibilityControls$1, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "relative z-10", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) }) }) });
}
const Loading = ({
  size = "md",
  color = "fuchsia",
  className = "",
  text = null,
  variant = "spinner"
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };
  const colorClasses = {
    fuchsia: "border-fuchsia-400 border-t-transparent",
    cyan: "border-cyan-400 border-t-transparent",
    white: "border-white border-t-transparent",
    primary: "border-purple-400 border-t-transparent"
  };
  if (variant === "dots") {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} bg-fuchsia-400 rounded-full animate-pulse` }),
      /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} bg-cyan-400 rounded-full animate-pulse`, style: { animationDelay: "0.2s" } }),
      /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} bg-purple-400 rounded-full animate-pulse`, style: { animationDelay: "0.4s" } }),
      text && /* @__PURE__ */ jsx("span", { className: "ml-2 text-zinc-300 text-sm", children: text })
    ] });
  }
  if (variant === "pulse") {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: `${sizeClasses[size]} bg-gradient-to-r from-fuchsia-400 to-cyan-400 rounded-full animate-ping` }),
      text && /* @__PURE__ */ jsx("span", { className: "text-zinc-300 text-sm", children: text })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 ${className}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `${sizeClasses[size]} border-2 ${colorClasses[color]} rounded-full animate-spin`
      }
    ),
    text && /* @__PURE__ */ jsx("span", { className: "text-zinc-300 text-sm", children: text })
  ] });
};
React.lazy(() => import("./assets/Home-Bg2OIJr_.js"));
React.lazy(() => import("./assets/CoursePage-Bf3hsI4U.js"));
const Contact = React.lazy(() => import("./assets/Contact-Bc6yilcc.js"));
React.lazy(() => import("./assets/BlogIndex-OQH_owcC.js"));
React.lazy(() => import("./assets/BlogTestPage-XVuJA59o.js"));
React.lazy(() => import("./assets/BlogCategory-Cn4AdAs2.js"));
React.lazy(() => import("./assets/NotFound-wSBhes32.js"));
const CursosFlorianopolis = React.lazy(() => import("./assets/CursosFlorianopolis-Cn7L3xYM.js"));
const CursosSaoJose = React.lazy(() => import("./assets/CursosSaoJose-BnsA-H_i.js"));
const CursosPalhoca = React.lazy(() => import("./assets/CursosPalhoca-AGz6dYmk.js"));
const CursoSketchupEnscape = React.lazy(() => import("./assets/CursoSketchupEnscape-BruOqHqx.js"));
const CourseRedirect = () => {
  const { courseSlug } = useParams();
  return /* @__PURE__ */ jsx(Navigate, { to: `/cursos/${courseSlug}`, replace: true });
};
const blogSlugs = [
  "guia-completo-21-estilos-decoracao-transformar-casa",
  "por-que-enscape-essencial-visualizacao-arquitetonica",
  "o-que-e-sketchup-guia-completo-modelagem-3d-2025",
  "historia-sketchup-software-arquitetura",
  "design-espacos-varejo-sketchup-pro",
  "sketchup-arquitetura-paisagistica",
  "tipos-puxadores-moveis",
  "sketchup-workflows-avancados-arquitetura-paisagistica",
  "como-usar-sketchup-para-design-conceitual-arquitetonico",
  "dominando-shape-bender-curvando-geometrias-sketchup",
  "como-construir-seu-primeiro-agente-ia-n8n",
  "cinco-maneiras-maximizar-vistas-magnificas-casas-personalizadas",
  "10-dicas-especialistas-renderizacoes-enscape-destaque",
  "como-apresentar-projetos-design-interior-sketchup",
  "acelerando-workflow-grey-boxing-sketchup",
  "10-extensoes-sketchup-arquitetos",
  "editor-materiais-sketchup-realismo-enscape"
];
const routes = [
  // Rotas de curso com layout específico (sem header global) - DEVEM VIR ANTES das rotas gerais
  {
    path: "/cursos/sketchup-enscape",
    element: /* @__PURE__ */ jsx(CourseLayout, {}),
    children: [
      {
        index: true,
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursoSketchupEnscape, {}) })
      }
    ]
  },
  {
    path: "/",
    element: /* @__PURE__ */ jsx(Layout, {}),
    children: [
      {
        index: true,
        lazy: () => import("./assets/Home-Bg2OIJr_.js")
      },
      {
        path: "cursos/:courseSlug",
        lazy: () => import("./assets/CoursePage-Bf3hsI4U.js")
      },
      {
        path: "contato",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(Contact, {}) })
      },
      {
        path: "blog",
        children: [
          {
            index: true,
            lazy: () => import("./assets/BlogIndex-OQH_owcC.js")
          },
          {
            path: "categoria/:categorySlug",
            lazy: () => import("./assets/BlogCategory-Cn4AdAs2.js")
          },
          {
            path: ":slug",
            lazy: () => import("./assets/BlogPostSSG-Bj7f-OiO.js"),
            getStaticPaths: () => blogSlugs
          }
        ]
      },
      {
        path: "blog-test",
        children: [
          {
            index: true,
            lazy: () => import("./assets/BlogTestPage-XVuJA59o.js")
          },
          {
            path: ":slug",
            lazy: () => import("./assets/BlogTestPage-XVuJA59o.js")
          }
        ]
      },
      // Páginas de localização (SEO local)
      {
        path: "cursos-florianopolis",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosFlorianopolis, {}) })
      },
      {
        path: "cursos-sao-jose",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosSaoJose, {}) })
      },
      {
        path: "cursos-palhoca",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosPalhoca, {}) })
      },
      // Redirects para compatibilidade
      {
        path: "habilidade",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
      },
      {
        path: "habilidade/",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true })
      },
      {
        path: "habilidade/cursos/:courseSlug",
        element: /* @__PURE__ */ jsx(CourseRedirect, {})
      },
      {
        path: "*",
        lazy: () => import("./assets/NotFound-wSBhes32.js")
      }
    ]
  }
];
const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes: routes2, isClient, initialState }) => {
    if (isClient) {
      const preconnectLinks = [
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
        "https://cdn.emailjs.com",
        "https://api.emailjs.com"
      ];
      preconnectLinks.forEach((href) => {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = href;
        link.crossOrigin = "anonymous";
        document.head.appendChild(link);
      });
    }
  }
);
export {
  ErrorBoundary as E,
  GradientButton as G,
  InteractiveLogo as I,
  Loading as L,
  Section as S,
  createRoot
};
