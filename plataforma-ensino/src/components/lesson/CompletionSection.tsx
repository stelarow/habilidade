'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, Trophy, Clock, FileText, Clipboard, Brain } from 'lucide-react'
import type { LessonProgressData } from '@/types/lesson'
import { useCompletionCriteria } from '@/hooks/useCompletionCriteria'

interface CompletionSectionProps {
  title?: string
  progressData: LessonProgressData | null
  minimumQuizScore?: number
  minimumPDFPercentage?: number
  onComplete?: () => Promise<void>
  isCompleting?: boolean
  completionError?: string | null
  canComplete?: boolean
  onProgressUpdate?: (progress: number) => void
}

const CompletionSection: React.FC<CompletionSectionProps> = ({
  title = "Conclusão da Aula",
  progressData,
  minimumQuizScore = 70,
  minimumPDFPercentage = 75,
  onComplete,
  isCompleting: externalIsCompleting,
  completionError,
  canComplete: externalCanComplete,
  onProgressUpdate
}) => {
  const [localIsCompleting, setLocalIsCompleting] = useState(false)
  
  // Use external completion state if provided, otherwise use local state
  const isCompleting = externalIsCompleting !== undefined ? externalIsCompleting : localIsCompleting

  const {
    criteria,
    overallProgress,
    canComplete: localCanComplete,
    completedCount,
    totalCount,
    updateProgress
  } = useCompletionCriteria({
    minimumQuizScore,
    minimumPDFPercentage,
    onCriteriaUpdated: (state) => {
      if (onProgressUpdate) {
        onProgressUpdate(state.overallProgress)
      }
    }
  })

  // Use external canComplete state if provided, otherwise use local state
  const canComplete = externalCanComplete !== undefined ? externalCanComplete : localCanComplete

  // Update progress data when it changes
  useEffect(() => {
    if (progressData) {
      updateProgress(progressData)
    }
  }, [progressData, updateProgress])

  const handleComplete = async () => {
    if (!canComplete || isCompleting) return

    // Only set local state if we're not using external state
    if (externalIsCompleting === undefined) {
      setLocalIsCompleting(true)
    }
    
    try {
      if (onComplete) {
        await onComplete()
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
    } finally {
      // Only set local state if we're not using external state
      if (externalIsCompleting === undefined) {
        setLocalIsCompleting(false)
      }
    }
  }

  // Get icon for criterion type
  const getCriterionIcon = (id: string, isCompleted: boolean) => {
    const iconClass = `h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-muted-foreground'}`
    
    switch (id) {
      case 'pdf':
        return <FileText className={iconClass} />
      case 'exercises':
        return <Clipboard className={iconClass} />
      case 'quiz':
        return <Brain className={iconClass} />
      default:
        return <CheckCircle className={iconClass} />
    }
  }

  // Get criterion description
  const getCriterionDescription = (criterion: any) => {
    switch (criterion.id) {
      case 'quiz':
        return `Obter pelo menos ${minimumQuizScore}% no quiz (${Math.round(criterion.progress)}%)`
      case 'exercises':
        return `Completar todos os exercícios (${Math.round(criterion.progress)}%)`
      case 'pdf':
        return `Ler pelo menos ${minimumPDFPercentage}% do material PDF (${Math.round(criterion.progress)}%)`
      default:
        return criterion.description
    }
  }

  return (
    <Card className="p-6 border-border/50">
      <h3 className="text-xl font-bold mb-4 gradient-text">Finalizar Aula</h3>
      
      <div className="space-y-4">
        {!canComplete && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <h4 className="font-semibold text-warning-foreground mb-2">
              Critérios pendentes para conclusão:
            </h4>
            <ul className="space-y-1">
              {criteria
                .filter((criterion: any) => !criterion.isCompleted && criterion.id === 'quiz')
                .map((criterion) => (
                  <li key={criterion.id} className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-destructive" />
                    {getCriterionDescription(criterion)}
                  </li>
                ))}
            </ul>
          </div>
        )}
        
        {canComplete && (
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-success-foreground">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-semibold">
                Todos os critérios foram atendidos! Você pode concluir a aula.
              </span>
            </div>
          </div>
        )}
        
        <Button 
          disabled={!canComplete}
          size="lg"
          className={`w-full ${canComplete ? "gradient-button" : ""}`}
          onClick={handleComplete}
        >
          {canComplete ? "Concluir Aula" : "Critérios não atendidos"}
        </Button>
      </div>
    </Card>
  )
}

export default CompletionSection