import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MagnifyingGlass, X, SlidersHorizontal, CaretDown, Tag, User, Clock, CalendarBlank, Check, Eraser, Funnel } from "@phosphor-icons/react";
import { a as useCategories } from "./useBlogAPI-CVn3KLQ0.js";
import { b as gaService } from "../../main.mjs";
import "@tanstack/react-query";
import "./blog-data-CxiE244K.js";
import "vite-react-ssg";
import "@dr.pogodin/react-helmet";
import "prop-types";
class AnalyticsService {
  constructor() {
    this.isEnabled = this.checkConsent();
    this.sessionId = this.generateSessionId();
    this.eventQueue = [];
    this.batchTimeout = null;
    this.BATCH_SIZE = 10;
    this.BATCH_TIMEOUT = 5e3;
    if (this.isEnabled) {
      this.initializeTracking();
    }
  }
  /**
   * Check if user has given consent for analytics
   */
  checkConsent() {
    try {
      const consent = localStorage.getItem("habilidade_analytics_consent");
      return consent === "true";
    } catch (error) {
      console.warn("[Analytics] Could not check consent:", error);
      return false;
    }
  }
  /**
   * Set user consent for analytics
   */
  setConsent(hasConsent) {
    try {
      localStorage.setItem("habilidade_analytics_consent", hasConsent.toString());
      this.isEnabled = hasConsent;
      if (hasConsent) {
        this.initializeTracking();
      } else {
        this.clearData();
      }
    } catch (error) {
      console.warn("[Analytics] Could not set consent:", error);
    }
  }
  /**
   * Generate anonymous session ID
   */
  generateSessionId() {
    return "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }
  /**
   * Initialize tracking mechanisms
   */
  initializeTracking() {
    this.setupScrollTracking();
    this.setupVisibilityTracking();
    this.setupUnloadTracking();
  }
  /**
   * Generic event tracking method
   */
  track(event, properties = {}) {
    if (!this.isEnabled) return;
    const eventData = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        url: window.location.pathname,
        referrer: document.referrer || "direct",
        userAgent: this.sanitizeUserAgent(navigator.userAgent),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };
    this.eventQueue.push(eventData);
    this.processBatch();
  }
  /**
   * Track blog post view
   */
  trackPostView(postSlug, postTitle, category, readingTime) {
    this.track("post_view", {
      postSlug,
      postTitle: this.sanitizeText(postTitle),
      category,
      readingTime,
      viewStartTime: Date.now()
    });
    gaService.trackPostView(postSlug, postTitle, category, readingTime);
    this.startTimeTracking(postSlug);
  }
  /**
   * Track search queries
   */
  trackSearch(query, resultsCount, category = null) {
    this.track("search", {
      query: this.sanitizeText(query),
      resultsCount,
      category,
      queryLength: query.length
    });
    gaService.trackSearch(query, resultsCount);
  }
  /**
   * Track social sharing
   */
  trackShare(platform, postSlug, postTitle) {
    this.track("share", {
      platform,
      postSlug,
      postTitle: this.sanitizeText(postTitle)
    });
    gaService.trackShare(platform, postSlug, postTitle);
  }
  /**
   * Track category navigation
   */
  trackCategoryView(categorySlug, categoryName, postsCount) {
    this.track("category_view", {
      categorySlug,
      categoryName: this.sanitizeText(categoryName),
      postsCount
    });
    gaService.trackCategoryView(categorySlug, categoryName, postsCount);
  }
  /**
   * Track reading progress
   */
  trackReadingProgress(postSlug, percentage) {
    const milestones = [25, 50, 75, 90, 100];
    if (milestones.includes(percentage)) {
      this.track("reading_progress", {
        postSlug,
        percentage,
        milestone: `${percentage}%`
      });
      gaService.trackReadingProgress(postSlug, percentage);
    }
  }
  /**
   * Track time spent on page
   */
  startTimeTracking(postSlug) {
    this.currentPost = {
      slug: postSlug,
      startTime: Date.now(),
      lastActiveTime: Date.now()
    };
    const updateActiveTime = () => {
      if (this.currentPost) {
        this.currentPost.lastActiveTime = Date.now();
      }
    };
    ["click", "scroll", "keydown", "mousemove"].forEach((event) => {
      document.addEventListener(event, updateActiveTime, { passive: true });
    });
  }
  /**
   * Setup scroll tracking for reading progress
   */
  setupScrollTracking() {
    let ticking = false;
    const trackScrollProgress = () => {
      if (!ticking && this.currentPost) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = Math.round(scrollTop / docHeight * 100);
          if (scrollPercent >= 0 && scrollPercent <= 100) {
            this.trackReadingProgress(this.currentPost.slug, scrollPercent);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", trackScrollProgress, { passive: true });
  }
  /**
   * Setup page visibility tracking
   */
  setupVisibilityTracking() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.currentPost) {
        this.trackTimeOnPage();
      } else if (!document.hidden && this.currentPost) {
        this.currentPost.lastActiveTime = Date.now();
      }
    });
  }
  /**
   * Setup unload tracking
   */
  setupUnloadTracking() {
    window.addEventListener("beforeunload", () => {
      if (this.currentPost) {
        this.trackTimeOnPage();
      }
      this.flushEvents();
    });
  }
  /**
   * Track total time spent on page
   */
  trackTimeOnPage() {
    if (!this.currentPost) return;
    const timeSpent = this.currentPost.lastActiveTime - this.currentPost.startTime;
    if (timeSpent >= 1e4) {
      const engagementLevel = this.calculateEngagementLevel(timeSpent);
      this.track("time_on_page", {
        postSlug: this.currentPost.slug,
        timeSpent: Math.round(timeSpent / 1e3),
        // in seconds
        engagementLevel
      });
      gaService.trackEngagementTime(this.currentPost.slug, timeSpent, engagementLevel);
    }
    this.currentPost = null;
  }
  /**
   * Calculate engagement level based on time spent
   */
  calculateEngagementLevel(timeSpent) {
    const seconds = timeSpent / 1e3;
    if (seconds < 30) return "low";
    if (seconds < 120) return "medium";
    if (seconds < 300) return "high";
    return "very_high";
  }
  /**
   * Process event queue in batches
   */
  processBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flushEvents();
    } else {
      this.batchTimeout = setTimeout(() => {
        this.flushEvents();
      }, this.BATCH_TIMEOUT);
    }
  }
  /**
   * Send events to analytics endpoint
   */
  async flushEvents() {
    if (this.eventQueue.length === 0) return;
    const events = [...this.eventQueue];
    this.eventQueue = [];
    try {
      await this.sendEvents(events);
    } catch (error) {
      console.warn("[Analytics] Failed to send events:", error);
      this.eventQueue.unshift(...events);
    }
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
  /**
   * Send events to analytics backend
   */
  async sendEvents(events) {
    const response = await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ events })
    });
    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status}`);
    }
  }
  /**
   * Store events locally for development/debugging
   */
  storeEventsLocally(events) {
    try {
      const existing = JSON.parse(localStorage.getItem("habilidade_analytics_events") || "[]");
      const updated = [...existing, ...events].slice(-1e3);
      localStorage.setItem("habilidade_analytics_events", JSON.stringify(updated));
    } catch (error) {
      console.warn("[Analytics] Could not store events locally:", error);
    }
  }
  /**
   * Get analytics summary (for development/debugging)
   */
  getAnalyticsSummary() {
    try {
      const events = JSON.parse(localStorage.getItem("habilidade_analytics_events") || "[]");
      const summary = {
        totalEvents: events.length,
        eventTypes: {},
        topPosts: {},
        topSearches: {},
        topCategories: {}
      };
      events.forEach((event) => {
        summary.eventTypes[event.event] = (summary.eventTypes[event.event] || 0) + 1;
        if (event.event === "post_view") {
          const slug = event.properties.postSlug;
          summary.topPosts[slug] = (summary.topPosts[slug] || 0) + 1;
        }
        if (event.event === "search") {
          const query = event.properties.query;
          summary.topSearches[query] = (summary.topSearches[query] || 0) + 1;
        }
        if (event.event === "category_view") {
          const category = event.properties.categorySlug;
          summary.topCategories[category] = (summary.topCategories[category] || 0) + 1;
        }
      });
      return summary;
    } catch (error) {
      console.warn("[Analytics] Could not generate summary:", error);
      return null;
    }
  }
  /**
   * Clear all analytics data
   */
  clearData() {
    try {
      localStorage.removeItem("habilidade_analytics_events");
      this.eventQueue = [];
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
        this.batchTimeout = null;
      }
    } catch (error) {
      console.warn("[Analytics] Could not clear data:", error);
    }
  }
  /**
   * Sanitize text to remove potentially sensitive information
   */
  sanitizeText(text) {
    if (!text) return "";
    return text.replace(/[\w.-]+@[\w.-]+\.\w+/g, "[email]").replace(/\b\d{4,}\b/g, "[number]").substring(0, 200);
  }
  /**
   * Sanitize user agent to remove detailed version info
   */
  sanitizeUserAgent(userAgent) {
    if (!userAgent) return "";
    const browserMatch = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i);
    const osMatch = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/i);
    return `${(browserMatch == null ? void 0 : browserMatch[0]) || "Unknown"} on ${(osMatch == null ? void 0 : osMatch[0]) || "Unknown"}`;
  }
}
const analytics = new AnalyticsService();
const trackSearch = (query, resultsCount, category) => analytics.trackSearch(query, resultsCount, category);
const AdvancedSearch = ({
  onSearch,
  onFiltersChange,
  initialFilters = {},
  className = "",
  expanded = false,
  onExpandedChange
}) => {
  var _a;
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [filters, setFilters] = useState({
    query: "",
    categories: [],
    authors: [],
    dateRange: { start: "", end: "" },
    readingTime: { min: 0, max: 0 },
    tags: [],
    ...initialFilters
  });
  const [searchQuery, setSearchQuery] = useState(initialFilters.query || "");
  const [selectedCategories, setSelectedCategories] = useState(new Set(initialFilters.categories || []));
  const [selectedAuthors, setSelectedAuthors] = useState(new Set(initialFilters.authors || []));
  const [selectedTags, setSelectedTags] = useState(new Set(initialFilters.tags || []));
  const [dateRange, setDateRange] = useState(initialFilters.dateRange || { start: "", end: "" });
  const [readingTimeRange, setReadingTimeRange] = useState(initialFilters.readingTime || { min: 0, max: 0 });
  const searchInputRef = useRef(null);
  const location = useLocation();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const categories = ((_a = categoriesData == null ? void 0 : categoriesData.data) == null ? void 0 : _a.categories) || [];
  const availableAuthors = [
    { id: 1, name: "Equipe Habilidade", slug: "equipe-habilidade" },
    { id: 2, name: "Alessandro Ferreira", slug: "alessandro-ferreira" },
    { id: 3, name: "Especialista Tech", slug: "especialista-tech" }
  ];
  const availableTags = [
    { id: 1, name: "Iniciante", slug: "iniciante" },
    { id: 2, name: "Avan�ado", slug: "avancado" },
    { id: 3, name: "Tutorial", slug: "tutorial" },
    { id: 4, name: "Dicas", slug: "dicas" },
    { id: 5, name: "Carreira", slug: "carreira" },
    { id: 6, name: "Projetos", slug: "projetos" }
  ];
  const readingTimeOptions = [
    { label: "Qualquer dura��o", min: 0, max: 0 },
    { label: "1-3 min", min: 1, max: 3 },
    { label: "3-7 min", min: 3, max: 7 },
    { label: "7-15 min", min: 7, max: 15 },
    { label: "15+ min", min: 15, max: 999 }
  ];
  useEffect(() => {
    const newFilters = {
      query: searchQuery,
      categories: Array.from(selectedCategories),
      authors: Array.from(selectedAuthors),
      dateRange,
      readingTime: readingTimeRange,
      tags: Array.from(selectedTags)
    };
    setFilters(newFilters);
    onFiltersChange == null ? void 0 : onFiltersChange(newFilters);
  }, [searchQuery, selectedCategories, selectedAuthors, dateRange, readingTimeRange, selectedTags, onFiltersChange]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchQuery.trim()) {
      searchParams.set("search", searchQuery.trim());
    } else {
      searchParams.delete("search");
    }
    if (selectedCategories.size > 0) {
      searchParams.set("categories", Array.from(selectedCategories).join(","));
    } else {
      searchParams.delete("categories");
    }
    if (selectedAuthors.size > 0) {
      searchParams.set("authors", Array.from(selectedAuthors).join(","));
    } else {
      searchParams.delete("authors");
    }
    if (selectedTags.size > 0) {
      searchParams.set("tags", Array.from(selectedTags).join(","));
    } else {
      searchParams.delete("tags");
    }
    if (dateRange.start || dateRange.end) {
      searchParams.set("dateStart", dateRange.start);
      searchParams.set("dateEnd", dateRange.end);
    } else {
      searchParams.delete("dateStart");
      searchParams.delete("dateEnd");
    }
    if (readingTimeRange.min > 0 || readingTimeRange.max > 0) {
      searchParams.set("readingMin", readingTimeRange.min.toString());
      searchParams.set("readingMax", readingTimeRange.max.toString());
    } else {
      searchParams.delete("readingMin");
      searchParams.delete("readingMax");
    }
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    if (newUrl !== `${location.pathname}${location.search}`) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [filters, location.pathname]);
  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.trim() && value.length >= 3) {
      trackSearch(value.trim(), 0, selectedCategories.size > 0 ? Array.from(selectedCategories)[0] : null);
    }
  };
  const handleCategoryToggle = (categorySlug) => {
    const newSelection = new Set(selectedCategories);
    if (newSelection.has(categorySlug)) {
      newSelection.delete(categorySlug);
    } else {
      newSelection.add(categorySlug);
    }
    setSelectedCategories(newSelection);
  };
  const handleAuthorToggle = (authorSlug) => {
    const newSelection = new Set(selectedAuthors);
    if (newSelection.has(authorSlug)) {
      newSelection.delete(authorSlug);
    } else {
      newSelection.add(authorSlug);
    }
    setSelectedAuthors(newSelection);
  };
  const handleTagToggle = (tagSlug) => {
    const newSelection = new Set(selectedTags);
    if (newSelection.has(tagSlug)) {
      newSelection.delete(tagSlug);
    } else {
      newSelection.add(tagSlug);
    }
    setSelectedTags(newSelection);
  };
  const handleDateRangeChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  const handleReadingTimeChange = (option) => {
    setReadingTimeRange({
      min: option.min,
      max: option.max
    });
  };
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories(/* @__PURE__ */ new Set());
    setSelectedAuthors(/* @__PURE__ */ new Set());
    setSelectedTags(/* @__PURE__ */ new Set());
    setDateRange({ start: "", end: "" });
    setReadingTimeRange({ min: 0, max: 0 });
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    window.history.replaceState(null, "", location.pathname);
  };
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedCategories.size > 0) count++;
    if (selectedAuthors.size > 0) count++;
    if (selectedTags.size > 0) count++;
    if (dateRange.start || dateRange.end) count++;
    if (readingTimeRange.min > 0 || readingTimeRange.max > 0) count++;
    return count;
  };
  const activeFiltersCount = getActiveFiltersCount();
  useEffect(() => {
    const handleKeyDown = (event) => {
      var _a2;
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        (_a2 = searchInputRef.current) == null ? void 0 : _a2.focus();
      }
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "F") {
        event.preventDefault();
        setIsExpanded(!isExpanded);
        onExpandedChange == null ? void 0 : onExpandedChange(!isExpanded);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, onExpandedChange]);
  const MultiSelect = ({ options, selected, onToggle, placeholder, icon: Icon, loading = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "relative", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => setIsOpen(!isOpen),
          className: "w-full flex items-center justify-between px-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-left text-zinc-300 hover:border-zinc-600/50 focus:border-purple-500/50 focus:outline-none transition-colors",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Icon, { size: 16, className: "text-zinc-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm", children: selected.size > 0 ? `${selected.size} selecionado${selected.size !== 1 ? "s" : ""}` : placeholder })
            ] }),
            /* @__PURE__ */ jsx(CaretDown, { size: 16, className: `text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}` })
          ]
        }
      ),
      isOpen && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-1 max-h-48 sm:max-h-60 overflow-y-auto bg-zinc-800/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-xl z-50", children: loading ? /* @__PURE__ */ jsx("div", { className: "p-3 text-center text-zinc-500", children: /* @__PURE__ */ jsx("div", { className: "animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full mx-auto" }) }) : /* @__PURE__ */ jsx(Fragment, { children: options.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-3 text-center text-zinc-500 text-sm", children: "Nenhuma op��o dispon�vel" }) : options.map((option) => /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onToggle(option.slug),
          className: "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-zinc-700/50 transition-colors",
          children: [
            /* @__PURE__ */ jsx("div", { className: `w-4 h-4 border border-zinc-600 rounded flex items-center justify-center ${selected.has(option.slug) ? "bg-purple-500 border-purple-500" : ""}`, children: selected.has(option.slug) && /* @__PURE__ */ jsx(Check, { size: 12, className: "text-white" }) }),
            /* @__PURE__ */ jsx("span", { className: "text-sm text-zinc-300", children: option.name }),
            option.post_count && /* @__PURE__ */ jsx("span", { className: "ml-auto text-xs text-zinc-500", children: option.post_count })
          ]
        },
        option.id
      )) }) })
    ] });
  };
  return /* @__PURE__ */ jsxs("div", { className: `bg-zinc-800/30 border border-zinc-700/50 rounded-lg ${className}`, children: [
    /* @__PURE__ */ jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none", children: /* @__PURE__ */ jsx(MagnifyingGlass, { size: 20, className: "text-zinc-500" }) }),
      /* @__PURE__ */ jsx(
        "input",
        {
          ref: searchInputRef,
          type: "text",
          placeholder: "Pesquisar artigos... (Ctrl+K)",
          value: searchQuery,
          onChange: handleSearchInput,
          className: "w-full pl-10 pr-12 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:border-purple-500/50 focus:outline-none transition-colors"
        }
      ),
      searchQuery && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSearchQuery(""),
          className: "absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 transition-colors",
          children: /* @__PURE__ */ jsx(X, { size: 16 })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          setIsExpanded(!isExpanded);
          onExpandedChange == null ? void 0 : onExpandedChange(!isExpanded);
        },
        className: "flex items-center gap-2 px-3 py-2 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-lg text-zinc-300 transition-colors",
        children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { size: 16 }),
          /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Filtros Avan�ados" }),
          activeFiltersCount > 0 && /* @__PURE__ */ jsx("span", { className: "ml-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full", children: activeFiltersCount }),
          /* @__PURE__ */ jsx(CaretDown, { size: 16, className: `ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}` })
        ]
      }
    ) }),
    isExpanded && /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 space-y-4 border-t border-zinc-700/50 pt-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Categorias" }),
          /* @__PURE__ */ jsx(
            MultiSelect,
            {
              options: categories,
              selected: selectedCategories,
              onToggle: handleCategoryToggle,
              placeholder: "Selecionar categorias",
              icon: Tag,
              loading: categoriesLoading
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Autores" }),
          /* @__PURE__ */ jsx(
            MultiSelect,
            {
              options: availableAuthors,
              selected: selectedAuthors,
              onToggle: handleAuthorToggle,
              placeholder: "Selecionar autores",
              icon: User
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Tags" }),
          /* @__PURE__ */ jsx(
            MultiSelect,
            {
              options: availableTags,
              selected: selectedTags,
              onToggle: handleTagToggle,
              placeholder: "Selecionar tags",
              icon: Tag
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Tempo de Leitura" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Clock, { size: 16, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" }),
            /* @__PURE__ */ jsx(
              "select",
              {
                value: readingTimeRange.min === 0 && readingTimeRange.max === 0 ? "" : `${readingTimeRange.min}-${readingTimeRange.max}`,
                onChange: (e) => {
                  const value = e.target.value;
                  if (!value) {
                    handleReadingTimeChange({ min: 0, max: 0 });
                  } else {
                    const [min, max] = value.split("-").map(Number);
                    handleReadingTimeChange({ min, max });
                  }
                },
                className: "w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors",
                children: readingTimeOptions.map((option, index) => /* @__PURE__ */ jsx(
                  "option",
                  {
                    value: option.min === 0 && option.max === 0 ? "" : `${option.min}-${option.max}`,
                    className: "bg-zinc-800 text-zinc-300",
                    children: option.label
                  },
                  index
                ))
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-zinc-300 mb-2", children: "Per�odo de Publica��o" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(CalendarBlank, { size: 16, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: dateRange.start,
                onChange: (e) => handleDateRangeChange("start", e.target.value),
                className: "w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors",
                placeholder: "Data inicial"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(CalendarBlank, { size: 16, className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: dateRange.end,
                onChange: (e) => handleDateRangeChange("end", e.target.value),
                className: "w-full pl-10 pr-3 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-300 focus:border-purple-500/50 focus:outline-none transition-colors",
                placeholder: "Data final"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-zinc-500", children: [
          /* @__PURE__ */ jsx("kbd", { className: "px-2 py-1 text-xs bg-zinc-700/50 border border-zinc-600/50 rounded", children: "Ctrl+Shift+F" }),
          /* @__PURE__ */ jsx("span", { className: "ml-2", children: "para alternar filtros" })
        ] }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: clearAllFilters,
            className: "flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-colors",
            children: [
              /* @__PURE__ */ jsx(Eraser, { size: 16 }),
              "Limpar filtros"
            ]
          }
        )
      ] }),
      activeFiltersCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg", children: [
        /* @__PURE__ */ jsx(Funnel, { size: 16, className: "text-purple-400" }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-purple-300", children: [
          activeFiltersCount,
          " filtro",
          activeFiltersCount !== 1 ? "s" : "",
          " ativo",
          activeFiltersCount !== 1 ? "s" : ""
        ] })
      ] })
    ] })
  ] });
};
export {
  AdvancedSearch as default
};
