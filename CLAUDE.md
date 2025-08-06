# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dual-architecture educational platform for Escola Habilidade:

- **Main Website** (`/`) - React 19 + Vite marketing site with SSG (Static Site Generation)
  - Hosted on Netlify (NOT GitHub Pages)
  - URL: https://www.escolahabilidade.com
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Architecture

### Main Site (Marketing)
- **Framework**: React 19 + Vite with vite-react-ssg for static generation
- **Styling**: TailwindCSS v4
- **Email**: EmailJS for contact forms with WhatsApp fallback
- **Routing**: React Router DOM with SSG support
- **State**: React context for global state
- **Icons**: Phosphor React icons

### Learning Platform (LMS)
- **Framework**: Next.js 14 App Router + TypeScript
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: Supabase Auth
- **Styling**: TailwindCSS + Shadcn/ui components
- **Testing**: Jest + Playwright for E2E

## Development Commands

### Main Site (Root)
```bash
npm run dev                 # Development server
npm run build               # Production build with optimization
npm run build:production    # Clean production build
npm run preview             # Preview production build
npm run lint                # ESLint checks
npm run test                # Run all tests
npm run test:watch          # Watch mode for tests
npm run test:coverage       # Test coverage report
npm run test:blog           # Test blog features only
npm run clean               # Clean build artifacts
npm run fresh               # Clean install and build
```

### Learning Platform (`/plataforma-ensino/`)
```bash
npm run dev                 # Development server
npm run dev:fast            # Fast dev mode
npm run build               # Production build (requires 10+ min timeout)
npm run build:production    # Optimized production build
npm run start               # Production server
npm run lint                # Next.js linting
npm run lint:fix            # Auto-fix lint issues
npm run type-check          # TypeScript validation
npm run type-check:watch    # Watch mode for TypeScript
npm run test                # Run all tests
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
npm run test:e2e            # Playwright E2E tests
npm run test:phase1         # Phase 1 component tests
npm run analyze             # Bundle analysis
npm run clean:build         # Clean Next.js build
```

## Testing Guidelines

### Main Site
- Use `npm run test:blog` for blog-specific tests
- Test routes with `npm run test:routes`
- Coverage reports: `npm run test:coverage`

### Learning Platform
- **Unit Tests**: `npm run test:unit` for component logic
- **Integration**: `npm run test:integration` for API/DB
- **E2E**: `npm run test:e2e` for user flows
- **Accessibility**: `npm run test:accessibility`
- Run single test: `npm test -- path/to/test.spec.ts`

## Build & Deploy

### Main Site (Netlify)
- **Auto-deploy**: Pushes to main branch trigger Netlify builds
- **Build timeout**: Standard (no special requirements)
- **SSG**: Uses vite-react-ssg for static generation
- **Sitemap**: Auto-generated during build via `src/utils/sitemapGenerator.js`
  - ⚠️ **NEVER** edit `public/sitemap.xml` manually

### Learning Platform
- **Build timeout**: Requires minimum 10 minutes
- **Memory**: Uses `NODE_OPTIONS='--max-old-space-size=3072'`
- **Migrations**: Use `npm run migrate:blog` for blog data

## Database (Supabase)

### Best Practices
- Always use migrations for schema changes
- Follow RLS (Row Level Security) patterns
- Test with `test-supabase-connection.js`
- Check advisors after DDL changes

### Common Operations
```sql
-- Example migration format
CREATE TABLE IF NOT EXISTS public.table_name (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Always include RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;
```

## Code Style Guidelines

### TypeScript (Learning Platform)
- Strict mode enabled
- Use type imports: `import type { Type } from './types'`
- Prefer interfaces over types for objects
- Keep files under 500 lines

### React Components
- Functional components with hooks
- Use TypeScript for props validation
- Memoize expensive computations
- Follow existing component patterns

### Testing
- Write tests before implementation (TDD)
- Test file naming: `*.test.ts(x)` or `*.spec.ts(x)`
- Use `data-testid` for E2E selectors
- Mock external services appropriately

## Security & Performance

### Security
- Never hardcode secrets or credentials
- Use environment variables for configuration
- Follow OWASP security guidelines
- Implement proper input validation

### Performance
- Batch file operations when possible
- Use concurrent operations for performance
- Lazy load components when appropriate
- Optimize images with Next.js Image or Vite plugins

## MCP Integration

### Available Servers
- **Context7**: Library documentation lookups
- **Supabase MCP**: Database operations and migrations
- **Sequential Thinking**: Complex reasoning tasks
- **Structured Memory**: Persistent context storage
- **Serena**: Code analysis and refactoring
- **Playwright**: Browser automation and testing
- **Firecrawl**: Web scraping and search

## Workflows

### Common Development Tasks

#### Running a Single Test
```bash
# Main site
npm test -- src/tests/specific-test.test.js

# Learning platform
npm test -- src/__tests__/specific.test.tsx
jest --testNamePattern="test name pattern"
```

#### Debugging Failed Builds
```bash
# Check for TypeScript errors
npm run type-check

# Check for lint issues
npm run lint

# Clean and rebuild
npm run clean && npm run build
```

#### Local Development with Hot Reload
```bash
# Main site - Vite HMR
npm run dev  # http://localhost:5173

# Learning platform - Next.js Fast Refresh
cd plataforma-ensino && npm run dev  # http://localhost:3000
```

### Adding New Features
1. Check existing patterns in codebase
2. Write tests first (TDD approach)
3. Implement following existing conventions
4. Run lint and type-check before finishing
5. Update relevant documentation if needed

### Database Changes
1. Create migration in Supabase
2. Test locally first
3. Apply to development branch
4. Verify with advisors check
5. Merge to production when ready

### Blog Article Automation Agent Rules
- **CTA Policy**: Não escreva outro CTA além do CTA do final da página que é o card do curso, para que não fique CTAs duplicados. Vamos usar apenas o CTA do card do curso.
- **Content Structure**: Evitar CTAs no meio dos artigos
- **Duplication Prevention**: Remover qualquer CTA duplicado durante o processamento

## Important Notes

### Environment Configuration
- Use `.env.local` for local development
- Copy from `.env.example` for initial setup
- Never commit `.env` files to repository

### Git Workflow
- **NEVER** commit unless explicitly requested
- Maintain clean commit history
- Use descriptive commit messages
- Run tests before committing

### Common Pitfalls
- **Sitemap**: Auto-generated during build - do NOT edit manually
- **Build Timeout**: Learning platform needs 10+ minute timeout
- **Route Handling**: Site on Netlify (not GitHub Pages) - check `netlify.toml`
- **SSG Pages**: Main site uses vite-react-ssg for static generation

### Blog System
- **CTA Policy**: Use only the course card CTA at article end
- **No duplicate CTAs**: Avoid CTAs in article content
- **Image handling**: Check memory `troubleshooting-imagens-blog-historia-sketchup`

### Troubleshooting Memories
- **Blog Images**: `troubleshooting-imagens-blog-historia-sketchup`
- **SEO Status**: `seo-optimization-escolahabilidade`
- **Route Issues**: `troubleshooting-routing-spa-netlify`
- **Local SEO**: `seo-optimization-grande-florianopolis`
- Access with: `mcp__structured-memory__get_full_memory`

## Credentials

### System
- sudo password: `123`

## Learning Platform Login
- Username: alessandrobatisp@gmail.com
- Password: $Stelarow123

## Playwright Guidelines

### Best Practices
- Always wait 5-10 seconds after navigation for page load
- Use `browser_wait_for` with appropriate timeouts
- Handle image uploads carefully (max 8000px dimension)
- Use data-testid attributes for reliable selectors

### Common Commands
```javascript
await page.waitForTimeout(5000);  // Wait for dynamic content
await page.waitForSelector('[data-testid="element"]');
await page.screenshot({ fullPage: true });
```

## SEO Strategy & Implementation
- **SEO Master Plan**: Ver `SEO_IMPLEMENTATION_PLAN.md` - plano completo com dados reais DataForSEO, estratégia blog-first, sprints estruturados para IAs (não leia o arquivo agora, apenas guarde na memória que ele existe)

## Memórias de Context/Troubleshooting  
- **Problema de Imagens Blog**: Se imagens de artigos de blog não carregam, consulte a memória `troubleshooting-imagens-blog-historia-sketchup` para diagnóstico completo e soluções conhecidas
- **SEO Otimizações**: Para contexto completo sobre SEO implementado, consulte `seo-optimization-escolahabilidade` - inclui problemas resolvidos, configurações técnicas e próximos passos
- **Problema de Rotas SPA**: Para issues de navegação e URLs com ~and~, consulte `troubleshooting-routing-spa-netlify` - site hospedado no Netlify, não GitHub Pages
- **Comando para consultar**: Use `mcp__structured-memory__get_full_memory` com o memory_id relevante
- **Playwright MCP Image Upload Error**: Tenha cuidado com upload de imagens no Playwright MCP para evitar erro de dimensão máxima de 8000 pixels - API retorna erro 400 se a imagem for muito grande
- **NPM Build Timeout**: `npm run build` precisa de timeout de no minimo 10 minutos