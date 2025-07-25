# Data Models and Schema Changes

## New Data Models

### holidays
**Purpose:** Store national and regional holidays for accurate course date calculations
**Integration:** Standalone table referenced by date calculation utilities

**Key Attributes:**
- id: UUID (Primary Key) - Unique identifier
- date: DATE - Holiday date
- name: VARCHAR(255) - Holiday name
- year: INTEGER - Year for organization
- is_national: BOOLEAN - National vs regional flag
- created_at/updated_at: TIMESTAMP - Audit fields

**Relationships:**
- **With Existing:** No direct relationships, used in calculations
- **With New:** Referenced by teacher_availability for scheduling

### teacher_availability
**Purpose:** Define when teachers are available and their capacity
**Integration:** Links to existing teachers table, defines scheduling constraints

**Key Attributes:**
- id: UUID (Primary Key) - Unique identifier
- teacher_id: UUID (Foreign Key) - References existing teachers table
- day_of_week: INTEGER - 0=Sunday through 6=Saturday
- start_time/end_time: TIME - Available time window
- max_students: INTEGER - Capacity for this time slot
- is_active: BOOLEAN - Enable/disable availability

**Relationships:**
- **With Existing:** REFERENCES teachers(id) ON DELETE CASCADE
- **With New:** Used by scheduling algorithms and calendar display

### Enhanced teachers table
**Purpose:** Extend existing teachers with scheduling-specific settings
**Integration:** Add columns to existing table (backward compatible)

**New Attributes:**
- max_students_per_class: INTEGER DEFAULT 10 - Default class capacity
- calendar_settings: JSONB DEFAULT '{}' - Flexible scheduling preferences

## Schema Integration Strategy

**Database Changes Required:**
- **New Tables:** holidays, teacher_availability
- **Modified Tables:** teachers (add 2 columns)
- **New Indexes:** holidays(date), holidays(year), teacher_availability(teacher_id, day_of_week)
- **Migration Strategy:** Additive migrations only, populate with default/sample data

**Backward Compatibility:**
- All existing queries continue to work unchanged
- New columns have DEFAULT values to prevent breaking changes
- Foreign key constraints prevent data integrity issues

## Database Migration Scripts

### Migration 001: Create holidays table
```sql
-- Create holidays table for course date calculations
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    is_national BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_holidays_date ON holidays(date);
CREATE INDEX idx_holidays_year ON holidays(year);
CREATE UNIQUE INDEX idx_holidays_date_unique ON holidays(date);

-- Enable RLS
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Public read access, admin write access
CREATE POLICY "Allow public read access to holidays" ON holidays
    FOR SELECT USING (true);

CREATE POLICY "Allow admin write access to holidays" ON holidays
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Migration 002: Create teacher_availability table
```sql
-- Create teacher availability table
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

-- Create indexes for performance
CREATE INDEX idx_teacher_availability_teacher_id ON teacher_availability(teacher_id);
CREATE INDEX idx_teacher_availability_day ON teacher_availability(day_of_week);
CREATE INDEX idx_teacher_availability_active ON teacher_availability(is_active) WHERE is_active = true;

-- Enable RLS
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Teachers can manage their own availability" ON teacher_availability
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view active availability" ON teacher_availability
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins have full access to availability" ON teacher_availability
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Migration 003: Extend teachers table
```sql
-- Add scheduling-specific columns to existing teachers table
ALTER TABLE teachers 
ADD COLUMN max_students_per_class INTEGER DEFAULT 10,
ADD COLUMN calendar_settings JSONB DEFAULT '{}';

-- Add check constraint for positive max_students
ALTER TABLE teachers 
ADD CONSTRAINT teachers_max_students_positive 
CHECK (max_students_per_class > 0);
```

## Data Seeding Strategy

### Holiday Data Seeding (2025 Brazilian Holidays)
```sql
-- Insert 2025 Brazilian National Holidays
INSERT INTO holidays (date, name, year, is_national) VALUES
    ('2025-01-01', 'Confraternização Universal', 2025, true),
    ('2025-04-21', 'Tiradentes', 2025, true),
    ('2025-05-01', 'Dia do Trabalhador', 2025, true),
    ('2025-09-07', 'Independência do Brasil', 2025, true),
    ('2025-10-12', 'Nossa Senhora Aparecida', 2025, true),
    ('2025-11-02', 'Finados', 2025, true),
    ('2025-11-15', 'Proclamação da República', 2025, true),
    ('2025-12-25', 'Natal', 2025, true);

-- Carnival dates (variable each year)
INSERT INTO holidays (date, name, year, is_national) VALUES
    ('2025-03-03', 'Carnaval', 2025, true),
    ('2025-03-04', 'Carnaval', 2025, true);

-- Easter-related holidays (variable each year)  
INSERT INTO holidays (date, name, year, is_national) VALUES
    ('2025-04-18', 'Sexta-feira Santa', 2025, true),
    ('2025-05-29', 'Corpus Christi', 2025, true);
```

## Performance Considerations

### Database Query Optimization
- **Index Strategy:** Indexes on frequently queried columns (date, teacher_id, day_of_week)
- **Query Patterns:** Optimized for date range queries and teacher availability lookups
- **Connection Pooling:** Use existing Supabase connection pooling

### Data Access Patterns
- **Holiday Queries:** Primarily read-heavy with annual bulk inserts
- **Availability Queries:** Mixed read/write with real-time updates
- **Teacher Schedule:** Complex queries joining availability with holidays

### Scalability Planning
- **Partitioning Strategy:** Holiday table partitioned by year for performance
- **Archival Policy:** Archive old holiday data annually
- **Capacity Planning:** Teacher availability scales with teacher count