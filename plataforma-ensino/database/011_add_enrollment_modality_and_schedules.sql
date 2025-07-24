-- Migration 011: Add enrollment modality and student schedules table
-- Story 1.2: Form Submission and Validation Enhancement
-- Task: Add modality field to enrollments and create student_schedules table

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Add modality field to enrollments table
ALTER TABLE public.enrollments 
ADD COLUMN IF NOT EXISTS modality TEXT DEFAULT 'online' CHECK (modality IN ('online', 'in-person'));

-- Create student_schedules table for in-person class scheduling
CREATE TABLE IF NOT EXISTS public.student_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7), -- 1=Monday, 7=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure start_time is before end_time
    CONSTRAINT student_schedules_time_order CHECK (start_time < end_time),
    
    -- Ensure instructor has instructor or admin role
    CONSTRAINT student_schedules_instructor_role CHECK (
        instructor_id IN (
            SELECT id FROM public.users WHERE role IN ('instructor', 'admin')
        )
    )
);

-- Create performance indexes for student_schedules
CREATE INDEX IF NOT EXISTS student_schedules_enrollment_id_idx ON public.student_schedules (enrollment_id);
CREATE INDEX IF NOT EXISTS student_schedules_instructor_id_idx ON public.student_schedules (instructor_id);
CREATE INDEX IF NOT EXISTS student_schedules_day_of_week_idx ON public.student_schedules (day_of_week);
CREATE INDEX IF NOT EXISTS student_schedules_instructor_day_idx ON public.student_schedules (instructor_id, day_of_week);

-- Add updated_at trigger for automatic timestamp updates
CREATE TRIGGER update_student_schedules_updated_at 
    BEFORE UPDATE ON public.student_schedules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.student_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_schedules
-- Students can view their own schedules
CREATE POLICY "Students can view own schedules" ON public.student_schedules
    FOR SELECT USING (
        enrollment_id IN (
            SELECT id FROM public.enrollments WHERE user_id = auth.uid()
        )
    );

-- Instructors can view schedules for their classes
CREATE POLICY "Instructors can view own class schedules" ON public.student_schedules
    FOR SELECT USING (instructor_id = auth.uid());

-- Admins can manage all schedules
CREATE POLICY "Admins can manage all schedules" ON public.student_schedules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- System can create schedules (for API operations)
CREATE POLICY "System can create schedules" ON public.student_schedules
    FOR INSERT WITH CHECK (true);

-- ====================================================================
-- DATA MIGRATION
-- ====================================================================

-- Update existing enrollments to have default modality
UPDATE public.enrollments 
SET modality = 'online' 
WHERE modality IS NULL;

-- ====================================================================
-- ROLLBACK MIGRATION (for testing rollback capability)
-- ====================================================================

/*
-- To rollback this migration:
DROP POLICY IF EXISTS "System can create schedules" ON public.student_schedules;
DROP POLICY IF EXISTS "Admins can manage all schedules" ON public.student_schedules;
DROP POLICY IF EXISTS "Instructors can view own class schedules" ON public.student_schedules;
DROP POLICY IF EXISTS "Students can view own schedules" ON public.student_schedules;
DROP TRIGGER IF EXISTS update_student_schedules_updated_at ON public.student_schedules;
DROP INDEX IF EXISTS student_schedules_instructor_day_idx;
DROP INDEX IF EXISTS student_schedules_day_of_week_idx;
DROP INDEX IF EXISTS student_schedules_instructor_id_idx;
DROP INDEX IF EXISTS student_schedules_enrollment_id_idx;
DROP TABLE IF EXISTS public.student_schedules;
ALTER TABLE public.enrollments DROP COLUMN IF EXISTS modality;
*/