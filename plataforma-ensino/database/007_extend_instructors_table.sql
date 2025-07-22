-- Migration 007: Extend instructors table with scheduling columns
-- Story: 1.1.database-schema-setup  
-- Task: Add max_students_per_class and calendar_settings columns to existing instructors table

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Add max_students_per_class column with default value and positive constraint
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS max_students_per_class INTEGER DEFAULT 10;

-- Add calendar_settings JSONB column with default empty object
ALTER TABLE public.instructors 
ADD COLUMN IF NOT EXISTS calendar_settings JSONB DEFAULT '{}'::jsonb;

-- Add constraint to ensure max_students_per_class is positive
ALTER TABLE public.instructors 
ADD CONSTRAINT instructors_max_students_per_class_positive 
CHECK (max_students_per_class > 0);

-- Update existing records to have the default values (if any exist)
UPDATE public.instructors 
SET max_students_per_class = COALESCE(max_students_per_class, 10),
    calendar_settings = COALESCE(calendar_settings, '{}'::jsonb)
WHERE max_students_per_class IS NULL OR calendar_settings IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.instructors.max_students_per_class IS 'Maximum number of students allowed per class for this instructor';
COMMENT ON COLUMN public.instructors.calendar_settings IS 'JSON configuration for instructor calendar preferences and settings';

-- ====================================================================
-- ROLLBACK MIGRATION (for testing rollback capability)
-- ====================================================================

/*
-- To rollback this migration:
ALTER TABLE public.instructors DROP CONSTRAINT IF EXISTS instructors_max_students_per_class_positive;
ALTER TABLE public.instructors DROP COLUMN IF EXISTS calendar_settings;
ALTER TABLE public.instructors DROP COLUMN IF EXISTS max_students_per_class;
*/