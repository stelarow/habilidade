-- Migration 001: Fix instructor schema issues
-- This migration fixes schema mismatches found during testing

-- Add specializations column as alias for expertise (for backwards compatibility)
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS specializations TEXT[] DEFAULT NULL;

-- Create function to sync specializations with expertise
CREATE OR REPLACE FUNCTION sync_instructor_specializations()
RETURNS TRIGGER AS $$
BEGIN
    -- If expertise is updated, sync specializations
    IF NEW.expertise IS DISTINCT FROM OLD.expertise THEN
        NEW.specializations := NEW.expertise;
    END IF;
    
    -- If specializations is updated, sync expertise
    IF NEW.specializations IS DISTINCT FROM OLD.specializations THEN
        NEW.expertise := NEW.specializations;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to keep both columns in sync
DROP TRIGGER IF EXISTS sync_instructor_fields ON public.instructors;
CREATE TRIGGER sync_instructor_fields
    BEFORE UPDATE ON public.instructors
    FOR EACH ROW EXECUTE FUNCTION sync_instructor_specializations();

-- Add max_students_per_class column
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS max_students_per_class INTEGER DEFAULT 3;

-- Create teacher_availability table (referenced in seed file)
CREATE TABLE IF NOT EXISTS public.teacher_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES public.instructors(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, day_of_week, start_time, end_time),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS on teacher_availability
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_availability
CREATE POLICY "Anyone can view teacher availability" ON public.teacher_availability
    FOR SELECT USING (is_active = true);

CREATE POLICY "Instructors can manage their own availability" ON public.teacher_availability
    FOR ALL USING (
        teacher_id IN (
            SELECT id FROM public.instructors WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all availability" ON public.teacher_availability
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_availability_teacher_id ON public.teacher_availability(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_availability_day_time ON public.teacher_availability(day_of_week, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_teacher_availability_active ON public.teacher_availability(is_active);

-- Add updated_at trigger for teacher_availability
CREATE TRIGGER update_teacher_availability_updated_at 
    BEFORE UPDATE ON public.teacher_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing instructors to have specializations = expertise
UPDATE public.instructors 
SET specializations = expertise 
WHERE specializations IS NULL AND expertise IS NOT NULL;

-- Grant permissions on new table
GRANT ALL ON public.teacher_availability TO postgres, service_role;
GRANT SELECT ON public.teacher_availability TO anon;
GRANT ALL ON public.teacher_availability TO authenticated;

-- Create view for instructor availability summary
CREATE VIEW public.instructor_availability_summary AS
SELECT 
    i.id as instructor_id,
    u.full_name as instructor_name,
    COUNT(ta.id) as total_slots,
    COUNT(CASE WHEN ta.is_active = true THEN 1 END) as active_slots,
    array_agg(DISTINCT ta.day_of_week ORDER BY ta.day_of_week) as available_days
FROM public.instructors i
JOIN public.users u ON i.user_id = u.id
LEFT JOIN public.teacher_availability ta ON i.id = ta.teacher_id
GROUP BY i.id, u.full_name;