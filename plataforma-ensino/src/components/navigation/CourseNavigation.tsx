'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Course, Lesson, Progress, Enrollment } from '@/types'
import { formatDuration } from '@/lib/utils'
import { 
  List, 
  Play, 
  CheckCircle, 
  Clock, 
  Lock,
  CaretDown,
  CaretRight,
  BookOpen,
  Medal
} from 'phosphor-react'

interface CourseNavigationProps {
  course: Course
  lessons: Lesson[]
  currentLessonId?: string
  userProgress: Record<string, Progress>
  enrollment: Enrollment
  onLessonSelect: (lesson: Lesson) => void
  className?: string
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  totalDuration: number
  completedCount: number
}

export default function CourseNavigation({
  course,
  lessons,
  currentLessonId,
  userProgress,
  enrollment,
  onLessonSelect,
  className = ''
}: CourseNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['module-1']))
  const [showCompleted, setShowCompleted] = useState(true)
  
  // Group lessons into modules (for now, we'll create artificial modules)
  const modules: Module[] = React.useMemo(() => {
    const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)
    const moduleSize = Math.ceil(sortedLessons.length / Math.max(1, Math.ceil(sortedLessons.length / 10)))
    
    const modules: Module[] = []
    for (let i = 0; i < sortedLessons.length; i += moduleSize) {
      const moduleLessons = sortedLessons.slice(i, i + moduleSize)
      const moduleNumber = Math.floor(i / moduleSize) + 1
      
      modules.push({
        id: `module-${moduleNumber}`,
        title: `Módulo ${moduleNumber}`,
        lessons: moduleLessons,
        totalDuration: moduleLessons.reduce((total, lesson) => total + lesson.video_duration, 0),
        completedCount: moduleLessons.filter(lesson => userProgress[lesson.id]?.completed).length
      })
    }
    
    return modules
  }, [lessons, userProgress])

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const getLessonStatus = (lesson: Lesson) => {
    const progress = userProgress[lesson.id]
    if (progress?.completed) return 'completed'
    if (progress?.last_position > 0) return 'in_progress'
    return 'not_started'
  }

  const getLessonIcon = (lesson: Lesson) => {
    const status = getLessonStatus(lesson)
    
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" weight="fill" />
      case 'in_progress':
        return <Play className="w-4 h-4 text-primary" weight="fill" />
      default:
        return lesson.is_preview ? 
          <Play className="w-4 h-4 text-white/60" /> :
          <Lock className="w-4 h-4 text-white/40" />
    }
  }

  const isLessonAccessible = (lesson: Lesson, lessonIndex: number) => {
    // Preview lessons are always accessible
    if (lesson.is_preview) return true
    
    // First lesson is always accessible
    if (lessonIndex === 0) return true
    
    // Check if previous lesson is completed
    const previousLesson = lessons.find(l => l.order_index === lesson.order_index - 1)
    if (previousLesson) {
      return userProgress[previousLesson.id]?.completed || false
    }
    
    return true
  }

  const getProgressPercentage = (lesson: Lesson) => {
    const progress = userProgress[lesson.id]
    if (!progress) return 0
    if (progress.completed) return 100
    return Math.round((progress.last_position / lesson.video_duration) * 100)
  }

  const totalCompletedLessons = lessons.filter(lesson => userProgress[lesson.id]?.completed).length
  const overallProgress = lessons.length > 0 ? Math.round((totalCompletedLessons / lessons.length) * 100) : 0

  return (
    <div className={`bg-zinc-900/50 backdrop-blur-md border border-gray-800/50 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{course.title}</h3>
            <p className="text-sm text-gray-400">{lessons.length} aulas</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progresso do curso</span>
            <span className="text-white">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{totalCompletedLessons} de {lessons.length} concluídas</span>
            <span>{formatDuration(course.duration_minutes * 60)}</span>
          </div>
        </div>

        {/* Course completion badge */}
        {overallProgress === 100 && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
            <Medal className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">Curso Concluído!</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            {showCompleted ? 'Ocultar concluídas' : 'Mostrar concluídas'}
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <List className="w-4 h-4" />
            <span>{modules.length} módulos</span>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="max-h-[60vh] overflow-y-auto">
        {modules.map((module) => {
          const isExpanded = expandedModules.has(module.id)
          const moduleProgress = module.lessons.length > 0 
            ? Math.round((module.completedCount / module.lessons.length) * 100) 
            : 0

          return (
            <div key={module.id} className="border-b border-gray-800/50 last:border-b-0">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? 
                    <CaretDown className="w-4 h-4 text-gray-400" /> : 
                    <CaretRight className="w-4 h-4 text-gray-400" />
                  }
                  <div className="text-left">
                    <h4 className="font-medium text-white">{module.title}</h4>
                    <p className="text-sm text-gray-400">
                      {module.completedCount} de {module.lessons.length} • {formatDuration(module.totalDuration)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-gray-700 rounded-full">
                    <div
                      className="h-1 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8">{moduleProgress}%</span>
                </div>
              </button>

              {/* Module Lessons */}
              {isExpanded && (
                <div className="pb-2">
                  {module.lessons.map((lesson, index) => {
                    const isAccessible = isLessonAccessible(lesson, lesson.order_index - 1)
                    const isCurrent = lesson.id === currentLessonId
                    const status = getLessonStatus(lesson)
                    const progressPercentage = getProgressPercentage(lesson)
                    
                    // Hide completed lessons if showCompleted is false
                    if (!showCompleted && status === 'completed') {
                      return null
                    }

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => isAccessible && onLessonSelect(lesson)}
                        disabled={!isAccessible}
                        className={`w-full p-3 pl-12 flex items-center gap-3 hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          isCurrent ? 'bg-primary/10 border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {getLessonIcon(lesson)}
                        </div>
                        
                        <div className="flex-1 text-left">
                          <h5 className={`text-sm font-medium ${
                            isCurrent ? 'text-primary' : 'text-white'
                          }`}>
                            {lesson.title}
                          </h5>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {formatDuration(lesson.video_duration)}
                            </span>
                            
                            {lesson.is_preview && (
                              <span className="text-xs bg-secondary/20 text-secondary px-1.5 py-0.5 rounded">
                                Preview
                              </span>
                            )}
                            
                            {status === 'in_progress' && (
                              <span className="text-xs text-primary">
                                {progressPercentage}%
                              </span>
                            )}
                          </div>
                          
                          {status === 'in_progress' && (
                            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                              <div
                                className="bg-primary h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Course Footer */}
      <div className="p-4 border-t border-gray-800/50">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Última atualização: {new Date(course.updated_at).toLocaleDateString('pt-BR')}
          </p>
          
          {enrollment.status === 'active' && overallProgress < 100 && (
            <p className="text-xs text-gray-400">
              Continue assistindo para desbloquear seu certificado!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}