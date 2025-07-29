/**
 * AlertService Tests
 * Task 1 Tests - FEATURE_001_SISTEMA_ALERTAS
 * Unit tests for AlertService core functionality
 */

import { AlertService, AlertConfig, alertService } from '../alertService';
import { logger } from '@/utils/logger';

// Mock Supabase
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }))
}));

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('AlertService', () => {
  let alertServiceInstance: AlertService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create new instance for each test to avoid singleton issues
    alertServiceInstance = new AlertService();
  });

  afterEach(() => {
    // Cleanup any timers
    alertServiceInstance.cleanup();
  });

  describe('Alert Configuration Management', () => {
    const mockAlertConfig: Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'> = {
      name: 'Test Alert',
      type: 'downtime',
      severity: 'high',
      threshold: {
        value: 5000,
        unit: 'ms',
        comparison: 'greater_than'
      },
      channels: ['email'],
      enabled: true,
      escalation: {
        enabled: false,
        timeout: 30,
        escalate_to: []
      },
      conditions: {
        duration: 5,
        cooldown: 15
      },
      metadata: {
        description: 'Test alert configuration'
      }
    };

    test('should create alert configuration', async () => {
      const mockResponse = {
        id: 'test-id',
        ...mockAlertConfig,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock Supabase response
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: mockResponse,
        error: null
      });

      const result = await alertServiceInstance.configAlertRules(mockAlertConfig);

      expect(result).toEqual(mockResponse);
      expect(logger.info).toHaveBeenCalledWith(
        'AlertService: Alert rule configured',
        expect.objectContaining({
          configId: 'test-id',
          name: 'Test Alert',
          type: 'downtime'
        })
      );
    });

    test('should handle configuration creation errors', async () => {
      const mockError = new Error('Database error');
      
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      await expect(alertServiceInstance.configAlertRules(mockAlertConfig))
        .rejects.toThrow('Database error');

      expect(logger.error).toHaveBeenCalledWith(
        'AlertService: Failed to configure alert rule',
        expect.objectContaining({ 
          config: mockAlertConfig,
          error: mockError 
        })
      );
    });

    test('should update alert configuration', async () => {
      const updates = { name: 'Updated Alert', enabled: false };
      const mockResponse = { id: 'test-id', ...updates };

      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: mockResponse,
        error: null
      });

      const result = await alertServiceInstance.updateAlertConfig('test-id', updates);

      expect(result).toEqual(mockResponse);
      expect(logger.info).toHaveBeenCalledWith(
        'AlertService: Alert configuration updated',
        expect.objectContaining({
          configId: 'test-id',
          updates: ['name', 'enabled']
        })
      );
    });

    test('should delete alert configuration', async () => {
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().delete().eq.mockResolvedValue({
        error: null
      });

      const result = await alertServiceInstance.deleteAlertConfig('test-id');

      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(
        'AlertService: Alert configuration deleted',
        { configId: 'test-id' }
      );
    });
  });

  describe('Alert History Management', () => {
    test('should get alert history with filters', async () => {
      const mockHistory = {
        instances: [
          {
            id: 'alert-1',
            title: 'Test Alert',
            severity: 'high',
            status: 'active',
            triggered_at: new Date().toISOString()
          }
        ],
        total_count: 1
      };

      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().select.mockReturnValue({
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockHistory.instances,
          error: null,
          count: mockHistory.total_count
        })
      });

      const result = await alertServiceInstance.getAlertHistory(
        { severity: 'high' }, 
        1, 
        20
      );

      expect(result.instances).toEqual(mockHistory.instances);
      expect(result.total_count).toBe(1);
      expect(result.page).toBe(1);
      expect(result.per_page).toBe(20);
    });

    test('should acknowledge alert', async () => {
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().update().eq.mockResolvedValue({
        error: null
      });

      const result = await alertServiceInstance.acknowledgeAlert('alert-1', 'admin');

      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(
        'AlertService: Alert acknowledged',
        {
          alertId: 'alert-1',
          acknowledgedBy: 'admin'
        }
      );
    });

    test('should resolve alert', async () => {
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().update().eq.mockResolvedValue({
        error: null
      });

      const result = await alertServiceInstance.resolveAlert('alert-1', 'admin');

      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(
        'AlertService: Alert resolved',
        {
          alertId: 'alert-1',
          resolvedBy: 'admin'
        }
      );
    });
  });

  describe('Alert Metrics', () => {
    test('should get alert metrics', async () => {
      const mockAlerts = [
        {
          id: 'alert-1',
          severity: 'high',
          status: 'active',
          escalation_count: 0,
          triggered_at: new Date().toISOString(),
          resolved_at: null,
          alert_configurations: { type: 'downtime' }
        },
        {
          id: 'alert-2',
          severity: 'low',
          status: 'resolved',
          escalation_count: 1,
          triggered_at: new Date(Date.now() - 3600000).toISOString(),
          resolved_at: new Date().toISOString(),
          alert_configurations: { type: 'performance' }
        }
      ];

      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().select.mockResolvedValue({
        data: mockAlerts,
        error: null
      });

      const metrics = await alertServiceInstance.getAlertMetrics();

      expect(metrics.total_alerts).toBe(2);
      expect(metrics.active_alerts).toBe(1);
      expect(metrics.resolved_alerts).toBe(1);
      expect(metrics.alerts_by_type.downtime).toBe(1);
      expect(metrics.alerts_by_type.performance).toBe(1);
      expect(metrics.escalation_rate).toBe(50); // 1 out of 2 alerts escalated
    });
  });

  describe('Alert Condition Evaluation', () => {
    test('should check alert conditions periodically', async () => {
      jest.useFakeTimers();
      
      const mockConfig: AlertConfig = {
        id: 'config-1',
        name: 'Test Downtime Alert',
        type: 'downtime',
        severity: 'critical',
        threshold: { value: 5, unit: 'minutes', comparison: 'greater_than' },
        channels: ['email'],
        enabled: true,
        escalation: { enabled: false, timeout: 30, escalate_to: [] },
        conditions: { duration: 5, cooldown: 15 },
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Mock loadActiveConfigurations to return our test config
      jest.spyOn(alertServiceInstance as any, 'loadActiveConfigurations')
        .mockResolvedValue([mockConfig]);

      // Mock evaluateAlertCondition
      const mockEvaluate = jest.spyOn(alertServiceInstance as any, 'evaluateAlertCondition')
        .mockResolvedValue(undefined);

      // Start monitoring to trigger periodic checks
      await alertServiceInstance.checkAlertConditions();

      expect(mockEvaluate).toHaveBeenCalledWith(mockConfig);

      jest.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors gracefully', async () => {
      const mockError = new Error('Connection failed');
      
      const mockSupabase = require('@/lib/supabase/client').createClient();
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: mockError
      });

      const result = await alertServiceInstance.loadAlertConfigurations();

      expect(result).toEqual([]);
      expect(logger.error).toHaveBeenCalledWith(
        'AlertService: Failed to load configurations',
        { error: mockError }
      );
    });

    test('should continue processing when individual alert fails', async () => {
      const mockConfigs = [
        { id: '1', name: 'Valid Config', type: 'downtime' },
        { id: '2', name: 'Invalid Config', type: 'performance' }
      ];

      jest.spyOn(alertServiceInstance as any, 'loadActiveConfigurations')
        .mockResolvedValue(mockConfigs);

      // Mock first evaluation to succeed, second to fail
      const mockEvaluate = jest.spyOn(alertServiceInstance as any, 'evaluateAlertCondition')
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Evaluation failed'));

      await alertServiceInstance.checkAlertConditions();

      expect(mockEvaluate).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(
        'AlertService: Error evaluating alert condition',
        expect.objectContaining({
          configId: '2',
          error: expect.any(Error)
        })
      );
    });
  });

  describe('Service Lifecycle', () => {
    test('should initialize and cleanup properly', () => {
      const service = new AlertService();
      
      // Should have initialized without errors
      expect(service).toBeInstanceOf(AlertService);

      // Should cleanup without errors
      expect(() => service.cleanup()).not.toThrow();
    });

    test('should handle singleton instance correctly', () => {
      // Test that the exported singleton works
      expect(alertService).toBeInstanceOf(AlertService);
      expect(alertService).toBe(alertService); // Same instance
    });
  });
});