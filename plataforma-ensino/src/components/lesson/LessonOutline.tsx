'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target,
  List,
  Eye,
  ChevronRight,
  Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ContentAnalyzer from './ContentAnalyzer'

interface LessonOutlineProps {
  content: string
  onSectionClick?: (sectionId: string) => void
  completedSections?: string[]
  className?: string
}

interface OutlineSection {
  title: string
  subsections: string[]
}

export const LessonOutline: React.FC<LessonOutlineProps> = ({
  content,
  onSectionClick,
  completedSections = [],
  className
}) => {
  const [outline, setOutline] = useState<OutlineSection[]>([])
  const [keyTopics, setKeyTopics] = useState<string[]>([])
  const [totalSections, setTotalSections] = useState(0)
  const [expandedSections, setExpandedSections] = useState<number[]>([0])

  useEffect(() => {
    // Parse content and generate outline
    const sections = ContentAnalyzer.parseContent(content)
    const generatedOutline = ContentAnalyzer.generateContentOutline(sections)
    const topics = ContentAnalyzer.extractKeyTopics(content)
    
    setOutline(generatedOutline)
    setKeyTopics(topics)
    setTotalSections(sections.length)
  }, [content])

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleSectionClick = (sectionTitle: string, index: number) => {
    const sectionId = `section-${index + 1}`
    onSectionClick?.(sectionId)
  }

  const completionPercentage = totalSections > 0 
    ? Math.round((completedSections.length / totalSections) * 100) 
    : 0

  return (
    <Card className={cn("border-primary/20 bg-gradient-to-br from-background to-background/95", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <List className="w-5 h-5" />
              Estrutura da Aula
            </CardTitle>
            <CardDescription className="mt-1">
              Navegue pelos tópicos principais
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {completionPercentage}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{totalSections}</div>
            <div className="text-xs text-muted-foreground">Seções</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">{keyTopics.length}</div>
            <div className="text-xs text-muted-foreground">Tópicos</div>
          </div>
        </div>

        {/* Key Topics */}
        {keyTopics.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Tópicos Principais
            </h4>
            <div className="flex flex-wrap gap-2">
              {keyTopics.slice(0, 6).map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs py-1 px-2 cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => {
                    // Scroll to topic in content
                    const element = document.querySelector(`[data-topic="${topic}"]`)
                    element?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {topic.length > 25 ? `${topic.slice(0, 25)}...` : topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Outline Navigation */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Navegação por Seções
          </h4>
          
          <div className="space-y-2">
            {outline.map((section, index) => {
              const isExpanded = expandedSections.includes(index)
              const isCompleted = completedSections.includes(`section-${index + 1}`)
              
              return (
                <div 
                  key={index}
                  className={cn(
                    "border rounded-lg overflow-hidden transition-all duration-200",
                    isCompleted 
                      ? "border-success/30 bg-success/5" 
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between p-3 h-auto text-left",
                      isCompleted && "text-success"
                    )}
                    onClick={() => {
                      toggleSection(index)
                      handleSectionClick(section.title, index)
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                        isCompleted 
                          ? "bg-success text-success-foreground" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <span className="font-medium truncate">
                        {section.title}
                      </span>
                    </div>
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 transition-transform",
                        isExpanded && "rotate-90"
                      )} 
                    />
                  </Button>
                  
                  {isExpanded && section.subsections.length > 0 && (
                    <div className="px-3 pb-3">
                      <div className="ml-8 space-y-1">
                        {section.subsections.map((subsection, subIndex) => (
                          <div
                            key={subIndex}
                            className="text-sm text-muted-foreground py-1 px-2 rounded cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => {
                              // Scroll to subsection
                              const element = document.querySelector(`[data-subsection="${subsection}"]`)
                              element?.scrollIntoView({ behavior: 'smooth' })
                            }}
                          >
                            " {subsection}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Reading Progress */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso de Leitura</span>
            <span className="text-sm text-muted-foreground">
              {completedSections.length}/{totalSections}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              // Scroll to top of content
              document.querySelector('#enhanced-lesson-content')?.scrollIntoView({ 
                behavior: 'smooth' 
              })
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            Ir para o Topo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              // Mark all as read
              if (onSectionClick) {
                for (let i = 0; i < totalSections; i++) {
                  onSectionClick(`section-${i + 1}`)
                }
              }
            }}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Marcar Lidas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LessonOutline