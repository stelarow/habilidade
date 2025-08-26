import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from "react";
import { List, CaretRight, CaretDown, Hash } from "@phosphor-icons/react";
import { c as combineClasses } from "./blogTheme-Ctep9-MK.js";
const extractHeaders = (content) => {
  let element;
  if (typeof content === "string") {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    element = tempDiv;
  } else if (content instanceof HTMLElement) {
    element = content;
  } else {
    return [];
  }
  const headers = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
  return Array.from(headers).map((header, index) => {
    var _a;
    const level = parseInt(header.tagName.charAt(1));
    const text = ((_a = header.textContent) == null ? void 0 : _a.trim()) || "";
    const slug = generateSlug(text, index);
    if (!header.id) {
      header.id = slug;
    }
    return {
      level,
      text,
      slug: header.id || slug,
      element: header
    };
  }).filter((header) => header.text.length > 0);
};
const generateSlug = (text, index) => {
  if (!text || typeof text !== "string") {
    return `header-${index}`;
  }
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim("-") || `header-${index}`;
};
const TOCItem = ({ header, isActive, onClick, isCollapsed }) => {
  const indentLevel = Math.max(0, header.level - 1);
  const indentClass = `ml-${Math.min(indentLevel * 4, 12)}`;
  return /* @__PURE__ */ jsx("li", { className: `toc-item level-${header.level}`, children: /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: () => onClick(header),
      className: combineClasses(
        "w-full text-left py-2 px-3 rounded-md transition-all duration-200 group flex items-center gap-2",
        "hover:bg-zinc-700/50 focus:bg-zinc-700/50 focus:outline-none",
        isActive ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-500" : "text-zinc-400 hover:text-zinc-300",
        indentClass
      ),
      title: header.text,
      children: [
        /* @__PURE__ */ jsx(
          Hash,
          {
            size: 14,
            className: combineClasses(
              "flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
              isActive && "opacity-100"
            )
          }
        ),
        /* @__PURE__ */ jsx("span", { className: combineClasses(
          "truncate text-sm leading-relaxed",
          header.level === 1 && "font-semibold",
          header.level === 2 && "font-medium",
          header.level >= 3 && "font-normal"
        ), children: header.text })
      ]
    }
  ) });
};
const TableOfContents = ({
  content = null,
  containerSelector = null,
  className = "",
  title = "Índice",
  collapsible = true,
  initiallyCollapsed = false,
  minHeaders = 3,
  maxLevel = 6,
  offsetTop = 100,
  smoothScroll = true,
  updateUrlHash = true,
  showProgress = false,
  mobileBreakpoint = 768
}) => {
  const [headers, setHeaders] = useState([]);
  const [activeHeader, setActiveHeader] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isMobile, setIsMobile] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const observerRef = useRef(null);
  const headersRef = useRef([]);
  const tocRef = useRef(null);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);
  useEffect(() => {
    let extractedHeaders = [];
    if (content) {
      extractedHeaders = extractHeaders(content);
    } else if (containerSelector) {
      const container = document.querySelector(containerSelector);
      if (container) {
        extractedHeaders = extractHeaders(container);
      }
    } else {
      const article = document.querySelector("article") || document.querySelector("main") || document.querySelector(".blog-content");
      if (article) {
        extractedHeaders = extractHeaders(article);
      }
    }
    const filteredHeaders = extractedHeaders.filter((h) => h.level <= maxLevel);
    if (filteredHeaders.length >= minHeaders) {
      setHeaders(filteredHeaders);
      headersRef.current = filteredHeaders;
    } else {
      setHeaders([]);
      headersRef.current = [];
    }
  }, [content, containerSelector, maxLevel, minHeaders]);
  useEffect(() => {
    if (headers.length === 0) return;
    const observerOptions = {
      rootMargin: `-${offsetTop}px 0px -80% 0px`,
      threshold: 0
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const visibleHeaders = entries.filter((entry) => entry.isIntersecting).map((entry) => {
        const header = headersRef.current.find((h) => h.element === entry.target);
        return { header, ratio: entry.intersectionRatio };
      }).filter((item) => item.header);
      if (visibleHeaders.length > 0) {
        const mostVisible = visibleHeaders.reduce(
          (prev, current) => prev.ratio > current.ratio ? prev : current
        );
        setActiveHeader(mostVisible.header.slug);
        if (updateUrlHash && mostVisible.header.slug) {
          const newUrl = `${window.location.pathname}${window.location.search}#${mostVisible.header.slug}`;
          window.history.replaceState(null, "", newUrl);
        }
      }
    }, observerOptions);
    headers.forEach((header) => {
      if (header.element) {
        observerRef.current.observe(header.element);
      }
    });
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headers, offsetTop, updateUrlHash]);
  useEffect(() => {
    if (!showProgress || headers.length === 0) return;
    let ticking = false;
    const calculateProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScrollableDistance = documentHeight - windowHeight;
        if (maxScrollableDistance <= 0) {
          setReadingProgress(100);
        } else {
          const progress = Math.round(scrollTop / maxScrollableDistance * 100);
          setReadingProgress(Math.min(100, Math.max(0, progress)));
        }
        ticking = false;
      });
    };
    calculateProgress();
    const handleScroll = () => {
      calculateProgress();
    };
    const handleResize = () => {
      calculateProgress();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [showProgress, headers]);
  const handleHeaderClick = useCallback((header) => {
    if (!header.element) return;
    const yOffset = -offsetTop;
    const y = header.element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    if (smoothScroll) {
      window.scrollTo({ top: y, behavior: "smooth" });
    } else {
      window.scrollTo(0, y);
    }
    if (updateUrlHash) {
      const newUrl = `${window.location.pathname}${window.location.search}#${header.slug}`;
      window.history.pushState(null, "", newUrl);
    }
    if (isMobile && collapsible) {
      setIsCollapsed(true);
    }
  }, [offsetTop, smoothScroll, updateUrlHash, isMobile, collapsible]);
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);
  if (headers.length === 0) {
    return null;
  }
  const tocContent = /* @__PURE__ */ jsxs("div", { className: combineClasses(
    "toc-container bg-zinc-800/50 rounded-lg border border-zinc-700/50 overflow-hidden",
    className
  ), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-zinc-700/50", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(List, { size: 18, className: "text-zinc-400" }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold text-zinc-200 text-sm", children: title }),
        showProgress && /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
          Math.round(readingProgress),
          "%"
        ] })
      ] }),
      collapsible && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleCollapse,
          className: "p-1 text-zinc-400 hover:text-zinc-300 transition-colors",
          "aria-label": isCollapsed ? "Expandir Índice" : "Recolher Índice",
          children: isCollapsed ? /* @__PURE__ */ jsx(CaretRight, { size: 16 }) : /* @__PURE__ */ jsx(CaretDown, { size: 16 })
        }
      )
    ] }),
    showProgress && !isCollapsed && /* @__PURE__ */ jsx("div", { className: "px-4 py-2 border-b border-zinc-700/50", children: /* @__PURE__ */ jsx("div", { className: "w-full bg-zinc-700 rounded-full h-1", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "bg-purple-500 h-1 rounded-full transition-all duration-300",
        style: { width: `${readingProgress}%` }
      }
    ) }) }),
    !isCollapsed && /* @__PURE__ */ jsxs(
      "nav",
      {
        className: `toc-nav p-2 ${isMobile ? "max-h-[50vh] overflow-y-auto" : "max-h-[calc(100vh-200px)] overflow-visible"}`,
        role: "navigation",
        "aria-label": "Índice do artigo",
        style: {
          // Custom scrollbar styling para quando necessário no mobile
          scrollbarWidth: "thin",
          scrollbarColor: "#4A5568 #2D3748"
        },
        children: [
          /* @__PURE__ */ jsx("style", { jsx: true, children: `
            .toc-nav::-webkit-scrollbar {
              width: 4px;
            }
            .toc-nav::-webkit-scrollbar-track {
              background: #2D3748;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb {
              background: #4A5568;
              border-radius: 2px;
            }
            .toc-nav::-webkit-scrollbar-thumb:hover {
              background: #718096;
            }
          ` }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: headers.map((header, index) => /* @__PURE__ */ jsx(
            TOCItem,
            {
              header,
              isActive: activeHeader === header.slug,
              onClick: handleHeaderClick,
              isCollapsed
            },
            `${header.slug}-${index}`
          )) })
        ]
      }
    )
  ] });
  if (isMobile) {
    return /* @__PURE__ */ jsx("div", { className: combineClasses(
      "toc-mobile sticky top-20 z-30 mb-6",
      className
    ), children: tocContent });
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: tocRef,
      className: combineClasses(
        "toc-desktop sticky top-24 max-h-[calc(100vh-6rem)]",
        className
      ),
      children: tocContent
    }
  );
};
export {
  TableOfContents as default
};
