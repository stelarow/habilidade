import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { House, Article, CaretRight, MagnifyingGlass, Funnel, CaretDown } from "@phosphor-icons/react";
import { k as useInfinitePosts, S as SEOHead, c as combineClasses, b as useBlogResponsive, l as getAnimationClasses, n as getStaggeredDelay, e as useCategories, h as useInView, B as BlogCard } from "../../main.mjs";
import { B as BlogLoading, a as BlogEmpty } from "./BlogEmpty-DUhiSxKY.js";
import { B as BlogError } from "./BlogError-pFcvE5Id.js";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "@tanstack/react-query";
import "prop-types";
import "@supabase/supabase-js";
import "@emailjs/browser";
const useOptimizedBlogSearch = (initialSearch = "", initialCategory = "") => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(initialSearch);
  const debounceTimeoutRef = useRef(null);
  const searchCountRef = useRef(0);
  useEffect(() => {
    setIsSearching(true);
    searchCountRef.current += 1;
    const currentSearchCount = searchCountRef.current;
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (currentSearchCount === searchCountRef.current) {
        setDebouncedSearchQuery(searchQuery);
        setIsSearching(false);
      }
    }, 300);
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchQuery]);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isFetching
  } = useInfinitePosts(12, selectedCategory || null, debouncedSearchQuery || null);
  const posts = useMemo(() => {
    var _a;
    return ((_a = data == null ? void 0 : data.pages) == null ? void 0 : _a.flatMap((page) => page.posts)) || [];
  }, [data]);
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);
  const handleCategoryChange = useCallback((categorySlug) => {
    setSelectedCategory(categorySlug);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 150);
  }, []);
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCategory("");
    setIsSearching(false);
  }, []);
  return {
    // State
    searchQuery,
    selectedCategory,
    debouncedSearchQuery,
    isSearching,
    // Data
    posts,
    data,
    error,
    // Loading states
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    // Actions
    handleSearchChange,
    handleCategoryChange,
    clearFilters,
    fetchNextPage,
    // Computed
    hasActiveFilters: !!(debouncedSearchQuery || selectedCategory),
    isLoadingWithTransition: isLoading || isSearching && !posts.length
  };
};
const BlogHeader = ({ breadcrumbs = [] }) => {
  const defaultBreadcrumbs = [
    { label: "Início", href: "/", icon: House },
    { label: "Blog", href: "/blog", icon: Article }
  ];
  const allBreadcrumbs = [...defaultBreadcrumbs, ...breadcrumbs];
  return /* @__PURE__ */ jsx("section", { className: "bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800/50 pt-16", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 py-6", children: [
    /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "mb-4", children: /* @__PURE__ */ jsx("ol", { className: "flex items-center gap-2 text-sm", children: allBreadcrumbs.map((crumb, index) => {
      const isLast = index === allBreadcrumbs.length - 1;
      const Icon = crumb.icon;
      return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
        index > 0 && /* @__PURE__ */ jsx(CaretRight, { size: 14, className: "text-zinc-600" }),
        isLast ? /* @__PURE__ */ jsxs(
          "span",
          {
            className: "flex items-center gap-1 text-zinc-400 font-medium",
            "aria-current": "page",
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { size: 16 }),
              crumb.label
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: crumb.href,
            onClick: crumb.href === "/" ? (e) => {
              e.preventDefault();
              window.location.href = "/";
            } : void 0,
            className: "flex items-center gap-1 text-zinc-300 hover:text-fuchsia-300 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-sm px-1 py-0.5",
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { size: 16 }),
              crumb.label
            ]
          }
        )
      ] }, index);
    }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Article, { size: 32, className: "text-fuchsia-400" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-white mb-1", children: "Blog" }),
        /* @__PURE__ */ jsx("p", { className: "text-zinc-400 text-sm", children: "Artigos sobre tecnologia, educação e desenvolvimento de carreira" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 pt-4 border-t border-zinc-800/50", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-zinc-500", children: "Navegue pelas categorias ou use a busca para encontrar conteúdo específico" }) })
  ] }) });
};
const BlogLayout = ({
  children,
  title = "Blog - Escola Habilidade",
  description = "Artigos sobre tecnologia, educação e desenvolvimento de carreira",
  breadcrumbs = [],
  showBlogHeader = true,
  className = "",
  path = "/blog"
  // Add path parameter
}) => {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        title,
        description,
        path,
        type: "website"
      }
    ),
    showBlogHeader && /* @__PURE__ */ jsx(BlogHeader, { breadcrumbs }),
    /* @__PURE__ */ jsx("div", { className: `py-8 ${className}`, children })
  ] });
};
const ResponsiveBlogGrid = ({
  children,
  variant = "standard",
  // standard, masonry, featured
  columns = "auto",
  // auto, 1, 2, 3, 4
  gap = "medium",
  // small, medium, large
  animation = "fade",
  // fade, slide, none
  className = "",
  ...props
}) => {
  useBlogResponsive();
  const gapSizes = {
    small: "gap-3",
    medium: "gap-6",
    large: "gap-8"
  };
  const getColumnClasses = () => {
    if (columns === "auto") {
      switch (variant) {
        case "masonry":
          return "columns-1 md:columns-2 lg:columns-3";
        case "featured":
          return "grid grid-cols-1 lg:grid-cols-3";
        default:
          return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      }
    }
    const columnMap = {
      1: "grid grid-cols-1",
      2: "grid grid-cols-1 md:grid-cols-2",
      3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    };
    return columnMap[columns] || columnMap[3];
  };
  const baseClasses = variant === "masonry" ? "blog-grid-masonry" : combineClasses(getColumnClasses(), gapSizes[gap]);
  const animationClasses = getAnimationClasses(animation);
  const gridClasses = combineClasses(
    baseClasses,
    animationClasses,
    className
  );
  if (variant === "masonry") {
    return /* @__PURE__ */ jsx("div", { className: gridClasses, ...props, children: React.Children.map(children, (child, index) => /* @__PURE__ */ jsx(
      "div",
      {
        className: combineClasses(
          "break-inside-avoid mb-6",
          animationClasses,
          getStaggeredDelay(index)
        ),
        children: child
      },
      index
    )) });
  }
  if (variant === "featured" && React.Children.count(children) > 0) {
    const childrenArray = React.Children.toArray(children);
    const featuredPost = childrenArray[0];
    const remainingPosts = childrenArray.slice(1);
    return /* @__PURE__ */ jsxs("div", { className: combineClasses("space-y-8", className), ...props, children: [
      /* @__PURE__ */ jsx("div", { className: combineClasses(
        "featured-post",
        animationClasses,
        getStaggeredDelay(0)
      ), children: featuredPost }),
      remainingPosts.length > 0 && /* @__PURE__ */ jsx("div", { className: combineClasses(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2",
        gapSizes[gap]
      ), children: remainingPosts.map((child, index) => /* @__PURE__ */ jsx(
        "div",
        {
          className: combineClasses(
            animationClasses,
            getStaggeredDelay(index + 1)
          ),
          children: child
        },
        index + 1
      )) })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: gridClasses, ...props, children: React.Children.map(children, (child, index) => /* @__PURE__ */ jsx(
    "div",
    {
      className: combineClasses(
        animationClasses,
        getStaggeredDelay(index)
      ),
      children: child
    },
    index
  )) });
};
const BlogGridContainer = ({ children, className = "", ...props }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: combineClasses(
        "w-full max-w-7xl mx-auto px-4",
        className
      ),
      ...props,
      children
    }
  );
};
const BlogGridSection = ({
  title,
  subtitle,
  children,
  sidebar,
  className = "",
  ...props
}) => {
  const { isMobile } = useBlogResponsive();
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: combineClasses("space-y-6", className),
      ...props,
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
          title && /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-white", children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { className: "text-zinc-400 max-w-2xl mx-auto", children: subtitle })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: combineClasses(
          sidebar && !isMobile ? "grid grid-cols-1 lg:grid-cols-4 gap-8" : "w-full"
        ), children: [
          /* @__PURE__ */ jsx("div", { className: sidebar && !isMobile ? "lg:col-span-3" : "w-full", children }),
          sidebar && !isMobile && /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "sticky top-20 space-y-6", children: sidebar }) })
        ] })
      ]
    }
  );
};
const BlogIndex = ({ initialPosts = [], initialCategories = [], totalPosts = 0, hasMore = false }) => {
  var _a, _b;
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    return () => {
      document.title = "Escola Habilidade";
      setShowFilters(false);
    };
  }, []);
  const {
    searchQuery,
    selectedCategory,
    debouncedSearchQuery,
    isSearching,
    posts,
    error,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    hasActiveFilters,
    handleSearchChange,
    handleCategoryChange: handleCategoryChangeInternal,
    clearFilters: clearFiltersInternal,
    fetchNextPage
  } = useOptimizedBlogSearch(
    searchParams.get("search") || "",
    searchParams.get("category") || ""
  );
  const { data: categoriesData } = useCategories();
  const displayPosts = posts.length > 0 ? posts : initialPosts;
  const displayCategories = (categoriesData == null ? void 0 : categoriesData.categories) || initialCategories;
  const [loadMoreRef, inView] = useInView({
    threshold: 0.1,
    rootMargin: "100px"
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  const categories = displayCategories;
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedSearchQuery) {
      newParams.set("search", debouncedSearchQuery);
    }
    if (selectedCategory) {
      newParams.set("category", selectedCategory);
    }
    setSearchParams(newParams, { replace: true });
  }, [debouncedSearchQuery, selectedCategory, setSearchParams]);
  const handleSearchInputChange = useCallback((e) => {
    handleSearchChange(e.target.value);
  }, [handleSearchChange]);
  const handleCategoryChangeWrapper = useCallback((categorySlug) => {
    handleCategoryChangeInternal(categorySlug);
    setShowFilters(false);
  }, [handleCategoryChangeInternal]);
  const clearFilters = useCallback(() => {
    clearFiltersInternal();
    setSearchParams({}, { replace: true });
  }, [clearFiltersInternal, setSearchParams]);
  if (isLoading && initialPosts.length === 0) {
    return /* @__PURE__ */ jsx(
      BlogLayout,
      {
        title: "Blog - Escola Habilidade",
        description: "Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas.",
        path: "/blog",
        children: /* @__PURE__ */ jsx(BlogLoading, {})
      }
    );
  }
  if (isError) {
    return /* @__PURE__ */ jsx(
      BlogLayout,
      {
        title: "Blog - Escola Habilidade",
        description: "Artigos sobre tecnologia, educação e carreira.",
        children: /* @__PURE__ */ jsx(BlogError, { error, onRetry: () => window.location.reload() })
      }
    );
  }
  if (displayPosts.length === 0 && !isLoading) {
    return /* @__PURE__ */ jsx(
      BlogLayout,
      {
        title: "Blog - Escola Habilidade",
        description: "Artigos sobre tecnologia, educação e carreira.",
        children: /* @__PURE__ */ jsx(
          BlogEmpty,
          {
            hasFilters: hasActiveFilters,
            onClearFilters: clearFilters
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    BlogLayout,
    {
      title: "Blog - Escola Habilidade",
      description: "Artigos sobre tecnologia, educação e carreira. Aprenda com nossos especialistas e mantenha-se atualizado com as últimas tendências.",
      path: "/blog",
      children: [
        /* @__PURE__ */ jsx(BlogGridContainer, { children: /* @__PURE__ */ jsxs(
          BlogGridSection,
          {
            title: "Blog",
            subtitle: "Artigos sobre tecnologia, educação e carreira para impulsionar seu crescimento profissional",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-8 space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 max-w-4xl mx-auto", children: [
                  /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
                    /* @__PURE__ */ jsx(
                      MagnifyingGlass,
                      {
                        className: `absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isSearching ? "text-purple-300 animate-pulse" : searchQuery ? "text-purple-400" : "text-zinc-400"}`,
                        size: 20
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        placeholder: "Buscar artigos...",
                        value: searchQuery,
                        onChange: handleSearchInputChange,
                        className: `w-full pl-10 pr-12 py-3 rounded-lg text-zinc-100 placeholder-zinc-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isSearching ? "bg-purple-500/15 border border-purple-400/60 shadow-lg" : searchQuery ? "bg-purple-500/10 border border-purple-500/50 shadow-lg" : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600"}`
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { className: "absolute right-3 top-1/2 transform -translate-y-1/2", children: isSearching ? /* @__PURE__ */ jsx("div", { className: "w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" }) : searchQuery ? /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full animate-pulse" }) : null })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setShowFilters(!showFilters),
                        className: `flex items-center gap-2 px-4 py-3 rounded-lg text-zinc-100 transition-all duration-300 ${selectedCategory ? "bg-purple-500/20 border border-purple-500/50 hover:bg-purple-500/30 shadow-lg" : "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700"}`,
                        children: [
                          /* @__PURE__ */ jsx(Funnel, { size: 20, className: `transition-colors ${selectedCategory ? "text-purple-300" : ""}` }),
                          /* @__PURE__ */ jsx("span", { className: "font-medium", children: selectedCategory ? ((_a = categories.find((cat) => cat.slug === selectedCategory)) == null ? void 0 : _a.name) || "Categoria" : "Todas as categorias" }),
                          selectedCategory && /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-purple-400 rounded-full animate-pulse" }),
                          /* @__PURE__ */ jsx(
                            CaretDown,
                            {
                              size: 16,
                              className: `transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`
                            }
                          )
                        ]
                      }
                    ),
                    showFilters && /* @__PURE__ */ jsxs("div", { className: "absolute top-full mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleCategoryChangeWrapper(""),
                          className: `w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors ${!selectedCategory ? "bg-purple-500/20 text-purple-300" : "text-zinc-300"}`,
                          children: "Todas as categorias"
                        }
                      ),
                      categories.map((category) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => handleCategoryChangeWrapper(category.slug),
                          className: `w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors ${selectedCategory === category.slug ? "bg-purple-500/20 text-purple-300" : "text-zinc-300"}`,
                          children: category.name
                        },
                        category.slug
                      ))
                    ] })
                  ] })
                ] }),
                hasActiveFilters && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3 max-w-4xl mx-auto animate-fadeIn", children: [
                  debouncedSearchQuery && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-500/30 shadow-lg backdrop-blur-sm", children: [
                    /* @__PURE__ */ jsx(MagnifyingGlass, { size: 14 }),
                    'Busca: "',
                    debouncedSearchQuery,
                    '"'
                  ] }),
                  selectedCategory && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30 shadow-lg backdrop-blur-sm", children: [
                    /* @__PURE__ */ jsx(Funnel, { size: 14 }),
                    ((_b = categories.find((cat) => cat.slug === selectedCategory)) == null ? void 0 : _b.name) || selectedCategory
                  ] }),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: clearFilters,
                      className: "inline-flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-zinc-300 text-sm bg-zinc-800/50 rounded-full border border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 backdrop-blur-sm",
                      children: [
                        /* @__PURE__ */ jsx("span", { children: "✕" }),
                        "Limpar filtros"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `transition-all duration-300 ${isSearching ? "opacity-70 scale-[0.99]" : "opacity-100 scale-100"}`, children: /* @__PURE__ */ jsx(
                ResponsiveBlogGrid,
                {
                  variant: "standard",
                  columns: "auto",
                  gap: "large",
                  animation: "fade",
                  className: "mb-12",
                  children: displayPosts.map((post, index) => /* @__PURE__ */ jsx(BlogCard, { post, index }, `${post.id}-${index}`))
                }
              ) }),
              hasNextPage && /* @__PURE__ */ jsx(
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
              !hasNextPage && displayPosts.length > 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-8", children: /* @__PURE__ */ jsx("p", { className: "text-zinc-400", children: "Você chegou ao final dos artigos" }) })
            ]
          }
        ) }),
        showFilters && /* @__PURE__ */ jsx(
          "div",
          {
            className: "fixed inset-0 z-40",
            onClick: () => setShowFilters(false)
          }
        )
      ]
    }
  );
};
async function loader() {
  if (typeof window === "undefined") {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const SUPABASE_URL = "https://vfpdyllwquaturpcifpl.supabase.co";
      const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcGR5bGx3cXVhdHVycGNpZnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDkwMDEsImV4cCI6MjA2NzQ4NTAwMX0.m7zLlemqt6oYt55OFZK_xyEBWoxC23uiFL2EmCiaLqw";
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: postsData, error: postsError } = await supabase.from("blog_posts").select(`
          *,
          blog_categories(id, name, slug, description, color),
          blog_post_tags!left(
            blog_tags!inner(id, name, slug)
          ),
          blog_authors(id, name, email)
        `).order("published_at", { ascending: false }).range(0, 11);
      const { data: categoriesData, error: categoriesError } = await supabase.from("blog_categories").select(`
          *,
          blog_posts(count)
        `).order("name");
      if (postsError || categoriesError) {
        console.error("Error fetching data for SSG:", postsError || categoriesError);
        return {
          initialPosts: [],
          initialCategories: []
        };
      }
      const posts = (postsData || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featured_image,
        publishedAt: post.published_at,
        readTime: post.read_time || 5,
        category: post.blog_categories ? {
          id: post.blog_categories.id,
          name: post.blog_categories.name,
          slug: post.blog_categories.slug,
          color: post.blog_categories.color || "#4F46E5"
        } : null,
        tags: (post.blog_post_tags || []).map((tagRel) => tagRel.blog_tags).filter(Boolean),
        author: post.blog_authors ? {
          id: post.blog_authors.id,
          name: post.blog_authors.name,
          email: post.blog_authors.email
        } : null
      }));
      const categories = (categoriesData || []).map((category) => {
        var _a;
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          color: category.color || "#4F46E5",
          postCount: ((_a = category.blog_posts) == null ? void 0 : _a.length) || 0
        };
      });
      return {
        initialPosts: posts,
        initialCategories: categories,
        totalPosts: posts.length,
        hasMore: posts.length >= 12
      };
    } catch (error) {
      console.error("Error in SSG loader:", error);
      return {
        initialPosts: [],
        initialCategories: [],
        totalPosts: 0,
        hasMore: false
      };
    }
  }
  return {
    initialPosts: [],
    initialCategories: [],
    totalPosts: 0,
    hasMore: false
  };
}
export {
  BlogIndex as Component,
  BlogIndex as default,
  loader
};
