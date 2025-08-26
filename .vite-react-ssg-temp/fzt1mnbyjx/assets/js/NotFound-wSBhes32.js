import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
function NotFound() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("title", { children: "Página não encontrada - Escola Habilidade" }),
    /* @__PURE__ */ jsx("meta", { name: "description", content: "A página que você procura não foi encontrada. Explore nossos cursos e encontre a formação ideal para você." }),
    /* @__PURE__ */ jsx("meta", { name: "robots", content: "noindex, nofollow" }),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-radial from-gray-900 via-black to-gray-900 flex items-center justify-center px-4", children: /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4", children: "404" }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-4xl font-bold text-white mb-4", children: "Página não encontrada" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8", children: "Ops! A página que você está procurando não existe ou foi movida. Que tal explorar nossos cursos?" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/",
            className: "inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105",
            children: "Voltar ao Início"
          }
        ),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/#courses",
            className: "inline-flex items-center justify-center px-8 py-3 border-2 border-blue-500 text-blue-400 font-semibold rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300",
            children: "Ver Cursos"
          }
        )
      ] })
    ] }) })
  ] });
}
function loader() {
  return null;
}
export {
  NotFound as Component,
  NotFound as default,
  loader
};
