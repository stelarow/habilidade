import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for contact optimization based on device type, context, and user behavior
 * Provides adaptive contact methods and UI optimizations
 */
export const useContactOptimization = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    platform: 'unknown',
    browser: 'unknown',
    hasNotch: false,
    supportsApp: false
  });

  const [contactPreferences, setContactPreferences] = useState({
    preferredChannel: 'whatsapp', // whatsapp, phone, email
    showFloatingButton: true,
    optimizeForTouch: false,
    useCompactUI: false,
    enableHaptics: false
  });

  // Detect device capabilities
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent;
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|WPDesktop/i.test(userAgent);
      const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Platform detection
      let platform = 'unknown';
      if (/iPhone|iPad|iPod/i.test(userAgent)) platform = 'ios';
      else if (/Android/i.test(userAgent)) platform = 'android';
      else if (/Windows/i.test(userAgent)) platform = 'windows';
      else if (/Mac/i.test(userAgent)) platform = 'mac';
      else if (/Linux/i.test(userAgent)) platform = 'linux';

      // Browser detection
      let browser = 'unknown';
      if (/Chrome/i.test(userAgent) && !/Edge/i.test(userAgent)) browser = 'chrome';
      else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'safari';
      else if (/Firefox/i.test(userAgent)) browser = 'firefox';
      else if (/Edge/i.test(userAgent)) browser = 'edge';

      // Check for notch support (safe-area-inset)
      const hasNotch = CSS.supports('padding', 'max(0px)') && 
                      CSS.supports('padding', 'env(safe-area-inset-bottom)');

      // Check if device supports WhatsApp app
      const supportsApp = platform === 'ios' || platform === 'android';

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        isTouch,
        platform,
        browser,
        hasNotch,
        supportsApp
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Set contact preferences based on device
  useEffect(() => {
    const optimizedPreferences = {
      preferredChannel: deviceInfo.isMobile ? 'whatsapp' : 'email',
      showFloatingButton: deviceInfo.isMobile || deviceInfo.isTablet,
      optimizeForTouch: deviceInfo.isTouch,
      useCompactUI: deviceInfo.isMobile && window.innerWidth < 400,
      enableHaptics: deviceInfo.platform === 'ios' && 'vibrate' in navigator
    };

    setContactPreferences(optimizedPreferences);
  }, [deviceInfo]);

  /**
   * Get optimized contact URL based on device
   * @param {string} method - Contact method (whatsapp, phone, email)
   * @param {string} message - Pre-formatted message
   * @param {Object} options - Additional options
   * @returns {string} Optimized contact URL
   */
  const getOptimizedContactUrl = useCallback((method, message = '', options = {}) => {
    const { phone = '5548988559491', email = 'alessandro.ferreira@escolahabilidade.com' } = options;

    switch (method) {
      case 'whatsapp':
        // Use app if available, otherwise web
        if (deviceInfo.supportsApp) {
          return `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`;
        } else {
          return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        }
      
      case 'phone':
        return `tel:+${phone}`;
      
      case 'email':
        const subject = options.subject || 'Contato via Site';
        return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      
      default:
        return '#';
    }
  }, [deviceInfo]);

  /**
   * Get recommended contact methods in order of preference
   * @param {Object} context - Context information
   * @returns {Array} Ordered array of contact methods
   */
  const getRecommendedMethods = useCallback((context = {}) => {
    const { urgent = false, businessHours = true, userPreference = null } = context;

    const methods = [];

    if (userPreference) {
      methods.push(userPreference);
    }

    if (deviceInfo.isMobile) {
      // Mobile users prefer WhatsApp and phone calls
      if (!methods.includes('whatsapp')) methods.push('whatsapp');
      if (urgent && businessHours && !methods.includes('phone')) methods.push('phone');
      if (!methods.includes('email')) methods.push('email');
    } else {
      // Desktop users prefer email first
      if (!methods.includes('email')) methods.push('email');
      if (!methods.includes('whatsapp')) methods.push('whatsapp');
      if (businessHours && !methods.includes('phone')) methods.push('phone');
    }

    return methods.slice(0, 3); // Return top 3 methods
  }, [deviceInfo]);

  /**
   * Get optimized UI configuration
   * @param {string} component - Component name
   * @returns {Object} UI configuration
   */
  const getUIConfig = useCallback((component) => {
    const baseConfig = {
      animations: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      compactMode: contactPreferences.useCompactUI,
      touchOptimized: contactPreferences.optimizeForTouch,
      hapticFeedback: contactPreferences.enableHaptics
    };

    const componentConfigs = {
      whatsappFloat: {
        ...baseConfig,
        size: deviceInfo.isMobile ? 'large' : 'medium',
        position: deviceInfo.hasNotch ? 'safe' : 'normal',
        expandDelay: deviceInfo.isMobile ? 2000 : 3000,
        showTyping: !deviceInfo.isMobile // Less distracting on desktop
      },
      
      contactModal: {
        ...baseConfig,
        fullscreen: deviceInfo.isMobile,
        stackButtons: deviceInfo.isMobile,
        largeInputs: deviceInfo.isTouch,
        autoFocus: !deviceInfo.isMobile // Prevent keyboard on mobile
      },
      
      contactSection: {
        ...baseConfig,
        layout: deviceInfo.isMobile ? 'stacked' : 'grid',
        showIcons: !contactPreferences.useCompactUI,
        buttonSize: deviceInfo.isTouch ? 'large' : 'medium'
      },
      
      consultationWidget: {
        ...baseConfig,
        variant: deviceInfo.isMobile ? 'compact' : 'full',
        showTestimonials: !contactPreferences.useCompactUI,
        autoExpand: deviceInfo.isDesktop
      }
    };

    return componentConfigs[component] || baseConfig;
  }, [deviceInfo, contactPreferences]);

  /**
   * Trigger haptic feedback if supported
   * @param {string} type - Feedback type ('light', 'medium', 'heavy')
   */
  const triggerHaptic = useCallback((type = 'light') => {
    if (!contactPreferences.enableHaptics || !navigator.vibrate) return;

    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
      success: [10, 50, 10],
      error: [100, 50, 100]
    };

    navigator.vibrate(patterns[type] || patterns.light);
  }, [contactPreferences.enableHaptics]);

  /**
   * Check if contact method is available
   * @param {string} method - Contact method
   * @returns {boolean} Availability status
   */
  const isMethodAvailable = useCallback((method) => {
    switch (method) {
      case 'whatsapp':
        return true; // Always available via web
      
      case 'phone':
        // Check if device supports tel: links
        return deviceInfo.isMobile || deviceInfo.platform !== 'unknown';
      
      case 'email':
        return true; // Always available
      
      default:
        return false;
    }
  }, [deviceInfo]);

  /**
   * Get contact analytics data
   * @returns {Object} Analytics data
   */
  const getAnalyticsData = useCallback(() => {
    return {
      deviceType: deviceInfo.isMobile ? 'mobile' : deviceInfo.isTablet ? 'tablet' : 'desktop',
      platform: deviceInfo.platform,
      browser: deviceInfo.browser,
      touchCapable: deviceInfo.isTouch,
      preferredChannel: contactPreferences.preferredChannel,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      viewportSize: `${window.screen.width}x${window.screen.height}`,
      userAgent: navigator.userAgent
    };
  }, [deviceInfo, contactPreferences]);

  /**
   * Optimize button placement to avoid conflicts
   * @param {Array} elements - Array of floating elements
   * @returns {Object} Optimized positions
   */
  const optimizeButtonPlacement = useCallback((elements = []) => {
    const positions = {};
    const baseBottom = deviceInfo.hasNotch ? 'env(safe-area-inset-bottom, 16px)' : '16px';
    const baseRight = deviceInfo.hasNotch ? 'env(safe-area-inset-right, 16px)' : '16px';

    elements.forEach((element, index) => {
      const offset = index * (deviceInfo.isMobile ? 70 : 60);
      positions[element] = {
        bottom: `calc(${baseBottom} + ${offset}px)`,
        right: baseRight
      };
    });

    return positions;
  }, [deviceInfo]);

  return {
    deviceInfo,
    contactPreferences,
    getOptimizedContactUrl,
    getRecommendedMethods,
    getUIConfig,
    triggerHaptic,
    isMethodAvailable,
    getAnalyticsData,
    optimizeButtonPlacement
  };
};