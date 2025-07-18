'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Home, 
  LogOut, 
  Clock,
  FileText,
  Camera,
  Trophy
} from 'lucide-react'
import { LessonProgressData } from '@/types/lesson'

interface LessonHeaderRedesignedProps {
  course: { 
    title: string
    slug: string 
  }
  lesson: { 
    title: string
    slug: string 
  }
  progressData: LessonProgressData | null
  onExit: () => void
}

const LessonHeaderRedesigned: React.FC<LessonHeaderRedesignedProps> = ({
  progressData,
  onExit
}) => {
  // Map progress data to UI elements
  const videoProgress = progressData?.videoProgress?.percentageWatched || 0
  const pdfProgress = progressData?.pdfProgress?.percentageRead || 0
  const exerciseProgress = progressData?.exerciseProgress?.completionPercentage || 0
  const quizProgress = progressData?.quizProgress?.score || 0
  const quizCompleted = progressData?.quizProgress?.isCompleted || false

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e navegação */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Logo da Escola Habilidade */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="gradient-bg text-white w-8 h-8 rounded flex items-center justify-center font-bold text-lg">
                H
              </div>
              <span className="text-sm md:text-base font-bold gradient-text whitespace-nowrap">
                Escola Habilidade
              </span>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-header-foreground hover:bg-white/10 transition-colors duration-200"
                aria-label="Ir para página inicial"
              >
                <Home className="h-5 w-5 mr-2" />
                Início
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                onClick={onExit}
                aria-label="Sair da aula atual"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sair da Aula
              </Button>
            </div>
          </div>

          {/* Botões mobile */}
          <div className="flex sm:hidden items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-header-foreground hover:bg-white/10 p-2 transition-colors duration-200"
              aria-label="Ir para página inicial"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground p-2 transition-all duration-200"
              onClick={onExit}
              aria-label="Sair da aula atual"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* Progresso - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-2" role="progressbar" aria-label={`Progresso do vídeo: ${videoProgress.toFixed(0)}%`}>
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Vídeo: {videoProgress.toFixed(0)}%</span>
              <Progress value={videoProgress} className="w-20" />
            </div>
            
            <div className="flex items-center gap-2" role="progressbar" aria-label={`Progresso da apostila: ${pdfProgress.toFixed(0)}%`}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Apostila: {pdfProgress.toFixed(0)}%</span>
              <Progress value={pdfProgress} className="w-20" />
            </div>
            
            <div className="flex items-center gap-2" role="progressbar" aria-label={`Progresso dos exercícios: ${exerciseProgress.toFixed(0)}%`}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">Exercícios: {exerciseProgress.toFixed(0)}%</span>
              <Progress value={exerciseProgress} className="w-20" />
            </div>
            
            <div className="flex items-center gap-2" role="progressbar" aria-label={`Progresso do quiz: ${quizCompleted ? `${quizProgress.toFixed(0)}%` : "Pendente"}`}>
              <Trophy className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">
                Quiz: {quizCompleted ? `${quizProgress.toFixed(0)}%` : "Pendente"}
              </span>
              <Progress value={quizCompleted ? quizProgress : 0} className="w-20" />
            </div>
          </div>
        </div>
        
        {/* Progresso - Mobile (segunda linha) */}
        <div className="lg:hidden mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 min-h-[32px]" role="progressbar" aria-label={`Progresso do vídeo: ${videoProgress.toFixed(0)}%`}>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm truncate">Vídeo: {videoProgress.toFixed(0)}%</span>
            <Progress value={videoProgress} className="w-8 sm:w-12 h-2" />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 min-h-[32px]" role="progressbar" aria-label={`Progresso da apostila: ${pdfProgress.toFixed(0)}%`}>
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm truncate">Apostila: {pdfProgress.toFixed(0)}%</span>
            <Progress value={pdfProgress} className="w-8 sm:w-12 h-2" />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 min-h-[32px]" role="progressbar" aria-label={`Progresso dos exercícios: ${exerciseProgress.toFixed(0)}%`}>
            <Camera className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm truncate">Exercícios: {exerciseProgress.toFixed(0)}%</span>
            <Progress value={exerciseProgress} className="w-8 sm:w-12 h-2" />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 min-h-[32px]" role="progressbar" aria-label={`Progresso do quiz: ${quizCompleted ? `${quizProgress.toFixed(0)}%` : "Pendente"}`}>
            <Trophy className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm truncate">
              Quiz: {quizCompleted ? `${quizProgress.toFixed(0)}%` : "Pendente"}
            </span>
            <Progress value={quizCompleted ? quizProgress : 0} className="w-8 sm:w-12 h-2" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default LessonHeaderRedesigned