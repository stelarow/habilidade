import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { WhatsappLogo, X, Star, Clock, Users, ArrowRight, User, Calendar } from "@phosphor-icons/react";
import ShareButtons from "./ShareButtons-zQ2d6_oz.js";
import { B as Breadcrumbs } from "./Breadcrumbs-CKlA74mN.js";
import { B as BlogError } from "./BlogError-pFcvE5Id.js";
import TableOfContents from "./TableOfContents--wOeVQdm.js";
import { u as useContactAnalytics, g as generateWhatsAppMessage } from "./useContactAnalytics-CtFSFhtO.js";
import { C as COURSES_DATA } from "../../main.mjs";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import "./blogTheme-Ctep9-MK.js";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
const LazyImage = ({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DYXJyZWdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==",
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry2]) => {
        if (entry2.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px"
      }
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleLoad = () => {
    setIsLoaded(true);
  };
  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: imgRef,
      className: `relative overflow-hidden ${className}`,
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: placeholder,
            alt: "",
            className: `absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-0" : "opacity-100"}`,
            "aria-hidden": "true"
          }
        ),
        isInView && /* @__PURE__ */ jsx(
          "img",
          {
            src: hasError ? placeholder : src,
            alt,
            onLoad: handleLoad,
            onError: handleError,
            className: `w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`,
            loading: "lazy",
            decoding: "async",
            style: {
              imageRendering: "high-quality",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden"
            }
          }
        ),
        !isLoaded && isInView && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-zinc-800/50", children: /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin" }) })
      ]
    }
  );
};
const WhatsAppFloat = ({
  article = null,
  category = null,
  delaySeconds = 45,
  // Increased delay to be less intrusive
  scrollThreshold = 0.6,
  // Higher threshold
  className = "",
  position = "bottom-right"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useRef(null);
  const startTimeRef = useRef(Date.now());
  const { trackContactClick } = useContactAnalytics();
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2"
  };
  const handleScrollThrottled = useCallback(() => {
    let ticking = false;
    const updateScrollProgress = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackHeight = docHeight - winHeight;
      const progress = Math.min(scrollTop / trackHeight, 1);
      setScrollProgress(progress);
      ticking = false;
    };
    return () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };
  }, []);
  useEffect(() => {
    const throttledHandler = handleScrollThrottled();
    window.addEventListener("scroll", throttledHandler, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandler);
  }, [handleScrollThrottled]);
  useEffect(() => {
    if (isDismissed) return;
    const checkVisibility = () => {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1e3;
      const shouldShowByTime = timeElapsed >= delaySeconds;
      const shouldShowByScroll = scrollProgress >= scrollThreshold;
      if (shouldShowByTime || shouldShowByScroll) {
        setIsVisible(true);
      }
    };
    checkVisibility();
    const interval = setInterval(checkVisibility, 1e3);
    return () => clearInterval(interval);
  }, [delaySeconds, scrollThreshold, scrollProgress, isDismissed]);
  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage({
      article: (article == null ? void 0 : article.title) || null,
      category: (category == null ? void 0 : category.name) || category || null,
      url: window.location.href,
      context: "floating-button"
    });
    const whatsappUrl = `https://wa.me/5548988559491?text=${encodeURIComponent(message)}`;
    trackContactClick({
      channel: "whatsapp",
      source: "floating-button",
      article: (article == null ? void 0 : article.slug) || "unknown",
      category: (category == null ? void 0 : category.slug) || category || "unknown",
      position,
      message
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };
  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  if (!isVisible || isDismissed) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: `fixed z-50 ${positionClasses[position]} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-10" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleToggleExpand,
        className: `
            relative w-12 h-12 rounded-full 
            bg-gradient-to-r from-green-500 via-green-400 to-cyan-400 
            hover:from-green-600 hover:via-green-500 hover:to-cyan-500
            flex items-center justify-center
            shadow-lg hover:shadow-xl hover:shadow-green-500/20
            transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isExpanded ? "scale-105" : ""}
          `,
        title: "Conversar no WhatsApp",
        "aria-label": "Abrir chat do WhatsApp",
        children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, weight: "bold", className: "text-white" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `
          absolute bottom-14 right-0 mb-2
          bg-white rounded-lg shadow-xl border border-gray-200
          p-4 min-w-[260px] max-w-[300px]
          transform transition-all duration-300 origin-bottom-right
          ${isExpanded ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}
        `, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleDismiss,
          className: "absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors",
          "aria-label": "Fechar",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 16, weight: "bold", className: "text-white" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 rounded-lg p-3 mb-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 leading-relaxed", children: article ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "Olá! Vi que você está lendo sobre ",
            /* @__PURE__ */ jsx("strong", { children: article.title }),
            ". Posso ajudar com informações sobre nossos cursos relacionados?"
          ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Olá! Precisa de ajuda ou tem dúvidas sobre nossos cursos? Estou aqui para ajudar! 😊" }) }) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleWhatsAppClick,
              className: "w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { size: 16, weight: "bold" }),
                "Conversar agora"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full" }),
        /* @__PURE__ */ jsx("span", { children: "Alessandro online" })
      ] })
    ] })
  ] }) });
};
const useCTAResponsive = (options = {}) => {
  const {
    breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1440
    },
    enableSticky = true,
    stickyThreshold = 0.8,
    // 80% da p�gina scrollada
    touchOptimization = true
  } = options;
  const [deviceType, setDeviceType] = useState("desktop");
  const [isTouch, setIsTouch] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080
  });
  const detectDeviceType = useCallback(() => {
    if (typeof window === "undefined") return "desktop";
    const width = window.innerWidth;
    if (width < breakpoints.mobile) {
      return "mobile";
    } else if (width < breakpoints.tablet) {
      return "tablet";
    } else {
      return "desktop";
    }
  }, [breakpoints]);
  const detectTouch = useCallback(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }, []);
  const calculateScrollProgress = useCallback(() => {
    if (typeof document === "undefined") return 0;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    return height > 0 ? winScroll / height : 0;
  }, []);
  const handleResize = useCallback(() => {
    if (typeof window === "undefined") return;
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
    setDeviceType(detectDeviceType());
  }, [detectDeviceType]);
  const handleScroll = useCallback(() => {
    let ticking = false;
    const updateScrollState = () => {
      const progress = calculateScrollProgress();
      setScrollProgress(progress);
      if (enableSticky && deviceType === "mobile") {
        setShowSticky(progress >= stickyThreshold);
      }
      ticking = false;
    };
    return () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };
  }, [calculateScrollProgress, enableSticky, deviceType, stickyThreshold]);
  useEffect(() => {
    setDeviceType(detectDeviceType());
    setIsTouch(detectTouch());
    const throttledScrollHandler = handleScroll();
    if (typeof window !== "undefined") window.addEventListener("resize", handleResize);
    if (typeof window !== "undefined") window.addEventListener("scroll", throttledScrollHandler, { passive: true });
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
      if (typeof window !== "undefined") window.removeEventListener("scroll", throttledScrollHandler);
    };
  }, [handleResize, handleScroll, detectDeviceType, detectTouch]);
  const getDeviceConfig = useCallback(() => {
    const baseConfig = {
      buttonSize: "medium",
      spacing: "normal",
      animation: "normal",
      layout: "horizontal"
    };
    switch (deviceType) {
      case "mobile":
        return {
          ...baseConfig,
          buttonSize: "large",
          spacing: "compact",
          animation: isTouch ? "reduced" : "normal",
          layout: "vertical",
          minTouchTarget: 48,
          stackContent: true
        };
      case "tablet":
        return {
          ...baseConfig,
          buttonSize: "medium",
          spacing: "normal",
          minTouchTarget: 44,
          stackContent: viewport.width < 900
        };
      default:
        return {
          ...baseConfig,
          buttonSize: "medium",
          spacing: "normal",
          minTouchTarget: 40,
          stackContent: false
        };
    }
  }, [deviceType, isTouch, viewport.width]);
  const getResponsiveStyles = useCallback(() => {
    const config = getDeviceConfig();
    return {
      container: {
        padding: config.spacing === "compact" ? "1rem" : "1.5rem",
        margin: config.spacing === "compact" ? "1rem 0" : "1.5rem 0"
      },
      button: {
        minHeight: `${config.minTouchTarget}px`,
        fontSize: config.buttonSize === "large" ? "1.125rem" : "1rem",
        padding: config.buttonSize === "large" ? "1rem 1.5rem" : "0.75rem 1.25rem",
        width: config.stackContent ? "100%" : "auto"
      },
      layout: {
        flexDirection: config.layout === "vertical" ? "column" : "row",
        gap: config.spacing === "compact" ? "1rem" : "1.5rem"
      }
    };
  }, [getDeviceConfig]);
  const getResponsiveClasses = useCallback(() => {
    const config = getDeviceConfig();
    return {
      container: [
        "cta-container",
        `cta-${deviceType}`,
        isTouch && "cta-touch",
        config.stackContent && "cta-stacked"
      ].filter(Boolean).join(" "),
      button: [
        "cta-button",
        `cta-button-${config.buttonSize}`,
        config.animation === "reduced" && "cta-reduced-motion"
      ].filter(Boolean).join(" ")
    };
  }, [getDeviceConfig, deviceType, isTouch]);
  return {
    // Estado do dispositivo
    deviceType,
    isTouch,
    viewport,
    scrollProgress,
    showSticky,
    // Configura��es
    config: getDeviceConfig(),
    styles: getResponsiveStyles(),
    classes: getResponsiveClasses(),
    // Utilidades
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop",
    shouldStack: getDeviceConfig().stackContent,
    // M�tricas de performance
    metrics: {
      viewportRatio: viewport.width / viewport.height,
      isLandscape: viewport.width > viewport.height,
      isPortrait: viewport.height > viewport.width,
      pixelDensity: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    }
  };
};
const BlogCTA = ({
  post,
  variant = "specific",
  // 'specific' | 'generic'
  showUrgency = false,
  urgencyText = "Inscrições abertas",
  className = "",
  onCtaClick = null
  // Para tracking de analytics
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { classes, styles } = useCTAResponsive();
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  const COURSE_MAPPING = {
    "projetista-3d": {
      title: "Projetista",
      slug: "projetista-3d",
      icon: "Cube",
      desc: "SketchUp, Enscape, Renderização com IA, Projetos 3D…",
      textColor: "text-orange-400",
      borderGradient: "from-orange-500/60 to-amber-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f97316aa]"
    },
    "edicao-video": {
      title: "Edição de Vídeo",
      slug: "edicao-video",
      icon: "FilmSlate",
      desc: "Premiere, After Effects, DaVinci Resolve, Motion Graphics…",
      textColor: "text-red-400",
      borderGradient: "from-red-500/60 to-pink-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f87171aa]"
    },
    "informatica": {
      title: "Informática",
      slug: "informatica",
      icon: "Desktop",
      desc: "Windows, Word, Excel (fundamental → avançado)…",
      textColor: "text-blue-400",
      borderGradient: "from-blue-500/60 to-indigo-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#60a5faaa]"
    },
    "design-grafico": {
      title: "Design Gráfico",
      slug: "design-grafico",
      icon: "PenNib",
      desc: "Photoshop, Illustrator, InDesign, Canva, Social…",
      textColor: "text-pink-400",
      borderGradient: "from-pink-500/60 to-rose-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#f472b6aa]"
    },
    "programacao": {
      title: "Programação",
      slug: "programacao",
      icon: "Code",
      desc: "Lógica, Python, Java, PHP, Android Studio, Jogos…",
      textColor: "text-green-400",
      borderGradient: "from-green-500/60 to-emerald-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#4ade80aa]"
    },
    "marketing-digital": {
      title: "Marketing Digital",
      slug: "marketing-digital",
      icon: "ChartLine",
      desc: "Social Ads, SEO, Copywriting, Canva, Branding, Analytics…",
      textColor: "text-purple-400",
      borderGradient: "from-purple-500/60 to-violet-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#a78bfaaa]"
    },
    "inteligencia-artificial": {
      title: "Inteligência Artificial",
      slug: "inteligencia-artificial",
      icon: "Robot",
      desc: "Cursor, Prompt Engineering, ChatGPT, Visão…",
      textColor: "text-cyan-400",
      borderGradient: "from-cyan-500/60 to-teal-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#22d3eeaa]"
    },
    "business-intelligence": {
      title: "Business Intelligence",
      slug: "business-intelligence",
      icon: "ChartBar",
      desc: "Master Excel, Power BI, Dashboards, Storytelling de Dados…",
      textColor: "text-indigo-400",
      borderGradient: "from-indigo-500/60 to-blue-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#818cf8aa]"
    },
    "administracao": {
      title: "Administração",
      slug: "administracao",
      icon: "Briefcase",
      desc: "Office, Excel Avançado, DP, Matemática Financeira, Liderança…",
      textColor: "text-violet-400",
      borderGradient: "from-violet-500/60 to-purple-400/60",
      hoverShadow: "hover:shadow-[0_0_25px_#8b5cf6aa]"
    }
  };
  const findRelatedCourse = (post2) => {
    var _a, _b, _c;
    if (post2 == null ? void 0 : post2.cta_course_id) {
      return (_a = COURSES_DATA) == null ? void 0 : _a.find((course) => course.basicInfo.id === post2.cta_course_id);
    }
    if ((post2 == null ? void 0 : post2.content) || (post2 == null ? void 0 : post2.title) || (post2 == null ? void 0 : post2.categories)) {
      const content = `${post2.title || ""} ${post2.content || ""} ${((_b = post2.categories) == null ? void 0 : _b.map((c) => c.name).join(" ")) || ""}`.toLowerCase();
      const courseKeywords = {
        // 1. PROJETISTA - Termos mais específicos primeiro
        "projetista-3d": [
          "sketchup",
          "shape bender",
          "enscape",
          "modelagem 3d",
          "renderização 3d",
          "projetos arquitetônicos",
          "arquitetura 3d",
          "maquete eletrônica",
          "geometria 3d",
          "curvatura 3d",
          "extensão sketchup",
          "plugin sketchup",
          "visualização arquitetônica",
          "projeto 3d",
          "desenho arquitetônico 3d"
        ],
        // 2. DESIGN GRÁFICO - Removidos termos conflitantes
        "design-grafico": [
          "photoshop",
          "illustrator",
          "indesign",
          "design gráfico",
          "identidade visual",
          "logotipo",
          "branding visual",
          "diagramação",
          "layout",
          "tipografia",
          "cores",
          "composição visual",
          "arte gráfica",
          "criação gráfica"
        ],
        // 3. INFORMÁTICA - Mantido
        "informatica": [
          "windows",
          "word",
          "powerpoint",
          "office",
          "informática básica",
          "computador básico",
          "digitação",
          "internet básica"
        ],
        // 4. PROGRAMAÇÃO - Mantido
        "programacao": [
          "programação",
          "código",
          "python",
          "java",
          "php",
          "javascript",
          "html",
          "css",
          "desenvolvimento",
          "software",
          "app",
          "aplicativo",
          "sistema"
        ],
        // 5. MARKETING DIGITAL - Mantido
        "marketing-digital": [
          "marketing digital",
          "redes sociais",
          "facebook ads",
          "instagram",
          "google ads",
          "seo",
          "copywriting",
          "tráfego pago",
          "analytics",
          "social media"
        ],
        // 6. INTELIGÊNCIA ARTIFICIAL - Mantido
        "inteligencia-artificial": [
          "inteligência artificial",
          "ia",
          "chatgpt",
          "prompt engineering",
          "machine learning",
          "cursor ai",
          "copilot",
          "automação ia"
        ],
        // 7. BUSINESS INTELLIGENCE - Mantido 
        "business-intelligence": [
          "power bi",
          "business intelligence",
          "dashboard",
          "kpi",
          "data visualization",
          "análise de dados",
          "storytelling dados"
        ],
        // 8. EDIÇÃO DE VÍDEO - Mantido
        "edicao-video": [
          "premiere",
          "after effects",
          "davinci resolve",
          "edição vídeo",
          "motion graphics",
          "vídeo",
          "montagem",
          "pós-produção"
        ],
        // 9. ADMINISTRAÇÃO - Mantido
        "administracao": [
          "administração",
          "gestão",
          "liderança",
          "dp",
          "departamento pessoal",
          "matemática financeira",
          "excel avançado admin"
        ],
        // 10. EXCEL AVANÇADO - Incluído na categoria Business Intelligence
        "business-intelligence-excel": [
          "excel",
          "planilha",
          "fórmulas excel",
          "gráficos excel",
          "macros",
          "vba"
        ]
      };
      for (const [courseSlug, keywords] of Object.entries(courseKeywords)) {
        if (keywords.some((keyword) => content.includes(keyword))) {
          const courseData = (_c = COURSES_DATA) == null ? void 0 : _c.find((course) => course.basicInfo.slug === courseSlug);
          if (courseData) {
            return courseData;
          }
        }
      }
    }
    return null;
  };
  const relatedCourse = variant === "specific" ? findRelatedCourse(post) : null;
  const courseStyle = relatedCourse ? COURSE_MAPPING[relatedCourse.basicInfo.slug] : null;
  const handleCtaClick = (ctaType, courseId = null) => {
    if (onCtaClick) {
      onCtaClick({
        type: ctaType,
        postSlug: post == null ? void 0 : post.slug,
        courseId,
        timestamp: Date.now(),
        urgencyShown: showUrgency
      });
    }
  };
  if (variant === "specific" && relatedCourse && courseStyle) {
    return /* @__PURE__ */ jsx("div", { className: `${classes.container} cta-main cta-type-course transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-2xl mx-auto", children: [
      showUrgency && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 right-4 z-10", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg animate-pulse", children: [
        /* @__PURE__ */ jsx(Star, { size: 14 }),
        urgencyText
      ] }) }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `/cursos/${courseStyle.slug}`,
          onClick: () => handleCtaClick("specific_course", relatedCourse.basicInfo.id),
          className: `card-enter in-view relative clip-card w-full h-auto p-[3px] bg-gradient-to-r ${courseStyle.borderGradient} transition-transform duration-200 hover:-translate-y-1.5 hover:scale-[1.02] ${courseStyle.hoverShadow} focus-visible:ring-2 ring-fuchsia-500 focus:outline-none block`,
          children: /* @__PURE__ */ jsxs("div", { className: "clip-card w-full h-full bg-[radial-gradient(ellipse_at_60%_40%,#181a2a_0%,#0a0a0a_100%)] hover:bg-[radial-gradient(ellipse_at_60%_40%,#1a1c2e_0%,#0a0a0a_100%)] transition", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-8 pt-6 pb-4", children: [
              /* @__PURE__ */ jsx("h3", { className: `text-2xl font-bold leading-tight ${courseStyle.textColor}`, children: (post == null ? void 0 : post.cta_title) || `Domine ${courseStyle.title} na Prática` }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 mt-3 leading-relaxed", children: (post == null ? void 0 : post.cta_description) || `Desenvolva habilidades práticas e atualize seu conhecimento com nosso curso especializado em ${courseStyle.title}.` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 px-8 pb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 min-w-0 flex-1", children: [
                /* @__PURE__ */ jsx("div", { className: `text-lg font-semibold ${courseStyle.textColor}`, children: courseStyle.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300 leading-snug", children: courseStyle.desc }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-gray-400 mt-2", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Clock, { size: 12 }),
                    relatedCourse.basicInfo.duration
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Users, { size: 12 }),
                    relatedCourse.basicInfo.level
                  ] }),
                  relatedCourse.basicInfo.certificate && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full", children: [
                    /* @__PURE__ */ jsx(Star, { size: 12 }),
                    "Certificado incluso"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs("div", { className: `inline-flex items-center gap-2 bg-gradient-to-r ${courseStyle.borderGradient.replace("/60", "")} text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg`, children: [
                /* @__PURE__ */ jsx("span", { children: "Ver Detalhes" }),
                /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "transition-transform group-hover:translate-x-1" })
              ] }) })
            ] })
          ] })
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: `${classes.container} cta-main cta-type-generic transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl text-center overflow-hidden shadow-xl max-w-2xl mx-auto", style: styles.container, children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5" }),
    showUrgency && /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-full text-sm font-medium", children: [
      /* @__PURE__ */ jsx(Star, { size: 14 }),
      urgencyText
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative space-y-6 p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl md:text-3xl font-bold text-white leading-tight", children: (post == null ? void 0 : post.cta_title) || "Desenvolva suas habilidades profissionais" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed max-w-2xl mx-auto", children: (post == null ? void 0 : post.cta_description) || "Explore nossos cursos especializados e aprimore seu conhecimento com conteúdo atualizado e certificação reconhecida." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 text-sm text-gray-400", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full", children: [
          /* @__PURE__ */ jsx(Star, { size: 16 }),
          "Certificação reconhecida"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full", children: [
          /* @__PURE__ */ jsx(Users, { size: 16 }),
          "Instrutores especialistas"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/cursos",
          onClick: () => handleCtaClick("generic"),
          className: "inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Explorar Cursos" }),
            /* @__PURE__ */ jsx(ArrowRight, { size: 20, className: "transition-transform group-hover:translate-x-1" })
          ]
        }
      ) })
    ] })
  ] }) });
};
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);
function extractText(textOrTokens, parser) {
  if (!textOrTokens) return "";
  if (typeof textOrTokens === "string") {
    return textOrTokens;
  }
  if (Array.isArray(textOrTokens)) {
    return parser ? parser.parseInline(textOrTokens) : "";
  }
  if (textOrTokens.tokens && Array.isArray(textOrTokens.tokens)) {
    return parser ? parser.parseInline(textOrTokens.tokens) : "";
  }
  if (textOrTokens.text) {
    return textOrTokens.text;
  }
  const str = String(textOrTokens);
  return str === "[object Object]" ? "" : str;
}
marked.use({
  renderer: {
    // Override heading rendering to add Tailwind classes
    heading(token) {
      const text = extractText(token, this.parser);
      const depth = token.depth || 1;
      const classes = {
        1: "text-4xl md:text-5xl font-bold text-white mb-6 mt-8",
        2: "text-3xl md:text-4xl font-bold text-white mb-4 mt-8",
        3: "text-2xl md:text-3xl font-semibold text-white mb-4 mt-6",
        4: "text-xl md:text-2xl font-semibold text-white mb-3 mt-6",
        5: "text-lg md:text-xl font-semibold text-white mb-3 mt-4",
        6: "text-base md:text-lg font-semibold text-white mb-2 mt-4"
      };
      const className = classes[depth] || classes[6];
      const id = text.toLowerCase().replace(/[^\w]+/g, "-");
      return `<h${depth} id="${id}" class="${className}">${text}</h${depth}>`;
    },
    // Override paragraph rendering
    paragraph(token) {
      const text = extractText(token, this.parser);
      return `<p class="text-gray-300 mb-4 leading-relaxed">${text}</p>`;
    },
    // Override list rendering
    list(token) {
      const ordered = token.ordered || false;
      const tag = ordered ? "ol" : "ul";
      const className = ordered ? "list-decimal list-inside text-gray-300 mb-4 space-y-2 ml-4" : "list-disc list-inside text-gray-300 mb-4 space-y-2 ml-4";
      let body = "";
      if (token.items && Array.isArray(token.items)) {
        token.items.forEach((item) => {
          body += this.listitem(item);
        });
      }
      return `<${tag} class="${className}">${body}</${tag}>`;
    },
    // Override list item rendering
    listitem(token) {
      const text = extractText(token, this.parser);
      const cleanText = text.replace(/(\w)\n+(\:|\w)/g, "$1 $2").replace(/(\w)[\u2028\u2029\r\n]+(\:|\w)/g, "$1 $2").replace(/(\w)\s*\n\s*(\:)/g, "$1$2").replace(/(\w)[\u200B\u200C\u200D\uFEFF]+(\:|\w)/g, "$1 $2").replace(/(\w)\s+(\:)/g, "$1$2").replace(/\s+/g, " ").trim();
      return `<li class="mb-1">${cleanText}</li>`;
    },
    // Override blockquote rendering
    blockquote(token) {
      const quote = extractText(token, this.parser);
      return `<blockquote class="border-l-4 border-blue-500 pl-4 py-2 bg-zinc-800/50 rounded-r-lg mb-4 italic text-gray-300">${quote}</blockquote>`;
    },
    // Override code block rendering
    code(token) {
      const code = token.text || "";
      const lang = token.lang || "";
      return `<div class="bg-zinc-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre class="text-sm"><code class="hljs language-${lang || "plaintext"}">${code}</code></pre>
      </div>`;
    },
    // Override inline code rendering
    codespan(token) {
      const text = token.text || "";
      return `<code class="bg-zinc-800 text-blue-300 px-2 py-1 rounded text-sm">${text}</code>`;
    },
    // Override image rendering with Tailwind classes and error handling
    image(token) {
      const href = token.href || "";
      const title = token.title || "";
      const text = token.text || "";
      const titleAttr = title ? ` title="${title}"` : "";
      const altAttr = text ? ` alt="${text}"` : "";
      return `<div class="mb-6">
        <img src="${href}" class="w-full rounded-lg shadow-lg"${altAttr}${titleAttr} 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <div class="hidden bg-zinc-800 rounded-lg p-4 text-center">
          <div class="text-gray-400 text-sm">Imagem não encontrada: ${text || "Sem descrição"}</div>
        </div>
        ${text ? `<p class="text-gray-500 text-sm text-center mt-2 italic">${text}</p>` : ""}
      </div>`;
    },
    // Override strong (bold) rendering
    strong(token) {
      const text = extractText(token, this.parser);
      return `<strong class="font-bold text-white">${text}</strong>`;
    },
    // Override emphasis (italic) rendering
    em(token) {
      const text = extractText(token, this.parser);
      return `<em class="italic text-gray-200">${text}</em>`;
    },
    // Override link rendering
    link(token) {
      const href = token.href || "";
      const title = token.title || "";
      const text = extractText(token, this.parser);
      const titleAttr = title ? ` title="${title}"` : "";
      const target = href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200"${titleAttr}${target}>${text}</a>`;
    },
    // Override horizontal rule rendering
    hr() {
      return '<hr class="border-zinc-700 my-8" />';
    },
    // Override table rendering
    table(token) {
      let headerHtml = "";
      let bodyHtml = "";
      if (token.header && Array.isArray(token.header)) {
        headerHtml = this.tablerow({ cells: token.header, header: true });
      }
      if (token.rows && Array.isArray(token.rows)) {
        token.rows.forEach((row) => {
          bodyHtml += this.tablerow({ cells: row });
        });
      }
      return `<div class="overflow-x-auto mb-6">
        <table class="min-w-full bg-zinc-800 rounded-lg overflow-hidden">
          <thead class="bg-zinc-700">${headerHtml}</thead>
          <tbody>${bodyHtml}</tbody>
        </table>
      </div>`;
    },
    tablerow(token) {
      let content = "";
      if (token.cells && Array.isArray(token.cells)) {
        token.cells.forEach((cell) => {
          content += this.tablecell({
            ...cell,
            header: token.header || false
          });
        });
      }
      return `<tr class="border-b border-zinc-700">${content}</tr>`;
    },
    tablecell(token) {
      const content = extractText(token, this.parser);
      const type = token.header ? "th" : "td";
      const className = token.header ? "px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" : "px-6 py-4 whitespace-nowrap text-sm text-gray-300";
      return `<${type} class="${className}">${content}</${type}>`;
    }
  },
  // Highlight function integrated within marked.use()
  highlight: function(code, lang) {
    if (!lang || typeof lang !== "string") {
      return code;
    }
    try {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
    } catch (error) {
      console.warn("Highlight.js error:", error);
    }
    return code;
  },
  // Other marked options
  breaks: true,
  gfm: true,
  pedantic: false,
  silent: true
});
function isMarkdown(content) {
  if (!content || typeof content !== "string") return false;
  const htmlPatterns = [
    /<div[^>]*class=["'][^"']*["'][^>]*>/i,
    /<p[^>]*class=["'][^"']*["'][^>]*>/i,
    /<h[1-6][^>]*class=["'][^"']*["'][^>]*>/i,
    /<img[^>]*class=["'][^"']*["'][^>]*>/i,
    /<span[^>]*class=["'][^"']*["'][^>]*>/i
  ];
  if (htmlPatterns.some((pattern) => pattern.test(content))) {
    return false;
  }
  const markdownPatterns = [
    /^#{1,6}\s+/m,
    // Headers with #
    /^\s*[\*\-\+]\s+/m,
    // Unordered lists
    /^\s*\d+\.\s+/m,
    // Ordered lists
    /\*\*[^*]+\*\*/,
    // Bold text **text**
    /\*[^*]+\*/,
    // Italic text *text*
    /\[[^\]]+\]\([^)]+\)/,
    // Links [text](url)
    /!\[[^\]]*\]\([^)]+\)/,
    // Images ![alt](url)
    /^>\s+/m,
    // Blockquotes
    /```[\s\S]*?```/,
    // Code blocks
    /`[^`]+`/
    // Inline code
  ];
  const markdownScore = markdownPatterns.reduce((score, pattern) => {
    return score + (pattern.test(content) ? 1 : 0);
  }, 0);
  return markdownScore >= 2;
}
function fixImagePaths(content, slug) {
  if (!content || !slug) return content;
  let fixedContent = content;
  const markdownImgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  fixedContent = fixedContent.replace(markdownImgRegex, (match, alt, src) => {
    if (src.startsWith("/images/blog/") && !src.includes(`/images/blog/${slug}/`)) {
      const filename = src.split("/").pop();
      const newSrc = `/images/blog/${slug}/${filename}`;
      return `![${alt}](${newSrc})`;
    }
    return match;
  });
  const htmlImgRegex = /<img([^>]+)src=["']([^"']+)["']([^>]*)>/g;
  fixedContent = fixedContent.replace(htmlImgRegex, (match, before, src, after) => {
    if (src.startsWith("/images/blog/") && !src.includes(`/images/blog/${slug}/`)) {
      const filename = src.split("/").pop();
      const newSrc = `/images/blog/${slug}/${filename}`;
      return `<img${before}src="${newSrc}"${after}>`;
    }
    return match;
  });
  return fixedContent;
}
function removeDuplicateContent(content, postTitle) {
  if (!content || !postTitle) return content;
  let processedContent = content;
  const titleRegex = new RegExp(`<h1[^>]*>[^<]*${postTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]*</h1>`, "i");
  processedContent = processedContent.replace(titleRegex, "");
  const imageBlockRegex = /<div class="mb-6">[\s\S]*?<\/div>/i;
  const firstMatch = processedContent.match(imageBlockRegex);
  if (firstMatch && firstMatch[0].includes("<img")) {
    processedContent = processedContent.replace(firstMatch[0], "");
    processedContent = processedContent.replace(/^\s*<p class="text-gray-500 text-sm text-center mt-2 italic">[^<]*<\/p>\s*/i, "").replace(/^\s*<p class="text-gray-300 mb-4 leading-relaxed">[^<]*<\/p>\s*/i, "").replace(/^\s*<p class="text-gray-300 mb-4 leading-relaxed"><em class="italic text-gray-200">[^<]*<\/em><\/p>\s*/i, "");
  }
  processedContent = processedContent.replace(/<div[^>]*class="[^"]*article-content[^"]*"[^>]*>\s*<\/div>/gi, "");
  processedContent = processedContent.replace(/^(\s*<p[^>]*>\s*<\/p>\s*)*/, "");
  return processedContent.trim();
}
function processContent(content, slug, postTitle) {
  if (!content || typeof content !== "string") return "";
  let processedContent = content;
  try {
    if (typeof window !== "undefined") {
      import("./blogImageMigration-CV2HZE4g.js").then(({ default: blogImageMigration }) => {
        processedContent = blogImageMigration.migrateBlogContent(processedContent);
      }).catch(console.error);
    }
  } catch (error) {
  }
  processedContent = fixImagePaths(processedContent, slug);
  if (isMarkdown(processedContent)) {
    try {
      processedContent = marked(processedContent);
    } catch (error) {
      throw error;
    }
  }
  if (postTitle) {
    processedContent = removeDuplicateContent(processedContent, postTitle);
  }
  if (typeof window !== "undefined") {
    setTimeout(() => {
      import("./blogImageMigration-CV2HZE4g.js").then(({ default: blogImageMigration }) => {
        blogImageMigration.optimizeExistingImages().then((results) => {
          if (results.length > 0) ;
        });
      }).catch(console.error);
    }, 100);
  }
  return processedContent;
}
function extractPlainText(content) {
  if (!content || typeof content !== "string") return "";
  if (isMarkdown(content)) {
    return content.replace(/^#{1,6}\s+/gm, "").replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/```[\s\S]*?```/g, "").replace(/>\s+(.*)/g, "$1").replace(/^\s*[\*\-\+]\s+/gm, "").replace(/^\s*\d+\.\s+/gm, "").replace(/\s+/g, " ").trim();
  }
  return content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
}
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const textContent = extractPlainText(content);
  const words = textContent.split(" ").filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};
const formatDate = (dateString) => {
  if (!dateString) return "Data não disponível";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
};
const getCategoryColor = (categorySlug) => {
  const colors = {
    "tecnologia": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "educacao": "bg-green-500/20 text-green-300 border-green-500/30",
    "carreira": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "design": "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "programacao": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "marketing": "bg-red-500/20 text-red-300 border-red-500/30"
  };
  return colors[categorySlug] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
};
function BlogPost() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const { slug } = useParams();
  const loaderData = useLoaderData();
  const post = loaderData == null ? void 0 : loaderData.post;
  const articleReference = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!post) {
    return /* @__PURE__ */ jsx(BlogError, { error: { message: "Post não encontrado" } });
  }
  const readingTime = calculateReadingTime(post.content);
  const categoryColor = getCategoryColor((_a = post.category) == null ? void 0 : _a.slug);
  const processedContent = processContent(post.content, slug, post.title);
  const seoTitle = `${post.title} | Escola Habilidade`;
  const seoDescription = post.excerpt || `Aprenda ${post.title} com a Escola Habilidade`;
  const seoImage = ((_b = post.featuredImage) == null ? void 0 : _b.url) || post.imageUrl || "https://www.escolahabilidade.com/logo-escola-habilidade.png";
  const seoUrl = `https://www.escolahabilidade.com/blog/${slug}`;
  const seoAuthor = ((_c = post.author) == null ? void 0 : _c.name) || "Escola Habilidade";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: seoAuthor }),
      /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: post.published_at }),
      post.updated_at && /* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: post.updated_at }),
      ((_d = post.category) == null ? void 0 : _d.name) && /* @__PURE__ */ jsx("meta", { property: "article:section", content: post.category.name }),
      (_e = post.tags) == null ? void 0 : _e.map((tag) => /* @__PURE__ */ jsx("meta", { property: "article:tag", content: tag.name }, tag.name)),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: seoUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: seoImage }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Escola Habilidade" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "pt_BR" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: seoImage }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@escolahabilidade" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@escolahabilidade" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: seoUrl }),
      /* @__PURE__ */ jsx("meta", { name: "format-detection", content: "telephone=no" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#d400ff" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: seoDescription,
          url: seoUrl,
          image: seoImage,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: {
            "@type": "Organization",
            name: "Escola Habilidade",
            url: "https://www.escolahabilidade.com"
          },
          publisher: {
            "@type": "Organization",
            name: "Escola Habilidade",
            url: "https://www.escolahabilidade.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.escolahabilidade.com/logo-escola-habilidade.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": seoUrl
          }
        })
      } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: [
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-6xl", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: "Blog", href: "/blog" },
              { label: ((_f = post.category) == null ? void 0 : _f.name) || "Artigo", href: `/blog/categoria/${(_g = post.category) == null ? void 0 : _g.slug}` },
              { label: post.title, href: `/blog/${slug}`, current: true }
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8", children: [
          /* @__PURE__ */ jsxs("article", { className: "lg:col-span-3 order-2 lg:order-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 shadow-2xl", children: [
              /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
                post.category && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`, children: post.category.name }) }),
                /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-6 leading-tight", children: post.title }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6 text-sm text-zinc-400 border-b border-zinc-800 pb-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(User, { size: 16 }),
                    /* @__PURE__ */ jsx("span", { children: ((_h = post.author) == null ? void 0 : _h.name) || "Escola Habilidade" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { size: 16 }),
                    /* @__PURE__ */ jsx("time", { dateTime: post.published_at, children: formatDate(post.published_at) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Clock, { size: 16 }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      readingTime,
                      " min de leitura"
                    ] })
                  ] })
                ] })
              ] }),
              (((_i = post.featuredImage) == null ? void 0 : _i.url) || post.imageUrl) && /* @__PURE__ */ jsx("div", { className: "mb-8 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsx(
                LazyImage,
                {
                  src: ((_j = post.featuredImage) == null ? void 0 : _j.url) || post.imageUrl,
                  alt: `Imagem ilustrativa do artigo: ${post.title}`,
                  className: "w-full aspect-video object-cover",
                  loading: "eager",
                  decoding: "sync"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: articleReference,
                  className: "article-content prose prose-lg prose-invert prose-zinc max-w-none\n                    prose-headings:text-zinc-50 prose-headings:font-bold\n                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4\n                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3\n                    prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4\n                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline\n                    prose-strong:text-zinc-200 prose-strong:font-semibold\n                    prose-code:text-pink-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm\n                    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-lg\n                    prose-blockquote:border-l-4 prose-blockquote:border-zinc-600 prose-blockquote:bg-zinc-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg\n                    prose-ul:text-zinc-300 prose-ol:text-zinc-300\n                    prose-li:marker:text-zinc-500\n                    prose-img:rounded-lg prose-img:shadow-lg",
                  dangerouslySetInnerHTML: { __html: processedContent }
                }
              ),
              post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-800", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag, index) => /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium\n                            bg-zinc-800 text-zinc-300 border border-zinc-700\n                            hover:bg-zinc-700 transition-colors duration-200",
                  children: [
                    "#",
                    tag.name
                  ]
                },
                index
              )) }) }),
              /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-800", children: /* @__PURE__ */ jsx(
                ShareButtons,
                {
                  url: `https://www.escolahabilidade.com/blog/${slug}`,
                  title: post.title,
                  description: post.excerpt
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(
              BlogCTA,
              {
                title: "Transforme seu futuro profissional",
                description: "Descubra nossos cursos práticos e acelere sua carreira na área de tecnologia.",
                buttonText: "Ver Cursos",
                buttonLink: "/cursos"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1 order-1 lg:order-2", children: /* @__PURE__ */ jsx("div", { className: "sticky top-8", children: /* @__PURE__ */ jsx(
            TableOfContents,
            {
              containerSelector: ".article-content",
              title: "Navegação do Artigo",
              collapsible: false,
              initiallyCollapsed: false,
              minHeaders: 2,
              maxLevel: 4,
              showProgress: true,
              className: "bg-zinc-900/95 backdrop-blur-sm"
            }
          ) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(WhatsAppFloat, {})
    ] })
  ] });
}
async function loader({ params }) {
  var _a;
  const { slug } = params;
  try {
    const { getPostBySlug } = await import("./blog-data-CxiE244K.js");
    const postData = getPostBySlug(slug);
    if (!postData || !postData.post) {
      throw new Error(`Post not found: ${slug}`);
    }
    return {
      post: postData.post,
      seoData: postData.seoData || {
        title: postData.post.title,
        description: postData.post.excerpt,
        image: ((_a = postData.post.featuredImage) == null ? void 0 : _a.url) || postData.post.imageUrl,
        url: `https://www.escolahabilidade.com/blog/${slug}`
      }
    };
  } catch (error) {
    console.error(`[BlogPost Loader] Error loading post ${slug}:`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}
const Component = BlogPost;
const entry = "src/pages/BlogPostSSG.jsx";
export {
  Component,
  BlogPost as default,
  entry,
  loader
};
