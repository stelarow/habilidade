/**
 * SimplifiedWeeklySchedule component - Simplified weekly schedule display
 * 
 * Replaces the complex ConditionalCalendar with a simple weekly view showing:
 * - Days of the week (Monday to Saturday)
 * - Time slots with availability (e.g., "08:00 às 10:00 2/3 vagas preenchidas")
 * - Clear selection interface for enrollment form
 */

'use client'

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import Loading from '@/components/ui/Loading'
import { 
  ClockIcon, 
  UserGroupIcon, 
  CheckCircleIcon,
  CalendarDaysIcon 
} from '@heroicons/react/24/outline'

interface WeeklyScheduleSlot {
  id: string
  dayOfWeek: number // 1 = Monday, 6 = Saturday
  startTime: string
  endTime: string
  maxStudents: number
  currentStudents: number
  isAvailable: boolean
}

interface SimplifiedWeeklyScheduleProps {
  teacherId?: string
  onSlotSelect?: (slot1: string, slot2?: string) => void
  selectedSlots?: string[]
  maxSelectableSlots?: number
  hasTwoClassesPerWeek?: boolean
  className?: string
}

const DAYS_OF_WEEK = [
  { id: 1, name: 'Segunda-feira', short: 'Seg' },
  { id: 2, name: 'Terça-feira', short: 'Ter' },
  { id: 3, name: 'Quarta-feira', short: 'Qua' },
  { id: 4, name: 'Quinta-feira', short: 'Qui' },
  { id: 5, name: 'Sexta-feira', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' }
]

export default function SimplifiedWeeklySchedule({
  teacherId,
  onSlotSelect,
  selectedSlots = [],
  maxSelectableSlots = 1,
  hasTwoClassesPerWeek = false,
  className = ''
}: SimplifiedWeeklyScheduleProps) {
  const [scheduleSlots, setScheduleSlots] = useState<WeeklyScheduleSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  
  // Track component mount status to prevent setState on unmounted component
  const mountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])
  
  // Estabilizar cliente Supabase - evita re-renders infinitos
  const supabase = useMemo(() => createClient(), [])

  // Load teacher availability and current enrollments com useCallback otimizado
  const loadScheduleData = useCallback(async () => {
    if (!teacherId) {
      if (mountedRef.current) {
        setScheduleSlots([])
      }
      return
    }

    // Circuit breaker - evita loops infinitos
    if (errorCount > 3) {
      console.warn('Too many errors, stopping requests')
      if (mountedRef.current) {
        setError('Muitos erros consecutivos. Recarregue a página para tentar novamente.')
      }
      return
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    
    if (mountedRef.current) {
      setLoading(true)
      setError(null)
    }

    try {
      console.log('Loading availability and schedules for teacherId:', teacherId)
      
      // Check if component is still mounted before proceeding
      if (!mountedRef.current) {
        return
      }
      
      // Get teacher availability and current schedules in parallel
      // CORREÇÃO: Usar instructor_id (UUID) ao invés de user_id
      const [availabilityResult, schedulesResult] = await Promise.all([
        supabase
          .from('teacher_availability')
          .select('*')
          .eq('teacher_id', teacherId)
          .eq('is_active', true)
          .order('day_of_week')
          .order('start_time')
          .abortSignal(abortControllerRef.current?.signal),
        supabase
          .from('student_schedules')
          .select('*')
          .eq('instructor_id', teacherId) // CORREÇÃO: Usar teacherId diretamente como instructor_id
          .abortSignal(abortControllerRef.current?.signal)
      ])

      if (availabilityResult.error) {
        console.error('Error fetching teacher availability:', availabilityResult.error)
        throw availabilityResult.error
      }

      if (schedulesResult.error) {
        console.error('Error fetching student schedules:', schedulesResult.error)
        throw schedulesResult.error
      }

      const availability = availabilityResult.data
      const currentSchedules = schedulesResult.data

      console.log('Found', availability?.length || 0, 'availability slots')
      console.log('Found', currentSchedules?.length || 0, 'current schedules')

      // Check if component is still mounted before updating state
      if (!mountedRef.current) {
        return
      }
      
      // Validate data integrity
      if (!availability || availability.length === 0) {
        console.warn('No availability slots found for teacher:', teacherId)
        setScheduleSlots([])
        setErrorCount(0) // Reset error count on successful query
        return
      }

      // Process availability with current occupancy
      // Fix day-of-week conversion: teacher_availability uses 0-6, student_schedules uses 1-7
      const processedSlots: WeeklyScheduleSlot[] = (availability || []).map((slot, index) => {
        // Convert teacher_availability day_of_week (0-6) to student_schedules format (1-7)
        // 0 (Sunday) -> 7, 1 (Monday) -> 1, 2 (Tuesday) -> 2, ... 6 (Saturday) -> 6
        const schedulesDayOfWeek = slot.day_of_week === 0 ? 7 : slot.day_of_week
        
        // Find matching schedules for this time slot
        const matchingSchedules = (currentSchedules || []).filter(
          schedule => 
            schedule.day_of_week === schedulesDayOfWeek &&
            schedule.start_time === slot.start_time &&
            schedule.end_time === slot.end_time
        )
        
        const currentOccupancy = matchingSchedules.length

        // Log details for debugging (reduzido para evitar spam)
        if (index < 3) { // Log apenas os 3 primeiros slots
          console.log(`Slot ${index + 1}:`, {
            slotId: slot.id,
            teacherDayOfWeek: slot.day_of_week,
            schedulesDayOfWeek,
            startTime: slot.start_time,
            endTime: slot.end_time,
            maxStudents: slot.max_students,
            currentOccupancy
          })
        }

        // For display, we need Monday-Saturday (1-6), so convert Sunday (0) to 7 but filter it out later
        const displayDayOfWeek = slot.day_of_week === 0 ? 7 : slot.day_of_week

        return {
          id: slot.id,
          dayOfWeek: displayDayOfWeek,
          startTime: slot.start_time,
          endTime: slot.end_time,
          maxStudents: slot.max_students,
          currentStudents: currentOccupancy,
          isAvailable: currentOccupancy < slot.max_students
        }
      }).filter(slot => slot.dayOfWeek <= 6) // Only show Monday-Saturday (1-6)

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setScheduleSlots(processedSlots)
        setErrorCount(0) // Reset error count on success
        console.log('Successfully processed', processedSlots.length, 'schedule slots')
      }
      
    } catch (err) {
      // Ignore AbortError - it's expected when component unmounts
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      console.error('Error loading schedule data:', err)
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setErrorCount(prev => prev + 1)
      
        // Provide detailed error information for debugging
        let errorMessage = 'Erro desconhecido ao carregar horários'
        
        if (err instanceof Error) {
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            errorCount: errorCount + 1
          })
          
          if (err.message.includes('availability')) {
            errorMessage = 'Erro ao buscar disponibilidade do professor. O professor pode não ter horários configurados.'
          } else if (err.message.includes('schedules')) {
            errorMessage = 'Erro ao buscar horários ocupados. Verifique a tabela student_schedules.'
          } else {
            errorMessage = `Erro ao carregar horários: ${err.message}`
          }
        }
        
        setError(errorMessage)
      }
    } finally {
      // Only update loading state if component is still mounted
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [teacherId]) // Only depend on teacherId to prevent infinite loop

  // useEffect com dependências estáveis - carrega dados quando teacherId muda
  useEffect(() => {
    loadScheduleData()
  }, [teacherId]) // Direct dependency on teacherId instead of loadScheduleData

  // Group slots by day of week
  const slotsByDay = useMemo(() => {
    const grouped: Record<number, WeeklyScheduleSlot[]> = {}
    
    DAYS_OF_WEEK.forEach(day => {
      grouped[day.id] = scheduleSlots.filter(slot => slot.dayOfWeek === day.id)
    })
    
    return grouped
  }, [scheduleSlots])

  const handleSlotClick = useCallback((slotId: string) => {
    if (!onSlotSelect || !slotId) return

    const isSelected = selectedSlots.includes(slotId)
    let newSelection: string[] = []

    if (isSelected) {
      // Remove slot
      newSelection = selectedSlots.filter(id => id !== slotId)
    } else {
      // Add slot
      if (hasTwoClassesPerWeek && selectedSlots.length < 2) {
        newSelection = [...selectedSlots, slotId]
      } else if (!hasTwoClassesPerWeek) {
        newSelection = [slotId]
      } else if (selectedSlots.length >= maxSelectableSlots) {
        // Replace oldest slot
        newSelection = [...selectedSlots.slice(1), slotId]
      } else {
        newSelection = [...selectedSlots, slotId]
      }
    }

    // Always pass valid strings - never undefined
    const slot1 = newSelection[0] || ''
    const slot2 = newSelection[1] || ''
    
    console.log('Slot selection:', { slot1, slot2, newSelection })
    onSlotSelect(slot1, slot2)
  }, [onSlotSelect, selectedSlots, hasTwoClassesPerWeek, maxSelectableSlots])

  const formatTime = (time: string) => {
    return time.slice(0, 5) // Remove seconds
  }

  const getSlotStatusText = (slot: WeeklyScheduleSlot) => {
    if (slot.currentStudents >= slot.maxStudents) {
      return `${slot.currentStudents}/${slot.maxStudents} vagas preenchidas`
    }
    return `${slot.currentStudents}/${slot.maxStudents} vagas preenchidas`
  }

  const getSlotStatusColor = (slot: WeeklyScheduleSlot, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-purple-600 border-purple-500 text-white'
    }
    if (!slot.isAvailable) {
      return 'bg-red-500/20 border-red-500/50 text-red-300 cursor-not-allowed'
    }
    return 'bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30 cursor-pointer'
  }

  if (!teacherId) {
    return (
      <Card className="p-6 border-gray-600 bg-gray-800/50">
        <div className="text-center py-8">
          <CalendarDaysIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            Selecione um professor para visualizar os horários disponíveis
          </p>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="p-6 border-gray-600 bg-gray-800/50">
        <div className="text-center py-8">
          <Loading />
          <p className="text-gray-400 mt-4">Carregando horários...</p>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-red-500/50 bg-red-500/10">
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">❌ Erro ao carregar horários</div>
          <p className="text-gray-300 mb-4">{error}</p>
          {errorCount > 3 && (
            <button
              onClick={() => {
                if (mountedRef.current) {
                  setErrorCount(0)
                  setError(null)
                  loadScheduleData()
                }
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Tentar Novamente
            </button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className={`simplified-weekly-schedule ${className}`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDaysIcon className="w-6 h-6 text-[#00c4ff]" />
          <h3 className="text-xl font-semibold text-white">Horários Semanais</h3>
        </div>
        <p className="text-gray-300 text-sm">
          Selecione {hasTwoClassesPerWeek ? 'até 2 horários' : '1 horário'} para as aulas presenciais
        </p>
      </div>

      <div className="space-y-6">
        {DAYS_OF_WEEK.map(day => {
          const daySlots = slotsByDay[day.id] || []
          
          return (
            <div key={day.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-[#d400ff]" />
                {day.name}
              </h4>
              
              {daySlots.length > 0 ? (
                <div className="space-y-2">
                  {daySlots.map(slot => {
                    const isSelected = selectedSlots.includes(slot.id)
                    const canSelect = slot.isAvailable && (
                      selectedSlots.length < maxSelectableSlots || isSelected
                    )
                    
                    return (
                      <button
                        key={slot.id}
                        onClick={() => canSelect && handleSlotClick(slot.id)}
                        disabled={!canSelect}
                        className={`
                          w-full p-3 rounded-md border transition-all duration-200
                          flex items-center justify-between text-left
                          ${getSlotStatusColor(slot, isSelected)}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                          ) : (
                            <ClockIcon className="w-5 h-5" />
                          )}
                          <span className="font-medium">
                            {formatTime(slot.startTime)} às {formatTime(slot.endTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="w-4 h-4" />
                          <span className="text-sm">
                            {getSlotStatusText(slot)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Nenhum horário disponível neste dia</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Selection Summary */}
      {selectedSlots.length > 0 && (
        <Card className="mt-6 p-4 border-purple-500/30 bg-purple-900/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircleIcon className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-semibold text-white">
              Horários Selecionados ({selectedSlots.length}/{maxSelectableSlots})
            </h4>
          </div>
          
          <div className="space-y-2">
            {selectedSlots.map(slotId => {
              const slot = scheduleSlots.find(s => s.id === slotId)
              if (!slot) return null
              
              const dayName = DAYS_OF_WEEK.find(d => d.id === slot.dayOfWeek)?.name || ''
              
              return (
                <div key={slotId} className="text-sm bg-black/20 rounded p-2">
                  <div className="text-purple-300 font-medium">{dayName}</div>
                  <div className="text-gray-300">
                    {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}