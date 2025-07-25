/**
 * Completion Status Types
 * Story 2.2: Teacher Calendar Visual Enhancements
 * 
 * TypeScript type definitions for course completion status indicators
 */

export type CompletionIndicatorType = 'one_month_remaining' | 'last_class' | 'none';

export interface StudentIndicator {
  student_id: string;
  student_name: string;
  enrollment_id: string;
  indicator_type: CompletionIndicatorType;
  end_date: string;
  days_remaining: number;
}

export interface CompletionStatus {
  type: CompletionIndicatorType;
  label: string;
  daysRemaining: number;
  isLastClass: boolean;
  isWithinOneMonth: boolean;
}

export interface StudentWithCompletion {
  id: string;
  teacherId: string;
  studentEmail: string;
  studentName?: string;
  courseName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotLabel: string;
  startDate?: string;
  endDate?: string;
  completionStatus?: CompletionStatus;
}

export interface CompletionCalculationInput {
  endDate: string;
  currentDate?: string;
  classDate?: string;
}

export interface CompletionIndicatorProps {
  type: CompletionIndicatorType;
  label: string;
  daysRemaining?: number;
  className?: string;
}