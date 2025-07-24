# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MCP Integration Guidelines

### Optional MCP Usage
- **Context7**: Available for library documentation lookups
- **Supabase MCP**: Available for database and Supabase-related operations

## Project Overview

This is a **dual-architecture educational platform** for Escola Habilidade with two distinct applications:

- **Main Website** (`/`) - React 19 + Vite marketing site with course catalog
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Development Commands

### Main Website (React/Vite)
```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run build:optimize  # Build + optimization + bundle analysis (always use for performance monitoring)
npm run preview         # Preview production build

# Testing & Quality
npm run lint            # ESLint with SonarJS + Unicorn plugins
npm run test:data       # Validate course data schema
npm run test:routes     # Test route configuration
npm run perf:audit      # Lighthouse performance audit (run frequently)

# Deployment
npm run deploy          # Build + commit + push (auto-deploy to Netlify)
```

### Learning Platform (Next.js/TypeScript)
```bash
cd plataforma-ensino
npm run dev             # Next.js dev server
npm run build          # Next.js production build  
npm run start          # Start production server
npm run lint           # ESLint + TypeScript checking
npm run test           # Jest tests
npm run test:watch     # Jest in watch mode
npm run test:e2e       # Playwright E2E tests
npm run analyze         # Bundle analyzer for optimization
npm run test:auth       # Test authentication flow
```

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
- **TypeScript** for type safety (strict mode - no `any` types)
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **Zustand** for state management
- **React Hook Form + Zod** for forms
- **Framer Motion** for animations
- **Radix UI + Headless UI** for components
- **Sentry** for error tracking
- **PDF.js** for PDF rendering
- **Mux Player** for video playback

## Architecture & Key Files

### Main Website Structure
- **Performance-first**: Custom memory manager, lazy loading, manual code splitting
- **Components**: Organized by feature (`/components/course/`, `/components/backgrounds/`)
- **Hooks**: 15+ specialized hooks for complex state logic (`/hooks/`)
- **Utils**: Performance utilities (`memoryManager.js`, `domOptimizer.js`)
- **Data**: Static course catalog with runtime validation (`/data/coursesData.js`)
- **Key Files**:
  - `src/data/coursesData.js` - Course catalog with validation schema
  - `src/utils/memoryManager.js` - Performance optimization core
  - `src/hooks/usePerformanceLevel.js` - Adaptive performance system
  - `vite.config.js` - Build optimization configuration

### Learning Platform Structure
- **Next.js App Router**: Full-stack application with server components
- **Types**: Full TypeScript coverage with shared types in `/types/`
- **UI**: Design system components in `/components/ui/`
- **Path Aliases**: `@/*` maps to `./src/*` - Use for all internal imports
- **Key Files**:
  - `database/schema.sql` - Complete database structure with RLS policies
  - `lib/supabase/` - Database client configurations
  - `middleware.ts` - Authentication and route protection
  - `src/app/globals.css` - Design system definitions

## Database & Authentication

### Supabase Configuration
- **Complete Schema**: `database/schema.sql` includes:
  - User profiles and authentication
  - Course structure with lessons and progress tracking
  - Quiz and assessment system
  - File uploads and media management
  - Row Level Security (RLS) policies

### Authentication & Middleware
- **Middleware**: Located in `middleware.ts` at project root
- **Protection**: Admin route protection (`/admin/*`)
- **Roles**: student (default), instructor, admin
- **Redirects**: Admin → `/admin`, users → `/dashboard`
- **Auth Blocking**: Prevents authenticated users from accessing auth routes

### Setup Process
1. Create a Supabase project
2. Run the SQL in `database/schema.sql`
3. Configure environment variables in `.env.local`

## Environment & Requirements

### System Requirements
- **Node.js**: 18+ required for both applications
- **Local System**: sudo password is '123' if needed

### Environment Configuration
- **Required**: `.env.local` for Supabase configuration
- **Error Tracking**: Sentry integration with client/server/edge configs
- **Performance**: Server components for optimal performance
- **Database**: All queries use Row Level Security (RLS)

## Deployment

### Main Website
- **Live**: www.escolahabilidade.com.br
- **Platform**: Netlify with auto-deploy on push to main branch
- **CI/CD**: GitHub Actions for automated deployment

### Learning Platform
- **Status**: Manual deployment (production setup pending)
- **Planned**: Vercel or Netlify deployment
- **CI/CD**: GitHub Actions configured

## Current Development Status

### Main Website
- **Status**: Production-ready with 8 detailed courses
- **Features**: EmailJS contact form with WhatsApp fallback, responsive design, performance optimized

### Learning Platform (MVP in Advanced Development)
- **Completed Features**:
  - Next.js 14.2.x + TypeScript + App Router structure
  - Complete database schema with RLS policies
  - Authentication system with middleware protection
  - Design system (Habilidade colors + Tailwind)
  - All UI components migrated (GradientButton, Starfield, etc.)
  - All 9 background components migrated to TypeScript
  - Sentry integration for error tracking
  - Auth pages (login, register, password recovery)

- **Current Focus - Lesson Page Redesign**:
  - **Page**: `/src/app/course/[slug]/lesson/[lessonSlug]/page-redesigned.tsx`
  - **Integration**: `/src/components/lesson/LessonPageIntegration.tsx`
  - **Core Components**: VideoSection, PDFSection, QuizSection, ExercisesSection, CompletionSection
  - **Test Pages**: `/test-lesson-redesigned`, `/test-completion-section` for validation
  - **Performance**: useLessonProgress, useLessonPerformance hooks for optimized experience
  - **Utilities**: `/src/utils/lessonProgressUtils.ts` and `/src/utils/lessonTestUtils.ts`

## Development Best Practices

### Performance Considerations
- **Main Website**: 
  - Uses custom memory manager - always run `npm run build:optimize` for bundle analysis
  - Lazy loading implemented for all route components
  - Manual code splitting with vendor, router, utils, backgrounds chunks
  - Performance monitoring with adaptive animations based on device capabilities
  - Background animations are performance-intensive - use `backgroundTester.js` for debugging

- **Learning Platform**: 
  - Server components for optimal performance
  - Database queries use Row Level Security (RLS)
  - Image optimization through Next.js built-in features

### Development Workflows
- **Main Website**: Test performance frequently, use debug HTML files for manual testing
- **Learning Platform**: Database changes require migration files, implement tests for new features
- **Both**: Follow respective framework conventions (React/Vite vs Next.js App Router)

### Code Standards
- **TypeScript**: Use strictly in learning platform - no `any` types
- **Testing**: Jest + Playwright configured and ready
- **Performance**: Monitor lesson performance metrics with useLessonPerformance hook
- **Components**: Test lesson functionality using dedicated test pages before integration

## Course Data Management

New courses follow the schema in `src/data/coursesSchema.js`:
- Course backgrounds must be implemented in `src/components/backgrounds/`
- Icons defined in `src/utils/lessonIcons.js`
- Labels standardized in `src/utils/lessonLabels.js`
- Follow validation schema requirements

## Development Notes

### NPM Configuration
- Allow sufficient time for complex builds and installations

### Manual Tasks
- **Error Analysis**: Use Sentry MCP when analyzing errors

### Git Workflow
- Main website auto-deploys to Netlify on push to main branch

### Performance Tips
- Monitor build processes for completion
- Test lesson components individually before integration
- Validate lesson progress calculations with utility functions