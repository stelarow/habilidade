import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import "react";
import { Link } from "react-router-dom";
import { S as SEOHead } from "../../main.mjs";
import { MapPin, Car, Bus, WhatsappLogo, Phone } from "@phosphor-icons/react";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
import "@supabase/supabase-js";
import "@emailjs/browser";
const CursosPalhoca = () => {
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
    name: "Escola Habilidade - Cursos em Palhoça SC",
    description: "Cursos profissionalizantes para moradores de Palhoça. Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Próximo a Palhoça.",
    url: "https://www.escolahabilidade.com/cursos-palhoca",
    areaServed: [
      {
        "@type": "City",
        name: "Palhoça",
        "@id": "https://www.wikidata.org/wiki/Q986369"
      },
      {
        "@type": "City",
        name: "São José",
        "@id": "https://www.wikidata.org/wiki/Q986378"
      }
    ],
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
      name: "Cursos para Moradores de Palhoça",
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
        title: "Cursos em Palhoça SC - Escola Técnica Próxima | Informática, AutoCAD, Marketing",
        description: "Cursos profissionalizantes para moradores de Palhoça SC. Escola localizada próxima, em São José. Cursos de Informática, SketchUp, AutoCAD, Revit, Marketing Digital. Fácil acesso!",
        keywords: "cursos palhoça sc, escola técnica palhoça, curso informática palhoça, curso autocad palhoça, curso sketchup palhoça, curso revit palhoça, cursos profissionalizantes palhoça, escola próxima palhoça",
        path: "/cursos-palhoca",
        schemaData
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: /* @__PURE__ */ jsx("section", { className: "relative py-20 px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold text-white mb-4", children: [
          "Cursos Profissionalizantes para ",
          /* @__PURE__ */ jsx("span", { className: "text-purple-400", children: "Palhoça SC" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 max-w-3xl mx-auto", children: "A Escola Habilidade está estrategicamente localizada próxima a Palhoça, oferecendo os melhores cursos técnicos com fácil acesso para todos os moradores da região." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-purple-500/30", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-white mb-6 flex items-center", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "mr-3 text-purple-400", size: 24 }),
          "Fácil Acesso para Moradores de Palhoça"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "📍 Nossa Localização:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-zinc-300", children: [
              /* @__PURE__ */ jsx("strong", { children: "Rua Caetano José Ferreira, 426 - Sala 5" }),
              /* @__PURE__ */ jsx("br", {}),
              "Kobrasol - São José/SC - CEP: 88102-280",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsxs("span", { className: "text-sm text-zinc-400 mt-2 block", children: [
                /* @__PURE__ */ jsx("strong", { children: "Apenas 15 minutos de Palhoça!" }),
                /* @__PURE__ */ jsx("br", {}),
                "Via BR-101 ou SC-281"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-purple-300 mb-3", children: "🚗 Como Chegar:" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-zinc-300 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(Car, { className: "mr-2 mt-1 text-purple-400", size: 16 }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "De carro:" }),
                  " 15-20 min via BR-101"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx(Bus, { className: "mr-2 mt-1 text-purple-400", size: 16 }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Ônibus:" }),
                  " Linhas que conectam Palhoça-São José"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-start", children: [
                /* @__PURE__ */ jsx("span", { className: "mr-2", children: "🅿️" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  /* @__PURE__ */ jsx("strong", { children: "Estacionamento:" }),
                  " Gratuito no local"
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-8 text-center", children: "Cursos Mais Procurados por Alunos de Palhoça" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: cursos.filter((c) => c.destaque).map((curso) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "group bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 hover:border-purple-400 transition-all hover:scale-105",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors", children: curso.nome }),
              /* @__PURE__ */ jsxs("div", { className: "text-zinc-400 text-sm mb-4", children: [
                /* @__PURE__ */ jsx("p", { className: "mb-2", children: "✓ Certificado reconhecido" }),
                /* @__PURE__ */ jsx("p", { className: "mb-2", children: "✓ Material didático incluso" }),
                /* @__PURE__ */ jsx("p", { children: "✓ Horários flexíveis" })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 font-semibold group-hover:text-purple-300", children: "Saiba mais →" })
            ]
          },
          curso.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "Atendemos Todas as Regiões de Palhoça" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-300 mb-4", children: "Nossos alunos vêm de todos os bairros e regiões de Palhoça:" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-sm", children: [
          "Centro",
          "Ponte do Imaruim",
          "Pedra Branca",
          "Pagani",
          "Jardim Eldorado",
          "Bela Vista",
          "Caminho Novo",
          "Passa Vinte",
          "Aririú",
          "Barra do Aririú",
          "Pachecos",
          "Madri",
          "São Sebastião",
          "Brejarú",
          "Enseada do Brito",
          "Guarda do Embaú"
        ].map((bairro) => /* @__PURE__ */ jsxs("div", { className: "flex items-center text-zinc-300", children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" }),
          bairro
        ] }, bairro)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Vantagens Especiais para Palhoça" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-zinc-300", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Horários especiais para quem trabalha em Florianópolis" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Turmas aos sábados para maior flexibilidade" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Modalidade online para quem prefere estudar de casa" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Parcelamento facilitado em até 12x" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "✓" }),
              /* @__PURE__ */ jsx("span", { children: "Descontos para grupos de amigos/família" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Por Que Escolher Nossa Escola?" }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-zinc-300", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "🏆" }),
              /* @__PURE__ */ jsx("span", { children: "Melhor escola técnica da região metropolitana" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "👨‍🏫" }),
              /* @__PURE__ */ jsx("span", { children: "Professores com experiência no mercado" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "💼" }),
              /* @__PURE__ */ jsx("span", { children: "Encaminhamento para vagas de emprego" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "🖥️" }),
              /* @__PURE__ */ jsx("span", { children: "Laboratórios modernos e equipados" })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start", children: [
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 mr-2", children: "📚" }),
              /* @__PURE__ */ jsx("span", { children: "Material didático completo incluso" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6 text-center", children: "O Que Dizem Nossos Alunos de Palhoça" }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm italic mb-3", children: '"Vale muito a pena o deslocamento! O curso de AutoCAD mudou minha carreira. Consegui um emprego antes mesmo de terminar o curso."' }),
            /* @__PURE__ */ jsx("p", { className: "text-purple-400 font-semibold text-sm", children: "- Maria S., Pedra Branca" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm italic mb-3", children: '"A modalidade online foi perfeita para mim. Moro no Caminho Novo e consigo acompanhar todas as aulas sem problemas."' }),
            /* @__PURE__ */ jsx("p", { className: "text-purple-400 font-semibold text-sm", children: "- João P., Caminho Novo" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 rounded-lg p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 text-sm italic mb-3", children: '"Fiz o curso de Marketing Digital e hoje trabalho como freelancer. A escola tem ótima estrutura e professores excelentes!"' }),
            /* @__PURE__ */ jsx("p", { className: "text-purple-400 font-semibold text-sm", children: "- Ana C., Centro" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800 mb-12", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-white mb-6", children: "Todos os Cursos Disponíveis para Palhoça" }),
        /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-4", children: cursos.map((curso) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/cursos/${curso.slug}`,
            className: "flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-zinc-300 group-hover:text-purple-400 transition-colors", children: curso.nome }),
              /* @__PURE__ */ jsx("span", { className: "text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity", children: "Ver detalhes →" })
            ]
          },
          curso.slug
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-4", children: "Comece Hoje Mesmo Seu Curso!" }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 mb-6", children: "Não perca mais tempo! Invista no seu futuro profissional." }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-purple-300 mb-8", children: "📍 Apenas 15 minutos de Palhoça • 🅿️ Estacionamento Gratuito" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "https://wa.me/5548988559491?text=Olá! Sou de Palhoça e quero informações sobre os cursos da Escola Habilidade",
              target: "_blank",
              rel: "noopener noreferrer",
              className: "inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { className: "mr-2 text-xl", size: 20 }),
                "WhatsApp - Resposta Imediata"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "tel:+5548988559491",
              className: "inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg",
              children: [
                /* @__PURE__ */ jsx(Phone, { className: "mr-2", size: 20 }),
                "Ligar: (48) 98855-9491"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400 mt-6", children: "Atendimento: Seg-Ter-Qui 8h-20h | Qua 8h-22h | Sex 8h-17h30 | Sáb 8h-12h" })
      ] })
    ] }) }) })
  ] });
};
export {
  CursosPalhoca as default
};
