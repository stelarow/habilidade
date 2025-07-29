-- Migration: Add Maintenance System Tables
-- Description: Creates tables for maintenance window management and bypass system
-- Feature: FEATURE_003_MAINTENANCE_MODE
-- Created: 2025-01-29

-- Create maintenance_windows table
CREATE TABLE IF NOT EXISTS maintenance_windows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
    affected_services JSONB DEFAULT '[]'::jsonb,
    bypass_enabled BOOLEAN DEFAULT true,
    notification_sent BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT future_start_time CHECK (start_time > NOW() - INTERVAL '1 hour' OR status != 'scheduled')
);

-- Create maintenance_bypass_users table
CREATE TABLE IF NOT EXISTS maintenance_bypass_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    maintenance_window_id UUID REFERENCES maintenance_windows(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ,
    is_permanent BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    
    -- Unique constraint to prevent duplicate bypass entries
    UNIQUE(user_id, maintenance_window_id)
);

-- Create indexes for performance
CREATE INDEX idx_maintenance_windows_status_time ON maintenance_windows(status, start_time, end_time);
CREATE INDEX idx_maintenance_windows_active ON maintenance_windows(status) WHERE status = 'active';
CREATE INDEX idx_maintenance_bypass_users_user_id ON maintenance_bypass_users(user_id);
CREATE INDEX idx_maintenance_bypass_users_expires ON maintenance_bypass_users(expires_at) WHERE expires_at IS NOT NULL;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to maintenance_windows
CREATE TRIGGER update_maintenance_windows_updated_at
    BEFORE UPDATE ON maintenance_windows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update maintenance status
CREATE OR REPLACE FUNCTION update_maintenance_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-activate scheduled maintenance when start_time is reached
    IF OLD.status = 'scheduled' AND NEW.start_time <= NOW() THEN
        NEW.status = 'active';
    END IF;
    
    -- Auto-complete active maintenance when end_time is reached
    IF OLD.status = 'active' AND NEW.end_time <= NOW() THEN
        NEW.status = 'completed';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply auto-status trigger
CREATE TRIGGER maintenance_auto_status_update
    BEFORE UPDATE ON maintenance_windows
    FOR EACH ROW
    EXECUTE FUNCTION update_maintenance_status();

-- Clean up expired bypass users function
CREATE OR REPLACE FUNCTION cleanup_expired_bypass()
RETURNS void AS $$
BEGIN
    DELETE FROM maintenance_bypass_users 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW();
END;
$$ language 'plpgsql';

-- Create RLS policies
ALTER TABLE maintenance_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_bypass_users ENABLE ROW LEVEL SECURITY;

-- Policy for maintenance_windows
CREATE POLICY "Admins can manage maintenance windows" ON maintenance_windows
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policy for public read of active maintenance (for middleware)
CREATE POLICY "Public can read active maintenance" ON maintenance_windows
    FOR SELECT
    USING (status = 'active');

-- Policy for maintenance_bypass_users
CREATE POLICY "Admins can manage bypass users" ON maintenance_bypass_users
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policy for users to check their own bypass status
CREATE POLICY "Users can check own bypass status" ON maintenance_bypass_users
    FOR SELECT
    USING (user_id = auth.uid());

-- Insert test data (optional - can be removed in production)
-- INSERT INTO maintenance_windows (title, description, start_time, end_time, affected_services)
-- VALUES (
--     'Test Maintenance Window',
--     'Testing the maintenance system',
--     NOW() + INTERVAL '1 day',
--     NOW() + INTERVAL '1 day 2 hours',
--     '["web", "api", "database"]'::jsonb
-- );