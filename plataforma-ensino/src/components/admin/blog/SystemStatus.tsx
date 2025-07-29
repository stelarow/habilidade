'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  RefreshCw,
  TrendingUp,
  Server,
  Database,
  Shield,
  HardDrive
} from 'lucide-react';

import { healthChecker } from '@/utils/healthCheck';
import { uptimeMonitor } from '@/services/uptimeMonitor';

interface HealthStatus {
  results: Record<string, any>;
  overallHealth: {
    status: string;
    message: string;
  };
  timestamp: string;
}

interface SLAMetrics {
  uptime: number;
  total_checks: number;
  healthy_checks: number;
  downtime_incidents: number;
  avg_response_time: number;
  sla_compliant: boolean;
}

interface UptimeStatus {
  current_health: HealthStatus;
  sla_metrics: Record<string, SLAMetrics> | {};
  current_incident: any;
  recent_alerts: any[];
  uptime_target: number;
}

const SystemStatus: React.FC = () => {
  const [uptimeStatus, setUptimeStatus] = useState<UptimeStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load initial data and setup monitoring
  useEffect(() => {
    initializeMonitoring();
    
    return () => {
      // Cleanup monitoring
      healthChecker.stop();
      uptimeMonitor.stop();
    };
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const initializeMonitoring = async () => {
    try {
      // Start health monitoring services
      healthChecker.start();
      await uptimeMonitor.start();

      // Set up health check listener
      healthChecker.addListener(() => {
        refreshStatus();
      });

      // Initial status load
      await refreshStatus();
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      const status = uptimeMonitor.getCurrentUptimeStatus();
      setUptimeStatus(status);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to refresh status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'degraded':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName) {
      case 'supabase':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <Server className="h-4 w-4" />;
      case 'auth':
        return <Shield className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatResponseTime = (ms: number | null) => {
    if (ms === null) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          <span>Loading system status...</span>
        </CardContent>
      </Card>
    );
  }

  if (!uptimeStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load system status. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { current_health, sla_metrics, current_incident, recent_alerts, uptime_target } = uptimeStatus;

  return (
    <div className="space-y-6">
      {/* Header with Overall Status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon(current_health.overallHealth.status)}
              System Status
              <Badge className={getStatusColor(current_health.overallHealth.status)}>
                {current_health.overallHealth.status.toUpperCase()}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStatus}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {current_health.overallHealth.message}
          </p>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </CardHeader>
      </Card>

      {/* Current Incident Alert */}
      {current_incident && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-500" />
          <AlertDescription>
            <strong>Active Incident:</strong> System has been experiencing issues since{' '}
            {new Date(current_incident.start_time).toLocaleString()}
            <div className="mt-1 text-sm">
              Affected services: {current_incident.affected_services.map((s: any) => s.service).join(', ')}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="uptime">Uptime & SLA</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(current_health.results).map(([serviceName, serviceData]) => (
              <Card key={serviceName}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(serviceName)}
                      <h3 className="font-medium capitalize">{serviceName}</h3>
                    </div>
                    {getStatusIcon(serviceData.status)}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className={getStatusColor(serviceData.status)}>
                        {serviceData.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response:</span>
                      <span>{formatResponseTime(serviceData.responseTime)}</span>
                    </div>
                    {serviceData.error && (
                      <div className="text-red-600 text-xs mt-2">
                        {serviceData.error}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="uptime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(sla_metrics || {}).map(([window, metrics]) => {
              const slaMetrics = metrics as SLAMetrics;
              return (
              <Card key={window}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{window}</h3>
                    <TrendingUp className={`h-4 w-4 ${slaMetrics.sla_compliant ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        {formatUptime(slaMetrics.uptime)}
                      </span>
                      <Badge 
                        variant={slaMetrics.sla_compliant ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {slaMetrics.sla_compliant ? 'SLA OK' : 'SLA BREACH'}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Checks:</span>
                        <span>{slaMetrics.healthy_checks}/{slaMetrics.total_checks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Incidents:</span>
                        <span>{slaMetrics.downtime_incidents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response:</span>
                        <span>{formatResponseTime(slaMetrics.avg_response_time)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SLA Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Target Uptime:</span>
                <span className="font-bold">{formatUptime(uptime_target)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {recent_alerts.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="font-medium">No Recent Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  All systems are operating normally
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {recent_alerts.map((alert, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {alert.severity === 'critical' ? (
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">{alert.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={alert.severity === 'critical' ? "destructive" : "secondary"}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(current_health.results).map(([serviceName, serviceData]) => (
                    <div key={serviceName} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {getServiceIcon(serviceName)}
                        <span className="capitalize">{serviceName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {formatResponseTime(serviceData.responseTime)}
                        </span>
                        {serviceData.responseTime && serviceData.responseTime > 3000 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(sla_metrics || {}).map(([window, metrics]) => {
                    const slaMetrics = metrics as SLAMetrics;
                    return (
                    <div key={window} className="flex justify-between items-center">
                      <span className="capitalize">{window}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-sm ${slaMetrics.sla_compliant ? 'text-green-600' : 'text-red-600'}`}>
                          {formatUptime(slaMetrics.uptime)}
                        </span>
                        {slaMetrics.sla_compliant ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemStatus;