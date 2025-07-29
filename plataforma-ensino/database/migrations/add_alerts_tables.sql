-- Migration: Add Alert System Tables
-- Task 5 - FEATURE_001_SISTEMA_ALERTAS
-- Criação das tabelas para o sistema de alertas automatizados

-- ================================================
-- Alert Configurations Table
-- ================================================
CREATE TABLE IF NOT EXISTS alert_configurations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('downtime', 'performance', 'error', 'custom')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Threshold configuration
    threshold JSONB NOT NULL DEFAULT '{
        "value": 0,
        "unit": "ms",
        "comparison": "greater_than"
    }'::jsonb,
    
    -- Notification channels
    channels TEXT[] NOT NULL DEFAULT '{}',
    
    -- Alert state
    enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Escalation configuration
    escalation JSONB NOT NULL DEFAULT '{
        "enabled": false,
        "timeout": 30,
        "escalate_to": []
    }'::jsonb,
    
    -- Timing conditions
    conditions JSONB NOT NULL DEFAULT '{
        "duration": 5,
        "cooldown": 15
    }'::jsonb,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_threshold_value CHECK (
        (threshold->>'value')::numeric >= 0
    ),
    CONSTRAINT valid_escalation_timeout CHECK (
        (escalation->>'timeout')::integer > 0
    ),
    CONSTRAINT valid_duration CHECK (
        (conditions->>'duration')::integer > 0
    ),
    CONSTRAINT valid_cooldown CHECK (
        (conditions->>'cooldown')::integer > 0
    )
);

-- ================================================
-- Alert History Table
-- ================================================
CREATE TABLE IF NOT EXISTS alert_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_id UUID NOT NULL REFERENCES alert_configurations(id) ON DELETE CASCADE,
    
    -- Alert instance details
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'escalated')),
    
    -- Alert content
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    
    -- Timing information
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- User information
    acknowledged_by VARCHAR(255),
    
    -- Channel tracking
    channels_sent TEXT[] DEFAULT '{}',
    
    -- Escalation tracking
    escalation_count INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT valid_escalation_count CHECK (escalation_count >= 0),
    CONSTRAINT acknowledged_requires_user CHECK (
        (acknowledged_at IS NULL AND acknowledged_by IS NULL) OR
        (acknowledged_at IS NOT NULL AND acknowledged_by IS NOT NULL)
    ),
    CONSTRAINT resolved_after_acknowledged CHECK (
        resolved_at IS NULL OR acknowledged_at IS NULL OR resolved_at >= acknowledged_at
    )
);

-- ================================================
-- Alert Channel Configurations Table
-- ================================================
CREATE TABLE IF NOT EXISTS alert_channel_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    channel_type VARCHAR(20) NOT NULL CHECK (channel_type IN ('email', 'webhook', 'slack')),
    
    -- Channel configuration
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- State
    enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint per channel type
    UNIQUE(channel_type)
);

-- ================================================
-- Alert Statistics View
-- ================================================
CREATE OR REPLACE VIEW alert_statistics AS
SELECT 
    COUNT(*) as total_alerts,
    COUNT(*) FILTER (WHERE status = 'active') as active_alerts,
    COUNT(*) FILTER (WHERE status = 'acknowledged') as acknowledged_alerts,
    COUNT(*) FILTER (WHERE status = 'resolved') as resolved_alerts,
    COUNT(*) FILTER (WHERE status = 'escalated') as escalated_alerts,
    
    -- Alerts by severity
    COUNT(*) FILTER (WHERE severity = 'low') as low_severity_alerts,
    COUNT(*) FILTER (WHERE severity = 'medium') as medium_severity_alerts,
    COUNT(*) FILTER (WHERE severity = 'high') as high_severity_alerts,
    COUNT(*) FILTER (WHERE severity = 'critical') as critical_severity_alerts,
    
    -- Resolution metrics
    EXTRACT(EPOCH FROM AVG(resolved_at - triggered_at))/60 as avg_resolution_time_minutes,
    (COUNT(*) FILTER (WHERE escalation_count > 0))::float / GREATEST(COUNT(*), 1) * 100 as escalation_rate_percent,
    
    -- Time ranges
    MIN(triggered_at) as earliest_alert,
    MAX(triggered_at) as latest_alert
FROM alert_history;

-- ================================================
-- Indexes for Performance
-- ================================================

-- Alert configurations indexes
CREATE INDEX IF NOT EXISTS idx_alert_configurations_enabled ON alert_configurations(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_configurations_type ON alert_configurations(type);
CREATE INDEX IF NOT EXISTS idx_alert_configurations_severity ON alert_configurations(severity);

-- Alert history indexes
CREATE INDEX IF NOT EXISTS idx_alert_history_config_id ON alert_history(config_id);
CREATE INDEX IF NOT EXISTS idx_alert_history_status ON alert_history(status);
CREATE INDEX IF NOT EXISTS idx_alert_history_severity ON alert_history(severity);
CREATE INDEX IF NOT EXISTS idx_alert_history_triggered_at ON alert_history(triggered_at);
CREATE INDEX IF NOT EXISTS idx_alert_history_status_triggered ON alert_history(status, triggered_at);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_alert_history_active_escalation ON alert_history(status, escalation_count) 
    WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_alert_history_resolution_time ON alert_history(triggered_at, resolved_at) 
    WHERE resolved_at IS NOT NULL;

-- Alert channel configs indexes
CREATE INDEX IF NOT EXISTS idx_alert_channel_configs_enabled ON alert_channel_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_alert_channel_configs_type ON alert_channel_configs(channel_type);

-- ================================================
-- Row Level Security (RLS) Policies
-- ================================================

-- Enable RLS on all tables
ALTER TABLE alert_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_channel_configs ENABLE ROW LEVEL SECURITY;

-- Alert configurations policies
CREATE POLICY "Admin can manage alert configurations" ON alert_configurations
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN profiles ON profiles.id = auth.users.id
            WHERE auth.users.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Alert history policies  
CREATE POLICY "Admin can view all alert history" ON alert_history
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN profiles ON profiles.id = auth.users.id
            WHERE auth.users.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin can update alert history" ON alert_history
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN profiles ON profiles.id = auth.users.id
            WHERE auth.users.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "System can insert alert history" ON alert_history
    FOR INSERT TO authenticated
    WITH CHECK (true); -- Allow system to create alerts

-- Alert channel configs policies
CREATE POLICY "Admin can manage channel configs" ON alert_channel_configs
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN profiles ON profiles.id = auth.users.id
            WHERE auth.users.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- ================================================
-- Triggers and Functions
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_alert_configurations_updated_at 
    BEFORE UPDATE ON alert_configurations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_channel_configs_updated_at 
    BEFORE UPDATE ON alert_channel_configs  
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to validate alert configuration
CREATE OR REPLACE FUNCTION validate_alert_configuration()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate threshold structure
    IF NOT (NEW.threshold ? 'value' AND NEW.threshold ? 'unit' AND NEW.threshold ? 'comparison') THEN
        RAISE EXCEPTION 'Invalid threshold configuration: missing required fields';
    END IF;
    
    -- Validate escalation structure
    IF NOT (NEW.escalation ? 'enabled' AND NEW.escalation ? 'timeout') THEN
        RAISE EXCEPTION 'Invalid escalation configuration: missing required fields';
    END IF;
    
    -- Validate conditions structure
    IF NOT (NEW.conditions ? 'duration' AND NEW.conditions ? 'cooldown') THEN
        RAISE EXCEPTION 'Invalid conditions configuration: missing required fields';
    END IF;
    
    -- Validate channels array is not empty
    IF array_length(NEW.channels, 1) IS NULL OR array_length(NEW.channels, 1) = 0 THEN
        RAISE EXCEPTION 'At least one notification channel must be specified';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for alert configuration validation
CREATE TRIGGER validate_alert_configuration_trigger
    BEFORE INSERT OR UPDATE ON alert_configurations  
    FOR EACH ROW EXECUTE FUNCTION validate_alert_configuration();

-- Function to auto-resolve old active alerts
CREATE OR REPLACE FUNCTION auto_resolve_old_alerts()
RETURNS void AS $$
BEGIN
    -- Auto-resolve alerts that have been active for more than 24 hours without escalation
    UPDATE alert_history 
    SET 
        status = 'resolved',
        resolved_at = NOW()
    WHERE 
        status = 'active' 
        AND triggered_at < NOW() - INTERVAL '24 hours'
        AND escalation_count = 0;
        
    -- Log the action
    INSERT INTO alert_history (
        config_id,
        severity,
        status,
        title,
        message,
        data
    )
    SELECT 
        (SELECT id FROM alert_configurations WHERE name = 'System Auto-Resolution' LIMIT 1),
        'low',
        'resolved',
        'Auto-resolved old alerts',
        'System automatically resolved alerts older than 24 hours',
        jsonb_build_object(
            'resolved_count', ROW_COUNT,
            'auto_resolved', true,
            'timestamp', NOW()
        )
    WHERE ROW_COUNT > 0;
END;
$$ language 'plpgsql';

-- ================================================
-- Initial Data Setup
-- ================================================

-- Insert default channel configurations
INSERT INTO alert_channel_configs (channel_type, config, enabled) VALUES
('email', jsonb_build_object(
    'recipients', ARRAY['admin@escolahabilidade.com.br'],
    'smtp_server', 'smtp.gmail.com',
    'smtp_port', 587,
    'use_tls', true
), true),
('webhook', jsonb_build_object(
    'url', '',
    'method', 'POST',
    'headers', jsonb_build_object('Content-Type', 'application/json'),
    'timeout', 10000
), false),
('slack', jsonb_build_object(
    'webhook_url', '',
    'channel', '#alerts',
    'username', 'Habilidade Alert Bot'
), false)
ON CONFLICT (channel_type) DO NOTHING;

-- Insert default alert configurations
INSERT INTO alert_configurations (name, type, severity, threshold, channels, conditions, metadata) VALUES
('API Downtime Alert', 'downtime', 'critical', 
    jsonb_build_object('value', 5, 'unit', 'minutes', 'comparison', 'greater_than'),
    ARRAY['email'],
    jsonb_build_object('duration', 5, 'cooldown', 15),
    jsonb_build_object('description', 'Alerts when API is down for more than 5 minutes')
),
('High Response Time Alert', 'performance', 'high',
    jsonb_build_object('value', 3000, 'unit', 'ms', 'comparison', 'greater_than'),
    ARRAY['email'],
    jsonb_build_object('duration', 5, 'cooldown', 30),
    jsonb_build_object('description', 'Alerts when response time exceeds 3 seconds consistently', 'metric', 'response_time')
),
('High Error Rate Alert', 'error', 'high',
    jsonb_build_object('value', 10, 'unit', '%', 'comparison', 'greater_than'),
    ARRAY['email'],
    jsonb_build_object('duration', 3, 'cooldown', 20),
    jsonb_build_object('description', 'Alerts when error rate exceeds 10%')
)
ON CONFLICT DO NOTHING;

-- ================================================
-- Cleanup Job Setup
-- ================================================

-- Function to clean up old alert history
CREATE OR REPLACE FUNCTION cleanup_old_alert_history()
RETURNS void AS $$
BEGIN
    -- Delete resolved alerts older than 90 days
    DELETE FROM alert_history 
    WHERE 
        status = 'resolved' 
        AND resolved_at < NOW() - INTERVAL '90 days';
        
    -- Delete acknowledged alerts older than 30 days
    DELETE FROM alert_history 
    WHERE 
        status = 'acknowledged' 
        AND acknowledged_at < NOW() - INTERVAL '30 days';
END;
$$ language 'plpgsql';

-- ================================================
-- Permissions
-- ================================================

-- Grant permissions to authenticated users (will be filtered by RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON alert_configurations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON alert_history TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON alert_channel_configs TO authenticated;
GRANT SELECT ON alert_statistics TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ================================================
-- Comments for Documentation
-- ================================================

COMMENT ON TABLE alert_configurations IS 'Stores alert rule configurations with thresholds and notification settings';
COMMENT ON TABLE alert_history IS 'Stores history of all triggered alerts with their lifecycle status';
COMMENT ON TABLE alert_channel_configs IS 'Stores configuration for different notification channels';
COMMENT ON VIEW alert_statistics IS 'Provides aggregated statistics about alert system performance';

COMMENT ON COLUMN alert_configurations.threshold IS 'JSON configuration for alert threshold (value, unit, comparison)';
COMMENT ON COLUMN alert_configurations.escalation IS 'JSON configuration for alert escalation settings';
COMMENT ON COLUMN alert_configurations.conditions IS 'JSON configuration for timing conditions (duration, cooldown)';
COMMENT ON COLUMN alert_history.data IS 'JSON data captured when alert was triggered';
COMMENT ON COLUMN alert_history.channels_sent IS 'Array of channels where this alert was successfully sent';

-- Migration completed successfully
SELECT 'Alert system tables created successfully' as result;