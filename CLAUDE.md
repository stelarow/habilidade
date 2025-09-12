# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a React-based educational website with two main components:
- **Main Site**: Vite + React 19 + SSG for marketing site (escolahabilidade.com)
- **LMS Platform**: Next.js 14 + Supabase in `/plataforma-ensino/` subdirectory

### Core Technologies
- **Frontend**: React 19, Vite 7, TailwindCSS 4
- **Routing**: React Router v6 with SSG via `vite-react-ssg`
- **Styling**: TailwindCSS + PostCSS with custom design system
- **Email**: EmailJS integration for contact forms
- **Database**: Supabase (for LMS platform)
- **Testing**: Jest + React Testing Library
- **Deployment**: Netlify (main site), separate LMS deployment

## Development Commands

### Main Site Development
```bash
# Development server with HMR
npm run dev

# Production build (includes asset optimization)
npm run build:optimize

# Production build (standard)
npm run build:production

# Local preview of build
npm run preview

# Code quality
npm run lint

# Clean start
npm run clean && npm install && npm run build
```

### Testing Commands
```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Blog-specific tests
npm run test:blog

# Course data validation
npm run test:data

# Route validation
npm run test:routes
```

### LMS Platform (plataforma-ensino/)
```bash
cd plataforma-ensino
npm run dev                 # Development server
npm run build:production    # Build (requires 10+ min timeout)
npm run test:e2e           # E2E tests
```

## Build System Architecture

### SSG Configuration
- Uses `vite-react-ssg` for static site generation
- Routes defined in `src/routes.jsx` with lazy loading
- Blog posts statically generated from `blogSlugs` array
- Custom sitemap generation via Vite plugin

#### SSG Course Pages Fix
**Issue**: `/cursos/informatica-nova` and `/cursos/projetista-3d` were not rendering content during SSG, generating only 9.4KB HTML files with loading spinners.

**Solution Applied**:
1. **vite.config.js**: Added `@phosphor-icons/react` to `ssr.noExternal`
   ```js
   ssr: {
     noExternal: ['phosphor-react', '@phosphor-icons/react']
   }
   ```
2. **src/routes.jsx**: Moved problematic pages from main Layout to CourseLayout
   ```js
   // Changed from lazy() inside Layout to CourseLayout + Suspense
   {
     path: '/cursos/informatica-nova',
     element: <CourseLayout />,
     children: [{
       index: true,
       element: <Suspense><InformaticaNova /></Suspense>
     }]
   }
   ```

**Results**: HTML files now properly render at 197KB+ with full SEO content instead of 9.4KB spinner-only files.

### Code Splitting Strategy
- **vendor**: React/React-DOM core
- **router**: React Router isolated chunk
- **utils**: Hooks and utilities
- **blog**: Blog-specific API and caching services
- **blog-components**: Blog UI components
- **backgrounds**: Lazy-loaded background components

### Asset Optimization
- Automatic image optimization
- Terser minification
- ES2020+ target with modern browser support
- CSS code splitting enabled

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

## Testing Architecture

### Test Organization
- Unit tests: `src/tests/**/*.test.js`
- Component tests: `src/**/__tests__/**/*.js`
- Blog-specific test suite
- Coverage thresholds: 80% across all metrics

### Critical Test Areas
- Blog post rendering and caching
- Course page data integrity
- Contact form EmailJS integration
- SEO metadata generation

## Deployment & Environment

### Netlify Configuration
- Build command includes dev dependencies installation
- Domain redirects (escolahabilidade.com → www.escolahabilidade.com)
- SPA fallback for client-side routing
- Security headers configured

### Environment Variables
- EmailJS configuration in production
- Supabase keys for LMS platform
- Build-time optimizations enabled

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

# For LMS development
cd plataforma-ensino
npm install
npm run dev
```

## Integration Points

### MCP Servers Available
- Context7: Library documentation
- Supabase: Database operations
- Structured Memory: Troubleshooting guides
- Playwright: E2E testing
- Firecrawl: Content scraping

### External Services
- EmailJS: Contact form processing
- Supabase: LMS data persistence
- Netlify: Hosting and deployment
- Google Fonts: Typography

## Troubleshooting Resources

### Structured Memory References
- `troubleshooting-imagens-blog-historia-sketchup`
- `seo-optimization-escolahabilidade`
- `troubleshooting-routing-spa-netlify`

### Common Issues
- Build timeouts: LMS platform needs 10+ minute build timeout
- Static asset paths: Always use relative paths for Netlify
- Sitemap generation: Auto-generated, never edit manually
- Email fallback: WhatsApp integration activates on EmailJS failure

### System Credentials
- sudo password: `123`
- LMS login: alessandrobatisp@gmail.com / $Stelarow123

## Notion Integration

### Task Management Database
- **URL**: https://www.notion.so/Lista-de-Tarefas-CC-242a2edfaa51802d94f0caa2bbf06bbe
- **Database ID**: 242a2edf-aa51-817b-8526-e98e76391bee
- **Trigger phrases**: "adicionar na minha lista", "adicionar na lista do notion"
- **Auto-creation command**:
```javascript
mcp__notion__notion-create-pages({
  parent: {"database_id": "242a2edf-aa51-817b-8526-e98e76391bee"},
  pages: [{
    "properties": {
      "Tarefa": "task description",
      "Status": "Não iniciadas",
      "Prioridade": "Alta"
    }
  }]
})
```