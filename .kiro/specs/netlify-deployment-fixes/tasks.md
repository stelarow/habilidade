# Implementation Plan

- [x] 1. Fix API routes dynamic server usage errors




  - Add `export const dynamic = 'force-dynamic'` to admin API routes that use authentication
  - Modify session verification to handle static generation gracefully


  - Test that admin API routes no longer cause build failures


  - _Requirements: 1.1, 1.2, 1.3, 4.1, 4.2, 4.3_




- [ ] 2. Implement PDF.js server-side rendering compatibility
  - Create server-side compatibility layer for PDF.js components



  - Add dynamic imports with proper error boundaries for PDF components
  - Implement fallback components for when PDF.js fails to load in SSR
  - _Requirements: 2.1, 2.2, 2.3_




- [ ] 3. Configure Sentry for optional auth token usage
  - Modify next.config.mjs to make Sentry auth token optional during builds
  - Set hideSourceMaps to true to prevent source maps from being visible in production
  - Configure conditional source map upload based on auth token availability
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Update Next.js configuration for PDF.js compatibility
  - Add serverComponentsExternalPackages configuration for pdfjs-dist
  - Configure webpack to handle PDF.js worker files properly in server environment
  - Add proper alias configuration to prevent server-side bundling issues
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 5. Test and validate deployment fixes
  - Run local build to verify all pages generate successfully
  - Test that test-lesson page no longer causes DOMMatrix errors
  - Verify that admin API routes work correctly in production mode
  - Confirm Sentry integration works with and without auth token
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3_