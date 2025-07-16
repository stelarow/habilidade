# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **dual-architecture educational platform** for Escola Habilidade with two distinct applications:

- **Main Website** (`/`) - React 19 + Vite marketing site with course catalog
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Common Development Commands

### Main Website (React/Vite)
```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run build:optimize  # Build + optimization + bundle analysis
npm run preview         # Preview production build

# Testing & Quality
npm run lint            # ESLint with SonarJS + Unicorn plugins
npm run test:data       # Validate course data schema
npm run test:routes     # Test route configuration
npm run perf:audit      # Lighthouse performance audit

# Deployment
npm run deploy          # Build + commit + push (auto-deploy)
```

### Learning Platform (Next.js/TypeScript)
```bash
cd plataforma-ensino
npm run dev             # Next.js dev server
npm run build          # Next.js production build
npm run start          # Start production server
npm run lint           # ESLint + TypeScript checking
npm run test           # Jest tests (configured but not implemented)
npm run test:e2e       # Playwright E2E tests (configured)
```

## Architecture Patterns

### Main Website Structure
- **Performance-first**: Custom memory manager, lazy loading, manual code splitting
- **Components**: Organized by feature (`/components/course/`, `/components/backgrounds/`)
- **Hooks**: 15+ specialized hooks for complex state logic (`/hooks/`)
- **Utils**: Performance utilities (`memoryManager.js`, `domOptimizer.js`)
- **Data**: Static course catalog with runtime validation (`/data/coursesData.js`)

### Learning Platform Structure
- **Next.js App Router**: Full-stack application with server components
- **Database**: Supabase with complete schema in `database/schema.sql`
- **Auth**: Supabase Auth with middleware protection
- **Types**: Full TypeScript coverage with shared types in `/types/`
- **UI**: Design system components in `/components/ui/`

## Technology Stack

### Main Website
- **React 19** with Vite 7 build system
- **Tailwind CSS 4** for styling
- **React Router v6** for routing
- **EmailJS** for contact forms
- **Phosphor React** for icons
- **Manual optimization** for performance

### Learning Platform
- **Next.js 14.2.x** with App Router
- **TypeScript** for type safety
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Zustand** for state management
- **React Hook Form + Zod** for forms
- **Framer Motion** for animations
- **Radix UI + Headless UI** for components

## Performance Considerations

### Main Website
- Uses **custom memory manager** - always run `npm run build:optimize` to check bundle size
- **Lazy loading** implemented for all route components
- **Manual code splitting** with vendor, router, utils, backgrounds chunks
- **Performance monitoring** with adaptive animations based on device capabilities
- **Background animations** are performance-intensive - use `backgroundTester.js` for debugging

### Learning Platform
- Server components for optimal performance
- Database queries use Row Level Security (RLS)
- Image optimization through Next.js built-in features

## Database Schema

The learning platform uses Supabase with a complete schema in `database/schema.sql`:
- User profiles and authentication
- Course structure with lessons and progress tracking
- Quiz and assessment system
- File uploads and media management

To set up the database:
1. Create a Supabase project
2. Run the SQL in `database/schema.sql`
3. Configure environment variables in `.env.local`

## Development Workflows

### Main Website Development
- Test performance frequently with `npm run perf:audit`
- Use debug HTML files for manual testing (`debug-*.html`)
- Validate course data with `npm run test:data` before adding new courses
- Deploy automatically triggers on push to main branch

### Learning Platform Development
- Database changes require migration files
- Use TypeScript strictly - no `any` types
- Implement tests for new features (Jest + Playwright ready)
- Follow Next.js App Router conventions

## Key Files to Understand

### Main Website
- `src/data/coursesData.js` - Course catalog with validation schema
- `src/utils/memoryManager.js` - Performance optimization core
- `src/hooks/usePerformanceLevel.js` - Adaptive performance system
- `vite.config.js` - Build optimization configuration

### Learning Platform
- `database/schema.sql` - Complete database structure
- `lib/supabase/` - Database client configurations
- `middleware.ts` - Authentication and route protection
- `src/app/globals.css` - Design system definitions

## Course Data Management

New courses follow the schema in `src/data/coursesSchema.js`:
- Course backgrounds must be implemented in `src/components/backgrounds/`
- Icons defined in `src/utils/lessonIcons.js`
- Labels standardized in `src/utils/lessonLabels.js`
- Always validate with `npm run test:data` after changes

## Deployment

- **Main Website**: Live at **www.escolahabilidade.com.br** - Auto-deploys to Netlify on push to main
- **Learning Platform**: Manual deployment (production setup pending)
- Both use GitHub Actions for CI/CD

## Current Status

- **Main Website**: Production-ready with 8 detailed courses
- **Learning Platform**: MVP in development, database schema complete, UI components partially migrated

## Development Best Practices

- No final sempre atualize o git main para dar deploy automatico no netlify
- Sempre atualize o git main