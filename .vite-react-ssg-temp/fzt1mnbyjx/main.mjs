var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { ViteReactSSG } from "vite-react-ssg";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import React, { Component, useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useLocation, useParams, useNavigate, Link, Outlet, Navigate } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { WhatsappLogo, Phone, Play, User, CaretDown, Clock, MapPin, InstagramLogo, Heart } from "@phosphor-icons/react";
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
const ClientOnlyDevTools = () => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  {
    return null;
  }
};
const QueryProvider = ({ children }) => {
  const client = getQueryClient();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client, children: [
    children,
    /* @__PURE__ */ jsx(ClientOnlyDevTools, {})
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
    const isDOMError = error.message && (error.message.includes("removeChild") || error.message.includes("insertBefore") || error.message.includes("appendChild") || error.message.includes("clearSuspenseBoundary") || error.message.includes("Node") || error.message.includes("not a child of this node"));
    if (isDOMError) {
      console.warn("[ErrorBoundary] DOM Error caught and silently handled:", error.message);
      return { hasError: false };
    }
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
          false
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
function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return [value, toggle, setTrue, setFalse];
}
const usePageContext = () => {
  const location = useLocation();
  const params = useParams();
  const [context, setContext] = useState({
    pageType: "home",
    currentCourse: null,
    breadcrumbs: [],
    activeSection: null
  });
  useEffect(() => {
    const currentPath = location.pathname;
    const courseSlug = params.courseSlug || params.slug;
    let newContext = {
      pageType: "home",
      currentCourse: null,
      breadcrumbs: [],
      activeSection: null
    };
    if (currentPath === "/" || currentPath === "/habilidade" || currentPath === "/habilidade/") {
      newContext.pageType = "home";
    } else if (currentPath.startsWith("/cursos/") || currentPath.includes("/cursos/")) {
      newContext.pageType = "coursePage";
      newContext.currentCourse = courseSlug;
    } else if (currentPath.startsWith("/blog")) {
      newContext.pageType = "blogPage";
    } else if (currentPath === "/teste-vocacional") {
      newContext.pageType = "testeVocacional";
    } else {
      newContext.pageType = "other";
    }
    setContext(newContext);
  }, [location.pathname, params.courseSlug, params.slug]);
  return context;
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
  ],
  testeVocacional: [
    { label: "Como Funciona", href: "/#como-funciona", icon: "Play", description: "Veja nossa metodologia", external: true },
    { label: "Avaliações", href: "/#avaliacoes", icon: "Star", description: "Depoimentos dos alunos", external: true },
    { label: "FAQ", href: "/#faq", icon: "Question", description: "Dúvidas frequentes", external: true },
    { label: "Contato", href: "/#contato", icon: "Phone", description: "Fale conosco", external: true }
  ]
};
const CourseBasicInfoSchema = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  shortDescription: PropTypes.string.isRequired,
  longDescription: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  level: PropTypes.oneOf(["Iniciante", "Intermediário", "Avançado"]).isRequired,
  duration: PropTypes.string.isRequired,
  certificate: PropTypes.bool.isRequired,
  active: PropTypes.bool.isRequired
});
const CourseInvestmentSchema = PropTypes.shape({
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  discount: PropTypes.number,
  installments: PropTypes.shape({
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
  paymentMethods: PropTypes.arrayOf(PropTypes.string).isRequired
});
const InstructorSchema = PropTypes.shape({
  name: PropTypes.string.isRequired,
  bio: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  experience: PropTypes.string.isRequired,
  credentials: PropTypes.arrayOf(PropTypes.string).isRequired
});
const CurriculumModuleSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["video", "text", "exercise", "project"]).isRequired
  })).isRequired
});
const TestimonialSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  photo: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  result: PropTypes.string
});
const FAQItemSchema = PropTypes.shape({
  id: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired
});
const ThemeColorsSchema = PropTypes.shape({
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string.isRequired,
  accent: PropTypes.string.isRequired,
  gradient: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired
  }).isRequired
});
const SEOMetaSchema = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  ogImage: PropTypes.string.isRequired,
  ogType: PropTypes.string.isRequired
});
PropTypes.shape({
  basicInfo: CourseBasicInfoSchema.isRequired,
  investment: CourseInvestmentSchema.isRequired,
  instructor: InstructorSchema.isRequired,
  curriculum: PropTypes.arrayOf(CurriculumModuleSchema).isRequired,
  whatYouWillLearn: PropTypes.arrayOf(PropTypes.string).isRequired,
  requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
  testimonials: PropTypes.arrayOf(TestimonialSchema).isRequired,
  faq: PropTypes.arrayOf(FAQItemSchema).isRequired,
  themeColors: ThemeColorsSchema.isRequired,
  seoMeta: SEOMetaSchema.isRequired
});
function validateCourseData(courseData) {
  var _a;
  const errors = [];
  try {
    if (!courseData) {
      errors.push("Dados do curso não fornecidos");
      return { isValid: false, errors };
    }
    const requiredFields = [
      "basicInfo",
      "investment",
      "instructor",
      "curriculum",
      "whatYouWillLearn",
      "requirements",
      "testimonials",
      "faq",
      "themeColors",
      "seoMeta"
    ];
    requiredFields.forEach((field) => {
      if (!courseData[field]) {
        errors.push(`Campo obrigatório ausente: ${field}`);
      }
    });
    if (courseData.basicInfo) {
      if (!((_a = courseData.basicInfo.slug) == null ? void 0 : _a.match(/^[a-z0-9-]+$/))) {
        errors.push("Slug deve conter apenas letras minúsculas, números e hífens");
      }
    }
    if (courseData.investment) {
      if (courseData.investment.currentPrice > courseData.investment.originalPrice) {
        errors.push("Preço atual não pode ser maior que o preço original");
      }
    }
    if (Array.isArray(courseData.curriculum)) {
      courseData.curriculum.forEach((module, index) => {
        if (!Array.isArray(module.lessons) || module.lessons.length === 0) {
          errors.push(`Módulo ${index + 1} deve ter pelo menos uma aula`);
        }
      });
    }
    if (Array.isArray(courseData.testimonials)) {
      courseData.testimonials.forEach((testimonial, index) => {
        if (testimonial.rating < 1 || testimonial.rating > 5) {
          errors.push(`Rating do depoimento ${index + 1} deve estar entre 1 e 5`);
        }
      });
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Erro de validação: ${error.message}`]
    };
  }
}
const DEFAULT_COURSE_DATA = {
  basicInfo: {
    id: "",
    title: "Curso não encontrado",
    slug: "not-found",
    shortDescription: "Este curso não está disponível",
    longDescription: "Este curso não está disponível no momento.",
    category: "Geral",
    level: "Iniciante",
    duration: "0 horas",
    certificate: false,
    active: false
  },
  investment: {
    originalPrice: 0,
    currentPrice: 0,
    discount: 0,
    installments: {
      max: 1,
      value: 0
    },
    paymentMethods: ["Cartão de crédito"]
  },
  instructor: {
    name: "Instrutor não definido",
    bio: "Biografia não disponível",
    photo: "/placeholder-instructor.jpg",
    experience: "0 anos",
    credentials: []
  },
  curriculum: [],
  whatYouWillLearn: [],
  requirements: [],
  testimonials: [],
  faq: [],
  themeColors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    accent: "#06B6D4",
    gradient: {
      from: "#3B82F6",
      to: "#8B5CF6"
    }
  },
  seoMeta: {
    title: "Curso não encontrado - Escola Habilidade",
    description: "Este curso não está disponível no momento.",
    keywords: ["curso", "escola habilidade"],
    ogImage: "/og-default.jpg",
    ogType: "website"
  }
};
function getCourseBySlug(slug, coursesData = []) {
  if (!slug || !Array.isArray(coursesData)) {
    return null;
  }
  const course = coursesData.find(
    (course2) => {
      var _a, _b;
      return ((_a = course2 == null ? void 0 : course2.basicInfo) == null ? void 0 : _a.slug) === slug && ((_b = course2 == null ? void 0 : course2.basicInfo) == null ? void 0 : _b.active) === true;
    }
  );
  return course || null;
}
function validateAndSanitizeCourse(courseData) {
  var _a, _b;
  if (!courseData) {
    return DEFAULT_COURSE_DATA;
  }
  const validation = validateCourseData(courseData);
  if (!validation.isValid) {
    console.warn("🔧 Dados do curso inválidos:", ((_a = courseData == null ? void 0 : courseData.basicInfo) == null ? void 0 : _a.slug) || "unknown");
    console.warn("📋 Erros encontrados:", validation.errors);
    console.warn("⚠️ Campos obrigatórios faltando:", ((_b = validation.errors) == null ? void 0 : _b.filter((err) => err.includes("required"))) || []);
    return {
      ...DEFAULT_COURSE_DATA,
      ...courseData,
      basicInfo: {
        ...DEFAULT_COURSE_DATA.basicInfo,
        ...courseData.basicInfo
      }
    };
  }
  return courseData;
}
function mapEducationalLevel(level) {
  const levelMap = {
    "Iniciante": "Beginner",
    "Intermediário": "Intermediate",
    "Avançado": "Advanced"
  };
  return levelMap[level] || "Beginner";
}
function formatDurationToISO8601(duration) {
  if (!duration) return "PT40H";
  const hours = duration.match(/(\d+)\s*horas?/i);
  if (hours && hours[1]) {
    return `PT${hours[1]}H`;
  }
  return "PT40H";
}
function generateSyllabusSections(curriculum) {
  if (!curriculum || !Array.isArray(curriculum)) {
    return [{
      "@type": "Syllabus",
      "name": "Módulo Introdutório",
      "description": "Conceitos fundamentais e práticas essenciais",
      "timeRequired": "PT8H"
    }];
  }
  return curriculum.slice(0, 10).map((module, index) => ({
    "@type": "Syllabus",
    "name": module.title || `Módulo ${index + 1}`,
    "description": module.description || "Conteúdo especializado do curso",
    "timeRequired": calculateModuleTime(module.lessons)
  }));
}
function calculateModuleTime(lessons) {
  if (!lessons || !Array.isArray(lessons)) {
    return "PT4H";
  }
  const estimatedHours = Math.max(2, lessons.length * 2);
  return `PT${estimatedHours}H`;
}
function mapOfferCategory(price, investment = {}) {
  if (!price || price === 0) return "Free";
  if (investment.installments && investment.installments.max > 1) {
    return "Paid";
  }
  return "Paid";
}
function generateCourseMetadata(courseData) {
  var _a, _b, _c, _d;
  const safeCourse = validateAndSanitizeCourse(courseData);
  const baseUrl = "https://www.escolahabilidade.com";
  const courseUrl = `${baseUrl}/cursos/${safeCourse.basicInfo.slug}`;
  const defaultInvestment = {
    currentPrice: 597,
    installments: { max: 12, value: 59.7 }
  };
  const defaultInstructor = {
    name: "Instrutores Especializados da Escola Habilidade",
    bio: "Professores qualificados com experiência de mercado e formação técnica especializada."
  };
  const investment = safeCourse.investment && safeCourse.investment.currentPrice > 0 ? safeCourse.investment : defaultInvestment;
  const instructor = safeCourse.instructor || defaultInstructor;
  const calculateAverageRating = () => {
    if (!safeCourse.testimonials || safeCourse.testimonials.length === 0) {
      return 4.8;
    }
    const totalRating = safeCourse.testimonials.reduce((sum, testimonial) => {
      return sum + (testimonial.rating || 5);
    }, 0);
    return Math.round(totalRating / safeCourse.testimonials.length * 10) / 10;
  };
  const teaches = ((_a = safeCourse.whatYouWillLearn) == null ? void 0 : _a.slice(0, 5)) || [
    "Habilidades técnicas profissionais",
    "Competências de mercado",
    "Certificação profissional"
  ];
  return {
    title: safeCourse.seoMeta.title,
    description: safeCourse.seoMeta.description,
    keywords: safeCourse.seoMeta.keywords.join(", "),
    openGraph: {
      title: safeCourse.seoMeta.title,
      description: safeCourse.seoMeta.description,
      type: safeCourse.seoMeta.ogType,
      image: safeCourse.seoMeta.ogImage,
      url: courseUrl
    },
    twitter: {
      card: "summary_large_image",
      title: safeCourse.seoMeta.title,
      description: safeCourse.seoMeta.description,
      image: safeCourse.seoMeta.ogImage
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": safeCourse.basicInfo.title,
      "description": safeCourse.basicInfo.longDescription,
      "url": courseUrl,
      "image": [safeCourse.seoMeta.ogImage],
      "provider": {
        "@type": "Organization",
        "name": "Escola Habilidade",
        "url": baseUrl,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Florianópolis, SC",
          "addressLocality": "Florianópolis",
          "addressRegion": "Santa Catarina",
          "addressCountry": "BR",
          "postalCode": "88000-000"
        }
      },
      "educationalLevel": mapEducationalLevel(safeCourse.basicInfo.level),
      "inLanguage": "pt-BR",
      "teaches": teaches,
      "about": [safeCourse.basicInfo.category, "Formação Profissional", "Educação Técnica"],
      "timeRequired": formatDurationToISO8601(safeCourse.basicInfo.duration),
      "datePublished": (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      "financialAidEligible": "Parcelamento disponível em até 12x sem juros",
      "hasCourseInstance": [{
        "@type": "CourseInstance",
        "courseMode": "Onsite",
        "courseWorkload": formatDurationToISO8601(safeCourse.basicInfo.duration),
        "courseSchedule": {
          "@type": "Schedule",
          "duration": "PT3H",
          "repeatCount": 12,
          "repeatFrequency": "Weekly",
          "startDate": (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          "endDate": new Date(Date.now() + 90 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0]
        },
        "instructor": [{
          "@type": "Person",
          "name": instructor.name,
          "description": instructor.bio || "Professor especializado com experiência de mercado"
        }],
        "location": {
          "@type": "Place",
          "name": "Escola Habilidade",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Florianópolis",
            "addressRegion": "SC",
            "addressCountry": "BR"
          }
        }
      }],
      "offers": [{
        "@type": "Offer",
        "category": mapOfferCategory(investment.currentPrice, investment),
        "price": investment.currentPrice,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-01-01",
        "priceValidUntil": "2025-12-31",
        "url": courseUrl,
        "seller": {
          "@type": "Organization",
          "name": "Escola Habilidade",
          "url": baseUrl
        }
      }],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": calculateAverageRating(),
        "reviewCount": ((_b = safeCourse.testimonials) == null ? void 0 : _b.length) || 50,
        "ratingCount": ((_c = safeCourse.testimonials) == null ? void 0 : _c.length) || 50,
        "bestRating": 5,
        "worstRating": 1
      },
      "syllabusSections": generateSyllabusSections(safeCourse.curriculum),
      "review": ((_d = safeCourse.testimonials) == null ? void 0 : _d.slice(0, 3).map((testimonial, index) => ({
        "@type": "Review",
        "datePublished": new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0],
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": testimonial.rating || 5,
          "bestRating": 5,
          "worstRating": 1
        },
        "author": {
          "@type": "Person",
          "name": testimonial.name || `Aluno ${index + 1}`
        },
        "reviewBody": testimonial.text || "Excelente curso, recomendo!"
      }))) || []
    }
  };
}
function searchCourses(searchTerm, coursesData = []) {
  if (!searchTerm || !Array.isArray(coursesData)) {
    return [];
  }
  const term = searchTerm.toLowerCase();
  return coursesData.filter((course) => {
    var _a, _b;
    if (!((_a = course == null ? void 0 : course.basicInfo) == null ? void 0 : _a.active)) return false;
    const { title, shortDescription, category } = course.basicInfo;
    const basicMatch = title.toLowerCase().includes(term) || shortDescription.toLowerCase().includes(term) || category.toLowerCase().includes(term);
    const curriculumMatch = (_b = course.curriculum) == null ? void 0 : _b.some((module) => {
      var _a2, _b2, _c;
      const moduleMatch = ((_a2 = module.title) == null ? void 0 : _a2.toLowerCase().includes(term)) || ((_b2 = module.description) == null ? void 0 : _b2.toLowerCase().includes(term));
      const lessonsMatch = (_c = module.lessons) == null ? void 0 : _c.some(
        (lesson) => {
          var _a3;
          return (_a3 = lesson.title) == null ? void 0 : _a3.toLowerCase().includes(term);
        }
      );
      return moduleMatch || lessonsMatch;
    });
    return basicMatch || curriculumMatch;
  });
}
const informatica = {
  basicInfo: {
    id: "informatica-001",
    title: "Informática",
    slug: "informatica",
    shortDescription: "Curso completo de informática com Windows 11, Office, ambientes digitais, Canva e IA aplicada.",
    longDescription: "Domine a informática moderna com nosso curso mais completo. Aprenda Windows 11, pacote Office completo, ambientes digitais, Canva e inteligência artificial aplicada. 8 módulos completos para preparação total no mercado de trabalho.",
    category: "Tecnologia",
    level: "Iniciante",
    duration: "184,5 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso de todos os 8 módulos",
      "Apostilas detalhadas com exercícios práticos",
      "Referência permanente para estudos",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Windows 11",
      description: "Sistema operacional moderno e produtividade total",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "Introdução ao Windows 11", duration: "90 min", type: "video" },
        { id: 2, title: "Aplicativos Parte I", duration: "90 min", type: "video" },
        { id: 3, title: "Microsoft Edge", duration: "90 min", type: "video" },
        { id: 4, title: "Explorador de Arquivos Parte I", duration: "90 min", type: "video" },
        { id: 5, title: "Explorador de Arquivos Parte II", duration: "90 min", type: "video" },
        { id: 6, title: "Personalizando o Sistema", duration: "90 min", type: "video" },
        { id: 7, title: "Acessibilidade Parte I", duration: "90 min", type: "video" },
        { id: 8, title: "Aplicativos Parte II", duration: "90 min", type: "video" },
        { id: 9, title: "Aplicativos Parte III", duration: "90 min", type: "video" },
        { id: 10, title: "Aplicativos Parte ", duration: "90 min", type: "video" },
        // ✅ CORRIGIDO - SEM "IV"
        { id: 11, title: "Barra de Tarefas", duration: "90 min", type: "video" },
        { id: 12, title: "Acessibilidade Parte II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Word (Fundamental)",
      description: "Processamento de texto profissional",
      duration: "21 horas",
      lessons: [
        { id: 13, title: "Introdução ao Word 2019", duration: "90 min", type: "video" },
        { id: 14, title: "Iniciando um documento", duration: "90 min", type: "video" },
        { id: 15, title: "Formatando texto e nova Ferramenta de Aprendizagem", duration: "90 min", type: "video" },
        { id: 16, title: "Inserção de tabelas e ícones SVG", duration: "90 min", type: "video" },
        { id: 17, title: "Inserção de elementos gráficos I", duration: "90 min", type: "video" },
        { id: 18, title: "Inserção de elementos gráficos e imagens 3D", duration: "90 min", type: "video" },
        { id: 19, title: "Criação de estruturas de texto I", duration: "90 min", type: "video" },
        { id: 20, title: "Criação de estruturas de texto II", duration: "90 min", type: "video" },
        { id: 21, title: "Inserção de elementos de texto e nova sintaxe LaTeX", duration: "90 min", type: "video" },
        { id: 22, title: "Layout da página", duration: "90 min", type: "video" },
        { id: 23, title: "Design", duration: "90 min", type: "video" },
        { id: 24, title: "Revisão", duration: "90 min", type: "video" },
        { id: 25, title: "Armazenamento e compartilhamento", duration: "90 min", type: "video" },
        { id: 26, title: "Impressão", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Excel (Fundamental)",
      description: "Planilhas eletrônicas para análise de dados",
      duration: "27 horas",
      lessons: [
        { id: 27, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 28, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 29, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 30, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 31, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 32, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 33, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 34, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 35, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 36, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 37, title: "Funções de Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 38, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 39, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 40, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 41, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 42, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 43, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 44, title: "Configurações, Auditoria e Exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Excel (Avançado)",
      description: "Análise avançada de dados e automatização",
      duration: "19,5 horas",
      lessons: [
        { id: 45, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 46, title: "Funções de Texto", duration: "90 min", type: "video" },
        { id: 47, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 48, title: "Funções de Matemática/Trigonometria e Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 49, title: "Funções Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 50, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 51, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 52, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 53, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 54, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 55, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 56, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 57, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "PowerPoint (Fundamental)",
      description: "Apresentações profissionais e impactantes",
      duration: "18 horas",
      lessons: [
        { id: 58, title: "Introdução ao Power Point 2019", duration: "90 min", type: "video" },
        { id: 59, title: "Ferramentas", duration: "90 min", type: "video" },
        { id: 60, title: "Iniciando uma apresentação", duration: "90 min", type: "video" },
        { id: 61, title: "Texto", duration: "90 min", type: "video" },
        { id: 62, title: "Layout de slide", duration: "90 min", type: "video" },
        { id: 63, title: "Elementos gráficos I", duration: "90 min", type: "video" },
        { id: 64, title: "Elementos gráficos II", duration: "90 min", type: "video" },
        { id: 65, title: "Multimídia", duration: "90 min", type: "video" },
        { id: 66, title: "Transições", duration: "90 min", type: "video" },
        { id: 67, title: "Testes de apresentação", duration: "90 min", type: "video" },
        { id: 68, title: "Revisão", duration: "90 min", type: "video" },
        { id: 69, title: "Projeto", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Ambientes Digitais",
      description: "Navegação e ferramentas da internet moderna",
      duration: "24 horas",
      lessons: [
        { id: 70, title: "Introdução à Internet", duration: "90 min", type: "video" },
        { id: 71, title: "Navegação na Web", duration: "90 min", type: "video" },
        { id: 72, title: "Recursos e Pesquisa na Web", duration: "90 min", type: "video" },
        { id: 73, title: "Comunicação Online: E-mail", duration: "90 min", type: "video" },
        { id: 74, title: "Ferramenta de Produtividade: Google Drive", duration: "90 min", type: "video" },
        { id: 75, title: "Internet das Coisas (IoT)", duration: "90 min", type: "video" },
        { id: 76, title: "Videoconferências e Google Agenda", duration: "90 min", type: "video" },
        { id: 77, title: "Segurança Online", duration: "90 min", type: "video" },
        { id: 78, title: "Privacidade e Proteção de Dados", duration: "90 min", type: "video" },
        { id: 79, title: "Compras e Transações Online", duration: "90 min", type: "video" },
        { id: 80, title: "Streaming de Áudio: Spotify", duration: "90 min", type: "video" },
        { id: 81, title: "Streaming de Vídeo: YouTube", duration: "90 min", type: "video" },
        { id: 82, title: "Mensagens Instantâneas: WhatsApp", duration: "90 min", type: "video" },
        { id: 83, title: "Redes Sociais: Facebook", duration: "90 min", type: "video" },
        { id: 84, title: "Redes Sociais: Instagram", duration: "90 min", type: "video" },
        { id: 85, title: "Redes Sociais: TikTok", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 7,
      title: "Canva",
      description: "Design gráfico acessível para todos",
      duration: "18 horas",
      lessons: [
        { id: 86, title: "Crie uma conta", duration: "90 min", type: "video" },
        { id: 87, title: "Conhecendo o Canva", duration: "90 min", type: "video" },
        { id: 88, title: "Biblioteca de modelos", duration: "90 min", type: "video" },
        { id: 89, title: "Editando templates", duration: "90 min", type: "video" },
        { id: 90, title: "Criando logotipos", duration: "90 min", type: "video" },
        { id: 91, title: "Designer profissional", duration: "90 min", type: "video" },
        { id: 92, title: "Vinhetas/Vídeos", duration: "90 min", type: "video" },
        { id: 93, title: "E-books e cartões", duration: "90 min", type: "video" },
        { id: 94, title: "Catálogo digital e proposta comercial", duration: "90 min", type: "video" },
        { id: 95, title: "Mockups", duration: "90 min", type: "video" },
        { id: 96, title: "Canva para Smartphone – Etapa 1", duration: "90 min", type: "video" },
        { id: 97, title: "Canva para Smartphone – Etapa 2", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 8,
      title: "Inteligência Artificial (Informática)",
      description: "IA aplicada à produtividade e trabalho",
      duration: "24 horas",
      lessons: [
        { id: 98, title: "Introdução e História da Inteligência Artificial", duration: "90 min", type: "video" },
        { id: 99, title: "Machine Learning", duration: "90 min", type: "video" },
        { id: 100, title: "Prompt Engineering", duration: "90 min", type: "video" },
        { id: 101, title: "GPT, Bard e Copilot", duration: "90 min", type: "video" },
        { id: 102, title: "Estudando e Pesquisando com IAs", duration: "90 min", type: "video" },
        { id: 103, title: "Melhorando o Prompt", duration: "90 min", type: "video" },
        { id: 104, title: "Gerando Imagens", duration: "90 min", type: "video" },
        { id: 105, title: "Gerando Posts para Redes Sociais", duration: "90 min", type: "video" },
        { id: 106, title: "HARPA AI – Parte 1", duration: "90 min", type: "video" },
        { id: 107, title: "HARPA AI – Parte 2", duration: "90 min", type: "video" },
        { id: 108, title: "Gerando Vídeos", duration: "90 min", type: "video" },
        { id: 109, title: "Gerando Vídeos através de Imagens", duration: "90 min", type: "video" },
        { id: 110, title: "Gerando Áudios", duration: "90 min", type: "video" },
        { id: 111, title: "Gerando Vídeos com D-ID", duration: "90 min", type: "video" },
        { id: 112, title: "PI (Inteligência Artificial Personalizada)", duration: "90 min", type: "video" },
        { id: 113, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Guia de aprendizado estruturado",
        description: "Metodologia comprovada para acelerar seu progresso do básico ao profissional"
      },
      {
        icon: "TrendUp",
        title: "Do básico ao avançado",
        description: "Evolução gradual e consistente até dominar completamente a informática"
      },
      {
        icon: "Users",
        title: "Você dentro do mercado",
        description: "Habilidades de informática realmente demandadas pelas empresas"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Windows 11 e fundamentos da informática moderna",
        icon: "House"
      },
      {
        number: 2,
        title: "Produtividade",
        description: "Desenvolva expertise com Office e ferramentas digitais",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Especialização",
        description: "Avance com Excel, Canva e técnicas profissionais",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Inovação",
        description: "Domine Inteligência Artificial e destaque-se no mercado",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Windows 11 completo e produtividade total",
    "Microsoft Office profissional (Word, Excel, PowerPoint)",
    "Excel Fundamental e Avançado completos",
    "Ambientes digitais e navegação na internet",
    "Design com Canva para redes sociais",
    "Inteligência Artificial aplicada ao trabalho",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida",
    "Preparação completa para o mercado de trabalho"
  ],
  requirements: [
    "Computador com Windows 10/11 ou superior",
    "8GB de RAM (recomendado 16GB)",
    "Conexão estável com internet",
    "Vontade de aprender tecnologia moderna",
    "Dedicação de 10-15 horas semanais"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 997,
    currentPrice: 597,
    discount: 40,
    installments: {
      max: 12,
      value: 59.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Equipe de Instrutores Especializados",
    bio: "Nossa equipe é formada por profissionais certificados em Windows, Office e IA com mais de 10 anos de experiência no ensino de informática para todas as idades.",
    photo: "/instructors/team-informatica.jpg",
    experience: "10+ anos",
    credentials: [
      "Certificação Microsoft Office Specialist",
      "Especialização em Windows 11",
      "Formação em Inteligência Artificial",
      "Experiência corporativa em TI"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Letícia Mendes",
      role: "Informática Fundamental",
      photo: "/testimonials/leticia-mendes.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou adorando fazer o curso de Informática Fundamental na Escola Habilidade. As aulas são muito práticas e dinâmicas, e aprendi rapidamente ferramentas como Excel, Canva e até Inteligência Artificial. O professor é atencioso e esclarece todas as dúvidas!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Mateus Oliveira",
      role: "Informática Fundamental",
      photo: "/testimonials/mateus-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso presencial é excelente, o ambiente é muito acolhedor, e as aulas são bastante claras e práticas. Aprendi muito sobre Word, PowerPoint e Windows 11. O professor é dedicado e sempre traz exemplos do dia a dia.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 3,
      name: "Gabriela Costa Silva",
      role: "Informática Fundamental",
      photo: "/testimonials/gabriela-costa-silva.jpg",
      // Placeholder image
      rating: 5,
      text: "A Escola Habilidade é incrível! As turmas pequenas ajudam demais na hora de aprender, especialmente ferramentas digitais como Canva e Inteligência Artificial. Estou gostando muito das aulas presenciais e da didática do professor.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 4,
      name: "Lucas Felipe Ribeiro",
      role: "Informática Fundamental",
      photo: "/testimonials/lucas-felipe-ribeiro.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou impressionado com a qualidade das aulas presenciais do curso. O professor explica tudo muito bem e o conteúdo é super atualizado. Já estou aplicando o que aprendi no meu dia a dia.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Carolina Almeida",
      role: "Informática Fundamental",
      photo: "/testimonials/carolina-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são muito práticas e interessantes! Aprendi sobre ferramentas que nem sabia que existiam, e o professor sempre traz uma abordagem descontraída que facilita muito o aprendizado.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 6,
      name: "Pedro Henrique Soares",
      role: "Informática Fundamental",
      photo: "/testimonials/pedro-henrique-soares.jpg",
      // Placeholder image
      rating: 5,
      text: "Curso excelente, ambiente confortável e turmas pequenas. Já aprendi muito sobre ferramentas digitais, e o professor é sempre atento e dedicado.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "É adequado para pessoas sem conhecimento em informática?",
      answer: "Sim! Começamos do absoluto zero com Windows 11 e evoluímos gradualmente até tecnologias avançadas como IA aplicada."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 8 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Como a IA está integrada no curso?",
      answer: "Ensinamos IA de forma prática: ChatGPT para produtividade, geração de imagens, vídeos, automações e muito mais."
    }
  ],
  themeColors: {
    primary: "#2196F3",
    secondary: "#00BCD4",
    accent: "#03DAC6",
    gradient: {
      from: "#2196F3",
      to: "#00BCD4"
    }
  },
  seoMeta: {
    title: "Curso de Informática Básica Florianópolis - Windows 11, Office e Excel - Escola Habilidade São José",
    description: "Curso completo de informática básica em Florianópolis e São José SC. Windows 11, Excel, Word, PowerPoint, Canva e IA aplicada. 184h, material incluso, aulas presenciais e online.",
    keywords: ["curso informática básica florianópolis", "windows 11 são josé sc", "excel completo grande florianópolis", "office santa catarina", "informática iniciante SC"],
    ogImage: "/og-images/informatica.jpg",
    ogType: "website"
  }
};
const designGrafico = {
  basicInfo: {
    id: "design-grafico-002",
    title: "Design Gráfico",
    slug: "design-grafico",
    shortDescription: "Domine Photoshop, Illustrator, InDesign, Canva e CorelDRAW para criar designs profissionais.",
    longDescription: "Torne-se um designer gráfico completo. Aprenda Photoshop, Illustrator, InDesign, Canva e CorelDRAW com teorias fundamentais do design. 5 módulos completos para dominar o design profissional.",
    category: "Design & Criação",
    level: "Intermediário",
    duration: "90 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 5 módulos de design",
      "Apostilas com exercícios práticos e projetos",
      "Referência permanente para consulta",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Photoshop (Adobe Photoshop CC)",
      description: "Edição e manipulação de imagens profissional",
      duration: "30 horas",
      lessons: [
        { id: 1, title: "Conhecendo o Photoshop", duration: "90 min", type: "video" },
        { id: 2, title: "Inserindo Imagens, Painéis e Outras Ferramentas", duration: "90 min", type: "video" },
        { id: 3, title: "Unidades de medida, Objeto Inteligente, Conceito das Camadas, Modos de Mesclagem", duration: "90 min", type: "video" },
        { id: 4, title: "Formas básicas", duration: "90 min", type: "video" },
        { id: 5, title: "Espelhando e rotacionando imagens", duration: "90 min", type: "video" },
        { id: 6, title: "Ferramentas de Seleção 1: Seleção Rápida, Varinha Mágica; Remover Olhos Vermelhos", duration: "90 min", type: "video" },
        { id: 7, title: "Ferramentas de Seleção 2: Caneta, Laços, Letreiros", duration: "90 min", type: "video" },
        { id: 8, title: "Utilizando a ferramenta Borracha; Conceito de Máscaras", duration: "90 min", type: "video" },
        { id: 9, title: "Retirando o fundo de uma imagem com Caneta, Filtros e algumas aplicações", duration: "90 min", type: "video" },
        { id: 10, title: "Zoom, Ferramenta Carimbo e alterar a cor de uma forma", duration: "90 min", type: "video" },
        { id: 11, title: "Ferramenta de Texto", duration: "90 min", type: "video" },
        { id: 12, title: "Matiz/Saturação e Desfoque Gaussiano", duration: "90 min", type: "video" },
        { id: 13, title: "Ajustes de imagem 1 (Brilho/Contraste, Níveis, Matiz/Saturação)", duration: "90 min", type: "video" },
        { id: 14, title: "Ajustes de imagem 2 (Preto e Branco, Filtro de Fotos)", duration: "90 min", type: "video" },
        { id: 15, title: "Conhecendo Mockup; Ajustando imagem em perspectiva", duration: "90 min", type: "video" },
        { id: 16, title: "Inserindo pincéis e novas fontes", duration: "90 min", type: "video" },
        { id: 17, title: "Efeito Dupla Exposição", duration: "90 min", type: "video" },
        { id: 18, title: "Efeito Desintegração", duration: "90 min", type: "video" },
        { id: 19, title: "Efeito Glitch", duration: "90 min", type: "video" },
        { id: 20, title: "Projeto: Criando um Cartão de Visitas", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Illustrator (Adobe Illustrator CC)",
      description: "Criação de ilustrações e logotipos vetoriais",
      duration: "24 horas",
      lessons: [
        { id: 21, title: "Ferramentas básicas e interface", duration: "90 min", type: "video" },
        { id: 22, title: "Ferramenta de criação de formas", duration: "90 min", type: "video" },
        { id: 23, title: "Editando formas básicas", duration: "90 min", type: "video" },
        { id: 24, title: "Ferramenta de caneta e criação de formas livres", duration: "90 min", type: "video" },
        { id: 25, title: "Criação de desenhos utilizando formas", duration: "90 min", type: "video" },
        { id: 26, title: "Trabalhando com camadas", duration: "90 min", type: "video" },
        { id: 27, title: "Opacidade, Mesclagem e Máscara", duration: "90 min", type: "video" },
        { id: 28, title: "Pathfinder", duration: "90 min", type: "video" },
        { id: 29, title: "Cores", duration: "90 min", type: "video" },
        { id: 30, title: "Gradientes", duration: "90 min", type: "video" },
        { id: 31, title: "Régua e linhas de guia", duration: "90 min", type: "video" },
        { id: 32, title: "Tipografia e texto", duration: "90 min", type: "video" },
        { id: 33, title: "Criando um Logotipo", duration: "90 min", type: "video" },
        { id: 34, title: "Criando Padrões", duration: "90 min", type: "video" },
        { id: 35, title: "Pincéis", duration: "90 min", type: "video" },
        { id: 36, title: "Conceitos finais e finalizando arquivos", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "InDesign (Adobe InDesign CS6)",
      description: "Diagramação e design editorial profissional",
      duration: "18 horas",
      lessons: [
        { id: 37, title: "Apresentação e Área de Trabalho", duration: "90 min", type: "video" },
        { id: 38, title: "Caixas, Ferramentas de Desenho, Réguas e Elementos", duration: "90 min", type: "video" },
        { id: 39, title: "Paletas Swatches e Stroke", duration: "90 min", type: "video" },
        { id: 40, title: "Configurando Página, Posicionamento e Salvando Arquivo", duration: "90 min", type: "video" },
        { id: 41, title: "Formatação de Textos", duration: "90 min", type: "video" },
        { id: 42, title: "Listas, Conta-Gotas, Efeitos e Colunas", duration: "90 min", type: "video" },
        { id: 43, title: "Redimensionamento de Caixas de Texto e Free Transform", duration: "90 min", type: "video" },
        { id: 44, title: "Cores, Gradientes, Paste e Corner Options", duration: "90 min", type: "video" },
        { id: 45, title: "Scale, Step and Repeat, Alinhamento e Pathfinder", duration: "90 min", type: "video" },
        { id: 46, title: "Text Frame, Transparência e Text Wrap", duration: "90 min", type: "video" },
        { id: 47, title: "Página Mestre, Paleta Links, Numeração e Exportação", duration: "90 min", type: "video" },
        { id: 48, title: "Exercício Prático (Projeto Final)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "Canva",
      description: "Design gráfico acessível para todos",
      duration: "18 horas",
      note: "Mesmo conteúdo do curso listado em Informática – 12 aulas, 18h",
      lessons: [
        { id: 49, title: "Crie uma conta", duration: "90 min", type: "video" },
        { id: 50, title: "Conhecendo o Canva", duration: "90 min", type: "video" },
        { id: 51, title: "Biblioteca de modelos", duration: "90 min", type: "video" },
        { id: 52, title: "Editando templates", duration: "90 min", type: "video" },
        { id: 53, title: "Criando logotipos", duration: "90 min", type: "video" },
        { id: 54, title: "Designer profissional", duration: "90 min", type: "video" },
        { id: 55, title: "Vinhetas/Vídeos", duration: "90 min", type: "video" },
        { id: 56, title: "E-books e cartões", duration: "90 min", type: "video" },
        { id: 57, title: "Catálogo digital e proposta comercial", duration: "90 min", type: "video" },
        { id: 58, title: "Mockups", duration: "90 min", type: "video" },
        { id: 59, title: "Canva para Smartphone – Etapa 1", duration: "90 min", type: "video" },
        { id: 60, title: "Canva para Smartphone – Etapa 2", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "CorelDRAW",
      description: "Ilustração e design vetorial profissional",
      duration: "24 horas",
      lessons: [
        { id: 61, title: "Introdução ao CorelDRAW", duration: "90 min", type: "video" },
        { id: 62, title: "Trabalhando com Cores", duration: "90 min", type: "video" },
        { id: 63, title: "Ferramentas de Formas Básicas e Formatação", duration: "90 min", type: "video" },
        { id: 64, title: "Importação e Exportação de Arquivos", duration: "90 min", type: "video" },
        { id: 65, title: "Ferramentas de Texto", duration: "90 min", type: "video" },
        { id: 66, title: "Camadas e Objetos", duration: "90 min", type: "video" },
        { id: 67, title: "Efeitos e Transformações", duration: "90 min", type: "video" },
        { id: 68, title: "Ferramentas de Desenho Avançado", duration: "90 min", type: "video" },
        { id: 69, title: "Ferramentas de Desenho Avançado – Parte 2", duration: "90 min", type: "video" },
        { id: 70, title: "Ferramenta PowerTRACE", duration: "90 min", type: "video" },
        { id: 71, title: "Ferramenta PowerClip", duration: "90 min", type: "video" },
        { id: 72, title: "Estilos e Modelos", duration: "90 min", type: "video" },
        { id: 73, title: "Texto Artístico Avançado", duration: "90 min", type: "video" },
        { id: 74, title: "Efeitos 3D", duration: "90 min", type: "video" },
        { id: 75, title: "Projetos de Design", duration: "90 min", type: "video" },
        { id: 76, title: "Projeto Final", duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes  
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Guia completo de design",
        description: "Metodologia estruturada para dominar todas as ferramentas Adobe e design profissional"
      },
      {
        icon: "TrendUp",
        title: "Do iniciante ao expert",
        description: "Evolução progressiva desde conceitos básicos até projetos complexos"
      },
      {
        icon: "Users",
        title: "Portfolio profissional",
        description: "Crie projetos reais que impressionam clientes e empregadores"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Photoshop e conceitos básicos de design visual",
        icon: "House"
      },
      {
        number: 2,
        title: "Criação Vetorial",
        description: "Desenvolva expertise em Illustrator e criação de logotipos",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Design Editorial",
        description: "Avance com InDesign, CorelDRAW e projetos complexos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Profissionalização",
        description: "Construa portfolio completo e destaque-se no mercado",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Adobe Photoshop profissional para design",
    "Adobe Illustrator para criação vetorial",
    "Adobe InDesign para design editorial",
    "Canva para design rápido e eficiente",
    "CorelDRAW para ilustração e vetorização",
    "Teoria do design e composição visual",
    "Criação de logotipos e identidade visual",
    "Design para redes sociais e marketing",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com projetos reais",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "8GB de RAM (recomendado 16GB)",
    "Adobe Creative Cloud (orientações de licenciamento)",
    "Tablet gráfico (recomendado)",
    "Senso estético e criatividade"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Design Masters Team",
    bio: "Equipe de designers profissionais com certificação Adobe e experiência em agências e estúdios de design. Especialistas em formar novos talentos.",
    photo: "/instructors/team-design.jpg",
    experience: "8+ anos",
    credentials: [
      "Adobe Certified Expert (ACE)",
      "Experiência em agências de publicidade",
      "Portfolio internacional de clientes",
      "Formação em Design Gráfico"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Julia Menezes",
      role: "Designer Gráfico",
      photo: "/testimonials/julia-menezes.jpg",
      // Placeholder image
      rating: 5,
      text: "Entrei no curso sem saber nada e hoje já consigo criar artes incríveis. As aulas são leves, criativas e práticas. Me surpreendi!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Anderson Carvalho",
      role: "Designer Gráfico",
      photo: "/testimonials/anderson-carvalho.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso tem uma pegada bem atualizada, cheia de referências visuais que realmente inspiram. O professor dá atenção individualizada e isso fez toda a diferença no meu desenvolvimento.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 3,
      name: "Camila Pacheco",
      role: "Designer Gráfico",
      photo: "/testimonials/camila-pacheco.jpg",
      // Placeholder image
      rating: 5,
      text: "A Escola Habilidade oferece um ambiente que realmente estimula a criação. Estou curtindo muito as aulas, principalmente pelas propostas práticas que me desafiam.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 4,
      name: "Marcelo Andrade",
      role: "Designer Gráfico",
      photo: "/testimonials/marcelo-andrade.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou tendo uma experiência fantástica. Além de ensinar técnicas, o curso ajuda no desenvolvimento da criatividade. Aprender aqui tem sido leve e produtivo.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 5,
      name: "Larissa Almeida",
      role: "Designer Gráfico",
      photo: "/testimonials/larissa-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "Fui surpreendida positivamente! Aprendi várias ferramentas digitais que nem conhecia, e estou usando em projetos reais. Muito além do básico!",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 6,
      name: "Samuel Oliveira",
      role: "Designer Gráfico",
      photo: "/testimonials/samuel-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são tão boas que passam voando. O professor é claro nas explicações, e a prática constante me ajudou a evoluir mais rápido do que eu imaginava.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso ter talento artístico natural?",
      answer: "Não! Design é técnica que se aprende. Ensinamos desde o básico até você desenvolver seu próprio estilo criativo."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 5 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "O curso serve para design de redes sociais?",
      answer: "Perfeitamente! Ensinamos design para Instagram, Facebook, LinkedIn e todas as principais plataformas."
    }
  ],
  themeColors: {
    primary: "#9C27B0",
    secondary: "#E91E63",
    accent: "#FF5722",
    gradient: {
      from: "#9C27B0",
      to: "#E91E63"
    }
  },
  seoMeta: {
    title: "Curso Design Gráfico Completo - Escola Habilidade | Photoshop, Illustrator, InDesign, Canva - Material Incluso",
    description: "Torne-se Designer Gráfico profissional. 5 módulos: Photoshop, Illustrator, InDesign, Canva, CorelDRAW. 90 horas, apostilas inclusas, modalidades presencial e online.",
    keywords: ["design gráfico", "photoshop", "illustrator", "indesign", "canva", "coreldraw", "apostilas inclusas"],
    ogImage: "/og-images/design-grafico.jpg",
    ogType: "website"
  }
};
const programacao = {
  basicInfo: {
    id: "programacao-003",
    title: "Programação",
    slug: "programacao",
    shortDescription: "Domine Lógica, Python, Java, PHP, Android e Cursor IA para desenvolvimento completo.",
    longDescription: "Curso completo de programação full-stack. Aprenda Lógica, Python, Java, PHP, desenvolvimento Android e o revolucionário Cursor com IA. 6 módulos completos do zero ao primeiro emprego como programador.",
    category: "Tecnologia",
    level: "Iniciante",
    duration: "133 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 6 módulos de programação",
      "Apostilas com códigos, exercícios e projetos práticos",
      "Referência permanente para desenvolvimento",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Lógica de Programação",
      description: "Fundamentos lógicos para qualquer linguagem de programação",
      duration: "21 horas",
      lessons: [
        { id: 1, title: "Introdução à Programação", duration: "90 min", type: "video" },
        { id: 2, title: "Variáveis, constantes e tipos de dados", duration: "90 min", type: "video" },
        { id: 3, title: "Primeiro programa (Algoritmos)", duration: "90 min", type: "video" },
        { id: 4, title: "Tipos de operadores", duration: "90 min", type: "video" },
        { id: 5, title: "Estrutura de decisão – Parte 1", duration: "90 min", type: "video" },
        { id: 6, title: "Estrutura de decisão – Parte 2", duration: "90 min", type: "video" },
        { id: 7, title: "Estrutura de repetição – Parte 1", duration: "90 min", type: "video" },
        { id: 8, title: "Estrutura de repetição – Parte 2", duration: "90 min", type: "video" },
        { id: 9, title: "Manipulação de vetores", duration: "90 min", type: "video" },
        { id: 10, title: "Manipulação de matrizes", duration: "90 min", type: "video" },
        { id: 11, title: "Funções e procedimentos", duration: "90 min", type: "video" },
        { id: 12, title: "Modularização", duration: "90 min", type: "video" },
        { id: 13, title: "Prática 1 (exercícios integrados)", duration: "90 min", type: "exercise" },
        { id: 14, title: "Prática 2 (projeto final)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Python",
      description: "Python do básico ao avançado para desenvolvimento profissional",
      duration: "24 horas",
      lessons: [
        { id: 15, title: "Iniciando no Python", duration: "90 min", type: "video" },
        { id: 16, title: "Primeiros passos com Python", duration: "90 min", type: "video" },
        { id: 17, title: "If, Else e Elif (Estruturas de decisão)", duration: "90 min", type: "video" },
        { id: 18, title: "Loops (Estruturas de repetição)", duration: "90 min", type: "video" },
        { id: 19, title: "Listas", duration: "90 min", type: "video" },
        { id: 20, title: "Strings", duration: "90 min", type: "video" },
        { id: 21, title: "Funções", duration: "90 min", type: "video" },
        { id: 22, title: "Lidando com erros", duration: "90 min", type: "video" },
        { id: 23, title: "Módulos e pacotes", duration: "90 min", type: "video" },
        { id: 24, title: "Objetos (introdução à OOP)", duration: "90 min", type: "video" },
        { id: 25, title: "Dicionários", duration: "90 min", type: "video" },
        { id: 26, title: "Arquivos", duration: "90 min", type: "video" },
        { id: 27, title: "Bibliotecas externas", duration: "90 min", type: "video" },
        { id: 28, title: "Data e hora", duration: "90 min", type: "video" },
        { id: 29, title: "Expressões regulares", duration: "90 min", type: "video" },
        { id: 30, title: "Projeto final", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 3,
      title: "Java",
      description: "Java para aplicações robustas e empresariais",
      duration: "24 horas",
      lessons: [
        { id: 31, title: "Introdução ao Java", duration: "90 min", type: "video" },
        { id: 32, title: "Interface, componentes e variáveis", duration: "90 min", type: "video" },
        { id: 33, title: "Operadores matemáticos, relacionais e controle de fluxo", duration: "90 min", type: "video" },
        { id: 34, title: "Estrutura de repetição (For e While)", duration: "90 min", type: "video" },
        { id: 35, title: "Manipulação de Strings", duration: "90 min", type: "video" },
        { id: 36, title: "Variáveis compostas", duration: "90 min", type: "video" },
        { id: 37, title: "Orientação a Objetos: Introdução", duration: "90 min", type: "video" },
        { id: 38, title: "Projeto sem Orientação a Objetos (comparativo)", duration: "90 min", type: "video" },
        { id: 39, title: "Orientação a Objetos: Classes", duration: "90 min", type: "video" },
        { id: 40, title: "Orientação a Objetos: Métodos", duration: "90 min", type: "video" },
        { id: 41, title: "Orientação a Objetos: Métodos II", duration: "90 min", type: "video" },
        { id: 42, title: "Encapsulamento", duration: "90 min", type: "video" },
        { id: 43, title: "OOP: Vetor, Laço e Lista", duration: "90 min", type: "video" },
        { id: 44, title: "Herança", duration: "90 min", type: "video" },
        { id: 45, title: "Sobreposição e Interface Gráfica I", duration: "90 min", type: "video" },
        { id: 46, title: "Interface Gráfica II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Programação PHP (Versão 2)",
      description: "PHP para desenvolvimento web e sistemas dinâmicos",
      duration: "30 horas",
      lessons: [
        { id: 47, title: "Introdução ao PHP", duration: "90 min", type: "video" },
        { id: 48, title: "Notepad++ e Conceitos Básicos de Programação", duration: "90 min", type: "video" },
        { id: 49, title: "Operadores de Comparação, Lógicos e Estrutura Condicional", duration: "90 min", type: "video" },
        { id: 50, title: "Estrutura Condicional e Estrutura de Repetição", duration: "90 min", type: "video" },
        { id: 51, title: "Estrutura de Repetição, Strings e Funções", duration: "90 min", type: "video" },
        { id: 52, title: "Variáveis Compostas", duration: "90 min", type: "video" },
        { id: 53, title: "Hospedagem de Site (publicação)", duration: "90 min", type: "video" },
        { id: 54, title: "Cookies e Sessões", duration: "90 min", type: "video" },
        { id: 55, title: "Integração PHP com HTML", duration: "90 min", type: "video" },
        { id: 56, title: "Banco de Dados – Parte 1", duration: "90 min", type: "video" },
        { id: 57, title: "Banco de Dados – Parte 2", duration: "90 min", type: "video" },
        { id: 58, title: "Projeto Etapa 1: Estrutura, Conexão, Exibir Categorias e Produtos", duration: "90 min", type: "project" },
        { id: 59, title: "Projeto Etapa 2: Detalhes do Produto e Área Administrativa", duration: "90 min", type: "project" },
        { id: 60, title: "Projeto Etapa 3: Excluir Categoria e Cadastrar Produtos", duration: "90 min", type: "project" },
        { id: 61, title: "Projeto Etapa 4: Editar e Atualizar Produtos", duration: "90 min", type: "project" },
        { id: 62, title: "Projeto Etapa 5: Excluir Produto e Área de Pedidos", duration: "90 min", type: "project" },
        { id: 63, title: "Projeto Etapa 6: Excluir Pedido e Cadastrar Cliente", duration: "90 min", type: "project" },
        { id: 64, title: "Projeto Etapa 7: Listar Pedidos dos Clientes", duration: "90 min", type: "project" },
        { id: 65, title: "Projeto Etapa 8: Editar e Atualizar (funcionalidades finais)", duration: "90 min", type: "project" },
        { id: 66, title: "Ativar/Desativar Cliente, Login e Hospedagem", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 5,
      title: "Desenvolvedor de Aplicativos (Android v.2)",
      description: "Desenvolvimento de apps nativos para Android",
      duration: "24 horas",
      lessons: [
        { id: 67, title: "Introdução ao Android Studio", duration: "90 min", type: "video" },
        { id: 68, title: "Interface e componentes", duration: "90 min", type: "video" },
        { id: 69, title: "Variáveis e tipos", duration: "90 min", type: "video" },
        { id: 70, title: "Operadores matemáticos e estruturas condicionais", duration: "90 min", type: "video" },
        { id: 71, title: "Estruturas condicionais, tratamento de texto e layout", duration: "90 min", type: "video" },
        { id: 72, title: "Layout, Arrays e navegando entre telas (Activities)", duration: "90 min", type: "video" },
        { id: 73, title: "Orientação a Objetos (Métodos, Classes e Herança)", duration: "90 min", type: "video" },
        { id: 74, title: "Modificadores de acesso", duration: "90 min", type: "video" },
        { id: 75, title: "XML e layout adaptável", duration: "90 min", type: "video" },
        { id: 76, title: "Guidelines (Diretrizes de design)", duration: "90 min", type: "video" },
        { id: 77, title: "Chain, GridLayout e Componentes de formulário", duration: "90 min", type: "video" },
        { id: 78, title: "Componentes de formulário (continuação)", duration: "90 min", type: "video" },
        { id: 79, title: 'Mídia + Projeto "Cadastro de Clientes"', duration: "90 min", type: "project" },
        { id: 80, title: 'Banco de Dados + Projeto "Cadastro de Clientes"', duration: "90 min", type: "project" },
        { id: 81, title: 'Banco de Dados + Projeto "Cadastro de Clientes" (continuação)', duration: "90 min", type: "project" },
        { id: 82, title: 'Projeto "Cadastro de Clientes" + Publicação na Google Play', duration: "90 min", type: "project" }
      ]
    },
    {
      id: 6,
      title: "Cursor (IDE com IA integrada)",
      description: "Desenvolvimento assistido por Inteligência Artificial com Cursor IDE",
      duration: "15 horas",
      lessons: [
        { id: 83, title: "Introdução ao Cursor IDE", duration: "90 min", type: "video" },
        { id: 84, title: "Configuração e Primeiros Passos", duration: "90 min", type: "video" },
        { id: 85, title: "IA Assistant para Programação", duration: "90 min", type: "video" },
        { id: 86, title: "Geração Automática de Código", duration: "90 min", type: "video" },
        { id: 87, title: "Debugging com IA", duration: "90 min", type: "video" },
        { id: 88, title: "Refatoração Inteligente", duration: "90 min", type: "video" },
        { id: 89, title: "Documentação Automatizada", duration: "90 min", type: "video" },
        { id: 90, title: "Testes Unitários com IA", duration: "90 min", type: "video" },
        { id: 91, title: "Otimização de Performance com IA", duration: "90 min", type: "video" },
        { id: 92, title: "Projeto Final: App Completo com Cursor", duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Do zero ao programador",
        description: "Metodologia comprovada que leva iniciantes ao primeiro emprego em programação"
      },
      {
        icon: "TrendUp",
        title: "Múltiplas linguagens",
        description: "Domine Python, Java, PHP e Android para ser um desenvolvedor versátil"
      },
      {
        icon: "Users",
        title: "Mercado em alta",
        description: "Programadores são os profissionais mais demandados do mercado atual"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Lógica",
        description: "Fundamentos sólidos de lógica de programação e algoritmos",
        icon: "House"
      },
      {
        number: 2,
        title: "Linguagens",
        description: "Domine Python, Java e PHP com projetos práticos",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Mobile & Web",
        description: "Desenvolva aplicativos Android e sistemas web completos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Carreira",
        description: "Portfolio profissional e preparação para oportunidades",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Lógica de programação sólida para qualquer linguagem",
    "Python completo para desenvolvimento web e automação",
    "Java para aplicações empresariais robustas",
    "PHP para sistemas web dinâmicos com MySQL",
    "Desenvolvimento de aplicativos Android nativos",
    "Cursor: IDE com IA integrada (em desenvolvimento)",
    "CRUD completo e banco de dados",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com projetos reais",
    "Preparação completa para o mercado de trabalho",
    "Do zero ao primeiro emprego como programador"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "8GB de RAM mínimo (recomendado 16GB)",
    "Conexão estável com internet",
    "Inglês básico (recomendado)",
    "Dedicação de 15-20 horas semanais",
    "Vontade de resolver problemas lógicos"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1497,
    currentPrice: 897,
    discount: 40,
    installments: {
      max: 12,
      value: 89.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Code Academy Team",
    bio: "Equipe de desenvolvedores sênior com experiência em múltiplas linguagens e projetos de grande escala. Especialistas em formar novos programadores.",
    photo: "/instructors/team-programacao.jpg",
    experience: "12+ anos",
    credentials: [
      "Certificação em Python e Java",
      "Experiência em startups e grandes empresas",
      "Projetos open source reconhecidos",
      "Formação em Ciência da Computação"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Paulo Henrique Santos",
      role: "Programação",
      photo: "/testimonials/paulo-henrique-santos.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso de Programação mudou minha forma de pensar. Nunca imaginei que aprender lógica e código pudesse ser tão prático. As aulas são muito bem organizadas.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Letícia Ribeiro",
      role: "Programação",
      photo: "/testimonials/leticia-ribeiro.jpg",
      // Placeholder image
      rating: 5,
      text: "Escolhi o curso sem saber nada de programação e já estou desenvolvendo meus primeiros projetos. O professor tem uma didática incrível e sempre nos motiva.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 3,
      name: "Lucas Vinícius",
      role: "Programação",
      photo: "/testimonials/lucas-vinicius.jpg",
      // Placeholder image
      rating: 5,
      text: "As aulas são envolventes, com desafios reais que deixam tudo mais interessante. Cada aula me motiva a ir mais longe na área.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 4,
      name: "Isadora Lima",
      role: "Programação",
      photo: "/testimonials/isadora-lima.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou impressionada com a evolução que tive. O curso é direto ao ponto, com muita prática. O professor torna assuntos complexos fáceis de entender.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Thiago Bernardes",
      role: "Programação",
      photo: "/testimonials/thiago-bernardes.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso tem foco total no que é realmente útil. As atividades práticas e os projetos me deram mais confiança para pensar no mercado.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 6,
      name: "Natália Pereira",
      role: "Programação",
      photo: "/testimonials/natalia-pereira.jpg",
      // Placeholder image
      rating: 5,
      text: "O professor cria um ambiente acolhedor, onde a gente se sente à vontade pra errar e aprender. Gostei muito dos projetos em sala, me ajudaram a ver tudo na prática.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso ter conhecimento prévio em programação?",
      answer: "Não! Começamos do absoluto zero com lógica de programação e evoluímos gradualmente até linguagens avançadas."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "O que é o Cursor e quando estará disponível?",
      answer: "Cursor é um IDE com IA integrada para desenvolvimento. O conteúdo programático está sendo desenvolvido pela equipe."
    }
  ],
  themeColors: {
    primary: "#4CAF50",
    secondary: "#8BC34A",
    accent: "#CDDC39",
    gradient: {
      from: "#4CAF50",
      to: "#8BC34A"
    }
  },
  seoMeta: {
    title: "Curso de Programação Florianópolis - Python, Java, PHP e Android - Escola Habilidade São José",
    description: "Curso completo de programação em Florianópolis e São José SC. Aprenda Python, Java, PHP e desenvolvimento Android do zero ao primeiro emprego. 118 horas, material incluso, modalidades presencial e online.",
    keywords: ["curso programação florianópolis", "python são josé sc", "java grande florianópolis", "php desenvolvimento web", "android programação", "escola técnica programação SC"],
    ogImage: "/og-images/programacao.jpg",
    ogType: "website"
  }
};
const marketingDigital = {
  basicInfo: {
    id: "marketing-digital-004",
    title: "Marketing Digital",
    slug: "marketing-digital",
    shortDescription: "Domine Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business.",
    longDescription: "Torne-se um especialista em Marketing Digital. Aprenda Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal e Facebook Business. 6 módulos completos para gerar resultados reais.",
    category: "Marketing",
    level: "Intermediário",
    duration: "68 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 6 módulos de marketing",
      "Apostilas com estratégias, templates e cases práticos",
      "Referência permanente para campanhas",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Marketing Digital (Versão 2)",
      description: "Base estratégica para dominar o marketing online",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "O que é o Marketing Digital?", duration: "90 min", type: "video" },
        { id: 2, title: "Descobrindo seu público-alvo e persona", duration: "90 min", type: "video" },
        { id: 3, title: "Como escolher seus Canais de Divulgação e Venda", duration: "90 min", type: "video" },
        { id: 4, title: "Facebook (Marketing na plataforma)", duration: "90 min", type: "video" },
        { id: 5, title: "Instagram (Marketing na plataforma)", duration: "90 min", type: "video" },
        { id: 6, title: "Conteúdos Atrativos para Redes Sociais I", duration: "90 min", type: "video" },
        { id: 7, title: "Conteúdos Atrativos para Redes Sociais II", duration: "90 min", type: "video" },
        { id: 8, title: "Google Meu Negócio e Google Ads", duration: "90 min", type: "video" },
        { id: 9, title: "Google Analytics", duration: "90 min", type: "video" },
        { id: 10, title: "Como vender mais e atrair mais Leads", duration: "90 min", type: "video" },
        { id: 11, title: "Criando uma Campanha no Facebook I", duration: "90 min", type: "video" },
        { id: 12, title: "Criando uma Campanha no Facebook II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Mídias Sociais",
      description: "Estratégias para redes sociais e comunicação digital",
      duration: "15 horas",
      lessons: [
        { id: 13, title: "Introdução a Mídias Sociais", duration: "90 min", type: "video" },
        { id: 14, title: "Redes Sociais (conceito geral)", duration: "90 min", type: "video" },
        { id: 15, title: "Conhecendo o Twitter", duration: "90 min", type: "video" },
        { id: 16, title: "Conhecendo o Instagram", duration: "90 min", type: "video" },
        { id: 17, title: "Conhecendo o Facebook", duration: "90 min", type: "video" },
        { id: 18, title: "Conhecendo o Facebook Messenger", duration: "90 min", type: "video" },
        { id: 19, title: "Criando uma Página no Facebook", duration: "90 min", type: "video" },
        { id: 20, title: "Conhecendo o LinkedIn", duration: "90 min", type: "video" },
        { id: 21, title: "Conhecendo o YouTube", duration: "90 min", type: "video" },
        { id: 22, title: "Conhecendo o WhatsApp", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Armazenamento na Nuvem",
      description: "Ferramentas de produtividade e colaboração online",
      duration: "6 horas",
      lessons: [
        { id: 23, title: "Google Drive", duration: "90 min", type: "video" },
        { id: 24, title: "Compartilhamento de Arquivos e Trabalho em Conjunto", duration: "90 min", type: "video" },
        { id: 25, title: "Dropbox", duration: "90 min", type: "video" },
        { id: 26, title: "Compartilhamento de Arquivos e Arquivos Offline", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Inteligência Artificial (Marketing)",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 5,
      title: "Marketing Pessoal",
      description: "Desenvolvimento de marca pessoal e networking",
      duration: "3 horas",
      lessons: [
        { id: 27, title: "Marketing Pessoal – Valores e Auto-Conhecimento", duration: "90 min", type: "video" },
        { id: 28, title: "Networking, Branding e Qualificação Profissional", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Facebook Business",
      description: "Estratégias avançadas para campanhas no Facebook",
      duration: "24 horas",
      lessons: [
        { id: 29, title: "Conhecendo o Facebook Business", duration: "90 min", type: "video" },
        { id: 30, title: "Criando Conta de Usuário e Página", duration: "90 min", type: "video" },
        { id: 31, title: "Menu Configurações I", duration: "90 min", type: "video" },
        { id: 32, title: "Menu Configurações II", duration: "90 min", type: "video" },
        { id: 33, title: "Menu Configurações III", duration: "90 min", type: "video" },
        { id: 34, title: "Criação de Públicos I", duration: "90 min", type: "video" },
        { id: 35, title: "Criação de Públicos II", duration: "90 min", type: "video" },
        { id: 36, title: "Criação de Públicos III", duration: "90 min", type: "video" },
        { id: 37, title: "Gerenciador de Anúncios", duration: "90 min", type: "video" },
        { id: 38, title: "Criação de Campanha I", duration: "90 min", type: "video" },
        { id: 39, title: "Criação de Campanha II", duration: "90 min", type: "video" },
        { id: 40, title: "Criação de Campanha III", duration: "90 min", type: "video" },
        { id: 41, title: "Criação de Campanha IV", duration: "90 min", type: "video" },
        { id: 42, title: "Publicando Campanhas", duration: "90 min", type: "video" },
        { id: 43, title: "Leads e Pixel (Ferramentas de Conversão)", duration: "90 min", type: "video" },
        { id: 44, title: "Gerando e Analisando Dados", duration: "90 min", type: "video" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Estratégias que funcionam",
        description: "Metodologia comprovada para gerar resultados reais em marketing digital"
      },
      {
        icon: "TrendUp",
        title: "Multiplique vendas",
        description: "Técnicas avançadas para aumentar faturamento e conquistar clientes"
      },
      {
        icon: "Users",
        title: "Mercado em expansão",
        description: "Marketing digital é essencial para qualquer negócio moderno"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine os pilares do marketing digital e mídias sociais",
        icon: "House"
      },
      {
        number: 2,
        title: "Estratégia",
        description: "Desenvolva campanhas eficazes e conteúdo atrativo",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Automação",
        description: "Facebook Business, IA Marketing e ferramentas avançadas",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Resultados",
        description: "Portfolio com campanhas reais e marca pessoal consolidada",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Marketing Digital V2: estratégias modernas e eficazes",
    "Mídias Sociais: Facebook, Instagram, Twitter, LinkedIn",
    "Armazenamento em Nuvem para produtividade",
    "IA Marketing: automação inteligente (em desenvolvimento)",
    "Marketing Pessoal: construção de marca pessoal",
    "Facebook Business: campanhas profissionais",
    "Google Analytics e métricas de desempenho",
    "Criação de conteúdo atrativo para redes",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Portfolio com campanhas reais",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "Conexão estável com internet",
    "Conta Google (Gmail)",
    "Conta Facebook pessoal",
    "Orçamento inicial para testes (R$ 300-500)",
    "Conhecimentos básicos de informática"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 597,
    discount: 33,
    installments: {
      max: 12,
      value: 59.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Digital Marketing Masters",
    bio: "Equipe de especialistas em marketing digital com experiência em agências e campanhas de grande alcance. Experts em resultados mensuráveis.",
    photo: "/instructors/team-marketing.jpg",
    experience: "8+ anos",
    credentials: [
      "Certificação Google Ads e Analytics",
      "Facebook Blueprint Certified",
      "Experiência em agências de publicidade",
      "Cases de sucesso em e-commerce"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Maria Eduarda Costa",
      role: "Profissional Confiante",
      photo: "/testimonials/maria-eduarda-costa.jpg",
      rating: 5,
      text: "Aprender sobre Marketing Pessoal mudou minha postura profissional. Hoje me sinto muito mais confiante para divulgar meu trabalho.",
      result: "Postura profissional transformada"
    },
    {
      id: 2,
      name: "Isabela Freitas",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/isabela-freitas.jpg",
      rating: 5,
      text: "Finalmente aprendi a usar Inteligência Artificial para gerar conteúdo e criar meus posts nas redes sociais. Recomendo demais!",
      result: "Conteúdo com IA"
    },
    {
      id: 3,
      name: "Natália Campos",
      role: "Entusiasta de Marketing",
      photo: "/testimonials/natalia-campos.jpg",
      rating: 5,
      text: "Adorei como o curso conectou marketing digital com inteligência artificial. Inovador e surpreendente!",
      result: "Combinação inovadora"
    },
    {
      id: 4,
      name: "Fabiola Moraes",
      role: "Profissional de Marketing",
      photo: "/testimonials/fabiola-moraes.jpg",
      rating: 5,
      text: "Depois do curso, consegui o emprego que tanto sonhei na área de marketing digital. Obrigada Escola Habilidade por me ajudar nesse caminho!",
      result: "Emprego dos sonhos"
    },
    {
      id: 5,
      name: "Julia Ramos",
      role: "Gestora de Anúncios",
      photo: "/testimonials/julia-ramos.jpg",
      rating: 5,
      text: "Antes desse curso, eu tinha muito medo de mexer com os anúncios das redes sociais. As aulas sobre Facebook Business foram um divisor de águas. Hoje já consigo ter retorno real dos anúncios que crio.",
      result: "Retorno real dos anúncios"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Funciona para qualquer tipo de negócio?",
      answer: "Sim! As estratégias se aplicam a e-commerce, serviços, infoprodutos, profissionais liberais e empresas B2B."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 6 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Como funciona o módulo de IA Marketing?",
      answer: "O módulo de IA Marketing está em desenvolvimento. O conteúdo será disponibilizado assim que finalizado pela equipe."
    }
  ],
  themeColors: {
    primary: "#3F51B5",
    secondary: "#5C6BC0",
    accent: "#7986CB",
    gradient: {
      from: "#3F51B5",
      to: "#5C6BC0"
    }
  },
  seoMeta: {
    title: "Curso Marketing Digital Completo - Escola Habilidade | Marketing V2, Mídias Sociais, Facebook Business - Material Incluso",
    description: "Torne-se especialista em Marketing Digital. 6 módulos: Marketing V2, Mídias Sociais, Armazenamento na Nuvem, IA Marketing, Marketing Pessoal, Facebook Business. 68 horas, apostilas inclusas.",
    keywords: ["marketing digital", "marketing v2", "mídias sociais", "facebook business", "marketing pessoal", "apostilas inclusas"],
    ogImage: "/og-images/marketing-digital.jpg",
    ogType: "website"
  }
};
const inteligenciaArtificial = {
  basicInfo: {
    id: "inteligencia-artificial-005",
    title: "Inteligência Artificial",
    slug: "inteligencia-artificial",
    shortDescription: "Domine IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas.",
    longDescription: "Curso completo de Inteligência Artificial. Aprenda IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs e HatchCanvas. 6 módulos para dominar IA criativa e aplicada aos negócios.",
    category: "Tecnologia",
    level: "Intermediário",
    duration: "31,5 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos módulos disponíveis",
      "Apostilas com prompts, tutoriais e projetos práticos",
      "Referência permanente para IA aplicada",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Inteligência Artificial (Fundamentos)",
      description: 'Conteúdo já detalhado acima em Informática – módulo "Inteligência Artificial", 16 aulas, 24h',
      duration: "24 horas",
      note: "Mesmo conteúdo do módulo de IA do curso de Informática",
      lessons: [
        { id: 1, title: "Introdução e História da Inteligência Artificial", duration: "90 min", type: "video" },
        { id: 2, title: "Machine Learning", duration: "90 min", type: "video" },
        { id: 3, title: "Prompt Engineering", duration: "90 min", type: "video" },
        { id: 4, title: "GPT, Bard e Copilot", duration: "90 min", type: "video" },
        { id: 5, title: "Estudando e Pesquisando com IAs", duration: "90 min", type: "video" },
        { id: 6, title: "Melhorando o Prompt", duration: "90 min", type: "video" },
        { id: 7, title: "Gerando Imagens", duration: "90 min", type: "video" },
        { id: 8, title: "Gerando Posts para Redes Sociais", duration: "90 min", type: "video" },
        { id: 9, title: "HARPA AI – Parte 1", duration: "90 min", type: "video" },
        { id: 10, title: "HARPA AI – Parte 2", duration: "90 min", type: "video" },
        { id: 11, title: "Gerando Vídeos", duration: "90 min", type: "video" },
        { id: 12, title: "Gerando Vídeos através de Imagens", duration: "90 min", type: "video" },
        { id: 13, title: "Gerando Áudios", duration: "90 min", type: "video" },
        { id: 14, title: "Gerando Vídeos com D-ID", duration: "90 min", type: "video" },
        { id: 15, title: "PI (Inteligência Artificial Personalizada)", duration: "90 min", type: "video" },
        { id: 16, title: 'Projeto "Liga das IAs" (Ferramentas integradas)', duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: 'Inteligência Artificial for Business ("Empreendendo com IA nos Negócios")',
      description: "IA aplicada aos negócios e empreendedorismo",
      duration: "7,5 horas",
      lessons: [
        { id: 17, title: "Criando Minha Marca", duration: "90 min", type: "video" },
        { id: 18, title: "Mapeando Público-Alvo", duration: "90 min", type: "video" },
        { id: 19, title: "Criando Argumentos de Vendas Personalizados", duration: "90 min", type: "video" },
        { id: 20, title: "Gerando Posts", duration: "90 min", type: "video" },
        { id: 21, title: "Gerenciando Relacionamento com o Cliente", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Cursor",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 4,
      title: "Flowlabs",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 5,
      title: "ElevenLabs",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    },
    {
      id: 6,
      title: "HatchCanvas",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Domine o futuro",
        description: "Inteligência Artificial é a tecnologia que está revolucionando todos os setores"
      },
      {
        icon: "TrendUp",
        title: "Multiplique produtividade",
        description: "Automatize tarefas e aumente eficiência com ferramentas de IA avançadas"
      },
      {
        icon: "Users",
        title: "Diferencial competitivo",
        description: "Profissionais com IA ganham 300% mais e têm acesso às melhores oportunidades"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos IA",
        description: "Domine conceitos básicos, prompts e ferramentas essenciais",
        icon: "House"
      },
      {
        number: 2,
        title: "IA nos Negócios",
        description: "Aplique IA estrategicamente para crescimento empresarial",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Ferramentas Avançadas",
        description: "Cursor, Flowlabs, ElevenLabs e HatchCanvas em desenvolvimento",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Especialização",
        description: "Torne-se especialista em IA e lidere a transformação digital",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "IA Fundamentos: base sólida em inteligência artificial",
    "IA for Business: aplicação empresarial estratégica",
    "Cursor: em desenvolvimento",
    "Flowlabs: em desenvolvimento",
    "ElevenLabs: em desenvolvimento",
    "HatchCanvas: em desenvolvimento",
    "Prompt Engineering e criação de conteúdo",
    "Integração de IA com negócios",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Projetos práticos com IA",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows, Mac ou Linux",
    "Conexão estável com internet de alta velocidade",
    "Conta Google para integrações",
    "Inglês básico (interface das ferramentas)",
    "Criatividade e vontade de inovar"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 497,
    discount: 38,
    installments: {
      max: 12,
      value: 49.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "AI Innovation Team",
    bio: "Equipe especializada em Inteligência Artificial com experiência em desenvolvimento de soluções criativas e aplicações empresariais. Experts em ferramentas de IA emergentes.",
    photo: "/instructors/team-ia.jpg",
    experience: "6+ anos",
    credentials: [
      "Especialização em Machine Learning",
      "Experiência com ferramentas de IA generativa",
      "Projetos em empresas de tecnologia",
      "Formação em Ciência de Dados"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Leonardo Costa",
      role: "Creator de Conteúdo",
      photo: "/testimonials/leonardo-costa.jpg",
      rating: 5,
      text: "Fiz presencial e foi sensacional! Com IA criei conteúdo automaticamente e aumentei 500% minha produtividade.",
      result: "Produtividade +500%"
    },
    {
      id: 2,
      name: "Fernanda Oliveira",
      role: "Agência Digital",
      photo: "/testimonials/fernanda-oliveira.jpg",
      rating: 5,
      text: "Optei pelo online e minha agência oferece serviços IA! Triplicou o faturamento em 6 meses.",
      result: "Faturamento x3 em 6 meses"
    },
    {
      id: 3,
      name: "Carlos Mendes",
      role: "Consultor IA",
      photo: "/testimonials/carlos-mendes.jpg",
      rating: 5,
      text: "Com as apostilas sempre comigo, me especializei em IA e ganho R$ 20.000/mês como consultor!",
      result: "Renda de R$ 20.000/mês"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso conhecimento técnico em programação?",
      answer: "Não! As ferramentas são visuais e intuitivas. Ensinamos tudo do zero, focado no uso prático das IAs disponíveis."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso dos módulos disponíveis incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Quando os módulos em desenvolvimento estarão prontos?",
      answer: "Cursor, Flowlabs, ElevenLabs e HatchCanvas estão sendo desenvolvidos. O conteúdo será liberado conforme finalizado pela equipe."
    }
  ],
  themeColors: {
    primary: "#673AB7",
    secondary: "#9C27B0",
    accent: "#E1BEE7",
    gradient: {
      from: "#673AB7",
      to: "#9C27B0"
    }
  },
  seoMeta: {
    title: "Curso Inteligência Artificial Completo - Escola Habilidade | IA Fundamentos, IA Business, Cursor, Flowlabs - Material Incluso",
    description: "Domine IA completa. 6 módulos: IA Fundamentos, IA for Business, Cursor, Flowlabs, ElevenLabs, HatchCanvas. Apostilas inclusas, modalidades presencial e online.",
    keywords: ["inteligência artificial", "ia fundamentos", "ia business", "cursor ai", "flowlabs", "elevenlabs", "apostilas inclusas"],
    ogImage: "/og-images/inteligencia-artificial.jpg",
    ogType: "website"
  }
};
const businessIntelligence = {
  basicInfo: {
    id: "business-intelligence-006",
    title: "Business Intelligence",
    slug: "excel-avancado-business-intelligence",
    shortDescription: "Domine Excel Presencial, Excel Avançado, Power BI, Dashboard e IA para Business Intelligence completa.",
    longDescription: "Curso completo de Business Intelligence com Excel Presencial. Domine Excel Fundamental, Excel Avançado, Dashboard profissional, Power BI e IA para Análise. 4 módulos para transformar dados em insights estratégicos nos negócios.",
    category: "Análise de Dados",
    level: "Intermediário",
    duration: "54 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 4 módulos de BI",
      "Apostilas com fórmulas, dashboards e análises práticas",
      "Referência permanente para análise de dados",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Excel Fundamental Presencial (base para Business Intelligence)",
      description: "Excel completo do zero: planilhas, fórmulas, gráficos e análise de dados. Preparação sólida para Excel Avançado e BI. 18 aulas práticas, 27h presenciais.",
      duration: "27 horas",
      note: "Mesmo conteúdo do módulo Excel Fundamental do curso de Informática",
      lessons: [
        { id: 1, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 2, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 3, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 4, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 5, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 6, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 7, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 8, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 9, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 10, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 11, title: "Funções de Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 12, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 13, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 14, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 15, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 16, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 17, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 18, title: "Configurações, Auditoria e Exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Excel Avançado Presencial (Business Intelligence Core)",
      description: "Excel avançado presencial: VBA, macros, fórmulas complexas e automação. Base essencial para Business Intelligence e Power BI. 13 aulas intensivas, 19,5h práticas.",
      duration: "19,5 horas",
      note: "Mesmo conteúdo do módulo Excel Avançado do curso de Informática",
      lessons: [
        { id: 19, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 20, title: "Funções de Texto", duration: "90 min", type: "video" },
        { id: 21, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 22, title: "Funções de Matemática/Trigonometria e Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 23, title: "Funções Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 24, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 25, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 26, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 27, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 28, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 29, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 30, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 31, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Dashboard Excel Profissional (Visualização BI)",
      description: "Dashboard Excel profissional presencial: visualizações executivas, gráficos dinâmicos e Business Intelligence visual. Projetos práticos empresariais.",
      duration: "7,5 horas",
      lessons: [
        { id: 32, title: "O que é Dashboard?", duration: "90 min", type: "video" },
        { id: 33, title: "Práticas de uso no Dashboard", duration: "90 min", type: "video" },
        { id: 34, title: "Praticando Dashboard (exercícios)", duration: "90 min", type: "exercise" },
        { id: 35, title: "Dashboard com Matrizes", duration: "90 min", type: "video" },
        { id: 36, title: "Projeto Final (Construção de um dashboard completo)", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "IA para Análise de Dados e Criação de Dashboard",
      description: "Conteúdo programático não encontrado no site Ouro Moderno",
      duration: "0 horas",
      note: "Módulo em desenvolvimento - Conteúdo programático será disponibilizado em breve",
      lessons: []
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Dados em insights",
        description: "Transforme dados brutos em insights estratégicos que geram resultados"
      },
      {
        icon: "TrendUp",
        title: "Carreira em alta",
        description: "Analistas de BI estão entre os profissionais mais valorizados do mercado"
      },
      {
        icon: "Users",
        title: "Decisões inteligentes",
        description: "Dashboards e análises que orientam decisões executivas estratégicas"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Excel Básico",
        description: "Fundamentos sólidos em planilhas e análise de dados",
        icon: "House"
      },
      {
        number: 2,
        title: "Excel Avançado",
        description: "Fórmulas complexas, VBA e automação profissional",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Dashboards",
        description: "Visualizações executivas e painéis de controle profissionais",
        icon: "Crown"
      },
      {
        number: 4,
        title: "BI Especialista",
        description: "IA para análise e especialização completa em Business Intelligence",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Excel Fundamental presencial: planilhas e análises completas",
    "Excel Avançado presencial: fórmulas complexas, VBA e macros",
    "Dashboard Excel profissional: visualizações executivas",
    "Power BI integrado: business intelligence moderna",
    "IA para Análise de dados: inteligência artificial aplicada",
    "Tabelas dinâmicas e gráficos avançados no Excel",
    "Automação e macros para otimização de processos",
    "Business Intelligence para tomada de decisão",
    "Treinamento presencial em Florianópolis e São José",
    "Material didático impresso dos 4 módulos incluso",
    "Portfolio com projetos empresariais reais",
    "Certificação profissional em Excel e BI reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11",
    "8GB de RAM mínimo (recomendado 16GB)",
    "Microsoft Excel instalado",
    "Conhecimento básico de matemática",
    "Experiência empresarial (recomendado)"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 897,
    currentPrice: 697,
    discount: 22,
    installments: {
      max: 12,
      value: 69.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Business Intelligence Experts",
    bio: "Equipe de analistas de dados sênior com experiência em transformação digital empresarial. Especialistas em Excel, Dashboard e BI aplicado aos negócios.",
    photo: "/instructors/team-bi.jpg",
    experience: "10+ anos",
    credentials: [
      "Certificação Microsoft Excel Expert",
      "Especialização em Business Intelligence",
      "Experiência em análise de dados corporativos",
      "Projetos de transformação digital"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Paula Costa",
      role: "Analista Aprendiz",
      photo: "/testimonials/paula-costa.jpg",
      rating: 5,
      text: "A didática é muito boa! O professor explica de um jeito que realmente dá vontade de continuar.",
      result: "Didática excelente"
    },
    {
      id: 2,
      name: "Heitor Barbosa",
      role: "Profissional de Dados",
      photo: "/testimonials/heitor-barbosa.jpg",
      rating: 5,
      text: "Esse curso é um divisor de águas pra quem quer crescer na área de dados.",
      result: "Divisor de águas"
    },
    {
      id: 3,
      name: "Carlos Petri",
      role: "Aluno Satisfeito",
      photo: "/testimonials/carlos-petri.jpg",
      rating: 5,
      text: "Me identifiquei muito com a forma de ensinar. Já indiquei pra dois colegas!",
      result: "Indicação para colegas"
    },
    {
      id: 4,
      name: "Vitor Santos",
      role: "Analista Recomendador",
      photo: "/testimonials/vitor-santos.jpg",
      rating: 5,
      text: "Recomendo pra qualquer pessoa que queira melhorar profissionalmente com análise de dados!",
      result: "Melhoria profissional"
    },
    {
      id: 5,
      name: "Fernanda Campos",
      role: "Analista BI Júnior",
      photo: "/testimonials/fernanda-campos.jpg",
      rating: 5,
      text: "Entrei no curso sem saber absolutamente nada de Excel. Sempre tive dificuldade com números e achava que análise de dados era só pra quem fazia TI. Mas o jeito que o conteúdo foi organizado me deu muita segurança. Hoje, faço dashboards completos, automatizo relatórios no Power BI e uso IA pra gerar apresentações de forma rápida. O curso me ajudou a conquistar uma vaga nova com aumento salarial. Gratidão eterna!",
      result: "Nova vaga com aumento"
    },
    {
      id: 6,
      name: "João Paulo",
      role: "Analista Evoluído",
      photo: "/testimonials/joao-paulo.jpg",
      rating: 5,
      text: "A estrutura do curso é muito bem pensada. As aulas são diretas, com exemplos práticos e desafios que te forçam a aprender de verdade. Em poucas semanas, saí do nível básico para conseguir montar gráficos dinâmicos, usar funções lógicas e até começar a explorar o VBA. Senti uma evolução real, e isso me motivou ainda mais a seguir nessa área de BI.",
      result: "Evolução real e motivação"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Preciso conhecimento prévio em Excel para o curso de Business Intelligence?",
      answer: "Não! Começamos do Excel Fundamental presencial e evoluímos até Excel Avançado com fórmulas complexas, VBA, Dashboard e Power BI."
    },
    {
      id: 2,
      question: "Qual a diferença entre as modalidades Presencial e Online?",
      answer: "Presencial: aulas na escola com instrutores. Online: acesso remoto com suporte. Mesmo conteúdo e apostilas em ambas."
    },
    {
      id: 3,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 4 módulos incluso sem custo adicional. Sua referência permanente!"
    },
    {
      id: 4,
      question: "Este curso é diferente de um curso de Excel comum?",
      answer: "Sim! Nós focamos em Excel para Business Intelligence: Excel Fundamental + Excel Avançado + Dashboard + Power BI + IA. É uma formação completa para análise de dados empresariais."
    },
    {
      id: 5,
      question: "Quando o módulo de IA para Análise estará disponível?",
      answer: "O módulo de IA para Análise de Dados está sendo desenvolvido com foco em aplicações práticas para Excel e BI. Conteúdo liberado em breve."
    }
  ],
  themeColors: {
    primary: "#1976D2",
    secondary: "#2196F3",
    accent: "#03DAC6",
    gradient: {
      from: "#1976D2",
      to: "#2196F3"
    }
  },
  seoMeta: {
    title: "Curso Excel Avançado e Business Intelligence - Power BI, Dashboard, IA | Presencial Florianópolis - Material Incluso",
    description: "Domine Excel Avançado presencial + Business Intelligence. 4 módulos: Excel Fundamental, Excel Avançado, Dashboard, Power BI, IA. Florianópolis e São José. Material incluso.",
    keywords: ["curso excel avançado", "excel presencial", "business intelligence", "power bi", "dashboard excel", "curso excel florianopolis", "excel e power bi", "material incluso"],
    ogImage: "/og-images/business-intelligence.jpg",
    ogType: "website"
  }
};
const projetista = {
  basicInfo: {
    id: "projetista-007",
    title: "Projetista 3D Completo",
    slug: "projetista-3d",
    shortDescription: "Formação completa em Projetista 3D com SketchUp, AutoCAD, Revit e Enscape presencial em São José SC. Do esboço ao render profissional.",
    longDescription: "Curso Projetista 3D presencial completo: SketchUp + AutoCAD + Revit + Enscape. Única escola em SC com formação integrada em todas as ferramentas do projetista moderno. 94 horas práticas.",
    category: "Arquitetura & Design",
    level: "Intermediário",
    duration: "94 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 2 módulos",
      "Apostilas com projetos práticos e exercícios",
      "Referência permanente para consulta profissional",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores certificados internacionalmente"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  // ✅ Por que presencial? - Diferencial competitivo
  whyPresencial: {
    title: "Por que Escolher o Curso Presencial?",
    subtitle: "Único curso SketchUp + Enscape presencial em Santa Catarina",
    benefits: [
      {
        icon: "users",
        title: "Turmas Pequenas",
        description: "Máximo 3 alunos por turma garantem atenção personalizada do professor."
      },
      {
        icon: "handshake",
        title: "Suporte Imediato",
        description: "Professor ao seu lado para tirar dúvidas na hora e corrigir erros em tempo real."
      },
      {
        icon: "network",
        title: "Networking Local",
        description: "Conheça outros profissionais de SC e forme sua rede de contatos na área."
      },
      {
        icon: "computer",
        title: "Equipamentos Profissionais",
        description: "Use computadores com placas de vídeo dedicadas para Enscape sem limitações."
      },
      {
        icon: "certificate",
        title: "Certificado Presencial",
        description: "Certificado nacional com diferencial de curso presencial reconhecido pelo mercado."
      },
      {
        icon: "location",
        title: "Localização Estratégica",
        description: "São José - SC, no coração da Grande Florianópolis, fácil acesso da região."
      }
    ]
  },
  curriculum: [
    {
      id: 1,
      title: "SketchUp",
      description: "Modelagem 3D profissional para arquitetura e design",
      duration: "40 horas",
      lessons: [
        { id: 1, title: "Fundamentos do SketchUp", duration: "120 min", type: "video" },
        { id: 2, title: "Modificadores e Geometrias", duration: "120 min", type: "video" },
        { id: 3, title: "Projeto Guiado – Volume Simples", duration: "120 min", type: "project" },
        { id: 4, title: "Grupos e Componentes", duration: "120 min", type: "video" },
        { id: 5, title: "Manipulação Avançada de Geometrias", duration: "120 min", type: "video" },
        { id: 6, title: "Eixos e Superfícies Inclinadas", duration: "120 min", type: "video" },
        { id: 7, title: "Projeto Guiado – Elementos Arquitetônicos", duration: "120 min", type: "project" },
        { id: 8, title: "Materiais e Texturas", duration: "120 min", type: "video" },
        { id: 9, title: "Ferramenta Siga-me (Follow Me)", duration: "120 min", type: "video" },
        { id: 10, title: "Sandbox e Terrenos", duration: "120 min", type: "video" },
        { id: 11, title: "Vetorização e Logotipos 3D", duration: "120 min", type: "video" },
        { id: 12, title: "Ferramentas de Sólidos", duration: "120 min", type: "video" },
        { id: 13, title: "Importação de Arquivos CAD", duration: "120 min", type: "video" },
        { id: 14, title: "Introdução ao Layout do SketchUp", duration: "120 min", type: "video" },
        { id: 15, title: "Documentação Técnica com Layout", duration: "120 min", type: "video" },
        { id: 16, title: "Plugins Essenciais", duration: "120 min", type: "video" },
        { id: 17, title: "Componentes Dinâmicos I", duration: "120 min", type: "video" },
        { id: 18, title: "Projeto Guiado – Interiores Residenciais", duration: "120 min", type: "project" },
        { id: 19, title: "Projeto Guiado – Fachada com Terreno", duration: "120 min", type: "project" },
        { id: 20, title: "Layout Final do Projeto Completo", duration: "120 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Enscape",
      description: "Renderização em tempo real e realidade virtual com IA",
      duration: "16 horas",
      lessons: [
        { id: 1, title: "Introdução ao Enscape e Configuração Inicial", label: "Renderização", duration: "120 min", type: "video" },
        { id: 2, title: "Iluminação Natural e Artificial", label: "Renderização", duration: "120 min", type: "video" },
        { id: 3, title: "Materiais e Texturização no Enscape", label: "Renderização", duration: "120 min", type: "video" },
        { id: 4, title: "Câmeras e Enquadramentos Profissionais", label: "Renderização", duration: "120 min", type: "video" },
        { id: 5, title: "Configurações de Render e Qualidade", label: "Renderização", duration: "120 min", type: "video" },
        { id: 6, title: "Animações e Vídeos com Enscape", label: "Renderização", duration: "120 min", type: "video" },
        { id: 7, title: "Ambientes Externos e Vegetação", label: "Renderização", duration: "120 min", type: "video" },
        { id: 8, title: "Projeto Guiado Completo com Enscape", label: "Projeto", duration: "120 min", type: "project" }
      ]
    },
    {
      id: 3,
      title: "AutoCAD 2D",
      description: "Desenho técnico profissional com aulas presenciais e projetos práticos",
      duration: "22 horas",
      lessons: [
        { id: 1, title: "Introdução ao AutoCAD 2020", duration: "60 min", type: "video" },
        { id: 2, title: "Interface de Usuário", duration: "60 min", type: "video" },
        { id: 3, title: "Formas básicas", duration: "60 min", type: "video" },
        { id: 4, title: "Formas II", duration: "60 min", type: "video" },
        { id: 5, title: "Formas III", duration: "60 min", type: "video" },
        { id: 6, title: "Snapping", duration: "60 min", type: "video" },
        { id: 7, title: "Perspectiva", duration: "60 min", type: "video" },
        { id: 8, title: "Coordenadas dinâmicas e absolutas", duration: "60 min", type: "video" },
        { id: 9, title: "Revisão: Perspectiva", duration: "60 min", type: "video" },
        { id: 10, title: "Edições de formas I", duration: "60 min", type: "video" },
        { id: 11, title: "Edições de formas II", duration: "60 min", type: "video" },
        { id: 12, title: "Edição de formas: Revisão", duration: "60 min", type: "video" },
        { id: 13, title: "Paramétrico", duration: "60 min", type: "video" },
        { id: 14, title: "Blocos", duration: "60 min", type: "video" },
        { id: 15, title: "Organizando Objetos", duration: "60 min", type: "video" },
        { id: 16, title: "Layers", duration: "60 min", type: "video" },
        { id: 17, title: "Propriedades e Hachuras", duration: "60 min", type: "video" },
        { id: 18, title: "Menu Anotação: Texto", duration: "60 min", type: "video" },
        { id: 19, title: "Menu Anotação: Cotas", duration: "60 min", type: "video" },
        { id: 20, title: "Customização", duration: "60 min", type: "video" },
        { id: 21, title: "Projeto: Parte 1", duration: "60 min", type: "project" },
        { id: 22, title: "Projeto: Parte 2", duration: "60 min", type: "project" }
      ]
    },
    {
      id: 4,
      title: "Revit",
      description: "BIM (Building Information Modeling) com aulas presenciais, projetos reais",
      duration: "16 horas",
      lessons: [
        { id: 1, title: "Conhecendo o Revit", duration: "60 min", type: "video" },
        { id: 2, title: "Primeiras configurações", duration: "60 min", type: "video" },
        { id: 3, title: "Aprendendo sobre paredes", duration: "60 min", type: "video" },
        { id: 4, title: "Aprendendo sobre pisos", duration: "60 min", type: "video" },
        { id: 5, title: "Aprendendo sobre janelas e portas", duration: "60 min", type: "video" },
        { id: 6, title: "Aprendendo sobre forros e telhados", duration: "60 min", type: "video" },
        { id: 7, title: "Aprendendo sobre componentes", duration: "60 min", type: "video" },
        { id: 8, title: "Aprendendo sobre componentes parte 2", duration: "60 min", type: "video" },
        { id: 9, title: "Criando materiais de pisos", duration: "60 min", type: "video" },
        { id: 10, title: "Criando materiais de telhado", duration: "60 min", type: "video" },
        { id: 11, title: "Configurando o terreno", duration: "60 min", type: "video" },
        { id: 12, title: "Configurando o terreno parte 2", duration: "60 min", type: "video" },
        { id: 13, title: "Finalizando o terreno e iniciando a estrutura", duration: "60 min", type: "video" },
        { id: 14, title: "Documentando o projeto", duration: "60 min", type: "video" },
        { id: 15, title: "Preparando pranchas", duration: "60 min", type: "video" },
        { id: 16, title: "Renderizando o projeto", duration: "60 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Projetos profissionais",
        description: "Crie projetos arquitetônicos 3D com padrão internacional de qualidade"
      },
      {
        icon: "TrendUp",
        title: "Mercado em crescimento",
        description: "Arquitetura e design 3D são áreas em expansão com alta demanda"
      },
      {
        icon: "Users",
        title: "Destaque no mercado",
        description: "Projetos com IA e renderização realista impressionam clientes"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "SketchUp Pro",
        description: "Modelagem 3D profissional e documentação técnica",
        icon: "House"
      },
      {
        number: 2,
        title: "AutoCAD 2D",
        description: "Desenho técnico, blocos e documentação ABNT",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Revit BIM",
        description: "Projetos paramétricos e Building Information Modeling",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Enscape Render",
        description: "Renderização em tempo real com inteligência artificial",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "SketchUp Pro: modelagem 3D profissional e Layout técnico",
    "AutoCAD 2D: desenho técnico, blocos e documentação ABNT",
    "Revit: BIM (Building Information Modeling) e projetos paramétricos",
    "Enscape: renderização em tempo real com inteligência artificial",
    "Workflow integrado: do esboço 2D ao render fotorrealístico",
    "Criação de projetos arquitetônicos completos",
    "Materiais, texturas e iluminação profissional",
    "Componentes dinâmicos e bibliotecas BIM",
    "Animações, vídeos walkthrough e panoramas 360°",
    "Documentação técnica e apresentações para clientes",
    "Portfólio com projetos reais multi-ferramenta",
    "Certificação profissional reconhecida pelo mercado"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "8GB de RAM (recomendado 16GB)",
    "Placa de vídeo dedicada (recomendado)",
    "SketchUp Pro (orientações de licenciamento)",
    "AutoCAD (orientações de licenciamento)",
    "Revit (orientações de licenciamento)",
    "Enscape (orientações de licenciamento)",
    "Conhecimento básico de desenho técnico (desejável)"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1897,
    currentPrice: 1497,
    discount: 21,
    installments: {
      max: 12,
      value: 149.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Architecture Pro Team",
    bio: "Equipe especializada em projetos arquitetônicos com certificações internacionais em SketchUp, AutoCAD, Revit e Enscape. Experiência em escritórios de arquitetura e projetos BIM.",
    photo: "/instructors/team-projetista.jpg",
    experience: "15+ anos",
    credentials: [
      "Certificação SketchUp Pro Internacional",
      "AutoCAD Certified Professional",
      "Autodesk Revit Architecture Specialist",
      "Enscape Certified Professional",
      "Experiência em escritórios de arquitetura",
      "Projetos BIM premiados em concursos nacionais"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Juliana Marques",
      role: "Projetista",
      photo: "/testimonials/juliana-marques.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou adorando o curso de Projetista na Escola Habilidade! O professor explica tudo de um jeito fácil e traz exemplos reais que fazem toda a diferença. Sinto que evoluí bastante desde que comecei.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 2,
      name: "Carlos Eduardo Oliveira",
      role: "Projetista",
      photo: "/testimonials/carlos-eduardo-oliveira.jpg",
      // Placeholder image
      rating: 5,
      text: "O curso está sendo ótimo. Aulas práticas, dinâmicas e professor super atencioso. Já estou conseguindo aplicar no meu trabalho tudo que aprendo aqui.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 3,
      name: "Amanda Cristina Silva",
      role: "Projetista",
      photo: "/testimonials/amanda-cristina-silva.jpg",
      // Placeholder image
      rating: 5,
      text: "Gostei muito das aulas de SketchUp e Enscape! O ambiente da Escola Habilidade é super acolhedor, e as atividades são bem organizadas, tornando o aprendizado mais leve.",
      location: "São José - SC",
      date: "jan. de 2025"
    },
    {
      id: 4,
      name: "Rodrigo dos Santos Pereira",
      role: "Projetista",
      photo: "/testimonials/rodrigo-dos-santos-pereira.jpg",
      // Placeholder image
      rating: 5,
      text: "Excelente curso, professor super experiente e com bastante conhecimento de mercado. Já consegui evoluir bastante na parte prática e me sinto mais preparado para projetos reais.",
      location: "São José - SC",
      date: "dez. de 2024"
    },
    {
      id: 5,
      name: "Bruna Almeida",
      role: "Projetista",
      photo: "/testimonials/bruna-almeida.jpg",
      // Placeholder image
      rating: 5,
      text: "Estou tendo uma ótima experiência com o curso. A parte prática é muito bem feita, o professor sempre incentiva a criatividade e a aplicação dos conceitos em situações reais.",
      location: "São José - SC",
      date: "nov. de 2024"
    },
    {
      id: 6,
      name: "Thiago Henrique Lopes",
      role: "Projetista",
      photo: "/testimonials/thiago-henrique-lopes.jpg",
      // Placeholder image
      rating: 5,
      text: "Curso presencial muito bom, com aulas bem organizadas. Adorei como o professor relaciona tudo com o dia a dia do projetista. Me sinto mais seguro a cada aula.",
      location: "São José - SC",
      date: "dez. de 2024"
    }
  ],
  // ✅ Enhanced Content Sections - Seções deep-dive por ferramenta
  enhancedSections: {
    sketchup: {
      id: "sketchup",
      title: "SketchUp Pro: Modelagem 3D Intuitiva e Profissional",
      subtitle: "A ferramenta mais popular para modelagem 3D arquitetônica",
      description: "SketchUp Pro é o software de modelagem 3D mais intuitivo e amplamente usado por arquitetos, designers e projetistas em todo o mundo. Com sua interface simples e ferramentas poderosas, permite criar desde conceitos iniciais até projetos técnicos completos com documentação profissional.",
      keyFeatures: [
        "Interface intuitiva de arrastar e empurrar",
        "Biblioteca 3D Warehouse com milhões de componentes",
        "LayOut para documentação técnica e pranchas",
        "Plugins e extensões para produtividade",
        "Integração com ferramentas BIM e CAD",
        "Suporte para realidade virtual e aumentada"
      ],
      professionalUse: [
        "Concepção e desenvolvimento de projetos arquitetônicos",
        "Criação de maquetes eletrônicas e estudos volumétricos",
        "Desenvolvimento de projetos de interiores e mobiliário",
        "Paisagismo e planejamento urbano",
        "Projetos de reforma e retrofitting",
        "Apresentações para clientes e aprovações"
      ],
      localApplications: [
        "Projetos residenciais em condomínios de Florianópolis",
        "Reformas de apartamentos no centro de São José",
        "Projetos comerciais na região da Grande Florianópolis",
        "Paisagismo para residências de Palhoça",
        "Projetos de pousadas e estabelecimentos turísticos em SC"
      ],
      careerOpportunities: [
        "Projetista 3D em escritórios de arquitetura",
        "Designer de interiores freelancer",
        "Consultor em modelagem 3D",
        "Especialista em visualização arquitetônica",
        "Instrutor de SketchUp e softwares 3D"
      ]
    },
    autocad: {
      id: "autocad",
      title: "AutoCAD 2D: Desenho Técnico e Documentação Profissional",
      subtitle: "O padrão internacional para projetos técnicos bidimensionais",
      description: "AutoCAD é o software líder mundial em desenho técnico 2D, com aulas presenciais e exercícios práticos. Essencial para documentação técnica, plantas baixas, cortes, fachadas e detalhamentos que seguem normas ABNT e internacionais, garantindo precisão milimétrica em todos os projetos.",
      keyFeatures: [
        "Precisão dimensional absoluta com coordenadas",
        "Ferramentas de desenho técnico padronizadas",
        "Layers organizados para diferentes disciplinas",
        "Blocos dinâmicos e bibliotecas personalizadas",
        "Cotas automáticas e anotações técnicas",
        "Compatibilidade universal com fornecedores e órgãos"
      ],
      professionalUse: [
        "Plantas baixas técnicas com precisão milimétrica",
        "Cortes, fachadas e detalhes construtivos",
        "Projetos elétricos, hidráulicos e estruturais",
        "Layouts de fabricação e montagem industrial",
        "Desenhos para aprovação em prefeituras",
        "Documentação técnica para execução de obras"
      ],
      localApplications: [
        "Aprovações de projetos na Prefeitura de Florianópolis",
        "Documentação técnica para construtoras de São José",
        "Projetos de reforma seguindo código de obras de Palhoça",
        "Plantas para licenciamento ambiental em SC",
        "Desenhos técnicos para indústria metal-mecânica da região"
      ],
      careerOpportunities: [
        "Desenhista técnico em construtoras",
        "Projetista em escritórios de engenharia",
        "Especialista em aprovações e licenças",
        "Freelancer em projetos técnicos",
        "Consultor em padronização de desenhos"
      ]
    },
    revit: {
      id: "revit",
      title: "Revit: BIM e Projetos Paramétricos Inteligentes",
      subtitle: "Building Information Modeling para projetos colaborativos",
      description: "Revit representa a evolução do desenho técnico para o BIM (Building Information Modeling), com aulas presenciais e projetos reais. Criamos projetos paramétricos inteligentes onde cada elemento possui informações completas. Permite colaboração multidisciplinar, detecção automática de interferências e geração de documentação técnica atualizada em tempo real.",
      keyFeatures: [
        "Modelagem paramétrica inteligente",
        "Famílias BIM com informações completas",
        "Colaboração multidisciplinar em tempo real",
        "Detecção automática de interferências",
        "Quantitativos automáticos e orçamento",
        "Integração com análise energética e estrutural"
      ],
      professionalUse: [
        "Projetos BIM integrados multidisciplinares",
        "Coordenação entre arquitetura, estrutura e instalações",
        "Quantitativos automáticos para orçamento",
        "Simulações energéticas e sustentabilidade",
        "Projetos para construção industrializada",
        "Facility management pós-obra"
      ],
      localApplications: [
        "Grandes empreendimentos residenciais em Florianópolis",
        "Projetos comerciais com certificação sustentável",
        "Hospitais e edifícios públicos complexos em SC",
        "Retrofit de edifícios históricos do centro",
        "Projetos industriais com integração 4.0"
      ],
      careerOpportunities: [
        "Especialista BIM em grandes construtoras",
        "Coordenador de projetos multidisciplinares",
        "Consultor em implementação BIM",
        "Projetista sênior com foco em sustentabilidade",
        "Gerente de projetos complexos"
      ]
    },
    enscape: {
      id: "enscape",
      title: "Enscape: Renderização em Tempo Real e Realidade Virtual",
      subtitle: "Visualização fotorrealística instantânea e realidade virtual",
      description: "Enscape revolucionou a visualização arquitetônica ao oferecer renderização em tempo real diretamente dentro do SketchUp e Revit. Aprenda renderizações ultra realistas, vídeos renderizados, imagens 360° e uso de óculos 360° para apresentações imersivas e experiencias de realidade virtual.",
      keyFeatures: [
        "Renderizações ultra realistas em tempo real",
        "Vídeos renderizados para apresentações dinâmicas",
        "Imagens 360° para exploração interativa",
        "Uso de óculos VR para experiências imersivas",
        "Materiais PBR fotorrealísticos",
        "Biblioteca de objetos e vegetação realística"
      ],
      professionalUse: [
        "Apresentações instantâneas para clientes",
        "Vídeos promocionais para marketing imobiliário",
        "Realidade virtual para vendas antecipadas",
        "Estudos de iluminação natural e artificial",
        "Validação de projetos antes da execução",
        "Portfolio profissional de alta qualidade"
      ],
      localApplications: [
        "Renders para construtoras de Florianópolis",
        "VR tours para imobiliárias da Grande Floripa",
        "Visualizações para aprovação de clientes em São José",
        "Marketing digital para arquitetos de Palhoça",
        "Apresentações para investidores imobiliários"
      ],
      careerOpportunities: [
        "Especialista em visualização arquitetônica",
        "Artista 3D freelancer",
        "Coordenador de marketing visual",
        "Consultor em realidade virtual",
        "Diretor de arte para construtoras"
      ]
    }
  },
  // ✅ Workflow Integration Examples
  workflowExamples: {
    residential: {
      title: "Projeto Residencial Completo",
      description: "Workflow integrado do conceito inicial ao marketing final",
      steps: [
        {
          tool: "AutoCAD 2D",
          description: "Levantamento topográfico e plantas técnicas base",
          deliverable: "Plantas baixas precisas com cotas e especificações"
        },
        {
          tool: "SketchUp Pro",
          description: "Modelagem 3D volumétrica e estudos de implantação",
          deliverable: "Maquete 3D com terreno e contexto urbano"
        },
        {
          tool: "Revit",
          description: "Detalhamento BIM com informações construtivas",
          deliverable: "Projeto executivo com quantitativos automáticos"
        },
        {
          tool: "Enscape",
          description: "Renderização e realidade virtual para apresentação",
          deliverable: "Imagens fotorrealísticas e tour virtual 360°"
        }
      ],
      result: "Projeto completo desde aprovação até marketing, com toda documentação técnica e apresentação profissional para clientes e investidores."
    },
    commercial: {
      title: "Espaço Comercial Multidisciplinar",
      description: "Coordenação BIM completa com todas as disciplinas",
      steps: [
        {
          tool: "AutoCAD 2D",
          description: "Layout funcional e zoneamento de atividades",
          deliverable: "Plantas de layout com fluxos e dimensionamento"
        },
        {
          tool: "Revit",
          description: "Coordenação entre arquitetura, estrutura e MEP",
          deliverable: "Modelo BIM integrado sem interferências"
        },
        {
          tool: "SketchUp Pro",
          description: "Estudos de ambientação e mobiliário customizado",
          deliverable: "Modelo 3D com mobiliário e identidade visual"
        },
        {
          tool: "Enscape",
          description: "Apresentação imersiva para aprovação e marketing",
          deliverable: "Walkthrough interativo e imagens promocionais"
        }
      ],
      result: "Projeto comercial coordenado com todas as disciplinas, apresentação profissional e documentação completa para execução."
    }
  },
  // ✅ Tool Comparison Guide
  toolComparisons: [
    {
      scenario: "Projeto inicial e conceituação",
      recommendation: "SketchUp Pro",
      reason: "Interface intuitiva permite explorar rapidamente diferentes soluções volumétricas e conceituais."
    },
    {
      scenario: "Documentação técnica e aprovações",
      recommendation: "AutoCAD 2D",
      reason: "Precisão dimensional e compatibilidade universal com órgãos aprovadores e normas ABNT."
    },
    {
      scenario: "Projetos complexos multidisciplinares",
      recommendation: "Revit",
      reason: "BIM permite coordenação entre disciplinas, detecção de conflitos e informações completas."
    },
    {
      scenario: "Apresentação para clientes",
      recommendation: "Enscape",
      reason: "Renderização instantânea e realidade virtual criam apresentações impactantes e convincentes."
    },
    {
      scenario: "Projetos pequenos e médios",
      recommendation: "SketchUp + AutoCAD",
      reason: "Combinação ideal: agilidade na concepção 3D e precisão na documentação técnica."
    },
    {
      scenario: "Grandes empreendimentos",
      recommendation: "Revit + Enscape",
      reason: "BIM para coordenação complexa e Enscape para marketing e aprovações de investidores."
    }
  ],
  // ✅ Regional Professional Network
  regionalNetwork: {
    title: "Rede Profissional Grande Florianópolis",
    subtitle: "Conecte-se com o mercado local de arquitetura e construção",
    description: "Nossa escola mantém conexões ativas com escritórios de arquitetura, construtoras e profissionais liberais da Grande Florianópolis, criando oportunidades de networking e inserção no mercado.",
    partners: [
      {
        type: "Escritórios de Arquitetura",
        examples: ["Arquitetos em Florianópolis", "Estúdios de Design em São José", "Escritórios Integrados em Palhoça"],
        opportunities: "Estágios, vagas júnior, projetos freelance"
      },
      {
        type: "Construtoras e Incorporadoras",
        examples: ["Grandes construtoras da capital", "Incorporadoras regionais", "Construtoras especializadas"],
        opportunities: "Vagas em compatibilização, coordenação BIM, visualização"
      },
      {
        type: "Profissionais Liberais",
        examples: ["Arquitetos autônomos", "Designers freelancers", "Consultores BIM"],
        opportunities: "Parcerias, terceirizações, mentorias"
      }
    ],
    events: [
      "Meetups mensais de profissionais 3D",
      "Workshops com escritórios parceiros",
      "Palestras sobre mercado imobiliário local",
      "Networking events pós-curso"
    ],
    marketInsights: [
      "Tendências do mercado imobiliário catarinense",
      "Oportunidades em projetos sustentáveis",
      "Demanda por profissionais BIM em SC",
      "Freelancing vs CLT: cenário local",
      "Precificação de projetos na região"
    ]
  },
  faq: [
    {
      id: 1,
      question: "Quanto tempo leva para dominar todas as ferramentas do projetista?",
      answer: "No nosso curso presencial de 94 horas, você aprende SketchUp, AutoCAD, Revit e Enscape desde o básico até projetos profissionais. Workflow completo: do esboço 2D ao render fotorrealístico profissional."
    },
    {
      id: 2,
      question: "Por que fazer o curso completo ao invés de ferramentas separadas?",
      answer: "O diferencial é o workflow integrado: aprenda como SketchUp, AutoCAD, Revit e Enscape trabalham juntos em projetos reais. Economiza tempo e garante conhecimento prático de como as ferramentas se complementam profissionalmente."
    },
    {
      id: 3,
      question: "Como funciona renderização com Enscape e inteligência artificial?",
      answer: "O Enscape renderiza projetos SketchUp em tempo real (segundos vs horas). Aprenda renderizações ultra realistas, vídeos renderizados, imagens 360° e uso de óculos VR para apresentações imersivas."
    },
    {
      id: 4,
      question: "Preciso saber AutoCAD para fazer curso de projetista 3D?",
      answer: "Não é obrigatório. O SketchUp é mais intuitivo que AutoCAD para modelagem 3D. Começamos do zero e em 56 horas você estará criando projetos arquitetônicos completos."
    },
    {
      id: 5,
      question: "Quanto ganha um projetista 3D em Santa Catarina?",
      answer: "Projetistas 3D em SC ganham entre R$ 2.500-6.000. Com SketchUp + Enscape, profissionais freelancers cobram R$ 150-300 por projeto renderizado. Nosso curso prepara você para esse mercado."
    },
    {
      id: 6,
      question: "Existe curso SketchUp certificado em Florianópolis?",
      answer: "Sim! Nossa escola em São José (Grande Florianópolis) oferece certificado nacional reconhecido. Somos a única escola em SC com curso presencial de SketchUp + Enscape."
    },
    {
      id: 7,
      question: "Posso trabalhar como projetista freelancer após o curso?",
      answer: "Absolutamente! Ensinamos desde modelagem até precificação de projetos. Muitos alunos começam freelances ainda durante o curso. O mercado de projetos 3D está aquecido em SC."
    },
    {
      id: 8,
      question: "O que está incluído no curso projetista 3D completo?",
      answer: "94 horas de aulas práticas, material didático completo de 4 módulos, certificado nacional, suporte pós-curso e acesso aos softwares SketchUp Pro, AutoCAD, Revit e Enscape durante as aulas."
    }
  ],
  themeColors: {
    primary: "#FF6B35",
    secondary: "#F7931E",
    accent: "#FFD23F",
    gradient: {
      from: "#FF6B35",
      to: "#F7931E"
    }
  },
  seoMeta: {
    title: "Curso Projetista 3D Completo São José SC | SketchUp AutoCAD Revit Enscape | Escola Habilidade",
    description: "Formação Completa Projetista 3D: SketchUp + AutoCAD + Revit + Enscape em São José SC. 94h presenciais, do esboço ao render. Certificado reconhecido.",
    keywords: ["curso projetista 3d", "curso sketchup", "curso autocad", "curso revit", "curso enscape", "projetista 3d são josé", "sketchup autocad revit", "formação completa projetista", "curso bim santa catarina"],
    ogImage: "/og-images/projetista-3d.jpg",
    ogType: "website"
  }
};
const edicaoVideo = {
  basicInfo: {
    id: "edicao-video-008",
    title: "Edição de Vídeo",
    slug: "edicao-video",
    shortDescription: "Domine Adobe Premiere Pro CC e After Effects CC para criar vídeos profissionais e motion graphics.",
    longDescription: "Aprenda edição de vídeo profissional do zero ao avançado. Domine Adobe Premiere Pro CC e After Effects CC para se tornar um editor completo e requisitado no mercado audiovisual.",
    category: "Audiovisual",
    level: "Intermediário",
    duration: "48 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso dos 2 módulos",
      "Apostilas com projetos práticos e exercícios",
      "Referência permanente para consulta profissional",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Adobe Premiere Pro CC",
      description: "Edição profissional de vídeos com o software líder do mercado",
      duration: "27 horas",
      lessons: [
        { id: 1, title: "Introdução ao programa", duration: "90 min", type: "video" },
        { id: 2, title: "Ferramentas básicas de edição", duration: "90 min", type: "video" },
        { id: 3, title: "Transições de vídeo e adicionando texto", duration: "90 min", type: "video" },
        { id: 4, title: "Transição Swish e Keyframes", duration: "90 min", type: "video" },
        { id: 5, title: "Efeitos de vídeo", duration: "90 min", type: "video" },
        { id: 6, title: "Transição RGB, Transições e Efeitos de áudio", duration: "90 min", type: "video" },
        { id: 7, title: "Animação", duration: "90 min", type: "video" },
        { id: 8, title: "Criando Lower Thirds (redes sociais e nome)", duration: "90 min", type: "video" },
        { id: 9, title: "Criar intro para os vídeos", duration: "90 min", type: "video" },
        { id: 10, title: "Frame Hold e bordas desfocadas", duration: "90 min", type: "video" },
        { id: 11, title: "Smooth Transitions e Glitchs", duration: "90 min", type: "video" },
        { id: 12, title: "Vídeo em preto e branco e efeito Fisheye", duration: "90 min", type: "video" },
        { id: 13, title: "Transição usando pessoas e acelerar, desacelerar e reverter vídeos", duration: "90 min", type: "video" },
        { id: 14, title: "Efeito Flash", duration: "90 min", type: "video" },
        { id: 15, title: "Efeito mágica", duration: "90 min", type: "video" },
        { id: 16, title: "Correção de cor, predefinições e adicionando Luts", duration: "90 min", type: "video" },
        { id: 17, title: "Adicionar créditos a partir de gráficos essenciais", duration: "90 min", type: "video" },
        { id: 18, title: "Renderizar projeto", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 2,
      title: "Adobe After Effects CC",
      description: "Motion graphics e efeitos visuais cinematográficos",
      duration: "21 horas",
      lessons: [
        { id: 19, title: "Workspace e Composições", duration: "90 min", type: "video" },
        { id: 20, title: "Background e Composição", duration: "90 min", type: "video" },
        { id: 21, title: "Máscara", duration: "90 min", type: "video" },
        { id: 22, title: "Correção de cores", duration: "90 min", type: "video" },
        { id: 23, title: "Controles de câmera", duration: "90 min", type: "video" },
        { id: 24, title: "Sincronização e efeitos de áudio", duration: "90 min", type: "video" },
        { id: 25, title: "Efeitos", duration: "90 min", type: "video" },
        { id: 26, title: "Efeito de revelação de texto", duration: "90 min", type: "video" },
        { id: 27, title: "Finalizando o projeto e renderizando", duration: "90 min", type: "video" },
        { id: 28, title: "Processo de sincronização de vídeos", duration: "90 min", type: "video" },
        { id: 29, title: "Transição suave (Zoom)", duration: "90 min", type: "video" },
        { id: 30, title: "Editor gráfico de efeitos", duration: "90 min", type: "video" },
        { id: 31, title: "Transições e Ancoragem", duration: "90 min", type: "video" },
        { id: 32, title: "Projeto Final", duration: "90 min", type: "project" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Vídeos profissionais",
        description: "Crie vídeos cinematográficos e motion graphics de padrão internacional"
      },
      {
        icon: "TrendUp",
        title: "Mercado crescente",
        description: "Editores de vídeo estão entre os profissionais mais procurados"
      },
      {
        icon: "Users",
        title: "YouTube e redes sociais",
        description: "Domine criação de conteúdo para todas as plataformas digitais"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Premiere Básico",
        description: "Fundamentos de edição e ferramentas essenciais",
        icon: "House"
      },
      {
        number: 2,
        title: "Premiere Avançado",
        description: "Efeitos, transições e correção de cor profissional",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "After Effects",
        description: "Motion graphics e efeitos visuais cinematográficos",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Editor Profissional",
        description: "Portfolio completo e projetos comerciais",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Adobe Premiere Pro CC: edição profissional completa",
    "Adobe After Effects CC: motion graphics e VFX",
    "Técnicas avançadas de transições e efeitos",
    "Correção de cor e gradação cinematográfica",
    "Criação de intros, vinhetas e lower thirds",
    "Sincronização perfeita de áudio e vídeo",
    "Efeitos visuais e composição profissional",
    "Workflow otimizado para YouTube e redes sociais",
    "Renderização e exportação em múltiplos formatos",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou macOS",
    "16GB de RAM (mínimo 8GB)",
    "Placa de vídeo dedicada (recomendado)",
    "Adobe Creative Cloud (Premiere + After Effects)",
    "SSD com 100GB livres",
    "Conhecimentos básicos de informática"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 797,
    currentPrice: 447,
    discount: 44,
    installments: {
      max: 12,
      value: 44.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Mariana Costa",
    bio: "Editora de vídeo e motion designer com mais de 10 anos de experiência. Trabalhou para grandes marcas e canais do YouTube com milhões de seguidores.",
    photo: "/instructors/mariana-costa.jpg",
    experience: "10 anos",
    credentials: [
      "Especialista em Adobe Creative Suite",
      "Certificação Adobe Premiere Pro Expert",
      "Motion Designer profissional",
      "Editora oficial do YouTube Creators",
      "Mais de 1.000 vídeos editados"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Pedro Henrique Silva",
      role: "YouTuber",
      photo: "/testimonials/pedro-henrique.jpg",
      rating: 5,
      text: "Meu canal cresceu de 10K para 500K inscritos após aplicar as técnicas do curso!",
      result: "Canal com 500K inscritos"
    },
    {
      id: 2,
      name: "Isabela Rodrigues",
      role: "Editora Freelancer",
      photo: "/testimonials/isabela-rodrigues.jpg",
      rating: 5,
      text: "Me tornei freelancer e agora ganho R$ 8.000/mês editando vídeos para empresas.",
      result: "Renda de R$ 8.000/mês"
    },
    {
      id: 3,
      name: "Lucas Ferreira",
      role: "Motion Designer",
      photo: "/testimonials/lucas-ferreira.jpg",
      rating: 5,
      text: "Consegui trabalho em produtora de TV logo após terminar o curso. After Effects mudou minha vida!",
      result: "Emprego em produtora de TV"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "Quais softwares serão utilizados no curso?",
      answer: "Adobe Premiere Pro CC e After Effects CC. Orientamos sobre licenciamento e oferecemos alternativas para prática."
    },
    {
      id: 2,
      question: "Funciona para iniciantes completos em edição?",
      answer: "Sim! Começamos do absoluto zero, ensinando desde os fundamentos até edições cinematográficas profissionais."
    },
    {
      id: 3,
      question: "Vou conseguir trabalhar como editor após o curso?",
      answer: "Sim! Muitos alunos conseguem trabalho em 3-6 meses. Ensinamos portfolio, precificação e como conseguir clientes."
    },
    {
      id: 4,
      question: "O curso serve para YouTube e redes sociais?",
      answer: "Perfeitamente! Ensinamos formatos específicos para YouTube, Instagram, TikTok e outras plataformas."
    }
  ],
  themeColors: {
    primary: "#E91E63",
    secondary: "#9C27B0",
    accent: "#FF4081",
    gradient: {
      from: "#E91E63",
      to: "#9C27B0"
    }
  },
  seoMeta: {
    title: "Curso de Edição de Vídeo Florianópolis - Adobe Premiere Pro e After Effects - Escola Habilidade",
    description: "Curso profissional de edição de vídeo em Florianópolis e São José SC. Aprenda Premiere Pro CC e After Effects CC com certificado reconhecido. Material didático incluso, aulas presenciais e online.",
    keywords: ["curso edição de vídeo florianópolis", "premiere pro são josé", "after effects grande florianópolis", "curso adobe premiere", "edição profissional vídeo SC", "escola técnica audiovisual"],
    ogImage: "/og-images/edicao-video.jpg",
    ogType: "website"
  }
};
const administracao = {
  basicInfo: {
    id: "administracao-009",
    title: "Administração",
    slug: "administracao",
    shortDescription: "Curso completo de administração com Windows 11, Office completo, Matemática Financeira, Departamento Pessoal e Liderança.",
    longDescription: "Domine as ferramentas essenciais para administração moderna. Aprenda Windows 11, Office completo (Word, Excel, PowerPoint), Matemática Financeira, Departamento Pessoal, Crédito & Cobrança e Liderança Eficaz. 9 módulos completos para formação administrativa completa.",
    category: "Negócios",
    level: "Iniciante",
    duration: "153 horas",
    certificate: true,
    active: true
  },
  // ✅ Material didático incluso
  materials: {
    included: true,
    description: "Apostilas impressas completas de cada módulo",
    details: [
      "Material didático impresso de todos os 9 módulos",
      "Apostilas detalhadas com exercícios práticos",
      "Referência permanente para estudos administrativos",
      "Incluído no preço do curso sem custo adicional"
    ]
  },
  // ✅ Modalidades de ensino
  modalities: {
    presencial: {
      available: true,
      description: "Aulas presenciais na escola com instrutores especializados"
    },
    online: {
      available: true,
      description: "Acesso remoto às aulas com suporte online"
    }
  },
  curriculum: [
    {
      id: 1,
      title: "Windows 11",
      description: "Sistema operacional moderno para administração",
      duration: "18 horas",
      lessons: [
        { id: 1, title: "Introdução ao Windows 11", duration: "90 min", type: "video" },
        { id: 2, title: "Aplicativos Parte I", duration: "90 min", type: "video" },
        { id: 3, title: "Microsoft Edge", duration: "90 min", type: "video" },
        { id: 4, title: "Explorador de Arquivos Parte I", duration: "90 min", type: "video" },
        { id: 5, title: "Explorador de Arquivos Parte II", duration: "90 min", type: "video" },
        { id: 6, title: "Personalizando o Sistema", duration: "90 min", type: "video" },
        { id: 7, title: "Acessibilidade Parte I", duration: "90 min", type: "video" },
        { id: 8, title: "Aplicativos Parte II", duration: "90 min", type: "video" },
        { id: 9, title: "Aplicativos Parte III", duration: "90 min", type: "video" },
        { id: 10, title: "Aplicativos Parte IV", duration: "90 min", type: "video" },
        { id: 11, title: "Barra de Tarefas", duration: "90 min", type: "video" },
        { id: 12, title: "Acessibilidade Parte II", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 2,
      title: "Word Fundamental",
      description: "Processamento de texto para documentos administrativos",
      duration: "21 horas",
      lessons: [
        { id: 13, title: "Introdução ao word 2019", duration: "90 min", type: "video" },
        { id: 14, title: "Iniciando um documento", duration: "90 min", type: "video" },
        { id: 15, title: "Formatando texto e utilização da nova Ferramenta de Aprendizagem", duration: "90 min", type: "video" },
        { id: 16, title: "Inserção de tabelas e ícones SVGs", duration: "90 min", type: "video" },
        { id: 17, title: "Inserção de elementos gráficos I", duration: "90 min", type: "video" },
        { id: 18, title: "Inserção de elementos gráficos e imagens 3D", duration: "90 min", type: "video" },
        { id: 19, title: "Criação de estruturas de texto I", duration: "90 min", type: "video" },
        { id: 20, title: "Criação de estruturas de texto II", duration: "90 min", type: "video" },
        { id: 21, title: "Inserção de elementos de texto e nova sintaxe LaTeX", duration: "90 min", type: "video" },
        { id: 22, title: "Layout da página", duration: "90 min", type: "video" },
        { id: 23, title: "Design", duration: "90 min", type: "video" },
        { id: 24, title: "Revisão", duration: "90 min", type: "video" },
        { id: 25, title: "Armazenamento e compartilhamento", duration: "90 min", type: "video" },
        { id: 26, title: "Impressão", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 3,
      title: "Excel Fundamental",
      description: "Planilhas eletrônicas para gestão administrativa",
      duration: "27 horas",
      lessons: [
        { id: 27, title: "Introdução, Desenvolvendo a Primeira Planilha", duration: "90 min", type: "video" },
        { id: 28, title: "Formatação Básica", duration: "90 min", type: "video" },
        { id: 29, title: "Menu Revisão", duration: "90 min", type: "video" },
        { id: 30, title: "Operações Aritméticas Básicas", duration: "90 min", type: "video" },
        { id: 31, title: "Explorando Porcentagens", duration: "90 min", type: "video" },
        { id: 32, title: "Fórmulas Relativas", duration: "90 min", type: "video" },
        { id: 33, title: "Funções Comuns", duration: "90 min", type: "video" },
        { id: 34, title: "Gráficos Parte I", duration: "90 min", type: "video" },
        { id: 35, title: "Formatação Condicional", duration: "90 min", type: "video" },
        { id: 36, title: "Validação de Dados", duration: "90 min", type: "video" },
        { id: 37, title: "Funções De Pesquisas Básicas", duration: "90 min", type: "video" },
        { id: 38, title: "Funções Comuns II", duration: "90 min", type: "video" },
        { id: 39, title: "Fórmulas de texto e AutoSoma", duration: "90 min", type: "video" },
        { id: 40, title: "Funções Financeiras Básicas", duration: "90 min", type: "video" },
        { id: 41, title: "Gráficos Parte II", duration: "90 min", type: "video" },
        { id: 42, title: "Funções de Data e Hora Básicas", duration: "90 min", type: "video" },
        { id: 43, title: "Gerenciador de Nomes", duration: "90 min", type: "video" },
        { id: 44, title: "Configurações, auditoria e exibição", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 4,
      title: "Excel Avançado",
      description: "Análise avançada de dados administrativos",
      duration: "19,5 horas",
      lessons: [
        { id: 45, title: "Revisão de Fórmulas e Funções", duration: "90 min", type: "video" },
        { id: 46, title: "Funções De Texto", duration: "90 min", type: "video" },
        { id: 47, title: "Funções Lógicas", duration: "90 min", type: "video" },
        { id: 48, title: "Funções de Matemática, Trigonometria e Funções de Estatísticas – Parte 1", duration: "90 min", type: "video" },
        { id: 49, title: "Funções de Estatísticas – Parte 2", duration: "90 min", type: "video" },
        { id: 50, title: "Funções de Data e Hora", duration: "90 min", type: "video" },
        { id: 51, title: "Auditoria de Fórmulas, Teste de Hipóteses e Funções de Informações", duration: "90 min", type: "video" },
        { id: 52, title: "Funções de Pesquisa e Referência", duration: "90 min", type: "video" },
        { id: 53, title: "Tabela Dinâmica e Formatação Condicional", duration: "90 min", type: "video" },
        { id: 54, title: "Gráfico Dinâmico e Classificação de dados", duration: "90 min", type: "video" },
        { id: 55, title: "Utilizando Formulários", duration: "90 min", type: "video" },
        { id: 56, title: "Utilizando Macros e Noções de VBA", duration: "90 min", type: "video" },
        { id: 57, title: "Solver e Funções Financeiras", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 5,
      title: "Matemática Financeira",
      description: "Gestão financeira com HP12C e conceitos aplicados",
      duration: "19,5 horas",
      lessons: [
        { id: 58, title: "Introdução ao uso da HP12C", duration: "90 min", type: "video" },
        { id: 59, title: "Conhecendo a Calculadora", duration: "90 min", type: "video" },
        { id: 60, title: "Configurando a Calculadora", duration: "90 min", type: "video" },
        { id: 61, title: "Registradores, Funções e Códigos de Erros", duration: "90 min", type: "video" },
        { id: 62, title: "Introdução à Mat.Finaceira e Diagrama de Fluxo", duration: "90 min", type: "video" },
        { id: 63, title: "Juros Simples e Juros Compostos", duration: "90 min", type: "video" },
        { id: 64, title: "Séries Uniformes, Não-Uniformes e Amortização", duration: "90 min", type: "video" },
        { id: 65, title: "Taxas de Juros e Descontos", duration: "90 min", type: "video" },
        { id: 66, title: "Gestão de Custo e Formação de Preço", duration: "90 min", type: "video" },
        { id: 67, title: "Mercados Financeiros", duration: "90 min", type: "video" },
        { id: 68, title: "Estatística – I", duration: "90 min", type: "video" },
        { id: 69, title: "Estatística – II", duration: "90 min", type: "video" },
        { id: 70, title: "Noções Básicas de Contabilidade", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 6,
      title: "Power Point",
      description: "Apresentações profissionais para administração",
      duration: "18 horas",
      lessons: [
        { id: 71, title: "Introdução ao Power Point 2019", duration: "90 min", type: "video" },
        { id: 72, title: "Ferramentas", duration: "90 min", type: "video" },
        { id: 73, title: "Iniciando uma apresentação", duration: "90 min", type: "video" },
        { id: 74, title: "Texto", duration: "90 min", type: "video" },
        { id: 75, title: "Layout de slide", duration: "90 min", type: "video" },
        { id: 76, title: "Elementos gráficos I", duration: "90 min", type: "video" },
        { id: 77, title: "Elementos gráficos II", duration: "90 min", type: "video" },
        { id: 78, title: "Multimídia", duration: "90 min", type: "video" },
        { id: 79, title: "Transições", duration: "90 min", type: "video" },
        { id: 80, title: "Testes de apresentação", duration: "90 min", type: "video" },
        { id: 81, title: "Revisão", duration: "90 min", type: "video" },
        { id: 82, title: "Projeto", duration: "90 min", type: "project" }
      ]
    },
    {
      id: 7,
      title: "Departamento Pessoal",
      description: "Gestão de pessoas e folha de pagamento",
      duration: "13,5 horas",
      lessons: [
        { id: 83, title: "Conceitos Gerais", duration: "90 min", type: "video" },
        { id: 84, title: "Importância do DP", duration: "90 min", type: "video" },
        { id: 85, title: "Seguridade Social", duration: "90 min", type: "video" },
        { id: 86, title: "Remuneração", duration: "90 min", type: "video" },
        { id: 87, title: "Pagamentos e Descontos 1", duration: "90 min", type: "video" },
        { id: 88, title: "Pagamentos e Descontos 2", duration: "90 min", type: "video" },
        { id: 89, title: "Jornada de Trabalho 1", duration: "90 min", type: "video" },
        { id: 90, title: "Jornada de trabalho 2", duration: "90 min", type: "video" },
        { id: 91, title: "Rescisão de Contrato de Trabalho", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 8,
      title: "Crédito, Cobrança e Atendimento",
      description: "Gestão financeira e relacionamento com clientes",
      duration: "9 horas",
      lessons: [
        { id: 92, title: "Operações de Crédito – Financiamento", duration: "90 min", type: "video" },
        { id: 93, title: "Operações de Crédito – Empréstimos", duration: "90 min", type: "video" },
        { id: 94, title: "Análise de Crédito", duration: "90 min", type: "video" },
        { id: 95, title: "Limites de Crédito", duration: "90 min", type: "video" },
        { id: 96, title: "Políticas de Crédito e Cobrança", duration: "90 min", type: "video" },
        { id: 97, title: "Atendimento de Cobrança", duration: "90 min", type: "video" }
      ]
    },
    {
      id: 9,
      title: "Liderança Eficaz",
      description: "Desenvolvimento de competências de liderança",
      duration: "7,5 horas",
      lessons: [
        { id: 98, title: "Objetivos da Liderança", duration: "90 min", type: "video" },
        { id: 99, title: "Comunicação e Empatia", duration: "90 min", type: "video" },
        { id: 100, title: "Liderança x Chefia", duration: "90 min", type: "video" },
        { id: 101, title: "Responsabilidade pelos erros", duration: "90 min", type: "video" },
        { id: 102, title: "Delegando e formando sucessores", duration: "90 min", type: "video" }
      ]
    }
  ],
  // ✅ Novos campos para componentes
  whyStudy: {
    benefits: [
      {
        icon: "BookOpen",
        title: "Formação administrativa completa",
        description: "Do operacional ao estratégico: todas as ferramentas para administrar com excelência"
      },
      {
        icon: "TrendUp",
        title: "Mercado sempre demandando",
        description: "Administradores são essenciais em qualquer empresa - área com demanda constante"
      },
      {
        icon: "Users",
        title: "Múltiplas oportunidades",
        description: "Trabalhe em empresas, seja freelancer ou empreenda com conhecimento sólido"
      }
    ]
  },
  journey: {
    steps: [
      {
        number: 1,
        title: "Fundamentos",
        description: "Domine Windows 11 e Office para administração moderna",
        icon: "House"
      },
      {
        number: 2,
        title: "Análise",
        description: "Excel avançado e matemática financeira para decisões estratégicas",
        icon: "Wrench"
      },
      {
        number: 3,
        title: "Gestão",
        description: "Departamento pessoal, crédito & cobrança para gestão completa",
        icon: "Crown"
      },
      {
        number: 4,
        title: "Liderança",
        description: "Desenvolva competências de liderança e gerencie equipes",
        icon: "Trophy"
      }
    ]
  },
  whatYouWillLearn: [
    "Windows 11: produtividade total em administração",
    "Office completo: Word, Excel e PowerPoint profissionais",
    "Excel Fundamental e Avançado com análise de dados",
    "Matemática Financeira com HP12C",
    "Departamento Pessoal e gestão de pessoas",
    "Crédito, Cobrança e Atendimento ao cliente",
    "Liderança Eficaz e gestão de equipes",
    "Contabilidade básica e controles financeiros",
    "Apresentações executivas e relatórios",
    "Material didático impresso incluso",
    "Modalidades Presencial e Online disponíveis",
    "Certificação profissional reconhecida"
  ],
  requirements: [
    "Computador com Windows 10/11 ou superior",
    "8GB de RAM (recomendado)",
    "Conexão estável com internet",
    "Microsoft Office (orientações de licenciamento)",
    "Calculadora HP12C (orientações de aquisição)",
    "Vontade de aprender gestão administrativa"
  ],
  // ✅ DADOS DE INVESTIMENTO (OBRIGATÓRIO)
  investment: {
    originalPrice: 1197,
    currentPrice: 797,
    discount: 33,
    installments: {
      max: 12,
      value: 79.7
    },
    paymentMethods: ["Cartão de crédito", "PIX", "Boleto bancário"]
  },
  // ✅ DADOS DO INSTRUTOR (OBRIGATÓRIO)
  instructor: {
    name: "Equipe de Instrutores em Administração",
    bio: "Nossa equipe é formada por administradores, contadores e especialistas em gestão com mais de 15 anos de experiência em ensino e prática empresarial.",
    photo: "/instructors/team-administracao.jpg",
    experience: "15+ anos",
    credentials: [
      "Graduação em Administração e Contabilidade",
      "Certificação Microsoft Office Specialist",
      "Especialização em Gestão de Pessoas",
      "Experiência em Departamento Pessoal",
      "Matemática Financeira Aplicada"
    ]
  },
  testimonials: [
    {
      id: 1,
      name: "Sandra Oliveira",
      role: "Assistente Administrativa",
      photo: "/testimonials/sandra-oliveira.jpg",
      rating: 5,
      text: "Estava desempregada há 2 anos. Com o curso completo, consegui trabalho em 3 meses! O Excel avançado foi fundamental.",
      result: "Emprego em 3 meses"
    },
    {
      id: 2,
      name: "Roberto Santos",
      role: "Supervisor Administrativo",
      photo: "/testimonials/roberto-santos.jpg",
      rating: 5,
      text: "O módulo de liderança transformou minha gestão de equipe. Recebi promoção e aumento salarial de 40%.",
      result: "Promoção e 40% aumento"
    },
    {
      id: 3,
      name: "Juliana Costa",
      role: "Analista Financeira",
      photo: "/testimonials/juliana-costa.jpg",
      rating: 5,
      text: "Matemática financeira e Excel avançado me deram base para trabalhar no mercado financeiro. Hoje ganho R$ 6.000/mês.",
      result: "Renda de R$ 6.000/mês"
    },
    {
      id: 4,
      name: "Ana Caroline Barros",
      role: "Designer em Transição",
      photo: "/testimonials/ana-caroline-barros.jpg",
      rating: 5,
      text: "Sou formada em outra área e sempre quis trabalhar com design. Com esse curso, aprendi desde o Canva até a parte mais técnica como Photoshop. Me sinto finalmente no caminho certo!",
      result: "Transição de carreira"
    },
    {
      id: 5,
      name: "Camila Medeiros",
      role: "Empreendedora",
      photo: "/testimonials/camila-medeiros.jpg",
      rating: 5,
      text: "Estou abrindo meu próprio negócio e consegui criar toda a identidade visual graças ao curso. Logo, cartão, catálogo, tudo feito por mim! Isso é liberdade criativa.",
      result: "Identidade visual própria"
    },
    {
      id: 6,
      name: "Aline Silva",
      role: "Designer Aprendiz",
      photo: "/testimonials/aline-silva.jpg",
      rating: 5,
      text: "Achei que seria complicado aprender tantos softwares, mas a metodologia do curso facilita muito. Cada módulo é direto ao ponto, os professores ajudam muito nos exercícios - é realmente conhecimento e prática.",
      result: "Domínio de múltiplos softwares"
    },
    {
      id: 7,
      name: "Yasmin Camile",
      role: "Designer Criativa",
      photo: "/testimonials/yasmin-camile.jpg",
      rating: 5,
      text: "O módulo de IA foi o que mais me surpreendeu. Aprender a usar inteligência artificial no processo criativo economiza tempo e abre a mente pra novas possibilidades. É um diferencial no mercado!",
      result: "Diferencial com IA"
    },
    {
      id: 8,
      name: "Carlos Souza",
      role: "Designer Evoluído",
      photo: "/testimonials/carlos-souza.jpg",
      rating: 5,
      text: "Ver minha evolução desde o primeiro projeto até o final do curso foi gratificante. Obrigada!!",
      result: "Evolução visível"
    },
    {
      id: 9,
      name: "Patrícia Lima",
      role: "Criadora de Conteúdo",
      photo: "/testimonials/patricia-lima.jpg",
      rating: 5,
      text: "O Canva me salvou! Agora tudo que eu posto tem cara de profissional!",
      result: "Conteúdo profissional"
    }
  ],
  faq: [
    {
      id: 1,
      question: "É adequado para quem não tem experiência em administração?",
      answer: "Sim! Começamos do básico com Windows 11 e evoluímos gradualmente até gestão avançada. Perfeito para iniciantes."
    },
    {
      id: 2,
      question: "Preciso ter a calculadora HP12C?",
      answer: "Oferecemos orientações de aquisição. Durante o curso você pode usar simuladores online até adquirir a sua."
    },
    {
      id: 3,
      question: "O curso prepara para qual tipo de trabalho?",
      answer: "Assistente/Analista Administrativo, Departamento Pessoal, Financeiro, Atendimento, Supervisão e gestão de equipes."
    },
    {
      id: 4,
      question: "As apostilas estão incluídas no preço?",
      answer: "Sim! Material didático impresso completo dos 9 módulos incluso sem custo adicional."
    }
  ],
  themeColors: {
    primary: "#6366F1",
    secondary: "#8B5CF6",
    accent: "#A78BFA",
    gradient: {
      from: "#6366F1",
      to: "#8B5CF6"
    }
  },
  seoMeta: {
    title: "Curso de Administração Completo - Escola Habilidade | Office, DP, Matemática Financeira - Material Incluso",
    description: "Curso completo de Administração: Windows 11, Office, Excel Avançado, Matemática Financeira, DP, Liderança. 153 horas, apostilas inclusas, modalidades presencial e online.",
    keywords: ["administração completa", "office", "excel avançado", "departamento pessoal", "matemática financeira", "liderança", "apostilas inclusas"],
    ogImage: "/og-images/administracao.jpg",
    ogType: "website"
  }
};
const COURSES_DATA = [
  informatica,
  // 1. Informática (8 módulos) ✅ CORRIGIDO
  designGrafico,
  // 2. Design Gráfico (5 módulos) ✅ CORRIGIDO
  programacao,
  // 3. Programação (6 módulos) ✅ CORRIGIDO
  marketingDigital,
  // 4. Marketing Digital (6 módulos) ✅ CORRIGIDO
  inteligenciaArtificial,
  // 5. Inteligência Artificial (6 módulos) ✅ CORRIGIDO
  businessIntelligence,
  // 6. Business Intelligence (4 módulos) ✅ CORRIGIDO
  projetista,
  // 7. Projetista (2 módulos) ✅ ADICIONADO
  edicaoVideo,
  // 8. Edição de Vídeo (2 módulos) ✅ ADICIONADO
  administracao
  // 9. Administração (9 módulos) ✅ ADICIONADO
];
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
  textColor = "text-white",
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
    ${textColor} font-semibold
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
function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    once = true,
    delay = 0,
    duration = 600
  } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              if (once) setHasAnimated(true);
            }, delay);
          } else {
            setIsVisible(true);
            if (once) setHasAnimated(true);
          }
        } else if (!once && !hasAnimated) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [threshold, once, delay, hasAnimated]);
  return [elementRef, isVisible, hasAnimated];
}
const useSmartCTA = () => {
  const { pageType, currentCourse } = usePageContext();
  const { scrolled } = useScrollAnimation();
  const ctaConfig = useMemo(() => {
    if (pageType === "home") {
      return {
        primary: {
          label: scrolled ? "Falar Conosco" : "Área do Aluno",
          href: scrolled ? "#contato" : "https://ead.escolahabilidade.com/",
          style: scrolled ? "compact" : "full"
        }
      };
    }
    if (pageType === "coursePage") {
      return {
        primary: {
          label: "Quero me Matricular",
          href: "https://wa.me/5548988559491",
          style: "full"
        }
      };
    }
    return {
      primary: {
        label: "Fale Conosco",
        href: "https://wa.me/5548988559491",
        style: "compact"
      }
    };
  }, [pageType, currentCourse, scrolled]);
  return ctaConfig;
};
function GradientButton({ href, children, className = "", ...props }) {
  const base = "btn-neon bg-zinc-900/70 text-white font-semibold rounded-md hover:bg-zinc-900 transition min-h-[48px] px-4 py-3 flex items-center justify-center";
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
const BlogTypography = lazy(() => import("./assets/js/BlogTypography-BIBJXarQ.js"));
const AdvancedSearch = lazy(() => import("./assets/js/AdvancedSearch-BOKizDCr.js"));
const TableOfContents = lazy(() => import("./assets/js/TableOfContents--wOeVQdm.js"));
const ShareButtons = lazy(() => import("./assets/js/ShareButtons-zQ2d6_oz.js"));
const QuickContactModal = lazy(() => import("./assets/js/QuickContactModal-vwNYWUu7.js"));
const CourseCurriculum = lazy(() => import("./assets/js/CourseCurriculum-CyHszRRV.js"));
const CourseTestimonials = lazy(() => import("./assets/js/CourseTestimonials-BREMzG4U.js"));
const CourseWorkflowSection = lazy(() => import("./assets/js/CourseWorkflowSection-CqDk2yhF.js"));
const CourseToolsOverview = lazy(() => import("./assets/js/CourseToolsOverview-BKbNiKfj.js"));
const ContactForm = lazy(() => import("./assets/js/ContactForm-B1N6uVAm.js"));
const CourseContactForm = lazy(() => import("./assets/js/CourseContactForm-Dpmq0XZr.js"));
const SmartImageUpload = lazy(() => import("./assets/js/SmartImageUpload-DgPEWtLj.js"));
const MegaMenu = lazy(() => import("./assets/js/MegaMenu-BBG_618J.js"));
const MobileMegaMenu = lazy(() => import("./assets/js/MobileMegaMenu-BgMk0K4_.js"));
const ComponentFallback = React.memo(({ height = "200px" }) => /* @__PURE__ */ jsx("div", { className: `flex items-center justify-center bg-gray-50 animate-pulse`, style: { minHeight: height }, children: /* @__PURE__ */ jsx("div", { className: "text-gray-400", children: /* @__PURE__ */ jsx(Loading, {}) }) }));
const FormFallback = React.memo(() => /* @__PURE__ */ jsxs("div", { className: "space-y-4 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }),
  /* @__PURE__ */ jsx("div", { className: "h-10 bg-gray-200 rounded" }),
  /* @__PURE__ */ jsx("div", { className: "h-10 bg-gray-200 rounded" }),
  /* @__PURE__ */ jsx("div", { className: "h-32 bg-gray-200 rounded" }),
  /* @__PURE__ */ jsx("div", { className: "h-10 bg-blue-200 rounded w-32" })
] }));
const MenuFallback = React.memo(() => /* @__PURE__ */ jsx("div", { className: "animate-pulse", children: /* @__PURE__ */ jsx("div", { className: "h-8 bg-gray-200 rounded w-24" }) }));
const withLazy = (Component2, fallback = /* @__PURE__ */ jsx(ComponentFallback, {})) => {
  const componentName = Component2.displayName || Component2.name || "Component";
  const LazyWrapper = (props) => /* @__PURE__ */ jsx(Suspense, { fallback, children: /* @__PURE__ */ jsx(Component2, { ...props }) }, `with-lazy-${componentName}`);
  LazyWrapper.displayName = `withLazy(${componentName})`;
  return LazyWrapper;
};
withLazy(BlogTypography);
withLazy(AdvancedSearch, /* @__PURE__ */ jsx(ComponentFallback, { height: "120px" }));
withLazy(TableOfContents, /* @__PURE__ */ jsx(ComponentFallback, { height: "300px" }));
withLazy(ShareButtons, /* @__PURE__ */ jsx(ComponentFallback, { height: "50px" }));
withLazy(QuickContactModal);
withLazy(CourseCurriculum, /* @__PURE__ */ jsx(ComponentFallback, { height: "400px" }));
withLazy(CourseTestimonials, /* @__PURE__ */ jsx(ComponentFallback, { height: "300px" }));
withLazy(CourseWorkflowSection, /* @__PURE__ */ jsx(ComponentFallback, { height: "500px" }));
withLazy(CourseToolsOverview, /* @__PURE__ */ jsx(ComponentFallback, { height: "600px" }));
withLazy(ContactForm, /* @__PURE__ */ jsx(FormFallback, {}));
withLazy(CourseContactForm, /* @__PURE__ */ jsx(FormFallback, {}));
withLazy(SmartImageUpload, /* @__PURE__ */ jsx(ComponentFallback, { height: "150px" }));
const LazyMegaMenu = withLazy(MegaMenu, /* @__PURE__ */ jsx(MenuFallback, {}));
const LazyMobileMegaMenu = withLazy(MobileMegaMenu, /* @__PURE__ */ jsx(MenuFallback, {}));
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
        LazyMegaMenu,
        {
          isOpen: megaMenuOpen,
          onClose: () => setMegaMenuOpen(false)
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      LazyMobileMegaMenu,
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
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8", children: [
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
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-fuchsia-400", children: "Nossos Cursos" }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/informatica", className: "text-zinc-300 hover:text-white transition-colors", children: "Informática" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/design-grafico", className: "text-zinc-300 hover:text-white transition-colors", children: "Design Gráfico" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/programacao", className: "text-zinc-300 hover:text-white transition-colors", children: "Programação" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/marketing-digital", className: "text-zinc-300 hover:text-white transition-colors", children: "Marketing Digital" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/inteligencia-artificial", className: "text-zinc-300 hover:text-white transition-colors", children: "Inteligência Artificial" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/business-intelligence", className: "text-zinc-300 hover:text-white transition-colors", children: "Business Intelligence" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/projetista-3d", className: "text-zinc-300 hover:text-white transition-colors", children: "Projetista 3D" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/edicao-video", className: "text-zinc-300 hover:text-white transition-colors", children: "Edição de Vídeo" }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "/cursos/administracao", className: "text-zinc-300 hover:text-white transition-colors", children: "Administração" }) })
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
const CriticalCssLoader = ({ children }) => {
  const [criticalLoaded, setCriticalLoaded] = useState(false);
  useEffect(() => {
    const checkCriticalCss = () => {
      const criticalStyle = document.querySelector("style[data-critical]");
      if (criticalStyle) {
        console.log("[Mobile Performance] Critical CSS detected via style tag");
        return true;
      }
      const criticalLoaded2 = document.documentElement.getAttribute("data-critical-loaded");
      if (criticalLoaded2 === "true") {
        console.log("[Mobile Performance] Critical CSS detected via data attribute");
        return true;
      }
      const bodyStyles = window.getComputedStyle(document.body);
      if (bodyStyles.backgroundColor && bodyStyles.backgroundColor !== "rgba(0, 0, 0, 0)") {
        console.log("[Mobile Performance] Critical CSS detected via computed styles");
        return true;
      }
      return false;
    };
    if (checkCriticalCss()) {
      setCriticalLoaded(true);
    } else {
      let pollCount = 0;
      const maxPolls = 50;
      const pollInterval = setInterval(() => {
        pollCount++;
        if (checkCriticalCss()) {
          clearInterval(pollInterval);
          setCriticalLoaded(true);
        } else if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setCriticalLoaded(true);
          console.warn("[Mobile Performance] Critical CSS timeout after 500ms - proceeding with fallback");
        }
      }, 10);
      const fallbackTimeout = setTimeout(() => {
        clearInterval(pollInterval);
        setCriticalLoaded(true);
        console.warn("[Mobile Performance] Critical CSS timeout - falling back gracefully");
      }, 500);
      return () => {
        clearInterval(pollInterval);
        clearTimeout(fallbackTimeout);
      };
    }
  }, []);
  if (!criticalLoaded) {
    return /* @__PURE__ */ jsx("div", { className: "fouc-prevent", children: /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-black flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" }) }) });
  }
  return children;
};
const PerformanceMonitor = () => {
  useEffect(() => {
  }, []);
  return null;
};
const usePerformanceLevel = () => {
  const [performanceLevel, setPerformanceLevel] = useState("medium");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    cores: 4,
    isMobile: false,
    webglSupport: true
  });
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialPrefersReduced = mediaQuery.matches;
    setPrefersReducedMotion(initialPrefersReduced);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;
    let level = "medium";
    if (isMobile && cores < 4) {
      level = "low";
    } else if (cores >= 8 && !isMobile) {
      level = "high";
    }
    setPerformanceLevel(level);
    setDeviceCapabilities({
      cores,
      isMobile,
      webglSupport: true
    });
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setPerformanceLevel("low");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
  return {
    performanceLevel,
    prefersReducedMotion,
    deviceCapabilities,
    // Helpers para componentes
    shouldUseComplexAnimations: performanceLevel === "high" && !prefersReducedMotion,
    shouldUseBasicAnimations: performanceLevel !== "low" && !prefersReducedMotion,
    shouldUseStaticVersion: performanceLevel === "low" || prefersReducedMotion
  };
};
class GoogleAnalyticsService {
  constructor() {
    this.isEnabled = typeof window !== "undefined";
  }
  /**
   * Check if analytics is ready, fallback to lazy loader
   */
  isAnalyticsReady() {
    return typeof window !== "undefined" && typeof window.gtag !== "undefined";
  }
  /**
   * Send event to Google Analytics
   * Uses lazy loading queue if analytics not ready yet
   */
  sendEvent(eventName, parameters = {}) {
    if (!this.isEnabled) return;
    try {
      if (this.isAnalyticsReady()) {
        window.gtag("event", eventName, parameters);
      } else {
        const lazyLoader = window.lazyAnalyticsLoader;
        if (lazyLoader && typeof lazyLoader.queueEvent === "function") {
          lazyLoader.queueEvent(eventName, parameters);
        }
      }
    } catch (error) {
      console.warn("[GA] Error sending event:", error);
      const lazyLoader = window.lazyAnalyticsLoader;
      if (lazyLoader && typeof lazyLoader.queueEvent === "function") {
        lazyLoader.queueEvent(eventName, parameters);
      }
    }
  }
  /**
   * Track page view
   */
  trackPageView(path, title) {
    this.sendEvent("page_view", {
      page_path: path,
      page_title: title
    });
  }
  /**
   * Track blog post view
   */
  trackPostView(postSlug, postTitle, category, readingTime) {
    this.sendEvent("view_content", {
      content_type: "blog_post",
      content_id: postSlug,
      content_title: postTitle,
      content_category: category,
      reading_time: readingTime
    });
  }
  /**
   * Track search
   */
  trackSearch(query, resultsCount) {
    this.sendEvent("search", {
      search_term: query,
      results_count: resultsCount
    });
  }
  /**
   * Track social share
   */
  trackShare(platform, postSlug, postTitle) {
    this.sendEvent("share", {
      method: platform,
      content_type: "blog_post",
      item_id: postSlug,
      content_title: postTitle
    });
  }
  /**
   * Track category view
   */
  trackCategoryView(categorySlug, categoryName, postsCount) {
    this.sendEvent("view_item_list", {
      item_list_id: categorySlug,
      item_list_name: categoryName,
      items_count: postsCount
    });
  }
  /**
   * Track reading progress milestones
   */
  trackReadingProgress(postSlug, percentage) {
    if ([25, 50, 75, 100].includes(percentage)) {
      this.sendEvent("reading_progress", {
        content_id: postSlug,
        percent_scrolled: percentage,
        milestone: `${percentage}%`
      });
    }
  }
  /**
   * Track course CTA clicks
   */
  trackCTAClick(ctaType, location, courseSlug) {
    this.sendEvent("select_content", {
      content_type: "cta",
      cta_type: ctaType,
      location,
      item_id: courseSlug
    });
  }
  /**
   * Track form submissions
   */
  trackFormSubmit(formType, formLocation) {
    this.sendEvent("generate_lead", {
      form_type: formType,
      form_location: formLocation
    });
  }
  /**
   * Track engagement time
   */
  trackEngagementTime(postSlug, timeSpent, engagementLevel) {
    this.sendEvent("user_engagement", {
      content_id: postSlug,
      engagement_time_msec: timeSpent,
      engagement_level: engagementLevel
    });
  }
  /**
   * Track errors
   */
  trackError(errorType, errorMessage, errorLocation) {
    this.sendEvent("exception", {
      description: `${errorType}: ${errorMessage}`,
      fatal: false,
      error_location: errorLocation
    });
  }
  /**
   * Set user properties
   */
  setUserProperties(properties) {
    if (!this.isEnabled) return;
    try {
      if (this.isAnalyticsReady()) {
        window.gtag("set", "user_properties", properties);
      } else {
        const lazyLoader = window.lazyAnalyticsLoader;
        if (lazyLoader && typeof lazyLoader.queueEvent === "function") {
          lazyLoader.queueEvent("set_user_properties", properties);
        }
      }
    } catch (error) {
      console.warn("[GA] Error setting user properties:", error);
    }
  }
  /**
   * Initialize analytics if not already loaded
   * Useful for forcing analytics load in specific scenarios
   */
  ensureAnalyticsLoaded() {
    if (!this.isAnalyticsReady()) {
      const lazyLoader = window.lazyAnalyticsLoader;
      if (lazyLoader && typeof lazyLoader.forceLoad === "function") {
        lazyLoader.forceLoad();
      }
    }
  }
  /**
   * Check if lazy analytics is ready
   */
  isLazyAnalyticsReady() {
    const lazyLoader = window.lazyAnalyticsLoader;
    return lazyLoader && typeof lazyLoader.isReady === "function" ? lazyLoader.isReady() : false;
  }
  /**
   * Track custom conversions
   */
  trackConversion(conversionType, value = null) {
    const parameters = {
      conversion_type: conversionType,
      send_to: "G-J4RJQLG6WP"
    };
    if (value !== null) {
      parameters.value = value;
      parameters.currency = "BRL";
    }
    this.sendEvent("conversion", parameters);
  }
}
const gaService = new GoogleAnalyticsService();
function useGoogleAnalytics() {
  const location = useLocation();
  useEffect(() => {
    const pagePath = location.pathname + location.search;
    const pageTitle = document.title;
    gaService.trackPageView(pagePath, pageTitle);
  }, [location]);
}
function useScrollToHash() {
  const location = useLocation();
  useEffect(() => {
    const scrollToElement = (hash) => {
      if (!hash) return;
      const elementId = hash.replace("#", "");
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
    };
    if (location.hash) {
      scrollToElement(location.hash);
    }
    const handleHashChange = () => {
      scrollToElement(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [location]);
}
function useUrlCleanup() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const currentUrl = location.pathname + location.search + location.hash;
    if (currentUrl.includes("~and~")) {
      const cleanUrl = currentUrl.replace(/~and~/g, "&");
      navigate(cleanUrl, { replace: true });
      console.log("Cleaned URL from:", currentUrl, "to:", cleanUrl);
    }
  }, [location, navigate]);
}
class DOMOptimizer {
  constructor() {
    this.intersectionObserver = null;
    this.mutationObserver = null;
    this.visibleElements = /* @__PURE__ */ new Set();
    this.cleanupTasks = /* @__PURE__ */ new Set();
    this.isServer = typeof window === "undefined";
    this.isHydrated = false;
    this.config = {
      // Limites para elementos DOM
      maxVisibleElements: 200,
      maxTotalElements: 800,
      // Configurações do IntersectionObserver
      rootMargin: "100px",
      threshold: [0, 0.1, 0.5],
      // Debounce para operações custosas
      debounceDelay: 100,
      // Configurações de limpeza
      cleanupInterval: 5e3,
      maxIdleTime: 3e4
    };
  }
  init() {
    if (this.isServer) return;
    this.setupIntersectionObserver();
    this.setupPeriodicCleanup();
    if (this.isHydrated) {
      this.optimizeInitialDOM();
    }
  }
  /**
   * Initialize optimizer after hydration is complete
   */
  initializeAfterHydration() {
    if (this.isServer) return;
    this.isHydrated = true;
    this.init();
    this.optimizeInitialDOM();
  }
  /**
   * Configura observador de visibilidade para elementos
   */
  setupIntersectionObserver() {
    if (typeof IntersectionObserver === "undefined") {
      console.warn("[DOMOptimizer] IntersectionObserver not available, skipping setup");
      return;
    }
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.handleElementVisible(entry.target);
        } else {
          this.handleElementHidden(entry.target);
        }
      });
    }, {
      rootMargin: this.config.rootMargin,
      threshold: this.config.threshold
    });
  }
  /**
   * Configura observador de mutações DOM
   */
  setupMutationObserver() {
    if (this.isServer || typeof MutationObserver === "undefined") {
      console.warn("[DOMOptimizer] MutationObserver not available, skipping setup");
      return;
    }
    this.mutationObserver = new MutationObserver(
      this.debounce((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.optimizeElement(node);
            }
          });
        });
      }, this.config.debounceDelay)
    );
    if (typeof document !== "undefined" && document.body) {
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    }
  }
  /**
   * Otimiza elemento individual
   */
  optimizeElement(element) {
    var _a;
    if (this.isServer || !element) return;
    if (element.tagName === "IMG" && !element.hasAttribute("loading")) {
      element.setAttribute("loading", "lazy");
    }
    if ((_a = element.classList) == null ? void 0 : _a.contains("animate-")) {
      this.optimizeAnimatedElement(element);
    }
    if (this.shouldApplyContainment(element)) {
      element.style.contain = "layout style paint";
    }
    if (this.shouldObserveElement(element) && this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }
  /**
   * Otimiza elementos com animações
   */
  optimizeAnimatedElement(element) {
    const animationClasses = Array.from(element.classList).filter((cls) => cls.startsWith("animate-"));
    if (animationClasses.length > 0) {
      const hasTransform = animationClasses.some(
        (cls) => cls.includes("fade") || cls.includes("slide") || cls.includes("scale")
      );
      const hasOpacity = animationClasses.some(
        (cls) => cls.includes("fade") || cls.includes("pulse")
      );
      if (hasTransform && hasOpacity) {
        element.style.willChange = "transform, opacity";
      } else if (hasTransform) {
        element.style.willChange = "transform";
      } else if (hasOpacity) {
        element.style.willChange = "opacity";
      }
      const cleanup = () => {
        element.style.willChange = "auto";
        element.removeEventListener("animationend", cleanup);
        element.removeEventListener("transitionend", cleanup);
      };
      element.addEventListener("animationend", cleanup, { once: true });
      element.addEventListener("transitionend", cleanup, { once: true });
    }
  }
  /**
   * Determina se elemento deve ter containment
   */
  shouldApplyContainment(element) {
    var _a, _b, _c;
    if ((_a = element.classList) == null ? void 0 : _a.contains("course-background")) return true;
    if (((_b = element.classList) == null ? void 0 : _b.contains("card-")) || ((_c = element.classList) == null ? void 0 : _c.contains("course-card"))) return true;
    if (getComputedStyle(element).overflow !== "visible") return true;
    return false;
  }
  /**
   * Determina se elemento deve ser observado
   */
  shouldObserveElement(element) {
    var _a, _b, _c;
    if ((_a = element.classList) == null ? void 0 : _a.contains("animate-on-scroll")) return true;
    if (element.tagName === "CANVAS") return true;
    if ((_b = element.classList) == null ? void 0 : _b.contains("course-background")) return true;
    if (((_c = element.children) == null ? void 0 : _c.length) > 20) return true;
    return false;
  }
  /**
   * Manipula elemento que se tornou visível
   */
  handleElementVisible(element) {
    var _a;
    this.visibleElements.add(element);
    if ((_a = element.classList) == null ? void 0 : _a.contains("animate-on-scroll")) {
      element.classList.add("in-view");
    }
    if (this.visibleElements.size > this.config.maxVisibleElements) {
      this.cullHiddenElements();
    }
  }
  /**
   * Manipula elemento que se tornou oculto
   */
  handleElementHidden(element) {
    var _a;
    this.visibleElements.delete(element);
    if ((_a = element.classList) == null ? void 0 : _a.contains("animate-on-scroll")) {
      element.classList.remove("in-view");
    }
    if (!element.style.animationPlayState === "running") {
      element.style.willChange = "auto";
    }
  }
  /**
   * Remove elementos ocultos desnecessários
   */
  cullHiddenElements() {
    if (this.isServer || typeof document === "undefined") return;
    const allElements = document.querySelectorAll("[data-dom-optimized]");
    const hiddenElements = Array.from(allElements).filter((el) => !this.visibleElements.has(el)).slice(this.config.maxTotalElements);
    hiddenElements.forEach((element) => {
      if (element.parentNode && !element.classList.contains("critical")) {
        element.style.display = "none";
        element.setAttribute("data-hidden-by-optimizer", "true");
      }
    });
  }
  /**
   * Otimização inicial do DOM
   */
  optimizeInitialDOM() {
    if (this.isServer || typeof document === "undefined") return;
    document.querySelectorAll("*").forEach((element) => {
      this.optimizeElement(element);
      element.setAttribute("data-dom-optimized", "true");
    });
    this.removeComments();
    this.applyGlobalOptimizations();
  }
  /**
   * Remove comentários HTML para reduzir tamanho DOM
   */
  removeComments() {
    if (this.isServer || typeof document === "undefined" || typeof NodeFilter === "undefined") return;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_COMMENT
    );
    const comments = [];
    let node;
    while (node = walker.nextNode()) {
      comments.push(node);
    }
    comments.forEach((comment) => {
      if (!comment.nodeValue.includes("KEEP")) {
        comment.remove();
      }
    });
  }
  /**
   * Aplica otimizações globais
   */
  applyGlobalOptimizations() {
    if (this.isServer || typeof document === "undefined") return;
    if (document.documentElement) {
      document.documentElement.style.scrollBehavior = "smooth";
    }
    if (document.body) {
      document.body.style.willChange = "auto";
    }
    if (document.styleSheets) {
      const fontFaces = document.styleSheets;
      Array.from(fontFaces).forEach((sheet) => {
        try {
          Array.from(sheet.cssRules || []).forEach((rule) => {
            if (typeof CSSRule !== "undefined" && rule.type === CSSRule.FONT_FACE_RULE) {
              rule.style.fontDisplay = "swap";
            }
          });
        } catch (e) {
        }
      });
    }
  }
  /**
   * Limpeza periódica
   */
  setupPeriodicCleanup() {
    if (this.isServer || typeof setInterval === "undefined") return;
    setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }
  /**
   * Executa limpeza de elementos
   */
  performCleanup() {
    if (this.isServer || typeof document === "undefined" || typeof window === "undefined") return;
    document.querySelectorAll('[data-hidden-by-optimizer="true"]').forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isNearViewport = rect.top < window.innerHeight + 500 && rect.bottom > -500;
      if (isNearViewport) {
        element.style.display = "";
        element.removeAttribute("data-hidden-by-optimizer");
      }
    });
    document.querySelectorAll('[style*="will-change"]').forEach((element) => {
      if (!element.style.animationPlayState === "running" && !element.matches(":hover") && !element.classList.contains("animating")) {
        element.style.willChange = "auto";
      }
    });
  }
  /**
   * Debounce utility
   */
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  /**
   * Destruir otimizador
   */
  destroy() {
    if (this.isServer) return;
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.cleanupTasks) {
      this.cleanupTasks.forEach((task) => task());
    }
  }
}
const domOptimizer = new DOMOptimizer();
function Layout() {
  useLocation();
  const { performanceLevel } = usePerformanceLevel();
  useGoogleAnalytics();
  useUrlCleanup();
  useScrollToHash();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const initializeOptimizer = () => {
        if (performanceLevel === "LOW") {
          document.documentElement.style.setProperty("--animation-duration", "0.1s");
          document.documentElement.style.setProperty("--transition-duration", "0.1s");
        }
      };
      const timeoutId = setTimeout(initializeOptimizer, 100);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [performanceLevel]);
  return /* @__PURE__ */ jsx(ErrorBoundary, { children: /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsx(QueryProvider, { children: /* @__PURE__ */ jsx(CriticalCssLoader, { children: /* @__PURE__ */ jsxs("div", { className: "App bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-zinc-50", children: [
    /* @__PURE__ */ jsx(PerformanceMonitor, {}),
    /* @__PURE__ */ jsx(AccessibilityControls$1, {}),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { id: "main-content", className: "relative z-10", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) }) }) }) });
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
React.lazy(() => import("./assets/js/Home-DtdIo03w.js"));
React.lazy(() => import("./assets/js/CoursePage-8TEXmaR1.js"));
const Contact = React.lazy(() => import("./assets/js/Contact-DMsIh_-_.js"));
React.lazy(() => import("./assets/js/BlogIndex-DzeDsvZZ.js"));
React.lazy(() => import("./assets/js/BlogTestPage-kLuBDinJ.js"));
React.lazy(() => import("./assets/js/BlogCategory-GFJIHbcT.js"));
React.lazy(() => import("./assets/js/NotFound-wSBhes32.js"));
const CursosFlorianopolis = React.lazy(() => import("./assets/js/CursosFlorianopolis-D0ti-1DV.js"));
const CursosSaoJose = React.lazy(() => import("./assets/js/CursosSaoJose-Cd3irewo.js"));
const CursosPalhoca = React.lazy(() => import("./assets/js/CursosPalhoca-DofsY__8.js"));
const CursoSketchupEnscape = React.lazy(() => import("./assets/js/CursoSketchupEnscape-CDTQcOqH.js"));
const TesteVocacional = React.lazy(() => import("./assets/js/TesteVocacional-QAppQHnp.js"));
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
  "editor-materiais-sketchup-realismo-enscape",
  "guia-completo-enscape-sketchup-iniciantes",
  "sketchup-2025-visualizacao-3d-materiais-fotorrealistas",
  "5-razoes-organizacoes-investir-treinamento-excel",
  "transforme-dados-em-decisoes-estrategicas-dashboards-empresariais"
];
const routes = [
  // Rotas de curso com layout específico (sem header global) - DEVEM VIR ANTES das rotas gerais
  {
    path: "/cursos/sketchup-enscape",
    element: /* @__PURE__ */ jsx(CourseLayout, {}),
    children: [
      {
        index: true,
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursoSketchupEnscape, {}) }, "course-sketchup-enscape")
      }
    ]
  },
  {
    path: "/",
    element: /* @__PURE__ */ jsx(Layout, {}),
    children: [
      {
        index: true,
        lazy: () => import("./assets/js/Home-DtdIo03w.js")
      },
      // Rotas estáticas individuais para garantir SSG
      {
        path: "cursos/informatica",
        lazy: () => import("./assets/js/Informatica-D3hpMutD.js")
      },
      {
        path: "cursos/design-grafico",
        lazy: () => import("./assets/js/DesignGrafico-BLry1aaL.js")
      },
      {
        path: "cursos/programacao",
        lazy: () => import("./assets/js/Programacao-Bmcbe0xw.js")
      },
      {
        path: "cursos/marketing-digital",
        lazy: () => import("./assets/js/MarketingDigital-rnHfG3Zt.js")
      },
      {
        path: "cursos/inteligencia-artificial",
        lazy: () => import("./assets/js/InteligenciaArtificial-CAO4Dd-K.js")
      },
      {
        path: "cursos/excel-avancado-business-intelligence",
        lazy: () => import("./assets/js/BusinessIntelligence-MxOVETiD.js")
      },
      // Redirect 301: business-intelligence → excel-avancado-business-intelligence
      {
        path: "cursos/business-intelligence",
        element: /* @__PURE__ */ jsx(Navigate, { to: "/cursos/excel-avancado-business-intelligence", replace: true })
      },
      {
        path: "cursos/projetista-3d",
        lazy: () => import("./assets/js/Projetista3D-C8PErjge.js")
      },
      {
        path: "cursos/projetista-3d-novo",
        lazy: () => import("./assets/js/Projetista3DNew-Rb64gX-I.js")
      },
      {
        path: "cursos/edicao-video",
        lazy: () => import("./assets/js/EdicaoVideo-qHXjN-pS.js")
      },
      {
        path: "cursos/administracao",
        lazy: () => import("./assets/js/Administracao-CjmaWjsP.js")
      },
      {
        path: "contato",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(Contact, {}) }, "contact-page")
      },
      {
        path: "blog",
        children: [
          {
            index: true,
            lazy: () => import("./assets/js/BlogIndex-DzeDsvZZ.js")
          },
          {
            path: "categoria/:categorySlug",
            lazy: () => import("./assets/js/BlogCategory-GFJIHbcT.js")
          },
          {
            path: ":slug",
            lazy: () => import("./assets/js/BlogPostSSG-UAxCvID6.js"),
            getStaticPaths: () => blogSlugs
          }
        ]
      },
      {
        path: "blog-test",
        children: [
          {
            index: true,
            lazy: () => import("./assets/js/BlogTestPage-kLuBDinJ.js")
          },
          {
            path: ":slug",
            lazy: () => import("./assets/js/BlogTestPage-kLuBDinJ.js")
          }
        ]
      },
      // Páginas de localização (SEO local)
      {
        path: "cursos-florianopolis",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosFlorianopolis, {}) }, "cursos-florianopolis")
      },
      {
        path: "cursos-sao-jose",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosSaoJose, {}) }, "cursos-sao-jose")
      },
      {
        path: "cursos-palhoca",
        element: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(Loading, {}), children: /* @__PURE__ */ jsx(CursosPalhoca, {}) }, "cursos-palhoca")
      },
      // Página do teste vocacional
      {
        path: "teste-vocacional",
        element: /* @__PURE__ */ jsx(TesteVocacional, {})
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
        lazy: () => import("./assets/js/NotFound-wSBhes32.js")
      }
    ]
  }
];
class FrontendErrorLogger {
  constructor(options = {}) {
    this.functionUrl = options.functionUrl || "/.netlify/functions/error-monitoring/log-error";
    this.enabled = options.enabled !== false && typeof window !== "undefined";
    this.sessionId = this.generateSessionId();
    this.errorQueue = [];
    this.isOnline = true;
    if (this.enabled) {
      this.setupErrorHandlers();
      this.setupNetworkDetection();
    }
  }
  /**
   * Setup global error handlers
   */
  setupErrorHandlers() {
    window.addEventListener("error", (event) => {
      var _a;
      this.logError({
        type: "javascript",
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: (_a = event.error) == null ? void 0 : _a.stack,
        severity: "high"
      });
    });
    window.addEventListener("unhandledrejection", (event) => {
      var _a, _b;
      this.logError({
        type: "promise_rejection",
        message: ((_a = event.reason) == null ? void 0 : _a.message) || "Unhandled promise rejection",
        stack: (_b = event.reason) == null ? void 0 : _b.stack,
        severity: "high"
      });
    });
    this.wrapConsoleError();
  }
  /**
   * Setup network status detection
   */
  setupNetworkDetection() {
    if ("navigator" in window && "onLine" in navigator) {
      this.isOnline = navigator.onLine;
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.flushErrorQueue();
      });
      window.addEventListener("offline", () => {
        this.isOnline = false;
      });
    }
  }
  /**
   * Wrap console.error to capture manual errors
   */
  wrapConsoleError() {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      const message = args.map(
        (arg) => typeof arg === "object" ? JSON.stringify(arg) : String(arg)
      ).join(" ");
      this.logError({
        type: "console_error",
        message: message.substring(0, 500),
        // Limit size
        severity: "medium"
      });
    };
  }
  /**
   * Log error to Netlify Function
   */
  async logError(errorData) {
    var _a, _b;
    const enrichedError = {
      ...errorData,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      screen: {
        width: (_a = window.screen) == null ? void 0 : _a.width,
        height: (_b = window.screen) == null ? void 0 : _b.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      referrer: document.referrer,
      // Context data
      context: this.getPageContext()
    };
    if (this.isOnline) {
      try {
        await this.sendError(enrichedError);
      } catch (networkError) {
        const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.port === "5173" || window.location.port === "3000";
        if (!isDevelopment) {
          console.warn("Failed to send error to server:", networkError);
        }
        this.queueError(enrichedError);
      }
    } else {
      this.queueError(enrichedError);
    }
  }
  /**
   * Send error to Netlify Function
   */
  async sendError(errorData) {
    try {
      const response = await fetch(this.functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(errorData)
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    } catch (error) {
      const isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.port === "5173" || window.location.port === "3000";
      if (isDevelopment) {
        return Promise.resolve({ success: false, development: true });
      }
      throw error;
    }
  }
  /**
   * Queue error for later sending
   */
  queueError(errorData) {
    this.errorQueue.push(errorData);
    if (this.errorQueue.length > 50) {
      this.errorQueue.shift();
    }
    try {
      localStorage.setItem("errorQueue", JSON.stringify(this.errorQueue));
    } catch (e) {
    }
  }
  /**
   * Flush error queue when back online
   */
  async flushErrorQueue() {
    const queueToFlush = [...this.errorQueue];
    this.errorQueue = [];
    for (const error of queueToFlush) {
      try {
        await this.sendError(error);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        this.queueError(error);
        break;
      }
    }
    try {
      localStorage.removeItem("errorQueue");
    } catch (e) {
    }
  }
  /**
   * Get current page context
   */
  getPageContext() {
    return {
      title: document.title,
      path: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      // React-specific context (if available)
      reactError: this.getReactErrorContext(),
      // Performance context
      performance: this.getPerformanceContext()
    };
  }
  /**
   * Get React error context (if React DevTools available)
   */
  getReactErrorContext() {
    var _a;
    try {
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        return {
          reactDetected: true,
          version: ((_a = window.React) == null ? void 0 : _a.version) || "unknown"
        };
      }
    } catch (e) {
    }
    return null;
  }
  /**
   * Get performance context
   */
  getPerformanceContext() {
    try {
      if ("performance" in window && window.performance.navigation) {
        return {
          loadTime: window.performance.navigation.loadEventEnd - window.performance.navigation.navigationStart,
          domContentLoaded: window.performance.navigation.domContentLoadedEventEnd - window.performance.navigation.navigationStart,
          type: window.performance.navigation.type
        };
      }
    } catch (e) {
    }
    return null;
  }
  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  /**
   * Manual error logging
   */
  logManualError(message, context = {}, severity = "medium") {
    this.logError({
      type: "manual",
      message,
      severity,
      context
    });
  }
  /**
   * Log user action errors
   */
  logUserActionError(action, error, context = {}) {
    this.logError({
      type: "user_action",
      message: `User action failed: ${action}`,
      action,
      error: (error == null ? void 0 : error.message) || error,
      stack: error == null ? void 0 : error.stack,
      severity: "medium",
      context
    });
  }
  /**
   * Log API errors
   */
  logApiError(url, method, status, response, context = {}) {
    this.logError({
      type: "api_error",
      message: `API call failed: ${method} ${url}`,
      url,
      method,
      status,
      response: typeof response === "string" ? response.substring(0, 200) : JSON.stringify(response).substring(0, 200),
      severity: status >= 500 ? "high" : "medium",
      context
    });
  }
}
let errorLogger = null;
function initializeErrorLogger(options = {}) {
  if (!errorLogger) {
    errorLogger = new FrontendErrorLogger(options);
  }
  return errorLogger;
}
const optimizeFontLoading = () => {
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Montserrat-fallback';
      src: local('Arial'), local('Helvetica');
      font-display: swap;
    }
    @font-face {
      font-family: 'Inter-fallback';
      src: local('Arial'), local('Helvetica');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};
const initCriticalCss = () => {
  optimizeFontLoading();
  if (window.innerWidth <= 768) {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.touchAction = "manipulation";
    let lastTouchEnd = 0;
    document.addEventListener("touchend", (event) => {
      const now = (/* @__PURE__ */ new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
  if (document.documentElement.classList.contains("fouc-prevent")) {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("fouc-prevent");
      document.documentElement.classList.add("fouc-ready");
    });
  }
  setTimeout(() => {
    const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"][data-async]');
    preloadLinks.forEach((link) => {
      if (link.onload) {
        link.onload();
      }
    });
  }, 100);
  document.documentElement.setAttribute("data-critical-loaded", "true");
  if (window.performance && window.performance.mark) {
    window.performance.mark("critical-css-ready");
  }
};
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCriticalCss);
  } else {
    initCriticalCss();
  }
}
const createRoot = ViteReactSSG(
  { routes },
  ({ router, routes: routes2, isClient, initialState }) => {
    if (isClient) {
      const isProduction = window.location.hostname === "escolahabilidade.com" || window.location.hostname === "www.escolahabilidade.com";
      initCriticalCss();
      initializeErrorLogger({
        enabled: isProduction,
        functionUrl: "/.netlify/functions/error-monitoring/log-error"
      });
      if (isProduction) {
        import("./assets/js/LazyAnalyticsLoader-Co2iOqHz.js").then(({ default: lazyAnalyticsLoader }) => {
          console.info("[Performance] Lazy Analytics Loader initialized");
        }).catch((error) => {
          console.warn("[Performance] Failed to load Lazy Analytics:", error);
        });
      }
    }
    return router;
  }
);
export {
  ADAPTIVE_NAVIGATION as A,
  COURSES_DATA as C,
  ErrorBoundary as E,
  GradientButton as G,
  InteractiveLogo as I,
  Loading as L,
  Section as S,
  LogoH as a,
  gaService as b,
  usePerformanceLevel as c,
  createRoot,
  generateCourseMetadata as d,
  getCourseBySlug as g,
  searchCourses as s,
  usePageContext as u,
  validateAndSanitizeCourse as v
};
