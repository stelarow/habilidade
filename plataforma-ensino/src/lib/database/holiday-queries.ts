/**
 * Holiday Database Query Utilities
 * Centralized and optimized database queries for holidays
 */

import { createClient } from '@/lib/supabase/server'
import type { HolidaysQuery, Holiday } from '@/types/api'

/**
 * Builds a filtered holiday query based on parameters
 */
export function buildHolidayQuery(
  supabase: ReturnType<typeof createClient>,
  filters: HolidaysQuery
) {
  let query = supabase
    .from('holidays')
    .select('*')
    .order('date', { ascending: true })

  // Apply year filter
  if (filters.year) {
    query = query
      .gte('date', `${filters.year}-01-01`)
      .lt('date', `${filters.year + 1}-01-01`)
  }

  // Apply month filter (requires year)
  if (filters.month && filters.year) {
    const startOfMonth = `${filters.year}-${filters.month.toString().padStart(2, '0')}-01`
    const nextMonth = filters.month === 12 ? 1 : filters.month + 1
    const nextYear = filters.month === 12 ? filters.year + 1 : filters.year
    const startOfNextMonth = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`
    
    query = query
      .gte('date', startOfMonth)
      .lt('date', startOfNextMonth)
  }

  // Apply date range filters
  if (filters.startDate) {
    query = query.gte('date', filters.startDate)
  }

  if (filters.endDate) {
    query = query.lte('date', filters.endDate)
  }

  // Apply national filter
  if (filters.isNational !== undefined) {
    query = query.eq('is_national', filters.isNational)
  }

  return query
}

/**
 * Checks if a holiday exists on a specific date
 */
export async function checkHolidayExists(
  supabase: ReturnType<typeof createClient>,
  date: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from('holidays')
    .select('id')
    .eq('date', date)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data } = await query.single()
  return !!data
}

/**
 * Gets a holiday by ID with proper error handling
 */
export async function getHolidayById(
  supabase: ReturnType<typeof createClient>,
  id: string
): Promise<Holiday | null> {
  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Test database connectivity
 */
export async function testDatabaseConnection(
  supabase: ReturnType<typeof createClient>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('holidays')
      .select('count')
      .limit(1)
    
    return !error
  } catch {
    return false
  }
}