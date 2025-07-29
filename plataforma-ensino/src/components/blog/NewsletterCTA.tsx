'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CTAConfiguration, NewsletterData } from '@/types/cta';
import { useCTATracking } from '@/hooks/useCTATracking';
import { useNewsletter } from '@/hooks/useNewsletter';
import { 
  Mail, 
  CheckCircle, 
  Users, 
  Calendar,
  Star,
  AlertTriangle,
  X
} from 'lucide-react';

// Newsletter Form Schema
const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  preferences: z.array(z.string()).optional(),
  source: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterCTAProps {
  config: CTAConfiguration;
  variant?: 'inline' | 'sidebar' | 'exit-intent' | 'floating';
  category?: string;
  className?: string;
  onConversion?: (data: NewsletterData) => void;
  showSocialProof?: boolean;
  frequency?: 'semanal' | 'quinzenal' | 'mensal';
}

const CATEGORY_BENEFITS = {
  tecnologia: [
    '5 dicas de programação semanais',
    'Tendências em tech',
    'Tutoriais exclusivos',
    'Reviews de ferramentas'
  ],
  marketing: [
    'Estratégias de marketing digital',
    'Cases de sucesso',
    'Ferramentas gratuitas',
    'Tendências do mercado'
  ],
  design: [
    'Inspirações de design',
    'Tutoriais de ferramentas',
    'Tendências visuais',
    'Recursos gratuitos'
  ],
  negocios: [
    'Insights empresariais',
    'Dicas de gestão',
    'Análises de mercado',
    'Networking'
  ],
  default: [
    'Conteúdo exclusivo',
    'Dicas práticas',
    'Novidades em primeira mão',
    'Material complementar'
  ]
};

const VARIANT_STYLES = {
  inline: 'w-full',
  sidebar: 'w-full max-w-sm',
  'exit-intent': 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center',
  floating: 'fixed bottom-4 right-4 w-80 z-40'
};

export function NewsletterCTA({
  config,
  variant = 'inline',
  category = 'default',
  className = '',
  onConversion,
  showSocialProof = true,
  frequency = 'semanal'
}: NewsletterCTAProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isVisible, setIsVisible] = useState(variant !== 'exit-intent');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  
  const { trackEvent } = useCTATracking({
    ctaId: config.id,
    trackViews: true,
    trackClicks: true,
    trackConversions: true,
  });

  const { subscribe, isLoading } = useNewsletter();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      preferences: [],
      source: `blog-${category}`,
    },
  });

  const { control, handleSubmit, formState: { errors }, reset } = form;

  // Track view when component mounts
  useEffect(() => {
    if (isVisible) {
      trackEvent('view');
    }
    
    // Simulate subscriber count (in real app, this would come from backend)
    setSubscriberCount(Math.floor(Math.random() * 5000) + 2000);
  }, [trackEvent, isVisible]);

  // Exit intent detection for exit-intent variant
  useEffect(() => {
    if (variant === 'exit-intent') {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          setIsVisible(true);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);
      return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [variant]);

  const handleSubmitForm = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    trackEvent('click');

    try {
      const newsletterData: NewsletterData = {
        email: data.email,
        preferences: selectedPreferences,
        source: data.source,
      };

      await subscribe(newsletterData);

      // Track conversion
      trackEvent('conversion', newsletterData);

      // Call conversion callback
      if (onConversion) {
        onConversion(newsletterData);
      }

      setSubmitStatus('success');
      
      // Auto-hide after success for some variants
      if (variant === 'floating' || variant === 'exit-intent') {
        setTimeout(() => {
          setIsVisible(false);
          reset();
          setSubmitStatus('idle');
        }, 3000);
      }

    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    reset();
    setSubmitStatus('idle');
  };

  const getBorderRadiusClass = (radius: string = 'md') => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    };
    return radiusMap[radius as keyof typeof radiusMap] || 'rounded-md';
  };

  const getVariantClasses = () => {
    return VARIANT_STYLES[variant] || VARIANT_STYLES.inline;
  };

  const getCategoryBenefits = () => {
    return CATEGORY_BENEFITS[category as keyof typeof CATEGORY_BENEFITS] || CATEGORY_BENEFITS.default;
  };

  const getFrequencyText = () => {
    switch (frequency) {
      case 'semanal':
        return 'toda semana';
      case 'quinzenal':
        return 'a cada 15 dias';
      case 'mensal':
        return 'todo mês';
      default:
        return 'regularmente';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      {variant === 'exit-intent' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 z-10 bg-white hover:bg-gray-100 rounded-full w-8 h-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Card
        className={`${getBorderRadiusClass(config.design.borderRadius)} ${
          config.design.shadow ? 'shadow-lg' : ''
        } ${variant === 'floating' ? 'shadow-xl' : ''}`}
        style={{
          background:
            config.design.theme === 'gradient'
              ? `linear-gradient(135deg, ${config.design.primaryColor}, ${config.design.secondaryColor})`
              : config.design.theme === 'dark'
              ? '#1f2937'
              : '#ffffff',
          color: config.design.theme === 'dark' ? '#ffffff' : '#1f2937',
        }}
      >
        <CardContent className="p-6">
          {variant === 'floating' && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 w-6 h-6 p-0 opacity-60 hover:opacity-100"
              onClick={handleClose}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {submitStatus === 'success' ? (
            <div className="text-center py-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Inscrição Confirmada!
              </h3>
              <p className="text-sm opacity-80">
                Em breve você receberá nosso primeiro email com conteúdo exclusivo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg bg-blue-500 text-white`}>
                    <Mail className="h-5 w-5" />
                  </div>
                  {showSocialProof && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      {subscriberCount.toLocaleString()} inscritos
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold">
                  {config.content.title}
                </h3>
                <p className="text-sm opacity-80">
                  {config.content.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">
                  O que você vai receber {getFrequencyText()}:
                </p>
                <ul className="space-y-1">
                  {getCategoryBenefits().map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-3">
                <div className="space-y-2">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        <Input
                          {...field}
                          type="email"
                          placeholder="Seu melhor email"
                          className={`flex-1 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        <Button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className={getBorderRadiusClass(config.design.borderRadius)}
                          style={{
                            backgroundColor:
                              config.design.buttonStyle === 'solid'
                                ? config.design.primaryColor
                                : 'transparent',
                            borderColor: config.design.primaryColor,
                            color:
                              config.design.buttonStyle === 'solid'
                                ? '#ffffff'
                                : config.design.primaryColor,
                          }}
                        >
                          {isSubmitting || isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          ) : (
                            config.content.buttonText || 'Inscrever'
                          )}
                        </Button>
                      </div>
                    )}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Preferences (for specific categories) */}
                {category !== 'default' && (
                  <div className="space-y-2">
                    <p className="text-xs opacity-70">Interesses (opcional):</p>
                    <div className="flex flex-wrap gap-1">
                      {getCategoryBenefits().slice(0, 3).map((benefit, index) => (
                        <Badge
                          key={index}
                          variant={selectedPreferences.includes(benefit) ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            setSelectedPreferences(prev =>
                              prev.includes(benefit)
                                ? prev.filter(p => p !== benefit)
                                : [...prev, benefit]
                            );
                          }}
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    <p className="text-xs">
                      Erro ao inscrever. Tente novamente.
                    </p>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs opacity-60">
                  <Calendar className="h-3 w-3" />
                  <span>Enviado {getFrequencyText()}</span>
                </div>
                
                {config.content.subtext && (
                  <p className="text-xs opacity-60 text-center">
                    {config.content.subtext}
                  </p>
                )}
                
                <p className="text-xs opacity-50 text-center">
                  Sem spam. Cancele quando quiser.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default NewsletterCTA;