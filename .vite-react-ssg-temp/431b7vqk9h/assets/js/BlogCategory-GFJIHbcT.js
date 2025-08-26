import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate, Link, useParams, useSearchParams } from "react-router-dom";
import { Funnel, CaretDown, MagnifyingGlass, X, Tag, Hash, TrendUp, Article, Clock, ArrowLeft } from "@phosphor-icons/react";
import { a as useCategories, b as useInfinitePostsByCategory } from "./useBlogAPI-CVn3KLQ0.js";
import { u as useInView, B as BlogCard } from "./BlogCard-B6t_pAmP.js";
import { B as BlogLoading, a as BlogEmpty } from "./BlogEmpty-DUhiSxKY.js";
import { B as BlogError } from "./BlogError-pFcvE5Id.js";
import { S as SEOHead } from "./SEOHead-D4a6AqjW.js";
import { B as Breadcrumbs } from "./Breadcrumbs-CKlA74mN.js";
import "@tanstack/react-query";
import "./blog-data-CxiE244K.js";
import "./useBlogResponsive-DotabLZl.js";
import "./blogTheme-Ctep9-MK.js";
import "@dr.pogodin/react-helmet";
const BlogNavigation = ({
  searchQuery = "",
  onSearchChange,
  selectedCategory = null,
  onCategoryChange,
  showSearch = true,
  showCategories = true,
  showPopular = true,
  className = "",
  variant = "sidebar"
  // 'sidebar', 'horizontal', 'compact'
}) => {
  var _a;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [popularPosts] = useState([]);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = ((_a = categoriesData == null ? void 0 : categoriesData.data) == null ? void 0 : _a.categories) || [];
  const handleSearchInput = (event) => {
    const value = event.target.value;
    onSearchChange == null ? void 0 : onSearchChange(value);
    const searchParams = new URLSearchParams(location.search);
    if (value.trim()) {
      searchParams.set("search", value.trim());
    } else {
      searchParams.delete("search");
    }
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  };
  const handleCategorySelect = (categorySlug) => {
    onCategoryChange == null ? void 0 : onCategoryChange(categorySlug === selectedCategory ? null : categorySlug);
    if (categorySlug && categorySlug !== selectedCategory) {
      navigate(`/blog/categoria/${categorySlug}`);
    } else if (categorySlug === selectedCategory) {
      navigate("/blog");
    }
  };
  const clearFilters = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    onSearchChange == null ? void 0 : onSearchChange("");
    onCategoryChange == null ? void 0 : onCategoryChange(null);
    navigate("/blog");
  };
  const activeFiltersCount = [
    searchQuery == null ? void 0 : searchQuery.trim(),
    selectedCategory
  ].filter(Boolean).length;
  useEffect(() => {
    const handleKeyDown = (event) => {
      var _a2, _b;
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        (_a2 = searchInputRef.current) == null ? void 0 : _a2.focus();
      }
      if (event.key === "Escape" && isSearchFocused) {
        (_b = searchInputRef.current) == null ? void 0 : _b.blur();
        if (searchQuery) {
          onSearchChange == null ? void 0 : onSearchChange("");
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, isSearchFocused, onSearchChange]);
  const SearchSection = () => showSearch && /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("div", { className: `relative ${isSearchFocused ? "ring-2 ring-purple-500/50" : ""} rounded-lg transition-all duration-200`, children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(
        MagnifyingGlass,
        {
          size: 20,
          className: `transition-colors ${isSearchFocused ? "text-purple-400" : "text-zinc-500"}`
        }
      ) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: searchInputRef,
          type: "text",
          placeholder: "Pesquisar artigos... (Ctrl+K)",
          defaultValue: searchQuery,
          onChange: handleSearchInput,
          onFocus: () => setIsSearchFocused(true),
          onBlur: () => setIsSearchFocused(false),
          className: "w-full pl-10 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none transition-colors"
        }
      ),
      searchQuery && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            if (searchInputRef.current) {
              searchInputRef.current.value = "";
              onSearchChange == null ? void 0 : onSearchChange("");
            }
          },
          className: "absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      )
    ] }),
    isSearchFocused && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-2 p-3 bg-zinc-800/90 backdrop-blur-sm border border-zinc-700/50 rounded-lg text-xs text-zinc-400", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("span", { children: "Pressione Enter para pesquisar" }),
      /* @__PURE__ */ jsx("span", { children: "Esc para limpar" })
    ] }) })
  ] });
  const CategoriesSection = () => showCategories && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-zinc-100 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Tag, { size: 20, className: "text-purple-400" }),
        "Categorias"
      ] }),
      selectedCategory && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleCategorySelect(null),
          className: "text-xs text-zinc-500 hover:text-purple-400 transition-colors",
          children: "Limpar"
        }
      )
    ] }),
    categoriesLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-2", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-8 bg-zinc-700/30 rounded animate-pulse" }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      categories.map((category) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => handleCategorySelect(category.slug),
          className: `w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${selectedCategory === category.slug ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" : "bg-zinc-800/30 border border-transparent text-zinc-300 hover:bg-zinc-700/50 hover:border-zinc-600/50"}`,
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Hash, { size: 14 }),
              category.name
            ] }),
            category.post_count && /* @__PURE__ */ jsx("span", { className: `text-xs px-2 py-1 rounded-full ${selectedCategory === category.slug ? "bg-purple-400/20 text-purple-200" : "bg-zinc-600/50 text-zinc-400"}`, children: category.post_count })
          ]
        },
        category.id
      )),
      categories.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-zinc-500", children: [
        /* @__PURE__ */ jsx(Tag, { size: 24, className: "mx-auto mb-2 opacity-30" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Nenhuma categoria dispon�vel" })
      ] })
    ] })
  ] });
  const PopularSection = () => showPopular && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-zinc-100 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(TrendUp, { size: 20, className: "text-orange-400" }),
      "Posts Populares"
    ] }),
    popularPosts.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-6 text-zinc-500", children: [
      /* @__PURE__ */ jsx(Article, { size: 24, className: "mx-auto mb-2 opacity-30" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Posts populares em breve" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: popularPosts.slice(0, 5).map((post) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/blog/${post.slug}`,
        className: "block p-3 bg-zinc-800/30 hover:bg-zinc-700/50 border border-transparent hover:border-zinc-600/50 rounded-lg transition-all duration-200",
        children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-medium text-zinc-200 line-clamp-2 mb-1", children: post.title }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-zinc-500", children: [
            /* @__PURE__ */ jsx(Clock, { size: 12 }),
            /* @__PURE__ */ jsxs("span", { children: [
              post.reading_time || 5,
              " min de leitura"
            ] })
          ] })
        ]
      },
      post.id
    )) })
  ] });
  const ActiveFilters = () => activeFiltersCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg", children: [
    /* @__PURE__ */ jsx(Funnel, { size: 16, className: "text-purple-400" }),
    /* @__PURE__ */ jsxs("span", { className: "text-sm text-purple-300", children: [
      activeFiltersCount,
      " filtro",
      activeFiltersCount !== 1 ? "s" : "",
      " ativo",
      activeFiltersCount !== 1 ? "s" : ""
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: clearFilters,
        className: "ml-auto text-xs text-purple-400 hover:text-purple-300 transition-colors underline",
        children: "Limpar todos"
      }
    )
  ] });
  if (variant === "horizontal") {
    return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-4 p-4 bg-zinc-800/30 rounded-lg ${className}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 max-w-md", children: /* @__PURE__ */ jsx(SearchSection, {}) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setIsFilterOpen(!isFilterOpen),
            className: "flex items-center gap-2 px-4 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-lg text-zinc-300 transition-colors",
            children: [
              /* @__PURE__ */ jsx(Funnel, { size: 16 }),
              "Filtros",
              activeFiltersCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full", children: activeFiltersCount }),
              /* @__PURE__ */ jsx(CaretDown, { size: 16, className: `transition-transform ${isFilterOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        isFilterOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full right-0 mt-2 w-80 p-4 bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl z-50", children: /* @__PURE__ */ jsx(CategoriesSection, {}) })
      ] })
    ] });
  }
  if (variant === "compact") {
    return /* @__PURE__ */ jsxs("div", { className: `space-y-4 ${className}`, children: [
      /* @__PURE__ */ jsx(SearchSection, {}),
      /* @__PURE__ */ jsx(ActiveFilters, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: `space-y-6 ${className}`, children: [
    /* @__PURE__ */ jsx(SearchSection, {}),
    /* @__PURE__ */ jsx(ActiveFilters, {}),
    /* @__PURE__ */ jsx(CategoriesSection, {}),
    /* @__PURE__ */ jsx(PopularSection, {})
  ] });
};
const getCategoryColor = (categorySlug) => {
  const colors = {
    "tecnologia": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "educacao": "bg-green-500/20 text-green-300 border-green-500/30",
    "carreira": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "design": "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "programacao": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "marketing": "bg-red-500/20 text-red-300 border-red-500/30"
  };
  return colors[categorySlug] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30";
};
const BlogCategory = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedSearchQuery) {
      newParams.set("search", debouncedSearchQuery);
    }
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchQuery, setSearchParams]);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfinitePostsByCategory(categorySlug, 12);
  const { data: categoriesData } = useCategories();
  const [loadMoreRef, inView] = useInView({
    threshold: 0.1,
    rootMargin: "100px"
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const posts = useMemo(() => {
    var _a;
    return ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page.posts)) || [];
  }, [data]);
  const categories = (categoriesData == null ? void 0 : categoriesData.categories) || [];
  const categoryDescriptions = {
    "tecnologia": {
      name: "Tecnologia",
      description: "Descubra as últimas tendências em tecnologia que estão transformando o mercado de trabalho. Artigos sobre inteligência artificial, programação, ferramentas digitais e inovações que impactam sua carreira profissional.",
      longDescription: "A tecnologia evolui rapidamente e estar atualizado é fundamental para o sucesso profissional. Nossos artigos abordam desde conceitos básicos até tecnologias avançadas, sempre com foco prático para aplicação no mercado de trabalho.",
      benefits: ["Mantenha-se atualizado com as tendências", "Desenvolva habilidades técnicas valiosas", "Entenda o impacto da tecnologia nos negócios"]
    },
    "design": {
      name: "Design",
      description: "Explore o universo do design gráfico, 3D e visual. Aprenda técnicas, ferramentas e metodologias para criar projetos impactantes e desenvolver sua criatividade profissional.",
      longDescription: "O design é uma área que combina criatividade com estratégia. Nossos conteúdos cobrem desde fundamentos do design até técnicas avançadas de modelagem 3D, sempre focando na aplicação prática e no desenvolvimento profissional.",
      benefits: ["Desenvolva seu olhar criativo", "Domine ferramentas profissionais", "Crie portfólio de alta qualidade"]
    },
    "programacao": {
      name: "Programação",
      description: "Mergulhe no mundo da programação com artigos práticos sobre linguagens, frameworks e metodologias de desenvolvimento. Do iniciante ao avançado, conteúdo para toda sua jornada.",
      longDescription: "A programação é uma das habilidades mais valorizadas do mercado atual. Oferecemos conteúdo estruturado para diferentes níveis, com exemplos práticos e projetos reais que preparam você para desafios profissionais.",
      benefits: ["Aprenda programação do zero", "Explore diferentes linguagens", "Construa projetos reais"]
    },
    "marketing": {
      name: "Marketing Digital",
      description: "Domine estratégias de marketing digital que geram resultados reais. Aprenda sobre redes sociais, SEO, publicidade online e análise de dados para impulsionar negócios.",
      longDescription: "O marketing digital é essencial para qualquer negócio moderno. Nossos artigos abordam estratégias comprovadas, ferramentas práticas e técnicas de análise para maximizar o retorno dos investimentos em marketing.",
      benefits: ["Crie campanhas eficazes", "Analise métricas importantes", "Desenvolva presença digital forte"]
    },
    "carreira": {
      name: "Carreira",
      description: "Acelere seu crescimento profissional com dicas de carreira, networking, liderança e desenvolvimento pessoal. Estratégias para destacar-se no mercado de trabalho competitivo.",
      longDescription: "O desenvolvimento de carreira requer planejamento estratégico e habilidades interpessoais. Compartilhamos insights valiosos sobre networking, liderança, negociação e crescimento profissional sustentável.",
      benefits: ["Planeje sua carreira estrategicamente", "Desenvolva soft skills valiosas", "Expanda sua rede profissional"]
    },
    "educacao": {
      name: "Educação",
      description: "Transforme sua forma de aprender com metodologias inovadoras, técnicas de estudo e insights sobre o futuro da educação profissional e tecnológica.",
      longDescription: "A educação contínua é fundamental para o sucesso profissional. Exploramos metodologias de aprendizagem, técnicas de retenção e estratégias para maximizar seu desenvolvimento pessoal e profissional.",
      benefits: ["Otimize seu processo de aprendizagem", "Descubra métodos eficazes de estudo", "Desenvolva mentalidade de crescimento"]
    }
  };
  const currentCategory = categories.find((cat) => cat.slug === categorySlug) || categoryDescriptions[categorySlug] || {
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    description: `Artigos sobre ${categorySlug} para desenvolvimento profissional e técnico.`,
    longDescription: `Explore nossos artigos especializados em ${categorySlug} com conteúdo prático e aplicável no mercado de trabalho.`,
    benefits: ["Conteúdo especializado", "Aplicação prática", "Desenvolvimento profissional"]
  };
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery) return posts;
    return posts.filter(
      (post) => {
        var _a;
        return post.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || post.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || ((_a = post.excerpt) == null ? void 0 : _a.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
      }
    );
  }, [posts, debouncedSearchQuery]);
  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({}, { replace: true });
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: [
      /* @__PURE__ */ jsx(
        SEOHead,
        {
          title: `Categoria ${currentCategory.name} - Blog Escola Habilidade`,
          description: `Artigos sobre ${currentCategory.name.toLowerCase()}.`,
          path: `/blog/categoria/${categorySlug}`
        }
      ),
      /* @__PURE__ */ jsx(BlogLoading, {})
    ] });
  }
  if (isError) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: [
      /* @__PURE__ */ jsx(
        SEOHead,
        {
          title: `Categoria ${currentCategory.name} - Blog Escola Habilidade`,
          description: `Artigos sobre ${currentCategory.name.toLowerCase()}.`,
          path: `/blog/categoria/${categorySlug}`
        }
      ),
      /* @__PURE__ */ jsx(BlogError, { error, onRetry: () => window.location.reload() })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title: `${currentCategory.name} - Blog Escola Habilidade`,
        description: currentCategory.description || `Artigos sobre ${currentCategory.name.toLowerCase()} para impulsionar seu crescimento profissional.`,
        path: `/blog/categoria/${categorySlug}`,
        keywords: `${currentCategory.name.toLowerCase()}, artigos, blog, escola habilidade`
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: "Blog", path: "/blog" },
            { label: currentCategory.name, path: `/blog/categoria/${categorySlug}`, current: true }
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/blog",
          className: "inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 transition-colors",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 20 }),
            /* @__PURE__ */ jsx("span", { children: "Voltar ao blog" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-medium border ${getCategoryColor(categorySlug)}`, children: [
          /* @__PURE__ */ jsx(Tag, { size: 20 }),
          currentCategory.name
        ] }) }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl md:text-5xl font-bold mb-4 text-zinc-100", children: [
          "Artigos sobre ",
          currentCategory.name
        ] }),
        currentCategory.description && /* @__PURE__ */ jsx("p", { className: "text-xl text-zinc-300 max-w-3xl mx-auto mb-6", children: currentCategory.description }),
        currentCategory.longDescription && /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto mt-8 mb-8", children: /* @__PURE__ */ jsx("div", { className: "bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-8", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold text-zinc-100 mb-4", children: [
              "Por que estudar ",
              currentCategory.name,
              "?"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-zinc-300 leading-relaxed", children: currentCategory.longDescription })
          ] }),
          currentCategory.benefits && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-zinc-100 mb-4", children: "Benefícios dos nossos conteúdos:" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: currentCategory.benefits.map((benefit, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 text-zinc-300", children: [
              /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full mt-2 flex-shrink-0" }),
              /* @__PURE__ */ jsx("span", { children: benefit })
            ] }, index)) })
          ] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(MagnifyingGlass, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400", size: 20 }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: `Buscar em ${currentCategory.name}...`,
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              }
            )
          ] }),
          debouncedSearchQuery && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-4", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm", children: [
              'Busca: "',
              debouncedSearchQuery,
              '"'
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: clearSearch,
                className: "text-zinc-400 hover:text-zinc-300 text-sm underline",
                children: "Limpar"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx(
          BlogNavigation,
          {
            searchQuery,
            onSearchChange: setSearchQuery,
            selectedCategory: categorySlug,
            onCategoryChange: () => {
            },
            showSearch: false,
            showCategories: true,
            showPopular: true,
            variant: "sidebar",
            className: "sticky top-8"
          }
        ) })
      ] }) }),
      filteredPosts.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12", children: filteredPosts.map((post, index) => /* @__PURE__ */ jsx(BlogCard, { post }, `${post.id}-${index}`)) }),
        !debouncedSearchQuery && hasNextPage && /* @__PURE__ */ jsx(
          "div",
          {
            ref: loadMoreRef,
            className: "flex justify-center py-8",
            children: isFetchingNextPage ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-zinc-400", children: [
              /* @__PURE__ */ jsx("div", { className: "w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" }),
              /* @__PURE__ */ jsx("span", { children: "Carregando mais artigos..." })
            ] }) : /* @__PURE__ */ jsx("div", { className: "text-zinc-500 text-center", children: /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-zinc-500 rounded-full mx-auto animate-pulse" }) })
          }
        ),
        !debouncedSearchQuery && !hasNextPage && posts.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsxs("p", { className: "text-zinc-400", children: [
          "Você chegou ao final dos artigos de ",
          currentCategory.name
        ] }) })
      ] }) : /* @__PURE__ */ jsx(
        BlogEmpty,
        {
          hasFilters: !!debouncedSearchQuery,
          onClearFilters: clearSearch
        }
      ),
      categories.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-16 pt-8 border-t border-zinc-700", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-zinc-100 mb-6 text-center", children: "Explore outras categorias" }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap justify-center gap-3", children: categories.filter((cat) => cat.slug !== categorySlug).map((category) => /* @__PURE__ */ jsxs(
          Link,
          {
            to: `/blog/categoria/${category.slug}`,
            className: `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors hover:scale-105 ${getCategoryColor(category.slug)}`,
            children: [
              /* @__PURE__ */ jsx(Tag, { size: 14 }),
              category.name
            ]
          },
          category.slug
        )) })
      ] })
    ] })
  ] });
};
function loader() {
  return null;
}
export {
  BlogCategory as Component,
  BlogCategory as default,
  loader
};
