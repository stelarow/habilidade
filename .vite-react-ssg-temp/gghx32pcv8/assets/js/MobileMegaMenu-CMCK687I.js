import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GraduationCap, X, CaretRight, MagnifyingGlass, WhatsappLogo, Question, Play, House, Phone, Star, BookOpen } from "@phosphor-icons/react";
import { d as usePageContext, g as getCourseBySlug, A as ADAPTIVE_NAVIGATION, a as COURSES_DATA, s as searchCourses, G as GradientButton } from "../../main.mjs";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
import "@supabase/supabase-js";
import "@emailjs/browser";
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
export {
  MobileMegaMenu as default
};
