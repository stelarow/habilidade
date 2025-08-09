import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useParams, useLoaderData } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { WhatsappLogo, X, User, Calendar, Clock } from "@phosphor-icons/react";
import { c as BlogError, g as Breadcrumbs, L as LazyImage, i as ShareButtons, j as BlogCTA, T as TableOfContents } from "./blog-components-BiqxfVKP.js";
import { F as useContactAnalytics, G as generateWhatsAppMessage, H as processContent, I as extractPlainText } from "./utils-DYyrIPL_.js";
import "@dr.pogodin/react-helmet";
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
const WhatsAppFloat = ({
  article = null,
  category = null,
  delaySeconds = 45,
  // Increased delay to be less intrusive
  scrollThreshold = 0.6,
  // Higher threshold
  className = "",
  position = "bottom-right"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useRef(null);
  const startTimeRef = useRef(Date.now());
  const { trackContactClick } = useContactAnalytics();
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 transform -translate-x-1/2"
  };
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const trackHeight = docHeight - winHeight;
      const progress = Math.min(scrollTop / trackHeight, 1);
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (isDismissed) return;
    const checkVisibility = () => {
      const timeElapsed = (Date.now() - startTimeRef.current) / 1e3;
      const shouldShowByTime = timeElapsed >= delaySeconds;
      const shouldShowByScroll = scrollProgress >= scrollThreshold;
      if (shouldShowByTime || shouldShowByScroll) {
        setIsVisible(true);
      }
    };
    checkVisibility();
    const interval = setInterval(checkVisibility, 1e3);
    return () => clearInterval(interval);
  }, [delaySeconds, scrollThreshold, scrollProgress, isDismissed]);
  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage({
      article: (article == null ? void 0 : article.title) || null,
      category: (category == null ? void 0 : category.name) || category || null,
      url: window.location.href,
      context: "floating-button"
    });
    const whatsappUrl = `https://wa.me/5548988559491?text=${encodeURIComponent(message)}`;
    trackContactClick({
      channel: "whatsapp",
      source: "floating-button",
      article: (article == null ? void 0 : article.slug) || "unknown",
      category: (category == null ? void 0 : category.slug) || category || "unknown",
      position,
      message
    });
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };
  const handleDismiss = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    setIsVisible(false);
  };
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  if (!isVisible || isDismissed) {
    return null;
  }
  return /* @__PURE__ */ jsx("div", { className: `fixed z-50 ${positionClasses[position]} ${className}`, children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-green-500 animate-pulse opacity-10" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handleToggleExpand,
        className: `
            relative w-12 h-12 rounded-full 
            bg-gradient-to-r from-green-500 via-green-400 to-cyan-400 
            hover:from-green-600 hover:via-green-500 hover:to-cyan-500
            flex items-center justify-center
            shadow-lg hover:shadow-xl hover:shadow-green-500/20
            transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900
            ${isExpanded ? "scale-105" : ""}
          `,
        title: "Conversar no WhatsApp",
        "aria-label": "Abrir chat do WhatsApp",
        children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 20, weight: "bold", className: "text-white" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: `
          absolute bottom-14 right-0 mb-2
          bg-white rounded-lg shadow-xl border border-gray-200
          p-4 min-w-[260px] max-w-[300px]
          transform transition-all duration-300 origin-bottom-right
          ${isExpanded ? "scale-100 opacity-100 visible" : "scale-95 opacity-0 invisible"}
        `, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleDismiss,
          className: "absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors",
          "aria-label": "Fechar",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(WhatsappLogo, { size: 16, weight: "bold", className: "text-white" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gray-100 rounded-lg p-3 mb-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 leading-relaxed", children: article ? /* @__PURE__ */ jsxs(Fragment, { children: [
            "Olá! Vi que você está lendo sobre ",
            /* @__PURE__ */ jsx("strong", { children: article.title }),
            ". Posso ajudar com informações sobre nossos cursos relacionados?"
          ] }) : /* @__PURE__ */ jsx(Fragment, { children: "Olá! Precisa de ajuda ou tem dúvidas sobre nossos cursos? Estou aqui para ajudar! 😊" }) }) }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleWhatsAppClick,
              className: "w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(WhatsappLogo, { size: 16, weight: "bold" }),
                "Conversar agora"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2 text-xs text-gray-500", children: [
        /* @__PURE__ */ jsx("div", { className: "w-2 h-2 bg-green-400 rounded-full" }),
        /* @__PURE__ */ jsx("span", { children: "Alessandro online" })
      ] })
    ] })
  ] }) });
};
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const textContent = extractPlainText(content);
  const words = textContent.split(" ").filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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
function BlogPost() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { slug } = useParams();
  const loaderData = useLoaderData();
  const post = loaderData == null ? void 0 : loaderData.post;
  const articleReference = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  if (!post) {
    return /* @__PURE__ */ jsx(BlogError, { error: { message: "Post não encontrado" } });
  }
  const readingTime = calculateReadingTime(post.content);
  const categoryColor = getCategoryColor((_a = post.category) == null ? void 0 : _a.slug);
  const processedContent = processContent(post.content, slug);
  const seoTitle = `${post.title} | Escola Habilidade`;
  const seoDescription = post.excerpt || `Aprenda ${post.title} com a Escola Habilidade`;
  const seoImage = post.featured_image || "https://www.escolahabilidade.com/assets/logos/original/logo-original.png";
  const seoUrl = `https://www.escolahabilidade.com/blog/${slug}`;
  const seoAuthor = ((_b = post.author) == null ? void 0 : _b.name) || "Escola Habilidade";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Head, { children: [
      /* @__PURE__ */ jsx("title", { children: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { name: "author", content: seoAuthor }),
      /* @__PURE__ */ jsx("meta", { property: "article:published_time", content: post.published_at }),
      post.updated_at && /* @__PURE__ */ jsx("meta", { property: "article:modified_time", content: post.updated_at }),
      ((_c = post.category) == null ? void 0 : _c.name) && /* @__PURE__ */ jsx("meta", { property: "article:section", content: post.category.name }),
      (_d = post.tags) == null ? void 0 : _d.map((tag) => /* @__PURE__ */ jsx("meta", { property: "article:tag", content: tag.name }, tag.name)),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "article" }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: seoUrl }),
      /* @__PURE__ */ jsx("meta", { property: "og:image", content: seoImage }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:width", content: "1200" }),
      /* @__PURE__ */ jsx("meta", { property: "og:image:height", content: "630" }),
      /* @__PURE__ */ jsx("meta", { property: "og:site_name", content: "Escola Habilidade" }),
      /* @__PURE__ */ jsx("meta", { property: "og:locale", content: "pt_BR" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:title", content: seoTitle }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:description", content: seoDescription }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:image", content: seoImage }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:site", content: "@escolahabilidade" }),
      /* @__PURE__ */ jsx("meta", { name: "twitter:creator", content: "@escolahabilidade" }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: seoUrl }),
      /* @__PURE__ */ jsx("meta", { name: "format-detection", content: "telephone=no" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#d400ff" }),
      /* @__PURE__ */ jsx("script", { type: "application/ld+json", dangerouslySetInnerHTML: {
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: seoDescription,
          url: seoUrl,
          image: seoImage,
          datePublished: post.published_at,
          dateModified: post.updated_at || post.published_at,
          author: {
            "@type": "Organization",
            name: "Escola Habilidade",
            url: "https://www.escolahabilidade.com"
          },
          publisher: {
            "@type": "Organization",
            name: "Escola Habilidade",
            url: "https://www.escolahabilidade.com",
            logo: {
              "@type": "ImageObject",
              url: "https://www.escolahabilidade.com/assets/logos/original/logo-original.png"
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": seoUrl
          }
        })
      } })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950", children: [
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8 max-w-6xl", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: "Blog", href: "/blog" },
              { label: ((_e = post.category) == null ? void 0 : _e.name) || "Artigo", href: `/blog/categoria/${(_f = post.category) == null ? void 0 : _f.slug}` },
              { label: post.title, href: `/blog/${slug}`, current: true }
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8", children: [
          /* @__PURE__ */ jsxs("article", { className: "lg:col-span-3 order-2 lg:order-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 shadow-2xl", children: [
              /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
                post.category && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`, children: post.category.name }) }),
                /* @__PURE__ */ jsx("h1", { className: "text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-6 leading-tight", children: post.title }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-6 text-sm text-zinc-400 border-b border-zinc-800 pb-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(User, { size: 16 }),
                    /* @__PURE__ */ jsx("span", { children: ((_g = post.author) == null ? void 0 : _g.name) || "Escola Habilidade" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { size: 16 }),
                    /* @__PURE__ */ jsx("time", { dateTime: post.published_at, children: formatDate(post.published_at) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Clock, { size: 16 }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      readingTime,
                      " min de leitura"
                    ] })
                  ] })
                ] }),
                post.featured_image && /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsx(
                  LazyImage,
                  {
                    src: post.featured_image,
                    alt: post.title,
                    className: "w-full h-64 md:h-80 object-cover",
                    loading: "eager",
                    decoding: "sync"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: articleReference,
                  className: "article-content prose prose-lg prose-invert prose-zinc max-w-none\n                    prose-headings:text-zinc-50 prose-headings:font-bold\n                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-blue-500 prose-h2:pl-4\n                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3\n                    prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-4\n                    prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 hover:prose-a:underline\n                    prose-strong:text-zinc-200 prose-strong:font-semibold\n                    prose-code:text-pink-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm\n                    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700 prose-pre:rounded-lg\n                    prose-blockquote:border-l-4 prose-blockquote:border-zinc-600 prose-blockquote:bg-zinc-800/50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg\n                    prose-ul:text-zinc-300 prose-ol:text-zinc-300\n                    prose-li:marker:text-zinc-500\n                    prose-img:rounded-lg prose-img:shadow-lg",
                  dangerouslySetInnerHTML: { __html: processedContent }
                }
              ),
              post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-800", children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: post.tags.map((tag, index) => /* @__PURE__ */ jsxs(
                "span",
                {
                  className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium\n                            bg-zinc-800 text-zinc-300 border border-zinc-700\n                            hover:bg-zinc-700 transition-colors duration-200",
                  children: [
                    "#",
                    tag.name
                  ]
                },
                index
              )) }) }),
              /* @__PURE__ */ jsx("div", { className: "mt-8 pt-6 border-t border-zinc-800", children: /* @__PURE__ */ jsx(
                ShareButtons,
                {
                  url: `https://www.escolahabilidade.com/blog/${slug}`,
                  title: post.title,
                  description: post.excerpt
                }
              ) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(
              BlogCTA,
              {
                title: "Transforme seu futuro profissional",
                description: "Descubra nossos cursos práticos e acelere sua carreira na área de tecnologia.",
                buttonText: "Ver Cursos",
                buttonLink: "/cursos"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("aside", { className: "lg:col-span-1 order-1 lg:order-2", children: /* @__PURE__ */ jsx("div", { className: "sticky top-8", children: /* @__PURE__ */ jsx(
            TableOfContents,
            {
              containerSelector: ".article-content",
              title: "Navegação do Artigo",
              collapsible: false,
              initiallyCollapsed: false,
              minHeaders: 2,
              maxLevel: 4,
              showProgress: true,
              className: "bg-zinc-900/95 backdrop-blur-sm"
            }
          ) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx(WhatsAppFloat, {})
    ] })
  ] });
}
async function loader({ params }) {
  const { slug } = params;
  try {
    const { blogAPI } = await import("./blog-xsr1A1aF.js");
    const postData = await blogAPI.getPostBySlug(slug);
    if (!postData || !postData.post) {
      throw new Error(`Post not found: ${slug}`);
    }
    return {
      post: postData.post,
      seoData: {
        title: postData.post.title,
        description: postData.post.excerpt,
        image: postData.post.featured_image,
        url: `https://www.escolahabilidade.com/blog/${slug}`
      }
    };
  } catch (error) {
    console.error(`[BlogPost Loader] Error loading post ${slug}:`, error);
    throw new Error(`Failed to load post: ${slug}`);
  }
}
const Component = BlogPost;
const entry = "src/pages/BlogPostSSG.jsx";
export {
  Component,
  BlogPost as default,
  entry,
  loader
};
