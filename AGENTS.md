# AGENTS.md - Escola Habilidade

## Build Commands

```bash
npm run dev              # Dev server with HMR
npm run build:production # SSG build (standard deploy)
npm run build:optimize   # Adds bundle analysis to build
npm run lint              # ESLint (SonarJS, Unicorn plugins)
npm run clean             # Remove dist/ and .vite cache
npm run functions:dev     # Netlify functions local dev
```

## SSG Build Pipeline

`scripts/build-ssg.js` → `scripts/transform-html-meta.js` → `scripts/inject-critical-css.js`

Timeout is 10 minutes. Check script logs if build hangs.

## SSG Rendering Issues

If components render as spinners during SSG (HTML ~9KB), add the library to `ssr.noExternal` in `vite.config.js`:

```js
ssr: {
  noExternal: [
    '@phosphor-icons/react',
    '@radix-ui/react-dialog',
    // ...existing entries...
    'class-variance-authority'
  ]
}
```

## Architecture

- **Routes**: `src/routes.jsx` (lazy loaded)
- **Course data**: `src/data/`
- **SEO pages**: `/cursos-florianopolis`, `/cursos-sao-jose`, `/cursos-palhoca`
- **Blog**: API with client-side caching
- **Contact**: EmailJS primary, WhatsApp fallback on failure

## Code Splitting (vite.config.js)

- `react-vendor`: React/ReactDOM
- `router`: React Router
- `external-services`: EmailJS
- `blog-data`: Blog posts JSON
- Heavy libs (html2canvas, jspdf, framer-motion) lazy-loaded on-demand

## Netlify

- Build: `npm install --include=dev && npm run build:production`
- Branch/staging deploys use `DEBUG_BUILD=true` for sourcemaps
- Domain redirects: escolahabilidade.com → www.escolahabilidade.com (301)
- Cache: HTML 1hr, assets 1yr immutable, images 1wk immutable

## Environment Variables

- `SERVICE_ID`, `TEMPLATE_ID`, `PUBLIC_KEY` (EmailJS)
- `DEBUG_BUILD` (controls minification/sourcemaps)

## Static Assets

Use **relative paths** for all static assets (required for Netlify).
