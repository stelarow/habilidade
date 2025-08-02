'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Menu, 
  X, 
  Play,
  CheckCircle,
  Circle,
  Lock,
  BookOpen,
  FileText,
  Video,
  HelpCircle
} from 'lucide-react'

/**
 * Interface definitions for course structure and navigation
 */
export interface Lesson {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration?: string
  isCompleted: boolean
  isLocked: boolean
}

export interface Module {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
  progress: number // 0-100
  isCompleted: boolean
  estimatedTime?: string
}

export interface CourseProgress {
  totalLessons: number
  completedLessons: number
  currentStreak: number
  totalTimeSpent: string
}

export interface SidebarNavigationProps {
  courseStructure: Module[]
  currentLesson: string
  progress: CourseProgress
  isCollapsed: boolean
  onToggleCollapse: () => void
  onLessonSelect: (lessonId: string) => void
  className?: string
}

/**
 * Get appropriate icon for lesson type
 */
const getLessonIcon = (type: Lesson['type'], isCompleted: boolean, isLocked: boolean) => {
  if (isLocked) return <Lock className="h-4 w-4 text-muted-foreground" />
  if (isCompleted) return <CheckCircle className="h-4 w-4 text-success" />

  switch (type) {
    case 'video':
      return <Video className="h-4 w-4 text-primary" />
    case 'text':
      return <FileText className="h-4 w-4 text-primary" />
    case 'quiz':
      return <HelpCircle className="h-4 w-4 text-primary" />
    case 'assignment':
      return <BookOpen className="h-4 w-4 text-primary" />
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />
  }
}

/**
 * Individual lesson item component
 */
const LessonItem: React.FC<{
  lesson: Lesson
  isCurrent: boolean
  onSelect: (lessonId: string) => void
  isCollapsed: boolean
}> = ({ lesson, isCurrent, onSelect, isCollapsed }) => {
  const handleClick = useCallback(() => {
    if (!lesson.isLocked) {
      onSelect(lesson.id)
    }
  }, [lesson.id, lesson.isLocked, onSelect])

  return (
    <Button
      variant={isCurrent ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-3 h-auto py-2 px-3 text-left",
        isCurrent && "bg-primary/10 border-l-2 border-primary",
        lesson.isLocked && "opacity-50 cursor-not-allowed",
        isCollapsed && "px-2 min-w-0"
      )}
      onClick={handleClick}
      disabled={lesson.isLocked}
      aria-current={isCurrent ? "page" : undefined}
      aria-label={`${lesson.title}${lesson.isLocked ? ' (locked)' : ''}${lesson.isCompleted ? ' (completed)' : ''}`}
    >
      <div className="flex-shrink-0">
        {getLessonIcon(lesson.type, lesson.isCompleted, lesson.isLocked)}
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {lesson.title}
          </div>
          {lesson.duration && (
            <div className="text-xs text-muted-foreground">
              {lesson.duration}
            </div>
          )}
        </div>
      )}
    </Button>
  )
}

/**
 * Module section component with collapsible lessons
 */
const ModuleSection: React.FC<{
  module: Module
  currentLesson: string
  onLessonSelect: (lessonId: string) => void
  isCollapsed: boolean
}> = ({ module, currentLesson, onLessonSelect, isCollapsed }) => {
  const [isOpen, setIsOpen] = useState(true)
  const currentLessonInModule = module.lessons.some(lesson => lesson.id === currentLesson)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between h-auto py-3 px-3 text-left font-medium",
            currentLessonInModule && "bg-primary/5",
            isCollapsed && "px-2"
          )}
          aria-expanded={isOpen}
          aria-label={`${module.title} module, ${module.lessons.length} lessons, ${module.progress}% complete`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {module.isCompleted ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
            </div>
            
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">
                  {module.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={module.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {module.progress}%
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <div className="flex-shrink-0">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-1">
        <div className={cn("ml-6 space-y-1", isCollapsed && "ml-0")}>
          {module.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              isCurrent={lesson.id === currentLesson}
              onSelect={onLessonSelect}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

/**
 * Main sidebar navigation component
 */
export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  courseStructure,
  currentLesson,
  progress,
  isCollapsed,
  onToggleCollapse,
  onLessonSelect,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter modules and lessons based on search query
  const filteredModules = useMemo(() => {
    if (!searchQuery) return courseStructure

    return courseStructure
      .map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson =>
          lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }))
      .filter(module => 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.lessons.length > 0
      )
  }, [courseStructure, searchQuery])

  const overallProgress = useMemo(() => {
    if (progress.totalLessons === 0) return 0
    return Math.round((progress.completedLessons / progress.totalLessons) * 100)
  }, [progress])

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background-overlay border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
        className
      )}
      role="navigation"
      aria-label="Course navigation"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">Habilidade</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Search lessons"
            />
          </div>
        </div>
      )}

      {/* Progress Overview */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="bg-card rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {progress.completedLessons}/{progress.totalLessons}
              </Badge>
            </div>
            
            <Progress value={overallProgress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <div className="font-medium">{overallProgress}%</div>
                <div>Completed</div>
              </div>
              <div>
                <div className="font-medium">{progress.currentStreak}</div>
                <div>Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Content */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2 pb-4">
          {filteredModules.length > 0 ? (
            filteredModules.map((module) => (
              <ModuleSection
                key={module.id}
                module={module}
                currentLesson={currentLesson}
                onLessonSelect={onLessonSelect}
                isCollapsed={isCollapsed}
              />
            ))
          ) : (
            !isCollapsed && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No lessons found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            )
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

export default SidebarNavigation