import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { C as ContactForm } from "./ContactForm-DLVD-A1A.js";
import { S as SEOHead } from "./blog-components-BiqxfVKP.js";
import { Users, MapPin, Phone, Envelope, Clock } from "@phosphor-icons/react";
import "@emailjs/browser";
import "../main.mjs";
import "vite-react-ssg";
import "react-router-dom";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "@tanstack/react-query-devtools";
import "prop-types";
import "./utils-DYyrIPL_.js";
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
const Contact = () => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Contato - Escola Habilidade | Entre em contato conosco",
        description: "Entre em contato com a Escola Habilidade. Tire suas dúvidas sobre nossos cursos profissionalizantes em Florianópolis, São José e Palhoça. Estamos aqui para ajudar!",
        keywords: "contato escola habilidade, falar com escola habilidade, dúvidas cursos florianópolis, contato cursos são josé, atendimento escola técnica",
        path: "/contato",
        type: "website"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900", children: [
      /* @__PURE__ */ jsx("div", { className: "pt-24 pb-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 text-center", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: [
          "Entre em ",
          /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600", children: "Contato" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-300 max-w-3xl mx-auto", children: "Estamos aqui para esclarecer suas dúvidas e ajudar você a escolher o curso ideal para sua carreira" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Users, { className: "text-blue-400", size: 28 }),
              "Informações de Contato"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "text-blue-400 mt-1", size: 24 }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-1", children: "Endereço" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
                    "Rua Koesa, 113 - Kobrasol",
                    /* @__PURE__ */ jsx("br", {}),
                    "São José, SC - CEP: 88102-310"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx(Phone, { className: "text-green-400 mt-1", size: 24 }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-1", children: "Telefones" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
                    "WhatsApp: (48) 98855-9491",
                    /* @__PURE__ */ jsx("br", {}),
                    "Fixo: (48) 3206-5246"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx(Envelope, { className: "text-purple-400 mt-1", size: 24 }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-1", children: "E-mail" }),
                  /* @__PURE__ */ jsx("p", { className: "text-gray-300", children: "contato@escolahabilidade.com" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx(Clock, { className: "text-orange-400 mt-1", size: 24 }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-1", children: "Horário de Atendimento" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-gray-300", children: [
                    "Segunda a Sexta: 08:00 às 18:00",
                    /* @__PURE__ */ jsx("br", {}),
                    "Sábado: 08:00 às 12:00"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Como Chegar" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-300 mb-4", children: "Nossa escola fica no coração de Kobrasol, em São José, com fácil acesso para toda a Grande Florianópolis." }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm text-gray-400", children: [
              /* @__PURE__ */ jsx("p", { children: "• Próximo ao Shopping Kobrasol" }),
              /* @__PURE__ */ jsx("p", { children: "• Fácil acesso de ônibus" }),
              /* @__PURE__ */ jsx("p", { children: "• Estacionamento disponível na região" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(ContactForm, {}) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6 text-center", children: "Perguntas Frequentes" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-2", children: "Como faço a matrícula?" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Entre em contato conosco pelo formulário ou WhatsApp. Nossa equipe irá orientar todo o processo." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-2", children: "Os cursos têm certificado?" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Sim, todos os nossos cursos oferecem certificado reconhecido e válido nacionalmente." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-2", children: "Posso visitar a escola?" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Claro! Agende uma visita e conheça nossa estrutura e metodologia de ensino." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-white font-semibold mb-2", children: "Há desconto para pagamento à vista?" }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-300 text-sm", children: "Sim, oferecemos condições especiais. Entre em contato para conhecer nossas promoções." })
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
};
export {
  Contact as default
};
