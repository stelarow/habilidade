-- Migration 005: Create holidays table
-- Story: 1.1.database-schema-setup
-- Task: Create holidays table with proper schema, indexes and RLS policies

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Create holidays table
CREATE TABLE IF NOT EXISTS public.holidays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    is_national BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique dates to prevent duplicate holidays
    CONSTRAINT holidays_date_unique UNIQUE (date),
    
    -- Ensure year matches the date for data integrity
    CONSTRAINT holidays_year_consistency CHECK (EXTRACT(YEAR FROM date) = year),
    
    -- Ensure name is not empty
    CONSTRAINT holidays_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS holidays_date_idx ON public.holidays (date);
CREATE INDEX IF NOT EXISTS holidays_year_idx ON public.holidays (year);
CREATE INDEX IF NOT EXISTS holidays_is_national_idx ON public.holidays (is_national) WHERE is_national = true;

-- Add updated_at trigger for automatic timestamp updates
CREATE TRIGGER update_holidays_updated_at 
    BEFORE UPDATE ON public.holidays 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read access - anyone can view holidays
CREATE POLICY "Anyone can view holidays" ON public.holidays
    FOR SELECT USING (true);

-- Admin write access - only admins can insert/update/delete holidays
CREATE POLICY "Admins can manage holidays" ON public.holidays
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
DROP POLICY IF EXISTS "Admins can manage holidays" ON public.holidays;
DROP POLICY IF EXISTS "Anyone can view holidays" ON public.holidays;
DROP TRIGGER IF EXISTS update_holidays_updated_at ON public.holidays;
DROP INDEX IF EXISTS holidays_is_national_idx;
DROP INDEX IF EXISTS holidays_year_idx;
DROP INDEX IF EXISTS holidays_date_idx;
DROP TABLE IF EXISTS public.holidays;
*/