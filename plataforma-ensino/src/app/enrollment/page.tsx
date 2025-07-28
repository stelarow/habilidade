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
import { TeacherSelector } from '@/components/enrollment/TeacherSelector'
import type { Teacher } from '@/components/enrollment/TeacherSelector'
import { ConditionalCalendar } from '@/components/enrollment/ConditionalCalendar'
import type { TimeSlot, CourseRequirements } from '@/components/enrollment/ConditionalCalendar'
import { useEnrollmentFlow } from '@/components/enrollment/EnrollmentFlow'
import { useEnrollmentValidation } from '@/hooks/useEnrollmentValidation'
import { Card } from '@/components/ui/card'
import GradientButton from '@/components/ui/GradientButton'
import { EnrollmentErrorBoundary } from '@/components/error-boundaries/EnrollmentErrorBoundary'
import { ArrowLeft, ArrowRight, CheckCircle, Users, Calendar, Clock, AlertTriangle } from 'lucide-react'

interface Course {
  id: string
  title: string
  category: string
  duration_hours: number
  max_students: number
  description?: string
  session_duration?: number
  weekly_frequency?: number
  requires_teacher_selection?: boolean // Optional teacher selection
  self_paced?: boolean // For self-paced courses
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

  // Form validation hook
  const {
    validateTeacherSelection,
    validateTimeSlots,
    validateCompleteEnrollment,
    allErrors,
    hasValidationErrors,
    isValidating,
    clearErrors
  } = useEnrollmentValidation({
    enableRealtimeValidation: true,
    validateOnChange: true
  })

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

  // Dynamic step order based on course requirements
  const getStepOrder = useCallback((): EnrollmentStep[] => {
    const baseSteps: EnrollmentStep[] = ['course-selection']
    
    // Add teacher selection only if required
    if (enrollmentState.selectedCourse?.requires_teacher_selection !== false) {
      baseSteps.push('teacher-selection')
    }
    
    // Add schedule selection only if teacher selection is required and not self-paced
    if (enrollmentState.selectedCourse?.requires_teacher_selection !== false && 
        !enrollmentState.selectedCourse?.self_paced) {
      baseSteps.push('schedule-selection')
    }
    
    baseSteps.push('confirmation', 'completed')
    return baseSteps
  }, [enrollmentState.selectedCourse])

  // Navigation handlers
  const handleNext = useCallback(() => {
    const stepOrder = getStepOrder()
    const currentIndex = stepOrder.indexOf(enrollmentState.currentStep)
    
    if (currentIndex < stepOrder.length - 1) {
      setEnrollmentState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex + 1]
      }))
    }
  }, [enrollmentState.currentStep, getStepOrder])

  const handlePrevious = useCallback(() => {
    const stepOrder = getStepOrder()
    const currentIndex = stepOrder.indexOf(enrollmentState.currentStep)
    
    if (currentIndex > 0) {
      setEnrollmentState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex - 1]
      }))
    }
  }, [enrollmentState.currentStep, getStepOrder])

  const handleStepChange = useCallback((step: EnrollmentStep) => {
    // Clear errors when changing steps
    clearErrors()
    
    setEnrollmentState(prev => ({
      ...prev,
      currentStep: step
    }))
  }, [clearErrors])

  // Reset form state when course changes
  const handleCourseChange = useCallback((course: Course) => {
    clearErrors()
    
    // Determine next step based on course requirements
    const nextStep = course.requires_teacher_selection !== false ? 'teacher-selection' : 'confirmation'
    
    setEnrollmentState(prev => ({
      ...prev,
      selectedCourse: course,
      selectedTeacher: null, // Reset teacher when course changes
      selectedSlots: [], // Reset slots when course changes
      enrollmentData: null, // Reset enrollment data
      currentStep: nextStep
    }))
  }, [clearErrors])

  // Selection handlers
  const handleTeacherSelect = useCallback(async (teacher: Teacher) => {
    // Clear previous errors
    clearErrors()
    
    // Validate teacher selection
    const validation = await validateTeacherSelection(teacher, enrollmentState.selectedCourse?.id)
    
    if (validation.isValid) {
      setEnrollmentState(prev => ({
        ...prev,
        selectedTeacher: teacher,
        selectedSlots: [] // Reset slots when teacher changes
      }))
      setError(null)
    } else {
      // Show validation errors but still allow selection for UX
      setEnrollmentState(prev => ({
        ...prev,
        selectedTeacher: teacher,
        selectedSlots: []
      }))
      console.warn('Teacher validation errors:', validation.errors)
    }
  }, [enrollmentState.selectedCourse, validateTeacherSelection, clearErrors])

  const handleSlotSelect = useCallback(async (slot: TimeSlot) => {
    setEnrollmentState(prev => {
      const isSelected = prev.selectedSlots.some((s: any) => 
        s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime()
      )

      let newSlots: TimeSlot[]
      if (isSelected) {
        // Deselect slot
        newSlots = prev.selectedSlots.filter((s: any) => 
          !(s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime())
        )
      } else {
        // Select slot
        newSlots = [...prev.selectedSlots, slot]
      }

      // Validate slots asynchronously
      if (newSlots.length > 0) {
        validateTimeSlots(newSlots, courseRequirements).then(validation => {
          if (!validation.isValid) {
            console.warn('Time slot validation errors:', validation.errors)
          }
        })
      }

      return {
        ...prev,
        selectedSlots: newSlots
      }
    })
  }, [courseRequirements, validateTimeSlots])

  // Validation functions
  const canProceedFromStep = useCallback((step: EnrollmentStep): boolean => {
    switch (step) {
      case 'course-selection':
        return !!enrollmentState.selectedCourse
      case 'teacher-selection':
        // Allow proceeding if teacher selection is optional OR teacher is selected
        return enrollmentState.selectedCourse?.requires_teacher_selection === false || 
               !!enrollmentState.selectedTeacher
      case 'schedule-selection':
        // Skip validation for self-paced courses
        if (enrollmentState.selectedCourse?.self_paced) return true
        
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

  // Validation errors display component
  const ValidationErrors = () => {
    if (!hasValidationErrors || allErrors.length === 0) return null

    return (
      <Card className="mb-6 p-4 border-red-500/50 bg-red-500/10">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-red-300 font-medium mb-2">
              {allErrors.length === 1 ? 'Erro de validação' : 'Erros de validação'}
            </h4>
            <ul className="space-y-1">
              {allErrors.slice(0, 5).map((error, index) => (
                <li key={index} className="text-red-200 text-sm">
                  • {error.message}
                </li>
              ))}
              {allErrors.length > 5 && (
                <li className="text-red-200/70 text-sm">
                  • +{allErrors.length - 5} erro{allErrors.length - 5 !== 1 ? 's' : ''} adiciona{allErrors.length - 5 !== 1 ? 'is' : 'l'}
                </li>
              )}
            </ul>
          </div>
          <button
            onClick={clearErrors}
            className="text-red-300 hover:text-red-100 transition-colors duration-200"
            title="Limpar erros"
          >
            ✕
          </button>
        </div>
      </Card>
    )
  }

  // Step indicator component
  const StepIndicator = () => {
    const stepOrder = getStepOrder()
    const allSteps = [
      { key: 'teacher-selection' as EnrollmentStep, label: 'Professor', icon: <Users size={16} /> },
      { key: 'schedule-selection' as EnrollmentStep, label: 'Horários', icon: <Calendar size={16} /> },
      { key: 'confirmation' as EnrollmentStep, label: 'Confirmação', icon: <CheckCircle size={16} /> }
    ]
    
    // Filter steps based on course requirements
    const steps = allSteps.filter((step: any) => stepOrder.includes(step.key))

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const currentStepIndex = stepOrder.indexOf(enrollmentState.currentStep)
          const stepIndex = stepOrder.indexOf(step.key)
          
          const isActive = step.key === enrollmentState.currentStep
          const isCompleted = currentStepIndex > stepIndex
          const isAccessible = stepIndex <= currentStepIndex + 1 && 
                              (stepIndex === 0 || canProceedFromStep(stepOrder[stepIndex - 1]))

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
              description: 'HTML, CSS, JavaScript e React',
              requires_teacher_selection: true,
              self_paced: false
            },
            {
              id: '2', 
              title: 'Design Gráfico Digital',
              category: 'Design',
              duration_hours: 30,
              max_students: 12,
              description: 'Photoshop, Illustrator e Figma',
              requires_teacher_selection: true,
              self_paced: false
            },
            {
              id: '3',
              title: 'Curso Online Autodirigido',
              category: 'Online',
              duration_hours: 20,
              max_students: 100,
              description: 'Curso online com materiais pré-gravados',
              requires_teacher_selection: false,
              self_paced: true
            },
            {
              id: '4',
              title: 'Workshop Básico',
              category: 'Workshop',
              duration_hours: 8,
              max_students: 20,
              description: 'Workshop sem necessidade de agendamento',
              requires_teacher_selection: false,
              self_paced: false
            }
          ].map((course: any) => (
            <Card
              key={course.id}
              className="p-6 border-white/20 hover:border-[#d400ff]/50 cursor-pointer transition-all duration-200"
              onClick={() => handleCourseChange(course)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {course.title}
                </h3>
                {course.self_paced && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                    Autodirigido
                  </span>
                )}
                {course.requires_teacher_selection === false && !course.self_paced && (
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                    Sem agendamento
                  </span>
                )}
              </div>
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
  const renderTeacherSelection = () => {
    // Skip teacher selection if not required
    if (enrollmentState.selectedCourse?.requires_teacher_selection === false) {
      return (
        <Card className="p-8 border-white/20 backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Seleção de Professor Não Necessária
          </h2>
          <p className="text-gray-300 mb-4">
            Este curso não requer seleção de professor específico.
          </p>
          <p className="text-sm text-gray-400">
            Prossiga para a confirmação da matrícula.
          </p>
        </Card>
      )
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Escolha seu Professor
          </h2>
          <p className="text-gray-300">
            Curso: <span className="text-[#00c4ff]">{enrollmentState.selectedCourse?.title}</span>
          </p>
        </div>

        <ValidationErrors />

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
  }

  // Schedule selection step
  const renderScheduleSelection = () => {
    // Skip schedule selection for self-paced courses
    if (enrollmentState.selectedCourse?.self_paced) {
      return (
        <Card className="p-8 border-white/20 backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Curso Autodirigido
          </h2>
          <p className="text-gray-300 mb-4">
            Este é um curso autodirigido que você pode fazer no seu próprio ritmo.
          </p>
          <p className="text-sm text-gray-400">
            Não é necessário agendar horários específicos.
          </p>
        </Card>
      )
    }

    return (
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Selecione os Horários
          </h2>
          <p className="text-gray-300">
            Professor: <span className="text-[#00c4ff]">{enrollmentState.selectedTeacher?.name || 'Não especificado'}</span>
          </p>
        </div>

        <ValidationErrors />

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
  }

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
              
              {enrollmentState.selectedCourse?.requires_teacher_selection !== false && (
                <div>
                  <span className="text-gray-400 text-sm">Professor:</span>
                  <div className="text-white font-medium">
                    {enrollmentState.selectedTeacher?.name || 'Não especificado'}
                  </div>
                </div>
              )}
              
              {enrollmentState.selectedCourse?.requires_teacher_selection === false && (
                <div>
                  <span className="text-gray-400 text-sm">Modalidade:</span>
                  <div className="text-white font-medium">
                    {enrollmentState.selectedCourse?.self_paced ? 'Autodirigido' : 'Sem agendamento específico'}
                  </div>
                </div>
              )}
              
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
              {enrollmentState.selectedCourse?.self_paced ? 'Informações do Curso' : 'Cronograma'}
            </h3>
            
            {enrollmentState.selectedCourse?.self_paced ? (
              <div className="space-y-3">
                <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <p className="text-blue-300 text-sm mb-2">Curso Autodirigido</p>
                  <p className="text-gray-300 text-xs">
                    Você pode acessar o conteúdo a qualquer momento e estudar no seu próprio ritmo.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Duração estimada:</span>
                    <div className="text-white">{courseRequirements.totalHours}h</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Acesso válido por:</span>
                    <div className="text-white">6 meses</div>
                  </div>
                </div>
              </div>
            ) : enrollmentState.selectedSlots.length === 0 ? (
              <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-green-300 text-sm mb-2">Sem Agendamento Necessário</p>
                <p className="text-gray-300 text-xs">
                  Este curso não requer horários específicos.
                </p>
              </div>
            ) : (
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
            )}
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
    <EnrollmentErrorBoundary>
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
                  onClick={async () => {
                    setIsLoading(true)
                    
                    // Validate complete enrollment
                    const enrollmentData = {
                      courseId: enrollmentState.selectedCourse?.id || '',
                      teacherId: enrollmentState.selectedTeacher?.id || null,
                      selectedSlots: enrollmentState.selectedSlots.map((slot: any) => ({
                        slotId: slot.slotId,
                        date: slot.date.toISOString().split('T')[0],
                        startTime: slot.startTime,
                        endTime: slot.endTime
                      })),
                      totalHours: enrollmentState.selectedSlots.length > 0 
                        ? enrollmentState.selectedSlots.reduce((sum, slot) => {
                            const start = new Date(`1970-01-01T${slot.startTime}:00`)
                            const end = new Date(`1970-01-01T${slot.endTime}:00`)
                            return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                          }, 0)
                        : courseRequirements.totalHours, // Use course total for self-paced/no-schedule courses
                      courseType: enrollmentState.selectedCourse?.self_paced 
                        ? 'self_paced' 
                        : enrollmentState.selectedCourse?.requires_teacher_selection === false 
                        ? 'no_schedule' 
                        : 'scheduled',
                      notes: ''
                    }
                    
                    const validation = await validateCompleteEnrollment(enrollmentData)
                    
                    if (validation.isValid) {
                      // Simulate enrollment processing
                      setTimeout(() => {
                        setIsLoading(false)
                        setEnrollmentState(prev => ({ ...prev, currentStep: 'completed' }))
                      }, 2000)
                    } else {
                      setIsLoading(false)
                      setError('Por favor, corrija os erros de validação antes de prosseguir.')
                    }
                  }}
                  disabled={isLoading || hasValidationErrors}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isValidating ? 'Validando...' : 'Processando...'}
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
                  disabled={!canProceedFromStep(enrollmentState.currentStep) || (hasValidationErrors && enrollmentState.currentStep !== 'teacher-selection')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#d400ff] to-[#a000ff]
                           hover:from-[#d400ff]/80 hover:to-[#a000ff]/80 text-white rounded-lg 
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={hasValidationErrors ? 'Corrija os erros de validação para continuar' : ''}
                >
                  {isValidating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      Próximo
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </EnrollmentErrorBoundary>
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