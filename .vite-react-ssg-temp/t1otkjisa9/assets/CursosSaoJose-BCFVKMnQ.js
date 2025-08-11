import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { Link } from "react-router-dom";
import { S as SEOHead } from "./blog-components-63qilnam.js";
import { GraduationCap, Phone, WhatsappLogo, Clock } from "@phosphor-icons/react";
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
const CursosSaoJose = () => {
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
    name: "Escola Habilidade - São José SC",
    description: "Escola de cursos profissionalizantes em São José SC. Informática, SketchUp, AutoCAD, Revit, Marketing Digital.",
    url: "https://www.escolahabilidade.com/cursos-sao-jose",
    areaServed: {
      "@type": "City",
      name: "São José",
      "@id": "https://www.wikidata.org/wiki/Q986378"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "São José",
      addressRegion: "SC",
      addressCountry: "BR",
      postalCode: "88102-280",
      streetAddress: "Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "-27.5969",
      longitude: "-48.6356"
    },
    telephone: "+55 48 98855-9491",
    openingHours: "Mo-Tu 08:00-20:00, We 08:00-22:00, Th 08:00-20:00, Fr 08:00-17:30, Sa 08:00-12:00",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cursos Disponíveis em São José SC",
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
        title: "Cursos em São José SC - Escola Técnica Habilidade | Informática, AutoCAD, SketchUp",
        description: "Escola de cursos profissionalizantes em São José SC. Cursos de Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Localizada em Forquilhinhas. Certificado reconhecido!",
        keywords: "cursos são josé sc, escola técnica são josé, curso informática são josé, curso sketchup são josé, curso autocad são josé, curso revit são josé, escola forquilhinhas, cursos profissionalizantes são josé",
        path: "/cursos-sao-jose",
        schemaData
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: /* @__PURE__ */ jsx("section", { className: "relative py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: [
          "Escola de Cursos em ",
          /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "São José SC" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 max-w-3xl mx-auto", children: "Localizada no Kobrasol, a Escola Habilidade é a principal escola técnica de São José. Oferecemos cursos profissionalizantes com certificado reconhecido em todo o mercado de trabalho." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-purple-500/30", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center", children: [
          /* @__PURE__ */ jsx(GraduationCap, { className: "mr-3 text-purple-400", size: 24 }),
          "Nossa Sede em São José - Kobrasol"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "📍 Endereço Completo:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
              /* @__PURE__ */ jsx("strong", { children: "Rua Caetano José Ferreira, 426 - Sala 5" }),
              /* @__PURE__ */ jsx("br", {}),
              "Bairro Kobrasol",
              /* @__PURE__ */ jsx("br", {}),
              "São José - SC, CEP: 88102-280",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-400 mt-2 block", children: [
                "Fácil acesso pela BR-101 e SC-281",
                /* @__PURE__ */ jsx("br", {}),
                "Próximo ao centro de São José"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "📞 Entre em Contato:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
              /* @__PURE__ */ jsx(Phone, { className: "inline mr-2", size: 16 }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: "(48) 98855-9491" }),
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx(WhatsappLogo, { className: "inline mr-2 text-green-400", size: 16 }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: "(48) 98855-9491" }),
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx(Clock, { className: "inline mr-2", size: 16 }),
              " ",
              /* @__PURE__ */ jsx("strong", { children: "Horários:" }),
              /* @__PURE__ */ jsx("br", {}),
              "Seg-Ter e Qui: 8h às 20h",
              /* @__PURE__ */ jsx("br", {}),
              "Quarta: 8h às 22h",
              /* @__PURE__ */ jsx("br", {}),
              "Sexta: 8h às 17h30",
              /* @__PURE__ */ jsx("br", {}),
              "Sábado: 8h às 12h"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8 text-center", children: "Cursos Mais Procurados em São José" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: cursos.filter((c) => c.destaque).map((curso) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "group bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors", children: curso.nome }),
              /* @__PURE__ */ jsxs("p", { className: "text-zinc-400 text-sm mb-4", children: [
                "✓ Certificado reconhecido",
                /* @__PURE__ */ jsx("br", {}),
                "✓ Material didático incluso",
                /* @__PURE__ */ jsx("br", {}),
                "✓ Aulas práticas"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 font-semibold group-hover:text-purple-300", children: "Ver detalhes do curso →" })
            ]
          },
          curso.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Atendemos Todos os Bairros de São José" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300 mb-4", children: "Nossa escola no Kobrasol atende alunos de toda São José e região:" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-sm", children: [
          "Kobrasol",
          "Forquilhinhas",
          "Campinas",
          "Barreiros",
          "Fazenda Santo Antônio",
          "Bela Vista",
          "Ipiranga",
          "Roçado",
          "Praia Comprida",
          "Potecas",
          "Areias",
          "Jardim Cidade de Florianópolis",
          "Serraria",
          "Forquilhas",
          "Picadas do Sul",
          "Centro Histórico"
        ].map((bairro) => /* @__PURE__ */ jsxs("div", { className: "flex items-center text-zinc-300", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" }),
          bairro
        ] }, bairro)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Por que Somos a Melhor Escola de São José?" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-zinc-300", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Mais de 10 anos de experiência em São José" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Professores especializados e certificados" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Laboratórios equipados com tecnologia moderna" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Parcerias com empresas locais para estágios" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Taxa de empregabilidade de 85% dos alunos" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Modalidades de Ensino" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-zinc-300", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-purple-300 mb-2", children: "📚 Presencial" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Aulas 100% presenciais em nossa sede do Kobrasol com toda infraestrutura necessária." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-purple-300 mb-2", children: "💻 Online ao Vivo" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Participe das aulas em tempo real de qualquer lugar, com suporte completo dos professores." })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-purple-300 mb-2", children: "🎯 Híbrido" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Combine aulas presenciais e online conforme sua disponibilidade e necessidade." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Todos os Cursos Disponíveis em São José" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4", children: cursos.map((curso) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-zinc-300 group-hover:text-purple-400 transition-colors", children: curso.nome }),
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "→" })
            ]
          },
          curso.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-4", children: "Matricule-se Hoje na Melhor Escola de São José!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 mb-8", children: "Vagas limitadas! Garanta seu futuro profissional com nossos cursos certificados." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://wa.me/5548988559491?text=Olá! Vim do site e quero informações sobre os cursos da Escola Habilidade em São José",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { className: "mr-2 text-xl", size: 20 }),
                "Falar no WhatsApp Agora"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contato",
              className: "inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg",
              children: "Agendar Visita à Escola"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 mt-6", children: "📍 Rua Caetano José Ferreira, 426 - Sala 5 - Kobrasol, São José - SC" })
      ] })
    ] }) }) })
  ] });
};
export {
  CursosSaoJose as default
};
