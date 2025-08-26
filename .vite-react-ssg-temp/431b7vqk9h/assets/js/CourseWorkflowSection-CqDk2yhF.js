import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { ArrowRight, CheckCircle, Play } from "@phosphor-icons/react";
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
export {
  CourseWorkflowSection as default
};
