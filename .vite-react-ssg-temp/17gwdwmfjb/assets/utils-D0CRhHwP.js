import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Monitor, RocketLaunch, PuzzlePiece, Article, Buildings, Cube, ChartLine, ChartBar, Sparkle, Robot, Target, Megaphone, Lightning, Code, MagicWand, PenNib, Gear } from "@phosphor-icons/react";
import { useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { blogAPI } from "./blog-xsr1A1aF.js";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import { parse } from "node-html-parser";
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
    } else {
      newContext.pageType = "other";
    }
    setContext(newContext);
  }, [location.pathname, params.courseSlug, params.slug]);
  return context;
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
function generateCourseMetadata(courseData) {
  var _a, _b, _c, _d;
  const safeCourse = validateAndSanitizeCourse(courseData);
  const baseUrl = "https://stelarow.github.io/habilidade";
  const courseUrl = `${baseUrl}/cursos/${safeCourse.basicInfo.slug}`;
  const defaultInvestment = {
    currentPrice: 597
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
      "image": safeCourse.seoMeta.ogImage,
      "provider": {
        "@type": "EducationalOrganization",
        "name": "Escola Habilidade",
        "url": baseUrl,
        "sameAs": baseUrl,
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "BR",
          "addressLocality": "Brasil"
        }
      },
      "courseMode": ["https://schema.org/OnlineEventAttendanceMode", "https://schema.org/OfflineEventAttendanceMode"],
      "educationalLevel": safeCourse.basicInfo.level,
      "inLanguage": "pt-BR",
      "learningResourceType": "Course",
      "teaches": teaches,
      "timeRequired": safeCourse.basicInfo.duration,
      "hasPart": ((_b = safeCourse.curriculum) == null ? void 0 : _b.map((module) => {
        var _a2;
        return {
          "@type": "CourseInstance",
          "name": `Módulo ${module.title}`,
          "description": module.description,
          "courseWorkload": `PT${module.duration.replace(" horas", "H")}`,
          "numberOfCredits": ((_a2 = module.lessons) == null ? void 0 : _a2.length) || 0,
          "educationalLevel": safeCourse.basicInfo.level,
          "learningResourceType": "Module"
        };
      })) || [],
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": ["https://schema.org/OnlineEventAttendanceMode", "https://schema.org/OfflineEventAttendanceMode"],
        "courseWorkload": `PT${safeCourse.basicInfo.duration.replace(" horas", "H")}`,
        "courseSchedule": {
          "@type": "Schedule",
          "duration": safeCourse.basicInfo.duration,
          "repeatFrequency": "P1W",
          "repeatCount": 4,
          "scheduleTimezone": "America/Sao_Paulo"
        },
        "instructor": {
          "@type": "Person",
          "name": instructor.name,
          "description": instructor.bio
        },
        "location": {
          "@type": "Place",
          "name": "Escola Habilidade",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR",
            "addressLocality": "Brasil"
          }
        }
      },
      "offers": {
        "@type": "Offer",
        "price": investment.currentPrice,
        "priceCurrency": "BRL",
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-01-01",
        "priceValidUntil": "2025-12-31",
        "url": courseUrl,
        "category": "EducationalOccupationalCredential",
        "seller": {
          "@type": "EducationalOrganization",
          "name": "Escola Habilidade",
          "url": baseUrl
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": calculateAverageRating(),
        "reviewCount": ((_c = safeCourse.testimonials) == null ? void 0 : _c.length) || 50,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": ((_d = safeCourse.testimonials) == null ? void 0 : _d.slice(0, 3).map((testimonial, index) => ({
        "@type": "Review",
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
    this.isEnabled = typeof window !== "undefined" && typeof gtag !== "undefined";
  }
  /**
   * Send event to Google Analytics
   */
  sendEvent(eventName, parameters = {}) {
    if (!this.isEnabled) return;
    try {
      gtag("event", eventName, parameters);
    } catch (error) {
      console.warn("[GA] Error sending event:", error);
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
      gtag("set", "user_properties", properties);
    } catch (error) {
      console.warn("[GA] Error setting user properties:", error);
    }
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
    if (!this.isServer) {
      this.init();
    }
  }
  init() {
    if (this.isServer) return;
    this.setupIntersectionObserver();
    this.setupMutationObserver();
    this.setupPeriodicCleanup();
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
function useTypewriter(words, typingSpeed = 120, pause = 2e3) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const currentWord = words[index % words.length];
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, typingSpeed / 2);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, typingSpeed);
    }
    if (!isDeleting && text === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setIndex((prev) => prev + 1);
    }
    return () => clearTimeout(timer);
  }, [text, isDeleting, index, words, typingSpeed, pause]);
  return text;
}
function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);
  return [ref, visible];
}
const CACHE_CONFIG = {
  POSTS_LIST: 5 * 60 * 1e3,
  // 5 minutes for lists
  POST_DETAIL: 60 * 60 * 1e3,
  // 1 hour for individual posts
  CATEGORIES: 30 * 60 * 1e3
  // 30 minutes for categories
};
const usePosts = (page = 1, limit = 10, category = null, search = null) => {
  return useQuery({
    queryKey: ["posts", page, limit, category, search],
    queryFn: () => blogAPI.getAllPosts(page, limit, category, search),
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useInfinitePosts = (limit = 10, category = null, search = null) => {
  return useInfiniteQuery({
    queryKey: ["infinitePosts", limit, category, search],
    queryFn: ({ pageParam = 1 }) => blogAPI.getAllPosts(pageParam, limit, category, search),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : void 0;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const usePost = (slug) => {
  return useQuery({
    queryKey: ["post", slug],
    queryFn: () => blogAPI.getPostBySlug(slug),
    staleTime: CACHE_CONFIG.POST_DETAIL,
    retry: 2,
    enabled: !!slug,
    // Only run query if slug is provided
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useInfinitePostsByCategory = (categorySlug, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ["infinitePostsByCategory", categorySlug, limit],
    queryFn: ({ pageParam = 1 }) => blogAPI.getPostsByCategory(categorySlug, pageParam, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : void 0;
    },
    staleTime: CACHE_CONFIG.POSTS_LIST,
    retry: 3,
    enabled: !!categorySlug,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => blogAPI.getCategories(),
    staleTime: CACHE_CONFIG.CATEGORIES,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 3e3)
  });
};
const usePrefetchPost = () => {
  const queryClient = useQueryClient();
  return (slug) => {
    queryClient.prefetchQuery({
      queryKey: ["post", slug],
      queryFn: () => blogAPI.getPostBySlug(slug),
      staleTime: CACHE_CONFIG.POST_DETAIL
    });
  };
};
const useBlogResponsive = () => {
  const [screenData, setScreenData] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false
  });
  const breakpoints = {
    mobile: 768,
    // < 768px
    tablet: 1024,
    // 768px - 1023px
    desktop: 1280,
    // 1024px - 1279px
    large: 1536
    // >= 1280px
  };
  const calculateResponsiveData = useCallback((width, height) => {
    const isMobile = width < breakpoints.mobile;
    const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
    const isDesktop = width >= breakpoints.tablet && width < breakpoints.large;
    const isLargeDesktop = width >= breakpoints.large;
    const gridColumns = isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4;
    const typographyScale = isMobile ? 0.875 : isTablet ? 0.95 : 1;
    const imageSizes = {
      thumbnail: isMobile ? 150 : isTablet ? 200 : 250,
      card: isMobile ? 300 : isTablet ? 400 : 500,
      hero: isMobile ? 600 : isTablet ? 800 : 1200,
      full: width
    };
    const readingWidth = Math.min(width * 0.9, isMobile ? 300 : isTablet ? 500 : 650);
    const performanceLevel = isMobile ? "low" : isTablet ? "medium" : "high";
    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      gridColumns,
      typographyScale,
      imageSizes,
      readingWidth,
      performanceLevel,
      // Device type detection
      deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
      // Orientation
      isLandscape: width > height,
      isPortrait: height > width,
      // Aspect ratio
      aspectRatio: width / height
    };
  }, [breakpoints]);
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setScreenData(calculateResponsiveData(width, height));
  }, [calculateResponsiveData]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    handleResize();
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);
  const getResponsiveValue = useCallback((values) => {
    const { mobile, tablet, desktop, large } = values;
    if (screenData.isMobile && mobile !== void 0) return mobile;
    if (screenData.isTablet && tablet !== void 0) return tablet;
    if (screenData.isDesktop && desktop !== void 0) return desktop;
    if (screenData.isLargeDesktop && large !== void 0) return large;
    return large || desktop || tablet || mobile;
  }, [screenData]);
  const getResponsiveImageProps = useCallback((baseUrl, alt, sizes = "card") => {
    const { imageSizes } = screenData;
    const targetSize = imageSizes[sizes] || imageSizes.card;
    return {
      src: `${baseUrl}?w=${targetSize}&q=75`,
      alt,
      width: targetSize,
      loading: screenData.isMobile ? "lazy" : "eager",
      // Generate srcSet for different densities
      srcSet: [
        `${baseUrl}?w=${targetSize}&q=75 1x`,
        `${baseUrl}?w=${targetSize * 1.5}&q=75 1.5x`,
        `${baseUrl}?w=${targetSize * 2}&q=75 2x`
      ].join(", ")
    };
  }, [screenData]);
  const getGridClasses = useCallback((baseColumns = null) => {
    const columns = baseColumns || screenData.gridColumns;
    if (columns === 1) return "grid grid-cols-1";
    if (columns === 2) return "grid grid-cols-1 md:grid-cols-2";
    if (columns === 3) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (columns === 4) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }, [screenData.gridColumns]);
  const getGapClasses = useCallback((size = "medium") => {
    const gapMap = {
      small: screenData.isMobile ? "gap-3" : "gap-4",
      medium: screenData.isMobile ? "gap-4" : "gap-6",
      large: screenData.isMobile ? "gap-6" : "gap-8"
    };
    return gapMap[size] || gapMap.medium;
  }, [screenData.isMobile]);
  const getTypographyClasses = useCallback((variant = "body") => {
    const { isMobile, isTablet } = screenData;
    const variants = {
      title: isMobile ? "text-xl" : isTablet ? "text-2xl" : "text-3xl",
      subtitle: isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl",
      body: isMobile ? "text-sm" : "text-base",
      caption: isMobile ? "text-xs" : "text-sm"
    };
    return variants[variant] || variants.body;
  }, [screenData]);
  const shouldUseAnimations = useCallback(() => {
    if (screenData.isMobile) return false;
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return false;
    }
    return screenData.performanceLevel !== "low";
  }, [screenData]);
  return {
    // Screen data
    ...screenData,
    // Utility functions
    getResponsiveValue,
    getResponsiveImageProps,
    getGridClasses,
    getGapClasses,
    getTypographyClasses,
    shouldUseAnimations,
    // Breakpoint helpers
    breakpoints,
    // Quick responsive checks
    isSmallScreen: screenData.isMobile,
    isMediumScreen: screenData.isTablet,
    isLargeScreen: screenData.isDesktop || screenData.isLargeDesktop,
    // Performance helpers
    canUseHeavyAnimations: screenData.performanceLevel === "high",
    canUseMediumAnimations: screenData.performanceLevel !== "low",
    // Layout helpers
    showSidebar: !screenData.isMobile,
    showFullNavigation: !screenData.isMobile,
    useCompactLayout: screenData.isMobile,
    // Content optimization
    maxItemsPerPage: screenData.isMobile ? 6 : screenData.isTablet ? 9 : 12,
    imageQuality: screenData.isMobile ? 75 : 85,
    prefetchCount: screenData.isMobile ? 2 : 4
  };
};
const isReducedMotionPreferred = () => {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
const getAnimationClasses = (animationType = "fade") => {
  if (isReducedMotionPreferred()) {
    return "";
  }
  switch (animationType) {
    case "fade":
      return "blog-fade-in";
    case "slide":
      return "blog-slide-in";
    case "lift":
      return "blog-hover-lift";
    default:
      return "";
  }
};
const getStaggeredDelay = (index, delayMs = 100) => {
  if (isReducedMotionPreferred()) {
    return "";
  }
  const delay = Math.min(index * delayMs, 500);
  return `blog-delay-${delay}`;
};
const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(" ").trim();
};
const EMAIL_CONFIG = {
  // IDs do EmailJS (podem ser públicos)
  SERVICE_ID: "service_rn9v8zj",
  TEMPLATE_ID: "template_yqc7zqk",
  // Chave pública (pode ser exposta no frontend)
  PUBLIC_KEY: "2FZ-ZnMRFUaI-c8CD",
  // Email de destino
  CONTACT_EMAIL: "alessandro.ferreira@escolahabilidade.com",
  // WhatsApp para fallback
  WHATSAPP_NUMBER: "5548988559491"
};
const isEmailConfigured = () => {
  return EMAIL_CONFIG.SERVICE_ID.length > 0 && EMAIL_CONFIG.TEMPLATE_ID.length > 0 && EMAIL_CONFIG.PUBLIC_KEY.length > 0;
};
process.env.NODE_ENV === "production" ? "https://www.escolahabilidade.com" : "http://localhost:5173";
const COURSE_SLUGS = {
  PROJETISTA_3D: "projetista-3d",
  EDICAO_VIDEO: "edicao-video",
  INFORMATICA: "informatica",
  DESIGN_GRAFICO: "design-grafico",
  PROGRAMACAO: "programacao",
  MARKETING_DIGITAL: "marketing-digital",
  INTELIGENCIA_ARTIFICIAL: "inteligencia-artificial",
  BUSINESS_INTELLIGENCE: "business-intelligence",
  ADMINISTRACAO: "administracao"
};
class BackgroundPreloader {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.loadingPromises = /* @__PURE__ */ new Map();
    this.priorities = /* @__PURE__ */ new Map();
    this.maxConcurrentLoads = 1;
    this.currentLoads = 0;
    this.loadQueue = [];
    this.setPriorities([
      COURSE_SLUGS.PROJETISTA_3D,
      // 1º - Homepage destacado
      COURSE_SLUGS.DESIGN_GRAFICO,
      // 2º - Popular
      COURSE_SLUGS.PROGRAMACAO,
      // 3º - Popular
      COURSE_SLUGS.MARKETING_DIGITAL,
      // 4º - Popular
      COURSE_SLUGS.INFORMATICA,
      // 5º - Base técnica
      COURSE_SLUGS.EDICAO_VIDEO,
      // 6º - Criativo
      COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL,
      // 7º - Avançado
      COURSE_SLUGS.BUSINESS_INTELLIGENCE
      // 8º - Especializado
    ]);
    this.setupPeriodicCleanup();
  }
  setPriorities(courseOrder) {
    courseOrder.forEach((courseSlug, index) => {
      this.priorities.set(courseSlug, index);
    });
  }
  async preloadBackground(courseSlug, options = {}) {
    const {
      priority = this.priorities.get(courseSlug) || 999,
      force = false,
      deviceCapabilities = null
    } = options;
    if (!force && this.cache.has(courseSlug)) {
      return this.cache.get(courseSlug);
    }
    if (this.loadingPromises.has(courseSlug)) {
      return this.loadingPromises.get(courseSlug);
    }
    const loadPromise = this.loadBackgroundComponent(courseSlug, deviceCapabilities);
    this.loadingPromises.set(courseSlug, loadPromise);
    try {
      const component = await loadPromise;
      this.cache.set(courseSlug, component);
      this.loadingPromises.delete(courseSlug);
      console.log(`[BackgroundPreloader] Successfully loaded: ${courseSlug}`);
      return component;
    } catch (error) {
      this.loadingPromises.delete(courseSlug);
      console.warn(`[BackgroundPreloader] Failed to load ${courseSlug}:`, error);
      throw error;
    }
  }
  async loadBackgroundComponent(courseSlug, deviceCapabilities) {
    const componentMap = {
      [COURSE_SLUGS.PROJETISTA_3D]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.P),
      [COURSE_SLUGS.EDICAO_VIDEO]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.E),
      [COURSE_SLUGS.INFORMATICA]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.I),
      [COURSE_SLUGS.DESIGN_GRAFICO]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.D),
      [COURSE_SLUGS.PROGRAMACAO]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.a),
      [COURSE_SLUGS.MARKETING_DIGITAL]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.M),
      [COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.b),
      [COURSE_SLUGS.BUSINESS_INTELLIGENCE]: () => import("./backgrounds-Cnn5dnKm.js").then((n) => n.B)
    };
    const loader = componentMap[courseSlug];
    if (!loader) {
      throw new Error(`No background component found for: ${courseSlug}`);
    }
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Background load timeout")), 1e4);
    });
    const loadedModule = await Promise.race([loader(), timeoutPromise]);
    return loadedModule.default;
  }
  async preloadAdjacentBackgrounds(currentCourseSlug, deviceCapabilities) {
    const allCourses = Object.values(COURSE_SLUGS);
    const currentIndex = allCourses.indexOf(currentCourseSlug);
    if (currentIndex === -1) return;
    const shouldPreload = this.shouldPreloadMore(deviceCapabilities);
    const preloadCount = shouldPreload ? 3 : 2;
    const toPreload = [];
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (currentIndex + i) % allCourses.length;
      const prevIndex = (currentIndex - i + allCourses.length) % allCourses.length;
      toPreload.push(allCourses[nextIndex]);
      if (i <= 1) {
        toPreload.push(allCourses[prevIndex]);
      }
    }
    const uniqueToPreload = [...new Set(toPreload)].filter((slug) => slug !== currentCourseSlug);
    const preloadPromises = uniqueToPreload.map(
      (slug, index) => this.schedulePreload(slug, {
        priority: index,
        deviceCapabilities
      })
    );
    Promise.allSettled(preloadPromises).then((results) => {
      const successful = results.filter((r) => r.status === "fulfilled").length;
      console.log(`[BackgroundPreloader] Preloaded ${successful}/${uniqueToPreload.length} adjacent backgrounds`);
    });
  }
  shouldPreloadMore(deviceCapabilities) {
    if (!deviceCapabilities) return false;
    return deviceCapabilities.estimatedRAM >= 8 && !deviceCapabilities.isMobile && deviceCapabilities.effectiveNetworkType !== "slow-2g";
  }
  async schedulePreload(courseSlug, options = {}) {
    return new Promise((resolve, reject) => {
      const task = {
        courseSlug,
        options,
        resolve,
        reject
      };
      if (this.currentLoads < this.maxConcurrentLoads) {
        this.executePreload(task);
      } else {
        this.loadQueue.push(task);
        this.loadQueue.sort((a, b) => (a.options.priority || 999) - (b.options.priority || 999));
      }
    });
  }
  async executePreload(task) {
    this.currentLoads++;
    try {
      const component = await this.preloadBackground(task.courseSlug, task.options);
      task.resolve(component);
    } catch (error) {
      task.reject(error);
    } finally {
      this.currentLoads--;
      if (this.loadQueue.length > 0) {
        const nextTask = this.loadQueue.shift();
        this.executePreload(nextTask);
      }
    }
  }
  // Preload prioritário para homepage
  async preloadCriticalBackgrounds(deviceCapabilities) {
    const critical = [
      COURSE_SLUGS.PROJETISTA_3D,
      // Primeiro da lista
      COURSE_SLUGS.DESIGN_GRAFICO,
      // Popular
      COURSE_SLUGS.PROGRAMACAO
      // Popular
    ];
    console.log("[BackgroundPreloader] Starting critical preload...");
    try {
      await this.preloadBackground(critical[0], { priority: 0, deviceCapabilities });
      if (this.shouldPreloadMore(deviceCapabilities)) {
        critical.slice(1).forEach((slug, index) => {
          this.schedulePreload(slug, {
            priority: index + 1,
            deviceCapabilities
          });
        });
      }
    } catch (error) {
      console.warn("[BackgroundPreloader] Critical preload failed:", error);
    }
  }
  // Limpar cache se necessário (para memory management)
  clearCache(keepRecent = 2) {
    if (this.cache.size <= keepRecent) return;
    const entries = Array.from(this.cache.entries());
    const toKeep = entries.slice(-keepRecent);
    this.cache.clear();
    toKeep.forEach(([key, value]) => {
      this.cache.set(key, value);
    });
    console.log(`[BackgroundPreloader] Cache cleared, kept ${toKeep.length} recent items`);
  }
  // Limpeza automática periódica
  setupPeriodicCleanup() {
    setInterval(() => {
      if (this.cache.size > 3) {
        this.clearCache(2);
        console.log("[BackgroundPreloader] Periodic cache cleanup executed");
      }
    }, 5 * 60 * 1e3);
  }
  // Estatísticas para debugging
  getStats() {
    return {
      cacheSize: this.cache.size,
      loading: this.loadingPromises.size,
      queueLength: this.loadQueue.length,
      currentLoads: this.currentLoads,
      cachedBackgrounds: Array.from(this.cache.keys())
    };
  }
  // Cleanup para memory leaks
  destroy() {
    this.cache.clear();
    this.loadingPromises.clear();
    this.loadQueue.length = 0;
    this.priorities.clear();
  }
}
new BackgroundPreloader();
const useViewportSize = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: typeof window !== "undefined" ? window.innerWidth < 768 : false,
    isTablet: typeof window !== "undefined" ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  });
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };
    window.addEventListener("resize", updateViewport);
    updateViewport();
    return () => window.removeEventListener("resize", updateViewport);
  }, []);
  return viewport;
};
const AREA_ICONS = {
  "informatica": {
    normal: Monitor,
    special: Gear
  },
  "design-grafico": {
    normal: PenNib,
    special: MagicWand
  },
  "programacao": {
    normal: Code,
    special: Lightning
  },
  "marketing-digital": {
    normal: Megaphone,
    special: Target
  },
  "inteligencia-artificial": {
    normal: Robot,
    special: Sparkle
  },
  "business-intelligence": {
    normal: ChartBar,
    special: ChartLine
  },
  "projetista-3d": {
    normal: Cube,
    special: Buildings
  }
};
const getLessonIconByArea = (courseSlug, lessonType) => {
  const areaIcons = AREA_ICONS[courseSlug];
  if (!areaIcons) {
    switch (lessonType) {
      case "text":
        return Article;
      case "exercise":
        return PuzzlePiece;
      case "project":
        return RocketLaunch;
      default:
        return Monitor;
    }
  }
  switch (lessonType) {
    case "video":
      return areaIcons.normal;
    case "text":
      return Article;
    case "exercise":
      return areaIcons.special;
    case "project":
      return areaIcons.special;
    default:
      return areaIcons.normal;
  }
};
const LESSON_LABELS = {
  "informatica": {
    video: "Digital",
    text: "Teoria",
    exercise: "Prática",
    project: "Projeto"
  },
  "design-grafico": {
    video: "Criação",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  },
  "programacao": {
    video: "Código",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  },
  "marketing-digital": {
    video: "Campanha",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  },
  "inteligencia-artificial": {
    video: "Automação",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  },
  "business-intelligence": {
    video: "Análise",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  },
  "projetista-3d": {
    video: "Modelagem",
    text: "Teoria",
    exercise: "Exercício",
    project: "Projeto"
  }
};
const getLessonLabel = (courseSlug, lessonType) => {
  const areaLabels = LESSON_LABELS[courseSlug];
  if (!areaLabels) {
    switch (lessonType) {
      case "video":
        return "Aula";
      case "text":
        return "Teoria";
      case "exercise":
        return "Exercício";
      case "project":
        return "Projeto";
      default:
        return "Aula";
    }
  }
  return areaLabels[lessonType] || "Aula";
};
const useOptimizedBlogSearch = (initialSearch = "", initialCategory = "") => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch);
  const debounceTimeoutRef = useRef(null);
  const searchCountRef = useRef(0);
  useEffect(() => {
    setIsSearching(true);
    searchCountRef.current += 1;
    const currentSearchCount = searchCountRef.current;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (currentSearchCount === searchCountRef.current) {
        setDebouncedSearchQuery(searchQuery);
        setIsSearching(false);
      }
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching
  } = useInfinitePosts(12, selectedCategory || null, debouncedSearchQuery || null);
  const posts = useMemo(() => {
    var _a;
    return ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page.posts)) || [];
  }, [data]);
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);
  const handleCategoryChange = useCallback((categorySlug) => {
    setSelectedCategory(categorySlug);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 150);
  }, []);
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setIsSearching(false);
  }, []);
  return {
    // State
    searchQuery,
    selectedCategory,
    debouncedSearchQuery,
    isSearching,
    // Data
    posts,
    data,
    error,
    // Loading states
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    // Actions
    handleSearchChange,
    handleCategoryChange,
    clearFilters,
    fetchNextPage,
    // Computed
    hasActiveFilters: !!(debouncedSearchQuery || selectedCategory),
    isLoadingWithTransition: isLoading || isSearching && !posts.length
  };
};
const whatsappTemplates = {
  // Generic template for general inquiries
  generic: {
    message: "Vi o site da Escola Habilidade e gostaria de saber mais sobre os cursos disponíveis. Pode me ajudar?",
    includeGreeting: true
  },
  // Templates by context (where the contact originated)
  byContext: {
    "floating-button": {
      message: "Vi seu site e tenho interesse nos cursos da Escola Habilidade. Pode me dar mais informações?",
      includeGreeting: true
    },
    "contact-section": {
      message: 'Li o artigo "{article}" e fiquei interessado(a) em saber mais sobre os cursos relacionados. Vocês podem me ajudar?',
      includeGreeting: true
    },
    "article": {
      message: 'Acabei de ler o artigo "{article}" e gostaria de conversar sobre como posso me aprofundar nessa área através dos cursos de vocês.',
      includeGreeting: true
    },
    "quick-contact": {
      message: "Gostaria de uma consulta rápida sobre os cursos da Escola Habilidade. Podem me atender?",
      includeGreeting: true
    },
    "consultation-widget": {
      message: "Gostaria de agendar a consulta gratuita de 15 minutos para conversar sobre os cursos.",
      includeGreeting: true
    }
  },
  // Templates by article category
  byCategory: {
    "tecnologia": {
      message: 'Li sobre {category} no artigo "{article}" e quero saber mais sobre os cursos de tecnologia de vocês. Quais são as opções disponíveis?',
      includeGreeting: true
    },
    "educacao": {
      message: 'O artigo "{article}" me interessou muito! Gostaria de saber como posso me capacitar melhor na área educacional com os cursos de vocês.',
      includeGreeting: true
    },
    "carreira": {
      message: 'Depois de ler "{article}", percebi que preciso me qualificar melhor. Quais cursos vocês recomendam para desenvolvimento de carreira?',
      includeGreeting: true
    },
    "design": {
      message: 'Vi o artigo sobre {category} "{article}" e fiquei muito interessado(a) nos cursos de design! Podem me dar mais detalhes?',
      includeGreeting: true
    },
    "programacao": {
      message: 'O artigo "{article}" me motivou a aprender programação! Quais são os cursos disponíveis nessa área?',
      includeGreeting: true
    },
    "marketing": {
      message: 'Li sobre {category} no artigo "{article}" e quero me especializar em marketing digital. Que cursos vocês oferecem?',
      includeGreeting: true
    },
    "inteligencia-artificial": {
      message: 'Após ler "{article}", fiquei fascinado(a) com IA! Vocês têm cursos nessa área? Como posso começar?',
      includeGreeting: true
    },
    "business-intelligence": {
      message: 'O artigo "{article}" sobre BI me interessou muito. Gostaria de saber sobre os cursos de análise de dados de vocês.',
      includeGreeting: true
    }
  }
};
const generateWhatsAppMessage = ({
  article = null,
  category = null,
  url = "",
  context = "generic",
  isMobile = false
}) => {
  const device = isMobile ? "mobile" : "desktop";
  let template;
  if (article && category) {
    template = whatsappTemplates.byCategory[category.toLowerCase()] || whatsappTemplates.byContext[context] || whatsappTemplates.generic;
  } else if (article) {
    template = whatsappTemplates.byContext.article || whatsappTemplates.generic;
  } else {
    template = whatsappTemplates.byContext[context] || whatsappTemplates.generic;
  }
  const trackedUrl = addUTMParameters(url, {
    source: "whatsapp",
    medium: "direct-message",
    campaign: "blog-contact",
    content: context,
    term: category || "general"
  });
  let message = template.message.replace("{article}", article || "").replace("{category}", category || "").replace("{url}", trackedUrl).replace("{device}", device);
  const greeting = getTimeBasedGreeting();
  if (template.includeGreeting !== false) {
    message = `${greeting} ${message}`;
  }
  const businessHoursNote = getBusinessHoursNote();
  if (businessHoursNote) {
    message += `

${businessHoursNote}`;
  }
  return message.trim();
};
const getTimeBasedGreeting = () => {
  const hour = (/* @__PURE__ */ new Date()).getHours();
  if (hour >= 5 && hour < 12) {
    return "Bom dia!";
  } else if (hour >= 12 && hour < 18) {
    return "Boa tarde!";
  } else {
    return "Boa noite!";
  }
};
const getBusinessHoursNote = () => {
  const now = /* @__PURE__ */ new Date();
  const hour = now.getHours();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const isBusinessHours = hour >= 8 && hour < 18;
  if (isWeekend) {
    return "=� Hoje � fim de semana, mas respondo assim que poss�vel! Durante a semana atendo das 8h �s 18h.";
  } else if (!isBusinessHours) {
    if (hour < 8) {
      return "� Ainda � cedo, mas j� estou aqui! Hor�rio de atendimento: 8h �s 18h, segunda a sexta.";
    } else {
      return "< J� passou do hor�rio comercial, mas vou responder o mais breve poss�vel! Hor�rio normal: 8h �s 18h, segunda a sexta.";
    }
  }
  return null;
};
const addUTMParameters = (url, utmParams) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(`utm_${key}`, value);
      }
    });
    return urlObj.toString();
  } catch (error) {
    console.warn("Error adding UTM parameters:", error);
    return url;
  }
};
const useContactAnalytics = () => {
  const trackContactClick = useCallback((data) => {
    const {
      channel,
      // whatsapp, email, phone
      source,
      // floating-button, contact-section, quick-modal
      article = "unknown",
      category = "unknown",
      position = "unknown",
      message = ""
    } = data;
    if (typeof gtag !== "undefined") {
      gtag("event", "contact_click", {
        event_category: "Contact",
        event_label: `${channel}_${source}`,
        custom_parameter_1: article,
        custom_parameter_2: category,
        custom_parameter_3: position,
        value: 1
      });
    }
    const trackingData = {
      event: "contact_click",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      channel,
      source,
      article,
      category,
      position,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
      message: message.substring(0, 100)
      // First 100 chars for privacy
    };
    sendAnalytics(trackingData);
    storeContactInteraction(trackingData);
    console.log("Contact interaction tracked:", trackingData);
  }, []);
  const trackFormSubmission = useCallback((data) => {
    const {
      formType,
      // contact-form, quick-contact, consultation
      source,
      article = "unknown",
      success = false
    } = data;
    if (typeof gtag !== "undefined") {
      gtag("event", "form_submit", {
        event_category: "Form",
        event_label: formType,
        custom_parameter_1: source,
        custom_parameter_2: article,
        value: success ? 1 : 0
      });
    }
    const trackingData = {
      event: "form_submission",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      formType,
      source,
      article,
      success,
      url: window.location.href,
      sessionId: getSessionId()
    };
    sendAnalytics(trackingData);
    storeContactInteraction(trackingData);
  }, []);
  const trackEngagement = useCallback((data) => {
    const {
      article,
      timeOnPage,
      scrollDepth,
      interactions = []
    } = data;
    const engagementScore = calculateEngagementScore(timeOnPage, scrollDepth, interactions);
    const trackingData = {
      event: "page_engagement",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      article,
      timeOnPage,
      scrollDepth,
      interactions: interactions.length,
      engagementScore,
      url: window.location.href,
      sessionId: getSessionId()
    };
    sendAnalytics(trackingData);
    localStorage.setItem("lastEngagement", JSON.stringify(trackingData));
  }, []);
  const getConversionMetrics = useCallback(() => {
    try {
      const interactions = JSON.parse(localStorage.getItem("contactInteractions") || "[]");
      const last30Days = interactions.filter(
        (interaction) => Date.now() - new Date(interaction.timestamp).getTime() < 30 * 24 * 60 * 60 * 1e3
      );
      const metrics = {
        totalInteractions: last30Days.length,
        whatsappClicks: last30Days.filter((i) => i.channel === "whatsapp").length,
        emailClicks: last30Days.filter((i) => i.channel === "email").length,
        phoneClicks: last30Days.filter((i) => i.channel === "phone").length,
        topSources: getTopSources(last30Days),
        topArticles: getTopArticles(last30Days),
        conversionByHour: getConversionByHour(last30Days)
      };
      return metrics;
    } catch (error) {
      console.error("Error getting conversion metrics:", error);
      return null;
    }
  }, []);
  return {
    trackContactClick,
    trackFormSubmission,
    trackEngagement,
    getConversionMetrics
  };
};
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("contactSessionId");
  if (!sessionId) {
    sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("contactSessionId", sessionId);
  }
  return sessionId;
};
const sendAnalytics = async (data) => {
  try {
    console.log("Analytics data:", data);
  } catch (error) {
    console.error("Error sending analytics:", error);
  }
};
const storeContactInteraction = (data) => {
  try {
    const interactions = JSON.parse(localStorage.getItem("contactInteractions") || "[]");
    interactions.push(data);
    if (interactions.length > 100) {
      interactions.splice(0, interactions.length - 100);
    }
    localStorage.setItem("contactInteractions", JSON.stringify(interactions));
  } catch (error) {
    console.error("Error storing interaction:", error);
  }
};
const calculateEngagementScore = (timeOnPage, scrollDepth, interactions) => {
  let score = 0;
  score += Math.min(timeOnPage / 60 * 10, 30);
  score += scrollDepth * 30;
  score += Math.min(interactions.length * 10, 40);
  return Math.round(score);
};
const getTopSources = (interactions) => {
  const sources = {};
  interactions.forEach((interaction) => {
    const source = interaction.source || "unknown";
    sources[source] = (sources[source] || 0) + 1;
  });
  return Object.entries(sources).sort(([, a], [, b]) => b - a).slice(0, 5).map(([source, count]) => ({ source, count }));
};
const getTopArticles = (interactions) => {
  const articles = {};
  interactions.forEach((interaction) => {
    const article = interaction.article || "unknown";
    if (article !== "unknown") {
      articles[article] = (articles[article] || 0) + 1;
    }
  });
  return Object.entries(articles).sort(([, a], [, b]) => b - a).slice(0, 5).map(([article, count]) => ({ article, count }));
};
const getConversionByHour = (interactions) => {
  const hourly = {};
  interactions.forEach((interaction) => {
    const hour = new Date(interaction.timestamp).getHours();
    hourly[hour] = (hourly[hour] || 0) + 1;
  });
  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: hourly[hour] || 0
  }));
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
    const progress = calculateScrollProgress();
    setScrollProgress(progress);
    if (enableSticky && deviceType === "mobile") {
      setShowSticky(progress >= stickyThreshold);
    }
  }, [calculateScrollProgress, enableSticky, deviceType, stickyThreshold]);
  useEffect(() => {
    setDeviceType(detectDeviceType());
    setIsTouch(detectTouch());
    if (typeof window !== "undefined") window.addEventListener("resize", handleResize);
    if (typeof window !== "undefined") window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (typeof window !== "undefined") window.removeEventListener("resize", handleResize);
      if (typeof window !== "undefined") window.removeEventListener("scroll", handleScroll);
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
      const cleanText = text.replace(/(\w)\n+(\:|\w)/g, "$1 $2").trim();
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
function processContent(content, slug) {
  if (!content || typeof content !== "string") return "";
  let processedContent = content;
  try {
    if (typeof window !== "undefined") {
      Promise.resolve().then(() => blogImageMigration$1).then(({ default: blogImageMigration2 }) => {
        processedContent = blogImageMigration2.migrateBlogContent(processedContent);
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
  if (typeof window !== "undefined") {
    setTimeout(() => {
      Promise.resolve().then(() => blogImageMigration$1).then(({ default: blogImageMigration2 }) => {
        blogImageMigration2.optimizeExistingImages().then((results) => {
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
class MemoryManager {
  constructor() {
    this.activeAnimations = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.canvasContexts = /* @__PURE__ */ new Set();
    this.timers = /* @__PURE__ */ new Set();
    this.isTabActive = true;
    this.memoryThreshold = 100 * 1024 * 1024;
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      this.setupVisibilityAPI();
      this.setupMemoryMonitoring();
    }
  }
  // API de Visibilidade - pausa animações quando aba não está ativa
  setupVisibilityAPI() {
    if (typeof document === "undefined") {
      console.warn("[MemoryManager] Skipping visibility API setup - running in SSR environment");
      return;
    }
    const handleVisibilityChange = () => {
      this.isTabActive = !document.hidden;
      if (!this.isTabActive) {
        this.pauseAllAnimations();
        console.log("[MemoryManager] Tab inactive - animations paused");
      } else {
        this.resumeAllAnimations();
        console.log("[MemoryManager] Tab active - animations resumed");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    this.eventListeners.set("document:visibilitychange", handleVisibilityChange);
  }
  // Monitoramento de memória (quando suportado)
  setupMemoryMonitoring() {
    if (typeof performance === "undefined" || !("memory" in performance)) return;
    const checkMemory = () => {
      const memory = performance.memory;
      const usedMB = memory.usedJSHeapSize / 1024 / 1024;
      if (usedMB > 150) {
        console.warn(`[MemoryManager] High memory usage: ${usedMB.toFixed(1)}MB`);
        this.emergencyCleanup();
      }
    };
    const intervalId = setInterval(checkMemory, 3e4);
    this.timers.add(intervalId);
  }
  // Registrar animação
  registerAnimation(id, pauseFn, resumeFn, cleanupFn) {
    const animation = {
      id,
      pauseFn: pauseFn || (() => {
      }),
      resumeFn: resumeFn || (() => {
      }),
      cleanupFn: cleanupFn || (() => {
      }),
      isPaused: false
    };
    this.activeAnimations.add(animation);
    return animation;
  }
  // Pausar todas as animações
  pauseAllAnimations() {
    this.activeAnimations.forEach((animation) => {
      if (!animation.isPaused) {
        animation.pauseFn();
        animation.isPaused = true;
      }
    });
  }
  // Retomar todas as animações
  resumeAllAnimations() {
    if (!this.isTabActive) return;
    this.activeAnimations.forEach((animation) => {
      if (animation.isPaused) {
        animation.resumeFn();
        animation.isPaused = false;
      }
    });
  }
  // Remover animação
  unregisterAnimation(animation) {
    if (animation && animation.cleanupFn) {
      animation.cleanupFn();
    }
    this.activeAnimations.delete(animation);
  }
  // Registrar event listener para cleanup automático
  registerEventListener(element, event, handler, options) {
    const key = `${element.constructor.name}:${event}`;
    element.addEventListener(event, handler, options);
    if (!this.eventListeners.has(key)) {
      this.eventListeners.set(key, []);
    }
    this.eventListeners.get(key).push({ element, handler, options });
  }
  // Registrar contexto de canvas
  registerCanvasContext(context) {
    this.canvasContexts.add(context);
  }
  // Limpeza de emergência
  emergencyCleanup() {
    console.log("[MemoryManager] Emergency cleanup triggered");
    this.pauseAllAnimations();
    if (window.gc) {
      window.gc();
    }
    this.canvasContexts.forEach((ctx) => {
      if (ctx && ctx.canvas) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }
    });
    setTimeout(() => {
      if (this.isTabActive) {
        this.resumeAllAnimations();
        console.log("[MemoryManager] Animations resumed after cleanup");
      }
    }, 2e3);
  }
  // Limpeza completa
  destroy() {
    this.activeAnimations.forEach((animation) => {
      this.unregisterAnimation(animation);
    });
    this.activeAnimations.clear();
    this.eventListeners.forEach((listeners, key) => {
      listeners.forEach(({ element, handler, options }) => {
        element.removeEventListener(key.split(":")[1], handler, options);
      });
    });
    this.eventListeners.clear();
    this.timers.forEach((timerId) => {
      clearInterval(timerId);
    });
    this.timers.clear();
    this.canvasContexts.clear();
  }
  // Estatísticas para debug
  getStats() {
    const memoryInfo = "memory" in performance ? {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    } : { used: "N/A", total: "N/A", limit: "N/A" };
    return {
      activeAnimations: this.activeAnimations.size,
      eventListeners: this.eventListeners.size,
      canvasContexts: this.canvasContexts.size,
      timers: this.timers.size,
      isTabActive: this.isTabActive,
      memory: memoryInfo
    };
  }
}
const memoryManager = new MemoryManager();
class BlogImageMigration {
  constructor() {
    this.processedImages = /* @__PURE__ */ new Map();
    this.optimizationStats = {
      totalImages: 0,
      optimizedImages: 0,
      errors: 0,
      skipped: 0
    };
  }
  /**
   * Process blog content and replace img tags with SmartBlogImage components
   */
  migrateBlogContent(content) {
    if (!content || typeof content !== "string") {
      return content;
    }
    try {
      const root = parse(content);
      const images = root.querySelectorAll("img");
      this.optimizationStats.totalImages += images.length;
      images.forEach((img, index) => {
        const src = img.getAttribute("src");
        const alt = img.getAttribute("alt") || "";
        const className = img.getAttribute("class") || "";
        if (!src) {
          this.optimizationStats.skipped++;
          return;
        }
        const isLocalBlogImage = src.includes("/images/blog/") || src.startsWith("/images/");
        if (isLocalBlogImage) {
          const smartImageHtml = this.generateSmartImageHtml(src, alt, className, index);
          img.replaceWith(parse(smartImageHtml));
          this.optimizationStats.optimizedImages++;
        } else {
          this.optimizationStats.skipped++;
        }
      });
      return root.toString();
    } catch (error) {
      console.error("Erro ao migrar conteúdo do blog:", error);
      this.optimizationStats.errors++;
      return content;
    }
  }
  /**
   * Generate SmartBlogImage HTML wrapper
   */
  generateSmartImageHtml(src, alt, className = "", index = 0) {
    const imageId = `smart-blog-img-${Date.now()}-${index}`;
    return `
      <div class="smart-blog-image-container" data-image-id="${imageId}">
        <img 
          src="${src}" 
          alt="${alt}" 
          class="smart-blog-image ${className}"
          data-smart-optimization="true"
          loading="lazy"
          decoding="async"
        />
        <script type="application/json" class="smart-image-config">
          {
            "src": "${src}",
            "alt": "${alt}",
            "originalClass": "${className}",
            "optimizationEnabled": true
          }
        <\/script>
      </div>
    `;
  }
  /**
   * Apply client-side image optimization to existing images
   */
  async optimizeExistingImages() {
    if (typeof document === "undefined") {
      console.warn("BlogImageMigration: document not available in SSR context");
      return [];
    }
    const smartImages = document.querySelectorAll('[data-smart-optimization="true"]');
    const results = [];
    for (const img of smartImages) {
      try {
        const result = await this.optimizeImage(img);
        results.push(result);
      } catch (error) {
        console.error("Erro ao otimizar imagem:", error);
        results.push({
          src: img.src,
          error: error.message,
          optimized: false
        });
      }
    }
    return results;
  }
  /**
   * Optimize individual image element
   */
  async optimizeImage(imgElement) {
    return new Promise((resolve) => {
      if (this.processedImages.has(imgElement.src)) {
        resolve(this.processedImages.get(imgElement.src));
        return;
      }
      const tempImg = new Image();
      tempImg.crossOrigin = "anonymous";
      tempImg.onload = () => {
        const { naturalWidth, naturalHeight } = tempImg;
        const isSmall = naturalWidth < 600;
        let result = {
          src: imgElement.src,
          originalDimensions: { width: naturalWidth, height: naturalHeight },
          optimized: false,
          message: "Imagem em tamanho adequado"
        };
        if (isSmall) {
          const optimizedSrc = this.createOptimizedVersion(tempImg);
          if (optimizedSrc) {
            imgElement.src = optimizedSrc;
            imgElement.classList.add("blog-image-optimized");
            const maxWidth = Math.min(600, naturalWidth * 2);
            imgElement.style.maxWidth = `${maxWidth}px`;
            imgElement.style.height = "auto";
            result = {
              ...result,
              optimized: true,
              optimizedSrc,
              message: `Imagem otimizada de ${naturalWidth}x${naturalHeight} para melhor qualidade`
            };
            if (process.env.NODE_ENV === "development" && typeof document !== "undefined") {
              const indicator = document.createElement("div");
              indicator.className = "absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-75";
              indicator.textContent = `Otimizada ${naturalWidth}x${naturalHeight}`;
              imgElement.parentElement.style.position = "relative";
              imgElement.parentElement.appendChild(indicator);
            }
          }
        }
        this.processedImages.set(imgElement.src, result);
        resolve(result);
      };
      tempImg.onerror = () => {
        const result = {
          src: imgElement.src,
          error: "Falha ao carregar imagem",
          optimized: false
        };
        this.processedImages.set(imgElement.src, result);
        resolve(result);
      };
      tempImg.src = imgElement.src;
    });
  }
  /**
   * Create optimized version of image using canvas
   */
  createOptimizedVersion(imgElement) {
    try {
      if (typeof document === "undefined") {
        console.warn("BlogImageMigration: document not available in SSR context");
        return null;
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const { naturalWidth, naturalHeight } = imgElement;
      const maxUpscale = 2;
      const targetWidth = Math.min(800, naturalWidth * maxUpscale);
      const targetHeight = naturalHeight * targetWidth / naturalWidth;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.filter = "contrast(1.05) brightness(1.01)";
      ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
      return canvas.toDataURL("image/jpeg", 0.9);
    } catch (error) {
      console.error("Erro ao criar versão otimizada:", error);
      return null;
    }
  }
  /**
   * Initialize automatic optimization for the entire page
   */
  initializePageOptimization() {
    if (typeof document === "undefined") {
      console.warn("BlogImageMigration: document not available in SSR context");
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.optimizeExistingImages();
      });
    } else {
      this.optimizeExistingImages();
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const images = node.querySelectorAll ? node.querySelectorAll('[data-smart-optimization="true"]') : [];
            images.forEach((img) => {
              this.optimizeImage(img);
            });
          }
        });
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    return observer;
  }
  /**
   * Get optimization statistics
   */
  getStats() {
    return {
      ...this.optimizationStats,
      processedImages: this.processedImages.size
    };
  }
  /**
   * Reset statistics and cache
   */
  reset() {
    this.processedImages.clear();
    this.optimizationStats = {
      totalImages: 0,
      optimizedImages: 0,
      errors: 0,
      skipped: 0
    };
  }
}
const blogImageMigration = new BlogImageMigration();
if (typeof window !== "undefined") {
  blogImageMigration.initializePageOptimization();
}
const blogImageMigration$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BlogImageMigration,
  default: blogImageMigration
}, Symbol.toStringTag, { value: "Module" }));
export {
  isEmailConfigured as A,
  useOptimizedBlogSearch as B,
  usePost as C,
  useInfinitePostsByCategory as D,
  EMAIL_CONFIG as E,
  useContactAnalytics as F,
  generateWhatsAppMessage as G,
  processContent as H,
  extractPlainText as I,
  useBlogResponsive as a,
  getStaggeredDelay as b,
  combineClasses as c,
  useCategories as d,
  useCTAResponsive as e,
  usePageContext as f,
  getAnimationClasses as g,
  useSmartCTA as h,
  getCourseBySlug as i,
  useToggle as j,
  usePerformanceLevel as k,
  useGoogleAnalytics as l,
  memoryManager as m,
  useUrlCleanup as n,
  useScrollToHash as o,
  domOptimizer as p,
  useTypewriter as q,
  useInView as r,
  searchCourses as s,
  usePosts as t,
  usePrefetchPost as u,
  useViewportSize as v,
  getLessonLabel as w,
  getLessonIconByArea as x,
  generateCourseMetadata as y,
  validateAndSanitizeCourse as z
};
