/**
 * Type definitions for date calculation features
 */

export interface Holiday {
  date: string; // ISO date string (YYYY-MM-DD)
  name: string;
  type: 'national' | 'regional';
}

export interface DateCalculationRequest {
  start_date: string; // ISO date string (YYYY-MM-DD)
  duration: number; // Duration in working days
}

export interface DateCalculationResponse {
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date: string; // ISO date string (YYYY-MM-DD)
  working_days: number;
  excluded_days: {
    weekends: number;
    holidays: number;
  };
}

export interface WorkingDaysCalculation {
  totalDays: number;
  workingDays: number;
  excludedWeekends: number;
  excludedHolidays: number;
}