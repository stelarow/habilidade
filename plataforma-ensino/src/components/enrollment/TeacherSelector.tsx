/**
 * TeacherSelector component for course enrollment flow
 * 
 * Integrates with MCP Supabase for real-time teacher data and MCP Context7
 * for component implementation guidance. Provides filtered teacher selection
 * with availability-based filtering and real-time status updates.
 * 
 * @param props - TeacherSelectorProps interface
 * @returns React component with teacher selection functionality
 * 
 * @example
 * ```tsx
 * <TeacherSelector
 *   onTeacherSelect={(teacher) => setSelectedTeacher(teacher)}
 *   selectedCourse={currentCourse}
 *   availabilityFilter={{ startDate: new Date(), endDate: endDate }}
 * />
 * ```
 */

'use client'

import React, { useState, useEffect, useMemo, useCallback, useId } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Card } from '@/components/ui/card'
import GradientButton from '@/components/ui/GradientButton'
import Loading from '@/components/ui/Loading'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { Star, User, Clock, Users, Search, Filter } from 'lucide-react'
import { aggregateAvailabilityForCalendar, subscribeToAvailabilityUpdates } from '@/utils/teacherAvailabilityLogic'

export interface Teacher {
  id: string
  name: string
  bio: string
  profileImage?: string
  rating: number
  specialties: string[]
  availability: TeacherAvailability[]
  maxStudentsPerClass: number
  isActive: boolean
  email: string
  phone?: string
  experience_years?: number
  qualifications?: string[]
}

export interface TeacherAvailability {
  id: string
  teacher_id: string
  day_of_week: number
  start_time: string
  end_time: string
  max_students: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  category: string
  duration_hours: number
  max_students: number
}

export interface TeacherSelectorProps {
  onTeacherSelect: (teacher: Teacher) => void
  selectedCourse?: Course
  availabilityFilter?: {
    startDate: Date
    endDate: Date
    timeSlots?: string[]
  }
  className?: string
}

interface TeacherWithAvailabilityInfo extends Teacher {
  availableSlots: number
  nextAvailableDate?: string
  capacityUtilization: number
}

/**
 * Custom hook for teacher data fetching with real-time updates
 */
function useTeacherData(availabilityFilter?: TeacherSelectorProps['availabilityFilter']) {
  const [teachers, setTeachers] = useState<TeacherWithAvailabilityInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Query teachers with availability using MCP Supabase pattern
      const { data: teachersData, error: teachersError } = await supabase
        .from('teachers')
        .select(`
          id,
          name,
          bio,
          profile_image,
          rating,
          specialties,
          max_students_per_class,
          is_active,
          email,
          phone,
          experience_years,
          qualifications,
          teacher_availability (
            id,
            teacher_id,
            day_of_week,
            start_time,
            end_time,
            max_students,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .order('name')

      if (teachersError) {
        throw new Error(`Failed to fetch teachers: ${teachersError.message}`)
      }

      if (!teachersData) {
        setTeachers([])
        return
      }

      // Transform data and calculate availability info
      const enrichedTeachers: TeacherWithAvailabilityInfo[] = await Promise.all(
        teachersData.map(async (teacherData) => {
          const teacher: Teacher = {
            id: teacherData.id,
            name: teacherData.name,
            bio: teacherData.bio,
            profileImage: teacherData.profile_image,
            rating: teacherData.rating || 0,
            specialties: teacherData.specialties || [],
            availability: teacherData.teacher_availability || [],
            maxStudentsPerClass: teacherData.max_students_per_class || 1,
            isActive: teacherData.is_active,
            email: teacherData.email,
            phone: teacherData.phone,
            experience_years: teacherData.experience_years,
            qualifications: teacherData.qualifications || []
          }

          // Calculate availability info if filter is provided
          let availableSlots = 0
          let nextAvailableDate: string | undefined
          let capacityUtilization = 0

          if (availabilityFilter) {
            try {
              const month = availabilityFilter.startDate.getMonth() + 1
              const year = availabilityFilter.startDate.getFullYear()
              
              const aggregatedData = await aggregateAvailabilityForCalendar(
                teacher.id,
                month,
                year
              )

              availableSlots = Object.values(aggregatedData).reduce(
                (sum, day) => sum + day.availableSlots,
                0
              )

              // Find next available date
              const sortedDates = Object.keys(aggregatedData)
                .filter(date => aggregatedData[date].availableSlots > 0)
                .sort()
              nextAvailableDate = sortedDates[0]

              // Calculate capacity utilization
              const totalCapacity = Object.values(aggregatedData).reduce(
                (sum, day) => sum + day.capacity.maxStudents,
                0
              )
              const usedCapacity = Object.values(aggregatedData).reduce(
                (sum, day) => sum + day.capacity.currentEnrollments,
                0
              )
              capacityUtilization = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0
            } catch (error) {
              console.warn(`Failed to fetch availability info for teacher ${teacher.id}:`, error)
            }
          }

          return {
            ...teacher,
            availableSlots,
            nextAvailableDate,
            capacityUtilization
          }
        })
      )

      setTeachers(enrichedTeachers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Teacher data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, availabilityFilter])

  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  return { teachers, loading, error, refetchTeachers: fetchTeachers }
}

/**
 * Custom hook for real-time teacher availability updates
 */
function useRealtimeUpdates(teachers: TeacherWithAvailabilityInfo[], onUpdate: () => void) {
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  useEffect(() => {
    if (teachers.length === 0) return

    const unsubscribers: (() => void)[] = []

    // Set up subscriptions for each teacher
    teachers.forEach(teacher => {
      const unsubscribe = subscribeToAvailabilityUpdates(
        teacher.id,
        (payload) => {
          console.log('Teacher availability updated:', payload)
          onUpdate()
        }
      )
      unsubscribers.push(unsubscribe)
    })

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe())
    }
  }, [teachers, onUpdate, supabase])
}

/**
 * Individual teacher card component
 */
function TeacherCard({ 
  teacher, 
  onSelect, 
  isSelected = false 
}: { 
  teacher: TeacherWithAvailabilityInfo
  onSelect: (teacher: Teacher) => void
  isSelected?: boolean 
}) {
  const cardId = useId()

  const formatNextAvailableDate = (dateStr?: string) => {
    if (!dateStr) return 'No availability'
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const getCapacityColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-400'
    if (utilization >= 70) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <Card 
      className={`
        teacher-selector-card p-6 cursor-pointer transition-all duration-300
        border border-white/20 backdrop-blur-sm
        ${isSelected 
          ? 'ring-2 ring-[#d400ff] bg-gradient-to-br from-[#d400ff]/20 to-[#a000ff]/10' 
          : 'hover:bg-white/5 hover:border-white/30'
        }
      `}
      onClick={() => onSelect(teacher)}
      role="button"
      tabIndex={0}
      aria-label={`Select teacher ${teacher.name}`}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(teacher)
        }
      }}
    >
      <div className="flex items-start gap-4">
        {/* Profile Image */}
        <div className="relative">
          {teacher.profileImage ? (
            <Image
              src={teacher.profileImage}
              alt={`${teacher.name} profile`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#d400ff] to-[#a000ff] 
                         flex items-center justify-center text-white text-xl font-semibold"
            >
              <User size={24} />
            </div>
          )}
          {/* Online status indicator */}
          <div 
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full 
                       border-2 border-gray-900"
            title="Online"
          />
        </div>

        {/* Teacher Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-white truncate">
                {teacher.name}
              </h3>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(teacher.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-600'
                    }
                  />
                ))}
                <span className="text-sm text-gray-300 ml-1">
                  {teacher.rating.toFixed(1)}
                </span>
              </div>
            </div>
            
            {/* Availability badge */}
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-xs">
                <Clock size={12} />
                <span className="text-gray-300">
                  {formatNextAvailableDate(teacher.nextAvailableDate)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Users size={12} />
                <span className={getCapacityColor(teacher.capacityUtilization)}>
                  {teacher.capacityUtilization.toFixed(0)}% ocupado
                </span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {teacher.bio}
          </p>

          {/* Specialties */}
          {teacher.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {teacher.specialties.slice(0, 3).map((specialty, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-[#00c4ff]/20 text-[#00c4ff] 
                           rounded-full border border-[#00c4ff]/30"
                >
                  {specialty}
                </span>
              ))}
              {teacher.specialties.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{teacher.specialties.length - 3} mais
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {teacher.experience_years ? 
                `${teacher.experience_years} anos de experiência` : 
                'Experiência não informada'
              }
            </span>
            <span>
              {teacher.availableSlots} slots disponíveis
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * Teacher filter controls
 */
function TeacherFilters({
  searchTerm,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  availableSpecialties,
  minRating,
  onMinRatingChange
}: {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedSpecialty: string
  onSpecialtyChange: (specialty: string) => void
  availableSpecialties: string[]
  minRating: number
  onMinRatingChange: (rating: number) => void
}) {
  const searchId = useId()
  const specialtyId = useId()
  const ratingId = useId()

  return (
    <div className="glass-bg rounded-lg p-4 border border-white/20 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className="text-[#d400ff]" />
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor={searchId} className="block text-sm text-gray-300 mb-2">
            Buscar professor
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id={searchId}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nome ou especialidade..."
              className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/20 rounded-lg
                         text-white placeholder-gray-400 focus:border-[#d400ff] focus:outline-none
                         transition-colors duration-200"
            />
          </div>
        </div>

        {/* Specialty filter */}
        <div>
          <label htmlFor={specialtyId} className="block text-sm text-gray-300 mb-2">
            Especialidade
          </label>
          <select
            id={specialtyId}
            value={selectedSpecialty}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg
                       text-white focus:border-[#d400ff] focus:outline-none
                       transition-colors duration-200"
          >
            <option value="">Todas especialidades</option>
            {availableSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </div>

        {/* Rating filter */}
        <div>
          <label htmlFor={ratingId} className="block text-sm text-gray-300 mb-2">
            Avaliação mínima
          </label>
          <select
            id={ratingId}
            value={minRating}
            onChange={(e) => onMinRatingChange(Number(e.target.value))}
            className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg
                       text-white focus:border-[#d400ff] focus:outline-none
                       transition-colors duration-200"
          >
            <option value={0}>Qualquer avaliação</option>
            <option value={3}>3+ estrelas</option>
            <option value={4}>4+ estrelas</option>
            <option value={4.5}>4.5+ estrelas</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export function TeacherSelector({
  onTeacherSelect,
  selectedCourse,
  availabilityFilter,
  className = ''
}: TeacherSelectorProps) {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [minRating, setMinRating] = useState(0)

  const { teachers, loading, error, refetchTeachers } = useTeacherData(availabilityFilter)

  // Set up real-time updates
  useRealtimeUpdates(teachers, refetchTeachers)

  // Filter teachers based on search and filter criteria
  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      // Text search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesName = teacher.name.toLowerCase().includes(searchLower)
        const matchesBio = teacher.bio.toLowerCase().includes(searchLower)
        const matchesSpecialty = teacher.specialties.some(s => 
          s.toLowerCase().includes(searchLower)
        )
        if (!matchesName && !matchesBio && !matchesSpecialty) {
          return false
        }
      }

      // Specialty filter
      if (selectedSpecialty && !teacher.specialties.includes(selectedSpecialty)) {
        return false
      }

      // Rating filter
      if (teacher.rating < minRating) {
        return false
      }

      // Availability filter
      if (availabilityFilter && teacher.availableSlots === 0) {
        return false
      }

      return true
    })
  }, [teachers, searchTerm, selectedSpecialty, minRating, availabilityFilter])

  // Get available specialties for filter
  const availableSpecialties = useMemo(() => {
    const specialties = new Set<string>()
    teachers.forEach(teacher => {
      teacher.specialties.forEach(specialty => specialties.add(specialty))
    })
    return Array.from(specialties).sort()
  }, [teachers])

  const handleTeacherSelect = useCallback((teacher: Teacher) => {
    setSelectedTeacher(teacher)
    onTeacherSelect(teacher)
  }, [onTeacherSelect])

  if (error) {
    return (
      <div className={`teacher-selector error-state ${className}`}>
        <Card className="p-6 border-red-500/50 bg-red-500/10">
          <div className="text-center">
            <div className="text-red-400 mb-2">❌ Erro ao carregar professores</div>
            <p className="text-gray-300 mb-4">{error}</p>
            <GradientButton onClick={refetchTeachers}>
              Tentar novamente
            </GradientButton>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className={`teacher-selector ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Selecione seu Professor
        </h2>
        <p className="text-gray-300">
          {selectedCourse 
            ? `Escolha o professor ideal para o curso "${selectedCourse.title}"`
            : 'Escolha o professor que melhor atende às suas necessidades'
          }
        </p>
        {availabilityFilter && (
          <p className="text-sm text-gray-400 mt-1">
            Mostrando apenas professores com disponibilidade entre{' '}
            {availabilityFilter.startDate.toLocaleDateString('pt-BR')} e{' '}
            {availabilityFilter.endDate.toLocaleDateString('pt-BR')}
          </p>
        )}
      </div>

      <TeacherFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSpecialty={selectedSpecialty}
        onSpecialtyChange={setSelectedSpecialty}
        availableSpecialties={availableSpecialties}
        minRating={minRating}
        onMinRatingChange={setMinRating}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {filteredTeachers.length} professor{filteredTeachers.length !== 1 ? 'es' : ''} encontrado{filteredTeachers.length !== 1 ? 's' : ''}
            </span>
            {selectedTeacher && (
              <span className="text-sm text-[#d400ff]">
                ✓ {selectedTeacher.name} selecionado
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeachers.map(teacher => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onSelect={handleTeacherSelect}
                isSelected={selectedTeacher?.id === teacher.id}
              />
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <Card className="p-8 text-center border-white/10">
              <div className="text-gray-400 mb-4">🔍 Nenhum professor encontrado</div>
              <p className="text-gray-300 mb-4">
                Tente ajustar os filtros ou ampliar os critérios de busca
              </p>
              <GradientButton 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialty('')
                  setMinRating(0)
                }}
              >
                Limpar filtros
              </GradientButton>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

export default TeacherSelector