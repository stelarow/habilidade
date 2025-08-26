import { jsx, jsxs } from "react/jsx-runtime";
import "react";
import { m as motion } from "./lazyMotion-Brq4XrXb.js";
const trustedCompaniesData = {
  // Empresas que fizeram cursos de design/projetos (SketchUp, AutoCAD, etc)
  design: [
    {
      name: "Portinox",
      logo: "/images/course/sketchup-enscape/_AM4K71sI76P_48oTfwuh.webp",
      description: "Equipamentos Gastronômicos"
    },
    {
      name: "Ricardo Móveis",
      logo: "/images/course/sketchup-enscape/2jNvD0A0IySCMxVqHKKLN.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Rinox",
      logo: "/images/course/sketchup-enscape/Dto_HF1D0esz2RgHkyluP.png",
      description: "Soluções Industriais"
    },
    {
      name: "Serralheria Mota",
      logo: "/images/course/sketchup-enscape/l5v_ub2GBPsN8c9qczmU6.jpeg",
      description: "Serralheria e Metalurgia"
    },
    {
      name: "Steinbach",
      logo: "/images/course/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp",
      description: "Marcenaria"
    },
    {
      name: "Torres",
      logo: "/images/course/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif",
      description: "Projetos Farmacêuticos"
    },
    {
      name: "Legno",
      logo: "/images/course/sketchup-enscape/ukKT5CnXfAVP3AS9G4jXs.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Mobiliário e Miniaturas",
      // Corrigido nome e descrição
      logo: "/images/course/sketchup-enscape/xYBvu3zwJyVFvvlKHPcz0.jpeg",
      description: "Móveis em Miniaturas"
    },
    {
      name: "Protérmica",
      logo: "/images/course/sketchup-enscape/dU-RkMhy9INgLG_2WQrOs.png",
      description: "Climatização"
    },
    {
      name: "Marcenaria JP",
      logo: "/images/course/sketchup-enscape/sXBkejmP3TgFhiLFB-2NM.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Ousadia",
      logo: "/images/course/sketchup-enscape/p4GIB7Eemw3frRpbKG2zR.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Escadas Imperatriz",
      logo: "/images/course/sketchup-enscape/PLOSn09XPv1Fkg_lJVsAG.jpeg",
      description: "Escadas e Estruturas"
    },
    {
      name: "Pedra Granada",
      logo: "/images/course/sketchup-enscape/kI8JxlGaNQo0Ecg5B1uEP.jpeg",
      description: "Marmoraria"
    },
    {
      name: "Brasil Mármore",
      logo: "/images/course/sketchup-enscape/brasil_marmore.jpg",
      description: "Marmoraria e Granitos"
    },
    {
      name: "Santa Madeira Casas",
      logo: "/images/companies/santa-madeira-casas-logo.png",
      description: "Casas de Madeira"
    },
    {
      name: "Nexus Center",
      logo: "/images/companies/nexus-center-logo.svg",
      description: "Contact Center"
    },
    {
      name: "Casa da Mana",
      logo: "/images/companies/casa-da-mana-logo.jpeg",
      description: "Produtos Artesanais"
    }
  ],
  // Empresas que fizeram cursos de informática
  informatica: [
    // Algumas empresas que também fizeram informática além de design
    {
      name: "Torres",
      logo: "/images/course/sketchup-enscape/AJ0M1WPOZVRqEu3y-N4j_.avif",
      description: "Projetos Farmacêuticos"
    },
    {
      name: "Protérmica",
      logo: "/images/course/sketchup-enscape/dU-RkMhy9INgLG_2WQrOs.png",
      description: "Climatização"
    },
    {
      name: "Rinox",
      logo: "/images/course/sketchup-enscape/Dto_HF1D0esz2RgHkyluP.png",
      description: "Soluções Industriais"
    }
  ],
  // Empresas que fizeram cursos de marketing digital
  marketing: [
    {
      name: "Ricardo Móveis",
      logo: "/images/course/sketchup-enscape/2jNvD0A0IySCMxVqHKKLN.jpeg",
      description: "Móveis Planejados"
    },
    {
      name: "Legno",
      logo: "/images/course/sketchup-enscape/ukKT5CnXfAVP3AS9G4jXs.jpeg",
      description: "Móveis sob Medida"
    },
    {
      name: "Steinbach",
      logo: "/images/course/sketchup-enscape/x3eNjRKuni5TKlKHbFZug.webp",
      description: "Marcenaria"
    }
  ]
};
const getCompaniesByCategory = (categories) => {
  {
    const allCompanies = /* @__PURE__ */ new Map();
    for (const company of Object.values(trustedCompaniesData).flat()) {
      allCompanies.set(company.name, company);
    }
    return [...allCompanies.values()];
  }
};
const TrustedCompanies = ({
  variant = "home",
  courseSlug = null,
  title = null,
  subtitle = null,
  theme = "light",
  className = ""
}) => {
  const getCompanies = () => {
    return getCompaniesByCategory();
  };
  const companies = getCompanies();
  const config = {
    home: {
      defaultTitle: "Empresas que confiam na Escola Habilidade",
      defaultSubtitle: "Profissionais de empresas regionais já se capacitaram conosco",
      layout: "grid",
      // grid compacto para home
      animationDuration: 60,
      showStats: true
    },
    course: {
      defaultTitle: "Empresas que confiam na Escola Habilidade",
      defaultSubtitle: "Profissionais de empresas regionais já se capacitaram conosco",
      layout: "carousel",
      // carrossel horizontal para cursos
      animationDuration: 120,
      showStats: false
    }
  };
  const settings = config[variant];
  const displayTitle = title || settings.defaultTitle;
  const displaySubtitle = subtitle || settings.defaultSubtitle;
  if (settings.layout === "grid") {
    return /* @__PURE__ */ jsx("section", { className: `py-16 ${theme === "dark" ? "bg-gray-900" : "bg-white"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 50 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.8 },
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsx("h2", { className: `text-3xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: displayTitle }),
            /* @__PURE__ */ jsx("p", { className: `text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: displaySubtitle })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6", children: companies.map((company, index) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: `group rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-white hover:shadow-lg"}`,
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: index * 0.05 },
          whileHover: {
            y: -3,
            boxShadow: theme === "dark" ? "0 10px 30px rgba(147, 51, 234, 0.15)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
            scale: 1.02
          },
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-16 h-16 flex items-center justify-center mb-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${theme === "dark" ? "bg-gray-700" : "bg-white"}`, children: /* @__PURE__ */ jsx(
              "img",
              {
                src: company.logo,
                alt: company.name,
                width: "64",
                height: "64",
                className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300",
                loading: "lazy"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("h3", { className: `font-semibold text-sm mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: company.name }),
              /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: company.description })
            ] })
          ]
        },
        `${company.name}-${index}`
      )) }) }),
      settings.showStats && /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.8, delay: 0.3 },
          className: "mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxs("div", { className: `text-2xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: [
                companies.length,
                "+"
              ] }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Empresas Atendidas" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "200+" }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Profissionais Formados" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "95%" }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Taxa de Satisfação" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: `text-2xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "4.9★" }),
              /* @__PURE__ */ jsx("div", { className: `text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Avaliação Média" })
            ] })
          ]
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("section", { className: `py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8 },
        className: "text-center mb-16",
        children: [
          /* @__PURE__ */ jsx("h2", { className: `text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: displayTitle }),
          /* @__PURE__ */ jsx("p", { className: `text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`, children: displaySubtitle })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "flex space-x-8",
          animate: {
            x: [0, -(208 * companies.length)]
          },
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: settings.animationDuration,
              ease: "linear"
            }
          },
          children: [
            companies.map((company, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-white hover:shadow-lg"}`,
                whileHover: {
                  y: -5,
                  boxShadow: theme === "dark" ? "0 10px 30px rgba(147, 51, 234, 0.15)" : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${theme === "dark" ? "bg-gray-700" : "bg-white"}`, children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: company.logo,
                      alt: company.name,
                      width: "80",
                      height: "80",
                      className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300",
                      loading: "lazy"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("h3", { className: `font-semibold text-sm mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: company.name }),
                    /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: company.description })
                  ] })
                ]
              },
              `first-${index}`
            )),
            companies.map((company, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-white hover:shadow-lg"}`,
                whileHover: {
                  y: -5,
                  boxShadow: theme === "dark" ? "0 10px 30px rgba(147, 51, 234, 0.15)" : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${theme === "dark" ? "bg-gray-700" : "bg-white"}`, children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: company.logo,
                      alt: company.name,
                      width: "80",
                      height: "80",
                      className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300",
                      loading: "lazy"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("h3", { className: `font-semibold text-sm mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: company.name }),
                    /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: company.description })
                  ] })
                ]
              },
              `second-${index}`
            )),
            companies.slice(0, 3).map((company, index) => /* @__PURE__ */ jsxs(
              motion.div,
              {
                className: `group rounded-xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-w-[200px] flex-shrink-0 ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-50 hover:bg-white hover:shadow-lg"}`,
                whileHover: {
                  y: -5,
                  boxShadow: theme === "dark" ? "0 10px 30px rgba(147, 51, 234, 0.15)" : "0 10px 30px rgba(147, 51, 234, 0.15)",
                  scale: 1.05
                },
                children: [
                  /* @__PURE__ */ jsx("div", { className: `w-20 h-20 flex items-center justify-center mb-4 rounded-lg shadow-sm group-hover:shadow-md transition-shadow ${theme === "dark" ? "bg-gray-700" : "bg-white"}`, children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: company.logo,
                      alt: company.name,
                      width: "80",
                      height: "80",
                      className: "max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300",
                      loading: "lazy"
                    }
                  ) }),
                  /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                    /* @__PURE__ */ jsx("h3", { className: `font-semibold text-sm mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`, children: company.name }),
                    /* @__PURE__ */ jsx("p", { className: `text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: company.description })
                  ] })
                ]
              },
              `third-${index}`
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10 pointer-events-none ${theme === "dark" ? "from-gray-900" : "from-white"}` }),
      /* @__PURE__ */ jsx("div", { className: `absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l to-transparent z-10 pointer-events-none ${theme === "dark" ? "from-gray-900" : "from-white"}` })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.8, delay: 0.3 },
        className: "mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxs("div", { className: `text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: [
              companies.length,
              "+"
            ] }),
            /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Empresas Atendidas" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "200+" }),
            /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Projetos Entregues" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "95%" }),
            /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Taxa de Aprovação" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`, children: "4.9★" }),
            /* @__PURE__ */ jsx("div", { className: `${theme === "dark" ? "text-gray-400" : "text-gray-600"}`, children: "Avaliação Média" })
          ] })
        ]
      }
    )
  ] }) });
};
export {
  TrustedCompanies as T
};
