import React, { useRef, useState, useEffect } from "react";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Tag, Clock, Calendar, User } from "@phosphor-icons/react";
import { c as usePrefetchPost } from "./useBlogAPI-CVn3KLQ0.js";
import { u as useBlogResponsive } from "./useBlogResponsive-DotabLZl.js";
import { g as getAnimationClasses, c as combineClasses } from "./blogTheme-Ctep9-MK.js";
function useInView(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    const element = ref.current;
    if (!element || !hasMounted) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    observer.observe(element);
    return () => observer.disconnect();
  }, [options, hasMounted]);
  return [ref, hasMounted ? visible : false];
}
const BlogBadge = ({
  children,
  variant = "category",
  size = "medium",
  categorySlug,
  className = "",
  icon: Icon,
  ...props
}) => {
  const baseClasses = "inline-flex items-center gap-1 font-medium rounded-full border transition-all duration-300";
  const categoryColors = {
    "tecnologia": "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30",
    "educacao": "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
    "carreira": "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
    "design": "bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30",
    "programacao": "bg-orange-500/20 text-orange-300 border-orange-500/30 hover:bg-orange-500/30",
    "marketing": "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
    "ia": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30",
    "bi": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30"
  };
  const variants = {
    category: categorySlug ? categoryColors[categorySlug] || "bg-zinc-500/20 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/30" : "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    tag: "bg-zinc-700/50 text-zinc-400 border-zinc-600/50 hover:bg-zinc-600/50 hover:text-zinc-300",
    status: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-500/30",
    featured: "bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 text-fuchsia-300 border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-purple-500/30",
    new: "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
    premium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30"
  };
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base"
  };
  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.trim();
  return /* @__PURE__ */ jsxs("span", { className: classes, ...props, children: [
    Icon && /* @__PURE__ */ jsx(Icon, { size: size === "small" ? 12 : size === "large" ? 16 : 14 }),
    children
  ] });
};
const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordsPerMinute = 200;
  const words = content.split(" ").length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
};
const formatDate = (dateString) => {
  if (!dateString) return "Data não disponível";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Data inválida";
  const now = /* @__PURE__ */ new Date();
  const diffInDays = Math.floor((now - date) / (1e3 * 60 * 60 * 24));
  if (diffInDays === 0) return "Hoje";
  if (diffInDays === 1) return "Ontem";
  if (diffInDays < 7) return `${diffInDays} dias atrás`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`;
  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};
const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  return lastSpaceIndex > 0 ? truncated.slice(0, lastSpaceIndex) + "..." : truncated + "...";
};
const BlogCard = ({ post, variant = "standard", index = 0 }) => {
  var _a;
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    isInView: false
  });
  const [isPrefetched, setIsPrefetched] = useState(false);
  const cardRef = useRef(null);
  const prefetchTimeoutRef = useRef(null);
  const imageRef = useRef(null);
  const prefetchPost = usePrefetchPost();
  const { getTypographyClasses, shouldUseAnimations } = useBlogResponsive();
  const getImageSrc = () => {
    if (post.featured_image_url && post.featured_image_url !== null) return post.featured_image_url;
    if (post.featuredImage && typeof post.featuredImage === "object" && post.featuredImage.url) return post.featuredImage.url;
    if (post.featuredImage && typeof post.featuredImage === "string") return post.featuredImage;
    if (post.imageUrl && post.imageUrl !== null) return post.imageUrl;
    return null;
  };
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageState((prev) => ({ ...prev, isInView: true }));
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px"
      }
    );
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const handleImageLoad = () => {
    setImageState((prev) => ({ ...prev, loaded: true, error: false }));
  };
  const handleImageError = () => {
    setImageState((prev) => ({ ...prev, error: true, loaded: true }));
  };
  const readingTime = calculateReadingTime(post.content);
  const formattedDate = formatDate(post.publishedAt || post.created_at || post.published_at);
  const excerpt = truncateText(post.excerpt || post.content, 150);
  const primaryCategory = ((_a = post.categories) == null ? void 0 : _a[0]) || post.category;
  const categorySlug = (primaryCategory == null ? void 0 : primaryCategory.slug) || "tecnologia";
  const categoryName = (primaryCategory == null ? void 0 : primaryCategory.name) || "Tecnologia";
  const imageSrc = getImageSrc();
  const EnhancedPlaceholder = () => {
    const categoryGradients = {
      "tecnologia": "from-blue-600/30 via-purple-600/25 to-cyan-600/30",
      "programacao": "from-purple-600/30 via-blue-600/25 to-indigo-600/30",
      "educacao": "from-green-600/30 via-emerald-600/25 to-teal-600/30",
      "carreira": "from-orange-600/30 via-yellow-600/25 to-amber-600/30",
      "design": "from-pink-600/30 via-rose-600/25 to-red-600/30",
      "arquitetura": "from-cyan-600/30 via-teal-600/25 to-blue-600/30"
    };
    const gradient = categoryGradients[categorySlug] || categoryGradients.tecnologia;
    return /* @__PURE__ */ jsxs("div", { className: `w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`, children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 opacity-10", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 w-8 h-8 border border-purple-300/30 rounded-full animate-pulse" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-8 right-8 w-6 h-6 border border-blue-300/30 rounded-full animate-pulse delay-1000" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-12 w-4 h-4 border border-pink-300/30 rounded-full animate-pulse delay-500" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-1/3 left-12 w-5 h-5 border border-green-300/30 rounded-full animate-pulse delay-700" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center text-zinc-300 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 mx-auto mb-4 opacity-70 transform group-hover:scale-110 transition-transform duration-300", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", fill: "currentColor", className: "w-full h-full", children: /* @__PURE__ */ jsx("path", { d: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" }) }) }),
        /* @__PURE__ */ jsx("p", { className: "text-base font-semibold opacity-90 mb-2", children: categoryName }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-16 h-1.5 bg-gradient-to-r from-purple-400/60 to-blue-400/60 rounded-full" }) })
      ] })
    ] });
  };
  const handleMouseEnter = () => {
    if (!isPrefetched && post.slug) {
      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchPost(post.slug);
        setIsPrefetched(true);
      }, 200);
    }
  };
  const handleMouseLeave = () => {
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
      prefetchTimeoutRef.current = null;
    }
  };
  React.useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const animationClasses = shouldUseAnimations() ? getAnimationClasses("fade") : "";
  const variantStyles = {
    standard: "bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50",
    featured: "blog-card-featured border-2 border-purple-500/20",
    compact: "bg-zinc-800/40 border border-zinc-700/40"
  };
  const cardClasses = combineClasses(
    "group rounded-xl overflow-hidden transition-all duration-500 ease-out",
    isMobile ? "active:border-purple-500/50 active:shadow-lg active:shadow-purple-500/10 active:scale-[0.98]" : "hover:border-purple-500/50 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer",
    !isMobile && "hover:ring-1 hover:ring-purple-500/20",
    variantStyles[variant],
    animationClasses
  );
  const handleCardClick = (e) => {
    if (e.target.tagName === "A") {
      return;
    }
    if (post.slug) {
      window.location.href = `/blog/${post.slug}`;
    }
  };
  return /* @__PURE__ */ jsx(
    "article",
    {
      ref: cardRef,
      className: cardClasses,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onClick: handleCardClick,
      style: { cursor: "pointer" },
      children: /* @__PURE__ */ jsxs("div", { className: "block w-full h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: `relative bg-zinc-700/50 overflow-hidden ${isMobile ? "h-40" : "h-48"} pointer-events-none`, children: [
          imageSrc ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                ref: imageRef,
                src: imageSrc,
                alt: post.title,
                className: `w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${imageState.loaded ? "opacity-100" : "opacity-0"}`,
                onLoad: handleImageLoad,
                onError: handleImageError,
                loading: "lazy"
              }
            ),
            (!imageState.loaded || imageState.error) && /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsx(EnhancedPlaceholder, {}) }),
            !imageState.loaded && !imageState.error && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-zinc-800/50", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" }) })
          ] }) : /* @__PURE__ */ jsx(EnhancedPlaceholder, {}),
          primaryCategory && /* @__PURE__ */ jsx("div", { className: "absolute top-4 left-4 z-10", children: /* @__PURE__ */ jsx(
            BlogBadge,
            {
              variant: "category",
              categorySlug,
              size: "small",
              icon: Tag,
              children: categoryName
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-4 right-4 z-10", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-medium", children: [
            /* @__PURE__ */ jsx(Clock, { size: 12 }),
            readingTime,
            " min"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `${isMobile ? "p-4" : "p-6"} pointer-events-none`, children: [
          /* @__PURE__ */ jsx("h2", { className: combineClasses(
            "font-bold text-zinc-100 mb-3 line-clamp-2 group-hover:text-purple-300 transition-all duration-300 transform group-hover:translate-x-1",
            getTypographyClasses("title")
          ), children: post.title }),
          excerpt && /* @__PURE__ */ jsx("p", { className: combineClasses(
            "text-zinc-400 mb-4 line-clamp-3 leading-relaxed",
            getTypographyClasses("body")
          ), children: excerpt }),
          /* @__PURE__ */ jsxs("div", { className: `text-xs text-zinc-500 ${isMobile ? "space-y-2" : "flex items-center justify-between"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: `flex items-center ${isMobile ? "justify-between" : "gap-4"}`, children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 hover:text-zinc-400 transition-colors", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 12, className: "group-hover:text-purple-400 transition-colors" }),
                formattedDate
              ] }),
              post.author_name && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 hover:text-zinc-400 transition-colors", children: [
                /* @__PURE__ */ jsx(User, { size: 12, className: "group-hover:text-purple-400 transition-colors" }),
                post.author_name
              ] })
            ] }),
            post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-zinc-600 group-hover:text-zinc-500 transition-colors px-2 py-1 bg-zinc-800/50 rounded-full", children: [
              "+",
              post.tags.length,
              " tags"
            ] })
          ] }),
          post.tags && post.tags.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-3 -mb-1", children: [
            post.tags.slice(0, 3).map((tag, tagIndex) => /* @__PURE__ */ jsxs(
              "span",
              {
                className: "inline-block px-2 py-1 bg-zinc-700/50 text-zinc-400 rounded text-xs hover:bg-zinc-600/50 transition-colors",
                children: [
                  "#",
                  tag
                ]
              },
              tagIndex
            )),
            post.tags.length > 3 && /* @__PURE__ */ jsxs("span", { className: "inline-block px-2 py-1 bg-zinc-700/50 text-zinc-500 rounded text-xs", children: [
              "+",
              post.tags.length - 3
            ] })
          ] })
        ] })
      ] })
    }
  );
};
export {
  BlogCard as B,
  useInView as u
};
