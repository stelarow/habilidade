# Design Document

## Overview

This design addresses three critical deployment issues preventing successful Netlify builds:

1. **Dynamic Server Usage Error**: API routes using cookies during static generation
2. **PDF.js Server-Side Rendering Error**: DOMMatrix undefined in Node.js environment
3. **Sentry Configuration Issues**: Missing auth token blocking builds

The solution implements proper Next.js App Router patterns for static generation, server-side rendering compatibility, and production-ready error monitoring configuration.

## Architecture

### Problem Analysis

#### 1. Dynamic Server Usage
- **Root Cause**: API routes like `/api/admin/lessons/next-order` use `cookies()` and session verification during static generation
- **Error Pattern**: `Dynamic server usage: Route couldn't be rendered statically because it used cookies`
- **Impact**: Build fails during static page generation phase

#### 2. PDF.js SSR Incompatibility  
- **Root Cause**: PDF.js worker uses browser-specific APIs like `DOMMatrix` that don't exist in Node.js
- **Error Pattern**: `ReferenceError: DOMMatrix is not defined`
- **Impact**: `/test-lesson` page fails to pre-render

#### 3. Sentry Configuration
- **Root Cause**: Missing `SENTRY_AUTH_TOKEN` environment variable
- **Error Pattern**: Source maps upload fails but doesn't block build
- **Impact**: Degraded error monitoring in production

## Components and Interfaces

### 1. API Route Configuration

#### Dynamic Route Marking
```typescript
// For admin API routes that require authentication
export const dynamic = 'force-dynamic'

// Alternative: Use runtime configuration
export const runtime = 'nodejs'
```

#### Session Verification Optimization
```typescript
interface OptimizedSessionCheck {
  // Lightweight check for static generation
  isStaticGeneration: boolean
  // Deferred authentication for dynamic routes
  requireAuth: () => Promise<AuthResult>
}
```

### 2. PDF.js Server-Side Compatibility

#### Component Structure
```typescript
interface PDFViewerProps {
  pdf: PDFDocument
  onProgressUpdate: (progress: number) => void
  serverSideRendering?: boolean
}

interface PDFDocument {
  id: string
  title: string
  url: string
  filename: string
  size: number
  pageCount: number
  downloadable: boolean
}
```

#### SSR Compatibility Layer
```typescript
interface SSRCompatibilityLayer {
  // Browser API polyfills for server
  polyfills: {
    DOMMatrix?: typeof DOMMatrix
    OffscreenCanvas?: typeof OffscreenCanvas
  }
  // Dynamic import strategy
  loadPDFWorker: () => Promise<PDFWorker>
  // Fallback rendering
  renderFallback: () => ReactElement
}
```

### 3. Sentry Configuration Management

#### Environment-Aware Configuration
```typescript
interface SentryConfig {
  dsn: string
  environment: 'development' | 'production'
  authToken?: string
  hideSourceMaps: boolean
  uploadSourceMaps: boolean
}
```

## Data Models

### Build Configuration
```typescript
interface BuildConfig {
  // Next.js configuration
  nextConfig: {
    experimental: {
      serverComponentsExternalPackages: string[]
    }
    webpack: (config: WebpackConfig) => WebpackConfig
  }
  
  // Environment variables
  env: {
    SENTRY_AUTH_TOKEN?: string
    NEXT_PUBLIC_SENTRY_DSN: string
    NODE_ENV: 'development' | 'production'
  }
  
  // Route configurations
  routes: {
    [path: string]: {
      dynamic: 'force-dynamic' | 'force-static' | 'auto'
      runtime?: 'nodejs' | 'edge'
    }
  }
}
```

### Error Handling States
```typescript
interface ErrorState {
  type: 'build' | 'runtime' | 'ssr'
  code: string
  message: string
  stack?: string
  context: {
    route?: string
    component?: string
    phase: 'static-generation' | 'server-render' | 'client-hydration'
  }
}
```

## Error Handling

### 1. Build-Time Error Prevention

#### API Route Protection
- Mark admin routes as `dynamic = 'force-dynamic'`
- Implement conditional authentication for static generation
- Use proper Next.js runtime configurations

#### SSR Error Boundaries
- Wrap PDF components in error boundaries
- Implement graceful fallbacks for missing browser APIs
- Use dynamic imports with proper loading states

### 2. Runtime Error Recovery

#### PDF Loading Fallback
```typescript
const PDFViewerWithFallback = () => {
  const [hasError, setHasError] = useState(false)
  
  if (hasError) {
    return <PDFDownloadFallback />
  }
  
  return (
    <ErrorBoundary onError={() => setHasError(true)}>
      <PDFViewer />
    </ErrorBoundary>
  )
}
```

#### Session Verification Resilience
```typescript
const resilientSessionCheck = async () => {
  try {
    return await verifySession()
  } catch (error) {
    if (isStaticGeneration()) {
      return { authenticated: false, deferred: true }
    }
    throw error
  }
}
```

### 3. Monitoring and Debugging

#### Enhanced Error Reporting
- Structured error logging with context
- Build-time vs runtime error classification
- Performance impact tracking

## Testing Strategy

### 1. Build Testing
- **Static Generation Tests**: Verify all pages can be statically generated
- **API Route Tests**: Ensure proper dynamic/static configuration
- **Environment Tests**: Test with/without optional environment variables

### 2. SSR Compatibility Tests
- **Server Rendering**: Test PDF components in Node.js environment
- **Hydration**: Verify client-side functionality after SSR
- **Fallback Behavior**: Test error boundaries and fallback components

### 3. Integration Tests
- **Netlify Build Simulation**: Local build testing with production settings
- **Error Monitoring**: Verify Sentry integration works correctly
- **Performance**: Ensure fixes don't impact build or runtime performance

## Implementation Approach

### Phase 1: API Route Fixes
1. Identify all admin API routes using authentication
2. Add `export const dynamic = 'force-dynamic'` to affected routes
3. Implement conditional session verification for static generation
4. Test build process with admin routes

### Phase 2: PDF.js SSR Compatibility
1. Create server-side compatibility layer for PDF.js
2. Implement dynamic imports with proper error handling
3. Add fallback components for SSR scenarios
4. Test `/test-lesson` page generation

### Phase 3: Sentry Configuration
1. Make Sentry auth token optional in build process
2. Configure conditional source map upload
3. Set proper `hideSourceMaps` configuration
4. Test error monitoring functionality

### Phase 4: Validation and Optimization
1. Run complete build test suite
2. Verify deployment on Netlify
3. Monitor error rates and performance
4. Document configuration requirements

## Configuration Requirements

### Environment Variables
```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional (for error monitoring)
SENTRY_AUTH_TOKEN=your_sentry_auth_token
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# Build configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Next.js Configuration Updates
```javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent PDF.js from being bundled on server
      config.resolve.alias = {
        ...config.resolve.alias,
        'pdfjs-dist/build/pdf.worker.min.mjs': false
      }
    }
    return config
  }
}
```

### Netlify Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
```

## Success Criteria

1. **Build Success**: All pages generate successfully without errors
2. **Functionality Preservation**: All features work as expected after fixes
3. **Performance Maintenance**: No significant impact on build time or runtime performance
4. **Error Monitoring**: Sentry integration works correctly in production
5. **Maintainability**: Clear documentation and configuration for future deployments