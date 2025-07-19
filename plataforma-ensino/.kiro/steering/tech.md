# Technology Stack

## Core Framework
- **Next.js 14.2.x** with App Router
- **TypeScript** with strict mode enabled
- **React 18** with Server Components and Client Components

## Backend & Database
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** - Database-level security policies
- **Supabase Auth** - Authentication and user management
- **Supabase Storage** - File storage for course materials

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **CSS Custom Properties** - Design token system for theming
- **Framer Motion** - Animations and transitions
- **Radix UI** - Headless UI components
- **Phosphor Icons** - Icon library

## Media & Content
- **Mux** - Professional video streaming and analytics
- **React Player** - Video player component
- **React PDF** - PDF document viewer
- **PDF.js** - PDF processing and rendering
- **TipTap** - Rich text editor

## State Management & Forms
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Monitoring & Quality
- **Sentry** - Error tracking and performance monitoring
- **Jest** - Unit testing framework
- **Playwright** - End-to-end testing
- **ESLint** - Code linting

## Build & Development Tools
- **Bundle Analyzer** - Bundle size analysis
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run Jest unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run Playwright E2E tests
npm run test:auth    # Run authentication tests
```

### Analysis & Debugging
```bash
npm run analyze      # Analyze bundle size
```

## Environment Requirements
- **Node.js**: >= 18.0.0
- **Package Manager**: npm (lockfile: package-lock.json)

## Key Configuration Files
- `next.config.mjs` - Next.js configuration with Sentry integration
- `tailwind.config.ts` - Tailwind CSS with custom design system
- `tsconfig.json` - TypeScript configuration with strict mode
- `playwright.config.ts` - E2E testing configuration
- `middleware.ts` - Authentication and route protection

## Development Patterns
- **Server Components** for data fetching and static content
- **Client Components** for interactive features
- **Custom Hooks** for reusable logic (useVideoProgress, useLessonCompletion, etc.)
- **Type-first Development** with comprehensive TypeScript interfaces
- **Component Composition** with Radix UI primitives