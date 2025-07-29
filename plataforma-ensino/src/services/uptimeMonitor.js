/**
 * Uptime Monitor Service
 * Advanced uptime monitoring with historical data and SLA tracking
 */

import { healthChecker } from '@/utils/healthCheck';
import { createClient } from '@/lib/supabase/client';

// SLA Configuration
const SLA_CONFIG = {
  target_uptime: 99.5, // 99.5% uptime requirement
  measurement_windows: {
    hourly: 60 * 60 * 1000,      // 1 hour
    daily: 24 * 60 * 60 * 1000,  // 24 hours  
    weekly: 7 * 24 * 60 * 60 * 1000,   // 7 days
    monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  alert_thresholds: {
    critical: 3000,    // 3 seconds
    warning: 5000,     // 5 seconds
    downtime: 300000,  // 5 minutes of downtime
  }
};

export class UptimeMonitor {
  constructor() {
    this.supabase = createClient();
    this.isMonitoring = false;
    this.uptimeData = [];
    this.alerts = [];
    this.slaBreaches = [];
    this.currentIncident = null;
  }

  // Start uptime monitoring
  async start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('Uptime monitoring started');

    // Listen to health check results
    this.unsubscribeHealthCheck = healthChecker.addListener(
      this.handleHealthCheckResult.bind(this)
    );

    // Load historical data
    await this.loadHistoricalData();

    // Start periodic SLA calculations
    this.startSlaCalculations();
  }

  // Stop uptime monitoring
  stop() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    
    if (this.unsubscribeHealthCheck) {
      this.unsubscribeHealthCheck();
    }
    
    if (this.slaIntervalId) {
      clearInterval(this.slaIntervalId);
    }

    console.log('Uptime monitoring stopped');
  }

  // Handle health check results
  async handleHealthCheckResult(healthData) {
    const { results, overallHealth, timestamp } = healthData;
    
    // Store uptime data point
    const uptimePoint = {
      timestamp,
      overall_status: overallHealth.status,
      overall_message: overallHealth.message,
      services: results,
      response_times: this.extractResponseTimes(results),
      is_healthy: overallHealth.status === 'healthy'
    };

    this.uptimeData.push(uptimePoint);

    // Keep only recent data in memory (last 24 hours)
    const cutoff = Date.now() - SLA_CONFIG.measurement_windows.daily;
    this.uptimeData = this.uptimeData.filter(
      point => new Date(point.timestamp).getTime() > cutoff
    );

    // Persist to database
    await this.persistUptimeData(uptimePoint);

    // Check for incidents
    await this.checkForIncidents(uptimePoint);

    // Check SLA compliance
    this.checkSlaCompliance();
  }

  // Extract response times from health check results
  extractResponseTimes(results) {
    const responseTimes = {};
    Object.entries(results).forEach(([service, result]) => {
      responseTimes[service] = result.responseTime;
    });
    return responseTimes;
  }

  // Persist uptime data to database
  async persistUptimeData(uptimePoint) {
    try {
      const { error } = await this.supabase
        .from('uptime_monitoring')
        .insert({
          timestamp: uptimePoint.timestamp,
          overall_status: uptimePoint.overall_status,
          overall_message: uptimePoint.overall_message,
          services_data: uptimePoint.services,
          response_times: uptimePoint.response_times,
          is_healthy: uptimePoint.is_healthy
        });

      if (error) {
        console.error('Failed to persist uptime data:', error);
      }
    } catch (error) {
      console.error('Error persisting uptime data:', error);
    }
  }

  // Check for incidents (downtime > 5 minutes)
  async checkForIncidents(currentPoint) {
    const isDown = !currentPoint.is_healthy;
    const now = new Date(currentPoint.timestamp);

    if (isDown && !this.currentIncident) {
      // Start new incident
      this.currentIncident = {
        start_time: now,
        status: currentPoint.overall_status,
        affected_services: this.getAffectedServices(currentPoint.services),
        is_resolved: false
      };

      console.log('New incident detected:', this.currentIncident);
    } else if (!isDown && this.currentIncident) {
      // Resolve current incident
      const duration = now.getTime() - this.currentIncident.start_time.getTime();
      
      this.currentIncident.end_time = now;
      this.currentIncident.duration = duration;
      this.currentIncident.is_resolved = true;

      // Check if it exceeds alert threshold
      if (duration > SLA_CONFIG.alert_thresholds.downtime) {
        await this.createDowntimeAlert(this.currentIncident);
      }

      // Store incident
      await this.persistIncident(this.currentIncident);
      
      console.log('Incident resolved:', this.currentIncident);
      this.currentIncident = null;
    }
  }

  // Get affected services from health check results
  getAffectedServices(services) {
    return Object.entries(services)
      .filter(([_, result]) => result.status !== 'healthy')
      .map(([service, result]) => ({
        service,
        status: result.status,
        error: result.error
      }));
  }

  // Create downtime alert
  async createDowntimeAlert(incident) {
    const alert = {
      type: 'downtime',
      severity: incident.duration > SLA_CONFIG.alert_thresholds.downtime ? 'critical' : 'warning',
      title: 'Service Downtime Detected',
      message: `System was down for ${Math.round(incident.duration / 1000 / 60)} minutes`,
      incident_data: incident,
      timestamp: new Date().toISOString(),
      is_resolved: incident.is_resolved
    };

    this.alerts.push(alert);
    await this.persistAlert(alert);
    
    console.log('Downtime alert created:', alert);
  }

  // Persist incident to database
  async persistIncident(incident) {
    try {
      const { error } = await this.supabase
        .from('system_incidents')
        .insert({
          start_time: incident.start_time.toISOString(),
          end_time: incident.end_time?.toISOString(),
          duration: incident.duration,
          status: incident.status,
          affected_services: incident.affected_services,
          is_resolved: incident.is_resolved
        });

      if (error) {
        console.error('Failed to persist incident:', error);
      }
    } catch (error) {
      console.error('Error persisting incident:', error);
    }
  }

  // Persist alert to database
  async persistAlert(alert) {
    try {
      const { error } = await this.supabase
        .from('system_alerts')
        .insert({
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          message: alert.message,
          alert_data: alert.incident_data || alert,
          timestamp: alert.timestamp,
          is_resolved: alert.is_resolved
        });

      if (error) {
        console.error('Failed to persist alert:', error);
      }
    } catch (error) {
      console.error('Error persisting alert:', error);
    }
  }

  // Start periodic SLA calculations
  startSlaCalculations() {
    // Calculate SLA every 5 minutes
    this.slaIntervalId = setInterval(() => {
      this.calculateSlaMetrics();
    }, 5 * 60 * 1000);

    // Initial calculation
    this.calculateSlaMetrics();
  }

  // Calculate SLA metrics for different time windows
  calculateSlaMetrics() {
    const metrics = {};
    
    Object.entries(SLA_CONFIG.measurement_windows).forEach(([window, duration]) => {
      const windowMetrics = this.calculateWindowSla(duration);
      metrics[window] = windowMetrics;
      
      // Check for SLA breaches
      if (windowMetrics.uptime < SLA_CONFIG.target_uptime) {
        this.handleSlaBreached(window, windowMetrics);
      }
    });

    return metrics;
  }

  // Calculate SLA for specific time window
  calculateWindowSla(windowDuration) {
    const cutoff = Date.now() - windowDuration;
    const windowData = this.uptimeData.filter(
      point => new Date(point.timestamp).getTime() > cutoff
    );

    if (windowData.length === 0) {
      return {
        uptime: 100,
        total_checks: 0,
        healthy_checks: 0,
        downtime_incidents: 0,
        avg_response_time: 0
      };
    }

    const totalChecks = windowData.length;
    const healthyChecks = windowData.filter(point => point.is_healthy).length;
    const uptime = (healthyChecks / totalChecks) * 100;

    // Calculate average response times
    const responseTimes = windowData
      .flatMap(point => Object.values(point.response_times))
      .filter(time => time !== null);
    
    const avgResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Count downtime incidents
    const downtimeIncidents = this.countDowntimeIncidents(windowData);

    return {
      uptime: Number(uptime.toFixed(2)),
      total_checks: totalChecks,
      healthy_checks: healthyChecks,
      downtime_incidents: downtimeIncidents,
      avg_response_time: Math.round(avgResponseTime),
      sla_compliant: uptime >= SLA_CONFIG.target_uptime
    };
  }

  // Count downtime incidents in data window
  countDowntimeIncidents(windowData) {
    let incidents = 0;
    let inIncident = false;

    windowData.forEach(point => {
      if (!point.is_healthy && !inIncident) {
        incidents++;
        inIncident = true;
      } else if (point.is_healthy && inIncident) {
        inIncident = false;
      }
    });

    return incidents;
  }

  // Handle SLA breach
  async handleSlaBreached(window, metrics) {
    const breachKey = `${window}_${new Date().toDateString()}`;
    
    // Avoid duplicate breach alerts for the same window/day
    if (this.slaBreaches.includes(breachKey)) {
      return;
    }

    this.slaBreaches.push(breachKey);

    const alert = {
      type: 'sla_breach',
      severity: 'critical',
      title: `SLA Breach - ${window} window`,
      message: `Uptime dropped to ${metrics.uptime}% (target: ${SLA_CONFIG.target_uptime}%)`,
      window_metrics: metrics,
      timestamp: new Date().toISOString(),
      is_resolved: false
    };

    this.alerts.push(alert);
    await this.persistAlert(alert);
    
    console.log('SLA breach detected:', alert);
  }

  // Load historical uptime data
  async loadHistoricalData() {
    try {
      const { data, error } = await this.supabase
        .from('uptime_monitoring')
        .select('*')
        .gte('timestamp', new Date(Date.now() - SLA_CONFIG.measurement_windows.daily).toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Failed to load historical data:', error);
        return;
      }

      this.uptimeData = data.map(row => ({
        timestamp: row.timestamp,
        overall_status: row.overall_status,
        overall_message: row.overall_message,
        services: row.services_data,
        response_times: row.response_times,
        is_healthy: row.is_healthy
      }));

      console.log(`Loaded ${this.uptimeData.length} historical uptime data points`);
    } catch (error) {
      console.error('Error loading historical data:', error);
    }
  }

  // Get current uptime status
  getCurrentUptimeStatus() {
    const metrics = this.calculateSlaMetrics();
    const currentHealth = healthChecker.getCurrentHealth();
    
    return {
      current_health: currentHealth,
      sla_metrics: metrics,
      current_incident: this.currentIncident,
      recent_alerts: this.alerts.slice(-10), // Last 10 alerts
      uptime_target: SLA_CONFIG.target_uptime
    };
  }

  // Get uptime report for specific period
  async getUptimeReport(startDate, endDate) {
    try {
      const { data, error } = await this.supabase
        .from('uptime_monitoring')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) {
        throw new Error(`Failed to get uptime report: ${error.message}`);
      }

      // Calculate metrics for the period
      const totalChecks = data.length;
      const healthyChecks = data.filter(row => row.is_healthy).length;
      const uptime = totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 0;

      // Get incidents for the period
      const { data: incidents } = await this.supabase
        .from('system_incidents')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString())
        .order('start_time', { ascending: true });

      return {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        },
        metrics: {
          uptime: Number(uptime.toFixed(2)),
          total_checks: totalChecks,
          healthy_checks: healthyChecks,
          sla_compliant: uptime >= SLA_CONFIG.target_uptime
        },
        incidents: incidents || [],
        raw_data: data
      };
    } catch (error) {
      console.error('Error generating uptime report:', error);
      throw error;
    }
  }
}

// Singleton instance
export const uptimeMonitor = new UptimeMonitor();

export default uptimeMonitor;