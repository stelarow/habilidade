/**
 * Blog Theme Utilities
 * Manages theme colors, styles and consistency with main site design system
 */

// Category color mappings aligned with main site course colors
export const BLOG_CATEGORY_COLORS = {
  'tecnologia': {
    primary: '#60a5fa',
    background: 'rgba(96, 165, 250, 0.1)',
    border: 'rgba(96, 165, 250, 0.3)',
    text: '#60a5fa',
    hover: 'rgba(96, 165, 250, 0.2)'
  },
  'educacao': {
    primary: '#4ade80',
    background: 'rgba(74, 222, 128, 0.1)',
    border: 'rgba(74, 222, 128, 0.3)',
    text: '#4ade80',
    hover: 'rgba(74, 222, 128, 0.2)'
  },
  'carreira': {
    primary: '#a78bfa',
    background: 'rgba(167, 139, 250, 0.1)',
    border: 'rgba(167, 139, 250, 0.3)',
    text: '#a78bfa',
    hover: 'rgba(167, 139, 250, 0.2)'
  },
  'design': {
    primary: '#f472b6',
    background: 'rgba(244, 114, 182, 0.1)',
    border: 'rgba(244, 114, 182, 0.3)',
    text: '#f472b6',
    hover: 'rgba(244, 114, 182, 0.2)'
  },
  'programacao': {
    primary: '#fb7185',
    background: 'rgba(251, 113, 133, 0.1)',
    border: 'rgba(251, 113, 133, 0.3)',
    text: '#fb7185',
    hover: 'rgba(251, 113, 133, 0.2)'
  },
  'marketing': {
    primary: '#f97316',
    background: 'rgba(249, 115, 22, 0.1)',
    border: 'rgba(249, 115, 22, 0.3)',
    text: '#f97316',
    hover: 'rgba(249, 115, 22, 0.2)'
  },
  'ia': {
    primary: '#22d3ee',
    background: 'rgba(34, 211, 238, 0.1)',
    border: 'rgba(34, 211, 238, 0.3)',
    text: '#22d3ee',
    hover: 'rgba(34, 211, 238, 0.2)'
  },
  'bi': {
    primary: '#818cf8',
    background: 'rgba(129, 140, 248, 0.1)',
    border: 'rgba(129, 140, 248, 0.3)',
    text: '#818cf8',
    hover: 'rgba(129, 140, 248, 0.2)'
  }
};

// Default fallback colors
export const DEFAULT_CATEGORY_COLOR = {
  primary: '#71717a',
  background: 'rgba(113, 113, 122, 0.1)',
  border: 'rgba(113, 113, 122, 0.3)',
  text: '#71717a',
  hover: 'rgba(113, 113, 122, 0.2)'
};

// Status colors for blog states
export const BLOG_STATUS_COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  featured: '#f59e0b',
  premium: '#eab308',
  new: '#10b981'
};

// Main site brand colors (from main index.css)
export const BRAND_COLORS = {
  primary: '#d400ff',
  secondary: '#00c4ff',
  accent: '#a000ff'
};

/**
 * Get category color configuration
 * @param {string} categorySlug - Category slug
 * @returns {object} Color configuration object
 */
export const getCategoryColors = (categorySlug) => {
  return BLOG_CATEGORY_COLORS[categorySlug?.toLowerCase()] || DEFAULT_CATEGORY_COLOR;
};

/**
 * Get category CSS classes for Tailwind
 * @param {string} categorySlug - Category slug
 * @returns {object} CSS class names
 */
export const getCategoryClasses = (categorySlug) => {
  const slug = categorySlug?.toLowerCase();
  
  if (!BLOG_CATEGORY_COLORS[slug]) {
    return {
      background: 'bg-zinc-500/20',
      text: 'text-zinc-300',
      border: 'border-zinc-500/30',
      hover: 'hover:bg-zinc-500/30'
    };
  }
  
  return {
    background: `blog-bg-${slug}`,
    text: `blog-text-${slug}`,
    border: `blog-border-${slug}`,
    hover: `hover:blog-bg-${slug}`
  };
};

/**
 * Generate inline styles for dynamic category colors
 * @param {string} categorySlug - Category slug
 * @param {string} type - Color type (background, text, border)
 * @returns {object} Inline styles object
 */
export const getCategoryInlineStyles = (categorySlug, type = 'background') => {
  const colors = getCategoryColors(categorySlug);
  
  switch (type) {
    case 'background':
      return { backgroundColor: colors.background };
    case 'text':
      return { color: colors.text };
    case 'border':
      return { borderColor: colors.border };
    case 'hover-background':
      return { backgroundColor: colors.hover };
    default:
      return {};
  }
};

/**
 * Check if dark mode is preferred
 * @returns {boolean} True if dark mode is preferred
 */
export const isDarkModePreferred = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Check if reduced motion is preferred
 * @returns {boolean} True if reduced motion is preferred
 */
export const isReducedMotionPreferred = () => {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if high contrast is preferred
 * @returns {boolean} True if high contrast is preferred
 */
export const isHighContrastPreferred = () => {
  return window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get responsive animation classes based on user preferences
 * @param {string} animationType - Type of animation (fade, slide, etc.)
 * @returns {string} Animation CSS classes
 */
export const getAnimationClasses = (animationType = 'fade') => {
  if (isReducedMotionPreferred()) {
    return ''; // No animations for users who prefer reduced motion
  }
  
  switch (animationType) {
    case 'fade':
      return 'blog-fade-in';
    case 'slide':
      return 'blog-slide-in';
    case 'lift':
      return 'blog-hover-lift';
    default:
      return '';
  }
};

/**
 * Generate staggered animation delay classes
 * @param {number} index - Element index for stagger effect
 * @param {number} delayMs - Base delay in milliseconds
 * @returns {string} Delay CSS class
 */
export const getStaggeredDelay = (index, delayMs = 100) => {
  if (isReducedMotionPreferred()) {
    return '';
  }
  
  const delay = Math.min(index * delayMs, 500); // Cap at 500ms
  return `blog-delay-${delay}`;
};

/**
 * Combine multiple CSS classes safely
 * @param {...string} classes - CSS classes to combine
 * @returns {string} Combined and cleaned CSS classes
 */
export const combineClasses = (...classes) => {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
};

/**
 * Theme provider for React contexts (if needed)
 */
export const createBlogThemeContext = () => {
  return {
    colors: {
      categories: BLOG_CATEGORY_COLORS,
      status: BLOG_STATUS_COLORS,
      brand: BRAND_COLORS
    },
    utilities: {
      getCategoryColors,
      getCategoryClasses,
      getCategoryInlineStyles,
      getAnimationClasses,
      getStaggeredDelay,
      combineClasses
    },
    preferences: {
      isDarkMode: isDarkModePreferred(),
      isReducedMotion: isReducedMotionPreferred(),
      isHighContrast: isHighContrastPreferred()
    }
  };
};