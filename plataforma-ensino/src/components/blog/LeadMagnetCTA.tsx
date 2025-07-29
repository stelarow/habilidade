'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { CTAConfiguration, LeadMagnetData } from '@/types/cta';
import { useCTATracking } from '@/hooks/useCTATracking';
import { 
  Download, 
  CheckCircle, 
  User, 
  Mail, 
  Building, 
  Briefcase,
  X,
  AlertTriangle
} from 'lucide-react';
import { sendLeadMagnetEmail, isValidEmail } from '@/lib/emailjs';

// Lead Magnet Form Schema
const leadMagnetSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo'),
  email: z.string().email('Email inv�lido'),
  company: z.string().max(50, 'Nome da empresa muito longo').optional(),
  role: z.string().max(50, 'Cargo muito longo').optional(),
  interests: z.array(z.string()).optional(),
});

type LeadMagnetFormData = z.infer<typeof leadMagnetSchema>;

interface LeadMagnetCTAProps {
  config: CTAConfiguration;
  materialTitle?: string;
  materialType?: 'pdf' | 'guide' | 'template' | 'checklist' | 'ebook';
  downloadUrl?: string;
  className?: string;
  onConversion?: (data: LeadMagnetData) => void;
  interests?: string[];
}

const MATERIAL_ICONS = {
  pdf: '=�',
  guide: '=�',
  template: '=�',
  checklist: '',
  ebook: '=�',
};

const MATERIAL_COLORS = {
  pdf: 'from-red-500 to-red-600',
  guide: 'from-blue-500 to-blue-600',
  template: 'from-green-500 to-green-600',
  checklist: 'from-orange-500 to-orange-600',
  ebook: 'from-purple-500 to-purple-600',
};

export function LeadMagnetCTA({
  config,
  materialTitle,
  materialType = 'pdf',
  downloadUrl,
  className = '',
  onConversion,
  interests = []
}: LeadMagnetCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [downloadCount, setDownloadCount] = useState(0);
  
  const { trackEvent } = useCTATracking({
    ctaId: config.id,
    trackViews: true,
    trackClicks: true,
    trackConversions: true,
  });

  const form = useForm<LeadMagnetFormData>({
    resolver: zodResolver(leadMagnetSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      interests: [],
    },
  });

  const { control, handleSubmit, formState: { errors }, reset } = form;

  // Track view when component mounts
  useEffect(() => {
    trackEvent('view');
    
    // Simulate download count (in real app, this would come from backend)
    setDownloadCount(Math.floor(Math.random() * 1000) + 500);
  }, [trackEvent]);

  const handleCTAClick = () => {
    trackEvent('click');
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (data: LeadMagnetFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email with material via EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CTA_LEADMAGNET!,
        {
          to_email: data.email,
          to_name: data.name,
          material_title: materialTitle || config.content.title,
          material_type: materialType,
          download_url: downloadUrl || '#',
          company: data.company || 'N�o informado',
          role: data.role || 'N�o informado',
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Track conversion
      trackEvent('conversion', data);

      // Call conversion callback
      if (onConversion) {
        onConversion(data);
      }

      setSubmitStatus('success');
      
      // Auto-close modal after success
      setTimeout(() => {
        setIsModalOpen(false);
        reset();
        setSubmitStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Error sending lead magnet:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  const getLayoutClasses = () => {
    switch (config.design.layout) {
      case 'vertical':
        return 'flex-col text-center items-center';
      case 'inline':
        return 'inline-flex items-center';
      default:
        return 'flex items-center';
    }
  };

  const materialIcon = MATERIAL_ICONS[materialType];
  const materialColor = MATERIAL_COLORS[materialType];

  return (
    <>
      {/* CTA Component */}
      <div className={`${className} w-full`}>
        <Card
          className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 hover:border-purple-300 ${getBorderRadiusClass(
            config.design.borderRadius
          )} ${config.design.shadow ? 'shadow-md' : ''}`}
          onClick={handleCTAClick}
        >
          <CardContent className="p-6">
            <div
              className={`${getLayoutClasses()} gap-4`}
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
              {/* Icon/Image Section */}
              <div className="flex-shrink-0">
                {config.content.image ? (
                  <img
                    src={config.content.image}
                    alt={config.content.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className={`p-4 rounded-lg bg-gradient-to-br ${materialColor} text-white text-2xl flex items-center justify-center`}>
                    {materialIcon}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold leading-tight">
                    {config.content.title}
                  </h3>
                  <p className="text-sm opacity-80 mt-1">
                    {config.content.description}
                  </p>
                </div>

                {/* Benefits List */}
                {config.content.benefits && config.content.benefits.length > 0 && (
                  <ul className="space-y-1">
                    {config.content.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}

                {/* CTA Button */}
                <div className="flex items-center gap-3">
                  <Button
                    className={`flex items-center gap-2 ${getBorderRadiusClass(
                      config.design.borderRadius
                    )}`}
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
                    <Download className="h-4 w-4" />
                    {config.content.buttonText}
                  </Button>

                  {/* Download Counter */}
                  <Badge variant="secondary" className="text-xs">
                    {downloadCount.toLocaleString()} downloads
                  </Badge>
                </div>

                {/* Subtext */}
                {config.content.subtext && (
                  <p className="text-xs opacity-60">
                    {config.content.subtext}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Capture Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${materialColor} text-white text-lg`}>
                {materialIcon}
              </div>
              Baixar {materialTitle || config.content.title}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados abaixo para receber o material gratuitamente em seu email
            </DialogDescription>
          </DialogHeader>

          {submitStatus === 'success' ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Material Enviado!
              </h3>
              <p className="text-sm text-gray-600">
                Verifique sua caixa de entrada. O material foi enviado para seu email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="text-gray-600">Passo 1 de 1</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo *
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Seu nome completo"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email *
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="seu@email.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Empresa
                  </Label>
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Sua empresa" />
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Cargo
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Seu cargo" />
                    )}
                  />
                </div>
              </div>

              {/* Interests (if provided) */}
              {interests.length > 0 && (
                <div className="space-y-2">
                  <Label>Interesses (opcional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-700">
                    Erro ao enviar material. Tente novamente.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  style={{ backgroundColor: config.design.primaryColor }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Receber Material
                    </>
                  )}
                </Button>
              </div>

              {/* Privacy Note */}
              <p className="text-xs text-gray-500 text-center pt-2">
                Seus dados est�o seguros. N�o compartilhamos com terceiros.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LeadMagnetCTA;