'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { LogoH } from '@/components/ui'
import { 
  Home, 
  LogOut
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
  course,
  lesson,
  progressData,
  onExit
}) => {
  // Simplified header - no progress indicators needed

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e navegação */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Logo da Escola Habilidade - Consistent with main site */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <LogoH 
                size="small"
                animated={true}
                showFullText={true}
                className="transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>
          
          {/* Navigation Actions - Enhanced */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-header-foreground hover:bg-white/10 hover:scale-105 transition-all duration-200 px-3 py-2"
              aria-label="Ir para página inicial"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
              <span className="hidden sm:inline">Início</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg transition-all duration-200 px-3 py-2"
              onClick={onExit}
              aria-label="Sair da aula atual"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
              <span className="hidden sm:inline">Sair da Aula</span>
            </Button>
          </div>

        </div>
      </div>
    </header>
  )
}

export default LessonHeaderRedesigned