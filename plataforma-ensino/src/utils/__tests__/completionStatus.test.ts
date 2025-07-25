/**
 * Completion Status Utilities Tests
 * Story 2.2: Teacher Calendar Visual Enhancements
 * 
 * Comprehensive test suite for completion status calculation utilities
 */

import {
  calculateCompletionStatus,
  isWithinOneMonth,
  isLastClass,
  formatCompletionIndicator,
  getCompletionStatusForClass,
  createStudentIndicator,
  getStudentsWithIndicators,
  getCompletionIndicatorClasses,
  getDaysRemaining,
  shouldShowCompletionIndicator,
  getCompletionIndicatorsForDate,
  ONE_MONTH_THRESHOLD
} from '../completionStatus';

// Mock the date to make tests consistent
const mockCurrentDate = '2025-07-25';
const mockToday = new Date('2025-07-25T10:00:00.000Z');

// Mock Date.now() for consistent tests
const originalDate = Date;
beforeAll(() => {
  global.Date = class extends Date {
    constructor(date?: string | number | Date) {
      if (date) {
        super(date);
      } else {
        super(mockToday);
      }
    }
    
    static now() {
      return mockToday.getTime();
    }
  } as any;
});

afterAll(() => {
  global.Date = originalDate;
});

describe('calculateCompletionStatus', () => {
  it('should return none status for past end dates', () => {
    const endDate = '2025-07-20'; // 5 days ago
    const status = calculateCompletionStatus(endDate, mockCurrentDate);
    
    expect(status.type).toBe('none');
    expect(status.label).toBe('');
    expect(status.daysRemaining).toBe(0);
    expect(status.isLastClass).toBe(false);
    expect(status.isWithinOneMonth).toBe(false);
  });

  it('should return one_month_remaining for dates within 28 days', () => {
    const endDate = '2025-08-20'; // 26 days from mock current date
    const status = calculateCompletionStatus(endDate, mockCurrentDate);
    
    expect(status.type).toBe('one_month_remaining');
    expect(status.label).toBe('1 mês para finalizar');
    expect(status.daysRemaining).toBe(26);
    expect(status.isLastClass).toBe(false);
    expect(status.isWithinOneMonth).toBe(true);
  });

  it('should return none status for dates beyond 28 days', () => {
    const endDate = '2025-09-25'; // 62 days from mock current date
    const status = calculateCompletionStatus(endDate, mockCurrentDate);
    
    expect(status.type).toBe('none');
    expect(status.label).toBe('');
    expect(status.daysRemaining).toBe(62);
    expect(status.isLastClass).toBe(false);
    expect(status.isWithinOneMonth).toBe(false);
  });

  it('should handle exactly 28 days remaining', () => {
    const endDate = '2025-08-22'; // exactly 28 days from mock current date
    const status = calculateCompletionStatus(endDate, mockCurrentDate);
    
    expect(status.type).toBe('one_month_remaining');
    expect(status.isWithinOneMonth).toBe(true);
    expect(status.daysRemaining).toBe(28);
  });

  it('should handle exactly 29 days remaining (boundary test)', () => {
    const endDate = '2025-08-23'; // 29 days from mock current date
    const status = calculateCompletionStatus(endDate, mockCurrentDate);
    
    expect(status.type).toBe('none');
    expect(status.isWithinOneMonth).toBe(false);
    expect(status.daysRemaining).toBe(29);
  });

  it('should handle invalid date gracefully', () => {
    const status = calculateCompletionStatus('invalid-date', mockCurrentDate);
    
    expect(status.type).toBe('none');
    expect(status.label).toBe('');
    expect(status.daysRemaining).toBe(0);
  });
});

describe('isWithinOneMonth', () => {
  it('should return true for dates within 28 days', () => {
    expect(isWithinOneMonth('2025-08-20', mockCurrentDate)).toBe(true);
    expect(isWithinOneMonth('2025-08-22', mockCurrentDate)).toBe(true); // exactly 28 days
  });

  it('should return false for dates beyond 28 days', () => {
    expect(isWithinOneMonth('2025-08-23', mockCurrentDate)).toBe(false); // 29 days
    expect(isWithinOneMonth('2025-09-25', mockCurrentDate)).toBe(false);
  });

  it('should return false for past dates', () => {
    expect(isWithinOneMonth('2025-07-20', mockCurrentDate)).toBe(false);
  });
});

describe('isLastClass', () => {
  it('should return true when class date matches end date', () => {
    expect(isLastClass('2025-08-15', '2025-08-15')).toBe(true);
  });

  it('should return false when class date does not match end date', () => {
    expect(isLastClass('2025-08-15', '2025-08-14')).toBe(false);
    expect(isLastClass('2025-08-15', '2025-08-16')).toBe(false);
  });

  it('should handle invalid dates gracefully', () => {
    expect(isLastClass('invalid-date', '2025-08-15')).toBe(false);
    expect(isLastClass('2025-08-15', 'invalid-date')).toBe(false);
  });
});

describe('getCompletionStatusForClass', () => {
  it('should return last_class status when class date matches end date', () => {
    const status = getCompletionStatusForClass({
      endDate: '2025-08-15',
      classDate: '2025-08-15',
      currentDate: mockCurrentDate
    });
    
    expect(status.type).toBe('last_class');
    expect(status.label).toBe('Última aula');
    expect(status.isLastClass).toBe(true);
  });

  it('should return one_month_remaining when within threshold but not last class', () => {
    const status = getCompletionStatusForClass({
      endDate: '2025-08-20',
      classDate: '2025-08-15',
      currentDate: mockCurrentDate
    });
    
    expect(status.type).toBe('one_month_remaining');
    expect(status.label).toBe('1 mês para finalizar');
    expect(status.isLastClass).toBe(false);
  });

  it('should prioritize last_class over one_month_remaining', () => {
    const status = getCompletionStatusForClass({
      endDate: '2025-08-15', // within one month AND is last class
      classDate: '2025-08-15',
      currentDate: mockCurrentDate
    });
    
    expect(status.type).toBe('last_class');
    expect(status.isLastClass).toBe(true);
  });
});

describe('createStudentIndicator', () => {
  it('should create indicator for student within one month', () => {
    const indicator = createStudentIndicator(
      'student-1',
      'João Silva',
      'enrollment-1',
      '2025-08-20'
    );
    
    expect(indicator.student_id).toBe('student-1');
    expect(indicator.student_name).toBe('João Silva');
    expect(indicator.enrollment_id).toBe('enrollment-1');
    expect(indicator.indicator_type).toBe('one_month_remaining');
    expect(indicator.end_date).toBe('2025-08-20');
    expect(indicator.days_remaining).toBe(26);
  });

  it('should create last class indicator', () => {
    const indicator = createStudentIndicator(
      'student-1',
      'João Silva',
      'enrollment-1',
      '2025-08-15',
      '2025-08-15' // class date matches end date
    );
    
    expect(indicator.indicator_type).toBe('last_class');
  });
});

describe('getStudentsWithIndicators', () => {
  const mockStudents = [
    {
      student_id: '1',
      student_name: 'João',
      enrollment_id: 'e1',
      end_date: '2025-08-20' // within one month
    },
    {
      student_id: '2',
      student_name: 'Maria',
      enrollment_id: 'e2',
      end_date: '2025-09-25' // beyond one month
    },
    {
      student_id: '3',
      student_name: 'Pedro',
      enrollment_id: 'e3',
      end_date: '2025-07-20' // past end date
    }
  ];

  it('should filter students that need indicators', () => {
    const indicators = getStudentsWithIndicators(mockStudents, mockCurrentDate);
    
    expect(indicators).toHaveLength(1);
    expect(indicators[0].student_name).toBe('João');
    expect(indicators[0].indicator_type).toBe('one_month_remaining');
  });

  it('should return empty array when no students need indicators', () => {
    const studentsNoIndicators = [
      {
        student_id: '1',
        student_name: 'João',
        enrollment_id: 'e1',
        end_date: '2025-09-25' // beyond threshold
      }
    ];
    
    const indicators = getStudentsWithIndicators(studentsNoIndicators, mockCurrentDate);
    expect(indicators).toHaveLength(0);
  });
});

describe('getCompletionIndicatorClasses', () => {
  it('should return correct classes for one_month_remaining', () => {
    const classes = getCompletionIndicatorClasses('one_month_remaining');
    expect(classes).toContain('bg-yellow-100');
    expect(classes).toContain('text-yellow-800');
  });

  it('should return correct classes for last_class', () => {
    const classes = getCompletionIndicatorClasses('last_class');
    expect(classes).toContain('bg-red-100');
    expect(classes).toContain('text-red-800');
  });

  it('should return empty string for none type', () => {
    const classes = getCompletionIndicatorClasses('none');
    expect(classes).toBe('');
  });
});

describe('getDaysRemaining', () => {
  it('should calculate days remaining correctly', () => {
    expect(getDaysRemaining('2025-08-20', mockCurrentDate)).toBe(26);
    expect(getDaysRemaining('2025-07-20', mockCurrentDate)).toBe(-5);
    expect(getDaysRemaining('2025-08-22', mockCurrentDate)).toBe(28);
  });

  it('should handle invalid dates', () => {
    expect(getDaysRemaining('invalid-date', mockCurrentDate)).toBe(0);
  });
});

describe('shouldShowCompletionIndicator', () => {
  it('should return true for dates requiring indicators', () => {
    expect(shouldShowCompletionIndicator('2025-08-20', mockCurrentDate)).toBe(true);
  });

  it('should return false for dates not requiring indicators', () => {
    expect(shouldShowCompletionIndicator('2025-09-25', mockCurrentDate)).toBe(false);
    expect(shouldShowCompletionIndicator('2025-07-20', mockCurrentDate)).toBe(false);
  });
});

describe('getCompletionIndicatorsForDate', () => {
  const mockStudents = [
    {
      student_id: '1',
      student_name: 'João',
      enrollment_id: 'e1',
      end_date: '2025-08-15'
    },
    {
      student_id: '2',
      student_name: 'Maria',
      enrollment_id: 'e2',
      end_date: '2025-08-20'
    }
  ];

  it('should identify last class correctly', () => {
    const indicators = getCompletionIndicatorsForDate(mockStudents, '2025-08-15');
    
    const joaoIndicator = indicators.find(i => i.student_name === 'João');
    const mariaIndicator = indicators.find(i => i.student_name === 'Maria');
    
    expect(joaoIndicator?.indicator_type).toBe('last_class');
    expect(mariaIndicator?.indicator_type).toBe('one_month_remaining');
  });

  it('should handle dates with no indicators', () => {
    // Use dates that are actually beyond the completion threshold
    const studentsWithDistantEnd = [
      {
        student_id: '1',
        student_name: 'João',
        enrollment_id: 'e1',
        end_date: '2025-12-15' // Much further in the future
      },
      {
        student_id: '2',
        student_name: 'Maria',
        enrollment_id: 'e2',
        end_date: '2025-12-20' // Much further in the future
      }
    ];
    
    const indicators = getCompletionIndicatorsForDate(studentsWithDistantEnd, '2025-09-25');
    expect(indicators).toHaveLength(0);
  });
});

describe('Edge cases and boundary tests', () => {
  it('should handle leap year dates correctly', () => {
    const status = calculateCompletionStatus('2024-02-29', '2024-02-01');
    expect(status.daysRemaining).toBe(28);
    expect(status.type).toBe('one_month_remaining');
  });

  it('should handle month boundary correctly', () => {
    const status = calculateCompletionStatus('2025-08-01', '2025-07-31');
    expect(status.daysRemaining).toBe(1);
    expect(status.type).toBe('one_month_remaining');
  });

  it('should handle same day scenario', () => {
    const status = calculateCompletionStatus('2025-07-25', '2025-07-25');
    expect(status.daysRemaining).toBe(0);
    expect(status.type).toBe('none'); // Same day, course already ended
  });

  it('should handle threshold boundary exactly', () => {
    // Test exactly at 28-day threshold
    const endDate = new Date(mockToday);
    endDate.setDate(endDate.getDate() + ONE_MONTH_THRESHOLD);
    const endDateISO = endDate.toISOString().split('T')[0];
    
    const status = calculateCompletionStatus(endDateISO, mockCurrentDate);
    expect(status.type).toBe('one_month_remaining');
    expect(status.daysRemaining).toBe(ONE_MONTH_THRESHOLD);
  });
});