import { useState, useCallback, useEffect } from "react";
const BREAKPOINTS = {
  mobile: 768,
  // < 768px
  tablet: 1024,
  // 768px - 1023px
  desktop: 1280,
  // 1024px - 1279px
  large: 1536
  // >= 1280px
};
const useBlogResponsive = () => {
  const [screenData, setScreenData] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false
  });
  const calculateResponsiveData = useCallback((width, height) => {
    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    const isDesktop = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.large;
    const isLargeDesktop = width >= BREAKPOINTS.large;
    const gridColumns = isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4;
    const typographyScale = isMobile ? 0.875 : isTablet ? 0.95 : 1;
    const imageSizes = {
      thumbnail: isMobile ? 150 : isTablet ? 200 : 250,
      card: isMobile ? 300 : isTablet ? 400 : 500,
      hero: isMobile ? 600 : isTablet ? 800 : 1200,
      full: width
    };
    const readingWidth = Math.min(width * 0.9, isMobile ? 300 : isTablet ? 500 : 650);
    const performanceLevel = isMobile ? "low" : isTablet ? "medium" : "high";
    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isLargeDesktop,
      gridColumns,
      typographyScale,
      imageSizes,
      readingWidth,
      performanceLevel,
      // Device type detection
      deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
      // Orientation
      isLandscape: width > height,
      isPortrait: height > width,
      // Aspect ratio
      aspectRatio: width / height
    };
  }, []);
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setScreenData((currentData) => {
      if (Math.abs(currentData.width - width) < 5 && Math.abs(currentData.height - height) < 5) {
        return currentData;
      }
      return calculateResponsiveData(width, height);
    });
  }, [calculateResponsiveData]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    handleResize();
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);
  const getResponsiveValue = useCallback((values) => {
    const { mobile, tablet, desktop, large } = values;
    if (screenData.isMobile && mobile !== void 0) return mobile;
    if (screenData.isTablet && tablet !== void 0) return tablet;
    if (screenData.isDesktop && desktop !== void 0) return desktop;
    if (screenData.isLargeDesktop && large !== void 0) return large;
    return large || desktop || tablet || mobile;
  }, [screenData]);
  const getResponsiveImageProps = useCallback((baseUrl, alt, sizes = "card") => {
    const { imageSizes } = screenData;
    const targetSize = imageSizes[sizes] || imageSizes.card;
    return {
      src: `${baseUrl}?w=${targetSize}&q=75`,
      alt,
      width: targetSize,
      loading: screenData.isMobile ? "lazy" : "eager",
      // Generate srcSet for different densities
      srcSet: [
        `${baseUrl}?w=${targetSize}&q=75 1x`,
        `${baseUrl}?w=${targetSize * 1.5}&q=75 1.5x`,
        `${baseUrl}?w=${targetSize * 2}&q=75 2x`
      ].join(", ")
    };
  }, [screenData]);
  const getGridClasses = useCallback((baseColumns = null) => {
    const columns = baseColumns || screenData.gridColumns;
    if (columns === 1) return "grid grid-cols-1";
    if (columns === 2) return "grid grid-cols-1 md:grid-cols-2";
    if (columns === 3) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (columns === 4) return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
    return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  }, [screenData.gridColumns]);
  const getGapClasses = useCallback((size = "medium") => {
    const gapMap = {
      small: screenData.isMobile ? "gap-3" : "gap-4",
      medium: screenData.isMobile ? "gap-4" : "gap-6",
      large: screenData.isMobile ? "gap-6" : "gap-8"
    };
    return gapMap[size] || gapMap.medium;
  }, [screenData.isMobile]);
  const getTypographyClasses = useCallback((variant = "body") => {
    const { isMobile, isTablet } = screenData;
    const variants = {
      title: isMobile ? "text-xl" : isTablet ? "text-2xl" : "text-3xl",
      subtitle: isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl",
      body: isMobile ? "text-sm" : "text-base",
      caption: isMobile ? "text-xs" : "text-sm"
    };
    return variants[variant] || variants.body;
  }, [screenData]);
  const shouldUseAnimations = useCallback(() => {
    if (screenData.isMobile) return false;
    if (typeof window !== "undefined") {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return false;
    }
    return screenData.performanceLevel !== "low";
  }, [screenData]);
  return {
    // Screen data
    ...screenData,
    // Utility functions
    getResponsiveValue,
    getResponsiveImageProps,
    getGridClasses,
    getGapClasses,
    getTypographyClasses,
    shouldUseAnimations,
    // Breakpoint helpers
    breakpoints: BREAKPOINTS,
    // Quick responsive checks
    isSmallScreen: screenData.isMobile,
    isMediumScreen: screenData.isTablet,
    isLargeScreen: screenData.isDesktop || screenData.isLargeDesktop,
    // Performance helpers
    canUseHeavyAnimations: screenData.performanceLevel === "high",
    canUseMediumAnimations: screenData.performanceLevel !== "low",
    // Layout helpers
    showSidebar: !screenData.isMobile,
    showFullNavigation: !screenData.isMobile,
    useCompactLayout: screenData.isMobile,
    // Content optimization
    maxItemsPerPage: screenData.isMobile ? 6 : screenData.isTablet ? 9 : 12,
    imageQuality: screenData.isMobile ? 75 : 85,
    prefetchCount: screenData.isMobile ? 2 : 4
  };
};
export {
  useBlogResponsive as u
};
