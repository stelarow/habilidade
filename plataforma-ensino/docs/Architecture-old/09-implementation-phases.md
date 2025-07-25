# Implementation Phases

## Phase 1: Database Foundation (Week 1)

### Database Schema Implementation

#### Day 1-2: Core Schema Setup
**Migration 001: Create holidays table**
```sql
-- File: database/migrations/001_add_holidays_table.sql
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    is_national BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_holidays_year ON holidays(year);
CREATE UNIQUE INDEX idx_holidays_date_unique ON holidays(date);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to holidays" ON holidays
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to holidays" ON holidays
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

**Migration 002: Create teacher_availability table**
```sql
-- File: database/migrations/002_add_teacher_availability.sql
CREATE TABLE teacher_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_teacher_availability_teacher_id ON teacher_availability(teacher_id);
CREATE INDEX idx_teacher_availability_day ON teacher_availability(day_of_week);
CREATE INDEX idx_teacher_availability_active ON teacher_availability(is_active) WHERE is_active = true;

ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their own availability" ON teacher_availability
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view active availability" ON teacher_availability
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full access to availability" ON teacher_availability
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

#### Day 3: Extend Teachers Table
**Migration 003: Extend teachers table**
```sql
-- File: database/migrations/003_extend_teachers_table.sql
ALTER TABLE teachers 
ADD COLUMN max_students_per_class INTEGER DEFAULT 10,
ADD COLUMN calendar_settings JSONB DEFAULT '{}';

ALTER TABLE teachers 
ADD CONSTRAINT teachers_max_students_positive 
CHECK (max_students_per_class > 0);
```

### Data Seeding
```typescript
// File: src/utils/seedHolidays.ts
import { createServerClient } from '@/lib/supabase/server';

export async function seedBrazilianHolidays2025() {
  const supabase = createServerClient();
  
  const holidays = [
    { date: '2025-01-01', name: 'Confraternização Universal', year: 2025, is_national: true },
    { date: '2025-03-03', name: 'Carnaval', year: 2025, is_national: true },
    { date: '2025-03-04', name: 'Carnaval', year: 2025, is_national: true },
    { date: '2025-04-18', name: 'Sexta-feira Santa', year: 2025, is_national: true },
    { date: '2025-04-21', name: 'Tiradentes', year: 2025, is_national: true },
    { date: '2025-05-01', name: 'Dia do Trabalhador', year: 2025, is_national: true },
    { date: '2025-05-29', name: 'Corpus Christi', year: 2025, is_national: true },
    { date: '2025-09-07', name: 'Independência do Brasil', year: 2025, is_national: true },
    { date: '2025-10-12', name: 'Nossa Senhora Aparecida', year: 2025, is_national: true },
    { date: '2025-11-02', name: 'Finados', year: 2025, is_national: true },
    { date: '2025-11-15', name: 'Proclamação da República', year: 2025, is_national: true },
    { date: '2025-12-25', name: 'Natal', year: 2025, is_national: true },
  ];

  const { data, error } = await supabase
    .from('holidays')
    .insert(holidays);

  if (error) {
    console.error('Error seeding holidays:', error);
    throw error;
  }

  console.log('Successfully seeded holidays for 2025');
  return data;
}
```

### TypeScript Type Definitions
```typescript
// File: src/types/scheduling.ts
export interface Holiday {
  id: string;
  date: string; // ISO date string
  name: string;
  year: number;
  is_national: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeacherAvailability {
  id: string;
  teacher_id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, etc.
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  max_students: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxStudents: number;
  availableSpots: number;
  isActive: boolean;
}

export interface CourseSchedule {
  endDate: string;
  totalWeeks: number;
  holidaysExcluded: string[];
  actualClassDays: number;
  schedule: ClassSchedule[];
}

export interface ClassSchedule {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
}
```

## Phase 2: Core Logic Implementation (Week 2)

### Date Calculation Utilities
```typescript
// File: src/utils/dateCalculations.ts
import { Holiday, CourseSchedule } from '@/types/scheduling';
import { addDays, isWeekend, parseISO, format } from 'date-fns';

export function calculateCourseEndDate(
  startDate: Date,
  courseHours: number,
  weeklyClasses: number,
  holidayDates: Date[]
): CourseSchedule {
  const totalClasses = Math.ceil(courseHours / 2); // Assuming 2 hours per class
  const classesPerWeek = weeklyClasses;
  
  let currentDate = new Date(startDate);
  let classesScheduled = 0;
  const schedule: ClassSchedule[] = [];
  const excludedHolidays: string[] = [];
  
  while (classesScheduled < totalClasses) {
    // Skip weekends
    if (isWeekend(currentDate)) {
      currentDate = addDays(currentDate, 1);
      continue;
    }
    
    // Check if current date is a holiday
    const isHoliday = holidayDates.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    );
    
    if (isHoliday) {
      excludedHolidays.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate = addDays(currentDate, 1);
      continue;
    }
    
    // Schedule class
    schedule.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '11:00',
      duration: 120
    });
    
    classesScheduled++;
    currentDate = addDays(currentDate, 1);
  }
  
  return {
    endDate: format(currentDate, 'yyyy-MM-dd'),
    totalWeeks: Math.ceil(schedule.length / classesPerWeek),
    holidaysExcluded: excludedHolidays,
    actualClassDays: schedule.length,
    schedule
  };
}

export function getHolidaysInRange(
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): Holiday[] {
  return holidays.filter(holiday => {
    const holidayDate = parseISO(holiday.date);
    return holidayDate >= startDate && holidayDate <= endDate;
  });
}

export function isBusinessDay(
  date: Date,
  holidays: Holiday[]
): boolean {
  if (isWeekend(date)) {
    return false;
  }
  
  const dateStr = format(date, 'yyyy-MM-dd');
  return !holidays.some(holiday => holiday.date === dateStr);
}
```

### API Route Implementations
```typescript
// File: src/app/api/holidays/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');
  
  const supabase = createServerClient();
  
  let query = supabase.from('holidays').select('*');
  
  if (year) {
    query = query.eq('year', parseInt(year));
  }
  
  if (month) {
    const monthStart = `${year}-${month.padStart(2, '0')}-01`;
    const monthEnd = `${year}-${month.padStart(2, '0')}-31`;
    query = query.gte('date', monthStart).lte('date', monthEnd);
  }
  
  const { data, error } = await query.order('date');
  
  if (error) {
    return NextResponse.json(
      { error: { code: 'FETCH_ERROR', message: error.message } },
      { status: 500 }
    );
  }
  
  return NextResponse.json({
    holidays: data,
    total: data.length,
    year: year ? parseInt(year) : undefined
  });
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const body = await request.json();
  
  // Validate admin access
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
      { status: 401 }
    );
  }
  
  const { data, error } = await supabase
    .from('holidays')
    .insert([body])
    .select()
    .single();
  
  if (error) {
    return NextResponse.json(
      { error: { code: 'CREATE_ERROR', message: error.message } },
      { status: 400 }
    );
  }
  
  return NextResponse.json(data, { status: 201 });
}
```

## Phase 3: User Interface Integration (Weeks 3-4)

### TeacherSelector Component
```typescript
// File: src/components/scheduling/TeacherSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createBrowserClient } from '@/lib/supabase/client';
import { Teacher } from '@/types/database';

interface TeacherSelectorProps {
  courseId: string;
  onTeacherSelect: (teacherId: string, teacher: Teacher) => void;
  disabled?: boolean;
  className?: string;
}

export function TeacherSelector({ 
  courseId, 
  onTeacherSelect, 
  disabled = false,
  className 
}: TeacherSelectorProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTeachers() {
      const supabase = createBrowserClient();
      
      const { data, error } = await supabase
        .from('teachers')
        .select(`
          *,
          teacher_availability (
            id,
            day_of_week,
            start_time,
            end_time,
            max_students,
            is_active
          )
        `)
        .eq('teacher_availability.is_active', true);
      
      if (error) {
        setError('Failed to load teachers');
        console.error('Error fetching teachers:', error);
      } else {
        setTeachers(data || []);
      }
      
      setLoading(false);
    }
    
    fetchTeachers();
  }, [courseId]);
  
  const handleTeacherChange = (teacherId: string) => {
    const selectedTeacher = teachers.find(t => t.id === teacherId);
    if (selectedTeacher) {
      onTeacherSelect(teacherId, selectedTeacher);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
        <span>Carregando professores...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-destructive">
        {error}
      </div>
    );
  }
  
  return (
    <Select onValueChange={handleTeacherChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Selecione um professor" />
      </SelectTrigger>
      <SelectContent>
        {teachers.map((teacher) => (
          <SelectItem key={teacher.id} value={teacher.id}>
            <div className="flex items-center space-x-2">
              <div className="flex-1">
                <div className="font-medium">{teacher.name}</div>
                <div className="text-sm text-muted-foreground">
                  {teacher.expertise || 'Professor especializado'}
                </div>
              </div>
              <div className="text-xs text-green-600">
                Disponível
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Implementation Timeline

#### Week 3: Component Development
- **Day 1-2**: Complete TeacherSelector component with real-time data
- **Day 3-4**: Build ConditionalCalendar with availability display
- **Day 5**: Integration testing and bug fixes

#### Week 4: Admin Interface & Final Integration
- **Day 1-2**: HolidayManager admin interface
- **Day 3**: Teacher availability settings interface
- **Day 4**: End-to-end testing and documentation
- **Day 5**: Production deployment with feature flags

### Success Criteria for Each Phase

#### Phase 1 Success Criteria
- [ ] All database migrations run successfully
- [ ] Holiday data properly seeded for 2025
- [ ] TypeScript types compile without errors
- [ ] Basic API endpoints return expected data

#### Phase 2 Success Criteria
- [ ] Date calculations handle holidays correctly
- [ ] Teacher availability API returns proper data
- [ ] API response times under 200ms
- [ ] Error handling covers all edge cases

#### Phase 3 Success Criteria
- [ ] Components integrate seamlessly with enrollment flow
- [ ] Admin interfaces functional and secure
- [ ] Mobile responsive design works properly
- [ ] End-to-end user flow completes successfully

### Deployment Strategy

#### Feature Flag Implementation
```typescript
// File: src/lib/features/scheduling.ts
export const schedulingFeatures = {
  ENABLE_TEACHER_SCHEDULING: process.env.NEXT_PUBLIC_ENABLE_TEACHER_SCHEDULING === 'true',
  ENABLE_HOLIDAY_MANAGEMENT: process.env.NEXT_PUBLIC_ENABLE_HOLIDAY_MANAGEMENT === 'true',
  ENABLE_CALENDAR_DISPLAY: process.env.NEXT_PUBLIC_ENABLE_CALENDAR_DISPLAY === 'true',
  ENABLE_AVAILABILITY_API: process.env.NEXT_PUBLIC_ENABLE_AVAILABILITY_API === 'true',
};

export function useSchedulingFeature(feature: keyof typeof schedulingFeatures) {
  return schedulingFeatures[feature];
}
```

#### Gradual Rollout Plan
1. **Week 1**: Enable for development team only (0.1% users)
2. **Week 2**: Enable for beta testers (1% users)  
3. **Week 3**: Enable for 10% of users
4. **Week 4**: Full rollout to 100% of users (if metrics are good)