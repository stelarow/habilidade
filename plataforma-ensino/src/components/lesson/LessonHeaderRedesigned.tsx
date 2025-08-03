'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogoH } from '@/components/ui'
import { 
  Home, 
  LogOut,
  Play,
  FileText,
  PenTool,
  Trophy,
  Menu,
  ChevronDown
} from 'lucide-react'
import type { LessonProgressData } from '@/types/lesson'

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
  // Dynamic navigation data
  videoUrl?: string
  materials?: any[]
  exercises?: any[]
  quizzes?: any[]
}

const LessonHeaderRedesigned: React.FC<LessonHeaderRedesignedProps> = ({
  course,
  lesson,
  progressData,
  onExit,
  videoUrl,
  materials = [],
  exercises = [],
  quizzes = []
}) => {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)

  // Count available lesson sections for mobile dropdown
  const availableSections = [
    videoUrl && { id: 'video-section', label: 'Vídeo', icon: Play },
    materials.some((m: any) => m.type === 'pdf') && { id: 'pdf-section', label: 'Material', icon: FileText },
    exercises.length > 0 && { id: 'exercises-section', label: 'Exercícios', icon: PenTool },
    quizzes.length > 0 && { id: 'quiz-section', label: 'Quiz', icon: Trophy }
  ].filter(Boolean)

  // Handle dashboard navigation
  const handleDashboardClick = async () => {
    console.log('Dashboard button clicked')
    console.log('Current URL before navigation:', window.location.href)
    setIsNavigating(true)
    try {
      console.log('Attempting to navigate to /dashboard')
      await router.push('/dashboard')
      console.log('Navigation to dashboard completed')
      
      // Force page reload as fallback
      setTimeout(() => {
        console.log('Current URL after navigation:', window.location.href)
        if (window.location.pathname !== '/dashboard') {
          console.log('URL did not change, forcing reload...')
          window.location.href = '/dashboard'
        }
      }, 100)
    } catch (error) {
      console.error('Dashboard navigation error:', error)
    } finally {
      setIsNavigating(false)
      console.log('Dashboard navigation finished (loading state cleared)')
    }
  }

  // Handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }

  // Enhanced exit handler with debugging and fallback
  const handleExitLesson = async () => {
    console.log('Exit button clicked - calling onExit callback')
    
    try {
      // First try the onExit callback
      if (onExit) {
        await onExit()
        console.log('onExit callback completed')
      } else if (course?.slug) {
        // Fallback: direct navigation to course
        console.log('Fallback: navigating to course', course.slug)
        await router.push(`/course/${course.slug}`)
      } else {
        // Final fallback: navigate to dashboard
        console.log('Final fallback: navigating to dashboard')
        await router.push('/dashboard')
      }
    } catch (error) {
      console.error('Exit navigation error:', error)
      // Ultimate fallback: try dashboard
      try {
        await router.push('/dashboard')
      } catch (fallbackError) {
        console.error('Dashboard fallback failed:', fallbackError)
      }
    }
  }

  // Handle section navigation with smooth scroll
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // Close mobile nav when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileNav && !(event.target as Element).closest('.relative')) {
        setShowMobileNav(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMobileNav])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-header-bg text-header-foreground shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo - Consistent with main site */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link 
              href="https://www.escolahabilidade.com"
              target="_blank"
              rel="noopener noreferrer"
              className="logo-container group flex items-center gap-3 focus:outline-none"
            >
              <div className="logo-wrapper relative">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-lg opacity-0 group-hover:opacity-20 group-focus:opacity-20 transition-opacity duration-300 transform scale-110" />
                <LogoH 
                  size="small"
                  animated={true}
                  showFullText={true}
                  className="relative transition-all duration-300 group-hover:scale-105 group-focus:scale-105"
                />
              </div>
            </Link>
            
            {/* Plataforma de Ensino Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDashboardClick}
              disabled={isNavigating}
              className="hidden lg:flex text-header-foreground hover:bg-white/10 transition-all duration-200 px-3 py-1"
              aria-label="Ir para o dashboard"
            >
              <span className="text-xs text-gray-400 hover:text-gray-300">
                {isNavigating ? 'Carregando...' : 'Plataforma de Ensino'}
              </span>
            </Button>
          </div>
          
          {/* Dynamic Lesson Navigation */}
          <div className="flex items-center gap-2">
            {/* Mobile Lesson Navigation Dropdown */}
            {availableSections.length > 0 && (
              <div className="relative md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileNav(!showMobileNav)}
                  className="text-header-foreground hover:bg-violet-500/10 transition-all duration-200 px-2 py-1"
                  aria-label="Menu de navegação da aula"
                >
                  <Menu className="h-4 w-4" />
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showMobileNav ? 'rotate-180' : ''}`} />
                </Button>
                
                {showMobileNav && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-violet-200/20 dark:border-violet-800/30 rounded-md shadow-lg shadow-violet-500/10 z-50">
                    {availableSections.map((section: any) => {
                      const IconComponent = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            scrollToSection(section.id)
                            setShowMobileNav(false)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors text-left"
                        >
                          <IconComponent className="h-4 w-4" />
                          {section.label}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Desktop Lesson Content Quick Access */}
            <div className="hidden md:flex items-center gap-1 mr-3">
              {videoUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('video-section')}
                  className="text-header-foreground hover:bg-violet-500/10 transition-all duration-200 px-2 py-1"
                  title="Ir para o vídeo"
                >
                  <Play className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden lg:inline">Vídeo</span>
                </Button>
              )}
              
              {materials.some((m: any) => m.type === 'pdf') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('pdf-section')}
                  className="text-header-foreground hover:bg-violet-500/10 transition-all duration-200 px-2 py-1"
                  title="Ir para o material"
                >
                  <FileText className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden lg:inline">PDF</span>
                </Button>
              )}
              
              {exercises.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('exercises-section')}
                  className="text-header-foreground hover:bg-violet-500/10 transition-all duration-200 px-2 py-1"
                  title="Ir para os exercícios"
                >
                  <PenTool className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden lg:inline">Exercícios</span>
                </Button>
              )}
              
              {quizzes.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection('quiz-section')}
                  className="text-header-foreground hover:bg-violet-500/10 transition-all duration-200 px-2 py-1"
                  title="Ir para o quiz"
                >
                  <Trophy className="h-4 w-4" />
                  <span className="ml-1 text-xs hidden lg:inline">Quiz</span>
                </Button>
              )}
            </div>

            {/* Main Navigation Actions */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleScrollToTop}
              className="text-header-foreground hover:bg-white/10 hover:scale-105 transition-all duration-200 px-3 py-2"
              aria-label="Rolar para o topo da página"
            >
              <Home className="h-4 w-4 sm:h-5 sm:w-5 sm:mr-2" />
              <span className="hidden sm:inline">Início</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="border-violet-500 text-violet-600 hover:bg-violet-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-200 px-3 py-2 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-500"
              onClick={handleExitLesson}
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