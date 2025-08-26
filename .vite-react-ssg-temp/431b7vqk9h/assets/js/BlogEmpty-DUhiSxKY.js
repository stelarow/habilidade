import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { Funnel, FileText, MagnifyingGlass, House } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
const BlogCardSkeleton = ({ variant = "standard" }) => {
  const variantStyles = {
    standard: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50",
    featured: "border-2 border-zinc-700/50",
    compact: "bg-zinc-800/40 border border-zinc-700/40"
  };
  return /* @__PURE__ */ jsx("article", { className: `group rounded-xl overflow-hidden transition-all duration-300 ${variantStyles[variant]} animate-pulse`, children: /* @__PURE__ */ jsxs("div", { className: "block", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative bg-zinc-700/50 overflow-hidden h-48", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-zinc-600/30 to-zinc-700/30" }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-zinc-600/50 rounded-full" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsx("div", { className: "h-6 w-16 bg-zinc-600/50 rounded-full" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-600/50 rounded mb-2" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-600/30 rounded w-3/4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-4 bg-zinc-700/30 rounded w-2/3" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "h-3 w-16 bg-zinc-700/50 rounded" }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-24 bg-zinc-700/50 rounded" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-12 bg-zinc-700/30 rounded" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "h-6 w-16 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-20 bg-zinc-700/50 rounded" }),
        /* @__PURE__ */ jsx("div", { className: "h-6 w-14 bg-zinc-700/30 rounded" })
      ] })
    ] })
  ] }) });
};
const SkeletonHeader = () => /* @__PURE__ */ jsxs("div", { className: "text-center mb-12 animate-pulse", children: [
  /* @__PURE__ */ jsx("div", { className: "h-12 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded mx-auto mb-4 w-48" }),
  /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-700/70 rounded mx-auto w-96" }),
    /* @__PURE__ */ jsx("div", { className: "h-6 bg-zinc-700/70 rounded mx-auto w-80" })
  ] })
] });
const SkeletonFilters = () => /* @__PURE__ */ jsx("div", { className: "mb-8 space-y-4 animate-pulse", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 max-w-4xl mx-auto", children: [
  /* @__PURE__ */ jsx("div", { className: "flex-1 h-12 bg-zinc-800 border border-zinc-700 rounded-lg" }),
  /* @__PURE__ */ jsx("div", { className: "w-full md:w-48 h-12 bg-zinc-800 border border-zinc-700 rounded-lg" })
] }) });
const BlogLoading = () => {
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx(SkeletonHeader, {}),
    /* @__PURE__ */ jsx(SkeletonFilters, {}),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: Array.from({ length: 9 }).map((_, index) => /* @__PURE__ */ jsx(BlogCardSkeleton, {}, index)) }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-zinc-400", children: [
      /* @__PURE__ */ jsx("div", { className: "w-6 h-6 border-2 border-zinc-400 border-t-purple-500 rounded-full animate-spin" }),
      /* @__PURE__ */ jsx("span", { className: "text-lg", children: "Carregando artigos..." })
    ] }) })
  ] });
};
const BlogEmpty = ({ hasFilters, onClearFilters }) => {
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-lg mx-auto text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-4 bg-zinc-700/30 rounded-full flex items-center justify-center", children: hasFilters ? /* @__PURE__ */ jsx(Funnel, { size: 48, className: "text-zinc-500" }) : /* @__PURE__ */ jsx(FileText, { size: 48, className: "text-zinc-500" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: hasFilters ? "🔍" : "📝" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-100 mb-4", children: hasFilters ? "Nenhum artigo encontrado" : "Ainda não temos artigos" }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-lg leading-relaxed", children: hasFilters ? "Tente ajustar os filtros para encontrar o conteúdo que você está procurando." : "Estamos trabalhando em novos conteúdos incríveis para você. Fique ligado!" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      hasFilters && onClearFilters && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onClearFilters,
          className: "inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(MagnifyingGlass, { size: 20 }),
            "Limpar Filtros"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(House, { size: 20 }),
            "Ver Cursos"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-700", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "Que tal conhecer nossos",
      " ",
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "text-purple-400 hover:text-purple-300 underline",
          children: "cursos disponíveis"
        }
      ),
      " ",
      "enquanto aguarda novos artigos?"
    ] }) })
  ] }) });
};
export {
  BlogLoading as B,
  BlogEmpty as a
};
