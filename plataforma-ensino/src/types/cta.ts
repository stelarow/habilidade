// CTA Types for Stelarow Habilidade Platform
export type CTAType = 'leadmagnet' | 'newsletter' | 'course' | 'consultation' | 'urgency';

export type CTALayout = 'horizontal' | 'vertical' | 'modal' | 'inline' | 'sidebar' | 'floating';

export type CTATargetingRule = {
  category?: string;
  timing: 'immediate' | 'scroll' | 'time' | 'exit-intent';
  timeDelay?: number;
  scrollPercent?: number;
  segment?: string;
};

export type CTADesignConfig = {
  theme: 'light' | 'dark' | 'gradient';
  primaryColor: string;
  secondaryColor: string;
  layout: CTALayout;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow: boolean;
};

export type CTAContentConfig = {
  title: string;
  description: string;
  buttonText: string;
  subtext?: string;
  image?: string;
  icon?: string;
  benefits?: string[];
  socialProof?: {
    count?: number;
    testimonial?: string;
    author?: string;
  };
};

export type CTAConfiguration = {
  id: string;
  type: CTAType;
  content: CTAContentConfig;
  design: CTADesignConfig;
  targeting: CTATargetingRule;
  isActive: boolean;
  abTest?: {
    variant: 'A' | 'B';
    splitRatio: number;
  };
};

export type CTATemplate = {
  id: string;
  name: string;
  category: string;
  type: CTAType;
  config: Partial<CTAConfiguration>;
  description?: string;
  previewImage?: string;
  usageCount?: number;
};

export type CTAEvent = {
  type: 'view' | 'click' | 'conversion' | 'close';
  ctaId: string;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, any>;
};

export type CTAMetrics = {
  views: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  revenue?: number;
};

export type LeadMagnetData = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  interests?: string[];
};

export type NewsletterData = {
  email: string;
  preferences?: string[];
  source?: string;
};

export type UrgencyConfig = {
  type: 'time' | 'quantity' | 'demand' | 'seasonal';
  deadline?: Date;
  quantity?: number;
  message: string;
  showCountdown: boolean;
};

export type CTAHookConfig = {
  trackViews?: boolean;
  trackClicks?: boolean;
  trackConversions?: boolean;
  batchEvents?: boolean;
  debugMode?: boolean;
};