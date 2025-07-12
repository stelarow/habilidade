-- Admin Security Policies
-- These policies ensure that only users with 'admin' role can access admin-specific data

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- RLS Policy for admin-only access to all users data
CREATE POLICY "Admins can view all users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR 
    id = auth.uid()  -- Users can still view their own data
  );

CREATE POLICY "Admins can manage all users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policy for courses management
CREATE POLICY "Admins can manage all courses"
  ON public.courses
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR 
    instructor_id = auth.uid()  -- Instructors can manage their own courses
  )
  WITH CHECK (
    public.is_admin() OR 
    instructor_id = auth.uid()
  );

-- RLS Policy for enrollments management
CREATE POLICY "Admins can view all enrollments"
  ON public.enrollments
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR 
    user_id = auth.uid()  -- Users can view their own enrollments
  );

CREATE POLICY "Admins can manage all enrollments"
  ON public.enrollments
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- RLS Policy for admin settings (if this table exists)
-- Uncomment if you have admin_settings table
/*
CREATE POLICY "Only admins can access settings"
  ON public.admin_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
*/

-- Function to check specific admin permissions
CREATE OR REPLACE FUNCTION public.has_admin_permission(permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.has_admin_permission(TEXT) TO authenticated;

-- Log admin actions (optional - for audit trail)
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for audit log - only admins can view
CREATE POLICY "Only admins can view audit log"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;