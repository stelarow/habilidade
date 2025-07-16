# Deployment & Operations

## Deployment Strategy

### Marketing Website
- **Platform**: GitHub Pages
- **URL**: https://stelarow.github.io/habilidade/
- **Process**: Automated via GitHub Actions
- **Build Command**: `npm run build:production`
- **Deploy Command**: `npm run deploy` (builds + commits + pushes)

### Learning Platform
- **Platform**: Netlify (configured)
- **Build Command**: `npm run build`
- **Environment**: Node.js 18+
- **Status**: Development phase (Session 3)

## Environment Configuration

### Marketing Website (.env.local)
```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Learning Platform (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Mux (Video Streaming)
MUX_TOKEN_ID=your_mux_token_id
MUX_TOKEN_SECRET=your_mux_token_secret

# Sentry (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Build & Performance

### Marketing Website Optimization
- **Bundle Analysis**: Available via bundlephobia.com
- **Code Splitting**: Manual chunks for vendor, router, utils, backgrounds
- **Asset Optimization**: Vite handles image optimization
- **Performance Audit**: Lighthouse integration (`npm run perf:test`)

### Learning Platform Optimization
- **Bundle Analyzer**: `npm run analyze` (when ANALYZE=true)
- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Webpack Config**: PDF.js compatibility, alias configuration
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, Referrer-Policy

## Monitoring & Quality

### Error Tracking
- **Sentry Integration**: Full error tracking and performance monitoring
- **Development**: Disabled to prevent header processing issues
- **Production**: Automatic Vercel monitors enabled

### Testing Strategy
- **Unit Tests**: Jest + Testing Library (configured)
- **E2E Tests**: Playwright (configured)
- **Auth Testing**: Custom auth redirect tests
- **Performance**: Lighthouse audits

## Scripts Reference

### Marketing Website
```bash
npm run dev              # Development server
npm run build           # Optimized production build
npm run build:production # Production build only
npm run deploy          # Build + deploy to GitHub Pages
npm run test:routes     # Test course route configuration
npm run perf:test       # Performance audit
npm run clean           # Clean build artifacts
npm run fresh           # Clean install + build
```

### Learning Platform
```bash
npm run dev             # Development server
npm run build           # Production build
npm run start           # Production server
npm run test            # Run Jest tests
npm run test:e2e        # Run Playwright E2E tests
npm run test:auth       # Test authentication redirects
npm run analyze         # Bundle analysis
```

## Security Considerations

### Marketing Website
- **EmailJS**: Client-side email sending with rate limiting
- **WhatsApp Fallback**: Automatic fallback for failed email sends
- **HTTPS**: Enforced via GitHub Pages

### Learning Platform
- **Authentication**: Supabase Auth with middleware protection
- **Database Security**: Row Level Security (RLS) policies
- **API Security**: Service role key for server-side operations
- **Content Security**: DOMPurify for user-generated content
- **Video Security**: Mux signed URLs for protected content

## Maintenance Tasks

### Regular Updates
- Monitor dependency updates (especially security patches)
- Update Node.js version as needed (currently 18+)
- Review and update ESLint rules
- Performance monitoring via Sentry dashboards

### Database Maintenance (Platform)
- Monitor Supabase usage and performance
- Review and optimize RLS policies
- Backup critical data regularly
- Monitor storage usage for video content