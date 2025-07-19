import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Gauge, 
  Info,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { usePDFPerformance } from '../../hooks/usePDFPerformance';

interface PDFPerformanceDashboardProps {
  isVisible?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onClose?: () => void;
  compact?: boolean;
}

/**
 * Real-time performance monitoring dashboard for PDF components
 * Displays metrics, alerts, and recommendations for optimization
 */
export const PDFPerformanceDashboard: React.FC<PDFPerformanceDashboardProps> = ({
  isVisible = false,
  position = 'bottom-right',
  onClose,
  compact = false
}) => {
  const { metrics, alerts, generateReport } = usePDFPerformance();
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [historicalData, setHistoricalData] = useState<Array<typeof metrics>>([]);

  // Store historical data for trends
  useEffect(() => {
    if (metrics.loadTime > 0 || metrics.renderTime > 0) {
      setHistoricalData(prev => {
        const newData = [...prev, { ...metrics, timestamp: Date.now() }];
        // Keep last 20 data points
        return newData.slice(-20);
      });
    }
  }, [metrics]);

  if (!isVisible) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4', 
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const getPerformanceScore = () => {
    let score = 100;
    
    // Deduct for slow loading
    if (metrics.loadTime > 2000) score -= 20;
    if (metrics.loadTime > 5000) score -= 30;
    
    // Deduct for slow rendering
    if (metrics.renderTime > 500) score -= 15;
    if (metrics.renderTime > 1000) score -= 25;
    
    // Deduct for high memory usage
    if (metrics.memoryUsage > 100) score -= 20;
    if (metrics.memoryUsage > 200) score -= 40;
    
    // Deduct for blank space issues
    if (metrics.blankSpaceRatio > 0.1) score -= 25;
    if (metrics.blankSpaceRatio > 0.3) score -= 50;
    
    // Deduct for errors
    score -= metrics.errorCount * 10;
    
    return Math.max(0, Math.round(score));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricStatus = (value: number, threshold: number, invert = false) => {
    const isGood = invert ? value > threshold : value < threshold;
    return isGood ? 'good' : 'warning';
  };

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getTrend = (metric: string) => {
    if (historicalData.length < 2) return null;
    
    const recent = historicalData.slice(-3);
    const values = recent.map(d => d[metric as keyof typeof metrics] as number);
    const trend = values[values.length - 1] - values[0];
    
    return trend > 0 ? 'up' : trend < 0 ? 'down' : 'stable';
  };

  const renderMetricCard = (
    title: string, 
    value: string, 
    status: 'good' | 'warning' | 'error',
    icon: React.ReactNode,
    trend?: 'up' | 'down' | 'stable' | null
  ) => (
    <div className={`p-3 rounded-lg border ${
      status === 'good' ? 'bg-green-50 border-green-200' :
      status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
      'bg-red-50 border-red-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        {trend && (
          <div className={`text-xs ${
            trend === 'up' ? 'text-red-500' :
            trend === 'down' ? 'text-green-500' :
            'text-gray-500'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          </div>
        )}
      </div>
      <div className={`text-lg font-bold ${
        status === 'good' ? 'text-green-700' :
        status === 'warning' ? 'text-yellow-700' :
        'text-red-700'
      }`}>
        {value}
      </div>
    </div>
  );

  const score = getPerformanceScore();

  return (
    <div className={`fixed ${positionClasses[position]} z-50 font-mono`}>
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${
        isExpanded ? 'w-80' : 'w-64'
      } max-h-96 overflow-hidden`}>
        {/* Header */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-gray-800">PDF Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Gauge className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Close"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Performance Score */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Performance Score</span>
            <div className="flex items-center space-x-2">
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
              <span className="text-sm text-gray-500">/100</span>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                score >= 90 ? 'bg-green-500' :
                score >= 70 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="p-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Active Alerts</span>
            </div>
            <div className="space-y-1">
              {alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="text-xs text-red-700">
                  {alert.metric}: {alert.value.toFixed(1)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics */}
        {isExpanded && (
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
            {renderMetricCard(
              'Load Time',
              formatTime(metrics.loadTime),
              getMetricStatus(metrics.loadTime, 2000),
              <Clock className="w-4 h-4" />,
              getTrend('loadTime')
            )}
            
            {renderMetricCard(
              'Render Time',
              formatTime(metrics.renderTime),
              getMetricStatus(metrics.renderTime, 500),
              <Zap className="w-4 h-4" />,
              getTrend('renderTime')
            )}
            
            {renderMetricCard(
              'Memory Usage',
              formatBytes(metrics.memoryUsage * 1024 * 1024),
              getMetricStatus(metrics.memoryUsage, 100),
              <Database className="w-4 h-4" />,
              getTrend('memoryUsage')
            )}
            
            {renderMetricCard(
              'Blank Space',
              `${(metrics.blankSpaceRatio * 100).toFixed(1)}%`,
              getMetricStatus(metrics.blankSpaceRatio, 0.1),
              <Activity className="w-4 h-4" />
            )}

            {metrics.errorCount > 0 && renderMetricCard(
              'Errors',
              metrics.errorCount.toString(),
              'error',
              <AlertTriangle className="w-4 h-4" />
            )}
          </div>
        )}

        {/* Compact View */}
        {!isExpanded && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Load:</span>
                <span className={`ml-1 font-medium ${
                  metrics.loadTime < 2000 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatTime(metrics.loadTime)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Memory:</span>
                <span className={`ml-1 font-medium ${
                  metrics.memoryUsage < 100 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatBytes(metrics.memoryUsage * 1024 * 1024)}
                </span>
              </div>
            </div>
            
            {metrics.blankSpaceRatio > 0.1 && (
              <div className="mt-2 text-xs text-red-600 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Blank space detected: {(metrics.blankSpaceRatio * 100).toFixed(1)}%
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                const report = generateReport();
                console.log('PDF Performance Report:', report);
                // Could also download as JSON or send to analytics
              }}
              className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              Generate Report
            </button>
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  // Reset performance metrics
                  window.location.reload();
                }}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simplified performance indicator for production use
 */
export const PDFPerformanceIndicator: React.FC<{
  onToggleDashboard?: () => void;
}> = ({ onToggleDashboard }) => {
  const { metrics, alerts } = usePDFPerformance();
  const [isVisible, setIsVisible] = useState(false);

  // Only show in development or when there are performance issues
  useEffect(() => {
    const hasIssues = 
      metrics.loadTime > 3000 ||
      metrics.blankSpaceRatio > 0.2 ||
      metrics.errorCount > 0 ||
      alerts.length > 0;
    
    setIsVisible(process.env.NODE_ENV === 'development' || hasIssues);
  }, [metrics, alerts]);

  if (!isVisible) return null;

  const hasWarnings = 
    metrics.loadTime > 2000 ||
    metrics.blankSpaceRatio > 0.1 ||
    alerts.length > 0;

  return (
    <button
      onClick={onToggleDashboard}
      className={`fixed bottom-4 left-4 p-2 rounded-full shadow-lg border-2 transition-all duration-200 ${
        hasWarnings 
          ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' 
          : 'bg-green-100 border-green-300 hover:bg-green-200'
      }`}
      title="PDF Performance Monitor"
    >
      {hasWarnings ? (
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
      ) : (
        <CheckCircle className="w-4 h-4 text-green-600" />
      )}
    </button>
  );
};

/**
 * Hook for controlling the performance dashboard
 */
export const usePDFPerformanceDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<PDFPerformanceDashboardProps['position']>('bottom-right');

  const toggle = () => setIsVisible(!isVisible);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  return {
    isVisible,
    position,
    setPosition,
    toggle,
    show,
    hide
  };
};

export default PDFPerformanceDashboard;