import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { WarningCircle, ArrowCounterClockwise, House } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
const BlogError = ({ error, onRetry }) => {
  const getErrorInfo = () => {
    const errorMessage = (error == null ? void 0 : error.message) || "Erro desconhecido";
    if (errorMessage.includes("indisponivel") || errorMessage.includes("ECONNREFUSED")) {
      return {
        title: "Servidor Temporariamente Indispon�vel",
        description: "Nosso servidor est� passando por manuten��o. Tente novamente em alguns minutos.",
        icon: "�",
        showRetry: true
      };
    }
    if (errorMessage.includes("timeout") || errorMessage.includes("rede")) {
      return {
        title: "Problema de Conex�o",
        description: "Verifique sua conex�o com a internet e tente novamente.",
        icon: "<",
        showRetry: true
      };
    }
    if (errorMessage.includes("404") || errorMessage.includes("nao encontrado")) {
      return {
        title: "Conte�do N�o Encontrado",
        description: "Os artigos que voc� est� procurando n�o foram encontrados.",
        icon: "=�",
        showRetry: false
      };
    }
    return {
      title: "Erro Inesperado",
      description: "Algo deu errado ao carregar os artigos. Tente novamente.",
      icon: "�",
      showRetry: true
    };
  };
  const errorInfo = getErrorInfo();
  return /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 py-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md mx-auto text-center", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "w-24 h-24 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(WarningCircle, { size: 48, className: "text-red-400" }) }),
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: errorInfo.icon })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-zinc-100 mb-4", children: errorInfo.title }),
      /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-lg leading-relaxed mb-2", children: errorInfo.description }),
      false
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      errorInfo.showRetry && onRetry && /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onRetry,
          className: "inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full justify-center",
          children: [
            /* @__PURE__ */ jsx(ArrowCounterClockwise, { size: 20 }),
            "Tentar Novamente"
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
            "Voltar ao In�cio"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-700", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "Se o problema persistir, entre em contato conosco atrav�s do",
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://wa.me/5548988559491",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-purple-400 hover:text-purple-300 underline",
          children: "WhatsApp"
        }
      )
    ] }) })
  ] }) });
};
export {
  BlogError as B
};
