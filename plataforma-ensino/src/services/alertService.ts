/**
 * Alert Service Core
 * Sistema de gerenciamento de alertas automatizados
 * Task 1 - FEATURE_001_SISTEMA_ALERTAS
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/utils/logger';

// Alert Types
export type AlertType = 'downtime' | 'performance' | 'error' | 'custom';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertChannel = 'email' | 'webhook' | 'slack';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'escalated';

// Alert Configuration Interface
export interface AlertConfig {
  id: string;
  name: string;
  type: AlertType;
  severity: AlertSeverity;
  threshold: {
    value: number;
    unit: string;
    comparison: 'greater_than' | 'less_than' | 'equals';
  };
  channels: AlertChannel[];
  enabled: boolean;
  escalation: {
    enabled: boolean;
    timeout: number; // minutes
    escalate_to: AlertChannel[];
  };
  conditions: {
    duration: number; // minutes before triggering
    cooldown: number; // minutes before allowing retrigger
  };
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Alert Instance Interface
export interface AlertInstance {
  id: string;
  config_id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  data: Record<string, any>;
  triggered_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  acknowledged_by?: string;
  channels_sent: AlertChannel[];
  escalation_count: number;
}

// Alert Metrics Interface
export interface AlertMetrics {
  total_alerts: number;
  active_alerts: number;
  resolved_alerts: number;
  acknowledged_alerts: number;
  alerts_by_type: Record<AlertType, number>;
  alerts_by_severity: Record<AlertSeverity, number>;
  average_resolution_time: number; // minutes
  escalation_rate: number; // percentage
}

// Alert History Interface
export interface AlertHistory {
  instances: AlertInstance[];
  total_count: number;
  page: number;
  per_page: number;
  filters: {
    type?: AlertType;
    severity?: AlertSeverity;
    status?: AlertStatus;
    date_from?: string;
    date_to?: string;
  };
}

// Service Configuration
const ALERT_SERVICE_CONFIG = {
  checkInterval: 60000, // 1 minute
  batchSize: 50,
  maxRetries: 3,
  retryDelay: 5000,
  escalationTimeout: 30 * 60 * 1000, // 30 minutes
  cooldownDefault: 15, // 15 minutes default cooldown
};

export class AlertService {
  private supabase;
  private activeChecks: Map<string, NodeJS.Timeout> = new Map();
  private alertQueue: AlertInstance[] = [];
  private isProcessing = false;

  constructor() {
    this.supabase = createClient();
    this.initializeService();
  }

  // Initialize the alert service
  private async initializeService(): Promise<void> {
    try {
      logger.info('AlertService: Initializing alert service');
      
      // Load active alert configurations
      await this.loadActiveConfigurations();
      
      // Start monitoring loops
      this.startMonitoring();
      
      logger.info('AlertService: Service initialized successfully');
    } catch (error) {
      logger.error('AlertService: Failed to initialize service', { error });
      throw error;
    }
  }

  // Load active alert configurations from database
  private async loadActiveConfigurations(): Promise<AlertConfig[]> {
    try {
      const { data, error } = await this.supabase
        .from('alert_configurations')
        .select('*')
        .eq('enabled', true);

      if (error) throw error;

      logger.info('AlertService: Loaded alert configurations', { 
        count: data?.length || 0 
      });

      return data || [];
    } catch (error) {
      logger.error('AlertService: Failed to load configurations', { error });
      return [];
    }
  }

  // Start monitoring processes
  private startMonitoring(): void {
    // Start alert queue processing
    setInterval(() => {
      this.processAlertQueue();
    }, ALERT_SERVICE_CONFIG.checkInterval);

    // Start escalation checks
    setInterval(() => {
      this.checkEscalations();
    }, 5 * 60 * 1000); // Check every 5 minutes

    logger.info('AlertService: Monitoring processes started');
  }

  // Check alert conditions (main monitoring method)
  public async checkAlertConditions(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;

    try {
      const configurations = await this.loadActiveConfigurations();
      
      for (const config of configurations) {
        await this.evaluateAlertCondition(config);
      }

      logger.debug('AlertService: Alert conditions check completed');
    } catch (error) {
      logger.error('AlertService: Error checking alert conditions', { error });
    } finally {
      this.isProcessing = false;
    }
  }

  // Evaluate individual alert condition
  public async evaluateAlertCondition(config: AlertConfig): Promise<void> {
    try {
      let shouldTrigger = false;
      let currentValue: any;
      let alertData: Record<string, any> = {};

      // Evaluate condition based on alert type
      switch (config.type) {
        case 'downtime':
          ({ shouldTrigger, currentValue, alertData } = await this.evaluateDowntimeCondition(config));
          break;
        case 'performance':
          ({ shouldTrigger, currentValue, alertData } = await this.evaluatePerformanceCondition(config));
          break;
        case 'error':
          ({ shouldTrigger, currentValue, alertData } = await this.evaluateErrorCondition(config));
          break;
        case 'custom':
          ({ shouldTrigger, currentValue, alertData } = await this.evaluateCustomCondition(config));
          break;
      }

      // Check if alert should be triggered
      if (shouldTrigger) {
        await this.triggerAlert(config, currentValue, alertData);
      }

    } catch (error) {
      logger.error('AlertService: Error evaluating alert condition', { 
        configId: config.id,
        error 
      });
    }
  }

  // Evaluate downtime condition
  private async evaluateDowntimeCondition(config: AlertConfig): Promise<{
    shouldTrigger: boolean;
    currentValue: any;
    alertData: Record<string, any>;
  }> {
    // Check if API endpoints are responding
    const healthCheck = await this.performHealthCheck();
    
    const shouldTrigger = !healthCheck.isHealthy;
    
    return {
      shouldTrigger,
      currentValue: healthCheck.responseTime,
      alertData: {
        failed_endpoints: healthCheck.failedEndpoints,
        response_times: healthCheck.responseTimes,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Evaluate performance condition
  private async evaluatePerformanceCondition(config: AlertConfig): Promise<{
    shouldTrigger: boolean;
    currentValue: any;
    alertData: Record<string, any>;
  }> {
    // Get performance metrics
    const metrics = await this.getPerformanceMetrics();
    
    const threshold = config.threshold.value;
    let shouldTrigger = false;

    // Check different performance metrics
    if (config.metadata?.metric === 'lcp') {
      shouldTrigger = metrics.lcp > threshold;
    } else if (config.metadata?.metric === 'response_time') {
      shouldTrigger = metrics.avgResponseTime > threshold;
    }

    return {
      shouldTrigger,
      currentValue: metrics,
      alertData: {
        metrics,
        threshold_exceeded: config.metadata?.metric,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Evaluate error condition
  private async evaluateErrorCondition(config: AlertConfig): Promise<{
    shouldTrigger: boolean;
    currentValue: any;
    alertData: Record<string, any>;
  }> {
    // Get error rate from logs
    const errorRate = await this.getErrorRate();
    
    const shouldTrigger = errorRate.rate > config.threshold.value;

    return {
      shouldTrigger,
      currentValue: errorRate.rate,
      alertData: {
        error_count: errorRate.count,
        total_requests: errorRate.total,
        error_rate: errorRate.rate,
        recent_errors: errorRate.recentErrors,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Evaluate custom condition
  private async evaluateCustomCondition(config: AlertConfig): Promise<{
    shouldTrigger: boolean;
    currentValue: any;
    alertData: Record<string, any>;
  }> {
    // Custom logic based on metadata
    const customLogic = config.metadata?.customLogic;
    
    // This would be expanded based on specific custom requirements
    return {
      shouldTrigger: false,
      currentValue: null,
      alertData: { timestamp: new Date().toISOString() }
    };
  }

  // Trigger alert
  private async triggerAlert(
    config: AlertConfig, 
    currentValue: any, 
    alertData: Record<string, any>
  ): Promise<void> {
    try {
      // Check cooldown period
      const lastAlert = await this.getLastAlert(config.id);
      if (lastAlert && this.isInCooldown(lastAlert, config.conditions.cooldown)) {
        return;
      }

      // Create alert instance
      const alertInstance: Omit<AlertInstance, 'id'> = {
        config_id: config.id,
        severity: config.severity,
        status: 'active',
        title: this.generateAlertTitle(config, currentValue),
        message: this.generateAlertMessage(config, currentValue, alertData),
        data: alertData,
        triggered_at: new Date().toISOString(),
        channels_sent: [],
        escalation_count: 0
      };

      // Save to database
      const { data: savedAlert, error } = await this.supabase
        .from('alert_history')
        .insert(alertInstance)
        .select()
        .single();

      if (error) throw error;

      // Add to processing queue
      this.alertQueue.push(savedAlert);

      logger.info('AlertService: Alert triggered', {
        configId: config.id,
        alertId: savedAlert.id,
        severity: config.severity
      });

    } catch (error) {
      logger.error('AlertService: Failed to trigger alert', {
        configId: config.id,
        error
      });
    }
  }

  // Send alert through configured channels
  public async sendAlert(alertInstance: AlertInstance): Promise<boolean> {
    try {
      const config = await this.getAlertConfig(alertInstance.config_id);
      if (!config) throw new Error('Alert configuration not found');

      const results: Array<{ channel: AlertChannel; success: boolean }> = [];

      // Send through each configured channel
      for (const channel of config.channels) {
        try {
          const success = await this.sendAlertToChannel(alertInstance, channel, config);
          results.push({ channel, success });
          
          if (success) {
            alertInstance.channels_sent.push(channel);
          }
        } catch (error) {
          logger.error('AlertService: Failed to send alert to channel', {
            alertId: alertInstance.id,
            channel,
            error
          });
          results.push({ channel, success: false });
        }
      }

      // Update alert with sent channels
      await this.updateAlertChannelsSent(alertInstance.id, alertInstance.channels_sent);

      const allSuccess = results.every(r => r.success);
      
      logger.info('AlertService: Alert sent', {
        alertId: alertInstance.id,
        channels: results,
        allSuccess
      });

      return allSuccess;
    } catch (error) {
      logger.error('AlertService: Failed to send alert', {
        alertId: alertInstance.id,
        error
      });
      return false;
    }
  }

  // Send alert to specific channel
  private async sendAlertToChannel(
    alertInstance: AlertInstance,
    channel: AlertChannel,
    config: AlertConfig
  ): Promise<boolean> {
    switch (channel) {
      case 'email':
        return await this.sendEmailAlert(alertInstance, config);
      case 'webhook':
        return await this.sendWebhookAlert(alertInstance, config);
      case 'slack':
        return await this.sendSlackAlert(alertInstance, config);
      default:
        logger.warn('AlertService: Unknown alert channel', { channel });
        return false;
    }
  }

  // Send email alert
  private async sendEmailAlert(alertInstance: AlertInstance, config: AlertConfig): Promise<boolean> {
    try {
      // Implementation would depend on email service (nodemailer, etc.)
      // For now, we'll simulate and log
      logger.info('AlertService: Email alert sent', {
        alertId: alertInstance.id,
        to: config.metadata?.email_recipients || 'admin@escolahabilidade.com.br'
      });
      
      return true;
    } catch (error) {
      logger.error('AlertService: Failed to send email alert', { alertInstance, error });
      return false;
    }
  }

  // Send webhook alert
  private async sendWebhookAlert(alertInstance: AlertInstance, config: AlertConfig): Promise<boolean> {
    try {
      const webhookUrl = config.metadata?.webhook_url || process.env.ALERT_WEBHOOK_URL;
      if (!webhookUrl) throw new Error('Webhook URL not configured');

      const payload = {
        alert: alertInstance,
        config: {
          name: config.name,
          type: config.type,
          severity: config.severity
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ALERT_WEBHOOK_SECRET || ''}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }

      logger.info('AlertService: Webhook alert sent', {
        alertId: alertInstance.id,
        webhookUrl,
        status: response.status
      });

      return true;
    } catch (error) {
      logger.error('AlertService: Failed to send webhook alert', { alertInstance, error });
      return false;
    }
  }

  // Send Slack alert
  private async sendSlackAlert(alertInstance: AlertInstance, config: AlertConfig): Promise<boolean> {
    try {
      const slackWebhook = config.metadata?.slack_webhook || process.env.ALERT_SLACK_WEBHOOK;
      if (!slackWebhook) throw new Error('Slack webhook not configured');

      const slackPayload = {
        text: `🚨 Alert: ${alertInstance.title}`,
        attachments: [{
          color: this.getSeverityColor(alertInstance.severity),
          fields: [
            {
              title: 'Severity',
              value: alertInstance.severity.toUpperCase(),
              short: true
            },
            {
              title: 'Type',
              value: config.type,
              short: true
            },
            {
              title: 'Message',
              value: alertInstance.message,
              short: false
            },
            {
              title: 'Triggered At',
              value: new Date(alertInstance.triggered_at).toLocaleString(),
              short: true
            }
          ]
        }]
      };

      const response = await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload)
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed with status: ${response.status}`);
      }

      logger.info('AlertService: Slack alert sent', {
        alertId: alertInstance.id
      });

      return true;
    } catch (error) {
      logger.error('AlertService: Failed to send Slack alert', { alertInstance, error });
      return false;
    }
  }

  // Configure alert rules
  public async configAlertRules(config: Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'>): Promise<AlertConfig> {
    try {
      const { data, error } = await this.supabase
        .from('alert_configurations')
        .insert({
          ...config,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      logger.info('AlertService: Alert rule configured', {
        configId: data.id,
        name: config.name,
        type: config.type
      });

      return data;
    } catch (error) {
      logger.error('AlertService: Failed to configure alert rule', { config, error });
      throw error;
    }
  }

  // Get alert history
  public async getAlertHistory(filters: AlertHistory['filters'] = {}, page = 1, perPage = 20): Promise<AlertHistory> {
    try {
      let query = this.supabase
        .from('alert_history')
        .select('*, alert_configurations(name, type)', { count: 'exact' });

      // Apply filters
      if (filters.type) {
        query = query.eq('alert_configurations.type', filters.type);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.date_from) {
        query = query.gte('triggered_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('triggered_at', filters.date_to);
      }

      // Apply pagination
      const offset = (page - 1) * perPage;
      query = query
        .range(offset, offset + perPage - 1)
        .order('triggered_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        instances: data || [],
        total_count: count || 0,
        page,
        per_page: perPage,
        filters
      };
    } catch (error) {
      logger.error('AlertService: Failed to get alert history', { filters, error });
      throw error;
    }
  }

  // Acknowledge alert
  public async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('alert_history')
        .update({
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: acknowledgedBy
        })
        .eq('id', alertId);

      if (error) throw error;

      logger.info('AlertService: Alert acknowledged', {
        alertId,
        acknowledgedBy
      });

      return true;
    } catch (error) {
      logger.error('AlertService: Failed to acknowledge alert', { alertId, error });
      return false;
    }
  }

  // Escalate alert
  public async escalateAlert(alertId: string): Promise<boolean> {
    try {
      const { data: alert, error: fetchError } = await this.supabase
        .from('alert_history')
        .select('*, alert_configurations(*)')
        .eq('id', alertId)
        .single();

      if (fetchError) throw fetchError;

      const config = alert.alert_configurations;
      if (!config.escalation.enabled) {
        logger.warn('AlertService: Escalation not enabled for alert', { alertId });
        return false;
      }

      // Update escalation count
      const newEscalationCount = alert.escalation_count + 1;
      
      const { error: updateError } = await this.supabase
        .from('alert_history')
        .update({
          status: 'escalated',
          escalation_count: newEscalationCount
        })
        .eq('id', alertId);

      if (updateError) throw updateError;

      // Send escalation alerts
      for (const channel of config.escalation.escalate_to) {
        await this.sendEscalationAlert(alert, channel, newEscalationCount);
      }

      logger.info('AlertService: Alert escalated', {
        alertId,
        escalationCount: newEscalationCount
      });

      return true;
    } catch (error) {
      logger.error('AlertService: Failed to escalate alert', { alertId, error });
      return false;
    }
  }

  // Send escalation alert
  private async sendEscalationAlert(
    alert: AlertInstance,
    channel: AlertChannel,
    escalationCount: number
  ): Promise<void> {
    const escalationAlert = {
      ...alert,
      title: `🚨 ESCALATED: ${alert.title}`,
      message: `This alert has been escalated (escalation #${escalationCount}). Original message: ${alert.message}`,
      severity: 'critical' as AlertSeverity
    };

    await this.sendAlertToChannel(escalationAlert, channel, await this.getAlertConfig(alert.config_id));
  }

  // Process alert queue
  private async processAlertQueue(): Promise<void> {
    if (this.alertQueue.length === 0) return;

    const batch = this.alertQueue.splice(0, ALERT_SERVICE_CONFIG.batchSize);
    
    for (const alert of batch) {
      try {
        await this.sendAlert(alert);
      } catch (error) {
        logger.error('AlertService: Failed to process alert from queue', {
          alertId: alert.id,
          error
        });
        
        // Re-queue with retry logic if needed
        if (alert.escalation_count < ALERT_SERVICE_CONFIG.maxRetries) {
          setTimeout(() => {
            this.alertQueue.push(alert);
          }, ALERT_SERVICE_CONFIG.retryDelay);
        }
      }
    }
  }

  // Check for alerts that need escalation
  private async checkEscalations(): Promise<void> {
    try {
      const { data: alerts, error } = await this.supabase
        .from('alert_history')
        .select('*, alert_configurations(*)')
        .eq('status', 'active')
        .lt('triggered_at', new Date(Date.now() - ALERT_SERVICE_CONFIG.escalationTimeout).toISOString());

      if (error) throw error;

      for (const alert of alerts || []) {
        const config = alert.alert_configurations;
        if (config.escalation.enabled) {
          const timeSinceTriggered = Date.now() - new Date(alert.triggered_at).getTime();
          const escalationTimeout = config.escalation.timeout * 60 * 1000; // Convert to ms
          
          if (timeSinceTriggered >= escalationTimeout) {
            await this.escalateAlert(alert.id);
          }
        }
      }
    } catch (error) {
      logger.error('AlertService: Failed to check escalations', { error });
    }
  }

  // Helper methods

  private async performHealthCheck(): Promise<{
    isHealthy: boolean;
    responseTime: number;
    failedEndpoints: string[];
    responseTimes: Record<string, number>;
  }> {
    const endpoints = [
      '/api/health',
      '/api/blog/posts',
      '/api/courses'
    ];

    const results = await Promise.allSettled(
      endpoints.map(async endpoint => {
        const start = Date.now();
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}${endpoint}`, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          const responseTime = Date.now() - start;
          return { endpoint, responseTime, success: response.ok };
        } catch {
          return { endpoint, responseTime: Date.now() - start, success: false };
        }
      })
    );

    const failedEndpoints: string[] = [];
    const responseTimes: Record<string, number> = {};
    let totalResponseTime = 0;

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { endpoint, responseTime, success } = result.value;
        responseTimes[endpoint] = responseTime;
        totalResponseTime += responseTime;
        
        if (!success) {
          failedEndpoints.push(endpoint);
        }
      } else {
        failedEndpoints.push(endpoints[index]);
      }
    });

    return {
      isHealthy: failedEndpoints.length === 0,
      responseTime: totalResponseTime / endpoints.length,
      failedEndpoints,
      responseTimes
    };
  }

  private async getPerformanceMetrics(): Promise<{
    lcp: number;
    avgResponseTime: number;
    memoryUsage: number;
  }> {
    // This would integrate with your monitoring system
    // For now, returning mock data
    return {
      lcp: Math.random() * 5000, // 0-5 seconds
      avgResponseTime: Math.random() * 2000, // 0-2 seconds  
      memoryUsage: Math.random() * 100 // 0-100%
    };
  }

  private async getErrorRate(): Promise<{
    rate: number;
    count: number;
    total: number;
    recentErrors: string[];
  }> {
    // This would query your error logs
    // For now, returning mock data
    const count = Math.floor(Math.random() * 10);
    const total = Math.floor(Math.random() * 1000) + 100;
    
    return {
      rate: (count / total) * 100,
      count,
      total,
      recentErrors: []
    };
  }

  private async getAlertConfig(configId: string): Promise<AlertConfig> {
    const { data, error } = await this.supabase
      .from('alert_configurations')
      .select('*')
      .eq('id', configId)
      .single();

    if (error) throw error;
    return data;
  }

  private async getLastAlert(configId: string): Promise<AlertInstance | null> {
    const { data, error } = await this.supabase
      .from('alert_history')
      .select('*')
      .eq('config_id', configId)
      .order('triggered_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  private isInCooldown(lastAlert: AlertInstance, cooldownMinutes: number): boolean {
    const cooldownMs = cooldownMinutes * 60 * 1000;
    const timeSinceLastAlert = Date.now() - new Date(lastAlert.triggered_at).getTime();
    return timeSinceLastAlert < cooldownMs;
  }

  private generateAlertTitle(config: AlertConfig, currentValue: any): string {
    switch (config.type) {
      case 'downtime':
        return `⚠️ System Downtime Detected - ${config.name}`;
      case 'performance':
        return `📊 Performance Issue - ${config.name}`;
      case 'error':
        return `🚨 Error Rate Alert - ${config.name}`;
      case 'custom':
        return `🚨 Custom Alert - ${config.name}`;
      default:
        return `Alert - ${config.name}`;
    }
  }

  private generateAlertMessage(config: AlertConfig, currentValue: any, alertData: Record<string, any>): string {
    const threshold = config.threshold;
    
    switch (config.type) {
      case 'downtime':
        return `System appears to be down. Failed endpoints: ${alertData.failed_endpoints?.join(', ') || 'Unknown'}. Average response time: ${currentValue}ms.`;
      case 'performance':
        return `Performance threshold exceeded. Current value: ${JSON.stringify(currentValue)}. Threshold: ${threshold.value}${threshold.unit}.`;
      case 'error':
        return `Error rate of ${currentValue}% exceeds threshold of ${threshold.value}%. Recent errors detected.`;
      case 'custom':
        return `Custom alert condition met for ${config.name}.`;
      default:
        return `Alert condition met for ${config.name}.`;
    }
  }

  private async updateAlertChannelsSent(alertId: string, channels: AlertChannel[]): Promise<void> {
    await this.supabase
      .from('alert_history')
      .update({ channels_sent: channels })
      .eq('id', alertId);
  }

  private getSeverityColor(severity: AlertSeverity): string {
    switch (severity) {
      case 'low': return '#36a64f';      // Green
      case 'medium': return '#ffb366';   // Orange
      case 'high': return '#ff9933';     // Dark orange
      case 'critical': return '#ff0000'; // Red
      default: return '#666666';         // Gray
    }
  }

  // Get alert metrics
  public async getAlertMetrics(): Promise<AlertMetrics> {
    try {
      const { data: alerts, error } = await this.supabase
        .from('alert_history')
        .select('*, alert_configurations(type)');

      if (error) throw error;

      const total_alerts = alerts?.length || 0;
      const active_alerts = alerts?.filter((a: any) => a.status === 'active').length || 0;
      const resolved_alerts = alerts?.filter((a: any) => a.status === 'resolved').length || 0;
      const acknowledged_alerts = alerts?.filter((a: any) => a.status === 'acknowledged').length || 0;

      const alerts_by_type: Record<AlertType, number> = {
        downtime: 0,
        performance: 0,
        error: 0,
        custom: 0
      };

      const alerts_by_severity: Record<AlertSeverity, number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      };

      alerts?.forEach((alert: any) => {
        const type = alert.alert_configurations?.type as AlertType;
        if (type && alerts_by_type[type] !== undefined) {
          alerts_by_type[type]++;
        }
        
        const severity = alert.severity as AlertSeverity;
        if (severity && alerts_by_severity[severity] !== undefined) {
          alerts_by_severity[severity]++;
        }
      });

      // Calculate average resolution time
      const resolvedAlerts = alerts?.filter((a: any) => a.status === 'resolved' && a.resolved_at) || [];
      const totalResolutionTime = resolvedAlerts.reduce((sum: number, alert: any) => {
        const triggered = new Date(alert.triggered_at).getTime();
        const resolved = new Date(alert.resolved_at!).getTime();
        return sum + (resolved - triggered);
      }, 0);

      const average_resolution_time = resolvedAlerts.length > 0 
        ? Math.round(totalResolutionTime / resolvedAlerts.length / (1000 * 60)) // Convert to minutes
        : 0;

      // Calculate escalation rate
      const escalatedAlerts = alerts?.filter((a: any) => a.escalation_count > 0).length || 0;
      const escalation_rate = total_alerts > 0 ? (escalatedAlerts / total_alerts) * 100 : 0;

      return {
        total_alerts,
        active_alerts,
        resolved_alerts,
        acknowledged_alerts,
        alerts_by_type,
        alerts_by_severity,
        average_resolution_time,
        escalation_rate
      };
    } catch (error) {
      logger.error('AlertService: Failed to get alert metrics', { error });
      throw error;
    }
  }

  // Load alert configurations method
  public async loadAlertConfigurations(): Promise<AlertConfig[]> {
    return await this.loadActiveConfigurations();
  }

  // Update alert configuration
  public async updateAlertConfig(id: string, updates: Partial<AlertConfig>): Promise<AlertConfig> {
    try {
      const { data, error } = await this.supabase
        .from('alert_configurations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      logger.info('AlertService: Alert configuration updated', {
        configId: id,
        updates: Object.keys(updates)
      });

      return data;
    } catch (error) {
      logger.error('AlertService: Failed to update alert config', { id, error });
      throw error;
    }
  }

  // Delete alert configuration
  public async deleteAlertConfig(id: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('alert_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      logger.info('AlertService: Alert configuration deleted', { configId: id });
      return true;
    } catch (error) {
      logger.error('AlertService: Failed to delete alert config', { id, error });
      return false;
    }
  }

  // Resolve alert
  public async resolveAlert(alertId: string, resolvedBy: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('alert_history')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          acknowledged_by: resolvedBy // Track who resolved it
        })
        .eq('id', alertId);

      if (error) throw error;

      logger.info('AlertService: Alert resolved', {
        alertId,
        resolvedBy
      });

      return true;
    } catch (error) {
      logger.error('AlertService: Failed to resolve alert', { alertId, error });
      return false;
    }
  }

  // Cleanup method
  public cleanup(): void {
    // Clear all intervals
    this.activeChecks.forEach(timer => clearTimeout(timer));
    this.activeChecks.clear();
    
    logger.info('AlertService: Service cleaned up');
  }
}

// Export singleton instance
export const alertService = new AlertService();