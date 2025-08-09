import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { MagnifyingGlass, Funnel, CaretDown } from "@phosphor-icons/react";
import { B as useOptimizedBlogSearch, d as useCategories, r as useInView } from "./utils-D0CRhHwP.js";
import { a as BlogLayout, b as BlogLoading, c as BlogError, d as BlogEmpty, e as BlogGridContainer, f as BlogGridSection, R as ResponsiveBlogGrid, B as BlogCard } from "./blog-components-BV6c3eIl.js";
import "prop-types";
import "@tanstack/react-query";
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
import "@dr.pogodin/react-helmet";
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
