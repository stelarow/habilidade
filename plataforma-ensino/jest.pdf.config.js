/** @type {import('jest').Config} */
const config = {
  displayName: 'PDF Components Tests',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/pdf-test-setup.ts'],
  testMatch: [
    '<rootDir>/src/components/lesson/__tests__/**/*.pdf.test.{ts,tsx}',
    '<rootDir>/src/components/lesson/__tests__/**/*.enhanced.test.{ts,tsx}'
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  collectCoverageFrom: [
    'src/components/lesson/PDFSection.tsx',
    'src/components/lesson/PDFErrorBoundary.tsx',
    'src/hooks/usePDFPerformance.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testTimeout: 10000, // 10 seconds for PDF loading tests
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-results/pdf-tests',
      filename: 'report.html',
      expand: true
    }]
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};

module.exports = config;