# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a React-based educational website for marketing and course information (escolahabilidade.com).

### Core Technologies
- **Frontend**: React 19, Vite 7, TailwindCSS 4
- **Routing**: React Router v6 with SSG via `vite-react-ssg`
- **Styling**: TailwindCSS + PostCSS with custom design system
- **Email**: EmailJS integration for contact forms
- **Deployment**: Netlify

## Development Commands

### Main Site Development
```bash
# Development server with HMR
npm run dev

# Production build (includes asset optimization + critical CSS + bundle analysis)
npm run build:optimize

# Production build (standard SSG with simple image optimization)
npm run build:production

# Local preview of build
npm run preview

# Code quality
npm run lint

# Clean start (removes dist/ and .vite cache)
npm run clean && npm install && npm run build
```

### Asset Optimization Scripts
```bash
# Optimize Projetista 3D course assets (advanced)
npm run optimize:projetista

# Optimize Projetista 3D course assets (simple)
npm run optimize:projetista:simple

# Bundle analysis
npm run analyze:bundle

# Critical CSS injection
npm run inject:critical-css

# Performance audit (requires lighthouse)
npm run perf:audit
npm run perf:test  # Build, preview, then audit
```

### Netlify Functions
```bash
# Local development with functions
npm run functions:dev

# Test specific functions
npm run functions:invoke:health
npm run functions:invoke:contact
npm run functions:invoke:logger

# Debug functions
npm run functions:debug
```

## Build System Architecture

### SSG Configuration
- Uses `vite-react-ssg` for static site generation via `scripts/build-ssg.js`
- Routes defined in `src/routes.jsx` with React Router lazy loading
- Blog posts statically generated from `blogSlugs` array in routes.jsx
- Custom sitemap generation via Vite plugin (`sitemapGenerator.js`)
- Build process includes:
  1. SSG build (10min timeout)
  2. HTML meta tag transformation (`transform-html-meta.js`)
  3. Critical CSS injection (`inject-critical-css.js`)

### SSG Troubleshooting

**Known Issue**: Course pages not rendering during SSG
- **Symptom**: Generated HTML is ~9KB with only loading spinners
- **Solution**: Add problematic libraries to `ssr.noExternal` in vite.config.js
- **Example**: `@phosphor-icons/react`, `@radix-ui/*` components need SSR bundling

### Code Splitting Strategy
- **react-vendor**: React/React-DOM core (critical)
- **router**: React Router isolated chunk
- **external-services**: EmailJS integration
- **blog-data**: Blog posts JSON data unified
- Heavy libraries (html2canvas, jspdf) lazy-loaded on-demand
- Marked and highlight.js kept in main bundle (blog-critical)

### Asset Optimization
- Sharp-based image optimization for Projetista 3D course
- Terser minification with console.log removal in production
- ES2020+ target (Chrome 80+, Safari 13+)
- CSS code splitting enabled
- Critical CSS inlined in HTML head

## Key Architectural Patterns

### Component Structure
```
src/components/
├── backgrounds/     # Course-specific animated backgrounds
├── blog/           # Blog-specific components  
├── course/         # Course page components
├── header/         # Navigation components
├── shared/         # Reusable UI components
└── *.jsx          # Core page components
```

### Data Flow
- Course data centralized in `src/data/`
- Blog content served via API with caching
- Contact forms use dual system: EmailJS + WhatsApp fallback
- Image optimization handled by custom utils

### Routing Strategy
- SPA with client-side routing
- SSG for blog posts and course pages
- SEO-focused local pages (Florianópolis, São José, Palhoça)
- Netlify redirects for domain canonicalization

## Performance Considerations

### Bundle Optimization
- Manual chunk splitting for optimal caching
- Lazy loading for all route components
- Preconnect links for external resources
- Source maps disabled in production

### Caching Strategy
- Blog posts cached client-side
- Static assets with hash-based naming
- Service worker precaching (if enabled)

## Custom Modes Configuration

This repository uses `.roomodes` custom agent modes following the SPARC methodology:
- **🏗️ Architect**: System design and architecture
- **🧠 Auto-Coder**: Clean code implementation
- **🧪 Tester (TDD)**: Test-driven development
- **🪲 Debugger**: Troubleshooting and debugging
- **🛡️ Security Reviewer**: Security audits
- **📚 Documentation Writer**: Markdown documentation
- **🔗 System Integrator**: Integration and cohesion
- **📈 Deployment Monitor**: Post-deployment monitoring
- **🧹 Optimizer**: Refactoring and optimization
- **🚀 DevOps**: Infrastructure and deployment
- **🔐 Supabase Admin**: Database management
- **♾️ MCP Integration**: External service connections
- **⚡️ SPARC Orchestrator**: Workflow coordination

**General Rules**: Files should be <500 lines, never hardcode secrets, use env abstractions, modular design.

## Deployment & Environment

### Netlify Configuration
- Build command: `npm install --include=dev && npm run build:production`
- Domain redirects: escolahabilidade.com → www.escolahabilidade.com (301)
- SSG-friendly: Falls back to 404.html for non-existing pages
- Security headers: X-Frame-Options, X-XSS-Protection, X-Content-Type-Options
- Cache headers:
  - HTML: 1 hour (must-revalidate)
  - Assets: 1 year (immutable)
  - Images: 1 week (immutable)
- Staging/branch deploys use `DEBUG_BUILD=true` for unminified builds

### Environment Variables
- EmailJS configuration: `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`
- Build-time: `DEBUG_BUILD` controls minification and sourcemaps

## Development Guidelines

### Code Standards
- ESLint with SonarJS, Unicorn plugins
- React 19 patterns with hooks
- TailwindCSS utility-first approach
- Performance-first component design

### Git Workflow
- **NEVER commit without explicit user request**
- Always run tests before commits
- Build verification required for production

### Local Development Setup
```bash
# Clone and setup
git clone [repo-url]
npm install
npm run dev
```

## Integration Points

### MCP Servers Available
- **Serena**: Semantic code search and symbol manipulation
- **Ref**: Documentation search (programming languages, frameworks)
- **shadcn-ui-server**: UI component management
- **chrome-devtools**: Browser automation and testing
- **Supabase**: Database operations (permit-place-dashboard-v2 project)
- **sequential-thinking**: Complex problem-solving workflows
- **Playwright**: E2E testing
- **Google Search Console**: SEO analytics
- **Google Analytics**: Usage analytics

### External Services
- EmailJS: Contact form processing (alessandro.ferreira@escolahabilidade.com)
- Netlify: Hosting, deployment, and serverless functions
- Google Fonts: Typography (fonts.googleapis.com, fonts.gstatic.com)
- WhatsApp: Fallback contact method (48) 98855-9491

## Troubleshooting Resources

### Serena Memory References
Available memories (check with user if relevant):
- `build-testing-guidelines`
- `code_style_conventions`
- `project_overview`
- `task_completion_checklist`
- `troubleshooting-marked-js-toLowerCase-error-v3`

### Common Issues
- **Static asset paths**: Always use relative paths for Netlify deployment
- **Sitemap generation**: Auto-generated by Vite plugin, never edit manually
- **Email fallback**: WhatsApp integration activates on EmailJS failure
- **SSG rendering**: Check `ssr.noExternal` if components don't render
- **Build timeouts**: SSG has 10min timeout, check logs in `scripts/build-ssg.js`

### System Credentials
- sudo password: `123`
- Supabase project: `permit-place-dashboard-v2` (hgbfbvtujatvwpjgibng)