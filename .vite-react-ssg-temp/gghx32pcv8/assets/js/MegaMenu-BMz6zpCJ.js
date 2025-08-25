import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MagnifyingGlass, CaretDown } from "@phosphor-icons/react";
import { s as searchCourses, a as COURSES_DATA } from "../../main.mjs";
import "vite-react-ssg";
import "react-router-dom";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
import "@supabase/supabase-js";
import "@emailjs/browser";
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
export {
  MegaMenu as default
};
