/**
 * ConditionalCalendar component for teacher availability visualization
 * 
 * Integrates with existing teacherAvailabilityLogic.ts utilities from Story 2.1
 * to display teacher availability in a calendar format with visual indicators
 * for available, busy, and unavailable time slots.
 * 
 * @param props - ConditionalCalendarProps interface
 * @returns React component with calendar availability visualization
 * 
 * @example
 * ```tsx
 * <ConditionalCalendar
 *   teacherId="teacher-123"
 *   availabilityData={teacherAvailability}
 *   onSlotSelect={(slot) => handleSlotSelection(slot)}
 *   selectedSlots={selectedSlots}
 *   courseRequirements={{
 *     totalHours: 40,
 *     sessionDuration: 120,
 *     weeklyFrequency: 2
 *   }}
 * />
 * ```
 */

'use client'

import React, { useState, useEffect, useMemo, useCallback, useId } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card } from '@/components/ui/card'
import { GradientButton } from '@/components/ui/GradientButton'
import { Loading } from '@/components/ui/Loading'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Zap
} from 'lucide-react'
import { 
  calculateAvailableSlots, 
  aggregateAvailabilityForCalendar,
  subscribeToAvailabilityUpdates,
  AvailabilitySlotWithOccurrence
} from '@/utils/teacherAvailabilityLogic'
import { TeacherAvailability } from '@/types/api'

export interface TimeSlot {
  date: Date
  startTime: string
  endTime: string
  isAvailable: boolean
  currentCapacity: number
  maxCapacity: number
  conflictReason?: string
  slotId: string
  teacherId: string
}

export interface CourseRequirements {
  totalHours: number
  sessionDuration: number // minutes
  weeklyFrequency: number
}

export interface ConditionalCalendarProps {
  teacherId?: string
  availabilityData: TeacherAvailability[]
  onSlotSelect: (slot: TimeSlot) => void
  selectedSlots: TimeSlot[]
  courseRequirements: CourseRequirements
  className?: string
  startDate?: Date
  endDate?: Date
  showLegend?: boolean
  enableMultiSelect?: boolean
  maxSelectableSlots?: number
}

interface CalendarDay {
  date: Date
  slots: TimeSlot[]
  isCurrentMonth: boolean
  isToday: boolean
  isPast: boolean
  totalAvailable: number
  totalOccupied: number
}

interface CalendarWeek {
  days: CalendarDay[]
  weekNumber: number
}

/**
 * Custom hook for calendar data management with real-time updates
 */
function useCalendarData(
  teacherId?: string,
  availabilityData?: TeacherAvailability[],
  startDate?: Date,
  endDate?: Date
) {
  const [calendarSlots, setCalendarSlots] = useState<AvailabilitySlotWithOccurrence[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [holidays, setHolidays] = useState<any[]>([])

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  const fetchCalendarData = useCallback(async () => {
    if (!teacherId || !startDate || !endDate) {
      setCalendarSlots([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch holidays for the date range
      const { data: holidaysData, error: holidaysError } = await supabase
        .from('holidays')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])

      if (holidaysError) {
        console.warn('Failed to fetch holidays:', holidaysError)
        setHolidays([])
      } else {
        setHolidays(holidaysData || [])
      }

      // Calculate available slots using existing utility
      const slots = await calculateAvailableSlots(
        teacherId,
        { start: startDate, end: endDate },
        holidaysData || []
      )

      setCalendarSlots(slots)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AVAILABILITY_CALCULATION_ERROR'
      setError(errorMessage)
      console.error('Calendar data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, teacherId, startDate, endDate])

  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData])

  // Set up real-time updates
  useEffect(() => {
    if (!teacherId) return

    const unsubscribe = subscribeToAvailabilityUpdates(teacherId, () => {
      console.log('Calendar availability updated, refreshing...')
      fetchCalendarData()
    })

    return unsubscribe
  }, [teacherId, fetchCalendarData])

  return { calendarSlots, loading, error, holidays, refetchData: fetchCalendarData }
}

/**
 * Generate calendar grid from availability slots
 */
function useCalendarGrid(
  slots: AvailabilitySlotWithOccurrence[],
  startDate: Date,
  endDate: Date
): CalendarWeek[] {
  return useMemo(() => {
    const weeks: CalendarWeek[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Start from the first day of the week containing startDate
    const gridStart = new Date(startDate)
    gridStart.setDate(gridStart.getDate() - gridStart.getDay()) // Go to Sunday

    const gridEnd = new Date(endDate)
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay())) // Go to Saturday

    const current = new Date(gridStart)
    let weekNumber = 1

    while (current <= gridEnd) {
      const week: CalendarWeek = { days: [], weekNumber }

      // Generate 7 days for this week
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(current)
        const dayDateStr = dayDate.toISOString().split('T')[0]

        // Find slots for this day
        const daySlots: TimeSlot[] = slots
          .filter(slot => slot.date === dayDateStr)
          .map(slot => ({
            date: dayDate,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isAvailable: slot.availableSpots > 0 && !slot.conflictsWithHoliday,
            currentCapacity: slot.maxStudents - slot.availableSpots,
            maxCapacity: slot.maxStudents,
            conflictReason: slot.conflictsWithHoliday ? 'Holiday conflict' : undefined,
            slotId: slot.id,
            teacherId: slot.teacherId
          }))

        const day: CalendarDay = {
          date: dayDate,
          slots: daySlots,
          isCurrentMonth: dayDate.getMonth() === startDate.getMonth(),
          isToday: dayDate.getTime() === today.getTime(),
          isPast: dayDate < today,
          totalAvailable: daySlots.filter(s => s.isAvailable).length,
          totalOccupied: daySlots.filter(s => !s.isAvailable && !s.conflictReason).length
        }

        week.days.push(day)
        current.setDate(current.getDate() + 1)
      }

      weeks.push(week)
      weekNumber++
    }

    return weeks
  }, [slots, startDate, endDate])
}

/**
 * Calendar header with navigation
 */
function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
  onToday
}: {
  currentDate: Date
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}) {
  const monthYear = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  })

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Calendar className="text-[#d400ff]" size={24} />
        <h3 className="text-xl font-semibold text-white capitalize">
          {monthYear}
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 
                     text-white rounded-lg transition-colors duration-200
                     border border-white/20 hover:border-white/30"
        >
          Hoje
        </button>
        
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-white/10 text-white rounded-lg 
                     transition-colors duration-200"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-white/10 text-white rounded-lg 
                     transition-colors duration-200"
          aria-label="Próximo mês"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}

/**
 * Calendar day names header
 */
function DayNamesHeader() {
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {dayNames.map(day => (
        <div 
          key={day}
          className="p-2 text-center text-sm font-medium text-gray-400"
        >
          {day}
        </div>
      ))}
    </div>
  )
}

/**
 * Individual time slot component
 */
function TimeSlotComponent({
  slot,
  isSelected,
  onSelect,
  disabled = false
}: {
  slot: TimeSlot
  isSelected: boolean
  onSelect: (slot: TimeSlot) => void
  disabled?: boolean
}) {
  const slotId = useId()

  const getSlotStatusColor = () => {
    if (disabled) return 'bg-gray-600 border-gray-500 text-gray-400'
    if (slot.conflictReason) return 'bg-red-500/20 border-red-500/50 text-red-300'
    if (!slot.isAvailable) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
    if (isSelected) return 'bg-[#d400ff] border-[#d400ff] text-white'
    return 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30'
  }

  const getStatusIcon = () => {
    if (slot.conflictReason) return <XCircle size={12} />
    if (!slot.isAvailable) return <AlertTriangle size={12} />
    if (isSelected) return <CheckCircle size={12} />
    return <Clock size={12} />
  }

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds
  }

  return (
    <button
      id={slotId}
      onClick={() => !disabled && onSelect(slot)}
      disabled={disabled}
      className={`
        w-full p-2 rounded border transition-all duration-200
        text-xs font-medium flex items-center justify-between
        ${getSlotStatusColor()}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={`
        Horário ${formatTime(slot.startTime)} às ${formatTime(slot.endTime)}, 
        ${slot.isAvailable ? 'disponível' : 'indisponível'}
        ${slot.conflictReason ? `, conflito: ${slot.conflictReason}` : ''}
        ${isSelected ? ', selecionado' : ''}
      `}
      title={
        slot.conflictReason 
          ? `Conflito: ${slot.conflictReason}`
          : `${slot.currentCapacity}/${slot.maxCapacity} ocupado`
      }
    >
      <span className="flex items-center gap-1">
        {getStatusIcon()}
        <span>{formatTime(slot.startTime)}</span>
      </span>
      <span className="text-xs opacity-75">
        {slot.currentCapacity}/{slot.maxCapacity}
      </span>
    </button>
  )
}

/**
 * Calendar day cell component
 */
function CalendarDayCell({
  day,
  selectedSlots,
  onSlotSelect,
  maxSelectableSlots,
  enableMultiSelect
}: {
  day: CalendarDay
  selectedSlots: TimeSlot[]
  onSlotSelect: (slot: TimeSlot) => void
  maxSelectableSlots?: number
  enableMultiSelect?: boolean
}) {
  const isSelectionLimitReached = maxSelectableSlots 
    ? selectedSlots.length >= maxSelectableSlots 
    : false

  const getDayBackgroundColor = () => {
    if (!day.isCurrentMonth) return 'bg-gray-800/50'
    if (day.isPast) return 'bg-gray-700/30'
    if (day.isToday) return 'bg-blue-500/10 border-blue-500/30'
    return 'bg-gray-800/20'
  }

  return (
    <div 
      className={`
        min-h-[120px] p-2 border border-white/10 rounded-lg
        ${getDayBackgroundColor()}
        ${day.isToday ? 'ring-1 ring-blue-500/50' : ''}
      `}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-2">
        <span 
          className={`
            text-sm font-medium
            ${!day.isCurrentMonth ? 'text-gray-500' : 
              day.isToday ? 'text-blue-400' : 'text-white'}
          `}
        >
          {day.date.getDate()}
        </span>
        
        {/* Day status indicators */}
        {day.slots.length > 0 && (
          <div className="flex items-center gap-1">
            {day.totalAvailable > 0 && (
              <span className="w-2 h-2 bg-green-400 rounded-full" 
                    title={`${day.totalAvailable} slots disponíveis`} />
            )}
            {day.totalOccupied > 0 && (
              <span className="w-2 h-2 bg-yellow-400 rounded-full" 
                    title={`${day.totalOccupied} slots ocupados`} />
            )}
          </div>
        )}
      </div>

      {/* Time slots */}
      <div className="space-y-1">
        {day.slots.map(slot => {
          const isSelected = selectedSlots.some(s => 
            s.slotId === slot.slotId && 
            s.date.getTime() === slot.date.getTime()
          )
          
          const disabled = day.isPast || 
            (!enableMultiSelect && selectedSlots.length > 0 && !isSelected) ||
            (isSelectionLimitReached && !isSelected)

          return (
            <TimeSlotComponent
              key={`${slot.slotId}-${slot.date.getTime()}`}
              slot={slot}
              isSelected={isSelected}
              onSelect={onSlotSelect}
              disabled={disabled}
            />
          )
        })}
        
        {day.slots.length === 0 && day.isCurrentMonth && !day.isPast && (
          <div className="text-xs text-gray-500 text-center py-2">
            Sem horários
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Calendar legend component
 */
function CalendarLegend({ className = '' }: { className?: string }) {
  const legendItems = [
    { color: 'bg-green-500/20 border-green-500/50', text: 'Disponível', icon: <CheckCircle size={14} /> },
    { color: 'bg-yellow-500/20 border-yellow-500/50', text: 'Ocupado', icon: <AlertTriangle size={14} /> },
    { color: 'bg-red-500/20 border-red-500/50', text: 'Conflito', icon: <XCircle size={14} /> },
    { color: 'bg-[#d400ff] border-[#d400ff]', text: 'Selecionado', icon: <Zap size={14} /> }
  ]

  return (
    <div className={`glass-bg rounded-lg p-4 border border-white/20 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Filter size={16} className="text-[#d400ff]" />
        <h4 className="text-sm font-semibold text-white">Legenda</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className={`w-4 h-4 rounded border ${item.color} flex items-center justify-center`}
            >
              <span className="text-white" style={{ fontSize: '10px' }}>
                {item.icon}
              </span>
            </div>
            <span className="text-xs text-gray-300">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Course requirements progress component
 */
function CourseProgress({
  selectedSlots,
  courseRequirements,
  className = ''
}: {
  selectedSlots: TimeSlot[]
  courseRequirements: CourseRequirements
  className?: string
}) {
  const totalSelectedHours = useMemo(() => {
    return selectedSlots.reduce((total, slot) => {
      const start = new Date(`1970-01-01T${slot.startTime}:00`)
      const end = new Date(`1970-01-01T${slot.endTime}:00`)
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      return total + hours
    }, 0)
  }, [selectedSlots])

  const progressPercentage = Math.min(
    (totalSelectedHours / courseRequirements.totalHours) * 100,
    100
  )

  const remainingHours = Math.max(0, courseRequirements.totalHours - totalSelectedHours)
  const estimatedWeeks = Math.ceil(remainingHours / (courseRequirements.sessionDuration / 60 * courseRequirements.weeklyFrequency))

  return (
    <div className={`glass-bg rounded-lg p-4 border border-white/20 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock size={16} className="text-[#00c4ff]" />
        <h4 className="text-sm font-semibold text-white">Progresso do Curso</h4>
      </div>
      
      <div className="space-y-3">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-1">
            <span>Horas selecionadas</span>
            <span>{totalSelectedHours.toFixed(1)}h / {courseRequirements.totalHours}h</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#00c4ff] to-[#d400ff] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400">Slots selecionados</span>
            <div className="text-white font-medium">{selectedSlots.length}</div>
          </div>
          <div>
            <span className="text-gray-400">Horas restantes</span>
            <div className="text-white font-medium">{remainingHours.toFixed(1)}h</div>
          </div>
        </div>

        {remainingHours > 0 && (
          <div className="text-xs text-gray-400">
            Estimativa: ~{estimatedWeeks} semana{estimatedWeeks !== 1 ? 's' : ''} restante{estimatedWeeks !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConditionalCalendar({
  teacherId,
  availabilityData,
  onSlotSelect,
  selectedSlots,
  courseRequirements,
  className = '',
  startDate,
  endDate,
  showLegend = true,
  enableMultiSelect = true,
  maxSelectableSlots
}: ConditionalCalendarProps) {
  // Default to current month if no dates provided
  const defaultStartDate = useMemo(() => {
    const date = startDate || new Date()
    date.setDate(1)
    date.setHours(0, 0, 0, 0)
    return date
  }, [startDate])

  const defaultEndDate = useMemo(() => {
    const date = endDate || new Date(defaultStartDate)
    date.setMonth(date.getMonth() + 1)
    date.setDate(0) // Last day of month
    date.setHours(23, 59, 59, 999)
    return date
  }, [defaultStartDate, endDate])

  const [currentDate, setCurrentDate] = useState(defaultStartDate)
  const [displayStartDate, setDisplayStartDate] = useState(defaultStartDate)
  const [displayEndDate, setDisplayEndDate] = useState(defaultEndDate)

  // Fetch calendar data
  const { calendarSlots, loading, error, refetchData } = useCalendarData(
    teacherId,
    availabilityData,
    displayStartDate,
    displayEndDate
  )

  // Generate calendar grid
  const calendarWeeks = useCalendarGrid(calendarSlots, displayStartDate, displayEndDate)

  // Navigation handlers
  const handlePreviousMonth = useCallback(() => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
    
    const newStart = new Date(newDate)
    newStart.setDate(1)
    newStart.setHours(0, 0, 0, 0)
    
    const newEnd = new Date(newStart)
    newEnd.setMonth(newEnd.getMonth() + 1)
    newEnd.setDate(0)
    newEnd.setHours(23, 59, 59, 999)
    
    setDisplayStartDate(newStart)
    setDisplayEndDate(newEnd)
  }, [currentDate])

  const handleNextMonth = useCallback(() => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
    
    const newStart = new Date(newDate)
    newStart.setDate(1)
    newStart.setHours(0, 0, 0, 0)
    
    const newEnd = new Date(newStart)
    newEnd.setMonth(newEnd.getMonth() + 1)
    newEnd.setDate(0)
    newEnd.setHours(23, 59, 59, 999)
    
    setDisplayStartDate(newStart)
    setDisplayEndDate(newEnd)
  }, [currentDate])

  const handleToday = useCallback(() => {
    const today = new Date()
    setCurrentDate(today)
    
    const newStart = new Date(today)
    newStart.setDate(1)
    newStart.setHours(0, 0, 0, 0)
    
    const newEnd = new Date(newStart)
    newEnd.setMonth(newEnd.getMonth() + 1)
    newEnd.setDate(0)
    newEnd.setHours(23, 59, 59, 999)
    
    setDisplayStartDate(newStart)
    setDisplayEndDate(newEnd)
  }, [])

  if (error) {
    return (
      <div className={`conditional-calendar error-state ${className}`}>
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 mb-2">❌ Erro ao carregar calendário</div>
            <p className="text-gray-300 mb-4">{error}</p>
            <GradientButton onClick={refetchData}>
              Tentar novamente
            </GradientButton>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`conditional-calendar ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selecione os Horários
        </h2>
        <p className="text-gray-300">
          {teacherId 
            ? 'Escolha os horários disponíveis para suas aulas'
            : 'Visualize a disponibilidade dos professores'
          }
        </p>
        {maxSelectableSlots && (
          <p className="text-sm text-gray-400 mt-1">
            Máximo de {maxSelectableSlots} horários podem ser selecionados
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main calendar */}
        <div className="xl:col-span-3">
          <Card className="p-6 border-white/20 backdrop-blur-sm">
            <CalendarHeader
              currentDate={currentDate}
              onPreviousMonth={handlePreviousMonth}
              onNextMonth={handleNextMonth}
              onToday={handleToday}
            />

            {loading ? (
              <div className="flex justify-center py-12">
                <Loading />
              </div>
            ) : (
              <>
                <DayNamesHeader />
                
                <div className="space-y-1">
                  {calendarWeeks.map(week => (
                    <div key={week.weekNumber} className="grid grid-cols-7 gap-1">
                      {week.days.map((day, dayIndex) => (
                        <CalendarDayCell
                          key={`${week.weekNumber}-${dayIndex}`}
                          day={day}
                          selectedSlots={selectedSlots}
                          onSlotSelect={onSlotSelect}
                          maxSelectableSlots={maxSelectableSlots}
                          enableMultiSelect={enableMultiSelect}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar with legend and progress */}
        <div className="xl:col-span-1 space-y-4">
          {showLegend && <CalendarLegend />}
          
          <CourseProgress 
            selectedSlots={selectedSlots}
            courseRequirements={courseRequirements}
          />

          {/* Selection summary */}
          {selectedSlots.length > 0 && (
            <Card className="p-4 border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-[#d400ff]" />
                <h4 className="text-sm font-semibold text-white">
                  Horários Selecionados
                </h4>
              </div>
              
              <div className="space-y-2">
                {selectedSlots.slice(0, 5).map((slot, index) => (
                  <div key={index} className="text-xs bg-black/20 rounded p-2">
                    <div className="text-white font-medium">
                      {slot.date.toLocaleDateString('pt-BR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </div>
                    <div className="text-gray-300">
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </div>
                  </div>
                ))}
                
                {selectedSlots.length > 5 && (
                  <div className="text-xs text-gray-400 text-center">
                    +{selectedSlots.length - 5} mais
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConditionalCalendar