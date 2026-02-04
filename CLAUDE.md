# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

React-based educational website for Escola Habilidade (escolahabilidade.com) - marketing and course information.

**Stack**: React 19, Vite 7, TailwindCSS 4, React Router v6, vite-react-ssg, EmailJS, Netlify

## Development Commands

```bash
npm run dev              # Development server with HMR
npm run build:production # Production SSG build (standard)
npm run build:optimize   # Production build + critical CSS + bundle analysis
npm run preview          # Local preview of build
npm run lint             # ESLint (SonarJS, Unicorn plugins)
npm run clean            # Remove dist/ and .vite cache
npm run functions:dev    # Local Netlify functions development
```

### Asset Optimization
```bash
npm run optimize:projetista        # Optimize Projetista 3D course assets (Sharp)
npm run optimize:projetista:simple # Simple optimization variant
npm run analyze:bundle             # Bundle analysis
npm run inject:critical-css        # Critical CSS injection
```

## Build System

### SSG Pipeline
1. `scripts/build-ssg.js` - Main SSG build (10min timeout)
2. `scripts/transform-html-meta.js` - HTML meta tag transformation
3. `scripts/inject-critical-css.js` - Critical CSS injection
4. `src/utils/sitemapGenerator.js` - Auto-generates sitemap.xml (never edit manually)

Routes defined in `src/routes.jsx` with lazy loading. Blog posts statically generated from `blogSlugs` array.

### SSG Troubleshooting

**Components not rendering during SSG** (HTML ~9KB with only spinners):
- Add problematic libraries to `ssr.noExternal` in vite.config.js
- Already configured: `@phosphor-icons/react`, `@radix-ui/*`, `class-variance-authority`

### Code Splitting (vite.config.js)
- `react-vendor`: React/React-DOM core
- `router`: React Router
- `external-services`: EmailJS
- `blog-data`: Blog posts JSON
- Heavy libs (html2canvas, jspdf) lazy-loaded on-demand
- marked/highlight.js kept in main bundle (blog-critical)

## Key Patterns

### Data Flow
- Course data: `src/data/`
- Contact forms: EmailJS primary, WhatsApp fallback on failure
- Blog: API with client-side caching

### Routing
- Client-side SPA routing
- SSG for blog posts and course pages
- SEO local pages: `/cursos-florianopolis`, `/cursos-sao-jose`, `/cursos-palhoca`

## Deployment

### Netlify (netlify.toml)
- Build: `npm install --include=dev && npm run build:production`
- Domain: escolahabilidade.com redirects to www.escolahabilidade.com (301)
- Staging/branch deploys: `DEBUG_BUILD=true` for unminified builds with sourcemaps
- Cache: HTML 1hr, assets 1yr immutable, images 1wk immutable

### Environment Variables
- EmailJS: `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY`
- Build: `DEBUG_BUILD` controls minification/sourcemaps

## Common Issues

- **Static asset paths**: Use relative paths for Netlify
- **Build timeouts**: Check `scripts/build-ssg.js` logs
- **New Radix/icon components**: Add to `ssr.noExternal` in vite.config.js