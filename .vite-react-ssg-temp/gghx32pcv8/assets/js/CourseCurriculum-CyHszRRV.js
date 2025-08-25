import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Monitor, RocketLaunch, PuzzlePiece, Article, Buildings, Cube, ChartLine, ChartBar, Sparkle, Robot, Target, Megaphone, Lightning, Code, MagicWand, PenNib, Gear, CaretUp, CaretDown } from "@phosphor-icons/react";
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
export {
  CourseCurriculum as default
};
