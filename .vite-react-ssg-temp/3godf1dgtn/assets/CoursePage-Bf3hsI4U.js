import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useParams, Navigate } from "react-router-dom";
import React, { useMemo, Suspense, lazy, useState, useDeferredValue, useLayoutEffect, useRef, useEffect } from "react";
import { CheckCircle, Star, House, CaretRight, GraduationCap, CaretUp, CaretDown, Quotes, Target, Buildings, ChatCircle, Check, Phone, Envelope, User, PaperPlaneTilt, Briefcase, ArrowRight, Lightning, Trophy, Crown, Wrench, Users, TrendUp, BookOpen, Eye, PencilLine, MapPin, Play, Lightbulb, Desktop, ShieldCheck, Coffee, VideoCamera } from "@phosphor-icons/react";
import emailjs from "@emailjs/browser";
import { E as ErrorBoundary, G as GradientButton, L as Loading } from "../main.mjs";
import { k as usePerformanceLevel, v as useViewportSize, w as getLessonLabel, x as getLessonIconByArea, y as generateCourseMetadata, i as getCourseBySlug, z as validateAndSanitizeCourse, A as isEmailConfigured, E as EMAIL_CONFIG } from "./utils-DYyrIPL_.js";
import PropTypes from "prop-types";
import { C as COURSES_DATA } from "./blog-components-BiqxfVKP.js";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
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
const backgrounds = {
  "inteligencia-artificial": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.b).then((module) => ({ default: module.default }))
  ),
  "design-grafico": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.D).then((module) => ({ default: module.default }))
  ),
  "informatica": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.I).then((module) => ({ default: module.default }))
  ),
  "programacao": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.a).then((module) => ({ default: module.default }))
  ),
  "marketing-digital": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.M).then((module) => ({ default: module.default }))
  ),
  "business-intelligence": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.B).then((module) => ({ default: module.default }))
  ),
  "edicao-video": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.E).then((module) => ({ default: module.default }))
  ),
  "projetista-3d": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.P).then((module) => ({ default: module.default }))
  ),
  "administracao": lazy(
    () => import("./backgrounds-CVGEKd_2.js").then((n) => n.A).then((module) => ({ default: module.default }))
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
        }
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
                /* @__PURE__ */ jsx("span", { className: "relative z-10", children: "Solicitar Informações" }),
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
function CourseCurriculum({ course }) {
  const [expandedModules, setExpandedModules] = useState(/* @__PURE__ */ new Set([0]));
  const { isMobile, isTablet } = useViewportSize();
  const toggleModule = (moduleId) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };
  const getLessonIcon = (type, courseSlug) => {
    return getLessonIconByArea(courseSlug, type);
  };
  const getLessonTypeColor = (type) => {
    switch (type) {
      case "video":
        return course.themeColors.primary;
      case "text":
        return course.themeColors.secondary;
      case "exercise":
        return course.themeColors.accent;
      case "project":
        return "#10B981";
      // Green for projects
      default:
        return course.themeColors.primary;
    }
  };
  const totalLessons = course.curriculum.reduce((total, module) => total + module.lessons.length, 0);
  const totalDuration = course.curriculum.reduce((total, module) => {
    return total + module.lessons.reduce((moduleTotal, lesson) => {
      var _a;
      const minutes = parseInt(((_a = lesson.duration.match(/\d+/)) == null ? void 0 : _a[0]) || "0");
      return moduleTotal + minutes;
    }, 0);
  }, 0);
  const formatTotalDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };
  return /* @__PURE__ */ jsxs("div", { className: `@container bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl mb-16 max-w-full overflow-hidden ${isMobile ? "p-4" : "p-6 sm:p-8"}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `flex flex-col md:flex-row md:items-center md:justify-between min-w-0 max-w-full ${isMobile ? "mb-6" : "mb-8"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: `min-w-0 flex-1 ${isMobile ? "mb-4" : "md:mb-0 md:mr-4"}`, children: [
        /* @__PURE__ */ jsx("h2", { className: `font-bold text-white mb-2 break-words ${isMobile ? "text-2xl" : "text-3xl"}`, children: "Currículo do Curso" }),
        /* @__PURE__ */ jsxs("p", { className: `text-gray-400 break-words leading-relaxed ${isMobile ? "text-sm" : "text-base"}`, children: [
          course.curriculum.length,
          " módulos • ",
          totalLessons,
          " aulas • ",
          formatTotalDuration(totalDuration),
          " de conteúdo"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex gap-2 flex-shrink-0 ${isMobile ? "w-full" : "md:w-auto"}`, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setExpandedModules(new Set(course.curriculum.map((_, index) => index))),
            className: `px-3 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors min-h-[44px] ${isMobile ? "flex-1 text-xs" : "md:flex-none text-sm"}`,
            children: "Expandir Todos"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setExpandedModules(/* @__PURE__ */ new Set()),
            className: `px-3 py-2 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-colors min-h-[44px] ${isMobile ? "flex-1 text-xs" : "md:flex-none text-sm"}`,
            children: "Fechar Todos"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: `max-w-full overflow-hidden ${isMobile ? "space-y-2" : "space-y-4"}`, children: course.curriculum.map((module, moduleIndex) => {
      const isExpanded = expandedModules.has(moduleIndex);
      const moduleDuration = module.lessons.reduce((total, lesson) => {
        var _a;
        const minutes = parseInt(((_a = lesson.duration.match(/\d+/)) == null ? void 0 : _a[0]) || "0");
        return total + minutes;
      }, 0);
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "border border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-600 transform-gpu max-w-full",
          style: {
            borderColor: isExpanded ? `${course.themeColors.primary}40` : void 0
          },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => toggleModule(moduleIndex),
                className: `w-full bg-gray-800/30 hover:bg-gray-800/50 transition-colors text-left max-w-full overflow-hidden ${isMobile ? "px-4 py-4 min-h-[60px]" : "px-6 py-4"}`,
                children: /* @__PURE__ */ jsxs("div", { className: `flex ${isMobile ? "flex-col" : "flex-row items-start justify-between"} min-w-0 max-w-full gap-3`, children: [
                  /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 md:gap-4 flex-1 min-w-0 ${isMobile ? "mb-2" : "md:mb-0"}`, children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0 ${isMobile ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm"}`,
                        style: { backgroundColor: course.themeColors.primary },
                        children: moduleIndex + 1
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 overflow-hidden", children: [
                      /* @__PURE__ */ jsx("h3", { className: `font-semibold text-white mb-1 break-words line-clamp-2 leading-tight ${isMobile ? "text-base" : "text-lg"}`, children: module.title }),
                      /* @__PURE__ */ jsx("p", { className: `text-gray-400 break-words line-clamp-2 leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`, children: module.description })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between md:justify-end gap-4 flex-shrink-0 ${isMobile ? "ml-9" : "md:ml-0"}`, children: [
                    /* @__PURE__ */ jsxs("div", { className: `text-left md:text-right text-gray-400 whitespace-nowrap ${isMobile ? "text-xs" : "text-sm"}`, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        module.lessons.length,
                        " aulas"
                      ] }),
                      /* @__PURE__ */ jsx("div", { children: formatTotalDuration(moduleDuration) })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: isExpanded ? /* @__PURE__ */ jsx(CaretUp, { size: 18, className: "text-gray-400" }) : /* @__PURE__ */ jsx(CaretDown, { size: 18, className: "text-gray-400" }) })
                  ] })
                ] })
              }
            ),
            isExpanded && /* @__PURE__ */ jsx("div", { className: `max-w-full overflow-hidden ${isMobile ? "px-4 pb-4" : "px-6 pb-4"}`, children: /* @__PURE__ */ jsx("div", { className: `mt-4 max-w-full overflow-hidden ${isMobile ? "space-y-2 max-h-96 overflow-y-auto" : "space-y-3 md:max-h-none"} transition-all duration-300`, style: { WebkitOverflowScrolling: "touch" }, children: module.lessons.map((lesson, lessonIndex) => {
              const LessonIcon = getLessonIcon(lesson.type, course.basicInfo.slug);
              const iconColor = getLessonTypeColor(lesson.type);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `flex items-start gap-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors cursor-pointer group ${isMobile ? "p-2" : "p-3"}`,
                  style: {
                    // Força contenção horizontal
                    maxWidth: "100%",
                    overflow: "hidden",
                    minWidth: 0,
                    // Flexbox constrangido
                    flex: "1 1 0%"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: `rounded-xl flex items-center justify-center flex-shrink-0 ${isMobile ? "w-8 h-8" : "w-10 h-10"}`,
                        style: { backgroundColor: `${iconColor}20` },
                        children: /* @__PURE__ */ jsx(
                          LessonIcon,
                          {
                            size: isMobile ? 16 : 20,
                            weight: "duotone",
                            className: `transition-all group-hover:scale-110 duration-200`,
                            style: { color: iconColor }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "flex-1 overflow-hidden",
                        style: {
                          flex: "1 1 0%",
                          minWidth: 0,
                          overflow: "hidden",
                          maxWidth: "100%"
                        },
                        children: /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: `${isMobile ? "flex flex-col gap-1" : "flex flex-row md:items-start md:justify-between"}`,
                            style: {
                              minWidth: 0,
                              maxWidth: "100%",
                              overflow: "hidden"
                            },
                            children: [
                              /* @__PURE__ */ jsxs(
                                "h4",
                                {
                                  className: `text-white font-medium leading-tight group-hover:text-gray-200 transition-colors ${isMobile ? "text-sm mb-1" : "text-base mb-1 md:mb-0 md:mr-4 flex-1 min-w-0"}`,
                                  style: {
                                    // Força quebra de palavras
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                    // Limita a 2 linhas com CSS nativo
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    // Evita expansão horizontal
                                    maxWidth: "100%",
                                    width: "100%",
                                    // Line height otimizado
                                    lineHeight: "1.3"
                                  },
                                  children: [
                                    lessonIndex + 1,
                                    ". ",
                                    lesson.title
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap items-center gap-2 text-gray-400 flex-shrink-0 ${isMobile ? "text-xs" : "text-sm"}`, children: [
                                /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    className: `px-2 py-1 rounded font-medium whitespace-nowrap ${isMobile ? "text-xs" : "text-xs"}`,
                                    style: {
                                      backgroundColor: `${iconColor}20`,
                                      color: iconColor
                                    },
                                    children: lesson.label || getLessonLabel(course.basicInfo.slug, lesson.type)
                                  }
                                ),
                                /* @__PURE__ */ jsx("span", { className: "whitespace-nowrap", children: lesson.duration })
                              ] })
                            ]
                          }
                        )
                      }
                    )
                  ]
                },
                lesson.id
              );
            }) }) })
          ]
        },
        module.id
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: `bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700 max-w-full overflow-hidden ${isMobile ? "mt-6 p-4" : "mt-8 p-6"}`, children: /* @__PURE__ */ jsxs("div", { className: `text-center max-w-full ${isMobile ? "grid grid-cols-2 gap-3" : "grid grid-cols-2 md:grid-cols-4 gap-4"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: `font-bold text-white mb-1 break-words ${isMobile ? "text-xl" : "text-2xl"}`, children: course.curriculum.length }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Módulos" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: `font-bold text-white mb-1 break-words ${isMobile ? "text-xl" : "text-2xl"}`, children: totalLessons }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Aulas" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: `font-bold text-white mb-1 break-words ${isMobile ? "text-xl" : "text-2xl"}`, children: formatTotalDuration(totalDuration) }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Duração" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("div", { className: `font-bold break-words leading-tight ${isMobile ? "text-lg" : "text-2xl"}`, style: { color: course.themeColors.primary }, children: "Presencial ou Online" }),
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-400", children: "Modalidades" })
      ] })
    ] }) })
  ] });
}
CourseCurriculum.propTypes = {
  course: PropTypes.shape({
    curriculum: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      lessons: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["video", "text", "exercise", "project"]).isRequired
      })).isRequired
    })).isRequired,
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};
function CourseTestimonials({ course }) {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [expandedCards, setExpandedCards] = useState(/* @__PURE__ */ new Set());
  const deferredExpandedCards = useDeferredValue(expandedCards);
  useLayoutEffect(() => {
    if (containerRef.current) {
      const { height } = containerRef.current.getBoundingClientRect();
      setContainerHeight(height);
    }
  }, [course.testimonials]);
  if (!course.testimonials || course.testimonials.length === 0) {
    return null;
  }
  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => /* @__PURE__ */ jsx(
      Star,
      {
        size: 18,
        weight: index < rating ? "duotone" : "regular",
        className: index < rating ? "text-yellow-400" : "text-gray-400"
      },
      index
    ));
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-6 sm:mb-8 lg:mb-10", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4", children: "O que nossos alunos falam" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm sm:text-base lg:text-lg", children: "Resultados reais de quem já transformou a carreira" })
    ] }),
    /* @__PURE__ */ jsx("div", { ref: containerRef, className: "@container", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 @lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8", children: course.testimonials.map((testimonial) => {
      const isExpanded = deferredExpandedCards.has(testimonial.id);
      const textIsTruncated = testimonial.text.length > 150;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "relative bg-gray-800/30 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -left-2 sm:-top-3 sm:-left-3", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center",
                style: { backgroundColor: course.themeColors.primary },
                children: /* @__PURE__ */ jsx(Quotes, { size: 14, weight: "duotone", className: "text-white sm:w-[18px] sm:h-[18px]" })
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mb-3 sm:mb-4", children: renderStars(testimonial.rating) }),
            /* @__PURE__ */ jsxs("blockquote", { className: "text-gray-300 leading-relaxed mb-4 sm:mb-6", children: [
              /* @__PURE__ */ jsxs("span", { className: `text-sm sm:text-base lg:text-lg ${!isExpanded && textIsTruncated ? "line-clamp-3 sm:line-clamp-4" : ""}`, children: [
                '"',
                testimonial.text,
                '"'
              ] }),
              textIsTruncated && /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleExpanded(testimonial.id),
                  className: "block sm:hidden mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors",
                  children: isExpanded ? "Ler menos" : "Ler mais"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-lg",
                  style: { backgroundColor: course.themeColors.primary },
                  children: testimonial.name.charAt(0)
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-white font-semibold text-sm sm:text-base", children: testimonial.name }),
                /* @__PURE__ */ jsx("div", { className: "text-gray-400 text-xs sm:text-sm", children: testimonial.role })
              ] })
            ] }),
            testimonial.result && /* @__PURE__ */ jsxs(
              "div",
              {
                className: "inline-flex items-center gap-1 px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium",
                style: {
                  backgroundColor: `${course.themeColors.primary}20`,
                  color: course.themeColors.primary,
                  border: `1px solid ${course.themeColors.primary}40`
                },
                children: [
                  /* @__PURE__ */ jsx(Target, { size: 12, weight: "duotone", className: "text-orange-400 sm:w-4 sm:h-4" }),
                  /* @__PURE__ */ jsx("span", { className: "truncate max-w-[120px] sm:max-w-none", children: testimonial.result })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none",
                style: { backgroundColor: course.themeColors.primary }
              }
            )
          ]
        },
        testimonial.id
      );
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "text-center mt-6 sm:mt-8 lg:mt-10 p-4 sm:p-6 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg sm:text-xl font-semibold text-white mb-2", children: "Pronto para ser o próximo caso de sucesso?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-4 text-sm sm:text-base", children: "Junte-se a centenas de alunos que já transformaram suas carreiras" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "px-4 py-2 sm:px-6 sm:py-3 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base",
          style: {
            background: `linear-gradient(135deg, ${course.themeColors.gradient.from}, ${course.themeColors.gradient.to})`
          },
          children: "Garantir Minha Vaga"
        }
      )
    ] })
  ] });
}
CourseTestimonials.propTypes = {
  course: PropTypes.shape({
    testimonials: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      result: PropTypes.string
    })),
    themeColors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gradient: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired
      }).isRequired
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
            /* @__PURE__ */ jsx("span", { children: "Solicitar Informações" }),
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
          children: "Solicitar Informações"
        }
      )
    ] }) })
  ] }) });
};
const CourseWorkflowSection = ({ workflowExamples, toolComparisons, themeColors }) => {
  const toolColors = {
    "AutoCAD 2D": "#E51937",
    "SketchUp Pro": "#005CAF",
    "Revit": "#0078BE",
    "Enscape": "#FF6B35"
  };
  return /* @__PURE__ */ jsx("section", { id: "workflow", className: "course-workflow-section py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-6", children: "Workflow Integrado Profissional" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "Aprenda como combinar todas as ferramentas em projetos reais, do esboço técnico até a apresentação final" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid lg:grid-cols-2 gap-8 mb-16", children: Object.entries(workflowExamples).map(([key, workflow]) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-3", children: workflow.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: workflow.description })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: workflow.steps.map((step, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
            style: {
              backgroundColor: toolColors[step.tool] || themeColors.primary
            },
            children: index + 1
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white", children: step.tool }),
            index < workflow.steps.length - 1 && /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "text-gray-400" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm mb-2", children: step.description }),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-xs", children: [
            /* @__PURE__ */ jsx("strong", { children: "Entrega:" }),
            " ",
            step.deliverable
          ] })
        ] })
      ] }, index)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx(CheckCircle, { size: 20, className: "text-green-400 flex-shrink-0 mt-0.5" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h5", { className: "text-green-300 font-medium mb-1", children: "Resultado Final" }),
          /* @__PURE__ */ jsx("p", { className: "text-green-200 text-sm", children: workflow.result })
        ] })
      ] }) })
    ] }, key)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white mb-3", children: "Guia de Escolha de Ferramentas" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: "Quando usar cada ferramenta para máxima eficiência" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: toolComparisons.map((comparison, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "bg-gray-700/30 border border-gray-600/20 rounded-lg p-4 hover:bg-gray-700/50 transition-colors",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-white font-medium text-sm mb-1", children: comparison.scenario }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "inline-block px-2 py-1 rounded text-xs font-medium text-white",
                  style: {
                    backgroundColor: toolColors[comparison.recommendation] || themeColors.primary
                  },
                  children: comparison.recommendation
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: comparison.reason })
          ]
        },
        index
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8", children: [
      /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-white mb-4", children: "Pronto para Dominar o Workflow Completo?" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-6 max-w-2xl mx-auto", children: "Aprenda o workflow integrado que os escritórios de arquitetura de Santa Catarina estão usando para projetos mais eficientes e apresentações impactantes." }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            const contactSection = document.getElementById("contato");
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: "smooth" });
            }
          },
          className: "inline-flex items-center gap-3 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1",
          style: {
            background: `linear-gradient(135deg, ${themeColors.gradient.from}, ${themeColors.gradient.to})`
          },
          children: [
            /* @__PURE__ */ jsx(Play, { size: 20, weight: "fill" }),
            "Iniciar Formação Completa"
          ]
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
const CourseToolsOverview = ({ course }) => {
  const tools = [
    {
      id: "sketchup",
      name: "SketchUp Pro",
      icon: Wrench,
      color: "#005CAF",
      role: "Modelagem 3D",
      description: "Base sólida em criação de modelos 3D profissionais",
      keyFeature: "20 aulas práticas"
    },
    {
      id: "autocad",
      name: "AutoCAD 2D",
      icon: PencilLine,
      color: "#E51937",
      role: "Documentação Técnica",
      description: "Plantas baixas e documentação técnica profissional",
      keyFeature: "15 projetos técnicos"
    },
    {
      id: "revit",
      name: "Revit BIM",
      icon: Buildings,
      color: "#0078BE",
      role: "BIM & Compatibilização",
      description: "Metodologia BIM para projetos de grande escala",
      keyFeature: "10 casos reais"
    },
    {
      id: "enscape",
      name: "Enscape",
      icon: Eye,
      color: "#FF6B35",
      role: "Renderização Realista",
      description: "Visualizações fotorrealísticas com renderizações ultra realistas",
      keyFeature: "8 renderizações"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl sm:text-4xl font-bold text-white mb-6", children: "Domine o Workflow Completo do Projeto 3D" }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8", children: "4 ferramentas profissionais integradas para formar o projetista 3D completo que o mercado procura." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center flex-wrap gap-4 mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border-2 border-blue-500/40 rounded-xl px-4 py-2 backdrop-blur-sm", children: /* @__PURE__ */ jsx("span", { className: "text-blue-300 font-medium", children: "Conceito" }) }),
        /* @__PURE__ */ jsx(ArrowRight, { size: 20, className: "text-gray-400" }),
        /* @__PURE__ */ jsx("div", { className: "bg-red-600/20 border-2 border-red-500/40 rounded-xl px-4 py-2 backdrop-blur-sm", children: /* @__PURE__ */ jsx("span", { className: "text-red-300 font-medium", children: "Documentação" }) }),
        /* @__PURE__ */ jsx(ArrowRight, { size: 20, className: "text-gray-400" }),
        /* @__PURE__ */ jsx("div", { className: "bg-blue-600/20 border-2 border-blue-500/40 rounded-xl px-4 py-2 backdrop-blur-sm", children: /* @__PURE__ */ jsx("span", { className: "text-blue-300 font-medium", children: "Modelagem BIM" }) }),
        /* @__PURE__ */ jsx(ArrowRight, { size: 20, className: "text-gray-400" }),
        /* @__PURE__ */ jsx("div", { className: "bg-orange-600/20 border-2 border-orange-500/40 rounded-xl px-4 py-2 backdrop-blur-sm", children: /* @__PURE__ */ jsx("span", { className: "text-orange-300 font-medium", children: "Apresentação" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: tools.map((tool, index) => {
      var _a, _b;
      const Icon = tool.icon;
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: "group bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-14 h-14 rounded-xl flex items-center justify-center",
                  style: { backgroundColor: `${tool.color}20` },
                  children: /* @__PURE__ */ jsx(
                    Icon,
                    {
                      size: 28,
                      weight: "duotone",
                      style: { color: tool.color }
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "text-xs font-medium px-2 py-1 rounded-full",
                  style: {
                    backgroundColor: `${(_a = course == null ? void 0 : course.themeColors) == null ? void 0 : _a.primary}20`,
                    color: ((_b = course == null ? void 0 : course.themeColors) == null ? void 0 : _b.primary) || "#2196F3"
                  },
                  children: [
                    index + 1,
                    "º Módulo"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white mb-1 group-hover:text-gray-200 transition-colors", children: tool.name }),
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-sm font-medium mb-3",
                style: { color: tool.color },
                children: tool.role
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm leading-relaxed mb-4 group-hover:text-gray-200 transition-colors", children: tool.description }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400", weight: "duotone" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-green-300", children: tool.keyFeature })
            ] })
          ]
        },
        tool.id
      );
    }) }),
    /* @__PURE__ */ jsx("div", { className: "text-center mt-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Resultado: Profissional 3D Completo" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-6", children: "Ao final do curso, você dominará todo o processo: desde a concepção até a apresentação final, preparado para qualquer tipo de projeto no mercado de trabalho." }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 text-sm text-gray-300", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
          /* @__PURE__ */ jsx("span", { children: "94 horas de conteúdo" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
          /* @__PURE__ */ jsx("span", { children: "4 ferramentas integradas" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-green-400" }),
          /* @__PURE__ */ jsx("span", { children: "Certificado profissional" })
        ] })
      ] })
    ] }) })
  ] }) });
};
function CoursePage() {
  const { courseSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);
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
      try {
        setLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 300));
        const foundCourse = getCourseBySlug(courseSlug, COURSES_DATA);
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
    if (courseSlug) {
      loadCourse();
    }
  }, [courseSlug]);
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
    ),
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
function loader() {
  return null;
}
export {
  CoursePage as Component,
  CoursePage as default,
  loader
};
