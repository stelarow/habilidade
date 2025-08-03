'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { 
  CTAType, 
  CTALayout, 
  CTAConfiguration, 
  CTADesignConfig, 
  CTAContentConfig, 
  CTATargetingRule 
} from '@/types/cta';
import { 
  Download, 
  Mail, 
  BookOpen, 
  MessageCircle, 
  Clock, 
  Eye, 
  Palette, 
  Target,
  Save,
  RefreshCw
} from 'lucide-react';

// Validation Schema
const ctaConfigSchema = z.object({
  type: z.enum(['leadmagnet', 'newsletter', 'course', 'consultation', 'urgency']),
  content: z.object({
    title: z.string().min(1, 'T�tulo � obrigat�rio').max(60, 'T�tulo muito longo'),
    description: z.string().min(1, 'Descri��o � obrigat�ria').max(200, 'Descri��o muito longa'),
    buttonText: z.string().min(1, 'Texto do bot�o � obrigat�rio').max(30, 'Texto muito longo'),
    subtext: z.string().optional(),
    image: z.string().url().optional().or(z.literal('')),
    icon: z.string().optional(),
    benefits: z.array(z.string()).optional(),
  }),
  design: z.object({
    theme: z.enum(['light', 'dark', 'gradient']),
    primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inv�lida'),
    secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor inv�lida'),
    layout: z.enum(['horizontal', 'vertical', 'modal', 'inline', 'sidebar', 'floating']),
    buttonStyle: z.enum(['solid', 'outline', 'ghost']),
    borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'xl']),
    shadow: z.boolean(),
  }),
  targeting: z.object({
    category: z.string().optional(),
    timing: z.enum(['immediate', 'scroll', 'time', 'exit-intent']),
    timeDelay: z.number().min(0).max(60000).optional(),
    scrollPercent: z.number().min(0).max(100).optional(),
    segment: z.string().optional(),
  }),
  isActive: z.boolean(),
});

type CTAFormData = z.infer<typeof ctaConfigSchema>;

interface CTACustomizerProps {
  postId?: string;
  initialConfig?: Partial<CTAConfiguration>;
  onSave?: (config: CTAConfiguration) => void;
  onPreview?: (config: Partial<CTAConfiguration>) => void;
}

const CTA_TYPE_OPTIONS = [
  {
    value: 'leadmagnet' as const,
    label: 'Lead Magnet',
    description: 'Capture leads com material complementar',
    icon: Download,
    color: 'bg-purple-500',
  },
  {
    value: 'newsletter' as const,
    label: 'Newsletter',
    description: 'Inscri��o em newsletter',
    icon: Mail,
    color: 'bg-blue-500',
  },
  {
    value: 'course' as const,
    label: 'Curso Espec�fico',
    description: 'Promo��o de curso espec�fico',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    value: 'consultation' as const,
    label: 'Consulta Gratuita',
    description: 'Agendamento de consulta',
    icon: MessageCircle,
    color: 'bg-orange-500',
  },
  {
    value: 'urgency' as const,
    label: 'Urg�ncia',
    description: 'CTAs com elementos de urg�ncia',
    icon: Clock,
    color: 'bg-red-500',
  },
];

export function CTACustomizer({ 
  postId, 
  initialConfig, 
  onSave, 
  onPreview 
}: CTACustomizerProps) {
  const [activeTab, setActiveTab] = useState('type');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CTAFormData>({
    resolver: zodResolver(ctaConfigSchema),
    defaultValues: {
      type: initialConfig?.type || 'leadmagnet',
      content: {
        title: initialConfig?.content?.title || '',
        description: initialConfig?.content?.description || '',
        buttonText: initialConfig?.content?.buttonText || 'Clique Aqui',
        subtext: initialConfig?.content?.subtext || '',
        image: initialConfig?.content?.image || '',
        icon: initialConfig?.content?.icon || '',
        benefits: initialConfig?.content?.benefits || [],
      },
      design: {
        theme: initialConfig?.design?.theme || 'gradient',
        primaryColor: initialConfig?.design?.primaryColor || '#d400ff',
        secondaryColor: initialConfig?.design?.secondaryColor || '#00c4ff',
        layout: initialConfig?.design?.layout || 'horizontal',
        buttonStyle: initialConfig?.design?.buttonStyle || 'solid',
        borderRadius: initialConfig?.design?.borderRadius || 'md',
        shadow: initialConfig?.design?.shadow ?? true,
      },
      targeting: {
        category: initialConfig?.targeting?.category || '',
        timing: initialConfig?.targeting?.timing || 'immediate',
        timeDelay: initialConfig?.targeting?.timeDelay || 0,
        scrollPercent: initialConfig?.targeting?.scrollPercent || 50,
        segment: initialConfig?.targeting?.segment || '',
      },
      isActive: initialConfig?.isActive ?? true,
    },
  });

  const { watch, control, handleSubmit, setValue, formState: { errors } } = form;
  const watchedValues = watch();

  // Real-time preview update
  useEffect(() => {
    if (onPreview && isPreviewMode) {
      const config = {
        id: initialConfig?.id || 'preview',
        ...watchedValues,
      } as CTAConfiguration;
      
      onPreview(config);
    }
  }, [watchedValues, onPreview, isPreviewMode, initialConfig?.id]);

  const handleSave = async (data: CTAFormData) => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      const config: CTAConfiguration = {
        id: initialConfig?.id || `cta_${Date.now()}`,
        type: data.type || 'course',
        content: {
          title: data.content?.title || 'Título padrão',
          description: data.content?.description || 'Descrição padrão',
          buttonText: data.content?.buttonText || 'Clique aqui',
          subtext: data.content?.subtext,
          image: data.content?.image,
          icon: data.content?.icon,
          benefits: data.content?.benefits,
        },
        design: data.design || {
          layout: 'card',
          style: 'minimal',
          colors: {
            background: '#ffffff',
            text: '#000000',
            button: '#3b82f6',
            buttonText: '#ffffff',
            accent: '#ef4444'
          },
          animation: 'none',
          borderRadius: 8,
          shadow: true
        },
        targeting: data.targeting || {
          category: 'all',
          timing: 'scroll',
          scrollPercent: 50
        },
        isActive: data.isActive ?? true,
      };
      
      await onSave(config);
      // Success toast would go here
    } catch (error) {
      console.error('Error saving CTA:', error);
      // Error toast would go here
    } finally {
      setIsSaving(false);
    }
  };

  const getTypeConfig = (type: CTAType) => {
    return CTA_TYPE_OPTIONS.find(option => option.value === type);
  };

  const updateBenefits = (benefits: string[]) => {
    setValue('content.benefits', benefits);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Configuration Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">CTA Customizer</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Editar' : 'Preview'}
            </Button>
            <Button
              onClick={handleSubmit(handleSave)}
              disabled={isSaving}
              size="sm"
            >
              {isSaving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="type">Tipo</TabsTrigger>
            <TabsTrigger value="content">Conte�do</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="targeting">Segmenta��o</TabsTrigger>
          </TabsList>

          {/* Tab 1: Type Selection */}
          <TabsContent value="type" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de CTA</CardTitle>
                <CardDescription>
                  Escolha o tipo de call-to-action mais adequado para seu objetivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CTA_TYPE_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = watchedValues.type === option.value;
                    
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setValue('type', option.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${option.color} text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{option.label}</h3>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Content Editor */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Conte�do do CTA</CardTitle>
                <CardDescription>
                  Configure textos, imagens e benef�cios do seu CTA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">T�tulo Principal *</Label>
                    <Controller
                      name="content.title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ex: Baixe nosso guia gratuito"
                          maxLength={60}
                        />
                      )}
                    />
                    {errors.content?.title && (
                      <p className="text-sm text-red-600">{errors.content.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buttonText">Texto do Bot�o *</Label>
                    <Controller
                      name="content.buttonText"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ex: Baixar Agora"
                          maxLength={30}
                        />
                      )}
                    />
                    {errors.content?.buttonText && (
                      <p className="text-sm text-red-600">{errors.content.buttonText.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descri��o *</Label>
                  <Controller
                    name="content.description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Descreva os benef�cios e o que o usu�rio receber�..."
                        maxLength={200}
                        rows={3}
                      />
                    )}
                  />
                  {errors.content?.description && (
                    <p className="text-sm text-red-600">{errors.content.description.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtext">Texto Secund�rio</Label>
                  <Controller
                    name="content.subtext"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Ex: Sem spam, apenas conte�do valioso"
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">URL da Imagem</Label>
                    <Controller
                      name="content.image"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="url"
                          placeholder="https://exemplo.com/imagem.jpg"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">�cone</Label>
                    <Controller
                      name="content.icon"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um �cone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="download">Download</SelectItem>
                            <SelectItem value="mail">Email</SelectItem>
                            <SelectItem value="book">Livro</SelectItem>
                            <SelectItem value="video">V�deo</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Benef�cios (m�ximo 5)</Label>
                  <BenefitsEditor
                    benefits={watchedValues.content.benefits || []}
                    onChange={updateBenefits}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Design Editor */}
          <TabsContent value="design" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Palette className="h-5 w-5 inline mr-2" />
                  Personaliza��o Visual
                </CardTitle>
                <CardDescription>
                  Configure cores, layout e estilo visual do CTA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Controller
                      name="design.theme"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="gradient">Gradiente</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Layout</Label>
                    <Controller
                      name="design.layout"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="horizontal">Horizontal</SelectItem>
                            <SelectItem value="vertical">Vertical</SelectItem>
                            <SelectItem value="modal">Modal</SelectItem>
                            <SelectItem value="inline">Inline</SelectItem>
                            <SelectItem value="sidebar">Sidebar</SelectItem>
                            <SelectItem value="floating">Flutuante</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Estilo do Bot�o</Label>
                    <Controller
                      name="design.buttonStyle"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solid">S�lido</SelectItem>
                            <SelectItem value="outline">Contorno</SelectItem>
                            <SelectItem value="ghost">Fantasma</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Cor Prim�ria</Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="design.primaryColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="color"
                            className="w-12 h-10 rounded border-2"
                          />
                        )}
                      />
                      <Controller
                        name="design.primaryColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="#d400ff"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Cor Secund�ria</Label>
                    <div className="flex items-center gap-2">
                      <Controller
                        name="design.secondaryColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="color"
                            className="w-12 h-10 rounded border-2"
                          />
                        )}
                      />
                      <Controller
                        name="design.secondaryColor"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="#00c4ff"
                            className="flex-1"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Controller
                      name="design.borderRadius"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Nenhum</SelectItem>
                            <SelectItem value="sm">Pequeno</SelectItem>
                            <SelectItem value="md">M�dio</SelectItem>
                            <SelectItem value="lg">Grande</SelectItem>
                            <SelectItem value="xl">Extra Grande</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Sombra
                      <Controller
                        name="design.shadow"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Targeting */}
          <TabsContent value="targeting" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Target className="h-5 w-5 inline mr-2" />
                  Regras de Segmenta��o
                </CardTitle>
                <CardDescription>
                  Configure quando e para quem o CTA ser� exibido
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timing de Exibi��o</Label>
                    <Controller
                      name="targeting.timing"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Imediato</SelectItem>
                            <SelectItem value="scroll">Ap�s Scroll</SelectItem>
                            <SelectItem value="time">Ap�s Tempo</SelectItem>
                            <SelectItem value="exit-intent">Exit Intent</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Controller
                      name="targeting.category"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="Ex: tecnologia, marketing"
                        />
                      )}
                    />
                  </div>
                </div>

                {watchedValues.targeting.timing === 'time' && (
                  <div className="space-y-2">
                    <Label>Delay (segundos)</Label>
                    <Controller
                      name="targeting.timeDelay"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="60"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </div>
                )}

                {watchedValues.targeting.timing === 'scroll' && (
                  <div className="space-y-2">
                    <Label>Porcentagem de Scroll (%)</Label>
                    <Controller
                      name="targeting.scrollPercent"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Segmento de Usu�rio</Label>
                  <Controller
                    name="targeting.segment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Ex: novos-usuarios, retornantes"
                      />
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    CTA Ativo
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </Label>
                  <p className="text-sm text-gray-600">
                    Quando desativado, o CTA n�o ser� exibido no site
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Preview em Tempo Real</CardTitle>
            <CardDescription>
              Visualize como o CTA aparecer� no blog
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[calc(100%-120px)]">
            <CTAPreview config={watchedValues} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Benefits Editor Component
interface BenefitsEditorProps {
  benefits: string[];
  onChange: (benefits: string[]) => void;
}

function BenefitsEditor({ benefits, onChange }: BenefitsEditorProps) {
  const [newBenefit, setNewBenefit] = useState('');

  const addBenefit = () => {
    if (newBenefit.trim() && benefits.length < 5) {
      onChange([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    onChange(benefits.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newBenefit}
          onChange={(e) => setNewBenefit(e.target.value)}
          placeholder="Ex: Acesso vital�cio ao conte�do"
          onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
        />
        <Button
          type="button"
          onClick={addBenefit}
          disabled={!newBenefit.trim() || benefits.length >= 5}
          size="sm"
        >
          Adicionar
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {benefits.map((benefit, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-red-100"
            onClick={() => removeBenefit(index)}
          >
            {benefit} �
          </Badge>
        ))}
      </div>
      
      {benefits.length >= 5 && (
        <p className="text-sm text-orange-600">
          M�ximo de 5 benef�cios atingido
        </p>
      )}
    </div>
  );
}

// CTA Preview Component
interface CTAPreviewProps {
  config: Partial<CTAFormData>;
}

function CTAPreview({ config }: CTAPreviewProps) {
  const typeConfig = CTA_TYPE_OPTIONS.find(option => option.value === config.type);
  const Icon = typeConfig?.icon || Download;

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

  const getButtonStyleClasses = (
    style: string = 'solid',
    primaryColor: string = '#d400ff'
  ) => {
    switch (style) {
      case 'outline':
        return `border-2 bg-transparent text-gray-900 hover:bg-gray-50`;
      case 'ghost':
        return `bg-transparent text-gray-900 hover:bg-gray-100`;
      default:
        return `text-white hover:opacity-90`;
    }
  };

  const getLayoutClasses = (layout: string = 'horizontal') => {
    switch (layout) {
      case 'vertical':
        return 'flex-col text-center';
      case 'modal':
        return 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
      default:
        return 'flex-row items-center';
    }
  };

  return (
    <div className="space-y-4 h-full overflow-auto">
      {/* Desktop Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Desktop</h3>
        <div className="bg-white rounded-lg p-6">
          <div
            className={`flex gap-4 p-6 border transition-all ${getBorderRadiusClass(
              config.design?.borderRadius
            )} ${config.design?.shadow ? 'shadow-lg' : ''} ${getLayoutClasses(
              config.design?.layout
            )}`}
            style={{
              background:
                config.design?.theme === 'gradient'
                  ? `linear-gradient(135deg, ${config.design?.primaryColor || '#d400ff'}, ${
                      config.design?.secondaryColor || '#00c4ff'
                    })`
                  : config.design?.theme === 'dark'
                  ? '#1f2937'
                  : '#ffffff',
              color: config.design?.theme === 'dark' ? '#ffffff' : '#1f2937',
            }}
          >
            {config.content?.image && (
              <div className="flex-shrink-0">
                <img
                  src={config.content.image}
                  alt="CTA"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            )}
            
            {!config.content?.image && (
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-lg ${typeConfig?.color || 'bg-purple-500'} text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">
                {config.content?.title || 'T�tulo do CTA'}
              </h3>
              <p className="text-sm opacity-80">
                {config.content?.description || 'Descri��o do CTA'}
              </p>
              
              {config.content?.benefits && config.content.benefits.length > 0 && (
                <ul className="text-sm space-y-1">
                  {config.content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              )}
              
              <Button
                className={`${getButtonStyleClasses(
                  config.design?.buttonStyle,
                  config.design?.primaryColor
                )} ${getBorderRadiusClass(config.design?.borderRadius)}`}
                style={{
                  backgroundColor:
                    config.design?.buttonStyle === 'solid'
                      ? config.design?.primaryColor || '#d400ff'
                      : 'transparent',
                  borderColor: config.design?.primaryColor || '#d400ff',
                }}
              >
                {config.content?.buttonText || 'Clique Aqui'}
              </Button>
              
              {config.content?.subtext && (
                <p className="text-xs opacity-60 mt-2">
                  {config.content.subtext}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Mobile</h3>
        <div className="max-w-sm mx-auto bg-white rounded-lg p-4">
          <div
            className={`flex flex-col text-center gap-3 p-4 border transition-all ${getBorderRadiusClass(
              config.design?.borderRadius
            )} ${config.design?.shadow ? 'shadow-lg' : ''}`}
            style={{
              background:
                config.design?.theme === 'gradient'
                  ? `linear-gradient(135deg, ${config.design?.primaryColor || '#d400ff'}, ${
                      config.design?.secondaryColor || '#00c4ff'
                    })`
                  : config.design?.theme === 'dark'
                  ? '#1f2937'
                  : '#ffffff',
              color: config.design?.theme === 'dark' ? '#ffffff' : '#1f2937',
            }}
          >
            {config.content?.image && (
              <img
                src={config.content.image}
                alt="CTA"
                className="w-12 h-12 rounded-lg object-cover mx-auto"
              />
            )}
            
            {!config.content?.image && (
              <div className={`p-2 rounded-lg ${typeConfig?.color || 'bg-purple-500'} text-white w-fit mx-auto`}>
                <Icon className="h-5 w-5" />
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-base font-semibold">
                {config.content?.title || 'T�tulo do CTA'}
              </h3>
              <p className="text-sm opacity-80">
                {config.content?.description || 'Descri��o do CTA'}
              </p>
              
              <Button
                size="sm"
                className={`w-full ${getButtonStyleClasses(
                  config.design?.buttonStyle,
                  config.design?.primaryColor
                )} ${getBorderRadiusClass(config.design?.borderRadius)}`}
                style={{
                  backgroundColor:
                    config.design?.buttonStyle === 'solid'
                      ? config.design?.primaryColor || '#d400ff'
                      : 'transparent',
                  borderColor: config.design?.primaryColor || '#d400ff',
                }}
              >
                {config.content?.buttonText || 'Clique Aqui'}
              </Button>
              
              {config.content?.subtext && (
                <p className="text-xs opacity-60">
                  {config.content.subtext}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="text-sm font-semibold mb-3 text-gray-700">Configura��o</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tipo:</span>
            <Badge variant="outline">{typeConfig?.label || 'Lead Magnet'}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Layout:</span>
            <Badge variant="outline">{config.design?.layout || 'horizontal'}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Timing:</span>
            <Badge variant="outline">{config.targeting?.timing || 'immediate'}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <Badge variant={config.isActive ? 'default' : 'secondary'}>
              {config.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CTACustomizer;