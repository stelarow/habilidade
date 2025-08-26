import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, Wrench, PencilLine, Buildings, Eye, CheckCircle } from "@phosphor-icons/react";
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
export {
  CourseToolsOverview as default
};
