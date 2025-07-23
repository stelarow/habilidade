/**
 * Main enrollment page integrating TeacherSelector and ConditionalCalendar
 * Story 2.2: UI Components Integration - Task 3
 * 
 * Complete enrollment flow with teacher selection, calendar scheduling,
 * and enrollment confirmation using MCP Supabase integration.
 */

'use client'

import React, { useState, useCallback, useEffect, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TeacherSelector, Teacher } from '@/components/enrollment/TeacherSelector'
import { ConditionalCalendar, TimeSlot, CourseRequirements } from '@/components/enrollment/ConditionalCalendar'
import { useEnrollmentFlow } from '@/components/enrollment/EnrollmentFlow'
import { Card } from '@/components/ui/card'
import GradientButton from '@/components/ui/GradientButton'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { ArrowLeft, ArrowRight, CheckCircle, Users, Calendar, Clock } from 'lucide-react'

interface Course {
  id: string
  title: string
  category: string
  duration_hours: number
  max_students: number
  description?: string
  session_duration?: number
  weekly_frequency?: number
}

type EnrollmentStep = 'course-selection' | 'teacher-selection' | 'schedule-selection' | 'confirmation' | 'completed'

interface EnrollmentState {
  currentStep: EnrollmentStep
  selectedCourse: Course | null
  selectedTeacher: Teacher | null
  selectedSlots: TimeSlot[]
  enrollmentData: any
}

// Component that uses useSearchParams - must be wrapped in Suspense
function EnrollmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('courseId')

  const [enrollmentState, setEnrollmentState] = useState<EnrollmentState>({
    currentStep: courseId ? 'teacher-selection' : 'course-selection',
    selectedCourse: null,
    selectedTeacher: null,
    selectedSlots: [],
    enrollmentData: null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load course data if courseId is provided
  useEffect(() => {
    if (courseId && !enrollmentState.selectedCourse) {
      // In a real implementation, this would fetch course data
      // For now, we'll use mock data
      const mockCourse: Course = {
        id: courseId,
        title: 'Curso de Programação Web',
        category: 'Programação',
        duration_hours: 40,
        max_students: 15,
        description: 'Aprenda desenvolvimento web completo com HTML, CSS, JavaScript e React.',
        session_duration: 120, // 2 hours
        weekly_frequency: 2
      }

      setEnrollmentState(prev => ({
        ...prev,
        selectedCourse: mockCourse
      }))
    }
  }, [courseId, enrollmentState.selectedCourse])

  // Get course requirements for calendar - memoized for performance
  const courseRequirements: CourseRequirements = useMemo(() => ({
    totalHours: enrollmentState.selectedCourse?.duration_hours || 40,
    sessionDuration: enrollmentState.selectedCourse?.session_duration || 120,
    weeklyFrequency: enrollmentState.selectedCourse?.weekly_frequency || 2
  }), [enrollmentState.selectedCourse])

  // Navigation handlers
  const handleNext = useCallback(() => {
    const stepOrder: EnrollmentStep[] = [
      'course-selection',
      'teacher-selection', 
      'schedule-selection', 
      'confirmation',
      'completed'
    ]
    
    const currentIndex = stepOrder.indexOf(enrollmentState.currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setEnrollmentState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex + 1]
      }))
    }
  }, [enrollmentState.currentStep])

  const handlePrevious = useCallback(() => {
    const stepOrder: EnrollmentStep[] = [
      'course-selection',
      'teacher-selection', 
      'schedule-selection', 
      'confirmation',
      'completed'
    ]
    
    const currentIndex = stepOrder.indexOf(enrollmentState.currentStep)
    if (currentIndex > 0) {
      setEnrollmentState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex - 1]
      }))
    }
  }, [enrollmentState.currentStep])

  const handleStepChange = useCallback((step: EnrollmentStep) => {
    setEnrollmentState(prev => ({
      ...prev,
      currentStep: step
    }))
  }, [])

  // Selection handlers
  const handleTeacherSelect = useCallback((teacher: Teacher) => {
    setEnrollmentState(prev => ({
      ...prev,
      selectedTeacher: teacher,
      selectedSlots: [] // Reset slots when teacher changes
    }))
  }, [])

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setEnrollmentState(prev => {
      const isSelected = prev.selectedSlots.some(s => 
        s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
      )

      if (isSelected) {
        // Deselect slot
        return {
          ...prev,
          selectedSlots: prev.selectedSlots.filter(s => 
            !(s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime())
          )
        }
      } else {
        // Select slot
        return {
          ...prev,
          selectedSlots: [...prev.selectedSlots, slot]
        }
      }
    })
  }, [])

  // Validation functions
  const canProceedFromStep = useCallback((step: EnrollmentStep): boolean => {
    switch (step) {
      case 'course-selection':
        return !!enrollmentState.selectedCourse
      case 'teacher-selection':
        return !!enrollmentState.selectedTeacher
      case 'schedule-selection':
        const totalHours = enrollmentState.selectedSlots.reduce((sum, slot) => {
          const start = new Date(`1970-01-01T${slot.startTime}:00`)
          const end = new Date(`1970-01-01T${slot.endTime}:00`)
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        }, 0)
        return totalHours >= (courseRequirements.totalHours * 0.8) // At least 80% of required hours
      case 'confirmation':
        return true
      default:
        return false
    }
  }, [enrollmentState, courseRequirements])

  // Step indicator component
  const StepIndicator = () => {
    const steps = [
      { key: 'teacher-selection' as EnrollmentStep, label: 'Professor', icon: <Users size={16} /> },
      { key: 'schedule-selection' as EnrollmentStep, label: 'Horários', icon: <Calendar size={16} /> },
      { key: 'confirmation' as EnrollmentStep, label: 'Confirmação', icon: <CheckCircle size={16} /> }
    ]

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const isActive = step.key === enrollmentState.currentStep
          const isCompleted = steps.findIndex(s => s.key === enrollmentState.currentStep) > index
          const isAccessible = canProceedFromStep(steps[index - 1]?.key || 'course-selection')

          return (
            <React.Fragment key={step.key}>
              <button
                onClick={() => isAccessible && handleStepChange(step.key)}
                disabled={!isAccessible}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-[#d400ff] text-white'
                    : isCompleted
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                    : isAccessible
                    ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step.icon}
                <span className="font-medium">{step.label}</span>
                {isCompleted && <CheckCircle size={14} />}
              </button>
              
              {index < steps.length - 1 && (
                <div 
                  className={`w-8 h-0.5 mx-2 ${
                    isCompleted ? 'bg-green-400' : 'bg-gray-600'
                  }`} 
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }

  // Course selection step (if no courseId provided)
  const renderCourseSelection = () => (
    <Card className="p-8 border-white/20 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Selecione um Curso
        </h2>
        <p className="text-gray-300 mb-6">
          Escolha o curso no qual deseja se matricular
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {/* Mock courses - in real implementation, these would come from API */}
          {[
            {
              id: '1',
              title: 'Programação Web Completa',
              category: 'Programação',
              duration_hours: 40,
              max_students: 15,
              description: 'HTML, CSS, JavaScript e React'
            },
            {
              id: '2', 
              title: 'Design Gráfico Digital',
              category: 'Design',
              duration_hours: 30,
              max_students: 12,
              description: 'Photoshop, Illustrator e Figma'
            }
          ].map(course => (
            <Card
              key={course.id}
              className="p-6 border-white/20 hover:border-[#d400ff]/50 cursor-pointer transition-all duration-200"
              onClick={() => {
                setEnrollmentState(prev => ({
                  ...prev,
                  selectedCourse: course,
                  currentStep: 'teacher-selection'
                }))
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {course.title}
              </h3>
              <p className="text-gray-300 text-sm mb-3">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{course.duration_hours}h total</span>
                <span>Máx. {course.max_students} alunos</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )

  // Teacher selection step
  const renderTeacherSelection = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Escolha seu Professor
        </h2>
        <p className="text-gray-300">
          Curso: <span className="text-[#00c4ff]">{enrollmentState.selectedCourse?.title}</span>
        </p>
      </div>

      <TeacherSelector
        onTeacherSelect={handleTeacherSelect}
        selectedCourse={enrollmentState.selectedCourse || undefined}
        availabilityFilter={{
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months
        }}
      />
    </div>
  )

  // Schedule selection step
  const renderScheduleSelection = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selecione os Horários
        </h2>
        <p className="text-gray-300">
          Professor: <span className="text-[#00c4ff]">{enrollmentState.selectedTeacher?.name}</span>
        </p>
      </div>

      <ConditionalCalendar
        teacherId={enrollmentState.selectedTeacher?.id}
        availabilityData={enrollmentState.selectedTeacher?.availability || []}
        onSlotSelect={handleSlotSelect}
        selectedSlots={enrollmentState.selectedSlots}
        courseRequirements={courseRequirements}
        enableMultiSelect={true}
        showLegend={true}
      />
    </div>
  )

  // Confirmation step
  const renderConfirmation = () => {
    const totalHours = enrollmentState.selectedSlots.reduce((sum, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)

    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Confirmar Matrícula
          </h2>
          <p className="text-gray-300">
            Revise os detalhes da sua matrícula antes de confirmar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course and teacher info */}
          <Card className="p-6 border-white/20 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users size={18} />
              Detalhes do Curso
            </h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">Curso:</span>
                <div className="text-white font-medium">
                  {enrollmentState.selectedCourse?.title}
                </div>
              </div>
              
              <div>
                <span className="text-gray-400 text-sm">Professor:</span>
                <div className="text-white font-medium">
                  {enrollmentState.selectedTeacher?.name}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Duração total:</span>
                  <div className="text-white">{courseRequirements.totalHours}h</div>
                </div>
                <div>
                  <span className="text-gray-400">Horas selecionadas:</span>
                  <div className="text-white">{totalHours.toFixed(1)}h</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Schedule summary */}
          <Card className="p-6 border-white/20 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Cronograma
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {enrollmentState.selectedSlots
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((slot, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
                  <div>
                    <div className="text-white text-sm font-medium">
                      {slot.date.toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {slot.date.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {(() => {
                        const start = new Date(`1970-01-01T${slot.startTime}:00`)
                        const end = new Date(`1970-01-01T${slot.endTime}:00`)
                        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                        return `${hours}h`
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm mb-4">
            Ao confirmar, você aceita os termos e condições da matrícula
          </p>
        </div>
      </div>
    )
  }

  const renderCurrentStep = () => {
    switch (enrollmentState.currentStep) {
      case 'course-selection':
        return renderCourseSelection()
      case 'teacher-selection':
        return renderTeacherSelection()
      case 'schedule-selection':
        return renderScheduleSelection()
      case 'confirmation':
        return renderConfirmation()
      case 'completed':
        return (
          <Card className="p-8 border-green-500/50 bg-green-500/10 text-center">
            <CheckCircle size={64} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Matrícula Confirmada!
            </h2>
            <p className="text-gray-300 mb-6">
              Sua matrícula foi processada com sucesso. Você receberá um email de confirmação em breve.
            </p>
            <GradientButton onClick={() => router.push('/dashboard')}>
              Ir para Dashboard
            </GradientButton>
          </Card>
        )
      default:
        return null
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <Card className="max-w-2xl mx-auto p-8 border-red-500/50 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-4">❌ Erro</div>
            <p className="text-gray-300 mb-6">{error}</p>
            <GradientButton onClick={() => window.location.reload()}>
              Tentar Novamente
            </GradientButton>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 mb-4"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            
            <h1 className="text-3xl font-bold text-white">
              Nova Matrícula
            </h1>
          </div>

          {/* Step indicator */}
          {enrollmentState.currentStep !== 'course-selection' && enrollmentState.currentStep !== 'completed' && (
            <StepIndicator />
          )}

          {/* Current step content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation buttons */}
          {enrollmentState.currentStep !== 'completed' && enrollmentState.currentStep !== 'course-selection' && (
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              <button
                onClick={handlePrevious}
                disabled={enrollmentState.currentStep === 'teacher-selection'}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 
                         text-white rounded-lg transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={18} />
                Anterior
              </button>

              {enrollmentState.currentStep === 'confirmation' ? (
                <GradientButton
                  onClick={() => {
                    setIsLoading(true)
                    // Simulate enrollment processing
                    setTimeout(() => {
                      setIsLoading(false)
                      setEnrollmentState(prev => ({ ...prev, currentStep: 'completed' }))
                    }, 2000)
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Confirmar Matrícula
                    </>
                  )}
                </GradientButton>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!canProceedFromStep(enrollmentState.currentStep)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d400ff] to-[#a000ff]
                           hover:from-[#d400ff]/80 hover:to-[#a000ff]/80 text-white rounded-lg 
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

// Loading component for Suspense fallback
function EnrollmentLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#d400ff]/30 border-t-[#d400ff] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-300">Carregando matrícula...</p>
      </div>
    </div>
  )
}

// Main export component with Suspense wrapper
export default function EnrollmentPage() {
  return (
    <Suspense fallback={<EnrollmentLoading />}>
      <EnrollmentContent />
    </Suspense>
  )
}