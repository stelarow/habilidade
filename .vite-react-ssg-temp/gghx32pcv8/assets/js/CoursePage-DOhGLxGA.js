import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useParams, useLoaderData, Navigate } from "react-router-dom";
import React, { useMemo, Suspense, lazy, useState, useDeferredValue, useLayoutEffect, useEffect, useRef } from "react";
import { Head } from "vite-react-ssg";
import { CheckCircle, Star, House, CaretRight, GraduationCap, Buildings, ChatCircle, Check, Phone, Envelope, User, PaperPlaneTilt, Briefcase, Target, ArrowRight, Lightning, Trophy, Crown, Wrench, Users, TrendUp, BookOpen, Eye, PencilLine, MapPin, CaretUp, CaretDown, Lightbulb, Desktop, ShieldCheck, Coffee, VideoCamera } from "@phosphor-icons/react";
import emailjs from "@emailjs/browser";
import { o as usePerformanceLevel, g as getCourseBySlug, a as COURSES_DATA, p as generateCourseMetadata, q as ErrorBoundary, T as TrustedCompanies, G as GradientButton, r as Loading, v as validateAndSanitizeCourse, t as isEmailConfigured, E as EMAIL_CONFIG } from "../../main.mjs";
import PropTypes from "prop-types";
import CourseCurriculum from "./CourseCurriculum-CyHszRRV.js";
import CourseTestimonials from "./CourseTestimonials-BREMzG4U.js";
import CourseWorkflowSection from "./CourseWorkflowSection-CqDk2yhF.js";
import CourseToolsOverview from "./CourseToolsOverview-BKbNiKfj.js";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "@supabase/supabase-js";
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
      [COURSE_SLUGS.PROJETISTA_3D]: () => import("./Projetista3DBackground-_a4yggrk.js"),
      [COURSE_SLUGS.EDICAO_VIDEO]: () => import("./EdicaoVideoBackground-DuPoDq84.js"),
      [COURSE_SLUGS.INFORMATICA]: () => import("./InformaticaBackground-BhlcFGXa.js"),
      [COURSE_SLUGS.DESIGN_GRAFICO]: () => import("./DesignGraficoBackground-40OtB4NG.js"),
      [COURSE_SLUGS.PROGRAMACAO]: () => import("./ProgramacaoBackground-VvCK0Wfr.js"),
      [COURSE_SLUGS.MARKETING_DIGITAL]: () => import("./MarketingDigitalBackground-BJZULzs4.js"),
      [COURSE_SLUGS.INTELIGENCIA_ARTIFICIAL]: () => import("./IABackground-pAVHl53i.js"),
      [COURSE_SLUGS.BUSINESS_INTELLIGENCE]: () => import("./BIBackground-D9Fno671.js")
    };
    const loader2 = componentMap[courseSlug];
    if (!loader2) {
      throw new Error(`No background component found for: ${courseSlug}`);
    }
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Background load timeout")), 1e4);
    });
    const loadedModule = await Promise.race([loader2(), timeoutPromise]);
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
const backgrounds = {
  "inteligencia-artificial": lazy(
    () => import("./IABackground-pAVHl53i.js").then((module) => ({ default: module.default }))
  ),
  "design-grafico": lazy(
    () => import("./DesignGraficoBackground-40OtB4NG.js").then((module) => ({ default: module.default }))
  ),
  "informatica": lazy(
    () => import("./InformaticaBackground-BhlcFGXa.js").then((module) => ({ default: module.default }))
  ),
  "programacao": lazy(
    () => import("./ProgramacaoBackground-VvCK0Wfr.js").then((module) => ({ default: module.default }))
  ),
  "marketing-digital": lazy(
    () => import("./MarketingDigitalBackground-BJZULzs4.js").then((module) => ({ default: module.default }))
  ),
  "business-intelligence": lazy(
    () => import("./BIBackground-D9Fno671.js").then((module) => ({ default: module.default }))
  ),
  "edicao-video": lazy(
    () => import("./EdicaoVideoBackground-DuPoDq84.js").then((module) => ({ default: module.default }))
  ),
  "projetista-3d": lazy(
    () => import("./Projetista3DBackground-_a4yggrk.js").then((module) => ({ default: module.default }))
  ),
  "administracao": lazy(
    () => import("./AdministracaoBackground-BZYEQfa6.js").then((module) => ({ default: module.default }))
  )
};
const StaticFallback = ({ courseSlug }) => {
  const gradients = {
    "inteligencia-artificial": "linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)",
    "design-grafico": "linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)",
    "informatica": "linear-gradient(135deg, #3742FA 0%, #2F3542 50%, #57606F 100%)",
    "programacao": "linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
    "marketing-digital": "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
    "business-intelligence": "linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)",
    "edicao-video": "linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%)",
    "projetista-3d": "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%)",
    "administracao": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "absolute inset-0 opacity-10 course-background",
      style: {
        background: gradients[courseSlug] || gradients["informatica"],
        willChange: "auto",
        zIndex: 1
      },
      "aria-hidden": "true"
    }
  );
};
const BackgroundLoader = () => /* @__PURE__ */ jsx("div", { className: "absolute inset-0 course-background", style: { zIndex: 1 }, "aria-hidden": "true", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-zinc-900/20 to-zinc-800/20 animate-pulse" }) });
const CourseBackground = ({ courseSlug, className = "", priority = false }) => {
  const { performanceLevel, deviceCapabilities } = usePerformanceLevel();
  const performanceConfig = useMemo(() => {
    const configs = {
      low: {
        staticFallback: false,
        particleCount: 6,
        enableAnimations: true,
        reducedMotion: false
      },
      medium: {
        staticFallback: false,
        particleCount: 12,
        enableAnimations: true,
        reducedMotion: false
      },
      high: {
        staticFallback: false,
        particleCount: 20,
        enableAnimations: true,
        reducedMotion: false
      }
    };
    return configs[performanceLevel] || configs.medium;
  }, [performanceLevel]);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    return /* @__PURE__ */ jsx(StaticFallback, { courseSlug });
  }
  const BackgroundComponent = backgrounds[courseSlug];
  if (!BackgroundComponent) {
    return /* @__PURE__ */ jsx(StaticFallback, { courseSlug });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `absolute inset-0 ${className} course-background`,
      style: { zIndex: 1 },
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx(
        Suspense,
        {
          fallback: /* @__PURE__ */ jsx(BackgroundLoader, {}),
          children: /* @__PURE__ */ jsx(
            BackgroundComponent,
            {
              performanceConfig,
              deviceCapabilities,
              courseSlug
            }
          )
        },
        `course-background-${courseSlug}`
      )
    }
  );
};
const CourseBackground$1 = React.memo(CourseBackground);
function CourseHero({ course, onEnrollClick }) {
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 });
  useDeferredValue(viewportDimensions);
  useLayoutEffect(() => {
    const updateDimensions = () => {
      setViewportDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions, { passive: true });
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "@container relative text-center mb-12 sm:mb-16 px-4",
      children: /* @__PURE__ */ jsxs("div", { className: "relative z-20 max-w-4xl mx-auto pt-16 sm:pt-20 pb-12 sm:pb-16", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "hidden @md:inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 transition-all duration-300 hover:scale-105 min-h-[36px]",
            style: {
              backgroundColor: `${course.themeColors.primary}20`,
              color: course.themeColors.primary,
              border: `1px solid ${course.themeColors.primary}40`,
              boxShadow: `0 0 20px ${course.themeColors.primary}20`
            },
            children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full flex-shrink-0", style: { backgroundColor: course.themeColors.primary } }),
              /* @__PURE__ */ jsxs("span", { children: [
                course.basicInfo.category,
                " • ",
                course.basicInfo.level,
                " • ",
                course.basicInfo.duration,
                course.basicInfo.certificate && /* @__PURE__ */ jsx("span", { children: " • Certificado" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "@md:hidden flex flex-col items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold mb-4 sm:mb-6 transition-all duration-300 hover:scale-105 max-w-xs mx-auto",
            style: {
              backgroundColor: `${course.themeColors.primary}15`,
              color: course.themeColors.primary,
              border: `1px solid ${course.themeColors.primary}30`,
              boxShadow: `0 0 20px ${course.themeColors.primary}15`
            },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-center", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full flex-shrink-0", style: { backgroundColor: course.themeColors.primary } }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  course.basicInfo.category,
                  " • ",
                  course.basicInfo.level
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-6 sm:w-8 h-px rounded-full",
                  style: { backgroundColor: course.themeColors.primary + "40" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 text-xs", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxs("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "currentColor", children: [
                    /* @__PURE__ */ jsx("path", { d: "M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" }),
                    /* @__PURE__ */ jsx("path", { d: "M13 7h-2v6l5.25 3.15.75-1.23L13 12.4z" })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "font-medium", children: course.basicInfo.duration })
                ] }),
                course.basicInfo.certificate && /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "w-1 h-1 rounded-full",
                      style: { backgroundColor: course.themeColors.primary }
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Certificado" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl sm:text-4xl @md:text-5xl @lg:text-6xl @xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-2xl sm:text-3xl @md:text-4xl @lg:text-5xl @xl:text-6xl mb-1 sm:mb-2", children: "Curso de" }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: "block bg-clip-text text-transparent bg-gradient-to-r",
              style: {
                backgroundImage: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
              },
              children: course.basicInfo.title
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-base sm:text-lg @md:text-xl @lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2", children: course.basicInfo.longDescription }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-8 sm:mb-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:gap-4", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: onEnrollClick,
              className: "group relative px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-white/20 min-h-[44px] min-w-[200px] touch-manipulation active:scale-95",
              style: {
                background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`,
                boxShadow: `0 10px 30px ${course.themeColors.primary}40`
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Garantir Minha Vaga" }),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    style: {
                      background: `linear-gradient(135deg, ${course.themeColors.gradient.to}, ${course.themeColors.gradient.from})`
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-gray-400 px-2", children: [
            /* @__PURE__ */ jsx(CheckCircle, { size: 14, weight: "duotone", className: "text-green-400 flex-shrink-0" }),
            /* @__PURE__ */ jsx("span", { children: "Entre em contato para valores e condições" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-full bg-red-600/20 border border-red-500/30 max-w-xs mx-auto", children: [
            /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "currentColor", className: "text-red-400", children: [
              /* @__PURE__ */ jsx("path", { d: "M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" }),
              /* @__PURE__ */ jsx("path", { d: "M11 11h2v6h-2zm0-4h2v2h-2z" })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-red-300 text-xs sm:text-sm font-medium", children: "TURMA LIMITADA: 3 alunos" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 @sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg sm:text-xl @md:text-2xl font-bold text-white", children: course.basicInfo.duration }),
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-400 leading-tight", children: "de conteúdo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg sm:text-xl @md:text-2xl font-bold text-white", children: course.curriculum.length }),
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-400 leading-tight", children: "módulos" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-lg sm:text-xl @md:text-2xl font-bold text-white", children: course.curriculum.reduce((total, module) => total + module.lessons.length, 0) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-400 leading-tight", children: "aulas" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center p-3 rounded-lg bg-gray-800/20 min-h-[64px] flex flex-col justify-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-1 text-lg sm:text-xl @md:text-2xl font-bold text-white", children: [
              /* @__PURE__ */ jsx(Star, { size: 16, weight: "fill", className: "text-yellow-400" }),
              "5.0"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm text-gray-400 leading-tight", children: "avaliação" })
          ] })
        ] })
      ] })
    }
  );
}
CourseHero.propTypes = {
  course: PropTypes.shape({
    basicInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      certificate: PropTypes.bool.isRequired,
      longDescription: PropTypes.string.isRequired
    }).isRequired,
    curriculum: PropTypes.arrayOf(PropTypes.shape({
      lessons: PropTypes.array.isRequired
    })).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gradient: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired,
  onEnrollClick: PropTypes.func
};
CourseHero.defaultProps = {
  onEnrollClick: () => {
  }
};
function CourseBreadcrumb({ course }) {
  const breadcrumbs = [
    { name: "Início", url: "/", icon: House },
    { name: "Cursos", url: "/#cursos" },
    { name: course.basicInfo.title, url: `/cursos/${course.basicInfo.slug}`, current: true }
  ];
  return /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-b border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 py-4", children: [
    /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "flex items-center space-x-2 text-sm", children: breadcrumbs.map((item, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const IconComponent = item.icon;
      return /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        isLast ? /* @__PURE__ */ jsxs(
          "span",
          {
            className: "font-medium flex items-center gap-1",
            style: { color: course.themeColors.primary },
            "aria-current": "page",
            children: [
              IconComponent && /* @__PURE__ */ jsx(IconComponent, { size: 16, weight: "duotone" }),
              item.name
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.url,
            className: "text-gray-400 hover:text-white transition-colors flex items-center gap-1",
            children: [
              IconComponent && /* @__PURE__ */ jsx(IconComponent, { size: 16, weight: "duotone" }),
              item.name
            ]
          }
        ),
        !isLast && /* @__PURE__ */ jsx(CaretRight, { size: 14, className: "text-gray-600 mx-2" })
      ] }, item.name);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "w-2 h-2 rounded-full",
            style: { backgroundColor: course.themeColors.primary }
          }
        ),
        course.basicInfo.category
      ] }),
      /* @__PURE__ */ jsx("div", { children: "•" }),
      /* @__PURE__ */ jsx("div", { children: course.basicInfo.level }),
      /* @__PURE__ */ jsx("div", { children: "•" }),
      /* @__PURE__ */ jsx("div", { children: course.basicInfo.duration }),
      course.basicInfo.certificate && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { children: "•" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(GraduationCap, { size: 16, weight: "duotone", className: "text-purple-400" }),
          "Certificado"
        ] })
      ] })
    ] })
  ] }) });
}
CourseBreadcrumb.propTypes = {
  course: PropTypes.shape({
    basicInfo: PropTypes.shape({
      title: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
      certificate: PropTypes.bool.isRequired
    }).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
const ICON_MAP = {
  BookOpen,
  TrendUp,
  Users,
  House,
  Wrench,
  Crown,
  Trophy,
  Star,
  Lightning,
  CheckCircle,
  ArrowRight,
  Target,
  Briefcase,
  PaperPlaneTilt,
  User,
  Envelope,
  Phone,
  Check,
  ChatCircle,
  Buildings
};
const ICON_CONFIGS = {
  whyStudy: {
    size: 32,
    weight: "duotone",
    className: "transition-all duration-300"
  },
  journey: {
    size: 24,
    weight: "duotone",
    className: "transition-all duration-300"
  },
  cta: {
    size: 20,
    weight: "bold",
    className: "transition-all duration-300"
  },
  benefits: {
    size: 20,
    weight: "duotone",
    className: "transition-colors duration-200"
  }
};
function IconWrapper({
  name,
  context = "benefits",
  color = null,
  size = null,
  weight = null,
  className = "",
  ...props
}) {
  const IconComponent = ICON_MAP[name] || BookOpen;
  const config = ICON_CONFIGS[context] || ICON_CONFIGS.benefits;
  const finalProps = {
    size: size || config.size,
    weight: weight || config.weight,
    className: `${config.className} ${className}`.trim(),
    ...color && { style: { color } },
    ...props
  };
  return /* @__PURE__ */ jsx(IconComponent, { ...finalProps });
}
function getIconForContext(iconName, context, color = null, overrides = {}) {
  return /* @__PURE__ */ jsx(
    IconWrapper,
    {
      name: iconName,
      context,
      color,
      ...overrides
    }
  );
}
function CourseWhyStudy({ course }) {
  var _a;
  const defaultBenefits = [
    {
      icon: "BookOpen",
      title: "Guia de aprendizado estruturado",
      description: "Metodologia estruturada para acelerar seu progresso do básico ao avançado"
    },
    {
      icon: "TrendUp",
      title: "Do básico ao avançado",
      description: "Evolua gradualmente até dominar completamente a profissão"
    },
    {
      icon: "Users",
      title: "Você dentro do mercado",
      description: "Habilidades realmente demandadas pelas empresas atualmente"
    }
  ];
  const benefits = ((_a = course == null ? void 0 : course.whyStudy) == null ? void 0 : _a.benefits) || defaultBenefits;
  return /* @__PURE__ */ jsx("section", { className: "mb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-4", children: "Por que estudar conosco?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-lg max-w-2xl mx-auto", children: "Descubra os benefícios exclusivos que vão acelerar sua jornada profissional" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8", children: benefits.map((benefit, index) => {
      var _a2, _b, _c;
      return /* @__PURE__ */ jsx(
        "div",
        {
          className: "group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
          children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                style: {
                  backgroundColor: `${(_a2 = course == null ? void 0 : course.themeColors) == null ? void 0 : _a2.primary}20`,
                  border: `2px solid ${(_b = course == null ? void 0 : course.themeColors) == null ? void 0 : _b.primary}40`
                },
                children: getIconForContext(benefit.icon, "whyStudy", ((_c = course == null ? void 0 : course.themeColors) == null ? void 0 : _c.primary) || "#2196F3")
              }
            ),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4 group-hover:text-white transition-colors", children: benefit.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors", children: benefit.description })
          ] })
        },
        index
      );
    }) })
  ] }) });
}
function CourseJourney({ course }) {
  var _a, _b, _c, _d, _e;
  const defaultSteps = [
    {
      number: 1,
      title: "Fundamentos",
      description: "Aprenda conceitos básicos e ferramentas essenciais da profissão",
      icon: "House"
    },
    {
      number: 2,
      title: "Prática",
      description: "Desenvolva projetos reais e construa seu portfólio profissional",
      icon: "Wrench"
    },
    {
      number: 3,
      title: "Especialização",
      description: "Domine técnicas avançadas e tendências atuais do mercado",
      icon: "Crown"
    },
    {
      number: 4,
      title: "Profissionalização",
      description: "Prepare-se para oportunidades de trabalho e networking",
      icon: "Trophy"
    }
  ];
  const steps = ((_a = course == null ? void 0 : course.journey) == null ? void 0 : _a.steps) || defaultSteps;
  return /* @__PURE__ */ jsx("section", { className: "mb-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-4", children: "Sua Jornada de Transformação" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-lg max-w-2xl mx-auto", children: "Veja como você vai evoluir passo a passo até se tornar um profissional qualificado" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute left-6 top-12 bottom-12 w-1 rounded-full hidden md:block",
          style: {
            background: `linear-gradient(to bottom, ${((_c = (_b = course == null ? void 0 : course.themeColors) == null ? void 0 : _b.gradient) == null ? void 0 : _c.from) || "#2196F3"}, ${((_e = (_d = course == null ? void 0 : course.themeColors) == null ? void 0 : _d.gradient) == null ? void 0 : _e.to) || "#00BCD4"})`
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-8", children: steps.map((step, index) => {
        var _a2, _b2, _c2, _d2, _e2, _f, _g, _h, _i, _j;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative flex items-start gap-6 group",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 relative", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative",
                    style: {
                      background: `linear-gradient(135deg, ${((_b2 = (_a2 = course == null ? void 0 : course.themeColors) == null ? void 0 : _a2.gradient) == null ? void 0 : _b2.from) || "#2196F3"}, ${((_d2 = (_c2 = course == null ? void 0 : course.themeColors) == null ? void 0 : _c2.gradient) == null ? void 0 : _d2.to) || "#00BCD4"})`
                    },
                    children: step.number
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-md group-hover:scale-110 transition-transform duration-300 z-20",
                    style: {
                      backgroundColor: ((_e2 = course == null ? void 0 : course.themeColors) == null ? void 0 : _e2.primary) || "#2196F3",
                      borderColor: ((_f = course == null ? void 0 : course.themeColors) == null ? void 0 : _f.primary) || "#2196F3"
                    },
                    children: getIconForContext(step.icon, "journey", "#ffffff")
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 group-hover:border-white/20 transition-all duration-300 hover:-translate-y-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-3 group-hover:text-white transition-colors", children: step.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors", children: step.description }),
                /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-400", children: [
                    "Etapa ",
                    step.number,
                    " de ",
                    steps.length
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-gray-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${step.number / steps.length * 100}%`,
                        background: `linear-gradient(90deg, ${((_h = (_g = course == null ? void 0 : course.themeColors) == null ? void 0 : _g.gradient) == null ? void 0 : _h.from) || "#2196F3"}, ${((_j = (_i = course == null ? void 0 : course.themeColors) == null ? void 0 : _i.gradient) == null ? void 0 : _j.to) || "#00BCD4"})`
                      }
                    }
                  ) })
                ] })
              ] })
            ]
          },
          step.number
        );
      }) })
    ] }) })
  ] }) });
}
function CourseEnrollCTA({ course, onEnrollClick }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  const [isInteractive, setIsInteractive] = useState(false);
  const deferredInteractive = useDeferredValue(isInteractive);
  useLayoutEffect(() => {
    setIsInteractive(true);
  }, []);
  const handleEnrollClick = () => {
    var _a2, _b2;
    if (onEnrollClick) {
      onEnrollClick();
    }
    if (typeof gtag !== "undefined") {
      gtag("event", "enroll_cta_click", {
        course_name: (_a2 = course == null ? void 0 : course.basicInfo) == null ? void 0 : _a2.title,
        course_slug: (_b2 = course == null ? void 0 : course.basicInfo) == null ? void 0 : _b2.slug,
        cta_position: "main_cta"
      });
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "mb-16", children: /* @__PURE__ */ jsx("div", { className: "@container max-w-5xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20",
        style: {
          background: `linear-gradient(135deg, ${((_b = (_a = course == null ? void 0 : course.themeColors) == null ? void 0 : _a.gradient) == null ? void 0 : _b.from) || "#2196F3"}, ${((_d = (_c = course == null ? void 0 : course.themeColors) == null ? void 0 : _c.gradient) == null ? void 0 : _d.to) || "#00BCD4"})`
        }
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-r from-gray-800/70 to-gray-900/70 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm mb-4 sm:mb-6 shadow-lg min-h-[36px] touch-manipulation", children: [
        getIconForContext("Star", "cta", "#000000", { size: 16, weight: "fill" }),
        /* @__PURE__ */ jsx("span", { children: "Desenvolva uma nova habilidade" }),
        getIconForContext("Star", "cta", "#000000", { size: 16, weight: "fill" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight", children: "Pronto para se Matricular?" }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed", children: [
        "Desenvolva suas habilidades com o curso de",
        " ",
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "font-semibold",
            style: { color: ((_e = course == null ? void 0 : course.themeColors) == null ? void 0 : _e.primary) || "#2196F3" },
            children: (_f = course == null ? void 0 : course.basicInfo) == null ? void 0 : _f.title
          }
        ),
        ". Comece hoje mesmo sua jornada profissional!"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 @sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation", children: [
          getIconForContext("CheckCircle", "benefits", "#4ade80"),
          /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-xs sm:text-sm", children: "Certificado Reconhecido" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation", children: [
          getIconForContext("Lightning", "benefits", "#facc15"),
          /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-xs sm:text-sm", children: "Suporte Completo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 justify-center min-h-[44px] p-2 rounded-lg bg-gray-800/30 touch-manipulation", children: [
          getIconForContext("Star", "benefits", "#a855f7"),
          /* @__PURE__ */ jsx("span", { className: "text-gray-300 text-xs sm:text-sm", children: "Material Incluso" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleEnrollClick,
          className: "group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-white font-bold text-base sm:text-lg rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-white/20 min-h-[44px] min-w-[200px] touch-manipulation active:scale-95",
          style: {
            background: `linear-gradient(135deg, ${((_h = (_g = course == null ? void 0 : course.themeColors) == null ? void 0 : _g.gradient) == null ? void 0 : _h.from) || "#2196F3"}, ${((_j = (_i = course == null ? void 0 : course.themeColors) == null ? void 0 : _i.gradient) == null ? void 0 : _j.to) || "#00BCD4"})`
          },
          disabled: !deferredInteractive,
          children: [
            /* @__PURE__ */ jsx("span", { children: "Garantir Minha Vaga" }),
            getIconForContext("ArrowRight", "cta", "#ffffff", {
              className: "group-hover:translate-x-1 transition-transform duration-300",
              size: 18
            })
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs sm:text-sm mt-4 sm:mt-6 leading-relaxed", children: "📞 Entre em contato conosco • Resposta rápida garantida" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 sm:top-6 left-4 sm:left-6 w-8 sm:w-12 h-8 sm:h-12 border-2 border-white/10 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 sm:top-6 right-4 sm:right-6 w-6 sm:w-8 h-6 sm:h-8 border-2 border-white/10 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 sm:bottom-6 left-6 sm:left-8 w-4 sm:w-6 h-4 sm:h-6 border-2 border-white/10 rounded-full" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-4 sm:bottom-6 right-6 sm:right-8 w-8 sm:w-10 h-8 sm:h-10 border-2 border-white/10 rounded-full" })
    ] })
  ] }) }) });
}
const CourseToolNavigation = ({ course, activeSection, onSectionChange }) => {
  const [isSticky, setIsSticky] = useState(false);
  const toolIcons = {
    sketchup: Wrench,
    autocad: PencilLine,
    revit: Buildings,
    enscape: Eye
  };
  const tools = [
    { id: "sketchup", name: "SketchUp Pro", color: "#005CAF" },
    { id: "autocad", name: "AutoCAD 2D", color: "#E51937" },
    { id: "revit", name: "Revit BIM", color: "#0078BE" },
    { id: "enscape", name: "Enscape", color: "#FF6B35" }
  ];
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleToolClick = (toolId) => {
    const element = document.getElementById(toolId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
      });
      onSectionChange(toolId);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("section", { className: "py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold text-white mb-6", children: "Explore Cada Ferramenta em Detalhes" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300 mb-8", children: "Clique em uma ferramenta para conhecer todo o conteúdo que você vai aprender" })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: `course-tool-navigation-improved ${isSticky ? "sticky top-0 z-40" : ""} transition-all duration-300`, children: /* @__PURE__ */ jsx("div", { className: "bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 shadow-sm", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-wrap", children: tools.map((tool, index) => {
      const Icon = toolIcons[tool.id];
      const isActive = activeSection === tool.id;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleToolClick(tool.id),
          className: `
                        flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                        transition-all duration-300 min-w-[120px] justify-center
                        ${isActive ? "bg-gray-800/80 shadow-lg border-2 scale-105 text-white" : "bg-gray-800/30 text-gray-300 hover:bg-gray-800/60 hover:shadow-md border-2 border-transparent hover:text-white"}
                      `,
          style: isActive ? {
            borderColor: tool.color,
            background: `linear-gradient(135deg, ${tool.color}20, rgba(31, 41, 55, 0.8))`
          } : {},
          children: [
            /* @__PURE__ */ jsx(
              Icon,
              {
                size: 18,
                weight: "duotone",
                style: { color: isActive ? tool.color : "#9CA3AF" }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: tool.name.split(" ")[0] })
          ]
        },
        tool.id
      );
    }) }) }) }) }) })
  ] });
};
const CourseToolSection = ({ tool, toolData, themeColors }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  const sections = [
    {
      id: "features",
      title: "Principais Recursos",
      icon: CheckCircle,
      items: toolData.keyFeatures,
      color: themeColors.primary
    },
    {
      id: "professional",
      title: "Uso Profissional",
      icon: Briefcase,
      items: toolData.professionalUse,
      color: themeColors.secondary
    },
    {
      id: "local",
      title: "Aplicações Locais - Grande Florianópolis",
      icon: MapPin,
      items: toolData.localApplications,
      color: "#10B981"
    },
    {
      id: "career",
      title: "Oportunidades de Carreira",
      icon: TrendUp,
      items: toolData.careerOpportunities,
      color: "#8B5CF6"
    }
  ];
  return /* @__PURE__ */ jsx("section", { id: tool, className: "course-tool-section scroll-mt-24", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-4", children: toolData.title }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 mb-6", children: toolData.subtitle }),
      /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 leading-relaxed text-lg", children: toolData.description }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: sections.map((section) => {
      const Icon = section.icon;
      const isExpanded = expandedSection === section.id;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => toggleSection(section.id),
                className: "w-full flex items-center justify-between p-6 text-left hover:bg-gray-700/30 transition-colors",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "p-2 rounded-lg",
                        style: { backgroundColor: `${section.color}20` },
                        children: /* @__PURE__ */ jsx(
                          Icon,
                          {
                            size: 20,
                            weight: "duotone",
                            style: { color: section.color }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white", children: section.title }),
                    /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-400 bg-gray-700/50 px-2 py-1 rounded", children: [
                      section.items.length,
                      " itens"
                    ] })
                  ] }),
                  isExpanded ? /* @__PURE__ */ jsx(CaretUp, { size: 20, className: "text-gray-400" }) : /* @__PURE__ */ jsx(CaretDown, { size: 20, className: "text-gray-400" })
                ]
              }
            ),
            isExpanded && /* @__PURE__ */ jsx("div", { className: "px-6 pb-6", children: /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: section.items.map((item, index) => /* @__PURE__ */ jsxs(
              "li",
              {
                className: "flex items-start gap-3 text-gray-300",
                children: [
                  /* @__PURE__ */ jsx(
                    CheckCircle,
                    {
                      size: 16,
                      weight: "duotone",
                      className: "mt-0.5 flex-shrink-0",
                      style: { color: section.color }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "leading-relaxed", children: item })
                ]
              },
              index
            )) }) })
          ]
        },
        section.id
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6", children: [
      /* @__PURE__ */ jsxs("h4", { className: "text-lg font-semibold text-white mb-2", children: [
        "Domine ",
        toolData.title.split(":")[0],
        " Profissionalmente"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-4", children: "Aprenda com projetos reais da Grande Florianópolis" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            const contactSection = document.getElementById("contato");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
          },
          className: "px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105",
          style: {
            background: `linear-gradient(135deg, ${themeColors.gradient.from}, ${themeColors.gradient.to})`
          },
          children: "Garantir Minha Vaga"
        }
      )
    ] }) })
  ] }) });
};
const CourseProblemStatement = ({ course }) => {
  var _a, _b, _c, _d, _e;
  const problems = [
    {
      icon: TrendUp,
      title: "Não Sei Por Onde Começar",
      description: "YouTube tem tutorial de tudo, mas qual software aprender primeiro? SketchUp, Blender, 3DS Max, Revit? Você perde meses pulando entre tutoriais sem criar nada profissional.",
      stat: "4+ softwares diferentes"
    },
    {
      icon: Users,
      title: "Cursos Caros e Incompletos",
      description: "Curso de SketchUp R$ 2.000, AutoCAD R$ 2.500, Revit R$ 3.500... No final, você ainda não sabe integrar nada e fazer um projeto completo.",
      stat: "R$ 8.000+ separado"
    },
    {
      icon: Lightbulb,
      title: "Vai Levar Anos Sozinho",
      description: "Aprendendo por conta própria, você leva anos para descobrir o que o mercado realmente pede. Enquanto isso, as vagas passam e você continua estudando.",
      stat: "2-3 anos perdidos"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-6", children: "5 Motivos Pelos Quais é Difícil Começar Como Projetista 3D (Sem o Caminho Certo)" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed", children: "Quer ser projetista 3D mas não sabe por onde começar? Descubra os obstáculos reais que impedem 73% das pessoas de conseguirem e como você pode ser diferente." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-8 mb-12", children: problems.map((problem, index) => {
      const Icon = problem.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl text-center",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-500/20 border-2 border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx(Icon, { size: 32, className: "text-red-400", weight: "duotone" }) }),
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-red-400 mb-2", children: problem.stat })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-white mb-4 group-hover:text-gray-200 transition-colors", children: problem.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors", children: problem.description })
          ]
        },
        index
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mb-12", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "inline-flex items-center gap-4 rounded-full px-8 py-4 backdrop-blur-sm border border-blue-500/30 mb-8",
        style: {
          background: `linear-gradient(135deg, ${((_b = (_a = course == null ? void 0 : course.themeColors) == null ? void 0 : _a.gradient) == null ? void 0 : _b.from) || "#2196F3"}20, ${((_d = (_c = course == null ? void 0 : course.themeColors) == null ? void 0 : _c.gradient) == null ? void 0 : _d.to) || "#21CBF3"}20)`
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg text-white font-medium", children: "A solução? Domine SketchUp + AutoCAD + Revit + Enscape em um curso só" }),
          /* @__PURE__ */ jsx(
            ArrowRight,
            {
              size: 20,
              className: "font-bold",
              style: { color: ((_e = course == null ? void 0 : course.themeColors) == null ? void 0 : _e.primary) || "#2196F3" }
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-6 text-center", children: "A Solução:" }),
      /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300 text-center mb-8 leading-relaxed", children: "Em 94 horas 100% PRESENCIAIS, com método testado por 200+ alunos, você sai do zero absoluto para projetista PROFISSIONAL, com portfolio pronto e certificado reconhecido." }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Users, { size: 24, className: "text-blue-400", weight: "duotone" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-2", children: "Professor ao Seu Lado" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Dúvida? Resolvida na hora. Sem esperar resposta em fórum ou email." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(TrendUp, { size: 24, className: "text-green-400", weight: "duotone" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-2", children: "Equipamentos Inclusos" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Não precisa ter PC potente nem comprar licenças. Usamos nossos equipamentos profissionais." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center mx-auto mb-3", children: /* @__PURE__ */ jsx(Lightbulb, { size: 24, className: "text-purple-400", weight: "duotone" }) }),
          /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-2", children: "Foco Total" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Em casa tem Netflix, WhatsApp, cama... Aqui você está 100% focado em aprender." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6 mb-6", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-xl font-bold text-white mb-2", children: "TURMA PRESENCIAL LIMITADA" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-green-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { size: 16, className: "text-green-400", weight: "duotone" }),
            "Máximo 3 alunos (atenção personalizada)"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-green-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Desktop, { size: 16, className: "text-green-400", weight: "duotone" }),
            "Computadores profissionais inclusos"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-green-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 16, className: "text-green-400", weight: "duotone" }),
            "Software licenciado disponível"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-green-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Coffee, { size: 16, className: "text-green-400", weight: "duotone" }),
            "Coffee break e networking"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-red-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(VideoCamera, { size: 16, className: "text-red-400", weight: "duotone" }),
            "Sem aulas gravadas genéricas"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-red-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(GraduationCap, { size: 16, className: "text-red-400", weight: "duotone" }),
            "Sem abandono no meio do curso"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm italic max-w-4xl mx-auto", children: "Curso online de 3D? Você já tentou e sabe que não funciona. A diferença entre aprender de verdade e desistir no meio está no acompanhamento presencial, na correção imediata, no professor que está ali do seu lado. É por isso que 94% dos nossos alunos presenciais concluem e saem projetando." })
    ] })
  ] }) });
};
function CoursePage({ slug }) {
  const { courseSlug } = useParams();
  const loaderData = useLoaderData();
  const finalSlug = slug || courseSlug;
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState((loaderData == null ? void 0 : loaderData.course) || null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("sketchup");
  const form = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const courses = [
    "Projetista",
    "Edição de Vídeo",
    "Informática",
    "Design Gráfico",
    "Programação",
    "Marketing Digital",
    "Inteligência Artificial",
    "Business Intelligence"
  ];
  useEffect(() => {
    const loadCourse = async () => {
      if (loaderData == null ? void 0 : loaderData.course) {
        const validatedCourse = validateAndSanitizeCourse(loaderData.course);
        setCourse(validatedCourse);
        setFormData((prev) => ({
          ...prev,
          course: validatedCourse.basicInfo.title
        }));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const foundCourse = getCourseBySlug(finalSlug, COURSES_DATA);
        if (!foundCourse) {
          setError("Curso não encontrado");
          return;
        }
        const validatedCourse = validateAndSanitizeCourse(foundCourse);
        setCourse(validatedCourse);
        setFormData((prev) => ({
          ...prev,
          course: validatedCourse.basicInfo.title
        }));
      } catch (err) {
        console.error("Erro ao carregar curso:", err);
        setError("Erro ao carregar dados do curso");
      } finally {
        setLoading(false);
      }
    };
    if (finalSlug) {
      loadCourse();
    }
  }, [finalSlug, loaderData]);
  const handleEnrollClick = () => {
    const contactSection = document.getElementById("contato");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
    if (typeof gtag !== "undefined") {
      gtag("event", "enroll_click", {
        course_name: course.basicInfo.title,
        course_slug: course.basicInfo.slug
      });
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const sendEmail = async () => {
    try {
      if (!isEmailConfigured()) {
        console.warn("EmailJS não configurado, usando WhatsApp como fallback");
        return { success: false, error: "EmailJS não configurado" };
      }
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        course: formData.course || "Não especificado",
        message: formData.message || "Nenhuma mensagem adicional",
        to_email: EMAIL_CONFIG.CONTACT_EMAIL,
        reply_to: formData.email
      };
      const result = await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY
      );
      return { success: true };
    } catch (error2) {
      console.error("Erro ao enviar email:", error2);
      return { success: false, error: error2 };
    }
  };
  const sendWhatsApp = () => {
    const message = `*Nova solicitação de contato*%0A%0A*Nome:* ${formData.name}%0A*Email:* ${formData.email}%0A*Telefone:* ${formData.phone}%0A*Curso de interesse:* ${formData.course || "Não especificado"}%0A*Mensagem:* ${formData.message || "Nenhuma mensagem adicional"}`;
    window.open(`https://wa.me/${EMAIL_CONFIG.WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };
  const handleSubmit = async (e) => {
    var _a;
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      const emailResult = await sendEmail();
      if (emailResult.success) {
        setSubmitStatus("email_success");
        setFormData({ name: "", email: "", phone: "", course: ((_a = course == null ? void 0 : course.basicInfo) == null ? void 0 : _a.title) || "", message: "" });
      } else {
        setSubmitStatus("whatsapp_fallback");
        setTimeout(() => {
          sendWhatsApp();
        }, 1500);
      }
    } catch (error2) {
      console.error("Erro no envio:", error2);
      setSubmitStatus("whatsapp_fallback");
      setTimeout(() => {
        sendWhatsApp();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-white text-lg", children: "Carregando curso..." }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm mt-2", children: "Preparando conteúdo exclusivo..." })
    ] }) });
  }
  if (error || !course) {
    return /* @__PURE__ */ jsx(Navigate, { to: "/404", replace: true });
  }
  const metadata = generateCourseMetadata(course);
  return /* @__PURE__ */ jsxs(ErrorBoundary, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: metadata.title }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: metadata.description }),
      /* @__PURE__ */ jsx("meta", { name: "keywords", content: metadata.keywords }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: metadata.openGraph.title }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: metadata.openGraph.description }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: metadata.openGraph.type }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: metadata.openGraph.image }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: metadata.openGraph.url }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: metadata.twitter.card }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: metadata.twitter.title }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: metadata.twitter.description }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: metadata.twitter.image }),
      /* @__PURE__ */ jsx(
        "script",
        {
          type: "application/ld+json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(metadata.structuredData) }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900",
        style: {
          background: `linear-gradient(135deg, ${course.themeColors.gradient.from}08 0%, ${course.themeColors.gradient.to}08 100%), radial-gradient(circle at top, #1a1a1a 0%, #000000 100%)`
        },
        children: [
          /* @__PURE__ */ jsx(CourseBreadcrumb, { course }),
          /* @__PURE__ */ jsxs("div", { className: "relative min-h-screen", children: [
            /* @__PURE__ */ jsx(
              CourseBackground$1,
              {
                courseSlug: course.basicInfo.slug,
                priority: true
              }
            ),
            /* @__PURE__ */ jsx(CourseHero, { course, onEnrollClick: handleEnrollClick })
          ] }),
          course.enhancedSections && /* @__PURE__ */ jsx(CourseProblemStatement, { course }),
          course.enhancedSections && /* @__PURE__ */ jsx(CourseToolsOverview, { course }),
          /* @__PURE__ */ jsx(CourseWhyStudy, { course }),
          /* @__PURE__ */ jsx(CourseJourney, { course }),
          course.enhancedSections && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              CourseToolNavigation,
              {
                course,
                activeSection,
                onSectionChange: setActiveSection
              }
            ),
            Object.entries(course.enhancedSections).map(([tool, toolData]) => /* @__PURE__ */ jsx(
              CourseToolSection,
              {
                tool,
                toolData,
                themeColors: course.themeColors
              },
              tool
            )),
            (course.workflowExamples || course.toolComparisons) && /* @__PURE__ */ jsx(
              CourseWorkflowSection,
              {
                workflowExamples: course.workflowExamples,
                toolComparisons: course.toolComparisons,
                themeColors: course.themeColors
              }
            )
          ] }),
          /* @__PURE__ */ jsx(CourseEnrollCTA, { course, onEnrollClick: handleEnrollClick }),
          /* @__PURE__ */ jsx(
            TrustedCompanies,
            {
              variant: "course",
              courseSlug: course.basicInfo.slug,
              theme: "dark"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 pb-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-16", children: [
                /* @__PURE__ */ jsx("section", { id: "curriculo", children: /* @__PURE__ */ jsx(CourseCurriculum, { course }) }),
                /* @__PURE__ */ jsx("section", { id: "depoimentos", children: /* @__PURE__ */ jsx(CourseTestimonials, { course }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                /* @__PURE__ */ jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: "Interessado no Curso?" }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: "Entre em contato conosco para mais informações" })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: handleEnrollClick,
                      className: "w-full py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 mb-6",
                      style: {
                        background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
                      },
                      children: "Solicitar Informações"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-gray-400", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Lightning, { size: 16, weight: "duotone", className: "text-yellow-400" }),
                      /* @__PURE__ */ jsx("span", { children: "Resposta rápida" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Target, { size: 16, weight: "duotone", className: "text-orange-400" }),
                      /* @__PURE__ */ jsx("span", { children: "Atendimento personalizado" })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsx(Briefcase, { size: 16, weight: "duotone", className: "text-indigo-400" }),
                      /* @__PURE__ */ jsx("span", { children: "Orientação profissional" })
                    ] })
                  ] })
                ] }) }),
                course.faq && course.faq.length > 0 && /* @__PURE__ */ jsx("section", { id: "faq", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-6", children: "Perguntas Frequentes" }),
                  /* @__PURE__ */ jsx("div", { className: "space-y-4", children: course.faq.map((item) => /* @__PURE__ */ jsxs("div", { className: "border-b border-gray-700 pb-4 last:border-b-0 last:pb-0", children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-white font-semibold mb-2 text-sm", children: item.question }),
                    /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm leading-relaxed", children: item.answer })
                  ] }, item.id)) })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ jsx("section", { id: "contato", className: "mt-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-5xl font-bold text-white mb-6", children: "Entre em Contato" }),
                /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-lg max-w-2xl mx-auto", children: [
                  "Interessado no curso de ",
                  course.basicInfo.title,
                  "? Preencha o formulário e entraremos em contato!"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50", children: [
                /* @__PURE__ */ jsxs("form", { ref: form, onSubmit: handleSubmit, className: "space-y-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-300", children: [
                        /* @__PURE__ */ jsx(User, { size: 16, className: "inline mr-2" }),
                        "Nome completo *"
                      ] }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          id: "name",
                          name: "name",
                          value: formData.name,
                          onChange: handleChange,
                          required: true,
                          className: "w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                          placeholder: "Seu nome completo"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300", children: [
                        /* @__PURE__ */ jsx(Envelope, { size: 16, className: "inline mr-2" }),
                        "Email *"
                      ] }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "email",
                          id: "email",
                          name: "email",
                          value: formData.email,
                          onChange: handleChange,
                          required: true,
                          className: "w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                          placeholder: "seu@email.com"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-300", children: [
                        /* @__PURE__ */ jsx(Phone, { size: 16, className: "inline mr-2" }),
                        "Telefone *"
                      ] }),
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "tel",
                          id: "phone",
                          name: "phone",
                          value: formData.phone,
                          onChange: handleChange,
                          required: true,
                          className: "w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                          placeholder: "(48) 9 9999-9999"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxs("label", { htmlFor: "course", className: "block text-sm font-medium text-gray-300", children: [
                        /* @__PURE__ */ jsx(BookOpen, { size: 16, className: "inline mr-2" }),
                        "Curso de interesse"
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "select",
                        {
                          id: "course",
                          name: "course",
                          value: formData.course,
                          onChange: handleChange,
                          className: "w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all",
                          children: [
                            /* @__PURE__ */ jsx("option", { value: "", children: "Selecione um curso" }),
                            courses.map((courseOption) => /* @__PURE__ */ jsx("option", { value: courseOption, children: courseOption }, courseOption))
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-300", children: "Mensagem (opcional)" }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        id: "message",
                        name: "message",
                        value: formData.message,
                        onChange: handleChange,
                        rows: 4,
                        className: "w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all resize-none",
                        placeholder: "Deixe uma mensagem (opcional)"
                      }
                    )
                  ] }),
                  submitStatus === "email_success" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { size: 24, className: "text-green-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-green-300 font-medium", children: "Email enviado com sucesso!" }),
                      /* @__PURE__ */ jsx("p", { className: "text-green-400 text-sm", children: "Entraremos em contato em breve." })
                    ] })
                  ] }),
                  submitStatus === "whatsapp_fallback" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { size: 24, className: "text-blue-400 flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-blue-300 font-medium", children: "Redirecionando para WhatsApp..." }),
                      /* @__PURE__ */ jsx("p", { className: "text-blue-400 text-sm", children: "Você será direcionado para continuar pelo WhatsApp." })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(
                    GradientButton,
                    {
                      type: "submit",
                      disabled: isSubmitting,
                      className: "w-full flex items-center justify-center gap-3 py-4 disabled:opacity-50 disabled:cursor-not-allowed",
                      children: isSubmitting ? /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(Loading, { size: "sm" }),
                        "Enviando..."
                      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                        /* @__PURE__ */ jsx(PaperPlaneTilt, { size: 20 }),
                        "Enviar Mensagem"
                      ] })
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "mt-6 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Seus dados são tratados com total confidencialidade conforme nossa política de privacidade." }) })
              ] })
            ] }) })
          ] })
        ]
      }
    )
  ] });
}
async function loader({ params }) {
  const { courseSlug } = params;
  try {
    const foundCourse = getCourseBySlug(courseSlug, COURSES_DATA);
    if (!foundCourse) {
      throw new Error(`Course not found: ${courseSlug}`);
    }
    return { course: foundCourse };
  } catch (error) {
    console.error("SSG Loader error:", error);
    return { course: null };
  }
}
function getStaticPaths() {
  return [
    "informatica",
    "design-grafico",
    "programacao",
    "marketing-digital",
    "inteligencia-artificial",
    "business-intelligence",
    "projetista-3d",
    "edicao-video",
    "administracao"
  ];
}
export {
  CoursePage as Component,
  CoursePage as default,
  getCourseBySlug,
  getStaticPaths,
  loader,
  validateAndSanitizeCourse
};
