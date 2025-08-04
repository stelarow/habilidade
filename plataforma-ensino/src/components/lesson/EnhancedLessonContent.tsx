'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Type,
  Sun,
  Moon,
  Contrast
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContentSection {
  id: string
  title: string
  type: 'overview' | 'objectives' | 'content' | 'summary' | 'resources'
  content: string
  estimatedTime?: number
  priority?: 'high' | 'medium' | 'low'
  isCompleted?: boolean
}

interface ReadingPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'xl'
  contrast: 'normal' | 'high' | 'dark'
  lineHeight: 'compact' | 'normal' | 'relaxed'
  showReadingTime: boolean
}

interface EnhancedLessonContentProps {
  content: string
  title?: string
  description?: string
  estimatedReadingTime?: number
  onProgressUpdate?: (progress: number) => void
  className?: string
}

export const EnhancedLessonContent: React.FC<EnhancedLessonContentProps> = ({
  content,
  title = "Conteúdo da Aula",
  description = "Material de estudo e conceitos fundamentais",
  estimatedReadingTime = 15,
  onProgressUpdate,
  className
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['content'])
  const [completedSections, setCompletedSections] = useState<string[]>([])
  const [readingPreferences, setReadingPreferences] = useState<ReadingPreferences>({
    fontSize: 'medium',
    contrast: 'normal',
    lineHeight: 'normal',
    showReadingTime: true
  })
  const [isReadingMode, setIsReadingMode] = useState(false)
  const [viewType, setViewType] = useState<'structured' | 'reading' | 'outline'>('structured')
  const contentRef = useRef<HTMLDivElement>(null)

  // Parse content into structured sections (simplified parsing)
  const parsedSections: ContentSection[] = React.useMemo(() => {
    const sections: ContentSection[] = []
    
    // Main content section
    sections.push({
      id: 'content',
      title: 'Conteúdo Principal',
      type: 'content',
      content: content,
      estimatedTime: estimatedReadingTime,
      priority: 'high'
    })

    return sections
  }, [content, estimatedReadingTime])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const markSectionCompleted = (sectionId: string) => {
    setCompletedSections(prev => {
      const newCompleted = prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
      
      const progress = newCompleted.length / parsedSections.length
      onProgressUpdate?.(progress)
      
      return newCompleted
    })
  }

  const getFontSizeClass = () => {
    const sizes = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      xl: 'text-xl'
    }
    return sizes[readingPreferences.fontSize]
  }

  const getLineHeightClass = () => {
    const heights = {
      compact: 'leading-snug',
      normal: 'leading-normal',
      relaxed: 'leading-relaxed'
    }
    return heights[readingPreferences.lineHeight]
  }

  const getContrastClass = () => {
    const contrasts = {
      normal: 'lesson-content-enhanced',
      high: 'lesson-content-enhanced contrast-more',
      dark: 'lesson-content-enhanced dark'
    }
    return contrasts[readingPreferences.contrast]
  }

  const getSectionIcon = (type: ContentSection['type']) => {
    const icons = {
      overview: <BookOpen className="w-4 h-4" />,
      objectives: <Target className="w-4 h-4" />,
      content: <BookOpen className="w-4 h-4" />,
      summary: <CheckCircle className="w-4 h-4" />,
      resources: <Lightbulb className="w-4 h-4" />
    }
    return icons[type]
  }

  const getPriorityBadge = (priority?: ContentSection['priority']) => {
    if (!priority) return null
    
    const variants = {
      high: { variant: 'destructive' as const, text: 'Essencial' },
      medium: { variant: 'default' as const, text: 'Importante' },
      low: { variant: 'secondary' as const, text: 'Complementar' }
    }
    
    const config = variants[priority]
    return <Badge variant={config.variant} className="ml-2">{config.text}</Badge>
  }

  if (viewType === 'reading') {
    return (
      <Card className={cn("border-primary/20 bg-gradient-to-br from-background to-background/95", className)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl gradient-text">{title}</CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {readingPreferences.showReadingTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {estimatedReadingTime} min
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewType('structured')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Estruturado
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div 
            ref={contentRef}
            className={cn(
              'prose prose-slate dark:prose-invert prose-violet max-w-none',
              getContrastClass(),
              getFontSizeClass(),
              getLineHeightClass()
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)} id="enhanced-lesson-content">
      {/* Content Header with Controls */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-background/95">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl gradient-text flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {title}
              </CardTitle>
              <CardDescription className="mt-2">{description}</CardDescription>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {readingPreferences.showReadingTime && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {estimatedReadingTime} min
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReadingMode(!isReadingMode)}
              >
                <Eye className="w-4 h-4 mr-1" />
                {isReadingMode ? 'Estruturado' : 'Leitura'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card className="border-success/20 bg-success/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Progresso de Leitura</h3>
                <p className="text-sm text-muted-foreground">
                  {completedSections.length} de {parsedSections.length} seções concluídas
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">
                {Math.round((completedSections.length / parsedSections.length) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Completo</div>
            </div>
          </div>
          
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div 
              className="bg-success h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSections.length / parsedSections.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Sections */}
      <div className="space-y-4">
        {parsedSections.map((section) => (
          <Card 
            key={section.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-lg",
              completedSections.includes(section.id) 
                ? "border-success/30 bg-success/5" 
                : "border-border hover:border-primary/30"
            )}
          >
            <CardHeader 
              className="cursor-pointer select-none"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    completedSections.includes(section.id)
                      ? "bg-success text-success-foreground"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {getSectionIcon(section.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {section.title}
                      {getPriorityBadge(section.priority)}
                    </CardTitle>
                    {section.estimatedTime && (
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {section.estimatedTime} min de leitura
                      </CardDescription>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      markSectionCompleted(section.id)
                    }}
                    className={cn(
                      "transition-colors",
                      completedSections.includes(section.id)
                        ? "text-success hover:text-success/80"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                  
                  {expandedSections.includes(section.id) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedSections.includes(section.id) && (
              <>
                <Separator />
                <CardContent className="p-6">
                  <div 
                    className={cn(
                      'prose prose-slate dark:prose-invert prose-violet max-w-none',
                      getContrastClass(),
                      getFontSizeClass(),
                      getLineHeightClass()
                    )}
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Reading Preferences Panel */}
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Type className="w-5 h-5" />
            Preferências de Leitura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tamanho da Fonte</label>
              <div className="flex gap-1">
                {(['small', 'medium', 'large', 'xl'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={readingPreferences.fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReadingPreferences(prev => ({ ...prev, fontSize: size }))}
                    className="text-xs"
                  >
                    {size === 'small' ? 'P' : size === 'medium' ? 'M' : size === 'large' ? 'G' : 'XG'}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Contraste</label>
              <div className="flex gap-1">
                {(['normal', 'high', 'dark'] as const).map((contrast) => (
                  <Button
                    key={contrast}
                    variant={readingPreferences.contrast === contrast ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReadingPreferences(prev => ({ ...prev, contrast }))}
                    className="text-xs"
                  >
                    {contrast === 'normal' ? <Sun className="w-3 h-3" /> : 
                     contrast === 'high' ? <Contrast className="w-3 h-3" /> : 
                     <Moon className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Espaçamento</label>
              <div className="flex gap-1">
                {(['compact', 'normal', 'relaxed'] as const).map((height) => (
                  <Button
                    key={height}
                    variant={readingPreferences.lineHeight === height ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReadingPreferences(prev => ({ ...prev, lineHeight: height }))}
                    className="text-xs"
                  >
                    {height === 'compact' ? 'C' : height === 'normal' ? 'N' : 'R'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EnhancedLessonContent