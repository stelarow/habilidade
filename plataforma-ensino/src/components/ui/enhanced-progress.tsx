'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Trophy, 
  Star,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'

/**
 * Interface definitions for progress components
 */
export interface LinearProgressProps {
  value: number // 0-100
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  animated?: boolean
  label?: string
  className?: string
}

export interface CircularProgressProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  children?: React.ReactNode
  className?: string
}

export interface StepProgressProps {
  steps: StepItem[]
  currentStep: number
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  className?: string
}

export interface StepItem {
  id: string
  title: string
  description?: string
  isCompleted: boolean
  isActive: boolean
}

export interface ModuleProgressProps {
  module: {
    id: string
    title: string
    description?: string
    lessonsCompleted: number
    totalLessons: number
    timeSpent?: string
    estimatedTimeRemaining?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
  }
  progress: number // 0-100
  className?: string
}

export interface AchievementProgressProps {
  achievement: {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    requirement: number
    current: number
    isUnlocked: boolean
  }
  className?: string
}

/**
 * Linear progress bar component
 */
export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  size = 'md',
  color = 'primary',
  showLabel = false,
  animated = false,
  label,
  className
}) => {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4'
  }

  const colorClasses = {
    primary: '[&>div]:bg-primary',
    success: '[&>div]:bg-success',
    warning: '[&>div]:bg-warning',
    error: '[&>div]:bg-destructive'
  }

  return (
    <div className={cn("space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{label || 'Progress'}</span>
          <span className="text-muted-foreground">{Math.round(value)}%</span>
        </div>
      )}
      
      <Progress
        value={value}
        className={cn(
          sizeClasses[size],
          colorClasses[color],
          animated && "transition-all duration-500 ease-out",
          className
        )}
      />
    </div>
  )
}

/**
 * Circular progress component
 */
export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'primary',
  showValue = true,
  children,
  className
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    error: 'stroke-destructive'
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            "transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showValue && (
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(value)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Step progress component
 */
export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  showLabels = true,
  className
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = step.isCompleted
          const isActive = step.isActive || stepNumber === currentStep
          const isPast = stepNumber < currentStep
          
          return (
            <div key={step.id} className="flex gap-4">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all",
                    isCompleted && "bg-success border-success text-success-foreground",
                    isActive && !isCompleted && "bg-primary border-primary text-primary-foreground",
                    !isActive && !isCompleted && !isPast && "border-muted-foreground text-muted-foreground",
                    isPast && !isCompleted && "border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 h-8 mt-2 transition-all",
                      isCompleted ? "bg-success" : "bg-muted"
                    )}
                  />
                )}
              </div>
              
              {/* Step content */}
              {showLabels && (
                <div className="flex-1 min-w-0 pb-8">
                  <h3
                    className={cn(
                      "font-medium text-sm",
                      isActive && "text-foreground",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = step.isCompleted
        const isActive = step.isActive || stepNumber === currentStep
        const isPast = stepNumber < currentStep
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              {/* Step indicator */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all",
                  isCompleted && "bg-success border-success text-success-foreground",
                  isActive && !isCompleted && "bg-primary border-primary text-primary-foreground",
                  !isActive && !isCompleted && !isPast && "border-muted-foreground text-muted-foreground",
                  isPast && !isCompleted && "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              
              {/* Step label */}
              {showLabels && (
                <div className="text-center max-w-24">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      isActive && "text-foreground",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all",
                  isCompleted ? "bg-success" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

/**
 * Module progress card component
 */
export const ModuleProgress: React.FC<ModuleProgressProps> = ({
  module,
  progress,
  className
}) => {
  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/30',
    intermediate: 'bg-warning/10 text-warning border-warning/30',
    advanced: 'bg-destructive/10 text-destructive border-destructive/30'
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2">
                {module.title}
              </h3>
              {module.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {module.description}
                </p>
              )}
            </div>
            
            {module.difficulty && (
              <Badge
                variant="outline"
                className={difficultyColors[module.difficulty]}
              >
                {module.difficulty}
              </Badge>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {module.lessonsCompleted}/{module.totalLessons} lessons
              </span>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{Math.round(progress)}% complete</span>
              {module.estimatedTimeRemaining && (
                <span>{module.estimatedTimeRemaining} remaining</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {module.lessonsCompleted}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {module.timeSpent || '0h'}
              </div>
              <div className="text-xs text-muted-foreground">Time Spent</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Achievement progress component
 */
export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  achievement,
  className
}) => {
  const progress = Math.min((achievement.current / achievement.requirement) * 100, 100)
  const isCompleted = achievement.current >= achievement.requirement

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg",
      isCompleted && "ring-2 ring-success/20 bg-success/5",
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-lg flex-shrink-0",
              isCompleted ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
            )}>
              {achievement.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">
                  {achievement.title}
                </h3>
                
                {isCompleted && (
                  <Badge className="bg-success/10 text-success border-success/30">
                    <Trophy className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-1">
                {achievement.description}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {achievement.current}/{achievement.requirement}
              </span>
            </div>
            
            <Progress 
              value={progress} 
              className={cn(
                "h-2",
                isCompleted && "[&>div]:bg-success"
              )}
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-success font-medium">Achievement Unlocked!</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {achievement.requirement - achievement.current} more to unlock
                  </span>
                </>
              )}
            </div>
            
            <div className="text-lg font-bold text-primary">
              {Math.round(progress)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Gamification progress dashboard
 */
export interface GamificationProgressProps {
  user: {
    level: number
    currentXP: number
    nextLevelXP: number
    totalXP: number
    streak: number
    badges: number
  }
  className?: string
}

export const GamificationProgress: React.FC<GamificationProgressProps> = ({
  user,
  className
}) => {
  const levelProgress = ((user.currentXP / user.nextLevelXP) * 100)

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Level Progress */}
          <div className="text-center space-y-4">
            <div className="relative">
              <CircularProgress
                value={levelProgress}
                size={120}
                strokeWidth={8}
                color="primary"
                showValue={false}
              >
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Level</div>
                  <div className="text-2xl font-bold">{user.level}</div>
                </div>
              </CircularProgress>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-medium">
                {user.currentXP} / {user.nextLevelXP} XP
              </div>
              <div className="text-xs text-muted-foreground">
                {user.nextLevelXP - user.currentXP} XP to next level
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-lg font-bold">{user.totalXP.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
            
            <div className="text-center p-3 bg-warning/5 rounded-lg">
              <Target className="w-5 h-5 mx-auto mb-1 text-warning" />
              <div className="text-lg font-bold">{user.streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            
            <div className="text-center p-3 bg-success/5 rounded-lg">
              <Award className="w-5 h-5 mx-auto mb-1 text-success" />
              <div className="text-lg font-bold">{user.badges}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export default
export default LinearProgress