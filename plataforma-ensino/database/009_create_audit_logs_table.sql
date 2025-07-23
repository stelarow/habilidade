-- Migration 009: Create audit logs table for admin action tracking
-- This migration creates an audit_logs table to track all admin actions for compliance and security

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'BULK_CREATE', 'BULK_UPDATE', 'BULK_DELETE')),
    resource_type TEXT NOT NULL CHECK (resource_type IN ('holiday', 'teacher_availability', 'user', 'course', 'lesson', 'category', 'enrollment')),
    resource_id UUID, -- Can be null for bulk operations
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    changes JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id ON public.audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_id ON public.audit_logs(resource_id) WHERE resource_id IS NOT NULL;

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type_action ON public.audit_logs(resource_type, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_timestamp ON public.audit_logs(admin_id, timestamp DESC);

-- Add comments for documentation
COMMENT ON TABLE public.audit_logs IS 'Audit trail for all admin actions in the system';
COMMENT ON COLUMN public.audit_logs.action IS 'Type of action performed (CREATE, UPDATE, DELETE, BULK_*)';
COMMENT ON COLUMN public.audit_logs.resource_type IS 'Type of resource being modified';
COMMENT ON COLUMN public.audit_logs.resource_id IS 'ID of the specific resource (null for bulk operations)';
COMMENT ON COLUMN public.audit_logs.admin_id IS 'ID of the admin user who performed the action';
COMMENT ON COLUMN public.audit_logs.changes IS 'JSON object containing the changes made or affected data';
COMMENT ON COLUMN public.audit_logs.ip_address IS 'IP address of the admin user';
COMMENT ON COLUMN public.audit_logs.user_agent IS 'User agent string from the request';
COMMENT ON COLUMN public.audit_logs.timestamp IS 'When the action was performed';

-- Enable Row Level Security (RLS) on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs
-- Only admin users can read audit logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Only the system can insert audit logs (through API endpoints with service role)
CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- No updates or deletes allowed on audit logs (immutability)
CREATE POLICY "No updates allowed on audit logs" ON public.audit_logs
    FOR UPDATE USING (false);

CREATE POLICY "No deletes allowed on audit logs" ON public.audit_logs
    FOR DELETE USING (false);

-- Create a function to automatically clean up old audit logs (optional retention policy)
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Delete audit logs older than 2 years
    DELETE FROM public.audit_logs 
    WHERE timestamp < NOW() - INTERVAL '2 years';
    
    -- Log the cleanup action
    INSERT INTO public.audit_logs (
        action,
        resource_type,
        admin_id,
        changes,
        ip_address
    ) VALUES (
        'DELETE',
        'audit_logs',
        '00000000-0000-0000-0000-000000000000'::uuid, -- System user
        jsonb_build_object('reason', 'automated_cleanup', 'retention_period', '2_years'),
        '127.0.0.1'::inet
    );
END;
$$;

-- Add comment to the cleanup function
COMMENT ON FUNCTION public.cleanup_old_audit_logs() IS 'Automatically removes audit logs older than 2 years for data retention compliance';

-- Grant necessary permissions
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT INSERT ON public.audit_logs TO service_role;

-- Ensure the service_role can bypass RLS for inserting audit logs
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;

-- Create a view for admin dashboard to show recent audit activity
CREATE OR REPLACE VIEW public.recent_audit_activity AS
SELECT 
    al.id,
    al.action,
    al.resource_type,
    al.resource_id,
    u.full_name as admin_name,
    u.email as admin_email,
    al.changes,
    al.ip_address,
    al.timestamp
FROM public.audit_logs al
LEFT JOIN public.users u ON al.admin_id = u.id
WHERE al.timestamp >= NOW() - INTERVAL '30 days'
ORDER BY al.timestamp DESC
LIMIT 1000;

-- Add comment to the view
COMMENT ON VIEW public.recent_audit_activity IS 'Recent audit activity for admin dashboard (last 30 days, max 1000 records)';

-- Grant access to the view
GRANT SELECT ON public.recent_audit_activity TO authenticated;