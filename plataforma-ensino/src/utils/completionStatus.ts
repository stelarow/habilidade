/**
 * Completion Status Utilities
 * Story 2.2: Teacher Calendar Visual Enhancements
 * 
 * Utility functions for calculating and managing course completion status
 * indicators on the teacher calendar interface
 */

import { parseDateISO, formatDateISO } from './dateCalculations';
import { 
  CompletionStatus, 
  CompletionIndicatorType, 
  CompletionCalculationInput,
  StudentIndicator 
} from '@/types/completion-status';
import { logError } from '@/lib/utils/logger';

/**
 * Number of days threshold for "one month remaining" indicator
 */
export const ONE_MONTH_THRESHOLD = 28;

/**
 * Calculate completion status based on end date and current date
 * @param endDate - Course end date in ISO format (YYYY-MM-DD)
 * @param currentDate - Current date in ISO format, defaults to today
 * @returns CompletionStatus object with indicator information
 */
export function calculateCompletionStatus(
  endDate: string,
  currentDate?: string
): CompletionStatus {
  try {
    const endDateObj = parseDateISO(endDate);
    const currentDateObj = currentDate ? parseDateISO(currentDate) : new Date();
    
    // Calculate the difference in days
    const timeDiff = endDateObj.getTime() - currentDateObj.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // If end date has passed, no indicator needed
    if (daysRemaining < 0) {
      return {
        type: 'none',
        label: '',
        daysRemaining: 0,
        isLastClass: false,
        isWithinOneMonth: false
      };
    }
    
    // Check if within one month (28 days) of completion
    const isWithinOneMonth = daysRemaining <= ONE_MONTH_THRESHOLD && daysRemaining > 0;
    
    if (isWithinOneMonth) {
      return {
        type: 'one_month_remaining',
        label: '1 mês para finalizar',
        daysRemaining,
        isLastClass: false,
        isWithinOneMonth: true
      };
    }
    
    return {
      type: 'none',
      label: '',
      daysRemaining,
      isLastClass: false,
      isWithinOneMonth: false
    };
    
  } catch (error) {
    logError('Error calculating completion status:', error);
    return {
      type: 'none',
      label: '',
      daysRemaining: 0,
      isLastClass: false,
      isWithinOneMonth: false
    };
  }
}

/**
 * Check if student is within 28 days of course completion
 * @param endDate - Course end date in ISO format (YYYY-MM-DD)
 * @param currentDate - Current date in ISO format, defaults to today
 * @returns True if within one month threshold
 */
export function isWithinOneMonth(endDate: string, currentDate?: string): boolean {
  const status = calculateCompletionStatus(endDate, currentDate);
  return status.isWithinOneMonth;
}

/**
 * Check if a specific class date is the student's final class
 * @param endDate - Course end date in ISO format (YYYY-MM-DD)
 * @param classDate - Class date in ISO format (YYYY-MM-DD)
 * @returns True if the class date matches the end date
 */
export function isLastClass(endDate: string, classDate: string): boolean {
  try {
    const endDateObj = parseDateISO(endDate);
    const classDateObj = parseDateISO(classDate);
    
    // Compare dates by their ISO string representation
    return formatDateISO(endDateObj) === formatDateISO(classDateObj);
  } catch (error) {
    logError('Error checking last class:', error);
    return false;
  }
}

/**
 * Format completion indicator for display
 * @param status - CompletionStatus object
 * @param isLastClass - Whether this specific session is the last class
 * @returns Formatted display string
 */
export function formatCompletionIndicator(status: CompletionStatus, isLastClass?: boolean): string {
  if (isLastClass) {
    return 'Última aula';
  }
  
  return status.label;
}

/**
 * Get completion status for a specific class session
 * @param input - Completion calculation input parameters
 * @returns CompletionStatus with last class information
 */
export function getCompletionStatusForClass(input: CompletionCalculationInput): CompletionStatus {
  const baseStatus = calculateCompletionStatus(input.endDate, input.currentDate);
  
  // Check if this specific class is the last class
  const isLastClassSession = input.classDate ? isLastClass(input.endDate, input.classDate) : false;
  
  if (isLastClassSession) {
    return {
      ...baseStatus,
      type: 'last_class',
      label: 'Última aula',
      isLastClass: true
    };
  }
  
  return baseStatus;
}

/**
 * Create student indicator object for calendar display
 * @param studentId - Student ID
 * @param studentName - Student name
 * @param enrollmentId - Enrollment ID
 * @param endDate - Course end date
 * @param classDate - Optional class date for last class check
 * @returns StudentIndicator object
 */
export function createStudentIndicator(
  studentId: string,
  studentName: string,
  enrollmentId: string,
  endDate: string,
  classDate?: string
): StudentIndicator {
  const status = getCompletionStatusForClass({
    endDate,
    classDate
  });
  
  return {
    student_id: studentId,
    student_name: studentName,
    enrollment_id: enrollmentId,
    indicator_type: status.type,
    end_date: endDate,
    days_remaining: status.daysRemaining
  };
}

/**
 * Filter students that need completion indicators
 * @param students - Array of student data with end dates
 * @param currentDate - Current date, defaults to today
 * @returns Array of students that need indicators
 */
export function getStudentsWithIndicators(
  students: Array<{
    student_id: string;
    student_name: string;
    enrollment_id: string;
    end_date: string;
  }>,
  currentDate?: string
): StudentIndicator[] {
  return students
    .map(student => createStudentIndicator(
      student.student_id,
      student.student_name,
      student.enrollment_id,
      student.end_date
    ))
    .filter(indicator => indicator.indicator_type !== 'none');
}

/**
 * Get CSS classes for completion indicator styling
 * @param type - Completion indicator type
 * @returns CSS class string for styling
 */
export function getCompletionIndicatorClasses(type: CompletionIndicatorType): string {
  switch (type) {
    case 'one_month_remaining':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700';
    case 'last_class':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700';
    default:
      return '';
  }
}

/**
 * Calculate days remaining until course completion
 * @param endDate - Course end date in ISO format
 * @param currentDate - Current date, defaults to today
 * @returns Number of days remaining (negative if past due)
 */
export function getDaysRemaining(endDate: string, currentDate?: string): number {
  try {
    const endDateObj = parseDateISO(endDate);
    const currentDateObj = currentDate ? parseDateISO(currentDate) : new Date();
    
    const timeDiff = endDateObj.getTime() - currentDateObj.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  } catch (error) {
    logError('Error calculating days remaining:', error);
    return 0;
  }
}

/**
 * Check if completion indicators should be displayed for a student
 * @param endDate - Course end date
 * @param currentDate - Current date, defaults to today
 * @returns True if indicators should be shown
 */
export function shouldShowCompletionIndicator(endDate: string, currentDate?: string): boolean {
  const status = calculateCompletionStatus(endDate, currentDate);
  return status.type !== 'none';
}

/**
 * Get all students who need completion indicators on a specific date
 * @param students - Array of student data
 * @param classDate - Specific class date to check
 * @returns Array of students with their completion status for that date
 */
export function getCompletionIndicatorsForDate(
  students: Array<{
    student_id: string;
    student_name: string;
    enrollment_id: string;
    end_date: string;
  }>,
  classDate: string
): StudentIndicator[] {
  return students
    .map(student => createStudentIndicator(
      student.student_id,
      student.student_name,
      student.enrollment_id,
      student.end_date,
      classDate
    ))
    .filter(indicator => indicator.indicator_type !== 'none');
}