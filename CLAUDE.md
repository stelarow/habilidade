# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MCP Integration Guidelines

### Required MCP Usage
- **Context7**: Always use `mcp context7` for library documentation lookups
- **Sequential Thinking**: Always use `mcp sequential-thinking` for planning complex tasks
- **Supabase MCP**: Use for all database and Supabase-related operations

## Project Overview

This is a **dual-architecture educational platform** for Escola Habilidade with two distinct applications:

- **Main Website** (`/`) - React 19 + Vite marketing site with course catalog
- **Learning Platform** (`/plataforma-ensino/`) - Next.js 14 + TypeScript + Supabase LMS

## Common Development Commands

### Main Website (React/Vite)
```bash
# Development
npm run dev              # Start dev server (port 5173)
npm run build           # Production build
npm run build:optimize  # Build + optimization + bundle analysis
npm run preview         # Preview production build

# Testing & Quality
npm run lint            # ESLint with SonarJS + Unicorn plugins
npm run test:data       # Validate course data schema
npm run test:routes     # Test route configuration
npm run perf:audit      # Lighthouse performance audit

# Deployment
npm run deploy          # Build + commit + push (auto-deploy to Netlify)
```

### Learning Platform (Next.js/TypeScript)
```bash
cd plataforma-ensino
npm run dev             # Next.js dev server (port 3000)
npm run build          # Next.js production build  
npm run start          # Start production server
npm run lint           # ESLint + TypeScript checking
npm run test           # Jest tests
npm run test:watch     # Jest in watch mode
npm run test:e2e       # Playwright E2E tests
npm run analyze         # Bundle analyzer for optimization
npm run test:auth       # Test authentication flow
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
- **Sentry** for error tracking
- **PDF.js** for PDF rendering
- **Mux Player** for video playback

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

### Main Website
- **Live at**: **www.escolahabilidade.com.br** 
- **Platform**: Netlify - Auto-deploys on push to main branch
- **GitHub Pages Mirror**: https://stelarow.github.io/habilidade/
- **CI/CD**: GitHub Actions for automated deployment

### Learning Platform 
- **Recommended Platform**: Vercel (optimal for Next.js)
- **Subdomain**: `plataforma.escolahabilidade.com` (when deployed)
- **Alternative**: Netlify (for consistency with main site)
- **DNS**: Managed via HostGator
- **Deployment Guide**: See `/deploy.md` for detailed instructions

## Current Status

### Main Website
- **Status**: Production-ready with 8 detailed courses
- **Last Update**: Site updated with curso Design Gráfico corrigido - 2025-01-27 16:30
- **Features**: EmailJS contact form with WhatsApp fallback, responsive design, performance optimized

### Learning Platform  
- **Status**: MVP in advanced development
- **Completed**: 
  - Next.js 14.2.x + TypeScript + App Router structure
  - Complete database schema with RLS policies
  - Authentication system with middleware protection
  - Design system (Habilidade colors + Tailwind)
  - All UI components migrated (GradientButton, Starfield, etc.)
  - All 9 background components migrated to TypeScript
  - Sentry integration for error tracking
  - Auth pages (login, register, password recovery)
  - Lesson page redesign with modular components (90% complete)
- **In Progress**: Video player integration, dashboard enhancement
- **Testing**: Jest + Playwright configured, test pages available

## Important Development Notes

### Learning Platform Current Status (Mid-Development)
- **Lesson Page Redesign**: Advanced redesigned lesson interface with modular components
- **Key Components**: VideoSection, PDFSection, QuizSection, ExercisesSection, CompletionSection
- **Integration System**: LessonPageIntegration bridges existing data with new UI
- **Test Pages**: Multiple test pages for validation (`/test-lesson-redesigned`, `/test-completion-section`, etc.)
- **Performance Hooks**: useLessonProgress, useLessonPerformance for optimized lesson experience

### Path Aliases
- `@/*` maps to `./src/*` - Use for all internal imports
- Example: `import { Button } from '@/components/ui/button'`

### Current Implementation Focus
- **Page**: `/src/app/course/[slug]/lesson/[lessonSlug]/page-redesigned.tsx`
- **Integration**: `/src/components/lesson/LessonPageIntegration.tsx`
- **Core Components**: `/src/components/lesson/` directory with modular lesson sections
- **Utilities**: `/src/utils/lessonProgressUtils.ts` and `/src/utils/lessonTestUtils.ts`

### Environment Configuration
- **Supabase**: Database schema in `database/schema.sql` with complete RLS policies
- **Authentication**: Middleware-based auth with role-based redirects (`middleware.ts`)
- **Environment**: `.env.local` required for Supabase configuration
- **Error Tracking**: Sentry integration with client/server/edge configs
- **Admin Routes**: Protected by middleware, require admin role

### Middleware Configuration
The project uses Next.js middleware for:
- Admin route protection (`/admin/*`)
- Auth route blocking for authenticated users  
- Role-based redirects (admin → `/admin`, users → `/dashboard`)
- Located in `middleware.ts` at project root

### Development Best Practices
- Always update git main after completion for automatic Netlify deployment
- Use TypeScript strictly in learning platform - no `any` types
- Test lesson functionality using dedicated test pages
- Validate lesson progress calculations with utility functions
- Use performance hooks for optimized lesson loading

### Performance and Development Tips
- Increase NPM command timeout to 10 minutes
- Use `npm run build:optimize` for bundle analysis on main website
- Test lesson components individually before integration
- Monitor lesson performance metrics with useLessonPerformance hook

## Development Notes

### NPM Configuration
- Increase NPM command timeout to 10 minutes to prevent interruptions in complex builds and installations

### Manual Tasks
- **Build Process**: Always ask user to run `npm run build` manually instead of executing it yourself
- **Development Server**: Always ask user to run `npm run dev` manually instead of executing it yourself
- **Error Analysis**: Use Sentry MCP when analyzing errors

### Git Workflow
- Always update git main branch after completing development tasks
- Main website auto-deploys to Netlify on push to main branch

### Environment Requirements
- **Node.js**: 18+ required for both applications
- **NPM**: Command timeout set to 10 minutes
- **Local System**: sudo password is '123' if needed

## Contact Form Configuration (Main Website)

### EmailJS Setup
- **Service**: EmailJS for form submissions
- **Recipient**: alessandro.ferreira@escolahabilidade.com
- **Fallback**: WhatsApp (48) 98855-9491
- **Configuration**: Update keys in `src/components/ContactForm.jsx`:
  ```javascript
  const EMAIL_CONFIG = {
    SERVICE_ID: 'your_service_id',
    TEMPLATE_ID: 'your_template_id',
    PUBLIC_KEY: 'your_public_key'
  };
  ```

## Learning Platform Architecture Details

### Database (Supabase)
- **Schema**: Complete in `database/schema.sql`
- **Tables**: users, courses, lessons, enrollments, progress, categories, certificates
- **Features**: RLS policies, triggers, views, stored functions
- **Setup**: Create project → Run schema.sql → Configure .env.local

### Authentication Flow
- **Middleware**: Route protection in `middleware.ts`
- **Roles**: student (default), instructor, admin
- **Clients**: Server client for SSR, browser client for client-side
- **Protected Routes**: /admin/* requires admin role

### Design System (Shared Identity)
- **Colors**: Primary (#d400ff), Secondary (#00c4ff), Accent (#a000ff)
- **Fonts**: Montserrat (Google Fonts)
- **Components**: GradientButton (neon), Glass cards, Corner cuts
- **Animations**: 4s gradient flow, hover effects, starfield backgrounds
- **Responsive**: Mobile-first with reduced animations on lower-end devices

### Test Pages (Learning Platform)
- `/test-completion-section` - CompletionSection component testing
- `/test-lesson-redesigned` - Full redesigned lesson interface
- Features progress simulation, responsive design validation

## Additional Resources

- **Development Plan**: `/plataforma.md` - Complete roadmap and architecture
- **Deployment Guide**: `/deploy.md` - Vercel/Netlify deployment instructions
- **Environment Example**: `/plataforma-ensino/.env.example` - Required variables