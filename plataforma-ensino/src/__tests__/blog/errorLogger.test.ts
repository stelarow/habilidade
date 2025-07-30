import { BlogErrorLogger, ErrorCategory, ErrorSeverity } from '@/lib/blog/errorLogger';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => Promise.resolve({ error: null })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        gte: jest.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }))
  }))
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase
}));

// Mock fetch for webhook alerts
global.fetch = jest.fn();

// Mock performance and navigator
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  getEntriesByType: jest.fn(() => []),
  memory: {
    usedJSHeapSize: 10000000,
    jsHeapSizeLimit: 100000000
  }
};

const mockNavigator = {
  userAgent: 'test-agent',
  language: 'pt-BR',
  platform: 'test-platform',
  cookieEnabled: true,
  onLine: true
};

Object.defineProperty(global, 'performance', { value: mockPerformance });
Object.defineProperty(global, 'navigator', { value: mockNavigator });

// Mock window
const mockWindow = {
  location: { href: 'http://test.com/blog' },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  innerWidth: 1920,
  innerHeight: 1080,
  devicePixelRatio: 1
};

Object.defineProperty(global, 'window', { value: mockWindow });

describe('BlogErrorLogger', () => {
  let logger: BlogErrorLogger;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = new BlogErrorLogger();
  });

  describe('Error Categorization', () => {
    it('should categorize network errors correctly', () => {
      const networkError = new Error('Network request failed');
      const category = logger.categorizeError(networkError);
      expect(category).toBe(ErrorCategory.NETWORK);
    });

    it('should categorize fetch errors correctly', () => {
      const fetchError = new Error('fetch timeout');
      const category = logger.categorizeError(fetchError);
      expect(category).toBe(ErrorCategory.NETWORK);
    });

    it('should categorize CORS errors correctly', () => {
      const corsError = new Error('CORS policy violation');
      const category = logger.categorizeError(corsError);
      expect(category).toBe(ErrorCategory.NETWORK);
    });

    it('should categorize component errors correctly', () => {
      const componentError = new Error('Component render failed');
      componentError.stack = 'Error: Component render failed\n    at React.Component';
      const category = logger.categorizeError(componentError);
      expect(category).toBe(ErrorCategory.COMPONENT);
    });

    it('should categorize hook errors correctly', () => {
      const hookError = new Error('Hook call failed');
      const category = logger.categorizeError(hookError);
      expect(category).toBe(ErrorCategory.COMPONENT);
    });

    it('should categorize data errors correctly', () => {
      const jsonError = new Error('JSON parse error');
      const category = logger.categorizeError(jsonError);
      expect(category).toBe(ErrorCategory.DATA);
    });

    it('should categorize undefined errors correctly', () => {
      const undefinedError = new Error('Cannot read property of undefined');
      const category = logger.categorizeError(undefinedError);
      expect(category).toBe(ErrorCategory.DATA);
    });

    it('should categorize render errors correctly', () => {
      const renderError = new Error('DOM element not found');
      const category = logger.categorizeError(renderError);
      expect(category).toBe(ErrorCategory.RENDER);
    });

    it('should categorize performance errors correctly', () => {
      const perfError = new Error('Memory usage too high');
      const category = logger.categorizeError(perfError);
      expect(category).toBe(ErrorCategory.PERFORMANCE);
    });

    it('should categorize security errors correctly', () => {
      const securityError = new Error('CSP violation detected');
      const category = logger.categorizeError(securityError);
      expect(category).toBe(ErrorCategory.SECURITY);
    });

    it('should default to runtime category for unknown errors', () => {
      const unknownError = new Error('Unknown error type');
      const category = logger.categorizeError(unknownError);
      expect(category).toBe(ErrorCategory.RUNTIME);
    });
  });

  describe('Severity Determination', () => {
    it('should assign critical severity to security errors', () => {
      const securityError = new Error('XSS detected');
      const category = ErrorCategory.SECURITY;
      const severity = logger['determineSeverity'](securityError, category);
      expect(severity).toBe(ErrorSeverity.CRITICAL);
    });

    it('should assign critical severity to fatal errors', () => {
      const fatalError = new Error('Fatal system error');
      const severity = logger['determineSeverity'](fatalError, ErrorCategory.RUNTIME);
      expect(severity).toBe(ErrorSeverity.CRITICAL);
    });

    it('should assign high severity to component errors', () => {
      const componentError = new Error('Component crash');
      const severity = logger['determineSeverity'](componentError, ErrorCategory.COMPONENT);
      expect(severity).toBe(ErrorSeverity.HIGH);
    });

    it('should assign high severity to render errors', () => {
      const renderError = new Error('Render failure');
      const severity = logger['determineSeverity'](renderError, ErrorCategory.RENDER);
      expect(severity).toBe(ErrorSeverity.HIGH);
    });

    it('should assign medium severity to network errors', () => {
      const networkError = new Error('Network timeout');
      const severity = logger['determineSeverity'](networkError, ErrorCategory.NETWORK);
      expect(severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should assign medium severity to data errors', () => {
      const dataError = new Error('Invalid data format');
      const severity = logger['determineSeverity'](dataError, ErrorCategory.DATA);
      expect(severity).toBe(ErrorSeverity.MEDIUM);
    });

    it('should assign low severity by default', () => {
      const minorError = new Error('Minor issue');
      const severity = logger['determineSeverity'](minorError, ErrorCategory.RUNTIME);
      expect(severity).toBe(ErrorSeverity.LOW);
    });
  });

  describe('Error Logging', () => {
    it('should log error to database', async () => {
      const error = new Error('Test error');
      const context = {
        pageType: 'test',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com'
      };

      await logger.logError(error, context);

      expect(mockSupabase.from).toHaveBeenCalledWith('blog_error_logs');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        expect.objectContaining({
          error_name: 'Error',
          error_message: 'Test error',
          category: expect.any(String),
          severity: expect.any(String),
          resolved: false
        })
      ]);
    });

    it('should include context information in log', async () => {
      const error = new Error('Context test');
      const context = {
        pageType: 'post',
        postId: 'test-post-123',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com/blog/post/123'
      };

      await logger.logError(error, context);

      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        expect.objectContaining({
          context: expect.objectContaining({
            pageType: 'post',
            postId: 'test-post-123'
          })
        })
      ]);
    });

    it('should include metadata in log', async () => {
      const error = new Error('Metadata test');
      const context = {
        pageType: 'test',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com'
      };

      await logger.logError(error, context);

      expect(mockSupabase.from().insert).toHaveBeenCalledWith([
        expect.objectContaining({
          metadata: expect.objectContaining({
            browser: expect.any(Object),
            viewport: expect.any(Object)
          })
        })
      ]);
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from = jest.fn(() => ({
        insert: jest.fn(() => Promise.resolve({ error: 'Database error' }))
      }));

      const error = new Error('Test error');
      const context = {
        pageType: 'test',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com'
      };

      // Should not throw even if database fails
      await expect(logger.logError(error, context)).resolves.not.toThrow();
    });
  });

  describe('Error Frequency Tracking', () => {
    it('should calculate error frequency correctly', async () => {
      // Mock database response with sample data
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ 
              data: [{ id: 1 }, { id: 2 }, { id: 3 }], 
              error: null 
            }))
          }))
        }))
      }));

      const frequency = await logger.getErrorFrequency(ErrorCategory.NETWORK, 60);
      expect(frequency).toBe(3);
    });

    it('should return 0 when no errors found', async () => {
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      }));

      const frequency = await logger.getErrorFrequency(ErrorCategory.COMPONENT, 30);
      expect(frequency).toBe(0);
    });

    it('should handle database errors when calculating frequency', async () => {
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => Promise.resolve({ data: null, error: 'Database error' }))
          }))
        }))
      }));

      const frequency = await logger.getErrorFrequency(ErrorCategory.RUNTIME, 15);
      expect(frequency).toBe(0);
    });
  });

  describe('Alert System', () => {
    it('should determine when to alert based on error severity', () => {
      const criticalError = new Error('Critical failure');
      const shouldAlert = logger.shouldAlert(criticalError);
      
      // Mock the categorizeError to return critical
      jest.spyOn(logger, 'categorizeError').mockReturnValue(ErrorCategory.SECURITY);
      
      expect(logger.shouldAlert(criticalError)).toBe(true);
    });

    it('should not alert for low severity errors', () => {
      const minorError = new Error('Minor warning');
      
      // Mock to return low severity
      jest.spyOn(logger, 'categorizeError').mockReturnValue(ErrorCategory.RUNTIME);
      jest.spyOn(logger as any, 'determineSeverity').mockReturnValue(ErrorSeverity.LOW);
      
      expect(logger.shouldAlert(minorError)).toBe(false);
    });

    it('should send webhook alerts when configured', async () => {
      // Mock process.env
      process.env.ERROR_ALERT_WEBHOOK = 'http://webhook.test.com';
      
      const alertData = {
        category: ErrorCategory.CRITICAL,
        frequency: 5,
        severity: ErrorSeverity.CRITICAL
      };

      await logger['sendWebhookAlert'](alertData);

      expect(fetch).toHaveBeenCalledWith(
        'http://webhook.test.com',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertData)
        })
      );
    });
  });

  describe('Performance Monitoring', () => {
    it('should collect performance metrics', () => {
      const metrics = logger['collectPerformanceMetrics']();
      expect(mockPerformance.getEntriesByType).toHaveBeenCalledWith('navigation');
    });

    it('should monitor memory usage', () => {
      // Should not throw when checking memory
      expect(() => logger['checkMemoryUsage']()).not.toThrow();
    });

    it('should log memory warnings when usage is high', async () => {
      // Mock high memory usage
      mockPerformance.memory = {
        usedJSHeapSize: 95000000,
        jsHeapSizeLimit: 100000000
      };

      const logSpy = jest.spyOn(logger, 'logError');
      
      logger['checkMemoryUsage']();

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'High memory usage detected'
        }),
        expect.any(Object)
      );
    });
  });

  describe('System Health', () => {
    it('should calculate system health metrics', async () => {
      // Mock database response
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          gte: jest.fn(() => Promise.resolve({
            data: [
              { severity: ErrorSeverity.CRITICAL },
              { severity: ErrorSeverity.HIGH },
              { severity: ErrorSeverity.MEDIUM }
            ],
            error: null
          }))
        }))
      }));

      const health = await logger.getSystemHealth();

      expect(health).toMatchObject({
        errorRate: expect.any(Number),
        criticalErrorsLast24h: expect.any(Number),
        averageResponseTime: expect.any(Number)
      });
    });

    it('should handle errors when getting system health', async () => {
      // Mock database error
      mockSupabase.from = jest.fn(() => {
        throw new Error('Database connection failed');
      });

      const health = await logger.getSystemHealth();

      expect(health).toMatchObject({
        errorRate: 0,
        criticalErrorsLast24h: 0,
        averageResponseTime: 0
      });
    });
  });

  describe('Browser Information Collection', () => {
    it('should collect browser information', () => {
      const browserInfo = logger['getBrowserInfo']();
      
      expect(browserInfo).toMatchObject({
        userAgent: 'test-agent',
        language: 'pt-BR',
        platform: 'test-platform',
        cookieEnabled: true,
        onLine: true
      });
    });

    it('should collect viewport information', () => {
      const viewportInfo = logger['getViewportInfo']();
      
      expect(viewportInfo).toMatchObject({
        width: 1920,
        height: 1080,
        devicePixelRatio: 1
      });
    });

    it('should handle missing window object', () => {
      // Temporarily remove window
      const originalWindow = global.window;
      delete (global as any).window;

      const browserInfo = logger['getBrowserInfo']();
      const viewportInfo = logger['getViewportInfo']();

      expect(browserInfo).toBeNull();
      expect(viewportInfo).toBeNull();

      // Restore window
      (global as any).window = originalWindow;
    });
  });

  describe('Privacy and Compliance', () => {
    it('should not collect sensitive user data', async () => {
      const error = new Error('Privacy test');
      const context = {
        pageType: 'test',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com/profile?user=123&token=secret'
      };

      await logger.logError(error, context);

      // Verify no sensitive data is logged
      const logCall = mockSupabase.from().insert.mock.calls[0][0][0];
      expect(JSON.stringify(logCall)).not.toContain('secret');
      expect(JSON.stringify(logCall)).not.toContain('password');
      expect(JSON.stringify(logCall)).not.toContain('token');
    });

    it('should anonymize user session data', async () => {
      const error = new Error('Session test');
      const context = {
        pageType: 'test',
        userId: 'user-123',
        userAgent: 'test-agent',
        timestamp: new Date(),
        url: 'http://test.com'
      };

      await logger.logError(error, context);

      // Session ID should be anonymized/hashed, not raw user ID
      const logCall = mockSupabase.from().insert.mock.calls[0][0][0];
      expect(logCall.session_id).toMatch(/^blog_session_/);
    });
  });
});