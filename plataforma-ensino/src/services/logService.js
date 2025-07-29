/**
 * Log Service
 * Handles log aggregation, analysis, and remote persistence
 */

import { createClient } from '@/lib/supabase/client';
import { logger } from '@/utils/logger';

// Log aggregation configuration
const LOG_SERVICE_CONFIG = {
  batchSize: 50,
  flushInterval: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000,
  enableAnalytics: true,
  enableAggregation: true,
  compressionThreshold: 1000
};

export class LogService {
  constructor() {
    this.supabase = createClient();
    this.logQueue = [];
    this.analyticsData = new Map();
    this.isProcessing = false;
    this.flushTimer = null;
    
    // Start the service
    this.start();
  }

  // Start log service
  start() {
    console.log('Log service started');
    
    // Listen to logger events
    logger.addListener(this.handleLogEntry.bind(this));
    
    // Start periodic flush
    this.startPeriodicFlush();
    
    // Setup analytics
    if (LOG_SERVICE_CONFIG.enableAnalytics) {
      this.setupAnalytics();
    }
  }

  // Handle incoming log entry
  handleLogEntry(logEntry) {
    // Add to queue for batch processing
    this.logQueue.push(logEntry);
    
    // Update analytics
    if (LOG_SERVICE_CONFIG.enableAnalytics) {
      this.updateAnalytics(logEntry);
    }
    
    // Flush if queue is full
    if (this.logQueue.length >= LOG_SERVICE_CONFIG.batchSize) {
      this.flushLogs();
    }
    
    // Handle critical logs immediately
    if (logEntry.level >= 4) { // CRITICAL level
      this.handleCriticalLog(logEntry);
    }
  }

  // Start periodic flush timer
  startPeriodicFlush() {
    this.flushTimer = setInterval(() => {
      if (this.logQueue.length > 0) {
        this.flushLogs();
      }
    }, LOG_SERVICE_CONFIG.flushInterval);
  }

  // Stop log service
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Flush remaining logs
    if (this.logQueue.length > 0) {
      this.flushLogs();
    }
    
    console.log('Log service stopped');
  }

  // Flush logs to remote storage
  async flushLogs() {
    if (this.isProcessing || this.logQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const logsToFlush = [...this.logQueue];
    this.logQueue = [];

    try {
      // Process logs in batches
      const batches = this.createBatches(logsToFlush);
      
      for (const batch of batches) {
        await this.persistLogBatch(batch);
      }
      
      console.log(`Flushed ${logsToFlush.length} logs to remote storage`);
    } catch (error) {
      console.error('Failed to flush logs:', error);
      
      // Re-queue logs for retry
      this.logQueue.unshift(...logsToFlush);
    } finally {
      this.isProcessing = false;
    }
  }

  // Create batches from logs
  createBatches(logs) {
    const batches = [];
    for (let i = 0; i < logs.length; i += LOG_SERVICE_CONFIG.batchSize) {
      batches.push(logs.slice(i, i + LOG_SERVICE_CONFIG.batchSize));
    }
    return batches;
  }

  // Persist log batch to Supabase
  async persistLogBatch(logBatch) {
    const formattedLogs = logBatch.map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      level: log.level,
      level_name: log.levelName,
      message: log.message,
      data: log.data,
      context: log.context,
      session_id: log.sessionId
    }));

    const { error } = await this.supabase
      .from('system_logs')
      .insert(formattedLogs);

    if (error) {
      throw new Error(`Failed to persist log batch: ${error.message}`);
    }
  }

  // Handle critical logs immediately
  async handleCriticalLog(logEntry) {
    try {
      // Send immediate alert
      await this.sendCriticalAlert(logEntry);
      
      // Store in high-priority table
      await this.supabase
        .from('critical_logs')
        .insert({
          id: logEntry.id,
          timestamp: logEntry.timestamp,
          message: logEntry.message,
          data: logEntry.data,
          context: logEntry.context,
          session_id: logEntry.sessionId,
          acknowledged: false
        });
        
      console.log('Critical log handled:', logEntry.message);
    } catch (error) {
      console.error('Failed to handle critical log:', error);
    }
  }

  // Send critical alert
  async sendCriticalAlert(logEntry) {
    // Send to alert service
    try {
      await fetch('/api/alerts/critical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'critical_log',
          severity: 'critical',
          title: 'Critical System Log',
          message: logEntry.message,
          log_data: logEntry,
          timestamp: logEntry.timestamp
        })
      });
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  // Setup analytics tracking
  setupAnalytics() {
    // Initialize analytics counters
    this.analyticsData.set('levels', new Map());
    this.analyticsData.set('types', new Map());
    this.analyticsData.set('hourly', new Map());
    this.analyticsData.set('errors', []);
    this.analyticsData.set('performance', []);
    
    // Periodic analytics flush
    setInterval(() => {
      this.flushAnalytics();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  // Update analytics data
  updateAnalytics(logEntry) {
    const levels = this.analyticsData.get('levels');
    const types = this.analyticsData.get('types');
    const hourly = this.analyticsData.get('hourly');
    
    // Update level counters
    const levelCount = levels.get(logEntry.levelName) || 0;
    levels.set(logEntry.levelName, levelCount + 1);
    
    // Update type counters
    if (logEntry.data.type) {
      const typeCount = types.get(logEntry.data.type) || 0;
      types.set(logEntry.data.type, typeCount + 1);
    }
    
    // Update hourly counters
    const hour = new Date(logEntry.timestamp).getHours();
    const hourlyCount = hourly.get(hour) || 0;
    hourly.set(hour, hourlyCount + 1);
    
    // Track errors
    if (logEntry.level >= 3) { // ERROR and CRITICAL
      const errors = this.analyticsData.get('errors');
      errors.push({
        timestamp: logEntry.timestamp,
        level: logEntry.levelName,
        message: logEntry.message,
        type: logEntry.data.type
      });
      
      // Keep only last 100 errors
      if (errors.length > 100) {
        errors.splice(0, errors.length - 100);
      }
    }
    
    // Track performance data
    if (logEntry.data.type === 'performance') {
      const performance = this.analyticsData.get('performance');
      performance.push({
        timestamp: logEntry.timestamp,
        label: logEntry.data.label,
        duration: logEntry.data.duration
      });
      
      // Keep only last 100 performance entries
      if (performance.length > 100) {
        performance.splice(0, performance.length - 100);
      }
    }
  }

  // Flush analytics data
  async flushAnalytics() {
    try {
      const analyticsSnapshot = {
        timestamp: new Date().toISOString(),
        levels: Object.fromEntries(this.analyticsData.get('levels')),
        types: Object.fromEntries(this.analyticsData.get('types')),
        hourly: Object.fromEntries(this.analyticsData.get('hourly')),
        error_count: this.analyticsData.get('errors').length,
        performance_samples: this.analyticsData.get('performance').length
      };
      
      await this.supabase
        .from('log_analytics')
        .insert(analyticsSnapshot);
        
      // Reset counters
      this.analyticsData.get('levels').clear();
      this.analyticsData.get('types').clear();
      this.analyticsData.get('hourly').clear();
      
      console.log('Analytics data flushed');
    } catch (error) {
      console.error('Failed to flush analytics:', error);
    }
  }

  // Search logs with advanced filtering
  async searchLogs(criteria = {}) {
    try {
      let query = this.supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false });

      // Apply filters
      if (criteria.level) {
        query = query.eq('level', criteria.level);
      }
      
      if (criteria.levelMin) {
        query = query.gte('level', criteria.levelMin);
      }
      
      if (criteria.message) {
        query = query.ilike('message', `%${criteria.message}%`);
      }
      
      if (criteria.type) {
        query = query.contains('data', { type: criteria.type });
      }
      
      if (criteria.sessionId) {
        query = query.eq('session_id', criteria.sessionId);
      }
      
      if (criteria.startDate) {
        query = query.gte('timestamp', criteria.startDate);
      }
      
      if (criteria.endDate) {
        query = query.lte('timestamp', criteria.endDate);
      }
      
      if (criteria.limit) {
        query = query.limit(criteria.limit);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Log search failed: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Log search error:', error);
      throw error;
    }
  }

  // Get log statistics
  async getLogStatistics(timeWindow = '24h') {
    try {
      const startDate = new Date();
      
      // Calculate start date based on time window
      switch (timeWindow) {
        case '1h':
          startDate.setHours(startDate.getHours() - 1);
          break;
        case '24h':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate.setDate(startDate.getDate() - 1);
      }

      // Get log counts by level
      const { data: levelStats, error: levelError } = await this.supabase
        .from('system_logs')
        .select('level_name, count(*)')
        .gte('timestamp', startDate.toISOString())
        .group('level_name');

      if (levelError) {
        throw new Error(`Failed to get level stats: ${levelError.message}`);
      }

      // Get error trends
      const { data: errorTrends, error: errorError } = await this.supabase
        .from('system_logs')
        .select('timestamp, level')
        .gte('timestamp', startDate.toISOString())
        .gte('level', 3) // ERROR and CRITICAL only
        .order('timestamp', { ascending: true });

      if (errorError) {
        throw new Error(`Failed to get error trends: ${errorError.message}`);
      }

      // Get top error messages
      const { data: topErrors, error: topErrorsError } = await this.supabase
        .from('system_logs')
        .select('message, count(*)')
        .gte('timestamp', startDate.toISOString())
        .gte('level', 3)
        .group('message')
        .order('count', { ascending: false })
        .limit(10);

      if (topErrorsError) {
        throw new Error(`Failed to get top errors: ${topErrorsError.message}`);
      }

      return {
        timeWindow,
        period: {
          start: startDate.toISOString(),
          end: new Date().toISOString()
        },
        levelStats: levelStats || [],
        errorTrends: errorTrends || [],
        topErrors: topErrors || [],
        currentAnalytics: {
          levels: Object.fromEntries(this.analyticsData.get('levels') || new Map()),
          types: Object.fromEntries(this.analyticsData.get('types') || new Map()),
          recentErrors: this.analyticsData.get('errors') || [],
          performanceData: this.analyticsData.get('performance') || []
        }
      };
    } catch (error) {
      console.error('Failed to get log statistics:', error);
      throw error;
    }
  }

  // Export logs to file
  async exportLogs(criteria = {}, format = 'json') {
    try {
      const logs = await this.searchLogs({
        ...criteria,
        limit: criteria.limit || 10000
      });

      const exportData = {
        exported_at: new Date().toISOString(),
        criteria,
        total_logs: logs.length,
        logs
      };

      let content;
      let filename;
      let mimeType;

      switch (format.toLowerCase()) {
        case 'csv':
          content = this.logsToCSV(logs);
          filename = `logs_export_${Date.now()}.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
        default:
          content = JSON.stringify(exportData, null, 2);
          filename = `logs_export_${Date.now()}.json`;
          mimeType = 'application/json';
          break;
      }

      return {
        content,
        filename,
        mimeType,
        size: content.length
      };
    } catch (error) {
      console.error('Log export failed:', error);
      throw error;
    }
  }

  // Convert logs to CSV format
  logsToCSV(logs) {
    if (logs.length === 0) return 'No logs found';

    const headers = ['timestamp', 'level_name', 'message', 'session_id', 'type', 'url'];
    const rows = logs.map(log => [
      log.timestamp,
      log.level_name,
      log.message.replace(/"/g, '""'), // Escape quotes
      log.session_id,
      log.data?.type || '',
      log.context?.url || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  }

  // Get current analytics snapshot
  getAnalyticsSnapshot() {
    return {
      levels: Object.fromEntries(this.analyticsData.get('levels') || new Map()),
      types: Object.fromEntries(this.analyticsData.get('types') || new Map()),
      hourly: Object.fromEntries(this.analyticsData.get('hourly') || new Map()),
      recentErrors: this.analyticsData.get('errors') || [],
      performanceData: this.analyticsData.get('performance') || [],
      queueSize: this.logQueue.length,
      isProcessing: this.isProcessing
    };
  }

  // Acknowledge critical log
  async acknowledgeCriticalLog(logId, userId) {
    try {
      const { error } = await this.supabase
        .from('critical_logs')
        .update({
          acknowledged: true,
          acknowledged_by: userId,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', logId);

      if (error) {
        throw new Error(`Failed to acknowledge critical log: ${error.message}`);
      }

      logger.info('Critical log acknowledged', {
        logId,
        userId,
        type: 'log_acknowledgment'
      });
    } catch (error) {
      console.error('Failed to acknowledge critical log:', error);
      throw error;
    }
  }
}

// Singleton instance
export const logService = new LogService();

export default logService;