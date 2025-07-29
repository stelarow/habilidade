/**
 * Health Check Utilities
 * Implements comprehensive health checking for all system components
 */

import { createClient } from '@/lib/supabase/client';

// Health check configuration
const HEALTH_CHECK_CONFIG = {
  timeout: 3000, // 3 seconds timeout
  interval: 5 * 60 * 1000, // 5 minutes interval
  retries: 3,
  services: {
    supabase: {
      name: 'Supabase Database',
      priority: 'critical',
      endpoint: 'database'
    },
    api: {
      name: 'Blog API',
      priority: 'critical',
      endpoint: '/api/blog/posts'
    },
    storage: {
      name: 'Supabase Storage',
      priority: 'high',
      endpoint: 'storage'
    },
    auth: {
      name: 'Authentication Service',
      priority: 'critical',
      endpoint: 'auth'
    }
  }
};

export class HealthChecker {
  constructor() {
    this.supabase = createClient();
    this.isRunning = false;
    this.healthStatus = new Map();
    this.listeners = new Set();
    this.history = [];
  }

  // Start continuous health monitoring
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.performHealthCheck();
    this.intervalId = setInterval(() => {
      this.performHealthCheck();
    }, HEALTH_CHECK_CONFIG.interval);
    
    console.log('Health monitoring started');
  }

  // Stop health monitoring
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Health monitoring stopped');
  }

  // Perform comprehensive health check
  async performHealthCheck() {
    const timestamp = new Date().toISOString();
    const results = {};

    console.log(`Performing health check at ${timestamp}`);

    // Check all services in parallel
    const checks = Object.entries(HEALTH_CHECK_CONFIG.services).map(
      async ([service, config]) => {
        try {
          const result = await this.checkService(service, config);
          results[service] = result;
          this.healthStatus.set(service, result);
        } catch (error) {
          const failedResult = {
            status: 'unhealthy',
            responseTime: null,
            error: error.message,
            timestamp,
            priority: config.priority
          };
          results[service] = failedResult;
          this.healthStatus.set(service, failedResult);
        }
      }
    );

    await Promise.all(checks);

    // Calculate overall system health
    const overallHealth = this.calculateOverallHealth(results);
    
    // Store in history
    this.history.push({
      timestamp,
      results,
      overallHealth
    });

    // Keep only last 1000 entries
    if (this.history.length > 1000) {
      this.history = this.history.slice(-1000);
    }

    // Notify listeners
    this.notifyListeners(results, overallHealth);

    return { results, overallHealth, timestamp };
  }

  // Check individual service health
  async checkService(serviceName, config) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (serviceName) {
        case 'supabase':
          result = await this.checkSupabaseHealth();
          break;
        case 'api':
          result = await this.checkApiHealth(config.endpoint);
          break;
        case 'storage':
          result = await this.checkStorageHealth();
          break;
        case 'auth':
          result = await this.checkAuthHealth();
          break;
        default:
          throw new Error(`Unknown service: ${serviceName}`);
      }

      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        responseTime,
        details: result,
        timestamp: new Date().toISOString(),
        priority: config.priority
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'unhealthy',
        responseTime,
        error: error.message,
        timestamp: new Date().toISOString(),
        priority: config.priority
      };
    }
  }

  // Check Supabase database health
  async checkSupabaseHealth() {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('count')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Supabase error: ${error.message}`);
    }

    return { 
      connected: true,
      query_executed: true 
    };
  }

  // Check Blog API health
  async checkApiHealth(endpoint) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_CONFIG.timeout);

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        status_code: response.status,
        response_headers: Object.fromEntries(response.headers.entries())
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Check Supabase Storage health
  async checkStorageHealth() {
    const { data, error } = await this.supabase.storage
      .from('blog-images')
      .list('', { limit: 1 });

    if (error) {
      throw new Error(`Storage error: ${error.message}`);
    }

    return {
      connected: true,
      bucket_accessible: true
    };
  }

  // Check Authentication service health
  async checkAuthHealth() {
    const { data: { session }, error } = await this.supabase.auth.getSession();

    if (error) {
      throw new Error(`Auth error: ${error.message}`);
    }

    return {
      service_available: true,
      session_valid: !!session
    };
  }

  // Calculate overall system health
  calculateOverallHealth(results) {
    const services = Object.values(results);
    const criticalServices = services.filter(s => s.priority === 'critical');
    const highServices = services.filter(s => s.priority === 'high');

    // Check critical services
    const criticalHealthy = criticalServices.every(s => s.status === 'healthy');
    const highHealthy = highServices.every(s => s.status === 'healthy');
    const allHealthy = services.every(s => s.status === 'healthy');

    if (!criticalHealthy) {
      return {
        status: 'critical',
        message: 'One or more critical services are down'
      };
    }

    if (!highHealthy) {
      return {
        status: 'degraded',
        message: 'Some high-priority services are experiencing issues'
      };
    }

    if (!allHealthy) {
      return {
        status: 'warning',
        message: 'Some services are experiencing minor issues'
      };
    }

    return {
      status: 'healthy',
      message: 'All systems operational'
    };
  }

  // Add health status listener
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of health status changes
  notifyListeners(results, overallHealth) {
    this.listeners.forEach(callback => {
      try {
        callback({ results, overallHealth, timestamp: new Date().toISOString() });
      } catch (error) {
        console.error('Health check listener error:', error);
      }
    });
  }

  // Get current health status
  getCurrentHealth() {
    const results = Object.fromEntries(this.healthStatus);
    const overallHealth = this.calculateOverallHealth(results);
    
    return {
      results,
      overallHealth,
      timestamp: new Date().toISOString()
    };
  }

  // Get health history
  getHealthHistory(limit = 100) {
    return this.history.slice(-limit);
  }

  // Get uptime statistics
  getUptimeStats(timeWindow = 24 * 60 * 60 * 1000) { // 24 hours default
    const cutoff = Date.now() - timeWindow;
    const relevantHistory = this.history.filter(
      h => new Date(h.timestamp).getTime() > cutoff
    );

    if (relevantHistory.length === 0) {
      return { uptime: 0, total: 0, healthy: 0 };
    }

    const total = relevantHistory.length;
    const healthy = relevantHistory.filter(
      h => h.overallHealth.status === 'healthy'
    ).length;

    return {
      uptime: (healthy / total) * 100,
      total,
      healthy,
      unhealthy: total - healthy
    };
  }
}

// Singleton instance
export const healthChecker = new HealthChecker();

// Auto-start in browser environment
if (typeof window !== 'undefined') {
  // Start health monitoring when the page loads
  window.addEventListener('load', () => {
    healthChecker.start();
  });

  // Stop health monitoring when the page unloads
  window.addEventListener('beforeunload', () => {
    healthChecker.stop();
  });
}

export default healthChecker;