/**
 * Custom hook for teacher data management with MCP Supabase integration
 * Story 2.2: UI Components Integration - Task 1
 * 
 * Handles teacher data fetching, real-time updates, and error management
 * with comprehensive availability calculations and capacity tracking.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import type { Teacher, TeacherAvailability } from '@/components/enrollment/TeacherSelector'
import { aggregateAvailabilityForCalendar } from '@/utils/teacherAvailabilityLogic'

export interface TeacherWithAvailabilityInfo extends Teacher {
  availableSlots: number
  nextAvailableDate?: string
  capacityUtilization: number
  totalWeeklyHours: number
  averageResponseTime: number // in hours
}

export interface UseTeacherDataOptions {
  availabilityFilter?: {
    startDate: Date
    endDate: Date
    timeSlots?: string[]
  }
  courseFilter?: {
    category?: string
    maxStudents?: number
    duration?: number
  }
  enableRealtime?: boolean
  refreshInterval?: number // in milliseconds
}

export interface UseTeacherDataReturn {
  teachers: TeacherWithAvailabilityInfo[]
  loading: boolean
  error: string | null
  refetchTeachers: () => Promise<void>
  searchTeachers: (query: string) => TeacherWithAvailabilityInfo[]
  filterBySpecialty: (specialty: string) => TeacherWithAvailabilityInfo[]
  filterByRating: (minRating: number) => TeacherWithAvailabilityInfo[]
  getTeacherById: (id: string) => TeacherWithAvailabilityInfo | undefined
  getTopRatedTeachers: (limit?: number) => TeacherWithAvailabilityInfo[]
}

/**
 * Enhanced hook for teacher data management with comprehensive filtering and real-time updates
 */
export function useTeacherData(options: UseTeacherDataOptions = {}): UseTeacherDataReturn {
  const {
    availabilityFilter,
    courseFilter,
    enableRealtime = true,
    refreshInterval = 30000 // 30 seconds
  } = options

  const [teachers, setTeachers] = useState<TeacherWithAvailabilityInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), [])

  /**
   * Calculate enhanced teacher metrics including availability and performance data
   */
  const calculateTeacherMetrics = useCallback(async (teacher: Teacher): Promise<TeacherWithAvailabilityInfo> => {
    let availableSlots = 0
    let nextAvailableDate: string | undefined
    let capacityUtilization = 0
    let totalWeeklyHours = 0
    let averageResponseTime = 24 // Default 24 hours

    try {
      // Calculate weekly hours from availability patterns
      totalWeeklyHours = teacher.availability.reduce((total, slot) => {
        const startTime = new Date(`1970-01-01T${slot.start_time}:00`)
        const endTime = new Date(`1970-01-01T${slot.end_time}:00`)
        const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
        return total + hours
      }, 0)

      // Calculate availability metrics if filter is provided
      if (availabilityFilter) {
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
          .filter((date: any) => aggregatedData[date].availableSlots > 0)
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
      }

      // Calculate average response time from messages table (if exists)
      try {
        const { data: responseData } = await supabase
          .from('teacher_messages')
          .select('response_time_hours')
          .eq('teacher_id', teacher.id)
          .not('response_time_hours', 'is', null)
          .limit(10)

        if (responseData && responseData.length > 0) {
          averageResponseTime = responseData.reduce(
            (sum, msg) => sum + msg.response_time_hours,
            0
          ) / responseData.length
        }
      } catch (error) {
        // Response time calculation failed, use default
        console.warn(`Failed to calculate response time for teacher ${teacher.id}:`, error)
      }

    } catch (error) {
      console.warn(`Failed to calculate metrics for teacher ${teacher.id}:`, error)
    }

    return {
      ...teacher,
      availableSlots,
      nextAvailableDate,
      capacityUtilization,
      totalWeeklyHours,
      averageResponseTime
    }
  }, [supabase, availabilityFilter])

  /**
   * Fetch teachers from database with comprehensive data
   */
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Build dynamic query based on filters
      let query = supabase
        .from('instructors')
        .select(`
          id,
          user_id,
          bio,
          rating,
          expertise,
          total_reviews,
          created_at,
          updated_at,
          users!inner(
            full_name,
            email,
            avatar_url,
            role
          ),
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

      // Apply course-specific filters
      if (courseFilter?.maxStudents) {
        query = query.gte('max_students_per_class', courseFilter.maxStudents)
      }

      // Execute query with sorting
      const { data: teachersData, error: teachersError } = await query
        .order('rating', { ascending: false })
        .order('name')

      if (teachersError) {
        throw new Error(`TEACHER_DATA_FETCH_ERROR: ${teachersError.message}`)
      }

      if (!teachersData) {
        setTeachers([])
        return
      }

      // Transform and enrich teacher data
      const enrichedTeachers: TeacherWithAvailabilityInfo[] = await Promise.all(
        teachersData.map(async (teacherData) => {
          const teacher: Teacher = {
            id: teacherData.id,
            userId: teacherData.user_id,
            name: (teacherData.users as any)?.[0]?.full_name || (teacherData.users as any)?.full_name || 'Nome não disponível',
            bio: teacherData.bio || '',
            profileImage: (teacherData.users as any)?.[0]?.avatar_url || (teacherData.users as any)?.avatar_url,
            rating: teacherData.rating || 0,
            specialties: teacherData.expertise || [],
            availability: (teacherData.teacher_availability || []).filter(
              (avail: any) => avail.is_active
            ),
            maxStudentsPerClass: 1, // Default value since this field doesn't exist in instructors table
            isActive: true, // All fetched instructors are active based on the query filter
            email: (teacherData.users as any)?.[0]?.email || (teacherData.users as any)?.email || '',
            phone: '', // This field doesn't exist in the schema
            experience_years: 0, // This field doesn't exist in the schema
            qualifications: [] // This field doesn't exist in the schema
          }

          return await calculateTeacherMetrics(teacher)
        })
      )

      // Apply additional filtering based on availability
      let filteredTeachers = enrichedTeachers

      if (availabilityFilter) {
        filteredTeachers = enrichedTeachers.filter((teacher: any) => {
          // Filter by availability slots if required
          if (availabilityFilter.timeSlots && availabilityFilter.timeSlots.length > 0) {
            return teacher.availability.some((avail: any) => 
              availabilityFilter.timeSlots!.some((timeSlot: any) => {
                const [startHour] = timeSlot.split(':')
                const [availStartHour] = avail.start_time.split(':')
                return startHour === availStartHour
              })
            )
          }
          return true
        })
      }

      if (courseFilter?.category) {
        filteredTeachers = filteredTeachers.filter((teacher: any) =>
          teacher.specialties.some((specialty: any) => 
            specialty.toLowerCase().includes(courseFilter.category!.toLowerCase())
          )
        )
      }

      setTeachers(filteredTeachers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
      setError(errorMessage)
      console.error('Teacher data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase, availabilityFilter, courseFilter, calculateTeacherMetrics])

  /**
   * Search teachers by name, bio, or specialties
   */
  const searchTeachers = useCallback((query: string): TeacherWithAvailabilityInfo[] => {
    if (!query.trim()) return teachers

    const searchLower = query.toLowerCase()
    return teachers.filter((teacher: any) => 
      teacher.name.toLowerCase().includes(searchLower) ||
      teacher.bio.toLowerCase().includes(searchLower) ||
      teacher.specialties.some((specialty: any) => 
        specialty.toLowerCase().includes(searchLower)
      )
    )
  }, [teachers])

  /**
   * Filter teachers by specialty
   */
  const filterBySpecialty = useCallback((specialty: string): TeacherWithAvailabilityInfo[] => {
    if (!specialty) return teachers
    return teachers.filter((teacher: any) => teacher.specialties.includes(specialty))
  }, [teachers])

  /**
   * Filter teachers by minimum rating
   */
  const filterByRating = useCallback((minRating: number): TeacherWithAvailabilityInfo[] => {
    return teachers.filter((teacher: any) => teacher.rating >= minRating)
  }, [teachers])

  /**
   * Get teacher by ID
   */
  const getTeacherById = useCallback((id: string): TeacherWithAvailabilityInfo | undefined => {
    return teachers.find((teacher: any) => teacher.id === id)
  }, [teachers])

  /**
   * Get top-rated teachers
   */
  const getTopRatedTeachers = useCallback((limit = 5): TeacherWithAvailabilityInfo[] => {
    return [...teachers]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  }, [teachers])

  // Initial data fetch
  useEffect(() => {
    fetchTeachers()
  }, [fetchTeachers])

  // Set up periodic refresh if enabled
  useEffect(() => {
    if (!enableRealtime || refreshInterval <= 0) return

    const intervalId = setInterval(() => {
      console.log('Refreshing teacher data...')
      fetchTeachers()
    }, refreshInterval)

    return () => clearInterval(intervalId)
  }, [enableRealtime, refreshInterval, fetchTeachers])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!enableRealtime) return

    const channel = supabase
      .channel('teacher-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teachers'
        },
        (payload) => {
          console.log('Teacher data updated:', payload)
          fetchTeachers()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_availability'
        },
        (payload) => {
          console.log('Teacher availability updated:', payload)
          fetchTeachers()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, enableRealtime, fetchTeachers])

  return {
    teachers,
    loading,
    error,
    refetchTeachers: fetchTeachers,
    searchTeachers,
    filterBySpecialty,
    filterByRating,
    getTeacherById,
    getTopRatedTeachers
  }
}