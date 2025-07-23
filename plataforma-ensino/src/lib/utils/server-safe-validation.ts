/**
 * Server-Safe Validation Utilities
 * 
 * Provides validation functions that are safe to use in Server Components
 * and prevent SSR rendering errors in production builds.
 */

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

/**
 * Server-safe async validation wrapper
 * 
 * Handles async validation operations without Promise.race or timeouts
 * that can cause SSR issues in production builds.
 */
export async function serverSafeValidation<T>(
  validationFn: () => Promise<T>,
  fallbackValue: T,
  errorContext?: string
): Promise<T> {
  try {
    // Simple await without complex Promise orchestration
    return await validationFn()
  } catch (error) {
    console.warn(`Server-safe validation failed${errorContext ? ` (${errorContext})` : ''}:`, error)
    return fallbackValue
  }
}

/**
 * Batch validation without Promise.race
 * 
 * Runs multiple validations sequentially to avoid SSR timing issues
 */
export async function batchValidation<T extends Record<string, any>>(
  validations: Record<keyof T, () => Promise<boolean>>,
  context?: string
): Promise<ValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  for (const [field, validationFn] of Object.entries(validations)) {
    try {
      const isValid = await validationFn()
      if (!isValid) {
        errors.push(`Validation failed for field: ${field}`)
      }
    } catch (error) {
      const errorMsg = `Validation error for ${field}: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.warn(errorMsg)
      warnings.push(errorMsg)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Client-side validation check
 * 
 * Returns true if running in client environment where complex validations are safe
 */
export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Conditional validation based on environment
 * 
 * Runs full validation on client, simplified validation on server
 */
export async function conditionalValidation<T>(
  clientValidation: () => Promise<T>,
  serverValidation: () => Promise<T> | T
): Promise<T> {
  if (isClientSide()) {
    return await clientValidation()
  } else {
    return await Promise.resolve(serverValidation())
  }
}