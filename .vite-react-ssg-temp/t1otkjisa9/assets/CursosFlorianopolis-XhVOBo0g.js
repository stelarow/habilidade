import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { Link } from "react-router-dom";
import { S as SEOHead } from "./blog-components-63qilnam.js";
import { MapPin, Phone, WhatsappLogo, Clock } from "@phosphor-icons/react";
import "./utils-CtCVPYGt.js";
import "prop-types";
import "@tanstack/react-query";
import "./blog-Ce_COAIv.js";
import "@supabase/supabase-js";
import "marked";
import "highlight.js/lib/core";
import "highlight.js/lib/languages/javascript";
import "highlight.js/lib/languages/python";
import "highlight.js/lib/languages/sql";
import "highlight.js/lib/languages/css";
import "highlight.js/lib/languages/xml";
import "node-html-parser";
import "@dr.pogodin/react-helmet";
const CursosFlorianopolis = () => {
  const cursos = [
    { nome: "Informática Completa", slug: "informatica", destaque: true },
    { nome: "AutoCAD 2D e 3D", slug: "autocad-2d-3d", destaque: true },
    { nome: "Revit Architecture", slug: "revit", destaque: true },
    { nome: "Marketing Digital", slug: "marketing-digital", destaque: true },
    { nome: "Programação Full Stack", slug: "programacao", destaque: false },
    { nome: "Design Gráfico", slug: "design-grafico", destaque: false },
    { nome: "Edição de Vídeo", slug: "edicao-video", destaque: false },
    { nome: "Business Intelligence", slug: "business-intelligence", destaque: false },
    { nome: "Inteligência Artificial", slug: "inteligencia-artificial", destaque: false }
  ];
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Escola Habilidade - Florianópolis",
    description: "Cursos profissionalizantes em Florianópolis: Informática, SketchUp, AutoCAD, Revit, Marketing Digital e mais.",
    url: "https://www.escolahabilidade.com/cursos-florianopolis",
    areaServed: {
      "@type": "City",
      name: "Florianópolis",
      "@id": "https://www.wikidata.org/wiki/Q25444"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "São José",
      addressRegion: "SC",
      addressCountry: "BR",
      postalCode: "88102-280",
      streetAddress: "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol"
    },
    telephone: "+55 48 98855-9491",
    openingHours: "Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cursos Disponíveis em Florianópolis",
      itemListElement: cursos.map((curso) => ({
        "@type": "Course",
        name: curso.nome,
        url: `https://www.escolahabilidade.com/cursos/${curso.slug}`,
        provider: {
          "@type": "EducationalOrganization",
          name: "Escola Habilidade"
        }
      }))
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: "Cursos Profissionalizantes em Florianópolis - Escola Habilidade",
        description: "Cursos técnicos e profissionalizantes em Florianópolis. Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Certificado reconhecido. Matrículas abertas!",
        keywords: "cursos florianópolis, escola técnica florianópolis, curso informática florianópolis, curso sketchup florianópolis, curso autocad florianópolis, curso revit florianópolis, cursos profissionalizantes florianópolis",
        path: "/cursos-florianopolis",
        schemaData
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: /* @__PURE__ */ jsx("section", { className: "relative py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-6", children: [
          /* @__PURE__ */ jsx("span", { className: "block text-5xl md:text-6xl gradient-text mb-2", children: "Escola Habilidade" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl md:text-3xl text-purple-400 font-medium", children: "Cursos Profissionalizantes em Florianópolis" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 max-w-3xl mx-auto mb-8", children: "Os melhores cursos técnicos e profissionalizantes para moradores de Florianópolis e região. Transforme sua carreira com nossos cursos certificados." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-purple-400 mb-2", children: "15+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-300", children: "Anos de experiência" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-400 mb-2", children: "5000+" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-300", children: "Alunos formados" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-green-400 mb-2", children: "85%" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-300", children: "Taxa de empregabilidade" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-orange-400 mb-2", children: "10" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-zinc-300", children: "Cursos disponíveis" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-zinc-800", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "mr-3 text-purple-400", size: 24 }),
          "Atendemos toda a Grande Florianópolis"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "Localização:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
              "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol",
              /* @__PURE__ */ jsx("br", {}),
              "São José - SC, 88102-280",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-400", children: "(Próximo a Florianópolis - 15 min do centro)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "Contato:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
              /* @__PURE__ */ jsx(Phone, { className: "inline mr-2", size: 16 }),
              " (48) 98855-9491",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx(WhatsappLogo, { className: "inline mr-2 text-green-400", size: 16 }),
              " (48) 98855-9491",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx(Clock, { className: "inline mr-2", size: 16 }),
              " Seg-Ter-Qui: 8h-20h | Qua: 8h-22h | Sex: 8h-17h30 | Sáb: 8h-12h"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8 text-center", children: "Cursos Mais Procurados em Florianópolis" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: cursos.filter((c) => c.destaque).map((curso) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "group bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors", children: curso.nome }),
              /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm mb-4", children: "Certificado reconhecido • Aulas presenciais e online" }),
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 font-semibold group-hover:text-purple-300", children: "Saiba mais →" })
            ]
          },
          curso.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Todos os Cursos Disponíveis" }),
        /* @__PURE__ */ jsx("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800", children: /* @__PURE__ */ jsx("ul", { className: "grid md:grid-cols-2 gap-4", children: cursos.map((curso) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "flex items-center text-zinc-300 hover:text-purple-400 transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-purple-400 rounded-full mr-3" }),
              curso.nome
            ]
          }
        ) }, curso.slug)) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Por que a Escola Habilidade é a Melhor Escolha em Florianópolis?" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "✓ Certificado Reconhecido" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm", children: "Nossos certificados são reconhecidos em todo o mercado de trabalho da Grande Florianópolis." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "✓ Professores Especializados" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm", children: "Instrutores com experiência prática no mercado de Florianópolis e região." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "✓ Material Didático Incluso" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm", children: "Apostilas e materiais completos inclusos no valor do curso." })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "✓ Flexibilidade de Horários" }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm", children: "Aulas presenciais e online, com horários flexíveis para sua rotina." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-zinc-800", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8 text-center", children: "Mercado de Trabalho em Florianópolis" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-purple-300 mb-4", children: "🎯 Oportunidades Crescentes" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-zinc-300", children: [
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("strong", { children: "Florianópolis" }),
                " é reconhecida como um dos principais centros tecnológicos do Sul do Brasil, com um ecossistema de startups e empresas de tecnologia em constante crescimento."
              ] }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc list-inside space-y-2 text-sm", children: [
                /* @__PURE__ */ jsx("li", { children: "Mais de 800 empresas de tecnologia na Grande Florianópolis" }),
                /* @__PURE__ */ jsx("li", { children: "Hub de inovação com crescimento de 15% ao ano" }),
                /* @__PURE__ */ jsx("li", { children: "Demanda crescente por profissionais qualificados em design e programação" }),
                /* @__PURE__ */ jsx("li", { children: "Salários 20% acima da média nacional para profissionais técnicos" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-blue-300 mb-4", children: "💼 Setores em Alta" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 p-4 rounded-lg", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white mb-2", children: "Tecnologia & Software" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300", children: "Desenvolvimento web, mobile e sistemas" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 p-4 rounded-lg", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white mb-2", children: "Arquitetura & Design" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300", children: "Projetos residenciais e comerciais" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-zinc-800/50 p-4 rounded-lg", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-semibold text-white mb-2", children: "Marketing Digital" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-300", children: "E-commerce e consultoria digital" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-white mb-3 flex items-center", children: "📈 Por que escolher Florianópolis para sua carreira?" }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-4 text-sm text-zinc-300", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-purple-300", children: "Qualidade de vida:" }),
              /* @__PURE__ */ jsx("span", { className: "block", children: "Excelente infraestrutura e clima" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-blue-300", children: "Networking:" }),
              /* @__PURE__ */ jsx("span", { className: "block", children: "Comunidade tech ativa e colaborativa" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("strong", { className: "text-green-300", children: "Crescimento:" }),
              /* @__PURE__ */ jsx("span", { className: "block", children: "Oportunidades de carreira e empreendedorismo" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-6", children: "Comece Hoje Mesmo!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 mb-8", children: "Matrículas abertas para todos os cursos. Vagas limitadas!" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://wa.me/5548988559491?text=Olá! Vim do site e quero informações sobre os cursos em Florianópolis",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { className: "mr-2 text-xl", size: 20 }),
                "Falar no WhatsApp"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contato",
              className: "inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105",
              children: "Solicitar Informações"
            }
          )
        ] })
      ] })
    ] }) }) })
  ] });
};
export {
  CursosFlorianopolis as default
};
