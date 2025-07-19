import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock IntersectionObserver
(global as any).IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
(global as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock PerformanceObserver
(global as any).PerformanceObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock performance.memory for memory tracking tests
Object.defineProperty(window.performance, 'memory', {
  value: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024, // 100MB
    jsHeapSizeLimit: 200 * 1024 * 1024, // 200MB
  },
  configurable: true
});

// Mock requestAnimationFrame
(global as any).requestAnimationFrame = jest.fn((cb: () => void) => setTimeout(cb, 16));
(global as any).cancelAnimationFrame = jest.fn((id: number) => clearTimeout(id));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-blob-url');
global.URL.revokeObjectURL = jest.fn();

// Mock Fullscreen API
Object.defineProperty(document, 'fullscreenElement', {
  value: null,
  writable: true
});

Object.defineProperty(document, 'exitFullscreen', {
  value: jest.fn(() => Promise.resolve()),
  writable: true
});

Object.defineProperty(document.documentElement, 'requestFullscreen', {
  value: jest.fn(() => Promise.resolve()),
  writable: true
});

// Mock canvas context for PDF.js
(HTMLCanvasElement.prototype.getContext as any) = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 10 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Mock PDF.js worker
const mockPDFJS = {
  GlobalWorkerOptions: {
    workerSrc: 'mocked-worker.js'
  },
  getDocument: jest.fn().mockImplementation(() => ({
    promise: Promise.resolve({
      numPages: 3,
      getPage: jest.fn().mockImplementation((pageNum) => 
        Promise.resolve({
          pageNumber: pageNum,
          view: [0, 0, 612, 792], // Standard letter size
          getViewport: jest.fn().mockImplementation((args: any) => {
            const { scale = 1, rotation = 0 } = args || {};
            return {
            width: 612 * scale,
            height: 792 * scale,
            transform: [scale, 0, 0, scale, 0, 0],
            rotation
            };
          }),
          render: jest.fn().mockImplementation(() => ({
            promise: Promise.resolve(),
            cancel: jest.fn()
          })),
          getTextContent: jest.fn(() => Promise.resolve({
            items: [
              { str: 'Sample text', transform: [1, 0, 0, 1, 100, 100] }
            ]
          })),
          getAnnotations: jest.fn(() => Promise.resolve([]))
        })
      ),
      getMetadata: jest.fn(() => Promise.resolve({
        info: { Title: 'Test PDF' },
        metadata: null
      })),
      getOutline: jest.fn(() => Promise.resolve([
        {
          title: 'Chapter 1',
          dest: null,
          items: []
        }
      ]))
    })
  }))
};

// Global setup for PDF tests (only in test environment)
// Note: Jest globals are only available during test execution
export const setupPDFTestEnvironment = () => {
  // This function can be called from test files to set up the environment
  if (typeof jest !== 'undefined') {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset DOM
    if (typeof document !== 'undefined') {
      document.body.innerHTML = '';
    }
    
    // Reset viewport
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768
      });
      
      // Reset performance timing
      if (window.performance && typeof window.performance.mark === 'function') {
        try {
          window.performance.clearMarks();
          window.performance.clearMeasures();
        } catch (e) {
          // Ignore if not supported
        }
      }
    }
  }
};

// Global error handler for PDF-related errors
window.addEventListener('error', (event) => {
  if (event.error?.message?.includes('pdf') || 
      event.error?.message?.includes('canvas') ||
      event.error?.message?.includes('worker')) {
    console.warn('PDF Test Error (suppressed):', event.error);
    event.preventDefault();
  }
});

// Custom matchers for PDF testing (only available in test environment)
export const setupCustomMatchers = () => {
  try {
    if (typeof global !== 'undefined' && (global as any).expect) {
      const expect = (global as any).expect;
  expect.extend({
    toHaveProperPDFDimensions(received: any) {
      const element = received;
      const style = window.getComputedStyle(element);
      const width = parseFloat(style.width);
      const height = parseFloat(style.height);
      
      const aspectRatio = height / width;
      const expectedRatio = 792 / 612; // Standard letter size ratio
      const tolerance = 0.1;
      
      const pass = Math.abs(aspectRatio - expectedRatio) < tolerance;
      
      return {
        message: () => 
          pass
            ? `Expected element not to have proper PDF dimensions (ratio: ${aspectRatio.toFixed(2)})`
            : `Expected element to have proper PDF dimensions (ratio: ${aspectRatio.toFixed(2)}, expected: ${expectedRatio.toFixed(2)})`,
        pass,
      };
    },
    
    toHaveMinimalBlankSpace(received: any) {
      const container = received;
      const content = container.querySelector('[data-testid*="pdf-page"]');
      
      if (!content) {
        return {
          message: () => 'Could not find PDF content element',
          pass: false,
        };
      }
      
      const containerHeight = container.offsetHeight;
      const contentHeight = content.offsetHeight;
      const blankSpaceRatio = Math.abs(containerHeight - contentHeight) / contentHeight;
      
      const pass = blankSpaceRatio < 0.1; // Less than 10% blank space
      
      return {
        message: () => 
          pass
            ? `Expected element to have significant blank space (ratio: ${blankSpaceRatio.toFixed(2)})`
            : `Expected element to have minimal blank space (ratio: ${blankSpaceRatio.toFixed(2)}, threshold: 0.1)`,
        pass,
      };
    }
  });
    }
  } catch (e) {
    // Ignore if expect is not available
  }
};

// Type definitions for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveProperPDFDimensions(): R;
      toHaveMinimalBlankSpace(): R;
    }
  }
}

export {};