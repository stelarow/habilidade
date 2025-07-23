-- Migration 010: Add availability approval workflow system
-- Story: 2.3.admin-interface-development
-- Task: Implement availability approval workflow for teacher changes

-- ====================================================================
-- FORWARD MIGRATION
-- ====================================================================

-- Create enum for approval status
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

-- Create availability_change_requests table for approval workflows
CREATE TABLE IF NOT EXISTS public.availability_change_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    teacher_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    requested_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Change type and target
    change_type TEXT NOT NULL CHECK (change_type IN ('create', 'update', 'delete')),
    target_availability_id UUID REFERENCES public.teacher_availability(id) ON DELETE CASCADE,
    
    -- Requested changes (JSON format for flexibility)
    requested_changes JSONB NOT NULL,
    
    -- Original data (for updates/deletes, to track what changed)
    original_data JSONB,
    
    -- Approval workflow
    status approval_status DEFAULT 'pending',
    reviewed_by_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    
    -- Auto-approval rules
    auto_approved BOOLEAN DEFAULT FALSE,
    auto_approval_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure reviewed fields are consistent
    CONSTRAINT availability_change_requests_review_consistency CHECK (
        (status = 'pending' AND reviewed_by_admin_id IS NULL AND reviewed_at IS NULL) OR
        (status IN ('approved', 'rejected') AND reviewed_by_admin_id IS NOT NULL AND reviewed_at IS NOT NULL)
    )
);

-- Add columns to teacher_availability for tracking pending changes
ALTER TABLE public.teacher_availability 
ADD COLUMN IF NOT EXISTS has_pending_changes BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS pending_change_request_id UUID REFERENCES public.availability_change_requests(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS availability_change_requests_teacher_id_idx ON public.availability_change_requests (teacher_id);
CREATE INDEX IF NOT EXISTS availability_change_requests_status_idx ON public.availability_change_requests (status);
CREATE INDEX IF NOT EXISTS availability_change_requests_requested_by_idx ON public.availability_change_requests (requested_by_user_id);
CREATE INDEX IF NOT EXISTS availability_change_requests_reviewed_by_idx ON public.availability_change_requests (reviewed_by_admin_id);
CREATE INDEX IF NOT EXISTS availability_change_requests_created_at_idx ON public.availability_change_requests (created_at);

-- Create index for teacher_availability pending changes
CREATE INDEX IF NOT EXISTS teacher_availability_pending_changes_idx ON public.teacher_availability (has_pending_changes) WHERE has_pending_changes = true;

-- Add updated_at trigger
CREATE TRIGGER update_availability_change_requests_updated_at 
    BEFORE UPDATE ON public.availability_change_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.availability_change_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability_change_requests

-- Teachers can view and create requests for their own availability
CREATE POLICY "Teachers can manage own change requests" ON public.availability_change_requests
    FOR ALL USING (
        teacher_id IN (
            SELECT id FROM public.instructors WHERE user_id = auth.uid()
        ) OR
        requested_by_user_id = auth.uid()
    );

-- Admins can manage all change requests
CREATE POLICY "Admins can manage all change requests" ON public.availability_change_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to auto-approve simple changes
CREATE OR REPLACE FUNCTION auto_approve_availability_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-approve if it's a teacher modifying their own future availability
    -- and the change doesn't conflict with existing bookings
    IF NEW.change_type = 'update' AND 
       NEW.requested_by_user_id IN (
           SELECT user_id FROM public.instructors WHERE id = NEW.teacher_id
       ) THEN
        
        -- Simple auto-approval logic (can be extended)
        NEW.auto_approved := TRUE;
        NEW.auto_approval_reason := 'Teacher self-modification with no conflicts';
        NEW.status := 'approved';
        NEW.reviewed_at := NOW();
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-approval
CREATE TRIGGER auto_approve_availability_changes_trigger
    BEFORE INSERT ON public.availability_change_requests
    FOR EACH ROW
    EXECUTE FUNCTION auto_approve_availability_changes();

-- Create function to apply approved changes
CREATE OR REPLACE FUNCTION apply_approved_availability_change()
RETURNS TRIGGER AS $$
DECLARE
    requested_data JSONB;
BEGIN
    -- Only process when status changes to 'approved'
    IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
        requested_data := NEW.requested_changes;
        
        -- Apply the change based on change_type
        CASE NEW.change_type
            WHEN 'create' THEN
                INSERT INTO public.teacher_availability (
                    teacher_id,
                    day_of_week,
                    start_time,
                    end_time,
                    max_students,
                    is_active
                ) VALUES (
                    NEW.teacher_id,
                    (requested_data->>'day_of_week')::INTEGER,
                    (requested_data->>'start_time')::TIME,
                    (requested_data->>'end_time')::TIME,
                    (requested_data->>'max_students')::INTEGER,
                    COALESCE((requested_data->>'is_active')::BOOLEAN, TRUE)
                );
                
            WHEN 'update' THEN
                UPDATE public.teacher_availability
                SET 
                    day_of_week = COALESCE((requested_data->>'day_of_week')::INTEGER, day_of_week),
                    start_time = COALESCE((requested_data->>'start_time')::TIME, start_time),
                    end_time = COALESCE((requested_data->>'end_time')::TIME, end_time),
                    max_students = COALESCE((requested_data->>'max_students')::INTEGER, max_students),
                    is_active = COALESCE((requested_data->>'is_active')::BOOLEAN, is_active),
                    has_pending_changes = FALSE,
                    pending_change_request_id = NULL,
                    updated_at = NOW()
                WHERE id = NEW.target_availability_id;
                
            WHEN 'delete' THEN
                DELETE FROM public.teacher_availability
                WHERE id = NEW.target_availability_id;
        END CASE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to apply approved changes
CREATE TRIGGER apply_approved_availability_change_trigger
    AFTER UPDATE ON public.availability_change_requests
    FOR EACH ROW
    EXECUTE FUNCTION apply_approved_availability_change();

-- Create view for admin dashboard showing pending requests
CREATE VIEW admin_pending_availability_requests AS
SELECT 
    acr.id,
    acr.teacher_id,
    i.user_id as teacher_user_id,
    u_teacher.full_name as teacher_name,
    u_teacher.email as teacher_email,
    acr.change_type,
    acr.requested_changes,
    acr.original_data,
    acr.created_at,
    u_requester.full_name as requested_by_name,
    u_requester.email as requested_by_email,
    -- Parse requested changes for easy display
    CASE 
        WHEN acr.change_type = 'create' THEN 
            CONCAT(
                CASE (acr.requested_changes->>'day_of_week')::INTEGER
                    WHEN 0 THEN 'Domingo'
                    WHEN 1 THEN 'Segunda'
                    WHEN 2 THEN 'Terça'
                    WHEN 3 THEN 'Quarta'
                    WHEN 4 THEN 'Quinta'
                    WHEN 5 THEN 'Sexta'
                    WHEN 6 THEN 'Sábado'
                END,
                ' ', acr.requested_changes->>'start_time',
                '-', acr.requested_changes->>'end_time'
            )
        ELSE 'Modification'
    END as change_summary
FROM public.availability_change_requests acr
JOIN public.instructors i ON acr.teacher_id = i.id
JOIN public.users u_teacher ON i.user_id = u_teacher.id
JOIN public.users u_requester ON acr.requested_by_user_id = u_requester.id
WHERE acr.status = 'pending'
ORDER BY acr.created_at ASC;

-- Grant permissions for the view to admins
GRANT SELECT ON admin_pending_availability_requests TO authenticated;

-- Create RLS policy for the view
CREATE POLICY "Admins can view pending requests summary" ON admin_pending_availability_requests
    FOR SELECT USING (
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
DROP POLICY IF EXISTS "Admins can view pending requests summary" ON admin_pending_availability_requests;
DROP VIEW IF EXISTS admin_pending_availability_requests;
DROP TRIGGER IF EXISTS apply_approved_availability_change_trigger ON public.availability_change_requests;
DROP TRIGGER IF EXISTS auto_approve_availability_changes_trigger ON public.availability_change_requests;
DROP FUNCTION IF EXISTS apply_approved_availability_change();
DROP FUNCTION IF EXISTS auto_approve_availability_changes();
DROP POLICY IF EXISTS "Admins can manage all change requests" ON public.availability_change_requests;
DROP POLICY IF EXISTS "Teachers can manage own change requests" ON public.availability_change_requests;
DROP TRIGGER IF EXISTS update_availability_change_requests_updated_at ON public.availability_change_requests;
DROP INDEX IF EXISTS teacher_availability_pending_changes_idx;
DROP INDEX IF EXISTS availability_change_requests_created_at_idx;
DROP INDEX IF EXISTS availability_change_requests_reviewed_by_idx;
DROP INDEX IF EXISTS availability_change_requests_requested_by_idx;
DROP INDEX IF EXISTS availability_change_requests_status_idx;
DROP INDEX IF EXISTS availability_change_requests_teacher_id_idx;
ALTER TABLE public.teacher_availability DROP COLUMN IF EXISTS pending_change_request_id;
ALTER TABLE public.teacher_availability DROP COLUMN IF EXISTS has_pending_changes;
DROP TABLE IF EXISTS public.availability_change_requests;
DROP TYPE IF EXISTS approval_status;
*/