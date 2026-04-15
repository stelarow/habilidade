# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Escola Habilidade institutional website — a React 19 SSG (Static Site Generation) site for a Brazilian trade school in Santa Catarina. The site includes course pages, a blog, SEO landing pages for local cities, a contact form, and Netlify Functions backend. All content is in Brazilian Portuguese.

## Commands

```bash
npm run dev                # Dev server (vite-react-ssg dev, HMR)
npm run build:production   # Production SSG build (optimizes assets then runs vite-react-ssg)
npm run build              # Alias: build:optimize (SSG + bundle analysis)
npm run lint               # ESLint with SonarJS + Unicorn plugins
npm run preview            # Preview built site locally
npm run clean              # Remove dist/ and .vite cache
npm run functions:dev      # Netlify Functions local dev server
```

## Architecture

### SSG with vite-react-ssg

Entry point is `src/main.jsx` which calls `ViteReactSSG()` with routes from `src/routes.jsx`. At build time, `scripts/build-ssg.js` spawns `npx vite-react-ssg build`, then `scripts/transform-html-meta.js` and `scripts/inject-critical-css.js` run as post-processing. Build timeout is 10 minutes.

All routes use React Router's `lazy()` for code splitting. Blog post routes use `getStaticPaths` returning slugs from a hardcoded array in `routes.jsx`.

### Layout and Provider Stack

`Layout.jsx` wraps all pages: `ErrorBoundary` > `HelmetProvider` (@dr.pogodin/react-helmet) > `QueryProvider` (TanStack Query) > Header/Outlet/Footer. Non-critical effects (analytics, sticky WhatsApp) are deferred via `DeferredEffects` component using `requestIdleCallback`.

### Data Flow

- **Course data**: `src/data/coursesData.js` — structured objects validated against `src/data/coursesSchema.js`. Each course page in `src/pages/courses/` renders from this data.
- **Blog posts**: JSON files in `src/data/posts/`. Fetched via `src/services/blogAPI.js` / `staticBlogAPI.js` with client-side caching (`src/services/cacheService.js`).
- **Contact form**: EmailJS primary, WhatsApp fallback. Config in `src/utils/emailConfig.js`.

### SEO

Local SEO pages exist at `/cursos-florianopolis`, `/cursos-sao-jose`, `/cursos-palhoca`. Sitemap is auto-generated during build via `src/utils/sitemapGenerator.js`. Meta tags are managed with react-helmet and post-processed by `scripts/transform-html-meta.js`.

### Deployment

Hosted on Netlify. Build command in `netlify.toml`: `npm install --include=dev && npm run build:production`. Staging/branch deploys use `DEBUG_BUILD=true` which enables sourcemaps and disables minification. Domain redirects: `escolahabilidade.com` → `www.escolahabilidade.com`.

Netlify Functions live in `netlify/functions/` (contact-handler, error-monitoring, blog-analytics, health-check, dev-logger).

## SSR/SSG Gotchas

- If a component renders as a spinner in the SSG output (HTML ~9KB instead of full content), add the problematic library to `ssr.noExternal` in `vite.config.js`.
- Avoid `window`/`document` access at module level or during SSR render — guard with `typeof window !== 'undefined'` or use `useEffect`.
- The `QueryProvider` handles hydration mismatch by only rendering DevTools client-side.

## Code Splitting (vite.config.js)

Manual chunks: `react-vendor` (React/ReactDOM), `router` (React Router), `external-services` (EmailJS), `blog-data` (blog JSON). Heavy libs (html2canvas, jspdf, framer-motion) are excluded from pre-bundling and lazy-loaded on demand.

## Path Aliases

`@` maps to `src/` (configured in `vite.config.js` resolve.alias and `jsconfig.json`).

## Static Assets

Use **relative paths** for all static assets — required for Netlify deployment to work correctly.

## Environment Variables

- `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY` — EmailJS credentials
- `DEBUG_BUILD` — when `"true"`, enables sourcemaps, disables minification and console stripping
