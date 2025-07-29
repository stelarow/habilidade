-- Monitoring and Maintenance Database Schema
-- Run this script in your Supabase SQL editor to create monitoring tables

-- Table for uptime monitoring data
CREATE TABLE IF NOT EXISTS uptime_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    overall_status TEXT NOT NULL CHECK (overall_status IN ('healthy', 'warning', 'degraded', 'critical')),
    overall_message TEXT,
    services_data JSONB NOT NULL,
    response_times JSONB NOT NULL,
    is_healthy BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_uptime_monitoring_timestamp ON uptime_monitoring(timestamp);
CREATE INDEX IF NOT EXISTS idx_uptime_monitoring_status ON uptime_monitoring(overall_status);
CREATE INDEX IF NOT EXISTS idx_uptime_monitoring_healthy ON uptime_monitoring(is_healthy);

-- Table for system incidents
CREATE TABLE IF NOT EXISTS system_incidents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration INTEGER, -- in milliseconds
    status TEXT NOT NULL CHECK (status IN ('warning', 'degraded', 'critical')),
    affected_services JSONB NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for incidents
CREATE INDEX IF NOT EXISTS idx_system_incidents_start_time ON system_incidents(start_time);
CREATE INDEX IF NOT EXISTS idx_system_incidents_status ON system_incidents(status);
CREATE INDEX IF NOT EXISTS idx_system_incidents_resolved ON system_incidents(is_resolved);

-- Table for system alerts
CREATE TABLE IF NOT EXISTS system_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    alert_data JSONB,
    timestamp TIMESTAMPTZ NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for alerts
CREATE INDEX IF NOT EXISTS idx_system_alerts_timestamp ON system_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_resolved ON system_alerts(is_resolved);

-- Table for system logs
CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY, -- Use the log ID from logger
    timestamp TIMESTAMPTZ NOT NULL,
    level INTEGER NOT NULL,
    level_name TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    context JSONB,
    session_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for logs
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_session ON system_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_name ON system_logs(level_name);

-- Table for critical logs (high priority)
CREATE TABLE IF NOT EXISTS critical_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    context JSONB,
    session_id TEXT NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES profiles(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for critical logs
CREATE INDEX IF NOT EXISTS idx_critical_logs_timestamp ON critical_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_critical_logs_acknowledged ON critical_logs(acknowledged);

-- Table for log analytics
CREATE TABLE IF NOT EXISTS log_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    levels JSONB NOT NULL,
    types JSONB NOT NULL,
    hourly JSONB NOT NULL,
    error_count INTEGER DEFAULT 0,
    performance_samples INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for log analytics
CREATE INDEX IF NOT EXISTS idx_log_analytics_timestamp ON log_analytics(timestamp);

-- Table for backup operations
CREATE TABLE IF NOT EXISTS backup_operations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    backup_type TEXT NOT NULL CHECK (backup_type IN ('full', 'incremental', 'differential')),
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    file_path TEXT,
    file_size BIGINT,
    tables_backed_up TEXT[],
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for backup operations
CREATE INDEX IF NOT EXISTS idx_backup_operations_started_at ON backup_operations(started_at);
CREATE INDEX IF NOT EXISTS idx_backup_operations_status ON backup_operations(status);
CREATE INDEX IF NOT EXISTS idx_backup_operations_type ON backup_operations(backup_type);

-- Table for maintenance windows
CREATE TABLE IF NOT EXISTS maintenance_windows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    affected_services TEXT[],
    maintenance_type TEXT NOT NULL,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for maintenance windows
CREATE INDEX IF NOT EXISTS idx_maintenance_windows_scheduled ON maintenance_windows(scheduled_start, scheduled_end);
CREATE INDEX IF NOT EXISTS idx_maintenance_windows_status ON maintenance_windows(status);

-- Table for audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_id TEXT,
    additional_data JSONB
);

-- Index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Table for feature flags (for maintenance mode)
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    conditions JSONB, -- Rules for when flag should be enabled
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
    created_by UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for feature flags
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled);

-- RLS Policies

-- Enable RLS on all monitoring tables
ALTER TABLE uptime_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE critical_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Policies for admin access to monitoring data
CREATE POLICY "Admins can view all monitoring data" ON uptime_monitoring
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert monitoring data" ON uptime_monitoring
    FOR INSERT WITH CHECK (true); -- Allow system inserts

CREATE POLICY "Admins can view all incidents" ON system_incidents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can manage incidents" ON system_incidents
    FOR ALL USING (true); -- Allow system management

CREATE POLICY "Admins can view all alerts" ON system_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can resolve alerts" ON system_alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert alerts" ON system_alerts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view system logs" ON system_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert logs" ON system_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view critical logs" ON critical_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can acknowledge critical logs" ON critical_logs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert critical logs" ON critical_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view log analytics" ON log_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert log analytics" ON log_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view backup operations" ON backup_operations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can manage backup operations" ON backup_operations
    FOR ALL USING (true);

CREATE POLICY "Admins can manage maintenance windows" ON maintenance_windows
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage feature flags" ON feature_flags
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Automatic cleanup functions
CREATE OR REPLACE FUNCTION cleanup_old_monitoring_data()
RETURNS void AS $$
BEGIN
    -- Delete uptime monitoring data older than 30 days
    DELETE FROM uptime_monitoring 
    WHERE timestamp < NOW() - INTERVAL '30 days';
    
    -- Delete resolved incidents older than 90 days
    DELETE FROM system_incidents 
    WHERE is_resolved = true 
    AND end_time < NOW() - INTERVAL '90 days';
    
    -- Delete resolved alerts older than 30 days
    DELETE FROM system_alerts 
    WHERE is_resolved = true 
    AND resolved_at < NOW() - INTERVAL '30 days';
    
    -- Delete system logs older than 7 days (except ERROR and CRITICAL)
    DELETE FROM system_logs 
    WHERE timestamp < NOW() - INTERVAL '7 days'
    AND level < 3;
    
    -- Delete error logs older than 30 days
    DELETE FROM system_logs 
    WHERE timestamp < NOW() - INTERVAL '30 days'
    AND level >= 3;
    
    -- Delete acknowledged critical logs older than 14 days
    DELETE FROM critical_logs 
    WHERE acknowledged = true 
    AND acknowledged_at < NOW() - INTERVAL '14 days';
    
    -- Delete log analytics older than 90 days
    DELETE FROM log_analytics 
    WHERE timestamp < NOW() - INTERVAL '90 days';
    
    -- Delete completed backup operations older than 180 days
    DELETE FROM backup_operations 
    WHERE status = 'completed' 
    AND completed_at < NOW() - INTERVAL '180 days';
    
    -- Delete audit logs older than 1 year
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup to run daily
SELECT cron.schedule('cleanup-monitoring-data', '0 2 * * *', 'SELECT cleanup_old_monitoring_data();');

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_additional_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        old_values,
        new_values,
        additional_data
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_old_values,
        p_new_values,
        p_additional_data
    )
    RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Create initial feature flags for maintenance mode
INSERT INTO feature_flags (key, name, description, is_enabled, created_by)
SELECT 
    'maintenance_mode',
    'Maintenance Mode',
    'Global maintenance mode flag',
    false,
    id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT (key) DO NOTHING;

INSERT INTO feature_flags (key, name, description, is_enabled, created_by)
SELECT 
    'blog_write_access',
    'Blog Write Access',
    'Allow blog post creation and editing',
    true,
    id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT (key) DO NOTHING;

INSERT INTO feature_flags (key, name, description, is_enabled, created_by)
SELECT 
    'debug_mode',
    'Debug Mode',
    'Enable debug logging and error reporting',
    false,
    id
FROM profiles 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT (key) DO NOTHING;

-- Triggers for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'INSERT',
            TG_TABLE_NAME,
            NEW.id::TEXT,
            NULL,
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'UPDATE',
            TG_TABLE_NAME,
            NEW.id::TEXT,
            to_jsonb(OLD),
            to_jsonb(NEW)
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM create_audit_log(
            auth.uid(),
            'DELETE',
            TG_TABLE_NAME,
            OLD.id::TEXT,
            to_jsonb(OLD),
            NULL
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE uptime_monitoring IS 'Stores health check results and uptime data';
COMMENT ON TABLE system_incidents IS 'Tracks system downtime incidents';
COMMENT ON TABLE system_alerts IS 'Stores system alerts and notifications';
COMMENT ON TABLE system_logs IS 'Centralized application logging';
COMMENT ON TABLE critical_logs IS 'High-priority logs requiring immediate attention';
COMMENT ON TABLE log_analytics IS 'Aggregated log statistics and metrics';
COMMENT ON TABLE backup_operations IS 'Tracks backup operations and status';
COMMENT ON TABLE maintenance_windows IS 'Scheduled maintenance periods';
COMMENT ON TABLE audit_logs IS 'Audit trail for system changes';
COMMENT ON TABLE feature_flags IS 'Feature flags for controlling system behavior';