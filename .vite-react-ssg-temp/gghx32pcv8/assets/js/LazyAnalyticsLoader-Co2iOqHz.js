class LazyAnalyticsLoader {
  constructor() {
    this.gtmId = "G-J4RJQLG6WP";
    this.isLoaded = false;
    this.eventQueue = [];
    this.loadTimeout = 3e3;
    this.interactionEvents = ["click", "scroll", "keydown", "mousemove", "touchstart"];
    if (typeof window !== "undefined") {
      this.init();
    }
  }
  init() {
    if (this.hasReducedMotionPreference()) {
      this.loadAnalytics();
      return;
    }
    this.setupInteractionObserver();
    this.setupIntersectionObserver();
    this.setupFallbackTimeout();
  }
  hasReducedMotionPreference() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  setupInteractionObserver() {
    if (typeof document === "undefined") return;
    const loadOnInteraction = () => {
      this.loadAnalytics();
      this.interactionEvents.forEach((event) => {
        document.removeEventListener(event, loadOnInteraction, { passive: true });
      });
    };
    this.interactionEvents.forEach((event) => {
      document.addEventListener(event, loadOnInteraction, { passive: true });
    });
  }
  setupIntersectionObserver() {
    if (typeof window === "undefined" || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          this.loadAnalytics();
          observer.disconnect();
        }
      });
    }, {
      rootMargin: "100px",
      threshold: 0.1
    });
    if (typeof document !== "undefined") {
      const footer = document.querySelector("footer");
      if (footer) {
        observer.observe(footer);
      }
    }
  }
  setupFallbackTimeout() {
    setTimeout(() => {
      if (!this.isLoaded) {
        this.loadAnalytics();
      }
    }, this.loadTimeout);
  }
  loadAnalytics() {
    if (this.isLoaded || typeof window === "undefined") return;
    this.isLoaded = true;
    window.dataLayer = window.dataLayer || [];
    this.loadGTMScript().then(() => {
      this.initializeGTM();
      this.replayQueuedEvents();
    }).catch((error) => {
      console.warn("[LazyAnalytics] Failed to load GTM:", error);
    });
  }
  loadGTMScript() {
    return new Promise((resolve, reject) => {
      if (typeof document === "undefined") {
        reject(new Error("Document not available"));
        return;
      }
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gtmId}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  initializeGTM() {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    function gtag2() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag2;
    gtag2("js", /* @__PURE__ */ new Date());
    gtag2("config", this.gtmId, {
      // Optimize for performance
      page_title: document.title,
      page_location: window.location.href,
      // Reduce sampling for better performance
      sample_rate: 100,
      // Disable automatic page views (we'll track manually)
      send_page_view: false
    });
    gtag2("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }
  replayQueuedEvents() {
    if (typeof window === "undefined") return;
    this.eventQueue.forEach(({ eventName, parameters }) => {
      if (typeof gtag === "function") {
        gtag("event", eventName, parameters);
      }
    });
    this.eventQueue = [];
  }
  // Queue events before analytics loads
  queueEvent(eventName, parameters = {}) {
    if (typeof window === "undefined") return;
    if (this.isLoaded && typeof gtag === "function") {
      gtag("event", eventName, parameters);
    } else {
      this.eventQueue.push({ eventName, parameters });
    }
  }
  // Public method to check if analytics is ready
  isReady() {
    return typeof window !== "undefined" && this.isLoaded && typeof window.gtag === "function";
  }
  // Force load analytics (for testing or special cases)
  forceLoad() {
    this.loadAnalytics();
  }
}
const lazyAnalyticsLoader = new LazyAnalyticsLoader();
if (typeof window !== "undefined") {
  window.lazyAnalyticsLoader = lazyAnalyticsLoader;
}
export {
  lazyAnalyticsLoader as default
};
