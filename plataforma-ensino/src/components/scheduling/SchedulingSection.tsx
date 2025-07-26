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
import TeacherSelector from '@/components/enrollment/TeacherSelector'
import type { Teacher, Course } from '@/components/enrollment/TeacherSelector'
import SimplifiedWeeklySchedule from '@/components/enrollment/SimplifiedWeeklySchedule'
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
  onTeacherSelect
}: {
  selectedCourse?: Course
  teacherId: string
  onTeacherSelect: (teacher: Teacher) => void
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <UserIcon className="w-5 h-5 text-[#d400ff]" />
        <h3 className="text-lg font-semibold text-white">Seleção de Professor</h3>
        <span className="text-red-400 text-sm">*</span>
      </div>
      
      <TeacherSelector
        onTeacherSelect={onTeacherSelect}
        selectedCourse={selectedCourse}
        className="teacher-selection-section"
      />
    </div>
  )
}

/**
 * Simplified Calendar section component
 */
function CalendarSection({
  selectedTeacher,
  hasTwoClassesPerWeek,
  isEnabled,
  onSlotSelect
}: {
  selectedTeacher: Teacher | null
  hasTwoClassesPerWeek: boolean
  isEnabled: boolean
  onSlotSelect?: (slot1: string, slot2?: string) => void
}) {
  return (
    <div className="space-y-4">
      <SimplifiedWeeklySchedule
        teacherId={selectedTeacher?.id}
        teacherUserId={selectedTeacher?.userId}
        onSlotSelect={onSlotSelect}
        maxSelectableSlots={hasTwoClassesPerWeek ? 2 : 1}
        hasTwoClassesPerWeek={hasTwoClassesPerWeek}
        className="simplified-calendar-section"
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

  // Handle teacher selection from TeacherSelector
  const handleTeacherSelect = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher)
    onTeacherChange(teacher.id)
  }, [onTeacherChange])

  const isCalendarEnabled = isVisible && !!teacherId && !!selectedTeacher

  // Sync selectedTeacher when teacherId changes externally
  useEffect(() => {
    if (!teacherId) {
      setSelectedTeacher(null)
    }
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
            Selecione professor e horários semanais para aulas presenciais
          </p>
        </div>
      </div>

      {/* Teacher Selection (implements AC: 3 - mandatory TeacherSelector) */}
      <TeacherSelectionSection
        selectedCourse={selectedCourse}
        teacherId={teacherId}
        onTeacherSelect={handleTeacherSelect}
      />

      {/* Two Classes Per Week Checkbox (implements AC: 3) */}
      <TwoClassesCheckbox
        hasTwoClassesPerWeek={hasTwoClassesPerWeek}
        onToggle={onTwoClassesChange}
        isEnabled={isVisible}
      />

      {/* Simplified Calendar Section */}
      <CalendarSection
        selectedTeacher={selectedTeacher}
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
          <li>• Primeiro selecione o professor para ver os horários semanais disponíveis</li>
          <li>• Os horários mostram as vagas ocupadas/total para cada período</li>
          <li>• Para duas aulas por semana, selecione até 2 horários diferentes</li>
          <li>• Horários indisponíveis estão destacados em vermelho</li>
        </ul>
      </Card>
    </div>
  )
}

export default SchedulingSection