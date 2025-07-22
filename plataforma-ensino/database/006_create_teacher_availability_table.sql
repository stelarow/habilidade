-- Migration 006: Create teacher_availability table
-- Story: 1.1.database-schema-setup
-- Task: Create teacher_availability table with relationships to existing instructors table

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Ensure btree_gist extension is available for EXCLUDE constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Create teacher_availability table
CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure valid day_of_week (0 = Sunday, 6 = Saturday)
    CONSTRAINT teacher_availability_day_of_week_check CHECK (day_of_week >= 0 AND day_of_week <= 6),
    
    -- Ensure positive max_students
    CONSTRAINT teacher_availability_max_students_positive CHECK (max_students > 0),
    
    -- Ensure start_time is before end_time
    CONSTRAINT teacher_availability_time_order CHECK (start_time < end_time),
    
    -- Prevent overlapping time slots for same teacher on same day
    -- Note: Requires btree_gist extension for this constraint
    CONSTRAINT teacher_availability_no_overlap EXCLUDE USING gist (
        teacher_id WITH =,
        day_of_week WITH =,
        tsrange(start_time, end_time, '[)') WITH &&
    ) WHERE (is_active = true)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS teacher_availability_teacher_id_idx ON public.teacher_availability (teacher_id);
CREATE INDEX IF NOT EXISTS teacher_availability_day_of_week_idx ON public.teacher_availability (day_of_week);
CREATE INDEX IF NOT EXISTS teacher_availability_active_idx ON public.teacher_availability (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS teacher_availability_teacher_day_idx ON public.teacher_availability (teacher_id, day_of_week);

-- Add updated_at trigger for automatic timestamp updates
CREATE TRIGGER update_teacher_availability_updated_at 
    BEFORE UPDATE ON public.teacher_availability 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Teachers can manage their own availability
CREATE POLICY "Teachers can manage own availability" ON public.teacher_availability
    FOR ALL USING (
        teacher_id IN (
            SELECT id FROM public.instructors WHERE user_id = auth.uid()
        )
    );

-- Students and public can view active availability slots
CREATE POLICY "Anyone can view active availability" ON public.teacher_availability
    FOR SELECT USING (is_active = true);

-- Admins can manage all availability
CREATE POLICY "Admins can manage all availability" ON public.teacher_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ====================================================================
-- ROLLBACK MIGRATION (for testing rollback capability)
-- ====================================================================

/*
-- To rollback this migration:
DROP POLICY IF EXISTS "Admins can manage all availability" ON public.teacher_availability;
DROP POLICY IF EXISTS "Anyone can view active availability" ON public.teacher_availability;
DROP POLICY IF EXISTS "Teachers can manage own availability" ON public.teacher_availability;
DROP TRIGGER IF EXISTS update_teacher_availability_updated_at ON public.teacher_availability;
DROP INDEX IF EXISTS teacher_availability_teacher_day_idx;
DROP INDEX IF EXISTS teacher_availability_active_idx;
DROP INDEX IF EXISTS teacher_availability_day_of_week_idx;
DROP INDEX IF EXISTS teacher_availability_teacher_id_idx;
DROP TABLE IF EXISTS public.teacher_availability;
*/