// Instructor validation utilities
// Helps validate and debug instructor-related issues in enrollment process

import { createClient } from '@/lib/supabase/client'
import { logDebug, logWarn, logError } from '@/lib/utils/logger'

export interface InstructorValidationResult {
  isValid: boolean
  instructorIds: string[]
  foundInstructors: any[]
  missingInstructors: string[]
  invalidRoleInstructors: any[]
  errors: string[]
  warnings: string[]
}

/**
 * Validates if instructors exist and have proper roles for enrollment
 */
export async function validateInstructors(
  instructorIds: string[]
): Promise<InstructorValidationResult> {
  const result: InstructorValidationResult = {
    isValid: false,
    instructorIds,
    foundInstructors: [],
    missingInstructors: [],
    invalidRoleInstructors: [],
    errors: [],
    warnings: []
  }

  if (!instructorIds || instructorIds.length === 0) {
    result.errors.push('Nenhum ID de instrutor fornecido')
    return result
  }

  try {
    const supabase = createClient()
    
    // Query instructors from database
    const { data: instructors, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, created_at')
      .in('id', instructorIds)

    if (error) {
      result.errors.push(`Erro ao consultar instrutores: ${error.message}`)
      return result
    }

    result.foundInstructors = instructors || []
    
    // Check for missing instructors
    const foundIds = result.foundInstructors.map(i => i.id)
    result.missingInstructors = instructorIds.filter(id => !foundIds.includes(id))
    
    if (result.missingInstructors.length > 0) {
      result.errors.push(
        `Instrutores não encontrados: ${result.missingInstructors.join(', ')}`
      )
    }

    // Check for invalid roles
    result.invalidRoleInstructors = result.foundInstructors.filter(
      i => !['admin', 'instructor'].includes(i.role)
    )
    
    if (result.invalidRoleInstructors.length > 0) {
      result.errors.push(
        `Instrutores com função inválida: ${result.invalidRoleInstructors
          .map(i => `${i.full_name} (${i.role})`)
          .join(', ')}`
      )
    }

    // Add warnings for any issues
    if (result.foundInstructors.length < instructorIds.length) {
      result.warnings.push(
        `Encontrados ${result.foundInstructors.length} de ${instructorIds.length} instrutores solicitados`
      )
    }

    // Determine if validation passed
    result.isValid = result.errors.length === 0

    return result
  } catch (error) {
    result.errors.push(`Erro interno de validação: ${error}`)
    return result
  }
}

/**
 * Checks if an instructor exists and has proper role
 */
export async function checkInstructorExists(instructorId: string): Promise<{
  exists: boolean
  instructor?: any
  hasValidRole: boolean
  error?: string
}> {
  try {
    const supabase = createClient()
    
    const { data: instructor, error } = await supabase
      .from('users')
      .select('id, full_name, email, role')
      .eq('id', instructorId)
      .single()

    if (error) {
      return {
        exists: false,
        hasValidRole: false,
        error: error.message
      }
    }

    const hasValidRole = ['admin', 'instructor'].includes(instructor.role)

    return {
      exists: !!instructor,
      instructor,
      hasValidRole,
    }
  } catch (error) {
    return {
      exists: false,
      hasValidRole: false,
      error: `Erro interno: ${error}`
    }
  }
}

/**
 * Gets all available instructors for UI components
 */
export async function getAvailableInstructors(): Promise<{
  instructors: any[]
  error?: string
}> {
  try {
    const supabase = createClient()
    
    const { data: instructors, error } = await supabase
      .from('users')
      .select('id, full_name, email, role, avatar_url')
      .in('role', ['admin', 'instructor'])
      .order('full_name')

    if (error) {
      return {
        instructors: [],
        error: error.message
      }
    }

    return {
      instructors: instructors || []
    }
  } catch (error) {
    return {
      instructors: [],
      error: `Erro interno: ${error}`
    }
  }
}

/**
 * Debug utility to log instructor validation issues
 */
export function logInstructorValidationIssues(
  validation: InstructorValidationResult,
  context: string = 'Enrollment'
) {
  console.group(`🔍 ${context} - Instructor Validation`)
  
  logDebug('📋 Requested Instructor IDs:', validation.instructorIds)
  logDebug('✅ Found Instructors:', validation.foundInstructors.length)
  
  if (validation.foundInstructors.length > 0) {
    console.table(validation.foundInstructors.map(i => ({
      ID: i.id,
      Name: i.full_name,
      Email: i.email,
      Role: i.role
    })))
  }
  
  if (validation.missingInstructors.length > 0) {
    logWarn('❌ Missing Instructors:', validation.missingInstructors)
  }
  
  if (validation.invalidRoleInstructors.length > 0) {
    logWarn('⚠️ Invalid Role Instructors:')
    console.table(validation.invalidRoleInstructors.map(i => ({
      ID: i.id,
      Name: i.full_name,
      Current_Role: i.role,
      Required_Roles: 'admin, instructor'
    })))
  }
  
  if (validation.errors.length > 0) {
    logError('❌ Validation Errors:')
    validation.errors.forEach(error => logError(`   - ${error}`))
  }
  
  if (validation.warnings.length > 0) {
    logWarn('⚠️ Validation Warnings:')
    validation.warnings.forEach(warning => logWarn(`   - ${warning}`))
  }
  
  logDebug('🏁 Validation Result:', validation.isValid ? 'PASSED' : 'FAILED')
  console.groupEnd()
}