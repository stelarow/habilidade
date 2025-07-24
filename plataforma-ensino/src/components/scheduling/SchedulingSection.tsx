/**
 * SchedulingSection component for conditional scheduling display
 * 
 * This component groups and manages the conditional display logic for teacher selection
 * and calendar scheduling in the enrollment form. It implements the conditional
 * rendering based on "Curso Presencial" checkbox state as defined in Story 1.1.
 * 
 * @param props - SchedulingSectionProps interface
 * @returns React component with conditional scheduling functionality
 * 
 * @example
 * ```tsx
 * <SchedulingSection
 *   isVisible={formData.is_in_person}
 *   selectedCourse={selectedCourse}
 *   teacherId={formData.teacher_id}
 *   hasTwoClassesPerWeek={formData.has_two_classes_per_week}
 *   onTeacherChange={(teacherId) => handleInputChange('teacher_id', teacherId)}
 *   onTwoClassesChange={(checked) => handleInputChange('has_two_classes_per_week', checked)}
 * />
 * ```
 */

'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import TeacherSelector, { Teacher, Course } from '@/components/enrollment/TeacherSelector'
import ConditionalCalendar, { TimeSlot, CourseRequirements } from '@/components/enrollment/ConditionalCalendar'
import { CalendarDaysIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline'

export interface SchedulingSectionProps {
  isVisible: boolean
  selectedCourse?: Course
  teacherId: string
  hasTwoClassesPerWeek: boolean
  onTeacherChange: (teacherId: string) => void
  onTwoClassesChange: (checked: boolean) => void
  onSlotSelect?: (slot1: string, slot2?: string) => void
  className?: string
}

/**
 * Teacher selection section component
 */
function TeacherSelectionSection({
  selectedCourse,
  teacherId,
  onTeacherChange
}: {
  selectedCourse?: Course
  teacherId: string
  onTeacherChange: (teacherId: string) => void
}) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const handleTeacherSelect = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher)
    onTeacherChange(teacher.id)
  }, [onTeacherChange])

  // Reset selected teacher when teacherId changes externally
  useEffect(() => {
    if (!teacherId) {
      setSelectedTeacher(null)
    }
  }, [teacherId])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <UserIcon className="w-5 h-5 text-[#d400ff]" />
        <h3 className="text-lg font-semibold text-white">Seleção de Professor</h3>
        <span className="text-red-400 text-sm">*</span>
      </div>
      
      <TeacherSelector
        onTeacherSelect={handleTeacherSelect}
        selectedCourse={selectedCourse}
        className="teacher-selection-section"
      />
    </div>
  )
}

/**
 * Calendar section component
 */
function CalendarSection({
  selectedTeacher,
  selectedCourse,
  hasTwoClassesPerWeek,
  isEnabled,
  onSlotSelect
}: {
  selectedTeacher: Teacher | null
  selectedCourse?: Course
  hasTwoClassesPerWeek: boolean
  isEnabled: boolean
  onSlotSelect?: (slot1: string, slot2?: string) => void
}) {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([])

  const courseRequirements: CourseRequirements = useMemo(() => ({
    totalHours: selectedCourse?.duration_hours || 40,
    sessionDuration: 120, // 2 hours per session
    weeklyFrequency: hasTwoClassesPerWeek ? 2 : 1
  }), [selectedCourse, hasTwoClassesPerWeek])

  const handleSlotSelect = useCallback((slot: TimeSlot) => {
    setSelectedSlots(prev => {
      const isSelected = prev.some(s => 
        s.slotId === slot.slotId && 
        s.date.getTime() === slot.date.getTime()
      )

      let newSlots: TimeSlot[]
      
      if (isSelected) {
        // Remove slot
        newSlots = prev.filter(s => 
          !(s.slotId === slot.slotId && s.date.getTime() === slot.date.getTime())
        )
      } else {
        // Add slot
        if (hasTwoClassesPerWeek && prev.length >= 2) {
          // Replace oldest slot when at limit for two classes
          newSlots = [prev[1], slot]
        } else if (!hasTwoClassesPerWeek && prev.length >= 1) {
          // Replace slot when at limit for single class
          newSlots = [slot]
        } else {
          // Add slot
          newSlots = [...prev, slot]
        }
      }

      // Notify parent component of slot selection
      if (onSlotSelect) {
        onSlotSelect(newSlots[0]?.slotId || '', newSlots[1]?.slotId)
      }

      return newSlots
    })
  }, [hasTwoClassesPerWeek, onSlotSelect])

  // Clear slots when teacher changes or component becomes disabled
  useEffect(() => {
    if (!selectedTeacher || !isEnabled) {
      setSelectedSlots([])
      if (onSlotSelect) {
        onSlotSelect('', '')
      }
    }
  }, [selectedTeacher, isEnabled, onSlotSelect])

  // Update slots when hasTwoClassesPerWeek changes
  useEffect(() => {
    if (!hasTwoClassesPerWeek && selectedSlots.length > 1) {
      const newSlots = [selectedSlots[0]]
      setSelectedSlots(newSlots)
      if (onSlotSelect) {
        onSlotSelect(newSlots[0]?.slotId || '', '')
      }
    }
  }, [hasTwoClassesPerWeek, selectedSlots, onSlotSelect])

  if (!isEnabled || !selectedTeacher) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDaysIcon className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-500">Calendário de Horários</h3>
        </div>
        
        <Card className="p-6 border-gray-600 bg-gray-800/50">
          <div className="text-center py-8">
            <CalendarDaysIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">
              {!selectedTeacher 
                ? 'Selecione um professor para visualizar os horários disponíveis'
                : 'Calendário desabilitado'
              }
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDaysIcon className="w-5 h-5 text-[#00c4ff]" />
        <h3 className="text-lg font-semibold text-white">Calendário de Horários</h3>
        <span className="text-red-400 text-sm">*</span>
      </div>
      
      <ConditionalCalendar
        teacherId={selectedTeacher.id}
        availabilityData={selectedTeacher.availability}
        onSlotSelect={handleSlotSelect}
        selectedSlots={selectedSlots}
        courseRequirements={courseRequirements}
        maxSelectableSlots={courseRequirements.weeklyFrequency}
        enableMultiSelect={courseRequirements.weeklyFrequency > 1}
        className="calendar-section"
      />
    </div>
  )
}

/**
 * Two classes per week checkbox component
 */
function TwoClassesCheckbox({
  hasTwoClassesPerWeek,
  onToggle,
  isEnabled
}: {
  hasTwoClassesPerWeek: boolean
  onToggle: (checked: boolean) => void
  isEnabled: boolean
}) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(e.target.checked)
  }, [onToggle])

  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        id="has_two_classes_per_week"
        checked={hasTwoClassesPerWeek}
        onChange={handleChange}
        disabled={!isEnabled}
        className={`
          h-4 w-4 rounded border-gray-600 bg-gray-800
          focus:ring-2 focus:ring-[#d400ff] focus:ring-offset-0
          ${isEnabled 
            ? 'text-[#d400ff] cursor-pointer' 
            : 'text-gray-500 cursor-not-allowed opacity-50'
          }
        `}
      />
      <label 
        htmlFor="has_two_classes_per_week" 
        className={`
          text-sm font-medium select-none
          ${isEnabled 
            ? 'text-gray-300 cursor-pointer' 
            : 'text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Duas aulas por semana
      </label>
    </div>
  )
}

/**
 * Main SchedulingSection component
 */
export function SchedulingSection({
  isVisible,
  selectedCourse,
  teacherId,
  hasTwoClassesPerWeek,
  onTeacherChange,
  onTwoClassesChange,
  onSlotSelect,
  className = ''
}: SchedulingSectionProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const handleTeacherChange = useCallback((newTeacherId: string) => {
    onTeacherChange(newTeacherId)
  }, [onTeacherChange])

  const isCalendarEnabled = isVisible && !!teacherId

  // Track selected teacher for calendar integration
  useEffect(() => {
    // This effect would be used to sync with external teacher selection
    // if needed for the calendar component
  }, [teacherId])

  // Render nothing when not visible (implements AC: 2)
  if (!isVisible) {
    return null
  }

  return (
    <div className={`scheduling-section space-y-6 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/20">
        <ClockIcon className="w-6 h-6 text-[#d400ff]" />
        <div>
          <h2 className="text-xl font-bold text-white">Agendamento de Aulas</h2>
          <p className="text-gray-300 text-sm">
            Configure professor e horários para aulas presenciais
          </p>
        </div>
      </div>

      {/* Teacher Selection (implements AC: 3 - mandatory TeacherSelector) */}
      <TeacherSelectionSection
        selectedCourse={selectedCourse}
        teacherId={teacherId}
        onTeacherChange={handleTeacherChange}
      />

      {/* Two Classes Per Week Checkbox (implements AC: 3) */}
      <TwoClassesCheckbox
        hasTwoClassesPerWeek={hasTwoClassesPerWeek}
        onToggle={onTwoClassesChange}
        isEnabled={isVisible}
      />

      {/* Calendar Section (implements AC: 3 - ConditionalCalendar, initially disabled until teacher is selected) */}
      <CalendarSection
        selectedTeacher={selectedTeacher}
        selectedCourse={selectedCourse}
        hasTwoClassesPerWeek={hasTwoClassesPerWeek}
        isEnabled={isCalendarEnabled}
        onSlotSelect={onSlotSelect}
      />

      {/* Information Panel */}
      <Card className="p-4 border-blue-500/30 bg-blue-900/20">
        <div className="flex items-center gap-2 mb-3">
          <ClockIcon className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-semibold text-blue-300">
            Informações sobre Agendamento
          </h4>
        </div>
        
        <ul className="text-xs text-blue-400 space-y-1">
          <li>• Primeiro selecione o professor, depois os horários disponíveis serão exibidos</li>
          <li>• Para duas aulas por semana, você pode selecionar até 2 horários</li>
          <li>• O calendário mostra a disponibilidade real do professor selecionado</li>
          <li>• Horários em conflito com feriados são automaticamente marcados como indisponíveis</li>
        </ul>
      </Card>
    </div>
  )
}

export default SchedulingSection