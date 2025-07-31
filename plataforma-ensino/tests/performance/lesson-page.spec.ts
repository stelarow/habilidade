import { test, expect, devices } from '@playwright/test';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  firstContentfulPaint: 3000, // 3 seconds
  domContentLoaded: 3000,     // 3 seconds  
  fullyLoaded: 5000,          // 5 seconds
  totalRequests: 200,         // Max requests
  totalSize: 3 * 1024 * 1024, // 3MB max
};

test.describe('Lesson Page Performance Tests', () => {
  const testUrl = 'https://plataformahabilidade.netlify.app/course/marketing-digital/lesson/introducao-marketing-digital';

  test('should load within performance thresholds on desktop', async ({ page }) => {
    // Enable performance monitoring
    await page.coverage.startJSCoverage();
    
    // Capture network activity
    const requests: any[] = [];
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType(),
      });
    });

    // Navigate and measure
    const navigationStart = Date.now();
    await page.goto(testUrl, { waitUntil: 'networkidle' });
    const navigationEnd = Date.now();

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const timing = window.performance.timing;
      const paint = window.performance.getEntriesByType('paint');
      const resources = window.performance.getEntriesByType('resource');
      
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        totalResources: resources.length,
        totalSize: resources.reduce((sum, r: any) => sum + (r.transferSize || 0), 0),
        largestResources: resources
          .sort((a: any, b: any) => (b.transferSize || 0) - (a.transferSize || 0))
          .slice(0, 10)
          .map((r: any) => ({
            name: r.name.split('/').pop()?.substring(0, 50) || r.name,
            size: r.transferSize || 0,
            duration: r.duration
          }))
      };
    });

    // Check for duplicate iframes
    const iframeCount = await page.locator('iframe').count();
    const canvaIframes = await page.locator('iframe[src*="canva.com"]').count();
    
    // Log results
    console.log('Performance Metrics:', {
      ...metrics,
      totalRequests: requests.length,
      iframeCount,
      canvaIframes,
      actualLoadTime: navigationEnd - navigationStart
    });

    // Assertions
    expect(metrics.firstContentfulPaint).toBeLessThan(PERFORMANCE_THRESHOLDS.firstContentfulPaint);
    expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded);
    expect(metrics.fullyLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.fullyLoaded);
    expect(requests.length).toBeLessThan(PERFORMANCE_THRESHOLDS.totalRequests);
    expect(metrics.totalSize).toBeLessThan(PERFORMANCE_THRESHOLDS.totalSize);
    
    // Check for duplicate Canva iframes (should only have 1)
    expect(canvaIframes).toBeLessThanOrEqual(1);
  });

  test('should load efficiently on mobile', async ({ browser }) => {
    // Create mobile context
    const context = await browser.newContext({
      ...devices['iPhone 12'],
      userAgent: devices['iPhone 12'].userAgent,
    });
    const page = await context.newPage();

    // Measure mobile performance
    const navigationStart = Date.now();
    await page.goto(testUrl, { waitUntil: 'networkidle' });
    const navigationEnd = Date.now();

    const metrics = await page.evaluate(() => {
      const timing = window.performance.timing;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
      };
    });

    console.log('Mobile Performance:', {
      actualLoadTime: navigationEnd - navigationStart,
      ...metrics
    });

    // Mobile thresholds are slightly more lenient
    expect(metrics.domContentLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.domContentLoaded * 1.5);
    expect(metrics.fullyLoaded).toBeLessThan(PERFORMANCE_THRESHOLDS.fullyLoaded * 1.5);

    await context.close();
  });

  test('should not have memory leaks', async ({ page }) => {
    await page.goto(testUrl);
    
    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Interact with the page
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });

    // Force garbage collection if available
    await page.evaluate(() => {
      if (global.gc) {
        global.gc();
      }
    });

    // Check memory after interactions
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Memory should not increase significantly (allow 10MB increase)
    const memoryIncrease = finalMemory - initialMemory;
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });

  test('should identify performance bottlenecks', async ({ page }) => {
    const slowResources: any[] = [];
    
    page.on('requestfinished', async request => {
      const timing = request.timing();
      if (timing && timing.responseEnd - timing.requestStart > 1000) {
        slowResources.push({
          url: request.url(),
          duration: timing.responseEnd - timing.requestStart,
          resourceType: request.resourceType()
        });
      }
    });

    await page.goto(testUrl, { waitUntil: 'networkidle' });

    // Check for blocking resources
    const blockingScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts
        .filter(script => !script.async && !script.defer)
        .map(script => script.src);
    });

    console.log('Performance Issues:', {
      slowResources: slowResources.slice(0, 5),
      blockingScripts
    });

    // No resources should take more than 3 seconds
    expect(slowResources.filter(r => r.duration > 3000)).toHaveLength(0);
  });
});