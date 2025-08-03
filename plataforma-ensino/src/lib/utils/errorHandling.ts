/**
 * Error handling utilities for the application
 */

export function handleQueryError(error: Error): void {
  console.error('Query error:', error);
  // Add proper error logging/reporting here
}

export function handleMutationError(error: Error): void {
  console.error('Mutation error:', error);
  // Add proper error logging/reporting here
}